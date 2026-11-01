import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/config/site";
import { PAGINAS_SEO } from "@/data/seo/paginas";

// Los íconos los genera scripts/brand-icons.ts.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PAGINAS_SEO.inicio.title.es,
    short_name: SITE_IDENTITY.brand,
    description: PAGINAS_SEO.inicio.description.es,
    start_url: "/",
    lang: "es",
    display: "browser",
    background_color: "#0B0B0A",
    theme_color: "#0B0B0A",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
