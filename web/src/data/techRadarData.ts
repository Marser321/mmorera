export interface TechAlert {
  id: string;
  category: "whatsapp" | "llm" | "crm" | "voice";
  badge: { es: string; en: string };
  title: { es: string; en: string };
  date: string;
  impactScore: "critical" | "high" | "moderate";
  summary: { es: string; en: string };
  practicalRecommendation: { es: string; en: string };
  recommendedStack: string[];
  sourceName: string;
}

export interface ParallelCrawlerAgent {
  id: string;
  name: string;
  sourceTarget: string;
  status: "idle" | "scanning" | "synced";
  latencyMs: number;
  lastEvent: { es: string; en: string };
  category: "whatsapp" | "llm" | "crm" | "voice";
  payloadSizeKb: number;
}

export interface ModelUseCaseRecommendation {
  id: string;
  taskTitle: { es: string; en: string };
  recommendedModel: string;
  supportingTools: string[];
  latencyTarget: string;
  costEstimate10kOps: string;
  whyThisChoice: { es: string; en: string };
  whatToAvoid: { es: string; en: string };
}

export interface ContentBlueprint {
  id: string;
  topicTitle: { es: string; en: string };
  format: "reel" | "youtube" | "linkedin";
  durationLabel: { es: string; en: string };
  hook: { es: string; en: string };
  trapWarning: { es: string; en: string };
  coreArchitecture: { es: string; en: string };
  anchorPoints: { es: string[]; en: string[] };
  closingCta: { es: string; en: string };
}

export interface MultiModelArbitrageResult {
  monthlyOps: number;
  singleModelCost: number;
  singleModelLatencyMs: number;
  orchestratedCost: number;
  orchestratedLatencyMs: number;
  monthlySavingsUsd: number;
  savingsPercentage: number;
  breakdown: {
    triageGeminiOps: number;
    triageCost: number;
    ragDeepSeekOps: number;
    ragCost: number;
    logicClaudeOps: number;
    logicCost: number;
  };
}

export const PARALLEL_CRAWLER_AGENTS: ParallelCrawlerAgent[] = [
  {
    id: "crawler-meta",
    name: "Agent-Meta (WhatsApp API)",
    sourceTarget: "developers.facebook.com/docs/whatsapp/changelog",
    status: "synced",
    latencyMs: 142,
    lastEvent: {
      es: "Detectado: Facturación por mensaje de servicio (ventana de 24h cerrada) desde 01 Oct.",
      en: "Detected: Per-message billing for service tier (24h window restricted) effective Oct 1st.",
    },
    category: "whatsapp",
    payloadSizeKb: 14.8,
  },
  {
    id: "crawler-anthropic",
    name: "Agent-Anthropic (Claude Engineering)",
    sourceTarget: "docs.anthropic.com/en/release-notes/system-prompts",
    status: "synced",
    latencyMs: 168,
    lastEvent: {
      es: "Detectado: Claude 3.7 Sonnet con Extended Thinking & tokens de presupuesto adaptativo.",
      en: "Detected: Claude 3.7 Sonnet with Extended Thinking & adaptive reasoning budget.",
    },
    category: "llm",
    payloadSizeKb: 22.4,
  },
  {
    id: "crawler-deepseek",
    name: "Agent-OpenSource (DeepSeek & Modelos Chinos)",
    sourceTarget: "github.com/deepseek-ai/DeepSeek-V3/commits/main",
    status: "synced",
    latencyMs: 285,
    lastEvent: {
      es: "Detectado: DeepSeek R1/V3 destilado en Ollama. Inferencia local a costo de token nulo.",
      en: "Detected: DeepSeek R1/V3 distilled on Ollama. Local inference at zero marginal token cost.",
    },
    category: "llm",
    payloadSizeKb: 38.1,
  },
  {
    id: "crawler-crm",
    name: "Agent-CRM (GoHighLevel & HubSpot Specs)",
    sourceTarget: "highlevel.stoplight.io/docs/integrations/v2/changelog",
    status: "synced",
    latencyMs: 194,
    lastEvent: {
      es: "Detectado: Nuevos rate limits en endpoints v2 de contactos. Requiere webhooks asíncronos.",
      en: "Detected: New rate limits on v2 contact endpoints. Asynchronous queue webhooks required.",
    },
    category: "crm",
    payloadSizeKb: 17.5,
  },
  {
    id: "crawler-voice",
    name: "Agent-Voice (Cartesia & Twilio Media)",
    sourceTarget: "api.cartesia.ai/v1/voice/changelog",
    status: "synced",
    latencyMs: 122,
    lastEvent: {
      es: "Detectado: Modelo Sonic multilingüe sub-200ms TTFT sobre WebSockets bidireccionales.",
      en: "Detected: Sonic multilingual sub-200ms TTFT model running over full-duplex WebSockets.",
    },
    category: "voice",
    payloadSizeKb: 11.2,
  },
];

