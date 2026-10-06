/**
 * Modelo de los "films" de lanzamiento interactivos (Remotion Player).
 * Un film narra un caso en cuatro capítulos fijos —problema, diagnóstico,
 * sistema, resultado— para que todos compartan ritmo y lectura.
 */

export type FilmLanguage = "es" | "en";
export type Localized = { es: string; en: string };

export const FILM_FPS = 30;

/** Formatos de composición: 16:9 en escritorio, 4:5 en móvil. */
export const FILM_FORMATS = {
  landscape: { width: 1600, height: 900 },
  portrait: { width: 1080, height: 1350 },
} as const;
export type FilmFormat = keyof typeof FILM_FORMATS;

export type FilmChapterId = "problem" | "diagnosis" | "system" | "result";

export interface FilmChapter {
  id: FilmChapterId;
  label: Localized;
  /** Subtítulo HTML real: la narrativa queda en el DOM (SEO y accesibilidad). */
  caption: Localized;
  from: number;
  durationInFrames: number;
}

/** Duración de cada capítulo en frames (30 fps). */
export const CHAPTER_FRAMES: Record<FilmChapterId, number> = {
  problem: 6 * FILM_FPS,
  diagnosis: 5 * FILM_FPS,
  system: 12 * FILM_FPS,
  result: 6 * FILM_FPS,
};

export const CHAPTER_ORDER: FilmChapterId[] = ["problem", "diagnosis", "system", "result"];

export const CHAPTER_LABELS: Record<FilmChapterId, Localized> = {
  problem: { es: "Problema", en: "Problem" },
  diagnosis: { es: "Diagnóstico", en: "Diagnosis" },
  system: { es: "Sistema", en: "System" },
  result: { es: "Resultado", en: "Outcome" },
};

export type FilmProblemVisual = "chat" | "clock" | "stale-card";

export interface FilmStage {
  id: string;
  title: Localized;
  technology: string;
  summary: Localized;
  /** Solo en flujos de ejemplo: tiempos de la muestra, nunca métricas de negocio. */
  latencyMs?: number;
  httpStatus?: number;
  payload?: Record<string, unknown>;
}

export interface UseCaseFilmScript {
  id: string;
  /** "real": caso publicado y verificable. "example": flujo de muestra rotulado. */
  kind: "real" | "example";
  caseSlug?: string;
  /** Título del caso real (se valida contra PROJECT_CASES en los tests). */
  caseTitle?: Localized;
  category: Localized;
  title: Localized;
  problem: {
    headline: Localized;
    visual: FilmProblemVisual;
    /** Mensajes, avisos o etiquetas que dramatizan el problema. */
    signals: Localized[];
  };
  diagnosis: {
    headline: Localized;
    breakpoint: Localized;
    /** Opcional: el diagnóstico ordena las señales del problema en carriles. */
    lanes?: Array<{ label: Localized; signals: number[] }>;
  };
  stages: FilmStage[];
  result: {
    headline: Localized;
    facts: Array<{ value: Localized; label: Localized }>;
    /** Captura real del caso (solo films "real"). */
    screenshot?: string;
  };
  chapters: FilmChapter[];
  durationInFrames: number;
}

export interface OpeningBeat {
  id: string;
  label: Localized;
  caption: Localized;
  from: number;
  durationInFrames: number;
}

/** Arma los capítulos contiguos a partir de las duraciones estándar. */
export function buildChapters(captions: Record<FilmChapterId, Localized>): FilmChapter[] {
  let from = 0;
  return CHAPTER_ORDER.map((id) => {
    const chapter: FilmChapter = {
      id,
      label: CHAPTER_LABELS[id],
      caption: captions[id],
      from,
      durationInFrames: CHAPTER_FRAMES[id],
    };
    from += CHAPTER_FRAMES[id];
    return chapter;
  });
}

export const USE_CASE_DURATION = CHAPTER_ORDER.reduce((total, id) => total + CHAPTER_FRAMES[id], 0);

/** Ventanas del capítulo "Sistema" (frames relativos al inicio del capítulo). */
export const FLOW_TIMING = {
  nodesIn: 18,
  cablesIn: 54,
  travelStart: 110,
  travelEnd: 290,
} as const;

/** Frame (relativo al capítulo "Sistema") en el que el paquete enciende la etapa. */
export function nodeActivationFrame(index: number, total: number) {
  const segment = (FLOW_TIMING.travelEnd - FLOW_TIMING.travelStart) / Math.max(1, total - 1);
  return FLOW_TIMING.travelStart + index * segment;
}

/** Capítulo activo para un frame dado (el último cuyo inicio ya pasó). */
export function resolveChapterIndex(chapters: Array<{ from: number }>, frame: number): number {
  let index = 0;
  chapters.forEach((chapter, i) => {
    if (frame >= chapter.from) index = i;
  });
  return index;
}
