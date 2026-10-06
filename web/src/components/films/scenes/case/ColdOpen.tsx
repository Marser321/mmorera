import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { TRACK_LABELS, type CaseFilmScript } from "@/data/films/caseFilms";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { CLAMP, EASE_IN_OUT, EASE_OUT, FILM_COLORS, FILM_FONTS, ink, progress } from "../theme";

/**
 * Apertura en frío: oscuridad, una línea de luz y el nombre del cliente
 * letra por letra sobre el sitio real, apenas visible detrás.
 */
export function ColdOpen({ script, language, portrait, width, height, duration }: { script: CaseFilmScript; language: FilmLanguage; portrait: boolean; width: number; height: number; duration: number }) {
  const frame = useCurrentFrame();
  const title = script.title[language];
  const titleSize = Math.min(portrait ? 132 : 150, (width * (portrait ? 1.5 : 1.45)) / Math.max(8, title.length));
  const exit = progress(frame, duration - 26, duration, EASE_IN_OUT);
  const line = progress(frame, 6, 44, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, translate: `0 ${-24 * exit}px` }}>
      {(portrait ? script.shots.mobile[0] : script.reel?.poster) ? (
        <Img
          src={(portrait ? script.shots.mobile[0] : script.reel?.poster) ?? ""}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            opacity: interpolate(frame, [10, 70], [0, portrait ? 0.07 : 0.1], CLAMP),
            scale: `${interpolate(frame, [0, duration], [1.14, 1.05], CLAMP)}`,
          }}
        />
      ) : null}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM_COLORS.card} 0%, transparent 35%, transparent 60%, ${FILM_COLORS.card} 100%)` }} />

      <div
        style={{
          position: "absolute",
          left: width * 0.5,
          top: height * 0.56,
          width: width * 0.36,
          height: 2,
          translate: "-50% 0",
          background: FILM_COLORS.signal,
          transformOrigin: "50% 50%",
          scale: `${line} 1`,
          opacity: 0.85,
        }}
      />

      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.56 - titleSize * 1.12, textAlign: "center", fontFamily: FILM_FONTS.display, fontSize: titleSize, fontWeight: 500, letterSpacing: "-0.065em", lineHeight: 1, whiteSpace: "nowrap", color: FILM_COLORS.fg }}>
        {title.split("").map((char, index) => (
          <span key={`${char}-${index}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.1em" }}>
            <span style={{ display: "inline-block", whiteSpace: "pre", translate: `0 ${interpolate(frame, [26 + index * 2, 26 + index * 2 + 32], [110, 0], { ...CLAMP, easing: EASE_OUT })}%` }}>{char}</span>
          </span>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.56 + (portrait ? 36 : 28), display: "flex", justifyContent: "center", gap: portrait ? 26 : 20, fontFamily: FILM_FONTS.mono, fontSize: portrait ? 22 : 15, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        {script.tracks.map((track, index) => (
          <span key={track} style={{ color: FILM_COLORS.signal, opacity: progress(frame, 70 + index * 10, 92 + index * 10) }}>{TRACK_LABELS[track][language]}</span>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: height * 0.56 + (portrait ? 96 : 72),
          width: portrait ? width * 0.84 : width * 0.56,
          translate: "-50% 0",
          textAlign: "center",
          fontFamily: FILM_FONTS.body,
          fontSize: portrait ? 34 : 24,
          lineHeight: 1.35,
          color: ink(0.66),
          opacity: progress(frame, 84, 118),
        }}
      >
        {script.summary[language]}
      </div>
    </AbsoluteFill>
  );
}
