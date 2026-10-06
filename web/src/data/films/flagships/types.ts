import { FILM_FPS, type FilmLanguage, type Localized } from "../filmTypes";

/**
 * Modelo común de los films insignia (uno por cliente). Cada film declara su
 * secuencia de escenas con un "tipo"; el test de flagships exige que dos
 * clientes nunca compartan la misma estructura (no es solo otra paleta).
 */

export type SceneKind =
  | "particle-open"
  | "cinematic-plate"
  | "problem-chat"
  | "booking-wizard"
  | "camera-reel"
  | "counter-panels"
  | "mechanism"
  | "evidence-ledger"
  | "manifesto"
  | "site-booking"
  | "architecture"
  | "keyword-search"
  | "script-timeline"
  | "fact-wall"
  | "checklist"
  | "pipeline-board"
  | "before-after"
  | "scroll-reel"
  | "shot-stack"
  | "outcome-facts"
  | "signature";

export interface FlagshipScene {
  id: string;
  kind: SceneKind;
  seconds: number;
}

export interface FlagshipChapter {
  id: string;
  label: Localized;
  caption: Localized;
  from: number;
  durationInFrames: number;
}

/** Una cifra publicada y de dónde sale (dossier, archivo del cliente o sitio). */
export interface FilmFact {
  value: number;
  /** Decimales con los que se muestra (p. ej. 4,33 M). */
  decimals?: number;
  source: string;
}

/** Medida nativa de un asset: la cámara nunca lo amplía más allá. */
export interface FilmAsset {
  src: string;
  w: number;
  h: number;
  fps?: number;
  seconds?: number;
}

export interface FlagshipFilm {
  slug: string;
  scenes: FlagshipScene[];
  chapters: FlagshipChapter[];
  durationInFrames: number;
}

export interface SceneSlot {
  from: number;
  duration: number;
}

/** Línea de tiempo contigua a partir de la lista de escenas. */
export function timelineFrom<Id extends string>(scenes: ReadonlyArray<{ id: Id; seconds: number }>) {
  const slots = {} as Record<Id, SceneSlot>;
  let from = 0;
  for (const scene of scenes) {
    const duration = Math.round(scene.seconds * FILM_FPS);
    slots[scene.id] = { from, duration };
    from += duration;
  }
  return { slots, durationInFrames: from };
}

/** Escena protagonista: la más larga (desempata la primera). */
export function heroScene(scenes: FlagshipScene[]) {
  return scenes.reduce((best, scene) => (scene.seconds > best.seconds ? scene : best), scenes[0]);
}

/**
 * Formatea una cifra en el idioma del film sin depender de la configuración
 * regional del navegador: 1.096 / 4,33 en español, 1,096 / 4.33 en inglés.
 */
export function formatFact(fact: Pick<FilmFact, "value" | "decimals">, language: FilmLanguage) {
  const decimals = fact.decimals ?? 0;
  const [integer, fraction] = fact.value.toFixed(decimals).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, language === "es" ? "." : ",");
  return fraction ? `${grouped}${language === "es" ? "," : "."}${fraction}` : grouped;
}
