export interface FrictionSymptom {
  id: string;
  badge: { es: string; en: string };
  title: { es: string; en: string };
  description: { es: string; en: string };
  frictionPoints: number; // 10 to 25
  monthlyHoursImpact: number; // hours/mo wasted
  monthlyDollarsImpact: number; // estimated monthly revenue loss in USD
  solutionComponent: { es: string; en: string };
}

export const FRICTION_SYMPTOMS: FrictionSymptom[] = [
  {
    id: "slow_response",
    badge: { es: "Speed-to-Lead Lento", en: "Slow Speed-to-Lead" },
    title: {
      es: "Los prospectos esperan más de 30 minutos una respuesta en WhatsApp o web.",
      en: "Leads wait more than 30 minutes for a response on WhatsApp or website.",
    },
    description: {
      es: "El 78% de los compradores B2B cierran con el primer proveedor que responde en <5 minutos. Esperar horas multiplica la tasa de abandono.",
      en: "78% of B2B buyers close with the vendor replying in <5 minutes. Waiting hours increases abandonment drastically.",
    },
    frictionPoints: 22,
    monthlyHoursImpact: 28,
    monthlyDollarsImpact: 850,
    solutionComponent: {
      es: "Agente de WhatsApp IA 24/7 con respuesta en <15 segundos",
      en: "24/7 AI WhatsApp Agent replying in <15 seconds",
    },
  },
  {
    id: "manual_data_entry",
    badge: { es: "Doble Entrada Manual", en: "Manual Data Re-entry" },
    title: {
      es: "Cargamos datos a mano entre formularios, Excel, WhatsApp y facturación.",
      en: "We manually copy-paste data between forms, spreadsheets, chats, and billing.",
    },
    description: {
      es: "Operadores y comerciales dedicando 3 horas al día a reescribir nombres, teléfonos y estados de prospectos en planillas desconectadas.",
      en: "Staff spending 3 hours daily re-typing lead contact info and deal statuses into disconnected spreadsheets.",
    },
    frictionPoints: 20,
    monthlyHoursImpact: 45,
    monthlyDollarsImpact: 600,
    solutionComponent: {
      es: "Pipeline de Webhooks Edge + Supabase con sincronización atómica",
      en: "Edge Webhooks + Supabase Pipeline with atomic database sync",
    },
  },
  {
    id: "slow_wordpress",
    badge: { es: "Web Lenta / ThemeForest", en: "Slow Website / WordPress" },
    title: {
      es: "La web tarda más de 3.5s en cargar o está construida con WordPress/Elementor.",
      en: "Website takes over 3.5s to load or is built on heavy WordPress/Elementor.",
    },
    description: {
      es: "Más del 45% de los clics de pauta paga rebotan antes de que la página termine de hidratar. Dinero quemado en Meta y Google Ads.",
      en: "Over 45% of paid traffic clicks bounce before the page loads. Wasted budget on Google and Meta Ads.",
    },
    frictionPoints: 24,
    monthlyHoursImpact: 15,
    monthlyDollarsImpact: 950,
    solutionComponent: {
      es: "Arquitectura Next.js 16 con 95+ PageSpeed en 300 regiones Edge CDN",
      en: "Next.js 16 Architecture with 95+ PageSpeed on 300 Edge CDN nodes",
    },
  },
  {
    id: "scattered_chats",
    badge: { es: "Chats Dispersos", en: "Scattered Private Chats" },
    title: {
      es: "No hay un CRM unificado: cada vendedor maneja prospectos en su teléfono privado.",
      en: "No unified CRM: each salesperson manages deals on their personal phone.",
    },
    description: {
      es: "Cero visibilidad directiva sobre el embudo. Si un comercial se va, se lleva los contactos y el historial de la empresa.",
      en: "Zero executive visibility over deal stages. If an employee leaves, your client relationships leave with them.",
    },
    frictionPoints: 18,
    monthlyHoursImpact: 24,
    monthlyDollarsImpact: 700,
    solutionComponent: {
      es: "Bandeja Omnicanal Centralizada + CRM Operativo GoHighLevel/PostgreSQL",
      en: "Centralized Omnichannel Inbox + Operational CRM GoHighLevel/PostgreSQL",
    },
  },
  {
    id: "no_followup",
    badge: { es: "Ghosting Sin Secuencia", en: "Unfollowed Ghosting" },
    title: {
      es: "Enviamos presupuestos y si el cliente no responde, nadie hace seguimiento.",
      en: "We send quotes and if the client doesn't reply, no follow-up is triggered.",
    },
    description: {
      es: "Hasta el 40% de las ventas cerradas requieren entre 3 y 5 toques de contacto. El olvido manual es la mayor fuga silenciosa de ingresos.",
      en: "Up to 40% of deals close between contact touches 3 and 5. Manual forgetting is the biggest silent revenue leak.",
    },
    frictionPoints: 16,
    monthlyHoursImpact: 20,
    monthlyDollarsImpact: 800,
    solutionComponent: {
      es: "Secuencia Anti-Ghosting automatizada con reactivación contextual",
      en: "Automated Anti-Ghosting Sequence with contextual re-engagement",
    },
  },
];

