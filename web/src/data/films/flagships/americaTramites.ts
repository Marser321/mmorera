import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de América Trámites:
 * "Asistencia administrativa y educación documental para la comunidad hispana".
 *
 * Fuente: el sitio publicado (atreact.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/america-tramites.md.
 */

export const AT_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 8 },
  { id: "routes", kind: "checklist", seconds: 10 },
  { id: "staged", kind: "staged-form", seconds: 24 },
  { id: "roadmap", kind: "shot-stack", seconds: 12 },
  { id: "documents", kind: "fact-wall", seconds: 14 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const atTimeline = timelineFrom(AT_SCENES);
export const AT_TIMELINE = atTimeline.slots;
export const AT_DURATION = atTimeline.durationInFrames;

/** Cifras verificadas del sitio en producción. */
export const AT_FACTS = {
  filings: { value: 4, source: "Dossier · /tramites: 4 tarjetas interactivas de servicio con alcance y documentos" },
  families: { value: 3, source: "Dossier · /tramites: selector por 3 familias de trámites más filtro general" },
  routes: { value: 3, source: "Dossier · Home y /contacto: 3 rutas de navegación y clasificación inicial" },
  weeks: { value: 6, source: "Dossier · /emprender: 6 semanas consecutivas con resultado práctico semanal" },
  guides: { value: 3, source: "Dossier · /aprender: 3 microguías con puntos clave y checklists desplegables" },
  courses: { value: 3, source: "Dossier · /aprender: 3 formaciones guiadas con temario y formato" },
  steps: { value: 3, source: "Dossier · /nosotros: sección Cómo trabajamos con 3 etapas numeradas" },
} as const satisfies Record<string, FilmFact>;

export const AT_STAGE_KEYS = ["quiz", "catalog", "modal", "contact"] as const;
export type AtStageKey = (typeof AT_STAGE_KEYS)[number];

export type AtStageDef = {
  id: AtStageKey;
  stepIndex: number;
  label: Localized;
  detail: Localized;
  tag: Localized;
};

export const AT_STAGES: ReadonlyArray<AtStageDef> = [
  {
    id: "quiz",
    stepIndex: 0,
    label: { es: "Clasificación inicial", en: "Initial classification" },
    detail: { es: "¿Qué necesita lograr hoy? Tres caminos: emprender, tramitar o aprender", en: "What do you need today? Three paths: enterprise, filings or learning" },
    tag: { es: "Intención de entrada", en: "Inbound intent" },
  },
  {
    id: "catalog",
    stepIndex: 1,
    label: { es: "Catálogo por familias", en: "Catalog by families" },
    detail: { es: "Migratorios, renovaciones y negocios con alcance documentado antes de iniciar", en: "Immigration, renewals and business with documented scope before starting" },
    tag: { es: "3 familias de servicio", en: "3 service families" },
  },
  {
    id: "modal",
    stepIndex: 2,
    label: { es: "Alcance y documentos", en: "Scope & checklist" },
    detail: { es: "Qué podemos ordenar, documentos comunes y alertas para escalar si hay complejidad", en: "What can be organized, common records, and criteria to escalate complexity" },
    tag: { es: "Checklist previo", en: "Preliminary checklist" },
  },
  {
    id: "contact",
    stepIndex: 3,
    label: { es: "Contacto adaptativo", en: "Contextual handover" },
    detail: { es: "Formulario contextualizado según la ruta y derivación directa a WhatsApp", en: "Form tailored to the selected path and direct WhatsApp referral" },
    tag: { es: "Derivación responsable", en: "Responsible handover" },
  },
];

const BRAND = "/portfolio/brands/america-tramites";

export const AT_ASSETS = {
  conversionScene: { src: `${BRAND}/conversion-scene.webp`, w: 1774, h: 887 },
  documentSuite: { src: `${BRAND}/document-suite.webp`, w: 1024, h: 1536 },
  educationScene: { src: `${BRAND}/education-scene.webp`, w: 1774, h: 887 },
  hero: { src: `${BRAND}/shots/hero.jpg`, w: 1920, h: 1200 },
  quiz: { src: `${BRAND}/shots/quiz.jpg`, w: 1920, h: 1080 },
  servicesCatalog: { src: `${BRAND}/shots/services-catalog.jpg`, w: 1920, h: 1200 },
  serviceModal: { src: `${BRAND}/shots/service-modal.jpg`, w: 1920, h: 1080 },
  contactForm: { src: `${BRAND}/shots/contact-form.jpg`, w: 1920, h: 1080 },
  roadmap: { src: `${BRAND}/shots/roadmap.jpg`, w: 1920, h: 1200 },
} as const satisfies Record<string, FilmAsset>;

export const AT_HOST = "atreact.vercel.app";

const L = (es: string, en: string): Localized => ({ es, en });

export const AT_CHAPTERS: FlagshipChapter[] = [
  {
    id: "identity",
    label: L("Identidad", "Identity"),
    caption: L(
      "América Trámites: asistencia administrativa y educación documental para la comunidad hispana.",
      "América Trámites: administrative assistance and document education for the Hispanic community.",
    ),
    from: 0,
    durationInFrames: AT_TIMELINE.routes.from,
  },
  {
    id: "routes",
    label: L("Rutas", "Routes"),
    caption: L(
      "Tres caminos de entrada por intención: emprender, trámites y aprender.",
      "Three inbound paths by intent: enterprise, filings and learning.",
    ),
    from: AT_TIMELINE.routes.from,
    durationInFrames: AT_TIMELINE.routes.duration,
  },
  {
    id: "staged",
    label: L("Recorrido", "Walkthrough"),
    caption: L(
      "Clasificación en quiz, catálogo por familias, checklist previo y contacto contextual.",
      "Quiz classification, family catalog, checklist review and contextual contact.",
    ),
    from: AT_TIMELINE.staged.from,
    durationInFrames: AT_TIMELINE.staged.duration,
  },
  {
    id: "roadmap",
    label: L("Formación", "Training"),
    caption: L(
      "Hoja de ruta formativa de seis semanas con criterio operativo y límites responsables.",
      "Six-week training roadmap with operational criteria and responsible boundaries.",
    ),
    from: AT_TIMELINE.roadmap.from,
    durationInFrames: AT_TIMELINE.roadmap.duration,
  },
  {
    id: "documents",
    label: L("Documentos", "Documents"),
    caption: L(
      "Catálogo documental, microguías educativas y método operativo de tres pasos.",
      "Document catalog, educational micro-guides and three-step operational method.",
    ),
    from: AT_TIMELINE.documents.from,
    durationInFrames: AT_TIMELINE.documents.duration + AT_TIMELINE.signature.duration,
  },
];

export type AtStagedCardCopy = {
  num: string;
  tag: string;
  title: string;
  detail: string;
  url: string;
};

export type AtCopy = {
  opening: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  routes: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; note: string }>;
  };
  staged: {
    title: string;
    subtitle: string;
    cards: Record<AtStageKey, AtStagedCardCopy>;
  };
  roadmap: {
    title: string;
    subtitle: string;
    tag: string;
    caption: string;
  };
  documents: {
    title: string;
    subtitle: string;
    facts: Array<{ value: string; label: string; source: string }>;
  };
};

