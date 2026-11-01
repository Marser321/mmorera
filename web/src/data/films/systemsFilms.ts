import { PIPELINE_SCENARIOS, type PipelineScenarioId } from "@/data/automationPipelineData";
import {
  FILM_FPS,
  USE_CASE_DURATION,
  buildChapters,
  type FilmStage,
  type Localized,
  type OpeningBeat,
  type UseCaseFilmScript,
} from "./filmTypes";

/* ──────────────────────────────────────────────────────────────────────────
 * Film de apertura de /sistemas: "De herramientas sueltas a un sistema".
 * Se recorre con el scroll; cada beat dura 5 s de timeline.
 * ────────────────────────────────────────────────────────────────────────── */

export const OPENING_BEAT_FRAMES = 5 * FILM_FPS;

const openingBeat = (index: number, id: string, label: Localized, caption: Localized): OpeningBeat => ({
  id,
  label,
  caption,
  from: index * OPENING_BEAT_FRAMES,
  durationInFrames: OPENING_BEAT_FRAMES,
});

export const OPENING_BEATS: OpeningBeat[] = [
  openingBeat(0, "noise", { es: "Hoy", en: "Today" }, {
    es: "WhatsApp, formularios, Instagram, planillas y email. Cada herramienta trabaja sola.",
    en: "WhatsApp, forms, Instagram, spreadsheets and email. Each tool works alone.",
  }),
  openingBeat(1, "gap", { es: "La grieta", en: "The gap" }, {
    es: "El prospecto salta de una herramienta a otra y se pierde en el medio.",
    en: "The prospect jumps from one tool to another and gets lost in between.",
  }),
  openingBeat(2, "connect", { es: "Conexión", en: "Connection" }, {
    es: "Cada herramienta pasa a ser un paso de un mismo flujo.",
    en: "Each tool becomes a step in one flow.",
  }),
  openingBeat(3, "system", { es: "Sistema", en: "System" }, {
    es: "Un flujo, cinco estados visibles. El equipo ve dónde está cada persona.",
    en: "One flow, five visible states. The team sees where every person is.",
  }),
];

export const OPENING_DURATION = OPENING_BEATS.length * OPENING_BEAT_FRAMES;

