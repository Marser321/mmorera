import { fitsLines, type Box } from "@/lib/filmLayout";

/**
 * Medidas de texto compartidas por las escenas de medios (puro, testeable).
 *
 * `fitsLines` estima con un ancho medio de carácter en em; acá se fijan los
 * anchos que usan las escenas para cada rol tipográfico, así el componente y
 * su test miden con la misma vara.
 */

/** Ancho medio de carácter (em) por rol. Los rótulos van en mayúsculas y con tracking. */
export const GLYPH_EM = {
  display: 0.56,
  body: 0.56,
  /** Rótulos en mayúsculas: ancho de la mayúscula + el tracking (en em). */
  label: (trackingEm: number) => 0.74 + trackingEm,
  /** Direcciones web: muchas letras anchas (w, m) y puntos; un poco más holgado. */
  url: 0.6,
} as const;

/** Interlineado de cada rol (el componente usa los mismos valores). */
export const LINE_HEIGHT = { display: 1.12, body: 1.4, label: 1.2 } as const;

/** Quita las marcas de énfasis (`*palabra*`) antes de medir. */
export const plainText = (text: string) => text.replace(/\*/g, "");

/** Tramos de un texto con cortes forzados ("\n" fija el corte de línea, como en BrandTitle). */
export const textSegments = (text: string) => plainText(text).split("\n");

/** Líneas de un tramo sin cortes forzados (Infinity si una palabra no entra en el ancho). */
export function segmentLines(segment: string, size: number, width: number, glyphEm: number, max = 12) {
  for (let lines = 1; lines <= max; lines++) if (fitsLines(segment, size, width, lines, glyphEm)) return lines;
  return Number.POSITIVE_INFINITY;
}

/** Cantidad de líneas que ocupa un texto, respetando los cortes forzados. */
export function lineCount(text: string, size: number, width: number, glyphEm: number, max = 12) {
  return textSegments(text).reduce((total, segment) => total + segmentLines(segment, size, width, glyphEm, max), 0);
}

/**
 * Verificación para los tests: cada tramo entra en sus líneas y el total no
 * pasa de `lines` (es `fitsLines` aplicado tramo por tramo).
 */
export function fitsText(text: string, size: number, width: number, lines: number, glyphEm: number) {
  let used = 0;
  for (const segment of textSegments(text)) {
    const need = segmentLines(segment, size, width, glyphEm, lines);
    if (!Number.isFinite(need) || !fitsLines(segment, size, width, need, glyphEm)) return false;
    used += need;
  }
  return used <= lines;
}

/**
 * Tamaño de letra más grande (múltiplo de `step`) con el que el texto entra en
 * `maxLines` líneas del ancho dado y en el alto disponible. Si ni el mínimo
 * alcanza devuelve el mínimo (el test de cada escena lo detecta).
 */
export function fitFontSize(
  text: string,
  { width, height = Number.POSITIVE_INFINITY, maxLines, max, min, lineHeight, glyphEm, step = 2 }: { width: number; height?: number; maxLines: number; max: number; min: number; lineHeight: number; glyphEm: number; step?: number },
) {
  for (let size = max; size >= min; size -= step) {
    const lines = lineCount(text, size, width, glyphEm, maxLines);
    if (lines <= maxLines && lines * size * lineHeight <= height) return size;
  }
  return min;
}

/** Alto que reserva un bloque de `lines` líneas. */
export const blockHeight = (size: number, lines: number, lineHeight: number) => Math.ceil(size * lineHeight * lines);

/** Centra verticalmente un grupo de alto `h` dentro de la caja. */
export function centerY(box: Box, h: number, align: "center" | "top" | "bottom" = "center") {
  if (align === "top") return box.y;
  if (align === "bottom") return box.y + box.h - h;
  return box.y + Math.max(0, (box.h - h) / 2);
}

/** Recta de unión entre dos cajas (solo el tramo libre entre ambas, con margen). */
export function connectorBetween(a: Box, b: Box, axis: "x" | "y", margin: number, thickness = 2): Box | null {
  if (axis === "x") {
    const x = a.x + a.w + margin;
    const w = b.x - margin - x;
    return w > 0 ? { x, y: a.y + a.h / 2 - thickness / 2, w, h: thickness } : null;
  }
  const y = a.y + a.h + margin;
  const h = b.y - margin - y;
  return h > 0 ? { x: a.x + a.w / 2 - thickness / 2, y, w: thickness, h } : null;
}

/** Es un video (por extensión) y no una imagen fija. */
export const isVideoSrc = (src: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src);
