import { FILM_FPS, type Localized } from "./filmTypes";

const t = (es: string, en: string): Localized => ({ es, en });

/**
 * Guion de la cinemática de /campanas (Mario, 5/11): una persona puede llevar
 * toda la cuenta porque la máquina hace el volumen, y el criterio sigue siendo
 * humano. Las cifras son de muestra y lo dice el rótulo que queda en pantalla;
 * ninguna es un resultado de un cliente ni un porcentaje de mejora.
 */

export type CampanasSceneId = "before" | "question" | "machine" | "person" | "account" | "signature";

const SCENE_SECONDS: Array<[CampanasSceneId, number]> = [
  ["before", 11],
  ["question", 10],
  ["machine", 11],
  ["person", 20],
  ["account", 11],
  ["signature", 7],
];

const LABELS: Record<CampanasSceneId, Localized> = {
  before: t("Antes", "Before"),
  question: t("Una pregunta", "One question"),
  machine: t("La máquina", "The machine"),
  person: t("La persona", "The person"),
  account: t("Toda la cuenta", "The whole account"),
  signature: t("El criterio", "The judgment"),
};

const CAPTIONS: Record<CampanasSceneId, Localized> = {
  before: t(
    "Lunes por la mañana: Meta, Google, Analytics, el CRM y una planilla. Armar el reporte a mano puede llevarse la mañana, y cuando llega, el dato ya es viejo.",
    "Monday morning: Meta, Google, Analytics, the CRM and a spreadsheet. Building the report by hand can take all morning, and by the time it's done the data is old."
  ),
  question: t(
    "Ahora la cuenta se consulta con una pregunta. Conectado a las plataformas y al CRM, un modelo lee todo en segundos.",
    "Now you query the account with one question. Connected to the platforms and the CRM, a model reads everything in seconds."
  ),
  machine: t(
    "La máquina encuentra lo que cambió: un anuncio cansado, una búsqueda que gasta y una campaña que responde. Y propone qué hacer con cada cosa.",
    "The machine finds what changed: a tired ad, a search burning budget and a campaign that's responding. And it proposes what to do about each one."
  ),
  person: t(
    "Cada propuesta pasa por una persona. La máquina sabe qué pasó en la cuenta. No sabe que la promo termina el viernes ni qué leads cerraron por WhatsApp.",
    "Every proposal goes through a person. The machine knows what happened in the account. It doesn't know the promo ends on Friday or which leads closed on WhatsApp."
  ),
  account: t(
    "Campañas, creatividades, presupuesto, reportes, alertas y CRM pueden quedar en manos de una sola persona: la máquina hace el volumen y ella decide.",
    "Campaigns, creative, budget, reports, alerts and CRM can stay with one person: the machine does the volume and they decide."
  ),
  signature: t(
    "La máquina hace el volumen. El criterio sigue siendo humano.",
    "The machine does the volume. The judgment stays human."
  ),
};

let cursor = 0;
export const CAMPANAS_CHAPTERS = SCENE_SECONDS.map(([id, seconds]) => {
  const chapter = { id, label: LABELS[id], caption: CAPTIONS[id], from: cursor, durationInFrames: seconds * FILM_FPS };
  cursor += chapter.durationInFrames;
  return chapter;
});

export const CAMPANAS_DURATION = cursor;

export const campanasChapter = (id: CampanasSceneId) => CAMPANAS_CHAPTERS.find((chapter) => chapter.id === id)!;

export interface CampanasDecision {
  id: string;
  proposal: Localized;
  approved: boolean;
  verdict: Localized;
  reason: Localized;
}

