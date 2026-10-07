import { inset, safeArea, splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { LB_ASSETS, type LbCopy } from "@/data/films/flagships/lbWash";
import { cinematicPlateLayout } from "../scenes/brand/layout/cinematicPlate";
import { fitUniform, sampleChipSize } from "../scenes/brand/layout/crmText";
import { MANIFESTO_KICKER_TRACKING } from "../scenes/brand/layout/manifestoBeats";
import { chipWidth, countLines, GLYPH, textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { blockHeight, fitFontSize, GLYPH_EM, LINE_HEIGHT, lineCount } from "../scenes/brand/layout/mediaShared";

/**
 * Geometría propia de LbWashFilm (pura: sin React ni Remotion). Cada escena
 * recibe sus cajas de acá y el test comprueba que nada sale del área segura,
 * que ningún texto pisa a otro y que cada uno entra en sus líneas.
 */

/** Título de escena (BrandTitle): tamaño y líneas que entran en su banda. */
export const LB_TITLE = {
  landscape: { size: 42, lines: 1 },
  portrait: { size: 56, lines: 2 },
} as const;

/** Bandas comunes a las escenas con título: título arriba y cuerpo debajo. */
export function lbBands(format: FilmFormatName) {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const bands = stackBands(safe, [{ id: "title", h: portrait ? 168 : 96 }, { id: "body", flex: 1 }], portrait ? 28 : 22);
  return { safe, title: bands.title, body: bands.body };
}

/* ─── 1 · Apertura: la camioneta, el monograma y la regla ─── */

export type LbHeroLayout = {
  asset: (typeof LB_ASSETS)["vanWide" | "vanClose"];
  plateBox: Box;
  /** Ventana real de la foto (la placa nunca amplía el original). */
  plate: Box;
  logoCenter: { x: number; y: number };
  logoSize: number;
  /** Banda de texto debajo de la placa (tagline y después los beats de la regla). */
  text: Box;
  kicker: Box;
  kickerSize: number;
  tagline: Box;
  taglineSize: number;
};


export function lbHeroLayout(format: FilmFormatName, tagline: string, kickerText: string): LbHeroLayout {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  // Apaisado: la camioneta entera (3:1); 4:5: el mismo vehículo más cerca (2:1).
  const asset = portrait ? LB_ASSETS.vanClose : LB_ASSETS.vanWide;
  const plateH = portrait ? 468 : 460;
  const gap = portrait ? 44 : 30;
  const textH = portrait ? 380 : safe.h - plateH - gap;
  const top = safe.y + Math.round((safe.h - (plateH + gap + textH)) / 2);
  const plateBox: Box = { x: safe.x, y: top, w: safe.w, h: plateH };
  const plate = cinematicPlateLayout(plateBox, { asset, align: "top" }, format).plate;
  const text: Box = { x: safe.x, y: top + plateH + gap, w: safe.w, h: textH };

  // El rótulo va en una línea: baja de tamaño (hasta el mínimo legible) si hace falta.
  const kickerSize = fitFontSize(kickerText, { width: text.w, maxLines: 1, max: portrait ? 22 : 18, min: portrait ? 20 : 15, lineHeight: LINE_HEIGHT.label, glyphEm: GLYPH_EM.label(MANIFESTO_KICKER_TRACKING), step: 1 });
  const kicker: Box = { x: text.x, y: text.y, w: text.w, h: blockHeight(kickerSize, 1, LINE_HEIGHT.label) };
  const maxLines = portrait ? 2 : 1;
  const taglineSize = fitFontSize(tagline, { width: text.w, maxLines, max: portrait ? 76 : 64, min: 40, lineHeight: LINE_HEIGHT.display, glyphEm: GLYPH_EM.display });
  const lines = Math.min(maxLines, lineCount(tagline, taglineSize, text.w, GLYPH_EM.display, maxLines));
  const taglineBox: Box = { x: text.x, y: kicker.y + kicker.h + Math.round(kickerSize * 0.9), w: text.w, h: blockHeight(taglineSize, lines, LINE_HEIGHT.display) };

  return {
    asset,
    plateBox,
    plate,
    logoCenter: { x: plate.x + plate.w / 2, y: plate.y + plate.h / 2 },
    logoSize: Math.round(Math.min(plate.h * 0.82, portrait ? 400 : 360)),
    text,
    kicker,
    kickerSize,
    tagline: taglineBox,
    taglineSize,
  };
}

/* ─── 2 · Cotizador: el sitio real y el webhook que crea la cita ─── */

const PAYLOAD_SPEC = {
  landscape: { pad: 26, gap: 16, kicker: 15, chip: 15, visit: [26, 24, 22, 20], key: 16, value: [18, 17, 16, 15], pill: [17, 16, 15], route: 15, van: [17, 16, 15], rowGap: 8, colGap: 0 },
  portrait: { pad: 24, gap: 16, kicker: 20, chip: 20, visit: [30, 28, 26, 24, 22, 20], key: 20, value: [22, 21, 20], pill: [22, 21, 20], route: 20, van: [22, 21, 20], rowGap: 6, colGap: 28 },
} as const;

export type LbPayloadLine = { row: Box; key: TextBlock; value: TextBlock };
export type LbPill = { frame: Box; dot: Box; text: TextBlock };
export type LbChip = { frame: Box; text: TextBlock };

export type LbPayloadLayout = {
  frame: Box;
  kicker: TextBlock;
  sample: TextBlock;
  visit: TextBlock;
  lines: LbPayloadLine[];
  /** Estados de la cita: `new` (hold) y `confirmed` (pago verificado). */
  pills: LbPill[];
  route: TextBlock;
  vans: LbChip[];
  blocks: LayoutBlock[];
};

/**
 * Panel del webhook: la descripción de la cita con sus pares clave-valor reales
 * (valores de ejemplo), los dos estados y las 4 camionetas. En apaisado, una
 * columna; en 4:5, la cita a la izquierda y los estados a la derecha.
 */
export function lbPayloadLayout(area: Box, copy: LbCopy, format: FilmFormatName): LbPayloadLayout {
  const spec = PAYLOAD_SPEC[format];
  const portrait = format === "portrait";
  const innerW = area.w - spec.pad * 2;

  // Cabecera: rótulo (hasta 2 líneas) y el badge de ejemplo a la derecha.
  const chip = sampleChipSize(copy.sampleLabel, spec.chip);
  const kickerW = innerW - chip.w - 14;
  const kickerLines = Math.min(2, countLines(copy.payloadKicker, spec.kicker, kickerW, GLYPH.upper));
  const headerH = Math.max(chip.h, textHeight(spec.kicker, kickerLines));

  // Columnas: A = visita + pares clave-valor; B = estados + camionetas.
  const [colA, colB] = portrait ? splitColumns({ x: 0, y: 0, w: innerW, h: 0 }, [1.5, 1], spec.colGap) : [{ x: 0, y: 0, w: innerW, h: 0 }, { x: 0, y: 0, w: innerW, h: 0 }];

  const visitFit = fitUniform([copy.payloadVisit], colA.w, spec.visit, 2);
  const keyW = Math.ceil(Math.max(...copy.payloadLines.map((line) => textWidth(line.key, spec.key)))) + 4;
  const valueW = colA.w - keyW - 12;
  const valueFit = fitUniform(copy.payloadLines.map((line) => line.value), valueW, spec.value, 2);
  const lineH = copy.payloadLines.map((line) => Math.max(textHeight(spec.key, 1), textHeight(valueFit.size, Math.min(valueFit.lines, countLines(line.value, valueFit.size, valueW)))));
  const colAH = textHeight(visitFit.size, visitFit.lines) + spec.gap + lineH.reduce((total, h) => total + h, 0) + spec.rowGap * (lineH.length - 1);

  const pillPadX = Math.round(spec.pill[0] * 0.7);
  const dot = Math.round(spec.pill[0] * 0.5);
  const pillTextW = colB.w - pillPadX * 2 - dot - 10;
  const pillFit = fitUniform([copy.stateNew, copy.stateConfirmed], pillTextW, spec.pill, 2);
  const pillLines = [copy.stateNew, copy.stateConfirmed].map((text) => Math.min(pillFit.lines, countLines(text, pillFit.size, pillTextW)));
  const pillH = pillLines.map((lines) => textHeight(pillFit.size, lines) + Math.round(pillFit.size * 0.9));
  const routeLines = Math.min(2, countLines(copy.routeLabel, spec.route, colB.w, GLYPH.upper));
  const vanCols = 2;
  const vanW = (colB.w - 10) / vanCols;
  const vanTexts = [1, 2, 3, 4].map((n) => `${copy.vanLabel} ${n}`);
  const vanFit = fitUniform(vanTexts, vanW - 16, spec.van, 1);
  const vanH = textHeight(vanFit.size, 1) + Math.round(vanFit.size * 0.8);
  const vanRows = Math.ceil(vanTexts.length / vanCols);
  const colBH = pillH[0] + spec.rowGap + pillH[1] + spec.gap + textHeight(spec.route, routeLines) + 10 + vanRows * vanH + (vanRows - 1) * 10;

  const bodyH = portrait ? Math.max(colAH, colBH) : colAH + spec.gap * 1.5 + colBH;
  const frameH = spec.pad * 2 + headerH + spec.gap * 1.5 + bodyH;
  const frame: Box = { x: area.x, y: area.y + Math.max(0, (area.h - frameH) / 2), w: area.w, h: frameH };
  const x0 = frame.x + spec.pad;
  const y0 = frame.y + spec.pad;

  const sample = textBlock("payload.sample", { x: x0 + innerW - chip.w, y: y0 + (headerH - chip.h) / 2, w: chip.w, h: chip.h }, copy.sampleLabel, spec.chip, 1);
  const kicker = textBlock("payload.kicker", { x: x0, y: y0 + (headerH - textHeight(spec.kicker, kickerLines)) / 2, w: kickerW, h: textHeight(spec.kicker, kickerLines) }, copy.payloadKicker, spec.kicker, kickerLines, GLYPH.upper);

  // Columna A.
  const bodyY = y0 + headerH + spec.gap * 1.5;
  const ax = x0 + colA.x;
  const visit = textBlock("payload.visit", { x: ax, y: bodyY, w: colA.w, h: textHeight(visitFit.size, visitFit.lines) }, copy.payloadVisit, visitFit.size, visitFit.lines);
  let y = visit.box.y + visit.box.h + spec.gap;
  const lines = copy.payloadLines.map((line, index): LbPayloadLine => {
    const h = lineH[index];
    const valueLines = Math.min(valueFit.lines, countLines(line.value, valueFit.size, valueW));
    const row: Box = { x: ax, y, w: colA.w, h };
    const key = textBlock(`payload.key.${index}`, { x: ax, y, w: keyW, h: textHeight(spec.key, 1) }, line.key, spec.key, 1);
    const value = textBlock(`payload.value.${index}`, { x: ax + keyW + 12, y, w: valueW, h: textHeight(valueFit.size, valueLines) }, line.value, valueFit.size, valueLines);
    y += h + spec.rowGap;
    return { row, key, value };
  });

  // Columna B (debajo de A en apaisado, a su derecha en 4:5).
  const bx = x0 + colB.x;
  let by = portrait ? bodyY : y - spec.rowGap + spec.gap * 1.5;
  const pills = [copy.stateNew, copy.stateConfirmed].map((text, index): LbPill => {
    const frameBox: Box = { x: bx, y: by, w: colB.w, h: pillH[index] };
    const textH = textHeight(pillFit.size, pillLines[index]);
    const dotBox: Box = { x: bx + pillPadX, y: by + (pillH[index] - dot) / 2, w: dot, h: dot };
    const pill = { frame: frameBox, dot: dotBox, text: textBlock(`payload.pill.${index}`, { x: dotBox.x + dot + 10, y: by + (pillH[index] - textH) / 2, w: pillTextW, h: textH }, text, pillFit.size, pillLines[index]) };
    by += pillH[index] + spec.rowGap;
    return pill;
  });
  by += spec.gap - spec.rowGap;
  const route = textBlock("payload.route", { x: bx, y: by, w: colB.w, h: textHeight(spec.route, routeLines) }, copy.routeLabel, spec.route, routeLines, GLYPH.upper);
  by += route.box.h + 10;
  const vans = vanTexts.map((text, index): LbChip => {
    const col = index % vanCols;
    const rowIndex = Math.floor(index / vanCols);
    const chipBox: Box = { x: bx + col * (vanW + 10), y: by + rowIndex * (vanH + 10), w: vanW, h: vanH };
    return { frame: chipBox, text: textBlock(`payload.van.${index}`, inset(chipBox, 8, (vanH - textHeight(vanFit.size, 1)) / 2), text, vanFit.size, 1) };
  });

  const blocks: LayoutBlock[] = [
    { kind: "frame", id: "payload.frame", box: frame },
    kicker,
    sample,
    visit,
    ...lines.flatMap((line) => [line.key, line.value]),
    ...pills.flatMap((pill) => [{ kind: "media" as const, id: `${pill.text.id}.dot`, box: pill.dot }, pill.text]),
    route,
    ...vans.map((van) => van.text),
  ];
  return { frame, kicker, sample, visit, lines, pills, route, vans, blocks };
}

export function lbQuoterLayout(format: FilmFormatName, copy: LbCopy) {
  const { title, body } = lbBands(format);
  const [reel, panelArea] =
    format === "portrait"
      ? (() => {
          const stacked = stackBands(body, [{ id: "reel", h: 520 }, { id: "panel", flex: 1 }], 24);
          return [stacked.reel, stacked.panel];
        })()
      : splitColumns(body, [1.5, 1], 36);
  return { title, reel, panelArea, panel: lbPayloadLayout(panelArea, copy, format) };
}

/* ─── 4 · La cuadrilla: el teléfono real y lo que escribe cada botón ─── */

const CREW_SPEC = {
  landscape: { pad: 28, gap: 22, title: 16, chip: 15, button: [20, 19, 18, 17, 16], effect: [19, 18, 17, 16, 15], result: [20, 19, 18, 17, 16], note: [17, 16, 15], rowGap: 12, arrow: 30 },
  portrait: { pad: 24, gap: 26, title: 20, chip: 20, button: [24, 23, 22, 21, 20], effect: [22, 21, 20], result: [22, 21, 20], note: [21, 20], rowGap: 22, arrow: 30 },
} as const;

/** Proporción del teléfono (PhoneFrame: alto = 2,08 × ancho) y su relleno interior. */
export const PHONE = { aspect: 2.08, pad: 0.035, radius: 0.12 } as const;

export type LbCrewRow = { row: Box; button: Box; label: TextBlock; arrow: Box; effect: TextBlock };

/** Ancho mínimo del efecto al lado del botón; por debajo, el efecto va debajo del botón. */
const CREW_EFFECT_MIN = 300;

export type LbCrewPanelLayout = {
  frame: Box;
  title: TextBlock;
  sample: TextBlock;
  rows: LbCrewRow[];
  result: TextBlock;
  note: TextBlock;
  blocks: LayoutBlock[];
};

export function lbCrewPanelLayout(area: Box, copy: LbCopy, format: FilmFormatName): LbCrewPanelLayout {
  const spec = CREW_SPEC[format];
  const innerW = area.w - spec.pad * 2;
  // Título a todo el ancho; el badge de ejemplo cierra el panel, debajo de la nota.
  const titleLines = Math.min(2, countLines(copy.crewPanelTitle, spec.title, innerW, GLYPH.upper));
  const titleH = textHeight(spec.title, titleLines);
  const chip = sampleChipSize(copy.sampleLabel, spec.chip);

  // Botón réplica (mismo color que en la app) con su rótulo en una línea.
  const labels = copy.crewActions.map((action) => action.label);
  const buttonPad = 16;
  const buttonSize = spec.button.find((size) => Math.max(...labels.map((label) => chipWidth(label, size, buttonPad))) <= innerW * 0.5) ?? spec.button[spec.button.length - 1];
  const buttonW = Math.max(...labels.map((label) => chipWidth(label, buttonSize, buttonPad)));
  const buttonH = textHeight(buttonSize, 1) + Math.round(buttonSize * 1.1);
  // Al lado del botón si hay lugar; si no, debajo (con la flecha a la izquierda).
  const beside = innerW - buttonW - spec.arrow - 24 >= CREW_EFFECT_MIN;
  const effectX = beside ? buttonW + spec.arrow + 24 : spec.arrow + 10;
  const effectW = innerW - effectX;
  const effectFit = fitUniform(copy.crewActions.map((action) => action.effect), effectW, spec.effect, 2);
  const effectLines = copy.crewActions.map((action) => Math.min(effectFit.lines, countLines(action.effect, effectFit.size, effectW)));
  const effectH = effectLines.map((lines) => textHeight(effectFit.size, lines));
  const rowH = effectH.map((h) => (beside ? Math.max(buttonH, h) : buttonH + 8 + h));
  const resultFit = fitUniform([copy.crewResult], innerW, spec.result, 3);
  const noteFit = fitUniform([copy.crewNote], innerW, spec.note, 3);

  const frameH =
    spec.pad * 2 + titleH + spec.gap + rowH.reduce((total, h) => total + h, 0) + spec.rowGap * (rowH.length - 1) + spec.gap + textHeight(resultFit.size, resultFit.lines) + 10 + textHeight(noteFit.size, noteFit.lines) + 14 + chip.h;
  const frame: Box = { x: area.x, y: area.y + Math.max(0, (area.h - frameH) / 2), w: area.w, h: frameH };
  const x0 = frame.x + spec.pad;
  const y0 = frame.y + spec.pad;

  const title = textBlock("crew.title", { x: x0, y: y0, w: innerW, h: titleH }, copy.crewPanelTitle, spec.title, titleLines, GLYPH.upper);
  let y = y0 + titleH + spec.gap;
  const rows = copy.crewActions.map((action, index): LbCrewRow => {
    const h = rowH[index];
    const row: Box = { x: x0, y, w: innerW, h };
    const button: Box = { x: x0, y: beside ? y + (h - buttonH) / 2 : y, w: buttonW, h: buttonH };
    const label = textBlock(`crew.button.${index}`, inset(button, buttonPad - 4, (buttonH - textHeight(buttonSize, 1)) / 2), action.label, buttonSize, 1);
    const effectY = beside ? y + (h - effectH[index]) / 2 : y + buttonH + 8;
    const arrow: Box = beside ? { x: button.x + buttonW + 12, y: y + (h - 14) / 2, w: spec.arrow, h: 14 } : { x: x0, y: effectY + (textHeight(effectFit.size, 1) - 14) / 2, w: spec.arrow, h: 14 };
    const effect = textBlock(`crew.effect.${index}`, { x: x0 + effectX, y: effectY, w: effectW, h: effectH[index] }, action.effect, effectFit.size, effectLines[index]);
    y += h + spec.rowGap;
    return { row, button, label, arrow, effect };
  });
  y += spec.gap - spec.rowGap;
  const result = textBlock("crew.result", { x: x0, y, w: innerW, h: textHeight(resultFit.size, resultFit.lines) }, copy.crewResult, resultFit.size, resultFit.lines);
  y += result.box.h + 10;
  const note = textBlock("crew.note", { x: x0, y, w: innerW, h: textHeight(noteFit.size, noteFit.lines) }, copy.crewNote, noteFit.size, noteFit.lines);
  y += note.box.h + 14;
  const sample = textBlock("crew.sample", { x: x0, y, w: chip.w, h: chip.h }, copy.sampleLabel, spec.chip, 1);

  const blocks: LayoutBlock[] = [
    { kind: "frame", id: "crew.frame", box: frame },
    title,
    ...rows.flatMap((row) => [{ kind: "frame" as const, id: `${row.label.id}.frame`, box: row.button }, row.label, { kind: "media" as const, id: `${row.effect.id}.arrow`, box: row.arrow }, row.effect]),
    result,
    note,
    sample,
  ];
  return { frame, title, sample, rows, result, note, blocks };
}

export function lbCrewLayout(format: FilmFormatName, copy: LbCopy) {
  const { title, body } = lbBands(format);
  const portrait = format === "portrait";
  const [phoneCol, panelArea] = splitColumns(body, portrait ? [0.42, 0.58] : [0.78, 1.22], portrait ? 28 : 40);
  // El teléfono ocupa el alto (o el ancho) de su columna, con aire para flotar unos píxeles.
  const phoneW = Math.floor(Math.min(phoneCol.w, (phoneCol.h - 16) / PHONE.aspect));
  const phoneH = phoneW * PHONE.aspect;
  const phone: Box = { x: phoneCol.x + (phoneCol.w - phoneW) / 2, y: phoneCol.y + (phoneCol.h - phoneH) / 2, w: phoneW, h: phoneH };
  const screen = inset(phone, phoneW * PHONE.pad);
  return { title, phoneCol, phone, screen, panelArea, panel: lbCrewPanelLayout(panelArea, copy, format) };
}
