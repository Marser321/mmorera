import type { CSSProperties } from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { boxStyle, BoxText, Glyph, SampleTag } from "./dataKit";
import { CRM_SAMPLE_LABEL } from "./layout/crmSamples";
import type { TextBlock } from "./layout/dataText";
import { cardStateAt, pipelineBoardLayout, pipelineTiming, type PipelineCard, type PipelineCardBoxes, type PipelineStage, type PipelineWorkflow } from "./layout/pipelineBoard";

export type PipelineBoardProps = {
  box: Box;
  duration: number;
  /** Columnas del tablero (en 4:5 entran hasta PIPELINE_MAX_STAGES.portrait). */
  stages: PipelineStage[];
  /** Oportunidades de ejemplo; cada una recorre su `path` de etapas. */
  cards: PipelineCard[];
  workflow?: PipelineWorkflow;
  boardTitle?: string;
  language: FilmLanguage;
  /** Por defecto "Datos de ejemplo" / "Sample data": el tablero siempre es de ejemplo. */
  sampleLabel?: string;
};

/** Caja relativa a la tarjeta (el contenido viaja con ella). */
const relative = (box: Box, origin: Box): Box => ({ x: box.x - origin.x, y: box.y - origin.y, w: box.w, h: box.h });
const relText = (block: TextBlock, origin: Box): TextBlock => ({ ...block, box: relative(block.box, origin) });

/**
 * Tablero de pipeline de un CRM: las oportunidades pasan de etapa de a una,
 * cada una por su propio carril (nunca por encima de otra tarjeta ni de un
 * rótulo), mientras el workflow de la derecha (abajo en 4:5) enciende sus
 * pasos en sincronía. Todo es de ejemplo y lo dice el badge de la cabecera.
 */
