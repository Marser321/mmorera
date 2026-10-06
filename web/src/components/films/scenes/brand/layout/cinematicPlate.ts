import { coverSize, maxCameraScale } from "@/lib/filmCamera";
import { containBox, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { blockHeight, centerY, fitFontSize, GLYPH_EM, LINE_HEIGHT, lineCount } from "./mediaShared";

/**
 * Geometría de CinematicPlate (pura): la placa de video/foto, el recorte que
 * la cubre sin ampliar el original y, si hay leyenda, su banda propia debajo
 * de la placa (nunca encima del medio).
 */

export type PlateCaption = { kicker?: string; text: string };

export type CinematicPlateData = {
  /** Medida nativa del medio: la placa nunca lo dibuja más grande. */
  asset: { w: number; h: number };
  caption?: PlateCaption;
  /** Punto del medio (0–1) que queda al centro del recorte y del empuje. */
  focal?: { x: number; y: number };
  /** Ubicación vertical del conjunto (placa + leyenda) dentro de la caja. */
  align?: "center" | "top" | "bottom";
  /** Proporción más ancha que se acepta recortar en apaisado (anamórfico). */
  maxCrop?: number;
};

export type PlateCaptionBoxes = { kicker: Box | null; text: Box; size: number; kickerSize: number; lines: number };

export type CinematicPlateLayout = {
  /** Ventana visible (recorta el medio). */
  plate: Box;
  /** Rectángulo del medio a escala 1, en coordenadas de la composición (cubre la placa). */
  media: Box;
  /** Empuje máximo (≥ 1) sin pasar la resolución nativa. */
  maxPush: number;
  caption: PlateCaptionBoxes | null;
};

/** Tracking de la etiqueta de la leyenda (em); el componente usa el mismo. */
export const PLATE_KICKER_TRACKING = 0.24;

const METRICS = {
  landscape: { kicker: 15, max: 34, min: 22, maxLines: 2, measure: 980, gap: 26 },
  portrait: { kicker: 20, max: 44, min: 28, maxLines: 3, measure: 936, gap: 34 },
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function cinematicPlateLayout(box: Box, data: CinematicPlateData, format: FilmFormatName): CinematicPlateLayout {
  const m = METRICS[format];
  const aspect = data.asset.w / data.asset.h;
  const focal = data.focal ?? { x: 0.5, y: 0.5 };

  // Leyenda: tamaño que entra en el ancho de lectura, con las líneas que necesita.
  const measure = Math.min(box.w, m.measure);
  let captionH = 0;
  let caption: Omit<PlateCaptionBoxes, "kicker" | "text"> & { hasKicker: boolean } | null = null;
  if (data.caption) {
    const size = fitFontSize(data.caption.text, { width: measure, maxLines: m.maxLines, max: m.max, min: m.min, lineHeight: LINE_HEIGHT.display, glyphEm: GLYPH_EM.display });
    const lines = Math.min(m.maxLines, lineCount(data.caption.text, size, measure, GLYPH_EM.display, m.maxLines));
    const hasKicker = Boolean(data.caption.kicker);
    captionH = (hasKicker ? blockHeight(m.kicker, 1, LINE_HEIGHT.label) + Math.round(m.kicker * 0.8) : 0) + blockHeight(size, lines, LINE_HEIGHT.display);
    caption = { size, kickerSize: m.kicker, lines, hasKicker };
  }
  const band = caption ? captionH + m.gap : 0;
  const area: Box = { x: box.x, y: box.y, w: box.w, h: Math.max(0, box.h - band) };

  // Placa: en apaisado cubre el área (recorte anamórfico como mucho); en
  // retrato es una banda con el medio entero (letterbox), sin recortar.
  let plate: Box;
  const areaAspect = area.w / Math.max(1, area.h);
  if (format === "landscape" && areaAspect >= aspect) {
    const maxCrop = data.maxCrop ?? 2.39;
    plate = areaAspect > maxCrop ? { x: area.x + (area.w - area.h * maxCrop) / 2, y: area.y, w: area.h * maxCrop, h: area.h } : { ...area };
  } else {
    plate = containBox(area, aspect);
  }
  // Nunca más grande que el original: si el recorte pediría ampliar, se achica la placa.
  const cover = coverSize(plate, aspect);
  if (cover.w > data.asset.w) {
    const k = data.asset.w / cover.w;
    plate = { x: plate.x + (plate.w * (1 - k)) / 2, y: plate.y, w: plate.w * k, h: plate.h * k };
  }

  // Conjunto (placa + leyenda) ubicado dentro de la caja.
  const groupH = plate.h + band;
  const top = centerY(box, groupH, data.align ?? "center");
  plate = { ...plate, y: top };

  const scaled = coverSize(plate, aspect);
  const left = clamp(plate.w / 2 - focal.x * scaled.w, plate.w - scaled.w, 0);
  const upper = clamp(plate.h / 2 - focal.y * scaled.h, plate.h - scaled.h, 0);
  const media: Box = { x: plate.x + left, y: plate.y + upper, w: scaled.w, h: scaled.h };

  let captionBoxes: PlateCaptionBoxes | null = null;
  if (caption) {
    const x = format === "portrait" ? box.x : plate.x;
    const w = Math.min(measure, box.x + box.w - x);
    let y = plate.y + plate.h + m.gap;
    let kicker: Box | null = null;
    if (caption.hasKicker) {
      kicker = { x, y, w, h: blockHeight(m.kicker, 1, LINE_HEIGHT.label) };
      y += kicker.h + Math.round(m.kicker * 0.8);
    }
    captionBoxes = { kicker, text: { x, y, w, h: blockHeight(caption.size, caption.lines, LINE_HEIGHT.display) }, size: caption.size, kickerSize: caption.kickerSize, lines: caption.lines };
  }

  return { plate, media, maxPush: maxCameraScale(data.asset.w, plate, aspect), caption: captionBoxes };
}
