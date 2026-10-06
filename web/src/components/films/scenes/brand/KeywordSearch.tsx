import type { CSSProperties } from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { boxStyle, BoxText, Glyph, Plate, SampleTag } from "./dataKit";
import { countUpText } from "./layout/dataText";
import { highlightSegments, keywordSearchLayout, type KeywordResult, type KeywordStat } from "./layout/keywordSearch";

export type KeywordSearchProps = {
  box: Box;
  duration: number;
  query: string;
  tokens: string[];
  results: KeywordResult[];
  stats: KeywordStat[];
  methodLabel: string;
  sampleLabel: string;
  language: FilmLanguage;
  /** Color del resaltado (por defecto el acento de la marca; en contenido médico conviene uno neutro). */
  highlightTone?: string;
};

/**
 * Búsqueda por palabras clave, no vectorial: se escribe la consulta, se
 * marcan sus términos y aparecen los fragmentos en orden de relevancia con
 * las mismas palabras resaltadas. Sin puntajes ni imaginería de vectores.
 */
export function KeywordSearch({ box, duration, query, tokens, results, stats, methodLabel, sampleLabel, language, highlightTone }: KeywordSearchProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = keywordSearchLayout(box, { query, tokens, results, stats, methodLabel, sampleLabel, language }, portrait ? "portrait" : "landscape");
  const tone = highlightTone ?? brand.palette.accent;

  // Guion: índice → campo → escritura → términos → resultados de a uno.
  const fieldAt = 26;
  const typeFrom = 40;
  const typeFrames = Math.round(Math.max(30, Math.min(66, query.length * 1.5)));
  const typed = Math.round(query.length * progress(frame, typeFrom, typeFrom + typeFrames, Easing.linear));
  const typingDone = frame >= typeFrom + typeFrames;
  const markAt = typeFrom + typeFrames + 6;
  const tokensAt = markAt + 8;
  const resultsAt = tokensAt + tokens.length * 6 + 16;
  const resultStep = Math.max(14, Math.min(30, (duration * 0.78 - resultsAt) / Math.max(1, results.length)));
  const caretOn = !typingDone || (frame < resultsAt && Math.floor(frame / 15) % 2 === 0);

  const mark = (show: number): CSSProperties => ({
    background: alpha(tone, Math.round(26 * show)),
    borderRadius: 6,
    padding: "0 0.16em",
    margin: "0 -0.16em",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  });

  const querySegments = highlightSegments(query, tokens);
  const queryMark = progress(frame, markAt, markAt + 16);

  return (
    <AbsoluteFill>
      {/* Método e índice */}
      <BoxText block={layout.method} style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text, opacity: progress(frame, 0, 16) }} />
      {layout.statRules.map((rule, index) => (
        <div key={index} style={{ ...boxStyle(rule), background: brand.palette.line, opacity: progress(frame, 14 + index * 8, 28 + index * 8) }} />
      ))}
      {layout.stats.map((stat, index) => {
        const at = 8 + index * 8;
        return (
          <div key={stat.value.id} style={{ opacity: progress(frame, at, at + 14) }}>
            <BoxText block={stat.value} style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
              {countUpText(stat.value.text, progress(frame, at + 2, at + 40, EASE_IN_OUT), language)}
            </BoxText>
            <BoxText block={stat.label} style={{ fontFamily: brand.fonts.body, color: brand.palette.muted }} />
          </div>
        );
      })}

      {/* Campo con la consulta */}
      <div style={{ opacity: progress(frame, fieldAt, fieldAt + 14) }}>
        <div
          style={{
            ...boxStyle(layout.field),
            boxSizing: "border-box",
            borderRadius: layout.field.h / 2,
            background: brand.palette.surface,
            border: `1.5px solid ${typingDone ? alpha(tone, 60) : brand.palette.line}`,
          }}
        />
        <Glyph kind="search" box={layout.icon} color={brand.palette.muted} />
        <BoxText block={layout.query} style={{ fontFamily: brand.fonts.body, fontWeight: 500, color: brand.palette.text }}>
          {typingDone
            ? querySegments.map((segment, index) => (
                <span key={index} style={segment.hit ? mark(queryMark) : undefined}>
                  {segment.text}
                </span>
              ))
            : query.slice(0, typed)}
          <span style={{ display: "inline-block", width: 3, height: "1em", marginLeft: 4, verticalAlign: "-0.12em", borderRadius: 2, background: tone, opacity: caretOn ? 1 : 0 }} />
        </BoxText>
      </div>

      {/* Términos */}
      <BoxText block={layout.termsLabel} style={{ fontFamily: brand.fonts.label, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: brand.palette.muted, opacity: progress(frame, markAt, markAt + 14) }} />
      {layout.tokens.map((token, index) => (
        <div key={token.text.id} style={{ opacity: progress(frame, tokensAt + index * 6, tokensAt + index * 6 + 14) }}>
          <div style={{ ...boxStyle(token.frame), boxSizing: "border-box", borderRadius: 999, background: alpha(tone, 16), border: `1px solid ${alpha(tone, 45)}` }} />
          <BoxText block={token.text} align="center" style={{ fontFamily: brand.fonts.body, fontWeight: 600, color: brand.palette.text }} />
        </div>
      ))}

      {/* Resultados por relevancia (sin puntajes) */}
      <BoxText block={layout.resultsLabel} style={{ fontFamily: brand.fonts.label, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: brand.palette.muted, opacity: progress(frame, resultsAt - 10, resultsAt + 4) }} />
      <SampleTag block={layout.sample} opacity={progress(frame, resultsAt - 10, resultsAt + 4)} />
      {layout.results.map((result, index) => {
        const at = resultsAt + index * resultStep;
        const show = progress(frame, at, at + 16);
        const lit = progress(frame, at + 14, at + 30);
        const segments = highlightSegments(result.fragment.text, tokens);
        return (
          <div key={result.title.id} style={{ opacity: show, translate: `0 ${(1 - show) * 8}px` }}>
            <Plate box={result.card} />
            <div style={{ ...boxStyle(result.rankFrame), boxSizing: "border-box", borderRadius: 999, border: `1px solid ${index === 0 ? alpha(tone, 70) : brand.palette.line}` }} />
            <BoxText block={result.rank} align="center" style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: index === 0 ? brand.palette.text : brand.palette.muted }} />
            <BoxText block={result.title} style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text }} />
            <BoxText block={result.fragment} style={{ fontFamily: brand.fonts.body, color: brand.palette.muted }}>
              {segments.map((segment, segmentIndex) =>
                segment.hit ? (
                  <span key={segmentIndex} style={{ ...mark(lit), color: brand.palette.text, fontWeight: 700 }}>
                    {segment.text}
                  </span>
                ) : (
                  <span key={segmentIndex}>{segment.text}</span>
                ),
              )}
            </BoxText>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
