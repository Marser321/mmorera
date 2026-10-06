import type { Box, FilmFormatName } from "@/lib/filmLayout";
import { centerY } from "./mediaShared";

/**
 * Geometría de ScrollReel (pura): un navegador con su barra (host + ruta) y la
 * vista donde corre una captura larga o un reel grabado. El medio se dibuja a
 * lo sumo a su resolución nativa; si la captura es más alta que la vista, el
 * sobrante es el recorrido del scroll.
 */

export type ScrollReelData = {
  asset: { w: number; h: number };
  kind: "image" | "video";
  host: string;
  path: string;
  /** Ancho máximo del navegador (px). */
  maxWidth?: number;
  align?: "center" | "top" | "bottom";
};

export type ScrollReelLayout = {
  frame: Box;
  chrome: Box;
  /** Píldora de la dirección. */
  pill: Box;
  /** Candado dentro de la píldora. */
  lock: Box;
  /** Caja del texto host + ruta. */
  url: Box;
  urlSize: number;
  /** Vista del medio (debajo de la barra). */
  view: Box;
  /** Tamaño con el que se dibuja el medio (≤ nativo). */
  media: { w: number; h: number };
  /** Recorrido vertical disponible (px). */
  scroll: number;
};

const CHROME = { landscape: 46, portrait: 56 } as const;

export function scrollReelLayout(box: Box, data: ScrollReelData, format: FilmFormatName): ScrollReelLayout {
  const chromeH = CHROME[format];
  const aspect = data.asset.w / data.asset.h;
  const maxW = Math.min(box.w, data.maxWidth ?? box.w, data.asset.w);
  const maxH = Math.max(0, box.h - chromeH);

  let media: { w: number; h: number };
  let viewH: number;
  if (data.kind === "video") {
    // El reel entra entero (sin recorte ni ampliación).
    const w = Math.min(maxW, maxH * aspect);
    media = { w, h: w / aspect };
    viewH = media.h;
  } else {
    media = { w: maxW, h: maxW / aspect };
    viewH = Math.min(media.h, maxH);
  }

  const frameH = viewH + chromeH;
  const frame: Box = { x: box.x + (box.w - media.w) / 2, y: centerY(box, frameH, data.align), w: media.w, h: frameH };
  const chrome: Box = { x: frame.x, y: frame.y, w: frame.w, h: chromeH };
  const view: Box = { x: frame.x, y: frame.y + chromeH, w: media.w, h: viewH };

  // Barra: tres puntos a la izquierda y la dirección en una píldora.
  const pillX = chrome.x + chromeH * 1.9;
  const pillH = Math.round(chromeH * 0.62);
  const pill: Box = { x: pillX, y: chrome.y + (chromeH - pillH) / 2, w: Math.max(0, chrome.x + chrome.w - chromeH * 0.45 - pillX), h: pillH };
  const lockSize = Math.round(pillH * 0.5);
  const lock: Box = { x: pill.x + pillH * 0.45, y: pill.y + (pillH - lockSize) / 2, w: lockSize, h: lockSize };
  const urlSize = Math.round(chromeH * 0.34);
  const urlH = Math.ceil(urlSize * 1.2);
  const urlX = lock.x + lock.w + pillH * 0.3;
  const url: Box = { x: urlX, y: pill.y + (pillH - urlH) / 2, w: Math.max(0, pill.x + pill.w - pillH * 0.45 - urlX), h: urlH };

  return { frame, chrome, pill, lock, url, urlSize, view, media, scroll: Math.max(0, media.h - viewH) };
}
