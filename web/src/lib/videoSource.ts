import type { FilmAsset } from "@/data/films/flagships/types";

const AV1 = 'video/webm; codecs="av01.0.08M.08"';
let av1Support: boolean | null = null;

/** ¿El navegador decodifica AV1/WebM? (Chrome, Edge, Firefox, Safari reciente). */
function supportsAv1() {
  if (av1Support === null) {
    av1Support = typeof document !== "undefined" && document.createElement("video").canPlayType(AV1) !== "";
  }
  return av1Support;
}

/**
 * Elige la fuente de un video que el navegador puede reproducir: AV1/WebM si
 * hay soporte (más liviana y abierta), H.264/MP4 si no (Safari viejo). Un
 * navegador sin H.264 (Chromium de código abierto) igual reproduce el WebM.
 */
export function playableAsset<T extends FilmAsset>(asset: T): T {
  return asset.webm && supportsAv1() ? { ...asset, src: asset.webm } : asset;
}
