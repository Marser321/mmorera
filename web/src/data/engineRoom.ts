import type { LocalizedText } from "@/types/site";
import { SKILL_ORBIT, techsForFamily } from "@/data/skillOrbit";
import { localePath } from "@/config/site";
import { getProjectCase } from "@/data/projectCases";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * La parte técnica de /sistemas (#como-lo-construyo): «Para quien quiera ver el
 * motor». Decisión de Mario del 16/11: lo técnico vive acá y no en una ruta
 * aparte. Cada línea sale de un dossier, del tablero de la tríada o de la
 * configuración del sitio; nada de cifras sin fuente.
 */
export const ENGINE_ANCHOR = "como-lo-construyo";

/** El enlace que dejan las otras listas de herramientas (capacidades, CV, servicios). */
export const ENGINE_LINK = { es: "Cómo lo construyo", en: "How I build it" } satisfies LocalizedText;
export const engineHref = (language: "es" | "en") => `${localePath(language, "/sistemas")}#${ENGINE_ANCHOR}`;

export const ENGINE_COPY = {
  eyebrow: t("Para quien quiera ver el motor", "For those who want to see the engine"),
  title: t("Cómo construyo la automatización con IA", "How I build AI automation"),
  body: t(
    "Lo de arriba es lo que te llevas. Esto es cómo está hecho: con qué herramientas, cómo responden los agentes, qué pasa cuando algo falla y dónde corre.",
    "Everything above is what you get. This is how it's built: the tools, how the agents answer, what happens when something fails and where it runs.",
  ),
  stackTitle: t("Con qué trabajo", "What I work with"),
  architecturesTitle: t("Arquitecturas que puedes abrir", "Architectures you can open"),
  architecturesBody: t("Cada caso tiene su diagrama interactivo, con el sistema real por dentro.", "Each case has its interactive diagram, with the real system inside."),
  agentsTitle: t("Agentes en producción", "Agents in production"),
  failsTitle: t("Cuando algo falla", "When something fails"),
  runsTitle: t("Dónde corre", "Where it runs"),
  labLink: t("Las demos que puedes tocar están en el Lab", "The demos you can try are in the Lab"),
  teamTitle: t("El equipo detrás de cada entrega", "The team behind every build"),
  teamBody: t(
    "No trabajo con una sola IA. Cada parte del trabajo va al modelo que mejor la hace, y ninguno revisa su propio trabajo: lo audita otro, y yo apruebo antes de entregar.",
    "I don't work with a single AI. Each part of the job goes to the model that does it best, and none of them reviews its own work: another one audits it, and I approve it before it ships.",
  ),
  circuit: [t("Brief", "Brief"), t("Un modelo construye", "One model builds"), t("Otro audita", "Another audits"), t("Yo apruebo", "I approve"), t("Entrega", "Delivery")],
  /** Fuente: docs/triada/README.md (roles y regla de integración). */
  teamExample: t(
    "En esta misma web: Codex implementa cada tarjeta en su rama, Gemini verifica los casos y prepara los kits de los films, Claude revisa e integra, y nada se publica sin mi OK.",
    "On this very site: Codex builds each task on its own branch, Gemini checks the cases and prepares the film kits, Claude reviews and merges, and nothing ships without my OK.",
  ),
};

/** Roles confirmados por Mario el 16/11 (plan, sección 8.3). Sin los que faltan confirmar. */
export const ENGINE_TEAM: { part: LocalizedText; who: string; why: LocalizedText }[] = [
  { part: t("Lo que se ve", "What you see"), who: "Codex", why: t("Es el que mejor arma interfaces.", "It builds interfaces best.") },
  { part: t("Lo que no se ve", "What you don't see"), who: "Claude Code", why: t("Arquitectura, datos e integraciones de fondo.", "Architecture, data and back-end integrations.") },
  { part: t("Investigación y contenido", "Research and content"), who: "Gemini · NotebookLM", why: t("Bases de conocimiento, guiones e investigación de producto y mercado.", "Knowledge bases, scripts, and product and market research.") },
  { part: t("Tareas simples del día a día", "Simple day-to-day tasks"), who: "Gemini", why: t("Transcripción, documentos y presentaciones: cumple y es el más económico.", "Transcription, documents and presentations: it does the job and costs the least.") },
  { part: t("Escenas e imágenes", "Scenes and images"), who: "Flow", why: t("Video e imagen generados para films y piezas.", "Generated video and images for films and pieces.") },
  { part: t("Editor", "Editor"), who: "Antigravity · VS Code · Cursor", why: t("El que pida cada proyecto.", "Whichever the project calls for.") },
];

/** Fuentes: dossiers de New Brothers y Fenix; AGENTS.md del repo (MCP). */
export const ENGINE_AGENTS: LocalizedText[] = [
  t("Modelos con respaldo: el asistente de New Brothers prueba Gemini, después OpenAI, y si los dos fallan responde con reglas locales.", "Models with a fallback: the New Brothers assistant tries Gemini, then OpenAI, and if both fail it answers with local rules."),
  t("Con los datos del negocio: ese asistente responde con su propia base de conocimiento, y en Fenix los guiones salen de una base interna de 1.096 videos médicos públicos.", "With the business's own data: that assistant answers from its own knowledge base, and at Fenix scripts come from an internal base of 1,096 public medical videos."),
  t("Salidas revisadas: en Fenix cada afirmación médica pasa por un registro de 109 frases con redacción permitida y prohibida, y las pruebas las corren agentes con revisión humana antes de producción.", "Checked outputs: at Fenix every medical claim goes through a register of 109 phrases with allowed and banned wording, and agents run the tests with human review before production."),
  t("Herramientas por MCP: así trabajan cada día mis agentes con bases de datos, el navegador y los despliegues.", "Tools over MCP: that's how my agents work every day with databases, the browser and deployments."),
  t("En TypeScript, con el Vercel AI SDK.", "In TypeScript, with the Vercel AI SDK."),
];

/** Fuentes: dossiers de Fenix y L&B; servicePages (fábrica); relevamiento de Oficio; home («Cómo trabajo»). */
export const ENGINE_FAILS: LocalizedText[] = [
  t("Ante la duda, no envía: el formulario de Fenix tiene una llave fail-closed hacia el CRM, así nada sale a medias.", "When in doubt, it doesn't send: the Fenix form has a fail-closed switch into the CRM, so nothing goes out half-done."),
  t("Reintentos sin duplicados: en L&B cada reserva lleva una clave de idempotencia; repetir un pedido no crea dos turnos.", "Retries without duplicates: at L&B every booking carries an idempotency key, so repeating a request doesn't create two slots."),
  t("Nada se confirma sin el pago: el turno queda retenido 15 minutos hasta que llega el aviso de pago verificado.", "Nothing is confirmed without payment: the slot is held for 15 minutes until a verified payment notice arrives."),
  t("Todo queda registrado: en Oficio cada movimiento de caja e inventario deja su rastro.", "Everything is logged: in Oficio every cash and inventory movement leaves a trail."),
  t("Una persona decide antes de publicar o cobrar: en la fábrica de contenido cada pieza la revisa una persona, y en Oficio la caja se cierra a mano.", "A person decides before anything is published or charged: in the content factory a person reviews every piece, and in Oficio the cash drawer is closed by hand."),
  t("Las cuentas y los accesos quedan a tu nombre.", "The accounts and access stay in your name."),
];

/** Fuentes: Vercel (este sitio), VPS con Docker y Caddy (Oficio, 16/11), next.config.ts (T52). */
export const ENGINE_RUNS: LocalizedText[] = [
  t("Webs y landings en Vercel, como esta.", "Websites and landing pages on Vercel, like this one."),
  t("Sistemas propios en mi servidor, con Docker y Caddy: Oficio corre así, con su dominio y su certificado.", "My own systems on my server, with Docker and Caddy: Oficio runs that way, with its own domain and certificate."),
  t("Cabeceras de seguridad (CSP, Referrer-Policy y Permissions-Policy) y un límite al formulario en este sitio.", "Security headers (CSP, Referrer-Policy and Permissions-Policy) and a rate limit on this site's form."),
];

/** Casos con diagrama interactivo (architecture/registry). AD Media no se usa como prueba (C10). */
export const ENGINE_ARCHITECTURES = ["fenix-medical-center", "lb-elite-wash-detail", "new-brothers-barberia"]
  .flatMap((slug) => {
    const project = getProjectCase(slug);
    return project ? [{ slug, title: project.title, kind: project.kind }] : [];
  });

/** Una sola tabla del stack por familia: la misma fuente que el CV y las capacidades. */
export const ENGINE_STACK = SKILL_ORBIT.map((family) => ({
  id: family.id,
  label: family.label,
  tools: techsForFamily(family.id).map((tech) => tech.label ?? t(tech.name, tech.name)),
})).filter((row) => row.tools.length > 0);
