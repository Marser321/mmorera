import landscape from "../fenix-system-architecture.json";
import portrait from "../fenix-system-architecture.portrait.json";
import translation from "../fenix-system-architecture.en.json";
import landscapeEs from "../fenix-system-architecture.layout.json";
import landscapeEn from "../fenix-system-architecture.en.layout.json";
import portraitEs from "../fenix-system-architecture.portrait.layout.json";
import portraitEn from "../fenix-system-architecture.portrait.en.layout.json";
import type { ArchifyArchitecture, ArchifyLayout, ArchifyTranslation } from "../archify";
import type { ArchitectureBundle } from "../bundle";

/**
 * Fenix Medical Center: sitio, reserva y frontera de compliance. Solo lo
 * verificado en el repo del cliente (docs/films/dossiers/fenix.md, secciones
 * "Sitio y CRM" e "Investigación"): /api/lead fail-closed, WAF 5/10 min,
 * 7 campos sin texto libre (ADR-058/189), ghl.ts contra la REST de GHL,
 * pipeline "Fenix | Website Leads" (New → Scheduled), CAPI sin datos personales.
 */
export const bundle: ArchitectureBundle = {
  slug: "fenix-medical-center",
  diagrams: { landscape: landscape as unknown as ArchifyArchitecture, portrait: portrait as unknown as ArchifyArchitecture },
  translation: translation as ArchifyTranslation,
  layouts: {
    landscape: { es: landscapeEs as unknown as ArchifyLayout, en: landscapeEn as unknown as ArchifyLayout },
    portrait: { es: portraitEs as unknown as ArchifyLayout, en: portraitEn as unknown as ArchifyLayout },
  },
};
