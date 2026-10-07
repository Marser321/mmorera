import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de AD Media Solution: "La agencia vende; la ingeniería, de
 * marca blanca".
 *
 * Fuente de cada dato: docs/films/dossiers/ad-media.md, verificado contra el
 * repo del cliente (AD Media Solution, Next.js) y su sitio en vivo. AD Media
 * es la agencia comercial que vendió y gestionó las cuentas; Mario Morera fue
 * el socio técnico tercerizado (funnels, webapps e integraciones de CRM).
 *
 * El tablero de Speed-to-Lead y el pipeline son datos de ejemplo (personas,
 * tiempos y etapas por las que pasa la tarjeta) y el film los rotula así. Las
 * 5 etapas son las del dossier; la ventana de 30 s es la meta declarada del
 * caso (diagrama de Archify y ficha del caso), no una métrica medida.
 */

export const AD_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 8 },
  { id: "alliance", kind: "cinematic-plate", seconds: 9 },
  { id: "site", kind: "scroll-reel", seconds: 10 },
  { id: "pipeline", kind: "pipeline-board", seconds: 20 },
  { id: "architecture", kind: "architecture", seconds: 13 },
  { id: "engineering", kind: "fact-wall", seconds: 8 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const adTimeline = timelineFrom(AD_SCENES);
export const AD_TIMELINE = adTimeline.slots;
export const AD_DURATION = adTimeline.durationInFrames;

/** Cifras publicadas, cada una con la línea del dossier que la respalda. */
export const AD_FACTS = {
  // "Componentes en código: 10 secciones completas" (src/components/sections).
  sections: { value: 10, source: "Dossier · Cifras y afirmaciones verificadas" },
  // "Servicios ofrecidos: 4 pilares".
  pillars: { value: 4, source: "Dossier · Cifras y afirmaciones verificadas" },
  // "Herramientas integradas": GoHighLevel, Meta Ads, Google Business Profile, Twilio/WhatsApp, Stripe.
  tools: { value: 5, source: "Dossier · Cifras y afirmaciones verificadas" },
  // "Pipeline Board": Lead nuevo → Calificado → Llamada agendada → Propuesta enviada → Ganado.
  stages: { value: 5, source: "Dossier · Los pilares del sistema (Pipeline Board)" },
  // "Reputation Engine": reseña de Google Maps 24 horas después del servicio.
  reviewHours: { value: 24, source: "Dossier · Los pilares del sistema (Reputation Engine)" },
} as const satisfies Record<string, FilmFact>;

export type AdFactKey = keyof typeof AD_FACTS;

/** Una cifra formateada en el idioma del film. */
export const adFx = (key: AdFactKey, language: FilmLanguage) => formatFact(AD_FACTS[key], language);

const BRAND = "/portfolio/brands/ad-media-solution";

/** Medidas nativas (el test las compara con los archivos; la cámara nunca las amplía). */
export const AD_ASSETS = {
  /** Grilla de construcción del isotipo, recortada del manual de marca (banner.jpg, franja 1534–2484). */
  brandGrid: { src: `${BRAND}/brand-grid.jpg`, w: 1684, h: 950 },
  /** Danger Fernández, CEO (foto oficial del repo del cliente). */
  ceo: { src: `${BRAND}/ceo.jpg`, w: 1086, h: 1448 },
  /** Sitio en vivo de arriba abajo, sin el popup de diagnóstico (scripts/capture-film-flows.ts ad-site). */
  site: { src: `${BRAND}/shots/site-recorrido.jpg`, w: 1440, h: 4752 },
  /** Emblema del CRM de marca blanca (tinta oscura sobre transparente). */
  logoCrm: { src: `${BRAND}/logo-crm.png`, w: 908, h: 416 },
  /** Logotipo horizontal en blanco. */
  wordmark: { src: `${BRAND}/wordmark.png`, w: 900, h: 107 },
} as const satisfies Record<string, FilmAsset>;

export const AD_HOST = "admediasolution.vercel.app";

/**
 * Paradas del recorrido del sitio (0 = arriba, 1 = abajo de todo), medidas en
 * la captura: el VSL empieza a 900 px, el centro de comando a 2477 px y el
 * formulario calificador cierra la página.
 */
export const AD_SITE_STOPS = [0, 0.24, 0.65, 1] as const;

const L = (es: string, en: string): Localized => ({ es, en });

export const AD_CHAPTERS: FlagshipChapter[] = [
  {
    id: "alliance",
    label: L("La alianza", "The alliance"),
    caption: L(
      "AD Media Solution vende y gestiona las cuentas; Mario Morera construye la ingeniería como socio técnico de marca blanca.",
      "AD Media Solution sells and manages the accounts; Mario Morera builds the engineering as a white-label tech partner.",
    ),
    from: 0,
    durationInFrames: AD_TIMELINE.site.from,
  },
  {
    id: "funnel",
    label: L("El funnel", "The funnel"),
    caption: L(
      "El sitio en producción: agenda directa, VSL, centro de comando comercial y un formulario que califica por facturación.",
      "The live site: direct booking, a VSL, a sales command center and a form that qualifies by revenue.",
    ),
    from: AD_TIMELINE.site.from,
    durationInFrames: AD_TIMELINE.site.duration,
  },
  {
    id: "speed-to-lead",
    label: L("Speed-to-Lead", "Speed-to-Lead"),
    caption: L(
      "Un lead de pauta recibe respuesta automática en segundos y su oportunidad recorre las 5 etapas del pipeline (datos de ejemplo).",
      "An ad lead gets an automatic reply within seconds and its opportunity moves through the 5 pipeline stages (sample data).",
    ),
    from: AD_TIMELINE.pipeline.from,
    durationInFrames: AD_TIMELINE.pipeline.duration,
  },
  {
    id: "architecture",
    label: L("Arquitectura", "Architecture"),
    caption: L(
      "Captación, motor de automatización, núcleo de GoHighLevel y monetización en Stripe, bajo la marca de cada cliente.",
      "Acquisition, automation engine, GoHighLevel core and Stripe billing, under each client's own brand.",
    ),
    from: AD_TIMELINE.architecture.from,
    durationInFrames: AD_TIMELINE.architecture.duration,
  },
  {
    id: "closing",
    label: L("Ingeniería y firma", "Engineering & signature"),
    caption: L("Cifras verificadas en el código del proyecto.", "Figures verified in the project's code."),
    from: AD_TIMELINE.engineering.from,
    durationInFrames: AD_TIMELINE.engineering.duration + AD_TIMELINE.signature.duration,
  },
];

export type AdLeadEvent = { at: number; label: string };
/** Oportunidad de ejemplo: nombre, servicio de interés (uno de los 4 pilares) y origen. */
export type AdBoardCard = { name: string; service: string; tag: string };

export type AdCopy = {
  openingKicker: string;
  /** `*palabra*` se pinta con el acento. */
  openingTagline: string;
  allianceBeats: Array<{ kicker: string; text: string }>;
  ceoKicker: string;
  ceoName: string;
  siteKicker: string;
  siteTitle: string;
  siteStops: string[];
  pipelineKicker: string;
  pipelineTitle: string;
  sampleLabel: string;
  speedTitle: string;
  leadSource: string;
  leadName: string;
  leadMeta: string;
  /** Servicio de interés en la tarjeta del tablero (más corto que el origen del lead). */
  leadService: string;
  /** Segundos de la muestra en que ocurre cada evento (el reloj corre hasta el último). */
  leadEvents: AdLeadEvent[];
  windowLabel: string;
  repliedLabel: string;
  boardTitle: string;
  stages: string[];
  /** Etiqueta de la tarjeta protagonista en cada etapa. */
  heroTags: string[];
  /** Automatización que dispara cada etapa (una línea a la vez, debajo del tablero). */
  automations: string[];
  /** Dos oportunidades de ejemplo por columna (fondo del tablero). */
  boardCards: AdBoardCard[][];
  archKicker: string;
  archTitle: string;
  engineeringKicker: string;
  engineeringTitle: string;
  engineeringFacts: Array<{ key: AdFactKey; unit: string; label: string; source: string }>;
  creditLine: string;
};

export const AD_COPY: Record<FilmLanguage, AdCopy> = {
  es: {
    openingKicker: "Arquitectura de ingresos y CRM · Marca blanca",
    openingTagline: "Marketing y ventas *en una sola operación.*",
    allianceBeats: [
      { kicker: "La agencia", text: "AD Media *vende, cierra y gestiona* la cuenta." },
      { kicker: "El socio técnico", text: "Mario Morera *construye* funnels, webapps y CRM." },
      { kicker: "Marca blanca", text: "El cliente opera con *su dominio, su logo y sus colores.*" },
    ],
    ceoKicker: "CEO · AD Media Solution",
    ceoName: "Danger Fernández",
    siteKicker: "El funnel en producción",
    siteTitle: "Un sitio que agenda, explica y califica",
    siteStops: ["Agenda directa desde el hero", "VSL del sistema comercial", "Centro de comando: anuncios, CRM y WhatsApp", "Formulario que califica por facturación"],
    pipelineKicker: "Speed-to-Lead · pipeline de 5 etapas",
    pipelineTitle: "Del anuncio al cierre, sin tareas manuales",
    sampleLabel: "Datos de ejemplo",
    speedTitle: "Speed-to-Lead",
    leadSource: "Meta Ads",
    leadName: "Ana R.",
    leadMeta: "Diagnóstico web",
    leadService: "Diagnóstico",
    leadEvents: [
      { at: 0, label: "Formulario enviado" },
      { at: 2, label: "Contacto creado en el CRM" },
      { at: 4, label: "SMS automático" },
      { at: 7, label: "WhatsApp con link de agenda" },
    ],
    windowLabel: "Ventana objetivo: 30 s",
    repliedLabel: "Respondido",
    boardTitle: "Pipeline · Oportunidades",
    stages: ["Lead nuevo", "Calificado", "Llamada agendada", "Propuesta enviada", "Ganado"],
    heroTags: ["Meta Ads", "Apto", "Mar 10:30", "Enviada", "Onboarding"],
    automations: [
      "Respuesta automática por SMS y WhatsApp",
      "El filtro calificador puntúa al prospecto",
      "Agenda sincronizada: llamada de cierre",
      "Propuesta y seguimiento automático",
      "Cobro recurrente en Stripe y onboarding",
    ],
    boardCards: [
      [{ name: "Carlos M.", service: "Plan CRM", tag: "Google" }, { name: "Lucía P.", service: "Sitio web", tag: "WhatsApp" }],
      [{ name: "Tomás R.", service: "Paid Ads", tag: "Referido" }, { name: "Elena V.", service: "Plan CRM", tag: "Meta Ads" }],
      [{ name: "Sofía G.", service: "Social Media", tag: "Google" }, { name: "Diego L.", service: "Sitio web", tag: "SEO" }],
      [{ name: "Valeria C.", service: "Plan CRM", tag: "Meta Ads" }, { name: "Andrés T.", service: "Paid Ads", tag: "Referido" }],
      [{ name: "Martín S.", service: "Sitio web", tag: "WhatsApp" }, { name: "Paula N.", service: "Social Media", tag: "Google" }],
    ],
    archKicker: "Arquitectura de CRM y marca blanca",
    archTitle: "Captación, automatización y cierre",
    engineeringKicker: "Ingeniería",
    engineeringTitle: "Lo que quedó en el código",
    engineeringFacts: [
      { key: "sections", unit: "", label: "Secciones del funnel en código", source: "repositorio del proyecto" },
      { key: "stages", unit: "", label: "Etapas del pipeline de venta", source: "repositorio del proyecto" },
      { key: "tools", unit: "", label: "Integraciones: GHL, Meta, Google, WhatsApp, Stripe", source: "repositorio del proyecto" },
      { key: "reviewHours", unit: " h", label: "Para pedir la reseña en Google Maps", source: "repositorio del proyecto" },
    ],
    creditLine: "Agencia: AD Media Solution · Ingeniería de marca blanca: Mario Morera",
  },
  en: {
    openingKicker: "Revenue architecture & CRM · White label",
    openingTagline: "Marketing and sales *as one operation.*",
    allianceBeats: [
      { kicker: "The agency", text: "AD Media *sells, closes and manages* the account." },
      { kicker: "The tech partner", text: "Mario Morera *builds* the funnels, webapps and CRM." },
      { kicker: "White label", text: "Clients run on *their own domain, logo and colors.*" },
    ],
    ceoKicker: "CEO · AD Media Solution",
    ceoName: "Danger Fernández",
    siteKicker: "The live funnel",
    siteTitle: "A site that books, explains and qualifies",
    siteStops: ["Direct booking from the hero", "Sales-system VSL", "Command center: ads, CRM and WhatsApp", "A form that qualifies by revenue"],
    pipelineKicker: "Speed-to-Lead · 5-stage pipeline",
    pipelineTitle: "From ad to close, with no manual tasks",
    sampleLabel: "Sample data",
    speedTitle: "Speed-to-Lead",
    leadSource: "Meta Ads",
    leadName: "Ana R.",
    leadMeta: "Web diagnosis",
    leadService: "Diagnosis",
    leadEvents: [
      { at: 0, label: "Form submitted" },
      { at: 2, label: "Contact created in the CRM" },
      { at: 4, label: "Automatic SMS" },
      { at: 7, label: "WhatsApp with booking link" },
    ],
    windowLabel: "Target window: 30 s",
    repliedLabel: "Replied",
    boardTitle: "Pipeline · Opportunities",
    stages: ["New lead", "Qualified", "Call booked", "Proposal sent", "Won"],
    heroTags: ["Meta Ads", "Fit", "Tue 10:30", "Sent", "Onboarding"],
    automations: [
      "Automatic reply by SMS and WhatsApp",
      "The qualifying filter scores the prospect",
      "Synced calendar: closing call",
      "Proposal and automatic follow-up",
      "Recurring Stripe billing and onboarding",
    ],
    boardCards: [
      [{ name: "Carlos M.", service: "CRM plan", tag: "Google" }, { name: "Lucía P.", service: "Website", tag: "WhatsApp" }],
      [{ name: "Tomás R.", service: "Paid Ads", tag: "Referral" }, { name: "Elena V.", service: "CRM plan", tag: "Meta Ads" }],
      [{ name: "Sofía G.", service: "Social Media", tag: "Google" }, { name: "Diego L.", service: "Website", tag: "SEO" }],
      [{ name: "Valeria C.", service: "CRM plan", tag: "Meta Ads" }, { name: "Andrés T.", service: "Paid Ads", tag: "Referral" }],
      [{ name: "Martín S.", service: "Website", tag: "WhatsApp" }, { name: "Paula N.", service: "Social Media", tag: "Google" }],
    ],
    archKicker: "CRM & white-label architecture",
    archTitle: "Acquisition, automation and close",
    engineeringKicker: "Engineering",
    engineeringTitle: "What shipped in the code",
    engineeringFacts: [
      { key: "sections", unit: "", label: "Funnel sections in code", source: "project repository" },
      { key: "stages", unit: "", label: "Sales pipeline stages", source: "project repository" },
      { key: "tools", unit: "", label: "Integrations: GHL, Meta, Google, WhatsApp, Stripe", source: "project repository" },
      { key: "reviewHours", unit: " h", label: "To request the Google Maps review", source: "project repository" },
    ],
    creditLine: "Agency: AD Media Solution · White-label engineering: Mario Morera",
  },
};
