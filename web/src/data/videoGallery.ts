import type { LocalizedText } from "@/types/site";
import type { VideoGalleryEntry } from "@/types/briefToPiece";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/** El archivo de una pieza en el idioma de la página. */
export const galleryMedia = (value: string | LocalizedText, language: keyof LocalizedText) => (typeof value === "string" ? value : value[language]);

/**
 * Galería «Piezas hechas con este sistema» de /fabricas (T09): piezas sin voseo ni
 * datos de clientes. Videos comprimidos a 720p en public/portfolio/video-ia/.
 *
 * T48/T49: el trailer de la fábrica (scripts/render-trailer.ts) dura 60 s y tiene
 * versión horizontal: las pantallas anchas ven la 16:9 y el teléfono, la vertical.
 *
 * 21/11: abre «Fábrica», el reel del concepto de una fábrica de contenido con IA
 * (proyecto mmorera-films, src/fabrica). Se suman los films de producto de te_Cargo
 * y el de gimnasios, y sale «Encuadre vertical», que bajaba el nivel. Los films
 * con narración hablan en español; la página en inglés lo avisa en el rótulo.
 */
export const VIDEO_GALLERY: VideoGalleryEntry[] = [
  {
    slug: "fabrica-una-toma",
    title: t("Fábrica · una toma, todo tu contenido", "Fábrica · one take, all your content"),
    src: "/portfolio/video-ia/fabrica-una-toma.mp4",
    poster: "/portfolio/video-ia/fabrica-una-toma-poster.webp",
    landscape: { src: "/portfolio/video-ia/fabrica-una-toma-16x9.mp4", poster: "/portfolio/video-ia/fabrica-una-toma-16x9-poster.webp" },
    duration: 80,
    tools: t("Remotion y Claude: el editor animado en código, con narrador, música y efectos", "Remotion and Claude: the editor animated in code, with narration, music and sound design"),
    label: t("Concepto de producto · pieza propia", "Product concept · own piece · narrated in Spanish"),
  },
  {
    slug: "fabrica-trailer",
    title: t("Una toma, todas las piezas", "One take, every piece"),
    src: t("/portfolio/video-ia/fabrica-trailer-es.mp4", "/portfolio/video-ia/fabrica-trailer-en.mp4"),
    poster: t("/portfolio/video-ia/fabrica-trailer-es-poster.webp", "/portfolio/video-ia/fabrica-trailer-en-poster.webp"),
    landscape: {
      src: t("/portfolio/video-ia/fabrica-trailer-es-16x9.mp4", "/portfolio/video-ia/fabrica-trailer-en-16x9.mp4"),
      poster: t("/portfolio/video-ia/fabrica-trailer-es-16x9-poster.webp", "/portfolio/video-ia/fabrica-trailer-en-16x9-poster.webp"),
    },
    duration: 60,
    tools: t("Remotion y Claude: reencuadre, subtítulos, color, siete estilos y música, todo en código", "Remotion and Claude: reframing, captions, color, seven styles and music, all in code"),
    label: t("Pieza propia · editada en código", "Own piece · edited in code"),
  },
  {
    slug: "te-cargo-por-dentro",
    title: t("te_Cargo, por dentro", "te_Cargo, inside"),
    src: "/portfolio/video-ia/te-cargo-por-dentro.mp4",
    poster: "/portfolio/video-ia/te-cargo-por-dentro-poster.webp",
    landscape: { src: "/portfolio/video-ia/te-cargo-por-dentro-16x9.mp4", poster: "/portfolio/video-ia/te-cargo-por-dentro-16x9-poster.webp" },
    duration: 74,
    tools: t("Remotion: una reserva real recorre la plataforma, con música", "Remotion: a real booking travels through the platform, with music"),
    label: t("Film de producto · te_Cargo", "Product film · te_Cargo · in Spanish"),
  },
  {
    slug: "te-cargo-inversores",
    title: t("te_Cargo, para inversores", "te_Cargo, for investors"),
    src: "/portfolio/video-ia/te-cargo-inversores.mp4",
    poster: "/portfolio/video-ia/te-cargo-inversores-poster.webp",
    landscape: { src: "/portfolio/video-ia/te-cargo-inversores-16x9.mp4", poster: "/portfolio/video-ia/te-cargo-inversores-16x9-poster.webp" },
    duration: 74,
    tools: t("Remotion: la propuesta, los paneles y la app, con narradora y música", "Remotion: the proposal, dashboards and app, with narration and music"),
    label: t("Film de producto · te_Cargo", "Product film · te_Cargo · narrated in Spanish"),
  },
  {
    slug: "una-sola-casa",
    title: t("Una sola casa · gimnasios", "One home · gyms"),
    src: "/portfolio/video-ia/una-sola-casa.mp4",
    poster: "/portfolio/video-ia/una-sola-casa-poster.webp",
    landscape: { src: "/demos/gimnasios/film.mp4", poster: "/demos/gimnasios/film.webp" },
    duration: 88,
    tools: t("Remotion: la plataforma para gimnasios contada por dentro, con narrador y música", "Remotion: the gym platform told from the inside, with narration and music"),
    label: t("Demo de marca blanca · datos de ejemplo", "White-label demo · sample data · narrated in Spanish"),
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
];
