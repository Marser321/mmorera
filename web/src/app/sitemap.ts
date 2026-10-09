import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/config/site";
import { PROJECT_CASES } from "@/data/projectCases";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_IDENTITY.canonical;
  const core = ["", "/casos-de-exito", "/sistemas", "/estudio", "/aplicar", "/privacidad"];
  const cases = PROJECT_CASES.map(({ slug }) => `/casos-de-exito/${slug}`);
  return [...core, ...cases].flatMap((route) => {
    const english = route ? `/en${route}` : "/en";
    // x-default: la versión en español, para quien no habla ninguno de los dos.
    const languages = { es: `${base}${route}`, en: `${base}${english}`, "x-default": `${base}${route}` };
    return [
      { url: `${base}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8, alternates: { languages } },
      { url: `${base}${english}`, changeFrequency: "monthly" as const, priority: route === "" ? 0.9 : 0.7, alternates: { languages } },
    ];
  });
}
