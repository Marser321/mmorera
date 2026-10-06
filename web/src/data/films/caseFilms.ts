import type { CaseMedia } from "@/data/caseMedia";
import { isShowcaseWorthy, type CaseMetrics } from "@/data/caseMetrics";
import type { ProjectCase, TrackId } from "@/types/site";
import { FILM_FPS, type Localized } from "./filmTypes";

/**
 * Film "Cómo lo resolví" de cada caso de éxito. Se arma solo con datos
 * publicados del caso (projectCases), sus medios grabados en vivo
 * (caseMedia) y —si pasan el umbral del sitio— sus métricas reales.
 * Ritmo lento a propósito: cada idea respira antes de la siguiente.
 */

export type CaseChapterId = "challenge" | "constraints" | "decisions" | "product" | "proof" | "outcome";

export interface CaseFilmChapter {
  id: CaseChapterId;
  label: Localized;
  caption: Localized;
  from: number;
  durationInFrames: number;
}

/** Escenas del timeline (algunas viven dentro de un capítulo: apertura y firma). */
export interface CaseFilmTimeline {
  coldOpen: { from: number; duration: number };
  challenge: { from: number; duration: number };
  constraints: { from: number; duration: number };
  decisions: { from: number; duration: number };
  product: { from: number; duration: number };
  proof: { from: number; duration: number } | null;
  outcome: { from: number; duration: number };
  signature: { from: number; duration: number };
}

export interface CaseFilmScript {
  slug: string;
  title: Localized;
  summary: Localized;
  tracks: TrackId[];
  role: Localized;
  challenge: Localized;
  constraints: Localized[];
  decisions: Localized[];
  result: Localized;
  stack: string[];
  hostname: string | null;
  reel: { mp4: string; poster: string } | null;
  shots: { desktop: string[]; mobile: string[] };
  metrics: Pick<CaseMetrics, "performance" | "accessibility" | "bestPractices" | "seo" | "measuredAt"> | null;
  timeline: CaseFilmTimeline;
  chapters: CaseFilmChapter[];
  durationInFrames: number;
}

const s = (seconds: number) => Math.round(seconds * FILM_FPS);

export const CASE_SCENE_FRAMES = {
  coldOpen: s(5),
  challenge: s(7),
  constraints: s(6.5),
  decisions: s(8.5),
  product: s(10),
  proof: s(6),
  outcome: s(6),
  signature: s(4.5),
} as const;

export const CASE_CHAPTER_LABELS: Record<CaseChapterId, Localized> = {
  challenge: { es: "El reto", en: "The challenge" },
  constraints: { es: "Restricciones", en: "Constraints" },
  decisions: { es: "Decisiones", en: "Decisions" },
  product: { es: "El producto", en: "The product" },
  proof: { es: "La prueba", en: "The proof" },
  outcome: { es: "Resultado", en: "Outcome" },
};

export const TRACK_LABELS: Record<TrackId, Localized> = {
  create: { es: "Crear", en: "Create" },
  build: { es: "Construir", en: "Build" },
  scale: { es: "Escalar", en: "Scale" },
};

function hostnameOf(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const joinLocalized = (items: Localized[], separator: string): Localized => ({
  es: items.map((item) => item.es).join(separator),
  en: items.map((item) => item.en).join(separator),
});

export function buildCaseFilm(project: ProjectCase, media?: CaseMedia, metrics?: CaseMetrics): CaseFilmScript {
  const showProof = Boolean(metrics && isShowcaseWorthy(metrics));
  const hostname = hostnameOf(project.liveUrl);

  // Timeline contiguo; la prueba solo existe si las métricas están en verde.
  let cursor = 0;
  const take = (duration: number) => {
    const scene = { from: cursor, duration };
    cursor += duration;
    return scene;
  };
  const timeline: CaseFilmTimeline = {
    coldOpen: take(CASE_SCENE_FRAMES.coldOpen),
    challenge: take(CASE_SCENE_FRAMES.challenge),
    constraints: take(CASE_SCENE_FRAMES.constraints),
    decisions: take(CASE_SCENE_FRAMES.decisions),
    product: take(CASE_SCENE_FRAMES.product),
    proof: showProof ? take(CASE_SCENE_FRAMES.proof) : null,
    outcome: take(CASE_SCENE_FRAMES.outcome),
    signature: take(CASE_SCENE_FRAMES.signature),
  };
  const durationInFrames = cursor;

  const productCaption: Localized = hostname
    ? { es: `${project.role.es} En producción en ${hostname}.`, en: `${project.role.en} Live at ${hostname}.` }
    : project.role;

  const chapterParts: Array<Omit<CaseFilmChapter, "label">> = [
    { id: "challenge", caption: project.challenge, from: 0, durationInFrames: timeline.constraints.from },
    { id: "constraints", caption: joinLocalized(project.constraints, " "), from: timeline.constraints.from, durationInFrames: timeline.constraints.duration },
    { id: "decisions", caption: joinLocalized(project.decisions, " "), from: timeline.decisions.from, durationInFrames: timeline.decisions.duration },
    { id: "product", caption: productCaption, from: timeline.product.from, durationInFrames: timeline.product.duration },
    ...(timeline.proof && metrics
      ? [{
          id: "proof" as const,
          caption: {
            es: `Lighthouse mobile, medido el ${metrics.measuredAt}: rendimiento ${metrics.performance}, accesibilidad ${metrics.accessibility}, buenas prácticas ${metrics.bestPractices}, SEO ${metrics.seo}.`,
            en: `Lighthouse mobile, measured on ${metrics.measuredAt}: performance ${metrics.performance}, accessibility ${metrics.accessibility}, best practices ${metrics.bestPractices}, SEO ${metrics.seo}.`,
          },
          from: timeline.proof.from,
          durationInFrames: timeline.proof.duration,
        }]
      : []),
    { id: "outcome", caption: project.result, from: timeline.outcome.from, durationInFrames: durationInFrames - timeline.outcome.from },
  ];
  const chapters: CaseFilmChapter[] = chapterParts.map((chapter) => ({ ...chapter, label: CASE_CHAPTER_LABELS[chapter.id] }));

  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    tracks: project.tracks,
    role: project.role,
    challenge: project.challenge,
    constraints: project.constraints,
    decisions: project.decisions,
    result: project.result,
    stack: project.stack,
    hostname,
    reel: media ? { mp4: media.reel.mp4, poster: media.reel.poster } : null,
    shots: {
      desktop: media?.gallery.filter((shot) => shot.device === "desktop").map((shot) => shot.src) ?? [],
      mobile: media?.gallery.filter((shot) => shot.device === "mobile").map((shot) => shot.src) ?? [],
    },
    metrics: showProof && metrics
      ? { performance: metrics.performance, accessibility: metrics.accessibility, bestPractices: metrics.bestPractices, seo: metrics.seo, measuredAt: metrics.measuredAt }
      : null,
    timeline,
    chapters,
    durationInFrames,
  };
}
