import { chipWidth, countLines, GLYPH, largestFit, textHeight } from "./dataText";

/**
 * Medidas de texto de las escenas de CRM (PipelineBoard, BeforeAfterSplit).
 * Puro: sin React ni Remotion.
 */

/**
 * Líneas de un texto con cortes forzados: cada "\n" abre una línea nueva y
 * cada tramo se mide por separado (así un título puede evitar una viuda).
 */
export function forcedLines(text: string, size: number, width: number, glyph: number = GLYPH.text) {
  return text.split("\n").reduce((total, part) => total + (part.trim() ? countLines(part.trim(), size, width, glyph) : 1), 0);
}

/**
 * Tamaño (y líneas) común a todos los textos de un rol.
 * - `prefer: "lines"` (rótulos y tarjetas): la menor cantidad de líneas que
 *   entra en la escalera (una línea a 20 px antes que dos a 22 px).
 * - `prefer: "size"` (títulos): el mayor tamaño que entra en `maxLines`.
 * Si nada entra, el menor tamaño con `maxLines`.
 */
export function fitUniform(texts: string[], width: number, ladder: readonly number[], maxLines: number, glyph: number = GLYPH.text, prefer: "lines" | "size" = "lines") {
  const sizes = [...ladder];
  if (!texts.length) return { size: sizes[0], lines: 1 };
  const linesAt = (size: number) => Math.max(1, ...texts.map((text) => forcedLines(text, size, width, glyph)));
  if (prefer === "size") {
    for (const size of sizes) {
      const lines = linesAt(size);
      if (lines <= maxLines) return { size, lines };
    }
  } else {
    for (let lines = 1; lines <= maxLines; lines++) {
      for (const size of sizes) if (linesAt(size) <= lines) return { size, lines };
    }
  }
  return { size: largestFit(texts, width, maxLines, sizes, glyph), lines: maxLines };
}

/** Caja de la pastilla "Datos de ejemplo" a `size` px. */
export function sampleChipSize(label: string, size: number) {
  const padX = Math.round(size * 0.85);
  return { w: chipWidth(label, size, padX), h: textHeight(size, 1) + Math.round(size * 0.9) };
}
