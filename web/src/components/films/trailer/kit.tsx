import type { CSSProperties, ReactNode } from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CONTENT_SAMPLES } from "@/data/contentSamples";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { LOGO_MM_PATHS, LOGO_MM_VIEWBOX } from "@/lib/logoMMPaths";
import { TRAILER_COPY } from "./copy";
import { FILM_FRAMES, FILM_SIZE } from "./film";
import timing from "./timing.json";

export { FILM_FRAMES, FILM_SIZE };

/**
 * Piezas comunes del trailer de la fábrica de contenido: la pared de la marca,
 * el «editor» que enmarca todo el video, los rótulos de cada escena y las
 * tomas del film de autor. Todo sale del frame: nada de transiciones CSS.
 */

export const TIMING = timing;

/**
 * El trailer se renderiza en vertical (1080×1920) y en horizontal (1920×1080).
 * Cada escena elige su composición con `land`; el resto del kit también.
 */
export function useStage() {
  const { width, height } = useVideoConfig();
  return { width, height, land: width > height };
}

/** Una muestra del mismo formato que el trailer va a pantalla completa, sin el editor encima. */
export function isFullBleed(sceneId: string, land: boolean) {
  return CONTENT_SAMPLES.find((sample) => sample.id === sceneId)?.aspect === (land ? "16:9" : "9:16");
}

/** La escena de una sola: inicio y duración en timing.json. */
export function sceneOf(id: string) {
  const scene = timing.scenes.find((s) => s.id === id);
  if (!scene) throw new Error(`timing.json no tiene la escena ${id}`);
  return scene;
}

export const C = {
  wall: "#0B0B0A",
  relief: "#121211",
  frame: "#181816",
  ivory: "#ECE7DD",
  signal: "#71F3A2",
  violet: "#B68CFF",
  amber: "#E59500",
} as const;

export const ivory = (alpha: number) => `rgba(236, 231, 221, ${alpha})`;
export const signal = (alpha: number) => `rgba(113, 243, 162, ${alpha})`;
export const wall = (alpha: number) => `rgba(11, 11, 10, ${alpha})`;

export const FONT = {
  display: 'var(--ff-display), "Unbounded", system-ui, sans-serif',
  body: 'var(--ff-body), "Familjen Grotesk", system-ui, sans-serif',
  mono: 'var(--ff-mono), "Space Mono", ui-monospace, monospace',
} as const;

export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 entre dos frames. */
export function ramp(frame: number, from: number, to: number, easing: (t: number) => number = EASE_OUT) {
  return interpolate(frame, [from, to], [0, 1], { ...CLAMP, easing });
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const mixRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  width: lerp(a.width, b.width, t),
  height: lerp(a.height, b.height, t),
});

export const box = (rect: Rect): CSSProperties => ({ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height });

/** Golpe tipográfico: entra grande y desenfocado y se clava en pocos frames. */
export function slam(frame: number, at: number, length = 7) {
  const t = ramp(frame, at, at + length);
  return { opacity: ramp(frame, at, at + 3), scale: lerp(1.3, 1, t), blur: lerp(16, 0, t) };
}

/** Sacudida corta de cámara después de un golpe (determinística). */
export function shake(frame: number, at: number, amount = 10, length = 12) {
  const t = frame - at;
  if (t < 0 || t > length) return { x: 0, y: 0 };
  const decay = 1 - t / length;
  return { x: Math.sin(t * 2.7) * amount * decay, y: Math.cos(t * 3.3) * amount * 0.6 * decay };
}

/** Ruido determinístico 0–1 para un entero (barras, ruido de generación). */
export function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Tomas del film de autor ───────────────────────────────────────────────

/**
 * El film de autor como secuencia de imágenes: un JPEG por cuadro a 30 fps
 * (lo genera scripts/render-trailer.ts en public/render-cache/film/, fuera de
 * git). Con el MP4, el compositor de Remotion fallaba de forma intermitente al
 * pedir cuadros de las tomas en movimiento («No frame found at position»).
 */
