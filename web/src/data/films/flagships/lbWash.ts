import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de L&B Elite Wash & Detail: "Detailing móvil de alta gama".
 *
 * Fuente de cada dato: docs/films/dossiers/lb-wash.md, verificado contra el repo
 * del cliente (LyB Elite Wash Details):
 * - Flota: 4 camionetas equipadas (GHL_CALENDAR_CAMIONETA_1..4).
 * - Regla operativa: "Una visita es una camioneta en una casa" (duraciones acumuladas).
 * - Catálogo: 88 productos y 142 precios en SERVICES_DATA / catalog-prices.json.
 * - Arquitectura Database-less: Cero Postgres, estado nativo en HighLevel.
 * - Operación: App móvil de cuadrilla (cuadrilla.html) con botones de gran tamaño.
 */

export const LB_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 7 },
  { id: "fleetRule", kind: "fleet-routing", seconds: 11 },
  { id: "quoter", kind: "vehicle-quote", seconds: 17 },
  { id: "architecture", kind: "architecture", seconds: 13 },
  { id: "crew", kind: "field-crew", seconds: 11 },
  { id: "engineering", kind: "fact-wall", seconds: 9.5 },
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
} as const satisfies Record<string, FilmFact>;

export const LB_CHAPTERS: FlagshipChapter[] = [
  {
    id: "flota",
    label: { es: "Flota y regla operativa", en: "Fleet & Operating Rule" },
    caption: {
      es: "4 camionetas autónomas · una visita es una casa",
      en: "4 self-contained vans · one visit is one house",
    },
    from: LB_TIMELINE.opening.from,
    durationInFrames: LB_TIMELINE.opening.duration + LB_TIMELINE.fleetRule.duration,
  },
  {
    id: "cotizador",
    label: { es: "Cotizador dinámico", en: "Dynamic Quoter" },
    caption: {
      es: "88 servicios y 142 precios por carrocería",
      en: "88 services and 142 prices by vehicle type",
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
      es: "App táctil para manos mojadas · paradas en tiempo real",
      en: "Tactile app for wet hands · real-time stop updates",
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

export interface LbVehicleTier {
  id: string;
  name: Localized;
  badge: Localized;
  startingPrice: number;
  washDurationMin: number;
}

export const LB_VEHICLE_TIERS: LbVehicleTier[] = [
  {
    id: "sedan",
    name: { es: "Sedan / Coupe", en: "Sedan / Coupe" },
    badge: { es: "Compacto", en: "Compact" },
    startingPrice: 55,
    washDurationMin: 60,
  },
  {
    id: "suv",
    name: { es: "SUV Mediano", en: "Midsize SUV" },
    badge: { es: "Familiar", en: "Family" },
    startingPrice: 75,
    washDurationMin: 75,
  },
  {
    id: "truck",
    name: { es: "Truck / Pickup", en: "Truck / Pickup" },
    badge: { es: "Trabajo pesado", en: "Heavy Duty" },
    startingPrice: 95,
    washDurationMin: 90,
  },
  {
    id: "boat",
    name: { es: "Embarcación / Bote", en: "Marine / Boat" },
    badge: { es: "Náutica", en: "Marine" },
    startingPrice: 160,
    washDurationMin: 120,
  },
];

export interface LbCopyText {
  heroTag: string;
  heroHeadline: string;
  heroSubline: string;
  ruleTitle: string;
  rulePrinciple: string;
  ruleEquation: string;
  quoterTitle: string;
  quoterSubtitle: string;
  quoterSummaryLabel: string;
  quoterDurationLabel: string;
  quoterDepositLabel: string;
  quoterHoldNotice: string;
  archTitle: string;
  archSubtitle: string;
  crewTitle: string;
  crewSubtitle: string;
  crewActionAttend: string;
  crewActionCash: string;
  crewActionLink: string;
  crewActionNoshow: string;
  engineeringFacts: Array<{ label: string; value: string; note: string; source: string }>;
  signatureClaim: string;
  signatureSub: string;
}

export const LB_COPY: Record<FilmLanguage, LbCopyText> = {
  es: {
    heroTag: "Detailing móvil de élite · Suroeste de Florida",
    heroHeadline: "4 camionetas autónomas equipadas para operar en tu propia entrada.",
    heroSubline: "Sin traslados, sin esperas en talleres: agua pura, generador y acabado cerámico en tu casa.",
    ruleTitle: "El principio rector de la operación",
    rulePrinciple: "Una visita es UNA camioneta en UNA casa, no cuatro autos sueltos.",
    ruleEquation: "3 vehículos = 60 + 60 + 60 min de labor + un solo traslado = 3h30",
    quoterTitle: "Cotizador inteligente por carrocería",
    quoterSubtitle: "Precios y duraciones calculadas al vuelo contra el catálogo real de 88 servicios.",
    quoterSummaryLabel: "Resumen de visita estimada",
    quoterDurationLabel: "Tiempo total en domicilio",
    quoterDepositLabel: "Depósito de reserva con tarjeta",
    quoterHoldNotice: "Retención temporal de 15 minutos en el calendario de la camioneta",
    archTitle: "Arquitectura sin base de datos (Cero Postgres)",
    archSubtitle: "El CRM de HighLevel actúa como único almacén: citas, contactos y facturas sincronizados.",
    crewTitle: "Panel móvil para el equipo en campo",
    crewSubtitle: "Diseñado para uso ágil con una mano y dedos mojados al pie del vehículo.",
    crewActionAttend: "Atendida (Servicio completado)",
    crewActionCash: "Cobré en efectivo",
    crewActionLink: "Enlace SMS de pago",
    crewActionNoshow: "Cliente no presente",
    engineeringFacts: [
      {
        label: "Flota activa",
        value: `${formatFact(LB_FACTS.vans, "es")} camionetas`,
        note: "4 calendarios dedicados en HighLevel",
        source: "repositorio del proyecto",
      },
      {
        label: "Catálogo verificado",
        value: `${formatFact(LB_FACTS.products, "es")} servicios`,
        note: `${formatFact(LB_FACTS.prices, "es")} precios por tipo de carrocería`,
        source: "repositorio del proyecto",
      },
      {
        label: "Retención temporal",
        value: `${formatFact(LB_FACTS.holdMinutes, "es")} minutos`,
        note: "Lazy expiration sin sweeps pesados",
        source: "repositorio del proyecto",
      },
      {
        label: "Base de datos SQL",
        value: "0 tablas",
        note: "Estado unificado en el CRM",
        source: "repositorio del proyecto",
      },
    ],
    signatureClaim: "L&B Elite Wash & Detail",
    signatureSub: "Detailing móvil de alta gama · Fort Myers & Naples",
  },
  en: {
    heroTag: "Elite Mobile Detailing · Southwest Florida",
    heroHeadline: "4 self-contained vans equipped to detail right in your driveway.",
    heroSubline: "No travel, no waiting at shops: spot-free water, onboard generator and ceramic finish at home.",
    ruleTitle: "The core operating principle",
    rulePrinciple: "A visit is ONE van at ONE address, working through cars in sequence.",
    ruleEquation: "3 vehicles = 60 + 60 + 60 min service + one travel buffer = 3h30",
    quoterTitle: "Dynamic vehicle quoter",
    quoterSubtitle: "Real-time pricing and duration computed across 88 real services.",
    quoterSummaryLabel: "Estimated visit summary",
    quoterDurationLabel: "Total driveway time",
    quoterDepositLabel: "Online card deposit",
    quoterHoldNotice: "15-minute temporary hold placed on the van calendar",
    archTitle: "Database-less architecture (Zero Postgres)",
    archSubtitle: "HighLevel CRM serves as the single store: synchronized appointments, contacts and invoices.",
    crewTitle: "Mobile panel for the field crew",
    crewSubtitle: "Built for one-handed operation with wet hands right next to the vehicle.",
    crewActionAttend: "Attended (Completed)",
    crewActionCash: "Cash collected",
    crewActionLink: "Send SMS payment link",
    crewActionNoshow: "Customer not present",
    engineeringFacts: [
      {
        label: "Active fleet",
        value: `${formatFact(LB_FACTS.vans, "en")} vans`,
        note: "4 dedicated calendars in HighLevel",
        source: "project repository",
      },
      {
        label: "Verified catalogue",
        value: `${formatFact(LB_FACTS.products, "en")} services`,
        note: `${formatFact(LB_FACTS.prices, "en")} prices across body types`,
        source: "project repository",
      },
      {
        label: "Temporary hold",
        value: `${formatFact(LB_FACTS.holdMinutes, "en")} minutes`,
        note: "Lazy expiration without heavy sweeps",
        source: "project repository",
      },
      {
        label: "SQL database",
        value: "0 tables",
        note: "Unified state in CRM",
        source: "project repository",
      },
    ],
    signatureClaim: "L&B Elite Wash & Detail",
    signatureSub: "Elite mobile detailing · Fort Myers & Naples",
  },
};
