import type { FilmLanguage } from "../filmTypes";
import { formatFact, timelineFrom, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene } from "./types";

/**
 * Film insignia de Hub Profesional:
 * "El estándar digital para profesionales independientes: 6 plantillas de autoridad y suite Mecánica Premium".
 *
 * Fuente: el sitio publicado (profecionalcv.vercel.app) el 2026-10-07:
 * HTML, CSS y componentes servidos, recorrido en solo lectura.
 * Ver docs/films/dossiers/hub-profesional-ai.md.
 */

export const HUB_PROFESIONAL_SCENES = [
  { id: "opening", kind: "particle-open", seconds: 7.0 },
  { id: "manifesto", kind: "standard-manifesto", seconds: 8.5 },
  { id: "switcher", kind: "profession-switcher", seconds: 24.0 },
  { id: "services", kind: "tactical-catalog", seconds: 9.5 },
  { id: "protocol", kind: "protocol-stepper", seconds: 9.0 },
  { id: "metrics", kind: "authority-facts", seconds: 7.0 },
  { id: "signature", kind: "signature", seconds: 6.5 },
] as const satisfies ReadonlyArray<FlagshipScene>;

const hubTimeline = timelineFrom(HUB_PROFESIONAL_SCENES);
export const HUB_PROFESIONAL_TIMELINE = hubTimeline.slots;
export const HUB_PROFESIONAL_DURATION = hubTimeline.durationInFrames;

/**
 * Cifras de lo construido. Las de la plantilla de mecánica (vehículos
 * atendidos, puntaje en Google, años de experiencia) son contenido de muestra
 * de la plantilla, no datos reales: no van como cifras del caso.
 */
export const HUB_PROFESIONAL_FACTS = {
  professionsCount: { value: 6, source: "Dossier · /showcase: 6 plantillas de autoridad diseñadas para rubros independientes" },
  protocolSteps: { value: 4, source: "Dossier · /: 4 pasos del protocolo de servicio: Ingreso, Diagnóstico, Presupuesto, Control Final" },
  inspectionPoints: { value: 40, source: "Dossier · /: 40 puntos críticos de seguridad inspeccionados mediante check-list digital" },
} as const satisfies Record<string, FilmFact>;

