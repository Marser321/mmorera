import { gridBoxes, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { blockHeight, centerY, connectorBetween, GLYPH_EM, LINE_HEIGHT } from "./mediaShared";

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
  connectors: Box[];
  labelSize: number;
  /** Área donde se recortan los marcos. */
  viewport: Box;
  cards: ShotCard[];
  /** Desplazamiento horizontal de la fila para cada paso activo. */
  trackOffset: number[];
  bezel: number;
  carousel: boolean;
};

const METRICS = {
  landscape: { label: 18, dot: 34, stepperGap: 30, cardGap: 44, phoneBezel: 12 },
  portrait: { label: 24, dot: 44, stepperGap: 40, cardGap: 56, phoneBezel: 14 },
} as const;

/** Ancho estimado de un rótulo de una línea (con la misma vara que `fitsLines`). */
export const labelWidth = (label: string, size: number) => Math.ceil(label.length * size * GLYPH_EM.body) + 6;

export function shotStackLayout(box: Box, data: ShotStackData, format: FilmFormatName): ShotStackLayout {
  const m = METRICS[format];
  const n = data.shots.length;
  const bezel = data.frame === "phone" ? m.phoneBezel : 0;
  const labelSize = m.label;
  const stepperH = Math.max(m.dot, blockHeight(labelSize, 1, LINE_HEIGHT.label));
  const carousel = format === "portrait";

  // Escala común (≤ 1). Apaisado: todas entran lado a lado. Retrato: la activa
  // ocupa como mucho dos tercios del ancho.
  const widest = Math.max(...data.shots.map((shot) => shot.w));
  const sumW = data.shots.reduce((sum, shot) => sum + shot.w, 0);
  const scale = carousel ? Math.min(1, (box.w * 0.66 - bezel * 2) / widest) : Math.min(1, (box.w - m.cardGap * (n - 1) - bezel * 2 * n) / sumW);
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

  // Fila de marcos (en reposo). Apaisado: centrada; retrato: la primera al centro.
  const rowW = screens.reduce((sum, screen) => sum + screen.w + bezel * 2, 0) + m.cardGap * (n - 1);
  let x = carousel ? box.x + (box.w - (screens[0].w + bezel * 2)) / 2 : box.x + (box.w - rowW) / 2;
  const cards = screens.map((screen) => {
    const frame = { x, y: viewport.y, w: screen.w + bezel * 2, h: screen.h + bezel * 2 };
    x += frame.w + m.cardGap;
    return { frame, screen: { x: frame.x + bezel, y: frame.y + bezel, w: screen.w, h: screen.h }, scale, shotH: screen.shotH, pan: screen.pan };
  });
  const center = box.x + box.w / 2;
  const trackOffset = cards.map((card) => (carousel ? center - (card.frame.x + card.frame.w / 2) : 0));

  // Pasos: en apaisado, cada uno sobre su captura; en retrato, repartidos en columnas.
  const anchors = carousel ? gridBoxes(stepper, n, { cols: n }).map((cell) => cell.x + cell.w / 2) : cards.map((card) => card.frame.x + card.frame.w / 2);
  const chips = data.shots.map((shot, index) => {
    const textW = shot.label ? labelWidth(shot.label, labelSize) : 0;
    const w = m.dot + (shot.label ? 12 + textW : 0);
    const chip = { x: anchors[index] - w / 2, y: stepper.y, w, h: stepperH };
    const dot = { x: chip.x, y: stepper.y + (stepperH - m.dot) / 2, w: m.dot, h: m.dot };
    const labelH = blockHeight(labelSize, 1, LINE_HEIGHT.label);
    const label = shot.label ? { x: dot.x + m.dot + 12, y: stepper.y + (stepperH - labelH) / 2, w: textW, h: labelH } : null;
    return { chip, dot, label };
  });
  const connectors = chips
    .slice(1)
    .map((chip, index) => connectorBetween(chips[index].chip, chip.chip, "x", 16))
    .filter((line): line is Box => line !== null);

  return { stepper, chips, connectors, labelSize, viewport, cards, trackOffset, bezel, carousel };
}
