import manifest from "./caseGallery.generated.json";

/**
 * Galería de cada caso: páginas reales del sitio en vivo, en tres pantallas.
 * El JSON lo escribe `scripts/capture-case-gallery.ts`: no editar a mano.
 */
export const GALLERY_DEVICES = ["desktop", "tablet", "mobile"] as const;
export type GalleryDevice = (typeof GALLERY_DEVICES)[number];

export interface GalleryShot {
  src: string;
  width: number;
  height: number;
  /** Huella visual: permite comprobar que dos vistas no son la misma imagen. */
  hash: string;
}

export interface GalleryView {
  id: string;
  label: { es: string; en: string };
  /** La página real en el sitio del caso. */
  url: string;
  desktop: GalleryShot;
  /** Falta si esa pantalla falló en el sitio en vivo: se muestra lo que hay. */
  tablet?: GalleryShot;
  mobile?: GalleryShot;
}

export interface CaseGallery {
  capturedAt: string;
  views: GalleryView[];
}

export type CaseGalleryManifest = Record<string, CaseGallery>;

const GALLERIES = manifest as CaseGalleryManifest;

export function getCaseGallery(slug: string): CaseGallery | undefined {
  const gallery = GALLERIES[slug];
  return gallery && gallery.views.length > 0 ? gallery : undefined;
}

export const caseGallerySlugs = () => Object.keys(GALLERIES);
