export interface TopologyNode {
  id: string;
  name: {
    es: string;
    en: string;
  };
  category: "ingestion" | "logic" | "action" | "crm";
  statusBadge: {
    es: string;
    en: string;
  };
  metricHighlight: string;
  payloadSummary: {
    es: string;
    en: string;
  };
}

export interface CaseTopologyBlueprint {
  projectSlug: string;
  accentColor: string;
  headline: {
    es: string;
    en: string;
  };
  nodes: TopologyNode[];
}

/**
 * Topología genérica (casos sin una propia). Describe etapas, no promete
 * cifras: `metricHighlight` es una etiqueta técnica, nunca una métrica.
 */
const DEFAULT_TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: "ingest",
    name: { es: "Captación en el sitio", en: "On-site capture" },
    category: "ingestion",
    statusBadge: { es: "Next.js", en: "Next.js" },
    metricHighlight: "Formulario",
    payloadSummary: {
      es: "El sitio recoge el pedido con los datos justos y los valida antes de enviarlos.",
      en: "The site collects the request with just the right fields and validates them before sending.",
    },
  },
  {
    id: "logic",
    name: { es: "Reglas del negocio", en: "Business rules" },
    category: "logic",
    statusBadge: { es: "Servidor", en: "Server" },
    metricHighlight: "Validación",
    payloadSummary: {
      es: "Las reglas del negocio deciden qué se acepta y a dónde va cada pedido.",
      en: "Business rules decide what is accepted and where each request goes.",
    },
  },
  {
    id: "action",
    name: { es: "Agenda o pedido", en: "Booking or order" },
    category: "action",
    statusBadge: { es: "Agenda", en: "Scheduling" },
    metricHighlight: "Confirmación",
    payloadSummary: {
      es: "El pedido se convierte en una cita o en una orden concreta.",
      en: "The request becomes a concrete appointment or order.",
    },
  },
  {
    id: "crm",
    name: { es: "Seguimiento", en: "Follow-up" },
    category: "crm",
    statusBadge: { es: "CRM", en: "CRM" },
    metricHighlight: "Historial",
    payloadSummary: {
      es: "El contacto queda registrado para el seguimiento del equipo.",
      en: "The contact is recorded for the team's follow-up.",
    },
  },
];

/**
 * Topologías por caso. Solo afirman lo que publica el caso (projectCases) o lo
 * verificado en su código o sitio (docs/films/dossiers). `metricHighlight` es
 * una etiqueta técnica, nunca una métrica: el test prohíbe cifras inventadas.
 */
