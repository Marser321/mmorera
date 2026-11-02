/**
 * SEO de las páginas fijas: título, descripción y la portada para compartir
 * (OG/WhatsApp) en los dos idiomas. Una sola fuente: la usan los metadatos
 * (`lib/seo.ts`) y el generador de portadas (`scripts/og-images.ts`).
 *
 * Títulos: la palabra que la gente busca primero, ≤ 60 caracteres con " — Mario
 * Morera". Descripciones: 120–160 caracteres, solo lo que la página muestra.
 */

export type Language = "es" | "en";
export type PaginaSeo = "inicio" | "trabajo" | "sistemas" | "estudio" | "hablemos" | "privacidad" | "cv" | "fabricas" | "agentes";

type Texto = Record<Language, string>;

export interface PortadaOg {
  /** Palabra gigante en contorno, recortada contra el borde. */
  eco: Texto;
  /** Rótulo en mono, arriba a la izquierda. */
  rotulo: Texto;
  /** El titular de la página, tal como se lee en su h1. */
  titular: Texto;
  /** Lo que se hace, en mono, debajo del titular. */
  servicios: Texto;
}

export interface PaginaSeoData {
  path: string;
  /** El home lleva el título completo, sin la plantilla "— Mario Morera". */
  tituloAbsoluto?: boolean;
  title: Texto;
  description: Texto;
  /** Qué portada usa (privacidad, cv y fabricas reusan la del inicio). */
  portada: Exclude<PaginaSeo, "privacidad" | "cv" | "fabricas" | "agentes">;
}

export const PAGINAS_SEO: Record<PaginaSeo, PaginaSeoData> = {
  inicio: {
    path: "/",
    tituloAbsoluto: true,
    title: {
      es: "Mario Morera — AI Automation & Operations",
      en: "Mario Morera — AI Automation & Operations",
    },
    description: {
      es: "Orquesto la tecnología de negocios y equipos: webs, automatizaciones, agentes de IA y contenido con IA. Trabajas directo conmigo, en remoto.",
      en: "I orchestrate technology for businesses and teams: websites, automations, AI agents and AI content. You work directly with me, remotely.",
    },
    portada: "inicio",
  },
  trabajo: {
    path: "/casos-de-exito",
    title: { es: "Casos de éxito en web, CRM e IA", en: "Case studies in web, CRM and AI" },
    description: {
      es: "Casos reales, implementaciones locales y demos de sitios web, CRM, automatizaciones e IA aplicada. Cada ficha deja claro en qué estado está.",
      en: "Real cases, local implementations and demos of websites, CRMs, automations and applied AI. Each page makes its current status clear.",
    },
    portada: "trabajo",
  },
  sistemas: {
    path: "/sistemas",
    title: { es: "Automatización y CRM para negocios", en: "Automation & CRM for businesses" },
    description: {
      es: "Conecto formularios, agenda, WhatsApp y CRM para que cada consulta entre ordenada, le llegue a quien corresponde y el seguimiento salga solo.",
      en: "I connect forms, calendar, WhatsApp and CRM so every enquiry comes in organized, reaches the right person and the follow-up goes out on its own.",
    },
    portada: "sistemas",
  },
  estudio: {
    path: "/estudio",
    title: { es: "Webs y landings a medida", en: "Custom websites & landing pages" },
    description: {
      es: "Diseño y programo sitios y landings a medida: claros, rápidos en el teléfono, en dos idiomas si hace falta y fáciles de actualizar.",
      en: "I design and build custom websites and landing pages: clear, fast on the phone, bilingual when needed and easy to update.",
    },
    portada: "estudio",
  },
  hablemos: {
    path: "/aplicar",
    title: { es: "Cuéntame tu proyecto", en: "Tell me about your project" },
    description: {
      es: "Tres pasos para contarme qué quieres construir o automatizar. Con ese contexto te respondo con el próximo paso útil para tu proyecto.",
      en: "Three steps to tell me what you want to build or automate. With that context, I reply with the most useful next step for your project.",
    },
    portada: "hablemos",
  },
  privacidad: {
    path: "/privacidad",
    title: { es: "Política de privacidad", en: "Privacy policy" },
    description: {
      es: "Qué información recibo cuando me escribes por el formulario, el email o WhatsApp, para qué la uso, con quién se comparte y cómo puedes pedir que la borre.",
      en: "What information I receive when you write through the form, email or WhatsApp, what I use it for, who it is shared with and how to ask me to delete it.",
    },
    portada: "inicio",
  },
  fabricas: {
    path: "/fabricas",
    title: { es: "Contenido con IA para marcas", en: "AI content for brands" },
    description: {
      es: "Sistemas que convierten un brief en posts, carruseles y videos para tu marca, con revisión humana en cada pieza. Así se hace una pieza real, etapa por etapa.",
      en: "Systems that turn a brief into posts, carousels and videos for your brand, with human review on every piece. See how a real piece is made, stage by stage.",
    },
    portada: "inicio",
  },
  agentes: {
    path: "/agentes",
    title: { es: "Agentes de IA para tu negocio", en: "AI agents for your business" },
    description: {
      es: "Agentes que atienden, responden y agendan por ti en WhatsApp, tu web o tu agenda, con cuentas a tu nombre y traspaso a una persona cuando hace falta.",
      en: "Agents that answer, reply and book for you on WhatsApp, your website or calendar, with accounts in your name and a handoff to a person when it matters.",
    },
    portada: "inicio",
  },
  cv: {
    path: "/cv",
    title: { es: "Sobre mí y CV", en: "About & resume" },
    description: {
      es: "Mario Morera, AI Automation & Operations: webs, automatizaciones, agentes de IA y contenido con IA. Datos rápidos, casos y CV en PDF para descargar.",
      en: "Mario Morera, AI Automation & Operations: websites, automations, AI agents and AI content. Quick facts, case studies and a downloadable PDF resume.",
    },
    portada: "inicio",
  },
};

