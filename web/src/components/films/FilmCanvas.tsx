"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { FILM_FORMATS, FILM_FPS, type FilmFormat } from "@/data/films/filmTypes";
import { SystemsOpening, type SystemsOpeningProps } from "./compositions/SystemsOpening";
import { UseCaseFilm, type UseCaseFilmProps } from "./compositions/UseCaseFilm";

export type FilmSource =
  | { kind: "opening"; props: SystemsOpeningProps; durationInFrames: number }
  | { kind: "use-case"; props: UseCaseFilmProps; durationInFrames: number };

export interface FilmCanvasProps {
  source: FilmSource;
  format: FilmFormat;
  onPlayer: (player: PlayerRef | null) => void;
  initialFrame?: number;
}

/**
 * Único punto que importa Remotion: se carga con next/dynamic (ssr:false)
 * desde FilmStage, así el runtime del Player queda fuera del bundle inicial.
 * Sin controles nativos: la página dibuja sus propios capítulos.
 */
export function FilmCanvas({ source, format, onPlayer, initialFrame = 0 }: FilmCanvasProps) {
  const { width, height } = FILM_FORMATS[format];
  const shared = {
    ref: onPlayer,
    durationInFrames: source.durationInFrames,
    fps: FILM_FPS,
    compositionWidth: width,
    compositionHeight: height,
    initialFrame,
    controls: false,
    clickToPlay: false,
    doubleClickToFullscreen: false,
    spaceKeyToPlayOrPause: false,
    moveToBeginningWhenEnded: false,
    initiallyMuted: true,
    numberOfSharedAudioTags: 0,
    acknowledgeRemotionLicense: true,
    style: { width: "100%", height: "100%" },
  } as const;

  if (source.kind === "opening") {
    return <Player {...shared} component={SystemsOpening} inputProps={source.props} />;
  }
  return <Player {...shared} component={UseCaseFilm} inputProps={source.props} />;
}
