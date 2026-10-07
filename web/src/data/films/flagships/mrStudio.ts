import type { FilmLanguage, Localized } from "../filmTypes";
import type { CameraShotSpec } from "@/lib/filmCamera";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de Mr. Studio Tattoo: "Del tatuaje que imaginás a la agenda
 * del artista".
 *
 * Fuente: la versión publicada en mrstudiotattoo.com (2026-10-07), recorrida
 * en solo lectura con datos de ejemplo hasta el paso 7, y los textos de su
 * paquete JavaScript público para los pasos que siguen (fecha y hora,
 * consentimiento y revisión). Ver docs/films/dossiers/mr-studio.md.
 *
 * La versión roja de los repos locales (MrTatto) no es la publicada y no se
 * usa en el film. El clip de la apertura es metraje del propio estudio (la
 * secuencia del hero que guardan sus repos).
 */

export const MR_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 8 },
  { id: "studio", kind: "manifesto", seconds: 9 },
  { id: "bodyMap", kind: "body-selector", seconds: 21 },
  { id: "flow", kind: "shot-stack", seconds: 11 },
  { id: "consent", kind: "consent-split", seconds: 10 },
  { id: "engineering", kind: "fact-wall", seconds: 8 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const mrTimeline = timelineFrom(MR_SCENES);
export const MR_TIMELINE = mrTimeline.slots;
export const MR_DURATION = mrTimeline.durationInFrames;

/** Cifras del sitio en vivo, cada una con la pantalla que la muestra. */
export const MR_FACTS = {
  steps: { value: 10, source: "Dossier · Reserva en vivo (\"Paso 1 de 10\")" },
  artists: { value: 6, source: "Dossier · Paso 3, Elige tu artista" },
  frontZones: { value: 24, source: "Dossier · Paso 5, zonas de la vista de frente" },
  sizes: { value: 3, source: "Dossier · Paso 4, Tamaño de la obra" },
  services: { value: 2, source: "Dossier · Paso 2, Tatuaje o Piercing" },
  consentPaths: { value: 2, source: "Dossier · Consentimiento digital o notarizado" },
  languages: { value: 2, source: "Dossier · Sitio en español e inglés" },
  topExperience: { value: 8, source: "Dossier · Paso 3 (Ramsés 'El Faraón', 8+ años)" },
} as const satisfies Record<string, FilmFact>;

const BRAND = "/portfolio/brands/mr-studio-tattoo";

/** Medidas nativas (el test las compara con los archivos; la cámara nunca las amplía). */
export const MR_ASSETS = {
  /** Metraje del estudio: una rosa realista tatuada en un antebrazo (11,3 s, vertical). */
  hero: { src: `${BRAND}/hero-rosa.mp4`, webm: `${BRAND}/hero-rosa.webm`, w: 720, h: 1280, fps: 30, seconds: 11.33 },
  heroPoster: { src: `${BRAND}/hero-rosa-poster.jpg`, w: 720, h: 1280 },
  /** Los seis artistas, recortados de la captura del paso 3. */
  artists: { src: `${BRAND}/shots/artistas.jpg`, w: 1476, h: 1040 },
  /** Paso 5 a 2×: sin zona, con el antebrazo marcado y la vista de espalda. */
  zone: { src: `${BRAND}/shots/live-5-zona.jpg`, w: 1920, h: 2200 },
  zoneForearm: { src: `${BRAND}/shots/live-5-zona-antebrazo.jpg`, w: 1920, h: 2200 },
  zoneBack: { src: `${BRAND}/shots/live-5-zona-espalda.jpg`, w: 1920, h: 2200 },
  stepAge: { src: `${BRAND}/shots/live-1-edad.jpg`, w: 1920, h: 2200 },
  stepService: { src: `${BRAND}/shots/live-2-servicio.jpg`, w: 1920, h: 2200 },
  stepArtist: { src: `${BRAND}/shots/live-3-artista.jpg`, w: 1920, h: 2200 },
  stepSize: { src: `${BRAND}/shots/live-4-tamano.jpg`, w: 1920, h: 2200 },
  stepConcept: { src: `${BRAND}/shots/live-6-concepto.jpg`, w: 1920, h: 2200 },
} as const satisfies Record<string, FilmAsset>;

export const MR_HOST = "mrstudiotattoo.com";

/**
 * Tomas de la reserva (una pregunta por pantalla). Los rectángulos marcan la
 * respuesta elegida en cada captura (fracciones de 1920×2200, medidas sobre la
 * captura): el aviso de la edad, la tarjeta "Tatuaje", la de Ramsés, "Mediano"
 * y el campo del concepto.
 */
export const MR_FLOW_SHOTS: CameraShotSpec[] = [
  { name: "stepAge", path: "/booking", from: 0, duration: 66, keys: [{ at: 0, scale: 1, fx: 0.5, fy: 0.3 }, { at: 40, scale: 1.25, fx: 0.5, fy: 0.42 }], notes: [{ key: "age", from: 16, to: 60, rect: [0.262, 0.492, 0.457, 0.055] }] },
  { name: "stepService", path: "/booking", from: 66, duration: 66, keys: [{ at: 0, scale: 1, fx: 0.5, fy: 0.3 }, { at: 40, scale: 1.25, fx: 0.42, fy: 0.37 }], notes: [{ key: "service", from: 16, to: 60, rect: [0.145, 0.337, 0.34, 0.097] }] },
  { name: "stepArtist", path: "/booking", from: 132, duration: 66, keys: [{ at: 0, scale: 1, fx: 0.5, fy: 0.42 }, { at: 40, scale: 1.2, fx: 0.4, fy: 0.55 }], notes: [{ key: "artist", from: 16, to: 60, rect: [0.12, 0.55, 0.18, 0.21] }] },
  { name: "stepSize", path: "/booking", from: 198, duration: 66, keys: [{ at: 0, scale: 1, fx: 0.5, fy: 0.3 }, { at: 40, scale: 1.25, fx: 0.5, fy: 0.37 }], notes: [{ key: "size", from: 16, to: 60, rect: [0.38, 0.337, 0.22, 0.093] }] },
  { name: "stepConcept", path: "/booking", from: 264, duration: 66, keys: [{ at: 0, scale: 1, fx: 0.5, fy: 0.32 }, { at: 40, scale: 1.2, fx: 0.5, fy: 0.42 }], notes: [{ key: "concept", from: 16, to: 60, rect: [0.145, 0.355, 0.685, 0.12] }] },
];

/**
 * Geometría de la figura en las capturas del paso 5 (px de la captura a 2×):
 * la ventana con el selector Frente/Espalda, la figura y el chip de la zona;
 * y el antebrazo izquierdo, donde la cámara se acerca.
 */
export const MR_BODY = {
  window: { x: 384, y: 700, w: 1152, h: 1460 },
  forearm: { x: 788, y: 1347 },
} as const;

const L = (es: string, en: string): Localized => ({ es, en });

export const MR_CHAPTERS: FlagshipChapter[] = [
  {
    id: "studio",
    label: L("El estudio", "The studio"),
    caption: L(
      "Mr. Studio Tattoo, en La Pequeña Habana de Miami: seis artistas residentes, cada uno con su agenda.",
      "Mr. Studio Tattoo, in Miami's Little Havana: six resident artists, each with their own calendar.",
    ),
    from: 0,
    durationInFrames: MR_TIMELINE.bodyMap.from,
  },
  {
    id: "body",
    label: L("Zona del cuerpo", "Body placement"),
    caption: L(
      "El paso 5 es una figura anatómica: se toca la zona de la pieza, de frente o de espalda (datos de ejemplo).",
      "Step 5 is an anatomical figure: you tap where the piece goes, front or back (sample data).",
    ),
    from: MR_TIMELINE.bodyMap.from,
    durationInFrames: MR_TIMELINE.bodyMap.duration,
  },
  {
    id: "booking",
    label: L("La reserva", "The booking"),
    caption: L(
      "Diez pasos guiados: edad, servicio, artista, tamaño, zona, concepto, datos, fecha y hora, consentimiento y revisión.",
      "Ten guided steps: age, service, artist, size, placement, concept, details, date and time, consent and review.",
    ),
    from: MR_TIMELINE.flow.from,
    durationInFrames: MR_TIMELINE.flow.duration,
  },
  {
    id: "consent",
    label: L("Consentimiento", "Consent"),
    caption: L(
      "La edad decide el camino: consentimiento digital para adultos; notarizado y con tutor para menores.",
      "Age decides the path: digital consent for adults; notarized and with a guardian for minors.",
    ),
    from: MR_TIMELINE.consent.from,
    durationInFrames: MR_TIMELINE.consent.duration,
  },
  {
    id: "closing",
    label: L("Ingeniería y firma", "Engineering & signature"),
    caption: L("Cifras contadas en el sitio en producción.", "Figures counted on the live site."),
    from: MR_TIMELINE.engineering.from,
    durationInFrames: MR_TIMELINE.engineering.duration + MR_TIMELINE.signature.duration,
  },
];

export type MrBriefRow = { label: string; value: string };

export type MrCopy = {
  openingKicker: string;
  openingTagline: string;
  studioBeats: Array<{ kicker: string; text: string }>;
  studioCaption: { kicker: string; text: string };
  bodyKicker: string;
  bodyTitle: string;
  briefTitle: string;
  sampleLabel: string;
  /** Respuestas de los pasos previos a la zona (datos de ejemplo). */
  briefBefore: MrBriefRow[];
  /** La zona elegida en la figura y lo que sigue. */
  briefZone: MrBriefRow;
  briefAfter: MrBriefRow[];
  briefNext: string;
  frontLabel: string;
  backLabel: string;
  flowKicker: string;
  flowTitle: string;
  /** Rótulo de cada nota de la reserva (va en la barra de la ventana). */
  flowNotes: Record<"age" | "service" | "artist" | "size" | "concept", string>;
  flowNote: string;
  consentKicker: string;
  consentTitle: string;
  consentRoot: string;
  consentAdult: { title: string; lines: string[] };
  consentMinor: { title: string; lines: string[] };
  engineeringKicker: string;
  engineeringTitle: string;
  engineeringFacts: Array<{ value: string; label: string; source: string }>;
};

const fx = (key: keyof typeof MR_FACTS, language: FilmLanguage) => formatFact(MR_FACTS[key], language);

export const MR_COPY: Record<FilmLanguage, MrCopy> = {
  es: {
    openingKicker: "Mr. Studio Tattoo · La Pequeña Habana, Miami",
    openingTagline: "Del tatuaje que imaginás *a la agenda del artista.*",
    studioBeats: [
      { kicker: "Seis artistas residentes", text: "Cada uno con *su propia agenda.*" },
      { kicker: "La reserva", text: "*Diez pasos,* una pregunta por pantalla." },
      { kicker: "El consentimiento", text: "Resuelto *antes* de la sesión." },
    ],
    studioCaption: { kicker: "Paso 3 · Elige tu artista", text: "De 5 a 8+ años de oficio" },
    bodyKicker: "Paso 5 · Zona del cuerpo",
    bodyTitle: "El cuerpo es el formulario",
    briefTitle: "Brief para el artista",
    sampleLabel: "Datos de ejemplo",
    briefBefore: [
      { label: "Edad", value: "31 · consentimiento digital" },
      { label: "Servicio", value: "Tatuaje" },
      { label: "Artista", value: "Ramsés 'El Faraón' · 8+ años" },
      { label: "Tamaño", value: "Mediano · 8–15 cm · 2–3 h" },
    ],
    briefZone: { label: "Zona", value: "Antebrazo · Izq" },
    briefAfter: [{ label: "Concepto", value: "Rosa realista, negro y rojo" }],
    briefNext: "Después: fecha y hora con el artista; el depósito se cobra al confirmar.",
    frontLabel: "Frente",
    backLabel: "Espalda",
    flowKicker: "Reserva en 10 pasos",
    flowTitle: "Una pregunta por pantalla",
    flowNotes: { age: "Paso 1 · la edad, calculada", service: "Paso 2 · Tatuaje", artist: "Paso 3 · Ramsés, 8+ años", size: "Paso 4 · Mediano, 2–3 h", concept: "Paso 6 · la idea, en palabras" },
    flowNote: "Sitio en vivo con datos de ejemplo · el recorrido se detuvo antes de los datos de contacto",
    consentKicker: "Consentimiento",
    consentTitle: "La edad decide el camino",
    consentRoot: "Fecha de nacimiento · paso 1",
    consentAdult: { title: "Mayor de edad", lines: ["Consentimiento digital", "Firmado como: su nombre", "Cita confirmada + archivo .ics"] },
    consentMinor: { title: "Menor de edad", lines: ["Consentimiento notarizado", "Tutor presente en toda la sesión", "Solicitud pendiente de verificación"] },
    engineeringKicker: "Lo que hay en producción",
    engineeringTitle: "Una reserva que ya califica",
    engineeringFacts: [
      { value: `${fx("steps", "es")} pasos`, label: "Reserva guiada, una pregunta por pantalla", source: "sitio en producción" },
      { value: fx("artists", "es"), label: "Artistas residentes, con su agenda", source: "sitio en producción" },
      { value: fx("frontZones", "es"), label: "Zonas tocables en la vista de frente", source: "sitio en producción" },
      { value: fx("sizes", "es"), label: "Tamaños con su tiempo de sesión", source: "sitio en producción" },
      { value: fx("consentPaths", "es"), label: "Caminos de consentimiento: digital o notarizado", source: "sitio en producción" },
      { value: fx("languages", "es"), label: "Idiomas: español e inglés", source: "sitio en producción" },
    ],
  },
  en: {
    openingKicker: "Mr. Studio Tattoo · Little Havana, Miami",
    openingTagline: "From the tattoo you imagine *to the artist's calendar.*",
    studioBeats: [
      { kicker: "Six resident artists", text: "Each one with *their own calendar.*" },
      { kicker: "The booking", text: "*Ten steps,* one question per screen." },
      { kicker: "The consent", text: "Settled *before* the session." },
    ],
    studioCaption: { kicker: "Step 3 · Choose your artist", text: "From 5 to 8+ years in the craft" },
    bodyKicker: "Step 5 · Body placement",
    bodyTitle: "The body is the form",
    briefTitle: "Brief for the artist",
    sampleLabel: "Sample data",
    briefBefore: [
      { label: "Age", value: "31 · digital consent" },
      { label: "Service", value: "Tattoo" },
      { label: "Artist", value: "Ramsés 'El Faraón' · 8+ yrs" },
      { label: "Size", value: "Medium · 8–15 cm · 2–3 h" },
    ],
    briefZone: { label: "Placement", value: "Forearm · Left" },
    briefAfter: [{ label: "Concept", value: "Realistic rose, black and red" }],
    briefNext: "Next: date and time with the artist; the deposit is charged on confirmation.",
    frontLabel: "Front",
    backLabel: "Back",
    flowKicker: "10-step booking",
    flowTitle: "One question per screen",
    flowNotes: { age: "Step 1 · age, worked out", service: "Step 2 · Tattoo", artist: "Step 3 · Ramsés, 8+ yrs", size: "Step 4 · Medium, 2–3 h", concept: "Step 6 · the idea, in words" },
    flowNote: "Live site with sample data · the walkthrough stopped before contact details",
    consentKicker: "Consent",
    consentTitle: "Age decides the path",
    consentRoot: "Date of birth · step 1",
    consentAdult: { title: "Adult", lines: ["Digital consent", "Signed as: their name", "Confirmed + .ics file"] },
    consentMinor: { title: "Minor", lines: ["Notarized consent", "Guardian present all session", "Request pending verification"] },
    engineeringKicker: "What runs in production",
    engineeringTitle: "A booking that already qualifies",
    engineeringFacts: [
      { value: `${fx("steps", "en")} steps`, label: "Guided booking, one question per screen", source: "live site" },
      { value: fx("artists", "en"), label: "Resident artists, each with a calendar", source: "live site" },
      { value: fx("frontZones", "en"), label: "Tappable zones on the front view", source: "live site" },
      { value: fx("sizes", "en"), label: "Sizes with their session time", source: "live site" },
      { value: fx("consentPaths", "en"), label: "Consent paths: digital or notarized", source: "live site" },
      { value: fx("languages", "en"), label: "Languages: Spanish and English", source: "live site" },
    ],
  },
};
