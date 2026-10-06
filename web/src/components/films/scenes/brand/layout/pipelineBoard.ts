import { inset, splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { fitUniform, sampleChipSize } from "./crmText";
import { chipWidth, GLYPH, largestFit, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

/**
 * Tablero de pipeline de un CRM (estilo GoHighLevel), puro: sin React ni
 * Remotion. Columnas = etapas; cada oportunidad tiene su propio carril (una
 * fila del tablero), así cuando pasa de etapa viaja en horizontal por un
 * carril donde no hay ninguna otra tarjeta: nunca cruza texto ajeno. El riel
 * opcional del workflow vive en su propia placa (a la derecha en apaisado,
 * debajo en 4:5) y el badge de datos de ejemplo en la cabecera del tablero.
 */

export type PipelineStage = { id: string; label: string };

export type PipelineCard = {
  id: string;
  /** Contacto u oportunidad (dato de ejemplo). */
  title: string;
  meta?: string;
  tags?: string[];
  /** Etapas por las que pasa, en orden (la primera es donde arranca). */
  path: string[];
};

export type PipelineWorkflowStep = {
  label: string;
  /** Se enciende cuando una tarjeta llega a esta etapa; sin etapa, se reparte a lo largo de los movimientos. */
  stage?: string;
};

export type PipelineWorkflow = { title?: string; steps: PipelineWorkflowStep[] };

export type PipelineBoardData = {
  stages: PipelineStage[];
  cards: PipelineCard[];
  workflow?: PipelineWorkflow;
  /** Rótulo de la cabecera del tablero (p. ej. "Pipeline · Oportunidades"). */
  boardTitle?: string;
  sampleLabel: string;
};

export type PipelineChip = { frame: Box; text: TextBlock };

export type PipelineCardBoxes = { frame: Box; title: TextBlock; meta: TextBlock | null; tags: PipelineChip[] };

export type PipelineColumn = { id: string; frame: Box; label: TextBlock; count: PipelineChip };

export type PipelineRail = {
  frame: Box;
  orientation: "vertical" | "horizontal";
  title: TextBlock | null;
  nodes: Box[];
  labels: TextBlock[];
  /** Recta que une los centros del primer y el último nodo (va detrás de los nodos). */
  track: Box;
};

export type PipelineBoardLayout = {
  board: Box;
  boardTitle: TextBlock | null;
  sample: TextBlock;
  columns: PipelineColumn[];
  /** Un carril por tarjeta, de lado a lado del tablero. */
  lanes: Box[];
  /** Cajas de cada tarjeta en cada etapa: cells[tarjeta][etapa]. */
  cells: PipelineCardBoxes[][];
  rail: PipelineRail | null;
  sizes: { card: { w: number; h: number }; rowGap: number };
};

/** Relleno de las pastillas de etiqueta (el componente usa el mismo). */
export const PIPELINE_TAG_PAD = 0.6;

/**
 * Etapas que entran con texto legible: en 4:5 las columnas de cinco etapas
 * quedan en ~170 px y una palabra como "Presupuesto" ya no entra al mínimo de
 * 20 px. El film que necesite más etapas en 4:5 las agrupa.
 */
export const PIPELINE_MAX_STAGES: Record<FilmFormatName, number> = { landscape: 6, portrait: 4 };

const SPEC = {
  landscape: {
    gap: 32,
    boardPad: 20,
    headerGap: 16,
    colGap: 12,
    colPad: 10,
    colHeadGap: 12,
    rowGap: [10, 18],
    card: { x: 14, y: 10, metaGap: 2, tagGap: 8 },
    boardTitle: [22, 20, 18, 16],
    sample: 15,
    stage: [18, 17, 16, 15],
    count: 15,
    title: [21, 20, 19, 18, 17, 16, 15],
    meta: [16, 15],
    tag: 15,
    rail: { pad: 22, title: 15, titleGap: 18, label: [19, 18, 17, 16, 15], node: 26, labelGap: 14, slotMax: 116, stepGap: 14 },
  },
  portrait: {
    gap: 28,
    boardPad: 16,
    headerGap: 14,
    colGap: 10,
    colPad: 8,
    colHeadGap: 12,
    rowGap: [10, 18],
    card: { x: 12, y: 12, metaGap: 3, tagGap: 9 },
    boardTitle: [26, 24, 22, 20],
    sample: 20,
    stage: [22, 21, 20],
    count: 20,
    title: [24, 23, 22, 21, 20],
    meta: [21, 20],
    tag: 20,
    rail: { pad: 18, title: 20, titleGap: 14, label: [22, 21, 20], node: 30, labelGap: 10, slotMax: 0, stepGap: 12 },
  },
} as const;

/** Alto de una pastilla de etiqueta de una línea a `size` px. */
const tagHeight = (size: number) => textHeight(size, 1) + Math.round(size * 0.5);

/** Etiquetas que entran en una sola fila (las que sobran no se dibujan). */
function tagRow(tags: string[], size: number, width: number, gap: number) {
  const pad = Math.round(size * PIPELINE_TAG_PAD);
  const widths: number[] = [];
  let used = 0;
  for (const tag of tags) {
    const w = chipWidth(tag, size, pad);
    const next = used + (widths.length ? gap : 0) + w;
    if (next > width) break;
    widths.push(w);
    used = next;
  }
  return widths;
}

export function pipelineBoardLayout(box: Box, data: PipelineBoardData, format: FilmFormatName): PipelineBoardLayout {
  const spec = SPEC[format];
  const portrait = format === "portrait";
  const steps = data.workflow?.steps ?? [];
  const hasRail = steps.length > 0;
  const nStages = Math.max(1, data.stages.length);
  const nCards = data.cards.length;

  // Anchos: tablero y riel lado a lado en apaisado; en 4:5 el riel va debajo.
  const [boardCol, railCol] = hasRail && !portrait ? splitColumns(box, [3, 1], spec.gap) : [box, null];
  const boardW = boardCol.w;
  const innerW = boardW - spec.boardPad * 2;

  // Cabecera del tablero: rótulo a la izquierda, badge de ejemplo a la derecha.
  const sampleChip = sampleChipSize(data.sampleLabel, spec.sample);
  const titleW = innerW - sampleChip.w - 20;
  const boardTitleSize = data.boardTitle ? largestFit([data.boardTitle], titleW, 1, [...spec.boardTitle]) : 0;
  const boardTitleH = data.boardTitle ? textHeight(boardTitleSize, 1) : 0;
  const headerH = Math.max(sampleChip.h, boardTitleH);

  // Columnas: cabecera con la etapa y el conteo.
  const colW = (innerW - spec.colGap * (nStages - 1)) / nStages;
  const countH = textHeight(spec.count, 1) + 8;
  const countW = chipWidth("88", spec.count, 8, GLYPH.digits);
  const stageLabelW = colW - spec.colPad * 2 - countW - 8;
  const stageSize = largestFit(data.stages.map((stage) => stage.label), stageLabelW, 1, [...spec.stage]);
  const colHeadH = Math.max(textHeight(stageSize, 1), countH);

  // Tarjetas: título (1-2 líneas), meta (1-2) y una fila de etiquetas.
  const cardW = colW - spec.colPad * 2;
  const textW = cardW - spec.card.x * 2;
  const title = fitUniform(data.cards.map((card) => card.title), textW, spec.title, 2);
  const metas = data.cards.map((card) => card.meta ?? "").filter(Boolean);
  const meta = metas.length ? fitUniform(metas, textW, spec.meta, 2) : null;
  const tagGap = 6;
  const tagWidths = data.cards.map((card) => tagRow(card.tags ?? [], spec.tag, textW, tagGap));
  const anyTags = tagWidths.some((widths) => widths.length > 0);
  const titleH = textHeight(title.size, title.lines);
  const metaH = meta ? textHeight(meta.size, meta.lines) : 0;
  const cardHeight = (withMeta: boolean, withTags: boolean) =>
    spec.card.y * 2 + titleH + (withMeta && meta ? spec.card.metaGap + metaH : 0) + (withTags && anyTags ? spec.card.tagGap + tagHeight(spec.tag) : 0);

  // Riel en 4:5: su alto se mide antes, para saber cuánto le queda al tablero.
  const railLabelSlot = portrait && hasRail ? (box.w - spec.rail.pad * 2) / steps.length : 0;
  const railTitleH = data.workflow?.title ? textHeight(spec.rail.title, 1) : 0;
  const portraitLabel = portrait && hasRail ? fitUniform(steps.map((step) => step.label), railLabelSlot - spec.rail.stepGap, spec.rail.label, 3) : null;
  const portraitRailH = portraitLabel
    ? spec.rail.pad * 2 + (railTitleH ? railTitleH + spec.rail.titleGap : 0) + spec.rail.node + spec.rail.labelGap + textHeight(portraitLabel.size, portraitLabel.lines)
    : 0;

  const boardMaxH = portrait && hasRail ? box.h - portraitRailH - spec.gap : box.h;
  const fixedTop = spec.boardPad + headerH + spec.headerGap + spec.colPad + colHeadH + spec.colHeadGap;
  const fixedBottom = spec.colPad + spec.boardPad;
  const lanesAvail = boardMaxH - fixedTop - fixedBottom;
  const [rowGapMin, rowGapMax] = spec.rowGap;
  // De lo más rico a lo más compacto: si no entran todas las tarjetas, primero caen las etiquetas y después la meta.
  const variants = [
    { withMeta: true, withTags: true },
    { withMeta: true, withTags: false },
    { withMeta: false, withTags: false },
  ];
  const fitsVariant = (variant: { withMeta: boolean; withTags: boolean }) => nCards * cardHeight(variant.withMeta, variant.withTags) + rowGapMin * Math.max(0, nCards - 1) <= lanesAvail;
  const variant = variants.find(fitsVariant) ?? variants[variants.length - 1];
  const cardH = cardHeight(variant.withMeta, variant.withTags);
  const rowGap = nCards > 1 ? Math.max(rowGapMin, Math.min(rowGapMax, (lanesAvail - nCards * cardH) / (nCards - 1))) : 0;
  const lanesH = nCards * cardH + Math.max(0, nCards - 1) * rowGap;
  const boardH = fixedTop + lanesH + fixedBottom;

  // El conjunto se centra en vertical dentro de la caja.
  const groupH = portrait && hasRail ? boardH + spec.gap + portraitRailH : boardH;
  const top = box.y + Math.max(0, (box.h - groupH) / 2);
  const board: Box = { x: boardCol.x, y: top, w: boardW, h: boardH };
  const inner = inset(board, spec.boardPad);

  const sample = textBlock("sample", { x: inner.x + inner.w - sampleChip.w, y: inner.y + (headerH - sampleChip.h) / 2, w: sampleChip.w, h: sampleChip.h }, data.sampleLabel, spec.sample, 1);
  const boardTitle = data.boardTitle ? textBlock("board.title", { x: inner.x, y: inner.y + (headerH - boardTitleH) / 2, w: titleW, h: boardTitleH }, data.boardTitle, boardTitleSize, 1) : null;

  const colsTop = inner.y + headerH + spec.headerGap;
  const colFrames = splitColumns({ x: inner.x, y: colsTop, w: inner.w, h: board.y + board.h - spec.boardPad - colsTop }, Array.from({ length: nStages }, () => 1), spec.colGap);
  const columns: PipelineColumn[] = data.stages.map((stage, index) => {
    const frame = colFrames[index];
    const headY = frame.y + spec.colPad;
    const chip = { x: frame.x + frame.w - spec.colPad - countW, y: headY + (colHeadH - countH) / 2, w: countW, h: countH };
    return {
      id: stage.id,
      frame,
      label: textBlock(`stage.${stage.id}`, { x: frame.x + spec.colPad, y: headY + (colHeadH - textHeight(stageSize, 1)) / 2, w: stageLabelW, h: textHeight(stageSize, 1) }, stage.label, stageSize, 1),
      count: { frame: chip, text: textBlock(`stage.${stage.id}.count`, inset(chip, 4, 0), "88", spec.count, 1, GLYPH.digits) },
    };
  });

  const lanesTop = colsTop + spec.colPad + colHeadH + spec.colHeadGap;
  const lanes = data.cards.map((_, index) => ({ x: inner.x, y: lanesTop + index * (cardH + rowGap), w: inner.w, h: cardH }));

  const cells = data.cards.map((card, cardIndex) =>
    columns.map((column) => {
      const frame = { x: column.frame.x + spec.colPad, y: lanes[cardIndex].y, w: cardW, h: cardH };
      const textX = frame.x + spec.card.x;
      const titleBox = textBlock(`card.${card.id}.title`, { x: textX, y: frame.y + spec.card.y, w: textW, h: titleH }, card.title, title.size, title.lines);
      let y = titleBox.box.y + titleBox.box.h;
      let metaBox: TextBlock | null = null;
      if (variant.withMeta && meta && card.meta) {
        metaBox = textBlock(`card.${card.id}.meta`, { x: textX, y: y + spec.card.metaGap, w: textW, h: metaH }, card.meta, meta.size, meta.lines);
      }
      if (variant.withMeta && meta) y += spec.card.metaGap + metaH;
      const tags: PipelineChip[] = [];
      if (variant.withTags && anyTags) {
        let x = textX;
        const chipY = y + spec.card.tagGap;
        const pad = Math.round(spec.tag * PIPELINE_TAG_PAD);
        tagWidths[cardIndex].forEach((w, tagIndex) => {
          const chip = { x, y: chipY, w, h: tagHeight(spec.tag) };
          tags.push({ frame: chip, text: textBlock(`card.${card.id}.tag.${tagIndex}`, inset(chip, pad - 2, 0), card.tags?.[tagIndex] ?? "", spec.tag, 1) });
          x += w + tagGap;
        });
      }
      return { frame, title: titleBox, meta: metaBox, tags };
    }),
  );

  // Riel del workflow.
  let rail: PipelineRail | null = null;
  if (hasRail && data.workflow) {
    const r = spec.rail;
    if (!portrait && railCol) {
      const frame = { x: railCol.x, y: board.y, w: railCol.w, h: board.h };
      const railInner = inset(frame, r.pad);
      const titleBlock = data.workflow.title ? textBlock("rail.title", { x: railInner.x, y: railInner.y, w: railInner.w, h: railTitleH }, data.workflow.title, r.title, 1, GLYPH.upper) : null;
      const stepsTop = railInner.y + (titleBlock ? railTitleH + r.titleGap : 0);
      const labelX = railInner.x + r.node + r.labelGap;
      const labelW = railInner.x + railInner.w - labelX;
      const label = fitUniform(steps.map((step) => step.label), labelW, r.label, 2);
      const lineH = textHeight(label.size, 1);
      const labelH = textHeight(label.size, label.lines);
      const slot = Math.min(r.slotMax, (railInner.y + railInner.h - stepsTop) / steps.length);
      const headH = Math.max(r.node, lineH);
      const nodes: Box[] = [];
      const labels: TextBlock[] = [];
      steps.forEach((step, index) => {
        const slotY = stepsTop + index * slot;
        const center = slotY + headH / 2;
        nodes.push({ x: railInner.x, y: center - r.node / 2, w: r.node, h: r.node });
        labels.push(textBlock(`rail.step.${index}`, { x: labelX, y: center - lineH / 2, w: labelW, h: labelH }, step.label, label.size, label.lines));
      });
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      rail = { frame, orientation: "vertical", title: titleBlock, nodes, labels, track: { x: first.x + first.w / 2 - 1, y: first.y + first.h / 2, w: 2, h: last.y - first.y } };
    } else if (portraitLabel) {
      const frame = { x: box.x, y: board.y + board.h + spec.gap, w: box.w, h: portraitRailH };
      const railInner = inset(frame, r.pad);
      const titleBlock = data.workflow.title ? textBlock("rail.title", { x: railInner.x, y: railInner.y, w: railInner.w, h: railTitleH }, data.workflow.title, r.title, 1, GLYPH.upper) : null;
      const nodeY = railInner.y + (titleBlock ? railTitleH + r.titleGap : 0);
      const labelH = textHeight(portraitLabel.size, portraitLabel.lines);
      const nodes: Box[] = [];
      const labels: TextBlock[] = [];
      steps.forEach((step, index) => {
        const slotX = railInner.x + index * railLabelSlot;
        nodes.push({ x: slotX + (railLabelSlot - r.node) / 2, y: nodeY, w: r.node, h: r.node });
        labels.push(textBlock(`rail.step.${index}`, { x: slotX + r.stepGap / 2, y: nodeY + r.node + r.labelGap, w: railLabelSlot - r.stepGap, h: labelH }, step.label, portraitLabel.size, portraitLabel.lines));
      });
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      rail = { frame, orientation: "horizontal", title: titleBlock, nodes, labels, track: { x: first.x + first.w / 2, y: first.y + first.h / 2 - 1, w: last.x - first.x, h: 2 } };
    }
  }

  return { board, boardTitle, sample, columns, lanes, cells, rail, sizes: { card: { w: cardW, h: cardH }, rowGap } };
}

/** Índice de cada etapa por id (las rutas de las tarjetas se escriben con ids). */
function stageIndexOf(stages: PipelineStage[]) {
  const map = new Map(stages.map((stage, index) => [stage.id, index]));
  return (id: string) => {
    const index = map.get(id);
    if (index === undefined) throw new Error(`PipelineBoard: la etapa "${id}" no está en el tablero`);
    return index;
  };
}

export type PipelineMove = { card: number; from: number; to: number; start: number; end: number };

export type PipelineTiming = {
  /** Frame en que el tablero ya está armado y empieza el primer movimiento. */
  introEnd: number;
  /** Un movimiento por vez, en orden (nunca se superponen en el tiempo). */
  moves: PipelineMove[];
  /** Frame en que se enciende cada paso del workflow (Infinity: no se enciende). */
  stepAt: number[];
  /** Frames de cada movimiento: levantar, viajar y apoyar. */
  phases: { lift: number; drop: number };
};

/**
 * Guion de movimientos: por rondas (primero el primer paso de cada tarjeta,
 * después el segundo...), uno por vez y repartidos en la duración de la escena.
 */
export function pipelineTiming(data: Pick<PipelineBoardData, "stages" | "cards" | "workflow">, duration: number): PipelineTiming {
  const indexOf = stageIndexOf(data.stages);
  const pending: Array<{ card: number; from: number; to: number }> = [];
  const longest = Math.max(0, ...data.cards.map((card) => card.path.length));
  for (let step = 1; step < longest; step++) {
    data.cards.forEach((card, cardIndex) => {
      if (card.path.length > step) pending.push({ card: cardIndex, from: indexOf(card.path[step - 1]), to: indexOf(card.path[step]) });
    });
  }
  const introEnd = Math.min(60, Math.round(duration * 0.2));
  const tail = Math.min(40, Math.round(duration * 0.12));
  const span = Math.max(1, duration - introEnd - tail);
  const slot = span / Math.max(1, pending.length);
  const length = Math.max(18, Math.min(42, Math.floor(slot - 6)));
  const phases = { lift: Math.round(length * 0.2), drop: Math.round(length * 0.2) };
  const moves = pending.map((move, index) => {
    const start = Math.round(introEnd + index * slot);
    return { ...move, start, end: start + length };
  });

  const steps = data.workflow?.steps ?? [];
  const initial = new Set(data.cards.map((card) => (card.path[0] ? indexOf(card.path[0]) : -1)));
  const stepAt = steps.map((step, index) => {
    if (step.stage) {
      const stage = indexOf(step.stage);
      const arrival = moves.find((move) => move.to === stage);
      if (arrival) return arrival.end - 2;
      return initial.has(stage) ? introEnd - 16 : Infinity;
    }
    if (!moves.length) return introEnd - 16;
    const pick = steps.length > 1 ? Math.round((index * (moves.length - 1)) / (steps.length - 1)) : 0;
    return moves[pick].end - 2;
  });
  // El riel se enciende en orden, de arriba hacia abajo.
  for (let index = 1; index < stepAt.length; index++) {
    if (Number.isFinite(stepAt[index]) && Number.isFinite(stepAt[index - 1])) stepAt[index] = Math.max(stepAt[index], stepAt[index - 1] + 6);
  }
  return { introEnd, moves, stepAt, phases };
}

/** Etapa de cada tarjeta en un frame (o el movimiento en curso). */
export function cardStateAt(timing: PipelineTiming, data: Pick<PipelineBoardData, "stages" | "cards">, cardIndex: number, frame: number) {
  const indexOf = stageIndexOf(data.stages);
  const path = data.cards[cardIndex].path;
  let stage = path[0] ? indexOf(path[0]) : 0;
  for (const move of timing.moves) {
    if (move.card !== cardIndex) continue;
    if (frame >= move.end) stage = move.to;
    else if (frame >= move.start) return { stage: move.from, move };
  }
  return { stage, move: null };
}

/** Etapa final de cada tarjeta después de `count` movimientos. */
export function stagesAfter(timing: PipelineTiming, data: Pick<PipelineBoardData, "stages" | "cards">, count: number) {
  const indexOf = stageIndexOf(data.stages);
  const stages = data.cards.map((card) => (card.path[0] ? indexOf(card.path[0]) : 0));
  for (const move of timing.moves.slice(0, count)) stages[move.card] = move.to;
  return stages;
}

/** Bloques de geometría de un estado del tablero (cada tarjeta en su etapa), para verificar solapes. */
export function pipelineBlocks(layout: PipelineBoardLayout, stageOf: number[]): LayoutBlock[] {
  const blocks: LayoutBlock[] = [{ kind: "frame", id: "board", box: layout.board }, layout.sample];
  if (layout.boardTitle) blocks.push(layout.boardTitle);
  for (const column of layout.columns) {
    blocks.push({ kind: "frame", id: `${column.id}.frame`, box: column.frame }, column.label, { kind: "frame", id: `${column.id}.count`, box: column.count.frame }, column.count.text);
  }
  stageOf.forEach((stage, cardIndex) => {
    const cell = layout.cells[cardIndex][stage];
    blocks.push({ kind: "frame", id: `card.${cardIndex}`, box: cell.frame }, cell.title);
    if (cell.meta) blocks.push(cell.meta);
    for (const tag of cell.tags) blocks.push({ kind: "frame", id: `${tag.text.id}.frame`, box: tag.frame }, tag.text);
  });
  if (layout.rail) {
    const rail = layout.rail;
    blocks.push({ kind: "frame", id: "rail", box: rail.frame }, { kind: "media", id: "rail.track", box: rail.track });
    if (rail.title) blocks.push(rail.title);
    rail.nodes.forEach((node, index) => blocks.push({ kind: "media", id: `rail.node.${index}`, box: node }, rail.labels[index]));
  }
  return blocks;
}
