import { containBox, splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { MR_BODY, type MrCopy } from "@/data/films/flagships/mrStudio";
import { fitUniform, sampleChipSize } from "../scenes/brand/layout/crmText";
import { chipWidth, countLines, GLYPH, textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { kitBands } from "./kit/kitLayout";

/**
 * Geometría propia de MrStudioFilm (pura): la ventana a la figura anatómica
 * del paso 5 con el brief que se arma al lado, y la bifurcación del
 * consentimiento según la edad.
 */

/* ─── Zona del cuerpo: ventana a la captura + brief ─── */

const BRIEF_SPEC = {
  landscape: { pad: 26, gap: 18, title: 16, chip: 15, label: 15, value: [21, 20, 19, 18, 17], note: [17, 16, 15], rowGap: 12, labelGap: 18 },
  portrait: { pad: 24, gap: 16, title: 20, chip: 20, label: 20, value: [24, 23, 22, 21, 20], note: [21, 20], rowGap: 10, labelGap: 16 },
} as const;

export type MrBriefRowBoxes = { row: Box; label: TextBlock; value: TextBlock };

export function mrBodyLayout(format: FilmFormatName, copy: MrCopy) {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const [plateCol, panelArea] = portrait
    ? (() => {
        const stacked = stackBands(body, [{ id: "plate", h: 480 }, { id: "panel", flex: 1 }], 24);
        return [stacked.plate, stacked.panel];
      })()
    : splitColumns(body, [0.82, 1.18], 44);
  // Ventana a la figura con la proporción de su recorte; nunca más grande que la captura.
  const aspect = MR_BODY.window.w / MR_BODY.window.h;
  const fitted = containBox(plateCol, aspect);
  const window: Box = fitted.w > MR_BODY.window.w ? { ...fitted, w: MR_BODY.window.w, h: MR_BODY.window.h, x: plateCol.x + (plateCol.w - MR_BODY.window.w) / 2 } : fitted;

  // Brief: cabecera, filas (rótulo + valor) y la nota de lo que sigue.
  const spec = BRIEF_SPEC[format];
  const rows = [...copy.briefBefore, copy.briefZone, ...copy.briefAfter];
  const innerW = panelArea.w - spec.pad * 2;
  const chip = sampleChipSize(copy.sampleLabel, spec.chip);
  const titleW = innerW - chip.w - 14;
  const titleLines = Math.min(2, countLines(copy.briefTitle, spec.title, titleW, GLYPH.upper));
  const headerH = Math.max(chip.h, textHeight(spec.title, titleLines));
  const labelW = Math.ceil(Math.max(...rows.map((row) => textWidth(row.label, spec.label, GLYPH.upper)))) + 4;
  const valueW = innerW - labelW - spec.labelGap;
  const valueFit = fitUniform(rows.map((row) => row.value), valueW, spec.value, 2);
  const valueLines = rows.map((row) => Math.min(valueFit.lines, countLines(row.value, valueFit.size, valueW)));
  const rowH = valueLines.map((lines) => Math.max(textHeight(spec.label, 1), textHeight(valueFit.size, lines)) + 14);
  const noteFit = fitUniform([copy.briefNext], innerW, spec.note, 3);
  const frameH = spec.pad * 2 + headerH + spec.gap + rowH.reduce((total, h) => total + h, 0) + spec.rowGap * (rows.length - 1) + spec.gap + textHeight(noteFit.size, noteFit.lines);
  const frame: Box = { x: panelArea.x, y: panelArea.y + Math.max(0, (panelArea.h - frameH) / 2), w: panelArea.w, h: frameH };
  const x0 = frame.x + spec.pad;
  const y0 = frame.y + spec.pad;
  const sample = textBlock("brief.sample", { x: x0 + innerW - chip.w, y: y0 + (headerH - chip.h) / 2, w: chip.w, h: chip.h }, copy.sampleLabel, spec.chip, 1);
  const titleBlock = textBlock("brief.title", { x: x0, y: y0 + (headerH - textHeight(spec.title, titleLines)) / 2, w: titleW, h: textHeight(spec.title, titleLines) }, copy.briefTitle, spec.title, titleLines, GLYPH.upper);
  let y = y0 + headerH + spec.gap;
  const rowBoxes = rows.map((row, index): MrBriefRowBoxes => {
    const h = rowH[index];
    const box: Box = { x: x0, y, w: innerW, h };
    const valueH = textHeight(valueFit.size, valueLines[index]);
    const label = textBlock(`brief.label.${index}`, { x: x0 + 12, y: y + (h - textHeight(spec.label, 1)) / 2, w: labelW, h: textHeight(spec.label, 1) }, row.label, spec.label, 1, GLYPH.upper);
    const value = textBlock(`brief.value.${index}`, { x: x0 + 12 + labelW + spec.labelGap, y: y + (h - valueH) / 2, w: valueW - 12, h: valueH }, row.value, valueFit.size, valueLines[index]);
    y += h + spec.rowGap;
    return { row: box, label, value };
  });
  y += spec.gap - spec.rowGap;
  const note = textBlock("brief.note", { x: x0, y, w: innerW, h: textHeight(noteFit.size, noteFit.lines) }, copy.briefNext, noteFit.size, noteFit.lines);
  const blocks: LayoutBlock[] = [titleBlock, sample, ...rowBoxes.flatMap((row) => [row.label, row.value]), note];
  return { title, plateCol, window, panelArea, frame, titleBlock, sample, rows: rowBoxes, zoneRow: copy.briefBefore.length, note, blocks };
}

/**
 * Cámara sobre una captura: escala y desplazamiento para mostrar `focus` (px
 * de la captura) centrado en la ventana, acercando `zoom` veces sobre el
 * encuadre base. La escala nunca pasa de 1 (no amplía píxeles).
 */
export function captureCamera(window: Box, base: Box, zoom: number, focus: { x: number; y: number }) {
  const baseScale = Math.min(window.w / base.w, window.h / base.h);
  const scale = Math.min(1, baseScale * zoom);
  // Centro del encuadre: del centro del recorte base al punto de foco según el zoom.
  const t = zoom <= 1 ? 0 : Math.min(1, (zoom - 1) / Math.max(0.0001, Math.min(1 / baseScale, 3) - 1));
  const cx = base.x + base.w / 2 + (focus.x - (base.x + base.w / 2)) * t;
  const cy = base.y + base.h / 2 + (focus.y - (base.y + base.h / 2)) * t;
  return { scale, left: window.w / 2 - cx * scale, top: window.h / 2 - cy * scale };
}

/* ─── Consentimiento: la edad decide el camino ─── */

const CONSENT_SPEC = {
  landscape: { root: [22, 21, 20, 19, 18], rootPad: 22, drop: 76, gap: 48, pad: 30, title: [40, 38, 36, 34, 32], line: [22, 21, 20, 19, 18], lineGap: 18, dot: 12 },
  portrait: { root: [26, 25, 24, 23, 22], rootPad: 22, drop: 72, gap: 24, pad: 22, title: [40, 38, 36, 34, 32], line: [24, 23, 22, 21, 20], lineGap: 16, dot: 12 },
} as const;

export type MrConsentCard = { frame: Box; title: TextBlock; lines: Array<{ dot: Box; text: TextBlock }> };

export function mrConsentLayout(format: FilmFormatName, copy: MrCopy) {
  const { title, body } = kitBands(format);
  const spec = CONSENT_SPEC[format];
  // Nodo raíz: la fecha de nacimiento, centrado arriba.
  const rootFit = fitUniform([copy.consentRoot], body.w * 0.8, spec.root, 1);
  const rootTextW = chipWidth(copy.consentRoot, rootFit.size, 0);
  const rootH = textHeight(rootFit.size, 1) + spec.rootPad;
  // El conjunto (nodo + conectores + tarjetas) se centra en vertical: primero se mide.
  const probeLineW = (body.w - spec.gap) / 2 - spec.pad * 2 - spec.dot - 14;
  const probeTitle = fitUniform([copy.consentAdult.title, copy.consentMinor.title], (body.w - spec.gap) / 2 - spec.pad * 2, spec.title, 1);
  const probeLine = fitUniform([...copy.consentAdult.lines, ...copy.consentMinor.lines], probeLineW, spec.line, 2);
  const probeCardH = Math.max(
    ...[copy.consentAdult, copy.consentMinor].map((card) => spec.pad * 2 + textHeight(probeTitle.size, 1) + spec.lineGap * 1.5 + card.lines.reduce((total, line) => total + textHeight(probeLine.size, Math.min(probeLine.lines, countLines(line, probeLine.size, probeLineW))), 0) + spec.lineGap * (card.lines.length - 1)),
  );
  const groupH = rootH + spec.drop + probeCardH;
  const top = body.y + Math.max(0, (body.h - groupH) / 2);
  const root: Box = { x: body.x + (body.w - rootTextW - spec.rootPad * 2) / 2, y: top, w: rootTextW + spec.rootPad * 2, h: rootH };
  const rootText = textBlock("consent.root", { x: root.x + spec.rootPad, y: root.y + (rootH - textHeight(rootFit.size, 1)) / 2, w: rootTextW, h: textHeight(rootFit.size, 1) }, copy.consentRoot, rootFit.size, 1);

  // Dos tarjetas lado a lado: los conectores bajan del nodo raíz sin cruzar ninguna.
  const cardsTop = root.y + rootH + spec.drop;
  const cardsArea: Box = { x: body.x, y: cardsTop, w: body.w, h: body.y + body.h - cardsTop };
  const [areaA, areaB] = splitColumns(cardsArea, [1, 1], spec.gap);
  const cardInnerW = areaA.w - spec.pad * 2;
  const lineW = cardInnerW - spec.dot - 14;
  const all = [copy.consentAdult, copy.consentMinor];
  const titleFit = fitUniform(all.map((card) => card.title), cardInnerW, spec.title, 1);
  const lineFit = fitUniform(all.flatMap((card) => card.lines), lineW, spec.line, 2);
  const cards = all.map((card, index): MrConsentCard => {
    const area = index === 0 ? areaA : areaB;
    const lineLines = card.lines.map((line) => Math.min(lineFit.lines, countLines(line, lineFit.size, lineW)));
    const contentH = textHeight(titleFit.size, 1) + spec.lineGap * 1.5 + lineLines.reduce((total, lines) => total + textHeight(lineFit.size, lines), 0) + spec.lineGap * (card.lines.length - 1);
    const frameH = Math.min(area.h, contentH + spec.pad * 2);
    const frame: Box = { x: area.x, y: area.y, w: area.w, h: frameH };
    const titleBlock = textBlock(`consent.card.${index}.title`, { x: frame.x + spec.pad, y: frame.y + spec.pad, w: cardInnerW, h: textHeight(titleFit.size, 1) }, card.title, titleFit.size, 1);
    let y = titleBlock.box.y + titleBlock.box.h + spec.lineGap * 1.5;
    const lines = card.lines.map((line, lineIndex) => {
      const h = textHeight(lineFit.size, lineLines[lineIndex]);
      const dot: Box = { x: frame.x + spec.pad, y: y + (textHeight(lineFit.size, 1) - spec.dot) / 2, w: spec.dot, h: spec.dot };
      const text = textBlock(`consent.card.${index}.line.${lineIndex}`, { x: dot.x + spec.dot + 14, y, w: lineW, h }, line, lineFit.size, lineLines[lineIndex]);
      y += h + spec.lineGap;
      return { dot, text };
    });
    return { frame, title: titleBlock, lines };
  });

  // Conectores: del pie del nodo raíz al tope de cada tarjeta (en ángulo recto).
  const startX = root.x + root.w / 2;
  const startY = root.y + root.h;
  const midY = startY + spec.drop / 2;
  const connectors = cards.map((card) => {
    const endX = card.frame.x + card.frame.w / 2;
    return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${card.frame.y}`;
  });
  const blocks: LayoutBlock[] = [
    { kind: "frame", id: "consent.root.frame", box: root },
    rootText,
    ...cards.flatMap((card) => [{ kind: "frame" as const, id: `${card.title.id}.frame`, box: card.frame }, card.title, ...card.lines.flatMap((line) => [{ kind: "media" as const, id: `${line.text.id}.dot`, box: line.dot }, line.text])]),
  ];
  return { title, body, root, rootText, cards, connectors, blocks };
}
