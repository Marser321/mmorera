export type ProjectScopeId = "web" | "automation" | "integral";

export interface ProjectScopeTier {
  id: ProjectScopeId;
  name: { es: string; en: string };
  sprintDurationWeeks: number;
  badge: { es: string; en: string };
  description: { es: string; en: string };
  deliverablesSummary: { es: string; en: string }[];
  accentColor: string;
}

export const SCOPE_TIERS: ProjectScopeTier[] = [
  {
    id: "web",
    name: { es: "Plataforma Web en Next.js 15", en: "Next.js 15 Web Platform" },
    sprintDurationWeeks: 2,
    badge: { es: "Sprint de 1 a 2 semanas", en: "1 to 2 week sprint" },
    description: {
      es: "Diseño visual a medida, código propio, 95+ PageSpeed y arquitectura pensada para convertir visitas en prospectos.",
      en: "Custom visual design, proprietary codebase, 95+ PageSpeed, and architecture built to convert visits into leads.",
    },
    deliverablesSummary: [
      { es: "Frontend en Next.js 15 con Turbopack", en: "Next.js 15 frontend with Turbopack" },
      { es: "SEO técnico y OpenGraph dinámico", en: "Technical SEO & dynamic OpenGraph" },
      { es: "Integración de tracking y formularios", en: "Tracking and lead forms integration" },
    ],
    accentColor: "#55D8FF",
  },
  {
    id: "automation",
    name: { es: "Automatizaciones CRM & WhatsApp IA", en: "CRM & AI WhatsApp Automations" },
    sprintDurationWeeks: 2,
    badge: { es: "Sprint de 2 semanas", en: "2 week sprint" },
    description: {
      es: "Agentes conversacionales en WhatsApp 24/7, pipelines en GoHighLevel/Pipedrive y sincronización de eventos sin fricción.",
      en: "24/7 conversational WhatsApp agents, GoHighLevel/Pipedrive pipelines, and seamless event synchronization.",
    },
    deliverablesSummary: [
      { es: "Agente IA calificador en WhatsApp", en: "AI qualification agent on WhatsApp" },
      { es: "Pipeline y webhooks en GoHighLevel", en: "Pipeline & webhooks in GoHighLevel" },
      { es: "Secuencias automáticas anti no-show", en: "Automated anti-no-show reminders" },
    ],
    accentColor: "#71F3A2",
  },
  {
    id: "integral",
    name: { es: "Ecosistema Integral (Web + CRM + Agentes)", en: "Integral Ecosystem (Web + CRM + Agents)" },
    sprintDurationWeeks: 3,
    badge: { es: "Sprint de 3 semanas", en: "3 week sprint" },
    description: {
      es: "El sistema completo operado por una sola persona: desde la experiencia web hasta el cobro automatizado y CRM.",
      en: "The full system engineered by one person: from the high-impact web presence to automated billing and CRM.",
    },
    deliverablesSummary: [
      { es: "Web Next.js de alta conversión", en: "High-converting Next.js website" },
      { es: "Circuito completo de IA & WhatsApp", en: "Full AI & WhatsApp circuit" },
      { es: "CRM + Cobros Stripe integrados", en: "Integrated CRM + Stripe checkout" },
    ],
    accentColor: "#B68CFF",
  },
];

export interface SprintRoiCalculationInput {
  scopeId: ProjectScopeId;
  teamSize: number; // 1 to 25
  avgTicket: number; // in USD, e.g. 500
  monthlyLeads: number; // e.g. 200
}

export interface SprintRoiCalculationResult {
  sprintWeeks: number;
  hoursSavedPerMonth: number;
  recoveredDealsPerMonth: number;
  recoveredRevenuePerMonth: number;
  paybackDaysEstimated: number;
}

export function calculateSprintRoi(input: SprintRoiCalculationInput): SprintRoiCalculationResult {
  const scope = SCOPE_TIERS.find((s) => s.id === input.scopeId) ?? SCOPE_TIERS[0];
  const { teamSize, avgTicket, monthlyLeads } = input;

  // Reps spend ~12-15 hours/month on repetitive data entry and manual follow-up per rep
  const hoursSavedPerRep = scope.id === "web" ? 3 : scope.id === "automation" ? 14 : 18;
  const hoursSavedPerMonth = Math.round(teamSize * hoursSavedPerRep);

  // Conversion boost from fast response & automated follow-up
  const conversionBoostRate = scope.id === "web" ? 0.04 : scope.id === "automation" ? 0.08 : 0.12;
  const recoveredDealsPerMonth = Math.max(1, Math.round(monthlyLeads * conversionBoostRate));

  // Additional revenue recovered
  const recoveredRevenuePerMonth = Math.round(recoveredDealsPerMonth * avgTicket);

  // Estimated payback in days
  const estimatedInvestment = scope.id === "web" ? 2200 : scope.id === "automation" ? 2800 : 3800;
  const dailyGain = Math.max(10, recoveredRevenuePerMonth / 30);
  const paybackDaysEstimated = Math.max(14, Math.round(estimatedInvestment / dailyGain));

  return {
    sprintWeeks: scope.sprintDurationWeeks,
    hoursSavedPerMonth,
    recoveredDealsPerMonth,
    recoveredRevenuePerMonth,
    paybackDaysEstimated,
  };
}
