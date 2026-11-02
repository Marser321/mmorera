import type { LocalizedText } from "./site";

/** Contrato de «Del brief a la pieza» (M3, brief T08): datos en src/data/briefToPiece.ts. */
export type BriefStage = "brief" | "guion" | "arte" | "revision" | "final";
export type BriefStageAuthor = "ia" | "persona" | "herramienta";

export interface BriefToPieceStage {
  stage: BriefStage;
  who: BriefStageAuthor;
  label: LocalizedText;
  summary: LocalizedText;
  image: { src: string; alt: LocalizedText };
}

export interface BriefToPiece {
  slug: string;
  title: LocalizedText;
  stages: BriefToPieceStage[];
}

/** Una pieza de la galería «Video y contenido con IA» (T09): datos en src/data/videoGallery.ts. */
export interface VideoGalleryItem {
  slug: string;
  title: LocalizedText;
  src: string;
  poster: string;
  /** Duración en segundos. */
  duration: number;
  tools: LocalizedText;
  /** Rótulo honesto: muestra, spec o trabajo no hecho para un cliente. */
  label: LocalizedText;
}
