import type { LocalizedText } from "@/types/site";
import type { VideoGalleryEntry } from "@/types/briefToPiece";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * Galería «Video y contenido con IA» (T09): piezas verticales sin voseo ni
 * datos de clientes, verificadas por Gemini (docs/triada/gemini/T09-galeria.md).
 * Los reels del 12 al 25/10 quedan fuera hasta volver a renderizarse en tuteo.
 * Videos comprimidos a 720 px de ancho en public/portfolio/video-ia/.
 */
export const VIDEO_GALLERY: VideoGalleryEntry[] = [
  {
    slug: "ai-pizza-spec",
    title: t("Luna Forno · anuncio de prueba", "Luna Forno · spec ad"),
    src: "/portfolio/video-ia/ai-pizza-spec.mp4",
    poster: "/portfolio/video-ia/ai-pizza-spec-poster.webp",
    duration: 8,
    tools: t("Remotion, imagen generada con IA y FFmpeg", "Remotion, AI-generated images and FFmpeg"),
    label: t("Spec ficticio · no es trabajo para un cliente", "Fictional spec · not client work"),
  },
  {
    slug: "short-form-motion-v3",
    title: t("Edición corta con motion", "Short-form motion edit"),
    src: "/portfolio/video-ia/short-form-motion-v3.mp4",
    poster: "/portfolio/video-ia/short-form-motion-v3-poster.webp",
    duration: 13,
    tools: t("Edición original sobre material generado con IA", "Original edit on AI-generated footage"),
    label: t("Muestra de edición", "Editing sample"),
  },
  {
    slug: "vertical-edit-sample",
    title: t("Encuadre vertical", "Vertical framing"),
    src: "/portfolio/video-ia/vertical-edit-sample.mp4",
    poster: "/portfolio/video-ia/vertical-edit-sample-poster.webp",
    duration: 9,
    tools: t("Motion y tipografía original", "Motion and original typography"),
    label: t("Muestra de edición", "Editing sample"),
  },
];
