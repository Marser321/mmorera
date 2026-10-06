import type { CaseFilmChapter } from "../caseFilms";
import { NB_CHAPTERS, NB_DURATION } from "./newBrothers";

/**
 * Films insignia: guiones propios por cliente (no la plantilla genérica).
 * Solo datos puros: la composición Remotion vive en components/films y se
 * carga recién cuando el film se monta.
 */
export const FLAGSHIP_FILMS: Record<string, { durationInFrames: number; chapters: CaseFilmChapter[] }> = {
  "new-brothers-barberia": { durationInFrames: NB_DURATION, chapters: NB_CHAPTERS },
};

export function getFlagshipFilm(slug: string) {
  return FLAGSHIP_FILMS[slug];
}
