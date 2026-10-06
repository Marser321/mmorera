import { Fragment, type CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { Box } from "@/lib/filmLayout";
import { CLAMP, EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { useBrand } from "./context";
import { manifestoBeatsLayout, manifestoSchedule, MANIFESTO_KICKER_TRACKING } from "./layout/manifestoBeats";
import { LINE_HEIGHT } from "./layout/mediaShared";

export type ManifestoBeat = {
  /** Frase. `*palabra*` la pinta con el acento de la marca. */
  text: string;
  kicker?: string;
  /** Frames relativos a la escena: entra en `from`, termina de salir en `to`. */
  from: number;
  to: number;
};

export type ManifestoBeatsProps = {
  box: Box;
  beats: ManifestoBeat[];
  duration: number;
  /** Máximo de líneas por frase (el tamaño se ajusta solo). */
  maxLines?: number;
  align?: "left" | "center";
  uniformSize?: boolean;
  maxSize?: number;
  minSize?: number;
  measure?: number;
};

/**
 * Manifiesto en beats tipográficos: una sola frase a la vez en una banda, con
 * la tipografía display de la marca. Cada beat sale del todo antes de que
 * entre el siguiente (los tiempos se sanean con `manifestoSchedule`), así dos
 * frases nunca se superponen.
 */
export function ManifestoBeats({ box, beats, duration, maxLines, align = "left", uniformSize, maxSize, minSize, measure }: ManifestoBeatsProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = manifestoBeatsLayout(box, { beats, maxLines, align, uniformSize, maxSize, minSize, measure }, portrait ? "portrait" : "landscape");
  const schedule = manifestoSchedule(beats, duration);
  const index = schedule.findIndex((slot) => frame >= slot.from && frame < slot.to);
  if (index < 0) return null;
  const beat = beats[index];
  const slot = schedule[index];
  const boxes = layout.beats[index];
  const local = frame - slot.from;
  const length = slot.to - slot.from;
  const exitLen = Math.max(4, Math.min(16, Math.floor(length / 4)));
  const leave = progress(frame, slot.to - exitLen, slot.to, EASE_IN_OUT);
  const kickerIn = progress(local, 0, 16);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, translate: `0 ${-leave * 14}px` }}>
      {beat.kicker && boxes.kicker ? (
        <div
          style={{
            position: "absolute",
            left: boxes.kicker.x,
            top: boxes.kicker.y,
            width: boxes.kicker.w,
            height: boxes.kicker.h,
            textAlign: align,
            fontFamily: brand.fonts.label,
            fontSize: boxes.kickerSize,
            lineHeight: LINE_HEIGHT.label,
            fontWeight: 600,
            letterSpacing: `${MANIFESTO_KICKER_TRACKING}em`,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            color: brand.palette.accent,
            opacity: kickerIn,
            translate: `0 ${(1 - kickerIn) * 8}px`,
          }}
        >
          {beat.kicker}
        </div>
      ) : null}
      <RevealWords
        text={beat.text}
        from={slot.from + (beat.kicker ? 6 : 0)}
        size={boxes.size}
        box={boxes.text}
        align={align}
        fontFamily={brand.fonts.display}
        weight={500}
        color={brand.palette.text}
        emphasis={brand.palette.accentSoft}
        uppercase={brand.uppercaseDisplay}
      />
    </div>
  );
}

/** Frames que tarda cada palabra en subir. */
const REVEAL_FRAMES = 18;

/** Divide una frase en palabras, marcando las que van entre asteriscos. */
export function emphasisWords(text: string) {
  let open = false;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      let word = token;
      if (word.startsWith("*")) {
        open = true;
        word = word.slice(1);
      }
      const emphasized = open;
      if (/\*[^\p{L}\p{N}]*$/u.test(word)) {
        open = false;
        word = word.replace(/\*(?=[^\p{L}\p{N}]*$)/u, "");
      }
      return { word, emphasized };
    });
}

/**
 * Frase que se revela palabra por palabra subiendo desde una máscara. Las
 * palabras quedan separadas por espacios reales, así el corte de línea es el
 * mismo que mide `fitsLines` en la geometría.
 */
export function RevealWords({
  text,
  from,
  size,
  box,
  align = "left",
  fontFamily,
  weight = 500,
  color,
  emphasis,
  uppercase = false,
  stagger = 3,
  lineHeight = LINE_HEIGHT.display,
  style,
}: {
  text: string;
  from: number;
  size: number;
  box: Box;
  align?: "left" | "center";
  fontFamily: string;
  weight?: number;
  color: string;
  emphasis?: string;
  uppercase?: boolean;
  stagger?: number;
  lineHeight?: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  // "\n" fija el corte de línea; el orden de revelado sigue de un tramo al otro.
  const segments = text.split("\n").map(emphasisWords);
  const offsets = segments.map((_, index) => segments.slice(0, index).reduce((total, words) => total + words.length, 0));
  const count = offsets[offsets.length - 1] + segments[segments.length - 1].length;
  // La frase entera se asienta en ~30 frames aunque sea larga.
  const gap = Math.min(stagger, Math.max(1, (30 - REVEAL_FRAMES) / Math.max(1, count - 1)));
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        textAlign: align,
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: uppercase ? "0.01em" : "-0.015em",
        textTransform: uppercase ? "uppercase" : "none",
        color,
        ...style,
      }}
    >
      {segments.map((words, segment) => (
        <Fragment key={segment}>
          {segment > 0 ? <br /> : null}
          {words.map(({ word, emphasized }, position) => {
            const order = offsets[segment] + position;
            const reveal = interpolate(frame, [from + order * gap, from + order * gap + REVEAL_FRAMES], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
            return (
              <span key={`${word}-${order}`}>
                {/* Máscara con aire arriba y abajo (tildes y descendentes), compensada con márgenes negativos para no alterar el interlineado. */}
                <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", padding: "0.16em 0.04em 0.14em", margin: "-0.16em -0.04em -0.14em" }}>
                  <span style={{ display: "inline-block", translate: `0 ${(1 - reveal) * 110}%`, opacity: 0.2 + reveal * 0.8, color: emphasized && emphasis ? emphasis : undefined }}>{word}</span>
                </span>
                {position < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
