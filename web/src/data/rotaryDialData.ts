export interface DialTier {
  id: string;
  angle: number; // 0, 90, 180, 270 deg
  level: number; // 1 to 4
  tag: string;
  name: { es: string; en: string };
  subtitle: { es: string; en: string };
  multiplier: number; // 1.0x to 12.0x
  frictionPct: number; // 85% down to 2%
  speedToLead: { es: string; en: string };
  monthlyLeakUsd: number;
  costStructure: { es: string; en: string };
  color: string;
  glowRgba: string;
  stack: string[];
}

export const DIAL_TIERS: DialTier[] = [
  {
    id: "tier_legacy",
    angle: 0,
    level: 1,
    tag: "1.0X LEVERAGE",
    name: {
      es: "Operación Fragmentada (Tradicional)",
      en: "Fragmented Operations (Traditional)",
    },
    subtitle: {
      es: "WordPress con 30 plugins, datos pasados a mano a Excel y chats dispersos en teléfonos privados.",
      en: "WordPress with 30 plugins, manual Excel data entry, and private personal chat threads.",
    },
    multiplier: 1.0,
    frictionPct: 85,
    speedToLead: { es: "4 a 6 horas", en: "4 to 6 hours" },
    monthlyLeakUsd: 1850,
    costStructure: {
      es: "Costos ocultos en horas hombre y fugas constantes de prospectos",
      en: "Hidden labor costs and high prospect leakage",
    },
    color: "#FF5555", // Deep Space destructive
    glowRgba: "rgba(255,85,85,0.35)",
    stack: ["WordPress / PHP", "Excel Manual", "Chats Privados", "Cero CRM"],
  },
  {
    id: "tier_web_modern",
    angle: 90,
    level: 2,
    tag: "2.8X LEVERAGE",
    name: {
      es: "Plataforma Web Next.js 16 Edge",
      en: "Next.js 16 Edge Web Platform",
    },
    subtitle: {
      es: "Sitio web de ultra-velocidad (98 PageSpeed), CDN global en 300 regiones y formularios sanitizados.",
      en: "Ultra-fast website (98 PageSpeed), 300-node Edge CDN, and zero-bounce traffic retention.",
    },
    multiplier: 2.8,
    frictionPct: 52,
    speedToLead: { es: "45 minutos", en: "45 minutes" },
    monthlyLeakUsd: 900,
    costStructure: {
      es: "Pauta publicitaria aprovechada al 100% sin rebotes por lentitud",
      en: "100% ad budget capture with zero slow-load bounces",
    },
    color: "#55D8FF", // Cyan
    glowRgba: "rgba(85,216,255,0.35)",
    stack: ["Next.js 16", "Turbopack", "Tailwind CSS", "Vercel Edge"],
  },
  {
    id: "tier_automated_crm",
    angle: 180,
    level: 3,
    tag: "6.5X LEVERAGE",
    name: {
      es: "Circuito de Captación & CRM Automatizado",
      en: "Automated Capture & CRM Engine",
    },
    subtitle: {
      es: "Webhooks en tiempo real, calificación de prospectos con Agente IA y agenda instantánea en Google Meet.",
      en: "Real-time webhooks, AI agent lead qualification, and instant Google Meet locking.",
    },
    multiplier: 6.5,
    frictionPct: 18,
    speedToLead: { es: "<30 segundos", en: "<30 seconds" },
    monthlyLeakUsd: 250,
    costStructure: {
      es: "3x más citas comerciales calificadas con el mismo equipo de ventas",
      en: "3x more qualified sales meetings with existing team size",
    },
    color: "#B68CFF", // Violet
    glowRgba: "rgba(182,140,255,0.35)",
    stack: ["Next.js 16", "Supabase", "WhatsApp API", "Agente IA GPT-4o"],
  },
  {
    id: "tier_full_ecosystem",
    angle: 270,
    level: 4,
    tag: "12.0X LEVERAGE",
    name: {
      es: "Ecosistema Integral Mario Morera",
      en: "Mario Morera Integral Ecosystem",
    },
    subtitle: {
      es: "Arquitectura unificada: Web + CRM + IA + Telefonía de Voz + Cobros Stripe. Cero intermediarios, 100% código propio.",
      en: "Unified architecture: Web + CRM + AI + Voice Telephony + Stripe. Zero middle layers, 100% custom code.",
    },
    multiplier: 12.0,
    frictionPct: 2,
    speedToLead: { es: "18 segundos (Inmediato)", en: "18 seconds (Instant)" },
    monthlyLeakUsd: 0,
    costStructure: {
      es: "Cero burocracia de agencias. Máximo retorno por dólar invertido.",
      en: "Zero agency overhead. Highest possible return per invested dollar.",
    },
    color: "#71F3A2", // Signal green
    glowRgba: "rgba(113,243,162,0.45)",
    stack: [
      "Next.js 16",
      "Supabase PostgreSQL",
      "Voz IA Telephony",
      "WhatsApp Cloud API",
      "Stripe",
    ],
  },
];

export function snapToNearestDialTier(angle: number): DialTier {
  // Normalize angle between 0 and 360
  const normalized = ((angle % 360) + 360) % 360;

  // Find tier with shortest circular angular distance
  let closest = DIAL_TIERS[0];
  let minDiff = 360;

  for (const tier of DIAL_TIERS) {
    const rawDiff = Math.abs(normalized - tier.angle);
    const circularDiff = Math.min(rawDiff, 360 - rawDiff);
    if (circularDiff < minDiff) {
      minDiff = circularDiff;
      closest = tier;
    }
  }

  return closest;
}
