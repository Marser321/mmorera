import type { CSSProperties } from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import type { Box } from "@/lib/filmLayout";
import { CLAMP, EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { LINE_HEIGHT } from "./layout/mediaShared";
import { shotStackLayout, type ShotFrameKind } from "./layout/shotStack";

export type StackShot = { src: string; w: number; h: number; label?: string };

export type ShotStackProps = {
  box: Box;
  /** Capturas reales en orden, con su medida nativa y el rótulo del paso. */
  shots: StackShot[];
  duration: number;
  frame?: ShotFrameKind;
  /** Frame en que arranca el primer paso. */
  startAt?: number;
  /** Frames por paso (por defecto se reparte en la escena). */
  stepFrames?: number;
};

/**
 * Pasos de un recorrido con capturas reales: banda de pasos arriba y las
 * pantallas debajo, en tarjetas o teléfonos, a escala ≤ 1:1. El paso activo se
 * ilumina; en 4:5 la fila se desliza para centrarlo (las tarjetas nunca se
 * pisan). Una captura más alta que su marco se recorre en vertical.
 */
export function ShotStack({ box, shots, duration, frame: frameKind = "card", startAt = 26, stepFrames }: ShotStackProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = shotStackLayout(box, { shots, frame: frameKind }, portrait ? "portrait" : "landscape");
  const n = shots.length;
  const step = stepFrames ?? Math.max(45, Math.floor((duration - startAt - 20) / Math.max(1, n)));
  const stepAt = (index: number) => startAt + index * step;
  const active = Math.max(0, Math.min(n - 1, Math.floor((frame - startAt) / step)));
  const started = frame >= startAt;
  const enter = progress(frame, 0, 26, EASE_IN_OUT);
  const leave = progress(frame, duration - 18, duration, EASE_IN_OUT);

  // Desplazamiento de la fila (solo en carrusel): empuja de un paso al siguiente.
  const track = layout.trackOffset.reduce((x, offset, index) => {
    if (index === 0) return offset;
    const move = progress(frame, stepAt(index) - 4, stepAt(index) + 24, EASE_IN_OUT);
    return x + (offset - x) * move;
  }, 0);

  const radius = frameKind === "phone" ? 40 : brand.radius * 0.8;
  const screenRadius = frameKind === "phone" ? 28 : brand.radius * 0.8;
  const edgeMask = "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)";

  return (
    <div style={{ position: "absolute", inset: 0, opacity: enter * (1 - leave) }}>
      {/* Banda de pasos: líneas primero (por detrás), después las fichas. */}
      {layout.connectors.map((line, index) => {
        const fill = progress(frame, stepAt(index + 1) - 6, stepAt(index + 1) + 18, EASE_IN_OUT);
        return (
          <div key={`line-${index}`} style={{ position: "absolute", left: line.x, top: line.y, width: line.w, height: line.h, background: brand.palette.line }}>
            <div style={{ width: "100%", height: "100%", background: brand.palette.accent, transformOrigin: "left center", scale: `${fill} 1` }} />
          </div>
        );
      })}
      {layout.chips.map((chip, index) => {
        const isActive = started && index === active;
        const done = started && index < active;
        const lit = isActive || done;
        const shot = shots[index];
        return (
          <div key={`chip-${index}`}>
            <div
              style={{
                position: "absolute",
                left: chip.dot.x,
                top: chip.dot.y,
                width: chip.dot.w,
                height: chip.dot.h,
                boxSizing: "border-box",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive ? brand.palette.accent : brand.palette.bg,
                border: `1px solid ${lit ? brand.palette.accent : brand.palette.line}`,
                color: isActive ? brand.palette.onAccent : lit ? brand.palette.accentSoft : brand.palette.muted,
                fontFamily: brand.fonts.label,
                fontSize: chip.dot.h * 0.42,
                fontWeight: 700,
                boxShadow: isActive ? `0 0 0 6px ${alpha(brand.palette.accent, 14)}` : "none",
              }}
            >
              {index + 1}
            </div>
            {shot?.label && chip.label ? (
              <div style={{ position: "absolute", left: chip.label.x, top: chip.label.y, width: chip.label.w, height: chip.label.h, fontFamily: brand.fonts.body, fontSize: layout.labelSize, lineHeight: LINE_HEIGHT.label, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap", color: isActive ? brand.palette.text : brand.palette.muted }}>
                {shot.label}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Fila de capturas, recortada a su área (en 4:5 con bordes que se desvanecen). */}
      <div
        style={{
          position: "absolute",
          left: layout.viewport.x,
          top: layout.viewport.y - 24,
          width: layout.viewport.w,
          height: layout.viewport.h + 48,
          overflow: "hidden",
          ...(layout.carousel ? ({ maskImage: edgeMask, WebkitMaskImage: edgeMask } as CSSProperties) : {}),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 24, width: "100%", height: layout.viewport.h, translate: `${track}px ${(1 - enter) * 24}px` }}>
          {layout.cards.map((card, index) => {
            const shot = shots[index];
            // Peso del paso activo (entra y sale con fundido de opacidad; las tarjetas no se mueven entre sí).
            const weight = progress(frame, stepAt(index), stepAt(index) + 16) * (index < n - 1 ? 1 - progress(frame, stepAt(index + 1), stepAt(index + 1) + 16) : 1);
            const lit = Math.max(weight, 1 - progress(frame, startAt, startAt + 16));
            // Recorrido vertical mientras el paso está activo; después queda donde terminó.
            const pan = card.pan > 0 ? interpolate(frame, [stepAt(index) + 18, stepAt(index) + step - 12], [0, card.pan], { ...CLAMP, easing: EASE_IN_OUT }) : 0;
            return (
              <div
                key={shot.src}
                style={{
                  position: "absolute",
                  left: card.frame.x - layout.viewport.x,
                  top: card.frame.y - layout.viewport.y,
                  width: card.frame.w,
                  height: card.frame.h,
                  boxSizing: "border-box",
                  borderRadius: radius,
                  padding: layout.bezel,
                  background: frameKind === "phone" ? "#05070b" : brand.palette.surface,
                  // Filo por fuera (box-shadow): no le quita espacio a la pantalla.
                  boxShadow: `0 0 0 1px ${weight > 0.01 ? alpha(brand.palette.accent, Math.round(20 + weight * 45)) : brand.palette.line}, 0 34px 90px ${alpha("#000000", 50)}`,
                  opacity: 0.42 + 0.58 * lit,
                }}
              >
                <div style={{ position: "relative", width: card.screen.w, height: card.screen.h, borderRadius: screenRadius, overflow: "hidden", background: brand.palette.surface }}>
                  <Img src={shot.src} style={{ position: "absolute", left: 0, top: -pan, width: card.screen.w, height: card.shotH, maxWidth: "none" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
