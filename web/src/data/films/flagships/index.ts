import { FENIX_CHAPTERS, FENIX_DURATION, FENIX_SCENES } from "./fenix";
import { NB_CHAPTERS, NB_DURATION, NB_SCENES } from "./newBrothers";
import type { FlagshipFilm } from "./types";

/**
 * Films insignia: guiones propios por cliente (no la plantilla genérica).
 * Solo datos puros: la composición Remotion vive en components/films y se
 * carga recién cuando el film se monta (cada página baja solo el suyo).
 */
export const FLAGSHIP_FILMS: Record<string, FlagshipFilm> = {
  "fenix-medical-center": { slug: "fenix-medical-center", scenes: [...FENIX_SCENES], durationInFrames: FENIX_DURATION, chapters: FENIX_CHAPTERS },
  "new-brothers-barberia": { slug: "new-brothers-barberia", scenes: [...NB_SCENES], durationInFrames: NB_DURATION, chapters: NB_CHAPTERS },
};

export function getFlagshipFilm(slug: string): FlagshipFilm | undefined {
  return FLAGSHIP_FILMS[slug];
}