export function PipelineBoard({ box, duration, stages, cards, workflow, boardTitle, language, sampleLabel }: PipelineBoardProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const { palette, fonts } = brand;
  const data = { stages, cards, workflow, boardTitle, sampleLabel: sampleLabel ?? CRM_SAMPLE_LABEL[language] };
  const layout = pipelineBoardLayout(box, data, portrait ? "portrait" : "landscape");
  const timing = pipelineTiming(data, duration);
  const lastStage = stages.length - 1;
  const states = cards.map((_, index) => cardStateAt(timing, data, index, frame));

  const enter = progress(frame, 0, 20);
  const cardRadius = Math.round(brand.radius * 0.7);

  const renderCard = (cell: PipelineCardBoxes, opts: { won: number; flash: number; lift: number }) => {
    const accentBorder = Math.max(opts.flash, opts.lift, opts.won * 0.55);
    return (
      <>
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxSizing: "border-box",
            borderRadius: cardRadius,
            background: `linear-gradient(165deg, ${palette.raised}, ${palette.surface} 75%)`,
            border: `1px solid ${accentBorder > 0.02 ? alpha(palette.accent, 25 + accentBorder * 60) : palette.line}`,
            boxShadow: `0 ${6 + opts.lift * 18}px ${18 + opts.lift * 30}px ${alpha("#000000", 30 + opts.lift * 25)}`,
          }}
        />
        {/* Filete de estado en el borde izquierdo (dentro del relleno, nunca bajo el texto). */}
        <div style={{ position: "absolute", left: 0, top: cardRadius, bottom: cardRadius, width: 3, borderRadius: 3, background: alpha(palette.accent, 25 + opts.won * 75) }} />
        <BoxText block={relText(cell.title, cell.frame)} style={{ fontFamily: fonts.display, fontWeight: 600, color: palette.text }} />
        {cell.meta ? <BoxText block={relText(cell.meta, cell.frame)} style={{ fontFamily: fonts.body, color: palette.muted }} /> : null}
        {cell.tags.map((tag) => (
          <div key={tag.text.id}>
            <div style={{ ...boxStyle(relative(tag.frame, cell.frame)), boxSizing: "border-box", borderRadius: 999, border: `1px solid ${alpha(palette.accent, 40)}`, background: alpha(palette.accent, 10) }} />
            <BoxText block={relText(tag.text, cell.frame)} align="center" style={{ fontFamily: fonts.label, fontWeight: 600, color: palette.accentSoft }} />
          </div>
        ))}
      </>
    );
  };

  // La tarjeta en movimiento se pinta al final: va por encima de los fondos de las columnas.
  const order = cards.map((_, index) => index).sort((a, b) => Number(Boolean(states[a].move)) - Number(Boolean(states[b].move)));

  const rail = layout.rail;
  const steps = workflow?.steps ?? [];
  const stepLit = steps.map((_, index) => progress(frame, timing.stepAt[index] - 2, timing.stepAt[index] + 10));
  const railFill = (() => {
    if (steps.length < 2) return 0;
    let fill = 0;
    for (let index = 1; index < steps.length; index++) {
      const reach = progress(frame, timing.stepAt[index] - 16, timing.stepAt[index], EASE_IN_OUT);
      if (reach > 0) fill = (index - 1 + reach) / (steps.length - 1);
    }
    return fill;
  })();

  const plateStyle: CSSProperties = {
    boxSizing: "border-box",
    borderRadius: brand.radius,
    background: `linear-gradient(160deg, ${alpha(palette.raised, 80)}, ${alpha(palette.surface, 90)} 60%)`,
    border: `1px solid ${palette.line}`,
    boxShadow: `0 40px 90px ${alpha("#000000", 40)}`,
  };

  return (
    <AbsoluteFill>
      {/* Tablero */}
      <div style={{ ...boxStyle(layout.board), ...plateStyle, opacity: enter, translate: `0 ${(1 - enter) * 16}px` }} />
      {layout.boardTitle ? <BoxText block={layout.boardTitle} style={{ fontFamily: fonts.display, fontWeight: 600, color: palette.text, opacity: progress(frame, 8, 24) }} /> : null}
      <SampleTag block={layout.sample} opacity={progress(frame, 14, 30)} />

      {layout.columns.map((column, index) => {
        const show = progress(frame, 6 + index * 4, 22 + index * 4);
        const count = states.filter((state) => !state.move && state.stage === index).length;
        return (
          <div key={column.id} style={{ opacity: show }}>
            <div style={{ ...boxStyle(column.frame), boxSizing: "border-box", borderRadius: Math.round(brand.radius * 0.8), background: alpha(palette.bg, 55), border: `1px solid ${alpha(palette.line, 80)}` }} />
            <BoxText block={column.label} style={{ fontFamily: fonts.label, fontWeight: 600, color: index === lastStage ? palette.accentSoft : palette.text }} />
            <div style={{ ...boxStyle(column.count.frame), boxSizing: "border-box", borderRadius: 999, background: alpha(palette.accent, 14), border: `1px solid ${alpha(palette.accent, 30)}` }} />
            <BoxText block={column.count.text} align="center" style={{ fontFamily: fonts.label, fontWeight: 700, color: palette.accentSoft, fontVariantNumeric: "tabular-nums" }}>
              {count}
            </BoxText>
          </div>
        );
      })}

      {order.map((cardIndex) => {
        const card = cards[cardIndex];
        const { stage, move } = states[cardIndex];
        const cell = layout.cells[cardIndex][stage];
        const appear = progress(frame, 16 + cardIndex * 5, 32 + cardIndex * 5);
        let dx = 0;
        let lift = 0;
        if (move) {
          const up = progress(frame, move.start, move.start + timing.phases.lift);
          const down = progress(frame, move.end - timing.phases.drop, move.end);
          const travel = progress(frame, move.start + timing.phases.lift, move.end - timing.phases.drop, EASE_IN_OUT);
          lift = up * (1 - down);
          dx = (layout.cells[cardIndex][move.to].frame.x - cell.frame.x) * travel;
        }
        const arrived = timing.moves.filter((item) => item.card === cardIndex && item.end <= frame).pop();
        const flash = arrived ? 1 - progress(frame, arrived.end, arrived.end + 30) : 0;
        const won = stage === lastStage && !move ? 1 : 0;
        return (
          <div
            key={card.id}
            style={{
              ...boxStyle(cell.frame),
              opacity: appear,
              translate: `${dx}px ${(1 - appear) * 10}px`,
              scale: `${1 + lift * 0.04}`,
              zIndex: move ? 2 : 1,
            }}
          >
            {renderCard(cell, { won, flash, lift })}
          </div>
        );
      })}

      {/* Workflow: la recta va detrás de los nodos (opacos) y no toca los rótulos. */}
      {rail ? (
        <div style={{ opacity: progress(frame, 10, 28), zIndex: 3 }}>
          <div style={{ ...boxStyle(rail.frame), ...plateStyle }} />
          {rail.title ? (
            <BoxText block={rail.title} style={{ fontFamily: fonts.label, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: palette.muted }} />
          ) : null}
          <div style={{ ...boxStyle(rail.track), background: palette.line, borderRadius: 2 }} />
          <div
            style={{
              ...boxStyle(rail.track),
              background: palette.accent,
              borderRadius: 2,
              transformOrigin: rail.orientation === "vertical" ? "top" : "left",
              scale: rail.orientation === "vertical" ? `1 ${railFill}` : `${railFill} 1`,
            }}
          />
          {rail.nodes.map((node, index) => {
            const lit = stepLit[index];
            const show = progress(frame, 18 + index * 4, 32 + index * 4);
            return (
              <div key={`node-${index}`} style={{ opacity: show }}>
                <div
                  style={{
                    ...boxStyle(node),
                    boxSizing: "border-box",
                    borderRadius: 999,
                    background: lit > 0.5 ? palette.accent : palette.surface,
                    border: `2px solid ${lit > 0.02 ? palette.accent : palette.line}`,
                    boxShadow: lit > 0 && lit < 1 ? `0 0 0 ${lit * 6}px ${alpha(palette.accent, (1 - lit) * 40)}` : "none",
                  }}
                />
                {lit > 0 ? <Glyph kind="check" box={{ x: node.x + node.w * 0.22, y: node.y + node.h * 0.22, w: node.w * 0.56, h: node.h * 0.56 }} color={palette.onAccent} draw={lit} weight={3} /> : null}
                <BoxText
                  block={rail.labels[index]}
                  align={rail.orientation === "vertical" ? "left" : "center"}
                  style={{ fontFamily: fonts.body, fontWeight: 500, color: interpolateColors(lit, [0, 1], [palette.muted, palette.text]) }}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
