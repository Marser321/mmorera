import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/config/site";
import { PROJECT_CASES } from "@/data/projectCases";
import { CAPABILITY_SLUGS, LAB_SLUGS, USE_CASE_SLUGS } from "@/data/branchPages";
import { RECORRIDOS_PATH } from "@/data/recorridos";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_IDENTITY.canonical;
  const core = ["", "/casos-de-exito", "/sistemas", "/estudio", "/fabricas", "/agentes", "/campanas", "/sobre-mi", "/aplicar", "/privacidad", "/terminos", "/cookies"];
  const cases = PROJECT_CASES.map(({ slug }) => `/casos-de-exito/${slug}`);
  const branches = [
    "/capacidades", ...Object.values(CAPABILITY_SLUGS).map((slug) => `/capacidades/${slug}`),
    "/casos-de-uso", ...Object.values(USE_CASE_SLUGS).map((slug) => `/casos-de-uso/${slug}`), RECORRIDOS_PATH,
    "/lab", ...Object.values(LAB_SLUGS).map((slug) => `/lab/${slug}`),
  ];
  return [...core, ...cases, ...branches].flatMap((route) => {
    const english = route ? `/en${route}` : "/en";
    // x-default: la versión en español, para quien no habla ninguno de los dos.
    const languages = { es: `${base}${route}`, en: `${base}${english}`, "x-default": `${base}${route}` };
    return [
      { url: `${base}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8, alternates: { languages } },
      { url: `${base}${english}`, changeFrequency: "monthly" as const, priority: route === "" ? 0.9 : 0.7, alternates: { languages } },
    ];
  });
}
