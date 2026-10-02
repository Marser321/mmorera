export type ChannelType = "whatsapp" | "instagram" | "meta_ads" | "web_form" | "voice_call";

export interface InboxMessage {
  id: string;
  sender: "customer" | "ai_agent" | "system";
  text: {
    es: string;
    en: string;
  };
  timestamp: string;
}

export interface OmnichannelLead {
  id: string;
  customerName: string;
  companyName: string;
  channel: ChannelType;
  channelLabel: string;
  channelColor: string;
  dealValueUsd: number;
  intentScore: number; // 0 - 100
  responseSpeedSec: number;
  currentStage: {
    es: string;
    en: string;
  };
  summary: {
    es: string;
    en: string;
  };
  messages: InboxMessage[];
  availableActions: {
    id: "send_proposal" | "book_calendar" | "activate_antighosting";
    label: {
      es: string;
      en: string;
    };
    actionFeedback: {
      es: string;
      en: string;
    };
  }[];
}

export const OMNICHANNEL_LEADS: OmnichannelLead[] = [
  {
    id: "lead-1",
    customerName: "Carlos Méndez",
    companyName: "Inmobiliaria Costa & Desarrollos",
    channel: "whatsapp",
    channelLabel: "WhatsApp Business API",
    channelColor: "#25D366",
    dealValueUsd: 2800,
    intentScore: 96,
    responseSpeedSec: 18,
    currentStage: {
      es: "Calificado · Listo para Reunión",
      en: "Qualified · Ready for Meeting",
    },
    summary: {
      es: "Busca automatizar la captura de prospectos de pauta en Meta para 3 nuevos desarrollos en pozo.",
      en: "Looking to automate Meta ad lead capture for 3 new pre-construction developments.",
    },
    messages: [
      {
        id: "m-1",
        sender: "customer",
        text: {
          es: "Hola, vi tu caso de estudio de AD Media y me interesa implementar el mismo sistema para nuestros brokers.",
          en: "Hi, I saw your AD Media case study and want to deploy the same system for our brokers.",
        },
        timestamp: "10:14 AM",
      },
      {
        id: "m-2",
        sender: "ai_agent",
        text: {
          es: "¡Hola Carlos! Un gusto. En AD Media logramos respuesta sub-30s y +65% de agendas. ¿Cuántos leads promedio reciben por mes?",
          en: "Hi Carlos! Great to connect. In AD Media we achieved sub-30s speed and +65% bookings. How many monthly leads do you average?",
        },
        timestamp: "10:14 AM",
      },
      {
        id: "m-3",
        sender: "customer",
        text: {
          es: "Alrededor de 450 leads al mes entre Meta y Google Ads.",
          en: "Around 450 leads per month between Meta and Google Ads.",
        },
        timestamp: "10:15 AM",
      },
      {
        id: "m-4",
        sender: "ai_agent",
        text: {
          es: "Excelente volumen. En ese rango la automatización evita perder un 40% de prospectos fríos. ¿Te queda bien revisar la arquitectura mañana a las 11:00 hs?",
          en: "Solid volume. At that tier automation recovers 40% of dropped leads. Does tomorrow at 11:00 AM work for an architecture review?",
        },
        timestamp: "10:15 AM",
      },
    ],
    availableActions: [
      {
        id: "book_calendar",
        label: {
          es: "Bloquear Turno Google Meet",
          en: "Lock Google Meet Slot",
        },
        actionFeedback: {
          es: "Invitación de calendario enviada por correo y WhatsApp con recordatorio automático.",
          en: "Calendar invite dispatched via email & WhatsApp with auto-reminders.",
        },
      },
      {
        id: "send_proposal",
        label: {
          es: "Enviar Presupuesto Prefijado",
          en: "Send Fixed-Price Scope",
        },
        actionFeedback: {
          es: "PDF interactivo de sprint de 2 semanas enviado con enlace de confirmación.",
          en: "Interactive 2-week sprint PDF sent with confirmation link.",
        },
      },
    ],
  },
  {
    id: "lead-2",
    customerName: "Dra. Lucía Domínguez",
    companyName: "Clínica Dental & Estética Avanzada",
    channel: "instagram",
    channelLabel: "Instagram DM Direct",
    channelColor: "#E1306C",
    dealValueUsd: 1400,
    intentScore: 91,
    responseSpeedSec: 22,
    currentStage: {
      es: "Triaje Automático · Paciente Calificado",
      en: "Auto Triage · Qualified Patient",
    },
    summary: {
      es: "La recepcionista no da abasto para responder mensajes directos y se pierden tratamientos de ortodoncia invisible.",
      en: "Receptionist overwhelmed by DMs; losing high-ticket clear aligner consultations.",
    },
    messages: [
      {
        id: "m-21",
        sender: "customer",
        text: {
          es: "Buenas tardes, ¿tienen disponibilidad para evaluación de alineadores invisibles?",
          en: "Good afternoon, do you have availability for clear aligner evaluations?",
        },
        timestamp: "03:42 PM",
      },
      {
        id: "m-22",
        sender: "ai_agent",
        text: {
          es: "¡Hola Dra. Lucía! Sí, la evaluación incluye escaneo intraoral 3D sin costo. ¿Preferís horario de mañana o tarde?",
          en: "Hi Dr. Lucia! Yes, evaluation includes a complimentary 3D intraoral scan. Do you prefer morning or afternoon?",
        },
        timestamp: "03:42 PM",
      },
      {
        id: "m-23",
        sender: "customer",
        text: {
          es: "De tarde después de las 17:00 hs me queda perfecto.",
          en: "Afternoon after 5:00 PM is ideal.",
        },
        timestamp: "03:43 PM",
      },
    ],
    availableActions: [
      {
        id: "book_calendar",
        label: {
          es: "Confirmar Turno en Software Clínico",
          en: "Confirm Slot in Clinic ERP",
        },
        actionFeedback: {
          es: "Turno reservado en el sillón 2 y SMS de confirmación despachado al paciente.",
          en: "Chair 2 reserved and SMS confirmation dispatched to patient.",
        },
      },
      {
        id: "activate_antighosting",
        label: {
          es: "Activar Recordatorio Anti-Ausencias",
          en: "Activate Anti-No-Show Trigger",
        },
        actionFeedback: {
          es: "Secuencia de 2 recordatorios (24h y 2h antes) programada con mapa y ubicación.",
          en: "2-step reminder sequence (24h & 2h prior) scheduled with clinic map pin.",
        },
      },
    ],
  },
  {
    id: "lead-3",
    customerName: "Esteban Rivas",
    companyName: "SmartLog Logistics Fleet",
    channel: "web_form",
    channelLabel: "Next.js Webhook Capture",
    channelColor: "#55D8FF",
    dealValueUsd: 4200,
    intentScore: 98,
    responseSpeedSec: 12,
    currentStage: {
      es: "Ecosistema Integral · Decisor Directo",
      en: "Integral Ecosystem · Key Decision Maker",
    },
    summary: {
      es: "Requieren una plataforma web en Next.js con portal de clientes y tracking de envíos sincronizado con base PostgreSQL.",
      en: "Needs a custom Next.js web portal with shipment tracking synced to a PostgreSQL database.",
    },
    messages: [
      {
        id: "m-31",
        sender: "customer",
        text: {
          es: "Hola Mario, tenemos un software legacy en PHP que se cae constantemente. Queremos migrar el portal a Next.js y automatizar reportes para clientes.",
          en: "Hi Mario, we have a legacy PHP app that keeps crashing. We want to migrate to Next.js and automate client reporting.",
        },
        timestamp: "09:05 AM",
      },
      {
        id: "m-32",
        sender: "ai_agent",
        text: {
          es: "Hola Esteban. La migración a Server Components y Edge CDN reduce caídas al 0% y acelera consultas SQL a sub-100ms. ¿Cuántos usuarios concurrentes manejan?",
          en: "Hi Esteban. Moving to Server Components & Edge CDN drops downtime to 0% and cuts SQL latency to sub-100ms. How many concurrent users?",
        },
        timestamp: "09:05 AM",
      },
      {
        id: "m-33",
        sender: "customer",
        text: {
          es: "Aproximadamente 1,200 clientes corporativos por día consultando rutas.",
          en: "Around 1,200 corporate accounts per day tracking routes.",
        },
        timestamp: "09:07 AM",
      },
    ],
    availableActions: [
      {
        id: "send_proposal",
        label: {
          es: "Emitir Propuesta de Sprint de 3 Semanas",
          en: "Issue 3-Week Sprint Proposal",
        },
        actionFeedback: {
          es: "Especificación técnica de migración y presupuesto cerrado enviado directamente.",
          en: "Technical migration spec & fixed quote delivered directly.",
        },
      },
      {
        id: "book_calendar",
        label: {
          es: "Coordinar Video de Diagnóstico Técnico",
          en: "Schedule Technical Video Review",
        },
        actionFeedback: {
          es: "Enlace de Google Meet reservado con agenda de requerimientos arquitectónicos.",
          en: "Google Meet link reserved with technical architecture agenda.",
        },
      },
    ],
  },
];
