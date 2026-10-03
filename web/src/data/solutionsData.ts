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
}

export const SERVICE_SOLUTIONS: ServiceSolution[] = [
  {
    id: "web-ecommerce",
    tag: t("Presencia & Conversión", "Presence & Conversion"),
    title: t("Desarrollo Web & E-commerce Next.js", "Next.js Web & E-commerce Development"),
    headline: t("Sitios ultrarrápidos diseñados para vender, no para lucir en una plantilla.", "Ultra-fast sites built to convert, not just look like a template."),
    description: t(
      "Desarrollo a medida con Next.js 16, TypeScript y TailwindCSS. Carga instantánea en móviles, SEO técnico impecable y dirección de arte que proyecta autoridad inmediata.",
      "Custom development with Next.js 16, TypeScript, and TailwindCSS. Instant mobile loading, clean technical SEO, and art direction that commands authority."
    ),
    deliverables: [
      t("Arquitectura a medida sin plantillas genéricas", "Tailored architecture with zero generic templates"),
      t("Rendimiento 95+ en Google PageSpeed y Core Web Vitals", "95+ performance on Google PageSpeed & Core Web Vitals"),
      t("Catálogo de productos o CMS dinámico integrado", "Dynamic product catalog or integrated headless CMS"),
      t("Diseño bilingüe (i18n) y responsive optimizado", "Fully responsive and bilingual (i18n) ready"),
    ],
    idealFor: t(
      "Empresas, estudios y marcas que quieren dejar atrás webs lentas y transmitir confianza de primer nivel.",
      "Companies, studios, and brands wanting to replace slow sites with top-tier credibility."
    ),
    accent: "#55D8FF",
  },
  {
    id: "booking-payments",
    tag: t("Operación Autoservicio", "Self-Service Operations"),
    title: t("Sistemas de Reserva, Cobros & WhatsApp", "Booking, Payment & WhatsApp Systems"),
    headline: t("Tus clientes reservan y pagan su seña solos, sin llamadas ni pérdidas de tiempo.", "Clients book and pay deposits on their own, no phone calls or back-and-forth."),
    description: t(
      "Flujos interactivos de contratación donde el cliente elige el servicio, confirma disponibilidad, abona la seña con tarjeta y recibe su confirmación automática por WhatsApp.",
      "Interactive booking flows where customers choose services, check availability, pay deposits, and receive instant WhatsApp notifications."
    ),
    deliverables: [
      t("Calendario de disponibilidad en tiempo real", "Real-time calendar & availability management"),
      t("Cobro de señas automáticas (Stripe / pasarelas)", "Automated deposit checkout (Stripe / local gateways)"),
      t("Notificaciones y recordatorios por WhatsApp API", "Instant WhatsApp API reminders & confirmations"),
      t("Reducción de cancelaciones de último momento", "Significant reduction in no-shows and cancellations"),
    ],
    idealFor: t(
      "Barberías, clínicas, detailing, consultorios y negocios de servicios con agenda activa.",
      "Barbershops, clinics, detailing services, practices, and appointment-based businesses."
    ),
    accent: "#71F3A2",
  },
  {
    id: "crm-automation",
    tag: t("Cero Fuga de Oportunidades", "Zero Opportunity Leak"),
    title: t("Arquitectura CRM & Automatización Operativa", "CRM Architecture & Operations Automation"),
    headline: t("Un sistema que responde prospectos en <5 minutos y ordena todo tu embudo.", "A system that responds to leads in <5 minutes and organizes your entire pipeline."),
    description: t(
      "Diseño e implementación de CRM a medida para flujos livianos, o configuración y operación experta sobre plataformas consolidadas (GoHighLevel, HubSpot) para equipos de venta activos.",
      "Custom lightweight CRM design, or expert setup and operation on platforms like GoHighLevel or HubSpot for active sales teams."
    ),
    deliverables: [
      t("Respuesta automática exprés para multiplicar el cierre", "Express automated follow-up to maximize conversions"),
      t("Pipeline visual para ver en qué estado está cada cliente", "Visual pipeline showing the exact stage of every prospect"),
      t("Integración con formularios web, llamadas y redes", "Complete integration with forms, calls, and social ads"),
      t("Sincronización de datos con alertas a tu equipo", "Real-time sync and instant alerts to your team"),
    ],
    idealFor: t(
      "Empresas B2B y negocios que invierten en publicidad y no quieren perder prospectos por demoras.",
      "B2B firms and businesses running ads that cannot afford losing leads to slow replies."
    ),
    accent: "#B68CFF",
  },
  {
    id: "ai-software",
    tag: t("Escala con IA", "AI Scalability"),
    title: t("Interfaces con IA & Software a Medida", "AI Interfaces & Custom Software"),
    headline: t("Agentes inteligentes y herramientas internas que hacen el trabajo repetitivo.", "Intelligent agents and internal tools that handle repetitive workflows."),
    description: t(
      "Herramientas internas y chatbots entrenados con los manuales y procesos de tu negocio para responder dudas frecuentes, filtrar prospectos y operar 24/7 sin sumar sueldos fijos.",
      "Internal tools and AI assistants trained on your business procedures to answer questions, qualify leads, and operate 24/7 without overhead."
    ),
    deliverables: [
      t("Asistentes inteligentes 24/7 entrenados con tus datos", "24/7 smart assistants trained on your private knowledge"),
      t("Filtro predictivo y calificación previa de leads", "Predictive filtering and pre-qualification of prospects"),
      t("Paneles y herramientas internas de gestión rápida", "Custom internal dashboards and management tools"),
      t("Conexión con bases de datos y APIs externas", "Secure database and external API integrations"),
    ],
    idealFor: t(
      "Negocios en crecimiento que necesitan atender más clientes sin colapsar su equipo humano.",
      "Growing companies that need to serve more clients without overwhelming their team."
    ),
    accent: "#E59500",
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
    question: t("¿Necesitás un CRM gigante como HubSpot/GoHighLevel o una herramienta a medida?", "Do you need a heavy CRM like HubSpot/GoHighLevel or a custom-built tool?"),
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
          t("Se aprende en 5 minutos: solo lo que tu negocio necesita", "Learned in 5 minutes: only what your business actually needs"),
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
          t("Ideal cuando tenés personal dedicado a operar el CRM", "Ideal when you have dedicated staff to operate the CRM"),
        ],
        whenToChoose: t(
          "Cuando tenés un equipo comercial de 4+ personas haciendo llamadas y seguimiento constante.",
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
        subtitle: t("El diseño visual es el 80% de la justificación del precio.", "Visual art direction justifies 80% of premium pricing."),
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
        whenToChoose: t("Si vendés servicios, citas, consultas, o si querés sustituir 6 suscripciones distintas (ClickFunnels + Calendly + Mailchimp + Twilio) por una sola.", "If you sell appointments, high-ticket services, or want to replace 6 subscriptions into one consolidated platform."),
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
        whenToChoose: t("HubSpot si tenés un equipo corporativo con presupuesto alto. Pipedrive o A Medida si buscás foco puro en cerrar tratos sin complejidad.", "HubSpot if you have a well-funded enterprise sales team. Pipedrive or Custom if you want zero bloat and high closing velocity."),
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
      "Analizamos qué tiene tu negocio hoy, dónde se traban los clientes y si necesitás una web visual, un sistema de reservas o automatización en WhatsApp. Cero humo: números y objetivos claros.",
      "We analyze what exists today, where prospects drop off, and whether you need a visual website, self-service booking, or WhatsApp automation. Zero hype: clear KPIs and scope."
    ),
    badge: t("Sin Compromiso", "No Commitment"),
  },
  {
    step: "02",
    title: t("Dirección de Arte & Arquitectura", "Art Direction & Architecture"),
    description: t(
      "Diseñamos la estructura completa, la jerarquía visual y el recorrido del cliente. Todo pensado para que la persona entienda de inmediato y actúe sin dudar.",
      "We design the complete structure, visual hierarchy, and customer journey. Engineered so visitors instantly understand and act with certainty."
    ),
    badge: t("Diseño a Medida", "Custom Design"),
  },
  {
    step: "03",
    title: t("Construcción en Producción (Next.js)", "Production Build (Next.js)"),
    description: t(
      "Desarrollo de alto rendimiento con Next.js 16, bases de datos y pasarelas conectadas. Entregas en sprints ágiles para que veas el sistema funcionando en días, no en meses.",
      "High-performance build with Next.js 16, databases, and connected payment/WhatsApp workflows. Shipped in fast sprints so you see real software in days, not months."
    ),
    badge: t("Velocidad Extrema", "Extreme Speed"),
  },
  {
    step: "04",
    title: t("Despliegue & Operación Continua", "Deployment & Active Operations"),
    description: t(
      "Lanzamos tu sistema en servidores globales (CDN) con monitoreo continuo, optimización de conversión y soporte directo por WhatsApp conmigo sin intermediarios.",
      "We deploy to global CDN edge servers with 24/7 uptime monitoring, conversion optimization, and direct WhatsApp support with me—no intermediaries."
    ),
    badge: t("Acompañamiento Real", "Real Support"),
  },
];
