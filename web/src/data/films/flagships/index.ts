import { AD_CHAPTERS, AD_DURATION, AD_SCENES } from "./adMedia";
import { FENIX_CHAPTERS, FENIX_DURATION, FENIX_SCENES } from "./fenix";
import { LB_CHAPTERS, LB_DURATION, LB_SCENES } from "./lbWash";
import { MR_CHAPTERS, MR_DURATION, MR_SCENES } from "./mrStudio";
import { NB_CHAPTERS, NB_DURATION, NB_SCENES } from "./newBrothers";
import { TC_CHAPTERS, TC_DURATION, TC_SCENES } from "./truckersChoice";
import type { FlagshipFilm } from "./types";

/**
 * Films insignia: guiones propios por cliente (no la plantilla genérica).
 * Solo datos puros: la composición Remotion vive en components/films y se
 * carga recién cuando el film se monta (cada página baja solo el suyo).
 */
export const FLAGSHIP_FILMS: Record<string, FlagshipFilm> = {
  "ad-media-solution": { slug: "ad-media-solution", scenes: [...AD_SCENES], durationInFrames: AD_DURATION, chapters: AD_CHAPTERS },
  "fenix-medical-center": { slug: "fenix-medical-center", scenes: [...FENIX_SCENES], durationInFrames: FENIX_DURATION, chapters: FENIX_CHAPTERS },
  "lb-elite-wash-detail": { slug: "lb-elite-wash-detail", scenes: [...LB_SCENES], durationInFrames: LB_DURATION, chapters: LB_CHAPTERS },
  "mr-studio-tattoo": { slug: "mr-studio-tattoo", scenes: [...MR_SCENES], durationInFrames: MR_DURATION, chapters: MR_CHAPTERS },
  "new-brothers-barberia": { slug: "new-brothers-barberia", scenes: [...NB_SCENES], durationInFrames: NB_DURATION, chapters: NB_CHAPTERS },
  "truckers-choice": { slug: "truckers-choice", scenes: [...TC_SCENES], durationInFrames: TC_DURATION, chapters: TC_CHAPTERS },
};

export function getFlagshipFilm(slug: string): FlagshipFilm | undefined {
  return FLAGSHIP_FILMS[slug];
}