const filmFrame = (index: number) => staticFile(`render-cache/film/${String(Math.max(0, Math.min(FILM_FRAMES - 1, index))).padStart(4, "0")}.jpg`);

/** Momentos del film de autor (segundos) que usa el trailer. */
export const SHOTS = {
  frontal: 0.08,
  monitors: 1.45,
  keys: 2.05,
  graph: 4.25,
  shoulder: 5.6,
  stylus: 6.9,
  tablet: 8.1,
  motion: 10.2,
  face: 12.4,
} as const;

/** Looks de color (filtros CSS, los mismos en el render y en la vista previa). */
export const LOOK = {
  flat: "saturate(0.18) contrast(0.66) brightness(1.2)",
  graded: "contrast(1.18) saturate(1.25) brightness(0.98)",
  warm: "sepia(0.32) saturate(1.35) contrast(1.08) brightness(1.02) hue-rotate(-6deg)",
  cool: "saturate(1.05) contrast(1.1) brightness(0.96) hue-rotate(16deg)",
  brand: "grayscale(1) sepia(0.12) contrast(1.28) brightness(1.04)",
} as const;

/** Encaja la toma en una caja como object-fit: cover, con punto focal (0–1) y zoom. */
export function cover(width: number, height: number, focal: readonly [number, number] = [0.5, 0.5], zoom = 1, src: { width: number; height: number } = FILM_SIZE): Rect {
  const scale = Math.max(width / src.width, height / src.height) * zoom;
  const w = src.width * scale;
  const h = src.height * scale;
  const x = Math.min(0, Math.max(width - w, width / 2 - focal[0] * w));
  const y = Math.min(0, Math.max(height - h, height / 2 - focal[1] * h));
  return { x, y, width: w, height: h };
}

/**
 * Una toma del film de autor dentro de una caja. Congelada en `at` segundos o
 * corriendo desde ahí. `inner` reemplaza el encaje automático (reencuadre).
 */
export function Footage({
  at,
  frame,
  play = false,
  focal = [0.5, 0.5],
  zoom = 1,
  filter,
  inner,
  style,
}: {
  at: number;
  frame: Rect;
  play?: boolean;
  focal?: readonly [number, number];
  zoom?: number;
  filter?: string;
  inner?: Rect;
  style?: CSSProperties;
}) {
  const local = useCurrentFrame();
  const rect = inner ?? cover(frame.width, frame.height, focal, zoom);
  const index = Math.round(at * TIMING.fps) + (play ? local : 0);
  return (
    <div style={{ ...box(frame), overflow: "hidden", ...style }}>
      <Img src={filmFrame(index)} style={{ ...box(rect), maxWidth: "none", filter }} />
    </div>
  );
}

// ── Pared, grano y editor ─────────────────────────────────────────────────

/** Grano de la pared: la misma textura del sitio, quieta (no infla el peso del video). */
export function Grain({ opacity = 0.05 }: { opacity?: number }) {
  const { width, height } = useVideoConfig();
  const tiles: ReactNode[] = [];
  for (let y = 0; y < Math.ceil(height / 384); y += 1) {
    for (let x = 0; x < Math.ceil(width / 384); x += 1) {
      tiles.push(<Img key={`${x}-${y}`} src={staticFile("social/grano.png")} style={{ position: "absolute", left: x * 384, top: y * 384, width: 384, height: 384 }} />);
    }
  }
  return <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>{tiles}</div>;
}

export function Vignette({ strength = 0.55 }: { strength?: number }) {
  return <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 80% at 50% 45%, transparent 55%, ${wall(strength)} 100%)` }} />;
}

/** Código de tiempo de editor: hh:mm:ss:ff. */
export function timecode(frame: number) {
  const seconds = Math.floor(frame / TIMING.fps);
  const frames = frame % TIMING.fps;
  return `00:00:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
}

/** Un tramo por escena, proporcional a su duración, dentro de un ancho dado. */
export function timelineSegments(width: number, gap: number, start = 0) {
  const usable = width - gap * (TIMING.scenes.length - 1);
  const widths = TIMING.scenes.map((scene) => (usable * scene.duration) / TIMING.total);
  return TIMING.scenes.map((scene, i) => ({
    scene,
    width: widths[i],
    left: start + widths.slice(0, i).reduce((sum, w) => sum + w + gap, 0),
  }));
}

