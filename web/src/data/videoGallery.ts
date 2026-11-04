import type { LocalizedText } from "@/types/site";
import type { VideoGalleryEntry } from "@/types/briefToPiece";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/** El archivo de una pieza en el idioma de la página. */
export const galleryMedia = (value: string | LocalizedText, language: keyof LocalizedText) => (typeof value === "string" ? value : value[language]);

/**
 * Galería «Video y contenido con IA» (T09): piezas verticales sin voseo ni
 * datos de clientes, verificadas por Gemini (docs/triada/gemini/T09-galeria.md).
 * Los reels del 12 al 25/10 quedan fuera hasta volver a renderizarse en tuteo.
 * Videos comprimidos a 720 px de ancho en public/portfolio/video-ia/.
 *
 * T48: el trailer de la fábrica (scripts/render-trailer.ts) abre la galería y
 * es la pieza de la puerta «Contenido con IA» del home. Reemplaza a la edición
 * corta con motion (short-form-motion-v3, metraje generado por Gemini); sus
 * archivos siguen en public/portfolio/video-ia/ por si se quiere volver a usar.
 */
export const VIDEO_GALLERY: VideoGalleryEntry[] = [
  {
    slug: "fabrica-trailer",
    title: t("Una toma, todas las piezas", "One take, every piece"),
    src: t("/portfolio/video-ia/fabrica-trailer-es.mp4", "/portfolio/video-ia/fabrica-trailer-en.mp4"),
    poster: t("/portfolio/video-ia/fabrica-trailer-es-poster.webp", "/portfolio/video-ia/fabrica-trailer-en-poster.webp"),
    duration: 46,
    tools: t("Remotion y Claude: reencuadre, subtítulos, color, ritmo y música, todo en código", "Remotion and Claude: reframing, captions, color, rhythm and music, all in code"),
    label: t("Pieza propia · editada en código", "Own piece · edited in code"),
  },
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
    slug: "vertical-edit-sample",
    title: t("Encuadre vertical", "Vertical framing"),
    src: "/portfolio/video-ia/vertical-edit-sample.mp4",
    poster: "/portfolio/video-ia/vertical-edit-sample-poster.webp",
    duration: 9,
    tools: t("Motion y tipografía original", "Motion and original typography"),
    label: t("Muestra de edición", "Editing sample"),
  },
];