export interface FrictionReport {
  selectedCount: number;
  totalSymptoms: number;
  frictionScorePct: number; // 0 to 100
  severity: "healthy" | "moderate" | "critical";
  totalMonthlyHoursWasted: number;
  totalMonthlyDollarsLost: number;
  prescribedSprint: {
    name: { es: string; en: string };
    durationDays: number;
    recommendedStack: string[];
  };
}

export function calculateFrictionDiagnostic(selectedIds: string[]): FrictionReport {
  const selected = FRICTION_SYMPTOMS.filter((s) => selectedIds.includes(s.id));
  const selectedCount = selected.length;
  const totalSymptoms = FRICTION_SYMPTOMS.length;

  if (selectedCount === 0) {
    return {
      selectedCount: 0,
      totalSymptoms,
      frictionScorePct: 4,
      severity: "healthy",
      totalMonthlyHoursWasted: 0,
      totalMonthlyDollarsLost: 0,
      prescribedSprint: {
        name: {
          es: "Operación Saludable · Mantenimiento Preventivo",
          en: "Healthy Operations · Preventive Maintenance",
        },
        durationDays: 5,
        recommendedStack: ["Next.js 16", "Supabase", "Edge CDN"],
      },
    };
  }

  const rawScore = selected.reduce((sum, s) => sum + s.frictionPoints, 0);
  const frictionScorePct = Math.min(Math.max(rawScore, 10), 100);

  const totalMonthlyHoursWasted = selected.reduce((sum, s) => sum + s.monthlyHoursImpact, 0);
  const totalMonthlyDollarsLost = selected.reduce((sum, s) => sum + s.monthlyDollarsImpact, 0);

  let severity: "healthy" | "moderate" | "critical" = "healthy";
  let durationDays = 7;
  let sprintName = {
    es: "Sprint Web de Alto Impacto",
    en: "High-Impact Web Sprint",
  };
  let recommendedStack = ["Next.js 16", "Turbopack", "Tailwind CSS"];

  if (frictionScorePct >= 60) {
    severity = "critical";
    durationDays = 21;
    sprintName = {
      es: "Ecosistema Integral End-to-End (3 Semanas)",
      en: "End-to-End Digital Ecosystem (3 Weeks)",
    };
    recommendedStack = ["Next.js 16", "WhatsApp API", "Supabase CRM", "Agentes IA", "Edge Webhooks"];
  } else if (frictionScorePct >= 25) {
    severity = "moderate";
    durationDays = 14;
    sprintName = {
      es: "Sprint de Automatización & CRM (2 Semanas)",
      en: "CRM & Automation Sprint (2 Weeks)",
    };
    recommendedStack = ["WhatsApp API", "GoHighLevel / Supabase", "Agente IA", "n8n Webhooks"];
  }

  return {
    selectedCount,
    totalSymptoms,
    frictionScorePct,
    severity,
    totalMonthlyHoursWasted,
    totalMonthlyDollarsLost,
    prescribedSprint: {
      name: sprintName,
      durationDays,
      recommendedStack,
    },
  };
}
