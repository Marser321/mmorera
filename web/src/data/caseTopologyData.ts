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

const DEFAULT_TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: "ingest",
    name: { es: "Captación Web Next.js 16", en: "Next.js 16 Web Capture" },
    category: "ingestion",
    statusBadge: { es: "Edge CDN · 95+ Score", en: "Edge CDN · 95+ Score" },
    metricHighlight: "0.4s FCP",
    payloadSummary: {
      es: "Captura de prospecto con validación Zod en Server Action sin plugins pesados.",
      en: "Lead capture with Zod validation in Server Action with zero bloated plugins.",
    },
  },
  {
    id: "logic",
    name: { es: "Motor de Reglas & Triaje", en: "Rules Engine & Triage" },
    category: "logic",
    statusBadge: { es: "Serverless Function", en: "Serverless Function" },
    metricHighlight: "< 120ms",
    payloadSummary: {
      es: "Clasificación de urgencia, cálculo de presupuesto y asignación automática.",
      en: "Urgency classification, quote calculation, and automated assignment.",
    },
  },
  {
    id: "action",
    name: { es: "Acción / Agenda / Cobro", en: "Action / Booking / Checkout" },
    category: "action",
    statusBadge: { es: "Sync en Tiempo Real", en: "Realtime Sync" },
    metricHighlight: "100% Trazable",
    payloadSummary: {
      es: "Confirmación instantánea de disponibilidad y bloqueo de horario sin solapamiento.",
      en: "Instant availability confirmation and slot lock with zero double-booking.",
    },
  },
  {
    id: "crm",
    name: { es: "WhatsApp & Sincronización CRM", en: "WhatsApp & CRM Sync" },
    category: "crm",
    statusBadge: { es: "Webhook Activo 24/7", en: "Active Webhook 24/7" },
    metricHighlight: "Sub-30s Dispatch",
    payloadSummary: {
      es: "Disparo de confirmación por WhatsApp Business API y actualización de pipeline.",
      en: "Confirmation dispatch via WhatsApp Business API and sales pipeline update.",
    },
  },
];

