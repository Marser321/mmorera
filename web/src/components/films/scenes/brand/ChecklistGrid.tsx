import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { boxStyle, BoxText, Glyph, SampleTag } from "./dataKit";
import { checklistGridLayout } from "./layout/checklistGrid";

export type ChecklistGridProps = {
  box: Box;
  duration: number;
  total: number;
  passed: number;
  /** Áreas revisadas (solo leyenda, sin cuentas por área). */
  groups: string[];
  unitLabel: string;
  legendTitle?: string;
  language: FilmLanguage;
  sampleLabel?: string;
};

/**
 * Grilla de QA: una celda por chequeo que se llena en orden con su tilde,
 * mientras el contador avanza en su banda hasta el "98/98" final. Si quedan
 * chequeos sin pasar, sus celdas quedan punteadas: no se dibuja lo que no hay.
 */
export function ChecklistGrid({ box, duration, total, passed, groups, unitLabel, legendTitle, language, sampleLabel }: ChecklistGridProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = checklistGridLayout(box, { total, passed, groups, unitLabel, legendTitle, language, sampleLabel }, portrait ? "portrait" : "landscape");
  const fillFrom = 34;
  const fillTo = Math.max(fillFrom + 60, Math.min(fillFrom + 150, Math.round(duration * 0.6)));
  const filled = Math.floor(passed * progress(frame, fillFrom, fillTo, Easing.linear));
  const complete = progress(frame, fillTo, fillTo + 18);
  const cellAt = (index: number) => fillFrom + (index / Math.max(1, passed)) * (fillTo - fillFrom);
  const radius = Math.max(4, Math.round(layout.cells[0]?.w * 0.22 || 6));

  return (
    <AbsoluteFill>
      {layout.cells.map((cell, index) => {
        const pending = index >= passed;
        const fill = pending ? 0 : progress(frame, cellAt(index), cellAt(index) + 10);
        const appear = progress(frame, 4 + (index / total) * 24, 16 + (index / total) * 24);
        return (
          <div key={index} style={{ opacity: appear }}>
            <div
              style={{
                ...boxStyle(cell),
                boxSizing: "border-box",
                borderRadius: radius,
                background: fill > 0 ? alpha(brand.palette.accent, 8 + fill * 12) : alpha(brand.palette.surface, 80),
                border: `1px ${pending ? "dashed" : "solid"} ${fill > 0 ? alpha(brand.palette.accent, 30 + fill * 30) : brand.palette.line}`,
              }}
            />
            {fill > 0 ? <Glyph kind="check" box={{ x: cell.x + cell.w * 0.2, y: cell.y + cell.h * 0.2, w: cell.w * 0.6, h: cell.h * 0.6 }} color={brand.palette.accentSoft} draw={fill} weight={2.6} /> : null}
          </div>
        );
      })}

      <BoxText
        block={layout.counter}
        style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: complete > 0.5 ? brand.palette.accentSoft : brand.palette.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", opacity: progress(frame, 0, 16) }}
      >
        {`${formatFact({ value: filled }, language)}/${formatFact({ value: total }, language)}`}
      </BoxText>
      {layout.done ? <Glyph kind="check" box={layout.done} color={brand.palette.accentSoft} draw={complete} weight={2.8} /> : null}
      <BoxText block={layout.unit} style={{ fontFamily: brand.fonts.body, fontWeight: 500, color: brand.palette.muted, opacity: progress(frame, 6, 22) }} />

      {layout.legendTitle ? (
        <BoxText block={layout.legendTitle} style={{ fontFamily: brand.fonts.label, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: brand.palette.muted, opacity: progress(frame, 10, 26) }} />
      ) : null}
      {layout.chips.map((chip, index) => {
        const show = progress(frame, 14 + index * 5, 30 + index * 5);
        return (
          <div key={chip.text.id} style={{ opacity: show }}>
            <div style={{ ...boxStyle(chip.frame), boxSizing: "border-box", borderRadius: 999, border: `1px solid ${brand.palette.line}`, background: alpha(brand.palette.surface, 85) }} />
            <BoxText block={chip.text} align="center" style={{ fontFamily: brand.fonts.body, color: brand.palette.text }} />
          </div>
        );
      })}
      {layout.sample ? <SampleTag block={layout.sample} opacity={progress(frame, fillTo + 6, fillTo + 26)} /> : null}
    </AbsoluteFill>
  );
}
