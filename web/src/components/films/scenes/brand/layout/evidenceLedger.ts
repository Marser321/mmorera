import type { Box, FilmFormatName } from "@/lib/filmLayout";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { sampleBadgeBox } from "./factWall";
import { chipWidth, countLines, flowBoxes, flowHeight, GLYPH, largestFit, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

/**
 * Registro de evidencia por nivel: una cabecera con el total (y el desglose
 * por tema) y una fila por nivel —aprobado, señal, no establecido,
 * prohibido— con su marca de color, sus afirmaciones y una nota. Puro: sin
 * React ni Remotion.
 */

export type EvidenceTierId = "approved" | "signal" | "not-established" | "prohibited";

export type EvidenceTier = {
  id: EvidenceTierId;
  label: string;
  items: string[];
  note?: string;
};

export type EvidenceLedgerData = {
  tiers: EvidenceTier[];
  /** Total de afirmaciones del registro (p. ej. 109 afirmaciones). */
  total: { value: number; label: string };
  /** Desglose por tema (p. ej. HBOT 14 · edad biológica 16 · GLP-1 18). */
  breakdown?: Array<{ label: string; value: number }>;
  /** Rótulos de redacción: se muestran en los niveles aprobado y prohibido. */
  wording?: { allowed: string; prohibited: string };
  language: FilmLanguage;
  sampleLabel?: string;
};

export type TierRowLayout = {
  id: EvidenceTierId;
  card: Box;
  marker: Box;
  label: TextBlock;
  tag: { frame: Box; text: TextBlock } | null;
  items: Array<{ icon: Box; text: TextBlock }>;
  note: TextBlock | null;
};

export type EvidenceLedgerLayout = {
  totalValue: TextBlock;
  totalLabel: TextBlock;
  breakdown: Array<{ frame: Box; label: TextBlock; value: TextBlock }>;
  rows: TierRowLayout[];
  sample: TextBlock | null;
  blocks: LayoutBlock[];
};

/**
 * Colores de nivel: semánticos y apagados. Nunca dorado sobre contenido
 * biológico (el dorado de una marca no "aprueba" nada); lo prohibido va en un
 * rojo apagado. "No establecido" usa el gris de la marca (null).
 */
export const EVIDENCE_TONES: Record<EvidenceTierId, string | null> = {
  approved: "#6FA88A",
  signal: "#86A3C3",
  "not-established": null,
  prohibited: "#C4645C",
};

/** Rótulo de redacción de cada nivel (solo aprobado y prohibido lo llevan). */
export function tierTag(id: EvidenceTierId, wording: EvidenceLedgerData["wording"]) {
  if (!wording) return null;
  if (id === "approved") return wording.allowed;
  if (id === "prohibited") return wording.prohibited;
  return null;
}

type Step = { label: number; item: number; note: number; tag: number };

const SPEC = {
  landscape: {
    steps: [
      { label: 30, item: 22, note: 19, tag: 16 },
      { label: 28, item: 21, note: 18, tag: 15 },
      { label: 26, item: 20, note: 17, tag: 15 },
      { label: 24, item: 19, note: 16, tag: 14 },
      { label: 22, item: 18, note: 16, tag: 14 },
    ] as Step[],
    total: [84, 76, 68, 60, 54],
    totalLabel: [26, 24, 22, 20],
    chip: [22, 21, 20, 19, 18],
    sample: 16,
    padX: 26,
    padY: 18,
    headGap: 30,
    rowGap: [12, 22],
  },
  portrait: {
    steps: [
      { label: 36, item: 28, note: 24, tag: 21 },
      { label: 34, item: 27, note: 23, tag: 20 },
      { label: 32, item: 26, note: 22, tag: 20 },
      { label: 30, item: 25, note: 22, tag: 19 },
      { label: 28, item: 24, note: 21, tag: 19 },
      { label: 26, item: 23, note: 20, tag: 18 },
    ] as Step[],
    total: [104, 96, 88, 80, 72],
    totalLabel: [32, 30, 28, 26],
    chip: [28, 27, 26, 25, 24, 23],
    sample: 22,
    padX: 28,
    padY: 22,
    headGap: 34,
    rowGap: [14, 26],
  },
} as const;

const MARKER_W = 5;

export function evidenceLedgerLayout(box: Box, data: EvidenceLedgerData, format: FilmFormatName): EvidenceLedgerLayout {
  const spec = SPEC[format];
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  // ── Cabecera: total + rótulo, y desglose en pastillas ──
  const totalText = formatFact({ value: data.total.value }, data.language);
  const totalSize = largestFit([totalText], box.w * 0.3, 1, [...spec.total], GLYPH.digits);
  const totalW = chipWidth(totalText, totalSize, 0, GLYPH.digits);
  const totalH = textHeight(totalSize, 1, 1.06);
  const labelX = box.x + totalW + 20;
  const labelW = portrait ? box.x + box.w - labelX : Math.min(360, box.w * 0.28);
  const totalLabelSize = largestFit([data.total.label], labelW, 2, [...spec.totalLabel]);
  const totalLabelLines = Math.min(2, countLines(data.total.label, totalLabelSize, labelW));
  const totalLabelH = textHeight(totalLabelSize, totalLabelLines);

  const chipsData = data.breakdown ?? [];
  const chipArea = portrait
    ? { x: box.x, y: 0, w: box.w, h: 9999 }
    : { x: labelX + labelW + 40, y: 0, w: box.x + box.w - (labelX + labelW + 40), h: 9999 };
  let chipSize: number = spec.chip[spec.chip.length - 1];
  let chipBoxes: Box[] = [];
  const chipParts = (size: number) => {
    const pad = Math.round(size * 0.8);
    return chipsData.map((chip) => {
      const value = formatFact({ value: chip.value }, data.language);
      const labelW = chipWidth(chip.label, size, 0);
      const valueW = chipWidth(value, size, 0, GLYPH.digits);
      return { value, labelW, valueW, pad, w: pad * 2 + labelW + 10 + valueW };
    });
  };
  const chipH = (size: number) => textHeight(size, 1) + Math.round(size * 0.7);
  for (const size of spec.chip) {
    const parts = chipParts(size);
    const placed = flowBoxes(chipArea, parts.map((part) => part.w), chipH(size), 12, portrait ? "start" : "end");
    // En apaisado el desglose va en una fila; en retrato puede ocupar dos.
    if (placed && flowHeight(placed) <= chipH(size) * (portrait ? 2 : 1) + 12) {
      chipSize = size;
      chipBoxes = placed;
      break;
    }
  }
  const chipsH = flowHeight(chipBoxes);

  let headH: number;
  let chipTop: number;
  if (portrait) {
    const firstRow = Math.max(totalH, totalLabelH);
    chipTop = box.y + firstRow + (chipsData.length ? 22 : 0);
    headH = firstRow + (chipsData.length ? 22 + chipsH : 0);
  } else {
    headH = Math.max(totalH, totalLabelH, chipsH);
    chipTop = box.y + (headH - chipsH) / 2;
  }
  const firstRowH = portrait ? Math.max(totalH, totalLabelH) : headH;
  const totalValue = textBlock("total.value", { x: box.x, y: box.y + (firstRowH - totalH) / 2, w: totalW, h: totalH }, totalText, totalSize, 1, GLYPH.digits);
  const totalLabel = textBlock("total.label", { x: labelX, y: box.y + (firstRowH - totalLabelH) / 2, w: labelW, h: totalLabelH }, data.total.label, totalLabelSize, totalLabelLines);
  const chipPartsFinal = chipParts(chipSize);
  const breakdown = chipBoxes.map((placed, index) => {
    const frame = { ...placed, y: chipTop + (placed.y - chipArea.y) };
    const part = chipPartsFinal[index];
    const inner = { y: frame.y, h: frame.h };
    return {
      frame,
      label: textBlock(`breakdown.${index}.label`, { x: frame.x + part.pad, ...inner, w: part.labelW }, chipsData[index].label, chipSize, 1),
      value: textBlock(`breakdown.${index}.value`, { x: frame.x + part.pad + part.labelW + 10, ...inner, w: part.valueW }, part.value, chipSize, 1, GLYPH.digits),
    };
  });

  // ── Filas por nivel ──
  const sampleBox = data.sampleLabel ? sampleBadgeBox(data.sampleLabel, spec.sample, 0, 0) : null;
  const rowsTop = box.y + headH + spec.headGap;
  const rowsBottom = box.y + box.h - (sampleBox ? sampleBox.h + spec.rowGap[1] : 0);
  const rowsH = rowsBottom - rowsTop;
  const hasNotes = data.tiers.some((tier) => tier.note);
  const contentX = box.x + spec.padX + MARKER_W + 20;
  const contentW = box.x + box.w - spec.padX - contentX;

  type Draft = { height: number; build: (top: number, cardH: number) => TierRowLayout };
  const draftRow = (tier: EvidenceTier, index: number, step: Step): Draft | null => {
    const tag = tierTag(tier.id, data.wording);
    const tagPad = Math.round(step.tag * 0.75);
    const tagW = tag ? chipWidth(tag, step.tag, tagPad) : 0;
    const tagH = textHeight(step.tag, 1) + Math.round(step.tag * 0.6);
    const iconSize = Math.round(step.item * 0.95);
    const itemGap = Math.round(step.item * 0.5);

    if (!portrait) {
      const labelColW = Math.round(contentW * 0.24);
      const noteColW = hasNotes ? Math.round(contentW * 0.25) : 0;
      const itemsX = contentX + labelColW + 32;
      const itemsW = contentW - labelColW - 32 - (hasNotes ? noteColW + 32 : 0);
      const labelLines = countLines(tier.label, step.label, labelColW, GLYPH.text);
      if (labelLines > 2 || (tag && tagW > labelColW)) return null;
      const itemTextW = itemsW - iconSize - 14;
      const itemLines = tier.items.map((item) => countLines(item, step.item, itemTextW));
      if (itemLines.some((lines) => lines > 2)) return null;
      const noteLines = tier.note ? countLines(tier.note, step.note, noteColW) : 0;
      if (noteLines > 3) return null;
      const labelH = textHeight(step.label, labelLines);
      const labelBlockH = labelH + (tag ? 10 + tagH : 0);
      const itemsH = itemLines.reduce((sum, lines) => sum + textHeight(step.item, lines), 0) + itemGap * Math.max(0, tier.items.length - 1);
      const noteH = noteLines ? textHeight(step.note, noteLines) : 0;
      const height = Math.max(labelBlockH, itemsH, noteH) + spec.padY * 2;
      return {
        height,
        build: (top, cardH) => {
          const card = { x: box.x, y: top, w: box.w, h: cardH };
          const mid = (h: number) => top + (cardH - h) / 2;
          const labelTop = mid(labelBlockH);
          let y = mid(itemsH);
          const items = tier.items.map((item, itemIndex) => {
            const h = textHeight(step.item, itemLines[itemIndex]);
            const out = {
              icon: { x: itemsX, y: y + (textHeight(step.item, 1) - iconSize) / 2, w: iconSize, h: iconSize },
              text: textBlock(`tier.${index}.item.${itemIndex}`, { x: itemsX + iconSize + 14, y, w: itemTextW, h }, item, step.item, itemLines[itemIndex]),
            };
            y += h + itemGap;
            return out;
          });
          return {
            id: tier.id,
            card,
            marker: { x: box.x + spec.padX, y: top + spec.padY, w: MARKER_W, h: cardH - spec.padY * 2 },
            label: textBlock(`tier.${index}.label`, { x: contentX, y: labelTop, w: labelColW, h: labelH }, tier.label, step.label, labelLines),
            tag: tag
              ? {
                  frame: { x: contentX, y: labelTop + labelH + 10, w: tagW, h: tagH },
                  text: textBlock(`tier.${index}.tag`, { x: contentX + tagPad - 2, y: labelTop + labelH + 10, w: tagW - (tagPad - 2) * 2, h: tagH }, tag, step.tag, 1),
                }
              : null,
            items,
            note: tier.note ? textBlock(`tier.${index}.note`, { x: contentX + contentW - noteColW, y: mid(noteH), w: noteColW, h: noteH }, tier.note, step.note, noteLines) : null,
          };
        },
      };
    }

    // Retrato: cabecera (nivel + rótulo), afirmaciones debajo y la nota al pie.
    const labelW = contentW - (tag ? tagW + 20 : 0);
    const labelLines = countLines(tier.label, step.label, labelW);
    if (labelLines > 2 || (tag && tagW > contentW * 0.6)) return null;
    const itemTextW = contentW - iconSize - 14;
    const itemLines = tier.items.map((item) => countLines(item, step.item, itemTextW));
    if (itemLines.some((lines) => lines > 2)) return null;
    const noteLines = tier.note ? countLines(tier.note, step.note, contentW) : 0;
    if (noteLines > 2) return null;
    const labelH = textHeight(step.label, labelLines);
    const headerH = Math.max(labelH, tag ? tagH : 0);
    const itemsH = itemLines.reduce((sum, lines) => sum + textHeight(step.item, lines), 0) + itemGap * Math.max(0, tier.items.length - 1);
    const noteH = noteLines ? textHeight(step.note, noteLines) : 0;
    const height = spec.padY * 2 + headerH + 16 + itemsH + (noteH ? 14 + noteH : 0);
    return {
      height,
      build: (top, cardH) => {
        const offset = (cardH - height) / 2;
        const y0 = top + spec.padY + offset;
        let y = y0 + headerH + 16;
        const items = tier.items.map((item, itemIndex) => {
          const h = textHeight(step.item, itemLines[itemIndex]);
          const out = {
            icon: { x: contentX, y: y + (textHeight(step.item, 1) - iconSize) / 2, w: iconSize, h: iconSize },
            text: textBlock(`tier.${index}.item.${itemIndex}`, { x: contentX + iconSize + 14, y, w: itemTextW, h }, item, step.item, itemLines[itemIndex]),
          };
          y += h + itemGap;
          return out;
        });
        return {
          id: tier.id,
          card: { x: box.x, y: top, w: box.w, h: cardH },
          marker: { x: box.x + spec.padX, y: top + spec.padY, w: MARKER_W, h: cardH - spec.padY * 2 },
          label: textBlock(`tier.${index}.label`, { x: contentX, y: y0 + (headerH - labelH) / 2, w: labelW, h: labelH }, tier.label, step.label, labelLines),
          tag: tag
            ? {
                frame: { x: contentX + contentW - tagW, y: y0 + (headerH - tagH) / 2, w: tagW, h: tagH },
                text: textBlock(`tier.${index}.tag`, { x: contentX + contentW - tagW + tagPad - 2, y: y0 + (headerH - tagH) / 2, w: tagW - (tagPad - 2) * 2, h: tagH }, tag, step.tag, 1),
              }
            : null,
          items,
          note: tier.note ? textBlock(`tier.${index}.note`, { x: contentX, y: y - itemGap + 14, w: contentW, h: noteH }, tier.note, step.note, noteLines) : null,
        };
      },
    };
  };

  let rows: TierRowLayout[] = [];
  for (let stepIndex = 0; stepIndex < spec.steps.length; stepIndex++) {
    const step = spec.steps[stepIndex];
    const drafts = data.tiers.map((tier, index) => draftRow(tier, index, step));
    const last = stepIndex === spec.steps.length - 1;
    if (drafts.some((draft) => !draft) && !last) continue;
    const ready = drafts.filter((draft): draft is Draft => Boolean(draft));
    const n = ready.length;
    // Apaisado: filas de igual alto (se lee como un libro mayor).
    const heights = portrait ? ready.map((draft) => draft.height) : ready.map(() => Math.max(...ready.map((draft) => draft.height)));
    const minTotal = heights.reduce((sum, h) => sum + h, 0) + spec.rowGap[0] * Math.max(0, n - 1);
    if (minTotal > rowsH && !last) continue;
    const gap = n > 1 ? Math.min(spec.rowGap[1], Math.max(spec.rowGap[0], (rowsH - heights.reduce((sum, h) => sum + h, 0)) / (n - 1))) : 0;
    // El sobrante agranda las tarjetas un poco (máx. 40 px) y el resto centra el bloque.
    const spare = Math.max(0, rowsH - heights.reduce((sum, h) => sum + h, 0) - gap * Math.max(0, n - 1));
    const grow = Math.min(40, spare / Math.max(1, n));
    const usedH = heights.reduce((sum, h) => sum + h + grow, 0) + gap * Math.max(0, n - 1);
    let top = rowsTop + Math.max(0, (rowsH - usedH) / 2);
    rows = ready.map((draft, index) => {
      const row = draft.build(top, heights[index] + grow);
      top += heights[index] + grow + gap;
      return row;
    });
    break;
  }

  const sample = sampleBox && data.sampleLabel ? textBlock("sample", { ...sampleBox, x: box.x, y: box.y + box.h - sampleBox.h }, data.sampleLabel, spec.sample, 1) : null;

  blocks.push(totalValue, totalLabel);
  for (const chip of breakdown) blocks.push({ kind: "frame", id: `${chip.label.id}.frame`, box: chip.frame }, chip.label, chip.value);
  for (const row of rows) {
    blocks.push({ kind: "frame", id: `${row.label.id}.card`, box: row.card }, { kind: "media", id: `${row.label.id}.marker`, box: row.marker }, row.label);
    if (row.tag) blocks.push({ kind: "frame", id: `${row.tag.text.id}.frame`, box: row.tag.frame }, row.tag.text);
    for (const item of row.items) blocks.push({ kind: "media", id: `${item.text.id}.icon`, box: item.icon }, item.text);
    if (row.note) blocks.push(row.note);
  }
  if (sample) blocks.push(sample);
  return { totalValue, totalLabel, breakdown, rows, sample, blocks };
}
