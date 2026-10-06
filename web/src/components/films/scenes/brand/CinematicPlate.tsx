import { useState, type ReactNode } from "react";
import { Html5Video, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { FilmAsset } from "@/data/films/flagships/types";
import type { Box } from "@/lib/filmLayout";
import { playableAsset } from "@/lib/videoSource";
import { CLAMP, EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { cinematicPlateLayout, PLATE_KICKER_TRACKING, type PlateCaption } from "./layout/cinematicPlate";
import { isVideoSrc, LINE_HEIGHT } from "./layout/mediaShared";
import { RevealWords } from "./ManifestoBeats";

export type CinematicPlateProps = {
  /** Área que el film le da a la escena. */
  box: Box;
  /** Video (mp4/webm) o foto, con su medida nativa. */
  asset: FilmAsset;
  /** Fotograma de espera del video (se ve mientras carga). */
  poster?: string;
  /** Punto del medio (0–1) que queda al centro del recorte y del empuje. */
  focal?: { x: number; y: number };
  /** Intensidad del velo de la marca (0–1). */
  veilOpacity?: number;
  duration: number;
  /** Empuje de cámara total (0,04 = 4 %), limitado a la resolución nativa. */
  push?: number;
  /** Leyenda opcional: va en su propia banda, debajo de la placa. */
  caption?: PlateCaption;
  /** Frame en el que entra la leyenda. */
  captionFrom?: number;
  align?: "center" | "top" | "bottom";
  /** Segundo del video desde el que arranca. */
  startAt?: number;
  /** Capa sobre la placa (recortada a ella). Para texto, usar `caption`. */
  children?: ReactNode;
};

/**
 * Placa cinematográfica: un video o una foto dentro de una ventana con el velo
 * y la viñeta de la marca, que se abre como un obturador y avanza con un
 * empuje mínimo. Nunca se dibuja por encima de su resolución nativa: en 16:9
 * cubre la caja (recorte anamórfico como mucho) y en 4:5 queda como banda
 * con letterbox. La leyenda, si la hay, vive debajo (nunca sobre el medio).
 */
export function CinematicPlate({ box, asset: source, poster, focal = { x: 0.5, y: 0.5 }, veilOpacity = 0.55, duration, push = 0.045, caption, captionFrom = 22, align, startAt = 0, children }: CinematicPlateProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { portrait } = useFilmLayout();
  const brand = useBrand();
  // AV1/WebM si el navegador lo decodifica; si el video igual falla, queda el póster.
  const asset = playableAsset(source);
  const [failed, setFailed] = useState(false);
  const layout = cinematicPlateLayout(box, { asset, caption, focal, align }, portrait ? "portrait" : "landscape");
  const { plate, media } = layout;
  const video = isVideoSrc(asset.src);
  const loop = Boolean(video && asset.seconds && duration / fps > asset.seconds - startAt);

  const open = progress(frame, 0, 34, EASE_IN_OUT);
  const leave = progress(frame, duration - 18, duration, EASE_IN_OUT);
  const scale = interpolate(frame, [0, duration], [1, Math.min(1 + push, layout.maxPush)], { ...CLAMP, easing: EASE_IN_OUT });
  const veil = Math.max(0, Math.min(1, veilOpacity));
  const fill = { position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", objectFit: "cover" } as const;
  const kickerIn = progress(frame, captionFrom, captionFrom + 16);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      <div
        style={{
          position: "absolute",
          left: plate.x,
          top: plate.y,
          width: plate.w,
          height: plate.h,
          overflow: "hidden",
          borderRadius: brand.radius * 0.6,
          background: brand.palette.surface,
          boxShadow: `0 40px 110px ${alpha("#000000", 50)}`,
          // Obturador: la placa se abre desde una ranura horizontal.
          clipPath: `inset(${(1 - open) * 46}% 0 round ${brand.radius * 0.6}px)`,
        }}
      >
        <div style={{ position: "absolute", left: media.x - plate.x, top: media.y - plate.y, width: media.w, height: media.h, scale: `${scale}`, transformOrigin: `${focal.x * 100}% ${focal.y * 100}%` }}>
          {poster && video ? <Img src={poster} style={fill} /> : null}
          {video ? (
            failed ? null : <Html5Video src={asset.src} muted loop={loop} pauseWhenBuffering={false} acceptableTimeShiftInSeconds={0.6} trimBefore={startAt > 0 ? Math.round(startAt * fps) : undefined} onError={() => setFailed(true)} style={fill} />
          ) : (
            <Img src={asset.src} style={fill} />
          )}
        </div>
        {/* Velo de la marca: viñeta hacia el fondo y un degradé suave arriba y abajo. */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 100% at ${focal.x * 100}% ${focal.y * 100}%, transparent 42%, ${alpha(brand.palette.bg, Math.round(78 * veil))} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${alpha(brand.palette.bg, Math.round(40 * veil))} 0%, transparent 24%, transparent 70%, ${alpha(brand.palette.bg, Math.round(60 * veil))} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: brand.radius * 0.6, boxShadow: `inset 0 0 0 1px ${alpha(brand.palette.accent, 20)}` }} />
        {children ? <div style={{ position: "absolute", inset: 0 }}>{children}</div> : null}
      </div>

      {caption && layout.caption ? (
        <>
          {caption.kicker && layout.caption.kicker ? (
            <div
              style={{
                position: "absolute",
                left: layout.caption.kicker.x,
                top: layout.caption.kicker.y,
                width: layout.caption.kicker.w,
                height: layout.caption.kicker.h,
                fontFamily: brand.fonts.label,
                fontSize: layout.caption.kickerSize,
                lineHeight: LINE_HEIGHT.label,
                fontWeight: 600,
                letterSpacing: `${PLATE_KICKER_TRACKING}em`,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: brand.palette.accent,
                opacity: kickerIn,
                translate: `0 ${(1 - kickerIn) * 8}px`,
              }}
            >
              {caption.kicker}
            </div>
          ) : null}
          <RevealWords
            text={caption.text}
            from={captionFrom + 6}
            size={layout.caption.size}
            box={layout.caption.text}
            fontFamily={brand.fonts.display}
            weight={500}
            color={brand.palette.text}
            emphasis={brand.palette.accentSoft}
            uppercase={brand.uppercaseDisplay}
          />
        </>
      ) : null}
    </div>
  );
}
