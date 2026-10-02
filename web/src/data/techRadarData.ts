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
  format: "reel" | "youtube";
  durationLabel: { es: string; en: string };
  hook: { es: string; en: string };
  trapWarning: { es: string; en: string };
  coreArchitecture: { es: string; en: string };
  anchorPoints: { es: string[]; en: string[] };
  closingCta: { es: string; en: string };
}

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
  },
  {
    id: "crm-ghl-hubspot-supabase",
    category: "crm",
    badge: { es: "Arquitectura CRM", en: "CRM Architecture" },
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
  },
  {
    id: "voice-ai-telephony-sub300ms",
    category: "voice",
    badge: { es: "Telefonía de Voz IA", en: "Voice AI Telephony" },
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
    recommendedStack: ["Twilio SIP", "Cartesia / ElevenLabs", "FastAPI WebSockets", "Cal.com API"],
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
    recommendedModel: "Cartesia / ElevenLabs + Claude 3.5 Haiku",
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
];

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
