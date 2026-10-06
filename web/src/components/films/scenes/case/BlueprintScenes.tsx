import { Img, interpolate, useCurrentFrame } from "remotion";
import { CASE_CHAPTER_LABELS, type CaseFilmScript } from "@/data/films/caseFilms";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { CLAMP, EASE_IN_OUT, EASE_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "../theme";
import { BrowserFrame, ChapterKicker, PhoneFrame, SceneFade } from "./shared";

type Layout = { portrait: boolean; width: number; height: number };

/** Posición vertical de cada ítem según cuántas líneas ocupa (las fuentes de marca son más anchas). */
function stackOffsets(texts: string[], size: number, blockWidth: number, gap: number) {
  const charsPerLine = Math.max(10, Math.floor(blockWidth / (size * 0.56)));
  let y = 0;
  return texts.map((text) => {
    const top = y;
    y += Math.ceil(text.length / charsPerLine) * size * 1.18 + gap;
    return top;
  });
}

function deviceLayout({ portrait }: Layout) {
  return portrait
    ? { browser: { x: 72, y: 780, w: 700, h: 440 }, phone: { x: 812, y: 720, w: 196 } }
    : { browser: { x: 800, y: 250, w: 600, h: 380 }, phone: { x: 1330, y: 300, w: 176 } };
}

/** Trazo que se dibuja (pathLength normalizado). */
function Stroke({ d, draw, color }: { d: string; draw: number; color: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} strokeLinecap="round" vectorEffect="non-scaling-stroke" />;
}

/** Bloques de un wireframe genérico: barra, héroe y tarjetas. */
function wireframe(w: number, h: number) {
  const pad = w * 0.07;
  const card = (w - pad * 4) / 3;
  return [
    `M ${pad} ${h * 0.1} H ${w - pad}`,
    `M ${pad} ${h * 0.24} H ${w * 0.62} M ${pad} ${h * 0.33} H ${w * 0.46}`,
    `M ${pad} ${h * 0.44} h ${w * 0.22} v ${h * 0.08} h ${-w * 0.22} Z`,
    ...[0, 1, 2].map((i) => `M ${pad + i * (card + pad)} ${h * 0.62} h ${card} v ${h * 0.28} h ${-card} Z`),
  ];
}

/**
 * Capa de dispositivos que atraviesa Restricciones y Decisiones: primero un
 * plano que se dibuja (con las restricciones marcadas), después ese plano se
 * llena con las capturas reales del sitio. Del boceto al producto.
 */
export function BlueprintDevices({ script, layout, decisionsAt, duration }: { script: CaseFilmScript; layout: Layout; decisionsAt: number; duration: number }) {
  const frame = useCurrentFrame();
  const { browser, phone } = deviceLayout(layout);
  const phoneHeight = phone.w * 2.08;
  const draw = (index: number) => progress(frame, 16 + index * 9, 70 + index * 9, EASE_IN_OUT);
  const desktopReveal = progress(frame, decisionsAt + 40, decisionsAt + 120, EASE_IN_OUT);
  const mobileReveal = progress(frame, decisionsAt + 100, decisionsAt + 170, EASE_IN_OUT);
  const wireFade = 1 - progress(frame, decisionsAt + 150, decisionsAt + 190);
  const settle = progress(frame, duration - 70, duration, EASE_IN_OUT);
  const strokeColor = tint(FILM_COLORS.accent, 75);
  const markers = [
    { x: phone.x + phone.w * 0.5, y: phone.y + phoneHeight * 0.32 },
    { x: browser.x + browser.w * 0.34, y: browser.y + browser.h * 0.42 },
  ];

  return (
    <SceneFade duration={duration} style={{ scale: `${1 + settle * 0.03}`, transformOrigin: "70% 50%" }}>
      <BrowserFrame width={browser.w} height={browser.h} hostname={script.hostname} style={{ left: browser.x, top: browser.y, opacity: progress(frame, 6, 30), boxShadow: "none", background: "transparent" }}>
        {script.shots.desktop[0] ? (
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - desktopReveal) * 100}% 0)` }}>
            <Img src={script.shots.desktop[0]} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          </div>
        ) : null}
        <svg width="100%" height="100%" viewBox={`0 0 ${browser.w} ${browser.h * 0.93}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: wireFade }}>
          {wireframe(browser.w, browser.h * 0.93).map((d, index) => <Stroke key={d} d={d} draw={draw(index)} color={strokeColor} />)}
        </svg>
        <ScanLine reveal={desktopReveal} />
      </BrowserFrame>

      <PhoneFrame width={phone.w} style={{ left: phone.x, top: phone.y, opacity: progress(frame, 20, 44), background: ink(0.18 + 0.7 * mobileReveal) }}>
        {script.shots.mobile[0] ? (
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - mobileReveal) * 100}% 0)` }}>
            <Img src={script.shots.mobile[0]} style={{ width: "100%", height: "auto" }} />
          </div>
        ) : null}
        <svg width="100%" height="100%" viewBox={`0 0 ${phone.w} ${phoneHeight}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: wireFade }}>
          {wireframe(phone.w, phoneHeight).slice(0, 4).map((d, index) => <Stroke key={d} d={d} draw={draw(index + 2)} color={strokeColor} />)}
        </svg>
        <ScanLine reveal={mobileReveal} />
      </PhoneFrame>

      {/* Marcadores de restricción sobre el plano */}
      {script.constraints.slice(0, 2).map((constraint, index) => {
        const show = progress(frame, 40 + index * 45, 60 + index * 45) * (1 - progress(frame, decisionsAt, decisionsAt + 30));
        const pulse = 1 + 0.25 * Math.abs(Math.sin((frame + index * 20) / 16));
        const size = layout.portrait ? 44 : 32;
        return (
          <div key={constraint.es} style={{ position: "absolute", left: markers[index].x, top: markers[index].y, translate: "-50% -50%", opacity: show }}>
            <div style={{ position: "absolute", inset: -size * 0.35, borderRadius: 99, border: `1px solid ${tint(FILM_COLORS.accent, 60)}`, scale: `${pulse}` }} />
            <div style={{ width: size, height: size, borderRadius: 99, background: FILM_COLORS.accent, color: FILM_COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FILM_FONTS.mono, fontSize: size * 0.5, fontWeight: 700 }}>
              {index + 1}
            </div>
          </div>
        );
      })}
    </SceneFade>
  );
}

