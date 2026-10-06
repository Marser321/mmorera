import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { blockHeight, centerY, connectorBetween, fitFontSize, GLYPH_EM, LINE_HEIGHT, lineCount } from "./mediaShared";

/**
 * Geometría de MechanismTriptych (pura). Tres imágenes en secuencia, cada una
 * con su leyenda numerada en una banda propia (debajo en apaisado, al costado
 * en retrato), más una banda opcional de fórmula/etiqueta arriba. Las rectas
 * que unen los números corren por su propio carril: nunca cruzan texto.
 */

export type MechanismCaption = { title: string; body?: string };
export type MechanismFormula = { kicker?: string; text: string };

export type MechanismData = {
  stills: Array<{ w: number; h: number }>;
  captions: MechanismCaption[];
  formula?: MechanismFormula;
};

export type MechanismPanel = { image: Box; chip: Box; title: Box; body: Box | null };

export type MechanismLayout = {
  formula: { kicker: Box | null; text: Box; size: number; kickerSize: number; lines: number } | null;
  panels: MechanismPanel[];
  /** Rectas entre los números (en orden: 1→2, 2→3). */
  connectors: Box[];
  sizes: { title: number; body: number; chip: number; titleLines: number; bodyLines: number };
};

/** Tracking de la etiqueta de la fórmula (em); el componente usa el mismo. */
export const MECHANISM_KICKER_TRACKING = 0.24;

const METRICS = {
  landscape: { kicker: 15, formula: { max: 38, min: 24, lines: 1 }, title: { max: 30, min: 20, lines: 2 }, body: { max: 18, min: 15, lines: 3 }, chip: 40, colGap: 40, formulaGap: 34 },
  portrait: { kicker: 20, formula: { max: 48, min: 30, lines: 2 }, title: { max: 36, min: 26, lines: 2 }, body: { max: 23, min: 18, lines: 4 }, chip: 48, colGap: 40, formulaGap: 40 },
} as const;

function formulaBlock(formula: MechanismFormula | undefined, width: number, format: FilmFormatName) {
  if (!formula) return null;
  const m = METRICS[format];
  const size = fitFontSize(formula.text, { width, maxLines: m.formula.lines, max: m.formula.max, min: m.formula.min, lineHeight: LINE_HEIGHT.display, glyphEm: GLYPH_EM.display });
  const lines = Math.min(m.formula.lines, lineCount(formula.text, size, width, GLYPH_EM.display, m.formula.lines));
  const kickerH = formula.kicker ? blockHeight(m.kicker, 1, LINE_HEIGHT.label) : 0;
  const kickerGap = formula.kicker ? Math.round(m.kicker * 0.7) : 0;
  const textH = blockHeight(size, lines, LINE_HEIGHT.display);
  return { size, lines, kickerH, kickerGap, textH, h: kickerH + kickerGap + textH, kickerSize: m.kicker };
}

/**
 * Un solo tamaño para los tres textos del mismo rol (el más grande que les
 * sirve a todos). Con `preferOne`, si achicando hasta un 18 % entran todos en
 * una línea, se prefiere eso: así no queda un hueco reservado de más.
 */
function uniformSize(texts: string[], width: number, spec: { max: number; min: number; lines: number }, lineHeight: number, glyphEm: number, preferOne = false) {
  const oneLineMin = Math.max(spec.min, Math.ceil(spec.max * 0.82));
  if (preferOne && texts.every((text) => lineCount(text, oneLineMin, width, glyphEm, 1) <= 1)) {
    const size = Math.min(...texts.map((text) => fitFontSize(text, { width, maxLines: 1, max: spec.max, min: oneLineMin, lineHeight, glyphEm, step: 1 })));
    return { size, lines: 1 };
  }
  const size = Math.min(...texts.map((text) => fitFontSize(text, { width, maxLines: spec.lines, max: spec.max, min: spec.min, lineHeight, glyphEm, step: 1 })));
  const lines = Math.max(1, ...texts.map((text) => Math.min(spec.lines, lineCount(text, size, width, glyphEm, spec.lines))));
  return { size, lines };
}

