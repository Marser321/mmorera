import type { LocalizedText } from "@/types/site";
import type { ServicePageContent } from "@/types/servicePage";
import { SERVICE_SOLUTIONS } from "./solutionsData";

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

/** Los entregables viven en solutionsData (una sola fuente); el home ya no los muestra en Webs y CRM (T39). */
const deliverablesOf = (id: string): ServicePageContent["deliverables"] => ({
  title: t("Qué incluye", "What's included"),
  items: SERVICE_SOLUTIONS.find((service) => service.id === id)?.deliverables ?? [],
});

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
    deliverables: deliverablesOf("crm-automation"),
    tools: t(
      "Con n8n, Make o GoHighLevel según tu proceso, o una herramienta a medida si el flujo es liviano.",
      "With n8n, Make or GoHighLevel depending on your process, or a custom tool when the flow is light."
    ),
    proof: {
      title: t("Sistemas que ya construí", "Systems I've already built"),
      slugs: ["rangel-oviedo-group", "lb-elite-wash-detail", "ad-media-solution"],
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
        "Si tu web ya te trae consultas y solo quieres cambiar algunos textos, no hace falta rehacerla.",
        "If your site already brings you enquiries and you only want to change some copy, there's no need to rebuild it."
      ),
    },
    deliverables: deliverablesOf("web-ecommerce"),
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
  /** /fabricas → «Contenido con IA» (T08, D11). El slot muestra «Del brief a la pieza» (T33) y la galería (T09). */
  fabricas: {
    hero: {
      eyebrow: t("Contenido con IA", "AI content"),
      title: t("Contenido constante para tu marca, con tu criterio en cada pieza.", "Steady content for your brand, with your judgment in every piece."),
      body: t(
        "Armo sistemas que convierten un brief en posts, carruseles y videos: modelos de lenguaje, imagen generada y edición por código, con una persona que revisa cada pieza antes de publicarla. Es el mismo sistema con el que hago mi propio contenido.",
        "I build systems that turn a brief into posts, carousels and videos: language models, generated images and code-based editing, with a person reviewing every piece before it's published. It's the same system I use for my own content."
      ),
      cta: { label: t("Hablemos de tu contenido", "Let's talk about your content") },
    },
    audience: {
      title: AUDIENCE_TITLE,
      for: t(
        "Marcas y equipos de marketing que necesitan publicar con constancia sin bajar la calidad.",
        "Brands and marketing teams that need to publish consistently without lowering the quality."
      ),
      notFor: t(
        "Si buscas cientos de videos baratos por semana, esto no es para ti: aquí cada pieza pasa por una revisión.",
        "If you're after hundreds of cheap videos a week, this isn't for you: here every piece gets reviewed."
      ),
    },
    deliverables: deliverablesOf("ai-software"),
    tools: t(
      "Con Claude para el texto, imagen generada sin texto para las placas y Remotion para componer y animar por código.",
      "With Claude for the copy, text-free generated images for the backgrounds and Remotion to compose and animate in code."
    ),
    howItWorks: {
      title: t("Del brief a la pieza", "From brief to piece"),
      body: t(
        "Así se hizo una pieza real de mi propio contenido, etapa por etapa: qué hizo la IA y qué decidió una persona.",
        "How a real piece of my own content was made, stage by stage: what the AI did and what a person decided."
      ),
    },
    hiring: HIRING,
    closing: {
      title: t("¿Quieres publicar con constancia sin perder tu voz?", "Want to publish consistently without losing your voice?"),
      cta: { label: t("Hablemos de tu contenido", "Let's talk about your content") },
    },
  },
} satisfies Record<"sistemas" | "estudio" | "fabricas", ServicePageContent>;
