import type { ReactNode, Ref } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { localePath } from "@/config/site";
import { getProjectCase } from "@/data/projectCases";
import { getCaseMedia } from "@/data/caseMedia";
import { TryItButtons } from "@/components/shared/TryItButtons";
import { ChapterDock, type DockChapter } from "@/components/layout/IslandBar";
import type { ServicePageContent, ServicePageCta } from "@/types/servicePage";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";
const heading = "text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-.03em] text-foreground";

// Capítulos de la barra flotante; cada página muestra solo los tramos que tiene.
const CHAPTERS = {
  intro: { id: "para-quien", icon: "users", es: "Para quién", en: "Who it's for" },
  how: { id: "como-funciona", icon: "play", es: "Cómo funciona", en: "How it works" },
  proof: { id: "casos", icon: "briefcase", es: "Casos", en: "Cases" },
  hiring: { id: "contratar", icon: "handshake", es: "Contratar", en: "Hiring" },
  closing: { id: "hablemos", icon: "message", es: "Hablemos", en: "Let's talk" },
} satisfies Record<string, DockChapter>;

export interface ServicePageProps {
  content: ServicePageContent;
  language: "es" | "en";
  howItWorks?: ReactNode;
  heroRef?: Ref<HTMLElement>;
}

/**
 * Plantilla de las páginas de servicio, en escenas: qué resuelve, para quién y
 * qué incluye en una sola mirada; después cómo funciona (el film o la demo),
 * la prueba con su imagen, cómo se contrata y el cierre. La barra flotante
 * lleva sus capítulos para saltar de una escena a otra.
 */