export const TECH_ALERTS: TechAlert[] = [
  {
    id: "whatsapp-pricing-october",
    category: "whatsapp",
    badge: { es: "Regulaciones Meta · 1 de Octubre", en: "Meta Policy · October 1" },
    title: {
      es: "WhatsApp API cobra mensajes de servicio: adiós a la ventana libre ilimitada",
      en: "WhatsApp API now bills service messages: end of unlimited free window",
    },
    date: "01 Oct 2026",
    impactScore: "critical",
    summary: {
      es: "Meta eliminó la gratuidad ilimitada dentro de la ventana de 24h. Ahora otorga 1,000 mensajes de servicio libres por mes y luego tarifa por mensaje unitario.",
      en: "Meta ended unlimited free service replies in the 24h window. Now granting 1,000 free service messages/mo per number, then billing per message delivered.",
    },
    practicalRecommendation: {
      es: "Implementar agentes de IA con buffers en Redis y respuestas compactas para no multiplicar mensajes innecesarios.",
      en: "Deploy AI agents with Redis debouncing buffers and compact replies to avoid inflating message counts.",
    },
    recommendedStack: ["WhatsApp Cloud API", "Redis Buffer", "Gemini 2.5 Flash", "Supabase"],
    sourceName: "Meta Graph API v21.0 Changelog",
  },
  {
    id: "multi-model-claude-gpt-deepseek",
    category: "llm",
    badge: { es: "Ecosistema IA · Multi-Modelo", en: "AI Ecosystem · Multi-Model" },
    title: {
      es: "¿Claude, GPT-4o, Gemini o DeepSeek? La trampa de casarse con una sola IA",
      en: "Claude, GPT-4o, Gemini or DeepSeek? The trap of single-model vendor lock-in",
    },
    date: "28 Sep 2026",
    impactScore: "high",
    summary: {
      es: "Ningún modelo gana en todo. Claude 3.7 domina en arquitectura y código; Gemini 2.5 Flash en latencia y costo para chats; DeepSeek R1 en razonamiento matemático a precio marginal.",
      en: "No single LLM wins across all vectors. Claude 3.7 rules architecture & code; Gemini 2.5 Flash dominates latency & cost for chats; DeepSeek R1 wins low-cost deep reasoning.",
    },
    practicalRecommendation: {
      es: "Orquestar un enrutador inteligente de prompts que delegue cada tarea al modelo óptimo según latencia y presupuesto.",
      en: "Architect a dynamic prompt router that delegates tasks to the optimal model based on latency, context and budget.",
    },
    recommendedStack: ["Claude 3.7 Sonnet", "Gemini 2.5 Flash", "OpenAI GPT-4o", "DeepSeek R1"],
    sourceName: "Anthropic & DeepSeek Official Technical Reports",
  },
  {
    id: "deepseek-chinese-llm-revolution",
    category: "llm",
    badge: { es: "Modelos Chinos · Inferencia Abierta", en: "Chinese LLMs · Open Inference" },
    title: {
      es: "DeepSeek R1 & V3: Cómo los modelos abiertos chinos rompieron el monopolio de Silicon Valley",
      en: "DeepSeek R1 & V3: How Chinese open-weight models broke Silicon Valley's monopoly",
    },
    date: "24 Sep 2026",
    impactScore: "critical",
    summary: {
      es: "Modelos como DeepSeek R1 y Qwen 2.5 igualan en razonamiento a modelos cerrados que cuestan 20 veces más. Procesan millones de tokens en RAG y extracción de bases de datos casi gratis.",
      en: "Models like DeepSeek R1 and Qwen 2.5 match reasoning benchmarks of closed models costing 20x more. Ingest millions of RAG tokens and database queries at near-zero costs.",
    },
    practicalRecommendation: {
      es: "Dejar de pagar APIs comerciales caras para resúmenes de documentos masivos; montar pipelines RAG con DeepSeek + pgvector.",
      en: "Stop overpaying commercial APIs for bulk document summarization; build RAG pipelines with DeepSeek + pgvector.",
    },
    recommendedStack: ["DeepSeek R1/V3", "pgvector (Postgres)", "Ollama / vLLM", "Next.js 16"],
    sourceName: "DeepSeek AI Research & Hugging Face",
  },
  {
    id: "crm-ghl-hubspot-supabase",
    category: "crm",
    badge: { es: "Arquitectura CRM · Soberanía de Datos", en: "CRM Architecture · Data Sovereignty" },
    title: {
      es: "GoHighLevel vs HubSpot vs Supabase: Dónde se traba tu negocio al escalar",
      en: "GoHighLevel vs HubSpot vs Supabase: Where business pipelines break at scale",
    },
    date: "15 Sep 2026",
    impactScore: "high",
    summary: {
      es: "GHL es ágil para agencias pero rígido para lógica compleja. HubSpot se vuelve astronómicamente caro. Supabase PostgreSQL da control 100% de datos con webhooks en tiempo real.",
      en: "GHL offers fast marketing out of the box but locks custom logic. HubSpot fees escalate exponentially. Supabase PostgreSQL delivers 100% data ownership and live webhooks.",
    },
    practicalRecommendation: {
      es: "Usar GHL o HubSpot como capa de captación, pero sincronizar toda la verdad de leads en Postgres propio con Row Level Security.",
      en: "Use GHL or HubSpot for intake, but store single-source-of-truth customer records in private Postgres with RLS.",
    },
    recommendedStack: ["Supabase PostgreSQL", "GoHighLevel API", "n8n Webhooks", "Prisma"],
    sourceName: "HubSpot API Pricing & GoHighLevel v2 Changelog",
  },
  {
    id: "voice-ai-telephony-sub300ms",
    category: "voice",
    badge: { es: "Telefonía de Voz IA · Baja Latencia", en: "Voice AI Telephony · Ultra-Low Latency" },
    title: {
      es: "Agentes telefónicos sub-300ms: La muerte del IVR robótico tradicional",
      en: "Sub-300ms telephony agents: The death of robotic IVR menu trees",
    },
    date: "05 Sep 2026",
    impactScore: "moderate",
    summary: {
      es: "La combinación de modelos de voz streaming con WebSockets bidireccionales permite interrumpir al bot naturalmente y agendar turnos en vivo.",
      en: "Streaming voice synthesis paired with full-duplex WebSockets enables natural interruptions and live calendar bookings.",
    },
    practicalRecommendation: {
      es: "Conectar telefonía Twilio con pipelines de audio streaming directamente al CRM sin esperas telefónicas.",
      en: "Bridge Twilio SIP trunking with low-latency audio streaming engines directly to CRM workflows.",
    },
    recommendedStack: ["Twilio SIP", "Cartesia Sonic", "FastAPI WebSockets", "Cal.com API"],
    sourceName: "Cartesia Audio Intelligence & Twilio Media Streams",
  },
];

