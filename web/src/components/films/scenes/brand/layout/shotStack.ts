import { gridBoxes, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { blockHeight, centerY, connectorBetween, GLYPH_EM, LINE_HEIGHT, segmentLines } from "./mediaShared";

/**
 * Geometría de ShotStack (pura). Capturas reales de interfaz como pasos de un
 * recorrido: banda de pasos arriba (número + rótulo) y debajo las capturas en
 * marcos de tarjeta o de teléfono, a escala ≤ 1:1. Si una captura es más alta
 * que su marco, se recorre en vertical dentro de él (nunca se amplía).
 *
 * - Apaisado: entran todas lado a lado; el paso activo se ilumina.
 * - Retrato: una a la vez al centro, con las vecinas asomando a los costados
 *   (`trackOffset` dice cuánto se corre la fila para centrar cada paso).
 */

export type ShotInput = { w: number; h: number; label?: string };
export type ShotFrameKind = "card" | "phone";

export type ShotStackData = { shots: ShotInput[]; frame?: ShotFrameKind };

export type ShotCard = {
  /** Marco completo (bisel incluido) con la fila en reposo (offset 0). */
  frame: Box;
  /** Pantalla visible dentro del marco. */
  screen: Box;
  /** Escala de la captura (≤ 1). */
  scale: number;
  /** Alto de la captura dibujada a esa escala. */
  shotH: number;
  /** Recorrido vertical disponible (0 si entra entera). */
  pan: number;
};

export type ShotChip = { chip: Box; dot: Box; label: Box | null };

export type ShotStackLayout = {
  stepper: Box;
  chips: ShotChip[];
  /** "inline": número y rótulo en fila; "stacked": rótulo centrado debajo del número (hasta 2 líneas). */
  chipStyle: "inline" | "stacked";
  connectors: Box[];
  labelSize: number;
  labelLines: number;
  /** Área donde se recortan los marcos. */
  viewport: Box;
  cards: ShotCard[];
  /** Desplazamiento horizontal de la fila para cada paso activo. */
  trackOffset: number[];
  bezel: number;
  carousel: boolean;
};

const METRICS = {
  landscape: { label: 18, minLabel: 15, dot: 34, stepperGap: 30, cardGap: 44, phoneBezel: 12 },
  portrait: { label: 24, minLabel: 18, dot: 44, stepperGap: 40, cardGap: 56, phoneBezel: 14 },
} as const;

/** Ancho estimado de un rótulo de una línea (con la misma vara que `fitsLines`). */
export const labelWidth = (label: string, size: number) => Math.ceil(label.length * size * GLYPH_EM.body) + 6;

export function shotStackLayout(box: Box, data: ShotStackData, format: FilmFormatName): ShotStackLayout {
  const m = METRICS[format];
  const n = data.shots.length;
  const bezel = data.frame === "phone" ? m.phoneBezel : 0;
  const carousel = format === "portrait";

  // Escala común (≤ 1). Apaisado: todas entran lado a lado. Retrato: la activa
  // ocupa como mucho dos tercios del ancho.
  const widest = Math.max(...data.shots.map((shot) => shot.w));
  const sumW = data.shots.reduce((sum, shot) => sum + shot.w, 0);
  const scale = carousel ? Math.min(1, (box.w * 0.66 - bezel * 2) / widest) : Math.min(1, (box.w - m.cardGap * (n - 1) - bezel * 2 * n) / sumW);

  // Posición horizontal de cada marco (en reposo). Apaisado: fila centrada; retrato: la primera al centro.
  const frameW = data.shots.map((shot) => shot.w * scale + bezel * 2);
  const rowW = frameW.reduce((sum, w) => sum + w, 0) + m.cardGap * (n - 1);
  let cursor = carousel ? box.x + (box.w - frameW[0]) / 2 : box.x + (box.w - rowW) / 2;
  const frameX = frameW.map((w) => {
    const at = cursor;
    cursor += w + m.cardGap;
    return at;
  });

  // Pasos: en apaisado, cada uno sobre su captura; en retrato, repartidos en columnas.
  const anchors = carousel ? gridBoxes(box, n, { cols: n }).map((cell) => cell.x + cell.w / 2) : frameX.map((x, index) => x + frameW[index] / 2);
  const spacing = n > 1 ? Math.min(...anchors.slice(1).map((anchor, index) => anchor - anchors[index])) : box.w;
  const edge = Math.min(...anchors.map((anchor) => Math.min(anchor - box.x, box.x + box.w - anchor))) * 2;
  const room = Math.min(spacing - 56, edge);
  const inlineWidth = (label: string | undefined, size: number) => m.dot + (label ? 12 + labelWidth(label, size) : 0);
  const labels = data.shots.map((shot) => shot.label ?? "");

  // Primero en fila; si algún rótulo no entra ni achicado, se apila debajo del número.
  let labelSize: number = m.label;
  while (labelSize > m.minLabel && data.shots.some((shot) => inlineWidth(shot.label, labelSize) > room)) labelSize -= 1;
  const stacked = data.shots.some((shot) => inlineWidth(shot.label, labelSize) > room);
  const stackW = Math.min(spacing - 24, edge);
  let labelLines = 1;
  if (stacked) {
    labelSize = m.label;
    const fits = (size: number) => labels.every((label) => !label || segmentLines(label, size, stackW, GLYPH_EM.body, 2) <= 2);
    while (labelSize > 14 && !fits(labelSize)) labelSize -= 1;
    labelLines = Math.max(1, ...labels.filter(Boolean).map((label) => Math.min(2, segmentLines(label, labelSize, stackW, GLYPH_EM.body, 2))));
  }
  const labelH = blockHeight(labelSize, labelLines, LINE_HEIGHT.label);
  const stepperH = stacked ? m.dot + 10 + labelH : Math.max(m.dot, labelH);

  // Alto: las pantallas más altas que el lugar se recorren por dentro.
  const availH = Math.max(0, box.h - stepperH - m.stepperGap);
  const screens = data.shots.map((shot) => {
    const w = shot.w * scale;
    const shotH = shot.h * scale;
    const h = Math.min(shotH, availH - bezel * 2);
    return { w, h, shotH, pan: Math.max(0, shotH - h) };
  });
  const rowH = Math.max(...screens.map((screen) => screen.h + bezel * 2));
  const top = centerY(box, stepperH + m.stepperGap + rowH);
  const stepper: Box = { x: box.x, y: top, w: box.w, h: stepperH };
  const viewport: Box = { x: box.x, y: top + stepperH + m.stepperGap, w: box.w, h: rowH };

  const cards = screens.map((screen, index) => {
    const frame = { x: frameX[index], y: viewport.y, w: frameW[index], h: screen.h + bezel * 2 };
    return { frame, screen: { x: frame.x + bezel, y: frame.y + bezel, w: screen.w, h: screen.h }, scale, shotH: screen.shotH, pan: screen.pan };
  });
  const center = box.x + box.w / 2;
  const trackOffset = cards.map((card) => (carousel ? center - (card.frame.x + card.frame.w / 2) : 0));

  const chips = data.shots.map((shot, index) => {
    const anchor = anchors[index];
    if (stacked) {
      const dot = { x: anchor - m.dot / 2, y: stepper.y, w: m.dot, h: m.dot };
      const label = shot.label ? { x: anchor - stackW / 2, y: dot.y + m.dot + 10, w: stackW, h: labelH } : null;
      return { chip: { x: anchor - stackW / 2, y: stepper.y, w: stackW, h: stepperH }, dot, label };
    }
    const w = inlineWidth(shot.label, labelSize);
    const chip = { x: anchor - w / 2, y: stepper.y, w, h: stepperH };
    const dot = { x: chip.x, y: stepper.y + (stepperH - m.dot) / 2, w: m.dot, h: m.dot };
    const lineH = blockHeight(labelSize, 1, LINE_HEIGHT.label);
    const label = shot.label ? { x: dot.x + m.dot + 12, y: stepper.y + (stepperH - lineH) / 2, w: labelWidth(shot.label, labelSize), h: lineH } : null;
    return { chip, dot, label };
  });
  // Rectas entre números (apiladas) o entre fichas (en fila): nunca tocan un rótulo.
  const connectors = chips
    .slice(1)
    .map((chip, index) => (stacked ? connectorBetween(chips[index].dot, chip.dot, "x", 16) : connectorBetween(chips[index].chip, chip.chip, "x", 16)))
    .filter((line): line is Box => line !== null);

  return { stepper, chips, chipStyle: stacked ? "stacked" : "inline", connectors, labelSize, labelLines, viewport, cards, trackOffset, bezel, carousel };
}