/**
 * El «editor» que enmarca el video: marca, código de tiempo y la línea de
 * tiempo con un tramo por escena (como la barra de capítulos del sitio).
 */
export function EditorChrome({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { width, height, land } = useStage();
  const copy = TRAILER_COPY[language];
  const appear = ramp(frame, TIMING.cues.enter, TIMING.cues.enter + 14);
  const leave = 1 - ramp(frame, TIMING.cues.finale, TIMING.cues.finale + 12, EASE_IN);
  const side = land ? 110 : 80;
  const scene = TIMING.scenes.find((s) => frame >= s.from && frame < s.from + s.duration);
  const shown = scene && isFullBleed(scene.id, land) ? 0 : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: appear * leave * shown, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: side, right: side, top: land ? 46 : 82, display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: land ? 19 : 21, letterSpacing: "0.14em", textTransform: "uppercase", color: ivory(0.58) }}>
        <span>
          <span style={{ color: C.ivory, fontWeight: 700 }}>MMORERA</span> / {copy.brand}
        </span>
        <span style={{ color: C.signal, fontVariantNumeric: "tabular-nums" }}>{timecode(frame)}</span>
      </div>
      {timelineSegments(width - side * 2, 6, side).map(({ scene, width: w, left }) => {
        const fill = Math.max(0, Math.min(1, (frame - scene.from) / scene.duration));
        const active = frame >= scene.from && frame < scene.from + scene.duration;
        return (
          <div key={scene.id} style={{ position: "absolute", left, top: land ? height - 46 : 1772, width: w, height: land ? 5 : 6, borderRadius: 3, background: ivory(0.14), overflow: "hidden" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: active ? C.signal : ivory(0.5) }} />
          </div>
        );
      })}
    </div>
  );
}

/** La píldora de una escena: dos datos separados por una raya. */
export function SceneChip({ left, right, style }: { left: string; right: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 20px",
        borderRadius: 999,
        border: `1.5px solid ${signal(0.45)}`,
        fontFamily: FONT.mono,
        fontSize: 22,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: C.signal,
        ...style,
      }}
    >
      <span>{left}</span>
      <span style={{ width: 1.5, height: 18, background: signal(0.5) }} />
      <span>{right}</span>
    </div>
  );
}