export const PORTADAS_OG: Record<PaginaSeoData["portada"], PortadaOg> = {
  inicio: {
    eco: { es: "Morera", en: "Morera" },
    rotulo: { es: "Mario Morera · AI Automation & Operations", en: "Mario Morera · AI Automation & Operations" },
    titular: {
      es: "Orquesto la tecnología de tu negocio: web, agentes de IA y contenido.",
      en: "I orchestrate your business technology: web, AI agents and content.",
    },
    servicios: { es: "Web · Agentes de IA · Automatización · Contenido", en: "Web · AI agents · Automation · Content" },
  },
  trabajo: {
    eco: { es: "Trabajo", en: "Work" },
    rotulo: { es: "Mario Morera · Casos de éxito", en: "Mario Morera · Case studies" },
    titular: { es: "Trabajo que se puede abrir.", en: "Work you can open." },
    servicios: { es: "Casos · Demos · Implementaciones", en: "Cases · Demos · Implementations" },
  },
  sistemas: {
    eco: { es: "CRM", en: "CRM" },
    rotulo: { es: "Mario Morera · Automatización y CRM", en: "Mario Morera · Automation & CRM" },
    titular: { es: "Que ninguna consulta quede sin seguimiento.", en: "So no enquiry goes without follow-up." },
    servicios: { es: "Formularios · Agenda · WhatsApp · CRM", en: "Forms · Calendar · WhatsApp · CRM" },
  },
  estudio: {
    eco: { es: "Webs", en: "Websites" },
    rotulo: { es: "Mario Morera · Webs y landings", en: "Mario Morera · Websites & landing pages" },
    titular: { es: "Una web que explica lo que haces y hace que te escriban.", en: "A website that explains what you do and gets people to reach out." },
    servicios: { es: "Diseño · Desarrollo · Dos idiomas", en: "Design · Development · Bilingual" },
  },
  hablemos: {
    eco: { es: "Hablemos", en: "Let’s talk" },
    rotulo: { es: "Mario Morera · Brief", en: "Mario Morera · Brief" },
    titular: { es: "Cuéntame qué quieres construir o automatizar.", en: "Tell me what you want to build or automate." },
    servicios: { es: "Brief en tres pasos", en: "A three-step brief" },
  },
};

/** Palabras clave del sitio, por idioma (van en los metadatos de cada página fija). */
export const KEYWORDS: Record<Language, string[]> = {
  es: ["AI Automation", "AI Operations", "Agentes de IA", "Automatización", "CRM", "Contenido con IA", "Mario Morera"],
  en: ["AI Automation", "AI Operations", "AI agents", "Automation", "CRM", "AI content", "Mario Morera"],
};

/** Dónde vive cada portada (la generan con `scripts/og-images.ts`). */
export const portadaPath = (portada: PaginaSeoData["portada"], language: Language) => `/og/${portada}-${language}.jpg`;
