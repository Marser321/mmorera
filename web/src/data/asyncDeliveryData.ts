export interface MilestoneEvent {
  time: string;
  type: "git" | "deploy" | "db" | "ai" | "qa";
  message: { es: string; en: string };
  tag: string;
}

export interface MilestonePhase {
  id: string;
  phaseNumber: number;
  dayRange: { es: string; en: string };
  name: { es: string; en: string };
  deliverableBadge: { es: string; en: string };
  deliverables: { es: string[]; en: string[] };
  telemetry: {
    commitsCount: number;
    previewUrl: string;
    lighthouseScore: number;
    testPassingCount: number;
  };
  events: MilestoneEvent[];
  impactSummary: { es: string; en: string };
}

export const SPRINT_MILESTONES: MilestonePhase[] = [
  {
    id: "phase-1",
    phaseNumber: 1,
    dayRange: { es: "Días 01 - 04", en: "Days 01 - 04" },
    name: {
      es: "Fundación de Arquitectura & Esquema de Datos",
      en: "Architecture Foundation & Data Schema",
    },
    deliverableBadge: { es: "Core de Datos & Edge", en: "Data Core & Edge" },
    deliverables: {
      es: [
        "Modelado relacional en PostgreSQL / Supabase con RLS policies",
        "Setup de repositorio privado en GitHub con TypeScript estricto",
        "Router Edge en Next.js 16 con verificación de tipado Zod",
      ],
      en: [
        "PostgreSQL / Supabase relational schema with RLS security policies",
        "Private GitHub repository setup with strict TypeScript and CI/CD",
        "Next.js 16 Edge router with end-to-end Zod type validation",
      ],
    },
    telemetry: {
      commitsCount: 14,
      previewUrl: "https://staging-core.mmorera.agency",
      lighthouseScore: 99,
      testPassingCount: 38,
    },
    events: [
      {
        time: "Día 01 · 11:20",
        type: "git",
        message: {
          es: "Init repo: Arquitectura limpia con Next.js 16 y Tailwind CSS 3.4",
          en: "Repo init: Clean architecture with Next.js 16 and Tailwind CSS 3.4",
        },
        tag: "git:init",
      },
      {
        time: "Día 02 · 16:45",
        type: "db",
        message: {
          es: "Migración de base de datos aplicada: 4 tablas, 12 RLS, 0 downtime",
          en: "Database migration applied: 4 tables, 12 RLS policies, 0 downtime",
        },
        tag: "supabase:db",
      },
      {
        time: "Día 04 · 19:10",
        type: "deploy",
        message: {
          es: "Staging desplegado automáticamente en Vercel Edge con HTTPS",
          en: "Staging deployed automatically to Vercel Edge with HTTPS",
        },
        tag: "vercel:edge",
      },
    ],
    impactSummary: {
      es: "Cimientos técnicos inquebrantables. El cliente recibe acceso a su URL de staging privada en <72 horas sin una sola reunión.",
      en: "Rock-solid technical foundations. Client receives access to private staging URL in <72 hours without a single meeting.",
    },
  },
  {
    id: "phase-2",
    phaseNumber: 2,
    dayRange: { es: "Días 05 - 11", en: "Days 05 - 11" },
    name: {
      es: "Frontend de Alta Conversión & Experiencia Táctil",
      en: "High-Converting Frontend & Tactile Experience",
    },
    deliverableBadge: { es: "98+ PageSpeed · 60 FPS", en: "98+ PageSpeed · 60 FPS" },
    deliverables: {
      es: [
        "Diseño e implementación de interfaz con estética Deep Space",
        "Micro-interacciones táctiles con Framer Motion (física spring)",
        "Optimización de Core Web Vitals (LCP < 1.2s, CLS = 0.00)",
      ],
      en: [
        "Deep Space aesthetic interface design and responsive layout",
        "Tactile micro-interactions powered by Framer Motion spring physics",
        "Core Web Vitals tuning (LCP < 1.2s, CLS = 0.00, 99 PageSpeed)",
      ],
    },
    telemetry: {
      commitsCount: 32,
      previewUrl: "https://staging-ui.mmorera.agency",
      lighthouseScore: 99,
      testPassingCount: 65,
    },
    events: [
      {
        time: "Día 06 · 14:15",
        type: "deploy",
        message: {
          es: "Preview UI lista para interactuar en móvil y escritorio",
          en: "UI preview ready for interactive testing on mobile and desktop",
        },
        tag: "preview:ui",
      },
      {
        time: "Día 08 · 18:30",
        type: "qa",
        message: {
          es: "Auditoría Lighthouse: 100 Performance, 100 SEO, 100 Accesibilidad",
          en: "Lighthouse audit: 100 Performance, 100 SEO, 100 Accessibility",
        },
        tag: "audit:100",
      },
      {
        time: "Día 11 · 17:00",
        type: "git",
        message: {
          es: "Video Loom asíncrono de 4 minutos enviado con el demo interactivo",
          en: "4-minute async Loom walkthrough delivered with interactive demo",
        },
        tag: "async:loom",
      },
    ],
    impactSummary: {
      es: "Una interfaz que cautiva y retiene. El cliente prueba la experiencia viva directamente en su teléfono celular.",
      en: "An interface built to captivate and convert. The client interacts with the live software directly on their phone.",
    },
  },
  {
    id: "phase-3",
    phaseNumber: 3,
    dayRange: { es: "Días 12 - 17", en: "Days 12 - 17" },
    name: {
      es: "Integración de Agentes IA & Pipelines de Eventos",
      en: "AI Agents Integration & Event Pipelines",
    },
    deliverableBadge: { es: "WhatsApp 24/7 · CRM", en: "WhatsApp 24/7 · CRM" },
    deliverables: {
      es: [
        "Conexión con WhatsApp Business Cloud API & Webhooks con reintento",
        "Calibración de agentes de lenguaje con base de conocimiento propia",
        "Pipeline de cobros automatizados con Stripe / MercadoPago",
      ],
      en: [
        "WhatsApp Business Cloud API webhook integration with retry queues",
        "Language AI agents calibrated against proprietary business knowledge",
        "Automated billing and payment gateway integration (Stripe / MercadoPago)",
      ],
    },
    telemetry: {
      commitsCount: 48,
      previewUrl: "https://staging-integrations.mmorera.agency",
      lighthouseScore: 98,
      testPassingCount: 88,
    },
    events: [
      {
        time: "Día 13 · 12:40",
        type: "ai",
        message: {
          es: "Agente IA calibrado: <25s speed-to-lead y calificación automática",
          en: "AI agent calibrated: <25s speed-to-lead and lead scoring live",
        },
        tag: "ai:trained",
      },
      {
        time: "Día 15 · 16:20",
        type: "db",
        message: {
          es: "Webhook Stripe verificado en sandbox con suscripciones recurrentes",
          en: "Stripe webhook verified in sandbox with recurring subscriptions",
        },
        tag: "stripe:live",
      },
      {
        time: "Día 17 · 20:00",
        type: "qa",
        message: {
          es: "Prueba E2E completada: Formulario -> WhatsApp -> CRM -> Pago OK",
          en: "E2E test passed: Form -> WhatsApp -> CRM -> Checkout verified",
        },
        tag: "e2e:pass",
      },
    ],
    impactSummary: {
      es: "Todo el circuito operativo engranado. Los leads se capturan, califican y atienden 24/7 sin intervención humana.",
      en: "The entire operational circuit linked together. Leads are captured, scored, and answered 24/7 autonomously.",
    },
  },
  {
    id: "phase-4",
    phaseNumber: 4,
    dayRange: { es: "Días 18 - 21", en: "Days 18 - 21" },
    name: {
      es: "QA de Estrés, Despliegue a Producción & Handoff",
      en: "Stress QA, Production Cutover & Handoff",
    },
    deliverableBadge: { es: "Cero Deuda · 100% Operativo", en: "Zero Debt · 100% Live" },
    deliverables: {
      es: [
        "Pruebas de estrés de concurrencia y rate limiting al borde",
        "Cutover de DNS a dominio de producción con cero minutos de caída",
        "Entrega de repositorio GitHub propio, documentación y telemetría",
      ],
      en: [
        "Concurrency stress testing and edge rate limiting verification",
        "Zero-downtime DNS production cutover to client's primary domain",
        "Ownership transfer of GitHub repository, technical documentation & HUD",
      ],
    },
    telemetry: {
      commitsCount: 62,
      previewUrl: "https://mmorera.agency",
      lighthouseScore: 100,
      testPassingCount: 100,
    },
    events: [
      {
        time: "Día 19 · 11:00",
        type: "qa",
        message: {
          es: "Test de estrés superado: 25,000 req/s sin una sola pérdida de paquete",
          en: "Stress test passed: 25,000 req/s with zero dropped packets",
        },
        tag: "stress:25k",
      },
      {
        time: "Día 20 · 15:30",
        type: "deploy",
        message: {
          es: "Despliegue a producción en dominio definitivo con SSL Edge",
          en: "Production cutover on primary domain with global Edge SSL",
        },
        tag: "prod:cutover",
      },
      {
        time: "Día 21 · 18:00",
        type: "git",
        message: {
          es: "Handoff completo: Repositorio transferido al cliente, 0 dependencias",
          en: "Full handoff: Clean repo ownership transferred, 0 lock-in",
        },
        tag: "handoff:complete",
      },
    ],
    impactSummary: {
      es: "Sistema funcionando en producción, facturando y bajo control total del cliente. Cero burocracia, cero intermediarios.",
      en: "Production system live, converting, and 100% owned by the client. Zero bureaucracy, zero intermediaries.",
    },
  },
];

export const ASYNC_LEVERAGE_METRICS = {
  hoursSavedInMeetings: 24,
  zeroUnnecessaryCallsGuarantee: true,
  averageSprintDeliveryDays: 21,
  stagingAvailabilityHours: 72,
};
