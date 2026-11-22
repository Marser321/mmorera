import { createClient } from "@insforge/sdk";
import { validarVisita } from "@/lib/origen";
import { createRateLimiter } from "@/lib/rateLimit";
import { reenviarVisitaAN8n } from "@/lib/visitasN8n";

/**
 * Registro de visitas a /demos. Sin cookies y sin IP guardada: página, evento,
 * escena y el origen `?de=` del socio o la campaña.
 *
 * - Siempre queda una línea en los registros de Vercel.
 * - Si existe la tabla `demo_visitas` en InsForge, se guarda ahí (ver
 *   docs/demos/REGISTRO-DE-VISITAS.md); si no, el error se ignora.
 * - Las visitas que traen origen avisan por Telegram, con el bot de los leads,
 *   al llegar y al pedir contacto: son las que importan para cada alianza.
 * - Las visitas que traen origen también van a n8n si está
 *   `VISITAS_WEBHOOK_TOKEN`: quedan en la base `ventas` del VPS, cruzadas con
 *   los envíos por slug. Si n8n falla, se ignora.
 */
const porVisitante = createRateLimiter({ limit: 30, windowMs: 10 * 60_000 });
const porInstancia = createRateLimiter({ limit: 600, windowMs: 10 * 60_000 });

export async function POST(request: Request) {
  const visitante = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "sin-ip";
  if (!porVisitante.allow(visitante) || !porInstancia.allow("sitio")) return new Response(null, { status: 204 });

  let cuerpo: unknown;
  try {
    cuerpo = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const visita = validarVisita(cuerpo);
  if (!visita) return new Response(null, { status: 400 });

  console.info(JSON.stringify({ tipo: "visita-demo", ...visita }));

  const tareas: Promise<unknown>[] = [];

  const url = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const clave = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
  if (url && clave) {
    tareas.push(
      (async () => {
        const insforge = createClient({ baseUrl: url, anonKey: clave });
        const { error } = await insforge.database.from("demo_visitas").insert([
          { pagina: visita.pagina, evento: visita.evento, origen: visita.de, detalle: visita.detalle },
        ]);
        if (error) console.warn("demo_visitas:", error.message ?? error);
      })().catch(() => {}),
    );
  }

  const aN8n = reenviarVisitaAN8n(visita, process.env.VISITAS_WEBHOOK_TOKEN);
  if (aN8n) tareas.push(aN8n);

  const bot = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (bot && chat && visita.de && (visita.evento === "vista" || visita.evento === "contacto")) {
    const texto =
      visita.evento === "vista"
        ? `Visita a ${visita.pagina} — de: ${visita.de}`
        : `Pidió hablar desde ${visita.pagina} — de: ${visita.de}`;
    tareas.push(
      fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: texto }),
      }).catch(() => {}),
    );
  }

  await Promise.all(tareas);
  return new Response(null, { status: 204 });
}
