import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { GLYPH, textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "./dataText";
import { fitUniform, sampleChipSize } from "./crmText";

/**
 * Comparación "antes / después" de dos flujos, pura: sin React ni Remotion.
 * Cada lado es una columna con su rótulo, su título y una lista vertical de
 * pasos (pastillas) unidos por rectas que corren por los huecos entre
 * pastillas, alineadas con las marcas: nunca cruzan un texto. Un divisor
 * vertical vive en la calle entre columnas, con un medallón en el medio.
 */

export type BeforeAfterTone = "loss" | "win";
export type BeforeAfterStep = { label: string; tone?: BeforeAfterTone };
/** `title` acepta "\n" para fijar el corte de línea (evita viudas). */
export type BeforeAfterSide = { kicker: string; title: string; steps: BeforeAfterStep[] };

export type BeforeAfterData = {
  before: BeforeAfterSide;
  after: BeforeAfterSide;
  sampleLabel?: string;
};

export type BeforeAfterChip = { frame: Box; mark: Box; text: TextBlock; tone: BeforeAfterTone | null };

export type BeforeAfterColumn = {
  column: Box;
  kicker: TextBlock;
  title: TextBlock;
  chips: BeforeAfterChip[];
  /** Rectas entre pastillas consecutivas (en el hueco, a la altura de las marcas). */
  connectors: Box[];
};

export type BeforeAfterLayout = {
  before: BeforeAfterColumn;
  after: BeforeAfterColumn;
  divider: Box;
  /** Medallón sobre el divisor (gráfico, sin texto). */
  medallion: Box;
  sample: TextBlock | null;
  sizes: { kicker: number; title: number; titleLines: number; chip: number; chipLines: number; chipGap: number };
};

/** Espaciado de los rótulos en mayúsculas (em); el componente usa el mismo. */
export const BEFORE_AFTER_KICKER_TRACKING = 0.14;

const SPEC = {
  landscape: {
    split: 128,
    kicker: 16,
    kickerGap: 14,
    title: [50, 46, 42, 38, 34, 30, 26],
    titleLines: 2,
    titleGap: 40,
    chip: [30, 28, 26, 24, 22, 20, 18, 16],
    chipLines: 2,
    pad: { x: 22, y: 16 },
    mark: 28,
    markGap: 16,
    chipGap: [28, 52],
    maxChipW: 520,
    medallion: 52,
    sample: 15,
    sampleGap: 28,
  },
  portrait: {
    split: 72,
    kicker: 21,
    kickerGap: 16,
    title: [50, 46, 42, 38, 34, 30, 26],
    titleLines: 3,
    titleGap: 44,
    chip: [32, 30, 28, 26, 24, 22, 20],
    chipLines: 2,
    pad: { x: 20, y: 18 },
    mark: 30,
    markGap: 14,
    chipGap: [30, 60],
    maxChipW: 432,
    medallion: 52,
    sample: 20,
    sampleGap: 32,
  },
} as const;

export function beforeAfterLayout(box: Box, data: BeforeAfterData, format: FilmFormatName): BeforeAfterLayout {
  const spec = SPEC[format];
  const sides = [data.before, data.after];

  // Badge de ejemplo abajo, en su propia banda.
  const sampleChip = data.sampleLabel ? sampleChipSize(data.sampleLabel, spec.sample) : null;
  const area: Box = sampleChip ? { ...box, h: box.h - sampleChip.h - spec.sampleGap } : box;
  const [left, right] = splitColumns(area, [1, 1], spec.split);
  const colW = left.w;

  const kickerH = textHeight(spec.kicker, 1);
  const maxChipW = Math.min(colW, spec.maxChipW);
  const chrome = spec.pad.x * 2 + spec.mark + spec.markGap;
  const labels = sides.flatMap((side) => side.steps.map((step) => step.label));
  const rows = Math.max(1, ...sides.map((side) => side.steps.length));
  const [gapMin, gapMax] = spec.chipGap;

  // Del más generoso al más compacto (título y pastillas, cada uno con su escalera).
  const measure = (titleLadder: readonly number[], chipLadder: readonly number[]) => {
    const title = fitUniform(sides.map((side) => side.title), colW, titleLadder, spec.titleLines, GLYPH.text, "size");
    const titleH = textHeight(title.size, title.lines);
    const headH = kickerH + spec.kickerGap + titleH + spec.titleGap;
    const chip = fitUniform(labels, maxChipW - chrome, chipLadder, spec.chipLines);
    const chipTextH = textHeight(chip.size, chip.lines);
    const chipH = chipTextH + spec.pad.y * 2;
    const fits = headH + rows * chipH + (rows - 1) * gapMin <= area.h;
    return { title, titleH, headH, chip, chipTextH, chipH, fits };
  };
  // Se prueban combinaciones con cada vez más escalones de achique; a igual
  // cantidad, baja primero el título (las pastillas son el contenido).
  let plan = measure(spec.title, spec.chip);
  for (let k = 1; !plan.fits && k < spec.title.length + spec.chip.length - 1; k++) {
    for (let t = Math.min(k, spec.title.length - 1); !plan.fits && t >= 0; t--) {
      const c = k - t;
      if (c < spec.chip.length) plan = measure(spec.title.slice(t), spec.chip.slice(c));
    }
  }
  const { title, titleH, headH, chip, chipTextH, chipH } = plan;

  // Pastillas: un tamaño para todas; el ancho se ajusta al texto más largo (con tope en la columna).
  const longest = Math.max(0, ...labels.map((label) => textWidth(label, chip.size)));
  const chipW = chip.lines > 1 ? maxChipW : Math.min(maxChipW, Math.max(colW * 0.6, Math.ceil(longest + chip.size * 0.6) + chrome));

  const listAvail = area.h - headH;
  const chipGap = rows > 1 ? Math.max(gapMin, Math.min(gapMax, (listAvail - rows * chipH) / (rows - 1))) : 0;
  const listH = rows * chipH + (rows - 1) * chipGap;
  const groupH = headH + listH;
  const top = area.y + Math.max(0, (area.h - groupH) / 2);

  const column = (side: BeforeAfterSide, col: Box, id: string): BeforeAfterColumn => {
    const kicker = textBlock(`${id}.kicker`, { x: col.x, y: top, w: col.w, h: kickerH }, side.kicker, spec.kicker, 1, GLYPH.upper);
    const titleBlock = textBlock(`${id}.title`, { x: col.x, y: top + kickerH + spec.kickerGap, w: col.w, h: titleH }, side.title, title.size, title.lines);
    const listTop = top + headH;
    const chips = side.steps.map((step, index) => {
      const frame = { x: col.x, y: listTop + index * (chipH + chipGap), w: chipW, h: chipH };
      const mark = { x: frame.x + spec.pad.x, y: frame.y + (chipH - spec.mark) / 2, w: spec.mark, h: spec.mark };
      const textX = mark.x + spec.mark + spec.markGap;
      const text = textBlock(`${id}.step.${index}`, { x: textX, y: frame.y + spec.pad.y, w: frame.x + frame.w - spec.pad.x - textX, h: chipTextH }, step.label, chip.size, chip.lines);
      return { frame, mark, text, tone: step.tone ?? null };
    });
    const connectors = chips.slice(1).map((next, index) => {
      const prev = chips[index];
      const x = prev.mark.x + prev.mark.w / 2 - 1;
      return { x, y: prev.frame.y + prev.frame.h, w: 2, h: next.frame.y - (prev.frame.y + prev.frame.h) };
    });
    return { column: col, kicker, title: titleBlock, chips, connectors };
  };

  const before = column(data.before, left, "before");
  const after = column(data.after, right, "after");
  const middle = left.x + left.w + spec.split / 2;
  const divider = { x: middle - 1, y: top, w: 2, h: groupH };
  const listMid = top + headH + listH / 2;
  const medallion = { x: middle - spec.medallion / 2, y: listMid - spec.medallion / 2, w: spec.medallion, h: spec.medallion };
  const sample = sampleChip && data.sampleLabel ? textBlock("sample", { x: box.x, y: box.y + box.h - sampleChip.h, w: sampleChip.w, h: sampleChip.h }, data.sampleLabel, spec.sample, 1) : null;

  return { before, after, divider, medallion, sample, sizes: { kicker: spec.kicker, title: title.size, titleLines: title.lines, chip: chip.size, chipLines: chip.lines, chipGap } };
}

/** Todos los bloques de la escena (para verificar que nada se pisa). */
export function beforeAfterBlocks(layout: BeforeAfterLayout): LayoutBlock[] {
  const blocks: LayoutBlock[] = [
    { kind: "media", id: "divider", box: layout.divider },
    { kind: "media", id: "medallion", box: layout.medallion },
  ];
  for (const side of [layout.before, layout.after]) {
    blocks.push(side.kicker, side.title);
    side.chips.forEach((chip, index) => blocks.push({ kind: "frame", id: `${chip.text.id}.frame`, box: chip.frame }, { kind: "media", id: `${chip.text.id}.mark`, box: chip.mark }, chip.text, ...(index > 0 ? [{ kind: "media" as const, id: `${chip.text.id}.line`, box: side.connectors[index - 1] }] : [])));
  }
  if (layout.sample) blocks.push(layout.sample);
  return blocks;
}

export type BeforeAfterTiming = {
  /** Factor de ritmo (≤ 1): el componente evalúa todo en `frame / pace`. */
  pace: number;
  /** Frame (en ritmo nominal) en que entra cada pastilla de cada lado. */
  beforeAt: number[];
  afterAt: number[];
  beforeHead: number;
  dividerAt: number;
  afterHead: number;
  /** El lado de antes pasa a segundo plano. */
  settleAt: number;
  /** Último frame nominal con movimiento. */
  end: number;
};

/** Frames que dura el cambio de tono (pérdida o paso final) después de que entra la pastilla. */
export const BEFORE_AFTER_TONE = { from: 16, to: 34 } as const;

/**
 * Guion secuencial: lado de antes (pastilla por pastilla) → divisor → lado de
 * después. Si la escena es corta, todo el guion se acelera por igual (nunca
 * se corta el final).
 */
export function beforeAfterTiming(before: BeforeAfterStep[], after: BeforeAfterStep[], duration: number): BeforeAfterTiming {
  const n0 = Math.max(1, before.length);
  const n1 = Math.max(1, after.length);
  const fixed = 30 + 34 + 12 + 40 + 30 + 20;
  const step = Math.max(12, Math.min(22, (duration - fixed) / Math.max(1, n0 + n1 - 2)));
  const beforeHead = 4;
  const beforeAt = Array.from({ length: n0 }, (_, index) => 30 + index * step);
  const beforeEnd = beforeAt[n0 - 1] + (before[n0 - 1]?.tone ? BEFORE_AFTER_TONE.to : 16);
  const dividerAt = beforeEnd + 12;
  const afterHead = dividerAt + 16;
  const afterAt = Array.from({ length: n1 }, (_, index) => dividerAt + 40 + index * step);
  const afterEnd = afterAt[n1 - 1] + (after[n1 - 1]?.tone ? BEFORE_AFTER_TONE.to : 16);
  const settleAt = afterEnd + 4;
  const end = settleAt + 24;
  const pace = Math.min(1, Math.max(1, duration - 6) / end);
  return { pace, beforeAt, afterAt, beforeHead, dividerAt, afterHead, settleAt, end };
}
