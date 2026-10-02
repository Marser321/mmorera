export interface ScopeModule {
  id: string;
  name: { es: string; en: string };
  badge: { es: string; en: string };
  description: { es: string; en: string };
  hoursSavedWeekly: number;
  iconName: "globe" | "bot" | "database" | "credit-card" | "line-chart";
  defaultSelected: boolean;
}

export interface VelocityTier {
  id: "agile" | "full" | "enterprise";
  name: { es: string; en: string };
  days: number;
  durationLabel: { es: string; en: string };
  tag: { es: string; en: string };
  description: { es: string; en: string };
}

export interface ScopeSummary {
  selectedModuleIds: string[];
  totalModules: number;
  velocity: VelocityTier;
  monthlyVolume: number;
  estimatedHoursSavedWeekly: number;
  estimatedEfficiencyFactor: string;
  formattedMessage: string;
  whatsAppUrl: string;
}

export const SCOPE_MODULES: ScopeModule[] = [
  {
    id: "webapp",
    name: {
      es: "Web App & Plataforma Next.js 16",
      en: "Next.js 16 Web App & Platform",
    },
    badge: { es: "99 PageSpeed · Edge SSR", en: "99 PageSpeed · Edge SSR" },
    description: {
      es: "Frontend ultra veloz con arquitectura modular, SEO técnico y TypeScript estricto.",
      en: "Ultra-fast frontend with modular architecture, technical SEO, and strict TypeScript.",
    },
    hoursSavedWeekly: 8,
    iconName: "globe",
    defaultSelected: true,
  },
  {
    id: "ai-agent",
    name: {
      es: "Agentes de IA & Telefonía de Voz",
      en: "AI Agents & Voice Telephony",
    },
    badge: { es: "Atención 24/7 · WhatsApp & Voz", en: "24/7 Ops · WhatsApp & Voice" },
    description: {
      es: "Modelos calibrados con tu base de conocimiento para calificar y responder en <30 segundos.",
      en: "Models calibrated with your proprietary knowledge to qualify and reply in <30 seconds.",
    },
    hoursSavedWeekly: 14,
    iconName: "bot",
    defaultSelected: true,
  },
  {
    id: "crm-pipeline",
    name: {
      es: "CRM Custom & Pipeline de Eventos",
      en: "Custom CRM & Event Pipelines",
    },
    badge: { es: "Supabase / Postgres · Webhooks", en: "Supabase / Postgres · Webhooks" },
    description: {
      es: "Trazabilidad unificada sin perder contexto de leads entre anuncios, formularios y cierre.",
      en: "Unified traceability without losing lead context across ads, forms, and closed sales.",
    },
    hoursSavedWeekly: 10,
    iconName: "database",
    defaultSelected: true,
  },
  {
    id: "billing",
    name: {
      es: "Facturación & Checkout Automatizado",
      en: "Automated Billing & Checkout",
    },
    badge: { es: "Stripe / MercadoPago · Webhooks", en: "Stripe / MercadoPago · Webhooks" },
    description: {
      es: "Cobros recurrentes, pasarelas de pago y conciliación bancaria directa a base de datos.",
      en: "Recurring billing, payment gateways, and direct database payment reconciliation.",
    },
    hoursSavedWeekly: 6,
    iconName: "credit-card",
    defaultSelected: false,
  },
  {
    id: "telemetry-hud",
    name: {
      es: "Panel Ejecutivo & Telemetría en Vivo",
      en: "Executive HUD & Live Telemetry",
    },
    badge: { es: "Métricas de Margen & Conversión", en: "Margin & Conversion Metrics" },
    description: {
      es: "Tablero a medida para monitorear el pulso operativo de tu empresa sin hojas de cálculo rotas.",
      en: "Custom cockpit to monitor your company's operational pulse without messy spreadsheets.",
    },
    hoursSavedWeekly: 5,
    iconName: "line-chart",
    defaultSelected: false,
  },
];

