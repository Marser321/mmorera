import { Img, useCurrentFrame } from "remotion";
import type { FilmLanguage, UseCaseFilmScript } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { PHONE_BEZEL, type UseCaseLayout } from "../compositions/useCaseLayout";
import { Headline } from "./primitives";
import { EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "./theme";

/** Capítulo 4: titular de resultado, hechos y —en casos reales— la captura en vivo. */
export function ResultScene({ script, language, layout }: { script: UseCaseFilmScript; language: FilmLanguage; layout: UseCaseLayout["result"] }) {
  const frame = useCurrentFrame();
  const { result } = script;
  const { headline, facts, row, valueSize, labelSize, phone, caption } = layout;

  return (
    <>
      <Headline text={headline.text} from={6} size={headline.size} style={{ left: headline.box.x, top: headline.box.y, width: headline.box.w }} />

      {result.facts.map((fact, index) => {
        const box = facts[index];
        const enter = progress(frame, 40 + index * 9, 62 + index * 9);
        return (
          <div
            key={fact.label.es}
            style={{
              position: "absolute",
              left: box.x,
              top: box.y,
              width: box.w,
              height: box.h,
              boxSizing: "border-box",
              padding: row ? "24px 30px" : "22px 24px",
              borderRadius: 24,
              border: `1px solid ${ink(0.12)}`,
              background: ink(0.03),
              display: "flex",
              flexDirection: row ? "row" : "column",
              alignItems: row ? "center" : "flex-start",
              justifyContent: row ? "flex-start" : "space-between",
              gap: row ? 28 : 0,
              opacity: enter,
              translate: `0px ${(1 - enter) * 20}px`,
            }}
          >
            <div style={{ fontFamily: FILM_FONTS.body, fontSize: valueSize, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.05em", color: FILM_COLORS.signal, whiteSpace: "nowrap" }}>
              {fact.value[language]}
            </div>
            <div style={{ fontFamily: FILM_FONTS.body, fontSize: labelSize, lineHeight: 1.25, color: ink(0.62) }}>{fact.label[language]}</div>
          </div>
        );
      })}

      {phone && caption && result.screenshot ? <LiveScreenshot src={result.screenshot} language={language} box={phone} caption={caption} /> : null}
    </>
  );
}

/**
 * Teléfono con la captura real del caso, que se desplaza como si alguien la
 * recorriera: baja hasta el pie de la captura y nunca más allá (sin franja
 * vacía). La captura se dibuja a su ancho de pantalla, menor que el nativo.
 */
function LiveScreenshot({ src, language, box, caption }: { src: string; language: FilmLanguage; box: Box; caption: Box }) {
  const frame = useCurrentFrame();
  const enter = progress(frame, 18, 48);
  const scroll = progress(frame, 70, 190, EASE_IN_OUT);
  const innerHeight = box.h - PHONE_BEZEL * 2;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: 44,
          padding: PHONE_BEZEL,
          boxSizing: "border-box",
          background: ink(0.9),
          boxShadow: `0 30px 70px ${ink(0.14)}, 0 0 0 1px ${ink(0.2)}`,
          opacity: enter,
          translate: `0px ${(1 - enter) * 40}px`,
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: FILM_COLORS.bg }}>
          {/* Desplazamiento en px de la pantalla: como máximo (alto de la captura − alto visible). */}
          <Img src={src} style={{ display: "block", width: "100%", height: "auto", translate: `0px min(0px, calc((${innerHeight}px - 100%) * ${scroll}))` }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: caption.x,
          top: caption.y,
          width: caption.w,
          height: caption.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          whiteSpace: "nowrap",
          fontFamily: FILM_FONTS.mono,
          fontSize: 14,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: FILM_COLORS.signal,
          opacity: enter,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 9, background: FILM_COLORS.signal, boxShadow: `0 0 8px ${tint(FILM_COLORS.signal, 70)}` }} />
        {language === "es" ? "Sitio en producción" : "Live in production"}
      </div>
    </>
  );
}