/** Los cinco estados del riel (antes vivían en el stepper "Mapa operativo"). */
export const SYSTEM_RAIL_STAGES: Array<{ id: string; title: Localized; text: Localized }> = [
  { id: "capture", title: { es: "Captación", en: "Acquisition" }, text: { es: "Formularios, pauta, WhatsApp y fuentes que ya existen.", en: "Forms, paid media, WhatsApp and the sources already in use." } },
  { id: "qualify", title: { es: "Calificación", en: "Qualification" }, text: { es: "Reglas y señales que ordenan prioridad y próximo paso.", en: "Rules and signals that organise priority and next steps." } },
  { id: "crm", title: { es: "CRM", en: "CRM" }, text: { es: "Una historia única del prospecto, visible para el equipo.", en: "A single prospect history, visible to the team." } },
  { id: "agenda", title: { es: "Agenda", en: "Booking" }, text: { es: "Disponibilidad, confirmaciones y recordatorios conectados.", en: "Connected availability, confirmations and reminders." } },
  { id: "handoff", title: { es: "Handoff", en: "Handoff" }, text: { es: "El contexto llega a la persona correcta y queda registrado.", en: "Context reaches the right person and remains recorded." } },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Films de casos de uso. Reglas de honestidad:
 * - "real" solo usa lo publicado del caso (projectCases / caseTopologyData),
 *   sin métricas que no estén verificadas.
 * - "example" se rotula siempre como flujo de muestra y no muestra % de
 *   conversión ni estimaciones de negocio: solo los tiempos del flujo.
 * ────────────────────────────────────────────────────────────────────────── */

function stagesFromScenario(id: PipelineScenarioId): FilmStage[] {
  const scenario = PIPELINE_SCENARIOS.find((item) => item.id === id);
  if (!scenario) throw new Error(`Escenario inexistente: ${id}`);
  return scenario.stages.map((stage) => ({
    id: stage.id,
    title: stage.title,
    technology: stage.technology,
    summary: stage.summary,
    latencyMs: stage.latencyMs,
    httpStatus: stage.httpStatus,
    payload: stage.payload,
  }));
}

export function scenarioTotalMs(id: PipelineScenarioId): number {
  return PIPELINE_SCENARIOS.find((item) => item.id === id)?.totalDurationMs ?? 0;
}

/* Fuente: D:\Barberia (nb-barber). Wizard de 6 pasos en src/app/(main)/reservar,
   26 tablas y funciones en supabase/migrations/999_FULL_SETUP.sql, 14 secciones
   en src/app/admin/layout.tsx. Sin pasarela de pago ni recordatorios
   automáticos: el cobro se registra en mostrador (POS) y WhatsApp es click-to-chat. */
const barberCrm: UseCaseFilmScript = {
  id: "barber-crm",
  kind: "real",
  caseSlug: "new-brothers-barberia",
  caseTitle: { es: "New Brothers Barbería", en: "New Brothers Barbershop" },
  category: { es: "CRM propio", en: "Own CRM" },
  title: { es: "Un CRM propio para una barbería", en: "Its own CRM for a barbershop" },
  problem: {
    headline: { es: "Toda la operación pasaba por mensajes sueltos.", en: "The whole operation ran on loose messages." },
    visual: "chat",
    signals: [
      { es: "¿Hay lugar el sábado?", en: "Any slot on Saturday?" },
      { es: "¿Con qué barbero?", en: "Which barber?" },
      { es: "¿Cuánto se cobró hoy?", en: "How much came in today?" },
      { es: "¿Cuánto le toca a cada barbero?", en: "What does each barber get?" },
      { es: "¿Cuándo vino por última vez?", en: "When did they last come in?" },
    ],
  },
  diagnosis: {
    headline: { es: "Agenda, caja y clientes vivían en lugares distintos.", en: "Schedule, cash and clients lived in different places." },
    breakpoint: { es: "Nadie veía el negocio completo.", en: "Nobody saw the whole business." },
    lanes: [
      { label: { es: "Agenda", en: "Schedule" }, signals: [0, 1] },
      { label: { es: "Caja", en: "Cash" }, signals: [2, 3] },
      { label: { es: "Clientes", en: "Clients" }, signals: [4] },
    ],
  },
  stages: [
    {
      id: "booking-wizard",
      title: { es: "Reserva en 6 pasos", en: "6-step booking" },
      technology: "Next.js · wizard",
      summary: { es: "Sucursal, servicio, referencia, barbero, fecha y hora, confirmar.", en: "Branch, service, reference, barber, date and time, confirm." },
    },
    {
      id: "no-overlap",
      title: { es: "Agenda sin solapes", en: "No double booking" },
      technology: "Supabase · book_appointment",
      summary: { es: "La reserva se valida en la base con bloqueo de fila: nadie toma el mismo turno.", en: "Booking is validated in the database with a row lock: nobody takes the same slot." },
    },
    {
      id: "client-file",
      title: { es: "Ficha del cliente", en: "Client file" },
      technology: "PostgreSQL · haircut_history",
      summary: { es: "Historial de cortes, notas y última visita de cada cliente.", en: "Haircut history, notes and last visit for every client." },
    },
    {
      id: "cash-payouts",
      title: { es: "Caja y liquidaciones", en: "Cash and payouts" },
      technology: "POS · close_cash_day",
      summary: { es: "Cobro en mostrador, cierre diario y liquidación de cada barbero.", en: "Counter checkout, daily close and each barber's payout." },
    },
    {
      id: "reactivation",
      title: { es: "Reactivación", en: "Reactivation" },
      technology: "Edge function · WhatsApp",
      summary: { es: "Detecta clientes inactivos y deja listo el mensaje para volver a contactarlos.", en: "Finds inactive clients and prepares the message to reach them again." },
    },
  ],
  result: {
    headline: { es: "La barbería se gestiona desde su propio panel, sin depender de un CRM externo.", en: "The barbershop runs from its own panel, without depending on an external CRM." },
    facts: [
      { value: { es: "6", en: "6" }, label: { es: "pasos de reserva", en: "booking steps" } },
      { value: { es: "26", en: "26" }, label: { es: "tablas propias", en: "own tables" } },
      { value: { es: "4", en: "4" }, label: { es: "roles con permisos", en: "roles with permissions" } },
    ],
    screenshot: "/portfolio/shots/new-brothers-barberia-mobile-1.jpg",
  },
  chapters: buildChapters({
    problem: { es: "Reservas, cobros y clientes se resolvían por mensajes sueltos y anotaciones aparte.", en: "Bookings, payments and clients were handled through loose messages and separate notes." },
    diagnosis: { es: "El problema no era el canal: agenda, caja y clientes vivían en lugares distintos y nadie veía el negocio completo.", en: "The channel was not the problem: schedule, cash and clients lived apart and nobody saw the whole business." },
    system: { es: "Un CRM propio sobre Supabase: reserva en seis pasos, agenda sin solapes, ficha de cliente, caja con cierre diario, liquidaciones y reactivación de inactivos.", en: "Its own CRM on Supabase: six-step booking, no double booking, client file, cash with daily close, payouts and inactive-client reactivation." },
    result: { es: "La reserva se vuelve autoservicio y el negocio se gestiona desde un solo panel, con 26 tablas propias y 4 roles.", en: "Booking becomes self-service and the business runs from one panel, with 26 own tables and 4 roles." },
  }),
  durationInFrames: USE_CASE_DURATION,
};

const afterHoursLead: UseCaseFilmScript = {
  id: "after-hours-lead",
  kind: "example",
  seenIn: [{ slug: "ad-media-solution", chapter: "speed-to-lead" }],
  category: { es: "IA", en: "AI" },
  title: { es: "El lead de las 23:45", en: "The 11:45 PM lead" },
  problem: {
    headline: { es: "Pide presupuesto a las 23:45. Lo leen a las 9:00.", en: "Asks for a quote at 11:45 PM. Read at 9:00 AM." },
    visual: "clock",
    signals: [
      { es: "Nuevo formulario · sin leer", en: "New form · unread" },
      { es: "Presupuesto: a definir", en: "Budget: to be defined" },
      { es: "Sin responsable asignado", en: "No owner assigned" },
    ],
  },
  diagnosis: {
    headline: { es: "La primera respuesta depende de que alguien esté despierto.", en: "The first reply depends on someone being awake." },
    breakpoint: { es: "Todo lead espera igual, sin prioridad.", en: "Every lead waits the same, with no priority." },
  },
  stages: stagesFromScenario("inbound_web_lead"),
  result: {
    headline: { es: "Respuesta inmediata, con contexto y prioridad.", en: "Immediate reply, with context and priority." },
    facts: [
      { value: { es: `${scenarioTotalMs("inbound_web_lead")} ms`, en: `${scenarioTotalMs("inbound_web_lead")} ms` }, label: { es: "del formulario al WhatsApp", en: "from form to WhatsApp" } },
      { value: { es: "Score", en: "Score" }, label: { es: "y etapa en el CRM", en: "and stage in the CRM" } },
      { value: { es: "Agenda", en: "Calendar" }, label: { es: "propuesta en el mismo mensaje", en: "offered in the same message" } },
    ],
  },
  chapters: buildChapters({
    problem: { es: "Un prospecto completa el formulario de noche. Nadie lo ve hasta la mañana siguiente.", en: "A prospect fills in the form at night. Nobody sees it until the next morning." },
    diagnosis: { es: "Sin calificación automática, cada lead espera igual y la primera respuesta llega tarde.", en: "Without automatic qualification, every lead waits the same and the first reply arrives late." },
    system: { es: "Ingesta validada, anti-duplicados, agente IA que califica, registro en el CRM y WhatsApp con agenda.", en: "Validated intake, deduplication, an AI agent that qualifies, CRM record and WhatsApp with booking." },
    result: { es: "En la muestra, el lead recibe respuesta en menos de un segundo y el equipo ve su prioridad.", en: "In the sample, the lead gets a reply in under a second and the team sees its priority." },
  }),
  durationInFrames: USE_CASE_DURATION,
};

const coldLeadRevival: UseCaseFilmScript = {
  id: "cold-lead-revival",
  kind: "example",
  seenIn: [
    { slug: "ad-media-solution", chapter: "speed-to-lead" },
    { slug: "new-brothers-barberia", chapter: "product" },
  ],
  category: { es: "CRM", en: "CRM" },
  title: { es: "Ningún lead se enfría", en: "No lead goes cold" },
  problem: {
    headline: { es: "Propuesta enviada. Pasaron 24 horas. Silencio.", en: "Proposal sent. 24 hours later. Silence." },
    visual: "stale-card",
    signals: [
      { es: "Propuesta enviada", en: "Proposal sent" },
      { es: "Sin actividad", en: "No activity" },
      { es: "Seguimiento: pendiente", en: "Follow-up: pending" },
    ],
  },
  diagnosis: {
    headline: { es: "Nadie tiene una alarma para el silencio.", en: "Nobody has an alarm for silence." },
    breakpoint: { es: "El seguimiento depende de la memoria del vendedor.", en: "Follow-up depends on the seller's memory." },
  },
  stages: stagesFromScenario("anti_ghosting_revival"),
  result: {
    headline: { es: "El CRM detecta el silencio y retoma la conversación con contexto.", en: "The CRM detects silence and resumes the conversation with context." },
    facts: [
      { value: { es: "24 h", en: "24 h" }, label: { es: "de silencio disparan la alerta", en: "of silence trigger the alert" } },
      { value: { es: "Contexto", en: "Context" }, label: { es: "de la última conversación", en: "from the last conversation" } },
      { value: { es: "Etapa", en: "Stage" }, label: { es: "actualizada en el pipeline", en: "updated in the pipeline" } },
    ],
  },
  chapters: buildChapters({
    problem: { es: "La propuesta salió, el prospecto no contestó y la tarjeta quedó quieta en el pipeline.", en: "The proposal went out, the prospect did not reply and the card sat still in the pipeline." },
    diagnosis: { es: "No había ninguna regla que detectara el silencio: el seguimiento dependía de acordarse.", en: "No rule detected silence: follow-up depended on remembering." },
    system: { es: "Un cron detecta la inactividad, recupera la objeción previa, redacta el mensaje y actualiza la etapa.", en: "A cron detects inactivity, retrieves the previous objection, drafts the message and updates the stage." },
    result: { es: "El seguimiento deja de depender de la memoria: el CRM lo dispara con contexto.", en: "Follow-up no longer depends on memory: the CRM triggers it with context." },
  }),
  durationInFrames: USE_CASE_DURATION,
};

export const USE_CASE_FILMS: UseCaseFilmScript[] = [barberCrm, afterHoursLead, coldLeadRevival];
