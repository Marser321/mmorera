import { AD_CHAPTERS, AD_DURATION, AD_SCENES } from "./adMedia";
import { AT_CHAPTERS, AT_DURATION, AT_SCENES } from "./americaTramites";
import { AUTOHUB_CHAPTERS, AUTOHUB_DURATION, AUTOHUB_SCENES } from "./autohub360";
import { DOGE_CHAPTERS, DOGE_DURATION, DOGE_SCENES } from "./dogeSm";
import { EVO_CHAPTERS, EVO_DURATION, EVO_SCENES } from "./evowrap";
import { FENIX_CHAPTERS, FENIX_DURATION, FENIX_SCENES } from "./fenix";
import { HUB_PROFESIONAL_CHAPTERS, HUB_PROFESIONAL_DURATION, HUB_PROFESIONAL_SCENES } from "./hubProfesional";
import { LB_CHAPTERS, LB_DURATION, LB_SCENES } from "./lbWash";
import { LNB_CHAPTERS, LNB_DURATION, LNB_SCENES } from "./lnbSaas";
import { MR_CHAPTERS, MR_DURATION, MR_SCENES } from "./mrStudio";
import { NB_CHAPTERS, NB_DURATION, NB_SCENES } from "./newBrothers";
import { PUNTA_CHAPTERS, PUNTA_DURATION, PUNTA_SCENES } from "./punta360";
import { ROG_CHAPTERS, ROG_DURATION, ROG_SCENES } from "./rangelOviedo";
import { TC_CHAPTERS, TC_DURATION, TC_SCENES } from "./truckersChoice";
import type { FlagshipFilm } from "./types";

/**
 * Films insignia: guiones propios por cliente (no la plantilla genérica).
 * Solo datos puros: la composición Remotion vive en components/films y se
 * carga recién cuando el film se monta (cada página baja solo el suyo).
 */
export const FLAGSHIP_FILMS: Record<string, FlagshipFilm> = {
  "ad-media-solution": { slug: "ad-media-solution", scenes: [...AD_SCENES], durationInFrames: AD_DURATION, chapters: AD_CHAPTERS },
  "america-tramites": { slug: "america-tramites", scenes: [...AT_SCENES], durationInFrames: AT_DURATION, chapters: AT_CHAPTERS },
  "autohub-360": { slug: "autohub-360", scenes: [...AUTOHUB_SCENES], durationInFrames: AUTOHUB_DURATION, chapters: [...AUTOHUB_CHAPTERS] },
  "doge-sm": { slug: "doge-sm", scenes: [...DOGE_SCENES], durationInFrames: DOGE_DURATION, chapters: [...DOGE_CHAPTERS] },
  evowrap: { slug: "evowrap", scenes: [...EVO_SCENES], durationInFrames: EVO_DURATION, chapters: EVO_CHAPTERS },
  "fenix-medical-center": { slug: "fenix-medical-center", scenes: [...FENIX_SCENES], durationInFrames: FENIX_DURATION, chapters: FENIX_CHAPTERS },
  "hub-profesional-ai": { slug: "hub-profesional-ai", scenes: [...HUB_PROFESIONAL_SCENES], durationInFrames: HUB_PROFESIONAL_DURATION, chapters: [...HUB_PROFESIONAL_CHAPTERS] },
  "lb-elite-wash-detail": { slug: "lb-elite-wash-detail", scenes: [...LB_SCENES], durationInFrames: LB_DURATION, chapters: LB_CHAPTERS },
  "lnb-saas": { slug: "lnb-saas", scenes: [...LNB_SCENES], durationInFrames: LNB_DURATION, chapters: [...LNB_CHAPTERS] },
  "mr-studio-tattoo": { slug: "mr-studio-tattoo", scenes: [...MR_SCENES], durationInFrames: MR_DURATION, chapters: MR_CHAPTERS },
  "new-brothers-barberia": { slug: "new-brothers-barberia", scenes: [...NB_SCENES], durationInFrames: NB_DURATION, chapters: NB_CHAPTERS },
  "punta-360": { slug: "punta-360", scenes: [...PUNTA_SCENES], durationInFrames: PUNTA_DURATION, chapters: [...PUNTA_CHAPTERS] },
  "rangel-oviedo-group": { slug: "rangel-oviedo-group", scenes: [...ROG_SCENES], durationInFrames: ROG_DURATION, chapters: ROG_CHAPTERS },
  "truckers-choice": { slug: "truckers-choice", scenes: [...TC_SCENES], durationInFrames: TC_DURATION, chapters: TC_CHAPTERS },
};

export function getFlagshipFilm(slug: string): FlagshipFilm | undefined {
  return FLAGSHIP_FILMS[slug];
}
