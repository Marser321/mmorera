export interface EcosystemModule {
  id: "web" | "whatsapp_ai" | "voice_ai" | "crm" | "payments";
  name: {
    es: string;
    en: string;
  };
  subtitle: {
    es: string;
    en: string;
  };
  accentColor: string;
  tag: string;
  baseDays: number;
  monthlyHoursSaved: number;
  conversionLiftPct: number;
  keyFeature: {
    es: string;
    en: string;
  };
}

export const ECOSYSTEM_MODULES: EcosystemModule[] = [
  {
    id: "web",
    name: {
      es: "Plataforma Web Next.js 16",
      en: "Next.js 16 Web Platform",
    },
    subtitle: {
      es: "Turbopack, Server Components & 95+ PageSpeed",
      en: "Turbopack, Server Components & 95+ PageSpeed",
    },
    accentColor: "#55D8FF",
    tag: "WEB",
    baseDays: 7,
    monthlyHoursSaved: 15,
    conversionLiftPct: 28,
    keyFeature: {
      es: "Carga en sub-800ms en redes móviles para eliminar la fuga de tráfico de pauta.",
      en: "Sub-800ms load time on mobile networks eliminating ad traffic bounce.",
    },
  },
  {
    id: "whatsapp_ai",
    name: {
      es: "Agente IA WhatsApp 24/7",
      en: "24/7 WhatsApp AI Agent",
    },
    subtitle: {
      es: "Triaje, respuesta en <30s y catálogo dinámico",
      en: "Triage, <30s reply & dynamic catalogue",
    },
    accentColor: "#71F3A2",
    tag: "AI CHAT",
    baseDays: 5,
    monthlyHoursSaved: 35,
    conversionLiftPct: 35,
    keyFeature: {
      es: "Califica presupuesto y urgencia a las 3 AM sin requerir intervención humana.",
      en: "Screens budget and urgency at 3 AM with zero human intervention required.",
    },
  },
  {
    id: "voice_ai",
    name: {
      es: "Agente Telefónico de Voz IA",
      en: "Realtime Voice AI Telephony",
    },
    subtitle: {
      es: "Atención telefónica con latencia humana sub-300ms",
      en: "Phone call handling with sub-300ms human latency",
    },
    accentColor: "#B68CFF",
    tag: "VOICE",
    baseDays: 6,
    monthlyHoursSaved: 25,
    conversionLiftPct: 20,
    keyFeature: {
      es: "Atiende llamadas entrantes, verifica seguros o autos y agenda turnos en vivo.",
      en: "Answers inbound calls, verifies insurance/car models, and books slots live.",
    },
  },
  {
    id: "crm",
    name: {
      es: "CRM Centralizado & Trazabilidad",
      en: "Centralized CRM & Traceability",
    },
    subtitle: {
      es: "GoHighLevel / Supabase con pipeline unificado",
      en: "GoHighLevel / Supabase unified sales pipeline",
    },
    accentColor: "#FFB86C",
    tag: "CRM",
    baseDays: 4,
    monthlyHoursSaved: 20,
    conversionLiftPct: 18,
    keyFeature: {
      es: "Trazabilidad completa desde el primer clic hasta el cierre con alertas automáticas.",
      en: "Full attribution from first click to contract closing with instant alerts.",
    },
  },
  {
    id: "payments",
    name: {
      es: "Pasarela de Cobros & Señas",
      en: "Automated Checkout & Deposits",
    },
    subtitle: {
      es: "Stripe Webhooks & facturación instantánea",
      en: "Stripe Webhooks & instant invoice dispatch",
    },
    accentColor: "#FF5C8A",
    tag: "PAYMENTS",
    baseDays: 3,
    monthlyHoursSaved: 12,
    conversionLiftPct: 15,
    keyFeature: {
      es: "Cobro de señas para reducir el 90% del ausentismo y confirmación automática.",
      en: "Deposit capture cutting 90% of no-shows with automated digital receipts.",
    },
  },
];

export interface EcosystemCalculationReport {
  selectedCount: number;
  estimatedSprintDays: number;
  totalMonthlyHoursSaved: number;
  projectedConversionLiftPct: number;
  frictionReductionPct: number;
  recommendedSprintTier: {
    es: string;
    en: string;
  };
}

export function calculateEcosystemMetrics(
  selectedIds: string[]
): EcosystemCalculationReport {
  const activeModules = ECOSYSTEM_MODULES.filter((m) => selectedIds.includes(m.id));

  if (activeModules.length === 0) {
    return {
      selectedCount: 0,
      estimatedSprintDays: 0,
      totalMonthlyHoursSaved: 0,
      projectedConversionLiftPct: 0,
      frictionReductionPct: 0,
      recommendedSprintTier: {
        es: "Seleccioná al menos un módulo",
        en: "Select at least one module",
      },
    };
  }

  // Combined sprint days: parallelized development
  // 1 module: 5-7 days. 2 modules: 10-12 days. 3+ modules: 14-21 days max.
  const rawDays = activeModules.reduce((acc, m) => acc + m.baseDays, 0);
  const estimatedSprintDays = Math.min(21, Math.max(7, Math.round(rawDays * 0.75)));

  const totalMonthlyHoursSaved = activeModules.reduce(
    (acc, m) => acc + m.monthlyHoursSaved,
    0
  );

  const rawLift = activeModules.reduce((acc, m) => acc + m.conversionLiftPct, 0);
  // Diminishing returns formula
  const projectedConversionLiftPct = Math.min(65, Math.round(rawLift * 0.65));

  const frictionReductionPct = Math.min(92, activeModules.length * 19);

  let recommendedSprintTier = {
    es: "Sprint Web de 1 Semana",
    en: "1-Week Web Sprint",
  };

  if (estimatedSprintDays > 14) {
    recommendedSprintTier = {
      es: "Ecosistema Integral (3 Semanas)",
      en: "Integral Ecosystem (3 Weeks)",
    };
  } else if (estimatedSprintDays > 7) {
    recommendedSprintTier = {
      es: "Sprint de Automatización & CRM (2 Semanas)",
      en: "Automation & CRM Sprint (2 Weeks)",
    };
  }

  return {
    selectedCount: activeModules.length,
    estimatedSprintDays,
    totalMonthlyHoursSaved,
    projectedConversionLiftPct,
    frictionReductionPct,
    recommendedSprintTier,
  };
}
