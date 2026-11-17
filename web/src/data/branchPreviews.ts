/**
 * Imágenes de las tarjetas de /casos-de-uso y /lab, capturadas del propio
 * sitio por `npx tsx scripts/capture-branch-previews.ts`. Llevan texto, así
 * que hay una por idioma.
 */

/** El cuadro del film va en 4:3 y la demo, que es apaisada, en 2:1. */
export const BRANCH_PREVIEW_SIZE = {
  "use-case": { width: 1200, height: 900 },
  lab: { width: 1200, height: 600 },
} as const;

export function branchPreview(kind: "use-case" | "lab", id: string, language: "es" | "en") {
  return `/portfolio/previews/${kind}-${id}-${language}.webp`;
}

/**
 * Qué parte del cuadro del film va en la tarjeta de cada caso de uso (0–1 del
 * escenario): el gráfico del problema, sin el titular que la tarjeta ya dice.
 */
const PROBLEM_GRAPHIC = { x: 0.47, y: 0.14, width: 0.51, height: 0.68 } as const;

export const USE_CASE_CROP: Record<string, { x: number; y: number; width: number; height: number }> = {
  "barber-crm": PROBLEM_GRAPHIC,
  "after-hours-lead": PROBLEM_GRAPHIC,
  "cold-lead-revival": PROBLEM_GRAPHIC,
};

/** El panel de cada demo del Lab. */
export const LAB_PREVIEW_SELECTOR = { tokens: "#estudio-tokens-diseno", inbox: "#bandeja-unificada" } as const;
