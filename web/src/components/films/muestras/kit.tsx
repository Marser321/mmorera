import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { CASE_BRANDS, type CaseBrand } from "@/data/brands/caseBrands";
import type { SampleAspect } from "@/data/contentSamples";
import { box, cover, ramp, type Rect } from "../trailer/kit";
import { CLIPS, clipFrame, type ClipId } from "./clips";

export { EASE_IN, EASE_IN_OUT, EASE_OUT, Flash, box, cover, hash, lerp, mixRect, ramp, shake, slam, type Rect } from "../trailer/kit";

/**
 * Piezas comunes de las muestras de contenido: cada muestra es un estilo
 * (persona, empresa, VSL, reel, historia, cuadrado, carrusel) armado con el
 * material de una web que hizo Mario, con la marca de esa web.
 *
 * Las muestras no leen useVideoConfig: tienen su tamaño nativo fijo para que
 * el trailer pueda meterlas, escaladas, dentro de sus propias escenas.
 */

export type { SampleAspect };

export const SAMPLE_SIZE: Record<SampleAspect, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
};

export interface SampleProps {
  language: FilmLanguage;
}

export const brand = (slug: string): CaseBrand => CASE_BRANDS[slug];

/** El lienzo de una muestra: su tamaño nativo, el fondo de la marca y nada que se salga. */
export function SampleCanvas({ aspect, background, children, style }: { aspect: SampleAspect; background: string; children: ReactNode; style?: CSSProperties }) {
  const size = SAMPLE_SIZE[aspect];
  return <div style={{ position: "absolute", left: 0, top: 0, width: size.width, height: size.height, overflow: "hidden", background, ...style }}>{children}</div>;
}

/** Un clip de una web (secuencia de imágenes), encajado como cover con punto focal y zoom. */
export function Clip({
  id,
  frame,
  at = 0,
  play = true,
  rate = 1,
  focal = [0.5, 0.5],
  zoom = 1,
  filter,
  style,
}: {
  id: ClipId;
  frame: Rect;
  /** Segundo del clip desde el que se muestra. */
  at?: number;
  play?: boolean;
  rate?: number;
  focal?: readonly [number, number];
  zoom?: number;
  filter?: string;
  style?: CSSProperties;
}) {
  const local = useCurrentFrame();
  const clip = CLIPS[id];
  const rect = cover(frame.width, frame.height, focal, zoom, clip);
  const index = at * 30 + (play ? local * rate : 0);
  return (
    <div style={{ ...box(frame), overflow: "hidden", ...style }}>
      <Img src={staticFile(clipFrame(id, index))} style={{ ...box(rect), maxWidth: "none", filter }} />
    </div>
  );
}

/** Una imagen (captura o foto de la web) encajada como cover, con zoom lento opcional. */
export function Still({
  src,
  size,
  frame,
  focal = [0.5, 0.5],
  zoom = 1,
  filter,
  style,
}: {
  /** Ruta dentro de public/. */
  src: string;
  size: { width: number; height: number };
  frame: Rect;
  focal?: readonly [number, number];
  zoom?: number;
  filter?: string;
  style?: CSSProperties;
}) {
  const rect = cover(frame.width, frame.height, focal, zoom, size);
  return (
    <div style={{ ...box(frame), overflow: "hidden", ...style }}>
      <Img src={staticFile(src)} style={{ ...box(rect), maxWidth: "none", filter }} />
    </div>
  );
}

/** Texto con tramos entre asteriscos resaltados, como en los textos de los films de caso. */
export function emph(text: string, highlight: CSSProperties): ReactNode[] {
  return text.split("*").map((part, i) => (i % 2 === 1 ? <span key={i} style={highlight}>{part}</span> : <span key={i}>{part}</span>));
}

/** Las palabras de un texto, cada una marcada si cae dentro de un tramo entre asteriscos. */
export function markedWords(text: string) {
  const out: Array<{ word: string; marked: boolean }> = [];
  let marked = false;
  for (const raw of text.split(" ")) {
    if (raw.startsWith("*")) marked = true;
    out.push({ word: raw.replace(/\*/g, ""), marked });
    if (raw.endsWith("*")) marked = false;
  }
  return out;
}

/** Palabras que entran de a una (desde `at`, una cada `every` cuadros). */
export function WordsIn({ text, frame, at, every = 2, rise = 26, highlight, style }: { text: string; frame: number; at: number; every?: number; rise?: number; highlight?: CSSProperties; style?: CSSProperties }) {
  return (
    <span style={style}>
      {markedWords(text).map(({ word, marked }, i) => {
        const t = ramp(frame, at + i * every, at + i * every + 9);
        return (
          <span key={`${word}-${i}`} style={{ display: "inline-block", marginRight: "0.25em", opacity: t, translate: `0 ${(1 - t) * rise}px`, filter: `blur(${(1 - t) * 5}px)`, ...(marked ? highlight : null) }}>
            {word}
          </span>
        );
      })}
    </span>
  );
}

/** Rótulo honesto de la muestra: material de la web, no una campaña publicada. */
export function SampleTag({ language, color, background, style }: { language: FilmLanguage; color: string; background: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        padding: "8px 14px",
        borderRadius: 999,
        fontFamily: 'var(--ff-mono), "Space Mono", monospace',
        fontSize: 17,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color,
        background,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {language === "es" ? "Muestra" : "Sample"}
    </div>
  );
}

/** Logo de la marca (PNG de su web), opcionalmente en blanco para fondos oscuros. */
export function BrandLogo({ src, width, white = false, style }: { src: string; width: number; white?: boolean; style?: CSSProperties }) {
  return <Img src={staticFile(src.replace(/^\//, ""))} style={{ position: "absolute", width, height: "auto", filter: white ? "brightness(0) invert(1)" : undefined, ...style }} />;
}

/** Grano quieto que cubre cualquier tamaño. */
export function GrainFill({ width, height, opacity = 0.05 }: { width: number; height: number; opacity?: number }) {
  const tiles: ReactNode[] = [];
  for (let y = 0; y < Math.ceil(height / 384); y += 1) {
    for (let x = 0; x < Math.ceil(width / 384); x += 1) {
      tiles.push(<Img key={`${x}-${y}`} src={staticFile("social/grano.png")} style={{ position: "absolute", left: x * 384, top: y * 384, width: 384, height: 384 }} />);
    }
  }
  return <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>{tiles}</div>;
}

/** rgba de un color #RRGGBB. */
export function tint(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const n = parseInt(value.length === 3 ? value.split("").map((c) => c + c).join("") : value, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
