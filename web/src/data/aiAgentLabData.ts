export interface AgentScenario {
  id: string;
  title: { es: string; en: string };
  badge: { es: string; en: string };
  userMessage: { es: string; en: string };
  agentReply: { es: string; en: string };
  extractedEntities: {
    intent: string;
    budget: string;
    urgency: string;
    decisionMaker: string;
  };
  webhookPayload: {
    event: string;
    targetService: string;
    contact: {
      tags: string[];
      pipelineStage: string;
      leadScore: number;
    };
    action: string;
  };
}

export interface AgentTypeConfig {
  id: "qualifier" | "scheduler" | "reactivator";
  name: { es: string; en: string };
  tagline: { es: string; en: string };
  avatarIcon: string;
  accentColor: string;
  scenarios: AgentScenario[];
}

export const AI_AGENT_PRESETS: AgentTypeConfig[] = [
  {
    id: "qualifier",
    name: { es: "Agente de Calificación & Triaje", en: "Lead Qualification & Triage Agent" },
    tagline: {
      es: "Filtra prospectos en < 30 seg, valida presupuesto y descarta curiosos sin gastar tiempo de tu equipo.",
      en: "Filters prospects in < 30s, validates budget and weeds out tire-kickers without wasting team time.",
    },
    avatarIcon: "Bot",
    accentColor: "#71F3A2",
    scenarios: [
      {
        id: "high-ticket",
        title: { es: "Lead Alta Prioridad (Presupuesto Confirmado)", en: "High-Priority Lead (Budget Confirmed)" },
        badge: { es: "Score: 98/100", en: "Score: 98/100" },
        userMessage: {
          es: "Hola, tenemos una empresa de servicios con 12 personas y queremos automatizar el CRM y WhatsApp porque perdemos clientes por demoras. Tenemos presupuesto disponible de $2,000 USD.",
          en: "Hi, we are a 12-person service company looking to automate our CRM and WhatsApp because we lose clients to delays. We have a budget of $2,000 USD.",
        },
        agentReply: {
          es: "¡Hola! Excelente momento para resolverlo. Con ese equipo y volumen, el retorno es inmediato. Ya clasifiqué tu cuenta como Prioritaria. ¿Podrías confirmarme si actualmente usan GoHighLevel, HubSpot o planillas?",
          en: "Hello! Perfect time to fix this. With your team size and volume, ROI is immediate. I have flagged your account as Priority. Could you confirm if you currently run GoHighLevel, HubSpot or spreadsheets?",
        },
        extractedEntities: {
          intent: "Automatización Integral CRM + WhatsApp",
          budget: "$2,000 USD (Aprobado)",
          urgency: "Inmediata (Pérdida activa de clientes)",
          decisionMaker: "Titular / Director de Operaciones",
        },
        webhookPayload: {
          event: "lead.qualified.high_priority",
          targetService: "GoHighLevel CRM API v2",
          contact: {
            tags: ["Lead_Calificado_Apto", "Presupuesto_Validado_2k", "Equipo_12p"],
            pipelineStage: "Oportunidad Calificada para Demo",
            leadScore: 98,
          },
          action: "Notificación prioritaria en Slack del Director + Asignación de Broker",
        },
      },
      {
        id: "curious-unqualified",
        title: { es: "Lead Exploratorio (Derivación Inteligente)", en: "Exploratory Lead (Smart Routing)" },
        badge: { es: "Score: 45/100", en: "Score: 45/100" },
        userMessage: {
          es: "Buenas, quería saber si tienen cursos gratis o herramientas sin costo para aprender.",
          en: "Hi, I wanted to check if you offer free courses or zero-cost tools to learn.",
        },
        agentReply: {
          es: "¡Hola! No brindamos cursos individuales; implementamos infraestructura a medida para empresas en producción. Te comparto nuestro caso de estudio abierto para que veas la arquitectura.",
          en: "Hello! We don't offer general courses; we deploy custom production software for businesses. Here is our open case study to inspect the architecture.",
        },
        extractedEntities: {
          intent: "Educación / Sin intención comercial inmediata",
          budget: "$0 (No califica para sprint)",
          urgency: "Baja",
          decisionMaker: "Estudiante / Particular",
        },
        webhookPayload: {
          event: "lead.routed.nurturing",
          targetService: "PostgreSQL Database",
          contact: {
            tags: ["Lead_Informativo", "Sin_Presupuesto_Comercial"],
            pipelineStage: "Nurturing / Contenido Abierto",
            leadScore: 45,
          },
          action: "Envío automático de guía técnica sin interrumpir al equipo",
        },
      },
    ],
  },
  {
    id: "scheduler",
    name: { es: "Agente de Agenda & Calendario", en: "Smart Scheduling & Booking Agent" },
    tagline: {
      es: "Coordina horarios en lenguaje natural, resuelve zonas horarias y bloquea Google Calendar sin links fríos.",
      en: "Negotiates slots in natural language, handles timezones and locks Google Calendar without cold links.",
    },
    avatarIcon: "Calendar",
    accentColor: "#55D8FF",
    scenarios: [
      {
        id: "booking-slot",
        title: { es: "Negociación de Horario Flexible", en: "Flexible Slot Negotiation" },
        badge: { es: "Cierre en 2 mensajes", en: "Closed in 2 msgs" },
        userMessage: {
          es: "Me sirve reunirnos este jueves o viernes por la tarde, después de las 16:00 hora de Buenos Aires.",
          en: "I can meet this Thursday or Friday afternoon, after 4:00 PM Buenos Aires time.",
        },
        agentReply: {
          es: "Perfecto. Te reservo el viernes a las 16:30 (hora de Buenos Aires). Acabo de generar la sala de Google Meet y enviarte la invitación a tu calendario.",
          en: "Perfect. I booked you for Friday at 4:30 PM (Buenos Aires time). I generated the Google Meet room and sent the invite to your calendar.",
        },
        extractedEntities: {
          intent: "Agendamiento de Llamada de Estrategia",
          budget: "Pre-validado",
          urgency: "Esta semana",
          decisionMaker: "Titular Confirmado",
        },
        webhookPayload: {
          event: "calendar.meeting.booked",
          targetService: "Google Calendar API + GHL Appointments",
          contact: {
            tags: ["Cita_Agendada", "Recordatorio_Activo"],
            pipelineStage: "Reunión Programada",
            leadScore: 92,
          },
          action: "Meet creado + Secuencia WhatsApp anti no-show programada para -2h",
        },
      },
    ],
  },
  {
    id: "reactivator",
    name: { es: "Agente de Re-activación & Anti-Ghosting", en: "Reactivation & Anti-Ghosting Agent" },
    tagline: {
      es: "Recupera propuestas enviadas hace semanas con contexto específico en vez de mensajes genéricos.",
      en: "Revives proposals sent weeks ago with personalized context instead of generic follow-up spam.",
    },
    avatarIcon: "Zap",
    accentColor: "#B68CFF",
    scenarios: [
      {
        id: "cold-proposal",
        title: { es: "Propuesta sin Respuesta (14 días)", en: "Unanswered Proposal (14 days)" },
        badge: { es: "Recuperación: 38%", en: "Recovery: 38%" },
        userMessage: {
          es: "Perdón la demora Mario, estuvimos con auditorías internas y recién podemos retomar el tema.",
          en: "Sorry for the delay Mario, we were busy with internal audits and can now get back to this.",
        },
        agentReply: {
          es: "¡Cero problema! Es entendible. La arquitectura técnica que diseñamos sigue 100% vigente. ¿Querés que revisemos los dos puntos clave en una llamada de 10 min mañana?",
          en: "No problem at all! Completely understandable. The architecture we drafted is 100% ready. Should we review the two key points on a 10-min call tomorrow?",
        },
        extractedEntities: {
          intent: "Reactivación de Negociación",
          budget: "Propuesta aprobada en revisión técnica",
          urgency: "Reanudada",
          decisionMaker: "Gerente de Tecnología",
        },
        webhookPayload: {
          event: "deal.reactivated.followup_success",
          targetService: "GoHighLevel Opportunities",
          contact: {
            tags: ["Lead_Reactivado", "Propuesta_En_Reanudacion"],
            pipelineStage: "Negociación Activa",
            leadScore: 88,
          },
          action: "Alerta en móvil del fundador + Tarea de seguimiento asignada",
        },
      },
    ],
  },
];
