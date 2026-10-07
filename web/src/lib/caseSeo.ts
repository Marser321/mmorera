import type { Metadata } from "next";
import { SITE_IDENTITY, localePath } from "@/config/site";
import { STILL_SIZE, flagshipStill } from "@/data/films/flagships/slugs";
import type { ProjectCase } from "@/types/site";

type Language = "es" | "en";

const COPY = {
  es: { home: "Inicio", cases: "Casos de éxito", still: (title: string) => `Cuadro del film de ${title}` },
  en: { home: "Home", cases: "Case studies", still: (title: string) => `Frame from the ${title} film` },
} as const;

export const casePath = (slug: string, language: Language) => localePath(language, `/casos-de-exito/${slug}`);

/** Para compartir: un cuadro del film insignia o, si el caso no tiene, su portada. */
export function caseShareImage(project: ProjectCase, language: Language) {
  const still = flagshipStill(project.slug, "og", language);
  if (still) return { url: still, width: STILL_SIZE.og.w, height: STILL_SIZE.og.h, alt: COPY[language].still(project.title[language]) };
  return { url: project.media[0].src, alt: project.media[0].alt[language] };
}

export function caseMetadata(project: ProjectCase, language: Language): Metadata {
  const title = project.title[language];
  const description = project.summary[language];
  const image = caseShareImage(project, language);
  const url = casePath(project.slug, language);
  // `openGraph` y `twitter` reemplazan los del layout enteros: se repite lo común.
  return {
    title,
    description,
    alternates: { canonical: url, languages: { es: casePath(project.slug, "es"), en: casePath(project.slug, "en") } },
    openGraph: { type: "article", url, title: `${title} — ${SITE_IDENTITY.brand}`, description, siteName: SITE_IDENTITY.brand, locale: language === "es" ? "es_ES" : "en_US", images: [image] },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE_IDENTITY.brand}`, description, images: [image.url] },
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

/** JSON listo para `<script type="application/ld+json">`: sin `<` que cierre la etiqueta. */
export const jsonLdHtml = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
