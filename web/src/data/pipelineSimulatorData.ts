import { Stethoscope, Building2, Briefcase, ShoppingBag, type LucideIcon } from "lucide-react";

export type BusinessNicheId = "clinicas" | "inmobiliarias" | "b2b" | "ecommerce";

export interface BusinessNicheConfig {
  id: BusinessNicheId;
  icon: LucideIcon;
  name: { es: string; en: string };
  ticketLabel: { es: string; en: string };
  avgTicket: number;
  typicalPain: { es: string; en: string };
  simulatedClientQuery: { es: string; en: string };
  simulatedAgentResponse: { es: string; en: string };
  accentColor: string;
}

export const NICHES: BusinessNicheConfig[] = [
  {
    id: "clinicas",
    icon: Stethoscope,
    name: { es: "Clínicas & Salud Privada", en: "Clinics & Private Health" },
    ticketLabel: { es: "Tratamiento promedio: $350 USD", en: "Avg treatment: $350 USD" },
    avgTicket: 350,
    typicalPain: {
      es: "Pacientes consultan a las 22:00 por WhatsApp y se van con otra clínica si nadie responde en 15 minutos.",
      en: "Patients reach out at 10 PM on WhatsApp and book elsewhere if no one replies within 15 minutes.",
    },
    simulatedClientQuery: {
      es: "Hola, necesito turno para ortodoncia invisible este jueves. ¿Tienen disponible por la tarde?",
      en: "Hi, I need an appointment for clear aligners this Thursday. Any slots in the afternoon?",
    },
    simulatedAgentResponse: {
      es: "¡Hola! Sí, el Dr. Ramos tiene disponibilidad este jueves a las 16:30 o 18:00. ¿Cuál te queda más cómodo para bloquearlo en agenda?",
      en: "Hello! Yes, Dr. Ramos has openings this Thursday at 4:30 PM or 6:00 PM. Which one works best for you to lock it in?",
    },
    accentColor: "#55D8FF",
  },
  {
    id: "inmobiliarias",
    icon: Building2,
    name: { es: "Inmobiliarias & Desarrollos", en: "Real Estate & Developers" },
    ticketLabel: { es: "Comisión promedio: $2,500 USD", en: "Avg commission: $2,500 USD" },
    avgTicket: 2500,
    typicalPain: {
      es: "Cientos de consultas por portales que queman horas de brokers sin saber si tienen presupuesto real.",
      en: "Hundreds of portal inquiries consuming broker hours without verifying real budget.",
    },
    simulatedClientQuery: {
      es: "Hola, me interesa el departamento de 2 ambientes en Pocitos. ¿Se puede financiar en pozo?",
      en: "Hi, interested in the 2-bedroom unit in Pocitos. Is off-plan financing available?",
    },
    simulatedAgentResponse: {
      es: "¡Hola! Sí, cuenta con entrega del 30% y 24 cuotas sin interés. Para enviarte la ficha técnica, ¿tu compra es para vivir o como inversión?",
      en: "Hello! Yes, 30% down payment and 24 zero-interest installments. To send the spec sheet, are you looking to live or invest?",
    },
    accentColor: "#FFBA08",
  },
  {
    id: "b2b",
    icon: Briefcase,
    name: { es: "Agencias & Consultoría B2B", en: "Agencies & B2B Consulting" },
    ticketLabel: { es: "Retainer promedio: $1,500 USD", en: "Avg retainer: $1,500 USD" },
    avgTicket: 1500,
    typicalPain: {
      es: "Leads calificados en Meta Ads que tardan 6 horas en recibir contacto y nunca agendan la demo.",
      en: "Qualified Meta Ads leads waiting 6 hours for contact and never showing up to the demo.",
    },
    simulatedClientQuery: {
      es: "Hola Mario, tenemos 8 personas en ventas y se nos caen los leads por falta de seguimiento rápido.",
      en: "Hi Mario, we have 8 reps and are losing leads due to slow follow-up times.",
    },
    simulatedAgentResponse: {
      es: "Entiendo perfecto ese cuello de botella. Integramos WhatsApp + GoHighLevel para calificar en < 30 seg. Agendemos una sesión técnica de 20 min.",
      en: "I know that bottleneck well. We connect WhatsApp + GoHighLevel for < 30s qualification. Let's schedule a 20-min technical audit.",
    },
    accentColor: "#71F3A2",
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    name: { es: "E-commerce & Marcas DTC", en: "E-commerce & DTC Brands" },
    ticketLabel: { es: "Ticket promedio: $180 USD", en: "Avg order: $180 USD" },
    avgTicket: 180,
    typicalPain: {
      es: "Carritos abandonados de alto valor con dudas de talles o envíos que se enfrían sin respuesta inmediata.",
      en: "High-value abandoned carts with sizing or shipping doubts that go cold without immediate reply.",
    },
    simulatedClientQuery: {
      es: "Hola, tengo los productos en el carrito pero no sé si llega a tiempo para el viernes en Montevideo.",
      en: "Hi, I have items in my cart but want to confirm delivery before Friday in Montevideo.",
    },
    simulatedAgentResponse: {
      es: "¡Hola! Si confirmás hoy antes de las 18:00, tu pedido llega mañana jueves a tu puerta con envío express asegurado.",
      en: "Hello! If you check out before 6:00 PM today, your order arrives tomorrow Thursday with insured express delivery.",
    },
    accentColor: "#B68CFF",
  },
];

