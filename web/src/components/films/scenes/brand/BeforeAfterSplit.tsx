import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { CLAMP, EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { boxStyle, BoxText, Glyph, SampleTag } from "./dataKit";
import { BEFORE_AFTER_KICKER_TRACKING, BEFORE_AFTER_TONE, beforeAfterLayout, beforeAfterTiming, type BeforeAfterChip, type BeforeAfterColumn, type BeforeAfterStep } from "./layout/beforeAfterSplit";
import { BEFORE_AFTER_KICKERS } from "./layout/crmSamples";
import type { TextBlock } from "./layout/dataText";

export type BeforeAfterSplitSide = {
  title: string;
  steps: BeforeAfterStep[];
  /** Rótulo chico sobre el título; por defecto "Antes"/"Después" según el idioma. */
  kicker?: string;
};

export type BeforeAfterSplitProps = {
  box: Box;
  duration: number;
  before: BeforeAfterSplitSide;
  after: BeforeAfterSplitSide;
  language: FilmLanguage;
  /** Si el flujo es ilustrativo, el film pasa "Datos de ejemplo" / "Sample data". */
  sampleLabel?: string;
};

/** Texto que sube desde su caja (la caja recorta: nunca invade la banda vecina). */
function Rise({ block, t, style, align }: { block: TextBlock; t: number; style: CSSProperties; align?: "left" | "center" }) {
  const shift = `0 ${(1 - t) * 105}%`;
  // Varias líneas: "pre-line" respeta los cortes "\n" que fijó el film (el layout los midió).
  const inner: ReactNode = block.lines === 1 ? <span style={{ display: "inline-block", translate: shift }}>{block.text}</span> : <div style={{ translate: shift, whiteSpace: "pre-line" }}>{block.text}</div>;
  return (
    <BoxText block={block} align={align} style={{ ...style, opacity: t > 0 ? 1 : 0 }}>
      {inner}
    </BoxText>
  );
}

/**
 * "Antes / después" de dos flujos: primero el lado de antes, paso por paso
 * (sus rectas punteadas se dibujan por los huecos entre pastillas); el último
 * paso se apaga si es una pérdida. Después el divisor se barre de arriba hacia
 * abajo y recién entonces aparece el lado de después, con su paso final
 * encendido. Todo es secuencial: ningún texto entra encima de otro.
 */
export function BeforeAfterSplit({ box, duration, before, after, language, sampleLabel }: BeforeAfterSplitProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const { palette, fonts } = brand;
  const kickers = BEFORE_AFTER_KICKERS[language];
  const layout = beforeAfterLayout(
    box,
    {
      before: { kicker: before.kicker ?? kickers.before, title: before.title, steps: before.steps },
      after: { kicker: after.kicker ?? kickers.after, title: after.title, steps: after.steps },
      sampleLabel,
    },
    portrait ? "portrait" : "landscape",
  );

  // Guion secuencial (puro y testeado); en escenas cortas todo se acelera por igual.
  const timing = beforeAfterTiming(before.steps, after.steps, duration);
  const clock = frame / timing.pace;
  const beforeAt = (index: number) => timing.beforeAt[index];
  const afterAt = (index: number) => timing.afterAt[index];
  // Al final, el lado de antes queda en segundo plano (sin desaparecer).
  const settle = interpolate(clock, [timing.settleAt, timing.settleAt + 24], [1, 0.62], { ...CLAMP, easing: EASE_IN_OUT });

  const renderChip = (chip: BeforeAfterChip, at: number, side: "before" | "after") => {
    const enter = progress(clock, at, at + 14);
    const toneT = chip.tone ? progress(clock, at + BEFORE_AFTER_TONE.from, at + BEFORE_AFTER_TONE.to) : 0;
    const loss = chip.tone === "loss" ? toneT : 0;
    const win = chip.tone === "win" ? toneT : 0;
    const baseBorder = side === "after" ? alpha(palette.accent, 45) : palette.line;
    const markColor = side === "after" ? palette.accent : palette.muted;
    return (
      <div key={chip.text.id} style={{ opacity: enter, translate: `0 ${(1 - enter) * 12}px` }}>
        <div
          style={{
            ...boxStyle(chip.frame),
            boxSizing: "border-box",
            borderRadius: brand.radius,
            background: win > 0 ? interpolateColors(win, [0, 1], [palette.raised, palette.accent]) : `linear-gradient(165deg, ${alpha(palette.raised, 100 - loss * 60)}, ${alpha(palette.surface, 100 - loss * 60)} 75%)`,
            border: `1px ${loss > 0.5 ? "dashed" : "solid"} ${loss > 0 ? alpha(palette.muted, 50) : win > 0 ? palette.accent : baseBorder}`,
            boxShadow: win > 0 ? `0 18px 50px ${alpha(palette.accent, win * 30)}` : "none",
          }}
        />
        {chip.tone === "loss" && loss > 0 ? (
          <Glyph kind="cross" box={chip.mark} color={palette.muted} draw={loss} weight={2.6} />
        ) : chip.tone === "win" && win > 0 ? (
          <Glyph kind="check" box={chip.mark} color={palette.onAccent} draw={win} weight={2.8} />
        ) : (
          <div style={{ ...boxStyle(chip.mark), boxSizing: "border-box", borderRadius: 999, border: `2px solid ${markColor}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - toneT }}>
            <div style={{ width: chip.mark.w * 0.32, height: chip.mark.w * 0.32, borderRadius: 999, background: markColor }} />
          </div>
        )}
        <BoxText
          block={chip.text}
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            color: win > 0 ? interpolateColors(win, [0, 1], [palette.text, palette.onAccent]) : interpolateColors(loss, [0, 1], [palette.text, palette.muted]),
          }}
        />
      </div>
    );
  };

  const renderSide = (column: BeforeAfterColumn, side: "before" | "after", headAt: number, at: (index: number) => number) => {
    const dashed = side === "before";
    return (
      <div style={{ opacity: side === "before" ? settle : 1 }}>
        <Rise
          block={column.kicker}
          t={progress(clock, headAt, headAt + 16)}
          style={{ fontFamily: fonts.label, fontWeight: 600, letterSpacing: `${BEFORE_AFTER_KICKER_TRACKING}em`, textTransform: "uppercase", color: side === "after" ? palette.accent : palette.muted }}
        />
        <Rise block={column.title} t={progress(clock, headAt + 4, headAt + 26)} style={{ fontFamily: fonts.display, fontWeight: 600, letterSpacing: "-0.01em", color: palette.text }} />
        {/* Rectas primero: quedan detrás de las pastillas. */}
        {column.connectors.map((line, index) => {
          const draw = progress(clock, at(index + 1) - 10, at(index + 1), EASE_IN_OUT);
          return (
            <div
              key={`line-${index}`}
              style={{
                ...boxStyle(line),
                background: dashed ? `repeating-linear-gradient(to bottom, ${palette.muted} 0 6px, transparent 6px 12px)` : palette.accent,
                opacity: dashed ? 0.8 : 0.85,
                transformOrigin: "top",
                scale: `1 ${draw}`,
              }}
            />
          );
        })}
        {column.chips.map((chip, index) => renderChip(chip, at(index), side))}
      </div>
    );
  };

  const wipe = progress(clock, timing.dividerAt, timing.dividerAt + 24, EASE_IN_OUT);
  const medal = progress(clock, timing.dividerAt + 12, timing.dividerAt + 26);
  const { medallion, divider } = layout;

  return (
    <AbsoluteFill>
      <div style={{ ...boxStyle(divider), background: `linear-gradient(to bottom, ${alpha(palette.line, 0)}, ${palette.line} 12%, ${palette.line} 88%, ${alpha(palette.line, 0)})`, transformOrigin: "top", scale: `1 ${wipe}` }} />
      <div
        style={{
          ...boxStyle(medallion),
          boxSizing: "border-box",
          borderRadius: 999,
          background: palette.surface,
          border: `1px solid ${alpha(palette.accent, 55)}`,
          opacity: medal,
          scale: `${0.8 + medal * 0.2}`,
        }}
      >
        <svg viewBox="0 0 24 24" width={medallion.w} height={medallion.h} style={{ position: "absolute", inset: -1 }}>
          <path d="M7 12 H17 M13 8 L17 12 L13 16" fill="none" stroke={palette.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - medal} />
        </svg>
      </div>

      {renderSide(layout.before, "before", timing.beforeHead, beforeAt)}
      {clock >= timing.afterHead - 1 ? renderSide(layout.after, "after", timing.afterHead, afterAt) : null}
      {layout.sample ? <SampleTag block={layout.sample} opacity={progress(clock, 20, 36)} /> : null}
    </AbsoluteFill>
  );
}
