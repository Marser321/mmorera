import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de Fenix Medical Center: "Donde tu salud renace".
 *
 * Fuente de cada dato: docs/films/dossiers/fenix.md, verificado contra el repo
 * del cliente (D:\fenix group) el 2026-10-06. Lo publicable lo autorizó Mario:
 * sitio + arquitectura + GHL, investigación y evidencia, fábrica de contenido y
 * proceso de ingeniería. Nunca: testimonios, datos de pacientes, contenido de
 * FENIX OS, costos, nómina, contratos ni precios.
 */

export const FENIX_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 7 },
  { id: "mechanism", kind: "mechanism", seconds: 13 },
  { id: "evidence", kind: "evidence-ledger", seconds: 8.5 },
  { id: "positioning", kind: "manifesto", seconds: 9 },
  { id: "site", kind: "site-booking", seconds: 9.5 },
  { id: "architecture", kind: "architecture", seconds: 11.5 },
  { id: "brain", kind: "keyword-search", seconds: 10 },
  { id: "engineering", kind: "fact-wall", seconds: 6.5 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const fenixTimeline = timelineFrom(FENIX_SCENES);
export const FENIX_TIMELINE = fenixTimeline.slots;
export const FENIX_DURATION = fenixTimeline.durationInFrames;

/** Cifras publicadas, cada una con la línea del dossier que la respalda. */
export const FENIX_FACTS = {
  // "Investigación y evidencia": 25 prompts en 6 líneas, unos 46 informes y unas 224k palabras.
  researchPrompts: { value: 25, source: "Dossier · Investigación y evidencia" },
  researchLines: { value: 6, source: "Dossier · Investigación y evidencia" },
  researchReports: { value: 46, source: "Dossier · Investigación y evidencia (aprox.)" },
  researchWordsK: { value: 224, source: "Dossier · Investigación y evidencia (aprox., miles)" },
  // "Registro de afirmaciones: 109 claims (14 de HBOT, 16 de edad biológica, 18 de GLP-1…)".
  claims: { value: 109, source: "Dossier · Registro de afirmaciones" },
  claimsHbot: { value: 14, source: "Dossier · Registro de afirmaciones" },
  claimsBioAge: { value: 16, source: "Dossier · Registro de afirmaciones" },
  claimsGlp1: { value: 18, source: "Dossier · Registro de afirmaciones" },
  // HBOT: la señal aparece en protocolos de 40–60 sesiones.
  sessionsMin: { value: 40, source: "Dossier · HBOT" },
  sessionsMax: { value: 60, source: "Dossier · HBOT" },
  // "Sitio y CRM": 20 destinos × 2 idiomas, 7 campos, WAF 5 req / 10 min, 6 campos custom.
  pages: { value: 40, source: "Dossier · Sitio y CRM (20 destinos × 2 idiomas)" },
  leadFields: { value: 7, source: "Dossier · Sitio y CRM (ADR-058/189)" },
  wafRequests: { value: 5, source: "Dossier · Sitio y CRM (WAF de Vercel)" },
  wafMinutes: { value: 10, source: "Dossier · Sitio y CRM (WAF de Vercel)" },
  customFields: { value: 6, source: "Dossier · Sitio y CRM (GHL)" },
  bookingSteps: { value: 3, source: "Capturas de la reserva (día, hora, datos)" },
  // "Fábrica de contenido": 6 canales, 1.096 videos, 8.034 fragmentos, 4,33 M de palabras, 5 herramientas MCP.
  channels: { value: 6, source: "Dossier · Fábrica de contenido" },
  videos: { value: 1096, source: "Dossier · Fábrica de contenido (SQLite FTS5)" },
  fragments: { value: 8034, source: "Dossier · Fábrica de contenido (SQLite FTS5)" },
  wordsM: { value: 4.33, decimals: 2, source: "Dossier · Fábrica de contenido (4,33 M, no 4,4 M)" },
  mcpTools: { value: 5, source: "Dossier · Fábrica de contenido (servidor MCP)" },
  scripts: { value: 28, source: "Dossier · Producción" },
  scriptsReels: { value: 8, source: "Dossier · Producción" },
  scriptsEducational: { value: 5, source: "Dossier · Producción" },
  scriptsVsl: { value: 3, source: "Dossier · Producción" },
  scriptsAds: { value: 12, source: "Dossier · Producción" },
  hooks: { value: 53, source: "Dossier · Producción" },
  // "Ingeniería": 221 ADR, QA 98/98 (2026-10-03, 44 rutas), 407 commits, 79 specs de Playwright.
  adr: { value: 221, source: "Dossier · Ingeniería" },
  qaChecks: { value: 98, source: "Dossier · Ingeniería (QA de producción, 2026-10-03)" },
  qaRoutes: { value: 44, source: "Dossier · Ingeniería (QA de producción)" },
  commits: { value: 407, source: "Dossier · Ingeniería (2026-08-09 → 2026-10-02)" },
  specs: { value: 79, source: "Dossier · Ingeniería (Playwright)" },
} as const satisfies Record<string, FilmFact>;

export type FenixFactKey = keyof typeof FENIX_FACTS;

/** Una cifra formateada en el idioma del film ("1.096" / "1,096"). */
export const fx = (key: FenixFactKey, language: FilmLanguage) => formatFact(FENIX_FACTS[key], language);

const BRAND = "/portfolio/brands/fenix-medical-center";

/** Medidas nativas medidas con ffprobe / sharp (el film nunca las amplía). */
export const FENIX_ASSETS = {
  corridor: { src: `${BRAND}/scenes/amb-00-umbral-apertura-v2--16x9.mp4`, webm: `${BRAND}/scenes/amb-00-umbral-apertura-v2--16x9.webm`, w: 1920, h: 1080, fps: 24, seconds: 10 },
  corridorPoster: { src: `${BRAND}/scenes/amb-00-umbral-apertura-v2--16x9-poster.webp`, w: 1920, h: 1080 },
  chamber: { src: `${BRAND}/scenes/hdr-v1-tratamientos-camara-hiperbarica--16x9.mp4`, webm: `${BRAND}/scenes/hdr-v1-tratamientos-camara-hiperbarica--16x9.webm`, w: 1920, h: 1080, fps: 30, seconds: 10 },
  chamberPoster: { src: `${BRAND}/scenes/hdr-v1-tratamientos-camara-hiperbarica--16x9-poster.webp`, w: 1920, h: 1080 },
  mechanismPlasma: { src: `${BRAND}/scenes/mec-hbot-02-plasma-saturado.webp`, w: 1280, h: 720 },
  mechanismDiffusion: { src: `${BRAND}/scenes/mec-hbot-05-difusion-tisular.webp`, w: 1280, h: 720 },
  mechanismAngiogenesis: { src: `${BRAND}/scenes/mec-hbot-08-angiogenesis.webp`, w: 1280, h: 720 },
  siteHbot: { src: `${BRAND}/shots/site-hbot.jpg`, w: 1600, h: 906 },
  bookingDay: { src: `${BRAND}/shots/booking-1-dia.png`, w: 488, h: 636 },
  bookingTime: { src: `${BRAND}/shots/booking-2-hora.png`, w: 488, h: 418 },
  bookingDetails: { src: `${BRAND}/shots/booking-3-datos.png`, w: 488, h: 791 },
} as const satisfies Record<string, FilmAsset>;

export const FENIX_HOST = "fenixmedicalcenters.com";

const L = (es: string, en: string): Localized => ({ es, en });

export const FENIX_CHAPTERS: FlagshipChapter[] = [
  {
    id: "opening",
    label: L("Renacer", "Rebirth"),
    caption: L(
      "Fenix Medical Center une atención primaria, longevidad y recuperación bajo supervisión médica. El encargo: sitio bilingüe, CRM y una fábrica de contenido.",
      "Fenix Medical Center combines primary care, longevity and recovery under medical supervision. The brief: a bilingual site, a CRM and a content factory.",
    ),
    from: 0,
    durationInFrames: FENIX_TIMELINE.mechanism.from,
  },
  {
    id: "research",
    label: L("La investigación", "The research"),
    caption: L(
      "Antes del diseño, la evidencia: 25 prompts de investigación en 6 líneas y un registro de 109 afirmaciones con redacción permitida y prohibida.",
      "Before design, the evidence: 25 research prompts across 6 lines and a registry of 109 claims with permitted and prohibited wording.",
    ),
    from: FENIX_TIMELINE.mechanism.from,
    durationInFrames: FENIX_TIMELINE.positioning.from - FENIX_TIMELINE.mechanism.from,
  },
  {
    id: "positioning",
    label: L("Posicionamiento", "Positioning"),
    caption: L(
      "La dosis es el claim: los beneficios vienen de protocolos largos. Normal es un rango; tu salud necesita contexto.",
      "The dose is the claim: the benefits come from long protocols. Normal is a range; your health needs context.",
    ),
    from: FENIX_TIMELINE.positioning.from,
    durationInFrames: FENIX_TIMELINE.positioning.duration,
  },
  {
    id: "site",
    label: L("Sitio y reserva", "Site and booking"),
    caption: L(
      "40 páginas en español e inglés y una reserva en 3 pasos contra la agenda real de GoHighLevel.",
      "40 pages in Spanish and English and a 3-step booking against GoHighLevel's real calendar.",
    ),
    from: FENIX_TIMELINE.site.from,
    durationInFrames: FENIX_TIMELINE.site.duration,
  },
  {
    id: "architecture",
    label: L("Arquitectura", "Architecture"),
    caption: L(
      "El lead pasa por un WAF, una llave fail-closed y una validación de 7 campos sin texto libre: los datos de salud quedan afuera.",
      "Leads go through a WAF, a fail-closed switch and a 7-field validation with no free text: health data stays out.",
    ),
    from: FENIX_TIMELINE.architecture.from,
    durationInFrames: FENIX_TIMELINE.architecture.duration,
  },
  {
    id: "brain",
    label: L("El Cerebro", "The Brain"),
    caption: L(
      "1.096 videos de 6 canales médicos públicos, indexados para búsqueda por palabras clave (no vectorial), alimentan 28 guiones con revisión de cumplimiento.",
      "1,096 videos from 6 public medical channels, indexed for keyword search (not vector search), feed 28 scripts with a compliance review.",
    ),
    from: FENIX_TIMELINE.brain.from,
    durationInFrames: FENIX_TIMELINE.brain.duration,
  },
  {
    id: "engineering",
    label: L("Ingeniería", "Engineering"),
    caption: L(
      "221 decisiones documentadas y 98 de 98 chequeos de producción, con QA de agentes y revisión humana.",
      "221 documented decisions and 98 out of 98 production checks, with agent QA and human review.",
    ),
    from: FENIX_TIMELINE.engineering.from,
    durationInFrames: FENIX_DURATION - FENIX_TIMELINE.engineering.from,
  },
];

/** Nivel de evidencia de una afirmación (registro de claims del cliente). */
export type EvidenceTier = "approved" | "signal" | "not-established" | "prohibited";

export interface FenixCopy {
  tagline: string;
  sublines: string[];
  mechanismKicker: string;
  mechanismTitle: string;
  mechanismLawKicker: string;
  /** `*palabra*` se pinta en el acento. */
  mechanismLaw: string;
  mechanismCaptions: [string, string, string];
  doseBeats: Array<{ text: string; kicker?: string }>;
  /** Unidad de la tira de sesiones ("protocolos de 40–60 sesiones", dossier · HBOT). */
  doseUnit: string;
  evidenceKicker: string;
  evidenceTitle: string;
  evidenceTotalLabel: string;
  evidenceBreakdown: Array<{ label: string; key: FenixFactKey }>;
  evidenceTiers: Array<{ id: EvidenceTier; label: string; items: string[]; note?: string }>;
  evidenceWording: { allowed: string; prohibited: string };
  positioningBeats: Array<{ text: string; kicker?: string }>;
  siteKicker: string;
  siteTitle: string;
  bookingSteps: [string, string, string];
  bookingNote: string;
  archKicker: string;
  archTitle: string;
  brainKicker: string;
  brainTitle: string;
  brainMethod: string;
  brainQuery: string;
  brainTokens: string[];
  brainResults: Array<{ title: string; fragment: string }>;
  brainStats: Array<{ key: FenixFactKey; label: string }>;
  scriptTitle: string;
  scriptSegments: Array<{ label: string; timing?: string }>;
  scriptChecklist: string;
  scriptChecklistItems: string[];
  scriptBreakdown: Array<{ key: FenixFactKey; label: string }>;
  hooksLabel: string;
  engineeringKicker: string;
  engineeringTitle: string;
  engineeringFacts: Array<{ key: FenixFactKey; label: string }>;
  qaLabel: string;
  qaGroups: string[];
  agentsLine: string;
  sample: string;
}

export const FENIX_COPY: Record<FilmLanguage, FenixCopy> = {
  es: {
    tagline: "Donde tu salud renace",
    sublines: ["Atención primaria", "Longevidad", "Recuperación"],
    mechanismKicker: "La investigación",
    mechanismTitle: "Cómo funciona el oxígeno hiperbárico.",
    mechanismLawKicker: "Ley de Henry",
    mechanismLaw: "Bajo presión, el oxígeno se disuelve en el *plasma*.",
    mechanismCaptions: ["Plasma saturado", "Difusión en el tejido", "Angiogénesis"],
    doseBeats: [
      { kicker: "La conclusión", text: "La dosis es el claim." },
      { kicker: "Por qué", text: "La señal aparece en protocolos de 40 a 60 sesiones." },
      { kicker: "Entonces", text: "Por eso la membresía es un requisito clínico." },
    ],
    doseUnit: "sesiones",
    evidenceKicker: "Registro de afirmaciones",
    evidenceTitle: "Qué se puede decir y qué no.",
    evidenceTotalLabel: "afirmaciones con redacción permitida y prohibida",
    evidenceBreakdown: [
      { label: "HBOT", key: "claimsHbot" },
      { label: "Edad biológica", key: "claimsBioAge" },
      { label: "GLP-1", key: "claimsGlp1" },
    ],
    evidenceTiers: [
      { id: "approved", label: "Aprobado", items: ["Heridas crónicas seleccionadas", "Injertos comprometidos"], note: "FDA 510(k) · UHMS" },
      { id: "signal", label: "Solo señal", items: ["Post-quirúrgico", "Recuperación deportiva", "Cognición", "Piel"], note: "Protocolos de 40–60 sesiones" },
      { id: "not-established", label: "No establecido", items: ["Energía general", "Longevidad"] },
      { id: "prohibited", label: "Prohibido afirmar", items: ["Autismo", "COVID agudo"] },
    ],
    evidenceWording: { allowed: "Redacción permitida", prohibited: "Redacción prohibida" },
    positioningBeats: [
      { kicker: "El titular", text: "Tu médico de cabecera, que también conoce tu plan de longevidad." },
      { kicker: "La ética", text: "Normal es un rango.\nTu salud necesita contexto." },
      { kicker: "La confianza", text: "Precios claros, un sitio en tu idioma y el compliance antes que la tecnología." },
    ],
    siteKicker: "El sitio y la reserva",
    siteTitle: "40 páginas, dos idiomas, una agenda real.",
    bookingSteps: ["1 · Día", "2 · Hora", "3 · Tus datos"],
    bookingNote: "Horarios libres consultados en vivo a GoHighLevel",
    archKicker: "Arquitectura",
    archTitle: "Los datos de salud quedan afuera.",
    brainKicker: "El Cerebro",
    brainTitle: "Una biblioteca médica que se consulta.",
    brainMethod: "Búsqueda por palabras clave (BM25), no vectorial",
    brainQuery: "oxígeno hiperbárico presión",
    brainTokens: ["oxígeno", "hiperbárico", "presión"],
    brainResults: [
      { title: "Canal médico público · fragmento", fragment: "…dentro de la cámara, la presión hace que más oxígeno se disuelva en el plasma…" },
      { title: "Canal médico público · fragmento", fragment: "…el oxígeno hiperbárico se indica en protocolos con un número definido de sesiones…" },
      { title: "Canal médico público · fragmento", fragment: "…la presión de la cámara se mide en atmósferas absolutas…" },
    ],
    brainStats: [
      { key: "videos", label: "videos" },
      { key: "fragments", label: "fragmentos" },
      { key: "wordsM", label: "M de palabras" },
      { key: "channels", label: "canales públicos" },
    ],
    scriptTitle: "28 guiones con revisión de cumplimiento.",
    scriptSegments: [
      { label: "Hook", timing: "0–4 s" },
      { label: "Biología" },
      { label: "Error común" },
      { label: "Micro-hábito" },
      { label: "Solución Fenix" },
      { label: "CTA" },
    ],
    scriptChecklist: "Revisión de cumplimiento",
    scriptChecklistItems: ["Contra el registro de 109 afirmaciones", "Solo redacción permitida"],
    scriptBreakdown: [
      { key: "scriptsReels", label: "reels" },
      { key: "scriptsEducational", label: "educativos" },
      { key: "scriptsVsl", label: "VSL" },
      { key: "scriptsAds", label: "ads" },
    ],
    hooksLabel: "hooks en el banco",
    engineeringKicker: "Ingeniería",
    engineeringTitle: "Cada decisión, documentada.",
    engineeringFacts: [
      { key: "adr", label: "decisiones documentadas (ADR)" },
      { key: "commits", label: "commits" },
      { key: "specs", label: "specs de Playwright" },
      { key: "pages", label: "páginas en dos idiomas" },
    ],
    qaLabel: "chequeos de producción",
    qaGroups: ["Headers", "44 rutas", "SEO", "Redirects", "Endpoint de lead", "Calendario GHL"],
    agentsLine: "Gemini implementa · agentes Claude hacen QA visual y de backend",
    sample: "Datos de ejemplo",
  },
  en: {
    tagline: "Where your health is reborn",
    sublines: ["Primary care", "Longevity", "Recovery"],
    mechanismKicker: "The research",
    mechanismTitle: "How hyperbaric oxygen works.",
    mechanismLawKicker: "Henry's law",
    mechanismLaw: "Under pressure, oxygen dissolves into *plasma*.",
    mechanismCaptions: ["Saturated plasma", "Tissue diffusion", "Angiogenesis"],
    doseBeats: [
      { kicker: "The conclusion", text: "The dose is the claim." },
      { kicker: "Why", text: "The signal shows up in protocols of 40 to 60 sessions." },
      { kicker: "So", text: "That is why membership is a clinical requirement." },
    ],
    doseUnit: "sessions",
    evidenceKicker: "Claims registry",
    evidenceTitle: "What can be said and what can't.",
    evidenceTotalLabel: "claims with permitted and prohibited wording",
    evidenceBreakdown: [
      { label: "HBOT", key: "claimsHbot" },
      { label: "Biological age", key: "claimsBioAge" },
      { label: "GLP-1", key: "claimsGlp1" },
    ],
    evidenceTiers: [
      { id: "approved", label: "Approved", items: ["Selected chronic wounds", "Compromised grafts"], note: "FDA 510(k) · UHMS" },
      { id: "signal", label: "Signal only", items: ["Post-surgical", "Sports recovery", "Cognition", "Skin"], note: "Protocols of 40–60 sessions" },
      { id: "not-established", label: "Not established", items: ["General energy", "Longevity"] },
      { id: "prohibited", label: "Never claim", items: ["Autism", "Acute COVID"] },
    ],
    evidenceWording: { allowed: "Permitted wording", prohibited: "Prohibited wording" },
    positioningBeats: [
      { kicker: "The headline", text: "Your family doctor, who also knows your longevity plan." },
      { kicker: "The ethics", text: "Normal is a range.\nYour health needs context." },
      { kicker: "The trust", text: "Clear prices, a site in your language and compliance before technology." },
    ],
    siteKicker: "The site and booking",
    siteTitle: "40 pages, two languages, a real calendar.",
    bookingSteps: ["1 · Day", "2 · Time", "3 · Your details"],
    bookingNote: "Free slots checked live against GoHighLevel",
    archKicker: "Architecture",
    archTitle: "Health data stays out.",
    brainKicker: "The Brain",
    brainTitle: "A medical library you can query.",
    brainMethod: "Keyword search (BM25), not vector search",
    brainQuery: "hyperbaric oxygen pressure",
    brainTokens: ["hyperbaric", "oxygen", "pressure"],
    brainResults: [
      { title: "Public medical channel · fragment", fragment: "…inside the chamber, pressure makes more oxygen dissolve into plasma…" },
      { title: "Public medical channel · fragment", fragment: "…hyperbaric oxygen is prescribed in protocols with a set number of sessions…" },
      { title: "Public medical channel · fragment", fragment: "…chamber pressure is measured in atmospheres absolute…" },
    ],
    brainStats: [
      { key: "videos", label: "videos" },
      { key: "fragments", label: "fragments" },
      { key: "wordsM", label: "M words" },
      { key: "channels", label: "public channels" },
    ],
    scriptTitle: "28 scripts with a compliance review.",
    scriptSegments: [
      { label: "Hook", timing: "0–4 s" },
      { label: "Biology" },
      { label: "Common mistake" },
      { label: "Micro-habit" },
      { label: "Fenix solution" },
      { label: "CTA" },
    ],
    scriptChecklist: "Compliance review",
    scriptChecklistItems: ["Against the registry of 109 claims", "Permitted wording only"],
    scriptBreakdown: [
      { key: "scriptsReels", label: "reels" },
      { key: "scriptsEducational", label: "educational" },
      { key: "scriptsVsl", label: "VSL" },
      { key: "scriptsAds", label: "ads" },
    ],
    hooksLabel: "hooks in the bank",
    engineeringKicker: "Engineering",
    engineeringTitle: "Every decision, documented.",
    engineeringFacts: [
      { key: "adr", label: "documented decisions (ADR)" },
      { key: "commits", label: "commits" },
      { key: "specs", label: "Playwright specs" },
      { key: "pages", label: "pages in two languages" },
    ],
    qaLabel: "production checks",
    qaGroups: ["Headers", "44 routes", "SEO", "Redirects", "Lead endpoint", "GHL calendar"],
    agentsLine: "Gemini implements · Claude agents run visual and backend QA",
    sample: "Sample data",
  },
};
