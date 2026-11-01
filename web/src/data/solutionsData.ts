import type { LocalizedText } from "@/types/site";

const t = (es: string, en: string): LocalizedText => ({ es, en });

export interface ServiceSolution {
  id: string;
  tag: LocalizedText;
  title: LocalizedText;
  headline: LocalizedText;
  description: LocalizedText;
  deliverables: LocalizedText[];
  idealFor: LocalizedText;
  accent: string;
  /** Caso real que demuestra el servicio (slug de PROJECT_CASES). */
  proofSlug: string;
}

export const SERVICE_SOLUTIONS: ServiceSolution[] = [
  {
    id: "web-ecommerce",
    tag: t("Presencia", "Web presence"),
    title: t("Webs y landings", "Websites & landings"),
    headline: t("Sitios rápidos y claros, pensados para que la persona entienda y te escriba.", "Fast, clear sites built so people understand you and get in touch."),
    description: t(
      "Desarrollo a medida con Next.js, TypeScript y Tailwind: diseño propio, versión bilingüe y SEO técnico cuidado. Lo diseño y lo programo yo.",
      "Custom development with Next.js, TypeScript and Tailwind: original design, bilingual versions and careful technical SEO. I design it and I build it."
    ),
    deliverables: [
      t("Diseño a medida, sin plantillas genéricas", "Custom design, no generic templates"),
      t("Catálogo o CMS para que actualices el contenido", "Catalog or CMS so you can update the content"),
      t("Versión bilingüe y adaptada al teléfono", "Bilingual and built for the phone"),
    ],
    idealFor: t(
      "Negocios que reciben consultas y pierden ventas porque su web no explica lo que hacen.",
      "Businesses that get enquiries but lose sales because their site doesn't explain what they do."
    ),
    accent: "#55D8FF",
    proofSlug: "lb-elite-wash-detail",
  },
  {
    id: "booking-payments",
    tag: t("Agentes de IA", "AI agents"),
    title: t("Agentes de IA instalados para tu negocio", "AI agents installed for your business"),
    headline: t("Un agente que atiende, responde y agenda por ti, con una persona cuando hace falta.", "An agent that answers, replies and books for you, with a person when it matters."),
    description: t(
      "Instalo y configuro agentes con Claude, GPT u OpenClaw conectados a WhatsApp, a tu web o a tu agenda. Las cuentas quedan a tu nombre, con documentación y traspaso a tu equipo cuando el agente no puede resolver.",
      "I install and configure agents built on Claude, GPT or OpenClaw, connected to WhatsApp, your website or your calendar. Accounts stay in your name, with documentation and a handoff to your team when the agent can't resolve something."
    ),
    deliverables: [
      t("Respuestas desde tus datos, que puedes editar sin programar", "Answers from your own data, editable without code"),
      t("Traspaso a una persona cuando hace falta", "Handoff to a person when needed"),
      t("Cuentas a tu nombre y documentación de entrega", "Accounts in your name and handoff documentation"),
    ],
    idealFor: t(
      "Negocios de servicios y equipos sin personal técnico que quieren delegar la atención repetitiva.",
      "Service businesses and teams without technical staff who want to delegate repetitive support."
    ),
    accent: "#71F3A2",
    proofSlug: "new-brothers-barberia",
  },
  {
    id: "crm-automation",
    tag: t("Procesos conectados", "Connected workflows"),
    title: t("Automatización y CRM", "Automation & CRM"),
    headline: t("Formularios, agenda y CRM conectados, para que ninguna consulta quede sin seguimiento.", "Forms, calendar and CRM connected, so no enquiry goes without follow-up."),
    description: t(
      "Flujos con n8n, Make o GoHighLevel según tu proceso: cada consulta entra al CRM, se avisa a quien corresponde y el seguimiento sale solo. Para flujos livianos, también construyo herramientas a medida.",
      "Workflows with n8n, Make or GoHighLevel shaped around your process: every enquiry lands in the CRM, the right person is notified and follow-up goes out on its own. For lighter flows, I also build custom tools."
    ),
    deliverables: [
      t("Seguimiento automático de cada consulta", "Automatic follow-up on every enquiry"),
      t("Pipeline para ver en qué etapa está cada cliente", "A pipeline showing each client's stage"),
      t("Reservas y agenda conectadas al CRM", "Bookings and calendar connected to the CRM"),
    ],
    idealFor: t(
      "Negocios que reciben consultas por varios canales y necesitan ordenarlas.",
      "Businesses receiving enquiries across several channels that need to keep them in order."
    ),
    accent: "#B68CFF",
    proofSlug: "rangel-oviedo-group",
  },
  {
    id: "ai-software",
    tag: t("Fábricas de contenido", "Content factories"),
    title: t("Fábricas de contenido con IA", "AI content factories"),
    headline: t("Sistemas que producen piezas y videos para tu marca, con tu criterio en cada entrega.", "Systems that produce posts and videos for your brand, with your judgment in every delivery."),
    description: t(
      "Conecto modelos de lenguaje, generación de imagen y video y edición por código en un flujo que convierte un brief en posts, carruseles y reels. Una persona revisa cada pieza antes de publicarla.",
      "I connect language models, image and video generation and code-based editing into a flow that turns a brief into posts, carousels and reels. A person reviews every piece before it's published."
    ),
    deliverables: [
      t("Guiones, carruseles y piezas de video a partir de un brief", "Scripts, carousels and video pieces from a single brief"),
      t("Plantillas de diseño y video consistentes", "Consistent design and video templates"),
      t("Revisión humana antes de publicar", "Human review before publishing"),
    ],
    idealFor: t(
      "Marcas y equipos de marketing que necesitan constancia sin perder calidad.",
      "Brands and marketing teams that need consistency without losing quality."
    ),
    accent: "#E59500",
    proofSlug: "ad-media-solution",
  },
];

