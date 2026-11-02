import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath, SITE_IDENTITY } from "@/config/site";
import { FEATURED_CASES } from "@/data/projectCases";
import { SKILL_ORBIT, techsForFamily } from "@/data/skillOrbit";
import { CvContactActions } from "./CvContactActions";

const LINKEDIN = "https://www.linkedin.com/in/mario-sergio-morera-escobar-9a16521a4";
const copy = {
  es: {
    eyebrow: "Sobre mí · CV",
    title: "Mario Morera, AI Automation & Operations",
    intro: "Orquesto la tecnología de negocios y equipos: webs, automatizaciones, agentes de IA y contenido con IA. Trabajo en remoto y hablas directo conmigo.",
    pdf: "Descargar CV (PDF, español)", otherPdf: "También en inglés (PDF)",
    facts: "Datos rápidos", role: "AI Automation & Operations",
    experience: "6 años en desarrollo web e integraciones",
    languages: "Español nativo · inglés conversacional",
    availability: "Remoto (UTC−3) · jornada completa o proyectos",
    tools: "Con qué trabajo", cases: "Casos que puedes abrir", allCases: "Ver todos los casos",
    closing: "¿Buscas a alguien para tu equipo?", closingBody: "Escríbeme y te respondo yo.",
    external: "(se abre en otro sitio, en una pestaña nueva)",
  },
  en: {
    eyebrow: "About · Resume",
    title: "Mario Morera, AI Automation & Operations",
    intro: "I orchestrate technology for businesses and teams: websites, automations, AI agents and AI content. I work remotely and you talk to me directly.",
    pdf: "Download resume (PDF, English)", otherPdf: "Also in Spanish (PDF)",
    facts: "Quick facts", role: "AI Automation & Operations",
    experience: "6 years in web development and integrations",
    languages: "Native Spanish · conversational English",
    availability: "Remote (UTC−3) · full-time or projects",
    tools: "What I work with", cases: "Cases you can open", allCases: "See all cases",
    closing: "Hiring for your team?", closingBody: "Write to me and I'll reply myself.",
    external: "(opens another site in a new tab)",
  },
};

const heading = "text-balance text-2xl font-medium leading-tight tracking-[-.03em] text-foreground sm:text-3xl";

/** Lectura en servidor: familias y herramientas, sin órbita ni niveles de dominio. */
export function CvDocument({ language }: { language: "es" | "en" }) {
  const c = copy[language];
  const primaryPdf = `/cv/mario-morera-cv-${language}.pdf`;
  const otherPdf = `/cv/mario-morera-cv-${language === "es" ? "en" : "es"}.pdf`;

  return <main id="contenido-principal" lang={language} tabIndex={-1} className="focus:outline-none bg-background px-5 pb-28 pt-32 sm:px-8 sm:pt-40 lg:px-12">
    <article className="mx-auto max-w-5xl">
      <header className="max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[.16em] text-signal">{c.eyebrow}</p>
        <h1 className="mt-4 text-balance text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.04] tracking-[-.04em] text-foreground">{c.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/75 sm:text-lg">{c.intro}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={primaryPdf} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.pdf}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></a>
          <a href={otherPdf} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center text-sm text-foreground/80 underline underline-offset-4 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.otherPdf}</a>
        </div>
      </header>

      <section aria-labelledby="cv-facts" className="mt-14 border-t border-foreground/15 py-10 sm:mt-16">
        <h2 id="cv-facts" className={heading}>{c.facts}</h2>
        <ul className="mt-6 grid gap-x-10 gap-y-4 text-base leading-relaxed text-foreground/80 md:grid-cols-2">
          {[c.role, c.experience, c.languages, c.availability].map(fact => <li key={fact}>{fact}</li>)}
          <li className="flex flex-wrap items-center gap-x-2">
            <a href={`mailto:${SITE_IDENTITY.contact.email}`} className="inline-flex min-h-11 items-center break-all underline underline-offset-4 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{SITE_IDENTITY.contact.email}</a>
            <span aria-hidden="true">·</span>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-describedby="cv-linkedin-notice" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">LinkedIn</a>
            <span id="cv-linkedin-notice" className="sr-only">{c.external}</span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="cv-tools" className="border-t border-foreground/15 py-10">
        <h2 id="cv-tools" className={heading}>{c.tools}</h2>
        <dl className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_ORBIT.map(family => <div key={family.id} className="border-t border-foreground/15 pt-4">
            <dt className="text-base font-semibold text-foreground">{family.label[language]}</dt>
            <dd className="mt-2 text-sm leading-7 text-foreground/75">{techsForFamily(family.id).map(tech => tech.name).join(" · ")}</dd>
          </div>)}
        </dl>
      </section>

      <section aria-labelledby="cv-cases" className="border-t border-foreground/15 py-10">
        <h2 id="cv-cases" className={heading}>{c.cases}</h2>
        <ul className="mt-5 divide-y divide-foreground/15">
          {FEATURED_CASES.slice(0, 3).map(project => <li key={project.slug}>
            <Link href={localePath(language, `/casos-de-exito/${project.slug}`)} className="inline-flex min-h-12 items-center gap-3 py-2 text-base font-medium text-foreground/85 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{project.title[language]}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link>
          </li>)}
        </ul>
        <Link href={localePath(language, "/casos-de-exito")} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-signal underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.allCases}</Link>
      </section>

      <section aria-labelledby="cv-contact" className="border-t border-foreground/15 py-10">
        <h2 id="cv-contact" className={heading}>{c.closing}</h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/75">{c.closingBody}</p>
        <CvContactActions language={language} email={SITE_IDENTITY.contact.email} />
      </section>
    </article>
  </main>;
}
