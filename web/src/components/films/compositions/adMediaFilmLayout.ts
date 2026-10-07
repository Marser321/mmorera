import { inset, safeArea, splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { AD_ASSETS, type AdCopy } from "@/data/films/flagships/adMedia";
import { cinematicPlateLayout } from "../scenes/brand/layout/cinematicPlate";
import { fitUniform, sampleChipSize } from "../scenes/brand/layout/crmText";
import { chipWidth, countLines, GLYPH, largestFit, textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { MANIFESTO_KICKER_TRACKING } from "../scenes/brand/layout/manifestoBeats";
import { blockHeight, fitFontSize, GLYPH_EM, LINE_HEIGHT, lineCount } from "../scenes/brand/layout/mediaShared";

/**
 * Geometría propia de AdMediaFilm (pura: sin React ni Remotion). Cada escena
 * recibe sus cajas de acá; el test comprueba que nada sale del área segura,
 * que ningún texto pisa a otro y que cada uno entra en sus líneas, en 16:9 y
 * 4:5 y en los dos idiomas.
 */

/** Título de escena (BrandTitle): tamaño y líneas que entran en su banda. */
export const AD_TITLE = {
  landscape: { size: 42, lines: 1 },
  portrait: { size: 56, lines: 2 },
} as const;

export function adBands(format: FilmFormatName) {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const bands = stackBands(safe, [{ id: "title", h: portrait ? 168 : 96 }, { id: "body", flex: 1 }], portrait ? 28 : 22);
  return { safe, title: bands.title, body: bands.body };
}

/* ─── 1 · Apertura: el isotipo sobre su grilla de construcción ─── */

/** Centro y ancho del "ad" dibujado en la grilla del manual (fracciones de brand-grid.jpg). */
export const AD_GRID_MARK = { cx: 0.5, cy: 0.47, w: 535 / 1684 } as const;

/** Encuadre de la grilla: centrada, así entran las cotas de arriba ("3x") y de abajo ("31x"). */
export const AD_GRID_FOCAL = { x: 0.5, y: 0.5 } as const;

export function adOpeningLayout(format: FilmFormatName, tagline: string, kickerText: string) {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const asset = AD_ASSETS.brandGrid;
  const plateH = portrait ? 528 : 500;
  const gap = portrait ? 40 : 28;
  const wordmarkH = portrait ? 44 : 34;
  const kickerSize = fitFontSize(kickerText, { width: safe.w, maxLines: 1, max: portrait ? 22 : 18, min: portrait ? 20 : 15, lineHeight: LINE_HEIGHT.label, glyphEm: GLYPH_EM.label(MANIFESTO_KICKER_TRACKING), step: 1 });
  const kickerH = blockHeight(kickerSize, 1, LINE_HEIGHT.label);
  const maxLines = portrait ? 2 : 1;
  const textWBase = portrait ? safe.w : Math.min(safe.w, Math.round(plateH * 2.39));
  const taglineSize = fitFontSize(tagline, { width: textWBase, maxLines, max: portrait ? 72 : 60, min: 40, lineHeight: LINE_HEIGHT.display, glyphEm: GLYPH_EM.display });
  const taglineLines = Math.min(maxLines, lineCount(tagline, taglineSize, textWBase, GLYPH_EM.display, maxLines));
  const taglineH = blockHeight(taglineSize, taglineLines, LINE_HEIGHT.display);
  const textH = wordmarkH + 18 + kickerH + Math.round(kickerSize * 0.8) + taglineH;
  const top = safe.y + Math.max(0, Math.round((safe.h - (plateH + gap + textH)) / 2));
  const plateBox: Box = { x: safe.x, y: top, w: safe.w, h: plateH };
  const plateLayout = cinematicPlateLayout(plateBox, { asset, focal: AD_GRID_FOCAL, align: "top" }, format);
  const { plate, media } = plateLayout;
  // En apaisado el texto se alinea con la placa (más angosta que el área por el recorte anamórfico).
  const textX = portrait ? safe.x : plate.x;
  const textW = portrait ? safe.w : plate.w;
  const wordmarkW = Math.round((wordmarkH * AD_ASSETS.wordmark.w) / AD_ASSETS.wordmark.h);
  let y = plate.y + plate.h + gap;
  const wordmark: Box = { x: portrait ? textX + (textW - wordmarkW) / 2 : textX, y, w: wordmarkW, h: wordmarkH };
  y += wordmarkH + 18;
  const kicker: Box = { x: textX, y, w: textW, h: kickerH };
  y += kickerH + Math.round(kickerSize * 0.8);
  const taglineBox: Box = { x: textX, y, w: textW, h: taglineH };
  // Las partículas forman el isotipo donde la grilla lo dibuja, al mismo ancho.
  const markW = AD_GRID_MARK.w * media.w;
  return {
    asset,
    plateBox,
    plate,
    wordmark,
    kicker,
    kickerSize,
    tagline: taglineBox,
    taglineSize,
    logoCenter: { x: media.x + AD_GRID_MARK.cx * media.w, y: media.y + AD_GRID_MARK.cy * media.h },
    logoSize: Math.round(markW / 0.96),
  };
}

/* ─── 2 · La alianza: el CEO en placa y los tres beats ─── */

export function adAllianceLayout(format: FilmFormatName, copy: AdCopy) {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const [plateBox, text] = portrait
    ? (() => {
        const stacked = stackBands(safe, [{ id: "plate", h: 660 }, { id: "text", flex: 1 }], 36);
        return [stacked.plate, stacked.text];
      })()
    : splitColumns(safe, [0.8, 1.2], 72);
  const caption = { kicker: copy.ceoKicker, text: copy.ceoName };
  const plate = cinematicPlateLayout(plateBox, { asset: AD_ASSETS.ceo, caption, focal: { x: 0.6, y: 0.32 } }, format);
  return { plateBox, plate, caption, text };
}

/* ─── 3 · El sitio en producción y lo que hace cada sección ─── */

const SITE_SPEC = {
  landscape: { index: 15, label: [24, 22, 21, 20, 19, 18], gap: 30, indexGap: 18 },
  portrait: { index: 20, label: [28, 26, 24, 22, 21, 20], gap: 22, indexGap: 18 },
} as const;

export type AdSiteItem = { index: TextBlock; label: TextBlock; rule: Box };

export function adSiteLayout(format: FilmFormatName, copy: AdCopy) {
  const { title, body } = adBands(format);
  const portrait = format === "portrait";
  const spec = SITE_SPEC[format];
  const [reel, listArea] = portrait
    ? (() => {
        const stacked = stackBands(body, [{ id: "reel", h: 620 }, { id: "list", flex: 1 }], 28);
        return [stacked.reel, stacked.list];
      })()
    : splitColumns(body, [1.75, 1], 48);
  const indexW = Math.ceil(textWidth("04", spec.index, GLYPH.digits)) + 4;
  const labelW = listArea.w - indexW - spec.indexGap;
  const fit = fitUniform(copy.siteStops, labelW, spec.label, 2);
  const heights = copy.siteStops.map((stop) => textHeight(fit.size, Math.min(fit.lines, countLines(stop, fit.size, labelW))));
  const total = heights.reduce((sum, h) => sum + h, 0) + spec.gap * (heights.length - 1);
  let y = listArea.y + Math.max(0, (listArea.h - total) / 2);
  const items = copy.siteStops.map((stop, index): AdSiteItem => {
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
export function adSiteStopFrames(duration: number, stops: number) {
  const from = 30;
  const to = Math.max(from + 1, duration - 30);
  const segment = (to - from) / Math.max(1, stops - 1);
  return Array.from({ length: stops }, (_, index) => (index === 0 ? 0 : Math.round(from + (index - 1) * segment + segment * 0.6)));
}

/* ─── 4 · Speed-to-Lead y pipeline de 5 etapas (escena protagonista) ─── */

const PIPE_SPEC = {
  landscape: {
    speedRatio: 0.29,
    gap: 28,
    pad: 22,
    speedTitle: 15,
    chip: 15,
    name: [19, 18, 17],
    meta: [16, 15],
    ring: 164,
    value: 40,
    replied: 15,
    window: 15,
    eventTime: 15,
    event: [17, 16, 15],
    boardPad: 18,
    boardHead: 36,
    boardTitle: [20, 19, 18],
    colGap: 10,
    colPad: 10,
    stage: [17, 16, 15],
    count: 15,
    card: { pad: 10, name: [18, 17, 16, 15], meta: [16, 15], tag: 15, slotGap: 12 },
    caption: [20, 19, 18, 17],
  },
  portrait: {
    gap: 24,
    pad: 20,
    speedTitle: 20,
    chip: 20,
    name: [24, 22],
    meta: [21, 20],
    ring: 176,
    value: 38,
    replied: 20,
    window: 20,
    eventTime: 20,
    event: [21, 20],
    boardPad: 16,
    boardHead: 44,
    boardTitle: [24, 22, 20],
    rowGap: 8,
    rowPad: 4,
    labelW: 250,
    stage: [22, 21, 20],
    count: 20,
    card: { pad: 6, name: [21, 20], tag: 20, slotGap: 10 },
    caption: [24, 22, 21, 20],
  },
} as const;

export type AdChip = { frame: Box; text: TextBlock };
export type AdCard = { frame: Box; name: TextBlock; meta: TextBlock | null; tag: AdChip };
export type AdColumn = { frame: Box; label: TextBlock; count: AdChip; slots: AdCard[] };

/** Carril de la tarjeta protagonista dentro de cada columna (las de fondo ocupan los anteriores). */
export const AD_HERO_SLOT = 2;

/** Pastilla de etiqueta dentro de una tarjeta. */
function tagChip(id: string, text: string, size: number, x: number, y: number, maxW: number): AdChip {
  const pad = Math.round(size * 0.55);
  const w = Math.min(maxW, chipWidth(text, size, pad));
  const h = textHeight(size, 1) + Math.round(size * 0.55);
  const frame: Box = { x, y, w, h };
  return { frame, text: textBlock(id, inset(frame, pad - 2, (h - textHeight(size, 1)) / 2), text, size, 1) };
}

/** Tarjeta: nombre, servicio (opcional) y etiqueta abajo (la protagonista lleva la etiqueta más ancha de su recorrido). */
function cardBoxes(id: string, frame: Box, name: string, tags: string[], nameSize: number, tagSize: number, pad: number, meta?: { text: string; size: number }): AdCard {
  const inner = inset(frame, pad);
  const nameBlock = textBlock(`${id}.name`, { x: inner.x, y: inner.y, w: inner.w, h: textHeight(nameSize, 1) }, name, nameSize, 1);
  const metaBlock = meta ? textBlock(`${id}.meta`, { x: inner.x, y: nameBlock.box.y + nameBlock.box.h + 3, w: inner.w, h: textHeight(meta.size, 1) }, meta.text, meta.size, 1) : null;
  const widest = tags.reduce((best, tag) => (textWidth(tag, tagSize) > textWidth(best, tagSize) ? tag : best), tags[0]);
  const chip = tagChip(`${id}.tag`, widest, tagSize, inner.x, inner.y + inner.h - (textHeight(tagSize, 1) + Math.round(tagSize * 0.55)), inner.w);
  return { frame, name: nameBlock, meta: metaBlock, tag: chip };
}

export type AdSpeedLayout = {
  frame: Box;
  title: TextBlock;
  toast: { frame: Box; source: AdChip; name: TextBlock; meta: TextBlock };
  ring: Box;
  value: TextBlock;
  replied: TextBlock;
  window: TextBlock;
  events: Array<{ dot: Box; time: TextBlock; label: TextBlock }>;
  blocks: LayoutBlock[];
};

function speedPanel(frameArea: Box, copy: AdCopy, format: FilmFormatName): AdSpeedLayout {
  const spec = PIPE_SPEC[format];
  const portrait = format === "portrait";
  const innerW = frameArea.w - spec.pad * 2;
  const titleH = textHeight(spec.speedTitle, 1);

  // Columnas internas: en 4:5 el reloj a la izquierda y el lead + eventos a la derecha.
  const ringColW = portrait ? spec.ring + 50 : innerW;
  const listW = portrait ? innerW - ringColW - 24 : innerW;

  const nameSize = largestFit([copy.leadName], listW - 24, 1, [...spec.name]);
  const metaSize = largestFit([copy.leadMeta], listW - 24, 1, [...spec.meta]);
  const sourceH = textHeight(spec.chip, 1) + Math.round(spec.chip * 0.55);
  const toastH = 12 + sourceH + 8 + textHeight(nameSize, 1) + 2 + textHeight(metaSize, 1) + 12;
  const timeW = Math.ceil(textWidth("00:00", spec.eventTime, GLYPH.digits)) + 4;
  const dot = Math.round(spec.eventTime * 0.55);
  const eventW = listW - dot - 10 - timeW - 10;
  const eventFit = fitUniform(copy.leadEvents.map((event) => event.label), eventW, spec.event, 2);
  const eventLines = copy.leadEvents.map((event) => Math.min(eventFit.lines, countLines(event.label, eventFit.size, eventW)));
  const eventH = eventLines.map((lines) => textHeight(eventFit.size, lines));
  const eventGap = portrait ? 6 : 10;
  const eventsH = eventH.reduce((sum, h) => sum + h, 0) + eventGap * (eventH.length - 1);
  const windowLines = Math.min(2, countLines(copy.windowLabel, spec.window, ringColW));
  const ringBlockH = spec.ring + 10 + textHeight(spec.window, windowLines);

  const contentH = portrait ? titleH + 16 + Math.max(ringBlockH, toastH + 14 + eventsH) : titleH + 16 + toastH + 22 + ringBlockH + 22 + eventsH;
  const frameH = portrait ? contentH + spec.pad * 2 : frameArea.h;
  const frame: Box = { x: frameArea.x, y: frameArea.y, w: frameArea.w, h: frameH };
  const x0 = frame.x + spec.pad;
  let y = frame.y + spec.pad + (portrait ? 0 : Math.max(0, (frameH - spec.pad * 2 - contentH) / 2));

  const title = textBlock("speed.title", { x: x0, y, w: innerW, h: titleH }, copy.speedTitle, spec.speedTitle, 1, GLYPH.upper);
  y += titleH + 16;
  const listX = portrait ? x0 + ringColW + 24 : x0;
  const ringX = x0 + (ringColW - spec.ring) / 2;
  const columnTop = y;

  // Lead entrante.
  const toastFrame: Box = { x: listX, y, w: listW, h: toastH };
  const source = tagChip("speed.source", copy.leadSource, spec.chip, listX + 12, y + 12, listW - 24);
  const name = textBlock("speed.name", { x: listX + 12, y: y + 12 + sourceH + 8, w: listW - 24, h: textHeight(nameSize, 1) }, copy.leadName, nameSize, 1);
  const meta = textBlock("speed.meta", { x: listX + 12, y: name.box.y + name.box.h + 2, w: listW - 24, h: textHeight(metaSize, 1) }, copy.leadMeta, metaSize, 1);
  y += toastH + (portrait ? 14 : 22);

  // Reloj: en apaisado debajo del lead; en 4:5 en su columna.
  const ringY = portrait ? columnTop : y;
  const ring: Box = { x: ringX, y: ringY, w: spec.ring, h: spec.ring };
  const valueH = textHeight(spec.value, 1);
  const repliedH = textHeight(spec.replied, 1);
  const valueTop = ring.y + (spec.ring - valueH - 4 - repliedH) / 2;
  const value = textBlock("speed.value", { x: ring.x + 16, y: valueTop, w: spec.ring - 32, h: valueH }, "00:00", spec.value, 1, GLYPH.digits);
  const replied = textBlock("speed.replied", { x: ring.x + 16, y: valueTop + valueH + 4, w: spec.ring - 32, h: repliedH }, copy.repliedLabel, spec.replied, 1);
  const windowBlock = textBlock("speed.window", { x: x0 + (portrait ? 0 : 0), y: ring.y + spec.ring + 10, w: ringColW, h: textHeight(spec.window, windowLines) }, copy.windowLabel, spec.window, windowLines);
  if (!portrait) y += ringBlockH + 22;

  // Eventos con su segundo de la muestra.
  const events = copy.leadEvents.map((event, index) => {
    const h = eventH[index];
    const lineH = textHeight(eventFit.size, 1);
    const dotBox: Box = { x: listX, y: y + (lineH - dot) / 2, w: dot, h: dot };
    const time = textBlock(`speed.time.${index}`, { x: listX + dot + 10, y: y + (lineH - textHeight(spec.eventTime, 1)) / 2, w: timeW, h: textHeight(spec.eventTime, 1) }, `00:0${event.at}`, spec.eventTime, 1, GLYPH.digits);
    const label = textBlock(`speed.event.${index}`, { x: listX + dot + 10 + timeW + 10, y, w: eventW, h }, event.label, eventFit.size, eventLines[index]);
    y += h + eventGap;
    return { dot: dotBox, time, label };
  });

  const blocks: LayoutBlock[] = [
    title,
    { kind: "frame", id: "speed.toast", box: toastFrame },
    { kind: "frame", id: "speed.source.frame", box: source.frame },
    source.text,
    name,
    meta,
    { kind: "frame", id: "speed.ring", box: ring },
    value,
    replied,
    windowBlock,
    ...events.flatMap((event) => [{ kind: "media" as const, id: `${event.label.id}.dot`, box: event.dot }, event.time, event.label]),
  ];
  return { frame, title, toast: { frame: toastFrame, source, name, meta }, ring, value, replied, window: windowBlock, events, blocks };
}

export type AdBoardLayout = {
  frame: Box;
  orientation: "columns" | "rows";
  logo: Box;
  title: TextBlock;
  sample: TextBlock;
  columns: AdColumn[];
};

function boardHeader(board: Box, copy: AdCopy, format: FilmFormatName) {
  const spec = PIPE_SPEC[format];
  const inner = inset(board, spec.boardPad);
  const head = spec.boardHead;
  // Emblema del CRM de marca blanca sobre una pastilla clara (el logo es tinta oscura).
  const logoH = head;
  const logoW = Math.round(((head - 12) * AD_ASSETS.logoCrm.w) / AD_ASSETS.logoCrm.h) + 24;
  const logo: Box = { x: inner.x, y: inner.y, w: logoW, h: logoH };
  const chip = sampleChipSize(copy.sampleLabel, spec.chip);
  const sample = textBlock("board.sample", { x: inner.x + inner.w - chip.w, y: inner.y + (head - chip.h) / 2, w: chip.w, h: chip.h }, copy.sampleLabel, spec.chip, 1);
  const titleW = inner.w - logoW - 14 - chip.w - 14;
  const titleSize = largestFit([copy.boardTitle], titleW, 1, [...spec.boardTitle]);
  const title = textBlock("board.title", { x: logo.x + logoW + 14, y: inner.y + (head - textHeight(titleSize, 1)) / 2, w: titleW, h: textHeight(titleSize, 1) }, copy.boardTitle, titleSize, 1);
  return { inner, logo, sample, title, top: inner.y + head };
}

function boardColumns(board: Box, copy: AdCopy): AdBoardLayout {
  const spec = PIPE_SPEC.landscape;
  const { inner, logo, sample, title, top } = boardHeader(board, copy, "landscape");
  const colsArea: Box = { x: inner.x, y: top + 14, w: inner.w, h: inner.y + inner.h - (top + 14) };
  const frames = splitColumns(colsArea, copy.stages.map(() => 1), spec.colGap);
  const countW = chipWidth("88", spec.count, 8, GLYPH.digits);
  const labelW = frames[0].w - spec.colPad * 2 - countW - 6;
  const stageFit = fitUniform(copy.stages, labelW, spec.stage, 2);
  const headH = Math.max(textHeight(stageFit.size, stageFit.lines), textHeight(spec.count, 1) + 8);
  const cardW = frames[0].w - spec.colPad * 2;
  const allNames = copy.boardCards.flat().map((card) => card.name).concat(copy.leadName);
  const nameSize = largestFit(allNames, cardW - spec.card.pad * 2, 1, [...spec.card.name]);
  const services = copy.boardCards.flat().map((card) => card.service).concat(copy.leadService);
  const metaSize = largestFit(services, cardW - spec.card.pad * 2, 1, [...spec.card.meta]);
  const cardH = spec.card.pad * 2 + textHeight(nameSize, 1) + 3 + textHeight(metaSize, 1) + 6 + textHeight(spec.card.tag, 1) + Math.round(spec.card.tag * 0.55);
  const columns = frames.map((frame, stage): AdColumn => {
    const headY = frame.y + spec.colPad;
    const count = { x: frame.x + frame.w - spec.colPad - countW, y: headY, w: countW, h: textHeight(spec.count, 1) + 8 };
    const label = textBlock(`stage.${stage}`, { x: frame.x + spec.colPad, y: headY, w: labelW, h: textHeight(stageFit.size, stageFit.lines) }, copy.stages[stage], stageFit.size, stageFit.lines);
    const slotsTop = headY + headH + 12;
    const slots = [0, 1, AD_HERO_SLOT].map((slot) => {
      const slotFrame: Box = { x: frame.x + spec.colPad, y: slotsTop + slot * (cardH + spec.card.slotGap), w: cardW, h: cardH };
      const card = slot === AD_HERO_SLOT ? { name: copy.leadName, service: copy.leadService, tags: copy.heroTags } : { name: copy.boardCards[stage][slot].name, service: copy.boardCards[stage][slot].service, tags: [copy.boardCards[stage][slot].tag] };
      return cardBoxes(`card.${stage}.${slot}`, slotFrame, card.name, card.tags, nameSize, spec.card.tag, spec.card.pad, { text: card.service, size: metaSize });
    });
    return { frame, label, count: { frame: count, text: textBlock(`stage.${stage}.count`, inset(count, 4, 4), "88", spec.count, 1, GLYPH.digits) }, slots };
  });
  return { frame: board, orientation: "columns", logo, title, sample, columns };
}

function boardRows(board: Box, copy: AdCopy): AdBoardLayout {
  const spec = PIPE_SPEC.portrait;
  const { inner, logo, sample, title, top } = boardHeader(board, copy, "portrait");
  const rowsArea: Box = { x: inner.x, y: top + 12, w: inner.w, h: inner.y + inner.h - (top + 12) };
  const rowH = (rowsArea.h - spec.rowGap * (copy.stages.length - 1)) / copy.stages.length;
  const countW = chipWidth("88", spec.count, 8, GLYPH.digits);
  const labelW = spec.labelW - 20 - countW - 8;
  const stageFit = fitUniform(copy.stages, labelW, spec.stage, 2);
  const laneX = rowsArea.x + spec.labelW + 10;
  const laneW = rowsArea.x + rowsArea.w - laneX;
  const cardW = (laneW - spec.card.slotGap * 2) / 3;
  const allNames = copy.boardCards.flat().map((card) => card.name).concat(copy.leadName);
  const nameSize = largestFit(allNames, cardW - spec.card.pad * 2, 1, [...spec.card.name]);
  const columns = copy.stages.map((stageLabel, stage): AdColumn => {
    const frame: Box = { x: rowsArea.x, y: rowsArea.y + stage * (rowH + spec.rowGap), w: rowsArea.w, h: rowH };
    const labelH = textHeight(stageFit.size, stageFit.lines);
    const label = textBlock(`stage.${stage}`, { x: frame.x + 10, y: frame.y + (rowH - labelH) / 2, w: labelW, h: labelH }, stageLabel, stageFit.size, stageFit.lines);
    const count = { x: frame.x + spec.labelW - 10 - countW, y: frame.y + (rowH - (textHeight(spec.count, 1) + 8)) / 2, w: countW, h: textHeight(spec.count, 1) + 8 };
    const slots = [0, 1, AD_HERO_SLOT].map((slot) => {
      const slotFrame: Box = { x: laneX + slot * (cardW + spec.card.slotGap), y: frame.y + spec.rowPad, w: cardW, h: rowH - spec.rowPad * 2 };
      const card = slot === AD_HERO_SLOT ? { name: copy.leadName, tags: copy.heroTags } : { name: copy.boardCards[stage][slot].name, tags: [copy.boardCards[stage][slot].tag] };
      return cardBoxes(`card.${stage}.${slot}`, slotFrame, card.name, card.tags, nameSize, spec.card.tag, spec.card.pad);
    });
    return { frame, label, count: { frame: count, text: textBlock(`stage.${stage}.count`, inset(count, 4, 4), "88", spec.count, 1, GLYPH.digits) }, slots };
  });
  return { frame: board, orientation: "rows", logo, title, sample, columns };
}

export type AdPipelineLayout = {
  title: Box;
  speed: AdSpeedLayout;
  board: AdBoardLayout;
  caption: { frame: Box; text: Box; size: number; lines: number };
};

export function adPipelineLayout(format: FilmFormatName, copy: AdCopy): AdPipelineLayout {
  const { title, body } = adBands(format);
  const portrait = format === "portrait";
  const spec = PIPE_SPEC[format];
  const captionFit = fitUniform(copy.automations, (portrait ? body.w : body.w * (1 - PIPE_SPEC.landscape.speedRatio)) - 48, spec.caption, 1);
  const captionH = textHeight(captionFit.size, captionFit.lines) + 20;

  if (portrait) {
    const speed = speedPanel({ x: body.x, y: body.y, w: body.w, h: 0 }, copy, format);
    const captionFrame: Box = { x: body.x, y: body.y + body.h - captionH, w: body.w, h: captionH };
    const boardFrame: Box = { x: body.x, y: speed.frame.y + speed.frame.h + spec.gap, w: body.w, h: captionFrame.y - 16 - (speed.frame.y + speed.frame.h + spec.gap) };
    return { title, speed, board: boardRows(boardFrame, copy), caption: { frame: captionFrame, text: inset(captionFrame, 24, 10), size: captionFit.size, lines: captionFit.lines } };
  }
  const [speedCol, boardCol] = splitColumns(body, [PIPE_SPEC.landscape.speedRatio, 1 - PIPE_SPEC.landscape.speedRatio], spec.gap);
  const speed = speedPanel(speedCol, copy, format);
  const captionFrame: Box = { x: boardCol.x, y: body.y + body.h - captionH, w: boardCol.w, h: captionH };
  const boardFrame: Box = { x: boardCol.x, y: body.y, w: boardCol.w, h: captionFrame.y - 16 - body.y };
  return { title, speed, board: boardColumns(boardFrame, copy), caption: { frame: captionFrame, text: inset(captionFrame, 24, 10), size: captionFit.size, lines: captionFit.lines } };
}

/** Bloques del tablero con la protagonista en `heroStage` (para verificar solapes en cada estado). */
export function adBoardBlocks(board: AdBoardLayout, heroStage: number | null): LayoutBlock[] {
  const blocks: LayoutBlock[] = [{ kind: "media", id: "board.logo", box: board.logo }, board.title, board.sample];
  board.columns.forEach((column, stage) => {
    blocks.push(column.label, { kind: "frame", id: `${column.label.id}.count.frame`, box: column.count.frame }, column.count.text);
    column.slots.forEach((card, slot) => {
      if (slot === AD_HERO_SLOT && stage !== heroStage) return;
      blocks.push({ kind: "frame", id: `${card.name.id}.frame`, box: card.frame }, card.name, ...(card.meta ? [card.meta] : []), { kind: "frame", id: `${card.tag.text.id}.frame`, box: card.tag.frame }, card.tag.text);
    });
  });
  return blocks;
}

/** Guion del tablero protagonista (frames relativos a la escena). */
export function adPipelineTiming(duration: number, stages: number, lastEventSecond: number) {
  const toastIn = 18;
  const clockFrom = 44;
  const secondFrames = 12;
  const clockStop = clockFrom + lastEventSecond * secondFrames;
  const entry = clockStop + 64;
  const entryFrames = 34;
  const moveFrames = 38;
  // Los movimientos se reparten entre la llegada al tablero y el último tramo de la escena (que se sostiene).
  const firstMove = entry + entryFrames + 36;
  const lastMoveEnd = duration - 90;
  const gap = (lastMoveEnd - moveFrames - firstMove) / Math.max(1, stages - 2);
  const moves = Array.from({ length: stages - 1 }, (_, index) => Math.round(firstMove + index * gap));
  return { toastIn, clockFrom, secondFrames, clockStop, entry, entryFrames, moveFrames, moves };
}

/* ─── 6 · Ingeniería: el muro de cifras y la línea de créditos ─── */

export function adEngineeringLayout(format: FilmFormatName, creditLine: string) {
  const { title, body } = adBands(format);
  const portrait = format === "portrait";
  const ladder = portrait ? [22, 21, 20] : [18, 17, 16, 15];
  const logoH = portrait ? 48 : 38;
  const logoW = Math.round(((logoH - 12) * AD_ASSETS.logoCrm.w) / AD_ASSETS.logoCrm.h) + 24;
  const textW = body.w - logoW - 18;
  const fit = fitUniform([creditLine], textW, ladder, 2);
  const creditH = Math.max(logoH, textHeight(fit.size, fit.lines));
  const parts = stackBands(body, [{ id: "facts", flex: 1 }, { id: "credit", h: creditH }], portrait ? 24 : 18);
  const logo: Box = { x: parts.credit.x, y: parts.credit.y + (creditH - logoH) / 2, w: logoW, h: logoH };
  const credit = textBlock("credit", { x: logo.x + logoW + 18, y: parts.credit.y + (creditH - textHeight(fit.size, fit.lines)) / 2, w: textW, h: textHeight(fit.size, fit.lines) }, creditLine, fit.size, fit.lines);
  return { title, facts: parts.facts, creditBand: parts.credit, logo, credit };
}
