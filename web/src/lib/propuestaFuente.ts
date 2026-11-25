import { cache } from "react";
import { PROPUESTA_EJEMPLO, SLUG_EJEMPLO } from "@/data/propuestaEjemplo";
import { normalizarPropuesta, slugPropuestaValido, type Propuesta } from "./propuesta";

/** Workflow n8n «Propuestas · Página»: solo devuelve las publicadas. */
export const WEBHOOK_PROPUESTA = "https://n8n.smorera.tech/webhook/propuesta";

/** Cada cuánto se vuelve a pedir una propuesta a n8n (segundos). */
export const REVALIDAR_PROPUESTA = 300;

/** El ejemplo existe en `next dev` y en las vistas previas de Vercel; en producción, nunca. */
export function ejemploDisponible(entorno: NodeJS.ProcessEnv = process.env): boolean {
  return entorno.NODE_ENV !== "production" || entorno.VERCEL_ENV === "preview";
}

/**
 * Pide la propuesta a n8n (del lado del servidor, con caché de 5 min).
 * Devuelve null si no existe, no está publicada o no pasa la validación.
 * Si n8n no responde o falla, lanza: así la página guardada sigue en pie y,
 * si no había ninguna, se muestra el aviso de error en vez de un 404.
 */
export const obtenerPropuesta = cache(async (slug: string): Promise<Propuesta | null> => {
  if (!slugPropuestaValido(slug)) return null;
  if (slug === SLUG_EJEMPLO && ejemploDisponible()) return normalizarPropuesta(PROPUESTA_EJEMPLO, { ejemplo: true });

  // PROPUESTAS_WEBHOOK_URL solo para probar contra otro n8n o un servidor local.
  const webhook = process.env.PROPUESTAS_WEBHOOK_URL || WEBHOOK_PROPUESTA;
  const respuesta = await fetch(`${webhook}?slug=${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDAR_PROPUESTA, tags: [`propuesta:${slug}`] },
    signal: AbortSignal.timeout(8_000),
  });
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new Error(`propuesta ${slug}: n8n respondió ${respuesta.status}`);

  const propuesta = normalizarPropuesta(leerCuerpo(await respuesta.text(), slug));
  if (!propuesta) console.warn(JSON.stringify({ tipo: "propuesta-descartada", slug }));
  return propuesta;
});

/**
 * El cuerpo de n8n es el JSON de la propuesta; por las dudas acepta también
 * que venga como texto JSON adentro de otro (doble codificación). El slug de la
 * dirección manda: n8n buscó por ese.
 */
export function leerCuerpo(cuerpo: string, slug: string): Record<string, unknown> | null {
  let datos: unknown;
  try {
    datos = JSON.parse(cuerpo);
    if (typeof datos === "string") datos = JSON.parse(datos);
  } catch {
    return null;
  }
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) return null;
  return { ...(datos as Record<string, unknown>), slug };
}
