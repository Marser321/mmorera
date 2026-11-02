import { LogoOvertureSection } from "@/components/films/LogoOvertureSection";
import { AuthorManifestoScene } from "@/components/premium/AuthorManifestoScene";
import { CvDocument } from "@/app/cv/_components/CvDocument";
import { ABOUT_MANIFESTO } from "@/data/branchPages";

const TITLE = {
  es: "Sobre mí: Mario Morera, AI Automation & Operations",
  en: "About: Mario Morera, AI Automation & Operations",
};

/**
 * /sobre-mi: la entrada del monograma, la película de autor (Crear, construir,
 * escalar) y el CV abajo (#cv). Recupera la cinemática que salió del home
 * (T21) en su propia página, como pidió Mario el 1/11.
 */
export function SobreMiDocument({ language }: { language: "es" | "en" }) {
  return <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-background pt-16 focus:outline-none sm:pt-20">
    <h1 className="sr-only">{TITLE[language]}</h1>
    <LogoOvertureSection />
    <AuthorManifestoScene language={language} copy={ABOUT_MANIFESTO[language]} />
    <CvDocument language={language} embedded />
  </main>;
}