export const MODEL_RECOMMENDATIONS: ModelUseCaseRecommendation[] = [
  {
    id: "live-chat-whatsapp",
    taskTitle: {
      es: "Atención al Cliente & Calificación en WhatsApp",
      en: "Live Customer Support & Qualification on WhatsApp",
    },
    recommendedModel: "Gemini 2.5 Flash / GPT-4o-mini",
    supportingTools: ["Redis Cache", "WhatsApp Cloud API", "Supabase Webhooks"],
    latencyTarget: "<400ms TTFT",
    costEstimate10kOps: "~$0.80 USD",
    whyThisChoice: {
      es: "Velocidad instantánea para que el usuario no sienta que habla con una máquina lenta, a un costo 15x menor que modelos pesados.",
      en: "Instant response so leads never feel a slow lag, at 15x lower token costs than frontier reasoning models.",
    },
    whatToAvoid: {
      es: "Evitar usar modelos de razonamiento profundo (como o1 o R1) en WhatsApp: demoran 8 a 15 segundos y aburren al prospecto.",
      en: "Never use slow reasoning models (like o1 or R1) on WhatsApp chats: 8-15s wait times cause severe lead drop-off.",
    },
  },
  {
    id: "code-architecture",
    taskTitle: {
      es: "Arquitectura de Software, Next.js & Refactor",
      en: "Software Architecture, Next.js & Code Refactoring",
    },
    recommendedModel: "Claude 3.7 Sonnet (Extended Thinking)",
    supportingTools: ["TypeScript Compiler", "Turbopack", "Biome / ESLint"],
    latencyTarget: "3s - 8s",
    costEstimate10kOps: "~$14.00 USD",
    whyThisChoice: {
      es: "La menor tasa de alucinación en tipos TypeScript y una comprensión inigualable de dependencias cruzadas y performance.",
      en: "Lowest hallucination rate in strict TypeScript types and unmatched mastery of cross-file module dependencies.",
    },
    whatToAvoid: {
      es: "Evitar modelos ligeros sin contexto largo para refactors: inventan APIs deprecadas y rompen el build.",
      en: "Avoid small fast models for complex architectural refactors: they hallucinate deprecated methods and fail builds.",
    },
  },
  {
    id: "massive-rag-extraction",
    taskTitle: {
      es: "Extracción Masiva de Documentos & Base de Conocimiento",
      en: "Massive Document Extraction & Knowledge Bases (RAG)",
    },
    recommendedModel: "DeepSeek V3 / R1 + pgvector",
    supportingTools: ["pgvector", "PostgreSQL", "Cohere Rerank"],
    latencyTarget: "1s - 2.5s",
    costEstimate10kOps: "~$0.40 USD",
    whyThisChoice: {
      es: "Costo por millón de tokens casi nulo para procesar miles de PDFs, contratos o transcripciones sin gastar miles de dólares.",
      en: "Near-zero cost per million tokens to ingest thousands of PDFs, invoices or transcripts with high precision.",
    },
    whatToAvoid: {
      es: "Evitar vectorizar texto crudo sin chunking semántico previo: genera respuestas imprecisas sin importar el modelo.",
      en: "Avoid embedding raw un-chunked documents: leads to vague answers regardless of LLM size.",
    },
  },
  {
    id: "voice-telephony",
    taskTitle: {
      es: "Telefonía de Voz Bidireccional en Tiempo Real",
      en: "Real-Time Full-Duplex Voice Telephony",
    },
    recommendedModel: "Cartesia Sonic + Claude 3.5 Haiku",
    supportingTools: ["Twilio Media Streams", "WebSockets", "Google Calendar API"],
    latencyTarget: "<320ms Audio Roundtrip",
    costEstimate10kOps: "~$12.50 USD",
    whyThisChoice: {
      es: "El oyente humano no tolera pausas mayores a 500ms en el teléfono. Esta combinación responde casi al instante.",
      en: "Human callers abandon calls if pause exceeds 500ms. This stack responds nearly instantaneously.",
    },
    whatToAvoid: {
      es: "Evitar llamadas HTTP REST síncronas durante la conversación de voz: siempre usar WebSockets persistentes.",
      en: "Never use synchronous HTTP REST calls mid-call: always maintain persistent full-duplex WebSockets.",
    },
  },
];

