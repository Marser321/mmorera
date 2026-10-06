import { fitsLines, inside, overlaps, type Box } from "@/lib/filmLayout";
import type { FilmLanguage } from "@/data/films/filmTypes";

/**
 * Medidas de texto compartidas por las escenas de datos (EvidenceLedger,
 * FactWall, ChecklistGrid, KeywordSearch, ScriptTimeline). Puro: sin React ni
 * Remotion, así los tests verifican la misma geometría que pinta la escena.
 *
 * Los anchos de glifo salen de medir las tipografías de las marcas en el
 * navegador (Fraunces, Manrope, Montserrat, Oswald, Inter; hasta peso 700) y
 * llevan margen: minúsculas ≤ 0,55 em, mayúsculas ≤ 0,66 em, cifras ≤ 0,62 em.
 */
export const GLYPH = {
  /** Texto en caja mixta (cuerpo o títulos). */
  text: 0.58,
  /** Rótulos en mayúsculas con algo de espaciado. */
  upper: 0.76,
  /** Cifras (y cifras con una letra de unidad, como "4,33 M"). */
  digits: 0.66,
} as const;

/** Interlineado con el que las escenas pintan texto de varias líneas. */
export const LINE_HEIGHT = 1.24;

export type TextBlock = { kind: "text"; id: string; box: Box; text: string; size: number; lines: number; glyph: number };
/** "media": gráfico sin texto (grilla, riel, íconos). "frame": tarjeta o placa que contiene texto. */
export type PlateBlock = { kind: "media" | "frame"; id: string; box: Box };
export type LayoutBlock = TextBlock | PlateBlock;

/** Alto de un bloque de `lines` líneas a `size` px. */
export const textHeight = (size: number, lines: number, lineHeight = LINE_HEIGHT) => Math.ceil(size * lineHeight * lines);

/**
 * Líneas que ocupa un texto con el mismo criterio que fitsLines() (corte por
 * palabra, ancho medio de glifo). Infinity si una palabra sola no entra.
 */
export function countLines(text: string, size: number, width: number, glyph = GLYPH.text) {
  const perLine = Math.max(1, Math.floor(width / (size * glyph)));
  let lines = 1;
  let used = 0;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (word.length > perLine) return Infinity;
    if (used === 0) used = word.length;
    else if (used + 1 + word.length <= perLine) used += 1 + word.length;
    else {
      lines += 1;
      used = word.length;
    }
  }
  return lines;
}

/** Mayor tamaño de la escalera con el que todos los textos entran en `lines` líneas. */
export function largestFit(texts: string[], width: number, lines: number, candidates: number[], glyph: number = GLYPH.text) {
  for (const size of candidates) if (texts.every((text) => fitsLines(text, size, width, lines, glyph))) return size;
  return candidates[candidates.length - 1];
}

export function textBlock(id: string, box: Box, text: string, size: number, lines: number, glyph: number = GLYPH.text): TextBlock {
  return { kind: "text", id, box, text, size, lines, glyph };
}

/** Ancho de una pastilla de una línea (texto sin cortes + relleno lateral). */
export function chipWidth(text: string, size: number, padX: number, glyph: number = GLYPH.text) {
  return Math.ceil((text.length + 1) * size * glyph + padX * 2);
}

/**
 * Reparte cajas de ancho dado en filas, de izquierda a derecha (o alineadas a
 * la derecha). Devuelve null si no entran en el área.
 */
