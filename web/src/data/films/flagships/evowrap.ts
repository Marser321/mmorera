import type { FilmLanguage, Localized } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de EvoWrap:
 * "Estética absoluta y protección automotriz de lujo".
 *
 * Fuente: el sitio publicado (evowrap.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/evowrap.md.
 */

export const EVO_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 8 },
  { id: "transformation", kind: "before-after", seconds: 14 },
  { id: "selector", kind: "finish-selector", seconds: 24 },
  { id: "services", kind: "scroll-reel", seconds: 12 },
  { id: "specs", kind: "fact-wall", seconds: 13 },
  { id: "signature", kind: "signature", seconds: 4.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const evoTimeline = timelineFrom(EVO_SCENES);
export const EVO_TIMELINE = evoTimeline.slots;
export const EVO_DURATION = evoTimeline.durationInFrames;

/** Cifras verificadas del sitio en producción. */
export const EVO_FACTS = {
  finishes: { value: 8, source: "Dossier · /visualizer: 8 selectores interactivos de material y acabado vehicular" },
  services: { value: 4, source: "Dossier · /services: 4 líneas de especialidad (cerámico, PPF, wrapping e interior)" },
  fields: { value: 5, source: "Dossier · /booking: 5 campos de captura para agendamiento de visita" },
  pillars: { value: 4, source: "Dossier · Home y footer: 4 pilares de marca (Protection, Ceramic, Detailing, Evolution)" },
  stages: { value: 2, source: "Dossier · Home, sección de transformación: 2 estados comparados en el deslizador antes y después" },
  routes: { value: 4, source: "Dossier · /services: 4 páginas de servicio dedicadas con especificación técnica" },
} as const satisfies Record<string, FilmFact>;

export const EVO_FINISH_KEYS = [
  "original",
  "stealth",
  "nardo",
  "satin",
  "purple",
  "red",
  "miami",
  "gold",
] as const;

export type EvoFinishKey = (typeof EVO_FINISH_KEYS)[number];

export type EvoFinishDef = {
  id: EvoFinishKey;
  code: string;
  name: Localized;
  type: Localized;
  colorHex: string;
  sheen: Localized;
};

export const EVO_FINISHES: ReadonlyArray<EvoFinishDef> = [
  {
    id: "original",
    code: "01",
    name: { es: "Original", en: "Original" },
    type: { es: "Fábrica OEM", en: "OEM Factory" },
    colorHex: "#333333",
    sheen: { es: "Brillo estándar", en: "Standard Gloss" },
  },
  {
    id: "stealth",
    code: "02",
    name: { es: "Matte Stealth", en: "Matte Stealth" },
    type: { es: "Satin Wrap", en: "Satin Wrap" },
    colorHex: "#111111",
    sheen: { es: "Negro mate sedoso", en: "Silky Matte Black" },
  },
  {
    id: "nardo",
    code: "03",
    name: { es: "Nardo Grey", en: "Nardo Grey" },
    type: { es: "High Gloss", en: "High Gloss" },
    colorHex: "#6B7280",
    sheen: { es: "Gris nardo espejo", en: "Mirror Nardo Grey" },
  },
  {
    id: "satin",
    code: "04",
    name: { es: "Satin White", en: "Satin White" },
    type: { es: "Pearl Wrap", en: "Pearl Wrap" },
    colorHex: "#E5E7EB",
    sheen: { es: "Blanco perla satinado", en: "Satin Pearl White" },
  },
  {
    id: "purple",
    code: "05",
    name: { es: "Midnight Purple", en: "Midnight Purple" },
    type: { es: "Metallic", en: "Metallic" },
    colorHex: "#4C1D95",
    sheen: { es: "Púrpura metalizado", en: "Metallic Violet" },
  },
  {
    id: "red",
    code: "06",
    name: { es: "Race Red", en: "Race Red" },
    type: { es: "Ultra Gloss", en: "Ultra Gloss" },
    colorHex: "#DC2626",
    sheen: { es: "Rojo carrera intenso", en: "Intense Race Red" },
  },
  {
    id: "miami",
    code: "07",
    name: { es: "Miami Blue", en: "Miami Blue" },
    type: { es: "High Gloss", en: "High Gloss" },
    colorHex: "#0284C7",
    sheen: { es: "Azul costa brillante", en: "Bright Coast Blue" },
  },
  {
    id: "gold",
    code: "08",
    name: { es: "EVO Gold", en: "EVO Gold" },
    type: { es: "Signature Metallic", en: "Signature Metallic" },
    colorHex: "#F59E0B",
    sheen: { es: "Dorado ámbar firma", en: "Signature Amber Gold" },
  },
];

const BRAND = "/portfolio/brands/evowrap";

export const EVO_ASSETS = {
  ferrariBefore: { src: `${BRAND}/ferrari-before.jpg`, w: 1024, h: 1024 },
  ferrariAfter: { src: `${BRAND}/ferrari-after.jpg`, w: 1024, h: 1024 },
  porscheCeramic: { src: `${BRAND}/porsche-ceramic-shine.jpg`, w: 1080, h: 1920 },
  matteGtr: { src: `${BRAND}/matte-black-gtr.jpg`, w: 1000, h: 667 },
  ppfInstall: { src: `${BRAND}/ppf-application.jpg`, w: 1080, h: 1080 },
  hero: { src: `${BRAND}/shots/hero.jpg`, w: 1920, h: 1200 },
  transformation: { src: `${BRAND}/shots/transformation.jpg`, w: 1920, h: 1080 },
  services: { src: `${BRAND}/shots/services.jpg`, w: 1920, h: 1200 },
  visualizer: { src: `${BRAND}/shots/visualizer.jpg`, w: 1920, h: 1080 },
  booking: { src: `${BRAND}/shots/booking.jpg`, w: 1920, h: 1080 },
} as const satisfies Record<string, FilmAsset>;

export const EVO_HOST = "evowrap.vercel.app";

const L = (es: string, en: string): Localized => ({ es, en });

export const EVO_CHAPTERS: FlagshipChapter[] = [
  {
    id: "identity",
    label: L("Identidad", "Identity"),
    caption: L(
      "EvoWrap: estética automotriz y protección de alto nivel.",
      "EvoWrap: high-end automotive aesthetics and paint protection.",
    ),
    from: 0,
    durationInFrames: EVO_TIMELINE.transformation.from,
  },
  {
    id: "transformation",
    label: L("Transformación", "Transformation"),
    caption: L(
      "Deslizador interactivo antes y después: de lo estándar a lo extraordinario.",
      "Interactive before-and-after slider: from standard to extraordinary.",
    ),
    from: EVO_TIMELINE.transformation.from,
    durationInFrames: EVO_TIMELINE.transformation.duration,
  },
  {
    id: "selector",
    label: L("Configurador 3D", "3D Configurator"),
    caption: L(
      "Ocho acabados y texturas automotrices en tiempo real sobre el modelo tridimensional.",
      "Eight automotive finishes and textures in real time on the 3D model.",
    ),
    from: EVO_TIMELINE.selector.from,
    durationInFrames: EVO_TIMELINE.selector.duration,
  },
  {
    id: "services",
    label: L("Servicios", "Services"),
    caption: L(
      "Cuatro líneas de especialidad: cerámico, film protector, vinilo e interior.",
      "Four specialty lines: ceramic coating, paint protection, vinyl wrap, and interior.",
    ),
    from: EVO_TIMELINE.services.from,
    durationInFrames: EVO_TIMELINE.services.duration,
  },
  {
    id: "specs",
    label: L("Especificaciones", "Specifications"),
    caption: L(
      "Métricas técnicas, catálogo estructurado y agendamiento vehicular directo.",
      "Technical metrics, structured catalog, and direct vehicle scheduling.",
    ),
    from: EVO_TIMELINE.specs.from,
    durationInFrames: EVO_TIMELINE.specs.duration + EVO_TIMELINE.signature.duration,
  },
];

export type EvoServiceItem = {
  num: string;
  title: string;
  badge: string;
  description: string;
};

export type EvoCopy = {
  opening: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  transformation: {
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
    note: string;
  };
  selector: {
    kicker: string;
    title: string;
    subtitle: string;
    badge: string;
    hint: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: Array<EvoServiceItem>;
  };
  specs: {
    title: string;
    subtitle: string;
    facts: Array<{ value: string; label: string; source: string }>;
  };
};

export const EVO_COPY: Record<FilmLanguage, EvoCopy> = {
  es: {
    opening: {
      kicker: "Estética Automotriz · High-End Studio",
      title: "EvoWrap",
      subtitle: "Reinventa tu vehículo con acabados de vanguardia y protección cerámica certificada.",
    },
    transformation: {
      title: "De lo estándar a lo extraordinario",
      subtitle: "Comparador interactivo de dos estados sobre carrocería de superdeportivo.",
      beforeLabel: "Estado Estándar",
      afterLabel: "Acabado EvoWrap",
      note: "Pintura base frente a vinilado integral con sellado cerámico hidrofóbico.",
    },
    selector: {
      kicker: "Visualizador tridimensional · /visualizer",
      title: "Configurador en tiempo real",
      subtitle: "Exploración de 8 acabados de pintura, vinilo y textura sobre el modelo vehicular.",
      badge: "8 Acabados interactivos",
      hint: "Cambio instantáneo de pigmento, reflectividad y acabado satinado.",
    },
    services: {
      title: "Cuatro especialidades de estudio",
      subtitle: "Tratamientos dedicados para protección, color y preservación vehicular.",
      items: [
        {
          num: "01",
          title: "Tratamiento Cerámico",
          badge: "Protección 9H",
          description: "Sellado nanotecnológico con brillo profundo y repelencia hidrofóbica extrema.",
        },
        {
          num: "02",
          title: "Paint Protection Film",
          badge: "PPF Autorregenerable",
          description: "Film de uretano transparente contra impacto de gravilla, salitre y microrrayas.",
        },
        {
          num: "03",
          title: "Color Change Wrap",
          badge: "Vinilos Fundidos",
          description: "Transformación integral de tono en acabados brillo, satinado, mate y metálico.",
        },
        {
          num: "04",
          title: "Interior Boutique",
          badge: "Detailing y Cuero",
          description: "Acondicionamiento minucioso de habitáculo, hidratación de cuero y filtros UV.",
        },
      ],
    },
    specs: {
      title: "Rigor técnico y arquitectura visual",
      subtitle: "Estructura verificada en producción sobre evowrap.vercel.app.",
      facts: [
        { value: formatFact(EVO_FACTS.finishes, "es"), label: "Acabados en el visualizador 3D", source: EVO_FACTS.finishes.source },
        { value: formatFact(EVO_FACTS.services, "es"), label: "Líneas de servicio automotor", source: EVO_FACTS.services.source },
        { value: formatFact(EVO_FACTS.fields, "es"), label: "Campos de agendamiento de visita", source: EVO_FACTS.fields.source },
        { value: formatFact(EVO_FACTS.pillars, "es"), label: "Pilares institucionales de marca", source: EVO_FACTS.pillars.source },
        { value: formatFact(EVO_FACTS.stages, "es"), label: "Estados en el comparador visual", source: EVO_FACTS.stages.source },
        { value: formatFact(EVO_FACTS.routes, "es"), label: "Rutas técnicas dedicadas", source: EVO_FACTS.routes.source },
      ],
    },
  },
  en: {
    opening: {
      kicker: "Automotive Aesthetics · High-End Studio",
      title: "EvoWrap",
      subtitle: "Reinvent your vehicle with cutting-edge finishes and certified ceramic protection.",
    },
    transformation: {
      title: "From standard to extraordinary",
      subtitle: "Interactive two-stage comparison on high-performance supercar bodywork.",
      beforeLabel: "Standard Factory",
      afterLabel: "EvoWrap Finish",
      note: "Stock paintwork compared with full vinyl wrap and hydrophobic ceramic sealing.",
    },
    selector: {
      kicker: "Three-dimensional visualizer · /visualizer",
      title: "Real-time configurator",
      subtitle: "Interactive exploration of 8 paint, vinyl, and texture finishes on the vehicle model.",
      badge: "8 Interactive finishes",
      hint: "Instant switching of pigmentation, reflectivity, and satin sheen levels.",
    },
    services: {
      title: "Four studio specialties",
      subtitle: "Dedicated treatments for protection, color alteration, and vehicle preservation.",
      items: [
        {
          num: "01",
          title: "Ceramic Coating",
          badge: "9H Protection",
          description: "Nanotechnology sealing delivering deep gloss and extreme hydrophobic repellency.",
        },
        {
          num: "02",
          title: "Paint Protection Film",
          badge: "Self-healing PPF",
          description: "Clear urethane shield guarding against road debris, stone chips, and swirl marks.",
        },
        {
          num: "03",
          title: "Color Change Wrap",
          badge: "Cast Vinyls",
          description: "Complete exterior color transformation across gloss, satin, matte, and metallic finishes.",
        },
        {
          num: "04",
          title: "Interior Boutique",
          badge: "Detailing & Leather",
          description: "Meticulous cabin reconditioning, premium leather nourishment, and UV barrier care.",
        },
      ],
    },
    specs: {
      title: "Technical rigor & visual architecture",
      subtitle: "Verified production structure on evowrap.vercel.app.",
      facts: [
        { value: formatFact(EVO_FACTS.finishes, "en"), label: "Finishes in 3D visualizer", source: EVO_FACTS.finishes.source },
        { value: formatFact(EVO_FACTS.services, "en"), label: "Automotive service lines", source: EVO_FACTS.services.source },
        { value: formatFact(EVO_FACTS.fields, "en"), label: "Fields in visit booking form", source: EVO_FACTS.fields.source },
        { value: formatFact(EVO_FACTS.pillars, "en"), label: "Core brand pillars", source: EVO_FACTS.pillars.source },
        { value: formatFact(EVO_FACTS.stages, "en"), label: "Stages in visual comparison slider", source: EVO_FACTS.stages.source },
        { value: formatFact(EVO_FACTS.routes, "en"), label: "Dedicated technical service routes", source: EVO_FACTS.routes.source },
      ],
    },
  },
};
