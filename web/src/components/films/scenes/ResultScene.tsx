import { Img, interpolate, useCurrentFrame } from "remotion";
import type { FilmLanguage, UseCaseFilmScript } from "@/data/films/filmTypes";
import { Headline } from "./primitives";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "./theme";

/** Capítulo 4: titular de resultado, hechos y —en casos reales— la captura en vivo. */
export function ResultScene({ script, language, portrait }: { script: UseCaseFilmScript; language: FilmLanguage; portrait: boolean }) {
  const frame = useCurrentFrame();
  const { result } = script;
  const real = script.kind === "real" && Boolean(result.screenshot);

  const headlineWidth = portrait ? 936 : real ? 820 : 1180;
  const factsTop = portrait ? 560 : 520;
  const factWidth = portrait ? 936 : real ? 250 : 360;
  const factHeight = portrait ? 150 : 170;

  return (
    <>
      <Headline text={result.headline[language]} from={6} size={portrait ? 84 : 66} style={{ left: portrait ? 72 : 80, top: portrait ? 170 : 150, width: headlineWidth }} />

      {result.facts.map((fact, index) => {
        const enter = progress(frame, 40 + index * 9, 62 + index * 9);
        return (
          <div
            key={fact.label.es}
            style={{
              position: "absolute",
              left: portrait ? 72 : 80 + index * (factWidth + 24),
              top: portrait ? factsTop + index * (factHeight + 20) : factsTop,
              width: factWidth,
              height: factHeight,
              boxSizing: "border-box",
              padding: portrait ? "24px 30px" : "22px 24px",
              borderRadius: 24,
              border: `1px solid ${ink(0.12)}`,
              background: ink(0.03),
              display: "flex",
              flexDirection: portrait ? "row" : "column",
              alignItems: portrait ? "center" : "flex-start",
              justifyContent: portrait ? "flex-start" : "space-between",
              gap: portrait ? 28 : 0,
              opacity: enter,
              translate: `0px ${(1 - enter) * 24}px`,
            }}
          >
            <div style={{ fontFamily: FILM_FONTS.body, fontSize: portrait ? 68 : 52, fontWeight: 500, letterSpacing: "-0.05em", color: FILM_COLORS.signal, whiteSpace: "nowrap" }}>
              {fact.value[language]}
            </div>
            <div style={{ fontFamily: FILM_FONTS.body, fontSize: portrait ? 30 : 19, lineHeight: 1.25, color: ink(0.62) }}>{fact.label[language]}</div>
          </div>
        );
      })}

      {real && !portrait && result.screenshot ? <LiveScreenshot src={result.screenshot} language={language} /> : null}
    </>
  );
}

/** Teléfono con la captura real del caso, que se desplaza como si alguien la recorriera. */
function LiveScreenshot({ src, language }: { src: string; language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const enter = progress(frame, 18, 48);
  const width = 330;
  const height = width * 2.05;
  const scroll = interpolate(frame, [60, 170], [0, 18], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <div
      style={{
        position: "absolute",
        left: 1170,
        top: 120,
        width,
        height,
        borderRadius: 44,
        padding: 10,
        boxSizing: "border-box",
        background: ink(0.9),
        boxShadow: `0 40px 90px ${ink(0.18)}, 0 0 0 1px ${ink(0.2)}`,
        opacity: enter,
        translate: `0px ${(1 - enter) * 60}px`,
        rotate: `${(1 - enter) * 4}deg`,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: FILM_COLORS.bg }}>
        <Img src={src} style={{ width: "100%", height: "auto", translate: `0px ${-scroll}%` }} />
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: -46, translate: "-50% 0px", whiteSpace: "nowrap", fontFamily: FILM_FONTS.mono, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: FILM_COLORS.signal }}>
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 9, marginRight: 10, background: FILM_COLORS.signal, boxShadow: `0 0 12px ${tint(FILM_COLORS.signal, 80)}` }} />
        {language === "es" ? "Sitio en producción" : "Live in production"}
      </div>
    </div>
  );
}
