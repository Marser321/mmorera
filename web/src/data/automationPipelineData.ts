export type PipelineScenarioId =
  | "inbound_web_lead"
  | "stripe_checkout_success"
  | "anti_ghosting_revival";

export interface PipelineStageNode {
  id: string;
  stepNumber: number;
  title: { es: string; en: string };
  technology: string;
  httpStatus: number;
  latencyMs: number;
  summary: { es: string; en: string };
  logs: Array<{
    timestamp: string;
    level: "info" | "success" | "warn";
    message: { es: string; en: string };
  }>;
  payload: Record<string, unknown>;
}

export interface PipelineScenario {
  id: PipelineScenarioId;
  name: { es: string; en: string };
  triggerDescription: { es: string; en: string };
  badge: { es: string; en: string };
  totalDurationMs: number;
  manualDurationHours: number;
  conversionLiftPct: number;
  stages: PipelineStageNode[];
}

export const PIPELINE_SCENARIOS: PipelineScenario[] = [
  {
    id: "inbound_web_lead",
    name: {
      es: "Captación Web Next.js & Calificación IA",
      en: "Next.js Web Capture & AI Qualification",
    },
    triggerDescription: {
      es: "Prospecto envía brief en la web a las 23:45hs solicitando presupuesto.",
      en: "Prospect submits project brief on website at 11:45 PM asking for a quote.",
    },
    badge: { es: "Lead Calificado A+", en: "A+ Qualified Lead" },
    totalDurationMs: 460,
    manualDurationHours: 6.5,
    conversionLiftPct: 48,
    stages: [
      {
        id: "edge_ingest",
        stepNumber: 1,
        title: { es: "Edge Worker Ingesta", en: "Edge Worker Ingestion" },
        technology: "Next.js 16 Edge Route",
        httpStatus: 200,
        latencyMs: 18,
        summary: {
          es: "Validación de esquema Zod, sanitización XSS y firma HMAC de seguridad.",
          en: "Zod schema validation, XSS sanitization and HMAC security signature.",
        },
        logs: [
          {
            timestamp: "00:00.018",
            level: "success",
            message: {
              es: "POST /api/inbound-brief - 200 OK (18ms) vía Vercel Edge",
              en: "POST /api/inbound-brief - 200 OK (18ms) via Vercel Edge",
            },
          },
          {
            timestamp: "00:00.020",
            level: "info",
            message: {
              es: "Payload validado. Origen: Campaña B2B Ads.",
              en: "Payload validated. Source: B2B Ads Campaign.",
            },
          },
        ],
        payload: {
          event: "inbound_form_submit",
          source: "nextjs_form_hero",
          contact: {
            name: "Federico Benítez",
            company: "Apex Supply Chain",
            budget: "$4,500 - $8,000 USD",
            interest: "Next.js 16 + WhatsApp AI Pipeline",
          },
        },
      },
      {
        id: "dedup_router",
        stepNumber: 2,
        title: { es: "Enrutador & Anti-Duplicados", en: "Router & Deduplication" },
        technology: "Redis Upstash + n8n",
        httpStatus: 202,
        latencyMs: 38,
        summary: {
          es: "Comprobación de clave idempotente en caché Redis. 0 duplicados hallados.",
          en: "Idempotency key lookup in Redis cache. 0 duplicates found.",
        },
        logs: [
          {
            timestamp: "00:00.056",
            level: "info",
            message: {
              es: "Buscando idempotency_key: lead_apex_f71a en Redis.",
              en: "Looking up idempotency_key: lead_apex_f71a in Redis.",
            },
          },
          {
            timestamp: "00:00.058",
            level: "success",
            message: {
              es: "Lead único verificado. Despachando a clasificador neural.",
              en: "Unique lead verified. Routing to neural classifier.",
            },
          },
        ],
        payload: {
          idempotency_key: "lead_apex_f71a",
          duplicate: false,
          routing_destination: "ai_scoring_engine",
        },
      },
      {
        id: "ai_scoring",
        stepNumber: 3,
        title: { es: "Agente IA Clasificador", en: "AI Scoring Agent" },
        technology: "OpenAI GPT-4o / Claude 3.5",
        httpStatus: 200,
        latencyMs: 240,
        summary: {
          es: "Extracción de intenciones, asignación de score comercial y categorización A+.",
          en: "Intent extraction, commercial score assignment and A+ categorization.",
        },
        logs: [
          {
            timestamp: "00:00.298",
            level: "info",
            message: {
              es: "Invocando agente clasificador. Prompt tokens: 480.",
              en: "Invoking classification agent. Prompt tokens: 480.",
            },
          },
          {
            timestamp: "00:00.310",
            level: "success",
            message: {
              es: "Análisis completado: Score 96/100 · High Ticket B2B.",
              en: "Analysis complete: Score 96/100 · High Ticket B2B.",
            },
          },
        ],
        payload: {
          model: "gpt-4o-mini",
          fit_score: 96,
          classification: "A_PLUS_OPPORTUNITY",
          deal_value_estimate_usd: 6200,
          recommended_next_action: "priority_calendar_booking",
        },
      },
      {
        id: "crm_upsert",
        stepNumber: 4,
        title: { es: "Base CRM Unificada", en: "Unified CRM Upsert" },
        technology: "Supabase + PostgreSQL + GHL",
        httpStatus: 201,
        latencyMs: 72,
        summary: {
          es: "Creación de registro atómico en PostgreSQL con historial enriquecido y tags.",
          en: "Atomic record insertion in PostgreSQL with enriched history and tags.",
        },
        logs: [
          {
            timestamp: "00:00.382",
            level: "info",
            message: {
              es: "Ejecutando UPSERT en tabla leads_pipeline.",
              en: "Executing UPSERT on leads_pipeline table.",
            },
          },
          {
            timestamp: "00:00.390",
            level: "success",
            message: {
              es: "Registro #L-9281 creado con éxito. Pipeline 'Hot Leads'.",
              en: "Record #L-9281 created successfully. Pipeline 'Hot Leads'.",
            },
          },
        ],
        payload: {
          lead_id: "L-9281",
          crm_platform: "GoHighLevel / Supabase",
          pipeline_stage: "Discovery Scheduled Pending",
          tags: ["High-Fit-96", "NextJS-Inbound", "Sprint-Candidate"],
        },
      },
      {
        id: "instant_whatsapp",
        stepNumber: 5,
        title: { es: "Despacho WhatsApp & Calendario", en: "Instant WhatsApp & Calendar" },
        technology: "Meta Cloud API + Google Calendar",
        httpStatus: 200,
        latencyMs: 92,
        summary: {
          es: "Envío de plantilla interactiva por WhatsApp con botón de bloqueo de Google Meet.",
          en: "Interactive WhatsApp template dispatch with direct Google Meet booking button.",
        },
        logs: [
          {
            timestamp: "00:00.450",
            level: "info",
            message: {
              es: "Generando enlace personalizado con token único de reserva.",
              en: "Generating custom link with unique booking token.",
            },
          },
          {
            timestamp: "00:00.460",
            level: "success",
            message: {
              es: "WhatsApp entregado al prospecto en 460ms. Notificación en Slack enviada.",
              en: "WhatsApp delivered to prospect in 460ms. Slack notification sent.",
            },
          },
        ],
        payload: {
          provider: "whatsapp_cloud_api",
          delivery_status: "delivered",
          speed_to_lead_seconds: 0.46,
          slack_notification_sent: true,
        },
      },
    ],
  },
  {
    id: "stripe_checkout_success",
    name: {
      es: "Pago Stripe & Onboarding Automático",
      en: "Stripe Payment & Auto Onboarding",
    },
    triggerDescription: {
      es: "Cliente abona seña de sprint de $2,400 USD mediante tarjeta de crédito.",
      en: "Client pays $2,400 USD sprint deposit via credit card.",
    },
    badge: { es: "Pago $2,400 USD", en: "$2,400 USD Paid" },
    totalDurationMs: 510,
    manualDurationHours: 12.0,
    conversionLiftPct: 65,
    stages: [
      {
        id: "stripe_webhook",
        stepNumber: 1,
        title: { es: "Recepción de Webhook Stripe", en: "Stripe Webhook Ingestion" },
        technology: "Stripe API + Ed25519 Verify",
        httpStatus: 200,
        latencyMs: 24,
        summary: {
          es: "Verificación criptográfica de firma de evento checkout.session.completed.",
          en: "Cryptographic signature check on checkout.session.completed event.",
        },
        logs: [
          {
            timestamp: "00:00.024",
            level: "success",
            message: {
              es: "Evento checkout.session.completed verificado (200 OK)",
              en: "Event checkout.session.completed verified (200 OK)",
            },
          },
        ],
        payload: {
          event_type: "checkout.session.completed",
          amount_total_usd: 2400,
          customer_email: "ceo@novafinance.com",
        },
      },
      {
        id: "invoice_pdf",
        stepNumber: 2,
        title: { es: "Facturación Serverless", en: "Serverless Invoice PDF" },
        technology: "Edge Function + Resend",
        httpStatus: 201,
        latencyMs: 110,
        summary: {
          es: "Generación de recibo fiscal oficial con timbrado y envío por email en PDF.",
          en: "Official tax receipt generation and instant email delivery as PDF.",
        },
        logs: [
          {
            timestamp: "00:00.134",
            level: "success",
            message: {
              es: "Factura #INV-2026-088 generada y enviada a Resend API.",
              en: "Invoice #INV-2026-088 generated and dispatched to Resend API.",
            },
          },
        ],
        payload: {
          invoice_id: "INV-2026-088",
          tax_compliant: true,
          pdf_url: "https://cdn.mori.systems/invoices/inv-2026-088.pdf",
        },
      },
      {
        id: "workspace_provision",
        stepNumber: 3,
        title: { es: "Aprovisionamiento de Workspace", en: "Workspace Provisioning" },
        technology: "GitHub API + Supabase Auth",
        httpStatus: 201,
        latencyMs: 180,
        summary: {
          es: "Creación de repositorio privado de código y credenciales de acceso cliente.",
          en: "Private GitHub repo scaffolding and client access credentials created.",
        },
        logs: [
          {
            timestamp: "00:00.314",
            level: "success",
            message: {
              es: "Repositorio privado creado: org/novafinance-nextjs",
              en: "Private repository created: org/novafinance-nextjs",
            },
          },
        ],
        payload: {
          repo: "https://github.com/org/novafinance-nextjs",
          client_role: "maintainer",
        },
      },
      {
        id: "portal_sync",
        stepNumber: 4,
        title: { es: "Sincronización de Portal", en: "Client Portal Sync" },
        technology: "Supabase Realtime",
        httpStatus: 200,
        latencyMs: 86,
        summary: {
          es: "Habilitación de tablero de seguimiento de sprint con acceso a entregables.",
          en: "Sprint tracking dashboard activated with deliverables timeline.",
        },
        logs: [
          {
            timestamp: "00:00.400",
            level: "info",
            message: {
              es: "Permisos de tablero de sprint activados para ceo@novafinance.com",
              en: "Sprint dashboard permissions enabled for ceo@novafinance.com",
            },
          },
        ],
        payload: {
          dashboard_url: "https://portal.mori.systems/sprint-88",
          status: "active_in_development",
        },
      },
      {
        id: "whatsapp_welcome",
        stepNumber: 5,
        title: { es: "Bienvenida VIP por WhatsApp", en: "VIP WhatsApp Welcome" },
        technology: "WhatsApp Business API",
        httpStatus: 200,
        latencyMs: 110,
        summary: {
          es: "Mensaje directo con accesos al portal, fecha de kickoff y contacto 1 a 1.",
          en: "Direct message with portal link, kickoff call date, and 1-on-1 direct channel.",
        },
        logs: [
          {
            timestamp: "00:00.510",
            level: "success",
            message: {
              es: "Bienvenida VIP enviada al cliente. Kickoff reservado para mañana.",
              en: "VIP welcome sent to client. Kickoff call scheduled for tomorrow.",
            },
          },
        ],
        payload: {
          status: "delivered",
          kickoff_scheduled: true,
          channel: "dedicated_vip_thread",
        },
      },
    ],
  },
  {
    id: "anti_ghosting_revival",
    name: {
      es: "Activación Anti-Ghosting & Reactivación",
      en: "Anti-Ghosting Revival & Re-engagement",
    },
    triggerDescription: {
      es: "Lead calificado no responde tras 24hs de haber recibido propuesta comercial.",
      en: "Qualified lead doesn't respond after 24h of receiving proposal.",
    },
    badge: { es: "+34% Citas Salvadas", en: "+34% Rescued Calls" },
    totalDurationMs: 420,
    manualDurationHours: 48.0,
    conversionLiftPct: 34,
    stages: [
      {
        id: "crm_trigger",
        stepNumber: 1,
        title: { es: "Trigger de Inactividad 24h", en: "24h Inactivity Trigger" },
        technology: "PostgreSQL Cron / pg_cron",
        httpStatus: 200,
        latencyMs: 16,
        summary: {
          es: "Cron detecta lead en estado 'Propuesta Enviada' sin interacción en 24 horas.",
          en: "Cron identifies lead in 'Proposal Sent' stage with zero interactions for 24h.",
        },
        logs: [
          {
            timestamp: "00:00.016",
            level: "info",
            message: {
              es: "Escaneo horario ejecutado: 1 lead inactivo detectado.",
              en: "Hourly scan executed: 1 inactive lead detected.",
            },
          },
        ],
        payload: {
          lead_id: "L-8841",
          last_activity_hours_ago: 24.3,
          proposal_value_usd: 3500,
        },
      },
      {
        id: "context_enrichment",
        stepNumber: 2,
        title: { es: "Extracción de Contexto Previo", en: "Prior Context Extraction" },
        technology: "Supabase Vector / Embeddings",
        httpStatus: 200,
        latencyMs: 54,
        summary: {
          es: "Búsqueda del historial de objeciones y puntos de dolor tratados en la llamada.",
          en: "Retrieval of prior objections and pain points discussed during discovery call.",
        },
        logs: [
          {
            timestamp: "00:00.070",
            level: "success",
            message: {
              es: "Dolor identificado: Duda sobre tiempos de entrega en Next.js.",
              en: "Pain identified: Doubt regarding Next.js delivery timelines.",
            },
          },
        ],
        payload: {
          pain_point: "delivery_deadline_assurance",
          objection_category: "timing",
        },
      },
      {
        id: "ai_copy_generator",
        stepNumber: 3,
        title: { es: "Generador de Copy Contextual", en: "Contextual Copy Generator" },
        technology: "AI Agent Reasoning Engine",
        httpStatus: 200,
        latencyMs: 220,
        summary: {
          es: "Redacción de mensaje ultra-personalizado y no agresivo enfocado en su duda específica.",
          en: "Drafting of an ultra-personalized, non-pushy message addressing their exact concern.",
        },
        logs: [
          {
            timestamp: "00:00.290",
            level: "success",
            message: {
              es: "Mensaje generado sin sonar a spam corporativo.",
              en: "Message generated avoiding corporate spam tone.",
            },
          },
        ],
        payload: {
          drafted_message: "Hola Carlos, pensando en tu preocupación sobre el plazo de entrega...",
          tone: "direct_consultative",
        },
      },
      {
        id: "multi_channel_push",
        stepNumber: 4,
        title: { es: "Envío Multicanal Inteligente", en: "Smart Multichannel Push" },
        technology: "WhatsApp Business API",
        httpStatus: 202,
        latencyMs: 80,
        summary: {
          es: "Despacho por WhatsApp en la franja horaria de mayor apertura del lead.",
          en: "Dispatch via WhatsApp at the lead's historically highest open-rate window.",
        },
        logs: [
          {
            timestamp: "00:00.370",
            level: "info",
            message: {
              es: "Enviando mensaje de reactivación personalizado.",
              en: "Sending personalized re-engagement message.",
            },
          },
        ],
        payload: {
          delivery_channel: "whatsapp",
          time_window: "14:15hs (peak opening)",
        },
      },
      {
        id: "crm_stage_shift",
        stepNumber: 5,
        title: { es: "Reclasificación en Pipeline", en: "Pipeline Stage Shift" },
        technology: "CRM Webhook Sync",
        httpStatus: 200,
        latencyMs: 50,
        summary: {
          es: "Actualización a estado 'Reactivación en Curso' con alerta programada de respuesta.",
          en: "Updated to 'Active Re-engagement' stage with automated reply listener.",
        },
        logs: [
          {
            timestamp: "00:00.420",
            level: "success",
            message: {
              es: "CRM sincronizado. Tasa de recuperación estimada: +34%.",
              en: "CRM synchronized. Estimated recovery rate: +34%.",
            },
          },
        ],
        payload: {
          new_stage: "Re-engagement Active",
          resurrected: true,
        },
      },
    ],
  },
];

export function calculatePipelineEfficiency(scenarioId: PipelineScenarioId): {
  speedMultiplier: number;
  hoursSavedPerMonth: number;
  lostLeadsPreventedPct: number;
} {
  const scenario =
    PIPELINE_SCENARIOS.find((s) => s.id === scenarioId) ||
    PIPELINE_SCENARIOS[0];

  const durationSec = scenario.totalDurationMs / 1000;
  const manualDurationSec = scenario.manualDurationHours * 3600;
  const speedMultiplier = Math.round(manualDurationSec / Math.max(durationSec, 0.1));

  const hoursSavedPerMonth = Math.round(scenario.manualDurationHours * 24);
  const lostLeadsPreventedPct = scenario.conversionLiftPct;

  return {
    speedMultiplier,
    hoursSavedPerMonth,
    lostLeadsPreventedPct,
  };
}
