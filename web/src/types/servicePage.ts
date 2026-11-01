import type { LocalizedText } from "./site";

export interface ServicePageCta {
  label: LocalizedText;
  /** Ruta sin prefijo de idioma; por defecto /aplicar. */
  href?: string;
}

/** Contrato para src/data/servicePages.ts, propiedad de Claude. */
export interface ServicePageContent {
  hero: { eyebrow?: LocalizedText; title: LocalizedText; body?: LocalizedText; cta?: ServicePageCta };
  audience?: { title?: LocalizedText; for: LocalizedText; notFor?: LocalizedText };
  tools?: LocalizedText;
  /** El componente interactivo se pasa como slot, nunca como dato serializado. */
  howItWorks?: { title?: LocalizedText; body?: LocalizedText };
  proof?: { title?: LocalizedText; slugs: string[] };
  hiring?: { title?: LocalizedText; steps?: { title: LocalizedText; body: LocalizedText }[]; price?: LocalizedText };
  closing?: { title?: LocalizedText; cta?: ServicePageCta };
}
