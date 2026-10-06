import { fitsLines, inside, overlaps, type Box, type FilmFormatName } from "@/lib/filmLayout";
import type { FilmLanguage } from "@/data/films/filmTypes";

/**
 * Medidas de texto compartidas por las escenas de datos (EvidenceLedger,
 * FactWall, ChecklistGrid, KeywordSearch, ScriptTimeline). Puro: sin React ni
 * Remotion, así los tests verifican la misma geometría que pinta la escena.
 *
 * Los anchos de glifo salen de medir las tipografías de las marcas en el
 * navegador (Fraunces, Manrope, Montserrat, Oswald, Inter; hasta peso 700) y
 * llevan margen: minúsculas ≤ 0,55 em, mayúsculas ≤ 0,66 em, cifras ≤ 0,62 em
 * en promedio; textWidth() además mide letra por letra.
 */
export const GLYPH = {
  /** Texto en caja mixta (cuerpo o títulos). */
  text: 0.58,
  /** Rótulos en mayúsculas con algo de espaciado. */
  upper: 0.76,
  /** Cifras (y cifras con una letra de unidad, como "4,33 M"). */
  digits: 0.66,
} as const;

/**
 * Ritmo de una escena de datos: las coreografías están escritas para `nominal`
 * frames. Si el film le da menos, todo se comprime en proporción (nada queda
 * a medio revelar); si le da más, los tiempos se mantienen y el estado final
 * se sostiene. `span` es la duración con la que se reparten los escalonados.
 */
export function scenePace(frame: number, duration: number, nominal: number) {
  const pace = Math.max(1, nominal / Math.max(1, duration));
  return { frame: frame * pace, span: Math.max(duration, nominal) };
}

/** Tamaño mínimo legible por formato (el 4:5 se ve en un teléfono). */
export const MIN_TEXT: Record<FilmFormatName, number> = { landscape: 15, portrait: 20 };

/** Interlineado con el que las escenas pintan texto de varias líneas. */
export const LINE_HEIGHT = 1.24;

export type TextBlock = { kind: "text"; id: string; box: Box; text: string; size: number; lines: number; glyph: number };
/** "media": gráfico sin texto (grilla, riel, íconos). "frame": tarjeta o placa que contiene texto. */
export type PlateBlock = { kind: "media" | "frame"; id: string; box: Box };
export type LayoutBlock = TextBlock | PlateBlock;

/** Alto de un bloque de `lines` líneas a `size` px. */
export const textHeight = (size: number, lines: number, lineHeight = LINE_HEIGHT) => Math.ceil(size * lineHeight * lines);

/**
 * Ancho en em de cada carácter, medido en las tipografías de las marcas (la
 * más ancha manda: Montserrat 700) con margen. Sirve para que una palabra con
 * muchas letras anchas ("Mecanismo") no quede recortada aunque el promedio
 * diga que entra.
 */
function charEm(ch: string) {
  if (ch === "m" || ch === "w") return 1.02;
  if (ch === "M" || ch === "W") return 1.12;
  if (ch >= "0" && ch <= "9") return 0.68;
  if ("ilj.,:;'|!·í".includes(ch)) return 0.3;
  if ("ftrI-/".includes(ch)) return 0.46;
  if (ch === " ") return 0.3;
  if (ch !== ch.toLowerCase()) return 0.78;
  return 0.66;
}

const WIDTH_SAFETY = 1.04;

/** Ancho estimado (conservador) de un texto en una línea, en px. Los rótulos en mayúsculas suman su espaciado. */
export function textWidth(text: string, size: number, glyph: number = GLYPH.text) {
  const upper = glyph === GLYPH.upper;
  let em = 0;
  for (const ch of upper ? text.toUpperCase() : text) em += charEm(ch) + (upper ? 0.14 : 0);
  return em * size * WIDTH_SAFETY;
}

/** Criterio de fitsLines(): corte por palabra con el ancho medio de glifo. */
function averageLines(text: string, size: number, width: number, glyph: number) {
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

/**
 * Líneas que ocupa un texto: el peor caso entre el ancho medio de fitsLines()
 * y el ancho por carácter. Infinity si una palabra sola no entra.
 */
export function countLines(text: string, size: number, width: number, glyph: number = GLYPH.text) {
  const space = textWidth(" ", size, glyph);
  let lines = 1;
  let used = 0;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const wordWidth = textWidth(word, size, glyph);
    if (wordWidth > width) return Infinity;
    if (used === 0) used = wordWidth;
    else if (used + space + wordWidth <= width) used += space + wordWidth;
    else {
      lines += 1;
      used = wordWidth;
    }
  }
  return Math.max(lines, averageLines(text, size, width, glyph));
}

/** Mayor tamaño de la escalera con el que todos los textos entran en `lines` líneas. */
export function largestFit(texts: string[], width: number, lines: number, candidates: number[], glyph: number = GLYPH.text) {
  for (const size of candidates) if (texts.every((text) => countLines(text, size, width, glyph) <= lines)) return size;
  return candidates[candidates.length - 1];
}

export function textBlock(id: string, box: Box, text: string, size: number, lines: number, glyph: number = GLYPH.text): TextBlock {
  return { kind: "text", id, box, text, size, lines, glyph };
}

/** Ancho de una pastilla de una línea (texto sin cortes + relleno lateral). */
export function chipWidth(text: string, size: number, padX: number, glyph: number = GLYPH.text) {
  return Math.ceil(Math.max((text.length + 1) * size * glyph, textWidth(text, size, glyph) + size * 0.3) + padX * 2);
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
 * ¿El color es un dorado/ámbar? (tono 28°–58°, con saturación). Sirve para no
 * usar el dorado de una marca sobre contenido biológico o médico.
 */
export function isGoldTone(hex: string) {
  const value = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return false;
  const [r, g, b] = [0, 2, 4].map((at) => Number.parseInt(value.slice(at, at + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return false;
  const lightness = (max + min) / 2;
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  hue = (hue * 60 + 360) % 360;
  return saturation > 0.35 && hue >= 28 && hue <= 58;
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
    else if (countLines(text.text, text.size, text.box.w, text.glyph) > text.lines) problems.push(`${text.id} no entra en ${text.lines} línea(s) a ${text.size}px (medido por letra)`);
    if (text.box.h + 0.5 < text.size * Math.min(LINE_HEIGHT, 1.05) * text.lines) problems.push(`${text.id}: caja más baja que sus líneas`);
    for (const other of texts.slice(index + 1)) if (overlaps(text.box, other.box)) problems.push(`${text.id} pisa a ${other.id}`);
    for (const plate of media) if (overlaps(text.box, plate.box)) problems.push(`${text.id} pisa el gráfico ${plate.id}`);
    for (const frame of frames) if (overlaps(text.box, frame.box) && !inside(text.box, frame.box)) problems.push(`${text.id} cruza el borde de ${frame.id}`);
  });
  return problems;
}
