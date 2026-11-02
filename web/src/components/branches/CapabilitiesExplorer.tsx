"use client";

import { localePath } from "@/config/site";
import { CAPABILITY_SLUGS } from "@/data/branchPages";
import { CapabilitiesOrbit } from "@/components/premium/estudio/CapabilitiesOrbit";
import type { Family } from "@/data/techStack";

/** Con la órbita cerrada, el fondo queda sin familias: referencia estable para el callback de la órbita. */
const NO_FAMILIES: Family[] = [];

/** El menú de capacidades de /capacidades: la órbita que mueve las partículas y corre los films. */
export function CapabilitiesExplorer({ language }: { language: "es" | "en" }) {
  return (
    <CapabilitiesOrbit
      language={language}
      showHeader={false}
      defaultFamilies={NO_FAMILIES}
      familyHref={(family) => localePath(language, `/capacidades/${CAPABILITY_SLUGS[family]}`)}
    />
  );
}
