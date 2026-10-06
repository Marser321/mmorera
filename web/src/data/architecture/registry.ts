import type { ArchitectureBundle } from "./bundle";

/**
 * Casos con arquitectura publicada. Cada bundle se pide recién cuando hace
 * falta (film montado o sección "Bajo el capó" a la vista), así los JSON no
 * viajan en el HTML inicial.
 */
export const ARCHITECTURE_LOADERS: Record<string, () => Promise<ArchitectureBundle>> = {
  "fenix-medical-center": () => import("./bundles/fenix-medical-center").then((module) => module.bundle),
  "new-brothers-barberia": () => import("./bundles/new-brothers-barberia").then((module) => module.bundle),
};

export function hasArchitecture(slug: string) {
  return slug in ARCHITECTURE_LOADERS;
}

export function loadArchitecture(slug: string) {
  const load = ARCHITECTURE_LOADERS[slug];
  return load ? load() : Promise.resolve(null);
}
