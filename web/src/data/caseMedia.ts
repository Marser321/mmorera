import manifest from "./caseMedia.generated.json";

/**
 * Medios grabados de cada caso EN VIVO por `scripts/capture-case-reels.ts`
 * (reel de scroll + capturas desktop/mobile). El JSON es generado: no editar
 * a mano, volver a correr el script.
 */
export interface CaseReelSources {
  mp4: string;
  webm: string;
  poster: string;
}

export interface CaseMedia {
  reel: CaseReelSources;
  gallery: { src: string; device: "desktop" | "mobile" }[];
  capturedAt: string;
}

const CASE_MEDIA = manifest as Record<string, CaseMedia>;

export function getCaseMedia(slug: string): CaseMedia | undefined {
  return CASE_MEDIA[slug];
}
