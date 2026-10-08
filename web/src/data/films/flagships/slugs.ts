/**
 * Casos con film insignia. Lista liviana (sin guiones ni copia) para que la
 * navegación pueda marcarlos sin cargar los datos de cada film; el test de
 * flagships exige que coincida con FLAGSHIP_FILMS.
 */
export const FLAGSHIP_SLUGS = [
  "ad-media-solution",
  "america-tramites",
  "autohub-360",
  "doge-sm",
  "evowrap",
  "fenix-medical-center",
  "hub-profesional-ai",
  "lb-elite-wash-detail",
  "lnb-saas",
  "mr-studio-tattoo",
  "new-brothers-barberia",
  "punta-360",
  "rangel-oviedo-group",
  "truckers-choice",
] as const;

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
  "america-tramites": { og: 215, hero: 750 },
  "autohub-360": { og: 80, hero: 650 },
  "doge-sm": { og: 215, hero: 750 },
  evowrap: { og: 215, hero: 900 },
  "fenix-medical-center": { og: 190, hero: 1000 },
  "hub-profesional-ai": { og: 150, hero: 750 },
  "lb-elite-wash-detail": { og: 420, hero: 1000 },
  "lnb-saas": { og: 215, hero: 825 },
  "mr-studio-tattoo": { og: 215, hero: 1050 },
  "new-brothers-barberia": { og: 215, hero: 1300 },
  "punta-360": { og: 215, hero: 825 },
  "rangel-oviedo-group": { og: 215, hero: 750 },
  "truckers-choice": { og: 215, hero: 730 },
};

/** Duración de cada film en segundos, para las tarjetas (el test la ata a FLAGSHIP_FILMS). */
export const FLAGSHIP_SECONDS: Record<FlagshipSlug, number> = {
  "ad-media-solution": 72.5,
  "america-tramites": 72.5,
  "autohub-360": 74.5,
  "doge-sm": 71.5,
  evowrap: 75.5,
  "fenix-medical-center": 79.5,
  "hub-profesional-ai": 71.5,
  "lb-elite-wash-detail": 74.5,
  "lnb-saas": 71.5,
  "mr-studio-tattoo": 71.5,
  "new-brothers-barberia": 77,
  "punta-360": 71.5,
  "rangel-oviedo-group": 77,
  "truckers-choice": 75.5,
};

/** Duración del film como en un reproductor (79,5 s → "1:20"); undefined si el caso no tiene film. */
export function flagshipRuntime(slug: string) {
  if (!hasFlagshipFilm(slug)) return undefined;
  const total = Math.round(FLAGSHIP_SECONDS[slug as FlagshipSlug]);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export const STILL_SIZE: Record<StillKind, { w: number; h: number }> = { og: { w: 1200, h: 630 }, hero: { w: 1600, h: 900 } };

export function flagshipStill(slug: string, kind: StillKind, language: "es" | "en") {
  return hasFlagshipFilm(slug) ? `/portfolio/films/${slug}/${kind}-${language}.jpg` : undefined;
}
