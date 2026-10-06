import { gridBoxes, inset, type Box, type FilmFormatName } from "@/lib/filmLayout";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { chipWidth, countLines, GLYPH, largestFit, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

/**
 * Muro de cifras verificadas: cada cifra en su baldosa (grilla de gridBoxes),
 * con el valor, el rótulo y la fuente en una banda de pie separada por una
 * línea. Puro: sin React ni Remotion.
 */

export type FactWallFact = {
  /** Valor ya formateado en el idioma del film (p. ej. "1.096", "4,33 M"). */
  value: string;
  label: string;
  /** De dónde sale la cifra (p. ej. "dossier del cliente"). */
  source: string;
};

export type FactWallData = {
  facts: FactWallFact[];
  language: FilmLanguage;
  /** Rótulo "Datos de ejemplo" cuando las cifras no son las publicadas. */
  sampleLabel?: string;
};

export type FactTileLayout = { tile: Box; value: TextBlock; label: TextBlock; rule: Box; source: TextBlock };

export type FactWallLayout = {
  tiles: FactTileLayout[];
  sample: TextBlock | null;
  blocks: LayoutBlock[];
};

const SOURCE_PREFIX: Record<FilmLanguage, string> = { es: "Fuente", en: "Source" };

/** Pie de cada baldosa: "Fuente: …" / "Source: …". */
export const sourceLine = (source: string, language: FilmLanguage) => `${SOURCE_PREFIX[language]}: ${source}`;

/** Columnas de la grilla según cantidad de cifras (4–8) y formato. */
export function factColumns(count: number, format: FilmFormatName) {
  if (format === "portrait") return count <= 3 ? 1 : 2;
  if (count <= 4) return count;
  if (count <= 6) return 3;
  return 4;
}

const SIZES = {
  landscape: { value: [92, 84, 76, 68, 60, 54, 48, 42, 38], label: [26, 24, 22, 20, 19, 18], source: [17, 16, 15], sample: 16, gap: 22, padX: 28, padY: 24, maxTile: 300 },
  portrait: { value: [112, 104, 96, 88, 80, 72, 64, 56, 50, 44], label: [32, 30, 28, 26, 24], source: [22, 21, 20], sample: 22, gap: 20, padX: 30, padY: 26, maxTile: 330 },
} as const;

/** Badge "Datos de ejemplo" (SampleBadge): una línea con relleno. */
export function sampleBadgeBox(label: string, size: number, x: number, y: number) {
  const padX = Math.round(size * 0.85);
  return { x, y, w: chipWidth(label, size, padX), h: textHeight(size, 1) + Math.round(size * 0.9) };
}

export function factWallLayout(box: Box, data: FactWallData, format: FilmFormatName): FactWallLayout {
  const spec = SIZES[format];
  const { facts, language } = data;
  const sources = facts.map((fact) => sourceLine(fact.source, language));

  // Badge de ejemplo abajo a la izquierda, en su propia banda.
  const sampleH = data.sampleLabel ? sampleBadgeBox(data.sampleLabel, spec.sample, 0, 0).h : 0;
  const sampleGap = data.sampleLabel ? spec.gap : 0;
  const grid: Box = { x: box.x, y: box.y, w: box.w, h: box.h - sampleH - sampleGap };

  const cols = factColumns(facts.length, format);
  const rows = Math.ceil(facts.length / cols);
  const tileW = (grid.w - spec.gap * (cols - 1)) / cols;
  const innerW = tileW - spec.padX * 2;
  const labelSize = largestFit(facts.map((fact) => fact.label), innerW, 2, [...spec.label]);
  const sourceSize = largestFit(sources, innerW, 2, [...spec.source]);
  const labelLines = Math.max(1, ...facts.map((fact) => countLines(fact.label, labelSize, innerW)));
  const sourceLines = Math.max(1, ...sources.map((source) => countLines(source, sourceSize, innerW)));
  const labelH = textHeight(labelSize, labelLines);
  const sourceH = textHeight(sourceSize, sourceLines);
  const gapValue = Math.round(labelSize * 0.5);
  const gapRule = Math.round(sourceSize * 0.9);

  // Alto disponible por baldosa (tope para que una sola fila no quede hueca).
  const freeTileH = (grid.h - spec.gap * (rows - 1)) / rows;
  const tileH = Math.min(freeTileH, spec.maxTile);
  const innerH = tileH - spec.padY * 2;
  const fixedH = gapValue + labelH + gapRule * 2 + 1 + sourceH;
  const valueLadder = spec.value.filter((size) => textHeight(size, 1, 1.06) + fixedH <= innerH);
  const valueSize = largestFit(
    facts.map((fact) => fact.value),
    innerW,
    1,
    valueLadder.length ? valueLadder : [spec.value[spec.value.length - 1]],
    GLYPH.digits,
  );
  const valueH = textHeight(valueSize, 1, 1.06);

  // La grilla se centra en vertical; la última fila incompleta, en horizontal.
  const gridH = rows * tileH + (rows - 1) * spec.gap;
  const area: Box = { x: grid.x, y: grid.y + Math.max(0, (grid.h - gridH) / 2), w: grid.w, h: gridH };
  const cells = gridBoxes(area, facts.length, { cols, gap: spec.gap, rowHeight: tileH });
  const lastCount = facts.length - (rows - 1) * cols;
  const lastShift = ((cols - lastCount) * (tileW + spec.gap)) / 2;

  const tiles = facts.map((fact, index): FactTileLayout => {
    const cell = cells[index];
    const tile = index >= (rows - 1) * cols ? { ...cell, x: cell.x + lastShift } : cell;
    const inner = inset(tile, spec.padX, spec.padY);
    const sourceBox: Box = { x: inner.x, y: inner.y + inner.h - sourceH, w: inner.w, h: sourceH };
    const rule: Box = { x: inner.x, y: sourceBox.y - gapRule - 1, w: inner.w, h: 1 };
    return {
      tile,
      value: textBlock(`fact.${index}.value`, { x: inner.x, y: inner.y, w: inner.w, h: valueH }, fact.value, valueSize, 1, GLYPH.digits),
      label: textBlock(`fact.${index}.label`, { x: inner.x, y: inner.y + valueH + gapValue, w: inner.w, h: labelH }, fact.label, labelSize, labelLines),
      rule,
      source: textBlock(`fact.${index}.source`, sourceBox, sources[index], sourceSize, sourceLines),
    };
  });

  const sample = data.sampleLabel
    ? textBlock("sample", sampleBadgeBox(data.sampleLabel, spec.sample, box.x, box.y + box.h - sampleH), data.sampleLabel, spec.sample, 1)
    : null;

  const blocks: LayoutBlock[] = tiles.flatMap((tile, index) => [
    { kind: "frame" as const, id: `fact.${index}.tile`, box: tile.tile },
    tile.value,
    tile.label,
    { kind: "media" as const, id: `fact.${index}.rule`, box: tile.rule },
    tile.source,
  ]);
  if (sample) blocks.push(sample);
  return { tiles, sample, blocks };
}