export const CONTENT_BLUEPRINTS: ContentBlueprint[] = [
  {
    id: "blueprint-whatsapp-pricing",
    topicTitle: {
      es: "WhatsApp API empezó a cobrar mensajes: cómo blindar tu negocio",
      en: "WhatsApp API started charging service messages: how to protect margins",
    },
    format: "reel",
    durationLabel: { es: "60 segundos (Reel / Short)", en: "60 seconds (Reel / Short)" },
    hook: {
      es: "\"Ayer Meta cambió las reglas de WhatsApp Business y si tu empresa usa automatizaciones, tu factura se puede multiplicar por cinco si no hacés esto ya mismo.\"",
      en: "\"Yesterday Meta changed the rules for WhatsApp Business API, and your monthly invoice could quintuple if you don't adjust this right now.\"",
    },
    trapWarning: {
      es: "El error de la gente: Dejar que el bot envíe 4 mensajes separados (\"Hola\", \"¿Cómo estás?\", \"En qué te ayudo?\") consumiendo 4 cargos en lugar de 1.",
      en: "The fatal mistake: Letting your bot send 4 separate messages (\"Hi\", \"How are you?\", \"How can I help?\") burning 4 billable messages instead of 1.",
    },
    coreArchitecture: {
      es: "Mostrar en pantalla: Diagrama con Redis debounce buffer de 4 segundos que consolida los mensajes antes de responder.",
      en: "Screen preview: Show a 4-second Redis debounce buffer diagram that merges lead inputs into a single atomic response.",
    },
    anchorPoints: {
      es: [
        "1. Explicar el cambio del 1 de Octubre (1,000 libres y luego cobro por mensaje).",
        "2. Demostrar el buffer de consolidación de mensajes en pantalla.",
        "3. Explicar cómo la IA debe responder conciso y con botones de selección rápida.",
      ],
      en: [
        "1. Explain the October 1st change (1,000 free, then bill per message).",
        "2. Demonstrate the message consolidation buffer on screen.",
        "3. Emphasize concise AI responses with quick-reply buttons.",
      ],
    },
    closingCta: {
      es: "\"Si tenés una empresa y querés auditar tu arquitectura de WhatsApp para no regalarle dinero a Meta, escribime por privado y lo revisamos en 15 minutos.\"",
      en: "\"If your business runs on WhatsApp and you want to audit your architecture to stop bleeding fees, message me and let's check it in 15 minutes.\"",
    },
  },
  {
    id: "blueprint-multi-model-strategy",
    topicTitle: {
      es: "¿Claude, ChatGPT o Gemini? La mentira de casarse con una sola IA",
      en: "Claude, ChatGPT or Gemini? The myth of marrying a single AI vendor",
    },
    format: "youtube",
    durationLabel: { es: "8 a 10 minutos (YouTube Técnico)", en: "8 to 10 minutes (Technical YouTube)" },
    hook: {
      es: "\"Me preguntan todos los días: 'Mario, ¿tú usas Claude o usas ChatGPT?'. La pregunta está mal formulada. Casarte con una sola IA es el error más costoso que podés cometer hoy.\"",
      en: "\"People ask me daily: 'Mario, do you use Claude or ChatGPT?'. That is the wrong question. Marrying a single AI is the most expensive mistake you can make.\"",
    },
    trapWarning: {
      es: "El error común: Tratar a las IAs como religiones en vez de herramientas de precisión. Cada modelo tiene una física de cómputo y costos radicalmente distinta.",
      en: "The common trap: Treating AI vendors as religions instead of precision surgical tools. Every LLM has radically different latency and token economics.",
    },
    coreArchitecture: {
      es: "Mostrar en pantalla: Código de un enrutador TypeScript con Next.js 16 que delega a Gemini para chat rápido, Claude para refactor y DeepSeek para extracción.",
      en: "Screen preview: Live TypeScript router in Next.js 16 delegating to Gemini for speed, Claude for refactors, and DeepSeek for extraction.",
    },
    anchorPoints: {
      es: [
        "1. Desarmar el mito: Comparar Claude 3.7 vs GPT-4o vs Gemini 2.5 con benchmarks reales.",
        "2. Mostrar la arquitectura del enrutador de prompts en código limpio.",
        "3. Caso de estudio real: Cómo bajamos costos 70% sin perder un gramo de calidad.",
      ],
      en: [
        "1. Debunk the myth: Compare Claude 3.7 vs GPT-4o vs Gemini 2.5 with live benchmarks.",
        "2. Walk through the TypeScript prompt router architecture.",
        "3. Real case study: How we slashed token costs by 70% while improving speed.",
      ],
    },
    closingCta: {
      es: "\"El código del enrutador está en el repositorio de mi sitio. Si querés que implementemos esta arquitectura en tu empresa, coordinemos por WhatsApp en el enlace de la descripción.\"",
      en: "\"The router code is live in my repository. If you want this multi-model architecture running in your enterprise, message me via WhatsApp in the description.\"",
    },
  },
  {
    id: "blueprint-crm-collapse",
    topicTitle: {
      es: "Por qué tu CRM en Notion o Excel colapsa a los 100 leads",
      en: "Why your Notion or spreadsheet CRM collapses past 100 leads",
    },
    format: "reel",
    durationLabel: { es: "60 segundos (Reel / Short)", en: "60 seconds (Reel / Short)" },
    hook: {
      es: "\"Notion y Google Sheets son increíbles para tomar notas, pero usarlos como CRM para tu empresa es una bomba de tiempo que te está haciendo perder clientes.\"",
      en: "\"Notion and Google Sheets are great for note-taking, but running your business CRM on them is a ticking time bomb leaking sales daily.\"",
    },
    trapWarning: {
      es: "El problema: No hay validación de tipos, dos personas pisan el mismo lead, y no podés conectar webhooks atómicos con WhatsApp o Stripe.",
      en: "The breakdown: Zero type safety, simultaneous write conflicts, and no atomic webhooks connected to WhatsApp or Stripe.",
    },
    coreArchitecture: {
      es: "Mostrar en pantalla: Supabase con PostgreSQL, tabla de leads con Row Level Security y triggers automáticos hacia WhatsApp.",
      en: "Screen preview: Supabase PostgreSQL lead table with Row Level Security and event triggers instantly dispatching to WhatsApp.",
    },
    anchorPoints: {
      es: [
        "1. Demostrar el momento exacto en que un Excel se corrompe con 3 vendedores.",
        "2. Mostrar la arquitectura Supabase con trazabilidad de 1 solo clic.",
        "3. Cómo una migración de 2 semanas devuelve el control absoluto a los dueños.",
      ],
      en: [
        "1. Show the exact moment a spreadsheet breaks with 3 simultaneous sales reps.",
        "2. Showcase the Supabase PostgreSQL setup with 1-click lead history.",
        "3. How a 2-week sprint restores full operational leverage to founders.",
      ],
    },
    closingCta: {
      es: "\"Si tu equipo pierde tiempo buscando chats dispersos y querés un CRM operativo en serio, entrá al cotizador en mi web y armemos tu arquitectura.\"",
      en: "\"If your team wastes hours hunting scattered chats and you need an operational CRM, check the scope studio on my site and let's build your stack.\"",
    },
  },
  {
    id: "blueprint-deepseek-breakdown",
    topicTitle: {
      es: "DeepSeek R1 y modelos chinos: Cómo ahorrar 90% en IA sin depender de OpenAI",
      en: "DeepSeek R1 and open models: How to cut AI bills by 90% without OpenAI lock-in",
    },
    format: "youtube",
    durationLabel: { es: "8 a 10 minutos (YouTube Técnico)", en: "8 to 10 minutes (Technical YouTube)" },
    hook: {
      es: "\"Si seguís pagándole a OpenAI $20 dólares por millón de tokens para extraer PDFs o clasificar leads, estás quemando el margen de tu agencia sin saberlo.\"",
      en: "\"If you are still paying OpenAI $20 per million tokens to parse PDFs or classify leads, you are burning your margin without realizing it.\"",
    },
    trapWarning: {
      es: "La confusión común: Creer que los modelos abiertos son difíciles de desplegar o inferiores en razonamiento.",
      en: "The common misconception: Believing open models are complex to deploy or inferior in mathematical reasoning.",
    },
    coreArchitecture: {
      es: "Mostrar en pantalla: Servidor Ollama / vLLM ejecutando DeepSeek R1 en local y conectado por API a un pipeline en Next.js 16.",
      en: "Screen preview: Local Ollama / vLLM server running DeepSeek R1 bridged via API to a Next.js 16 production pipeline.",
    },
    anchorPoints: {
      es: [
        "1. Benchmark de costos: OpenAI vs DeepSeek R1 en 100,000 ejecuciones.",
        "2. Arquitectura de despliegue: Cuándo usar la nube y cuándo inferencia local.",
        "3. La regla de oro: Gemini para chat rápido, Claude para código, DeepSeek para RAG.",
      ],
      en: [
        "1. Cost breakdown: OpenAI vs DeepSeek R1 across 100,000 real runs.",
        "2. Deployment topology: When to use cloud APIs vs on-premise local inference.",
        "3. The golden rule: Gemini for fast chats, Claude for code, DeepSeek for RAG.",
      ],
    },
    closingCta: {
      es: "\"En mi web tenés el calculador de arbitraje multi-modelo para ver cuánto ahorrás con tu volumen actual. Si querés implementarlo, tocá el botón de WhatsApp y lo revisamos.\"",
      en: "\"On my site you have the live multi-model arbitrage calculator to check your exact savings. Message me via WhatsApp to set this up.\"",
    },
  },
];

