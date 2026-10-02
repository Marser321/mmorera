export interface SprintPhase {
  id: string;
  dayRange: string;
  title: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  deliverables: {
    es: string[];
    en: string[];
  };
}

export interface SprintTimelineTier {
  id: "fast_web" | "automation_crm" | "integral_system";
  durationWeeks: number;
  totalDays: number;
  name: {
    es: string;
    en: string;
  };
  badge: {
    es: string;
    en: string;
  };
  accentColor: string;
  summary: {
    es: string;
    en: string;
  };
  phases: SprintPhase[];
  guarantees: {
    es: string[];
    en: string[];
  };
}

export const SPRINT_TIMELINE_TIERS: SprintTimelineTier[] = [
  {
    id: "fast_web",
    durationWeeks: 1,
    totalDays: 7,
    name: {
      es: "Sprint Web de Alto Impacto",
      en: "High-Impact Web Sprint",
    },
    badge: {
      es: "1 Semana · 7 Días",
      en: "1 Week · 7 Days",
    },
    accentColor: "#55D8FF",
    summary: {
      es: "Diseño y desarrollo web en Next.js 16 con Turbopack, animaciones cinematográficas y 95+ Google PageSpeed para maximizar conversión de tráfico.",
      en: "Web design and development in Next.js 16 with Turbopack, cinematic animations and 95+ Google PageSpeed to maximize traffic conversion.",
    },
    phases: [
      {
        id: "fw-1",
        dayRange: "Días 1 - 2",
        title: {
          es: "Arquitectura & Dirección Visual",
          en: "Architecture & Visual Direction",
        },
        description: {
          es: "Definición de propuesta de valor, jerarquía de conversión y prototipo interactivo en Figma.",
          en: "Value proposition definition, conversion hierarchy and interactive prototype in Figma.",
        },
        deliverables: {
          es: ["Wireframes de alta fidelidad", "Paleta Deep Space & tipografía", "Estructura de copy orientada a ventas"],
          en: ["High-fidelity wireframes", "Deep Space palette & typography", "Sales-driven copy structure"],
        },
      },
      {
        id: "fw-2",
        dayRange: "Días 3 - 5",
        title: {
          es: "Desarrollo en Next.js 16 & Motion",
          en: "Next.js 16 & Motion Engineering",
        },
        description: {
          es: "Construcción en código limpio con Server Components, micro-interacciones hápticas y Tailwind CSS.",
          en: "Clean code build with Server Components, tactile micro-interactions and Tailwind CSS.",
        },
        deliverables: {
          es: ["100% código TypeScript propio", "Física de resortes en Framer Motion", "Modo oscuro y soporte multi-idioma"],
          en: ["100% custom TypeScript code", "Framer Motion spring physics", "Dark mode & multi-language support"],
        },
      },
      {
        id: "fw-3",
        dayRange: "Días 6 - 7",
        title: {
          es: "Auditoría 95+ PageSpeed & Despliegue",
          en: "95+ PageSpeed Audit & Deployment",
        },
        description: {
          es: "Optimización extrema de Core Web Vitals, configuración de CDN Edge global y traspaso de repositorio.",
          en: "Extreme Core Web Vitals tuning, global Edge CDN setup and GitHub repo ownership handoff.",
        },
        deliverables: {
          es: ["Puntaje 95+ en Google Lighthouse", "Despliegue con dominio propio y SSL", "Repositorio GitHub entregado al cliente"],
          en: ["95+ Google Lighthouse score", "Custom domain & SSL deployment", "GitHub repository transferred to client"],
        },
      },
    ],
    guarantees: {
      es: [
        "100% propiedad del código (sin licencias propietarias ni WordPress)",
        "0 cuotas mensuales obligatorias de mantenimiento",
        "Soporte directo con Mario Morera durante el lanzamiento",
      ],
      en: [
        "100% code ownership (no proprietary lock-in or bloated WordPress)",
        "Zero mandatory monthly retainer fees",
        "Direct support with Mario Morera throughout launch",
      ],
    },
  },
  {
    id: "automation_crm",
    durationWeeks: 2,
    totalDays: 14,
    name: {
      es: "Sprint de Automatización & CRM",
      en: "Automation & CRM Sprint",
    },
    badge: {
      es: "2 Semanas · 14 Días",
      en: "2 Weeks · 14 Days",
    },
    accentColor: "#71F3A2",
    summary: {
      es: "Conexión integral de WhatsApp Business API, pipelines de CRM (GoHighLevel / Supabase) y agentes de IA para triaje, respuesta inmediata y agenda automática 24/7.",
      en: "Full integration of WhatsApp Business API, CRM pipelines (GoHighLevel / Supabase), and AI agents for triage, instant response, and 24/7 auto-booking.",
    },
    phases: [
      {
        id: "ac-1",
        dayRange: "Días 1 - 4",
        title: {
          es: "Auditoría de Procesos & Pipeline CRM",
          en: "Process Audit & CRM Pipeline",
        },
        description: {
          es: "Mapeo del ciclo de vida del prospecto y estructuración de etapas de ventas en CRM.",
          en: "Prospect lifecycle mapping and CRM sales pipeline structuring.",
        },
        deliverables: {
          es: ["Diagrama de flujo operativo", "Configuración de GoHighLevel / Supabase", "Campos personalizados de calificación"],
          en: ["Operational flow diagram", "GoHighLevel / Supabase setup", "Custom qualification fields"],
        },
      },
      {
        id: "ac-2",
        dayRange: "Días 5 - 10",
        title: {
          es: "Conexión WhatsApp API & Agentes IA",
          en: "WhatsApp API & AI Agents Setup",
        },
        description: {
          es: "Desarrollo de webhooks en tiempo real, sincronización con calendarios y prompts de IA comerciales.",
          en: "Real-time webhook engineering, calendar sync and sales AI prompt workflows.",
        },
        deliverables: {
          es: ["Agente IA calificador con RAG", "Sincronización con Google Calendar / Outlook", "Respuestas en sub-30 segundos"],
          en: ["AI qualifying agent with RAG", "Google Calendar / Outlook sync", "Sub-30 second instant replies"],
        },
      },
      {
        id: "ac-3",
        dayRange: "Días 11 - 14",
        title: {
          es: "Pruebas de Estrés & Capacitación",
          en: "Stress Testing & Team Training",
        },
        description: {
          es: "Simulación de tráfico con leads reales, calibración de tono y grabación de tutoriales para el equipo.",
          en: "Traffic simulation with real lead payloads, tone tuning and recorded video tutorials.",
        },
        deliverables: {
          es: ["Pruebas de fallos y alertas automáticas", "Tutoriales en video Loom grabados", "Soporte post-lanzamiento de 14 días"],
          en: ["Failure fallback & alert triggers", "Recorded Loom video tutorials", "14-day post-launch hypercare"],
        },
      },
    ],
    guarantees: {
      es: [
        "Trazabilidad del 100% de los leads generados",
        "Reducción del tiempo de respuesta de horas a segundos",
        "Capacitación completa para que tu equipo opere con independencia",
      ],
      en: [
        "100% lead traceability across all channels",
        "Response time dropped from hours to seconds",
        "Complete recorded training for total team autonomy",
      ],
    },
  },
  {
    id: "integral_system",
    durationWeeks: 3,
    totalDays: 21,
    name: {
      es: "Ecosistema Integral End-to-End",
      en: "End-to-End Integral Ecosystem",
    },
    badge: {
      es: "3 Semanas · 21 Días",
      en: "3 Weeks · 21 Days",
    },
    accentColor: "#B68CFF",
    summary: {
      es: "La solución definitiva sin intermediarios: Plataforma web en Next.js 16 + Arquitectura CRM + Agentes IA de texto y voz + Cobros Stripe automatizados.",
      en: "The definitive single-operator ecosystem: Next.js 16 web platform + CRM architecture + Text/Voice AI agents + Automated Stripe billing.",
    },
    phases: [
      {
        id: "is-1",
        dayRange: "Días 1 - 7",
        title: {
          es: "Fase 1 · Plataforma Web & Conversión",
          en: "Phase 1 · Web Platform & Conversion",
        },
        description: {
          es: "Lanzamiento de la web de alta velocidad con diseño a medida y captación optimizada.",
          en: "Launch of high-speed custom web platform with optimized lead capture.",
        },
        deliverables: {
          es: ["Sitio web completo en Next.js 16", "95+ PageSpeed en móviles", "Copywriting estratégico validado"],
          en: ["Complete Next.js 16 website", "95+ PageSpeed on mobile", "Validated strategic copywriting"],
        },
      },
      {
        id: "is-2",
        dayRange: "Días 8 - 14",
        title: {
          es: "Fase 2 · Motor CRM & Automatización",
          en: "Phase 2 · CRM Engine & Automations",
        },
        description: {
          es: "Integración de WhatsApp, correo transaccional (Resend), webhooks y CRM unificado.",
          en: "Integration of WhatsApp, transactional email (Resend), webhooks, and unified CRM.",
        },
        deliverables: {
          es: ["Pipeline comercial GoHighLevel/Supabase", "Automatización de recordatorios SMS/WA", "Pasarela de pagos Stripe/MercadoPago"],
          en: ["GoHighLevel/Supabase sales pipeline", "Automated SMS/WA appointment reminders", "Stripe/MercadoPago payment checkout"],
        },
      },
      {
        id: "is-3",
        dayRange: "Días 15 - 21",
        title: {
          es: "Fase 3 · Agentes IA & Telefonía de Voz",
          en: "Phase 3 · AI Agents & Voice Telephony",
        },
        description: {
          es: "Incorporación de agentes de voz para llamadas telefónicas y calificación autónoma 24/7.",
          en: "Deployment of telephony voice AI agents for phone call booking and autonomous screening 24/7.",
        },
        deliverables: {
          es: ["Operador de voz con latencia sub-300ms", "Extracción automática de datos al CRM", "Auditoría integral y entrega de llaves"],
          en: ["Voice AI operator with sub-300ms latency", "Automatic CRM data entity extraction", "Full audit & turnkey ecosystem handover"],
        },
      },
    ],
    guarantees: {
      es: [
        "Un solo responsable directo: cero reuniones burocráticas entre diseñador y programador",
        "Ecosistema 100% interoperable donde nada se rompe",
        "Garantía de puesta en marcha en 21 días",
      ],
      en: [
        "Single point of contact: zero finger-pointing between agency teams",
        "100% interoperable ecosystem with zero broken links",
        "21-day turnkey delivery guarantee",
      ],
    },
  },
];
