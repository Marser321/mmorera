import type { LocalizedText } from "@/types/site";

const t = (es: string, en: string): LocalizedText => ({ es, en });

export type SampleAspect = "9:16" | "16:9" | "1:1" | "4:5";
export type SampleId = "persona" | "empresa" | "vsl" | "reel" | "historia" | "cuadrado" | "carrusel";

export interface ContentSample {
  id: SampleId;
  aspect: SampleAspect;
  /** Cuadros a 30 fps (los mismos de la composición de Remotion). */
  frames: number;
  /** De quién es el material: Mario o la marca de una web que hizo. */
  brand: string;
  style: LocalizedText;
  pitch: LocalizedText;
  /** Rótulo honesto: de dónde sale el material y que no es una campaña publicada. */
  source: LocalizedText;
  src: LocalizedText;
  poster: LocalizedText;
}

const media = (id: SampleId) => ({
  src: t(`/portfolio/video-ia/muestras/${id}-es.mp4`, `/portfolio/video-ia/muestras/${id}-en.mp4`),
  poster: t(`/portfolio/video-ia/muestras/${id}-es-poster.webp`, `/portfolio/video-ia/muestras/${id}-en-poster.webp`),
});

const fromSite = (brand: string) => t(`Material de la web de ${brand} · no es una campaña publicada`, `Material from ${brand}'s website · not a published campaign`);

/**
 * Las siete muestras de contenido (T49): los estilos que más se piden, cada
 * uno armado en código (Remotion) con las mejores escenas de una web que hizo
 * Mario, con la marca de esa web. Las renderiza scripts/render-trailer.ts.
 */
export const CONTENT_SAMPLES: ContentSample[] = [
  { id: "persona", aspect: "4:5", frames: 240, brand: "Mario Morera", style: t("Persona", "Personal brand"), pitch: t("Tu marca personal, con tu voz.", "Your personal brand, in your voice."), source: t("Con mi film de autor", "Made from my author film"), ...media("persona") },
  { id: "empresa", aspect: "16:9", frames: 240, brand: "Truckers Choice", style: t("Empresa", "Business"), pitch: t("Tu marca, en cada toma.", "Your brand in every shot."), source: fromSite("Truckers Choice"), ...media("empresa") },
  { id: "vsl", aspect: "16:9", frames: 240, brand: "Rangel Oviedo Group", style: t("VSL", "VSL"), pitch: t("Un video que vende mientras explica.", "A video that sells while it explains."), source: fromSite("Rangel Oviedo Group"), ...media("vsl") },
  { id: "reel", aspect: "9:16", frames: 240, brand: "Mr. Studio Tattoo", style: t("Reel", "Reel"), pitch: t("Ritmo para que lo miren hasta el final.", "Pace that keeps them watching."), source: fromSite("Mr. Studio Tattoo"), ...media("reel") },
  { id: "historia", aspect: "9:16", frames: 240, brand: "La Nueva Brasil", style: t("Historia", "Story"), pitch: t("Cerca, directa y con respuesta.", "Close, direct and interactive."), source: fromSite("La Nueva Brasil"), ...media("historia") },
  { id: "cuadrado", aspect: "1:1", frames: 240, brand: "Fenix Medical Center", style: t("Cuadrado", "Square"), pitch: t("Pensado para el feed.", "Made for the feed."), source: fromSite("Fenix Medical Center"), ...media("cuadrado") },
  { id: "carrusel", aspect: "4:5", frames: 360, brand: "EvoWrap", style: t("Carrusel", "Carousel"), pitch: t("Para leer, guardar y compartir.", "To read, save and share."), source: fromSite("EvoWrap"), ...media("carrusel") },
];

export const getContentSample = (id: SampleId) => CONTENT_SAMPLES.find((sample) => sample.id === id)!;