export const CAMPANAS_FILM = {
  badge: t("Datos de ejemplo", "Sample data"),
  before: {
    kicker: t("Antes", "Before"),
    headline: t("Cinco pestañas, una planilla y una mañana para saber qué pasó.", "Five tabs, one spreadsheet and a whole morning to learn what happened."),
    tabs: ["Meta Ads", "Google Ads", "Analytics", "CRM"],
    sheet: t("reporte-semanal.xlsx", "weekly-report.xlsx"),
    clock: t("armando el reporte", "building the report"),
  },
  question: {
    kicker: t("Ahora", "Now"),
    headline: t("Ahora la cuenta se lee con una pregunta.", "Now the account answers one question."),
    prompt: t("¿Qué cambió esta semana y qué harías?", "What changed this week, and what would you do?"),
    sources: ["Meta Ads", "Google Ads", "TikTok Ads", "Analytics", "CRM"],
    counters: [
      { value: 12, label: t("campañas", "campaigns") },
      { value: 86, label: t("anuncios", "ads") },
      { value: 214, label: t("leads", "leads") },
    ],
    seconds: 4,
    elapsed: t("segundos", "seconds"),
  },
  machine: {
    kicker: t("Lo que ve la máquina", "What the machine sees"),
    headline: t("En segundos encuentra lo que cambió.", "In seconds it finds what changed."),
    chart: t("Costo por lead · 8 semanas", "Cost per lead · 8 weeks"),
    /** Serie de muestra: solo dibuja la forma, no lleva cifras de negocio. */
    series: [34, 31, 33, 30, 29, 31, 38, 44],
    findings: [
      { id: "tired", title: t("Un anuncio cansado", "A tired ad"), detail: t("La misma pieza, vista demasiadas veces.", "Same creative, seen too many times."), metric: t("Frecuencia 5,1", "Frequency 5.1") },
      { id: "burn", title: t("Una búsqueda que gasta", "A search burning budget"), detail: t("Se lleva presupuesto y no muestra leads.", "It takes budget and shows no leads."), metric: t("USD 180", "USD 180") },
      { id: "rising", title: t("Una campaña que responde", "A campaign responding"), detail: t("Las consultas suben desde el martes.", "Enquiries are up since Tuesday."), metric: t("31 leads", "31 leads") },
    ],
  },
  person: {
    kicker: t("Lo que decide una persona", "What a person decides"),
    headline: t("La máquina sabe qué pasó. No sabe que el viernes termina tu promo.", "The machine knows what happened. It doesn't know your promo ends on Friday."),
    proposes: t("Propone la máquina", "The machine proposes"),
    decides: t("Decide una persona", "A person decides"),
    decisions: [
      { id: "tired", proposal: t("Cambiar el anuncio cansado", "Replace the tired ad"), approved: true, verdict: t("Aprobado", "Approved"), reason: t("Tiene razón. Sale una pieza nueva.", "It's right. A new piece goes out.") },
      { id: "burn", proposal: t("Pausar la búsqueda que gasta", "Pause the search burning budget"), approved: false, verdict: t("No se pausa", "Stays on"), reason: t("Esos leads cerraron por WhatsApp. Está en el CRM.", "Those leads closed on WhatsApp. It's in the CRM.") },
      { id: "rising", proposal: t("Subir el presupuesto de la campaña", "Raise the campaign budget"), approved: false, verdict: t("No se sube", "Stays put"), reason: t("La promo termina el viernes.", "The promo ends on Friday.") },
    ] satisfies CampanasDecision[],
  },
  account: {
    kicker: t("Toda la cuenta", "The whole account"),
    headline: t("Lo que antes pedía un equipo, hoy lo coordina una persona con criterio.", "What used to take a team, one person with judgment can now coordinate."),
    center: t("Una persona", "One person"),
    nodes: [
      t("Campañas", "Campaigns"),
      t("Creatividades", "Creative"),
      t("Presupuesto", "Budget"),
      t("Reportes", "Reports"),
      t("Alertas", "Alerts"),
      t("CRM", "CRM"),
    ],
  },
  signature: {
    first: t("La máquina hace el volumen.", "The machine does the volume."),
    second: t("El criterio sigue siendo humano.", "The judgment stays human."),
    name: "Mario Morera",
  },
};
