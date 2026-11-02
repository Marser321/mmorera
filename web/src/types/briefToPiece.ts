import type { LocalizedText } from "./site";

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
