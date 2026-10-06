import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { absoluteNotes, coverSize, maxCameraScale, type CameraShotSpec } from "@/lib/filmCamera";
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

/**
 * "Ventana" cinemática a pantallas reales: un solo marco de navegador en el
 * que las capturas se encadenan con fundido, y dentro de cada una la cámara se
 * mueve (paneo, zoom) siguiendo keyframes.
 *
 * - El zoom nunca supera la resolución nativa de la captura (`maxCameraScale`).
 * - Las notas marcan una zona con un marco, pero su rótulo vive en la barra de
 *   la ventana: nunca tapa el texto de la captura.
 */
export function CameraReel({
  shots,
  frameBox,
  imageAspect,
  nativeWidth,
  host,
  noteLabels,
  srcFor,
  blurFor,
  transition = 20,
}: {
  shots: CameraShotSpec[];
  frameBox: { x: number; y: number; w: number; h: number };
  /** Ancho/alto de la captura original (p. ej. 1440/900). */
  imageAspect: number;
  /** Ancho real en píxeles de las capturas. */
  nativeWidth: number;
  /** Dominio que se muestra en la barra (la ruta sale de cada toma). */
  host: string;
  noteLabels: Record<string, string>;
  srcFor: (shot: CameraShotSpec) => string;
  blurFor?: (shot: CameraShotSpec) => string;
  /** Frames del empuje entre tomas. */
  transition?: number;
}) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const chromeHeight = Math.max(40, Math.round(frameBox.h * 0.064));
  const view = { w: frameBox.w, h: frameBox.h - chromeHeight };
  const base = coverSize(view, imageAspect);
  const limit = maxCameraScale(nativeWidth, view, imageAspect);
  const last = shots.length - 1;
  // Fondos: fundido (son difusos, no tienen texto).
  const weight = (index: number) => {
    const shot = shots[index];
    const fadeIn = index === 0 ? 1 : progress(frame, shot.from, shot.from + transition, EASE_IN_OUT);
    const fadeOut = index === last ? 0 : progress(frame, shot.from + shot.duration, shot.from + shot.duration + transition, EASE_IN_OUT);
    return fadeIn * (1 - fadeOut);
  };
  // Capturas: la siguiente empuja a la anterior (como navegar entre páginas),
  // así dos pantallas con texto nunca se superponen.
  const push = (index: number) => {
    const shot = shots[index];
    const arrive = index === 0 ? 1 : progress(frame, shot.from, shot.from + transition, EASE_IN_OUT);
    const leave = index === last ? 0 : progress(frame, shot.from + shot.duration, shot.from + shot.duration + transition, EASE_IN_OUT);
    return { visible: arrive > 0 && leave < 1, offset: (1 - arrive) * 100 - leave * 100 };
  };
  const active = shots.reduce((current, shot, index) => (frame >= shot.from ? index : current), 0);
  const enter = progress(frame, 0, 30, EASE_OUT);
  const total = shots[last].from + shots[last].duration;

  // Un solo rótulo a la vez (los tiempos de las notas no se superponen; lo verifica el test del guion).
  const note = absoluteNotes(shots).find((item) => frame >= item.start && frame < item.end);
  const noteShow = note ? progress(frame, note.start, note.start + 14) * (1 - progress(frame, note.end - 12, note.end)) : 0;

  return (
    <AbsoluteFill>
      {blurFor
        ? shots.map((shot, index) => {
            const opacity = weight(index);
            return opacity > 0 ? <BlurTravel key={shot.name} src={blurFor(shot)} duration={total} style={{ opacity }} /> : null;
          })
        : null}
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
        <div style={{ position: "relative", height: chromeHeight, display: "flex", alignItems: "center", gap: chromeHeight * 0.2, padding: `0 ${chromeHeight * 0.4}px`, background: brand.palette.bg, borderBottom: `1px solid ${brand.palette.line}` }}>
          {[0, 1, 2].map((dot) => <span key={dot} style={{ width: chromeHeight * 0.2, height: chromeHeight * 0.2, borderRadius: 99, background: brand.palette.line }} />)}
          <span style={{ marginLeft: chromeHeight * 0.3, fontFamily: brand.fonts.body, fontSize: chromeHeight * 0.36, color: brand.palette.muted, whiteSpace: "nowrap" }}>
            {host}
            <span style={{ color: brand.palette.text }}>{shots[active].path}</span>
          </span>
          {note ? (
            <span
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: chromeHeight * 0.18,
                padding: `${chromeHeight * 0.1}px ${chromeHeight * 0.34}px`,
                borderRadius: 999,
                background: brand.palette.accent,
                color: brand.palette.onAccent,
                fontFamily: brand.fonts.label,
                fontSize: chromeHeight * 0.4,
                fontWeight: 600,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                opacity: noteShow,
                translate: `${(1 - noteShow) * 12}px 0`,
              }}
            >
              <span style={{ width: chromeHeight * 0.16, height: chromeHeight * 0.16, borderRadius: 99, background: brand.palette.onAccent }} />
              {noteLabels[note.key] ?? note.key}
            </span>
          ) : null}
        </div>
        <div style={{ position: "relative", width: view.w, height: view.h, overflow: "hidden" }}>
          {shots.map((shot, index) => {
            const { visible, offset } = push(index);
            if (!visible) return null;
            const local = frame - shot.from;
            const at = shot.keys.map((key) => key.at);
            const pick = (values: number[]) => (shot.keys.length > 1 ? interpolate(local, at, values, { ...CLAMP, easing: EASE_IN_OUT }) : values[0]);
            const scale = pick(shot.keys.map((key) => Math.min(key.scale, limit)));
            const fx = pick(shot.keys.map((key) => key.fx));
            const fy = pick(shot.keys.map((key) => key.fy));
            const imgW = base.w * scale;
            const imgH = base.h * scale;
            const left = Math.min(0, Math.max(view.w - imgW, view.w / 2 - fx * imgW));
            const top = Math.min(0, Math.max(view.h - imgH, view.h / 2 - fy * imgH));
            return (
              <AbsoluteFill key={shot.name} style={{ overflow: "hidden", background: brand.palette.surface, translate: `${offset}% 0` }}>
                <Img src={srcFor(shot)} style={{ position: "absolute", left, top, width: imgW, height: imgH, maxWidth: "none" }} />
                {shot.notes.map((item) => {
                  const show = progress(local, item.from, item.from + 16) * (1 - progress(local, item.to - 12, item.to));
                  if (show <= 0) return null;
                  const [nx, ny, nw, nh] = item.rect;
                  return (
                    <div
                      key={item.key}
                      style={{
                        position: "absolute",
                        left: left + nx * imgW,
                        top: top + ny * imgH,
                        width: nw * imgW,
                        height: nh * imgH,
                        borderRadius: brand.radius * 0.6,
                        border: `2px solid ${brand.palette.accent}`,
                        boxShadow: `0 0 0 9999px ${alpha(brand.palette.bg, 42 * show)}`,
                        opacity: show,
                      }}
                    />
                  );
                })}
              </AbsoluteFill>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/**
 * Título de capítulo con la tipografía de la marca. Un "\n" en el título fija
 * el corte de línea (evita viudas como una palabra sola en la segunda línea).
 */
export function BrandTitle({ kicker, title, from = 6, style, size = 64, align = "left" }: { kicker?: string; title: string; from?: number; style?: CSSProperties; size?: number; align?: "left" | "center" }) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const lines = title.split("\n").map((line) => line.split(" "));
  // Orden global de cada palabra, para que el revelado siga de una línea a la otra.
  const offsets = lines.map((_, line) => lines.slice(0, line).reduce((total, words) => total + words.length, 0));
  return (
    <div style={{ position: "absolute", textAlign: align, ...style }}>
      {kicker ? (
        <div style={{ fontFamily: brand.fonts.label, fontSize: size * 0.28, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: brand.palette.accent, opacity: progress(frame, from, from + 18), marginBottom: size * 0.3 }}>
          {kicker}
        </div>
      ) : null}
      <div style={{ fontFamily: brand.fonts.display, fontSize: size, fontWeight: 600, lineHeight: 1.02, letterSpacing: brand.uppercaseDisplay ? "0.01em" : "-0.02em", textTransform: brand.uppercaseDisplay ? "uppercase" : "none", color: brand.palette.text }}>
        {lines.map((words, line) => (
          <div key={line}>
            {words.map((word, position) => {
              const order = offsets[line] + position;
              const reveal = progress(frame, from + 6 + order * 4, from + 6 + order * 4 + 28);
              return (
                <span key={`${word}-${order}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em", marginRight: "0.24em" }}>
                  <span style={{ display: "inline-block", translate: `0 ${(1 - reveal) * 105}%` }}>{word}</span>
                </span>
              );
            })}
          </div>
        ))}
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
