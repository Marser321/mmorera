import { ServicePage } from "@/components/service/ServicePage";
import { FamilyParticles } from "@/components/branches/FamilyParticles";
import { AgentDemo } from "@/components/premium/agentes/AgentDemo";
import { SERVICE_PAGES } from "@/data/servicePages";
import { getServiceHeroFilm } from "@/data/serviceHeroFilms";

/** /agentes: la página de servicio de Agentes de IA con la demo guiada en «Cómo funciona». */
export function AgentesDocument({ language }: { language: "es" | "en" }) {
  return <>
    <FamilyParticles families={["AI", "Automation", "CRM"]} />
    <ServicePage content={SERVICE_PAGES.agentes} language={language} heroFilm={getServiceHeroFilm("agentes", language)} howItWorks={<AgentDemo language={language} />} />
  </>;
}