export const CASE_TOPOLOGIES: Record<string, CaseTopologyBlueprint> = {
  "lb-elite-wash-detail": {
    projectSlug: "lb-elite-wash-detail",
    accentColor: "#B68CFF",
    headline: {
      es: "Arquitectura del Flujo de Cotización Móvil & Asignación de Detailing",
      en: "Mobile Detailing Quote & Service Dispatch Architecture",
    },
    nodes: [
      {
        id: "ingest",
        name: { es: "Selector de Vehículo (Auto/Bote/Flota)", en: "Vehicle Type Selector (Car/Boat/Fleet)" },
        category: "ingestion",
        statusBadge: { es: "Next.js UI Móvil", en: "Mobile Next.js UI" },
        metricHighlight: "Sub-minuto",
        payloadSummary: {
          es: "El cliente elige tipo de vehículo y nivel de servicio con precios transparentes.",
          en: "Customer selects vehicle type and service tier with transparent pricing.",
        },
      },
      {
        id: "logic",
        name: { es: "Calculador Dinámico de Cotización", en: "Dynamic Quote Calculation Engine" },
        category: "logic",
        statusBadge: { es: "Algoritmo Serverless", en: "Serverless Algorithm" },
        metricHighlight: "-99% Espera",
        payloadSummary: {
          es: "Estimación matemática del costo según tamaño del vehículo y dirección del servicio.",
          en: "Mathematical cost estimation based on vehicle footprint and service location.",
        },
      },
      {
        id: "action",
        name: { es: "Bloqueo de Slot Móvil & Ruta", en: "Mobile Slot & Route Hold" },
        category: "action",
        statusBadge: { es: "Geocodificación", en: "Geocoding Sync" },
        metricHighlight: "Zero Fricción",
        payloadSummary: {
          es: "Asignación de móvil de detailing más cercano en el suroeste de Florida.",
          en: "Nearest mobile detailing unit dispatch across Southwest Florida.",
        },
      },
      {
        id: "crm",
        name: { es: "Confirmación Instantánea por WhatsApp", en: "Instant WhatsApp Confirmation" },
        category: "crm",
        statusBadge: { es: "WhatsApp Business API", en: "WhatsApp Business API" },
        metricHighlight: "24/7 Activo",
        payloadSummary: {
          es: "Envío de recordatorio y confirmación sin exigir llamadas telefónicas al cliente.",
          en: "Dispatch of reminder and service confirmation without requiring phone calls.",
        },
      },
    ],
  },
  "new-brothers-barberia": {
    projectSlug: "new-brothers-barberia",
    accentColor: "#55D8FF",
    headline: {
      es: "Arquitectura de Reserva Autoservicio & Cobro de Seña Automática",
      en: "Self-Service Booking & Deposit Payment Architecture",
    },
    nodes: [
      {
        id: "ingest",
        name: { es: "Selector de Barbero & Servicio", en: "Barber & Service Selector" },
        category: "ingestion",
        statusBadge: { es: "PWA Táctil Móvil", en: "Mobile Tactile PWA" },
        metricHighlight: "1 Decisión/Paso",
        payloadSummary: {
          es: "Selección fluida de corte, barba o combo con el profesional de preferencia.",
          en: "Frictionless selection of haircut, beard or combo with preferred barber.",
        },
      },
      {
        id: "logic",
        name: { es: "Lock de Disponibilidad en Tiempo Real", en: "Realtime Availability Lock" },
        category: "logic",
        statusBadge: { es: "PostgreSQL / Row Lock", en: "PostgreSQL / Row Lock" },
        metricHighlight: "0 Solapamientos",
        payloadSummary: {
          es: "Reserva temporal del turno por 10 minutos para evitar solapamientos simultáneos.",
          en: "10-minute temporary slot hold preventing concurrent double-booking.",
        },
      },
      {
        id: "action",
        name: { es: "Pasarela de Cobro de Seña (Stripe)", en: "Deposit Checkout (Stripe Webhook)" },
        category: "action",
        statusBadge: { es: "Stripe Webhook", en: "Stripe Webhook" },
        metricHighlight: "-90% No-Shows",
        payloadSummary: {
          es: "Confirmación del pago y emisión de comprobante digital al instante.",
          en: "Payment capture and instant digital receipt issuance.",
        },
      },
      {
        id: "crm",
        name: { es: "Recordatorio Automatizado WhatsApp", en: "Automated WhatsApp Reminder" },
        category: "crm",
        statusBadge: { es: "Cron Reminder 2h Antes", en: "2h Prior Cron Reminder" },
        metricHighlight: "98% Asistencia",
        payloadSummary: {
          es: "Mensaje 2 horas antes con ubicación y botón para re-agendar con anticipación.",
          en: "Message sent 2h prior with map link and advance rescheduling button.",
        },
      },
    ],
  },
  "ad-media-solution": {
    projectSlug: "ad-media-solution",
    accentColor: "#71F3A2",
    headline: {
      es: "Arquitectura del Circuito Comercial de Pauta a CRM",
      en: "Paid Media to CRM Commercial Pipeline Architecture",
    },
    nodes: [
      {
        id: "ingest",
        name: { es: "Ingesta de Pauta Meta & Google Ads", en: "Meta & Google Ads Campaign Ingest" },
        category: "ingestion",
        statusBadge: { es: "Next.js Edge Landing", en: "Next.js Edge Landing" },
        metricHighlight: "98 PageSpeed",
        payloadSummary: {
          es: "Landing page hiper-optimizada que captura datos de contacto en 3 campos clave.",
          en: "Hyper-optimized landing page capturing lead data in 3 key fields.",
        },
      },
      {
        id: "logic",
        name: { es: "Speed-to-Lead Webhook Router", en: "Speed-to-Lead Webhook Router" },
        category: "logic",
        statusBadge: { es: "Respuesta en < 30s", en: "Sub-30s Reply" },
        metricHighlight: "Sub-30 seg",
        payloadSummary: {
          es: "Enrutamiento inmediato del prospecto caliente hacia el asesor comercial disponible.",
          en: "Immediate routing of warm prospect to available commercial advisor.",
        },
      },
      {
        id: "action",
        name: { es: "Agendador de Llamada en Google Meet", en: "Google Meet Booking Scheduler" },
        category: "action",
        statusBadge: { es: "Calendar API Sync", en: "Calendar API Sync" },
        metricHighlight: "+65% Citas",
        payloadSummary: {
          es: "Sincronización bidireccional de calendario para evitar reuniones fantasma.",
          en: "Bi-directional calendar synchronization avoiding ghost meetings.",
        },
      },
      {
        id: "crm",
        name: { es: "Pipeline GoHighLevel / Supabase", en: "GoHighLevel / Supabase Pipeline" },
        category: "crm",
        statusBadge: { es: "Trazabilidad Total", en: "Total Traceability" },
        metricHighlight: "100% Auditable",
        payloadSummary: {
          es: "Trazabilidad completa desde el clic en el anuncio hasta el cierre del contrato.",
          en: "Full attribution from initial ad click to final signed contract.",
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
