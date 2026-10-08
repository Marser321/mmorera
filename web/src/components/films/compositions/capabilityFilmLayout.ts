import { safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { chipWidth, countLines, flowBoxes, flowHeight, GLYPH, largestFit, textBlock, textHeight, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";

/**
 * Geometría de la apertura de los films por capacidad (pura): la órbita de la
 * familia en su propia caja y, al lado (o debajo en 4:5), rótulo, título,
 * texto y las herramientas en pastillas.
 */

const SPEC = {
  landscape: { orbit: 380, orbitGap: 40, kicker: 16, title: [96, 88, 80, 72, 64], titleLines: 1, blurb: [30, 28, 26, 24], blurbLines: 3, label: 15, chip: 19, chipPad: 16, chipGap: 12, gap: 22, toolsGap: 40 },
  portrait: { orbit: 300, orbitGap: 48, kicker: 22, title: [104, 96, 88, 80, 72], titleLines: 2, blurb: [36, 34, 32, 30, 28], blurbLines: 5, label: 20, chip: 24, chipPad: 18, chipGap: 14, gap: 26, toolsGap: 44 },
} as const;

/**
 * Montaje de casos (PlateManifesto): la placa un poco más ancha que el texto.
 * maxLines y maxSize son los que usa PlateManifesto (el test los verifica).
 */
export const CAPABILITY_MONTAGE = { ratio: [1.05, 0.95] as [number, number], maxLines: 3, maxSize: { landscape: 60, portrait: 68 } } as const;

export type CapabilityChip = { box: Box; label: TextBlock };

export type CapabilityIntroLayout = {
  orbit: Box;
  kicker: TextBlock;
  title: TextBlock;
  blurb: TextBlock;
  toolsLabel: TextBlock;
  chips: CapabilityChip[];
  blocks: LayoutBlock[];
};

export function capabilityIntroLayout(format: FilmFormatName, copy: { kicker: string; title: string; blurb: string; toolsLabel: string; tools: string[] }): CapabilityIntroLayout {
  const safe = safeArea(format);
  const portrait = format === "portrait";
  const s = SPEC[format];
  // En 16:9 la órbita va a la derecha; en 4:5, arriba. El texto nunca la cruza.
  const textX = safe.x;
  const textW = portrait ? safe.w : safe.w - s.orbit - s.orbitGap;

  const kickerH = textHeight(s.kicker, 1);
  // Una línea si entra a buen tamaño; si no, las que permita el formato.
  const titleSize = s.title.find((size) => countLines(copy.title, size, textW) <= 1) ?? largestFit([copy.title], textW, s.titleLines, [...s.title]);
  const titleLines = countLines(copy.title, titleSize, textW);
  const titleH = textHeight(titleSize, titleLines);
  const blurbSize = largestFit([copy.blurb], textW, s.blurbLines, [...s.blurb]);
  const blurbLines = countLines(copy.blurb, blurbSize, textW);
  const blurbH = textHeight(blurbSize, blurbLines);
  const labelH = textHeight(s.label, 1);
  const rowH = Math.round(s.chip * 2.1);
  const widths = copy.tools.map((tool) => Math.min(textW, chipWidth(tool, s.chip, s.chipPad)));
  const flow = flowBoxes({ x: textX, y: 0, w: textW, h: 4000 }, widths, rowH, s.chipGap) ?? [];
  const chipsH = flowHeight(flow);

  const textH = kickerH + s.gap + titleH + s.gap + blurbH + s.toolsGap + labelH + s.gap * 0.6 + chipsH;
  const total = portrait ? s.orbit + s.orbitGap + textH : Math.max(textH, s.orbit);
  const top = Math.round(safe.y + Math.max(0, (safe.h - total) / 2));

  const orbit: Box = portrait ? { x: textX, y: top, w: s.orbit, h: s.orbit } : { x: safe.x + safe.w - s.orbit, y: Math.round(safe.y + (safe.h - s.orbit) / 2), w: s.orbit, h: s.orbit };
  let y = portrait ? top + s.orbit + s.orbitGap : Math.round(safe.y + (safe.h - textH) / 2);

  const kicker = textBlock("capability.kicker", { x: textX, y, w: textW, h: kickerH }, copy.kicker.toUpperCase(), s.kicker, 1, GLYPH.upper);
  y += kickerH + s.gap;
  const title = textBlock("capability.title", { x: textX, y, w: textW, h: titleH }, copy.title, titleSize, titleLines);
  y += titleH + s.gap;
  const blurb = textBlock("capability.blurb", { x: textX, y, w: textW, h: blurbH }, copy.blurb, blurbSize, blurbLines);
  y += blurbH + s.toolsGap;
  const toolsLabel = textBlock("capability.tools", { x: textX, y, w: textW, h: labelH }, copy.toolsLabel.toUpperCase(), s.label, 1, GLYPH.upper);
  y += labelH + Math.round(s.gap * 0.6);
  const chips = flow.map((box, index): CapabilityChip => {
    const chip = { ...box, y: box.y + y };
    const labelBox = { x: chip.x + s.chipPad, y: chip.y + (rowH - textHeight(s.chip, 1)) / 2, w: chip.w - s.chipPad * 2, h: textHeight(s.chip, 1) };
    return { box: chip, label: textBlock(`capability.chip.${index}`, labelBox, copy.tools[index], s.chip, 1) };
  });

  const blocks: LayoutBlock[] = [
    { kind: "media", id: "capability.orbit", box: orbit },
    kicker,
    title,
    blurb,
    toolsLabel,
    ...chips.flatMap((chip): LayoutBlock[] => [{ kind: "frame", id: `${chip.label.id}.frame`, box: chip.box }, chip.label]),
  ];
  return { orbit, kicker, title, blurb, toolsLabel, chips, blocks };
}
