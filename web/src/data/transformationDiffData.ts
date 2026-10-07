export interface TransformationMetricDelta {
  label: { es: string; en: string };
  before: string;
  after: string;
  improvement: string;
}

export interface TransformationCase {
  id: string;
  clientName: string;
  industry: { es: string; en: string };
  accentColor: string;
  liveUrl: string;
  beforeState: {
    title: { es: string; en: string };
    frictionPoints: { es: string; en: string }[];
    responseLatency: string;
    conversionRate: string;
  };
  afterState: {
    title: { es: string; en: string };
    systemHighlights: { es: string; en: string }[];
    responseLatency: string;
    conversionRate: string;
  };
  metrics: TransformationMetricDelta[];
}

export const TRANSFORMATION_CASES: TransformationCase[] = [
  {
    id: "new-brothers",
    clientName: "New Brothers Barbería",
    industry: { es: "Servicios & Cuidado Personal", en: "Services & Personal Care" },
    accentColor: "#D4AF37",
    liveUrl: "https://nb-barber.vercel.app/",
    // Sin métricas de negocio medidas: los deltas describen capacidades verificables en el código (D:\Barberia).
    beforeState: {
      title: {
        es: "Reservas, cobros y clientes repartidos en mensajes y anotaciones",
        en: "Bookings, payments and clients scattered across messages and notes",
      },
      frictionPoints: [
        { es: "Los turnos se coordinaban por mensajes, uno por uno.", en: "Slots were coordinated by message, one at a time." },
        { es: "La caja y lo que le toca a cada barbero se calculaban aparte.", en: "Cash and each barber's share were worked out separately." },
        { es: "No había un historial único de cada cliente.", en: "There was no single history for each client." },
      ],
      responseLatency: "Manual",
      conversionRate: "Sin registro",
    },
    afterState: {
      title: {
        es: "Reserva autoservicio y un CRM propio en un solo panel",
        en: "Self-service booking and its own CRM in one panel",
      },
      systemHighlights: [
        { es: "Reserva guiada en 6 pasos, con agenda sin solapes validada en la base.", en: "Guided 6-step booking, with no double booking enforced in the database." },
        { es: "Punto de venta, caja con cierre diario y liquidaciones de barberos.", en: "Point of sale, cash with daily close and barber payouts." },
        { es: "Ficha de cliente con historial de cortes y reactivación de inactivos por WhatsApp.", en: "Client file with haircut history and WhatsApp reactivation of inactive clients." },
      ],
      responseLatency: "Autoservicio",
      conversionRate: "Panel único",
    },
    metrics: [
      { label: { es: "Pasos para reservar", en: "Booking steps" }, before: "Conversación", after: "6 pasos", improvement: "Autoservicio" },
      { label: { es: "Lugares para operar", en: "Places to operate" }, before: "Varios", after: "1 panel", improvement: "Centralizado" },
      { label: { es: "Roles con permisos", en: "Roles with permissions" }, before: "—", after: "4", improvement: "Acceso por rol" },
    ],
  },
  {
    id: "lb-elite",
    clientName: "L&B Elite Wash & Detail",
    industry: { es: "Detailing Móvil & Servicios Náuticos (Florida)", en: "Mobile Detailing & Marine (Florida)" },
    accentColor: "#B68CFF",
    liveUrl: "https://l-b-five.vercel.app/",
    beforeState: {
      title: {
        es: "Pérdida de cotizaciones de alto valor por catálogos confusos",
        en: "Lost high-ticket marine quotes due to fragmented service pricing",
      },
      frictionPoints: [
        {
          es: "Presupuestos para autos, botes y flotas mezclados en conversaciones de chat.",
          en: "Cars, boats, and fleet quotes tangled in chaotic unorganized chat logs.",
        },
        {
          es: "Clientes de lujo en Florida esperando horas para conocer precios estimados.",
          en: "Luxury Florida clients waiting hours for basic price estimates.",
        },
        {
          es: "Falta de percepción de alta gama en la presencia digital previa.",
          en: "Lack of high-end visual authority in previous online presence.",
        },
      ],
      responseLatency: "Manual",
      conversionRate: "Sin cotizador",
    },
    afterState: {
      title: {
        es: "Experiencia visual Next.js con cotizador guiado por categoría",
        en: "High-impact Next.js digital presence with category quote flow",
      },
      systemHighlights: [
        {
          es: "Catálogo claro segmentado por vehículo (Sedan, SUV, Botes, Jet Skis, Flotas).",
          en: "Clear segmented catalogue by vehicle tier (Sedan, SUV, Boats, Jet Skis, Fleets).",
        },
        {
          es: "Formulario ultra-rápido que pre-filtra ubicación y paquete de servicio.",
          en: "Ultra-fast request flow capturing location and tailored package upfront.",
        },
        {
          es: "Diseño visual premium para servicios de alta gama en Florida.",
          en: "Bespoke luxury aesthetic for high-end services in Florida.",
        },
      ],
      responseLatency: "Autoservicio",
      conversionRate: "Cotizador guiado",
    },
    metrics: [
      {
        label: { es: "Cotizador por categoría", en: "Category quote flow" },
        before: "No disponible",
        after: "5 categorías",
        improvement: "Segmentado",
      },
      {
        label: { es: "Pre-filtrado de servicio", en: "Service pre-filter" },
        before: "Manual",
        after: "Formulario web",
        improvement: "Inmediato",
      },
      {
        label: { es: "Presentación de marca", en: "Brand presentation" },
        before: "Fragmentada",
        after: "Next.js visual",
        improvement: "Optimizada",
      },
    ],
  },
  {
    id: "ad-media",
    clientName: "AD Media Solution",
    industry: { es: "Agencia & Estrategia Comercial B2B", en: "B2B Media Agency & Growth" },
    accentColor: "#71F3A2",
    liveUrl: "https://admediasolution.vercel.app/",
    beforeState: {
      title: {
        es: "Pauta en Meta Ads con leads fríos desatendidos",
        en: "Paid Meta campaigns with neglected cold leads",
      },
      frictionPoints: [
        {
          es: "Leads entrantes caían en una bandeja de correo sin alertas prioritarias.",
          en: "Incoming leads dropped into an email inbox without instant alerts.",
        },
        {
          es: "Comerciales contactando horas después cuando el prospecto ya se enfrió.",
          en: "Sales reps reaching out hours later when prospect interest has dropped.",
        },
        {
          es: "Sin tracking de atribución clara entre anuncio, lead y facturación real.",
          en: "Zero attribution tracking between ad spend, lead source, and actual revenue.",
        },
      ],
      responseLatency: "Manual",
      conversionRate: "Sin automatizar",
    },
    afterState: {
      title: {
        es: "Circuito vivo: Webhook ➔ Agente IA WhatsApp ➔ GoHighLevel CRM",
        en: "Live circuit: Webhook ➔ WhatsApp AI Agent ➔ GoHighLevel CRM",
      },
      systemHighlights: [
        {
          es: "Primer contacto por WhatsApp calificando presupuesto.",
          en: "First WhatsApp contact validating budget and company size.",
        },
        {
          es: "Sincronización instantánea con pipeline comercial en GoHighLevel.",
          en: "Instant sync with commercial pipeline stages in GoHighLevel.",
        },
        {
          es: "Agendamiento directo en calendario del director de cuentas.",
          en: "Direct booking into the account director's calendar.",
        },
      ],
      responseLatency: "Automatizado",
      conversionRate: "Webhook directo",
    },
    metrics: [
      {
        label: { es: "Primer contacto", en: "First contact" },
        before: "Manual",
        after: "Agente WhatsApp",
        improvement: "Inmediato",
      },
      {
        label: { es: "Sincronización de pipeline", en: "Pipeline sync" },
        before: "Manual",
        after: "GoHighLevel CRM",
        improvement: "Automático",
      },
      {
        label: { es: "Agendamiento en calendario", en: "Calendar booking" },
        before: "Coordinado",
        after: "Directo",
        improvement: "Autoservicio",
      },
    ],
  },
];