export function calculateMultiModelArbitrage(monthlyOps: number): MultiModelArbitrageResult {
  const safeOps = Math.max(1000, Math.min(monthlyOps, 1000000));

  // Single model naive (e.g. 100% GPT-4o at ~$0.025 per interaction)
  const singleModelUnitCost = 0.025;
  const singleModelCost = Math.round(safeOps * singleModelUnitCost);
  const singleModelLatencyMs = 2400;

  // Multi-model breakdown:
  // 65% triage & fast chat (Gemini 2.5 Flash at $0.0008 per op)
  const triageGeminiOps = Math.round(safeOps * 0.65);
  const triageCost = Math.round(triageGeminiOps * 0.0008);

  // 25% bulk RAG & knowledge extraction (DeepSeek R1/V3 at $0.0012 per op)
  const ragDeepSeekOps = Math.round(safeOps * 0.25);
  const ragCost = Math.round(ragDeepSeekOps * 0.0012);

  // 10% critical logic & architecture decisions (Claude 3.7 Sonnet at $0.015 per op)
  const logicClaudeOps = Math.round(safeOps * 0.1);
  const logicCost = Math.round(logicClaudeOps * 0.015);

  const orchestratedCost = Math.max(5, triageCost + ragCost + logicCost);
  const orchestratedLatencyMs = 340;

  const monthlySavingsUsd = Math.max(0, singleModelCost - orchestratedCost);
  const savingsPercentage = Math.round((monthlySavingsUsd / singleModelCost) * 100);

  return {
    monthlyOps: safeOps,
    singleModelCost,
    singleModelLatencyMs,
    orchestratedCost,
    orchestratedLatencyMs,
    monthlySavingsUsd,
    savingsPercentage,
    breakdown: {
      triageGeminiOps,
      triageCost,
      ragDeepSeekOps,
      ragCost,
      logicClaudeOps,
      logicCost,
    },
  };
}

