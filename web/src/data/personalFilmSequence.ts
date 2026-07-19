export type PersonalFilmStage = "introduction" | "create" | "build" | "scale" | "convergence" | "closing";

export interface PersonalFilmMediaSource {
  src: string;
  type: "video/webm; codecs=vp9" | "video/mp4";
}

export interface PersonalFilmSource {
  sources: readonly PersonalFilmMediaSource[];
  posterWebp: string;
  posterAvif: string;
  aspectRatio: number;
}

export interface PersonalFilmTiming {
  stage: PersonalFilmStage;
  start: number;
  end: number;
}

export interface PersonalFilmSequence {
  duration: number;
  completion: number;
  cuts: readonly number[];
  timings: readonly PersonalFilmTiming[];
  desktop: PersonalFilmSource;
  mobile: PersonalFilmSource;
  preloadMargin: string;
  seekThreshold: number;
  seekWatchdogMs: number;
  activationTimeoutMs: number;
}

const ROOT = "/profile/author-film";

export const PERSONAL_FILM_SEQUENCE: PersonalFilmSequence = {
  duration: 14.2,
  completion: 0.97,
  cuts: [0.57, 1.77, 3.6, 5.17, 6.67, 7.97, 9.67, 11.83],
  timings: [
    { stage: "introduction", start: 0, end: 0.124 },
    { stage: "create", start: 0.124, end: 0.364 },
    { stage: "build", start: 0.364, end: 0.561 },
    { stage: "scale", start: 0.561, end: 0.833 },
    { stage: "convergence", start: 0.833, end: 0.94 },
    { stage: "closing", start: 0.94, end: 1 },
  ],
  desktop: {
    sources: [
      { src: `${ROOT}/author-film-desktop.webm`, type: "video/webm; codecs=vp9" },
      { src: `${ROOT}/author-film-desktop.mp4`, type: "video/mp4" },
    ],
    posterWebp: `${ROOT}/poster-desktop.webp`,
    posterAvif: `${ROOT}/poster-desktop.avif`,
    aspectRatio: 16 / 9,
  },
  mobile: {
    sources: [
      { src: `${ROOT}/author-film-mobile.mp4`, type: "video/mp4" },
    ],
    posterWebp: `${ROOT}/poster-mobile.webp`,
    posterAvif: `${ROOT}/poster-mobile.avif`,
    aspectRatio: 4 / 5,
  },
  preloadMargin: "800px 0px",
  seekThreshold: 1 / 48,
  seekWatchdogMs: 250,
  activationTimeoutMs: 1_500,
};

export function clampFilmProgress(progress: number) {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

export function resolveFilmTime(progress: number, sequence: PersonalFilmSequence = PERSONAL_FILM_SEQUENCE) {
  const effectiveProgress = Math.min(1, clampFilmProgress(progress) / sequence.completion);
  return effectiveProgress * sequence.duration;
}

export function resolveFilmStage(progress: number, sequence: PersonalFilmSequence = PERSONAL_FILM_SEQUENCE): PersonalFilmStage {
  const safeProgress = clampFilmProgress(progress);
  return sequence.timings.find(({ start, end }) => safeProgress >= start && safeProgress < end)?.stage ?? "closing";
}

export function resolvePersonalFilmSource(sequence: PersonalFilmSequence, isDesktop: boolean) {
  return isDesktop ? sequence.desktop : sequence.mobile;
}

export function shouldSeekFilm(currentTime: number, targetTime: number, threshold = PERSONAL_FILM_SEQUENCE.seekThreshold) {
  return Number.isFinite(currentTime)
    && Number.isFinite(targetTime)
    && Math.abs(currentTime - targetTime) >= threshold;
}
