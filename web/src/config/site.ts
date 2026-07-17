import type { SiteIdentity } from "@/types/site";

export const SITE_IDENTITY: SiteIdentity = {
  brand: "Mario Morera",
  role: {
    es: "Creative Technologist & Systems Builder",
    en: "Creative Technologist & Systems Builder",
  },
  canonical: "https://mmorera.agency",
  locale: { default: "es", alternate: "en" },
  location: {
    es: "Uruguay · Trabajo remoto",
    en: "Uruguay · Working remotely",
  },
  contact: {
    email: "mario@mmorera.agency",
    whatsapp: "https://wa.me/59892323675",
  },
  social: {
    github: "https://github.com/mariomorera",
    linkedin: "https://www.linkedin.com/in/mariomorera",
  },
  metadata: {
    title: {
      es: "Mario Morera — Creative Technologist & Systems Builder",
      en: "Mario Morera — Creative Technologist & Systems Builder",
    },
    description: {
      es: "Diseño y construyo experiencias, productos y sistemas que conectan tecnología creativa, desarrollo, IA, automatización y CRM.",
      en: "I design and build experiences, products and systems across creative technology, development, AI, automation and CRM.",
    },
  },
};

export const localePath = (language: "es" | "en", path: string) => {
  if (language === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
};
