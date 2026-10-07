import type { FilmLanguage, Localized } from "../filmTypes";
import type { CameraShotSpec } from "@/lib/filmCamera";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de Truckers Choice: "Seguros + permisos, bajo un mismo techo,
 * en dos idiomas".
 *
 * Fuente: el sitio publicado (truckers-choice-web-site.vercel.app, /en y /es)
 * el 2026-10-07: HTML, CSS y paquetes JavaScript públicos, más un recorrido en
 * solo lectura del formulario de cotización. Los clips y las imágenes son los
 * del propio sitio. Ver docs/films/dossiers/truckers-choice.md.
 */

export const TC_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 8 },
  { id: "night", kind: "manifesto", seconds: 13 },
  { id: "bilingual", kind: "bilingual-split", seconds: 20 },
  { id: "roof", kind: "one-roof", seconds: 12 },
  { id: "quote", kind: "camera-reel", seconds: 10 },
  { id: "engineering", kind: "fact-wall", seconds: 8 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const tcTimeline = timelineFrom(TC_SCENES);
export const TC_TIMELINE = tcTimeline.slots;
export const TC_DURATION = tcTimeline.durationInFrames;

/** Cifras del sitio publicado, cada una con la página que la muestra. */
export const TC_FACTS = {
  filings: { value: 30, source: "Dossier · /services: 4 + 5 + 6 + 6 + 4 + 5 \"confirmed filings\"" },
  lines: { value: 6, source: "Dossier · /services, 6 líneas de servicio" },
  offices: { value: 3, source: "Dossier · Medley (FL), Jersey City (NJ) y Elizabeth (NJ)" },
  languages: { value: 2, source: "Dossier · /en y /es con rutas espejo" },
  steps: { value: 4, source: "Dossier · Hoja de ruta de 4 pasos" },
  packages: { value: 3, source: "Dossier · 3 paquetes con \"Quote this plan\"" },
  chapters: { value: 4, source: "Dossier · \"One night on the road\", 4 capítulos" },
} as const satisfies Record<string, FilmFact>;

/**
 * Las 6 líneas del catálogo con sus trámites confirmados y el paso de la hoja
 * de ruta al que pertenecen (texto de cada paso en el sitio: 1 forma la
 * empresa, 2 la autoridad DOT/MC, 3 seguro, placas IRP e IFTA, 4 cumplimiento).
 */
export const TC_LINES = [
  { id: "corp", step: 0, filings: 4, label: { es: "Corporaciones y LLC", en: "Corporations & LLCs" } },
  { id: "authority", step: 1, filings: 5, label: { es: "Autoridad DOT y MC", en: "DOT & MC Authority" } },
  { id: "irp", step: 2, filings: 6, label: { es: "IRP, Placas y Títulos", en: "IRP, Plates & Titles" } },
  { id: "permits", step: 2, filings: 6, label: { es: "Permisos y Combustible", en: "Permits & Fuel Tax" } },
  { id: "insurance", step: 2, filings: 4, label: { es: "Seguro de Camiones", en: "Truck Insurance" } },
  { id: "compliance", step: 3, filings: 5, label: { es: "Cumplimiento DOT", en: "DOT Compliance & Audits" } },
] as const satisfies ReadonlyArray<{ id: string; step: number; filings: number; label: Localized }>;

const BRAND = "/portfolio/brands/truckers-choice";

/** Medidas nativas (el test las compara con los archivos; la cámara nunca las amplía). */
export const TC_ASSETS = {
  /** Clips del sitio (6 s, 1280×720): el hero y tres capítulos del relato. */
  hero: { src: `${BRAND}/hero-loop.mp4`, webm: `${BRAND}/hero-loop.webm`, w: 1280, h: 720, fps: 30, seconds: 6 },
  heroPoster: { src: `${BRAND}/hero-loop-poster.jpg`, w: 1280, h: 720 },
  storm: { src: `${BRAND}/story-night-risk.mp4`, webm: `${BRAND}/story-night-risk.webm`, w: 1280, h: 720, fps: 30, seconds: 6 },
  stormPoster: { src: `${BRAND}/story-night-risk-poster.jpg`, w: 1280, h: 720 },
  /** Recorte 16:9 de la imagen del capítulo 2 (el conductor con el papeleo). */
  paperwork: { src: `${BRAND}/story-cab-paperwork.jpg`, w: 1122, h: 631 },
  network: { src: `${BRAND}/story-network.mp4`, webm: `${BRAND}/story-network.webm`, w: 1280, h: 720, fps: 30, seconds: 6 },
  networkPoster: { src: `${BRAND}/story-network-poster.jpg`, w: 1280, h: 720 },
  sunrise: { src: `${BRAND}/story-sunrise.mp4`, webm: `${BRAND}/story-sunrise.webm`, w: 1280, h: 720, fps: 30, seconds: 6 },
  sunrisePoster: { src: `${BRAND}/story-sunrise-poster.jpg`, w: 1280, h: 720 },
} as const satisfies Record<string, FilmAsset>;

export const TC_HOST = "truckers-choice-web-site.vercel.app";

const L = (es: string, en: string): Localized => ({ es, en });

export const TC_CHAPTERS: FlagshipChapter[] = [
  {
    id: "road",
    label: L("La ruta", "The road"),
    caption: L(
      "Truckers Choice: seguros, permisos y cumplimiento para transportistas. El sitio abre con una noche en la ruta, en cuatro capítulos.",
      "Truckers Choice: insurance, permits and compliance for truckers. The site opens with one night on the road, in four chapters.",
    ),
    from: 0,
    durationInFrames: TC_TIMELINE.bilingual.from,
  },
  {
    id: "bilingual",
    label: L("Dos idiomas", "Two languages"),
    caption: L(
      "El mismo sitio en inglés y en español: mismo diseño, mismas rutas (/en y /es), frase por frase.",
      "The same site in English and Spanish: same design, same routes (/en and /es), line by line.",
    ),
    from: TC_TIMELINE.bilingual.from,
    durationInFrames: TC_TIMELINE.bilingual.duration,
  },
  {
    id: "one-roof",
    label: L("Un solo techo", "One roof"),
    caption: L(
      "Seis líneas de servicio y 30 trámites confirmados, ordenados en la hoja de ruta de cuatro pasos.",
      "Six service lines and 30 confirmed filings, laid out on the four-step roadmap.",
    ),
    from: TC_TIMELINE.roof.from,
    durationInFrames: TC_TIMELINE.roof.duration,
  },
  {
    id: "quote",
    label: L("La cotización", "The quote"),
    caption: L(
      "Cada paquete enlaza a la cotización: tres pasos, de lo que hay que resolver a cómo contactarte. Hoy está en modo vista previa.",
      "Each package links to the quote: three steps, from what needs solving to how to reach you. It is in preview mode today.",
    ),
    from: TC_TIMELINE.quote.from,
    durationInFrames: TC_TIMELINE.quote.duration,
  },
  {
    id: "closing",
    label: L("Ingeniería y firma", "Engineering & signature"),
    caption: L("Cifras contadas en el sitio en producción.", "Figures counted on the live site."),
    from: TC_TIMELINE.engineering.from,
    durationInFrames: TC_TIMELINE.engineering.duration + TC_TIMELINE.signature.duration,
  },
];

/** Paradas del recorrido bilingüe: la misma sección capturada en /en y en /es (1920×1200). */
export type TcBilingualStop = { id: "hero" | "roof" | "offices"; en: FilmAsset; es: FilmAsset };

const capture = (name: string): FilmAsset => ({ src: `${BRAND}/shots/${name}.jpg`, w: 1920, h: 1200 });

export const TC_BILINGUAL: TcBilingualStop[] = [
  { id: "hero", en: capture("en-hero"), es: capture("es-hero") },
  { id: "roof", en: capture("en-roof"), es: capture("es-roof") },
  { id: "offices", en: capture("en-offices"), es: capture("es-offices") },
];

const quote = (name: string): FilmAsset => ({ src: `${BRAND}/shots/${name}.jpg`, w: 1920, h: 1080 });

/** Capturas de la cotización por idioma (1920×1080): los paquetes y los 3 pasos del formulario. */
export const TC_QUOTE_ASSETS: Record<FilmLanguage, Record<"quote0" | "quote1" | "quote2" | "quote3", FilmAsset>> = {
  en: { quote0: quote("en-quote-0"), quote1: quote("en-quote-1"), quote2: quote("en-quote-2"), quote3: quote("en-quote-3") },
  es: { quote0: quote("es-quote-0"), quote1: quote("es-quote-1"), quote2: quote("es-quote-2"), quote3: quote("es-quote-3") },
};

/**
 * Tomas de la cotización. Los rectángulos (fracciones de 1920×1080, medidos
 * sobre las capturas) marcan el paquete "Prepare to Operate", la línea
 * elegida, los datos de la operación (de ejemplo) y el aviso de vista previa.
 */
export function tcQuoteShots(language: FilmLanguage): CameraShotSpec[] {
  // La barra muestra la página (el enlace del paquete le agrega ?package=…).
  const contact = `/${language}/contact`;
  return [
    { name: "quote0", path: `/${language}`, from: 0, duration: 75, keys: [{ at: 0, scale: 1, fx: 0.5, fy: 0.5 }, { at: 44, scale: 1, fx: 0.5, fy: 0.5 }], notes: [{ key: "packages", from: 14, to: 70, rect: [0.49, 0.455, 0.49, 0.43] }] },
    { name: "quote1", path: contact, from: 75, duration: 75, keys: [{ at: 0, scale: 1, fx: 0.4, fy: 0.5 }, { at: 44, scale: 1.2, fx: 0.32, fy: 0.55 }], notes: [{ key: "service", from: 14, to: 70, rect: [0.09, 0.535, 0.3, 0.11] }] },
    { name: "quote2", path: contact, from: 150, duration: 75, keys: [{ at: 0, scale: 1, fx: 0.4, fy: 0.5 }, { at: 44, scale: 1.2, fx: 0.38, fy: 0.5 }], notes: [{ key: "operation", from: 14, to: 70, rect: [0.09, 0.35, 0.585, 0.29] }] },
    { name: "quote3", path: contact, from: 225, duration: 75, keys: [{ at: 0, scale: 1, fx: 0.4, fy: 0.5 }, { at: 44, scale: 1.2, fx: 0.38, fy: 0.6 }], notes: [{ key: "preview", from: 14, to: 70, rect: [0.09, 0.6, 0.58, 0.105] }] },
  ];
}

export type TcCopy = {
  openingKicker: string;
  openingTagline: string;
  nightBeats: Array<{ kicker: string; text: string }>;
  bilingualKicker: string;
  bilingualTitle: string;
  bilingualStops: Record<TcBilingualStop["id"], { kicker: string; text: string }>;
  routes: Array<{ en: string; es: string }>;
  roofKicker: string;
  roofTitle: string;
  roofSteps: string[];
  filingsLabel: string;
  roofTotal: string;
  quoteKicker: string;
  quoteTitle: string;
  quoteNotes: Record<"packages" | "service" | "operation" | "preview", string>;
  quoteNote: string;
  engineeringKicker: string;
  engineeringTitle: string;
  engineeringFacts: Array<{ value: string; label: string; source: string }>;
};

const fx = (key: keyof typeof TC_FACTS, language: FilmLanguage) => formatFact(TC_FACTS[key], language);

/** Rutas espejo reales del sitio (mismos segmentos en los dos idiomas). */
const ROUTES = [
  { en: "/en/services/truck-insurance", es: "/es/services/truck-insurance" },
  { en: "/en/packages", es: "/es/packages" },
  { en: "/en/contact", es: "/es/contact" },
];

export const TC_COPY: Record<FilmLanguage, TcCopy> = {
  es: {
    openingKicker: "Truckers Choice · Seguros y permisos · FL y NJ",
    openingTagline: "Seguros + permisos. *Todo en un solo lugar.*",
    nightBeats: [
      { kicker: "Capítulo 01 / 04", text: "La tormenta no pregunta *si estás cubierto.*" },
      { kicker: "Capítulo 02 / 04", text: "El papeleo viaja contigo. *Hasta que alguien te lo quita.*" },
      { kicker: "Capítulo 03 / 04", text: "Detrás de cada milla, *una oficina que contesta.*" },
      { kicker: "Capítulo 04 / 04", text: "Y la carretera *vuelve a abrirse.*" },
    ],
    bilingualKicker: "Dos idiomas · rutas espejo",
    bilingualTitle: "El mismo sitio, en inglés y en español",
    bilingualStops: {
      hero: { kicker: "Portada", text: "Misma promesa, frase por frase" },
      roof: { kicker: "Un solo techo", text: "El mismo catálogo, en los dos idiomas" },
      offices: { kicker: "Oficinas", text: "Tres oficinas, un mismo equipo bilingüe" },
    },
    routes: ROUTES,
    roofKicker: "Un solo techo",
    roofTitle: "Seis líneas, treinta trámites, cuatro pasos",
    roofSteps: ["Forma tu empresa", "Obtén tu autoridad", "Seguro y permisos", "Mantente en cumplimiento"],
    filingsLabel: "trámites",
    roofTotal: "trámites confirmados bajo un mismo techo",
    quoteKicker: "Cotización",
    quoteTitle: "Del plan al formulario, en tres pasos",
    quoteNotes: { packages: "Paquete · Prepárate para Operar", service: "Paso 1 · Seguro de Camiones", operation: "Paso 2 · la operación (ejemplo)", preview: "Paso 3 · modo vista previa: no envía nada" },
    quoteNote: "Sitio en vivo con datos de ejemplo · el formulario está en modo vista previa y no envía nada",
    engineeringKicker: "Lo que hay en producción",
    engineeringTitle: "Un catálogo ordenado, en dos idiomas",
    engineeringFacts: [
      { value: fx("filings", "es"), label: "Trámites confirmados en el catálogo", source: "sitio en producción" },
      { value: fx("lines", "es"), label: "Líneas de servicio conectadas", source: "sitio en producción" },
      { value: fx("steps", "es"), label: "Pasos en la hoja de ruta", source: "sitio en producción" },
      { value: fx("packages", "es"), label: "Paquetes que cotizan con su plan", source: "sitio en producción" },
      { value: fx("offices", "es"), label: "Oficinas: Medley, Jersey City y Elizabeth", source: "sitio en producción" },
      { value: fx("languages", "es"), label: "Idiomas con rutas espejo: /en y /es", source: "sitio en producción" },
    ],
  },
  en: {
    openingKicker: "Truckers Choice · Insurance & permits · FL & NJ",
    openingTagline: "Insurance + permits. *One roof.*",
    nightBeats: [
      { kicker: "Chapter 01 / 04", text: "The storm doesn't ask *if you're covered.*" },
      { kicker: "Chapter 02 / 04", text: "The paperwork rides with you. *Until someone takes it.*" },
      { kicker: "Chapter 03 / 04", text: "Behind every mile, *an office that answers.*" },
      { kicker: "Chapter 04 / 04", text: "And the road *opens again.*" },
    ],
    bilingualKicker: "Two languages · mirrored routes",
    bilingualTitle: "The same site, in English and Spanish",
    bilingualStops: {
      hero: { kicker: "Home", text: "Same promise, line by line" },
      roof: { kicker: "One roof", text: "The same catalog, in both languages" },
      offices: { kicker: "Offices", text: "Three offices, one bilingual team" },
    },
    routes: ROUTES,
    roofKicker: "One roof",
    roofTitle: "Six lines, thirty filings, four steps",
    roofSteps: ["Form your business", "Get your authority", "Insurance & permits", "Stay in compliance"],
    filingsLabel: "filings",
    roofTotal: "confirmed filings under one roof",
    quoteKicker: "Quote",
    quoteTitle: "From the plan to the form, in three steps",
    quoteNotes: { packages: "Package · Prepare to Operate", service: "Step 1 · Truck Insurance", operation: "Step 2 · the operation (sample)", preview: "Step 3 · preview mode: nothing is sent" },
    quoteNote: "Live site with sample data · the form is in preview mode and sends nothing",
    engineeringKicker: "What runs in production",
    engineeringTitle: "An organized catalog, in two languages",
    engineeringFacts: [
      { value: fx("filings", "en"), label: "Confirmed filings in the catalog", source: "live site" },
      { value: fx("lines", "en"), label: "Connected service lines", source: "live site" },
      { value: fx("steps", "en"), label: "Steps on the roadmap", source: "live site" },
      { value: fx("packages", "en"), label: "Packages that quote with their plan", source: "live site" },
      { value: fx("offices", "en"), label: "Offices: Medley, Jersey City and Elizabeth", source: "live site" },
      { value: fx("languages", "en"), label: "Languages with mirrored routes: /en and /es", source: "live site" },
    ],
  },
};
