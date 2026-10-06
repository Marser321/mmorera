import { Img, interpolate, useCurrentFrame } from "remotion";
import { CASE_CHAPTER_LABELS, type CaseFilmScript } from "@/data/films/caseFilms";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { LogoMark } from "../LogoMark";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "../theme";
import { ChapterKicker, SceneFade, SlowWords } from "./shared";

type SceneProps = { script: CaseFilmScript; language: FilmLanguage; portrait: boolean; width: number; height: number; duration: number };

/** 05 · La prueba: solo existe si las cuatro métricas reales están en verde. */
export function ProofScene({ script, language, portrait, width, height, duration }: SceneProps) {
  const frame = useCurrentFrame();
  if (!script.metrics) return null;
  const { metrics } = script;
  const scores = [
    { name: language === "es" ? "Rendimiento" : "Performance", value: metrics.performance },
    { name: language === "es" ? "Accesibilidad" : "Accessibility", value: metrics.accessibility },
    { name: language === "es" ? "Buenas prácticas" : "Best practices", value: metrics.bestPractices },
    { name: "SEO", value: metrics.seo },
  ];
  const gauge = portrait ? 300 : 220;
  const columns = portrait ? 2 : 4;
  const gap = portrait ? 80 : 70;
  const gridWidth = columns * gauge + (columns - 1) * gap;
  return (
    <SceneFade duration={duration}>
      <ChapterKicker index={5} label={CASE_CHAPTER_LABELS.proof[language]} portrait={portrait} style={{ left: portrait ? 72 : 120, top: portrait ? 180 : 120 }} />
      <div style={{ position: "absolute", left: (width - gridWidth) / 2, top: portrait ? 330 : 280, width: gridWidth, display: "grid", gridTemplateColumns: `repeat(${columns}, ${gauge}px)`, gap }}>
        {scores.map((score, index) => {
          const fill = progress(frame, 20 + index * 12, 80 + index * 12, EASE_IN_OUT);
          return (
            <div key={score.name} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: gauge, height: gauge }}>
                <svg viewBox="0 0 100 100" width={gauge} height={gauge} style={{ rotate: "-90deg" }}>
                  <circle cx={50} cy={50} r={44} fill="none" stroke={ink(0.1)} strokeWidth={5} />
                  <circle cx={50} cy={50} r={44} fill="none" stroke={FILM_COLORS.signal} strokeWidth={5} strokeLinecap="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 - score.value * fill} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FILM_FONTS.body, fontSize: gauge * 0.32, fontWeight: 500, letterSpacing: "-0.04em", color: FILM_COLORS.signal }}>
                  {Math.round(score.value * fill)}
                </div>
              </div>
              <div style={{ marginTop: 18, fontFamily: FILM_FONTS.mono, fontSize: portrait ? 22 : 15, letterSpacing: "0.12em", textTransform: "uppercase", color: ink(0.6) }}>{score.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: height * 0.14, textAlign: "center", fontFamily: FILM_FONTS.mono, fontSize: portrait ? 20 : 14, letterSpacing: "0.14em", textTransform: "uppercase", color: ink(0.5), opacity: progress(frame, 70, 100) }}>
        Lighthouse mobile · {metrics.measuredAt}
      </div>
    </SceneFade>
  );
}

/** Resultado: la frase final y la URL real escribiéndose en una barra. */
export function OutcomeScene({ script, language, portrait, width, height, duration }: SceneProps) {
  const frame = useCurrentFrame();
  const text = script.result[language];
  const words = text.split(" ").length;
  const host = script.hostname ?? "";
  const typedFrom = 30 + words * 4 + 20;
  const typed = Math.floor(interpolate(frame, [typedFrom, typedFrom + host.length * 2], [0, host.length], CLAMP));
  const left = portrait ? 72 : 160;
  return (
    <SceneFade duration={duration}>
      {script.reel ? (
        <Img src={script.reel.poster} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", opacity: 0.05, scale: `${interpolate(frame, [0, duration], [1.02, 1.1], CLAMP)}` }} />
      ) : null}
      <ChapterKicker index={script.metrics ? 6 : 5} label={CASE_CHAPTER_LABELS.outcome[language]} portrait={portrait} style={{ left, top: height * (portrait ? 0.26 : 0.27) - (portrait ? 90 : 76) }} />
      <SlowWords text={text} from={24} size={portrait ? 80 : 70} style={{ left, top: height * (portrait ? 0.26 : 0.27), width: width - left * 2 }} />
      {host ? (
        <div
          style={{
            position: "absolute",
            left,
            top: height * (portrait ? 0.74 : 0.74),
            display: "flex",
            alignItems: "center",
            gap: portrait ? 16 : 12,
            padding: portrait ? "18px 30px" : "12px 22px",
            borderRadius: 999,
            border: `1px solid ${tint(FILM_COLORS.signal, 45)}`,
            background: tint(FILM_COLORS.signal, 8),
            fontFamily: FILM_FONTS.mono,
            fontSize: portrait ? 28 : 19,
            color: FILM_COLORS.fg,
            opacity: progress(frame, typedFrom - 14, typedFrom),
          }}
        >
          <span style={{ width: portrait ? 12 : 9, height: portrait ? 12 : 9, borderRadius: 99, background: FILM_COLORS.signal }} />
          {host.slice(0, typed)}
          <span style={{ opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0.2, color: FILM_COLORS.signal }}>▍</span>
        </div>
      ) : null}
    </SceneFade>
  );
}

/** Firma: la doble M entra girada (código), se endereza y cierra el anillo. */
export function SignatureScene({ portrait, width, height, duration }: Omit<SceneProps, "script" | "language">) {
  const frame = useCurrentFrame();
  const size = portrait ? 320 : 230;
  const turn = progress(frame, 22, 62, EASE_IN_OUT);
  const signalShare = Math.round(100 * (1 - turn));
  return (
    <SceneFade duration={duration + 20}>
      <div style={{ position: "absolute", left: width / 2, top: height * 0.44, translate: "-50% -50%" }}>
        <LogoMark
          id="case-signature"
          size={size}
          interior={progress(frame, 4, 34, EASE_IN_OUT)}
          rotation={interpolate(turn, [0, 1], [-90, 0])}
          ring={progress(frame, 48, 96, EASE_IN_OUT)}
          interiorColor={`color-mix(in srgb, var(--color-signal) ${signalShare}%, var(--color-foreground))`}
          glow={0.6 * (1 - turn)}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.44 + size * 0.58, textAlign: "center", opacity: progress(frame, 80, 110) }}>
        <div style={{ fontFamily: FILM_FONTS.body, fontSize: portrait ? 56 : 40, fontWeight: 500, letterSpacing: "-0.05em", color: FILM_COLORS.fg }}>Mario Morera</div>
        <div style={{ marginTop: 12, fontFamily: FILM_FONTS.mono, fontSize: portrait ? 20 : 13, letterSpacing: "0.2em", textTransform: "uppercase", color: ink(0.5) }}>Creative Technologist & Systems Builder</div>
      </div>
    </SceneFade>
  );
}
