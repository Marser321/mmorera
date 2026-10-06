import { AbsoluteFill, useCurrentFrame } from "remotion";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { boxStyle, BoxText, Figure, Glyph, Headline, Plate, SampleTag } from "./dataKit";
import { scenePace } from "./layout/dataText";
import { scriptTimelineLayout, type ScriptTimelineData } from "./layout/scriptTimeline";

export type ScriptTimelineProps = {
  box: Box;
  duration: number;
  segments: ScriptTimelineData["segments"];
  counter?: ScriptTimelineData["counter"];
  breakdown?: ScriptTimelineData["breakdown"];
  checklist?: ScriptTimelineData["checklist"];
  language: FilmLanguage;
  sampleLabel?: string;
  /** true: cuenta hasta el valor (solo para datos de ejemplo). Por defecto cada cifra entra con su valor final. */
  countUp?: boolean;
};

/**
 * Plantilla de guion como línea de tiempo: los segmentos entran en orden, el
 * cabezal recorre su riel una sola vez (encendiendo cada segmento al pasar) y
 * después se tilda la checklist. El cabezal vive en su riel: nunca cruza un
 * rótulo.
 */
export function ScriptTimeline({ box, duration, segments, counter, breakdown, checklist, language, sampleLabel, countUp = false }: ScriptTimelineProps) {
  // Ritmo: por debajo de 300 frames la coreografía se comprime entera; por encima, el final se sostiene.
  const { frame, span } = scenePace(useCurrentFrame(), duration, 300);
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = scriptTimelineLayout(box, { segments, counter, breakdown, checklist, language, sampleLabel }, portrait ? "portrait" : "landscape");
  const accent = brand.palette.accent;
  const n = segments.length;

  const segmentsAt = 28;
  const sweepFrom = segmentsAt + n * 6 + 16;
  const sweepTo = sweepFrom + Math.round(Math.max(60, Math.min(150, span * 0.36)));
  const sweep = progress(frame, sweepFrom, sweepTo, EASE_IN_OUT);
  const active = sweep <= 0 ? -1 : sweep >= 1 ? n : Math.min(n - 1, Math.floor(sweep * n));
  const checkFrom = sweepTo + 4;
  const checkCount = checklist?.items.length ?? 0;
  const vertical = layout.orientation === "vertical";
  const rail = layout.rail;
  const knob = Math.round((vertical ? rail.w : rail.h) * 0.62);

  return (
    <AbsoluteFill>
      {/* Contador y desglose */}
      {layout.counterValue && layout.counterLabel && counter ? (
        <Headline
          value={layout.counterValue}
          label={layout.counterLabel}
          valueStyle={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", opacity: progress(frame, 0, 12) }}
          labelStyle={{ fontFamily: brand.fonts.body, fontWeight: 500, color: brand.palette.muted, opacity: progress(frame, 8, 24) }}
        >
          <Figure final={layout.counterValue.text} t={progress(frame, 4, 50, EASE_IN_OUT)} countUp={countUp} format={(t) => formatFact({ value: Math.round(counter.value * t) }, language)} />
        </Headline>
      ) : null}
      {layout.breakdown.map((chip, index) => (
        <div key={chip.text.id} style={{ opacity: progress(frame, 16 + index * 6, 30 + index * 6) }}>
          <div style={{ ...boxStyle(chip.frame), boxSizing: "border-box", borderRadius: 999, border: `1px solid ${brand.palette.line}`, background: alpha(brand.palette.surface, 85) }} />
          <BoxText block={chip.text} align="center" style={{ fontFamily: brand.fonts.body, color: brand.palette.muted }}>
            <span style={{ marginRight: "0.4em", fontWeight: 700, color: brand.palette.text }}>{chip.value}</span>
            {chip.label}
          </BoxText>
        </div>
      ))}

      {/* Riel del cabezal: línea base, avance, marcas por segmento y cabezal. */}
      <div style={{ opacity: progress(frame, segmentsAt, segmentsAt + 20) }}>
        <div style={{ ...boxStyle(vertical ? { x: rail.x + rail.w / 2 - 1, y: rail.y, w: 2, h: rail.h } : { x: rail.x, y: rail.y + rail.h / 2 - 1, w: rail.w, h: 2 }), background: brand.palette.line, borderRadius: 2 }} />
        <div
          style={{
            ...boxStyle(vertical ? { x: rail.x + rail.w / 2 - 1.5, y: rail.y, w: 3, h: rail.h } : { x: rail.x, y: rail.y + rail.h / 2 - 1.5, w: rail.w, h: 3 }),
            background: accent,
            borderRadius: 3,
            transformOrigin: vertical ? "top" : "left",
            scale: vertical ? `1 ${sweep}` : `${sweep} 1`,
          }}
        />
        {layout.segments.map((segment, index) => {
          const tick = segment.tick;
          const passed = index <= active;
          return (
            <div
              key={segment.label.id}
              style={{
                ...boxStyle(vertical ? { x: tick.x + tick.w * 0.25, y: tick.y, w: tick.w * 0.5, h: 2 } : { x: tick.x, y: tick.y + tick.h * 0.25, w: 2, h: tick.h * 0.5 }),
                background: passed ? accent : brand.palette.muted,
                opacity: passed ? 1 : 0.6,
                borderRadius: 2,
              }}
            />
          );
        })}
        {sweep > 0 ? (
          <div
            style={{
              ...boxStyle(
                vertical
                  ? { x: rail.x + (rail.w - knob) / 2, y: rail.y + Math.min(rail.h - knob, Math.max(0, sweep * rail.h - knob / 2)), w: knob, h: knob }
                  : { x: rail.x + Math.min(rail.w - knob, Math.max(0, sweep * rail.w - knob / 2)), y: rail.y + (rail.h - knob) / 2, w: knob, h: knob },
              ),
              borderRadius: 99,
              background: brand.palette.bg,
              border: `3px solid ${accent}`,
              boxSizing: "border-box",
              boxShadow: `0 0 0 6px ${alpha(accent, 14)}`,
            }}
          />
        ) : null}
      </div>

      {/* Segmentos (mismo ancho: no se insinúan duraciones). */}
      {layout.segments.map((segment, index) => {
        const show = progress(frame, segmentsAt + index * 6, segmentsAt + index * 6 + 16);
        const isActive = index === active;
        const done = index < active;
        return (
          <div key={segment.label.id} style={{ opacity: show }}>
            <Plate box={segment.frame} style={{ background: isActive ? alpha(accent, 14) : undefined, borderColor: isActive ? alpha(accent, 75) : done ? alpha(accent, 32) : brand.palette.line }} />
            <BoxText block={segment.index} style={{ fontFamily: brand.fonts.label, fontWeight: 600, letterSpacing: "0.12em", color: isActive || done ? brand.palette.accentSoft : brand.palette.muted }} />
            <BoxText block={segment.label} style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text }} />
            {segment.timing ? <BoxText block={segment.timing} style={{ fontFamily: brand.fonts.body, fontWeight: 600, color: brand.palette.accentSoft }} /> : null}
          </div>
        );
      })}

      {/* Checklist: se tilda después del recorrido. */}
      {layout.checklist ? (
        <div style={{ opacity: progress(frame, sweepTo - 16, sweepTo) }}>
          <Plate box={layout.checklist.frame} />
          <BoxText block={layout.checklist.title} style={{ fontFamily: brand.fonts.label, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: brand.palette.muted }} />
          {layout.checklist.items.map((item, index) => {
            const at = checkFrom + index * 10;
            return (
              <div key={item.text.id}>
                <div style={{ ...boxStyle(item.icon), boxSizing: "border-box", borderRadius: 6, border: `1px solid ${brand.palette.line}` }} />
                <Glyph kind="check" box={item.icon} color={brand.palette.accentSoft} draw={progress(frame, at, at + 14, EASE_IN_OUT)} weight={2.6} />
                <BoxText block={item.text} style={{ fontFamily: brand.fonts.body, color: brand.palette.text, opacity: 0.55 + 0.45 * progress(frame, at, at + 12) }} />
              </div>
            );
          })}
        </div>
      ) : null}

      {layout.sample ? <SampleTag block={layout.sample} opacity={progress(frame, checkFrom + checkCount * 10, checkFrom + checkCount * 10 + 20)} /> : null}
    </AbsoluteFill>
  );
}
