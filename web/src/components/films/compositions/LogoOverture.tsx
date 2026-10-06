import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { LogoMark } from "../scenes/LogoMark";
import { CLAMP, EASE_IN_OUT, EASE_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint, useFilmLayout } from "../scenes/theme";

export type LogoOvertureProps = {
  language: FilmLanguage;
};

const NAME = "Mario Morera";
const ROLE = "Creative Technologist & Systems Builder";

/**
 * Entrada del monograma: girada 90°, la doble M se lee como un prompt de
 * código (">"). El cursor parpadea, se escribe la línea de oficio y el
 * glifo gira hasta ser la M; el anillo se cierra y entra el nombre.
 * Todo lento y guiado por frame: diseño y código son la misma letra.
 */
export function LogoOverture({ language }: LogoOvertureProps) {
  const frame = useCurrentFrame();
  const { width, height, portrait } = useFilmLayout();
  const codeLine = language === "es" ? "> diseño + código + sistemas" : "> design + code + systems";

  // Las dos flechas de código entran desde lados opuestos y se unen en el centro.
  const crownShift = interpolate(progress(frame, 12, 80, EASE_IN_OUT), [0, 1], [-1.7, 0]);
  const bodyShift = interpolate(progress(frame, 20, 86, EASE_IN_OUT), [0, 1], [1.7, 0]);
  const flash = interpolate(frame, [84, 88, 116], [0, 1, 0], CLAMP);
  const turn = progress(frame, 150, 218, EASE_IN_OUT);
  const ring = progress(frame, 198, 268, EASE_IN_OUT);
  const lockup = progress(frame, 232, 292, EASE_IN_OUT);
  const nameIn = progress(frame, 252, 300);
  const roleIn = progress(frame, 284, 312);
  const codeOut = 1 - progress(frame, 150, 180);
  const sweep = interpolate(frame, [292, 330], [-0.4, 1.3], CLAMP);

  const logoSize = portrait ? 520 : 400;
  const logoHeight = logoSize * (1885.03 / 2239.69);
  const centered = { x: width / 2, y: height * (portrait ? 0.42 : 0.47) };
  const lockupPoint = portrait ? { x: width / 2, y: height * 0.34 } : { x: width * 0.31, y: height * 0.5 };
  const logoCenter = {
    x: interpolate(lockup, [0, 1], [centered.x, lockupPoint.x]),
    y: interpolate(lockup, [0, 1], [centered.y, lockupPoint.y]),
  };
  const logoScale = interpolate(lockup, [0, 1], [1, portrait ? 0.78 : 0.82]);
  const typed = Math.floor(interpolate(frame, [96, 96 + codeLine.length * 2], [0, codeLine.length], CLAMP));
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  const signalShare = Math.round(100 * (1 - turn));

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FILM_FONTS.body, color: FILM_COLORS.fg }}>
      {/* Halo: verde de terminal que se apaga cuando el glifo se vuelve marca */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 45% at ${(logoCenter.x / width) * 100}% ${(logoCenter.y / height) * 100}%, ${tint(FILM_COLORS.signal, 14 * (1 - turn) + 4)}, transparent 70%)`,
          opacity: progress(frame, 0, 30),
        }}
      />

      <div
        style={{
          position: "absolute",
          left: logoCenter.x,
          top: logoCenter.y,
          width: logoSize,
          height: logoHeight,
          translate: "-50% -50%",
          scale: `${logoScale}`,
        }}
      >
        <LogoMark
          id="overture"
          size={logoSize}
          ring={ring}
          crownShift={crownShift}
          bodyShift={bodyShift}
          rotation={interpolate(turn, [0, 1], [-90, 0])}
          interiorColor={`color-mix(in srgb, var(--color-signal) ${signalShare}%, var(--color-foreground))`}
          glow={0.55 * (1 - turn) + flash * 0.9}
        />
        {/* Destello de unión: una onda que se abre cuando las flechas se tocan */}
        <div
          style={{
            position: "absolute",
            left: "47%",
            top: "51%",
            width: logoSize * 0.7,
            height: logoSize * 0.7,
            translate: "-50% -50%",
            borderRadius: 999,
            border: `2px solid ${tint(FILM_COLORS.signal, 80)}`,
            scale: `${interpolate(frame, [84, 116], [0.4, 1.7], CLAMP)}`,
            opacity: flash,
          }}
        />
        {/* Cursor del prompt */}
        <div
          style={{
            position: "absolute",
            left: logoSize * 0.86,
            top: logoHeight * 0.5,
            width: logoSize * 0.05,
            height: logoSize * 0.13,
            translate: "0 -50%",
            background: FILM_COLORS.signal,
            opacity: (cursorOn ? 1 : 0.15) * progress(frame, 2, 14) * codeOut,
          }}
        />
      </div>

      {/* Línea de oficio, escrita como en una terminal */}
      <div
        style={{
          position: "absolute",
          left: centered.x,
          top: centered.y + logoHeight * 0.62,
          translate: "-50% 0",
          whiteSpace: "pre",
          fontFamily: FILM_FONTS.mono,
          fontSize: portrait ? 40 : 26,
          letterSpacing: "0.04em",
          color: FILM_COLORS.signal,
          opacity: codeOut * progress(frame, 90, 100),
        }}
      >
        {codeLine.slice(0, typed)}
        <span style={{ opacity: typed < codeLine.length || cursorOn ? 1 : 0 }}>▍</span>
      </div>

      {/* Nombre y rol */}
      <div
        style={{
          position: "absolute",
          left: portrait ? width / 2 : width * 0.47,
          top: portrait ? height * 0.6 : height * 0.5,
          translate: portrait ? "-50% 0" : "0 -50%",
          textAlign: portrait ? "center" : "left",
        }}
      >
        <div style={{ fontSize: portrait ? 112 : 104, fontWeight: 500, letterSpacing: "-0.06em", lineHeight: 0.95, whiteSpace: "nowrap" }}>
          {NAME.split("").map((char, index) => (
            <span key={`${char}-${index}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em" }}>
              <span
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  translate: `0 ${interpolate(frame, [252 + index * 2, 252 + index * 2 + 28], [110, 0], { ...CLAMP, easing: EASE_OUT })}%`,
                }}
              >
                {char}
              </span>
            </span>
          ))}
        </div>
        <div style={{ marginTop: portrait ? 28 : 22, fontFamily: FILM_FONTS.mono, fontSize: portrait ? 26 : 18, letterSpacing: "0.18em", textTransform: "uppercase", color: ink(0.6), opacity: roleIn * nameIn }}>
          {ROLE}
        </div>
      </div>

      {/* Barrido de luz final */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, transparent 38%, ${ink(0.07)} 50%, transparent 62%)`,
          translate: `${sweep * 100}% 0`,
          opacity: frame > 290 ? 1 : 0,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
}