export interface PipelineStep {
  id: string;
  label: { es: string; en: string };
  sub: { es: string; en: string };
  traditionalStatus: { es: string; en: string; time: string; bad: boolean };
  automatedStatus: { es: string; en: string; time: string; bad: boolean };
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "ingesta",
    label: { es: "1. Ingesta Multicanal", en: "1. Omnichannel Capture" },
    sub: { es: "Meta Ads, Web & WhatsApp", en: "Meta Ads, Web & WhatsApp" },
    traditionalStatus: {
      es: "Llega al correo o a una planilla manual.",
      en: "Arrives in an email inbox or spreadsheet.",
      time: "0 min",
      bad: false,
    },
    automatedStatus: {
      es: "Webhook instantáneo a servidor Edge.",
      en: "Instant webhook to Edge runtime.",
      time: "0.1 seg",
      bad: false,
    },
  },
  {
    id: "respuesta",
    label: { es: "2. Contacto & Calificación", en: "2. Outreach & Qualification" },
    sub: { es: "Agente IA Conversacional", en: "Conversational AI Agent" },
    traditionalStatus: {
      es: "Comercial responde horas después o al día siguiente.",
      en: "Sales rep replies hours later or next morning.",
      time: "3 a 5 horas",
      bad: true,
    },
    automatedStatus: {
      es: "Agente WhatsApp califica presupuesto y horario en vivo.",
      en: "WhatsApp Agent verifies budget & slot in real time.",
      time: "24 segundos",
      bad: false,
    },
  },
  {
    id: "crm",
    label: { es: "3. Sincronización CRM", en: "3. CRM Sync & Pipeline" },
    sub: { es: "GoHighLevel / Pipedrive", en: "GoHighLevel / Pipedrive" },
    traditionalStatus: {
      es: "Carga manual de datos (o nunca se registra).",
      en: "Manual data entry (or gets forgotten).",
      time: "Frecuente omisión",
      bad: true,
    },
    automatedStatus: {
      es: "Creación de trato, tags automáticos y tracking de atribución.",
      en: "Deal created, tags applied, full attribution tracked.",
      time: "1.2 seg",
      bad: false,
    },
  },
  {
    id: "cierre",
    label: { es: "4. Agenda & Cierre", en: "4. Booking & Conversion" },
    sub: { es: "Calendario & Recordatorios", en: "Calendar & Anti-NoShow" },
    traditionalStatus: {
      es: "Idas y vueltas eternas para coincidir. No-show del 45%.",
      en: "Endless back-and-forth emails. 45% no-show rate.",
      time: "24 a 48 horas",
      bad: true,
    },
    automatedStatus: {
      es: "Llamada bloqueada en Google Calendar + WhatsApp 2h antes.",
      en: "Locked in Google Calendar + SMS/WA 2h prior.",
      time: "En la misma sesión",
      bad: false,
    },
  },
];

export function calculateSimulatorMetrics(isAutomated: boolean, volume: number) {
  if (isAutomated) {
    const conversionRate = 0.24;
    return {
      responseTime: "28 seg",
      leadsConverted: Math.round(volume * conversionRate),
      hoursSavedPerMonth: Math.round(volume * 0.25),
      dropOffRate: "11%",
    };
  }
  const conversionRate = 0.08;
  return {
    responseTime: "4.5 horas",
    leadsConverted: Math.round(volume * conversionRate),
    hoursSavedPerMonth: 0,
    dropOffRate: "62%",
  };
}
