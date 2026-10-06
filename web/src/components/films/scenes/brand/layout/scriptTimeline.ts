import { gridBoxes, inset, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { sampleBadgeBox } from "./factWall";
import { chipWidth, countLines, flowBoxes, flowHeight, GLYPH, largestFit, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

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
  breakdown: Array<{ frame: Box; value: TextBlock; label: TextBlock }>;
  segments: ScriptSegmentLayout[];
  /** Riel del cabezal (gráfico, sin texto). */
  rail: Box;
  checklist: { frame: Box; title: TextBlock; items: Array<{ icon: Box; text: TextBlock }> } | null;
  sample: TextBlock | null;
  blocks: LayoutBlock[];
};

export const segmentIndex = (index: number) => String(index + 1).padStart(2, "0");

const SPEC = {
  landscape: {
    counter: [84, 76, 68, 60, 54],
    counterLabel: [26, 24, 22, 20],
    chip: [22, 21, 20, 19, 18],
    label: [28, 26, 24, 22, 20, 19],
    index: 15,
    timing: [20, 19, 18, 17, 16],
    title: 15,
    item: [21, 20, 19, 18, 17],
    sample: 16,
    rail: 26,
    gap: 12,
    pad: 18,
    band: [30, 54],
  },
  portrait: {
    counter: [104, 96, 88, 80, 72],
    counterLabel: [32, 30, 28, 26],
    chip: [28, 27, 26, 25, 24, 23],
    label: [34, 32, 30, 28, 27, 26],
    index: 20,
    timing: [26, 25, 24, 23, 22],
    title: 20,
    item: [27, 26, 25, 24, 23],
    sample: 22,
    rail: 30,
    gap: 12,
    pad: 22,
    band: [30, 54],
  },
} as const;

type Part = { h: number; place: (top: number) => void };

export function scriptTimelineLayout(box: Box, data: ScriptTimelineData, format: FilmFormatName): ScriptTimelineLayout {
  const spec = SPEC[format];
  const portrait = format === "portrait";
  const n = data.segments.length;
  const parts: Part[] = [];

  // ── Cabecera: contador y desglose ──
  let counterValue: TextBlock | null = null;
  let counterLabel: TextBlock | null = null;
  let breakdown: ScriptTimelineLayout["breakdown"] = [];
  if (data.counter || data.breakdown?.length) {
    const counterText = data.counter ? formatFact({ value: data.counter.value }, data.language) : "";
    const counterSize = data.counter ? largestFit([counterText], box.w * 0.25, 1, [...spec.counter], GLYPH.digits) : 0;
    const counterW = data.counter ? chipWidth(counterText, counterSize, 0, GLYPH.digits) : 0;
    const counterH = data.counter ? textHeight(counterSize, 1, 1.06) : 0;
    const labelX = box.x + counterW + 20;
    const labelW = data.counter ? (portrait ? box.x + box.w - labelX : Math.min(340, box.w * 0.26)) : 0;
    const labelSize = data.counter ? largestFit([data.counter.label], labelW, 2, [...spec.counterLabel]) : 0;
    const labelLines = data.counter ? Math.min(2, countLines(data.counter.label, labelSize, labelW)) : 0;
    const labelH = data.counter ? textHeight(labelSize, labelLines) : 0;

    const chips = data.breakdown ?? [];
    const chipArea = portrait || !data.counter ? { x: box.x, y: 0, w: box.w, h: 9999 } : { x: labelX + labelW + 40, y: 0, w: box.x + box.w - (labelX + labelW + 40), h: 9999 };
    let chipSize: number = spec.chip[spec.chip.length - 1];
    let placed: Box[] = [];
    const partsFor = (size: number) =>
      chips.map((chip) => {
        const value = formatFact({ value: chip.value }, data.language);
        const pad = Math.round(size * 0.8);
        const valueW = chipWidth(value, size, 0, GLYPH.digits);
        const textW = chipWidth(chip.label, size, 0);
        return { value, pad, valueW, textW, w: pad * 2 + valueW + 8 + textW };
      });
    const chipH = (size: number) => textHeight(size, 1) + Math.round(size * 0.7);
    for (const size of spec.chip) {
      const flowed = flowBoxes(chipArea, partsFor(size).map((part) => part.w), chipH(size), 12, portrait || !data.counter ? "start" : "end");
      if (flowed && flowHeight(flowed) <= chipH(size) * (portrait ? 2 : 1) + 12) {
        chipSize = size;
        placed = flowed;
        break;
      }
    }
    const chipParts = partsFor(chipSize);
    const chipsH = flowHeight(placed);
    const firstRow = Math.max(counterH, labelH);
    const stacked = portrait || !data.counter;
    const headH = stacked ? firstRow + (chips.length && data.counter ? 22 : 0) + chipsH : Math.max(firstRow, chipsH);
    parts.push({
      h: headH,
      place: (top) => {
        const rowH = stacked ? firstRow : headH;
        if (data.counter) {
          counterValue = textBlock("counter.value", { x: box.x, y: top + (rowH - counterH) / 2, w: counterW, h: counterH }, counterText, counterSize, 1, GLYPH.digits);
          counterLabel = textBlock("counter.label", { x: labelX, y: top + (rowH - labelH) / 2, w: labelW, h: labelH }, data.counter.label, labelSize, labelLines);
        }
        const chipTop = stacked ? top + firstRow + (data.counter ? 22 : 0) : top + (headH - chipsH) / 2;
        breakdown = placed.map((boxAt, index) => {
          const frame = { ...boxAt, y: chipTop + boxAt.y };
          const part = chipParts[index];
          return {
            frame,
            value: textBlock(`chip.${index}.value`, { x: frame.x + part.pad, y: frame.y, w: part.valueW, h: frame.h }, part.value, chipSize, 1, GLYPH.digits),
            label: textBlock(`chip.${index}.label`, { x: frame.x + part.pad + part.valueW + 8, y: frame.y, w: part.textW, h: frame.h }, chips[index].label, chipSize, 1),
          };
        });
      },
    });
  }

  // ── Línea de tiempo ──
  const segments: ScriptSegmentLayout[] = [];
  let rail: Box = { x: box.x, y: box.y, w: 0, h: 0 };
  const anyTiming = data.segments.some((segment) => segment.timing);
  const indexH = textHeight(spec.index, 1);
  if (!portrait) {
    const cells = gridBoxes({ x: box.x, y: 0, w: box.w, h: 100 }, n, { cols: n, gap: spec.gap });
    const innerW = (cells[0]?.w ?? box.w) - spec.pad * 2;
    const labelSize = largestFit(data.segments.map((segment) => segment.label), innerW, 2, [...spec.label]);
    const labelLines = Math.max(1, ...data.segments.map((segment) => Math.min(2, countLines(segment.label, labelSize, innerW))));
    const timings = data.segments.flatMap((segment) => (segment.timing ? [segment.timing] : []));
    const timingSize = timings.length ? largestFit(timings, innerW, 1, [...spec.timing]) : spec.timing[0];
    const labelH = textHeight(labelSize, labelLines);
    const timingH = textHeight(timingSize, 1);
    const segH = spec.pad * 2 + indexH + 10 + labelH + (anyTiming ? 10 + timingH : 0);
    const railGap = 16;
    parts.push({
      h: segH + railGap + spec.rail,
      place: (top) => {
        cells.forEach((cell, index) => {
          const frame = { x: cell.x, y: top, w: cell.w, h: segH };
          const inner = inset(frame, spec.pad, spec.pad);
          const segment = data.segments[index];
          segments.push({
            frame,
            index: textBlock(`segment.${index}.index`, { x: inner.x, y: inner.y, w: inner.w, h: indexH }, segmentIndex(index), spec.index, 1, GLYPH.upper),
            label: textBlock(`segment.${index}.label`, { x: inner.x, y: inner.y + indexH + 10, w: inner.w, h: labelH }, segment.label, labelSize, labelLines),
            timing: segment.timing ? textBlock(`segment.${index}.timing`, { x: inner.x, y: inner.y + inner.h - timingH, w: inner.w, h: timingH }, segment.timing, timingSize, 1) : null,
            tick: { x: cell.x, y: top + segH + railGap, w: cell.w, h: spec.rail },
          });
        });
        rail = { x: box.x, y: top + segH + railGap, w: box.w, h: spec.rail };
      },
    });
  } else {
    const railW = spec.rail;
    const rowX = box.x + railW + 22;
    const rowW = box.x + box.w - rowX;
    const indexW = chipWidth("00", spec.index, 0, GLYPH.upper) + 6;
    const timings = data.segments.flatMap((segment) => (segment.timing ? [segment.timing] : []));
    const timingSize = timings.length ? largestFit(timings, rowW * 0.36, 1, [...spec.timing]) : spec.timing[0];
    const timingW = timings.length ? Math.max(...timings.map((timing) => chipWidth(timing, timingSize, 0))) : 0;
    const labelW = rowW - spec.pad * 2 - indexW - 18 - (timingW ? timingW + 18 : 0);
    const labelSize = largestFit(data.segments.map((segment) => segment.label), labelW, 2, [...spec.label]);
    const labelLines = data.segments.map((segment) => Math.min(2, countLines(segment.label, labelSize, labelW)));
    const rowH = spec.pad * 2 + textHeight(labelSize, Math.max(...labelLines));
    const total = n * rowH + (n - 1) * spec.gap;
    parts.push({
      h: total,
      place: (top) => {
        data.segments.forEach((segment, index) => {
          const frame = { x: rowX, y: top + index * (rowH + spec.gap), w: rowW, h: rowH };
          const inner = inset(frame, spec.pad, spec.pad);
          const lh = textHeight(labelSize, labelLines[index]);
          segments.push({
            frame,
            index: textBlock(`segment.${index}.index`, { x: inner.x, y: inner.y + (inner.h - indexH) / 2, w: indexW, h: indexH }, segmentIndex(index), spec.index, 1, GLYPH.upper),
            label: textBlock(`segment.${index}.label`, { x: inner.x + indexW + 18, y: inner.y + (inner.h - lh) / 2, w: labelW, h: lh }, segment.label, labelSize, labelLines[index]),
            timing: segment.timing ? textBlock(`segment.${index}.timing`, { x: inner.x + inner.w - timingW, y: inner.y + (inner.h - textHeight(timingSize, 1)) / 2, w: timingW, h: textHeight(timingSize, 1) }, segment.timing, timingSize, 1) : null,
            tick: { x: box.x, y: frame.y, w: railW, h: rowH },
          });
        });
        rail = { x: box.x, y: top, w: railW, h: total };
      },
    });
  }

  // ── Checklist ──
  let checklist: ScriptTimelineLayout["checklist"] = null;
  if (data.checklist) {
    const { title, items } = data.checklist;
    const pad = spec.pad + 4;
    const cols = portrait ? 1 : Math.min(items.length, items.length > 4 ? 3 : 2);
    const inner = { x: box.x + pad, w: box.w - pad * 2 };
    const colW = (inner.w - (cols - 1) * 28) / cols;
    let itemSize: number = spec.item[spec.item.length - 1];
    for (const size of spec.item) {
      const textW = colW - Math.round(size * 1.05) - 12;
      if (items.every((item) => countLines(item, size, textW) <= 2)) {
        itemSize = size;
        break;
      }
    }
    const iconSize = Math.round(itemSize * 1.05);
    const textW = colW - iconSize - 12;
    const lines = items.map((item) => Math.min(2, countLines(item, itemSize, textW)));
    const rowCount = Math.ceil(items.length / cols);
    const rowLines = Array.from({ length: rowCount }, (_, row) => Math.max(...lines.slice(row * cols, row * cols + cols)));
    const titleH = textHeight(spec.title, 1);
    const itemGap = 14;
    const itemsH = rowLines.reduce((sum, rowLine) => sum + textHeight(itemSize, rowLine), 0) + itemGap * (rowCount - 1);
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
            const x = inner.x + col * (colW + 28);
            placed.push({
              icon: { x, y: y + (textHeight(itemSize, 1) - iconSize) / 2, w: iconSize, h: iconSize },
              text: textBlock(`check.${index}`, { x: x + iconSize + 12, y, w: textW, h: textHeight(itemSize, lines[index]) }, items[index], itemSize, lines[index]),
            });
          }
          y += textHeight(itemSize, rowLine) + itemGap;
        });
        checklist = { frame, title: textBlock("check.title", { x: inner.x, y: top + pad, w: inner.w, h: titleH }, title, spec.title, 1, GLYPH.upper), items: placed };
      },
    });
  }

  // ── Reparto vertical: el sobrante separa las bandas (con tope) y centra el bloque ──
  const sampleBox = data.sampleLabel ? sampleBadgeBox(data.sampleLabel, spec.sample, 0, 0) : null;
  const avail = box.h - (sampleBox ? sampleBox.h + spec.band[0] : 0);
  const content = parts.reduce((sum, part) => sum + part.h, 0);
  const gap = parts.length > 1 ? Math.max(spec.band[0], Math.min(spec.band[1], (avail - content) / (parts.length - 1))) : 0;
  const used = content + gap * Math.max(0, parts.length - 1);
  let top = box.y + Math.max(0, (avail - used) / 2);
  for (const part of parts) {
    part.place(top);
    top += part.h + gap;
  }
  const sample = sampleBox && data.sampleLabel ? textBlock("sample", { ...sampleBox, x: box.x, y: box.y + box.h - sampleBox.h }, data.sampleLabel, spec.sample, 1) : null;

  // TS no sigue las asignaciones dentro de los closures: se releen acá.
  const head = { counterValue: counterValue as TextBlock | null, counterLabel: counterLabel as TextBlock | null };
  const check = checklist as ScriptTimelineLayout["checklist"];
  const blocks: LayoutBlock[] = [];
  if (head.counterValue) blocks.push(head.counterValue);
  if (head.counterLabel) blocks.push(head.counterLabel);
  for (const chip of breakdown) blocks.push({ kind: "frame", id: `${chip.label.id}.frame`, box: chip.frame }, chip.value, chip.label);
  for (const segment of segments) {
    blocks.push({ kind: "frame", id: `${segment.label.id}.frame`, box: segment.frame }, segment.index, segment.label);
    if (segment.timing) blocks.push(segment.timing);
  }
  blocks.push({ kind: "media", id: "rail", box: rail });
  if (check) {
    blocks.push({ kind: "frame", id: "check.frame", box: check.frame }, check.title);
    for (const item of check.items) blocks.push({ kind: "media", id: `${item.text.id}.icon`, box: item.icon }, item.text);
  }
  if (sample) blocks.push(sample);
  return { orientation: portrait ? "vertical" : "horizontal", counterValue: head.counterValue, counterLabel: head.counterLabel, breakdown, segments, rail, checklist: check, sample, blocks };
}