export const HUB_PROFESIONAL_PROFESSIONS = [
  {
    id: "mecanico",
    title: { es: "Mecánica Premium", en: "Premium Mechanics" },
    tag: { es: "Ingeniería de Precisión", en: "Precision Engineering" },
    color: "#FF3B30",
    headline: {
      es: "Cuidado artesanal para vehículos de alta gama",
      en: "Artisanal care for high-performance vehicles",
    },
    sub: {
      es: "Especialistas en mecánica preventiva y correctiva con tecnología Bosch y check-list digital.",
      en: "Preventive and corrective engineering powered by Bosch tech and digital inspection.",
    },
    stats: { es: "+1200 vehículos · 4.9/5 Google", en: "+1200 vehicles · 4.9/5 Google" },
    badge: { es: "Tecnología Bosch", en: "Bosch Technology" },
  },
  {
    id: "abogado",
    title: { es: "Estudio Jurídico", en: "Legal Practice" },
    tag: { es: "Estrategia Legal", en: "Legal Strategy" },
    color: "#007AFF",
    headline: {
      es: "Soluciones jurídicas estratégicas para proteger tu futuro",
      en: "Strategic legal solutions to protect your future",
    },
    sub: {
      es: "Rigor académico y visión moderna en Derecho Civil, Comercial y Corporativo con respuesta ágil.",
      en: "Academic rigor and agile corporate counsel across Civil, Business and Family Law.",
    },
    stats: { es: "Atención 24/7 · Blindaje Jurídico", en: "24/7 Support · Legal Shield" },
    badge: { es: "Estrategia Ganadora", en: "Winning Strategy" },
  },
  {
    id: "psicologo",
    title: { es: "Psicología Clínica", en: "Clinical Psychology" },
    tag: { es: "Espacio de Seguridad", en: "Safe Haven" },
    color: "#32D74B",
    headline: {
      es: "Un espacio de seguridad para transformar tu realidad",
      en: "A safe space to transform your reality",
    },
    sub: {
      es: "Psicoterapia clínica para adultos combinando empatía humana profunda con evidencia científica.",
      en: "Advanced clinical psychotherapy for adults bridging deep human empathy and scientific proof.",
    },
    stats: { es: "Telepsicología · Evidencia Científica", en: "Telepsychology · Scientific Evidence" },
    badge: { es: "Sesión Virtual Segura", en: "Secure Virtual Care" },
  },
  {
    id: "odontologo",
    title: { es: "Odontología 3D", en: "3D Dentistry" },
    tag: { es: "Precisión Quirúrgica", en: "Surgical Precision" },
    color: "#00C6FF",
    headline: {
      es: "El Futuro de la Odontología Digital",
      en: "The Future of Digital Dentistry"
    },
    sub: {
      es: "Rehabilitación oral computarizada, implantes de carga inmediata y diseño digital 3D sin dolor.",
      en: "Computerized oral rehabilitation, immediate load implants and pain-free 3D smile design.",
    },
    stats: { es: "Odontología Sin Dolor · Escaneo 3D", en: "Pain-Free Care · 3D Scanning" },
    badge: { es: "Diseño Digital 3D", en: "3D Digital Design" },
  },
  {
    id: "arquitecto",
    title: { es: "Arquitectura de Autor", en: "Signature Architecture" },
    tag: { es: "Diseño Espacial", en: "Spatial Design" },
    color: "#EAB308",
    headline: {
      es: "Espacios que materializan visiones extraordinarias",
      en: "Spaces materializing extraordinary visions",
    },
    sub: {
      es: "Inmersión 3D fotorrealista, anteproyectos ejecutivos y certificación de eficiencia energética AA+.",
      en: "Photorealistic 3D immersion, executive blueprints and AA+ certified energy efficiency.",
    },
    stats: { es: "Inmersión 3D Real · Eficiencia AA+", en: "Real 3D Immersion · AA+ Efficiency" },
    badge: { es: "Eficiencia AA+", en: "AA+ Efficiency" },
  },
  {
    id: "estetica",
    title: { es: "Centro de Estética", en: "Aesthetic Clinic" },
    tag: { es: "Armonía Natural", en: "Natural Harmony" },
    color: "#FF2D55",
    headline: {
      es: "La ciencia al servicio de tu armonía natural",
      en: "Science in service of your natural harmony",
    },
    sub: {
      es: "Protocolos personalizados basados en biotecnología FDA Gold para resultados visibles y seguros.",
      en: "Tailored protocols backed by FDA Gold biotechnology for visible, lasting and safe wellness.",
    },
    stats: { es: "Tecnología FDA Gold · Bio-Plan Personal", en: "FDA Gold Tech · Personal Bio-Plan" },
    badge: { es: "Tecnología FDA Gold", en: "FDA Gold Tech" },
  },
];

export const HUB_PROFESIONAL_SERVICES = [
  {
    code: "SRV_01",
    title: { es: "Mantenimiento Programado", en: "Scheduled Maintenance" },
    spec: {
      es: "Aceite sintético de alta viscosidad y revisión de 40 puntos de seguridad.",
      en: "High-viscosity synthetic lubrication and 40-point critical safety audit.",
    },
  },
  {
    code: "SRV_02",
    title: { es: "Seguridad y Frenado", en: "Safety & Braking" },
    spec: {
      es: "Diagnóstico ABS/ESP con rectificación micrométrica y fluido DOT 5.1.",
      en: "ABS/ESP digital diagnostics, micrometric rotor surfacing and DOT 5.1 fluid.",
    },
  },
  {
    code: "SRV_03",
    title: { es: "Inyección Electrónica", en: "Electronic Injection" },
    spec: {
      es: "Optimización ECU, limpieza ultrasónica y calibración de sensores MAF/O2.",
      en: "ECU remapping, ultrasonic injector bathing and MAF/O2 sensor tuning.",
    },
  },
  {
    code: "SRV_04",
    title: { es: "Sistemas de Confort", en: "Cabin Comfort Systems" },
    spec: {
      es: "Climatización bi-zona con carga R134a/R1234yf y prueba de fuga UV.",
      en: "Dual-zone climate recharge with R134a/R1234yf and UV leak detection.",
    },
  },
];

