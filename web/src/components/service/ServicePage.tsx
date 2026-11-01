import type { ReactNode, Ref } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { getProjectCase } from "@/data/projectCases";
import { TryItButtons } from "@/components/shared/TryItButtons";
import type { ServicePageContent, ServicePageCta } from "@/types/servicePage";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";
const heading = "text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-.03em] text-foreground";

export interface ServicePageProps {
  content: ServicePageContent;
  language: "es" | "en";
  howItWorks?: ReactNode;
  heroRef?: Ref<HTMLElement>;
}

export function ServicePage({ content, language, howItWorks, heroRef }: ServicePageProps) {
  const { hero, audience, tools, proof, hiring, closing } = content;
  const cases = proof?.slugs.flatMap(slug => { const project = getProjectCase(slug); return project ? [project] : []; }) ?? [];
  const cta = (action: ServicePageCta) => <Link href={localePath(language, action.href ?? "/aplicar")} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{action.label[language]}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>;

  return <main id="contenido-principal" className="bg-background pb-28 pt-32 sm:pt-40">
    <header ref={heroRef} data-service-section="hero" className={`${container} pb-12 sm:pb-16`}>
      {hero.eyebrow && <p className="text-xs font-medium uppercase tracking-[.16em] text-signal">{hero.eyebrow[language]}</p>}
      <h1 className="mt-4 max-w-5xl text-[clamp(2.4rem,5.5vw,5rem)] font-medium leading-[1.02] tracking-[-.04em] text-foreground">{hero.title[language]}</h1>
      {hero.body && <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/75 sm:text-xl">{hero.body[language]}</p>}
      {hero.cta && <div className="mt-7">{cta(hero.cta)}</div>}
    </header>

    {audience && <section data-service-section="audience" className={`${container} border-t border-foreground/15 py-10 sm:py-14`}>
      {audience.title && <h2 className={heading}>{audience.title[language]}</h2>}
      <div className="mt-5 grid max-w-5xl gap-6 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-foreground">{audience.for[language]}</p>
        {audience.notFor && <p className="text-base leading-relaxed text-foreground/75">{audience.notFor[language]}</p>}
      </div>
    </section>}

    {tools && <p data-service-section="tools" className={`${container} pb-12 text-sm leading-relaxed text-foreground/75`}>{tools[language]}</p>}

    {(content.howItWorks?.title || content.howItWorks?.body || howItWorks) && <section data-service-section="how" className="py-8 sm:py-12">
      {content.howItWorks && <div className={`${container} mb-8`}>
        {content.howItWorks.title && <h2 className={heading}>{content.howItWorks.title[language]}</h2>}
        {content.howItWorks.body && <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75">{content.howItWorks.body[language]}</p>}
      </div>}
      {howItWorks}
    </section>}

    {cases.length > 0 && <section data-service-section="proof" className={`${container} py-12 sm:py-20`}>
      {proof?.title && <h2 className={heading}>{proof.title[language]}</h2>}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {cases.map(project => <article key={project.slug} className="min-w-0 border-t border-foreground/15 pt-6">
          <h3 className="text-2xl font-medium leading-tight text-foreground"><Link href={localePath(language, `/casos-de-exito/${project.slug}`)} className="hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{project.title[language]}</Link></h3>
          <p className="my-4 max-w-prose text-sm leading-relaxed text-foreground/75">{project.summary[language]}</p>
          <TryItButtons links={project.tryIt} language={language} idPrefix={`service-${project.slug}`} />
        </article>)}
      </div>
    </section>}

    {hiring && Boolean(hiring.title || hiring.steps?.length || hiring.price) && <section data-service-section="hiring" className={`${container} border-t border-foreground/15 py-12 sm:py-20`}>
      {hiring.title && <h2 className={heading}>{hiring.title[language]}</h2>}
      {Boolean(hiring.steps?.length) && <ol className="mt-8 grid gap-8 md:grid-cols-3">{hiring.steps?.map((step, index) => <li key={step.title[language]}>
        <span aria-hidden="true" className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="mt-3 text-xl font-medium text-foreground">{step.title[language]}</h3><p className="mt-3 text-sm leading-relaxed text-foreground/75">{step.body[language]}</p>
      </li>)}</ol>}
      {hiring.price && <p className="mt-8 text-sm leading-relaxed text-foreground/75">{hiring.price[language]}</p>}
    </section>}

    {closing && (closing.title || closing.cta) && <section data-service-section="closing" className="banda-marfil py-12 sm:py-20">
      <div className={`${container} flex flex-wrap items-center justify-between gap-8`}>
        {closing.title && <h2 className={`${heading} max-w-4xl`}>{closing.title[language]}</h2>}
        {closing.cta && cta(closing.cta)}
      </div>
    </section>}
  </main>;
}
