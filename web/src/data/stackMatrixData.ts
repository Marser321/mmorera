export interface StackToolOption {
  id: string;
  name: string;
  category: "web" | "messaging" | "crm" | "billing";
  isRecommended: boolean;
  frictionScore: number; // 0 = lowest friction (best), 10 = highest friction
  notes: { es: string; en: string };
}

export interface StackLayerConfig {
  id: "web" | "messaging" | "crm" | "billing";
  layerNumber: string;
  title: { es: string; en: string };
  options: StackToolOption[];
}

export const STACK_LAYERS: StackLayerConfig[] = [
  {
    id: "web",
    layerNumber: "01",
    title: { es: "Ingesta & Experiencia Web", en: "Capture & Web Experience" },
    options: [
      {
        id: "nextjs",
        name: "Next.js 15 (Código Propio)",
        category: "web",
        isRecommended: true,
        frictionScore: 1,
        notes: {
          es: "Velocidad sub-segundo, 95+ PageSpeed y control total sin límites de plugins.",
          en: "Sub-second speed, 95+ PageSpeed, and total control without plugin bloat.",
        },
      },
      {
        id: "wordpress",
        name: "WordPress / Elementor",
        category: "web",
        isRecommended: false,
        frictionScore: 6,
        notes: {
          es: "Vulnerable a caídas de plugins, carga lenta en móviles y mantenimiento pesado.",
          en: "Prone to plugin breakage, slow mobile loads, and ongoing maintenance.",
        },
      },
      {
        id: "webflow",
        name: "Webflow",
        category: "web",
        isRecommended: false,
        frictionScore: 3,
        notes: {
          es: "Rápido de diseñar pero costoso de escalar y limitado para lógica de backend profunda.",
          en: "Fast to design but expensive to scale and limited for custom backend logic.",
        },
      },
    ],
  },
  {
    id: "messaging",
    layerNumber: "02",
    title: { es: "Canal de Contacto & Respuesta", en: "Outreach & Response Channel" },
    options: [
      {
        id: "whatsapp-ai",
        name: "WhatsApp API + Agente IA 24/7",
        category: "messaging",
        isRecommended: true,
        frictionScore: 1,
        notes: {
          es: "Respuesta en < 30 seg, califica presupuesto y bloquea llamadas en calendario automáticamente.",
          en: "Replies in < 30s, validates budget, and books calendar meetings automatically.",
        },
      },
      {
        id: "whatsapp-personal",
        name: "WhatsApp Personal (Comercial)",
        category: "messaging",
        isRecommended: false,
        frictionScore: 8,
        notes: {
          es: "Fuga del 60% de prospectos por demoras fuera de horario comercial y cero registro unificado.",
          en: "60% lead drop-off due to off-hours delays and zero unified records.",
        },
      },
      {
        id: "email-only",
        name: "Formulario Web a Email Tradicional",
        category: "messaging",
        isRecommended: false,
        frictionScore: 7,
        notes: {
          es: "Tasa de apertura baja (< 20%) y demora promedio de 4 a 8 horas en primer contacto.",
          en: "Low open rates (< 20%) and 4 to 8 hour delay for first human touch.",
        },
      },
    ],
  },
  {
    id: "crm",
    layerNumber: "03",
    title: { es: "Centro de Operaciones & CRM", en: "Operations Hub & CRM" },
    options: [
      {
        id: "ghl",
        name: "GoHighLevel (Full Suite)",
        category: "crm",
        isRecommended: true,
        frictionScore: 1,
        notes: {
          es: "Todo unificado: pipelines, automatizaciones, agendas y WhatsApp en un solo ecosistema.",
          en: "All-in-one: pipelines, automations, calendars, and WhatsApp under one roof.",
        },
      },
      {
        id: "pipedrive",
        name: "Pipedrive (Ventas Consultivas)",
        category: "crm",
        isRecommended: true,
        frictionScore: 2,
        notes: {
          es: "Excelente para equipos comerciales con foco exclusivo en etapas de deals visuales.",
          en: "Excellent for dedicated sales reps focused strictly on visual deal stages.",
        },
      },
      {
        id: "excel",
        name: "Planilla Excel / Google Sheets",
        category: "crm",
        isRecommended: false,
        frictionScore: 9,
        notes: {
          es: "Sin recordatorios automáticos, datos duplicados y nula visibilidad para la dirección.",
          en: "No auto-reminders, duplicated customer data, and zero management visibility.",
        },
      },
    ],
  },
  {
    id: "billing",
    layerNumber: "04",
    title: { es: "Cobros & Facturación", en: "Billing & Monetization" },
    options: [
      {
        id: "stripe-auto",
        name: "Stripe / Webhooks Automatizados",
        category: "billing",
        isRecommended: true,
        frictionScore: 1,
        notes: {
          es: "Cobros recurrentes, facturas inmediatas y activación de accesos en milisegundos.",
          en: "Recurring billing, instant invoices, and access provisioned in milliseconds.",
        },
      },
      {
        id: "manual-transfer",
        name: "Transferencia Bancaria Manual",
        category: "billing",
        isRecommended: false,
        frictionScore: 8,
        notes: {
          es: "Comprobantes por foto en WhatsApp, conciliación manual y demoras de activación de días.",
          en: "Receipt screenshots via chat, manual bank reconciliation, and days of setup delay.",
        },
      },
    ],
  },
];

export interface FrictionReport {
  frictionPercentage: number;
  rating: "optimal" | "moderate" | "critical";
  label: { es: string; en: string };
}

export function calculateStackFriction(selectedToolIds: Record<string, string>): FrictionReport {
  const allTools = STACK_LAYERS.flatMap((l) => l.options);
  const selectedTools = Object.values(selectedToolIds)
    .map((id) => allTools.find((t) => t.id === id))
    .filter(Boolean) as StackToolOption[];

  if (selectedTools.length === 0) {
    return {
      frictionPercentage: 10,
      rating: "optimal",
      label: { es: "Arquitectura Fluida (Óptima)", en: "Fluid Stack (Optimal)" },
    };
  }

  const avgFriction =
    selectedTools.reduce((acc, t) => acc + t.frictionScore, 0) / selectedTools.length;
  const frictionPercentage = Math.round((avgFriction / 10) * 100);

  if (frictionPercentage <= 25) {
    return {
      frictionPercentage,
      rating: "optimal",
      label: { es: "Arquitectura Fluida (Óptima)", en: "Fluid Stack (Optimal)" },
    };
  } else if (frictionPercentage <= 55) {
    return {
      frictionPercentage,
      rating: "moderate",
      label: { es: "Fricción Moderada", en: "Moderate Friction" },
    };
  } else {
    return {
      frictionPercentage,
      rating: "critical",
      label: { es: "Fricción Crítica (Pérdida de Dinero)", en: "Critical Friction (Active Loss)" },
    };
  }
}