export const HUB_PROFESIONAL_PROTOCOL = [
  {
    step: "01",
    name: { es: "Ingreso & Check-list", en: "Intake & Check-list" },
    desc: {
      es: "Recepción digital y relevamiento de parámetros técnicos iniciales.",
      en: "Digital vehicle check-in and initial baseline technical scan.",
    },
  },
  {
    step: "02",
    name: { es: "Diagnóstico Bosch", en: "Bosch Diagnostics" },
    desc: {
      es: "Escaneo computarizado total con reporte detallado enviado al móvil.",
      en: "Full computerized scan with detailed digital reports sent to mobile.",
    },
  },
  {
    step: "03",
    name: { es: "Presupuesto Claro", en: "Transparent Approval" },
    desc: {
      es: "Validación digital de repuestos legítimos y tiempos comprometidos.",
      en: "Digital approval of genuine components and delivery timetables.",
    },
  },
  {
    step: "04",
    name: { es: "Control Final & Entrega", en: "Final Road Test & Handover" },
    desc: {
      es: "Prueba de calle, calibración micrométrica y garantía escrita.",
      en: "Dynamic road test, micrometric fluid check and written warranty.",
    },
  },
];

export const HUB_PROFESIONAL_CHAPTERS: ReadonlyArray<FlagshipChapter> = [
  {
    id: "standard",
    from: 0,
    durationInFrames: 465,
    label: { es: "El Estándar Profesional", en: "The Professional Standard" },
    caption: { es: "Showcase Live: herramientas de autoridad en Next.js 15", en: "Showcase Live: authority tools built on Next.js 15" },
  },
  {
    id: "switcher",
    from: 465,
    durationInFrames: 720,
    label: { es: "Selector Multirrubro", en: "Multi-Industry Switcher" },
    caption: { es: "6 especialidades con adaptación visual y narrativa en vivo", en: "6 specialties with instant visual and narrative adaptation" },
  },
  {
    id: "services",
    from: 1185,
    durationInFrames: 555,
    label: { es: "Servicios & Protocolo", en: "Services & Protocol" },
    caption: { es: "Mecánica de precisión en 4 módulos y protocolo de 4 fases", en: "Precision mechanics across 4 modules and 4-phase protocol" },
  },
  {
    id: "signature",
    from: 1740,
    durationInFrames: 405,
    label: { es: "Lo construido y firma", en: "What was built & signature" },
    caption: { es: "Plantillas, protocolo y check-list que hay en producción", en: "Templates, protocol and checklist in production" },
  },
];

export const HUB_PROFESIONAL_ASSETS: Record<string, FilmAsset> = {
  heroLoop: {
    src: "/portfolio/brands/hub-profesional-ai/hero-loop.mp4",
    w: 1920,
    h: 1080,
    seconds: 4.0,
    webm: "/portfolio/brands/hub-profesional-ai/hero-loop.webm",
  },
  heroShot: {
    src: "/portfolio/brands/hub-profesional-ai/shots/hero.jpg",
    w: 1920,
    h: 1080,
  },
  showcaseShot: {
    src: "/portfolio/brands/hub-profesional-ai/shots/showcase.jpg",
    w: 1920,
    h: 1080,
  },
  templatesShot: {
    src: "/portfolio/brands/hub-profesional-ai/shots/templates.jpg",
    w: 1920,
    h: 1080,
  },
  servicesShot: {
    src: "/portfolio/brands/hub-profesional-ai/shots/services.jpg",
    w: 1920,
    h: 1080,
  },
  galleryShot: {
    src: "/portfolio/brands/hub-profesional-ai/shots/gallery.jpg",
    w: 1920,
    h: 1080,
  },
  protocolShot: {
    src: "/portfolio/brands/hub-profesional-ai/shots/protocol.jpg",
    w: 1920,
    h: 1080,
  },
};

