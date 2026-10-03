export interface ResponseTimeTier {
  id: string;
  label: { es: string; en: string };
  timeMinutes: number;
  timeDisplay: string;
  contactRatePct: number;
  conversionMultiplier: number; // relative to worst (24h = 1.0x, 18s = 21.0x)
  zone: "optimal" | "warning" | "danger" | "critical";
  description: { es: string; en: string };
  humanReality: { es: string; en: string };
}

export interface LeadDecayCalculationResult {
  monthlyAdSpend: number;
  ticketValue: number;
  leadsGenerated: number;
  activeTier: ResponseTimeTier;
  contactRatePct: number;
  dealsClosed: number;
  monthlyRevenueGenerated: number;
  // Comparison vs 18-second AI Operator:
  optimalDealsClosed: number;
  optimalMonthlyRevenue: number;
  dealsLostMonthly: number;
  adSpendBurnedMonthly: number;
  adSpendBurnedPct: number;
  annualRecoverableRevenue: number;
}

export const RESPONSE_TIME_TIERS: ResponseTimeTier[] = [
  {
    id: "tier-18s",
    label: { es: "18 Segundos (Operador IA Mario Morera)", en: "18 Seconds (Mario Morera AI Operator)" },
    timeMinutes: 0.3,
    timeDisplay: "18s",
    contactRatePct: 94,
    conversionMultiplier: 21.0,
    zone: "optimal",
    description: {
      es: "El prospecto todavía tiene el celular en la mano mirando la confirmación. Tasa de contacto casi perfecta.",
      en: "The lead still holds their phone looking at the confirmation screen. Near-perfect contact rate.",
    },
    humanReality: {
      es: "Imposible para un humano. Ejecutado 100% por Webhooks en el Edge + WhatsApp Business API.",
      en: "Physically impossible for humans. 100% executed by Edge Webhooks + WhatsApp Business API.",
    },
  },
  {
    id: "tier-5m",
    label: { es: "5 Minutos (Estándar de Oro Humano)", en: "5 Minutes (Human Gold Standard)" },
    timeMinutes: 5,
    timeDisplay: "5m",
    contactRatePct: 78,
    conversionMultiplier: 15.2,
    zone: "optimal",
    description: {
      es: "Ventana máxima de retención antes de que el prospecto empiece a buscar a tu competencia en Google.",
      en: "Maximum attention retention window before the lead starts searching for competitors on Google.",
    },
    humanReality: {
      es: "Requiere un vendedor pegado a la pantalla sin pestañear de 9 a 18h. Se rompe en almuerzos y noches.",
      en: "Requires a sales rep glued to their screen 9-6 without blinking. Fails on lunches and evenings.",
    },
  },
  {
    id: "tier-30m",
    label: { es: "30 Minutos (Fricción de Notificación)", en: "30 Minutes (Notification Friction)" },
    timeMinutes: 30,
    timeDisplay: "30m",
    contactRatePct: 42,
    conversionMultiplier: 6.8,
    zone: "warning",
    description: {
      es: "El lead ya guardó el celular, cambió de pestaña o está atendiendo a un cliente.",
      en: "The lead already put away their phone, closed the tab, or joined another meeting.",
    },
    humanReality: {
      es: "El vendedor tardó en ver el correo de aviso de lead o estaba en otra llamada.",
      en: "Sales rep missed the email alert or was engaged on another sales call.",
    },
  },
  {
    id: "tier-2h",
    label: { es: "2 Horas (Reuniones / Almuerzo)", en: "2 Hours (Meetings / Lunch Break)" },
    timeMinutes: 120,
    timeDisplay: "2h",
    contactRatePct: 22,
    conversionMultiplier: 3.1,
    zone: "danger",
    description: {
      es: "El prospecto ya no recuerda con precisión qué anuncio tocó. 78% de probabilidad de que no atienda.",
      en: "The lead barely remembers which specific ad they clicked. 78% chance of no-answer.",
    },
    humanReality: {
      es: "El lead entró a las 13:00 y se respondió a las 15:00. Pérdida masiva de momentum.",
      en: "Lead opted in at 1:00 PM and was answered at 3:00 PM. Massive momentum drop.",
    },
  },
  {
    id: "tier-6h",
    label: { es: "6 Horas (Fin de Jornada)", en: "6 Hours (End of Business Day)" },
    timeMinutes: 360,
    timeDisplay: "6h",
    contactRatePct: 9,
    conversionMultiplier: 1.5,
    zone: "danger",
    description: {
      es: "El 85% de los leads ya contactaron a otra empresa o ya resolvieron el problema por otra vía.",
      en: "85% of leads have already contacted another vendor or found a workaround.",
    },
    humanReality: {
      es: "El equipo acumula leads para responderlos todos juntos al final de la tarde.",
      en: "Sales reps batch responses to the end of the afternoon. Lead is practically gone.",
    },
  },
  {
    id: "tier-24h",
    label: { es: "24 Horas+ ('Te contactamos mañana')", en: "24 Hours+ ('We will call tomorrow')" },
    timeMinutes: 1440,
    timeDisplay: "24h+",
    contactRatePct: 2.5,
    conversionMultiplier: 1.0,
    zone: "critical",
    description: {
      es: "La zona de muerte total del lead. Responder al día siguiente es quemar el 97% del presupuesto publicitario.",
      en: "The total lead mortality zone. Responding next business day incinerates 97% of your ad spend.",
    },
    humanReality: {
      es: "Fines de semana, feriados o pipelines manuales en hojas de cálculo sin automatización.",
      en: "Weekends, holidays, or manual Google Sheets pipelines without real-time triggers.",
    },
  },
];

