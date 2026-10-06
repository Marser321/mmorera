import { gridBoxes, inset, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { sampleBadgeBox } from "./factWall";
import { chipWidth, countLines, flowBoxes, flowHeight, GLYPH, MIN_TEXT, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

/**
 * Plantilla de guion como línea de tiempo segmentada: horizontal en
 * apaisado, vertical en retrato. Todos los segmentos tienen el mismo ancho
 * (no se insinúan duraciones); solo los que tienen un tiempo conocido lo
 * muestran. El cabezal corre por su propio riel, nunca sobre los rótulos.
 * Puro: sin React ni Remotion.
 */

export type ScriptSegment = { label: string; timing?: string };

export type ScriptTimelineData = {
  segments: ScriptSegment[];
  /** Contador (p. ej. 53 hooks). */
  counter?: { value: number; label: string };
  /** Desglose en pastillas (p. ej. 8 reels · 5 educativos · 3 VSL · 12 ads). */
  breakdown?: Array<{ value: number; label: string }>;
  /** Banda de control (p. ej. "Checklist de compliance"). */
  checklist?: { title: string; items: string[] };
  language: FilmLanguage;
  sampleLabel?: string;
};

export type ScriptSegmentLayout = { frame: Box; index: TextBlock; label: TextBlock; timing: TextBlock | null; tick: Box };

export type ScriptTimelineLayout = {
  orientation: "horizontal" | "vertical";
  counterValue: TextBlock | null;
  counterLabel: TextBlock | null;
  /** Pastillas del desglose: un solo texto "cifra rótulo" por pastilla. */
  breakdown: Array<{ frame: Box; text: TextBlock; value: string; label: string }>;
  segments: ScriptSegmentLayout[];
  /** Riel del cabezal (gráfico, sin texto). */
  rail: Box;
  checklist: { frame: Box; title: TextBlock; items: Array<{ icon: Box; text: TextBlock }> } | null;
  sample: TextBlock | null;
  blocks: LayoutBlock[];
};

export const segmentIndex = (index: number) => String(index + 1).padStart(2, "0");

/** Una densidad: tamaños y respiro. Se prueban de la más generosa a la más compacta. */
type Density = {
  counter: number;
  counterLabel: number;
  chip: number;
  label: number;
  index: number;
  timing: number;
  title: number;
  item: number;
  pad: number;
  gap: number;
  /** Columnas de la checklist (0 = todas en una fila). */
  checkCols: number;
  bandGap: [number, number];
};

const DENSITIES: Record<FilmFormatName, Density[]> = {
  landscape: [
    { counter: 96, counterLabel: 30, chip: 24, label: 32, index: 17, timing: 23, title: 17, item: 24, pad: 24, gap: 14, checkCols: 2, bandGap: [36, 64] },
    { counter: 88, counterLabel: 28, chip: 23, label: 30, index: 16, timing: 22, title: 16, item: 22, pad: 20, gap: 12, checkCols: 2, bandGap: [32, 58] },
    { counter: 84, counterLabel: 26, chip: 22, label: 28, index: 15, timing: 20, title: 15, item: 21, pad: 18, gap: 12, checkCols: 2, bandGap: [30, 54] },
    { counter: 76, counterLabel: 24, chip: 21, label: 26, index: 15, timing: 19, title: 15, item: 20, pad: 16, gap: 12, checkCols: 2, bandGap: [28, 48] },
    { counter: 68, counterLabel: 22, chip: 20, label: 24, index: 15, timing: 18, title: 15, item: 19, pad: 14, gap: 10, checkCols: 0, bandGap: [24, 40] },
    { counter: 60, counterLabel: 20, chip: 19, label: 22, index: 15, timing: 17, title: 15, item: 18, pad: 12, gap: 10, checkCols: 0, bandGap: [20, 36] },
    { counter: 54, counterLabel: 20, chip: 18, label: 20, index: 15, timing: 16, title: 15, item: 17, pad: 12, gap: 8, checkCols: 0, bandGap: [18, 30] },
  ],
  portrait: [
    { counter: 112, counterLabel: 34, chip: 29, label: 36, index: 21, timing: 27, title: 21, item: 29, pad: 26, gap: 14, checkCols: 1, bandGap: [34, 60] },
    { counter: 104, counterLabel: 32, chip: 28, label: 34, index: 20, timing: 26, title: 20, item: 27, pad: 22, gap: 12, checkCols: 1, bandGap: [30, 54] },
    { counter: 96, counterLabel: 30, chip: 27, label: 32, index: 20, timing: 25, title: 20, item: 26, pad: 20, gap: 12, checkCols: 1, bandGap: [28, 48] },
    { counter: 88, counterLabel: 28, chip: 26, label: 30, index: 20, timing: 24, title: 20, item: 25, pad: 18, gap: 10, checkCols: 2, bandGap: [26, 44] },
    { counter: 80, counterLabel: 28, chip: 25, label: 28, index: 20, timing: 23, title: 20, item: 24, pad: 16, gap: 10, checkCols: 2, bandGap: [24, 40] },
    { counter: 72, counterLabel: 26, chip: 24, label: 27, index: 20, timing: 22, title: 20, item: 23, pad: 14, gap: 8, checkCols: 2, bandGap: [22, 36] },
    { counter: 64, counterLabel: 24, chip: 23, label: 26, index: 20, timing: 22, title: 20, item: 22, pad: 12, gap: 8, checkCols: 2, bandGap: [20, 30] },
  ],
};

const SAMPLE_SIZE: Record<FilmFormatName, number> = { landscape: 16, portrait: 22 };
const RAIL: Record<FilmFormatName, number> = { landscape: 26, portrait: 30 };

type Part = { h: number; place: (top: number) => void };

function tryLayout(box: Box, data: ScriptTimelineData, format: FilmFormatName, d: Density, force: boolean): ScriptTimelineLayout | null {
  const portrait = format === "portrait";
  const n = data.segments.length;
  const parts: Part[] = [];
  const sampleSize = SAMPLE_SIZE[format];
  const sampleBox = data.sampleLabel ? sampleBadgeBox(data.sampleLabel, sampleSize, 0, 0) : null;
  const hasHead = Boolean(data.counter || data.breakdown?.length);
  let sample: TextBlock | null = null;

  // ── Cabecera: contador, desglose y badge de ejemplo (arriba a la derecha) ──
  let counterValue: TextBlock | null = null;
  let counterLabel: TextBlock | null = null;
  let breakdown: ScriptTimelineLayout["breakdown"] = [];
  if (hasHead) {
    const sampleRoom = sampleBox ? sampleBox.w + 28 : 0;
    const counterText = data.counter ? formatFact({ value: data.counter.value }, data.language) : "";
    const counterW = data.counter ? chipWidth(counterText, d.counter, 0, GLYPH.digits) : 0;
    const counterH = data.counter ? textHeight(d.counter, 1, 1.06) : 0;
    const labelX = box.x + counterW + 20;
    const labelW = data.counter ? (portrait ? box.x + box.w - labelX - sampleRoom : Math.min(320, box.w * 0.24, chipWidth(data.counter.label, d.counterLabel, 0))) : 0;
    if (data.counter && countLines(data.counter.label, d.counterLabel, labelW) > 2 && !force) return null;
    const labelLines = data.counter ? Math.min(2, countLines(data.counter.label, d.counterLabel, labelW)) : 0;
    const labelH = data.counter ? textHeight(d.counterLabel, labelLines) : 0;

    const chips = data.breakdown ?? [];
    const pad = Math.round(d.chip * 0.8);
    const chipParts = chips.map((chip) => {
      const value = formatFact({ value: chip.value }, data.language);
      const valueW = chipWidth(value, d.chip, 0, GLYPH.digits);
      const textW = chipWidth(chip.label, d.chip, 0);
      return { value, valueW, textW, w: pad * 2 + valueW + 8 + textW };
    });
    const chipH = textHeight(d.chip, 1) + Math.round(d.chip * 0.7);
    // Retrato (o sin contador): las pastillas van en su propia fila, hasta dos.
    // Apaisado: primero en la fila del contador; si no entran, en su propia fila debajo.
    const widths = chipParts.map((part) => part.w);
    const stackedArea = { x: box.x, y: 0, w: box.w - (data.counter ? 0 : sampleRoom), h: chipH * 2 + 12 };
    const inlineArea = { x: labelX + labelW + 44, y: 0, w: box.x + box.w - sampleRoom - (labelX + labelW + 44), h: chipH };
    const inline = !portrait && data.counter && chips.length ? flowBoxes(inlineArea, widths, chipH, 12) : null;
    const stacked = !inline && (portrait || !data.counter || chips.length > 0);
    const flowed = inline ?? (chips.length ? flowBoxes(stackedArea, widths, chipH, 12) : []);
    if (!flowed && !force) return null;
    const placed = flowed ?? [];
    const chipsH = flowHeight(placed);
    const firstRow = data.counter ? Math.max(counterH, labelH, sampleBox && stacked ? sampleBox.h : 0) : 0;
    const headH = stacked ? firstRow + (chips.length && data.counter ? 22 : 0) + Math.max(chipsH, data.counter ? 0 : (sampleBox?.h ?? 0)) : Math.max(firstRow, chipsH, sampleBox?.h ?? 0);
    parts.push({
      h: headH,
      place: (top) => {
        const rowH = stacked ? (data.counter ? firstRow : headH) : headH;
        if (data.counter) {
          counterValue = textBlock("counter.value", { x: box.x, y: top + (rowH - counterH) / 2, w: counterW, h: counterH }, counterText, d.counter, 1, GLYPH.digits);
          counterLabel = textBlock("counter.label", { x: labelX, y: top + (rowH - labelH) / 2, w: labelW, h: labelH }, data.counter.label, d.counterLabel, labelLines);
        }
        if (sampleBox && data.sampleLabel) sample = textBlock("sample", { ...sampleBox, x: box.x + box.w - sampleBox.w, y: top + (rowH - sampleBox.h) / 2 }, data.sampleLabel, sampleSize, 1);
        const chipTop = stacked ? top + (data.counter ? firstRow + 22 : 0) : top + (headH - chipsH) / 2;
        breakdown = placed.map((at, index) => {
          const frame = { ...at, y: chipTop + at.y };
          const part = chipParts[index];
          const text = `${part.value} ${chips[index].label}`;
          return { frame, text: textBlock(`chip.${index}`, { x: frame.x + pad - 2, y: frame.y, w: frame.w - (pad - 2) * 2, h: frame.h }, text, d.chip, 1), value: part.value, label: chips[index].label };
        });
      },
    });
  }

  // ── Línea de tiempo ──
  const segments: ScriptSegmentLayout[] = [];
  let rail: Box = { x: box.x, y: box.y, w: 0, h: 0 };
  const anyTiming = data.segments.some((segment) => segment.timing);
  const timings = data.segments.flatMap((segment) => (segment.timing ? [segment.timing] : []));
  const indexH = textHeight(d.index, 1);
  const railSize = RAIL[format];
  if (!portrait) {
    const cells = gridBoxes({ x: box.x, y: 0, w: box.w, h: 100 }, n, { cols: n, gap: d.gap });
    const innerW = (cells[0]?.w ?? box.w) - d.pad * 2;
    // Una palabra larga ("Mecanismo") achica solo los rótulos de segmento, hasta 8 px, sin bajar toda la densidad.
    const labelLadder = Array.from({ length: 5 }, (_, step) => Math.max(MIN_TEXT[format], d.label - step * 2));
    const labelSize = labelLadder.find((size) => data.segments.every((segment) => countLines(segment.label, size, innerW) <= 2)) ?? labelLadder[labelLadder.length - 1];
    const labelLines = data.segments.map((segment) => countLines(segment.label, labelSize, innerW));
    if ((labelLines.some((lines) => lines > 2) || timings.some((timing) => countLines(timing, d.timing, innerW) > 1)) && !force) return null;
    const lines = Math.max(1, ...labelLines.map((count) => Math.min(2, count)));
    const labelH = textHeight(labelSize, lines);
    const timingH = textHeight(d.timing, 1);
    const segH = d.pad * 2 + indexH + 10 + labelH + (anyTiming ? 10 + timingH : 0);
    const railGap = 16;
    parts.push({
      h: segH + railGap + railSize,
      place: (top) => {
        cells.forEach((cell, index) => {
          const frame = { x: cell.x, y: top, w: cell.w, h: segH };
          const inner = inset(frame, d.pad, d.pad);
          const segment = data.segments[index];
          segments.push({
            frame,
            index: textBlock(`segment.${index}.index`, { x: inner.x, y: inner.y, w: inner.w, h: indexH }, segmentIndex(index), d.index, 1, GLYPH.upper),
            label: textBlock(`segment.${index}.label`, { x: inner.x, y: inner.y + indexH + 10, w: inner.w, h: labelH }, segment.label, labelSize, lines),
            timing: segment.timing ? textBlock(`segment.${index}.timing`, { x: inner.x, y: inner.y + inner.h - timingH, w: inner.w, h: timingH }, segment.timing, d.timing, 1) : null,
            tick: { x: cell.x, y: top + segH + railGap, w: cell.w, h: railSize },
          });
        });
        rail = { x: box.x, y: top + segH + railGap, w: box.w, h: railSize };
      },
    });
  } else {
    const rowX = box.x + railSize + 22;
    const rowW = box.x + box.w - rowX;
    const indexW = chipWidth("00", d.index, 0, GLYPH.upper) + 6;
    const timingW = timings.length ? Math.max(...timings.map((timing) => chipWidth(timing, d.timing, 0))) : 0;
    const labelW = rowW - d.pad * 2 - indexW - 18 - (timingW ? timingW + 18 : 0);
    const labelLines = data.segments.map((segment) => countLines(segment.label, d.label, labelW));
    if (labelLines.some((lines) => lines > 2) && !force) return null;
    const rowH = d.pad * 2 + textHeight(d.label, Math.max(...labelLines.map((count) => Math.min(2, count))));
    const total = n * rowH + (n - 1) * d.gap;
    parts.push({
      h: total,
      place: (top) => {
        data.segments.forEach((segment, index) => {
          const frame = { x: rowX, y: top + index * (rowH + d.gap), w: rowW, h: rowH };
          const inner = inset(frame, d.pad, d.pad);
          const lines = Math.min(2, labelLines[index]);
          const lh = textHeight(d.label, lines);
          const th = textHeight(d.timing, 1);
          segments.push({
            frame,
            index: textBlock(`segment.${index}.index`, { x: inner.x, y: inner.y + (inner.h - indexH) / 2, w: indexW, h: indexH }, segmentIndex(index), d.index, 1, GLYPH.upper),
            label: textBlock(`segment.${index}.label`, { x: inner.x + indexW + 18, y: inner.y + (inner.h - lh) / 2, w: labelW, h: lh }, segment.label, d.label, lines),
            timing: segment.timing ? textBlock(`segment.${index}.timing`, { x: inner.x + inner.w - timingW, y: inner.y + (inner.h - th) / 2, w: timingW, h: th }, segment.timing, d.timing, 1) : null,
            tick: { x: box.x, y: frame.y, w: railSize, h: rowH },
          });
        });
        rail = { x: box.x, y: top, w: railSize, h: total };
      },
    });
  }

  // ── Checklist ──
  let checklist: ScriptTimelineLayout["checklist"] = null;
  if (data.checklist) {
    const { title, items } = data.checklist;
    const pad = d.pad + 4;
    const cols = Math.max(1, Math.min(items.length, d.checkCols || items.length));
    const inner = { x: box.x + pad, w: box.w - pad * 2 };
    const colGap = 28;
    const colW = (inner.w - (cols - 1) * colGap) / cols;
    const iconSize = Math.round(d.item * 1.05);
    const textW = colW - iconSize - 12;
    const lines = items.map((item) => countLines(item, d.item, textW));
    if (lines.some((count) => count > 2) && !force) return null;
    const rowCount = Math.ceil(items.length / cols);
    const rowLines = Array.from({ length: rowCount }, (_, row) => Math.max(...lines.slice(row * cols, row * cols + cols).map((count) => Math.min(2, count))));
    const titleH = textHeight(d.title, 1);
    const itemGap = 14;
    const itemsH = rowLines.reduce((sum, rowLine) => sum + textHeight(d.item, rowLine), 0) + itemGap * (rowCount - 1);
    const h = pad * 2 + titleH + 16 + itemsH;
    parts.push({
      h,
      place: (top) => {
        const frame = { x: box.x, y: top, w: box.w, h };
        let y = top + pad + titleH + 16;
        const placed: Array<{ icon: Box; text: TextBlock }> = [];
        rowLines.forEach((rowLine, row) => {
          for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            if (index >= items.length) break;
            const x = inner.x + col * (colW + colGap);
            const count = Math.min(2, lines[index]);
            placed.push({
              icon: { x, y: y + (textHeight(d.item, 1) - iconSize) / 2, w: iconSize, h: iconSize },
              text: textBlock(`check.${index}`, { x: x + iconSize + 12, y, w: textW, h: textHeight(d.item, count) }, items[index], d.item, count),
            });
          }
          y += textHeight(d.item, rowLine) + itemGap;
        });
        checklist = { frame, title: textBlock("check.title", { x: inner.x, y: top + pad, w: inner.w, h: titleH }, title, d.title, 1, GLYPH.upper), items: placed };
      },
    });
  }

  // ── Reparto vertical: el sobrante separa las bandas (con tope) y centra el bloque ──
  const bottomSample = sampleBox && !hasHead;
  const avail = box.h - (bottomSample && sampleBox ? sampleBox.h + d.bandGap[0] : 0);
  const content = parts.reduce((sum, part) => sum + part.h, 0);
  const minUsed = content + d.bandGap[0] * Math.max(0, parts.length - 1);
  if (minUsed > avail && !force) return null;
  const gap = parts.length > 1 ? Math.max(d.bandGap[0], Math.min(d.bandGap[1], (avail - content) / (parts.length - 1))) : 0;
  const used = content + gap * Math.max(0, parts.length - 1);
  let top = box.y + Math.max(0, (avail - used) / 2);
  for (const part of parts) {
    part.place(top);
    top += part.h + gap;
  }
  if (bottomSample && sampleBox && data.sampleLabel) sample = textBlock("sample", { ...sampleBox, x: box.x, y: box.y + box.h - sampleBox.h }, data.sampleLabel, sampleSize, 1);

  // TS no sigue las asignaciones hechas dentro de los closures: se releen acá.
  const head = { counterValue: counterValue as TextBlock | null, counterLabel: counterLabel as TextBlock | null, sample: sample as TextBlock | null };
  const check = checklist as ScriptTimelineLayout["checklist"];
  const blocks: LayoutBlock[] = [];
  if (head.counterValue) blocks.push(head.counterValue);
  if (head.counterLabel) blocks.push(head.counterLabel);
  for (const chip of breakdown) blocks.push({ kind: "frame", id: `${chip.text.id}.frame`, box: chip.frame }, chip.text);
  for (const segment of segments) {
    blocks.push({ kind: "frame", id: `${segment.label.id}.frame`, box: segment.frame }, segment.index, segment.label);
    if (segment.timing) blocks.push(segment.timing);
  }
  blocks.push({ kind: "media", id: "rail", box: rail });
  if (check) {
    blocks.push({ kind: "frame", id: "check.frame", box: check.frame }, check.title);
    for (const item of check.items) blocks.push({ kind: "media", id: `${item.text.id}.icon`, box: item.icon }, item.text);
  }
  if (head.sample) blocks.push(head.sample);
  return { orientation: portrait ? "vertical" : "horizontal", counterValue: head.counterValue, counterLabel: head.counterLabel, breakdown, segments, rail, checklist: check, sample: head.sample, blocks };
}

export function scriptTimelineLayout(box: Box, data: ScriptTimelineData, format: FilmFormatName): ScriptTimelineLayout {
  const densities = DENSITIES[format];
  for (const density of densities) {
    const layout = tryLayout(box, data, format, density, false);
    if (layout) return layout;
  }
  // Ninguna entra: la más compacta igual (el test de layout lo marca).
  return tryLayout(box, data, format, densities[densities.length - 1], true)!;
}
