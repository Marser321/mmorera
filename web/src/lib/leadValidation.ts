import type { ContactFormData } from "@/types";

export const PROJECT_STAGE_VALUES = ["idea", "new-version", "grow", "connect"] as const;
export const TEAM_CONTEXT_VALUES = ["solo", "small-team", "multiple-areas", "external-direction"] as const;
export const TIMELINE_VALUES = ["now", "1-3-months", "this-semester", "exploring"] as const;

export type ProjectStage = (typeof PROJECT_STAGE_VALUES)[number];
export type TeamContext = (typeof TEAM_CONTEXT_VALUES)[number];
export type ProjectTimeline = (typeof TIMELINE_VALUES)[number];
export type LeadField = "nombre" | "email" | "empresa" | "projectStage" | "teamContext" | "mensaje" | "timeline";

export interface NormalizedLead extends Omit<ContactFormData, "projectStage" | "teamContext" | "timeline"> {
  projectStage: ProjectStage;
  teamContext: TeamContext;
  timeline: ProjectTimeline;
}

export type LeadValidationResult =
  | { success: true; data: NormalizedLead }
  | { success: false; fieldErrors: Partial<Record<LeadField, string>> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number, collapse = false): string {
  const normalized = typeof value === "string"
    ? value.replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim().slice(0, maxLength)
    : "";
  return collapse ? normalized.replace(/\s+/g, " ") : normalized;
}

function isOneOf<T extends readonly string[]>(value: string, options: T): value is T[number] {
  return options.includes(value);
}

export function validateAndNormalizeLead(input: ContactFormData): LeadValidationResult {
  const nombre = clean(input.nombre, 80, true);
  const email = clean(input.email, 254, true).toLowerCase();
  const empresa = clean(input.empresa, 120, true);
  const mensaje = clean(input.mensaje, 2000);
  const projectStage = clean(input.projectStage, 32, true);
  const teamContext = clean(input.teamContext, 32, true);
  const timeline = clean(input.timeline, 32, true);
  const fieldErrors: Partial<Record<LeadField, string>> = {};

  if (nombre.length < 2) fieldErrors.nombre = "Ingresá un nombre de al menos 2 caracteres.";
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Ingresá un email válido.";
  if (mensaje.length < 20) fieldErrors.mensaje = "Contame un poco más: usá al menos 20 caracteres.";
  if (!isOneOf(projectStage, PROJECT_STAGE_VALUES)) fieldErrors.projectStage = "Elegí el momento actual del proyecto.";
  if (!isOneOf(teamContext, TEAM_CONTEXT_VALUES)) fieldErrors.teamContext = "Elegí cómo está compuesto el equipo.";
  if (!isOneOf(timeline, TIMELINE_VALUES)) fieldErrors.timeline = "Elegí un momento estimado de inicio.";

  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  return {
    success: true,
    data: {
      nombre,
      email,
      empresa: empresa || undefined,
      telefono: clean(input.telefono, 40, true) || undefined,
      servicios_interes: Array.isArray(input.servicios_interes)
        ? input.servicios_interes.map((service) => clean(service, 64, true)).filter(Boolean).slice(0, 12)
        : [],
      plan_seleccionado: clean(input.plan_seleccionado, 80, true) || undefined,
      mensaje,
      projectStage: projectStage as ProjectStage,
      teamContext: teamContext as TeamContext,
      timeline: timeline as ProjectTimeline,
      website: clean(input.website, 200, true) || undefined,
    },
  };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export const BRIEF_VALUE_LABELS = {
  projectStage: {
    idea: "Es una idea que todavía no existe",
    "new-version": "Ya existe y necesita una nueva versión",
    grow: "Funciona y necesita crecer",
    connect: "Varias piezas necesitan conectarse",
  },
  teamContext: {
    solo: "Lo lidera personalmente",
    "small-team": "Hay un equipo pequeño involucrado",
    "multiple-areas": "Participan varias áreas",
    "external-direction": "Busca dirección externa de punta a punta",
  },
  timeline: {
    now: "Quiere empezar ahora",
    "1-3-months": "En 1–3 meses",
    "this-semester": "Este semestre",
    exploring: "Está explorando",
  },
} as const;

export function composeLeadMessage(data: NormalizedLead): string {
  return [
    "[Project Context]",
    `Stage: ${BRIEF_VALUE_LABELS.projectStage[data.projectStage]}`,
    `Team: ${BRIEF_VALUE_LABELS.teamContext[data.teamContext]}`,
    `Timeline: ${BRIEF_VALUE_LABELS.timeline[data.timeline]}`,
    "",
    "Project:",
    data.mensaje,
  ].join("\n");
}
