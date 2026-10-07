import type { FilmLanguage } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de L&B Elite Wash & Detail: "Detailing móvil que llega a ti".
 *
 * Fuente de cada dato: docs/films/dossiers/lb-wash.md, verificado contra el repo
 * del cliente (LyB Elite Wash Details):
 * - Flota: 4 camionetas equipadas (GHL_CALENDAR_CAMIONETA_1..4).
 * - Regla operativa: "Una visita es una camioneta en una casa" (duraciones acumuladas).
 * - Catálogo: 88 productos y 142 precios en SERVICES_DATA / catalog-prices.json.
 * - Cotizador de 5 pasos y depósito estándar de $30 (api/_lib/catalog.js).
 * - Arquitectura sin base de datos: cero Postgres, estado nativo en HighLevel.
 * - App de la cuadrilla (cuadrilla.html + api/crew.js): 5 acciones cerradas.
 *
 * Las capturas del cotizador y de la cuadrilla salen de
 * scripts/capture-film-flows.ts; las paradas de la cuadrilla son de ejemplo y
 * el film las rotula así.
 */

export const LB_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 15 },
  { id: "quoter", kind: "vehicle-quote", seconds: 19 },
  { id: "architecture", kind: "architecture", seconds: 14 },
  { id: "crew", kind: "field-crew", seconds: 13 },
  { id: "engineering", kind: "fact-wall", seconds: 9 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const lbTimeline = timelineFrom(LB_SCENES);
export const LB_TIMELINE = lbTimeline.slots;
export const LB_DURATION = lbTimeline.durationInFrames;

/** Cifras reales verificadas contra el código y dossier del cliente. */
export const LB_FACTS = {
  vans: { value: 4, source: "Dossier · Flota operativa (GHL_CALENDAR_CAMIONETA_1..4)" },
  products: { value: 88, source: "Dossier · Catálogo real verificado (SERVICES_DATA)" },
  prices: { value: 142, source: "Dossier · Catálogo real verificado (catalog-prices.json)" },
  holdMinutes: { value: 15, source: "Dossier · Máquina de estados (hold temporal)" },
  maxStandardVehicles: { value: 4, source: "Dossier · Límite operativo (4 vehículos estándar)" },
  maxMarineVehicles: { value: 2, source: "Dossier · Límite operativo (2 embarcaciones)" },
  quoterSteps: { value: 5, source: "Dossier · Material del film (cotizador en 5 pasos)" },
  depositStandard: { value: 30, source: "Dossier · Material del film (DEPOSIT_SMALL en api/_lib/catalog.js)" },
  crewActions: { value: 5, source: "Dossier · Operación en campo (5 acciones de api/crew.js)" },
} as const satisfies Record<string, FilmFact>;

const BRAND = "/portfolio/brands/lb-elite-wash-detail";

/** Medidas nativas (el test las compara con los archivos; la cámara nunca las amplía). */
export const LB_ASSETS = {
  /** La camioneta rotulada entera, en la calle (apaisado). */
  vanWide: { src: `${BRAND}/van-real.jpg`, w: 2048, h: 682 },
  /** La misma camioneta más cerca (4:5). */
  vanClose: { src: `${BRAND}/van.webp`, w: 2200, h: 1100 },
  /** Cotizador en vivo, paso 2: paquetes reales con sus precios (tema oscuro). */
  quoter: { src: `${BRAND}/shots/quoter-paquetes.jpg`, w: 1200, h: 2104 },
  /** App real de la cuadrilla con paradas de ejemplo: antes y después de "Atendida". */
  crewToday: { src: `${BRAND}/shots/cuadrilla-hoy.jpg`, w: 780, h: 1688 },
  crewAttended: { src: `${BRAND}/shots/cuadrilla-atendida.jpg`, w: 780, h: 1688 },
} as const satisfies Record<string, FilmAsset>;

export const LB_HOST = "l-b-five.vercel.app";

/** Botón "Atendida" de la primera parada en la captura de la cuadrilla (fracción del ancho y del alto). */
export const LB_CREW_TAP = { x: 220 / 780, y: 461 / 1688 } as const;

export const LB_CHAPTERS: FlagshipChapter[] = [
  {
    id: "flota",
    label: { es: "Flota y regla operativa", en: "Fleet & Operating Rule" },
    caption: {
      es: "4 camionetas autónomas · una visita es una camioneta en una casa",
      en: "4 self-contained vans · one visit is one van at one house",
    },
    from: LB_TIMELINE.opening.from,
    durationInFrames: LB_TIMELINE.opening.duration,
  },
  {
    id: "cotizador",
    label: { es: "Cotizador dinámico", en: "Dynamic Quoter" },
    caption: {
      es: "El cotizador real en 5 pasos: la cita nace en HighLevel con un hold de 15 minutos",
      en: "The real 5-step quoter: the appointment is born in HighLevel with a 15-minute hold",
    },
    from: LB_TIMELINE.quoter.from,
    durationInFrames: LB_TIMELINE.quoter.duration,
  },
  {
    id: "arquitectura",
    label: { es: "Cero Postgres", en: "Zero Postgres" },
    caption: {
      es: "Estado nativo en GoHighLevel sin base de datos externa",
      en: "Native state in GoHighLevel without external database",
    },
    from: LB_TIMELINE.architecture.from,
    durationInFrames: LB_TIMELINE.architecture.duration,
  },
  {
    id: "cuadrilla",
    label: { es: "La cuadrilla en campo", en: "Field Crew Ops" },
    caption: {
      es: "Botones grandes para una mano y manos mojadas · cada uno escribe en la cita",
      en: "Big one-handed, wet-hands buttons · each one writes to the appointment",
    },
    from: LB_TIMELINE.crew.from,
    durationInFrames: LB_TIMELINE.crew.duration,
  },
  {
    id: "cierre",
    label: { es: "Ingeniería y firma", en: "Engineering & Signature" },
    caption: {
      es: "Métricas verificadas de producción",
      en: "Verified production metrics",
    },
    from: LB_TIMELINE.engineering.from,
    durationInFrames: LB_TIMELINE.engineering.duration + LB_TIMELINE.signature.duration,
  },
];

export type LbCrewActionId = "attended" | "noshow" | "cash" | "link";

export type LbCopy = {
  heroKicker: string;
  /** `*palabra*` se pinta con el acento. */
  heroTagline: string;
  ruleBeats: Array<{ kicker: string; text: string }>;
  quoterKicker: string;
  quoterTitle: string;
  payloadKicker: string;
  /** Visita de ejemplo: la misma que después atiende la cuadrilla. */
  payloadVisit: string;
  /** Pares clave-valor reales de la descripción de la cita (valores de ejemplo). */
  payloadLines: Array<{ key: string; value: string }>;
  stateNew: string;
  stateConfirmed: string;
  routeLabel: string;
  vanLabel: string;
  sampleLabel: string;
  archKicker: string;
  archTitle: string;
  crewKicker: string;
  crewTitle: string;
  crewPanelTitle: string;
  crewActions: Array<{ id: LbCrewActionId; label: string; effect: string }>;
  crewResult: string;
  crewNote: string;
  engineeringKicker: string;
  engineeringTitle: string;
  engineeringFacts: Array<{ label: string; value: string; source: string }>;
};

/** Visita de ejemplo (precios del catálogo real: Basic Wash Premium $85 + Basic Wash $55; depósito estándar $30). */
const SAMPLE = { total: "$140", deposit: `$${LB_FACTS.depositStandard.value}`, key: "a7f3…c21" } as const;

export const LB_COPY: Record<FilmLanguage, LbCopy> = {
  es: {
    heroKicker: "Detailing móvil de élite · Suroeste de Florida",
    heroTagline: "Detailing móvil que *llega a ti.*",
    ruleBeats: [
      { kicker: "La regla de la operación", text: "Una visita es *una camioneta* en *una casa.*" },
      { kicker: "4 camionetas · 4 casas a la vez", text: "3 autos: 60 + 60 + 60 min y *un solo traslado.*" },
    ],
    quoterKicker: "Cotizador · 5 pasos",
    quoterTitle: "88 servicios y 142 precios, por carrocería",
    payloadKicker: "Inbound webhook → cita en HighLevel",
    payloadVisit: "Camry + RAV4 · 2h30 en bloque",
    payloadLines: [
      { key: "veh", value: "2" },
      { key: "orden", value: "Basic Wash Premium + Basic Wash" },
      { key: "total", value: SAMPLE.total },
      { key: "deposito", value: SAMPLE.deposit },
      { key: "expira", value: "+15 min" },
      { key: "Idempotency-Key", value: SAMPLE.key },
    ],
    stateNew: "new · hold de 15 min",
    stateConfirmed: "confirmed · pago verificado",
    routeLabel: "Calendario asignado por rotación",
    vanLabel: "Camioneta",
    sampleLabel: "Datos de ejemplo",
    archKicker: "Arquitectura de CRM y agenda",
    archTitle: "Arquitectura sin base de datos (cero Postgres)",
    crewKicker: "La cuadrilla en campo",
    crewTitle: "Un toque al pie del auto, y la cita cambia",
    crewPanelTitle: "Cada botón escribe en la cita",
    crewActions: [
      { id: "attended", label: "Atendida", effect: "appointmentStatus: showed" },
      { id: "noshow", label: "No estaba", effect: "noshow · el traslado se cobra" },
      { id: "cash", label: "Cobré efectivo", effect: "factura pagada en efectivo" },
      { id: "link", label: "Link de saldo", effect: "factura por SMS y email" },
    ],
    crewResult: "✓ confirmed → showed en el calendario de la camioneta",
    crewNote: "Enlace firmado · solo hoy · solo esa camioneta · nada se borra",
    engineeringKicker: "Ingeniería de producción",
    engineeringTitle: "Métricas verificadas de operación",
    engineeringFacts: [
      { value: `${formatFact(LB_FACTS.vans, "es")} camionetas`, label: "Flota con calendario propio en HighLevel", source: "repositorio del proyecto" },
      { value: `${formatFact(LB_FACTS.products, "es")} servicios`, label: "Catálogo real del cotizador", source: "repositorio del proyecto" },
      { value: `${formatFact(LB_FACTS.prices, "es")} precios`, label: "Por servicio y tipo de carrocería", source: "repositorio del proyecto" },
      { value: `${formatFact(LB_FACTS.holdMinutes, "es")} minutos`, label: "Hold de la cita hasta que llega el pago", source: "repositorio del proyecto" },
      { value: `${formatFact(LB_FACTS.crewActions, "es")} acciones`, label: "Cerradas en la app de la cuadrilla", source: "repositorio del proyecto" },
      { value: "0 tablas", label: "Base de datos SQL: el estado vive en el CRM", source: "repositorio del proyecto" },
    ],
  },
  en: {
    heroKicker: "Elite mobile detailing · Southwest Florida",
    heroTagline: "Mobile detailing that *comes to you.*",
    ruleBeats: [
      { kicker: "The operating rule", text: "A visit is *one van* at *one house.*" },
      { kicker: "4 vans · 4 houses at once", text: "3 cars: 60 + 60 + 60 min and *a single drive.*" },
    ],
    quoterKicker: "Quoter · 5 steps",
    quoterTitle: "88 services and 142 prices, by body type",
    payloadKicker: "Inbound webhook → HighLevel appointment",
    payloadVisit: "Camry + RAV4 · 2h30 as one block",
    payloadLines: [
      { key: "veh", value: "2" },
      { key: "orden", value: "Basic Wash Premium + Basic Wash" },
      { key: "total", value: SAMPLE.total },
      { key: "deposito", value: SAMPLE.deposit },
      { key: "expira", value: "+15 min" },
      { key: "Idempotency-Key", value: SAMPLE.key },
    ],
    stateNew: "new · 15-min hold",
    stateConfirmed: "confirmed · payment verified",
    routeLabel: "Calendar assigned by rotation",
    vanLabel: "Van",
    sampleLabel: "Sample data",
    archKicker: "CRM & scheduling architecture",
    archTitle: "Database-less architecture (zero Postgres)",
    crewKicker: "The field crew",
    crewTitle: "One tap by the car, and the appointment changes",
    crewPanelTitle: "Every button writes to the appointment",
    crewActions: [
      { id: "attended", label: "Attended", effect: "appointmentStatus: showed" },
      { id: "noshow", label: "Not home", effect: "noshow · the drive is charged" },
      { id: "cash", label: "Cash collected", effect: "invoice paid in cash" },
      { id: "link", label: "Balance link", effect: "invoice by SMS and email" },
    ],
    crewResult: "✓ confirmed → showed on the van's calendar",
    crewNote: "Signed link · today only · that van only · nothing is deleted",
    engineeringKicker: "Production engineering",
    engineeringTitle: "Verified operating metrics",
    engineeringFacts: [
      { value: `${formatFact(LB_FACTS.vans, "en")} vans`, label: "Fleet with its own HighLevel calendar", source: "project repository" },
      { value: `${formatFact(LB_FACTS.products, "en")} services`, label: "The quoter's real catalogue", source: "project repository" },
      { value: `${formatFact(LB_FACTS.prices, "en")} prices`, label: "By service and body type", source: "project repository" },
      { value: `${formatFact(LB_FACTS.holdMinutes, "en")} minutes`, label: "Appointment hold until payment lands", source: "project repository" },
      { value: `${formatFact(LB_FACTS.crewActions, "en")} actions`, label: "A closed list in the crew app", source: "project repository" },
      { value: "0 tables", label: "SQL database: state lives in the CRM", source: "project repository" },
    ],
  },
};
