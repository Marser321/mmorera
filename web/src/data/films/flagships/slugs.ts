/**
 * Casos con film insignia. Lista liviana (sin guiones ni copia) para que la
 * navegación pueda marcarlos sin cargar los datos de cada film; el test de
 * flagships exige que coincida con FLAGSHIP_FILMS.
 */
export const FLAGSHIP_SLUGS = ["ad-media-solution", "fenix-medical-center", "lb-elite-wash-detail", "mr-studio-tattoo", "new-brothers-barberia", "truckers-choice"] as const;

export function hasFlagshipFilm(slug: string) {
  return (FLAGSHIP_SLUGS as readonly string[]).includes(slug);
}

export type FlagshipSlug = (typeof FLAGSHIP_SLUGS)[number];
export type StillKind = "og" | "hero";

/**
 * Cuadros fijos de cada film, congelados por `scripts/build-film-stills.ts`:
 * `og`, la apertura con la marca y su frase, para compartir el caso; `hero`,
 * la escena protagonista, para el índice de proyectos del home.
 */
export const FLAGSHIP_STILLS: Record<FlagshipSlug, Record<StillKind, number>> = {
  "ad-media-solution": { og: 215, hero: 1150 },
  "fenix-medical-center": { og: 190, hero: 1000 },
  "lb-elite-wash-detail": { og: 420, hero: 1000 },
  "mr-studio-tattoo": { og: 215, hero: 1050 },
  "new-brothers-barberia": { og: 215, hero: 1300 },
  "truckers-choice": { og: 215, hero: 730 },
};

/** Duración de cada film en segundos, para las tarjetas (el test la ata a FLAGSHIP_FILMS). */
export const FLAGSHIP_SECONDS: Record<FlagshipSlug, number> = {
  "ad-media-solution": 72.5,
  "fenix-medical-center": 79.5,
  "lb-elite-wash-detail": 74.5,
  "mr-studio-tattoo": 71.5,
  "new-brothers-barberia": 77,
  "truckers-choice": 75.5,
};

export const STILL_SIZE: Record<StillKind, { w: number; h: number }> = { og: { w: 1200, h: 630 }, hero: { w: 1600, h: 900 } };

export function flagshipStill(slug: string, kind: StillKind, language: "es" | "en") {
  return hasFlagshipFilm(slug) ? `/portfolio/films/${slug}/${kind}-${language}.jpg` : undefined;
}
