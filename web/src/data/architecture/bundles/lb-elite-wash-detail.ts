import landscape from "../lb-wash-architecture.json";
import portrait from "../lb-wash-architecture.portrait.json";
import translation from "../lb-wash-architecture.en.json";
import landscapeEs from "../lb-wash-architecture.layout.json";
import landscapeEn from "../lb-wash-architecture.en.layout.json";
import portraitEs from "../lb-wash-architecture.portrait.layout.json";
import portraitEn from "../lb-wash-architecture.portrait.en.layout.json";
import type { ArchifyArchitecture, ArchifyLayout, ArchifyTranslation } from "../archify";
import type { ArchitectureBundle } from "../bundle";

/** L&B Elite Wash & Detail: Agenda y CRM sin base de datos (fuente: LyB Elite Wash Details, ver dossier). */
export const bundle: ArchitectureBundle = {
  slug: "lb-elite-wash-detail",
  diagrams: { landscape: landscape as unknown as ArchifyArchitecture, portrait: portrait as unknown as ArchifyArchitecture },
  translation: translation as ArchifyTranslation,
  layouts: {
    landscape: { es: landscapeEs as unknown as ArchifyLayout, en: landscapeEn as unknown as ArchifyLayout },
    portrait: { es: portraitEs as unknown as ArchifyLayout, en: portraitEn as unknown as ArchifyLayout },
  },
};
