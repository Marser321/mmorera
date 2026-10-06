"use client";

import { Player, type PlayerRef } from "@remotion/player";
import type React from "react";
import { FILM_FORMATS, FILM_FPS, type FilmFormat, type FilmLanguage } from "@/data/films/filmTypes";
import { CaseFilm, type CaseFilmProps } from "./compositions/CaseFilm";
import { LogoOverture, type LogoOvertureProps } from "./compositions/LogoOverture";
import { SystemsOpening, type SystemsOpeningProps } from "./compositions/SystemsOpening";
import { UseCaseFilm, type UseCaseFilmProps } from "./compositions/UseCaseFilm";

export type FilmSource =
  | { kind: "opening"; props: SystemsOpeningProps; durationInFrames: number }
  | { kind: "use-case"; props: UseCaseFilmProps; durationInFrames: number }
  | { kind: "case"; props: CaseFilmProps; durationInFrames: number }
  | { kind: "logo"; props: LogoOvertureProps; durationInFrames: number }
  | { kind: "flagship"; props: FlagshipProps; durationInFrames: number };

export type FlagshipProps = { slug: string; language: FilmLanguage };

type FlagshipModule = { default: React.ComponentType<{ language: FilmLanguage }> };

/**
 * Composición de cada film insignia, por caso, cargada recién cuando su
 * Player se monta: cada página de caso baja solo el film que muestra. Las
 * funciones viven a nivel de módulo (referencia estable para el Player).
 */
const FLAGSHIP_LOADERS: Record<string, () => Promise<FlagshipModule>> = {
  "fenix-medical-center": () => import("./compositions/FenixFilm").then((module) => ({ default: module.FenixFilm })),
  "new-brothers-barberia": () => import("./compositions/NewBrothersFilm").then((module) => ({ default: module.NewBrothersFilm })),
};

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

  switch (source.kind) {
    case "opening":
      return <Player {...shared} component={SystemsOpening} inputProps={source.props} />;
    case "case":
      return <Player {...shared} component={CaseFilm} inputProps={source.props} />;
    case "logo":
      return <Player {...shared} component={LogoOverture} inputProps={source.props} />;
    case "flagship": {
      const loader = FLAGSHIP_LOADERS[source.props.slug];
      return loader ? <Player {...shared} lazyComponent={loader} inputProps={{ language: source.props.language }} /> : null;
    }
    default:
      return <Player {...shared} component={UseCaseFilm} inputProps={source.props} />;
  }
}
