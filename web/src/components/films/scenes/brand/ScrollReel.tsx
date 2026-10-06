import { useState } from "react";
import { Html5Video, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { FilmAsset } from "@/data/films/flagships/types";
import type { Box } from "@/lib/filmLayout";
import { playableAsset } from "@/lib/videoSource";
import { CLAMP, EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { isVideoSrc } from "./layout/mediaShared";
import { scrollReelLayout } from "./layout/scrollReel";

export type ScrollReelProps = {
  box: Box;
  /** Captura larga (imagen) o reel grabado (video), con su medida nativa. */
  asset: FilmAsset;
  /** Fotograma de espera del reel. */
  poster?: string;
  /** Dominio que se escribe en la barra. */
  host: string;
  /** Ruta que se escribe en la barra. */
  path: string;
  duration: number;
  /** Paradas del scroll (0 = arriba, 1 = abajo de todo). */
  stops?: number[];
  /** Ancho máximo del navegador (px). */
  maxWidth?: number;
  align?: "center" | "top" | "bottom";
  /** Segundo del reel desde el que arranca. */
  startAt?: number;
};

/**
 * Un navegador con la dirección real (host + ruta) donde corre una captura
 * larga, con scroll guiado por el frame y pausas en cada parada, o un reel
 * grabado. Nunca se dibuja por encima de la resolución nativa del medio.
 */
export function ScrollReel({ box, asset: source, poster, host, path, duration, stops = [0, 1], maxWidth, align, startAt = 0 }: ScrollReelProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  // AV1/WebM si el navegador lo decodifica; si el video igual falla, queda el póster.
  const asset = playableAsset(source);
  const [failed, setFailed] = useState(false);
  const video = isVideoSrc(asset.src);
  const layout = scrollReelLayout(box, { asset, kind: video ? "video" : "image", host, path, maxWidth, align }, portrait ? "portrait" : "landscape");
  const { frame: win, chrome, pill, lock, url, view, media } = layout;
  const enter = progress(frame, 0, 28, EASE_IN_OUT);
  const leave = progress(frame, duration - 18, duration, EASE_IN_OUT);
  const loop = Boolean(video && asset.seconds && duration / fps > asset.seconds - startAt);

  // Scroll: en cada tramo, una pausa corta y después un desplazamiento suave.
  const from = 30;
  const to = Math.max(from + 1, duration - 30);
  const segments = Math.max(1, stops.length - 1);
  const segment = (to - from) / segments;
  const position = stops.length < 2
    ? (stops[0] ?? 0)
    : stops.slice(1).reduce((value, stop, index) => {
        const start = from + index * segment + segment * 0.25;
        const end = from + (index + 1) * segment;
        return value + (stop - stops[index]) * interpolate(frame, [start, end], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
      }, stops[0]);
  const offset = layout.scroll * Math.max(0, Math.min(1, position));
  const radius = brand.radius * 0.7;
  const dot = Math.round(chrome.h * 0.22);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: enter * (1 - leave) }}>
      <div
        style={{
          position: "absolute",
          left: win.x,
          top: win.y,
          width: win.w,
          height: win.h,
          borderRadius: radius,
          overflow: "hidden",
          background: brand.palette.surface,
          boxShadow: `0 0 0 1px ${alpha(brand.palette.accent, 22)}, 0 50px 120px ${alpha("#000000", 55)}`,
          // Entra creciendo apenas desde su centro: nunca sale de su caja.
          scale: `${0.965 + enter * 0.035}`,
        }}
      >
        {/* Barra del navegador: tres puntos y la dirección en su píldora. */}
        <div style={{ position: "absolute", left: 0, top: 0, width: chrome.w, height: chrome.h, background: brand.palette.bg, borderBottom: `1px solid ${brand.palette.line}`, boxSizing: "border-box" }}>
          {[0, 1, 2].map((index) => (
            <span key={index} style={{ position: "absolute", left: chrome.h * 0.42 + index * dot * 1.7, top: (chrome.h - dot) / 2, width: dot, height: dot, borderRadius: 99, background: brand.palette.line }} />
          ))}
          <div style={{ position: "absolute", left: pill.x - win.x, top: pill.y - win.y, width: pill.w, height: pill.h, borderRadius: 999, background: alpha(brand.palette.text, 6), boxShadow: `inset 0 0 0 1px ${brand.palette.line}` }} />
          <svg viewBox="0 0 16 16" width={lock.w} height={lock.h} style={{ position: "absolute", left: lock.x - win.x, top: lock.y - win.y }}>
            <rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="none" stroke={brand.palette.muted} strokeWidth="1.4" />
            <path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke={brand.palette.muted} strokeWidth="1.4" />
          </svg>
          <div style={{ position: "absolute", left: url.x - win.x, top: url.y - win.y, width: url.w, height: url.h, fontFamily: brand.fonts.body, fontSize: layout.urlSize, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: brand.palette.muted }}>
            {host}
            <span style={{ color: brand.palette.text }}>{path}</span>
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, top: view.y - win.y, width: view.w, height: view.h, overflow: "hidden", background: brand.palette.surface }}>
          {video ? (
            <>
              {poster ? <Img src={poster} style={{ position: "absolute", left: 0, top: 0, width: media.w, height: media.h, maxWidth: "none" }} /> : null}
              {failed ? null : <Html5Video
                src={asset.src}
                onError={() => setFailed(true)}
                muted
                loop={loop}
                pauseWhenBuffering={false}
                acceptableTimeShiftInSeconds={0.6}
                trimBefore={startAt > 0 ? Math.round(startAt * fps) : undefined}
                style={{ position: "absolute", left: 0, top: 0, width: media.w, height: media.h, maxWidth: "none" }}
              />}
            </>
          ) : (
            <Img src={asset.src} style={{ position: "absolute", left: 0, top: -offset, width: media.w, height: media.h, maxWidth: "none" }} />
          )}
        </div>
      </div>
    </div>
  );
}