export function ServicePage({ content, language, howItWorks, heroRef }: ServicePageProps) {
  const { hero, audience, deliverables, tools, proof, hiring, closing } = content;
  const cases = proof?.slugs.flatMap(slug => { const project = getProjectCase(slug); return project ? [project] : []; }) ?? [];
  const cta = (action: ServicePageCta) => <Link href={localePath(language, action.href ?? "/aplicar")} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{action.label[language]}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>;
  const hasDeliverables = Boolean(deliverables && deliverables.items.length > 0);
  const hasIntro = Boolean(audience || hasDeliverables || tools);
  const hasHow = Boolean(content.howItWorks?.title || content.howItWorks?.body || howItWorks);
  const hasHiring = Boolean(hiring && (hiring.title || hiring.steps?.length || hiring.price));
  const hasClosing = Boolean(closing && (closing.title || closing.cta));
  const candidates: (DockChapter | false)[] = [
    hasIntro && CHAPTERS.intro,
    hasHow && CHAPTERS.how,
    cases.length > 0 && CHAPTERS.proof,
    hasHiring && CHAPTERS.hiring,
    hasClosing && CHAPTERS.closing,
  ];
  const chapters = candidates.filter((chapter): chapter is DockChapter => Boolean(chapter));

  return <main id="contenido-principal" className="bg-background pb-28 pt-32 sm:pt-40">
    <header ref={heroRef} data-service-section="hero" className={`${container} pb-12 sm:pb-16`}>
      {hero.eyebrow && <p className="text-xs font-medium uppercase tracking-[.16em] text-signal">{hero.eyebrow[language]}</p>}
      <h1 className="mt-4 max-w-5xl text-[clamp(2.4rem,5.5vw,5rem)] font-medium leading-[1.02] tracking-[-.04em] text-foreground">{hero.title[language]}</h1>
      {hero.body && <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/75 sm:text-xl">{hero.body[language]}</p>}
      {hero.cta && <div className="mt-7">{cta(hero.cta)}</div>}
    </header>

    {/* Una sola mirada: para quién es, qué incluye y con qué herramientas. */}
    {hasIntro && <section id={CHAPTERS.intro.id} data-service-section={audience ? "audience" : undefined} className={`${container} scroll-mt-24 border-t border-foreground/15 py-12 sm:py-16`}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-14">
        {audience && <div>
          {audience.title && <h2 className={heading}>{audience.title[language]}</h2>}
          <p className="mt-4 text-lg leading-relaxed text-foreground">{audience.for[language]}</p>
          {audience.notFor && <p className="mt-4 text-sm leading-relaxed text-foreground/70">{audience.notFor[language]}</p>}
        </div>}
        {hasDeliverables && deliverables && <div data-service-section="deliverables">
          {deliverables.title && <h2 className="text-xl font-medium leading-tight text-foreground">{deliverables.title[language]}</h2>}
          <ul className="mt-4 space-y-3">{deliverables.items.map(item => <li key={item[language]} className="flex gap-3 border-t border-foreground/15 pt-3 text-base leading-relaxed text-foreground">
            <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-signal" />{item[language]}
          </li>)}</ul>
        </div>}
        {tools && <div>
          <p aria-hidden="true" className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/60">{language === "es" ? "Herramientas" : "Tools"}</p>
          <p data-service-section="tools" className="mt-4 text-sm leading-relaxed text-foreground/75">{tools[language]}</p>
        </div>}
      </div>
    </section>}

    {hasHow && <section id={CHAPTERS.how.id} data-service-section="how" className="scroll-mt-24 py-8 sm:py-12">
      {content.howItWorks && <div className={`${container} mb-8`}>
        {content.howItWorks.title && <h2 className={heading}>{content.howItWorks.title[language]}</h2>}
        {content.howItWorks.body && <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75">{content.howItWorks.body[language]}</p>}
      </div>}
      {howItWorks}
    </section>}

    {/* La prueba se ve: la portada del reel de cada caso, su estado y cómo probarlo. */}
    {cases.length > 0 && <section id={CHAPTERS.proof.id} data-service-section="proof" className={`${container} scroll-mt-24 py-12 sm:py-20`}>
      {proof?.title && <h2 className={heading}>{proof.title[language]}</h2>}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map(project => {
          const href = localePath(language, `/casos-de-exito/${project.slug}`);
          const poster = getCaseMedia(project.slug)?.reel.poster ?? project.media[0]?.src;
          return <article key={project.slug} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-card/60">
            {poster && <Link href={href} tabIndex={-1} aria-hidden="true" className="group relative block aspect-[16/10] overflow-hidden border-b border-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- portada liviana del reel; la plantilla también se renderiza en el servidor */}
              <img src={poster} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
            </Link>}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="text-2xl font-medium leading-tight text-foreground"><Link href={href} className="hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{project.title[language]}</Link></h3>
              <p className="my-4 max-w-prose text-sm leading-relaxed text-foreground/75">{project.summary[language]}</p>
              <div className="mt-auto"><TryItButtons links={project.tryIt} language={language} idPrefix={`service-${project.slug}`} /></div>
            </div>
          </article>;
        })}
      </div>
    </section>}

    {hasHiring && hiring && <section id={CHAPTERS.hiring.id} data-service-section="hiring" className={`${container} scroll-mt-24 border-t border-foreground/15 py-12 sm:py-20`}>
      {hiring.title && <h2 className={heading}>{hiring.title[language]}</h2>}
      {Boolean(hiring.steps?.length) && <ol className="mt-8 grid gap-8 md:grid-cols-3">{hiring.steps?.map((step, index) => <li key={step.title[language]}>
        <span aria-hidden="true" className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="mt-3 text-xl font-medium text-foreground">{step.title[language]}</h3><p className="mt-3 text-sm leading-relaxed text-foreground/75">{step.body[language]}</p>
      </li>)}</ol>}
      {hiring.price && <p className="mt-8 text-sm leading-relaxed text-foreground/75">{hiring.price[language]}</p>}
    </section>}

    {hasClosing && closing && <section id={CHAPTERS.closing.id} data-service-section="closing" className="banda-marfil scroll-mt-24 py-12 sm:py-20">
      <div className={`${container} flex flex-wrap items-center justify-between gap-8`}>
        {closing.title && <h2 className={`${heading} max-w-4xl`}>{closing.title[language]}</h2>}
        {closing.cta && cta(closing.cta)}
      </div>
    </section>}

    {chapters.length > 1 && <ChapterDock chapters={chapters} language={language} />}
  </main>;
}
