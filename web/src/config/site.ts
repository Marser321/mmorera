import type { SiteIdentity } from "@/types/site";

export const SITE_IDENTITY: SiteIdentity = {
  brand: "Mario Morera",
  role: {
    es: "AI Automation & Operations · Orquestador de tecnología",
    en: "AI Automation & Operations · Technology orchestrator",
  },
  canonical: "https://mmorera.agency",
  locale: { default: "es", alternate: "en" },
  contact: {
    email: "mario@mmorera.agency",
    whatsapp: "https://wa.me/59892323675",
  },
  metadata: {
    title: {
      es: "Mario Morera — AI Automation & Operations",
      en: "Mario Morera — AI Automation & Operations",
    },
    description: {
      es: "Orquesto la tecnología de negocios y equipos: webs, automatizaciones, agentes de IA y contenido con IA. Trabajas directo conmigo, en remoto.",
      en: "I orchestrate technology for businesses and teams: websites, automations, AI agents and AI content. You work directly with me, remotely.",
    },
  },
};

export const localePath = (language: "es" | "en", path: string) => {
  if (language === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
};
