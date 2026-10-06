import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "../theme";

/** Entra y sale con calma: fundido de 14 frames al entrar y 20 al salir. */
export function SceneFade({ duration, children, style }: { duration: number; children: ReactNode; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14, duration - 20, duration], [0, 1, 1, 0], { ...CLAMP, easing: EASE_IN_OUT });
  return <AbsoluteFill style={{ opacity, ...style }}>{children}</AbsoluteFill>;
}

/** Rótulo de capítulo: número + nombre, con una línea que se dibuja. */
export function ChapterKicker({ index, label, portrait, from = 8, style }: { index: number; label: string; portrait: boolean; from?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const enter = progress(frame, from, from + 24);
  const size = portrait ? 22 : 15;
  return (
    <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: size, fontFamily: FILM_FONTS.mono, fontSize: size, letterSpacing: "0.18em", textTransform: "uppercase", color: FILM_COLORS.signal, opacity: enter, ...style }}>
      <span>{String(index).padStart(2, "0")}</span>
      <span style={{ width: size * 3, height: 1, background: FILM_COLORS.signal, transformOrigin: "left", scale: `${enter} 1` }} />
      <span style={{ color: ink(0.7) }}>{label}</span>
    </div>
  );
}

/** Texto revelado palabra por palabra, lento (la cadencia de un tráiler). */
export function SlowWords({ text, from, size, style, stagger = 4, duration = 30, color = FILM_COLORS.fg, weight = 500 }: { text: string; from: number; size: number; style?: CSSProperties; stagger?: number; duration?: number; color?: string; weight?: number }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", fontFamily: FILM_FONTS.body, fontSize: size, fontWeight: weight, lineHeight: 1.04, letterSpacing: "-0.045em", color, ...style }}>
      {text.split(" ").map((word, index) => {
        const reveal = interpolate(frame, [from + index * stagger, from + index * stagger + duration], [0, 1], { ...CLAMP, easing: EASE_OUT });
        return (
          <span key={`${word}-${index}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.1em", marginRight: "0.24em" }}>
            <span style={{ display: "inline-block", translate: `0 ${(1 - reveal) * 105}%`, opacity: 0.2 + reveal * 0.8 }}>{word}</span>
          </span>
        );
      })}
    </div>
  );
}

/** Barras de cine: el film abre como una sala que apaga la luz. */
export function Letterbox({ portrait }: { portrait: boolean }) {
  const frame = useCurrentFrame();
  const rest = portrait ? 0.045 : 0.07;
  const bar = `${interpolate(frame, [0, 40], [0.5, rest], { ...CLAMP, easing: EASE_IN_OUT }) * 100}%`;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bar, background: FILM_COLORS.bg, zIndex: 20 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: bar, background: FILM_COLORS.bg, zIndex: 20 }} />
    </>
  );
}

/** Marco de navegador con la URL real y el punto "en vivo". */
export function BrowserFrame({ width, height, hostname, children, style }: { width: number; height: number; hostname: string | null; children: ReactNode; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const chrome = Math.max(30, height * 0.065);
  const pulse = 0.45 + 0.55 * Math.abs(Math.sin(frame / 14));
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: chrome * 0.6,
        overflow: "hidden",
        background: FILM_COLORS.card,
        border: `1px solid ${ink(0.14)}`,
        boxShadow: `0 60px 140px ${ink(0.12)}, 0 0 0 1px ${ink(0.04)}`,
        ...style,
      }}
    >
      <div style={{ height: chrome, display: "flex", alignItems: "center", gap: chrome * 0.25, padding: `0 ${chrome * 0.5}px`, borderBottom: `1px solid ${ink(0.1)}`, background: ink(0.03) }}>
        {[0, 1, 2].map((dot) => <span key={dot} style={{ width: chrome * 0.24, height: chrome * 0.24, borderRadius: 99, background: ink(0.16) }} />)}
        <div style={{ flex: 1, margin: `0 ${chrome * 0.4}px`, height: chrome * 0.56, borderRadius: 99, background: ink(0.06), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FILM_FONTS.mono, fontSize: chrome * 0.34, color: ink(0.6), whiteSpace: "nowrap", overflow: "hidden" }}>
          {hostname ?? ""}
        </div>
        {hostname ? (
          <span style={{ display: "flex", alignItems: "center", gap: chrome * 0.18, fontFamily: FILM_FONTS.mono, fontSize: chrome * 0.3, letterSpacing: "0.12em", color: FILM_COLORS.signal }}>
            <span style={{ width: chrome * 0.2, height: chrome * 0.2, borderRadius: 99, background: FILM_COLORS.signal, opacity: pulse, boxShadow: `0 0 10px ${tint(FILM_COLORS.signal, 70)}` }} />
            LIVE
          </span>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: chrome, bottom: 0, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

/** Teléfono: marco con notch sutil; el contenido va recortado adentro. */
export function PhoneFrame({ width, children, style }: { width: number; children: ReactNode; style?: CSSProperties }) {
  const height = width * 2.08;
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: width * 0.15,
        padding: width * 0.035,
        boxSizing: "border-box",
        background: ink(0.88),
        boxShadow: `0 50px 110px ${ink(0.2)}, 0 0 0 1px ${ink(0.22)}`,
        ...style,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: width * 0.12, overflow: "hidden", background: FILM_COLORS.bg }}>{children}</div>
    </div>
  );
}

/** Rayo de luz que cruza el cuadro (sin filtros: solo un gradiente que viaja). */
export function LightSweep({ from, duration = 40 }: { from: number; duration?: number }) {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [from, from + duration], [-0.6, 1.4], CLAMP);
  const visible = frame >= from && frame <= from + duration;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(100deg, transparent 40%, ${ink(0.06)} 50%, transparent 60%)`,
        translate: `${travel * 100}% 0`,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        zIndex: 15,
      }}
    />
  );
}

