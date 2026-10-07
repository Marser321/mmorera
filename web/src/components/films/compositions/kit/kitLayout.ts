import { safeArea, splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { cinematicPlateLayout, type PlateCaption } from "../../scenes/brand/layout/cinematicPlate";
import { fitUniform } from "../../scenes/brand/layout/crmText";
import { countLines, GLYPH, textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../../scenes/brand/layout/dataText";
import { MANIFESTO_KICKER_TRACKING } from "../../scenes/brand/layout/manifestoBeats";
import { blockHeight, fitFontSize, GLYPH_EM, LINE_HEIGHT, lineCount } from "../../scenes/brand/layout/mediaShared";

/**
 * Geometría del kit de escenas de los films insignia (pura: sin React ni
 * Remotion). Son las escenas que se repiten entre clientes con distinto
 * contenido: apertura con placa y partículas, placa con manifiesto, recorrido
 * del sitio, pila de capturas, arquitectura y cifras. Cada film suma su
 * escena protagonista propia.
 */

type Size = { w: number; h: number };

/** Título de escena (BrandTitle): tamaño y líneas que entran en su banda. */
export const KIT_TITLE = {
  landscape: { size: 42, lines: 1 },
  portrait: { size: 56, lines: 2 },
} as const;

export function kitBands(format: FilmFormatName) {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const bands = stackBands(safe, [{ id: "title", h: portrait ? 168 : 96 }, { id: "body", flex: 1 }], portrait ? 28 : 22);
  return { safe, title: bands.title, body: bands.body };
}

/** Alto que ocupa un BrandTitle de `lines` líneas (rótulo + margen + líneas). */
export const titleHeight = (size: number, lines: number) => size * 0.28 * 1.2 + size * 0.3 + lines * size * 1.1;

/* ─── Apertura: placa + isotipo en partículas + rótulo y tagline ─── */

export type PlateOpeningSpec = {
  asset: Size;
  focal?: { x: number; y: number };
  /**
   * "banner": la placa arriba y el texto debajo (fotos apaisadas).
   * "column": en 16:9 la placa a la izquierda y el texto a la derecha
   * (medios verticales); en 4:5 se apila igual que "banner".
   */
  orientation?: "banner" | "column";
  plateH?: Partial<Record<FilmFormatName, number>>;
  /** Logotipo horizontal sobre el rótulo (medida nativa). */
  wordmark?: Size;
  /** Dónde se forma el isotipo, en fracciones del medio (por defecto, centrado en la placa). */
  mark?: { cx: number; cy: number; w: number };
  /** Proporción ancho/alto del isotipo (para que nunca salga de la placa). */
  markAspect?: number;
};

export type PlateOpeningLayout = {
  plateBox: Box;
  plate: Box;
  media: Box;
  wordmark: Box | null;
  kicker: Box;
  kickerSize: number;
  tagline: Box;
  taglineSize: number;
  /** Banda de texto completa (para beats que siguen a la tagline). */
  text: Box;
  logoCenter: { x: number; y: number };
  logoSize: number;
  align: "left" | "center";
};

export function plateOpeningLayout(format: FilmFormatName, spec: PlateOpeningSpec, tagline: string, kickerText: string): PlateOpeningLayout {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const column = spec.orientation === "column" && !portrait;
  const focal = spec.focal ?? { x: 0.5, y: 0.5 };
  const wordmarkH = spec.wordmark ? (portrait ? 44 : 34) : 0;
  const wordmarkGap = spec.wordmark ? 18 : 0;

  // Columnas (16:9 con medio vertical) o bandas (placa arriba, texto debajo).
  const [plateArea, textArea] = column ? splitColumns(safe, [0.82, 1.18], 72) : [null, null];
  const textWBase = column ? textArea!.w : portrait ? safe.w : Math.min(safe.w, Math.round((spec.plateH?.landscape ?? 500) * 2.39));
  const kickerSize = fitFontSize(kickerText, { width: textWBase, maxLines: 1, max: portrait ? 22 : 18, min: portrait ? 20 : 15, lineHeight: LINE_HEIGHT.label, glyphEm: GLYPH_EM.label(MANIFESTO_KICKER_TRACKING), step: 1 });
  const kickerH = blockHeight(kickerSize, 1, LINE_HEIGHT.label);
  const maxLines = column ? 3 : portrait ? 2 : 1;
  const taglineSize = fitFontSize(tagline, { width: textWBase, maxLines, max: column ? 72 : portrait ? 72 : 60, min: 40, lineHeight: LINE_HEIGHT.display, glyphEm: GLYPH_EM.display });
  const taglineLines = Math.min(maxLines, lineCount(tagline, taglineSize, textWBase, GLYPH_EM.display, maxLines));
  const taglineH = blockHeight(taglineSize, taglineLines, LINE_HEIGHT.display);
  const textBlockH = wordmarkH + wordmarkGap + kickerH + Math.round(kickerSize * 0.8) + taglineH;

  let plateBox: Box;
  let textX: number;
  let textW: number;
  let textY: number;
  let plate: Box;
  let media: Box;
  if (column) {
    plateBox = plateArea!;
    ({ plate, media } = cinematicPlateLayout(plateBox, { asset: spec.asset, focal }, format));
    textX = textArea!.x;
    textW = textArea!.w;
    textY = textArea!.y + Math.max(0, (textArea!.h - textBlockH) / 2);
  } else {
    const plateH = spec.plateH?.[format] ?? (portrait ? 528 : 500);
    const gap = portrait ? 40 : 28;
    const top = safe.y + Math.max(0, Math.round((safe.h - (plateH + gap + textBlockH)) / 2));
    plateBox = { x: safe.x, y: top, w: safe.w, h: plateH };
    ({ plate, media } = cinematicPlateLayout(plateBox, { asset: spec.asset, focal, align: "top" }, format));
    // En apaisado el texto se alinea con la placa (puede ser más angosta que el área).
    textX = portrait ? safe.x : plate.x;
    textW = portrait ? safe.w : plate.w;
    textY = plate.y + plate.h + gap;
  }

  const align = portrait ? "center" : "left";
  let y = textY;
  let wordmark: Box | null = null;
  if (spec.wordmark) {
    const w = Math.round((wordmarkH * spec.wordmark.w) / spec.wordmark.h);
    wordmark = { x: align === "center" ? textX + (textW - w) / 2 : textX, y, w, h: wordmarkH };
    y += wordmarkH + wordmarkGap;
  }
  const kicker: Box = { x: textX, y, w: textW, h: kickerH };
  y += kickerH + Math.round(kickerSize * 0.8);
  const taglineBox: Box = { x: textX, y, w: textW, h: taglineH };
  const text: Box = { x: textX, y: textY, w: textW, h: safe.y + safe.h - textY };

  // Isotipo: donde lo dibuja el medio (si se indica) o centrado y contenido en la placa.
  const aspect = spec.markAspect ?? 1;
  let logoCenter = { x: plate.x + plate.w / 2, y: plate.y + plate.h / 2 };
  let logoSize = Math.round(Math.min(plate.w * 0.7, (plate.h * 0.78 * Math.max(1, aspect)), portrait ? 420 : 380));
  if (spec.mark) {
    logoCenter = { x: media.x + spec.mark.cx * media.w, y: media.y + spec.mark.cy * media.h };
    logoSize = Math.round((spec.mark.w * media.w) / 0.96);
  }
  return { plateBox, plate, media, wordmark, kicker, kickerSize, tagline: taglineBox, taglineSize, text, logoCenter, logoSize, align };
}

/* ─── Placa con manifiesto: foto o video a un lado, frases al otro ─── */

export function plateManifestoLayout(format: FilmFormatName, asset: Size, caption?: PlateCaption, focal?: { x: number; y: number }, ratio: [number, number] = [0.8, 1.2]) {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const [plateBox, text] = portrait
    ? (() => {
        const stacked = stackBands(safe, [{ id: "plate", h: 660 }, { id: "text", flex: 1 }], 36);
        return [stacked.plate, stacked.text];
      })()
    : splitColumns(safe, ratio, 72);
  const plate = cinematicPlateLayout(plateBox, { asset, caption, focal }, format);
  return { plateBox, plate, text };
}

/* ─── Recorrido del sitio: navegador con la captura y la lista de paradas ─── */

const SITE_SPEC = {
  landscape: { index: 15, label: [24, 22, 21, 20, 19, 18], gap: 30, indexGap: 18 },
  portrait: { index: 20, label: [28, 26, 24, 22, 21, 20], gap: 22, indexGap: 18 },
} as const;

export type SiteItem = { index: TextBlock; label: TextBlock; rule: Box };

export function siteTourLayout(format: FilmFormatName, stops: string[], reelHeight = 620) {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const spec = SITE_SPEC[format];
  const [reel, listArea] = portrait
    ? (() => {
        const stacked = stackBands(body, [{ id: "reel", h: reelHeight }, { id: "list", flex: 1 }], 28);
        return [stacked.reel, stacked.list];
      })()
    : splitColumns(body, [1.75, 1], 48);
  const indexW = Math.ceil(textWidth("04", spec.index, GLYPH.digits)) + 4;
  const labelW = listArea.w - indexW - spec.indexGap;
  const fit = fitUniform(stops, labelW, spec.label, 2);
  const heights = stops.map((stop) => textHeight(fit.size, Math.min(fit.lines, countLines(stop, fit.size, labelW))));
  const total = heights.reduce((sum, h) => sum + h, 0) + spec.gap * (heights.length - 1);
  let y = listArea.y + Math.max(0, (listArea.h - total) / 2);
  const items = stops.map((stop, index): SiteItem => {
    const h = heights[index];
    const lines = Math.min(fit.lines, countLines(stop, fit.size, labelW));
    const indexBlock = textBlock(`site.index.${index}`, { x: listArea.x, y: y + (textHeight(fit.size, 1) - textHeight(spec.index, 1)) / 2, w: indexW, h: textHeight(spec.index, 1) }, String(index + 1).padStart(2, "0"), spec.index, 1, GLYPH.digits);
    const label = textBlock(`site.label.${index}`, { x: listArea.x + indexW + spec.indexGap, y, w: labelW, h }, stop, fit.size, lines);
    const rule: Box = { x: listArea.x + indexW + spec.indexGap, y: y + h + spec.gap / 2, w: labelW, h: 1 };
    y += h + spec.gap;
    return { index: indexBlock, label, rule };
  });
  const blocks: LayoutBlock[] = items.flatMap((item, index) => [item.index, item.label, ...(index < items.length - 1 ? [{ kind: "media" as const, id: `${item.label.id}.rule`, box: item.rule }] : [])]);
  return { title, reel, listArea, items, blocks };
}

/**
 * Frame en que la lista enciende cada parada del recorrido: a mitad del
 * desplazamiento de ScrollReel hacia esa parada (mismo reparto que el
 * componente: pausa de 30 frames, tramos iguales y espera de un cuarto de tramo).
 */
export function siteStopFrames(duration: number, stops: number) {
  const from = 30;
  const to = Math.max(from + 1, duration - 30);
  const segment = (to - from) / Math.max(1, stops - 1);
  return Array.from({ length: stops }, (_, index) => (index === 0 ? 0 : Math.round(from + (index - 1) * segment + segment * 0.6)));
}

/* ─── Pila de capturas: la ventana con los pasos y una nota debajo ─── */

export function shotsLayout(format: FilmFormatName, note?: string) {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  if (!note) return { title, main: body, note: null as TextBlock | null };
  const size = portrait ? 22 : 18;
  const fit = fitUniform([note], body.w - 24, portrait ? [22, 21, 20] : [18, 17, 16, 15], 2);
  const noteH = textHeight(fit.size, fit.lines);
  const parts = stackBands(body, [{ id: "main", flex: 1 }, { id: "note", h: noteH }], portrait ? 18 : 14);
  return { title, main: parts.main, note: textBlock("shots.note", { x: parts.note.x + 24, y: parts.note.y, w: parts.note.w - 24, h: noteH }, note, Math.min(size, fit.size), fit.lines) };
}

/* ─── Cifras: el muro y, opcional, la línea de créditos ─── */

export function factsLayout(format: FilmFormatName, credit?: { text: string; logo?: Size }) {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  if (!credit) return { title, facts: body, creditBand: null, logo: null, credit: null };
  const ladder = portrait ? [22, 21, 20] : [18, 17, 16, 15];
  const logoH = credit.logo ? (portrait ? 48 : 38) : 0;
  const logoW = credit.logo ? Math.round(((logoH - 12) * credit.logo.w) / credit.logo.h) + 24 : 0;
  const textW = body.w - logoW - (credit.logo ? 18 : 0);
  const fit = fitUniform([credit.text], textW, ladder, 2);
  const creditH = Math.max(logoH, textHeight(fit.size, fit.lines));
  const parts = stackBands(body, [{ id: "facts", flex: 1 }, { id: "credit", h: creditH }], portrait ? 24 : 18);
  const logo: Box | null = credit.logo ? { x: parts.credit.x, y: parts.credit.y + (creditH - logoH) / 2, w: logoW, h: logoH } : null;
  const textX = parts.credit.x + (logo ? logoW + 18 : 0);
  const creditBlock = textBlock("credit", { x: textX, y: parts.credit.y + (creditH - textHeight(fit.size, fit.lines)) / 2, w: textW, h: textHeight(fit.size, fit.lines) }, credit.text, fit.size, fit.lines);
  return { title, facts: parts.facts, creditBand: parts.credit, logo, credit: creditBlock };
}
