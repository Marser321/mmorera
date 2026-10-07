import landscape from "../ad-media-architecture.json";
import portrait from "../ad-media-architecture.portrait.json";
import translation from "../ad-media-architecture.en.json";
import landscapeEs from "../ad-media-architecture.layout.json";
import landscapeEn from "../ad-media-architecture.en.layout.json";
import portraitEs from "../ad-media-architecture.portrait.layout.json";
import portraitEn from "../ad-media-architecture.portrait.en.layout.json";
import type { ArchifyArchitecture, ArchifyLayout, ArchifyTranslation } from "../archify";
import type { ArchitectureBundle } from "../bundle";

/** AD Media Solution: Arquitectura de CRM y Marca Blanca (fuente: AD Media Solution, ver dossier). */
export const bundle: ArchitectureBundle = {
  slug: "ad-media-solution",
  diagrams: { landscape: landscape as unknown as ArchifyArchitecture, portrait: portrait as unknown as ArchifyArchitecture },
  translation: translation as ArchifyTranslation,
  layouts: {
    landscape: { es: landscapeEs as unknown as ArchifyLayout, en: landscapeEn as unknown as ArchifyLayout },
    portrait: { es: portraitEs as unknown as ArchifyLayout, en: portraitEn as unknown as ArchifyLayout },
  },
};
