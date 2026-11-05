import type { LocalizedText } from "./site";

/** Contrato de «Del brief a la pieza» (M3, brief T08): datos en src/data/briefToPiece.ts. */
export type BriefToPieceStageId = "brief" | "guion" | "arte" | "revision" | "final";
export type BriefToPieceWho = "ia" | "persona" | "herramienta";

export interface BriefToPieceStage {
  stage: BriefToPieceStageId;
  who: BriefToPieceWho;
  label: LocalizedText;
  summary: LocalizedText;
  image: { src: string; alt: LocalizedText };
}

export interface BriefToPieceItem {
  slug: string;
  title: LocalizedText;
  stages: BriefToPieceStage[];
}

export type BriefToPieceData = BriefToPieceItem[];

/** Una pieza de la galería «Video y contenido con IA» (T09): datos en src/data/videoGallery.ts. */
export interface VideoGalleryEntry {
  slug: string;
  title: LocalizedText;
  /** Un archivo, o uno por idioma cuando la pieza lleva texto en pantalla. */
  src: string | LocalizedText;
  poster: string | LocalizedText;
  /** Versión horizontal (16:9) para pantallas anchas; `src` es la vertical. */
  landscape?: { src: string | LocalizedText; poster: string | LocalizedText };
  /** Duración en segundos. */
  duration: number;
  tools: LocalizedText;
  /** Rótulo honesto: muestra, spec o trabajo no hecho para un cliente. */
  label: LocalizedText;
}
