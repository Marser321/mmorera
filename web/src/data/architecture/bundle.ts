import { localizeDiagram, type ArchifyArchitecture, type ArchifyLayout, type ArchifyTranslation } from "./archify";
import type { FilmLanguage } from "../films/filmTypes";

export type ArchitectureOrientation = "landscape" | "portrait";

/**
 * Todo lo que hace falta para dibujar la arquitectura de un caso: el diagrama
 * en español (apaisado y vertical), su traducción y la geometría congelada por
 * Archify para cada combinación de orientación e idioma.
 */
export interface ArchitectureBundle {
  slug: string;
  diagrams: Record<ArchitectureOrientation, ArchifyArchitecture>;
  translation: ArchifyTranslation;
  layouts: Record<ArchitectureOrientation, Record<FilmLanguage, ArchifyLayout>>;
}

/** Diagrama y geometría listos para un idioma y una orientación. */
export function resolveArchitecture(bundle: ArchitectureBundle, language: FilmLanguage, orientation: ArchitectureOrientation) {
  const base = bundle.diagrams[orientation];
  return {
    diagram: language === "en" ? localizeDiagram(base, bundle.translation) : base,
    layout: bundle.layouts[orientation][language],
  };
}
