export interface SystemNodeData {
    id: string;
    title: { es: string; en: string };
    detail: { es: string; en: string };
    iconName: 'Inbox' | 'Cpu' | 'Database' | 'MessageSquare' | 'BarChart2' | 'Zap';
    httpStatus: number;
    initialLatency: number;
    tech: string;
    logs: Array<{ es: string; en: string; type: 'info' | 'success' | 'warn' | 'error' }>;
    payload: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const SYSTEMS_NODES: SystemNodeData[] = [
    {
        id: 'ingestion',
        title: { es: 'Captación de Leads', en: 'Lead Ingestion' },
        detail: { 
            es: 'Webhook receptor de envíos de formularios y APIs externas.',
            en: 'Receiver webhook for form submissions and external APIs.'
        },
        iconName: 'Inbox',
        httpStatus: 200,
        initialLatency: 14,
        tech: 'Endpoint de Ingesta',
        logs: [
            { es: 'POST /api/v1/inbound-leads - 200 OK', en: 'POST /api/v1/inbound-leads - 200 OK', type: 'success' },
            { es: 'Payload validado exitosamente. Origen: Campaña de Tráfico.', en: 'Payload validated successfully. Source: Traffic Campaign.', type: 'info' }
        ],
        payload: {
            event: "form_submit",
            timestamp: "2026-05-30T17:15:00Z",
            source: "traffic_campaign",
            lead: {
                name: "Esteban Quito",
                email: "esteban@example.com",
                company: "Quito Logistics Corp",
                budget: "$5,000 - $10,000",
                message: "Necesitamos automatizar nuestro CRM de ventas y notificaciones."
            }
        }
    },
    {
        id: 'router',
        title: { es: 'Orquestación de Reglas', en: 'Rules Dispatcher' },
        detail: {
            es: 'Enrutador lógico. Valida datos y bifurca el flujo operativo.',
            en: 'Logical router. Validates data and branches the operational flow.'
        },
        iconName: 'Cpu',
        httpStatus: 202,
        initialLatency: 48,
        tech: 'Motor de Flujos',
        logs: [
            { es: 'Workflow #382 disparado por evento Webhook.', en: 'Workflow #382 triggered by Webhook event.', type: 'info' },
            { es: 'Validando duplicados en base de datos... 0 registros encontrados.', en: 'Checking database duplicates... 0 records found.', type: 'success' },
            { es: 'Formateando payload para clasificación IA.', en: 'Formatting payload for AI classification.', type: 'info' }
        ],
        payload: {
            workflow_id: "lead_dispatch_v4",
            execution_id: "exec_9a2f38c71d",
            steps: [
                { name: "Webhook In", status: "completed" },
                { name: "Duplicate Check", status: "passed" },
                { name: "Format Schema", status: "completed" }
            ],
            target_engine: "ai_agent_qualifier"
        }
    },
    {
        id: 'ai_qualifier',
        title: { es: 'Clasificador de IA', en: 'AI Qualifier' },
        detail: {
            es: 'Agente de IA que evalúa intenciones y asigna score de negocio.',
            en: 'AI agent that evaluates intent and assigns business lead score.'
        },
        iconName: 'Zap',
        httpStatus: 200,
        initialLatency: 540,
        tech: 'Modelo de Lenguaje (LLM)',
        logs: [
            { es: 'Invocando agente clasificador de intenciones...', en: 'Invoking intent classifier agent...', type: 'info' },
            { es: 'Prompt tokens: 1,240 | Completion tokens: 180', en: 'Prompt tokens: 1,240 | Completion tokens: 180', type: 'info' },
            { es: 'Clasificación completa. Score: 94/100 (HIGH FIT).', en: 'Classification complete. Score: 94/100 (HIGH FIT).', type: 'success' }
        ],
        payload: {
            model: "custom-agent-llm",
            tokens_used: 1420,
            analysis: {
                fit_score: 94,
                intent: "high_purchase_intent",
                summary_es: "Interés explícito en automatización B2B. Presupuesto calificado.",
                summary_en: "Explicit interest in B2B automation. Qualified budget.",
                action_required: "instant_scheduling"
            }
        }
    },
    {
        id: 'crm_sync',
        title: { es: 'Sincronización CRM', en: 'CRM Synchronization' },
        detail: {
            es: 'Inserción del lead enriquecido en el CRM de la empresa.',
            en: 'Insertion of enriched lead into the business CRM.'
        },
        iconName: 'Database',
        httpStatus: 201,
        initialLatency: 92,
        tech: 'Integración de CRM API',
        logs: [
            { es: 'Buscando contacto en base de CRM por email...', en: 'Searching CRM contact by email...', type: 'info' },
            { es: 'Creando nuevo contacto en pipeline de Oportunidades.', en: 'Creating new contact in Opportunities pipeline.', type: 'info' },
            { es: 'Contacto ID: contact_8d3a1f90b2 creado exitosamente.', en: 'Contact ID: contact_8d3a1f90b2 created successfully.', type: 'success' }
        ],
        payload: {
            crm: "custom_crm",
            action: "create_contact",
            contact_id: "ct_8d3a1f90b2",
            pipeline: "Sales Funnel v1",
            stage: "AI Qualified Leads",
            tags: ["AI-Scored-94", "Campaign-Inbound"]
        }
    },
    {
        id: 'whatsapp_alert',
        title: { es: 'Alerta de Mensajería', en: 'Messaging Alert' },
        detail: {
            es: 'Envío instantáneo de plantilla conversacional de agendamiento.',
            en: 'Instant dispatch of conversational scheduling template.'
        },
        iconName: 'MessageSquare',
        httpStatus: 202,
        initialLatency: 110,
        tech: 'Proveedor de Mensajería',
        logs: [
            { es: 'Generando link de agendamiento dinámico (Calendario).', en: 'Generating dynamic scheduling link (Calendar).', type: 'info' },
            { es: 'Enviando mensaje a +54 9 11 ...', en: 'Sending message to +54 9 11 ...', type: 'info' },
            { es: 'Mensaje despachado con éxito. Estado: Entregado.', en: 'Message dispatched successfully. Status: Delivered.', type: 'success' }
        ],
        payload: {
            provider: "whatsapp_gateway",
            recipient: "+54911xxxxxxx",
            template_name: "lead_followup_instant",
            variables: {
                first_name: "Esteban",
                calendar_url: "https://calendar.business/chat-calificado"
            },
            status: "delivered"
        }
    },
    {
        id: 'analytics_roi',
        title: { es: 'Métricas & ROI', en: 'Metrics & ROI' },
        detail: {
            es: 'Atribución de pauta publicitaria y refresco del dashboard.',
            en: 'Ad spend attribution and real-time dashboard refresh.'
        },
        iconName: 'BarChart2',
        httpStatus: 200,
        initialLatency: 22,
        tech: 'Base de Datos Realtime',
        logs: [
            { es: 'Incrementando contador de leads por origen (Campaña).', en: 'Incrementing lead counter by source (Campaign).', type: 'info' },
            { es: 'Actualizando tasa de conversión del embudo operativo.', en: 'Updating funnel conversion rate.', type: 'info' },
            { es: 'Métricas recalculadas. ROI actualizado: +324%.', en: 'Metrics recalculated. Updated ROI: +324%.', type: 'success' }
        ],
        payload: {
            stats: {
                total_leads_today: 47,
                campaign_conversion_rate: "4.82%",
                average_ai_score: 82,
                computed_roi_multiplier: 3.24
            },
            database: "realtime_db",
            cache_status: "invalidated_and_refreshed"
        }
    }
];
