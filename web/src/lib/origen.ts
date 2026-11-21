/**
 * De dónde viene cada visita a las demos: un socio o una campaña lo marca con
 * `?de=indigo` en el enlace. Se guarda en sessionStorage (no es una cookie y
 * muere con la pestaña) para que viaje de /demos a cada rubro, al brief y al
 * mensaje de WhatsApp. Solo se acepta un slug corto: nada de texto libre.
 */
export const CLAVE_ORIGEN = "mm-origen";

const SLUG = /^[a-z0-9][a-z0-9-]{0,31}$/;

/** Devuelve el origen limpio (minúsculas, sin espacios) o null si no sirve. */
export function limpiarOrigen(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim().toLowerCase();
  return SLUG.test(limpio) ? limpio : null;
}

/** Lee `?de=` de la dirección; si no viene, el que ya quedó en la pestaña. */
export function origenDeLaVisita(): string | null {
  if (typeof window === "undefined") return null;
  const deLaUrl = limpiarOrigen(new URLSearchParams(window.location.search).get("de"));
  try {
    if (deLaUrl) {
      window.sessionStorage.setItem(CLAVE_ORIGEN, deLaUrl);
      return deLaUrl;
    }
    return limpiarOrigen(window.sessionStorage.getItem(CLAVE_ORIGEN));
  } catch {
    return deLaUrl;
  }
}

export const EVENTOS_DEMO = ["vista", "demo", "escena", "contacto"] as const;
export type EventoDemo = (typeof EVENTOS_DEMO)[number];

export interface VisitaDemo {
  pagina: string;
  evento: EventoDemo;
  de: string | null;
  detalle: string | null;
}

/** Valida lo que llega a /api/visita. Todo lo que no encaja se descarta. */
export function validarVisita(cuerpo: unknown): VisitaDemo | null {
  if (!cuerpo || typeof cuerpo !== "object") return null;
  const { pagina, evento, de, detalle } = cuerpo as Record<string, unknown>;
  if (typeof pagina !== "string" || !/^\/demos(\/[a-z0-9-]{1,32})?$/.test(pagina)) return null;
  if (typeof evento !== "string" || !(EVENTOS_DEMO as readonly string[]).includes(evento)) return null;
  return {
    pagina,
    evento: evento as EventoDemo,
    de: limpiarOrigen(de),
    detalle: limpiarOrigen(detalle),
  };
}