export function generateCustomBlueprint(
  title: string,
  format: "reel" | "youtube" | "linkedin",
  language: "es" | "en" = "es"
): ContentBlueprint {
  const isEs = language === "es";

  if (format === "reel") {
    return {
      id: `custom-${Date.now()}`,
      topicTitle: { es: title, en: title },
      format: "reel",
      durationLabel: { es: "60 segundos (Reel / Short)", en: "60 seconds (Reel / Short)" },
      hook: {
        es: `"${title}: el error que le está costando miles de dólares a tu empresa en este momento."`,
        en: `"${title}: the exact mistake costing your business thousands right now."`,
      },
      trapWarning: {
        es: "El error común: Intentar resolverlo con herramientas desconectadas o parches temporales.",
        en: "The common trap: Attempting to fix this with disconnected tools or fragile band-aids.",
      },
      coreArchitecture: {
        es: "Mostrar en pantalla: La arquitectura en producción y el flujo de datos sin fricción.",
        en: "Screen preview: Show the production architecture and the friction-free data flow.",
      },
      anchorPoints: {
        es: [
          `1. Qué cambió exactamente en: ${title}`,
          "2. La solución en código y automatización en vivo.",
          "3. Cómo implementarlo en 1 solo sprint.",
        ],
        en: [
          `1. What exactly changed with: ${title}`,
          "2. The code and automation solution live.",
          "3. How to implement this in a single sprint.",
        ],
      },
      closingCta: {
        es: "\"Si querés que auditemos esto en tu empresa, enviame un mensaje al WhatsApp de mi perfil.\"",
        en: "\"If you want us to audit this in your business, message me via WhatsApp in my bio.\"",
      },
    };
  }

  if (format === "youtube") {
    return {
      id: `custom-${Date.now()}`,
      topicTitle: { es: title, en: title },
      format: "youtube",
      durationLabel: { es: "8 a 10 minutos (YouTube Técnico)", en: "8 to 10 minutes (Technical YouTube)" },
      hook: {
        es: `"${title}: Por qué la mayoría de agencias lo implementan mal y cómo lo resolvemos nosotros en producción."`,
        en: `"${title}: Why most agencies get this completely wrong and how we build it in production."`,
      },
      trapWarning: {
        es: "La trampa: Seguir recetas obsoletas de tutoriales sin contemplar costos de escala ni límites de API.",
        en: "The trap: Following outdated tutorials without modeling token economics or API rate limits.",
      },
      coreArchitecture: {
        es: "Mostrar en pantalla: Deep-dive técnico en el editor de código, base de datos y consola de observabilidad.",
        en: "Screen preview: Technical deep-dive across code editor, database schema and observability console.",
      },
      anchorPoints: {
        es: [
          "1. El problema real de fondo y por qué duele en la facturación.",
          "2. Walkthrough paso a paso del código y la arquitectura de datos.",
          "3. Resultados reales: latencia, ahorro en dólares y resiliencia.",
        ],
        en: [
          "1. The underlying root cause and its direct impact on monthly revenue.",
          "2. Step-by-step walkthrough of the code and data architecture.",
          "3. Real metrics: latency, dollar savings, and fault tolerance.",
        ],
      },
      closingCta: {
        es: "\"Tenés el enlace para agendar una sesión de arquitectura directamente en la descripción del video.\"",
        en: "\"You have the direct link to book an architecture session in the video description.\"",
      },
    };
  }

  return {
    id: `custom-${Date.now()}`,
    topicTitle: { es: title, en: title },
    format: "linkedin",
    durationLabel: { es: "Post B2B & Newsletter", en: "B2B Post & Newsletter" },
    hook: {
      es: `📌 Análisis Técnico: ${title}.`,
      en: `📌 Engineering Breakdown: ${title}.`,
    },
    trapWarning: {
      es: "La deuda técnica de las soluciones 'no-code' cuando el volumen supera las 1,000 operaciones/día.",
      en: "The technical debt of purely no-code setups once traffic exceeds 1,000 daily operations.",
    },
    coreArchitecture: {
      es: "Diagrama visual de la topología distribuida con Next.js 16 y PostgreSQL.",
      en: "Visual diagram of the distributed topology with Next.js 16 and PostgreSQL.",
    },
    anchorPoints: {
      es: [
        "1. Tesis: La fragmentación de herramientas destruye el margen comercial.",
        "2. Solución: Unificar captación, lógica de agentes y base de datos propia.",
        "3. Métrica: Reducción del 85% en tiempo de respuesta.",
      ],
      en: [
        "1. Thesis: Tool fragmentation destroys operating margins.",
        "2. Solution: Unify lead intake, agent logic and proprietary database.",
        "3. Metric: 85% reduction in customer response time.",
      ],
    },
    closingCta: {
      es: "¿Tu empresa sufre de esta fricción? Te leo en comentarios o coordinemos por mensaje privado.",
      en: "Is your company facing this friction? Let's discuss in the comments or direct message.",
    },
  };
}

