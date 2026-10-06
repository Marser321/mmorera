import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT, progress } from "../theme";
import { alpha, useBrand } from "./context";

/**
 * Fondo difuminado que viaja despacio (las versiones vienen pre-difuminadas
 * por scripts/build-film-backdrops.ts). Un velo con el fondo de la marca lo
 * mantiene detrás de la acción.
 */
export function BlurTravel({ src, duration, opacity = 0.55, drift = 1, style }: { src: string; duration: number; opacity?: number; drift?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const t = interpolate(frame, [0, duration], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: "-8%",
          width: "116%",
          height: "116%",
          // El reset de Tailwind limita img a max-width:100%; la toma necesita desbordar.
          maxWidth: "none",
          objectFit: "cover",
          opacity,
          scale: `${1.06 + t * 0.08 * drift}`,
          translate: `${-2 * drift + t * 4 * drift}% ${t * -2 * drift}%`,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(90% 80% at 50% 45%, ${alpha(brand.palette.bg, 35)}, ${brand.palette.bg} 92%)` }} />
    </AbsoluteFill>
  );
}

export interface CameraKey {
  at: number;
  /** Zoom dentro de la pantalla (1 = encuadre completo). */
  scale: number;
  /** Punto de la imagen (0–1) que queda al centro del encuadre. */
  fx: number;
  fy: number;
}

export interface CameraNote {
  from: number;
  to: number;
  /** Rectángulo destacado en coordenadas de la imagen (0–1). */
  rect: [number, number, number, number];
  label: string;
}

/**
 * "Ventana" cinemática a una pantalla real: la cámara se mueve dentro de la
 * captura (dolly, paneo, zoom) siguiendo keyframes, sobre la misma imagen
 * difuminada de fondo. Las notas señalan zonas con un marco de la marca.
 */
export function CameraShot({
  src,
  blurSrc,
  frameBox,
  imageAspect,
  keys,
  notes = [],
  duration,
  chrome,
}: {
  src: string;
  blurSrc?: string;
  frameBox: { x: number; y: number; w: number; h: number };
  /** Ancho/alto de la captura original (p. ej. 1440/900). */
  imageAspect: number;
  keys: CameraKey[];
  notes?: CameraNote[];
  duration: number;
  /** Texto de la barra superior de la ventana (p. ej. la URL). */
  chrome?: string;
}) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const at = keys.map((key) => key.at);
  const pick = (values: number[]) => interpolate(frame, at, values, { ...CLAMP, easing: EASE_IN_OUT });
  const scale = keys.length > 1 ? pick(keys.map((key) => key.scale)) : keys[0].scale;
  const fx = keys.length > 1 ? pick(keys.map((key) => key.fx)) : keys[0].fx;
  const fy = keys.length > 1 ? pick(keys.map((key) => key.fy)) : keys[0].fy;

  const chromeHeight = chrome ? Math.max(28, frameBox.h * 0.05) : 0;
  const viewW = frameBox.w;
  const viewH = frameBox.h - chromeHeight;
  // La imagen cubre el encuadre a escala 1 y la cámara la recorre.
  const baseW = Math.max(viewW, viewH * imageAspect);
  const baseH = baseW / imageAspect;
  const imgW = baseW * scale;
  const imgH = baseH * scale;
  const left = Math.min(0, Math.max(viewW - imgW, viewW / 2 - fx * imgW));
  const top = Math.min(0, Math.max(viewH - imgH, viewH / 2 - fy * imgH));
  const enter = progress(frame, 0, 30, EASE_OUT);

  return (
    <AbsoluteFill>
      {blurSrc ? <BlurTravel src={blurSrc} duration={duration} /> : null}
      <div
        style={{
          position: "absolute",
          left: frameBox.x,
          top: frameBox.y,
          width: frameBox.w,
          height: frameBox.h,
          borderRadius: brand.radius,
          overflow: "hidden",
          background: brand.palette.surface,
          border: `1px solid ${alpha(brand.palette.accent, 22)}`,
          boxShadow: `0 50px 120px ${alpha("#000000", 55)}`,
          opacity: enter,
          translate: `0 ${(1 - enter) * 30}px`,
        }}
      >
        {chrome ? (
          <div style={{ height: chromeHeight, display: "flex", alignItems: "center", gap: chromeHeight * 0.22, padding: `0 ${chromeHeight * 0.5}px`, background: brand.palette.bg, borderBottom: `1px solid ${brand.palette.line}` }}>
            {[0, 1, 2].map((dot) => <span key={dot} style={{ width: chromeHeight * 0.24, height: chromeHeight * 0.24, borderRadius: 99, background: brand.palette.line }} />)}
            <span style={{ marginLeft: chromeHeight * 0.4, fontFamily: brand.fonts.body, fontSize: chromeHeight * 0.38, color: brand.palette.muted }}>{chrome}</span>
          </div>
        ) : null}
        <div style={{ position: "relative", width: viewW, height: viewH, overflow: "hidden" }}>
          <Img src={src} style={{ position: "absolute", left, top, width: imgW, height: imgH, maxWidth: "none" }} />
          {notes.map((note) => {
            const show = progress(frame, note.from, note.from + 16) * (1 - progress(frame, note.to - 12, note.to));
            if (show <= 0) return null;
            const [nx, ny, nw, nh] = note.rect;
            return (
              <NoteBox key={note.label} show={show} x={left + nx * imgW} y={top + ny * imgH} w={nw * imgW} h={nh * imgH} label={note.label} viewW={viewW} />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function NoteBox({ show, x, y, w, h, label, viewW }: { show: number; x: number; y: number; w: number; h: number; label: string; viewW: number }) {
  const brand = useBrand();
  // La etiqueta nunca sale de la ventana aunque el recuadro quede cortado por el zoom.
  const labelWidth = label.length * 11 + 36;
  const labelLeft = Math.min(Math.max(12, x), Math.max(12, viewW - labelWidth - 12));
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: brand.radius * 0.6, border: `2px solid ${brand.palette.accent}`, boxShadow: `0 0 0 9999px ${alpha(brand.palette.bg, 38 * show)}`, opacity: show }} />
      <div
        style={{
          position: "absolute",
          left: labelLeft,
          top: Math.max(8, y - 44),
          padding: "8px 14px",
          borderRadius: 999,
          background: brand.palette.accent,
          color: brand.palette.onAccent,
          fontFamily: brand.fonts.label,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
          opacity: show,
          translate: `0 ${(1 - show) * 10}px`,
        }}
      >
        {label}
      </div>
    </>
  );
}

/** Título de capítulo con la tipografía de la marca. */
export function BrandTitle({ kicker, title, from = 6, style, size = 64, align = "left" }: { kicker?: string; title: string; from?: number; style?: CSSProperties; size?: number; align?: "left" | "center" }) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const words = title.split(" ");
  return (
    <div style={{ position: "absolute", textAlign: align, ...style }}>
      {kicker ? (
        <div style={{ fontFamily: brand.fonts.label, fontSize: size * 0.28, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: brand.palette.accent, opacity: progress(frame, from, from + 18), marginBottom: size * 0.3 }}>
          {kicker}
        </div>
      ) : null}
      <div style={{ fontFamily: brand.fonts.display, fontSize: size, fontWeight: 600, lineHeight: 1.02, letterSpacing: brand.uppercaseDisplay ? "0.01em" : "-0.02em", textTransform: brand.uppercaseDisplay ? "uppercase" : "none", color: brand.palette.text }}>
        {words.map((word, index) => {
          const reveal = progress(frame, from + 6 + index * 4, from + 6 + index * 4 + 28);
          return (
            <span key={`${word}-${index}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em", marginRight: "0.24em" }}>
              <span style={{ display: "inline-block", translate: `0 ${(1 - reveal) * 105}%` }}>{word}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Contenedor que entra y sale con fundido suave. */
export function Fade({ duration, children, style }: { duration: number; children: ReactNode; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 16, duration - 20, duration], [0, 1, 1, 0], { ...CLAMP, easing: EASE_IN_OUT });
  return <AbsoluteFill style={{ opacity, ...style }}>{children}</AbsoluteFill>;
}