function ScanLine({ reveal }: { reveal: number }) {
  if (reveal <= 0 || reveal >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: `${reveal * 100}%`, height: 2, background: FILM_COLORS.signal, boxShadow: `0 0 18px ${tint(FILM_COLORS.signal, 80)}` }} />
  );
}

/** 02 · Restricciones: tarjetas numeradas que se corresponden con los marcadores. */
export function ConstraintsText({ script, language, layout, duration }: { script: CaseFilmScript; language: FilmLanguage; layout: Layout; duration: number }) {
  const frame = useCurrentFrame();
  const { portrait, width, height } = layout;
  const left = portrait ? 72 : 120;
  const top = portrait ? height * 0.22 : height * 0.3;
  const size = portrait ? 40 : 30;
  const blockWidth = portrait ? width - left * 2 : 600;
  const offsets = stackOffsets(script.constraints.map((item) => item[language]), size, blockWidth - size * 2, size * 1.4);
  return (
    <SceneFade duration={duration}>
      <ChapterKicker index={2} label={CASE_CHAPTER_LABELS.constraints[language]} portrait={portrait} style={{ left, top: top - (portrait ? 90 : 76) }} />
      {script.constraints.map((constraint, index) => {
        const enter = progress(frame, 34 + index * 45, 70 + index * 45);
        return (
          <div key={constraint.es} style={{ position: "absolute", left, top: top + offsets[index], width: blockWidth, display: "flex", gap: size * 0.7, alignItems: "flex-start", opacity: enter, translate: `${(1 - enter) * -24}px 0` }}>
            <span style={{ flexShrink: 0, width: size * 1.1, height: size * 1.1, marginTop: size * 0.05, borderRadius: 99, border: `1px solid ${tint(FILM_COLORS.accent, 60)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FILM_FONTS.mono, fontSize: size * 0.5, color: FILM_COLORS.accent }}>
              {index + 1}
            </span>
            <span style={{ fontFamily: FILM_FONTS.body, fontSize: size, lineHeight: 1.2, letterSpacing: "-0.03em", color: FILM_COLORS.fg }}>{constraint[language]}</span>
          </div>
        );
      })}
    </SceneFade>
  );
}

/** 03 · Decisiones: cada decisión entra y la anterior cede foco. */
export function DecisionsText({ script, language, layout, duration }: { script: CaseFilmScript; language: FilmLanguage; layout: Layout; duration: number }) {
  const frame = useCurrentFrame();
  const { portrait, width, height } = layout;
  const left = portrait ? 72 : 120;
  const top = portrait ? height * 0.22 : height * 0.3;
  const size = portrait ? 44 : 34;
  const step = 80;
  const blockWidth = portrait ? width - left * 2 : 620;
  const offsets = stackOffsets(script.decisions.map((item) => item[language]), size, blockWidth, size * 2.3);
  return (
    <SceneFade duration={duration}>
      <ChapterKicker index={3} label={CASE_CHAPTER_LABELS.decisions[language]} portrait={portrait} style={{ left, top: top - (portrait ? 90 : 76) }} />
      {script.decisions.map((decision, index) => {
        const enter = progress(frame, 30 + index * step, 70 + index * step);
        const next = index < script.decisions.length - 1 ? progress(frame, 30 + (index + 1) * step, 60 + (index + 1) * step) : 0;
        return (
          <div key={decision.es} style={{ position: "absolute", left, top: top + offsets[index], width: blockWidth, opacity: enter * (1 - next * 0.55), translate: `0 ${(1 - enter) * 22}px` }}>
            <div style={{ fontFamily: FILM_FONTS.mono, fontSize: size * 0.45, letterSpacing: "0.16em", color: FILM_COLORS.signal }}>{String(index + 1).padStart(2, "0")}</div>
            <div style={{ marginTop: size * 0.25, fontFamily: FILM_FONTS.body, fontSize: size, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.035em", color: FILM_COLORS.fg }}>
              {decision[language]}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", display: portrait ? "none" : "block", left, bottom: height * 0.14, fontFamily: FILM_FONTS.mono, fontSize: portrait ? 20 : 14, letterSpacing: "0.16em", textTransform: "uppercase", color: ink(0.45), opacity: progress(frame, 140, 170) }}>
        {language === "es" ? "Del plano al sitio real" : "From blueprint to the real site"}
        <span style={{ display: "inline-block", marginLeft: 12, width: interpolate(frame, [150, 200], [0, portrait ? 120 : 90], { ...CLAMP, easing: EASE_OUT }), height: 1, verticalAlign: "middle", background: ink(0.45) }} />
      </div>
    </SceneFade>
  );
}