export function generateFormattedBlueprintText(
  blueprint: ContentBlueprint,
  language: "es" | "en" = "es"
): string {
  const isEs = language === "es";
  const points = blueprint.anchorPoints[language].join("\n");

  return isEs
    ? `🎬 BLUEPRINT DE GRABACIÓN — MMORERA BACKSTAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 TEMA: ${blueprint.topicTitle.es}
⏱️ FORMATO: ${blueprint.durationLabel.es}

🎣 1. EL GANCHO (HOOK 0:00 - 0:05):
${blueprint.hook.es}

⚠️ 2. LA TRAMPA / EL ERROR COMÚN:
${blueprint.trapWarning.es}

🛠️ 3. ARQUITECTURA / QUÉ MOSTRAR EN PANTALLA:
${blueprint.coreArchitecture.es}

🎯 4. TRES PUNTOS DE ANCLAJE (ANTI-DISPERSIÓN):
${points}

🚀 5. CIERRE & CALL TO ACTION:
${blueprint.closingCta.es}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Grabá con naturalidad, mantené el ritmo y apoyate en los 3 puntos de anclaje.`
    : `🎬 RECORDING BLUEPRINT — MMORERA BACKSTAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 TOPIC: ${blueprint.topicTitle.en}
⏱️ FORMAT: ${blueprint.durationLabel.en}

🎣 1. THE HOOK (0:00 - 0:05):
${blueprint.hook.en}

⚠️ 2. THE COMMON TRAP / BREAKDOWN:
${blueprint.trapWarning.en}

🛠️ 3. ARCHITECTURE / SCREEN RECORDING:
${blueprint.coreArchitecture.en}

🎯 4. THREE ANCHOR POINTS (STAY ON TRACK):
${points}

🚀 5. CLOSING & CALL TO ACTION:
${blueprint.closingCta.en}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Speak naturally, keep energy high, and stick to the 3 anchor points.`;
}
