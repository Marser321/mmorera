export interface IndustryFilter {
  id: string;
  name: { es: string; en: string };
  badge: { es: string; en: string };
}

export interface SolutionFilter {
  id: string;
  name: { es: string; en: string };
}

export const INDUSTRY_FILTERS: IndustryFilter[] = [
  {
    id: "all",
    name: { es: "Todas las Industrias", en: "All Industries" },
    badge: { es: "16 Proyectos", en: "16 Projects" },
  },
  {
    id: "automotive",
    name: { es: "Automotriz & Detailing", en: "Automotive & Detailing" },
    badge: { es: "Florida / B2C", en: "Florida / B2C" },
  },
  {
    id: "local_services",
    name: { es: "Barberías & Servicios", en: "Barbershops & Services" },
    badge: { es: "Citas & Pagos", en: "Booking & Payments" },
  },
  {
    id: "agencies_b2b",
    name: { es: "Agencias & Pauta B2B", en: "Agencies & Paid Media" },
    badge: { es: "CRM & Funnel", en: "CRM & Funnel" },
  },
  {
    id: "fintech_luxury",
    name: { es: "Finanzas & Alta Gama", en: "Finance & High-End" },
    badge: { es: "Brand & Motion", en: "Brand & Motion" },
  },
];

export const SOLUTION_FILTERS: SolutionFilter[] = [
  { id: "all", name: { es: "Todas las Soluciones", en: "All Solutions" } },
  { id: "web_speed", name: { es: "Web Next.js 16 (95+ PageSpeed)", en: "Next.js 16 Web (95+ PageSpeed)" } },
  { id: "ai_crm", name: { es: "CRM & Agentes IA", en: "CRM & AI Agents" } },
  { id: "booking_payments", name: { es: "Reservas & Cobros Stripe", en: "Bookings & Stripe Payments" } },
];

export interface MatchedProject {
  slug: string;
  title: { es: string; en: string };
  summary: { es: string; en: string };
  industry: string;
  solutionType: "web_speed" | "ai_crm" | "booking_payments";
  metricBadge: { es: string; en: string };
  sprintWeeks: number;
  pageSpeedScore: number;
  stack: string[];
  liveUrl: string;
  imageSrc: string;
  accent: string;
}