/** Rótulo de escena: número y nombre de la edición, y la línea que la explica. */
export function SceneHeader({
  index,
  chip,
  line,
  frame,
  size = 66,
  sub,
  subAt = 40,
  exitAt,
  right,
}: {
  index: number;
  chip: string;
  line: string;
  frame: number;
  size?: number;
  sub?: string;
  subAt?: number;
  exitAt?: number;
  right?: ReactNode;
}) {
  const { land } = useStage();
  const chipIn = ramp(frame, -4, 8);
  const out = exitAt === undefined ? 1 : 1 - ramp(frame, exitAt, exitAt + 8, EASE_IN);
  const words = line.split(" ");
  const subWords = sub?.split(" ") ?? [];
  // En horizontal, el rótulo es la columna izquierda; la imagen va a la derecha.
  const place: CSSProperties = land ? { left: 110, width: 600, top: 150 } : { left: 80, right: 80, top: 186 };
  const lineSize = land ? Math.round(size * 0.9) : size;
  return (
    <div style={{ position: "absolute", ...place, opacity: out }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SceneChip left={String(index).padStart(2, "0")} right={chip} style={{ opacity: chipIn, translate: `${(1 - chipIn) * -24}px 0` }} />
        {right}
      </div>
      <div style={{ marginTop: 30, fontFamily: FONT.body, fontWeight: 500, fontSize: lineSize, lineHeight: 1.06, letterSpacing: "-0.028em", color: C.ivory }}>
        {words.map((word, i) => {
          const t = ramp(frame, 1 + i * 2, 12 + i * 2);
          return (
            <span key={`${word}-${i}`} style={{ display: "inline-block", marginRight: "0.24em", opacity: t, translate: `0 ${(1 - t) * 28}px`, filter: `blur(${(1 - t) * 6}px)` }}>
              {word}
            </span>
          );
        })}
      </div>
      {sub ? (
        <div style={{ marginTop: 20, fontFamily: FONT.body, fontWeight: 400, fontSize: land ? 38 : 44, lineHeight: 1.15, letterSpacing: "-0.015em", color: ivory(0.74) }}>
          {subWords.map((word, i) => {
            const t = ramp(frame, subAt + i * 2, subAt + 11 + i * 2);
            return (
              <span key={`${word}-${i}`} style={{ display: "inline-block", marginRight: "0.26em", opacity: t, translate: `0 ${(1 - t) * 20}px` }}>
                {word}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/** Esquinas de recorte (el visor del reencuadre). */
export function CropBrackets({ rect, color = C.signal, length = 44, thickness = 4, opacity = 1 }: { rect: Rect; color?: string; length?: number; thickness?: number; opacity?: number }) {
  const corner = (style: CSSProperties) => <div style={{ position: "absolute", width: length, height: length, ...style }} />;
  const line = `${thickness}px solid ${color}`;
  return (
    <div style={{ ...box(rect), opacity, pointerEvents: "none" }}>
      {corner({ left: -thickness / 2, top: -thickness / 2, borderLeft: line, borderTop: line })}
      {corner({ right: -thickness / 2, top: -thickness / 2, borderRight: line, borderTop: line })}
      {corner({ left: -thickness / 2, bottom: -thickness / 2, borderLeft: line, borderBottom: line })}
      {corner({ right: -thickness / 2, bottom: -thickness / 2, borderRight: line, borderBottom: line })}
    </div>
  );
}

/** Rótulo mono sobre la imagen (como los de las láminas de la marca). */
export function Tag({ children, style, tone = "dark" }: { children: ReactNode; style?: CSSProperties; tone?: "dark" | "signal" }) {
  return (
    <div
      style={{
        position: "absolute",
        padding: "9px 16px",
        borderRadius: 10,
        fontFamily: FONT.mono,
        fontSize: 19,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: tone === "signal" ? C.wall : C.ivory,
        background: tone === "signal" ? C.signal : wall(0.72),
        border: tone === "signal" ? "none" : `1px solid ${ivory(0.16)}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** El monograma MM en blanco roto, nítido. `size` es el ancho. */
export function Monogram({ size, color = C.ivory, style }: { size: number; color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox={`0 0 ${LOGO_MM_VIEWBOX.width} ${LOGO_MM_VIEWBOX.height}`} width={size} height={(size * LOGO_MM_VIEWBOX.height) / LOGO_MM_VIEWBOX.width} style={style}>
      {LOGO_MM_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill={color} />
      ))}
    </svg>
  );
}

/** El monograma con la textura de piedra de la marca (el momento de marca del final). */
export function StoneMonogram({ size, style }: { size: number; style?: CSSProperties }) {
  const scale = size / LOGO_MM_VIEWBOX.width;
  const d = LOGO_MM_PATHS.join(" ");
  return (
    <div style={{ position: "absolute", width: size, height: LOGO_MM_VIEWBOX.height * scale, ...style }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: LOGO_MM_VIEWBOX.width,
          height: LOGO_MM_VIEWBOX.height,
          transformOrigin: "0 0",
          scale: `${scale}`,
          clipPath: `path('${d}')`,
          background: C.ivory,
        }}
      >
        <Img src={staticFile("marca/textura-piedra.webp")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.55 }} />
      </div>
    </div>
  );
}

/** Destello blanco corto (cortes fuertes). */
export function Flash({ frame, at, peak = 0.8, length = 7 }: { frame: number; at: number; peak?: number; length?: number }) {
  const t = frame - at;
  if (t < 0 || t > length) return null;
  return <div style={{ position: "absolute", inset: 0, background: C.ivory, opacity: peak * (1 - t / length) }} />;
}
