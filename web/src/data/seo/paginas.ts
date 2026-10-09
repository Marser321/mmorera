/**
 * SEO de las páginas fijas: título, descripción y la portada para compartir
 * (OG/WhatsApp) en los dos idiomas. Una sola fuente: la usan los metadatos
 * (`lib/seo.ts`) y el generador de portadas (`scripts/og-images.ts`).
 *
 * Títulos: la palabra que la gente busca primero, ≤ 60 caracteres con " — Mario
 * Morera". Descripciones: 120–160 caracteres, solo lo que la página muestra.
 */

export type Language = "es" | "en";
export type PaginaSeo = "inicio" | "trabajo" | "sistemas" | "estudio" | "hablemos" | "privacidad";

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
  /** Qué portada usa (privacidad reusa la del inicio). */
  portada: Exclude<PaginaSeo, "privacidad">;
}

export const PAGINAS_SEO: Record<PaginaSeo, PaginaSeoData> = {
  inicio: {
    path: "/",
    tituloAbsoluto: true,
    title: {
      es: "Mario Morera · Diseño web, CRM y automatización con IA",
      en: "Mario Morera · Web design, CRM and AI automation",
    },
    description: {
      es: "Diseño y desarrollo sitios web, CRM, automatizaciones e IA aplicada para negocios: del concepto a la operación, con un solo responsable de punta a punta.",
      en: "I design and build websites, CRMs, automations and applied AI for businesses: from concept to operations, with one person accountable end to end.",
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
    title: { es: "CRM, automatización e IA para negocios", en: "CRM, automation and AI for businesses" },
    description: {
      es: "CRM, automatización de procesos e IA aplicada dentro de un flujo que tu equipo puede ver y usar: captación, seguimiento y atención, conectados.",
      en: "CRM, process automation and applied AI inside a flow your team can see and use: lead capture, follow-up and support, connected.",
    },
    portada: "sistemas",
  },
  estudio: {
    path: "/estudio",
    title: { es: "Diseño web, motion y dirección de arte", en: "Web design, motion and art direction" },
    description: {
      es: "Dirección de arte, diseño web, motion y desarrollo frontend: experiencias donde la forma, la interacción y el código responden a la misma intención.",
      en: "Art direction, web design, motion and frontend development: experiences where form, interaction and code answer to the same intent.",
    },
    portada: "estudio",
  },
  hablemos: {
    path: "/aplicar",
    title: { es: "Contame tu proyecto", en: "Tell me about your project" },
    description: {
      es: "Tres pasos para contarme qué querés construir o automatizar. Con ese contexto te respondo con el próximo paso útil para tu proyecto.",
      en: "Three steps to tell me what you want to build or automate. With that context, I reply with the most useful next step for your project.",
    },
    portada: "hablemos",
  },
  privacidad: {
    path: "/privacidad",
    title: { es: "Privacidad", en: "Privacy" },
    description: {
      es: "Cómo se usan los datos que enviás en el brief de proyecto: qué se recopila, para qué se usa y cómo pedir acceso, corrección o eliminación.",
      en: "How the data you send in the project brief is used: what is collected, what it is for, and how to request access, correction or deletion.",
    },
    portada: "inicio",
  },
};

export const PORTADAS_OG: Record<PaginaSeoData["portada"], PortadaOg> = {
  inicio: {
    eco: { es: "Morera", en: "Morera" },
    rotulo: { es: "Mario Morera · Diseño, producto y sistemas", en: "Mario Morera · Design, product and systems" },
    titular: {
      es: "Todo tu ecosistema digital, resuelto por una sola persona.",
      en: "Your entire digital ecosystem, engineered by one person.",
    },
    servicios: { es: "Web · CRM · Automatización · IA", en: "Web · CRM · Automation · AI" },
  },
  trabajo: {
    eco: { es: "Trabajo", en: "Work" },
    rotulo: { es: "Mario Morera · Casos de éxito", en: "Mario Morera · Case studies" },
    titular: { es: "Trabajo que se puede abrir.", en: "Work you can open." },
    servicios: { es: "Casos · Demos · Implementaciones", en: "Cases · Demos · Implementations" },
  },
  sistemas: {
    eco: { es: "Sistemas", en: "Systems" },
    rotulo: { es: "Mario Morera · Sistemas", en: "Mario Morera · Systems" },
    titular: { es: "Conecto lo que hoy trabaja separado.", en: "I connect what works separately today." },
    servicios: { es: "CRM · Automatización · IA", en: "CRM · Automation · AI" },
  },
  estudio: {
    eco: { es: "Estudio", en: "Studio" },
    rotulo: { es: "Mario Morera · Estudio", en: "Mario Morera · Studio" },
    titular: { es: "La tecnología también puede tener pulso.", en: "Technology can have a pulse, too." },
    servicios: { es: "Diseño · Motion · Código", en: "Design · Motion · Code" },
  },
  hablemos: {
    eco: { es: "Hablemos", en: "Let’s talk" },
    rotulo: { es: "Mario Morera · Brief", en: "Mario Morera · Brief" },
    titular: { es: "Contame qué querés mover.", en: "Tell me what you want to move." },
    servicios: { es: "Brief en tres pasos", en: "A three-step brief" },
  },
};

/** Dónde vive cada portada (la generan con `scripts/og-images.ts`). */
export const portadaPath = (portada: PaginaSeoData["portada"], language: Language) => `/og/${portada}-${language}.jpg`;
