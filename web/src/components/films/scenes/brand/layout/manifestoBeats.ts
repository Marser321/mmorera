import type { Box, FilmFormatName } from "@/lib/filmLayout";
import { blockHeight, centerY, fitFontSize, GLYPH_EM, LINE_HEIGHT, lineCount } from "./mediaShared";

/**
 * Geometría de ManifestoBeats (pura): una sola banda donde entra de a una
 * frase. Cada beat tiene su caja de etiqueta (opcional) y su caja de texto,
 * con el tamaño de letra más grande que entra en N líneas.
 */

export type ManifestoBeatText = { text: string; kicker?: string };

export type ManifestoBeatsData = {
  beats: ManifestoBeatText[];
  /** Máximo de líneas por frase. */
  maxLines?: number;
  align?: "left" | "center";
  /** Mismo tamaño para todas las frases (ritmo parejo). */
  uniformSize?: boolean;
  maxSize?: number;
  minSize?: number;
  /** Ancho de lectura máximo (px). */
  measure?: number;
};

export type ManifestoBeatBoxes = { kicker: Box | null; text: Box; size: number; kickerSize: number; lines: number };

export type ManifestoBeatsLayout = { band: Box; beats: ManifestoBeatBoxes[] };

/** Tracking de la etiqueta (em); el componente usa el mismo. */
export const MANIFESTO_KICKER_TRACKING = 0.24;

const DEFAULTS = {
  landscape: { maxLines: 3, maxSize: 84, minSize: 34, measure: 1180, kicker: 18 },
  portrait: { maxLines: 4, maxSize: 92, minSize: 42, measure: 936, kicker: 24 },
} as const;

export function manifestoBeatsLayout(box: Box, data: ManifestoBeatsData, format: FilmFormatName): ManifestoBeatsLayout {
  const d = DEFAULTS[format];
  const maxLines = data.maxLines ?? d.maxLines;
  const measure = Math.min(box.w, data.measure ?? d.measure);
  const kickerSize = d.kicker;
  const kickerBlock = blockHeight(kickerSize, 1, LINE_HEIGHT.label) + Math.round(kickerSize * 1.1);
  const anyKicker = data.beats.some((beat) => beat.kicker);

  const fitted = data.beats.map((beat) =>
    fitFontSize(beat.text, {
      width: measure,
      height: box.h - (anyKicker ? kickerBlock : 0),
      maxLines,
      max: data.maxSize ?? d.maxSize,
      min: data.minSize ?? d.minSize,
      lineHeight: LINE_HEIGHT.display,
      glyphEm: GLYPH_EM.display,
    }),
  );
  const uniform = Math.min(...fitted);
  const x = data.align === "center" ? box.x + (box.w - measure) / 2 : box.x;

  const sized = data.beats.map((beat, index) => {
    const size = data.uniformSize === false ? fitted[index] : uniform;
    const lines = Math.min(maxLines, lineCount(beat.text, size, measure, GLYPH_EM.display, maxLines));
    return { size, lines, textH: blockHeight(size, lines, LINE_HEIGHT.display) };
  });
  // Todas las frases arrancan en la misma línea (la del beat más alto, centrado en
  // la banda): el ojo no salta de un beat al otro.
  const tallest = Math.max(...sized.map((item) => item.textH)) + (anyKicker ? kickerBlock : 0);
  const top = centerY(box, tallest);
  const beats = data.beats.map((beat, index) => {
    const { size, lines, textH } = sized[index];
    const kicker = beat.kicker ? { x, y: top, w: measure, h: blockHeight(kickerSize, 1, LINE_HEIGHT.label) } : null;
    return { kicker, text: { x, y: top + (anyKicker ? kickerBlock : 0), w: measure, h: textH }, size, kickerSize, lines };
  });

  return { band: box, beats };
}

export type BeatTiming = { from: number; to: number };

/**
 * Tiempos saneados: cada beat termina antes de que empiece el siguiente y
 * todo queda dentro de la escena. Así dos frases nunca conviven en pantalla.
 */
export function manifestoSchedule(beats: BeatTiming[], duration: number): BeatTiming[] {
  const out: BeatTiming[] = [];
  let cursor = 0;
  beats.forEach((beat, index) => {
    const next = beats[index + 1];
    const from = Math.max(cursor, Math.max(0, beat.from));
    const to = Math.max(from, Math.min(beat.to, duration, next ? Math.max(from, next.from) : duration));
    out.push({ from, to });
    cursor = to;
  });
  return out;
}
