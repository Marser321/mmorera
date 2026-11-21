/**
 * Las demos de las apps, embebidas en la web: una página por rubro. La app
 * nunca se enlaza a la vista; solo vive dentro del marco de /demos/<rubro>.
 *
 * La edición premium es un sitio estático en el VPS. Su simulador (/demo)
 * acepta `recorrido`, `dispositivo` y `auto=1`, y su guion de cabecera toma
 * `demo={n,m,a,r}`: nombre, monograma, acento y rubro de una demo al vuelo.
 * Cada rubro pasa el suyo, así la vista de un rubro no hereda la del otro.
 */
const PREMIUM = "https://premium.smorera.tech";

export type RubroId = "gimnasios" | "consulta";
export type EscenaId = "panel" | "socio" | "entrenador" | "web";

interface MarcaDemo {
  /** Nombre del negocio de ejemplo. */
  n: string;
  /** Monograma (1 o 2 letras). */
  m: string;
  /** Acento de la casa (nogal, salvia, tinta, laton). */
  a: string;
  /** Rubro del vocabulario de la app. */
  r: "gimnasio" | "estudio" | "consulta";
}

export interface EscenaDemo {
  id: EscenaId;
  titulo: string;
  linea: string;
  /** Lo que muestra el marco al elegirla. */
  destino:
    | { tipo: "simulador"; recorrido: string; dispositivo: "telefono" | "tableta" | "portatil"; auto?: boolean }
    | { tipo: "sitio"; ruta: string }
    | { tipo: "pronto"; nota: string };
  poster: string;
  clip?: string;
  /** El póster es vertical (la app en el teléfono). */
  vertical?: boolean;
}

export interface RubroDemo {
  id: RubroId;
  estado: "lista" | "previa";
  etiqueta: string;
  titulo: string;
  bajada: string;
  /** Rótulo de la puerta en /demos. */
  puerta: string;
  marca: MarcaDemo;
  /** El film de la página (o un adelanto mudo mientras no lo hay). */
  adelanto: { mp4: string; poster: string; rotulo: string; conSonido?: boolean };
  escenas: EscenaDemo[];
  /** Lo que se le promete a quien revende o acompaña al negocio. */
  paraSocios: { titulo: string; puntos: string[] };
  aviso?: string;
}

const MEDIOS = "/demos/gimnasios";

