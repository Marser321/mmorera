import { splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { TC_LINES, type TcCopy } from "@/data/films/flagships/truckersChoice";
import { fitUniform } from "../scenes/brand/layout/crmText";
import { chipWidth, countLines, GLYPH, textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { kitBands } from "./kit/kitLayout";

/**
 * Geometría propia de TruckersFilm (pura): la ventana del recorrido bilingüe
 * (la misma página en /en y en /es, partida por una cortina) con su leyenda y
 * las rutas espejo; y "un solo techo", las seis líneas del catálogo ordenadas
 * en los cuatro pasos de la hoja de ruta.
 */

/** Proporción de las capturas del recorrido bilingüe (1920×1200). */
export const TC_CAPTURE_ASPECT = 1920 / 1200;

/* ─── Dos idiomas: ventana partida + leyenda + rutas espejo ─── */

const BI_SPEC = {
  landscape: { bar: 40, url: 15, lang: 15, kicker: 15, text: [44, 40, 36, 34, 32], route: 17, routeLang: 15, gap: 20, pad: 18, rowGap: 12, langInset: 16 },
  portrait: { bar: 50, url: 20, lang: 20, kicker: 20, text: [52, 48, 44, 40], route: 21, routeLang: 20, gap: 20, pad: 20, rowGap: 12, langInset: 18 },
} as const;

export type TcRouteRow = { lang: TextBlock; path: TextBlock };

export function tcBilingualLayout(format: FilmFormatName, copy: TcCopy, host: string) {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const spec = BI_SPEC[format];

  // Ventana: barra con la URL y la pantalla con la proporción de las capturas.
  const [windowArea, side] = portrait
    ? (() => {
        const screenH = body.w / TC_CAPTURE_ASPECT;
        const stacked = stackBands(body, [{ id: "window", h: screenH + spec.bar }, { id: "side", flex: 1 }], 28);
        return [stacked.window, stacked.side];
      })()
    : splitColumns(body, [1.75, 1], 48);
  // El ancho lo limita la columna o el alto (la barra tiene alto fijo).
  const winW = Math.min(windowArea.w, (windowArea.h - spec.bar) * TC_CAPTURE_ASPECT);
  const screenH = winW / TC_CAPTURE_ASPECT;
  const win: Box = { x: windowArea.x + (windowArea.w - winW) / 2, y: windowArea.y + Math.max(0, (windowArea.h - screenH - spec.bar) / 2), w: winW, h: screenH + spec.bar };
  const bar: Box = { x: win.x, y: win.y, w: win.w, h: spec.bar };
  const screen: Box = { x: win.x, y: win.y + spec.bar, w: win.w, h: screenH };
  const longestUrl = `${host}/en`;
  const url = textBlock("bi.url", { x: bar.x + 70, y: bar.y + (bar.h - textHeight(spec.url, 1)) / 2, w: Math.ceil(textWidth(longestUrl, spec.url)) + 8, h: textHeight(spec.url, 1) }, longestUrl, spec.url, 1);

  // Pastillas de idioma abajo de cada mitad (no tapan la barra del sitio capturado).
  const langH = textHeight(spec.lang, 1) + Math.round(spec.lang * 0.8);
  const langW = chipWidth("EN", spec.lang, Math.round(spec.lang * 0.8), GLYPH.upper);
  const langY = screen.y + screen.h - spec.langInset - langH;
  const langEn = textBlock("bi.lang.en", { x: screen.x + spec.langInset, y: langY, w: langW, h: langH }, "EN", spec.lang, 1, GLYPH.upper);
  const langEs = textBlock("bi.lang.es", { x: screen.x + screen.w - spec.langInset - langW, y: langY, w: langW, h: langH }, "ES", spec.lang, 1, GLYPH.upper);

  // Leyenda de cada parada (rótulo + frase) y el par de rutas espejo.
  const stops = Object.values(copy.bilingualStops);
  const textFit = fitUniform(stops.map((stop) => stop.text), side.w, spec.text, 3);
  const kickerH = textHeight(spec.kicker, 1);
  const stopTextH = textHeight(textFit.size, textFit.lines);
  const langColW = Math.ceil(textWidth("ES", spec.routeLang, GLYPH.upper)) + 6;
  const routeInnerW = side.w - spec.pad * 2;
  const pathW = routeInnerW - langColW - 14;
  const routeFit = fitUniform(copy.routes.flatMap((route) => [route.en, route.es]), pathW, [spec.route, spec.route - 1, spec.route - 2], 1);
  const routeRowH = textHeight(routeFit.size, 1);
  const routesH = spec.pad * 2 + routeRowH * 2 + spec.rowGap;
  const groupH = kickerH + 12 + stopTextH + spec.gap * 1.5 + routesH;
  const top = side.y + Math.max(0, (side.h - groupH) / 2);
  const kicker = textBlock("bi.kicker", { x: side.x, y: top, w: side.w, h: kickerH }, stops.reduce((a, b) => (a.kicker.length > b.kicker.length ? a : b)).kicker, spec.kicker, 1, GLYPH.upper);
  const stopText = textBlock("bi.text", { x: side.x, y: top + kickerH + 12, w: side.w, h: stopTextH }, stops[0].text, textFit.size, textFit.lines);
  const routesBox: Box = { x: side.x, y: stopText.box.y + stopTextH + spec.gap * 1.5, w: side.w, h: routesH };
  const routeRows = (["en", "es"] as const).map((language, index): TcRouteRow => {
    const y = routesBox.y + spec.pad + index * (routeRowH + spec.rowGap);
    const longest = copy.routes.map((route) => route[language]).reduce((a, b) => (a.length > b.length ? a : b));
    return {
      lang: textBlock(`bi.route.lang.${language}`, { x: routesBox.x + spec.pad, y: y + (routeRowH - textHeight(spec.routeLang, 1)) / 2, w: langColW, h: textHeight(spec.routeLang, 1) }, language.toUpperCase(), spec.routeLang, 1, GLYPH.upper),
      path: textBlock(`bi.route.path.${language}`, { x: routesBox.x + spec.pad + langColW + 14, y, w: pathW, h: routeRowH }, longest, routeFit.size, 1),
    };
  });

  const blocks: LayoutBlock[] = [kicker, stopText, ...routeRows.flatMap((row) => [row.lang, row.path])];
  return { title, body, win, bar, screen, url, langEn, langEs, side, kicker, stopText, routesBox, routeRows, blocks };
}

/* ─── Un solo techo: líneas del catálogo en los cuatro pasos ─── */

const ROOF_SPEC = {
  landscape: { roof: 96, roofGap: 22, colGap: 24, pad: 18, index: 15, step: [26, 24, 22, 21, 20], chipLabel: [22, 21, 20, 19, 18], badge: 36, badgeText: 18, chipH: 56, chipGap: 10, headGap: 16, total: 72, totalLabel: [30, 28, 26], totalH: 96, totalGap: 22 },
  portrait: { roof: 110, roofGap: 24, colGap: 24, pad: 20, index: 20, step: [32, 30, 28, 26, 24], chipLabel: [26, 25, 24, 23, 22, 21, 20], badge: 44, badgeText: 22, chipH: 68, chipGap: 12, headGap: 18, total: 96, totalLabel: [36, 34, 32, 30], totalH: 128, totalGap: 28 },
} as const;

export type TcRoofChip = { id: string; box: Box; label: TextBlock; badge: Box; count: TextBlock };
export type TcRoofColumn = { step: number; panel: Box; index: TextBlock; name: TextBlock; chips: TcRoofChip[] };

export function tcRoofLayout(format: FilmFormatName, copy: TcCopy, language: "es" | "en") {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const spec = ROOF_SPEC[format];
  const steps = copy.roofSteps;
  const cols = portrait ? 2 : 4;
  const colW = (body.w - spec.colGap * (cols - 1)) / cols;
  const innerW = colW - spec.pad * 2;

  // Tamaños uniformes: nombres de paso (2 líneas) y rótulos de línea (2 líneas).
  const stepFit = fitUniform(steps, innerW, spec.step, 2);
  // Rótulo de la línea: de su sangría izquierda a la insignia con la cifra.
  const labelW = innerW - spec.badge - 12 - 14;
  // Rótulos grandes aunque ocupen dos líneas: hay alto de sobra bajo el techo.
  const labelFit = fitUniform(TC_LINES.map((line) => line.label[language]), labelW, spec.chipLabel, 2, GLYPH.text, "size");
  const chipH = Math.max(spec.chipH, textHeight(labelFit.size, labelFit.lines) + 16);
  const headH = textHeight(spec.index, 1) + 6 + textHeight(stepFit.size, stepFit.lines);
  const contentH = (n: number) => spec.pad * 2 + headH + spec.headGap + n * chipH + (n - 1) * spec.chipGap;
  const perStep = steps.map((_, step) => TC_LINES.filter((line) => line.step === step).length);

  // Techo arriba, columnas al medio, total abajo.
  const rows = portrait ? [Math.max(contentH(perStep[0]), contentH(perStep[1])), Math.max(contentH(perStep[2]), contentH(perStep[3]))] : [Math.max(...perStep.map(contentH))];
  const columnsH = rows.reduce((sum, h) => sum + h, 0) + spec.colGap * (rows.length - 1);
  const groupH = spec.roof + spec.roofGap + columnsH + spec.totalGap + spec.totalH;
  const top = body.y + Math.max(0, (body.h - groupH) / 2);
  const roof: Box = { x: body.x, y: top, w: body.w, h: spec.roof };
  const columnsTop = top + spec.roof + spec.roofGap;

  const columns = steps.map((stepName, step): TcRoofColumn => {
    const col = step % cols;
    const row = Math.floor(step / cols);
    const y = columnsTop + rows.slice(0, row).reduce((sum, h) => sum + h + spec.colGap, 0);
    const panel: Box = { x: body.x + col * (colW + spec.colGap), y, w: colW, h: rows[row] };
    const x0 = panel.x + spec.pad;
    const index = textBlock(`roof.index.${step}`, { x: x0, y: y + spec.pad, w: innerW, h: textHeight(spec.index, 1) }, `0${step + 1}`, spec.index, 1, GLYPH.digits);
    const nameH = textHeight(stepFit.size, stepFit.lines);
    const name = textBlock(`roof.step.${step}`, { x: x0, y: index.box.y + index.box.h + 6, w: innerW, h: nameH }, stepName, stepFit.size, stepFit.lines);
    let chipY = name.box.y + nameH + spec.headGap;
    const chips = TC_LINES.filter((line) => line.step === step).map((line): TcRoofChip => {
      const box: Box = { x: x0, y: chipY, w: innerW, h: chipH };
      const badge: Box = { x: box.x + box.w - spec.badge - 10, y: box.y + (chipH - spec.badge) / 2, w: spec.badge, h: spec.badge };
      const lines = Math.min(labelFit.lines, countLines(line.label[language], labelFit.size, labelW));
      const labelH = textHeight(labelFit.size, lines);
      const label = textBlock(`roof.line.${line.id}`, { x: box.x + 14, y: box.y + (chipH - labelH) / 2, w: labelW, h: labelH }, line.label[language], labelFit.size, lines);
      const count = textBlock(`roof.count.${line.id}`, { x: badge.x, y: badge.y + (spec.badge - textHeight(spec.badgeText, 1)) / 2, w: badge.w, h: textHeight(spec.badgeText, 1) }, String(line.filings), spec.badgeText, 1, GLYPH.digits);
      chipY += chipH + spec.chipGap;
      return { id: line.id, box, label, badge, count };
    });
    return { step, panel, index, name, chips };
  });

  // Total: la cifra grande y su rótulo, centrados bajo las columnas.
  const totalY = columnsTop + columnsH + spec.totalGap;
  const numberW = Math.ceil(textWidth("30", spec.total, GLYPH.digits)) + 8;
  const labelMax = Math.min(body.w - numberW - 24, portrait ? 640 : 560);
  const totalFit = fitUniform([copy.roofTotal], labelMax, spec.totalLabel, 2);
  const totalLabelW = totalFit.lines > 1 ? labelMax : Math.min(labelMax, chipWidth(copy.roofTotal, totalFit.size, 4));
  // Centrado por el ancho que se ve (la caja del rótulo tiene holgura a la derecha).
  const visibleW = numberW + 24 + Math.min(totalLabelW, Math.ceil(textWidth(copy.roofTotal, totalFit.size) / totalFit.lines));
  const x0 = Math.max(body.x, Math.min(body.x + (body.w - visibleW) / 2, body.x + body.w - numberW - 24 - totalLabelW));
  const total = textBlock("roof.total", { x: x0, y: totalY + (spec.totalH - textHeight(spec.total, 1)) / 2, w: numberW, h: textHeight(spec.total, 1) }, "30", spec.total, 1, GLYPH.digits);
  const totalLabelH = textHeight(totalFit.size, totalFit.lines);
  const totalLabel = textBlock("roof.totalLabel", { x: x0 + numberW + 24, y: totalY + (spec.totalH - totalLabelH) / 2, w: totalLabelW, h: totalLabelH }, copy.roofTotal, totalFit.size, totalFit.lines);

  const blocks: LayoutBlock[] = [...columns.flatMap((column) => [column.index, column.name, ...column.chips.flatMap((chip) => [chip.label, chip.count])]), total, totalLabel];
  return { title, body, roof, columns, total, totalLabel, totalBand: { x: body.x, y: totalY, w: body.w, h: spec.totalH }, blocks };
}