export const HUB_PROFESIONAL_COPY = {
  kicker: {
    es: "HUB PROFESIONAL · TEMPLATES & AUTHORITY ENGINES",
    en: "HUB PROFESIONAL · TEMPLATES & AUTHORITY ENGINES",
  },
  tagline: {
    es: "EL ESTÁNDAR PROFESIONAL EN LA ERA DIGITAL",
    en: "THE PROFESSIONAL STANDARD FOR MODERN EXPERTS",
  },
  sub: {
    es: "Plantillas de autoridad para profesionales independientes, una por rubro.",
    en: "Authority templates for independent professionals, one per field.",
  },
  manifesto: {
    kicker: { es: "SHOWCASE LIVE · EL ESTÁNDAR", en: "SHOWCASE LIVE · THE STANDARD" },
    title: { es: "NO CREAMOS SITIOS WEB. CONSTRUIMOS AUTORIDAD", en: "WE DON'T BUILD WEBSITES. WE BUILD AUTHORITY" },
    sub: {
      es: "Diseño Dark Mode premium y arquitectura mobile-first sobre Next.js 15.",
      en: "Premium Dark Mode design and mobile-first architecture on Next.js 15.",
    },
  },
  switcher: {
    kicker: { es: "SELECTOR MULTIRRUBRO EN TIEMPO REAL", en: "REAL-TIME MULTI-INDUSTRY SWITCHER" },
    title: { es: "SEIS ESPECIALIDADES, UNA MISMA BASE", en: "SIX SPECIALTIES, ONE SHARED BASE" },
    sub: {
      es: "Cada plantilla cambia paleta, titulares y módulos según el rubro.",
      en: "Each template changes palette, headlines and modules to fit the field.",
    },
    hint: { es: "Intercambio en vivo · Mecánico, Abogado, Psicólogo, Odontólogo, Arquitecto, Estética", en: "Live switcher · Mechanics, Legal, Psychology, Dental, Architecture, Aesthetics" },
  },
  services: {
    kicker: { es: "MECÁNICA PREMIUM · SERVICIOS ELITE", en: "PREMIUM MECHANICS · ELITE SERVICES" },
    title: { es: "DESPLIEGUE TÁCTICO DE INGENIERÍA", en: "TACTICAL ENGINEERING DEPLOYMENT" },
    sub: {
      es: "Soluciones de alta precisión con tecnología Bosch y seguimiento digital transparente.",
      en: "High-precision automotive solutions backed by Bosch tech and digital transparency.",
    },
  },
  protocol: {
    kicker: { es: "METODOLOGÍA DE 4 FASES", en: "4-PHASE RIGOROUS METHODOLOGY" },
    title: { es: "EL PROTOCOLO DE PRECISIÓN Y CONTROL", en: "THE PRECISION & CONTROL PROTOCOL" },
    sub: {
      es: "Check-list digital de 40 puntos críticos, diagnóstico transparente y control final.",
      en: "Digital check-list across 40 critical points, transparent reports and final road test.",
    },
  },
  metrics: {
    kicker: { es: "LO QUE HAY EN PRODUCCIÓN", en: "WHAT RUNS IN PRODUCTION" },
    title: { es: "UNA PLATAFORMA DE PLANTILLAS POR RUBRO", en: "ONE TEMPLATE PLATFORM, BY FIELD" },
    professions: { es: "Plantillas por rubro en el showcase", en: "Field templates in the showcase" },
    steps: { es: "Fases del protocolo en la plantilla de mecánica", en: "Protocol phases in the mechanics template" },
    points: { es: "Puntos del check-list digital de la plantilla", en: "Points in the template's digital checklist" },
  },
  cta: {
    headline: { es: "HUB PROFESIONAL", en: "HUB PROFESIONAL" },
    sub: {
      es: "Plantillas de autoridad para profesionales independientes.",
      en: "Authority templates for independent professionals.",
    },
    button: { es: "Explorar Showcase Live", en: "Explore Live Showcase" },
  },
};

export function hubProfesionalFact(key: keyof typeof HUB_PROFESIONAL_FACTS, lang: FilmLanguage): string {
  const fact = HUB_PROFESIONAL_FACTS[key];
  return formatFact(fact, lang);
}
