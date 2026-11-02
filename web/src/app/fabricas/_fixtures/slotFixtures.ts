import type { BriefToPieceData, BriefToPieceStageId, BriefToPieceWho } from "@/types/briefToPiece";
import type { VideoGalleryItem } from "@/components/premium/fabricas/VideoGallery";

// Fixtures para probar T08. Claude los sustituirá por sus datos reales de T33/T09.
const todo = (es: string, en: string) => ({ es: `TODO(Claude): ${es}`, en: `TODO(Claude): ${en}` });
const stages: { stage: BriefToPieceStageId; who: BriefToPieceWho; es: string; en: string }[] = [
  { stage: "brief", who: "persona", es: "brief", en: "brief" },
  { stage: "guion", who: "ia", es: "guion", en: "script" },
  { stage: "arte", who: "herramienta", es: "arte", en: "art" },
  { stage: "revision", who: "persona", es: "revisión humana", en: "human review" },
  { stage: "final", who: "herramienta", es: "pieza final", en: "final piece" },
];

function placeholder(index: number, portrait = false) {
  const height = portrait ? 640 : 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="${height}" viewBox="0 0 480 ${height}"><rect width="480" height="${height}" fill="#0B0B0A"/><rect x="48" y="48" width="384" height="${height - 96}" rx="8" fill="none" stroke="#ECE7DD" stroke-opacity=".3"/>${Array.from({ length: 5 }, (_, step) => `<rect x="${80 + step * 66}" y="${height / 2 - 8}" width="56" height="16" rx="4" fill="${step === index ? "#71F3A2" : "#ECE7DD"}" fill-opacity="${step === index ? 1 : .2}"/>`).join("")}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const BRIEF_TO_PIECE_FIXTURES: BriefToPieceData = [1, 2].map(piece => ({
  slug: `demo-${piece}`,
  title: todo(`pieza ${piece}`, `piece ${piece}`),
  stages: stages.map(({ stage, who, es, en }, index) => ({
    stage, who,
    label: todo(`${es} de la pieza ${piece}`, `${en} for piece ${piece}`),
    summary: todo(`resumen de ${es}`, `${en} summary`),
    image: { src: placeholder(index), alt: todo(`imagen de ${es}`, `${en} image`) },
  })),
}));

export const VIDEO_GALLERY_FIXTURES: VideoGalleryItem[] = [1, 2].map(piece => ({
  slug: `video-demo-${piece}`,
  title: todo(`video ${piece}`, `video ${piece}`),
  poster: { src: placeholder(piece - 1, true), alt: todo(`póster del video ${piece}`, `video ${piece} poster`) },
  // Clip versionado reutilizado SOLO como prueba: H.264, 720×900, 14,208 s, 3.662.650 bytes, sin audio.
  src: "/profile/author-film/author-film-mobile.mp4",
  duration: "0:14",
  tools: ["TODO(Claude): …"],
}));
