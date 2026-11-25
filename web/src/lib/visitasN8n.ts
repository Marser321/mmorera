import { esPaginaDePropuesta, type VisitaDemo } from "./origen";

/** Webhook del workflow n8n «Visitas · Demo» (base `ventas` del VPS). */
export const WEBHOOK_VISITAS = "https://n8n.smorera.tech/webhook/visita-demo";

/**
 * Reenvía a n8n una visita que trae origen `?de=`: n8n la guarda en
 * `demo_visitas` y la cruza con los envíos por slug. Las visitas a una
 * propuesta (/p/<slug>) van siempre, con o sin origen: el slug de la página ya
 * dice de qué negocio es. Sin token, o sin origen fuera de una propuesta, no
 * manda nada (devuelve null). Nunca falla: si n8n no responde, se ignora.
 */
export function reenviarVisitaAN8n(visita: VisitaDemo, token: string | undefined): Promise<void> | null {
  if (!token || !(visita.de || esPaginaDePropuesta(visita.pagina))) return null;
  return fetch(WEBHOOK_VISITAS, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Visita-Token": token },
    body: JSON.stringify({ pagina: visita.pagina, evento: visita.evento, de: visita.de, detalle: visita.detalle }),
    signal: AbortSignal.timeout(3_000),
  })
    .then((respuesta) => {
      if (!respuesta.ok) console.warn("visita-demo n8n:", respuesta.status);
    })
    .catch(() => {});
}