export interface DecisionTopic {
  id: string;
  category: LocalizedText;
  question: LocalizedText;
  summary: LocalizedText;
  options: {
    title: LocalizedText;
    subtitle: LocalizedText;
    pros: LocalizedText[];
    whenToChoose: LocalizedText;
    recommendedFor: LocalizedText;
    badge: LocalizedText;
  }[];
  expertInsight: LocalizedText;
}

export const DECISION_TOPICS: DecisionTopic[] = [
  {
    id: "crm-choice",
    category: t("Sistemas Comerciales", "Commercial Systems"),
    question: t("¿Necesitas un CRM gigante como HubSpot/GoHighLevel o una herramienta a medida?", "Do you need a heavy CRM like HubSpot/GoHighLevel or a custom-built tool?"),
    summary: t(
      "Muchos negocios pagan cientos de dólares al mes en herramientas que su equipo termina abandonando por complejas. La elección correcta depende de tu volumen y cómo vendés.",
      "Many businesses pay hundreds monthly for complex software their teams end up abandoning. The right choice depends on your volume and sales process."
    ),
    options: [
      {
        title: t("Herramienta Liviana a Medida", "Custom Lightweight System"),
        subtitle: t("Cero suscripciones caras. Hecho exactamente para tu flujo.", "Zero bloated subscriptions. Built specifically for your workflow."),
        pros: [
          t("Cero cuotas mensuales de licencias por usuario", "Zero monthly per-user licensing fees"),
          t("Fácil de aprender: solo lo que tu negocio necesita", "Easy to learn: only what your business actually needs"),
          t("Conectado directamente a tu WhatsApp, web y base de datos", "Directly linked to your WhatsApp, web, and database"),
          t("Carga instantánea y máxima agilidad en el celular", "Instant load and maximum speed on mobile"),
        ],
        whenToChoose: t(
          "Cuando tu proceso es directo: captar, enviar presupuesto, confirmar por WhatsApp y cobrar.",
          "When your flow is direct: capture, quote, confirm on WhatsApp, and collect payment."
        ),
        recommendedFor: t("Negocios locales, clínicas, detailing, firmas profesionales y estudios.", "Local businesses, clinics, detailing, professional firms, and studios."),
        badge: t("Máxima Eficiencia / Cero Hype", "Maximum Efficiency / Zero Hype"),
      },
      {
        title: t("Plataforma Robusta (GoHighLevel / HubSpot)", "Robust Platform (GoHighLevel / HubSpot)"),
        subtitle: t("Potencia para equipos comerciales con múltiples vendedores.", "Power for multi-agent sales teams running heavy outbound."),
        pros: [
          t("Telefonía integrada (VoIP), SMS y email marketing masivo", "Integrated VoIP calling, SMS, and massive email marketing"),
          t("Múltiples pipelines de venta y comisiones por vendedor", "Multiple sales pipelines and rep commission tracking"),
          t("Ecosistema maduro con cientos de integraciones nativas", "Mature ecosystem with hundreds of native integrations"),
          t("Ideal cuando tienes personal dedicado a operar el CRM", "Ideal when you have dedicated staff to operate the CRM"),
        ],
        whenToChoose: t(
          "Cuando tienes un equipo comercial de 4+ personas haciendo llamadas y seguimiento constante.",
          "When you have a commercial team of 4+ reps actively making outbound calls and follow-ups."
        ),
        recommendedFor: t("Agencias, empresas de seguros, inmobiliarias masivas y B2B de alto volumen.", "Agencies, insurance firms, large real estate teams, and high-volume B2B."),
        badge: t("Para Equipos Grandes", "For Large Teams"),
      },
    ],
    expertInsight: t(
      "Mi recomendación honesta: Si tu equipo tiene menos de 5 personas, empezar con un sistema liviano a medida te ahorra miles de dólares y elimina fricción. Si ya superás ese volumen, configuro y opero GoHighLevel/HubSpot para que no sea un dolor de cabeza.",
      "My honest advice: If your team has under 5 people, starting with a lightweight custom system saves thousands and eliminates friction. If you exceed that volume, I configure and operate GoHighLevel/HubSpot so it works seamlessly."
    ),
  },
  {
    id: "visual-vs-speed",
    category: t("Estrategia de Conversión", "Conversion Strategy"),
    question: t("¿Cuándo tu web debe 'entrar por los ojos' y cuándo debe ser 'pura velocidad'?", "When should your site be a 'visual statement' versus 'pure transactional speed'?"),
    summary: t(
      "No todas las webs se diseñan igual. Un estudio de tatuajes de lujo vende por deseo visual; un servicio de auxilio mecánico o transporte vende por respuesta en 10 segundos.",
      "Not all websites should be built the same way. A luxury tattoo studio sells on visual desire; a transport or logistics service sells on 10-second response time."
    ),
    options: [
      {
        title: t("Enfoque Editorial & De Alto Impacto", "High-Impact & Editorial Approach"),
        subtitle: t("El diseño visual sostiene un precio más alto.", "Visual art direction supports premium pricing."),
        pros: [
          t("Fotografía protagónica, paletas oscuras y tipografía de lujo", "Protagonist visuals, dark palettes, and luxury typography"),
          t("Genera estatus y filtra a clientes que buscan precio bajo", "Builds prestige and filters out low-budget tire-kickers"),
          t("Muestra la maestría artesanal del servicio en pantalla", "Showcases craftsmanship and technical mastery"),
        ],
        whenToChoose: t("Para servicios de alto ticket donde el cliente compra estética, exclusividad y confianza visual.", "For high-ticket services where clients buy aesthetics, exclusivity, and visual confidence."),
        recommendedFor: t("Real Estate de lujo, estudios de tatuajes, moda, gastronomía premium y marcas de autor.", "Luxury Real Estate, tattoo studios, fashion, premium dining, and boutique brands."),
        badge: t("Ejemplo: Mr. Studio Tattoo & Rangel Oviedo", "Example: Mr. Studio Tattoo & Rangel Oviedo"),
      },
      {
        title: t("Enfoque Transaccional Ultrarrápido", "Ultra-Fast Transactional Approach"),
        subtitle: t("Cero adornos: resolver la consulta del usuario en segundos.", "Zero fluff: solve the user enquiry in seconds."),
        pros: [
          t("Carga en menos de 0.5s en conexiones móviles débiles", "Sub-0.5s load on weak mobile data connections"),
          t("Botones de acción obvios (WhatsApp, formulario en 3 pasos)", "Clear action buttons (WhatsApp, 3-step brief)"),
          t("Textos directos enfocados en dolor, solución y garantía", "Direct copy focused on pain points, solutions, and SLAs"),
        ],
        whenToChoose: t("Cuando el usuario tiene una necesidad urgente o busca resolver desde el teléfono en la calle.", "When the user has an urgent need or browses from their phone on the go."),
        recommendedFor: t("Logística, servicios para transportistas, talleres, servicios de urgencia y B2B operativo.", "Logistics, trucking services, repair shops, emergency services, and operational B2B."),
        badge: t("Ejemplo: Truckers Choice & New Brothers", "Example: Truckers Choice & New Brothers"),
      },
    ],
    expertInsight: t(
      "Analizo el modelo de tu negocio antes de escribir una línea de código. Si vendés prestigio, diseño una experiencia inmersiva. Si vendés rapidez y necesidad, construyo un motor de conversión directo.",
      "I analyze your business model before writing a line of code. If you sell prestige, I design an immersive experience. If you sell convenience and urgency, I build a direct conversion engine."
    ),
  },
  {
    id: "crm-ecosystems",
    category: t("Comparativa CRM (GHL vs HubSpot vs Pipedrive)", "CRM Comparison (GHL vs HubSpot vs Pipedrive)"),
    question: t("¿Cuál es el mejor CRM según tu modelo de negocio?", "Which CRM actually fits your business model?"),
    summary: t(
      "No existe un CRM perfecto para todos. GoHighLevel domina en agencias y negocios de servicios locales; HubSpot es el rey de la atribución corporativa B2B; Pipedrive y las soluciones a medida destacan en velocidad pura y cero burocracia.",
      "There is no single best CRM. GoHighLevel excels for agencies and service businesses; HubSpot leads in enterprise B2B inbound attribution; Pipedrive and custom setups shine in pure visual speed and zero bloat."
    ),
    options: [
      {
        title: t("GoHighLevel (HighLevel)", "GoHighLevel (HighLevel)"),
        subtitle: t("El sistema 'todo en uno' definitivo para servicios y agencias.", "The ultimate all-in-one platform for agencies and local services."),
        pros: [
          t("Tarifa plana sin cobro por cantidad de contactos o leads almacenados", "Flat-rate pricing without contact tier penalties"),
          t("WhatsApp API, SMS, telefonía VoIP y funnels incluidos en el mismo lugar", "WhatsApp API, SMS, VoIP phone system, and funnels all-in-one"),
          t("Automatizaciones de seguimiento implacables (evita que se enfríen prospectos)", "Relentless automated nurture flows to keep leads hot"),
          t("Ideal para delegar sub-cuentas a sucursales o clientes con marca blanca", "Sub-account architecture perfect for branches and clients"),
        ],
        whenToChoose: t("Si vendes servicios, citas o consultas, o si quieres sustituir 6 suscripciones distintas (ClickFunnels + Calendly + Mailchimp + Twilio) por una sola.", "If you sell appointments, high-ticket services, or want to replace 6 subscriptions into one consolidated platform."),
        recommendedFor: t("Agencias, clínicas estéticas, academias, firmas legales y servicios locales.", "Agencies, aesthetic clinics, academies, legal firms, and local services."),
        badge: t("Recomendado Todo-en-Uno", "Top All-In-One"),
      },
      {
        title: t("HubSpot vs Pipedrive / A Medida", "HubSpot vs Pipedrive / Custom"),
        subtitle: t("De la atribución multinivel a la máxima ligereza sin cuotas.", "From multi-touch attribution to ultimate fee-free simplicity."),
        pros: [
          t("HubSpot: Análisis quirúrgico de origen de leads y ciclo de vida corporativo", "HubSpot: Surgical multi-touch lead source tracking and enterprise lifecycle"),
          t("Pipedrive: El pipeline Kanban más rápido y amigable para vendedores telefónicos", "Pipedrive: The fastest, cleanest Kanban pipeline for sales reps"),
          t("A Medida (Supabase + n8n): Propiedad 100% de tus datos con cero costos recurrentes", "Custom (Supabase + n8n): 100% data ownership with zero recurring SaaS fees"),
          t("Integración profunda con stacks de código Next.js y APIs REST", "Deep integration with modern Next.js code stacks and REST APIs"),
        ],
        whenToChoose: t("HubSpot si tienes un equipo corporativo con presupuesto alto. Pipedrive o A Medida si buscas foco puro en cerrar tratos sin complejidad.", "HubSpot if you have a well-funded enterprise sales team. Pipedrive or Custom if you want zero bloat and high closing velocity."),
        recommendedFor: t("Startups B2B, empresas de software, distribuidores mayoristas y operaciones ágiles.", "B2B SaaS, tech startups, wholesale distributors, and lean teams."),
        badge: t("Corporativo & Especializado", "Corporate & Specialized"),
      },
    ],
    expertInsight: t(
      "He configurado e integrado tanto GoHighLevel como HubSpot y sistemas a medida con PostgreSQL. Te ayudo a elegir por números reales de retorno, no por lo que te promete un vendedor de software en Twitter.",
      "I have architected and integrated GoHighLevel, HubSpot, and custom PostgreSQL systems. I help you choose based on real operational ROI, not Twitter SaaS hype."
    ),
  },
];

