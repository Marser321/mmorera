import type { LocalizedText } from "@/types/site";
import type { Family } from "./techStack";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * Ramas del sitio (Mario, 1/11): páginas cortas, pero más páginas para entrar
 * a ver capacidades, casos de uso y demos. Recupera lo que se había sacado del
 * recorrido (órbita de capacidades con sus films, película de autor, demos)
 * y le da a cada pieza su propia URL. Brief: docs/triada/briefs/T42-ramas.md.
 */

/* ─── /capacidades y /capacidades/<familia> ─── */

/** Slug de URL por familia (el mismo en /en/capacidades/<slug>). */
export const CAPABILITY_SLUGS: Record<Family, string> = {
  AI: "ia-aplicada",
  Automation: "automatizacion",
  Backend: "backend-y-datos",
  Web: "experiencias-web",
  Commerce: "commerce",
  Marketing: "marketing-y-medicion",
  CRM: "crm-y-operacion",
  Media: "direccion-visual",
  Infrastructure: "infraestructura",
};

export const familyFromSlug = (slug: string): Family | undefined =>
  (Object.keys(CAPABILITY_SLUGS) as Family[]).find((family) => CAPABILITY_SLUGS[family] === slug);

/** El servicio que vende cada capacidad (la página de servicio a la que lleva). */
export const CAPABILITY_SERVICE: Record<Family, { path: string; label: LocalizedText }> = {
  AI: { path: "/agentes", label: t("Agentes de IA", "AI agents") },
  Automation: { path: "/sistemas", label: t("Automatización y CRM", "Automation & CRM") },
  Backend: { path: "/sistemas", label: t("Automatización y CRM", "Automation & CRM") },
  Web: { path: "/estudio", label: t("Webs y landings", "Websites & landing pages") },
  Commerce: { path: "/estudio", label: t("Webs y landings", "Websites & landing pages") },
  Marketing: { path: "/campanas", label: t("Campañas con IA", "AI campaigns") },
  CRM: { path: "/sistemas", label: t("Automatización y CRM", "Automation & CRM") },
  Media: { path: "/fabricas", label: t("Contenido con IA", "AI content") },
  Infrastructure: { path: "/sistemas", label: t("Automatización y CRM", "Automation & CRM") },
};

export const CAPABILITIES_PAGE = {
  eyebrow: t("Capacidades", "Capabilities"),
  title: t("Nueve capacidades que se conectan entre sí.", "Nine capabilities that connect to each other."),
  body: t(
    "Toca una para ver qué resuelve, con qué herramientas la trabajo y en qué casos ya la usé. El fondo dibuja sus herramientas y al lado corre su film.",
    "Tap one to see what it solves, which tools I use and which cases already use it. The background draws its tools while its film plays alongside."
  ),
  /** En cada familia: rótulos de sus bloques. */
  family: {
    back: t("Todas las capacidades", "All capabilities"),
    tools: t("Con qué la trabajo", "What I use"),
    film: t("El film de esta capacidad", "This capability's film"),
    cases: t("Casos que la demuestran", "Cases that prove it"),
    service: t("El servicio que la usa", "The service that uses it"),
    related: t("Se conecta con", "Connects with"),
  },
};

/* ─── /casos-de-uso y /casos-de-uso/<slug> ─── */

/** Slug de URL por film de caso de uso (USE_CASE_FILMS en data/films/systemsFilms.ts). */
export const USE_CASE_SLUGS: Record<string, string> = {
  "barber-crm": "crm-propio-barberia",
  "after-hours-lead": "lead-de-las-23-45",
  "cold-lead-revival": "ningun-lead-se-enfria",
};

export const findUseCaseBySlug = (slug: string): string | undefined =>
  Object.keys(USE_CASE_SLUGS).find((id) => USE_CASE_SLUGS[id] === slug);

/** El servicio que resuelve cada caso de uso. */
export const USE_CASE_SERVICE: Record<string, { path: string; label: LocalizedText }> = {
  "barber-crm": { path: "/sistemas", label: t("Automatización y CRM", "Automation & CRM") },
  "after-hours-lead": { path: "/agentes", label: t("Agentes de IA", "AI agents") },
  "cold-lead-revival": { path: "/sistemas", label: t("Automatización y CRM", "Automation & CRM") },
};

