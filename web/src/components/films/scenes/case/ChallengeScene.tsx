import { interpolate, useCurrentFrame } from "remotion";
import { CASE_CHAPTER_LABELS, type CaseFilmScript } from "@/data/films/caseFilms";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress } from "../theme";
import { ChapterKicker, SceneFade, SlowWords } from "./shared";

/** 01 · El reto: una sola frase, enorme, que se lee a su ritmo. */
export function ChallengeScene({ script, language, portrait, width, height, duration }: { script: CaseFilmScript; language: FilmLanguage; portrait: boolean; width: number; height: number; duration: number }) {
  const frame = useCurrentFrame();
  const text = script.challenge[language];
  const words = text.split(" ").length;
  const size = portrait ? (words > 12 ? 74 : 86) : words > 12 ? 66 : 78;
  const left = portrait ? 72 : 120;
  const top = portrait ? height * 0.3 : height * 0.3;
  const barAt = 24 + words * 4 + 30;

  return (
    <SceneFade duration={duration}>
      {/* Numeral de fondo que deriva despacio */}
      <div
        style={{
          position: "absolute",
          right: portrait ? -40 : 40,
          bottom: portrait ? 60 : -60,
          fontFamily: FILM_FONTS.body,
          fontSize: portrait ? 560 : 520,
          fontWeight: 500,
          letterSpacing: "-0.08em",
          lineHeight: 1,
          color: ink(0.035),
          translate: `${interpolate(frame, [0, duration], [0, -40], CLAMP)}px 0`,
        }}
      >
        01
      </div>
      <ChapterKicker index={1} label={CASE_CHAPTER_LABELS.challenge[language]} portrait={portrait} style={{ left, top: top - (portrait ? 90 : 76) }} />
      <SlowWords text={text} from={24} size={size} style={{ left, top, width: width - left * 2 }} />
      <div
        style={{
          position: "absolute",
          left,
          top: height * 0.8,
          width: portrait ? 320 : 280,
          height: 3,
          background: FILM_COLORS.signal,
          transformOrigin: "left",
          scale: `${progress(frame, barAt, barAt + 40, EASE_IN_OUT)} 1`,
        }}
      />
    </SceneFade>
  );
}
