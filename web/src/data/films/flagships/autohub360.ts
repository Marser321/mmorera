import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de AutoHub 360:
 * "Concesionaria digital, visualización 360° y central operativa".
 *
 * Fuente: el sitio publicado (auto-indol-five.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/autohub-360.md.
 */

export const AUTOHUB_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 5.5 },
  { id: "cinematic", kind: "cinematic-plate", seconds: 8.0 },
  { id: "tour", kind: "interior-tour", seconds: 18.5 },
  { id: "reel", kind: "scroll-reel", seconds: 12.0 },
  { id: "operations", kind: "shot-stack", seconds: 14.5 },
  { id: "facts", kind: "fact-wall", seconds: 10.0 },
  { id: "signature", kind: "signature", seconds: 6.0 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const autohubTimeline = timelineFrom(AUTOHUB_SCENES);
export const AUTOHUB_TIMELINE = autohubTimeline.slots;
export const AUTOHUB_DURATION = autohubTimeline.durationInFrames;

/** Cifras verificadas del sitio en producción. */
export const AUTOHUB_FACTS = {
  catalogUnits: { value: 15, source: "Dossier · /catalogo: 15 unidades disponibles en el catálogo de inventario" },
  tourHotspots: { value: 8, source: "Dossier · /catalogo/demo-1: 8 puntos de interés en el visor esférico 360°" },
  inspectionPoints: { value: 110, source: "Dossier · /catalogo/demo-1: 110 puntos verificados en la inspección mecánica" },
  adminModules: { value: 4, source: "Dossier · /admin: 4 módulos administrativos (Inventario, CRM, Taller y Facturación)" },
  vipServices: { value: 3, source: "Dossier · /servicios: 3 servicios de digitalización y producción audiovisual" },
  ambientLightingColors: { value: 64, source: "Dossier · /catalogo/demo-1: punto 360-4 'Iluminación Ambiental 64 Colores'" },
} as const satisfies Record<string, FilmFact>;

export const AUTOHUB_HOTSPOT_KEYS = [
  "nappa",
  "mbux",
  "aluminum",
  "ambient",
  "carbon",
  "steering",
  "sunroof",
  "burmester",
] as const;

export type AutohubHotspotKey = (typeof AUTOHUB_HOTSPOT_KEYS)[number];

export type AutohubHotspotDef = {
  id: AutohubHotspotKey;
  code: string;
  title: Localized;
  category: Localized;
  badge: string;
  badgeColor: string;
  yaw: number;
  pitch: number;
  desc: Localized;
};

export const AUTOHUB_HOTSPOTS: ReadonlyArray<AutohubHotspotDef> = [
  {
    id: "nappa",
    code: "01",
    title: { es: "Cuero Nappa Premium", en: "Premium Nappa Leather" },
    category: { es: "Material", en: "Material" },
    badge: "◆",
    badgeColor: "#10B981",
    yaw: 0,
    pitch: 0,
    desc: {
      es: "Tapizado en cuero Nappa crema con costuras diamante y climatización.",
      en: "Cream Nappa leather upholstery with diamond stitching and climate control.",
    },
  },
  {
    id: "mbux",
    code: "02",
    title: { es: "Pantalla MBUX 12.3\"", en: "12.3\" MBUX Display" },
    category: { es: "Lujo & Tech", en: "Luxury & Tech" },
    badge: "★",
    badgeColor: "#A855F7",
    yaw: 45,
    pitch: 10,
    desc: {
      es: "Sistema táctil con realidad aumentada y asistente por voz integrado.",
      en: "Touchscreen interface with augmented reality and voice assistant.",
    },
  },
  {
    id: "aluminum",
    code: "03",
    title: { es: "Molduras de Aluminio", en: "Brushed Aluminum Trim" },
    category: { es: "Material", en: "Material" },
    badge: "◆",
    badgeColor: "#10B981",
    yaw: 90,
    pitch: -5,
    desc: {
      es: "Insertos decorativos en aluminio cepillado oscuro con acabado mate.",
      en: "Dark brushed aluminum accents with sporty matte finish.",
    },
  },
  {
    id: "ambient",
    code: "04",
    title: { es: "Iluminación 64 Colores", en: "64-Color Ambient Light" },
    category: { es: "Confort", en: "Comfort" },
    badge: "★",
    badgeColor: "#A855F7",
    yaw: 135,
    pitch: 15,
    desc: {
      es: "Sistema ambiental personalizable con 64 tonalidades y 10 programas activos.",
      en: "Customizable ambient illumination with 64 shades and 10 presets.",
    },
  },
  {
    id: "carbon",
    code: "05",
    title: { es: "Fibra de Carbono AMG", en: "AMG Carbon Fiber" },
    category: { es: "Material", en: "Material" },
    badge: "◆",
    badgeColor: "#10B981",
    yaw: 180,
    pitch: -10,
    desc: {
      es: "Aplicaciones auténticas en fibra de carbono en volante y consola central.",
      en: "Genuine carbon fiber elements on steering wheel and center console.",
    },
  },
  {
    id: "steering",
    code: "06",
    title: { es: "Volante Deportivo AMG", en: "AMG Sport Steering" },
    category: { es: "Equipamiento", en: "Equipment" },
    badge: "ℹ",
    badgeColor: "#3B82F6",
    yaw: 225,
    pitch: 5,
    desc: {
      es: "Volante multifunción con levas en aluminio y mandos táctiles capacitivos.",
      en: "Multifunction wheel with aluminum paddle shifters and touch controls.",
    },
  },
  {
    id: "sunroof",
    code: "07",
    title: { es: "Techo Panorámico Cristal", en: "Panoramic Glass Sunroof" },
    category: { es: "Lujo & Confort", en: "Luxury & Comfort" },
    badge: "★",
    badgeColor: "#A855F7",
    yaw: 270,
    pitch: 20,
    desc: {
      es: "Apertura eléctrica corrediza con cortina parasol y filtro de protección solar.",
      en: "Power sliding sunroof with sunshade and UV/IR protective filter.",
    },
  },
  {
    id: "burmester",
    code: "08",
    title: { es: "Parlantes Burmester®", en: "Burmester® Surround Audio" },
    category: { es: "Audio Hi-Fi", en: "Hi-Fi Audio" },
    badge: "ℹ",
    badgeColor: "#3B82F6",
    yaw: 315,
    pitch: -15,
    desc: {
      es: "Sistema surround de alta gama con 13 altavoces acústicos y 590W de potencia.",
      en: "High-end surround sound system with 13 acoustic speakers and 590W power.",
    },
  },
];

export const AUTOHUB_ASSETS = {
  mark: { src: "/portfolio/brands/autohub-360/mark.png", w: 600, h: 600 },
  wordmark: { src: "/portfolio/brands/autohub-360/wordmark.png", w: 600, h: 140 },
  carInterior1: { src: "/portfolio/brands/autohub-360/car-interior-1.jpg", w: 4096, h: 2048 },
  carInterior2: { src: "/portfolio/brands/autohub-360/car-interior-2.jpg", w: 4096, h: 2048 },
  carInterior3: { src: "/portfolio/brands/autohub-360/car-interior-3.jpg", w: 4096, h: 2048 },
  demo1: { src: "/portfolio/brands/autohub-360/demo-1.jpg", w: 931, h: 1400 },
  demo2: { src: "/portfolio/brands/autohub-360/demo-2.jpg", w: 1400, h: 787 },
  demo3: { src: "/portfolio/brands/autohub-360/demo-3.jpg", w: 1400, h: 855 },
  demo4: { src: "/portfolio/brands/autohub-360/demo-4.jpg", w: 787, h: 1400 },
  hero: { src: "/portfolio/brands/autohub-360/shots/hero.jpg", w: 1920, h: 1080 },
  catalog: { src: "/portfolio/brands/autohub-360/shots/catalog.jpg", w: 1920, h: 1080 },
  detail: { src: "/portfolio/brands/autohub-360/shots/detail.jpg", w: 1920, h: 1080 },
  tour360: { src: "/portfolio/brands/autohub-360/shots/tour-360.jpg", w: 1920, h: 1080 },
  services: { src: "/portfolio/brands/autohub-360/shots/services.jpg", w: 1920, h: 1080 },
  admin: { src: "/portfolio/brands/autohub-360/shots/admin.jpg", w: 1920, h: 1080 },
} as const satisfies Record<string, FilmAsset>;

export const AUTOHUB_CHAPTERS: ReadonlyArray<FlagshipChapter> = [
  {
    id: "dealership",
    label: { es: "CONCESIONARIA DIGITAL", en: "DIGITAL DEALERSHIP" },
    caption: { es: "Plataforma de exhibición y gestión automotriz", en: "Automotive showcase and management platform" },
    from: 0,
    durationInFrames: 405, // 0 - 13.5s
  },
  {
    id: "tour",
    label: { es: "TOUR INTERIOR 360°", en: "360° INTERIOR TOUR" },
    caption: { es: "Visor esférico interactivo con Three.js y puntos de interés", en: "Interactive spherical Three.js viewer with hotspots" },
    from: 405,
    durationInFrames: 555, // 13.5s - 32.0s
  },
  {
    id: "catalog",
    label: { es: "CATÁLOGO Y SERVICIOS", en: "CATALOG & SERVICES" },
    caption: { es: "Fichas técnicas completas y producción audiovisual", en: "Complete vehicle data sheets and media production" },
    from: 960,
    durationInFrames: 360, // 32.0s - 44.0s
  },
  {
    id: "operations",
    label: { es: "CENTRAL DE OPERACIONES", en: "OPERATIONS CENTER" },
    caption: { es: "Módulos integrados de inventario, CRM y taller", en: "Integrated inventory, CRM, and workshop modules" },
    from: 1320,
    durationInFrames: 435, // 44.0s - 58.5s
  },
  {
    id: "facts",
    label: { es: "MÉTRICAS Y ARQUITECTURA", en: "METRICS & ARCHITECTURE" },
    caption: { es: "Cifras contadas en la plataforma en producción", en: "Figures counted on the live platform" },
    from: 1755,
    durationInFrames: 480, // 58.5s - 74.5s
  },
];

export type AutohubCopy = {
  opening: {
    kicker: string;
    title: string;
    subtitle: string;
    tagline: string;
  };
  cinematic: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  tour: {
    badge: string;
    title: string;
    subtitle: string;
    modeLabel: string;
    hint: string;
  };
  reel: {
    badge: string;
    title: string;
    subtitle: string;
  };
  operations: {
    badge: string;
    title: string;
    subtitle: string;
  };
  facts: {
    badge: string;
    title: string;
    subtitle: string;
    facts: Array<{ value: string; label: string; source: string }>;
  };
  signature: {
    kicker: string;
    title: string;
    sub: string;
    domain: string;
  };
};

export const AUTOHUB_COPY: Record<FilmLanguage, AutohubCopy> = {
  es: {
    opening: {
      kicker: "PLATAFORMA AUTOMOTRIZ DIGITAL",
      title: "AUTOHUB 360",
      subtitle: "CONCESIONARIA DIGITAL Y GESTIÓN INTEGRAL",
      tagline: "Visualización inmersiva 360°, inventario dinámico y central de operaciones",
    },
    cinematic: {
      kicker: "EXPERIENCIA DE COMPRA REINVENTADA",
      title: "EL VEHÍCULO EN DETALLE ANTES DE VISITAR EL SALÓN",
      subtitle: "Catálogo interactivo con filtrado inteligente, fichas enriquecidas y exploración esférica.",
    },
    tour: {
      badge: "VISOR ESFÉRICO WEBGL",
      title: "TOUR INTERIOR 360°",
      subtitle: "8 marcadores interactivos clasificados por material, tecnología y confort.",
      modeLabel: "MODO EXPLORACIÓN ESFÉRICA",
      hint: "Rotación libre 360° • Click en marcadores para inspección detallada",
    },
    reel: {
      badge: "INVENTARIO Y DIGITALIZACIÓN",
      title: "FICHAS TÉCNICAS Y PRODUCCIÓN VIP",
      subtitle: "Fotografía profesional de salón, simulador paramétrico de cuotas y reportes mecánicos.",
    },
    operations: {
      badge: "GESTIÓN DE AGENCIA",
      title: "CENTRAL DE OPERACIONES",
      subtitle: "Inventario en tiempo real, CRM de clientes, seguimiento de taller y facturación.",
    },
    facts: {
      badge: "LO QUE HAY EN PRODUCCIÓN",
      title: "UN CATÁLOGO 360° CON SU PANEL DE GESTIÓN",
      subtitle: "Catálogo digital con precarga optimizada de texturas esféricas y experiencia fluida.",
      facts: [
        { value: formatFact(AUTOHUB_FACTS.catalogUnits, "es"), label: "Unidades vehiculares en catálogo activo", source: AUTOHUB_FACTS.catalogUnits.source },
        { value: formatFact(AUTOHUB_FACTS.tourHotspots, "es"), label: "Puntos de interés en el visor 360°", source: AUTOHUB_FACTS.tourHotspots.source },
        { value: formatFact(AUTOHUB_FACTS.inspectionPoints, "es"), label: "Puntos técnicos verificados en inspección", source: AUTOHUB_FACTS.inspectionPoints.source },
        { value: formatFact(AUTOHUB_FACTS.adminModules, "es"), label: "Módulos de gestión operativa en panel", source: AUTOHUB_FACTS.adminModules.source },
        { value: formatFact(AUTOHUB_FACTS.ambientLightingColors, "es"), label: "Tonalidades de iluminación ambiental", source: AUTOHUB_FACTS.ambientLightingColors.source },
        { value: formatFact(AUTOHUB_FACTS.vipServices, "es"), label: "Servicios de digitalización para agencias", source: AUTOHUB_FACTS.vipServices.source },
      ],
    },
    signature: {
      kicker: "DISEÑO Y DESARROLLO",
      title: "MARIO MORERA",
      sub: "Ingeniería de software, experiencia WebGL e interfaces digitales.",
      domain: "auto-indol-five.vercel.app",
    },
  },
  en: {
    opening: {
      kicker: "DIGITAL AUTOMOTIVE PLATFORM",
      title: "AUTOHUB 360",
      subtitle: "DIGITAL DEALERSHIP & FULL OPERATIONS",
      tagline: "Immersive 360° exploration, dynamic catalog, and operational management",
    },
    cinematic: {
      kicker: "REINVENTED BUYING JOURNEY",
      title: "EVERY VEHICLE DETAIL BEFORE VISITING THE LOT",
      subtitle: "Interactive catalog with smart filters, enriched data sheets, and spherical tour.",
    },
    tour: {
      badge: "WEBGL SPHERICAL VIEWER",
      title: "360° INTERIOR TOUR",
      subtitle: "8 interactive hotspots categorized by material, tech, and cabin comfort.",
      modeLabel: "SPHERICAL EXPLORATION MODE",
      hint: "Free 360° rotation • Click markers for granular component inspection",
    },
    reel: {
      badge: "INVENTORY & MEDIA PRODUCTION",
      title: "TECHNICAL SPECS & VIP MEDIA",
      subtitle: "Showroom photography, parametric installment simulator, and inspection reports.",
    },
    operations: {
      badge: "DEALERSHIP MANAGEMENT",
      title: "OPERATIONS CENTER",
      subtitle: "Real-time inventory, customer CRM, workshop floor tracking, and automated billing.",
    },
    facts: {
      badge: "WHAT RUNS IN PRODUCTION",
      title: "A 360° CATALOG WITH ITS MANAGEMENT PANEL",
      subtitle: "Digital catalog engineered with progressive spherical texture loading and smooth interaction.",
      facts: [
        { value: formatFact(AUTOHUB_FACTS.catalogUnits, "en"), label: "Vehicle units in active catalog", source: AUTOHUB_FACTS.catalogUnits.source },
        { value: formatFact(AUTOHUB_FACTS.tourHotspots, "en"), label: "Interactive hotspots in 360° viewer", source: AUTOHUB_FACTS.tourHotspots.source },
        { value: formatFact(AUTOHUB_FACTS.inspectionPoints, "en"), label: "Technical points verified in inspection", source: AUTOHUB_FACTS.inspectionPoints.source },
        { value: formatFact(AUTOHUB_FACTS.adminModules, "en"), label: "Operational modules in management panel", source: AUTOHUB_FACTS.adminModules.source },
        { value: formatFact(AUTOHUB_FACTS.ambientLightingColors, "en"), label: "Ambient illumination shades", source: AUTOHUB_FACTS.ambientLightingColors.source },
        { value: formatFact(AUTOHUB_FACTS.vipServices, "en"), label: "Digital production services for dealerships", source: AUTOHUB_FACTS.vipServices.source },
      ],
    },
    signature: {
      kicker: "DESIGN & DEVELOPMENT",
      title: "MARIO MORERA",
      sub: "Software engineering, WebGL experience, and digital interfaces.",
      domain: "auto-indol-five.vercel.app",
    },
  },
};
