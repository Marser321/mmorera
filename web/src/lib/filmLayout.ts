/**
 * Geometría pura de las escenas de los films (sin Remotion, testeable).
 *
 * Regla de la casa: el texto vive en bandas propias y los medios en cajas
 * propias. Las escenas no improvisan coordenadas: reciben cajas calculadas acá,
 * así un test puede comprobar que nada se pisa en ningún formato.
 */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type FilmFormatName = "landscape" | "portrait";

/**
 * Zona útil: dentro de las barras de cine (7 % / 4,5 % del alto, ver
 * Letterbox) y por encima de los ticks de capítulo, con los márgenes laterales
 * que usan todos los films.
 */
export function safeArea(format: FilmFormatName): Box {
  if (format === "portrait") return { x: 72, y: 84, w: 936, h: 1180 };
  return { x: 110, y: 84, w: 1380, h: 736 };
}

export type Band = { id: string; h: number } | { id: string; flex: number };

/**
 * Apila bandas verticales dentro de un área: las de alto fijo primero, el
 * resto se reparte entre las flexibles en proporción.
 */
export function stackBands(area: Box, bands: Band[], gap = 0): Record<string, Box> {
  const fixed = bands.reduce((total, band) => total + ("h" in band ? band.h : 0), 0);
  const flexTotal = bands.reduce((total, band) => total + ("flex" in band ? band.flex : 0), 0);
  const free = Math.max(0, area.h - fixed - gap * Math.max(0, bands.length - 1));
  const out: Record<string, Box> = {};
  let y = area.y;
  for (const band of bands) {
    const h = "h" in band ? band.h : flexTotal > 0 ? (free * band.flex) / flexTotal : 0;
    out[band.id] = { x: area.x, y, w: area.w, h };
    y += h + gap;
  }
  return out;
}

/** Divide un área en columnas (ancho fijo por proporción) con separación. */
export function splitColumns(area: Box, ratios: number[], gap = 0): Box[] {
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  const free = area.w - gap * Math.max(0, ratios.length - 1);
  let x = area.x;
  return ratios.map((ratio) => {
    const w = (free * ratio) / total;
    const box = { x, y: area.y, w, h: area.h };
    x += w + gap;
    return box;
  });
}

/** Grilla de n celdas iguales (fila por fila). */
export function gridBoxes(area: Box, n: number, { cols, gap = 0, rowHeight }: { cols: number; gap?: number; rowHeight?: number }): Box[] {
  const rows = Math.ceil(n / cols);
  const w = (area.w - gap * (cols - 1)) / cols;
  const h = rowHeight ?? (area.h - gap * (rows - 1)) / Math.max(1, rows);
  return Array.from({ length: n }, (_, index) => ({
    x: area.x + (index % cols) * (w + gap),
    y: area.y + Math.floor(index / cols) * (h + gap),
    w,
    h,
  }));
}

/** Achica una caja hacia adentro. */
export function inset(box: Box, dx: number, dy = dx): Box {
  return { x: box.x + dx, y: box.y + dy, w: Math.max(0, box.w - dx * 2), h: Math.max(0, box.h - dy * 2) };
}

/** Encaja un medio de proporción `aspect` dentro de la caja, sin recortar. */
export function containBox(box: Box, aspect: number, align: "center" | "top" = "center"): Box {
  const w = Math.min(box.w, box.h * aspect);
  const h = w / aspect;
  return { x: box.x + (box.w - w) / 2, y: align === "top" ? box.y : box.y + (box.h - h) / 2, w, h };
}

export function overlaps(a: Box, b: Box, gap = 0) {
  return a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
}

export function inside(inner: Box, outer: Box) {
  return inner.x >= outer.x - 0.5 && inner.y >= outer.y - 0.5 && inner.x + inner.w <= outer.x + outer.w + 0.5 && inner.y + inner.h <= outer.y + outer.h + 0.5;
}

/**
 * Estimación conservadora de si un texto entra en `maxLines` líneas de
 * `width` px a `size` px. `glyphEm` es el ancho medio de un carácter en em
 * (0,56 cubre Manrope, Montserrat e Inter; las condensadas como Oswald usan menos).
 */
export function fitsLines(text: string, size: number, width: number, maxLines: number, glyphEm = 0.56) {
  const perLine = Math.max(1, Math.floor(width / (size * glyphEm)));
  let lines = 1;
  let used = 0;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const length = word.length;
    if (length > perLine) return false;
    if (used === 0) used = length;
    else if (used + 1 + length <= perLine) used += 1 + length;
    else {
      lines += 1;
      used = length;
    }
  }
  return lines <= maxLines;
}
