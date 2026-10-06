import { Html5Video, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CASE_CHAPTER_LABELS, type CaseFilmScript } from "@/data/films/caseFilms";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "../theme";
import { BrowserFrame, ChapterKicker, LightSweep, PhoneFrame, SceneFade } from "./shared";

/**
 * 04 · El producto: el reel grabado del sitio en vivo dentro de un navegador
 * en perspectiva, con el teléfono flotando delante. La cámara se acerca
 * despacio; el stack entra al pie como créditos.
 */
export function ProductScene({ script, language, portrait, width, height, duration }: { script: CaseFilmScript; language: FilmLanguage; portrait: boolean; width: number; height: number; duration: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dolly = progress(frame, 0, duration, EASE_IN_OUT);
  const enter = progress(frame, 6, 50, EASE_IN_OUT);
  const browser = portrait ? { w: 936, h: 600, x: 72, y: 250 } : { w: 1000, h: 600, x: 150, y: 140 };
  const phoneWidth = portrait ? 250 : 210;
  const phone = portrait ? { x: width - 72 - phoneWidth, y: 640 } : { x: 1170, y: 300 };
  const float = Math.sin(frame / 28) * (portrait ? 8 : 6);
  const mobileShot = script.shots.mobile[1] ?? script.shots.mobile[0];

  return (
    <SceneFade duration={duration}>
      <ChapterKicker index={4} label={CASE_CHAPTER_LABELS.product[language]} portrait={portrait} style={{ left: portrait ? 72 : 120, top: portrait ? 150 : 84 }} />

      {/* Escenario 3D: el navegador gira apenas mientras la cámara avanza */}
      <div style={{ position: "absolute", inset: 0, perspective: 2200, perspectiveOrigin: "50% 40%" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `rotateX(${interpolate(dolly, [0, 1], [9, 2])}deg) rotateY(${interpolate(dolly, [0, 1], [portrait ? -6 : -12, portrait ? -2 : -4])}deg) scale(${interpolate(dolly, [0, 1], [0.9, 1])})`,
            opacity: enter,
          }}
        >
          <BrowserFrame width={browser.w} height={browser.h} hostname={script.hostname} style={{ left: browser.x, top: browser.y }}>
            {script.reel ? (
              <Html5Video
                src={script.reel.mp4}
                muted
                loop
                pauseWhenBuffering={false}
                acceptableTimeShiftInSeconds={0.6}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            ) : script.shots.desktop[0] ? (
              <Img src={script.shots.desktop[0]} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", scale: `${interpolate(dolly, [0, 1], [1, 1.08])}` }} />
            ) : null}
          </BrowserFrame>
        </div>
      </div>

      {mobileShot ? (
        <PhoneFrame
          width={phoneWidth}
          style={{
            left: phone.x,
            top: phone.y + float,
            opacity: progress(frame, 40, 80),
            translate: `${interpolate(progress(frame, 40, 100, EASE_IN_OUT), [0, 1], [60, 0])}px 0`,
            rotate: `${interpolate(dolly, [0, 1], [4, 1])}deg`,
          }}
        >
          <Img src={mobileShot} style={{ width: "100%", height: "auto", translate: `0 ${-interpolate(frame, [60, duration], [0, 22], CLAMP)}%` }} />
        </PhoneFrame>
      ) : null}

      {/* Stack como créditos */}
      <div style={{ position: "absolute", left: portrait ? 72 : 150, right: portrait ? 72 : 150, bottom: portrait ? height * 0.07 : height * 0.1, display: "flex", flexWrap: "wrap", gap: portrait ? 14 : 10 }}>
        {script.stack.map((item, index) => (
          <span
            key={item}
            style={{
              padding: portrait ? "10px 20px" : "7px 14px",
              borderRadius: 999,
              border: `1px solid ${tint(FILM_COLORS.signal, 40)}`,
              background: tint(FILM_COLORS.signal, 8),
              fontFamily: FILM_FONTS.mono,
              fontSize: portrait ? 22 : 14,
              letterSpacing: "0.08em",
              color: ink(0.82),
              opacity: progress(frame, 90 + index * 12, 116 + index * 12),
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <LightSweep from={Math.round(1.2 * fps)} duration={50} />
    </SceneFade>
  );
}
