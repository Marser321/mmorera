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

const bookingDeposit: UseCaseFilmScript = {
  id: "booking-deposit",
  kind: "real",
  caseSlug: "new-brothers-barberia",
  caseTitle: { es: "New Brothers Barbería", en: "New Brothers Barbershop" },
  category: { es: "Automatización", en: "Automation" },
  title: { es: "Reserva con seña, sin idas y vueltas", en: "Booking with a deposit, no back-and-forth" },
  problem: {
    headline: { es: "Reservar era una conversación.", en: "Booking used to be a conversation." },
    visual: "chat",
    signals: [
      { es: "¿Hay lugar el sábado?", en: "Any slot on Saturday?" },
      { es: "¿Con qué barbero?", en: "Which barber?" },
      { es: "¿Me confirmás el horario?", en: "Can you confirm the time?" },
      { es: "¿Cómo pago la seña?", en: "How do I pay the deposit?" },
      { es: "¿Sigue en pie?", en: "Is it still on?" },
    ],
  },
  diagnosis: {
    headline: { es: "Disponibilidad, confirmación y seña vivían en el mismo chat.", en: "Availability, confirmation and deposit lived in the same chat." },
    breakpoint: { es: "Tres decisiones mezcladas en un solo hilo.", en: "Three decisions mixed into one thread." },
    lanes: [
      { label: { es: "Disponibilidad", en: "Availability" }, signals: [0, 1] },
      { label: { es: "Confirmación", en: "Confirmation" }, signals: [2, 4] },
      { label: { es: "Seña", en: "Deposit" }, signals: [3] },
    ],
  },
  stages: [
    {
      id: "selector",
      title: { es: "Barbero y servicio", en: "Barber and service" },
      technology: "Next.js · PWA",
      summary: { es: "Una decisión por paso, pensada para el teléfono.", en: "One decision per step, designed for mobile." },
    },
    {
      id: "slot-lock",
      title: { es: "Turno bloqueado", en: "Slot on hold" },
      technology: "PostgreSQL · row lock",
      summary: { es: "El turno queda reservado mientras se paga: nadie más lo puede tomar.", en: "The slot is held while paying: nobody else can take it." },
    },
    {
      id: "deposit",
      title: { es: "Seña confirmada", en: "Deposit confirmed" },
      technology: "Stripe · webhook",
      summary: { es: "El webhook confirma el pago y cambia el estado de la reserva.", en: "The webhook confirms the payment and updates the booking state." },
    },
    {
      id: "reminder",
      title: { es: "Recordatorio", en: "Reminder" },
      technology: "Cron · WhatsApp",
      summary: { es: "Aviso previo con ubicación y opción de reagendar.", en: "Advance notice with location and a reschedule option." },
    },
  ],
  result: {
    headline: { es: "La reserva se vuelve autoservicio y deja claro qué está confirmado.", en: "Booking becomes self-service and makes clear what is confirmed." },
    facts: [
      { value: { es: "1", en: "1" }, label: { es: "decisión por paso", en: "decision per step" } },
      { value: { es: "Seña", en: "Deposit" }, label: { es: "antes de ocupar la silla", en: "before the chair is taken" } },
      { value: { es: "Estado", en: "State" }, label: { es: "explícito en cada cambio", en: "explicit at every change" } },
    ],
    screenshot: "/portfolio/shots/new-brothers-barberia-mobile-1.jpg",
  },
  chapters: buildChapters({
    problem: { es: "Cada reserva arrancaba con un ida y vuelta por chat: horario, barbero, confirmación y seña.", en: "Every booking started with back-and-forth chat: time, barber, confirmation and deposit." },
    diagnosis: { es: "El problema no era el chat: eran tres decisiones distintas mezcladas en un mismo hilo.", en: "The chat was not the problem: three different decisions were mixed in one thread." },
    system: { es: "Separé el recorrido en pasos: elegir, bloquear el turno, pagar la seña y recibir el recordatorio.", en: "I split the journey into steps: choose, hold the slot, pay the deposit and get the reminder." },
    result: { es: "La reserva se vuelve autoservicio y deja claro qué está confirmado y qué falta.", en: "Booking becomes self-service and clearly shows what is confirmed and what remains." },
  }),
  durationInFrames: USE_CASE_DURATION,
};

const afterHoursLead: UseCaseFilmScript = {
  id: "after-hours-lead",
  kind: "example",
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

export const USE_CASE_FILMS: UseCaseFilmScript[] = [bookingDeposit, afterHoursLead, coldLeadRevival];
