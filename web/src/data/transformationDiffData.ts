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
      responseLatency: "3.5 horas",
      conversionRate: "18% cierre",
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
          es: "Diseño visual premium que justifica tickets promedio de $350 a $1,200 USD.",
          en: "Bespoke luxury aesthetic justifying $350 to $1,200 USD average tickets.",
        },
      ],
      responseLatency: "Instantáneo",
      conversionRate: "48% cierre",
    },
    metrics: [
      {
        label: { es: "Tiempo de Cotización", en: "Quote Turnaround" },
        before: "3.5 hrs",
        after: "45 seg",
        improvement: "-99%",
      },
      {
        label: { es: "Ticket Promedio", en: "Average Ticket" },
        before: "$180",
        after: "$420",
        improvement: "+133%",
      },
      {
        label: { es: "Velocidad de Carga Móvil", en: "Mobile PageSpeed" },
        before: "42/100",
        after: "98/100",
        improvement: "Sub-segundo",
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
          es: "Comerciales contactando 6 horas después cuando el prospecto ya se enfrió.",
          en: "Sales reps reaching out 6 hours later when prospect interest has dropped.",
        },
        {
          es: "Sin tracking de atribución clara entre anuncio, lead y facturación real.",
          en: "Zero attribution tracking between ad spend, lead source, and actual revenue.",
        },
      ],
      responseLatency: "6+ horas",
      conversionRate: "12% de contacto a demo",
    },
    afterState: {
      title: {
        es: "Circuito vivo: Webhook ➔ Agente IA WhatsApp ➔ GoHighLevel CRM",
        en: "Live circuit: Webhook ➔ WhatsApp AI Agent ➔ GoHighLevel CRM",
      },
      systemHighlights: [
        {
          es: "Primer contacto en < 30 segundos por WhatsApp calificando presupuesto.",
          en: "First WhatsApp contact in < 30s validating budget and company size.",
        },
        {
          es: "Sincronización instantánea con pipeline comercial en GoHighLevel.",
          en: "Instant sync with commercial pipeline stages in GoHighLevel.",
        },
        {
          es: "Agendamiento automático directo en calendario del director de cuentas.",
          en: "Automatic booking directly into the account director's calendar.",
        },
      ],
      responseLatency: "24 segundos",
      conversionRate: "42% de contacto a demo",
    },
    metrics: [
      {
        label: { es: "Tiempo 1ª Respuesta", en: "1st Response Time" },
        before: "6.2 hrs",
        after: "24 seg",
        improvement: "-99.8%",
      },
      {
        label: { es: "Tasa de Agendamiento", en: "Meeting Booking Rate" },
        before: "12%",
        after: "42%",
        improvement: "+250%",
      },
      {
        label: { es: "Trazabilidad de Pauta a Venta", en: "Ad-to-Close Tracking" },
        before: "0%",
        after: "100%",
        improvement: "Total",
      },
    ],
  },
];
