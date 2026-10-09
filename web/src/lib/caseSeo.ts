import type { Metadata } from "next";
import { SITE_IDENTITY, localePath } from "@/config/site";
import { STILL_SIZE, flagshipStill } from "@/data/films/flagships/slugs";
import type { ProjectCase } from "@/types/site";
import { OG_LOCALE, OG_SIZE, idiomasDe, recortarDescripcion } from "@/lib/seo";

export { jsonLdHtml } from "@/lib/seo";

type Language = "es" | "en";

const COPY = {
  es: { home: "Inicio", cases: "Casos de éxito", still: (title: string) => `Cuadro del film de ${title}` },
  en: { home: "Home", cases: "Case studies", still: (title: string) => `Frame from the ${title} film` },
} as const;

export const casePath = (slug: string, language: Language) => localePath(language, `/casos-de-exito/${slug}`);

/* Casos sin film: su portada recortada a 1200×630 y liviana (WhatsApp no
   muestra vistas previas de imágenes pesadas). La genera scripts/og-images.ts. */
const PORTADAS_SIN_FILM: Record<string, string> = {
  "cana-vacations": "/og/casos/cana-vacations.jpg",
};

/** Para compartir: un cuadro del film insignia o, si el caso no tiene, su portada. */
export function caseShareImage(project: ProjectCase, language: Language) {
  const still = flagshipStill(project.slug, "og", language);
  if (still) return { url: still, width: STILL_SIZE.og.w, height: STILL_SIZE.og.h, alt: COPY[language].still(project.title[language]) };
  const portada = PORTADAS_SIN_FILM[project.slug];
  if (portada) return { url: portada, ...OG_SIZE, alt: project.media[0].alt[language] };
  return { url: project.media[0].src, alt: project.media[0].alt[language] };
}

export function caseMetadata(project: ProjectCase, language: Language): Metadata {
  const title = project.title[language];
  // El resumen completo se lee en la página; al buscador va cortado a ~158.
  const description = recortarDescripcion(project.summary[language]);
  const image = caseShareImage(project, language);
  const url = casePath(project.slug, language);
  // `openGraph` y `twitter` reemplazan los del layout enteros: se repite lo común.
  return {
    title,
    description,
    alternates: { canonical: url, languages: idiomasDe(`/casos-de-exito/${project.slug}`) },
    openGraph: {
      type: "article",
      url,
      title: `${title} — ${SITE_IDENTITY.brand}`,
      description,
      siteName: SITE_IDENTITY.brand,
      locale: OG_LOCALE[language],
      alternateLocale: [OG_LOCALE[language === "es" ? "en" : "es"]],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE_IDENTITY.brand}`, description, images: [{ url: image.url, alt: image.alt }] },
  };
}

/** Datos estructurados del caso: la obra (con su autor) y la miga de pan. */
export function caseJsonLd(project: ProjectCase, language: Language) {
  const origin = SITE_IDENTITY.canonical;
  const url = `${origin}${casePath(project.slug, language)}`;
  const copy = COPY[language];
  const client = project.client?.[language].split(" · ")[0];
  const work = {
    "@type": "CreativeWork",
    "@id": `${url}#caso`,
    name: project.title[language],
    description: project.summary[language],
    url,
    inLanguage: language,
    image: `${origin}${caseShareImage(project, language).url}`,
    creator: { "@type": "Person", name: SITE_IDENTITY.brand, url: origin },
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.kind ? { genre: project.kind[language] } : {}),
    ...(client ? { about: { "@type": "Organization", name: client } } : {}),
    keywords: project.stack.join(", "),
  };
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.home, item: `${origin}${localePath(language, "/")}` },
      { "@type": "ListItem", position: 2, name: copy.cases, item: `${origin}${localePath(language, "/casos-de-exito")}` },
      { "@type": "ListItem", position: 3, name: project.title[language], item: url },
    ],
  };
  return { "@context": "https://schema.org", "@graph": [work, breadcrumbs] as const };
}
