import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { useBrand } from "./context";
import { boxStyle, BoxText, Plate, SampleTag } from "./dataKit";
import { countUpText } from "./layout/dataText";
import { factWallLayout, type FactWallFact } from "./layout/factWall";

export type FactWallProps = {
  /** Área que el film le da a la escena. */
  box: Box;
  duration: number;
  /** 4–8 cifras verificadas, con el valor ya formateado y su fuente. */
  facts: FactWallFact[];
  language: FilmLanguage;
  sampleLabel?: string;
};

/**
 * Muro de cifras verificadas: las baldosas entran de a una, cada valor cuenta
 * una sola vez hasta su cifra exacta y la fuente aparece en su banda de pie.
 */
export function FactWall({ box, duration, facts, language, sampleLabel }: FactWallProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = factWallLayout(box, { facts, language, sampleLabel }, portrait ? "portrait" : "landscape");
  const stagger = Math.max(8, Math.min(18, (duration * 0.4) / Math.max(1, facts.length)));
  const lastEnter = 6 + (facts.length - 1) * stagger;

  return (
    <AbsoluteFill>
      {layout.tiles.map((tile, index) => {
        const enter = 6 + index * stagger;
        const show = progress(frame, enter, enter + 18);
        const count = progress(frame, enter + 6, enter + 52, EASE_IN_OUT);
        const rule = progress(frame, enter + 22, enter + 46, EASE_IN_OUT);
        const source = progress(frame, enter + 34, enter + 52);
        return (
          <div key={`${tile.value.text}-${index}`} style={{ opacity: show }}>
            <Plate box={tile.tile} style={{ scale: `${0.97 + show * 0.03}` }} />
            <BoxText
              block={tile.value}
              style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
            >
              {countUpText(tile.value.text, count, language)}
            </BoxText>
            <BoxText block={tile.label} style={{ fontFamily: brand.fonts.body, fontWeight: 500, color: brand.palette.text }} />
            <div style={{ ...boxStyle(tile.rule), background: brand.palette.line, transformOrigin: "left", scale: `${rule} 1` }} />
            <BoxText block={tile.source} style={{ fontFamily: brand.fonts.body, color: brand.palette.muted, opacity: source }} />
          </div>
        );
      })}
      {layout.sample ? <SampleTag block={layout.sample} opacity={progress(frame, lastEnter + 30, lastEnter + 50)} /> : null}
    </AbsoluteFill>
  );
}
