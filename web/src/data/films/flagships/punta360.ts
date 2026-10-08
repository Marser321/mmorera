import type { FilmLanguage } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de Punta360:
 * "Marketing Visual Inmobiliario de Lujo y Producción 3D en Punta del Este".
 *
 * Fuente: el sitio publicado (punta-360.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/punta-360.md.
 */

export const PUNTA_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 7.0 },
  { id: "comparison", kind: "before-after", seconds: 8.5 },
  { id: "tour", kind: "virtual-tour", seconds: 24.0 },
  { id: "workflow", kind: "checklist", seconds: 9.5 },
  { id: "plans", kind: "pipeline-board", seconds: 9.0 },
  { id: "metrics", kind: "outcome-facts", seconds: 7.0 },
  { id: "signature", kind: "signature", seconds: 6.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const puntaTimeline = timelineFrom(PUNTA_SCENES);
export const PUNTA_TIMELINE = puntaTimeline.slots;
export const PUNTA_DURATION = puntaTimeline.durationInFrames;

/**
 * Cifras de lo construido (estructura del sitio). Las métricas comerciales que
 * el sitio muestra como marketing del cliente (efectividad, días en mercado,
 * propiedades producidas) no son resultados verificables del trabajo y no van.
 */
export const PUNTA_FACTS = {
  plans: { value: 3, source: "Dossier · /enterprise: catálogo de 3 planes de suscripción para agentes" },
  solo: { value: 99, source: "Dossier · /enterprise: USD $99/mes Plan Agente Solo" },
  growth: { value: 399, source: "Dossier · /enterprise: USD $399/mes Plan Agencia Growth" },
  scale: { value: 899, source: "Dossier · /enterprise: USD $899/mes Plan Scale" },
  disciplines: { value: 4, source: "Dossier · /owners: 4 disciplinas de producción visual integradas" },
  steps: { value: 4, source: "Dossier · /owners: 4 fases del flujo de trabajo Simple y Transparente" },
} as const satisfies Record<string, FilmFact>;

export const PUNTA_DISCIPLINES = [
  {
    id: "editorial",
    title: { es: "Fotografía Editorial", en: "Editorial Photography" },
    tag: { es: "Calidad Revista", en: "Magazine Quality" },
    desc: {
      es: "Capturamos la luz natural y arquitectura con estándares editoriales internacionales.",
      en: "Natural light capture and architectural staging matching international editorial standards.",
    },
  },
  {
    id: "tour-3d",
    title: { es: "Tour Inmersivo 3D", en: "3D Immersive Tour" },
    tag: { es: "Escaneo Espacial", en: "Spatial Scanning" },
    desc: {
      es: "Permite a compradores remotos caminar por cada ambiente con fidelidad milimétrica.",
      en: "Allows international buyers to walk through spaces with millimeter fidelity.",
    },
  },
  {
    id: "drone-4k",
    title: { es: "Cinematografía Aérea", en: "Aerial Cinematography" },
    tag: { es: "Drones 4K HDR", en: "4K HDR Drones" },
    desc: {
      es: "Vuelos cinemáticos que revelan la escala de la propiedad y su entorno costero.",
      en: "Cinematic drone passes highlighting property scale and privileged coastal context.",
    },
  },
  {
    id: "social-strategy",
    title: { es: "Estrategia de Redes", en: "Social Video Strategy" },
    tag: { es: "Formato Vertical", en: "Vertical Format" },
    desc: {
      es: "Edición dinámica en alta resolución para impactar en audiencias de alto patrimonio.",
      en: "High-impact vertical reels engineered to engage qualified high-net-worth buyers.",
    },
  },
];

export const PUNTA_HOTSPOTS = [
  {
    id: "living",
    x: 0.28,
    y: 0.44,
    title: { es: "Living Principal", en: "Main Living Hall" },
    detail: { es: "Doble altura con ventanales hacia la costa", en: "Double-height glass facing ocean line" },
  },
  {
    id: "kitchen",
    x: 0.52,
    y: 0.58,
    title: { es: "Cocina Gourmet", en: "Gourmet Kitchen" },
    detail: { es: "Isla de mármol y equipamiento empotrado", en: "Marble island with integrated appliances" },
  },
  {
    id: "terrace",
    x: 0.74,
    y: 0.38,
    title: { es: "Terraza & Piscina", en: "Infinity Deck" },
    detail: { es: "Deck voladizo con solárium y vista despejada", en: "Cantilever deck with sunset solarium" },
  },
];

export const PUNTA_WORKFLOW = [
  {
    step: "01",
    title: { es: "Agenda tu Visita", en: "Schedule Visit" },
    desc: { es: "Coordinación y relevamiento en 24 horas", en: "Coordination and scoping within 24 hours" },
  },
  {
    step: "02",
    title: { es: "Producción Visual", en: "Visual Production" },
    desc: { es: "Sesión fotográfica, escaneo 3D y filmación aérea", en: "Photography session, 3D scan and aerial drone" },
  },
  {
    step: "03",
    title: { es: "Lanzamiento Global", en: "Global Launch" },
    desc: { es: "Entrega de activos optimizados y distribución", en: "Optimized multi-channel asset delivery" },
  },
  {
    step: "04",
    title: { es: "Cierre Exitoso", en: "Successful Closing" },
    desc: { es: "Material listo para publicar y presentar a compradores", en: "Material ready to publish and present to buyers" },
  },
];

export const PUNTA_TIERS = [
  {
    id: "solo",
    name: "Agente Solo",
    price: "$99",
    cadence: { es: "por mes", en: "per month" },
    highlight: false,
    perks: [
      { es: "Hasta 5 propiedades", en: "Up to 5 properties" },
      { es: "1 Tour 360° incluido al mes", en: "1 360° Tour included/month" },
      { es: "Fotografía profesional básica", en: "Basic professional photography" },
      { es: "Leads directos a WhatsApp", en: "Direct leads to WhatsApp" },
    ],
  },
  {
    id: "growth",
    name: "Agencia Growth",
    price: "$399",
    cadence: { es: "por mes", en: "per month" },
    highlight: true,
    badge: { es: "Más vendido", en: "Most popular" },
    perks: [
      { es: "Hasta 25 propiedades", en: "Up to 25 properties" },
      { es: "Tours 360° ilimitados", en: "Unlimited 360° tours" },
      { es: "Video Drone 4K (2 al mes)", en: "4K Drone video (2/month)" },
      { es: "Dashboard de equipo (5 usuarios)", en: "Team dashboard (5 seats)" },
      { es: "IA Lead Scoring & WhatsApp", en: "AI Lead Scoring & WhatsApp" },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: "$899",
    cadence: { es: "por mes", en: "per month" },
    highlight: false,
    perks: [
      { es: "Propiedades ilimitadas", en: "Unlimited properties" },
      { es: "Tours 360° y Drones ilimitados", en: "Unlimited 360° & Drones" },
      { es: "Automatizaciones IA y API CRM", en: "AI automations & CRM API" },
      { es: "Usuarios ilimitados y soporte VIP", en: "Unlimited seats & VIP support" },
    ],
  },
];

export const PUNTA_CHAPTERS: ReadonlyArray<FlagshipChapter> = [
  {
    id: "comparison",
    from: 0,
    durationInFrames: 465,
    label: { es: "Estándar Visual", en: "Visual Standard" },
    caption: { es: "Comparativa HDR y producción de revista", en: "HDR comparison and editorial production" },
  },
  {
    id: "tour",
    from: 465,
    durationInFrames: 720,
    label: { es: "Tour Inmersivo", en: "Immersive Tour" },
    caption: { es: "Navegación 3D espacial y perspectiva aérea", en: "Spatial 3D navigation and aerial perspective" },
  },
  {
    id: "workflow",
    from: 1185,
    durationInFrames: 555,
    label: { es: "Flujo & Planes", en: "Flow & Plans" },
    caption: { es: "Metodología en 4 fases y suscripciones de agentes", en: "4-phase methodology and agent tiers" },
  },
  {
    id: "signature",
    from: 1740,
    durationInFrames: 405,
    label: { es: "Impacto & Firma", en: "Impact & Signature" },
    caption: { es: "Métricas de efectividad y cierre de marca", en: "Effectiveness metrics and brand closing" },
  },
];

export const PUNTA_ASSETS: Record<string, FilmAsset> = {
  heroLoop: {
    src: "/portfolio/brands/punta-360/hero-loop.mp4",
    w: 1920,
    h: 1080,
    seconds: 4.0,
    webm: "/portfolio/brands/punta-360/hero-loop.webm",
  },
  heroShot: {
    src: "/portfolio/brands/punta-360/shots/hero.jpg",
    w: 1920,
    h: 1080,
  },
  ownersShot: {
    src: "/portfolio/brands/punta-360/shots/owners.jpg",
    w: 1920,
    h: 1080,
  },
  disciplinesShot: {
    src: "/portfolio/brands/punta-360/shots/disciplines.jpg",
    w: 1920,
    h: 1080,
  },
  workflowShot: {
    src: "/portfolio/brands/punta-360/shots/workflow.jpg",
    w: 1920,
    h: 1080,
  },
  enterpriseShot: {
    src: "/portfolio/brands/punta-360/shots/enterprise.jpg",
    w: 1920,
    h: 1080,
  },
  plansShot: {
    src: "/portfolio/brands/punta-360/shots/plans.jpg",
    w: 1920,
    h: 1080,
  },
};

export const PUNTA_COPY = {
  kicker: {
    es: "MARKETING VISUAL INMOBILIARIO · PUNTA DEL ESTE",
    en: "LUXURY REAL ESTATE VISUAL MARKETING · PUNTA DEL ESTE",
  },
  tagline: {
    es: "ELEVA EL VALOR DE TU INVERSIÓN",
    en: "ELEVATE THE VALUE OF YOUR ESTATE",
  },
  sub: {
    es: "Producción editorial, recorridos 3D interactivos y cinematografía aérea para bienes raíces premium.",
    en: "Editorial photography, interactive 3D spatial tours and aerial cinematography for luxury estates.",
  },
  comparison: {
    title: {
      es: "LA PRIMERA IMPRESIÓN ES LA ÚNICA QUE CUENTA",
      en: "FIRST IMPRESSIONS ARE THE ONLY ONES THAT COUNT",
    },
    sub: {
      es: "Foto de celular frente a producción editorial: el comparador del sitio muestra la diferencia en la misma propiedad.",
      en: "Phone photo versus editorial production: the site's comparator shows the difference on the same property.",
    },
    proLabel: { es: "HDR Editorial · Enterprise", en: "Editorial HDR · Enterprise" },
    amateurLabel: { es: "Foto Celular · Sin Calibrar", en: "Mobile Photo · Uncalibrated" },
  },
  tour: {
    kicker: { es: "RECORRIDO INMERSIVO 3D", en: "3D IMMERSIVE WALKTHROUGH" },
    title: { es: "EXPERIENCIA ESPACIAL SIN DISTANCIA", en: "SPATIAL EXPERIENCE WITHOUT DISTANCE" },
    sub: {
      es: "Permite a compradores internacionales caminar por cada rincón de la residencia con fidelidad técnica.",
      en: "Empowers international buyers to walk through every room with high-fidelity spatial depth.",
    },
    hint: { es: "Navegación espacial 360° activa", en: "Active 360° spatial navigation" },
  },
  workflow: {
    kicker: { es: "METODOLOGÍA OPERATIVA", en: "OPERATIONAL WORKFLOW" },
    title: { es: "SIMPLE & TRANSPARENTE", en: "SIMPLE & TRANSPARENT" },
    sub: {
      es: "Cuatro pasos, de la agenda de la visita a la publicación del material.",
      en: "Four steps, from booking the visit to publishing the material.",
    },
  },
  plans: {
    kicker: { es: "MODELO DE SUSCRIPCIÓN", en: "AGENT SUBSCRIPTIONS" },
    title: { es: "PLANES PARA AGENTES Y AGENCIAS", en: "SCALABLE TIERS FOR AGENTS & AGENCIES" },
    sub: {
      es: "Producción continua, tours 360 ilimitados y drones 4K con cadencia mensual predecible.",
      en: "Continuous production, unlimited 360 tours and 4K drones on predictable monthly terms.",
    },
  },
  metrics: {
    kicker: { es: "LO QUE HAY EN PRODUCCIÓN", en: "WHAT RUNS IN PRODUCTION" },
    title: { es: "UNA PLATAFORMA DE PRODUCCIÓN VISUAL", en: "ONE VISUAL PRODUCTION PLATFORM" },
    disciplines: { es: "Disciplinas de producción: foto, tour 3D, aéreo y redes", en: "Production disciplines: photo, 3D tour, aerial and social" },
    steps: { es: "Pasos del proceso, de la agenda a la publicación", en: "Process steps, from booking to publishing" },
    plans: { es: "Planes de suscripción para agentes y agencias", en: "Subscription plans for agents and agencies" },
  },
  cta: {
    headline: { es: "PUNTA360", en: "PUNTA360" },
    sub: {
      es: "Marketing visual y producción inmersiva para el sector inmobiliario más exigente.",
      en: "Visual marketing and immersive production for the most demanding real estate sector.",
    },
    button: { es: "Explorar Plataforma", en: "Explore Platform" },
  },
};

export function puntaFact(key: keyof typeof PUNTA_FACTS, lang: FilmLanguage): string {
  const fact = PUNTA_FACTS[key];
  return formatFact(fact, lang);
}
