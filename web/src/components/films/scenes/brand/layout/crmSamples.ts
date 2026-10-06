import type { FilmLanguage } from "@/data/films/filmTypes";
import { safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import type { BeforeAfterSide } from "./beforeAfterSplit";
import type { PipelineBoardData } from "./pipelineBoard";

/**
 * Datos de ejemplo de las escenas de CRM y agencia (ES/EN): los usan las
 * demos del laboratorio y los tests de layout. Son personas y flujos
 * inventados, siempre con el badge "Datos de ejemplo"; sin cifras ni métricas.
 */

export const CRM_SAMPLE_LABEL: Record<FilmLanguage, string> = { es: "Datos de ejemplo", en: "Sample data" };

/** Rótulos chicos de la interfaz que la escena localiza sola. */
export const BEFORE_AFTER_KICKERS: Record<FilmLanguage, { before: string; after: string }> = {
  es: { before: "Antes", after: "Después" },
  en: { before: "Before", after: "After" },
};

export const DEMO_PIPELINE: Record<FilmLanguage, Omit<PipelineBoardData, "sampleLabel">> = {
  es: {
    boardTitle: "Pipeline · Oportunidades",
    stages: [
      { id: "new", label: "Nuevo" },
      { id: "contacted", label: "Contactado" },
      { id: "booked", label: "Agendado" },
      { id: "won", label: "Cliente" },
    ],
    cards: [
      { id: "lucia", title: "Lucía M.", meta: "Presupuesto", tags: ["Web"], path: ["new", "contacted", "booked", "won"] },
      { id: "diego", title: "Diego R.", meta: "Consulta", tags: ["Meta Ads"], path: ["new", "contacted"] },
      { id: "sofia", title: "Sofía G.", meta: "Turno", tags: ["Instagram"], path: ["new"] },
      { id: "carla", title: "Carla S.", meta: "Demo", tags: ["WhatsApp"], path: ["contacted", "booked"] },
      { id: "martin", title: "Martín P.", meta: "Presupuesto", tags: ["Google"], path: ["booked", "won"] },
    ],
    workflow: {
      title: "Workflow",
      steps: [
        { label: "Lead entra al CRM", stage: "new" },
        { label: "Respuesta automática", stage: "contacted" },
        { label: "Turno agendado", stage: "booked" },
        { label: "Recordatorio por WhatsApp", stage: "booked" },
        { label: "Seguimiento y reseña", stage: "won" },
      ],
    },
  },
  en: {
    boardTitle: "Pipeline · Opportunities",
    stages: [
      { id: "new", label: "New" },
      { id: "contacted", label: "Contacted" },
      { id: "booked", label: "Booked" },
      { id: "won", label: "Won" },
    ],
    cards: [
      { id: "lucia", title: "Lucía M.", meta: "Quote", tags: ["Web"], path: ["new", "contacted", "booked", "won"] },
      { id: "diego", title: "Diego R.", meta: "First visit", tags: ["Meta Ads"], path: ["new", "contacted"] },
      { id: "sofia", title: "Sofía G.", meta: "Booking", tags: ["Instagram"], path: ["new"] },
      { id: "carla", title: "Carla S.", meta: "Demo", tags: ["WhatsApp"], path: ["contacted", "booked"] },
      { id: "martin", title: "Martín P.", meta: "Quote", tags: ["Google"], path: ["booked", "won"] },
    ],
    workflow: {
      title: "Workflow",
      steps: [
        { label: "Lead enters the CRM", stage: "new" },
        { label: "Instant reply", stage: "contacted" },
        { label: "Appointment booked", stage: "booked" },
        { label: "WhatsApp reminder", stage: "booked" },
        { label: "Follow-up and review", stage: "won" },
      ],
    },
  },
};

export const DEMO_BEFORE_AFTER: Record<FilmLanguage, { before: Omit<BeforeAfterSide, "kicker">; after: Omit<BeforeAfterSide, "kicker"> }> = {
  es: {
    before: {
      title: "El lead llega\ny se enfría",
      steps: [{ label: "Formulario web" }, { label: "Bandeja de entrada" }, { label: "Se pierde", tone: "loss" }],
    },
    after: {
      title: "Cada lead\nsigue un camino",
      steps: [{ label: "Formulario web" }, { label: "CRM" }, { label: "Agenda" }, { label: "Seguimiento", tone: "win" }],
    },
  },
  en: {
    before: {
      title: "Leads arrive\nand go cold",
      steps: [{ label: "Web form" }, { label: "Inbox" }, { label: "Gets lost", tone: "loss" }],
    },
    after: {
      title: "Every lead\nfollows a path",
      steps: [{ label: "Web form" }, { label: "CRM" }, { label: "Calendar" }, { label: "Follow-up", tone: "win" }],
    },
  },
};

/** Cajas con las que se prueban las escenas: la zona útil entera y la que queda bajo una banda de título. */
export function crmTestBoxes(format: FilmFormatName): Box[] {
  const safe = safeArea(format);
  const title = format === "portrait" ? 230 : 150;
  return [safe, { x: safe.x, y: safe.y + title, w: safe.w, h: safe.h - title }];
}