export const USE_CASES_PAGE = {
  eyebrow: t("Casos de uso", "Use cases"),
  title: t("Problemas reales, contados de punta a punta.", "Real problems, told end to end."),
  body: t(
    "Cada caso de uso es un film corto: el problema, el diagnóstico, el sistema y qué cambia. Algunos salen de un caso real; otros son ejemplos con datos de muestra, y lo dicen.",
    "Each use case is a short film: the problem, the diagnosis, the system and what changes. Some come from a real case; others are examples with sample data, and they say so."
  ),
  labels: {
    real: t("Caso real", "Real case"),
    example: t("Ejemplo · datos de muestra", "Example · sample data"),
    watch: t("Ver el caso de uso", "Watch the use case"),
    back: t("Todos los casos de uso", "All use cases"),
    service: t("El servicio que lo resuelve", "The service that solves it"),
    seenIn: t("Visto en", "Seen in"),
    story: t("El caso, en texto", "The case, in text"),
    others: t("Otros casos de uso", "Other use cases"),
  },
};

/* ─── /sobre-mi (película de autor + CV) ─── */

/** Textos de la película de autor (AuthorManifestoScene), con el posicionamiento de D1. */
export const ABOUT_MANIFESTO = {
  es: {
    eyebrow: "Sobre mí",
    convergence: "Crear, construir, escalar",
    headline: "Diseño, código e IA, coordinados de la idea a la entrega.",
    body: "Llevo seis años construyendo webs, automatizaciones y sistemas para negocios de servicios. Hoy coordino herramientas, modelos de IA y equipos para que trabajen juntos, y el código lo sigo escribiendo yo.",
    principleLabel: "Principio",
    principle: "Que lo que entrego se pueda usar, entender y mantener.",
    signature: "Mario Morera",
  },
  en: {
    eyebrow: "About",
    convergence: "Create, build, scale",
    headline: "Design, code and AI, coordinated from idea to delivery.",
    body: "I've spent six years building websites, automations and systems for service businesses. Today I coordinate tools, AI models and teams so they work together, and I still write the code myself.",
    principleLabel: "Principle",
    principle: "Work people can use, understand and maintain.",
    signature: "Mario Morera",
  },
};

export const ABOUT_PAGE = {
  cvTitle: t("CV", "Resume"),
  cvIntro: t("Los datos rápidos y el CV en PDF, para equipos que buscan a alguien.", "Quick facts and the PDF resume, for teams hiring."),
};

/* ─── /lab ─── */

export const LAB_PAGE = {
  eyebrow: t("Lab", "Lab"),
  title: t("Demos que puedes tocar.", "Demos you can play with."),
  body: t(
    "Piezas interactivas del sitio, sueltas para probarlas una por una. Son demos: los datos que muestran son de ejemplo.",
    "Interactive pieces of the site, set apart so you can try them one by one. They're demos: the data they show is sample data."
  ),
  demos: {
    tokens: {
      title: t("Estudio de identidad visual", "Visual identity studio"),
      body: t("Cambia la paleta, las curvas y las superficies, y mira cómo cambia un componente en vivo.", "Change the palette, corners and surfaces, and watch a live component change."),
    },
    inbox: {
      title: t("Bandeja con agente", "Inbox with an agent"),
      body: t("Una bandeja que junta WhatsApp, Instagram y formularios, con un agente que responde. Datos de ejemplo.", "An inbox that brings together WhatsApp, Instagram and forms, with an agent that replies. Sample data."),
    },
  },
  try: t("Probar la demo", "Try the demo"),
  back: t("Volver al Lab", "Back to the Lab"),
};

/** Slug de cada demo del Lab. */
export const LAB_SLUGS = { tokens: "identidad-visual", inbox: "bandeja" } as const;

/* ─── Puertas a las ramas (portada, /estudio) ─── */

export const EXPLORE_DOORS = {
  title: t("Explora más", "Explore more"),
  doors: {
    capacidades: { path: "/capacidades", title: t("Capacidades", "Capabilities"), body: t("Nueve capacidades. Toca una y mira cómo responde el sitio.", "Nine capabilities. Tap one and watch the site respond.") },
    casosDeUso: { path: "/casos-de-uso", title: t("Casos de uso", "Use cases"), body: t("Problemas reales, contados como films.", "Real problems, told as films.") },
    lab: { path: "/lab", title: t("Lab", "Lab"), body: t("Demos que puedes tocar.", "Demos you can play with.") },
  },
};

export type ExploreDoor = keyof typeof EXPLORE_DOORS.doors;
