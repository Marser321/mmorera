import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de DOGE.S.M LLC:
 * "Limpieza de Élite y Conservación de Activos Inmobiliarios en Miami".
 *
 * Fuente: el sitio publicado (doge-27dp.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/doge-sm.md.
 */

export const DOGE_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 8.0 },
  { id: "manifesto", kind: "manifesto", seconds: 11.0 },
  { id: "tiers", kind: "tier-offer", seconds: 20.0 },
  { id: "workflow", kind: "camera-reel", seconds: 12.0 },
  { id: "services", kind: "shot-stack", seconds: 9.0 },
  { id: "facts", kind: "fact-wall", seconds: 7.0 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const dogeTimeline = timelineFrom(DOGE_SCENES);
export const DOGE_TIMELINE = dogeTimeline.slots;
export const DOGE_DURATION = dogeTimeline.durationInFrames;

/** Cifras verificadas del sitio en producción. */
export const DOGE_FACTS = {
  tiers: { value: 3, source: "Dossier · /api/catalog/plans: 3 niveles estructurados (Essential, Signature y Estate)" },
  cadence: { value: 3, source: "Dossier · /api/catalog/plans: 3 cadencias programadas (30, 14 y 7 días)" },
  services: { value: 3, source: "Dossier · /services: 3 líneas técnicas (Cristales WFP, Lavado a Presión y Alfombras)" },
  steps: { value: 4, source: "Dossier · Home, Cómo Funciona: 4 pasos numerados en el flujo de solicitud" },
  departments: { value: 7, source: "Dossier · /store: 7 departamentos de insumos profesionales" },
  products: { value: 21, source: "Dossier · /api/catalog/products: 21 productos registrados en el catálogo piloto" },
} as const satisfies Record<string, FilmFact>;

export const DOGE_TIER_KEYS = ["essential", "signature", "estate"] as const;
export type DogeTierKey = (typeof DOGE_TIER_KEYS)[number];

export type DogeTierDef = {
  id: DogeTierKey;
  name: string;
  cadenceDays: number;
  cadenceLabel: Localized;
  description: Localized;
  priceFormatted: string;
  cents: number;
  tag: Localized;
  accentColor: string;
  features: Localized[];
};

export const DOGE_TIERS: ReadonlyArray<DogeTierDef> = [
  {
    id: "essential",
    name: "Essential",
    cadenceDays: 30,
    cadenceLabel: { es: "Cada 30 días", en: "Every 30 days" },
    description: { es: "Mantenimiento mensual", en: "Monthly maintenance" },
    priceFormatted: "$280",
    cents: 28000,
    tag: { es: "Mantenimiento Regular", en: "Regular Maintenance" },
    accentColor: "#94A3B8",
    features: [
      { es: "Inspección exterior y ventanales clave", en: "Exterior inspection & key windows" },
      { es: "Preservación de superficies y acabados", en: "Surface & architectural preservation" },
      { es: "Estimado y agenda confirmada", en: "Confirmed estimate & scheduling" },
    ],
  },
  {
    id: "signature",
    name: "Signature",
    cadenceDays: 14,
    cadenceLabel: { es: "Cada 14 días", en: "Every 14 days" },
    description: { es: "Mantenimiento quincenal", en: "Bi-weekly maintenance" },
    priceFormatted: "$520",
    cents: 52000,
    tag: { es: "Más Popular · Élite", en: "Most Popular · Elite" },
    accentColor: "#D62828",
    features: [
      { es: "Cristales WFP de agua pura sin químicos", en: "WFP pure water chemical-free glass" },
      { es: "Lavado calibrado de accesos y terrazas", en: "Calibrated pressure for drives & decks" },
      { es: "Reporte fotográfico de verificación", en: "Verified photographic inspection report" },
    ],
  },
  {
    id: "estate",
    name: "Estate",
    cadenceDays: 7,
    cadenceLabel: { es: "Cada 7 días", en: "Every 7 days" },
    description: { es: "Mantenimiento semanal", en: "Weekly estate maintenance" },
    priceFormatted: "$960",
    cents: 96000,
    tag: { es: "Residencial Premium", en: "Premium Estate Care" },
    accentColor: "#F59E0B",
    features: [
      { es: "Cuadrilla dedicada de alta frecuencia", en: "Dedicated high-frequency crew" },
      { es: "Tratamiento completo de interiores y telas", en: "Full interior & upholstery treatment" },
      { es: "Atención prioritaria y despacho directo", en: "Priority dispatch & concierge access" },
    ],
  },
];

export const DOGE_WORKFLOW_STEPS = [
  {
    step: "01",
    title: { es: "Describe tu Necesidad", en: "Describe your Scope" },
    desc: {
      es: "Sube fotos, videos o especifica tus áreas sin formularios engorrosos.",
      en: "Upload photos, videos or specify key areas without tedious forms.",
    },
  },
  {
    step: "02",
    title: { es: "Recibe tu Estimado", en: "Receive your Estimate" },
    desc: {
      es: "Presupuesto personalizado y evaluación técnica en pocas horas.",
      en: "Custom estimate and technical evaluation within hours.",
    },
  },
  {
    step: "03",
    title: { es: "Agenda tu Cuadrilla", en: "Schedule your Crew" },
    desc: {
      es: "Elige fecha y horario convenientes. Equipo profesional en ruta.",
      en: "Pick your preferred date and time. Professional crew dispatched.",
    },
  },
  {
    step: "04",
    title: { es: "Resultado Impecable", en: "Flawless Result" },
    desc: {
      es: "Espacio impecable con reporte fotográfico de control incluido.",
      en: "Pristine finish with photographic inspection report included.",
    },
  },
] as const;

export const DOGE_SERVICE_TRIO = [
  {
    id: "windows",
    title: { es: "Limpieza de Cristales", en: "Window Cleaning" },
    spec: { es: "Tecnología WFP Agua Pura", en: "WFP Pure Water Tech" },
    desc: {
      es: "Cristales impecables sin marcas, sin residuos y sin químicos agresivos.",
      en: "Spotless glass with zero mineral residue and chemical-free pure water.",
    },
  },
  {
    id: "pressure",
    title: { es: "Lavado a Presión", en: "Pressure Washing" },
    spec: { es: "Presión Calibrada por Superficie", en: "Calibrated Surface Pressure" },
    desc: {
      es: "Recuperación de calzadas, terrazas y fachadas protegiendo la piedra.",
      en: "Restoration of driveways, stone decks and facades without seal damage.",
    },
  },
  {
    id: "carpet",
    title: { es: "Limpieza de Alfombras", en: "Carpet & Upholstery" },
    spec: { es: "Inyección y Extracción Térmica", en: "Hot Water Extraction" },
    desc: {
      es: "Eliminación profunda de suciedad y olores con tecnología de secado rápido.",
      en: "Deep stain and odor extraction with fast-drying professional equipment.",
    },
  },
] as const;

export const DOGE_CHAPTERS: ReadonlyArray<FlagshipChapter> = [
  {
    id: "standard",
    label: { es: "Estándar Titanium", en: "Titanium Standard" },
    caption: {
      es: "Conservación de activos residenciales y comerciales en Miami.",
      en: "Residential and commercial asset preservation in Miami.",
    },
    from: DOGE_TIMELINE.opening.from,
    durationInFrames: DOGE_TIMELINE.opening.duration + DOGE_TIMELINE.manifesto.duration,
  },
  {
    id: "tiers",
    label: { es: "Oferta por Niveles", en: "Tiered Offer" },
    caption: {
      es: "Tres cadencias de mantenimiento: Essential, Signature y Estate.",
      en: "Three recurring cadences: Essential, Signature and Estate.",
    },
    from: DOGE_TIMELINE.tiers.from,
    durationInFrames: DOGE_TIMELINE.tiers.duration,
  },
  {
    id: "operations",
    label: { es: "Flujo & Servicios", en: "Flow & Services" },
    caption: {
      es: "4 pasos de atención y 3 especialidades técnicas de limpieza.",
      en: "4-step request flow and 3 technical cleaning disciplines.",
    },
    from: DOGE_TIMELINE.workflow.from,
    durationInFrames: DOGE_TIMELINE.workflow.duration + DOGE_TIMELINE.services.duration,
  },
  {
    id: "dispatch",
    label: { es: "Despliegue & Firma", en: "Deployment & Signature" },
    caption: {
      es: "Infraestructura digital, tienda y despacho en Sur de Florida.",
      en: "Digital infrastructure, supply store and dispatch in South Florida.",
    },
    from: DOGE_TIMELINE.facts.from,
    durationInFrames: DOGE_TIMELINE.facts.duration + DOGE_TIMELINE.signature.duration,
  },
];

export const DOGE_ASSETS = {
  heroLoop: {
    src: "/portfolio/brands/doge-sm/hero-loop.mp4",
    w: 1280,
    h: 800,
    seconds: 6.2,
    webm: "/portfolio/brands/doge-sm/hero-loop.webm",
  },
  serviceWindow: {
    src: "/portfolio/brands/doge-sm/service-window.jpg",
    w: 1536,
    h: 1024,
  },
  servicePressure: {
    src: "/portfolio/brands/doge-sm/service-pressure.jpg",
    w: 1536,
    h: 1024,
  },
  serviceCarpet: {
    src: "/portfolio/brands/doge-sm/service-carpet.jpg",
    w: 1536,
    h: 1024,
  },
  shotHero: {
    src: "/portfolio/brands/doge-sm/shots/hero.jpg",
    w: 1920,
    h: 1080,
  },
  shotWorkflow: {
    src: "/portfolio/brands/doge-sm/shots/workflow.jpg",
    w: 1920,
    h: 1080,
  },
  shotServices: {
    src: "/portfolio/brands/doge-sm/shots/services.jpg",
    w: 1920,
    h: 1080,
  },
  shotServiceDetail: {
    src: "/portfolio/brands/doge-sm/shots/service-detail.jpg",
    w: 1920,
    h: 1080,
  },
  shotMemberships: {
    src: "/portfolio/brands/doge-sm/shots/memberships.jpg",
    w: 1920,
    h: 1080,
  },
  shotStore: {
    src: "/portfolio/brands/doge-sm/shots/store.jpg",
    w: 1920,
    h: 1080,
  },
} as const satisfies Record<string, FilmAsset>;

export const DOGE_COPY = {
  es: {
    opening: {
      kicker: "LIMPIEZA TÉCNICA · MIAMI",
      title: "DOGE.S.M LLC",
      tagline: "El Estándar Titanium Noir en Conservación de Activos Inmobiliarios.",
      cityBadge: "SUR DE FLORIDA · MIAMI",
    },
    manifesto: {
      kicker: "ESTÁNDAR PROFESIONAL",
      title: "PRESERVACIÓN DE ACTIVOS",
      lead: "Cuidado de alto nivel para residencias y propiedades corporativas.",
      pillars: [
        { label: "Cuadrillas Certificadas", desc: "Personal verificado con estándares de hospitalidad 5 estrellas." },
        { label: "Estimados Inmediatos", desc: "Respuesta ágil y presupuestos transparentes sin fricción." },
        { label: "Conservación de Activos", desc: "Protección técnica de acabados, cristales y superficies." },
      ],
    },
    tiers: {
      badge: "OFERTA POR NIVELES · API DE CATÁLOGO",
      title: "MEMBRESÍAS DE MANTENIMIENTO",
      subtitle: "Planes recurrentes con cadencia fija y evaluación técnica previa.",
      assessmentNote: "Evaluación previa obligatoria · Precio ajustado por metraje",
      selectLabel: "Seleccionar Nivel",
    },
    workflow: {
      kicker: "CÓMO FUNCIONA",
      title: "SERVICIO SIN COMPLICACIONES",
      subtitle: "Solicitud en minutos sin formularios interminables ni fricción.",
    },
    services: {
      kicker: "ESPECIALIDADES",
      title: "TRES LÍNEAS TÉCNICAS",
      subtitle: "Equipo profesional y tecnología avanzada en cada intervención.",
    },
    facts: {
      kicker: "MÉTRICAS VERIFICADAS",
      title: "ECOSISTEMA DIGITAL DOGE",
      cards: [
        { label: "Niveles de membresía", value: formatFact(DOGE_FACTS.tiers, "es"), note: "Essential, Signature y Estate" },
        { label: "Cadencias de servicio", value: formatFact(DOGE_FACTS.cadence, "es"), note: "30, 14 y 7 días de intervalo" },
        { label: "Servicios técnicos", value: formatFact(DOGE_FACTS.services, "es"), note: "Cristales WFP, Presión y Alfombras" },
        { label: "Etapas del flujo", value: formatFact(DOGE_FACTS.steps, "es"), note: "De la necesidad al reporte fotográfico" },
        { label: "Departamentos tienda", value: formatFact(DOGE_FACTS.departments, "es"), note: "Insumos profesionales seleccionados" },
        { label: "Productos en catálogo", value: formatFact(DOGE_FACTS.products, "es"), note: "Artículos piloto registrados" },
      ],
    },
  },
  en: {
    opening: {
      kicker: "TECHNICAL CLEANING · MIAMI",
      title: "DOGE.S.M LLC",
      tagline: "The Titanium Noir Standard in Architectural Asset Preservation.",
      cityBadge: "SOUTH FLORIDA · MIAMI",
    },
    manifesto: {
      kicker: "PROFESSIONAL STANDARD",
      title: "ASSET PRESERVATION",
      lead: "High-level technical care for elite estates and commercial assets.",
      pillars: [
        { label: "Certified Crews", desc: "Verified staff trained in five-star hospitality standards." },
        { label: "Prompt Estimates", desc: "Agile response and transparent budgets without friction." },
        { label: "Asset Protection", desc: "Technical preservation of finishes, glass and surfaces." },
      ],
    },
    tiers: {
      badge: "TIERED OFFER · CATALOG API",
      title: "MAINTENANCE MEMBERSHIPS",
      subtitle: "Recurring plans with fixed cadence and preliminary property inspection.",
      assessmentNote: "Mandatory preliminary assessment · Quoted by property scale",
      selectLabel: "Select Tier",
    },
    workflow: {
      kicker: "HOW IT WORKS",
      title: "EFFORTLESS SERVICE",
      subtitle: "Fast request process without endless forms or administrative drag.",
    },
    services: {
      kicker: "DISCIPLINES",
      title: "THREE TECHNICAL LINES",
      subtitle: "Dedicated commercial equipment and modern methods on every task.",
    },
    facts: {
      kicker: "VERIFIED METRICS",
      title: "DOGE DIGITAL ECOSYSTEM",
      cards: [
        { label: "Membership tiers", value: formatFact(DOGE_FACTS.tiers, "en"), note: "Essential, Signature and Estate" },
        { label: "Service cadences", value: formatFact(DOGE_FACTS.cadence, "en"), note: "30, 14 and 7 day intervals" },
        { label: "Technical services", value: formatFact(DOGE_FACTS.services, "en"), note: "WFP Pure Water, Pressure & Carpet" },
        { label: "Workflow stages", value: formatFact(DOGE_FACTS.steps, "en"), note: "From enquiry to photo verification" },
        { label: "Store departments", value: formatFact(DOGE_FACTS.departments, "en"), note: "Curated professional supplies" },
        { label: "Catalog products", value: formatFact(DOGE_FACTS.products, "en"), note: "Piloted catalog items registered" },
      ],
    },
  },
} as const;

export type DogeCopy = (typeof DOGE_COPY)[FilmLanguage];
export const DOGE_HOST = "https://doge-27dp.vercel.app";