export const WORKFLOW_STAGES = [
  {
    step: "01",
    title: t("Diagnóstico & Criterio", "Diagnosis & Strategic Alignment"),
    description: t(
      "Analizamos tu flujo actual, detectamos cuellos de botella y definimos el alcance exacto sin humo.",
      "We analyze your current flow, isolate bottlenecks, and define the exact scope without hype."
    ),
    badge: t("Sin Compromiso", "No Commitment"),
  },
  {
    step: "02",
    title: t("Dirección de Arte & Arquitectura", "Art Direction & Architecture"),
    description: t(
      "Estructura visual, experiencia de usuario y arquitectura técnica creadas a medida de tu negocio.",
      "Tailored visual hierarchy, user journey, and technical architecture designed for conversions."
    ),
    badge: t("Diseño a Medida", "Custom Design"),
  },
  {
    step: "03",
    title: t("Construcción en Producción (Next.js)", "Production Build (Next.js)"),
    description: t(
      "Desarrollo en Next.js 16 y automatizaciones conectadas en sprints ágiles de 1 a 3 semanas.",
      "Next.js 16 build and connected automations shipped in agile 1-3 week sprints."
    ),
    badge: t("Velocidad Extrema", "Extreme Speed"),
  },
  {
    step: "04",
    title: t("Despliegue & Operación Continua", "Deployment & Active Operations"),
    description: t(
      "Despliegue en producción con monitoreo en vivo y comunicación directa por WhatsApp sin intermediarios.",
      "Live production launch with real-time telemetry and direct WhatsApp communication."
    ),
    badge: t("Acompañamiento Real", "Real Support"),
  },
];