export const CASE_TOPOLOGIES: Record<string, CaseTopologyBlueprint> = {
  "lb-elite-wash-detail": {
    projectSlug: "lb-elite-wash-detail",
    accentColor: "#B68CFF",
    // Fuente: projectCases (desafío, restricciones y decisiones del caso).
    headline: {
      es: "Pedido de detailing por tipo de vehículo, sin llamadas",
      en: "Detailing request by vehicle type, no phone calls",
    },
    nodes: [
      {
        id: "ingest",
        name: { es: "Servicio por tipo de vehículo", en: "Service by vehicle type" },
        category: "ingestion",
        statusBadge: { es: "Next.js · móvil", en: "Next.js · mobile" },
        metricHighlight: "Autos · botes · flotas",
        payloadSummary: {
          es: "El catálogo se recorre por tipo de vehículo: autos, botes, jet skis y flotas.",
          en: "The catalogue is browsed by vehicle type: cars, boats, jet skis and fleets.",
        },
      },
      {
        id: "logic",
        name: { es: "Precios claros", en: "Clear pricing" },
        category: "logic",
        statusBadge: { es: "Decisión rápida", en: "Quick decision" },
        metricHighlight: "Precio visible",
        payloadSummary: {
          es: "Cada servicio muestra su precio para decidir desde el teléfono.",
          en: "Each service shows its price so the decision can be made on the phone.",
        },
      },
      {
        id: "action",
        name: { es: "Pedido directo y breve", en: "Short, direct request" },
        category: "action",
        statusBadge: { es: "Sin llamadas", en: "No calls" },
        metricHighlight: "Pedido",
        payloadSummary: {
          es: "El contacto se reduce a un pedido corto con el vehículo y el servicio elegidos.",
          en: "Contact is reduced to one short request with the chosen vehicle and service.",
        },
      },
      {
        id: "crm",
        name: { es: "Marca de alta gama", en: "High-end brand" },
        category: "crm",
        statusBadge: { es: "Dirección visual", en: "Visual direction" },
        metricHighlight: "Premium",
        payloadSummary: {
          es: "La marca transmite un servicio premium en cada paso del pedido.",
          en: "The brand conveys a premium service at every step of the request.",
        },
      },
    ],
  },
  "new-brothers-barberia": {
    projectSlug: "new-brothers-barberia",
    accentColor: "#D4AF37",
    // Fuente: D:\Barberia (wizard de reserva, supabase/migrations/999_FULL_SETUP.sql).
    headline: {
      es: "Arquitectura de Reserva Autoservicio & CRM Propio",
      en: "Self-Service Booking & In-House CRM Architecture",
    },
    nodes: [
      {
        id: "ingest",
        name: { es: "Reserva Guiada en 6 Pasos", en: "Guided 6-Step Booking" },
        category: "ingestion",
        statusBadge: { es: "Next.js · Wizard móvil", en: "Next.js · Mobile wizard" },
        metricHighlight: "1 Decisión/Paso",
        payloadSummary: {
          es: "Sucursal, servicio, referencia del lookbook, barbero, fecha y hora, confirmar.",
          en: "Branch, service, lookbook reference, barber, date and time, confirm.",
        },
      },
      {
        id: "logic",
        name: { es: "Agenda sin Solapes", en: "No Double Booking" },
        category: "logic",
        statusBadge: { es: "PostgreSQL / Row Lock", en: "PostgreSQL / Row Lock" },
        metricHighlight: "book_appointment",
        payloadSummary: {
          es: "La función de reserva valida el turno con bloqueo de fila antes de confirmarlo.",
          en: "The booking function validates the slot with a row lock before confirming it.",
        },
      },
      {
        id: "action",
        name: { es: "Punto de Venta & Caja", en: "Point of Sale & Cash" },
        category: "action",
        statusBadge: { es: "POS · Cierre diario", en: "POS · Daily close" },
        metricHighlight: "close_cash_day",
        payloadSummary: {
          es: "Cobro en mostrador (efectivo, tarjeta, transferencia) y cierre de caja del día.",
          en: "Counter checkout (cash, card, transfer) and end-of-day cash close.",
        },
      },
      {
        id: "crm",
        name: { es: "CRM Propio & Liquidaciones", en: "In-House CRM & Payouts" },
        category: "crm",
        statusBadge: { es: "26 tablas · 4 roles", en: "26 tables · 4 roles" },
        metricHighlight: "Sin CRM externo",
        payloadSummary: {
          es: "Ficha de cliente con historial, liquidación de barberos y reactivación de inactivos.",
          en: "Client file with history, barber payouts and inactive-client reactivation.",
        },
      },
    ],
  },
  "ad-media-solution": {
    projectSlug: "ad-media-solution",
    accentColor: "#0066FF",
    // Fuente: projectCases (decisiones del caso) y docs/films/dossiers/otros-casos.md
    // (servicios y páginas del sitio). Sin métricas: no hay ninguna verificada.
    headline: {
      es: "Formularios, CRM y agenda en un mismo recorrido",
      en: "Forms, CRM and booking on a single journey",
    },
    nodes: [
      {
        id: "ingest",
        name: { es: "Servicios y casos", en: "Services and cases" },
        category: "ingestion",
        statusBadge: { es: "Next.js", en: "Next.js" },
        metricHighlight: "/servicios · /casos",
        payloadSummary: {
          es: "Cada servicio (CRM y automatización, pauta, redes y web) tiene su página y lleva al mismo recorrido.",
          en: "Each service (CRM and automation, paid media, social and web) has its own page and leads to the same journey.",
        },
      },
      {
        id: "logic",
        name: { es: "Formularios alineados", en: "Aligned forms" },
        category: "logic",
        statusBadge: { es: "Un solo recorrido", en: "One journey" },
        metricHighlight: "Formulario",
        payloadSummary: {
          es: "Los formularios del sitio responden a un mismo recorrido comercial, no a piezas sueltas.",
          en: "The site's forms follow one commercial journey instead of isolated pieces.",
        },
      },
      {
        id: "action",
        name: { es: "Agenda de reuniones", en: "Meeting scheduling" },
        category: "action",
        statusBadge: { es: "Agenda", en: "Scheduling" },
        metricHighlight: "/planificacion",
        payloadSummary: {
          es: "La página de planificación concentra la agenda de reuniones con la agencia.",
          en: "The planning page concentrates meeting scheduling with the agency.",
        },
      },
      {
        id: "crm",
        name: { es: "CRM y automatización", en: "CRM and automation" },
        category: "crm",
        statusBadge: { es: "GoHighLevel", en: "GoHighLevel" },
        metricHighlight: "Seguimiento",
        payloadSummary: {
          es: "El seguimiento vive en el CRM, el servicio central de la agencia.",
          en: "Follow-up lives in the CRM, the agency's core service.",
        },
      },
    ],
  },
};

export function getCaseTopology(slug: string, fallbackColor: string = "#71F3A2"): CaseTopologyBlueprint {
  if (CASE_TOPOLOGIES[slug]) {
    return CASE_TOPOLOGIES[slug];
  }
  return {
    projectSlug: slug,
    accentColor: fallbackColor,
    headline: {
      es: "Arquitectura Operativa & Topología del Sistema",
      en: "Operational Architecture & System Topology",
    },
    nodes: DEFAULT_TOPOLOGY_NODES,
  };
}