export function flowBoxes(area: Box, widths: number[], rowHeight: number, gap: number, align: "start" | "end" = "start"): Box[] | null {
  if (widths.some((width) => width > area.w)) return null;
  const rows: number[][] = [];
  let current: number[] = [];
  let used = 0;
  widths.forEach((width, index) => {
    if (current.length && used + gap + width > area.w) {
      rows.push(current);
      current = [];
      used = 0;
    }
    used += (current.length ? gap : 0) + width;
    current.push(index);
  });
  if (current.length) rows.push(current);
  if (rows.length * rowHeight + (rows.length - 1) * gap > area.h + 0.5) return null;
  const out: Box[] = new Array(widths.length);
  rows.forEach((row, rowIndex) => {
    const rowWidth = row.reduce((total, index) => total + widths[index], 0) + gap * (row.length - 1);
    let x = align === "end" ? area.x + area.w - rowWidth : area.x;
    for (const index of row) {
      out[index] = { x, y: area.y + rowIndex * (rowHeight + gap), w: widths[index], h: rowHeight };
      x += widths[index] + gap;
    }
  });
  return out;
}

/** Alto total que ocupan las filas de un flowBoxes() ya resuelto. */
export function flowHeight(boxes: Box[]) {
  if (!boxes.length) return 0;
  const top = Math.min(...boxes.map((box) => box.y));
  const bottom = Math.max(...boxes.map((box) => box.y + box.h));
  return bottom - top;
}

/**
 * Texto de una cifra ya formateada a mitad de su conteo. Respeta el formato
 * del idioma (separador de miles y decimales) y en t ≥ 1 devuelve exactamente
 * el valor final. Solo cuenta la primera cifra del texto ("98/98" → "37/98").
 */
export function countUpText(final: string, t: number, language: FilmLanguage) {
  if (t >= 1) return final;
  const match = /\d[\d.,]*\d|\d/.exec(final);
  if (!match) return final;
  const token = match[0];
  const decimalMark = language === "es" ? "," : ".";
  const groupMark = language === "es" ? "." : ",";
  const decimalAt = token.lastIndexOf(decimalMark);
  const decimals = decimalAt >= 0 ? token.length - decimalAt - 1 : 0;
  const target = Number(token.replace(/[.,]/g, ""));
  const current = Math.floor(target * Math.max(0, t));
  const raw = String(current).padStart(decimals + 1, "0");
  const integer = raw.slice(0, raw.length - decimals);
  const fraction = raw.slice(raw.length - decimals);
  const grouped = token.includes(groupMark) ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, groupMark) : integer;
  const text = decimals ? `${grouped}${decimalMark}${fraction}` : grouped;
  return final.slice(0, match.index) + text + final.slice(match.index + token.length);
}

/**
 * Problemas de geometría de un layout de escena (vacío = limpio):
 * - todo dentro de la caja de la escena;
 * - ningún texto pisa otro texto ni un gráfico ("media");
 * - un texto queda entero dentro de una placa ("frame") o fuera de ella;
 * - cada texto entra en sus líneas al tamaño con el que se pinta.
 */
export function layoutProblems(blocks: LayoutBlock[], area: Box) {
  const problems: string[] = [];
  const texts = blocks.filter((block): block is TextBlock => block.kind === "text");
  const media = blocks.filter((block) => block.kind === "media");
  const frames = blocks.filter((block) => block.kind === "frame");
  for (const block of blocks) if (!inside(block.box, area)) problems.push(`${block.id} sale de la escena`);
  texts.forEach((text, index) => {
    if (!fitsLines(text.text, text.size, text.box.w, text.lines, text.glyph)) problems.push(`${text.id} no entra en ${text.lines} línea(s) a ${text.size}px`);
    if (text.box.h + 0.5 < text.size * Math.min(LINE_HEIGHT, 1.05) * text.lines) problems.push(`${text.id}: caja más baja que sus líneas`);
    for (const other of texts.slice(index + 1)) if (overlaps(text.box, other.box)) problems.push(`${text.id} pisa a ${other.id}`);
    for (const plate of media) if (overlaps(text.box, plate.box)) problems.push(`${text.id} pisa el gráfico ${plate.id}`);
    for (const frame of frames) if (overlaps(text.box, frame.box) && !inside(text.box, frame.box)) problems.push(`${text.id} cruza el borde de ${frame.id}`);
  });
  return problems;
}
