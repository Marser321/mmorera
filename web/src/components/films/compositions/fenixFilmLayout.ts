import { stackBands, splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { FENIX_ASSETS } from "@/data/films/flagships/fenix";
import { cinematicPlateLayout } from "../scenes/brand/layout/cinematicPlate";
import { fitFontSize, GLYPH_EM, LINE_HEIGHT } from "../scenes/brand/layout/mediaShared";

/**
 * Cajas y geometría propia de FenixFilm (apertura, mecanismo, tiras, notas y agentes).
 * Extraídas a funciones puras testeables sin Remotion ni DOM.
 */

export function fenixOpeningLayout(format: FilmFormatName, width: number, height: number, tagline: string) {
  const corridor = FENIX_ASSETS.corridor;
  const box: Box = format === "portrait" ? { x: 0, y: 0, w: width, h: 620 } : { x: 60, y: 84, w: width - 120, h: 600 };
  const plate = cinematicPlateLayout(box, { asset: corridor, align: "top" }, format).plate;
  const textX = format === "portrait" ? 72 : plate.x;
  const textW = format === "portrait" ? width - 144 : plate.w;
  const kickerSize = format === "portrait" ? 22 : 18;
  const size = fitFontSize(tagline, { width: textW, maxLines: 1, max: format === "portrait" ? 68 : 60, min: 40, lineHeight: LINE_HEIGHT.display, glyphEm: GLYPH_EM.display });
  const kickerBlock = Math.ceil(kickerSize * LINE_HEIGHT.label) + Math.round(kickerSize * 0.9);
  const textH = Math.ceil(size * LINE_HEIGHT.display);
  const gap = format === "portrait" ? 40 : 28;
  const top = format === "portrait" ? Math.round((height - (plate.h + gap + kickerBlock + textH)) / 2) : 0;
  const plateBox: Box = { ...box, y: box.y + top };
  const placed: Box = { ...plate, y: plate.y + top };
  const kickerY = placed.y + placed.h + gap;
  const textY = kickerY + kickerBlock;
  const logoSize = Math.min(placed.h * 0.62, format === "portrait" ? 400 : 340);
  return {
    plateBox,
    placed,
    textX,
    textW,
    kickerSize,
    kickerY,
    textY,
    textH,
    size,
    logoSize,
  };
}

export function fenixMechanismLayout(area: Box, format: FilmFormatName) {
  if (format === "portrait") {
    const groupH = 520 + 40 + 320;
    const group: Box = { ...area, y: area.y + (area.h - groupH) / 2, h: groupH };
    const stacked = stackBands(group, [{ id: "text", h: 520 }, { id: "strip", h: 320 }], 40);
    return { doseText: stacked.text, doseStrip: stacked.strip };
  }
  const [doseText, doseStrip] = splitColumns(area, [1.1, 1], 96);
  return { doseText, doseStrip };
}

export function fenixDoseStripLayout(box: Box, format: FilmFormatName, total: number = 60) {
  const labelSize = format === "portrait" ? 22 : 16;
  const pitch = box.w / total;
  const barW = Math.max(3, Math.round(pitch * 0.56));
  const barsH = format === "portrait" ? 200 : 168;
  const headH = labelSize * 3;
  const groupH = headH + barsH + labelSize * 2.6;
  const top = box.y + (box.h - groupH) / 2;
  const barsY = top + headH;
  return {
    labelSize,
    pitch,
    barW,
    barsH,
    headH,
    groupH,
    top,
    barsY,
  };
}

export function fenixSiteNoteLayout(bodyBox: Box, format: FilmFormatName) {
  const body = stackBands(bodyBox, [{ id: "main", flex: 1 }, { id: "note", h: format === "portrait" ? 44 : 34 }], format === "portrait" ? 18 : 14);
  return { main: body.main, note: body.note };
}

export function fenixEngineeringLayout(bodyBox: Box, format: FilmFormatName) {
  const body = stackBands(bodyBox, [{ id: "main", flex: 1 }, { id: "agents", h: format === "portrait" ? 44 : 32 }], format === "portrait" ? 18 : 14);
  const [factsBox, gridBox] = format === "portrait"
    ? (() => {
        const stacked = stackBands(body.main, [{ id: "facts", flex: 1.1 }, { id: "grid", flex: 1 }], 28);
        return [stacked.facts, stacked.grid];
      })()
    : splitColumns(body.main, [1.15, 1], 44);
  return { main: body.main, agents: body.agents, factsBox, gridBox };
}
