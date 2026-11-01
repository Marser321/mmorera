import type { FilmLanguage } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de La Nueva Brasil (LNB SaaS):
 * "Panadería, Confitería y Cafetería de Especialidad con Craving Studios y The Cake Studio".
 *
 * Fuente: el sitio publicado (lnb-saass.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/lnb-saas.md.
 */

export const LNB_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 7.0 },
  { id: "studios", kind: "card-mosaic", seconds: 8.5 },
  { id: "builder", kind: "cake-builder", seconds: 24.0 },
  { id: "express", kind: "catalog-flow", seconds: 9.5 },
  { id: "club", kind: "loyalty-card", seconds: 9.0 },
  { id: "metrics", kind: "outcome-facts", seconds: 7.0 },
  { id: "signature", kind: "signature", seconds: 6.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const lnbTimeline = timelineFrom(LNB_SCENES);
export const LNB_TIMELINE = lnbTimeline.slots;
export const LNB_DURATION = lnbTimeline.durationInFrames;

/**
 * Cifras de lo construido. La calificación de clientes que muestra el portal
 * es contenido de muestra y no va; los puntos y el ahorro de Crumb Club son la
 * tarjeta de ejemplo del sitio y se rotulan así.
 */
export const LNB_FACTS = {
  pickupMinutes: { value: 15, source: "Dossier · /: retiro express programado a 15 minutos (opción del pedido en el sitio)" },
  catalogProducts: { value: 50, source: "Dossier · /: +50 productos activos en el catálogo de cafetería, panadería y postres" },
  crumbPoints: { value: 245, source: "Dossier · /crumb-club: 245 puntos acumulados en la tarjeta demo de Crumb Club" },
  crumbSaved: { value: 2450, source: "Dossier · /crumb-club: $2450 en la tarjeta demo de Crumb Club" },
  startPlan: { value: 15000, source: "Dossier · /subscription: $15.000/mes Plan LNB Start" },
  clubPlan: { value: 28000, source: "Dossier · /subscription: $28.000/mes Plan LNB Club" },
  blackPlan: { value: 42000, source: "Dossier · /subscription: $42.000/mes Plan LNB Black" },
  studiosCount: { value: 4, source: "Dossier · /: 4 Craving Studios modulares integrados" },
  builderSteps: { value: 3, source: "Dossier · /studio: 3 fases interactivas de creación en The Cake Studio" },
} as const satisfies Record<string, FilmFact>;

export const LNB_STUDIOS = [
  {
    id: "cakes",
    title: { es: "The Cake Studio", en: "The Cake Studio" },
    tag: { es: "Pastelería Personalizada", en: "Custom Pastry" },
    desc: {
      es: "Personalización interactiva capa por capa de bizcochuelos, rellenos y coberturas.",
      en: "Interactive layer-by-layer customization of sponge, fillings and frostings.",
    },
  },
  {
    id: "pizzas",
    title: { es: "Pizza Lab", en: "Pizza Lab" },
    tag: { es: "Masa Madre & Fermentación", en: "Sourdough & Ferment" },
    desc: {
      es: "Masas de larga fermentación artesanal horneadas al punto con ingredientes frescos.",
      en: "Artisanal long-fermentation crusts baked to order with premium fresh ingredients.",
    },
  },
  {
    id: "burgers",
    title: { es: "Burger Craft", en: "Burger Craft" },
    tag: { es: "Pan Brioche Casero", en: "Homemade Brioche" },
    desc: {
      es: "Medallones seleccionados servidos en panes horneados a diario en la panadería.",
      en: "Selected patties served on freshly baked brioche buns crafted daily in-house.",
    },
  },
  {
    id: "empanadas",
    title: { es: "Empanada Bar", en: "Empanada Bar" },
    tag: { es: "Repulgue Tradicional", en: "Traditional Fold" },
    desc: {
      es: "Rellenos clásicos y de autor elaborados con hojaldre crocante y cocción dorada.",
      en: "Classic and signature savory fillings wrapped in golden flaky pastry.",
    },
  },
];

export const LNB_BUILDER_STEPS = [
  {
    step: "01",
    phase: { es: "Bizcochuelo Base", en: "Sponge Base" },
    choice: { es: "Vainilla Bourbon", en: "Bourbon Vanilla" },
    desc: {
      es: "Masa esponjosa con extracto natural de vainilla y textura aireada.",
      en: "Fluffy sponge crumb infused with natural vanilla bean extract.",
    },
    weight: { es: "Base 1.2 kg", en: "1.2 kg base" },
  },
  {
    step: "02",
    phase: { es: "Relleno Artesanal", en: "Artisanal Filling" },
    choice: { es: "Dulce de Leche & Frutos Rojos", en: "Dulce de Leche & Berries" },
    desc: {
      es: "Doble capa generosa de dulce repostero artesanal y compota silvestre.",
      en: "Generous double layer of rich confectionery caramel and woodland berries.",
    },
    weight: { es: "Relleno +0.8 kg", en: "+0.8 kg filling" },
  },
  {
    step: "03",
    phase: { es: "Cobertura & Estilo", en: "Frosting & Finish" },
    choice: { es: "Merengue Italiano Dorado", en: "Golden Italian Meringue" },
    desc: {
      es: "Acabado brillante con sopleteado suave y perlas decorativas comestibles.",
      en: "Silky flamed meringue peaks crowned with delicate edible pearls.",
    },
    weight: { es: "Total 2.0 kg · 12-16 porciones", en: "Total 2.0 kg · 12-16 servings" },
  },
];

export const LNB_TIERS = [
  {
    id: "start",
    name: "LNB Start",
    price: "$15.000",
    cadence: { es: "por mes", en: "per month" },
    highlight: false,
    perks: [
      { es: "5 cafés de especialidad al mes", en: "5 specialty coffees monthly" },
      { es: "Retiro express en mostrador sin filas", en: "Express counter pickup with zero lines" },
      { es: "Acumulación de puntos Crumb Club", en: "Crumb Club points accumulation" },
      { es: "Acceso temprano a lanzamientos", en: "Early access to seasonal drops" },
    ],
  },
  {
    id: "club",
    name: "LNB Club",
    price: "$28.000",
    cadence: { es: "por mes", en: "per month" },
    highlight: true,
    badge: { es: "Más elegido", en: "Most popular" },
    perks: [
      { es: "1 café diario de lunes a viernes", en: "1 daily coffee Monday to Friday" },
      { es: "Pieza de panadería seleccionada semanal", en: "Weekly curated pastry item" },
      { es: "Vaso térmico LNB de edición limitada", en: "Limited edition LNB thermal cup" },
      { es: "Prioridad alta en The Cake Studio", en: "High priority in The Cake Studio" },
    ],
  },
  {
    id: "black",
    name: "LNB Black",
    price: "$42.000",
    cadence: { es: "por mes", en: "per month" },
    highlight: false,
    perks: [
      { es: "Café de especialidad ilimitado todos los días", en: "Unlimited specialty coffee every day" },
      { es: "Torta de cumpleaños completa incluida", en: "Full birthday celebration cake included" },
      { es: "Acceso VIP a catas y salón privado", en: "VIP access to cuppings and private lounge" },
      { es: "Puntos Crumb con multiplicador preferencial", en: "Crumb points with preferential tier" },
    ],
  },
];

export const LNB_CHAPTERS: ReadonlyArray<FlagshipChapter> = [
  {
    id: "studios",
    from: 0,
    durationInFrames: 465,
    label: { es: "Tradición & Studios", en: "Tradition & Studios" },
    caption: { es: "Panadería artesanal y 4 Craving Studios digitales", en: "Artisanal bakery and 4 digital Craving Studios" },
  },
  {
    id: "builder",
    from: 465,
    durationInFrames: 720,
    label: { es: "The Cake Studio", en: "The Cake Studio" },
    caption: { es: "Personalizador interactivo de tortas capa por capa", en: "Layer-by-layer interactive custom cake builder" },
  },
  {
    id: "express",
    from: 1185,
    durationInFrames: 555,
    label: { es: "Express & Fidelización", en: "Express & Loyalty" },
    caption: { es: "Retiro en 15 minutos, Crumb Club y LNB Pass", en: "15-minute pickup, Crumb Club and LNB Pass" },
  },
  {
    id: "signature",
    from: 1740,
    durationInFrames: 405,
    label: { es: "Lo construido y firma", en: "What was built & signature" },
    caption: { es: "Catálogo, studios y planes que hay en producción", en: "Catalog, studios and plans in production" },
  },
];

export const LNB_ASSETS: Record<string, FilmAsset> = {
  heroLoop: {
    src: "/portfolio/brands/lnb-saas/hero-loop.mp4",
    w: 1920,
    h: 1080,
    seconds: 4.0,
    webm: "/portfolio/brands/lnb-saas/hero-loop.webm",
  },
  homeShot: {
    src: "/portfolio/brands/lnb-saas/shots/home.jpg",
    w: 1920,
    h: 1080,
  },
  studioShot: {
    src: "/portfolio/brands/lnb-saas/shots/studio.jpg",
    w: 1920,
    h: 1080,
  },
  expressShot: {
    src: "/portfolio/brands/lnb-saas/shots/express.jpg",
    w: 1920,
    h: 1080,
  },
  crumbShot: {
    src: "/portfolio/brands/lnb-saas/shots/crumb.jpg",
    w: 1920,
    h: 1080,
  },
  subscriptionShot: {
    src: "/portfolio/brands/lnb-saas/shots/subscription.jpg",
    w: 1920,
    h: 1080,
  },
  kitchenShot: {
    src: "/portfolio/brands/lnb-saas/shots/kitchen.jpg",
    w: 1920,
    h: 1080,
  },
};

export const LNB_COPY = {
  kicker: {
    es: "PANADERÍA, CONFITERÍA Y CAFÉ DE ESPECIALIDAD · PUNTA DEL ESTE",
    en: "SPECIALTY BAKERY, PASTRY & ROASTERY · PUNTA DEL ESTE",
  },
  tagline: {
    es: "TRADICIÓN ARTESANAL CON EXPERIENCIA DIGITAL",
    en: "ARTISANAL TRADITION WITH DIGITAL EXPERIENCE",
  },
  sub: {
    es: "Craving Studios interactivos, personalización de tortas capa por capa y pedidos express para la playa sin esperas.",
    en: "Interactive Craving Studios, layer-by-layer custom cake builder and zero-queue beach express pickup.",
  },
  studios: {
    kicker: { es: "CRAVING STUDIOS MODULARES", en: "MODULAR CRAVING STUDIOS" },
    title: { es: "CUATRO STUDIOS DE ESPECIALIDAD", en: "FOUR DEDICATED SPECIALTY STUDIOS" },
    sub: {
      es: "Módulos digitales para componer tortas a medida, pizzas de masa madre, burgers caseras y empanadas de autor.",
      en: "Digital studios to craft custom cakes, sourdough pizzas, artisanal burgers and signature empanadas.",
    },
  },
  builder: {
    kicker: { es: "THE CAKE STUDIO · PERSONALIZADOR", en: "THE CAKE STUDIO · INTERACTIVE BUILDER" },
    title: { es: "DISEÑO DE PASTELERÍA CAPA POR CAPA", en: "LAYER-BY-LAYER PASTRY CRAFT" },
    sub: {
      es: "Tres fases interactivas de creación con previsualización en tiempo real y cálculo exacto de porciones.",
      en: "Three interactive creation stages featuring real-time preview and exact serving estimation.",
    },
    hint: { es: "Configurador en vivo · Selección de bizcochuelo, relleno y cobertura", en: "Live builder · Sponge, filling and frosting selection" },
  },
  express: {
    kicker: { es: "LNB EXPRESS · RETIRO ÁGIL", en: "LNB EXPRESS · FAST PICKUP" },
    title: { es: "CAFETERÍA PARA LA PLAYA EN 15 MINUTOS", en: "BEACH COFFEE & PASTRY IN 15 MINUTES" },
    sub: {
      es: "Catálogo ágil sincronizado en tiempo real con el monitor KDS de cocina para retirar en mostrador sin filas.",
      en: "Agile catalog synced in real time with the kitchen KDS monitor for counter pickup with zero lines.",
    },
  },
  club: {
    kicker: { es: "FIDELIZACIÓN & SUSCRIPCIONES", en: "LOYALTY & RECURRING PASS" },
    title: { es: "CRUMB CLUB & MEMBRESÍAS LNB PASS", en: "CRUMB CLUB & LNB PASS TIERS" },
    sub: {
      es: "Puntos acumulables en cada visita y planes mensuales para amantes del café de especialidad.",
      en: "Points earned on every order and monthly membership plans for specialty coffee lovers.",
    },
  },
  metrics: {
    kicker: { es: "LO QUE HAY EN PRODUCCIÓN", en: "WHAT RUNS IN PRODUCTION" },
    title: { es: "UNA PLATAFORMA, CUATRO STUDIOS", en: "ONE PLATFORM, FOUR STUDIOS" },
    catalog: { es: "Productos en el catálogo de cafetería y panadería", en: "Products in the coffee and bakery catalog" },
    builder: { es: "Fases de The Cake Studio", en: "The Cake Studio phases" },
    plans: { es: "Planes de suscripción LNB Pass", en: "LNB Pass subscription plans" },
    studios: { es: "Craving Studios: tortas, pizza, burgers y empanadas", en: "Craving Studios: cakes, pizza, burgers and empanadas" },
  },
  cta: {
    headline: { es: "LA NUEVA BRASIL", en: "LA NUEVA BRASIL" },
    sub: {
      es: "El sabor de siempre, ahora con la agilidad y precisión de una plataforma digital moderna.",
      en: "Artisanal bakery tradition elevated with the speed and elegance of modern digital craft.",
    },
    button: { es: "Explorar Menú & Studios", en: "Explore Menu & Studios" },
  },
};

export function lnbFact(key: keyof typeof LNB_FACTS, lang: FilmLanguage): string {
  const fact = LNB_FACTS[key];
  return formatFact(fact, lang);
}