export function mechanismTriptychLayout(box: Box, data: MechanismData, format: FilmFormatName): MechanismLayout {
  const m = METRICS[format];
  const n = data.stills.length;
  const formula = formulaBlock(data.formula, box.w, format);
  const formulaH = formula ? formula.h + m.formulaGap : 0;
  const titles = data.captions.map((caption) => caption.title);
  const bodies = data.captions.map((caption) => caption.body ?? "").filter(Boolean);

  const panels: MechanismPanel[] = [];
  let title = { size: m.title.min as number, lines: 1 };
  let body = { size: m.body.min as number, lines: 0 };
  let groupH = 0;

  if (format === "landscape") {
    const cols = splitColumns({ ...box, h: 0 }, Array.from({ length: n }, () => 1), m.colGap);
    const colW = cols[0]?.w ?? box.w;
    title = uniformSize(titles, colW, m.title, LINE_HEIGHT.display, GLYPH_EM.display, true);
    body = bodies.length ? uniformSize(bodies, colW, m.body, LINE_HEIGHT.body, GLYPH_EM.body) : { size: m.body.min, lines: 0 };
    const titleH = blockHeight(title.size, title.lines, LINE_HEIGHT.display);
    const bodyH = body.lines ? blockHeight(body.size, body.lines, LINE_HEIGHT.body) : 0;
    const captionH = 22 + m.chip + 16 + titleH + (bodyH ? 10 + bodyH : 0);
    const aspect = Math.max(...data.stills.map((still) => still.w / still.h));
    // Alto de imagen: el que da el ancho de columna, sin pasar el nativo ni el alto disponible.
    const imageH = Math.min(colW / aspect, ...data.stills.map((still) => still.h), box.h - formulaH - captionH);
    groupH = formulaH + imageH + captionH;
    const top = centerY(box, groupH);
    const imageY = top + formulaH;
    cols.forEach((col, index) => {
      const still = data.stills[index];
      const w = Math.min(col.w, imageH * (still.w / still.h), still.w);
      const h = w / (still.w / still.h);
      const image = { x: col.x + (col.w - w) / 2, y: imageY + (imageH - h) / 2, w, h };
      const chip = { x: col.x, y: imageY + imageH + 22, w: m.chip, h: m.chip };
      const titleBox = { x: col.x, y: chip.y + chip.h + 16, w: col.w, h: titleH };
      const caption = data.captions[index];
      const bodyBox = caption?.body && bodyH ? { x: col.x, y: titleBox.y + titleBox.h + 10, w: col.w, h: bodyH } : null;
      panels.push({ image, chip, title: titleBox, body: bodyBox });
    });
  } else {
    const gutter = m.chip;
    const imageW0 = Math.round(box.w * 0.5);
    const textX = (imageW: number) => box.x + imageW + 32 + gutter + 18;
    const textW = (imageW: number) => box.x + box.w - textX(imageW);
    let imageW = imageW0;
    const measure = () => {
      title = uniformSize(titles, textW(imageW), m.title, LINE_HEIGHT.display, GLYPH_EM.display, true);
      body = bodies.length ? uniformSize(bodies, textW(imageW), m.body, LINE_HEIGHT.body, GLYPH_EM.body) : { size: m.body.min, lines: 0 };
      const titleH = blockHeight(title.size, title.lines, LINE_HEIGHT.display);
      const bodyH = body.lines ? blockHeight(body.size, body.lines, LINE_HEIGHT.body) : 0;
      const captionH = Math.max(m.chip, titleH) + (bodyH ? 12 + bodyH : 0);
      const aspect = Math.max(...data.stills.map((still) => still.w / still.h));
      const imageH = imageW / aspect;
      const rowH = Math.max(imageH, captionH);
      return { titleH, bodyH, rowH, aspect };
    };
    let metrics = measure();
    // Si las tres filas no entran, se achican las imágenes (nunca el texto por debajo del mínimo).
    while (formulaH + metrics.rowH * n + m.colGap * (n - 1) > box.h && imageW > box.w * 0.3) {
      imageW -= 12;
      metrics = measure();
    }
    groupH = formulaH + metrics.rowH * n + m.colGap * (n - 1);
    const top = centerY(box, groupH);
    for (let index = 0; index < n; index++) {
      const still = data.stills[index];
      const rowY = top + formulaH + index * (metrics.rowH + m.colGap);
      const w = Math.min(imageW, still.w);
      const h = w / (still.w / still.h);
      const image = { x: box.x, y: rowY + (metrics.rowH - h) / 2, w, h };
      const chip = { x: box.x + imageW + 32, y: rowY, w: m.chip, h: m.chip };
      // La primera línea del título queda centrada con el número.
      const titleBox = { x: textX(imageW), y: rowY + Math.max(0, (m.chip - title.size * LINE_HEIGHT.display) / 2), w: textW(imageW), h: metrics.titleH };
      const caption = data.captions[index];
      const bodyBox = caption?.body && metrics.bodyH ? { x: textX(imageW), y: titleBox.y + titleBox.h + 12, w: textW(imageW), h: metrics.bodyH } : null;
      panels.push({ image, chip, title: titleBox, body: bodyBox });
    }
  }

  let formulaBoxes: MechanismLayout["formula"] = null;
  if (formula && data.formula) {
    const top = centerY(box, groupH);
    const kicker = data.formula.kicker ? { x: box.x, y: top, w: box.w, h: formula.kickerH } : null;
    formulaBoxes = { kicker, text: { x: box.x, y: top + formula.kickerH + formula.kickerGap, w: box.w, h: formula.textH }, size: formula.size, kickerSize: formula.kickerSize, lines: formula.lines };
  }

  const connectors = panels.slice(1).map((panel, index) => connectorBetween(panels[index].chip, panel.chip, format === "landscape" ? "x" : "y", 14)).filter((line): line is Box => line !== null);

  return { formula: formulaBoxes, panels, connectors, sizes: { title: title.size, body: body.size, chip: m.chip, titleLines: title.lines, bodyLines: body.lines } };
}