export const MATCHED_PROJECTS: MatchedProject[] = [
  {
    slug: "lb-elite-wash-detail",
    title: { es: "L&B Elite Wash & Detail", en: "L&B Elite Wash & Detail" },
    summary: {
      es: "Detailing móvil premium en Florida. Cotizador algorítmico y despacho directo por WhatsApp.",
      en: "Premium mobile detailing in Florida. Algorithmic estimator and direct WhatsApp routing.",
    },
    industry: "automotive",
    solutionType: "web_speed",
    metricBadge: { es: "98 PageSpeed · 0 llamadas necesarias", en: "98 PageSpeed · Zero phone calls required" },
    sprintWeeks: 1,
    pageSpeedScore: 98,
    stack: ["Next.js 16", "Tailwind CSS", "WhatsApp API", "UX/UI"],
    liveUrl: "https://l-b-five.vercel.app/",
    imageSrc: "/portfolio/lb-elite-cover.jpg",
    accent: "#B68CFF",
  },
  {
    slug: "new-brothers-barberia",
    title: { es: "New Brothers Barbería", en: "New Brothers Barbershop" },
    summary: {
      es: "Barbería de alta gama con bloqueo de citas en tiempo real y cobro de seña con Stripe.",
      en: "High-end barbershop with real-time slot locking and deposit collection via Stripe.",
    },
    industry: "local_services",
    solutionType: "booking_payments",
    metricBadge: { es: "-90% No-Shows · Seña automatizada", en: "-90% No-Shows · Automated deposit lock" },
    sprintWeeks: 2,
    pageSpeedScore: 97,
    stack: ["Next.js 16", "Stripe API", "PostgreSQL", "Automation"],
    liveUrl: "https://nb-barber.vercel.app/",
    imageSrc: "/portfolio/nb-barber-cover.jpg",
    accent: "#55D8FF",
  },
  {
    slug: "ad-media-solution",
    title: { es: "AD Media Solution", en: "AD Media Solution" },
    summary: {
      es: "Embudos de pauta Meta Ads sincronizados con GoHighLevel y speed-to-lead en <30 segundos.",
      en: "Meta Ads funnels synchronized with GoHighLevel CRM and <30 second speed-to-lead.",
    },
    industry: "agencies_b2b",
    solutionType: "ai_crm",
    metricBadge: { es: "<30s Speed-to-Lead · 100% trazable", en: "<30s Speed-to-Lead · 100% traceable" },
    sprintWeeks: 2,
    pageSpeedScore: 99,
    stack: ["Next.js 16", "GoHighLevel", "Webhooks", "Conversion Design"],
    liveUrl: "https://admediasolution.vercel.app/",
    imageSrc: "/portfolio/admedia-cover.png",
    accent: "#71F3A2",
  },
  {
    slug: "car-servicios-automotrices",
    title: { es: "CAR Servicios Automotrices", en: "CAR Automotive Services" },
    summary: {
      es: "Plataforma de mantenimiento vehicular con cotizador por marca y modelo de coche.",
      en: "Vehicle maintenance booking platform with automated quote generator by make and model.",
    },
    industry: "automotive",
    solutionType: "booking_payments",
    metricBadge: { es: "3.4x más solicitudes web", en: "3.4x web request lift" },
    sprintWeeks: 2,
    pageSpeedScore: 96,
    stack: ["Next.js 16", "Supabase", "WhatsApp API"],
    liveUrl: "https://l-b-five.vercel.app/",
    imageSrc: "/portfolio/lb-elite-cover.jpg",
    accent: "#FFB86C",
  },
  {
    slug: "clinica-triaje-dental",
    title: { es: "Clínica & Triaje Sanitario", en: "Clinic & Healthcare Triage" },
    summary: {
      es: "Atención médica 24/7 con agente de triaje IA que valida cobertura de seguro y agenda consultas.",
      en: "24/7 medical triage AI agent verifying insurance coverage and booking specialist slots.",
    },
    industry: "local_services",
    solutionType: "ai_crm",
    metricBadge: { es: "195ms Respuesta IA · Cero esperas", en: "195ms AI Reply · Zero wait times" },
    sprintWeeks: 3,
    pageSpeedScore: 98,
    stack: ["OpenAI LLM", "WhatsApp API", "Supabase CRM"],
    liveUrl: "https://nb-barber.vercel.app/",
    imageSrc: "/portfolio/nb-barber-cover.jpg",
    accent: "#71F3A2",
  },
  {
    slug: "studio-creative-motion",
    title: { es: "Studio Creative & Brand Asset", en: "Studio Creative & Brand Asset" },
    summary: {
      es: "Dirección visual y experiencia web interactiva en 60 FPS con física cinética para marca de lujo.",
      en: "Visual direction and interactive 60 FPS web experience with kinetic physics for luxury brand.",
    },
    industry: "fintech_luxury",
    solutionType: "web_speed",
    metricBadge: { es: "60 FPS Fluidos · +52% Retención", en: "60 FPS Fluid · +52% Dwell Time" },
    sprintWeeks: 1,
    pageSpeedScore: 99,
    stack: ["Next.js 16", "Framer Motion", "WebGL Shader"],
    liveUrl: "https://admediasolution.vercel.app/",
    imageSrc: "/portfolio/admedia-cover.png",
    accent: "#B68CFF",
  },
];

export function filterProjects(
  industry: string,
  solution: string
): {
  projects: MatchedProject[];
  averagePageSpeed: number;
  averageSprintWeeks: number;
} {
  const filtered = MATCHED_PROJECTS.filter((p) => {
    const matchesIndustry = industry === "all" || p.industry === industry;
    const matchesSolution = solution === "all" || p.solutionType === solution;
    return matchesIndustry && matchesSolution;
  });

  const projectsToUse = filtered.length > 0 ? filtered : MATCHED_PROJECTS;

  const totalSpeed = projectsToUse.reduce((acc, p) => acc + p.pageSpeedScore, 0);
  const totalWeeks = projectsToUse.reduce((acc, p) => acc + p.sprintWeeks, 0);

  return {
    projects: filtered,
    averagePageSpeed: Math.round(totalSpeed / projectsToUse.length),
    averageSprintWeeks: Math.round((totalWeeks / projectsToUse.length) * 10) / 10,
  };
}
