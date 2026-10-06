import { Img, interpolate, useCurrentFrame } from "remotion";
import type { FilmAsset } from "@/data/films/flagships/types";
import type { Box } from "@/lib/filmLayout";
import { CLAMP, EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { MECHANISM_KICKER_TRACKING, mechanismTriptychLayout, type MechanismCaption, type MechanismFormula } from "./layout/mechanismTriptych";
import { LINE_HEIGHT } from "./layout/mediaShared";
import { RevealWords } from "./ManifestoBeats";

export type MechanismTriptychProps = {
  box: Box;
  /** Tres fotos fijas con su medida nativa. */
  stills: FilmAsset[];
  /** Leyenda de cada foto (el número lo pone la escena). */
  captions: MechanismCaption[];
  /** Banda opcional arriba: etiqueta + fórmula o principio (p. ej. "Ley de Henry"). */
  formula?: MechanismFormula;
  duration: number;
  /** Frames entre una foto y la siguiente (por defecto se reparte en la escena). */
  stagger?: number;
};

/**
 * Tríptico del mecanismo: tres imágenes que se revelan en orden, cada una con
 * su leyenda numerada en una banda propia (debajo en 16:9, al costado en 4:5),
 * nunca encima de la imagen. Los números se unen con una línea que corre por
 * su propio carril y pasa por detrás de las fichas.
 */
export function MechanismTriptych({ box, stills, captions, formula, duration, stagger }: MechanismTriptychProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = mechanismTriptychLayout(box, { stills, captions, formula }, portrait ? "portrait" : "landscape");
  const n = layout.panels.length;
  const start = formula ? 30 : 8;
  const step = stagger ?? Math.max(30, Math.min(70, Math.floor((duration - start - 80) / Math.max(1, n))));
  const at = (index: number) => start + index * step;
  const leave = progress(frame, duration - 18, duration, EASE_IN_OUT);
  const current = layout.panels.reduce((last, _, index) => (frame >= at(index) ? index : last), -1);
  const radius = brand.radius * 0.6;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      {formula && layout.formula ? (
        <>
          {formula.kicker && layout.formula.kicker ? (
            <div
              style={{
                position: "absolute",
                left: layout.formula.kicker.x,
                top: layout.formula.kicker.y,
                width: layout.formula.kicker.w,
                height: layout.formula.kicker.h,
                fontFamily: brand.fonts.label,
                fontSize: layout.formula.kickerSize,
                lineHeight: LINE_HEIGHT.label,
                fontWeight: 600,
                letterSpacing: `${MECHANISM_KICKER_TRACKING}em`,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: brand.palette.accent,
                opacity: progress(frame, 0, 16),
              }}
            >
              {formula.kicker}
            </div>
          ) : null}
          <RevealWords text={formula.text} from={6} size={layout.formula.size} box={layout.formula.text} fontFamily={brand.fonts.display} weight={500} color={brand.palette.text} emphasis={brand.palette.accentSoft} uppercase={brand.uppercaseDisplay} />
        </>
      ) : null}

      {/* Carril de las líneas: van primero (debajo) y nacen/terminan fuera de las fichas. */}
      {layout.connectors.map((line, index) => {
        const draw = progress(frame, at(index + 1) - 8, at(index + 1) + 16, EASE_IN_OUT);
        // El carril aparece con la ficha de la que sale (no antes).
        const track = progress(frame, at(index) + 12, at(index) + 26);
        const horizontal = line.w >= line.h;
        return (
          <div key={`line-${index}`} style={{ position: "absolute", left: line.x, top: line.y, width: line.w, height: line.h, background: brand.palette.line, opacity: track }}>
            <div style={{ width: "100%", height: "100%", background: alpha(brand.palette.accent, 70), transformOrigin: horizontal ? "left center" : "center top", scale: horizontal ? `${draw} 1` : `1 ${draw}` }} />
          </div>
        );
      })}

      {layout.panels.map((panel, index) => {
        const still = stills[index];
        const caption = captions[index];
        if (!still || !caption) return null;
        const t = at(index);
        const wipe = progress(frame, t, t + 32, EASE_IN_OUT);
        // Deriva lenta tras el revelado; la foto se dibuja muy por debajo de su tamaño nativo.
        const drift = interpolate(frame, [t, duration], [1.06, 1], { ...CLAMP, easing: EASE_IN_OUT });
        const chipIn = progress(frame, t + 12, t + 26);
        const active = index === current;
        const bodyIn = progress(frame, t + 28, t + 44);
        const number = String(index + 1).padStart(2, "0");
        return (
          <div key={still.src}>
            <div
              style={{
                position: "absolute",
                left: panel.image.x,
                top: panel.image.y,
                width: panel.image.w,
                height: panel.image.h,
                overflow: "hidden",
                borderRadius: radius,
                background: brand.palette.surface,
                clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0 round ${radius}px)`,
                boxShadow: `0 30px 80px ${alpha("#000000", 45)}`,
              }}
            >
              <Img src={still.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", objectFit: "cover", scale: `${drift}` }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: radius, background: `radial-gradient(130% 110% at 50% 45%, transparent 55%, ${alpha(brand.palette.bg, 55)} 100%)`, boxShadow: `inset 0 0 0 1px ${alpha(brand.palette.accent, active ? 38 : 16)}` }} />
            </div>

            <div
              style={{
                position: "absolute",
                left: panel.chip.x,
                top: panel.chip.y,
                width: panel.chip.w,
                height: panel.chip.h,
                boxSizing: "border-box",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Ficha opaca: la línea pasa por detrás.
                background: active ? brand.palette.accent : brand.palette.bg,
                border: `1px solid ${active ? brand.palette.accent : alpha(brand.palette.accent, 55)}`,
                color: active ? brand.palette.onAccent : brand.palette.accentSoft,
                fontFamily: brand.fonts.label,
                fontSize: layout.sizes.chip * 0.36,
                fontWeight: 700,
                letterSpacing: "0.04em",
                opacity: chipIn,
                scale: `${0.85 + chipIn * 0.15}`,
              }}
            >
              {number}
            </div>

            <RevealWords text={caption.title} from={t + 18} size={layout.sizes.title} box={panel.title} fontFamily={brand.fonts.display} weight={600} color={brand.palette.text} emphasis={brand.palette.accentSoft} uppercase={brand.uppercaseDisplay} stagger={2} />
            {caption.body && panel.body ? (
              <div
                style={{
                  position: "absolute",
                  left: panel.body.x,
                  top: panel.body.y,
                  width: panel.body.w,
                  height: panel.body.h,
                  fontFamily: brand.fonts.body,
                  fontSize: layout.sizes.body,
                  lineHeight: LINE_HEIGHT.body,
                  textWrap: "balance",
                  color: brand.palette.muted,
                  opacity: bodyIn,
                }}
              >
                {caption.body}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
