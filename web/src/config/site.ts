import type { SiteIdentity } from "@/types/site";

export const SITE_IDENTITY: SiteIdentity = {
  brand: "Mario Morera",
  role: {
    es: "Creative Technologist & Systems Builder",
    en: "Creative Technologist & Systems Builder",
  },
  canonical: "https://mmorera.agency",
  locale: { default: "es", alternate: "en" },
  contact: {
    email: "mario@mmorera.agency",
    whatsapp: "https://wa.me/59892323675",
  },
  metadata: {
    title: {
      es: "Mario Morera — Creative Technologist & Systems Builder",
      en: "Mario Morera — Creative Technologist & Systems Builder",
    },
    description: {
      es: "Diseño y construyo experiencias, productos y sistemas, del concepto a la operación.",
      en: "I design and build experiences, products and systems, from concept to operations.",
    },
  },
};

export const localePath = (language: "es" | "en", path: string) => {
  if (language === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
};