export const AT_COPY: Record<FilmLanguage, AtCopy> = {
  es: {
    opening: {
      kicker: "Portal institucional · Miami Gardens, FL",
      title: "América Trámites",
      subtitle: "Asistencia administrativa y educación documental con límites éticos y legales visibles.",
    },
    routes: {
      title: "Tres rutas guiadas por intención",
      subtitle: "El usuario elige su camino desde la portada según su necesidad inmediata.",
      items: [
        { title: "Emprender", note: "Ruta profesional para operadores y preparadores administrativos comunitarios." },
        { title: "Trámites", note: "Catálogo interactivo por familias con alcance y requisitos documentales claros." },
        { title: "Aprender", note: "Centro educativo con microguías gratuitas y formaciones guiadas prácticas." },
      ],
    },
    staged: {
      title: "El recorrido por etapas documentales",
      subtitle: "De la intención inicial al contacto adaptativo sin falsas promesas.",
      cards: {
        quiz: {
          num: "01",
          tag: "Clasificación inicial",
          title: "Quiz interactivo de intención",
          detail: "Una pregunta orientadora clasifica si la persona busca formarse, tramitar o resolver dudas.",
          url: `${AT_HOST}/#quiz`,
        },
        catalog: {
          num: "02",
          tag: "Catálogo estructurado",
          title: "Cuatro trámites en tres familias",
          detail: "Asilo, TPS, permisos de trabajo y creación de empresas organizados con transparencia.",
          url: `${AT_HOST}/tramites`,
        },
        modal: {
          num: "03",
          tag: "Alcance y requisitos",
          title: "Checklist previo de documentos",
          detail: "Desglose de lo que se puede ordenar y alertas visibles para derivar casos complejos.",
          url: `${AT_HOST}/tramites`,
        },
        contact: {
          num: "04",
          tag: "Derivación responsable",
          title: "Formulario adaptativo y directo",
          detail: "Instrucciones según la ruta y derivación directa a WhatsApp sin guardar datos en backend.",
          url: `${AT_HOST}/contacto`,
        },
      },
    },
    roadmap: {
      title: "Seis semanas, un criterio operativo",
      subtitle: "Ruta formativa para operar con rigor documental y límites responsables.",
      tag: "Formación profesional",
      caption: "Seis módulos prácticos que enseñan a convertir el desorden en expedientes organizados.",
    },
    documents: {
      title: "Rigor documental y método operativo",
      subtitle: "Estructura verificada en el portal servido.",
      facts: [
        { value: formatFact(AT_FACTS.filings, "es"), label: "Trámites en catálogo", source: AT_FACTS.filings.source },
        { value: formatFact(AT_FACTS.families, "es"), label: "Familias de servicio", source: AT_FACTS.families.source },
        { value: formatFact(AT_FACTS.routes, "es"), label: "Rutas por intención", source: AT_FACTS.routes.source },
        { value: formatFact(AT_FACTS.weeks, "es"), label: "Semanas de formación", source: AT_FACTS.weeks.source },
        { value: formatFact(AT_FACTS.guides, "es"), label: "Microguías gratuitas", source: AT_FACTS.guides.source },
        { value: formatFact(AT_FACTS.steps, "es"), label: "Pasos del método", source: AT_FACTS.steps.source },
      ],
    },
  },
  en: {
    opening: {
      kicker: "Institutional portal · Miami Gardens, FL",
      title: "América Trámites",
      subtitle: "Administrative assistance and document education with visible ethical boundaries.",
    },
    routes: {
      title: "Three intent-driven guided routes",
      subtitle: "Users choose their path from the hero section based on their immediate needs.",
      items: [
        { title: "Enterprise", note: "Professional roadmap for community administrative preparers." },
        { title: "Filings", note: "Interactive family catalog with clear administrative scope and requirements." },
        { title: "Learn", note: "Educational center with free micro-guides and guided training sessions." },
      ],
    },
    staged: {
      title: "The staged document workflow",
      subtitle: "From inbound intention to contextual handover without false claims.",
      cards: {
        quiz: {
          num: "01",
          tag: "Initial intake",
          title: "Interactive intent quiz",
          detail: "A guiding question classifies whether someone needs training, filing support, or guidance.",
          url: `${AT_HOST}/#quiz`,
        },
        catalog: {
          num: "02",
          tag: "Structured catalog",
          title: "Four filings across three families",
          detail: "Asylum, TPS, work permits and business formation organized with transparent scope.",
          url: `${AT_HOST}/tramites`,
        },
        modal: {
          num: "03",
          tag: "Scope & checklist",
          title: "Preliminary document review",
          detail: "Breakdown of organisable records and visible criteria to escalate complex legal cases.",
          url: `${AT_HOST}/tramites`,
        },
        contact: {
          num: "04",
          tag: "Responsible handover",
          title: "Adaptive contextual contact",
          detail: "Form instructions adjust to selected path, routing directly to WhatsApp with no stored data.",
          url: `${AT_HOST}/contacto`,
        },
      },
    },
    roadmap: {
      title: "Six weeks, one operational standard",
      subtitle: "Training roadmap to operate with document rigor and clear professional boundaries.",
      tag: "Professional training",
      caption: "Six practical modules teaching how to transform disordered files into structured dossiers.",
    },
    documents: {
      title: "Document rigor & operational method",
      subtitle: "Verified structure on the live published portal.",
      facts: [
        { value: formatFact(AT_FACTS.filings, "en"), label: "Catalog filings", source: AT_FACTS.filings.source },
        { value: formatFact(AT_FACTS.families, "en"), label: "Service families", source: AT_FACTS.families.source },
        { value: formatFact(AT_FACTS.routes, "en"), label: "Intent routes", source: AT_FACTS.routes.source },
        { value: formatFact(AT_FACTS.weeks, "en"), label: "Training weeks", source: AT_FACTS.weeks.source },
        { value: formatFact(AT_FACTS.guides, "en"), label: "Free micro-guides", source: AT_FACTS.guides.source },
        { value: formatFact(AT_FACTS.steps, "en"), label: "Method steps", source: AT_FACTS.steps.source },
      ],
    },
  },
};
