/**
 * Propuesta a medida para un negocio: la arma Claude con el botón 📄 del bot de
 * Telegram (tabla `propuestas` de la base `ventas`) y n8n la sirve por webhook.
 * La página es /p/<slug>. Acá se valida y se limpia lo que llega: el JSON lo
 * escribe una IA, así que todo lo que no encaja se descarta.
 *
 * Nunca lleva precio (D-011): si algún texto trae una cifra con moneda, la
 * propuesta no se muestra.
 */

export type IdiomaPropuesta = "es" | "en";

export interface Hallazgo {
  titulo: string;
  detalle: string;
  captura: string | null;
}

export interface Propuesta {
  slug: string;
  idioma: IdiomaPropuesta;
  negocio: string;
  rubro: string | null;
  ciudad: string | null;
  pais: string | null;
  creado: string | null;
  titular: string;
  situacion: string;
  diagnostico: Hallazgo[];
  demo: { titulo: string | null; url: string; imagen: string | null };
  comoQuedaria: string[];
  porQuePropio: string[];
  siguientePaso: { texto: string; whatsapp: string | null; email: string | null };
  /** Datos de desarrollo: la página lo dice arriba. */
  ejemplo: boolean;
}

/** Igual que el webhook de n8n: minúsculas, números y guiones, hasta 60. */
const SLUG = /^[a-z0-9][a-z0-9-]{0,59}$/;

export function slugPropuestaValido(valor: unknown): valor is string {
  return typeof valor === "string" && SLUG.test(valor);
}

const texto = (valor: unknown, max = 1200): string | null => {
  if (typeof valor !== "string") return null;
  const limpio = valor.replace(/\r\n?/g, "\n").trim();
  return limpio ? limpio.slice(0, max) : null;
};

const lista = (valor: unknown, max: number, largo = 600): string[] =>
  Array.isArray(valor) ? valor.map((v) => texto(v, largo)).filter((v): v is string => Boolean(v)).slice(0, max) : [];

/** Solo https. Las imágenes también pueden ser del propio sitio (`/...`). */
function enlaceSeguro(valor: unknown, { local = false } = {}): string | null {
  const crudo = texto(valor, 600);
  if (!crudo) return null;
  if (local && /^\/(?!\/)[\w\-./]+$/.test(crudo)) return crudo;
  try {
    const url = new URL(crudo);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function whatsappSeguro(valor: unknown): string | null {
  const url = enlaceSeguro(valor);
  if (!url) return null;
  const host = new URL(url).hostname;
  return host === "wa.me" || host === "api.whatsapp.com" ? url : null;
}

function emailSeguro(valor: unknown): string | null {
  const crudo = texto(valor, 120);
  return crudo && /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(crudo) ? crudo : null;
}

/**
 * Una cifra pegada a una moneda («USD 500», «$ 1.200», «49 €», «30 dólares»,
 * «49/mes»). Las horas, los años y los «24 h» no cuentan.
 */
const PRECIO = [
  /(?:US\$|U\$S|USD|UYU|ARS|MXN|COP|CLP|PEN|EUR|€|£|\$)\s?\d/i,
  /\d[\d.,]*\s?(?:(?:USD|UYU|ARS|MXN|EUR|d[oó]lares|euros|pesos|dollars)\b|[€£])/i,
  /\d\s?\/\s?(?:mes|month|mo|año|year)\b/i,
];

export function tienePrecio(valor: string): boolean {
  return PRECIO.some((re) => re.test(valor));
}

function textos(p: Propuesta): string[] {
  return [
    p.titular,
    p.situacion,
    ...p.diagnostico.flatMap((h) => [h.titulo, h.detalle]),
    p.demo.titulo ?? "",
    ...p.comoQuedaria,
    ...p.porQuePropio,
    p.siguientePaso.texto,
  ];
}

/**
 * Convierte el JSON de n8n en una propuesta lista para mostrar, o null si
 * falta lo esencial (titular, situación, demo y siguiente paso) o si trae un
 * precio.
 */
export function normalizarPropuesta(crudo: unknown, { ejemplo = false } = {}): Propuesta | null {
  if (!crudo || typeof crudo !== "object" || Array.isArray(crudo)) return null;
  const d = crudo as Record<string, unknown>;
  const demo = (d.demo && typeof d.demo === "object" ? d.demo : {}) as Record<string, unknown>;
  const paso = (d.siguiente_paso && typeof d.siguiente_paso === "object" ? d.siguiente_paso : {}) as Record<string, unknown>;

  const slug = texto(d.slug, 60);
  const titular = texto(d.titular, 240);
  const situacion = texto(d.situacion, 900);
  const demoUrl = enlaceSeguro(demo.url);
  const pasoTexto = texto(paso.texto, 1400);
  if (!slug || !slugPropuestaValido(slug) || !titular || !situacion || !demoUrl || !pasoTexto) return null;

  const diagnostico = (Array.isArray(d.diagnostico) ? d.diagnostico : [])
    .map((h): Hallazgo | null => {
      if (!h || typeof h !== "object") return null;
      const { titulo, detalle, captura } = h as Record<string, unknown>;
      const t = texto(titulo, 160);
      const det = texto(detalle, 900);
      return t && det ? { titulo: t, detalle: det, captura: enlaceSeguro(captura, { local: true }) } : null;
    })
    .filter((h): h is Hallazgo => h !== null)
    .slice(0, 3);

  const propuesta: Propuesta = {
    slug,
    idioma: d.idioma === "en" ? "en" : "es",
    negocio: texto(d.negocio, 80) ?? titular.split(":")[0].slice(0, 80),
    rubro: texto(d.rubro, 80),
    ciudad: texto(d.ciudad, 80),
    pais: texto(d.pais, 80),
    creado: texto(d.creado, 40),
    titular,
    situacion,
    diagnostico,
    demo: { titulo: texto(demo.titulo, 200), url: demoUrl, imagen: enlaceSeguro(demo.imagen, { local: true }) },
    comoQuedaria: lista(d.como_quedaria, 6),
    porQuePropio: lista(d.por_que_propio, 6, 400),
    siguientePaso: { texto: pasoTexto, whatsapp: whatsappSeguro(paso.whatsapp), email: emailSeguro(paso.email) },
    ejemplo,
  };

  if (textos(propuesta).some(tienePrecio)) return null;
  return propuesta;
}

/** El mensaje de WhatsApp ya dice de qué propuesta viene. */
export function enlaceWhatsAppPropuesta(base: string, p: Pick<Propuesta, "negocio" | "idioma">): string {
  const url = new URL(base);
  if (!url.searchParams.has("text")) {
    url.searchParams.set(
      "text",
      p.idioma === "en"
        ? `Hi Mario, I read the proposal for ${p.negocio}. Let's talk.`
        : `Hola Mario, vi la propuesta para ${p.negocio}. Lo hablamos.`,
    );
  }
  return url.toString();
}

export function enlaceEmailPropuesta(email: string, p: Pick<Propuesta, "negocio" | "idioma">): string {
  const asunto = p.idioma === "en" ? `Proposal for ${p.negocio}` : `Propuesta para ${p.negocio}`;
  return `mailto:${email}?subject=${encodeURIComponent(asunto)}`;
}

/** «25 de noviembre de 2026», con la hora de Montevideo (donde trabaja Mario). */
export function fechaPropuesta(iso: string | null, idioma: IdiomaPropuesta): string | null {
  if (!iso) return null;
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;
  return new Intl.DateTimeFormat(idioma === "en" ? "en-US" : "es", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Montevideo",
  }).format(fecha);
}