export function calculateLeadDecay(
  monthlyAdSpend: number,
  ticketValue: number,
  tierId: string
): LeadDecayCalculationResult {
  const safeSpend = Math.max(200, Math.min(monthlyAdSpend, 50000));
  const safeTicket = Math.max(100, Math.min(ticketValue, 25000));

  // Realistic cost per lead baseline (e.g. $25 USD avg across B2B & high-ticket)
  const costPerLead = 25;
  const leadsGenerated = Math.max(10, Math.round(safeSpend / costPerLead));

  const activeTier =
    RESPONSE_TIME_TIERS.find((t) => t.id === tierId) || RESPONSE_TIME_TIERS[3]; // default 2h

  const optimalTier = RESPONSE_TIME_TIERS[0]; // 18s

  // Baseline closed rate at worst tier (24h) is ~0.5% of total leads
  const baseCloseRate = 0.005;

  // Actual close rate
  const actualCloseRate = Math.min(0.25, baseCloseRate * activeTier.conversionMultiplier);
  const dealsClosed = Math.max(1, Math.round(leadsGenerated * actualCloseRate));
  const monthlyRevenueGenerated = dealsClosed * safeTicket;

  // Optimal close rate (18s)
  const optimalCloseRate = Math.min(0.25, baseCloseRate * optimalTier.conversionMultiplier);
  const optimalDealsClosed = Math.max(dealsClosed, Math.round(leadsGenerated * optimalCloseRate));
  const optimalMonthlyRevenue = optimalDealsClosed * safeTicket;

  // Deals lost
  const dealsLostMonthly = Math.max(0, optimalDealsClosed - dealsClosed);

  // Ad spend burned: proportional to lost lead contact capability
  const contactDrop = (optimalTier.contactRatePct - activeTier.contactRatePct) / optimalTier.contactRatePct;
  const adSpendBurnedPct = Math.round(contactDrop * 100);
  const adSpendBurnedMonthly = Math.round(safeSpend * (adSpendBurnedPct / 100));

  // Annual recoverable revenue
  const annualRecoverableRevenue = dealsLostMonthly * safeTicket * 12;

  return {
    monthlyAdSpend: safeSpend,
    ticketValue: safeTicket,
    leadsGenerated,
    activeTier,
    contactRatePct: activeTier.contactRatePct,
    dealsClosed,
    monthlyRevenueGenerated,
    optimalDealsClosed,
    optimalMonthlyRevenue,
    dealsLostMonthly,
    adSpendBurnedMonthly,
    adSpendBurnedPct,
    annualRecoverableRevenue,
  };
}

export function getDecayCurveSvgPath(width = 600, height = 220): string {
  // Generates smooth SVG exponential decay path from 18s to 24h
  // Data points: (0, 94%), (120, 78%), (240, 42%), (360, 22%), (480, 9%), (600, 2.5%)
  const points = [
    { x: 0, y: height * (1 - 0.94) },
    { x: width * 0.18, y: height * (1 - 0.78) },
    { x: width * 0.38, y: height * (1 - 0.42) },
    { x: width * 0.58, y: height * (1 - 0.22) },
    { x: width * 0.78, y: height * (1 - 0.09) },
    { x: width, y: height * (1 - 0.025) },
  ];

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    path += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return path;
}
