import landscape from "../new-brothers-architecture.json";
import portrait from "../new-brothers-architecture.portrait.json";
import translation from "../new-brothers-architecture.en.json";
import landscapeEs from "../new-brothers-architecture.layout.json";
import landscapeEn from "../new-brothers-architecture.en.layout.json";
import portraitEs from "../new-brothers-architecture.portrait.layout.json";
import portraitEn from "../new-brothers-architecture.portrait.en.layout.json";
import type { ArchifyArchitecture, ArchifyLayout, ArchifyTranslation } from "../archify";
import type { ArchitectureBundle } from "../bundle";

/** New Brothers: CRM propio sobre Supabase (fuente: D:\Barberia, ver dossier). */
export const bundle: ArchitectureBundle = {
  slug: "new-brothers-barberia",
  diagrams: { landscape: landscape as unknown as ArchifyArchitecture, portrait: portrait as unknown as ArchifyArchitecture },
  translation: translation as ArchifyTranslation,
  layouts: {
    landscape: { es: landscapeEs as unknown as ArchifyLayout, en: landscapeEn as unknown as ArchifyLayout },
    portrait: { es: portraitEs as unknown as ArchifyLayout, en: portraitEn as unknown as ArchifyLayout },
  },
};
