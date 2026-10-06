import { inset, splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { sampleBadgeBox } from "./factWall";
import { chipWidth, countLines, flowBoxes, flowHeight, GLYPH, largestFit, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

/**
 * Grilla de QA ("98/98 chequeos"): una placa con una celda por chequeo, el
 * contador en su propia banda y las áreas revisadas como leyenda (sin cuentas
 * por área). Puro: sin React ni Remotion.
 */

export type ChecklistGridData = {
  total: number;
  passed: number;
  /** Áreas revisadas, solo como leyenda. */
  groups: string[];
  /** Rótulo bajo el contador (p. ej. "chequeos de QA superados"). */
  unitLabel: string;
  /** Título de la leyenda (p. ej. "Áreas revisadas"). */
  legendTitle?: string;
  language: FilmLanguage;
  sampleLabel?: string;
};

export type ChecklistGridLayout = {
  plate: Box;
  cells: Box[];
  counter: TextBlock;
  /** Tilde final junto al contador (gráfico). */
  done: Box | null;
  unit: TextBlock;
  legendTitle: TextBlock | null;
  chips: Array<{ frame: Box; text: TextBlock }>;
  sample: TextBlock | null;
  blocks: LayoutBlock[];
};

export const counterText = (passed: number, total: number, language: FilmLanguage) => `${formatFact({ value: passed }, language)}/${formatFact({ value: total }, language)}`;

/** Celdas cuadradas lo más grandes posible para `count` chequeos dentro del área. */
export function cellGrid(area: Box, count: number, maxCell: number, align: "center" | "start" = "center", gapRatio = 0.22) {
  let best = { cols: 1, rows: count, cell: 0 };
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const cell = Math.min(area.w / (cols + (cols - 1) * gapRatio), area.h / (rows + (rows - 1) * gapRatio), maxCell);
    if (cell > best.cell + 0.01) best = { cols, rows, cell };
  }
  const cell = Math.floor(best.cell);
  const gap = Math.max(3, Math.floor(cell * gapRatio));
  const w = best.cols * cell + (best.cols - 1) * gap;
  const h = best.rows * cell + (best.rows - 1) * gap;
  const plate = { x: align === "start" ? area.x : area.x + (area.w - w) / 2, y: area.y + (area.h - h) / 2, w, h };
  const cells = Array.from({ length: count }, (_, index) => ({
    x: plate.x + (index % best.cols) * (cell + gap),
    y: plate.y + Math.floor(index / best.cols) * (cell + gap),
    w: cell,
    h: cell,
  }));
  return { plate, cells, cols: best.cols };
}

const SIZES = {
  landscape: { counter: [128, 116, 104, 92, 80, 68], unit: [28, 26, 24, 22, 20], legend: 16, chip: [21, 20, 19, 18, 17], sample: 16, maxCell: 58, gap: 28 },
  portrait: { counter: [140, 128, 116, 104, 92, 80], unit: [34, 32, 30, 28, 26], legend: 21, chip: [27, 26, 25, 24, 23, 22], sample: 22, maxCell: 72, gap: 30 },
} as const;

export function checklistGridLayout(box: Box, data: ChecklistGridData, format: FilmFormatName): ChecklistGridLayout {
  const spec = SIZES[format];
  const portrait = format === "portrait";
  const final = counterText(data.passed, data.total, data.language);
  const [gridCol, infoCol] = portrait ? [box, box] : splitColumns(box, [1.5, 1], 64);
  const blocks: LayoutBlock[] = [];

  // Contador + tilde.
  const counterSize = largestFit([final], infoCol.w * 0.72, 1, [...spec.counter], GLYPH.digits);
  const counterH = textHeight(counterSize, 1, 1.06);
  const counterW = Math.min(infoCol.w, chipWidth(final, counterSize, 0, GLYPH.digits));
  const doneSize = Math.round(counterSize * 0.46);
  const counter = textBlock("counter", { x: infoCol.x, y: infoCol.y, w: counterW, h: counterH }, final, counterSize, 1, GLYPH.digits);
  const doneFits = counterW + 18 + doneSize <= infoCol.w;
  const done = doneFits ? { x: infoCol.x + counterW + 18, y: infoCol.y + (counterH - doneSize) / 2, w: doneSize, h: doneSize } : null;

  const unitSize = largestFit([data.unitLabel], infoCol.w, 2, [...spec.unit]);
  const unitLines = Math.min(2, countLines(data.unitLabel, unitSize, infoCol.w));
  const unit = textBlock("unit", { x: infoCol.x, y: counter.box.y + counterH + 6, w: infoCol.w, h: textHeight(unitSize, unitLines) }, data.unitLabel, unitSize, unitLines);
  const headBottom = unit.box.y + unit.box.h;

  // Leyenda: título (opcional) y pastillas con las áreas.
  const chipSize = largestFit(data.groups, infoCol.w - 40, 1, [...spec.chip]);
  const chipPad = Math.round(chipSize * 0.75);
  const chipH = textHeight(chipSize, 1) + Math.round(chipSize * 0.7);
  const chipWidths = data.groups.map((group) => Math.min(infoCol.w, chipWidth(group, chipSize, chipPad)));
  const legendTitleH = data.legendTitle ? textHeight(spec.legend, 1) : 0;
  const sampleBox = data.sampleLabel ? sampleBadgeBox(data.sampleLabel, spec.sample, 0, 0) : null;

  const placeChips = (top: number, bottomLimit: number) => {
    const area = { x: infoCol.x, y: top, w: infoCol.w, h: Math.max(0, bottomLimit - top) };
    return flowBoxes(area, chipWidths, chipH, 10) ?? flowBoxes({ ...area, h: 9999 }, chipWidths, chipH, 10) ?? [];
  };

  let legendTitle: TextBlock | null = null;
  let chipBoxes: Box[];
  let sample: TextBlock | null = null;
  let gridArea: Box;

  if (portrait) {
    // Retrato: contador arriba, grilla al medio, leyenda y badge abajo.
    const sampleH = sampleBox ? sampleBox.h + spec.gap : 0;
    const probe = placeChips(0, 9999);
    const legendH = (data.legendTitle ? legendTitleH + 14 : 0) + flowHeight(probe);
    const legendTop = box.y + box.h - sampleH - legendH;
    if (data.legendTitle) legendTitle = textBlock("legend.title", { x: box.x, y: legendTop, w: box.w, h: legendTitleH }, data.legendTitle, spec.legend, 1, GLYPH.upper);
    chipBoxes = placeChips(legendTop + (data.legendTitle ? legendTitleH + 14 : 0), box.y + box.h - sampleH);
    if (sampleBox && data.sampleLabel) sample = textBlock("sample", { ...sampleBox, x: box.x, y: box.y + box.h - sampleBox.h }, data.sampleLabel, spec.sample, 1);
    gridArea = { x: box.x, y: headBottom + spec.gap * 1.6, w: box.w, h: legendTop - spec.gap * 1.6 - (headBottom + spec.gap * 1.6) };
  } else {
    // Apaisado: grilla a la izquierda; contador, leyenda y badge a la derecha.
    let top = headBottom + 44;
    if (data.legendTitle) {
      legendTitle = textBlock("legend.title", { x: infoCol.x, y: top, w: infoCol.w, h: legendTitleH }, data.legendTitle, spec.legend, 1, GLYPH.upper);
      top += legendTitleH + 14;
    }
    const sampleTop = sampleBox ? box.y + box.h - sampleBox.h : box.y + box.h;
    chipBoxes = placeChips(top, sampleTop - spec.gap);
    if (sampleBox && data.sampleLabel) sample = textBlock("sample", { ...sampleBox, x: infoCol.x, y: sampleTop }, data.sampleLabel, spec.sample, 1);
    gridArea = gridCol;
  }

  const { plate, cells } = cellGrid(gridArea, data.total, spec.maxCell, portrait ? "start" : "center");

  // Apaisado: el bloque de contador y leyenda se centra a la altura de la grilla
  // (sin bajar del borde superior ni pisar el badge de abajo).
  let counterBox = counter.box;
  let doneBox = done;
  let unitBox = unit.box;
  if (!portrait) {
    const contentBottom = chipBoxes.length ? Math.max(...chipBoxes.map((chip) => chip.y + chip.h)) : unit.box.y + unit.box.h;
    const contentH = contentBottom - counter.box.y;
    const limit = (sample ? sample.box.y - spec.gap : box.y + box.h) - contentBottom;
    const shift = Math.max(0, Math.min(limit, plate.y + (plate.h - contentH) / 2 - counter.box.y));
    const move = (target: Box) => ({ ...target, y: target.y + shift });
    counterBox = move(counterBox);
    doneBox = doneBox ? move(doneBox) : null;
    unitBox = move(unitBox);
    if (legendTitle) legendTitle = { ...legendTitle, box: move(legendTitle.box) };
    chipBoxes = chipBoxes.map(move);
  }
  const counterAt = { ...counter, box: counterBox };
  const unitAt = { ...unit, box: unitBox };
  const chips = chipBoxes.map((frame, index) => ({
    frame,
    text: textBlock(`chip.${index}`, inset(frame, chipPad - 2, 0), data.groups[index], chipSize, 1),
  }));

  blocks.push({ kind: "media", id: "grid", box: plate }, counterAt, unitAt);
  if (doneBox) blocks.push({ kind: "media", id: "done", box: doneBox });
  if (legendTitle) blocks.push(legendTitle);
  for (const chip of chips) blocks.push({ kind: "frame", id: `${chip.text.id}.frame`, box: chip.frame }, chip.text);
  if (sample) blocks.push(sample);
  return { plate, cells, counter: counterAt, done: doneBox, unit: unitAt, legendTitle, chips, sample, blocks };
}
