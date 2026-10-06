import { createContext, useContext, type ReactNode } from "react";
import type { CaseBrand } from "@/data/brands/caseBrands";

const BrandContext = createContext<CaseBrand | null>(null);

/** Marca activa dentro de una composición de film de caso. */
export function BrandProvider({ brand, children }: { brand: CaseBrand; children: ReactNode }) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand(): CaseBrand {
  const brand = useContext(BrandContext);
  if (!brand) throw new Error("useBrand() fuera de un BrandProvider");
  return brand;
}

/** Mezcla un color de la marca con transparencia (glows, velos, bordes). */
export const alpha = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`;

/** Generador pseudoaleatorio con semilla: mismo frame, mismo dibujo (scrub seguro). */
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
