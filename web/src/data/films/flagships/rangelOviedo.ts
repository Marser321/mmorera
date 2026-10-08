import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de Rangel Oviedo Group:
 * "Bienes Raíces de Lujo en Texas · Asesoría Inmobiliaria Estratégica".
 *
 * Fuente: el sitio publicado (rangeloviedo-tor8.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/rangel-oviedo-group.md.
 */

export const ROG_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 8 },
  { id: "residences", kind: "camera-reel", seconds: 12 },
  { id: "paths", kind: "goal-paths", seconds: 24 },
  { id: "interface", kind: "shot-stack", seconds: 12 },
  { id: "pillars", kind: "checklist", seconds: 8 },
  { id: "metrics", kind: "fact-wall", seconds: 8 },
  { id: "signature", kind: "signature", seconds: 5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const rogTimeline = timelineFrom(ROG_SCENES);
export const ROG_TIMELINE = rogTimeline.slots;
export const ROG_DURATION = rogTimeline.durationInFrames;

/**
 * Cifras de lo construido. Las del negocio del cliente que muestra el hero
 * (vendidas, rentadas, reseñas) no son resultados del trabajo y no van.
 */
export const ROG_FACTS = {
  methodSteps: { value: 5, source: "Dossier · Home, sección El Método Rangel: 5 pasos" },
  profiles: { value: 4, source: "Dossier · Home, sección Diagnóstico por perfil: 4 perfiles" },
  pillars: { value: 4, source: "Dossier · Home, sección El Equipo Consultor: 4 pilares" },
} as const satisfies Record<string, FilmFact>;

export const ROG_PROFILE_KEYS = ["investor", "family", "seller", "relocation"] as const;
export type RogProfileKey = (typeof ROG_PROFILE_KEYS)[number];

export type RogProfileDef = {
  id: RogProfileKey;
  stepIndex: number;
  label: Localized;
  detail: Localized;
};

export const ROG_PROFILES: ReadonlyArray<RogProfileDef> = [
  {
    id: "investor",
    stepIndex: 0,
    label: { es: "Inversor internacional", en: "International investor" },
    detail: { es: "Diversificación patrimonial en activos tangibles en Texas", en: "Wealth diversification in tangible Texas assets" },
  },
  {
    id: "family",
    stepIndex: 1,
    label: { es: "Compra familiar", en: "Family home purchase" },
    detail: { es: "Comunidades escolares y residenciales en The Woodlands y Houston", en: "Premier residential and school communities in The Woodlands" },
  },
  {
    id: "seller",
    stepIndex: 2,
    label: { es: "Vendedor premium", en: "Premium property seller" },
    detail: { es: "Posicionamiento editorial y estrategia privada de venta", en: "Editorial positioning and private property sale strategy" },
  },
  {
    id: "relocation",
    stepIndex: 3,
    label: { es: "Relocation a Texas", en: "Relocation to Texas" },
    detail: { es: "Acompañamiento residencial, fiscal y de estilo de vida", en: "Comprehensive residential, tax and lifestyle relocation" },
  },
];

export type RogMethodStep = {
  num: string;
  title: Localized;
  desc: Localized;
};

export const ROG_STEPS: ReadonlyArray<RogMethodStep> = [
  {
    num: "01",
    title: { es: "Diagnóstico de decisión", en: "Decision diagnostic" },
    desc: { es: "Capital, familia, movilidad y timing antes de abrir listados", en: "Capital, family, mobility and timing before opening listings" },
  },
  {
    num: "02",
    title: { es: "Lectura de mercado", en: "Market reading" },
    desc: { es: "Filtramos Texas por riesgo, contexto fiscal y reventa", en: "Filtering Texas by risk, tax context and resale value" },
  },
  {
    num: "03",
    title: { es: "Selección privada", en: "Private selection" },
    desc: { es: "Acceso exclusivo a oportunidades residenciales fuera de mercado", en: "Exclusive access to off-market residential opportunities" },
  },
  {
    num: "04",
    title: { es: "Negociación de oficio", en: "Expert negotiation" },
    desc: { es: "Protección de valor y rigor contractual en cada cierre", en: "Value protection and contractual diligence in every deal" },
  },
  {
    num: "05",
    title: { es: "Continuidad", en: "Long-term continuity" },
    desc: { es: "Acompañamiento patrimonial post-cierre en Texas", en: "Post-closing portfolio and property support in Texas" },
  },
];

const BRAND = "/portfolio/brands/rangel-oviedo-group";

export const ROG_ASSETS = {
  facadeLoop: { src: `${BRAND}/facade-loop.mp4`, webm: `${BRAND}/facade-loop.webm`, w: 1280, h: 720, fps: 30, seconds: 6 },
  facadePoster: { src: `${BRAND}/facade-loop-poster.jpg`, w: 1280, h: 720 },
  livingroom: { src: `${BRAND}/livingroom.mp4`, webm: `${BRAND}/livingroom.webm`, w: 1280, h: 720, fps: 30, seconds: 8 },
  livingroomPoster: { src: `${BRAND}/livingroom-poster.jpg`, w: 1280, h: 720 },
  ceoSeated: { src: `${BRAND}/ceo-seated-dark.jpg`, w: 1278, h: 1920 },
  teamTexans: { src: `${BRAND}/team-texans.jpg`, w: 1280, h: 1920 },
  entrance: { src: `${BRAND}/entrance.jpg`, w: 1024, h: 1024 },
  esHero: { src: `${BRAND}/shots/es-hero.jpg`, w: 1920, h: 1200 },
  enHero: { src: `${BRAND}/shots/en-hero.jpg`, w: 1920, h: 1200 },
  esMetodo: { src: `${BRAND}/shots/es-metodo.jpg`, w: 1920, h: 1080 },
  esPerfiles: { src: `${BRAND}/shots/es-perfiles.jpg`, w: 1920, h: 1080 },
  esCuraduria: { src: `${BRAND}/shots/es-propiedades.jpg`, w: 1920, h: 1080 },
  esContacto: { src: `${BRAND}/shots/es-contacto.jpg`, w: 1920, h: 1080 },
} as const satisfies Record<string, FilmAsset>;

export const ROG_HOST = "rangeloviedo-tor8.vercel.app";

const L = (es: string, en: string): Localized => ({ es, en });

export const ROG_CHAPTERS: FlagshipChapter[] = [
  {
    id: "identity",
    label: L("Identidad", "Identity"),
    caption: L(
      "Rangel Oviedo Group: asesoría inmobiliaria de lujo y curaduría arquitectónica en The Woodlands y Houston.",
      "Rangel Oviedo Group: luxury real estate advisory and architectural curation in The Woodlands and Houston.",
    ),
    from: 0,
    durationInFrames: ROG_TIMELINE.paths.from,
  },
  {
    id: "paths",
    label: L("El Método Rangel", "The Rangel Method"),
    caption: L(
      "Cuatro perfiles de decisión ingresando a las cinco etapas estructuradas antes de abrir cualquier listado.",
      "Four decision profiles entering the five structured stages before opening any listing.",
    ),
    from: ROG_TIMELINE.paths.from,
    durationInFrames: ROG_TIMELINE.paths.duration,
  },
  {
    id: "interface",
    label: L("Curaduría bilingüe", "Bilingual curation"),
    caption: L(
      "Experiencia interactiva bilingüe EN/ES con catálogo curado y asesoría privada.",
      "Interactive bilingual EN/ES experience with curated catalog and private advisory.",
    ),
    from: ROG_TIMELINE.interface.from,
    durationInFrames: ROG_TIMELINE.interface.duration,
  },
  {
    id: "closing",
    label: L("Equipo y métricas", "Team & metrics"),
    caption: L("Los pilares del equipo y lo que el sitio tiene construido.", "The team pillars and what the site has built."),
    from: ROG_TIMELINE.pillars.from,
    durationInFrames: ROG_TIMELINE.pillars.duration + ROG_TIMELINE.metrics.duration + ROG_TIMELINE.signature.duration,
  },
];

export type RogCopy = {
  openingKicker: string;
  openingTagline: string;
  residencesKicker: string;
  residencesTitle: string;
  residencesBeats: Array<{ kicker: string; text: string }>;
  pathsKicker: string;
  pathsTitle: string;
  pathsSubtitle: string;
  pathsNote: string;
  profilesTitle: string;
  methodTitle: string;
  interfaceKicker: string;
  interfaceTitle: string;
  interfaceNote: string;
  interfaceShots: Array<{ label: string }>;
  pillarsKicker: string;
  pillarsTitle: string;
  pillarsItems: string[];
  metricsKicker: string;
  metricsTitle: string;
  metricsFacts: Array<{ value: string; label: string; source: string }>;
  signatureKicker: string;
  signatureTagline: string;
};

const fx = (key: keyof typeof ROG_FACTS, language: FilmLanguage) => formatFact(ROG_FACTS[key], language);

export const ROG_COPY: Record<FilmLanguage, RogCopy> = {
  es: {
    openingKicker: "Rangel Oviedo Group · Texas Luxury Real Estate",
    openingTagline: "Asesoría privada. *Criterio antes del listado.*",
    residencesKicker: "Curaduría residencial · The Woodlands y Houston",
    residencesTitle: "Arquitectura, privacidad y valor patrimonial",
    residencesBeats: [
      { kicker: "The Woodlands", text: "Entornos privados con *diseño arquitectónico de vanguardia.*" },
      { kicker: "Houston Metro", text: "Acabados de autor y *ubicaciones residenciales de alta demanda.*" },
    ],
    pathsKicker: "Protagonista · El Método Rangel",
    pathsTitle: "Cuatro perfiles, un método de cinco etapas",
    pathsSubtitle: "Antes de mostrar propiedades, filtramos el riesgo.",
    pathsNote: "Diagnóstico guiado por objetivo de capital y estilo de vida en Texas",
    profilesTitle: "Perfiles de decisión",
    methodTitle: "Hoja de ruta estratégica",
    interfaceKicker: "Experiencia interactiva",
    interfaceTitle: "Navegación bilingüe y curaduría sin fricción",
    interfaceNote: "Selector EN/ES en el cliente y catálogo curado de oportunidades residenciales",
    interfaceShots: [
      { label: "Portada residencial en español" },
      { label: "Selector bilingüe instantáneo en inglés" },
      { label: "Catálogo curado con filtro estricto (ejemplo)" },
      { label: "Contacto directo para asesoría privada" },
    ],
    pillarsKicker: "El Equipo Consultor",
    pillarsTitle: "Especialistas coordinados en cada cierre",
    pillarsItems: [
      "Concierge y relocalización familiar",
      "Acceso privado a propiedades fuera de mercado",
      "Viabilidad técnica y evaluación de activos",
      "Acompañamiento legal y escrow bilingüe",
    ],
    metricsKicker: "Lo que hay en producción",
    metricsTitle: "Una asesoría privada, construida en detalle",
    metricsFacts: [
      { value: fx("methodSteps", "es"), label: "Etapas en El Método Rangel", source: "sitio en producción" },
      { value: fx("profiles", "es"), label: "Perfiles en diagnóstico guiado", source: "sitio en producción" },
      { value: fx("pillars", "es"), label: "Pilares del equipo consultor", source: "sitio en producción" },
    ],
    signatureKicker: "Rangel Oviedo Group",
    signatureTagline: "Inmobiliaria privada en Texas.",
  },
  en: {
    openingKicker: "Rangel Oviedo Group · Texas Luxury Real Estate",
    openingTagline: "Private advisory. *Criteria before the listing.*",
    residencesKicker: "Residential curation · The Woodlands & Houston",
    residencesTitle: "Architecture, privacy and asset value",
    residencesBeats: [
      { kicker: "The Woodlands", text: "Private settings with *distinguished architectural design.*" },
      { kicker: "Houston Metro", text: "Bespoke finishes and *high-demand residential enclaves.*" },
    ],
    pathsKicker: "Protagonist · The Rangel Method",
    pathsTitle: "Four profiles, a five-stage method",
    pathsSubtitle: "Before showing properties, we filter the risk.",
    pathsNote: "Guided diagnostic tailored to capital and lifestyle goals in Texas",
    profilesTitle: "Decision profiles",
    methodTitle: "Strategic roadmap",
    interfaceKicker: "Interactive experience",
    interfaceTitle: "Bilingual navigation and frictionless curation",
    interfaceNote: "Client-side EN/ES switcher and curated catalog of residential opportunities",
    interfaceShots: [
      { label: "Residential home in Spanish" },
      { label: "Instant bilingual switcher in English" },
      { label: "Curated catalog with strict filter (sample)" },
      { label: "Direct contact for private advisory" },
    ],
    pillarsKicker: "Consulting Team",
    pillarsTitle: "Dedicated specialists behind each closing",
    pillarsItems: [
      "Family concierge and relocation support",
      "Private access to off-market properties",
      "Technical viability and asset underwriting",
      "Bilingual escrow and closing legal guidance",
    ],
    metricsKicker: "What runs in production",
    metricsTitle: "A private advisory, built in detail",
    metricsFacts: [
      { value: fx("methodSteps", "en"), label: "Stages in The Rangel Method", source: "live site" },
      { value: fx("profiles", "en"), label: "Profiles in guided diagnostic", source: "live site" },
      { value: fx("pillars", "en"), label: "Consulting team pillars", source: "live site" },
    ],
    signatureKicker: "Rangel Oviedo Group",
    signatureTagline: "Private real estate in Texas.",
  },
};
