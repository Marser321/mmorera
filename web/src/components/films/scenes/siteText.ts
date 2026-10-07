/**
 * Medidas de texto con las tipografías del sitio (Familjen Grotesk para cuerpo
 * y titulares, Space Mono para rótulos). Puro: los films de /sistemas lo usan
 * para calcular sus cajas y los tests para comprobar que nada se pisa.
 *
 * Los anchos salen de medir las fuentes en el navegador (Familjen Grotesk 500:
 * 0,42–0,50 em de promedio; Space Mono: 0,612 em fijo) y llevan margen.
 */

const SAFETY = 1.04;

/** Ancho fijo de Space Mono, con margen. */
export const MONO_EM = 0.62;

function bodyCharEm(ch: string) {
  if ("mwMW".includes(ch)) return 0.92;
  if ("il.,:;'|!·íìjI".includes(ch)) return 0.27;
  if (ch === " ") return 0.27;
  if ("ftr-/()".includes(ch)) return 0.36;
  if (ch === "&") return 0.66;
  if (ch >= "0" && ch <= "9") return 0.58;
  if (ch !== ch.toLowerCase()) return 0.68;
  return 0.54;
}

/** Ancho estimado (conservador) de una línea en la fuente de cuerpo. `tracking` en em. */
export function bodyWidth(text: string, size: number, tracking = 0) {
  let em = 0;
  for (const ch of text) em += bodyCharEm(ch) + tracking;
  return em * size * SAFETY;
}

/** Ancho de una línea en Space Mono (monoespaciada). `tracking` en em. */
export function monoWidth(text: string, size: number, tracking = 0) {
  return [...text].length * size * (MONO_EM + tracking);
}

export type Measure = (text: string) => number;

/**
 * Corte por palabras como el del navegador (sin partir palabras). Devuelve las
 * líneas, o null si una palabra sola no entra en el ancho.
 */
export function wrapWords(text: string, width: number, measure: Measure, gap = measure(" ")): string[] | null {
  const lines: string[] = [];
  let line = "";
  let used = 0;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const w = measure(word);
    if (w > width) return null;
    if (!line) {
      line = word;
      used = w;
    } else if (used + gap + w <= width) {
      line += ` ${word}`;
      used += gap + w;
    } else {
      lines.push(line);
      line = word;
      used = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Cantidad de líneas (Infinity si una palabra no entra). */
export function lineCount(text: string, width: number, measure: Measure, gap?: number) {
  return wrapWords(text, width, measure, gap)?.length ?? Infinity;
}

/**
 * Titular de los films (primitives/Headline): cada palabra es un bloque con
 * margen derecho de 0,24 em y el titular va con tracking −0,055 em. El margen
 * cuenta también en la última palabra de la línea.
 */
export function headlineLines(text: string, size: number, width: number) {
  const measure: Measure = (word) => bodyWidth(word, size, -0.04) + size * 0.24;
  return lineCount(text, width, measure, 0);
}

/** Alto de un titular de `lines` líneas (interlineado 0,98 + 0,08 em de aire para los descendentes). */
export const headlineHeight = (size: number, lines: number) => Math.ceil(size * 1.06 * lines);

/** Mayor tamaño de la escalera con el que el titular entra en `maxLines`. */
export function fitHeadline(text: string, width: number, maxLines: number, sizes: number[]) {
  for (const size of sizes) {
    const lines = headlineLines(text, size, width);
    if (lines <= maxLines) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  return { size, lines: headlineLines(text, size, width) };
}