export const VELOCITY_TIERS: VelocityTier[] = [
  {
    id: "agile",
    name: { es: "Sprint Ágil", en: "Agile Sprint" },
    days: 10,
    durationLabel: { es: "10 días corridos", en: "10 calendar days" },
    tag: { es: "Velocidad Máxima", en: "Maximum Speed" },
    description: {
      es: "Diseñado para lanzar un MVP funcional o resolver un cuello de botella crítico sin demoras.",
      en: "Designed to ship a functional MVP or eliminate a critical bottleneck without delay.",
    },
  },
  {
    id: "full",
    name: { es: "Arquitectura Completa", en: "Full Architecture" },
    days: 21,
    durationLabel: { es: "3 semanas", en: "3 weeks" },
    tag: { es: "Recomendado", en: "Recommended" },
    description: {
      es: "Sistema punta a punta: frontend de alta conversión, automatizaciones con IA y CRM sincronizado.",
      en: "End-to-end system: high-converting frontend, AI automations, and synchronized CRM.",
    },
  },
  {
    id: "enterprise",
    name: { es: "Transformación Integral", en: "Enterprise Overhaul" },
    days: 35,
    durationLabel: { es: "5 semanas", en: "5 weeks" },
    tag: { es: "Escala & Múltiples Equipos", en: "Scale & Multiple Teams" },
    description: {
      es: "Migración de stack obsoleto, telefonía masiva con IA, microservicios y panel a medida.",
      en: "Legacy stack migration, high-volume voice AI, microservices, and custom telemetry cockpit.",
    },
  },
];

export const WHATSAPP_PHONE_NUMBER = "59892323675";

export function calculateScopeSummary(
  selectedModuleIds: string[],
  velocityId: string,
  monthlyVolume: number,
  language: "es" | "en" = "es"
): ScopeSummary {
  const isEs = language === "es";
  const validVelocity =
    VELOCITY_TIERS.find((v) => v.id === velocityId) || VELOCITY_TIERS[1];

  const selectedModules = SCOPE_MODULES.filter((m) =>
    selectedModuleIds.includes(m.id)
  );

  const baseHoursWeekly = selectedModules.reduce(
    (acc, m) => acc + m.hoursSavedWeekly,
    0
  );

  // Volume scale factor: 100 leads/mo baseline; scales dynamically
  const volumeMultiplier = Math.max(0.8, Math.min(3.5, 0.7 + (monthlyVolume / 500) * 0.6));
  const estimatedHoursSavedWeekly = Math.round(baseHoursWeekly * volumeMultiplier);

  const efficiencyFactorNum = (1.5 + (selectedModules.length * 0.7) + (monthlyVolume / 800) * 0.8).toFixed(1);
  const estimatedEfficiencyFactor = `${efficiencyFactorNum}x`;

  // Compose clean WhatsApp formatted text
  const moduleBullets = selectedModules.length > 0
    ? selectedModules.map((m) => `• ${m.name[language]}`).join("\n")
    : (isEs ? "• Diagnóstico general del sistema" : "• General system diagnostic");

  const formattedMessage = isEs
    ? `*Alcance de Proyecto — MMORERA OS*
━━━━━━━━━━━━━━━━━━━━
📌 *Módulos seleccionados:*
${moduleBullets}

⏱️ *Plazo previsto:* ${validVelocity.name.es} (${validVelocity.durationLabel.es})
📈 *Volumen proyectado:* ~${monthlyVolume.toLocaleString("es-AR")} operaciones/mes
💡 *Ahorro estimado:* ~${estimatedHoursSavedWeekly} hs/semana liberadas
⚡ *Palanca operativa:* ${estimatedEfficiencyFactor}

Hola Mario, armé esta configuración interactiva en tu sitio y quiero coordinar el próximo paso para mi empresa.`
    : `*Project Scope — MMORERA OS*
━━━━━━━━━━━━━━━━━━━━
📌 *Selected Modules:*
${moduleBullets}

⏱️ *Target Timeline:* ${validVelocity.name.en} (${validVelocity.durationLabel.en})
📈 *Projected Volume:* ~${monthlyVolume.toLocaleString("en-US")} operations/month
💡 *Estimated Savings:* ~${estimatedHoursSavedWeekly} hrs/week saved
⚡ *Operational Leverage:* ${estimatedEfficiencyFactor}

Hi Mario, I built this custom scope on your site and would like to coordinate the next technical step for my business.`;

  const whatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    formattedMessage
  )}`;

  return {
    selectedModuleIds: selectedModules.map((m) => m.id),
    totalModules: selectedModules.length,
    velocity: validVelocity,
    monthlyVolume,
    estimatedHoursSavedWeekly,
    estimatedEfficiencyFactor,
    formattedMessage,
    whatsAppUrl,
  };
}
