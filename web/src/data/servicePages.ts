import type { LocalizedText } from "@/types/site";
import type { ServicePageContent } from "@/types/servicePage";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * Textos de las páginas de servicio (brief docs/triada/briefs/T27-servicios.md).
 * Secuencia común: qué resuelve → para quién → cómo funciona → prueba →
 * cómo se contrata → hablemos. Lo interactivo (films) entra como slot.
 */

/** Los mismos 3 pasos del tramo «Cómo trabajo» del home (brief T20 §4). */
const HIRING: ServicePageContent["hiring"] = {
  title: t("Cómo trabajamos", "How we work"),
  steps: [
    {
      title: t("Diagnóstico", "Diagnosis"),
      body: t(
        "Entiendo cómo trabajas hoy y dónde se pierde tiempo. Acordamos qué conviene construir primero, y qué no.",
        "I learn how you work today and where time gets lost. We agree on what to build first, and what not to."
      ),
    },
    {
      title: t("Construcción", "Build"),
      body: t(
        "Diseño, programo y conecto las piezas. Ves avances reales durante el trabajo.",
        "I design, build and connect the pieces. You see real progress along the way."
      ),
    },
    {
      title: t("Traspaso y mantenimiento", "Handover and maintenance"),
      body: t(
        "Te dejo el sistema funcionando, con las cuentas a tu nombre. Si quieres, sigo a cargo del mantenimiento.",
        "I hand over a working system, with accounts in your name. If you want, I stay on for maintenance."
      ),
    },
  ],
  price: t("El alcance y el precio se definen después del diagnóstico.", "Scope and price are set after the diagnosis."),
};

const AUDIENCE_TITLE = t("Para quién es", "Who it's for");

export const SERVICE_PAGES = {
  /** /sistemas → «Automatización y CRM». El film de apertura trae su propio título. */
  sistemas: {
    hero: {
      eyebrow: t("Automatización y CRM", "Automation & CRM"),
      title: t("Que ninguna consulta quede sin seguimiento.", "So no enquiry goes without follow-up."),
      body: t(
        "Conecto tus formularios, tu agenda, WhatsApp y tu CRM para que cada consulta entre ordenada, le llegue a quien corresponde y el seguimiento salga solo.",
        "I connect your forms, calendar, WhatsApp and CRM so every enquiry comes in organized, reaches the right person and the follow-up goes out on its own."
      ),
      cta: { label: t("Hablemos de tu proceso", "Let's talk about your process") },
    },
    audience: {
      title: AUDIENCE_TITLE,
      for: t(
        "Negocios que reciben consultas por varios canales y hoy las ordenan a mano.",
        "Businesses that get enquiries across several channels and sort them by hand today."
      ),
      notFor: t(
        "Si recibes pocas consultas por semana y las respondes sin problema, todavía no lo necesitas.",
        "If you get a few enquiries a week and answer them easily, you don't need this yet."
      ),
    },
    tools: t(
      "Con n8n, Make o GoHighLevel según tu proceso, o una herramienta a medida si el flujo es liviano.",
      "With n8n, Make or GoHighLevel depending on your process, or a custom tool when the flow is light."
    ),
    proof: {
      title: t("Sistemas que ya construí", "Systems I've already built"),
      slugs: ["rangel-oviedo-group", "lb-elite-wash-detail", "new-brothers-barberia"],
    },
    hiring: HIRING,
    closing: {
      title: t(
        "El sistema correcto se nota porque el trabajo deja de romperse entre herramientas.",
        "The right system shows when work stops breaking between tools."
      ),
      cta: { label: t("Hablemos de tu caso", "Let's talk about your case") },
    },
  },
  /** /estudio → «Webs y landings». El slot muestra films de casos de web. */
  estudio: {
    hero: {
      eyebrow: t("Webs y landings", "Websites & landing pages"),
      title: t("Una web que explica lo que haces y hace que te escriban.", "A website that explains what you do and gets people to reach out."),
      body: t(
        "Diseño y programo sitios y landings a medida: claros, rápidos en el teléfono, en dos idiomas si hace falta y fáciles de actualizar. Lo diseño y lo programo yo.",
        "I design and build custom websites and landing pages: clear, fast on the phone, bilingual when needed and easy to update. I design it and I build it."
      ),
      cta: { label: t("Hablemos de tu web", "Let's talk about your website") },
    },
    audience: {
      title: AUDIENCE_TITLE,
      for: t(
        "Negocios que reciben consultas y pierden ventas porque su web no explica lo que hacen.",
        "Businesses that get enquiries but lose sales because their site doesn't explain what they do."
      ),
      notFor: t(
        "Si tu web ya funciona y solo quieres cambiar textos, no hace falta rehacerla.",
        "If your site already works and you only want to change the copy, there's no need to rebuild it."
      ),
    },
    tools: t(
      "Con Next.js, TypeScript y Tailwind, y un CMS cuando necesitas actualizar el contenido.",
      "With Next.js, TypeScript and Tailwind, plus a CMS when you need to update content."
    ),
    howItWorks: {
      title: t("Cada caso, contado como un film", "Each case, told as a film"),
      body: t(
        "El sitio real de cada cliente y cómo se resolvió, en poco más de un minuto.",
        "Each client's live site and how it was solved, in just over a minute."
      ),
    },
    proof: {
      title: t("Webs que ya construí", "Websites I've already built"),
      slugs: ["lb-elite-wash-detail", "mr-studio-tattoo", "truckers-choice", "fenix-medical-center"],
    },
    hiring: HIRING,
    closing: {
      title: t("¿Tu web explica bien lo que haces?", "Does your website explain what you do?"),
      cta: { label: t("Hablemos de tu web", "Let's talk about your website") },
    },
  },
} satisfies Record<"sistemas" | "estudio", ServicePageContent>;
