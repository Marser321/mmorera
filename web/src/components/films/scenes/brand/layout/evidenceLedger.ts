import type { Box, FilmFormatName } from "@/lib/filmLayout";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { sampleBadgeBox } from "./factWall";
import { chipWidth, countLines, flowBoxes, flowHeight, GLYPH, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

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
  /** Pastillas del desglose: un solo texto "tema cifra" por pastilla. */
  breakdown: Array<{ frame: Box; text: TextBlock; label: string; value: string }>;
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

/** Una densidad: tamaños y respiro. Se prueban de la más generosa a la más compacta. */
type Density = {
  total: number;
  totalLabel: number;
  chip: number;
  label: number;
  item: number;
  note: number;
  tag: number;
  padY: number;
  rowGap: number;
  /** Afirmaciones en una o dos columnas. */
  itemCols: 1 | 2;
  noteLines: number;
};

const DENSITIES: Record<FilmFormatName, Density[]> = {
  landscape: [
    { total: 84, totalLabel: 26, chip: 22, label: 30, item: 22, note: 19, tag: 16, padY: 20, rowGap: 16, itemCols: 1, noteLines: 3 },
    { total: 76, totalLabel: 24, chip: 21, label: 28, item: 21, note: 18, tag: 16, padY: 18, rowGap: 14, itemCols: 1, noteLines: 3 },
    { total: 68, totalLabel: 22, chip: 20, label: 26, item: 20, note: 17, tag: 15, padY: 16, rowGap: 12, itemCols: 1, noteLines: 3 },
    { total: 68, totalLabel: 22, chip: 20, label: 26, item: 20, note: 17, tag: 15, padY: 16, rowGap: 12, itemCols: 2, noteLines: 3 },
    { total: 60, totalLabel: 20, chip: 19, label: 24, item: 19, note: 16, tag: 15, padY: 14, rowGap: 10, itemCols: 2, noteLines: 3 },
    { total: 54, totalLabel: 20, chip: 18, label: 22, item: 18, note: 16, tag: 15, padY: 12, rowGap: 10, itemCols: 2, noteLines: 3 },
  ],
  portrait: [
    { total: 104, totalLabel: 32, chip: 28, label: 36, item: 28, note: 24, tag: 22, padY: 24, rowGap: 18, itemCols: 1, noteLines: 2 },
    { total: 96, totalLabel: 30, chip: 27, label: 34, item: 27, note: 23, tag: 21, padY: 22, rowGap: 16, itemCols: 1, noteLines: 2 },
    { total: 88, totalLabel: 28, chip: 26, label: 32, item: 26, note: 22, tag: 21, padY: 20, rowGap: 14, itemCols: 1, noteLines: 2 },
    { total: 80, totalLabel: 28, chip: 25, label: 30, item: 25, note: 22, tag: 20, padY: 18, rowGap: 12, itemCols: 1, noteLines: 1 },
    { total: 76, totalLabel: 26, chip: 24, label: 30, item: 24, note: 22, tag: 20, padY: 18, rowGap: 12, itemCols: 2, noteLines: 1 },
    { total: 72, totalLabel: 26, chip: 23, label: 28, item: 23, note: 21, tag: 20, padY: 16, rowGap: 12, itemCols: 2, noteLines: 1 },
    { total: 64, totalLabel: 24, chip: 22, label: 26, item: 22, note: 20, tag: 20, padY: 14, rowGap: 10, itemCols: 2, noteLines: 1 },
  ],
};

const SAMPLE_SIZE: Record<FilmFormatName, number> = { landscape: 16, portrait: 22 };
const PAD_X: Record<FilmFormatName, number> = { landscape: 26, portrait: 28 };
const MARKER_W = 5;

type Head = Pick<EvidenceLedgerLayout, "totalValue" | "totalLabel" | "breakdown" | "sample"> & { h: number };
type Draft = { height: number; build: (top: number, cardH: number) => TierRowLayout };

/** Cabecera: total y rótulo, desglose en pastillas y el badge de ejemplo. Null si no entra. */
function headLayout(box: Box, data: EvidenceLedgerData, format: FilmFormatName, d: Density): Head | null {
  const portrait = format === "portrait";
  const totalText = formatFact({ value: data.total.value }, data.language);
  const totalW = chipWidth(totalText, d.total, 0, GLYPH.digits);
  const totalH = textHeight(d.total, 1, 1.06);
  const sampleSize = SAMPLE_SIZE[format];
  const sampleBox = data.sampleLabel ? sampleBadgeBox(data.sampleLabel, sampleSize, 0, 0) : null;
  const labelX = box.x + totalW + 20;
  const sampleRoom = sampleBox ? sampleBox.w + 28 : 0;
  const labelW = portrait ? box.x + box.w - labelX - sampleRoom : Math.min(320, box.w * 0.24, chipWidth(data.total.label, d.totalLabel, 0));
  if (!fitsIn(data.total.label, d.totalLabel, labelW, 2)) return null;
  const labelLines = Math.min(2, countLines(data.total.label, d.totalLabel, labelW));
  const labelH = textHeight(d.totalLabel, labelLines);

  const chips = data.breakdown ?? [];
  const pad = Math.round(d.chip * 0.8);
  const parts = chips.map((chip) => {
    const value = formatFact({ value: chip.value }, data.language);
    const labelW = chipWidth(chip.label, d.chip, 0);
    const valueW = chipWidth(value, d.chip, 0, GLYPH.digits);
    return { value, labelW, valueW, w: pad * 2 + labelW + 10 + valueW };
  });
  const chipH = textHeight(d.chip, 1) + Math.round(d.chip * 0.7);
  // Apaisado: primero en la fila del total; si no entran, en su propia fila debajo (como en retrato).
  const widths = parts.map((part) => part.w);
  const stackedArea = { x: box.x, y: 0, w: box.w, h: chipH * 2 + 12 };
  const inlineArea = { x: labelX + labelW + 44, y: 0, w: box.x + box.w - sampleRoom - (labelX + labelW + 44), h: chipH };
  const inline = !portrait && chips.length ? flowBoxes(inlineArea, widths, chipH, 12) : null;
  const stacked = portrait || (chips.length > 0 && !inline);
  const chipArea = stacked ? stackedArea : inlineArea;
  const placed = inline ?? (chips.length ? flowBoxes(stackedArea, widths, chipH, 12) : []);
  if (!placed) return null;
  const chipsH = flowHeight(placed);

  const firstRow = Math.max(totalH, labelH, sampleBox ? sampleBox.h : 0);
  const h = stacked ? firstRow + (chips.length ? 20 + chipsH : 0) : Math.max(firstRow, chipsH);
  const rowH = stacked ? firstRow : h;
  const chipTop = stacked ? box.y + firstRow + 20 : box.y + (h - chipsH) / 2;
  const breakdown = placed.map((at, index) => {
    const frame = { ...at, y: chipTop + (at.y - chipArea.y) };
    const part = parts[index];
    const text = `${chips[index].label} ${part.value}`;
    return { frame, text: textBlock(`breakdown.${index}`, { x: frame.x + pad - 2, y: frame.y, w: frame.w - (pad - 2) * 2, h: frame.h }, text, d.chip, 1), label: chips[index].label, value: part.value };
  });
  return {
    h,
    totalValue: textBlock("total.value", { x: box.x, y: box.y + (rowH - totalH) / 2, w: totalW, h: totalH }, totalText, d.total, 1, GLYPH.digits),
    totalLabel: textBlock("total.label", { x: labelX, y: box.y + (rowH - labelH) / 2, w: labelW, h: labelH }, data.total.label, d.totalLabel, labelLines),
    breakdown,
    sample:
      sampleBox && data.sampleLabel
        ? textBlock("sample", { ...sampleBox, x: box.x + box.w - sampleBox.w, y: box.y + (rowH - sampleBox.h) / 2 }, data.sampleLabel, sampleSize, 1)
        : null,
  };
}

const fitsIn = (text: string, size: number, width: number, lines: number) => countLines(text, size, width) <= lines;

/** Afirmaciones en 1 o 2 columnas: cajas relativas (x desde 0, y desde 0) y alto total. */
function itemGrid(items: string[], d: Density, width: number) {
  const iconSize = Math.round(d.item * 0.95);
  const colGap = 28;
  const colW = (width - colGap * (d.itemCols - 1)) / d.itemCols;
  const textW = colW - iconSize - 14;
  const lines = items.map((item) => countLines(item, d.item, textW));
  if (lines.some((count) => count > 2)) return null;
  const rowGap = Math.round(d.item * 0.5);
  const rows = Math.ceil(items.length / d.itemCols);
  const out: Array<{ icon: Box; text: Box; lines: number }> = [];
  let y = 0;
  for (let row = 0; row < rows; row++) {
    const slice = lines.slice(row * d.itemCols, row * d.itemCols + d.itemCols);
    const rowH = textHeight(d.item, Math.max(...slice));
    slice.forEach((count, col) => {
      const x = col * (colW + colGap);
      out.push({
        icon: { x, y: y + (textHeight(d.item, 1) - iconSize) / 2, w: iconSize, h: iconSize },
        text: { x: x + iconSize + 14, y, w: textW, h: textHeight(d.item, count) },
        lines: count,
      });
    });
    y += rowH + (row < rows - 1 ? rowGap : 0);
  }
  return { cells: out, h: y };
}

function draftRow(box: Box, tier: EvidenceTier, index: number, data: EvidenceLedgerData, format: FilmFormatName, d: Density, hasSide: boolean): Draft | null {
  const padX = PAD_X[format];
  const contentX = box.x + padX + MARKER_W + 20;
  const contentW = box.x + box.w - padX - contentX;
  const tag = tierTag(tier.id, data.wording);
  const tagPad = Math.round(d.tag * 0.75);
  const tagW = tag ? chipWidth(tag, d.tag, tagPad) : 0;
  const tagH = textHeight(d.tag, 1) + Math.round(d.tag * 0.6);
  const shift = (cell: { icon: Box; text: Box; lines: number }, x: number, y: number, itemIndex: number) => ({
    icon: { ...cell.icon, x: cell.icon.x + x, y: cell.icon.y + y },
    text: textBlock(`tier.${index}.item.${itemIndex}`, { ...cell.text, x: cell.text.x + x, y: cell.text.y + y }, tier.items[itemIndex], d.item, cell.lines),
  });
  const tagBlocks = (x: number, y: number) =>
    tag
      ? {
          frame: { x, y, w: tagW, h: tagH },
          text: textBlock(`tier.${index}.tag`, { x: x + tagPad - 2, y, w: tagW - (tagPad - 2) * 2, h: tagH }, tag, d.tag, 1),
        }
      : null;

  if (format === "landscape") {
    // [marca][nivel][afirmaciones][rótulo de redacción + nota]
    const labelColW = Math.round(contentW * 0.2);
    const sideW = hasSide ? Math.round(contentW * 0.26) : 0;
    const itemsX = contentX + labelColW + 32;
    const itemsW = contentW - labelColW - 32 - (hasSide ? sideW + 32 : 0);
    const labelLines = countLines(tier.label, d.label, labelColW);
    if (labelLines > 2 || (tag && tagW > sideW)) return null;
    const grid = itemGrid(tier.items, d, itemsW);
    if (!grid) return null;
    const noteLines = tier.note ? countLines(tier.note, d.note, sideW) : 0;
    if (noteLines > d.noteLines) return null;
    const labelH = textHeight(d.label, labelLines);
    const noteH = noteLines ? textHeight(d.note, noteLines) : 0;
    const sideH = (tag ? tagH : 0) + (tag && noteH ? 10 : 0) + noteH;
    const height = Math.max(labelH, grid.h, sideH) + d.padY * 2;
    return {
      height,
      build: (top, cardH) => {
        const mid = (h: number) => top + (cardH - h) / 2;
        const sideTop = mid(sideH);
        const sideX = contentX + contentW - sideW;
        return {
          id: tier.id,
          card: { x: box.x, y: top, w: box.w, h: cardH },
          marker: { x: box.x + padX, y: top + d.padY, w: MARKER_W, h: cardH - d.padY * 2 },
          label: textBlock(`tier.${index}.label`, { x: contentX, y: mid(labelH), w: labelColW, h: labelH }, tier.label, d.label, labelLines),
          tag: tagBlocks(sideX, sideTop),
          items: grid.cells.map((cell, itemIndex) => shift(cell, itemsX, mid(grid.h), itemIndex)),
          note: tier.note ? textBlock(`tier.${index}.note`, { x: sideX, y: sideTop + (tag ? tagH + 10 : 0), w: sideW, h: noteH }, tier.note, d.note, noteLines) : null,
        };
      },
    };
  }

  // Retrato: cabecera (nivel + rótulo de redacción), afirmaciones y nota al pie.
  const labelW = contentW - (tag ? tagW + 20 : 0);
  const labelLines = countLines(tier.label, d.label, labelW);
  if (labelLines > 2 || (tag && tagW > contentW * 0.6)) return null;
  const grid = itemGrid(tier.items, d, contentW);
  if (!grid) return null;
  const noteLines = tier.note ? countLines(tier.note, d.note, contentW) : 0;
  if (noteLines > d.noteLines) return null;
  const labelH = textHeight(d.label, labelLines);
  const headerH = Math.max(labelH, tag ? tagH : 0);
  const noteH = noteLines ? textHeight(d.note, noteLines) : 0;
  const height = d.padY * 2 + headerH + 14 + grid.h + (noteH ? 12 + noteH : 0);
  return {
    height,
    build: (top, cardH) => {
      const y0 = top + (cardH - height) / 2 + d.padY;
      const itemsTop = y0 + headerH + 14;
      return {
        id: tier.id,
        card: { x: box.x, y: top, w: box.w, h: cardH },
        marker: { x: box.x + padX, y: top + d.padY, w: MARKER_W, h: cardH - d.padY * 2 },
        label: textBlock(`tier.${index}.label`, { x: contentX, y: y0 + (headerH - labelH) / 2, w: labelW, h: labelH }, tier.label, d.label, labelLines),
        tag: tagBlocks(contentX + contentW - tagW, y0 + (headerH - tagH) / 2),
        items: grid.cells.map((cell, itemIndex) => shift(cell, contentX, itemsTop, itemIndex)),
        note: tier.note ? textBlock(`tier.${index}.note`, { x: contentX, y: itemsTop + grid.h + 12, w: contentW, h: noteH }, tier.note, d.note, noteLines) : null,
      };
    },
  };
}

function tryLayout(box: Box, data: EvidenceLedgerData, format: FilmFormatName, d: Density, force: boolean): EvidenceLedgerLayout | null {
  const head = headLayout(box, data, format, d);
  if (!head) return null;
  const hasSide = data.tiers.some((tier) => tier.note || tierTag(tier.id, data.wording));
  const drafts = data.tiers.map((tier, index) => draftRow(box, tier, index, data, format, d, hasSide));
  if (drafts.some((draft) => !draft) && !force) return null;
  const ready = drafts.filter((draft): draft is Draft => Boolean(draft));
  const n = ready.length;
  const headGap = format === "portrait" ? 30 : 26;
  const rowsTop = box.y + head.h + headGap;
  const rowsH = box.y + box.h - rowsTop;
  // Apaisado: filas de igual alto (se lee como un libro mayor).
  const heights = format === "landscape" ? ready.map(() => Math.max(...ready.map((draft) => draft.height))) : ready.map((draft) => draft.height);
  const sum = heights.reduce((total, h) => total + h, 0);
  if (sum + d.rowGap * Math.max(0, n - 1) > rowsH && !force) return null;
  // El sobrante agranda un poco las tarjetas (máx. 36 px) y el resto centra el bloque.
  const grow = Math.max(0, Math.min(36, (rowsH - sum - d.rowGap * Math.max(0, n - 1)) / Math.max(1, n)));
  const used = sum + grow * n + d.rowGap * Math.max(0, n - 1);
  let top = rowsTop + Math.max(0, (rowsH - used) / 2);
  const rows = ready.map((draft, index) => {
    const row = draft.build(top, heights[index] + grow);
    top += heights[index] + grow + d.rowGap;
    return row;
  });

  const blocks: LayoutBlock[] = [head.totalValue, head.totalLabel];
  for (const chip of head.breakdown) blocks.push({ kind: "frame", id: `${chip.text.id}.frame`, box: chip.frame }, chip.text);
  if (head.sample) blocks.push(head.sample);
  for (const row of rows) {
    blocks.push({ kind: "frame", id: `${row.label.id}.card`, box: row.card }, { kind: "media", id: `${row.label.id}.marker`, box: row.marker }, row.label);
    if (row.tag) blocks.push({ kind: "frame", id: `${row.tag.text.id}.frame`, box: row.tag.frame }, row.tag.text);
    for (const item of row.items) blocks.push({ kind: "media", id: `${item.text.id}.icon`, box: item.icon }, item.text);
    if (row.note) blocks.push(row.note);
  }
  return { totalValue: head.totalValue, totalLabel: head.totalLabel, breakdown: head.breakdown, rows, sample: head.sample, blocks };
}

export function evidenceLedgerLayout(box: Box, data: EvidenceLedgerData, format: FilmFormatName): EvidenceLedgerLayout {
  const densities = DENSITIES[format];
  for (const density of densities) {
    const layout = tryLayout(box, data, format, density, false);
    if (layout) return layout;
  }
  // Ninguna entra: la más compacta igual (el test de layout lo marca).
  const last = densities[densities.length - 1];
  return tryLayout(box, data, format, last, true) ?? tryLayout(box, { ...data, breakdown: undefined, sampleLabel: undefined }, format, last, true)!;
}
