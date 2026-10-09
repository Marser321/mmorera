import type { Metadata } from "next";
import { SITE_IDENTITY, localePath } from "@/config/site";
import { PAGINAS_SEO, PORTADAS_OG, portadaPath, type Language, type PaginaSeo } from "@/data/seo/paginas";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_LOCALE: Record<Language, string> = { es: "es_ES", en: "en_US" };
const OTRO: Record<Language, Language> = { es: "en", en: "es" };

/** Las dos versiones de una ruta, más `x-default` (la española) para el resto del mundo. */
export function idiomasDe(path: string) {
  return { es: localePath("es", path), en: localePath("en", path), "x-default": localePath("es", path) };
}

/**
 * Corta una descripción larga para el buscador (~158 caracteres). Si una
 * oración completa ya dice bastante (≥ 110), termina ahí; si no, corta en el
 * último espacio, sin dejar la frase colgando de una coma.
 */
export function recortarDescripcion(texto: string, max = 158) {
  if (texto.length <= max) return texto;
  const punto = texto.lastIndexOf(". ", max - 1);
  if (punto >= 110) return texto.slice(0, punto + 1);
  const corte = texto.slice(0, max - 1);
  const hasta = corte.slice(0, corte.lastIndexOf(" ")).replace(/[\s,;:·—-]+$/, "");
  return `${hasta}…`;
}

/** Metadatos completos de una página fija: canónica, hreflang, OG y tarjeta de X. */
export function pageMetadata(pagina: PaginaSeo, language: Language): Metadata {
  const data = PAGINAS_SEO[pagina];
  const portada = PORTADAS_OG[data.portada];
  const url = localePath(language, data.path);
  const title = data.title[language];
  const description = data.description[language];
  const fullTitle = data.tituloAbsoluto ? title : `${title} — ${SITE_IDENTITY.brand}`;
  const image = { url: portadaPath(data.portada, language), ...OG_SIZE, alt: portada.titular[language], type: "image/jpeg" };
  // `openGraph` y `twitter` reemplazan los del layout enteros: van completos.
  return {
    title: data.tituloAbsoluto ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: idiomasDe(data.path) },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_IDENTITY.brand,
      title: fullTitle,
      description,
      locale: OG_LOCALE[language],
      alternateLocale: [OG_LOCALE[OTRO[language]]],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [{ url: image.url, alt: image.alt }] },
  };
}

/** JSON listo para `<script type="application/ld+json">`: sin `<` que cierre la etiqueta. */
export const jsonLdHtml = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

const ORIGEN = SITE_IDENTITY.canonical;
export const PERSONA_ID = `${ORIGEN}/#mario`;

/** Quién es: va en todas las páginas, primero. Sin redes ni ubicación (no verificadas). */
export function personaJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSONA_ID,
    name: SITE_IDENTITY.brand,
    url: ORIGEN,
    jobTitle: SITE_IDENTITY.role.es,
    description: PAGINAS_SEO.inicio.description.es,
    email: `mailto:${SITE_IDENTITY.contact.email}`,
    knowsAbout: [
      "Diseño web",
      "Desarrollo web",
      "CRM",
      "Automatización de procesos",
      "Inteligencia artificial aplicada",
      "Dirección de arte",
      "Motion design",
    ],
  };
}

/** El sitio: nombre, idiomas y quién lo publica (ayuda a que Google muestre el nombre del sitio). */
export function sitioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${ORIGEN}/#sitio`,
    name: SITE_IDENTITY.brand,
    url: ORIGEN,
    inLanguage: ["es", "en"],
    publisher: { "@id": PERSONA_ID },
  };
}

/** El archivo de casos como lista: cada caso con su URL canónica. */
export function listaCasosJsonLd(casos: Array<{ slug: string; title: Record<Language, string> }>, language: Language) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGINAS_SEO.trabajo.title[language],
    url: `${ORIGEN}${localePath(language, "/casos-de-exito")}`,
    inLanguage: language,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: casos.map((caso, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: caso.title[language],
        url: `${ORIGEN}${localePath(language, `/casos-de-exito/${caso.slug}`)}`,
      })),
    },
  };
}