export const RUBROS: Record<RubroId, RubroDemo> = {
  gimnasios: {
    id: "gimnasios",
    estado: "lista",
    etiqueta: "Gimnasios y estudios privados",
    titulo: "La casa, en cada pantalla.",
    bajada:
      "Un panel para el equipo, la app del socio, la del entrenador y la web del negocio. Todo conectado, con datos de ejemplo. Lo pruebas aquí mismo, sin instalar nada.",
    puerta: "Edición premium: panel, app del socio, app del entrenador y web.",
    marca: { n: "Atelier", m: "A", a: "nogal", r: "gimnasio" },
    adelanto: { mp4: `${MEDIOS}/film.mp4`, poster: `${MEDIOS}/film.webp`, rotulo: "Film · Una sola casa · 88 s", conSonido: true },
    escenas: [
      {
        id: "panel",
        titulo: "El panel",
        linea: "El día entero en una mirada: quién llega, quién paga y qué falta.",
        destino: { tipo: "simulador", recorrido: "inicio", dispositivo: "portatil", auto: true },
        poster: `${MEDIOS}/panel.webp`,
        clip: `${MEDIOS}/panel.mp4`,
      },
      {
        id: "socio",
        titulo: "La app del socio",
        linea: "Reserva, pase de entrada y su progreso, en el bolsillo.",
        destino: { tipo: "simulador", recorrido: "reserva", dispositivo: "telefono", auto: true },
        poster: `${MEDIOS}/socio.webp`,
        clip: `${MEDIOS}/socio.mp4`,
        vertical: true,
      },
      {
        id: "entrenador",
        titulo: "La app del entrenador",
        linea: "Sus sesiones, la ficha de cada socio y la rutina del día.",
        destino: { tipo: "simulador", recorrido: "llegada", dispositivo: "tableta" },
        poster: `${MEDIOS}/entrenador.webp`,
        clip: `${MEDIOS}/entrenador.mp4`,
      },
      {
        id: "web",
        titulo: "La web del negocio",
        linea: "La cara pública, con el mismo cuidado que la app.",
        destino: { tipo: "sitio", ruta: "/" },
        poster: `${MEDIOS}/web.webp`,
        clip: `${MEDIOS}/web.mp4`,
      },
    ],
    paraSocios: {
      titulo: "Para quien acompaña a gimnasios",
      puntos: [
        "Un sistema a medida para cada negocio, con su nombre, su color y su manera de trabajar.",
        "Lo construyo yo y acompaño al equipo mientras lo adopta.",
        "Tú sumas una pieza que tus clientes usan todos los días.",
      ],
    },
  },
  consulta: {
    id: "consulta",
    estado: "previa",
    etiqueta: "Consultas y clínicas",
    titulo: "Tu consulta, ordenada de punta a punta.",
    bajada:
      "La misma casa con el idioma de una consulta: clientes, sesiones y profesionales. Agenda, fichas, cobros y la app del cliente, con datos de ejemplo.",
    puerta: "Versión previa: el vocabulario ya es de consulta; los datos de ejemplo todavía son de un gimnasio.",
    marca: { n: "Clínica Aura", m: "CA", a: "salvia", r: "consulta" },
    adelanto: { mp4: `${MEDIOS}/adelanto.mp4`, poster: `${MEDIOS}/adelanto.webp`, rotulo: "Adelanto · las cuatro escenas en 12 segundos" },
    escenas: [
      {
        id: "panel",
        titulo: "El panel de la consulta",
        linea: "Agenda, fichas y cobros del equipo en una sola pantalla.",
        destino: { tipo: "simulador", recorrido: "inicio", dispositivo: "portatil", auto: true },
        poster: `${MEDIOS}/panel.webp`,
        clip: `${MEDIOS}/panel.mp4`,
      },
      {
        id: "socio",
        titulo: "La app del cliente",
        linea: "Reserva su sesión, recibe el aviso y llega con su pase.",
        destino: { tipo: "simulador", recorrido: "reserva", dispositivo: "telefono", auto: true },
        poster: `${MEDIOS}/socio.webp`,
        clip: `${MEDIOS}/socio.mp4`,
        vertical: true,
      },
      {
        id: "entrenador",
        titulo: "La app del profesional",
        linea: "Sus citas del día y la ficha de cada cliente antes de entrar.",
        destino: { tipo: "simulador", recorrido: "llegada", dispositivo: "tableta" },
        poster: `${MEDIOS}/entrenador.webp`,
        clip: `${MEDIOS}/entrenador.mp4`,
      },
      {
        id: "web",
        titulo: "La web de la consulta",
        linea: "Se arma con las imágenes y los tratamientos de cada clínica.",
        destino: { tipo: "pronto", nota: "La web de cada consulta se diseña con sus propias imágenes. Te muestro la de gimnasios como referencia." },
        poster: `${MEDIOS}/web.webp`,
        clip: `${MEDIOS}/web.mp4`,
      },
    ],
    paraSocios: {
      titulo: "Para quien acompaña a clínicas",
      puntos: [
        "Un sistema a medida por clínica: agenda, fichas, cobros y la app del cliente.",
        "Lo construyo yo y acompaño al equipo mientras lo adopta.",
        "Tú sumas una pieza que la clínica usa todos los días.",
      ],
    },
    aviso: "Versión previa: el idioma ya es de consulta y los datos de ejemplo se están cambiando.",
  },
};

export const RUBRO_IDS = Object.keys(RUBROS) as RubroId[];

/** La dirección que carga el marco para una escena. Nunca se muestra en el texto. */
export function srcDeEscena(rubro: RubroDemo, escena: EscenaDemo | null): string | null {
  const params = new URLSearchParams({ demo: JSON.stringify(rubro.marca), desde: "mmorera" });
  // Recorrido libre: el simulador elige el dispositivo según el ancho (teléfono en el celular).
  if (!escena) return `${PREMIUM}/demo?${params}&recorrido=llegada`;
  const destino = escena.destino;
  if (destino.tipo === "pronto") return null;
  if (destino.tipo === "sitio") return `${PREMIUM}${destino.ruta}?${params}`;
  params.set("recorrido", destino.recorrido);
  params.set("dispositivo", destino.dispositivo);
  if (destino.auto) params.set("auto", "1");
  return `${PREMIUM}/demo?${params}`;
}
