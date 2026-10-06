import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_OUT, FILM_COLORS, FILM_FONTS, ink, tint } from "./theme";

/** Fondo de pantalla del film: retícula tenue + viñeta, ambas con tinta del tema. */
export function FilmBackdrop({ accent = FILM_COLORS.signal }: { accent?: string }) {
  return (
    <AbsoluteFill style={{ background: FILM_COLORS.card }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${ink(0.045)} 1px, transparent 1px), linear-gradient(90deg, ${ink(0.045)} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: "center center",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 70% 40%, ${tint(accent, 9)}, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 50%, transparent 55%, ${tint(FILM_COLORS.card, 85)} 100%)` }} />
    </AbsoluteFill>
  );
}

/**
 * Titular con revelado por palabra bajo máscara (el mismo gesto que
 * SplitReveal en la web, pero guiado por frame para poder hacer scrub).
 */
export function Headline({
  text,
  from = 0,
  exitAt,
  size,
  style,
  color = FILM_COLORS.fg,
}: {
  text: string;
  from?: number;
  exitAt?: number;
  size: number;
  style?: CSSProperties;
  color?: string;
}) {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 18], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FILM_FONTS.display,
        fontSize: size,
        fontWeight: 500,
        lineHeight: 0.98,
        letterSpacing: "-0.055em",
        color,
        opacity: 1 - exit,
        translate: `0px ${-24 * exit}px`,
        ...style,
      }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em", marginRight: "0.24em", verticalAlign: "top" }}>
          <span
            style={{
              display: "inline-block",
              translate: `0px ${interpolate(frame, [from + index * 3, from + index * 3 + 26], [110, 0], { ...CLAMP, easing: EASE_OUT })}%`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Etiqueta mono en mayúsculas, como los eyebrows del sitio. */
export function Kicker({ children, from = 0, size, color = FILM_COLORS.signal, style }: { children: ReactNode; from?: number; size: number; color?: string; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FILM_FONTS.mono,
        fontSize: size,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        opacity: interpolate(frame, [from, from + 12], [0, 1], CLAMP),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Rótulo de honestidad: caso real verificable o flujo de muestra. */
export function HonestyBadge({ label, real, size, style }: { label: string; real: boolean; size: number; style?: CSSProperties }) {
  const color = real ? FILM_COLORS.signal : FILM_COLORS.accent;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: size * 0.6,
        padding: `${size * 0.55}px ${size * 1.1}px`,
        borderRadius: 999,
        border: `1px solid ${tint(color, 45)}`,
        background: tint(color, 10),
        fontFamily: FILM_FONTS.mono,
        fontSize: size,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      <span style={{ width: size * 0.55, height: size * 0.55, borderRadius: 99, background: color }} />
      {label}
    </div>
  );
}

/** Progreso en cuadro: un segmento por capítulo, el activo se llena. */
export function ChapterTicks({ chapters, size, style }: { chapters: Array<{ from: number; durationInFrames: number }>; size: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", display: "flex", gap: size, ...style }}>
      {chapters.map((chapter) => (
        <div key={chapter.from} style={{ flex: 1, height: Math.max(2, size * 0.25), background: ink(0.12), borderRadius: 9, overflow: "hidden" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: FILM_COLORS.fg,
              transformOrigin: "left center",
              scale: `${interpolate(frame, [chapter.from, chapter.from + chapter.durationInFrames], [0, 1], CLAMP)} 1`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
