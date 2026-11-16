import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import {
  ENGINE_AGENTS,
  ENGINE_ANCHOR,
  ENGINE_ARCHITECTURES,
  ENGINE_COPY as c,
  ENGINE_FAILS,
  ENGINE_RUNS,
  ENGINE_STACK,
  ENGINE_TEAM,
} from "@/data/engineRoom";
import type { LocalizedText } from "@/types/site";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";
const label = "font-mono text-[10px] uppercase tracking-[.16em] text-foreground/60";
const subheading = "text-2xl font-medium tracking-[-.03em] text-foreground sm:text-3xl";

function Bullets({ items, language }: { items: LocalizedText[]; language: "es" | "en" }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item.es} className="flex gap-3 border-t border-foreground/12 pt-3 text-base leading-relaxed text-foreground/80">
          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
          {item[language]}
        </li>
      ))}
    </ul>
  );
}

/**
 * «Cómo lo construyo»: la parte técnica de /sistemas, separada del servicio con
 * un corte claro. Arriba se vende en simple; acá está el motor para quien lo busca.
 */
export function EngineRoom({ language }: { language: "es" | "en" }) {
  return (
    <section id={ENGINE_ANCHOR} data-service-section="engine" aria-labelledby="engine-title" className="scroll-mt-24 border-t border-foreground/15 pt-16 sm:pt-24">
      <div className={container}>
        <p className={label}>{c.eyebrow[language]}</p>
        <h2 id="engine-title" className="mt-4 max-w-4xl text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.02] tracking-[-.04em] text-foreground">{c.title[language]}</h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/70">{c.body[language]}</p>

        {/* El equipo de modelos: roles en texto, sin logos. */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            <h3 className={subheading}>{c.teamTitle[language]}</h3>
            <p className="mt-4 text-base leading-relaxed text-foreground/75">{c.teamBody[language]}</p>
            <ol aria-label={c.teamTitle[language]} className="mt-6 flex flex-wrap items-center gap-2 text-sm text-foreground/80">
              {c.circuit.map((step, index) => (
                <li key={step.es} className="flex items-center gap-2">
                  <span className="rounded-full border border-foreground/15 px-3 py-1.5">{step[language]}</span>
                  {index < c.circuit.length - 1 && <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-signal" />}
                </li>
              ))}
            </ol>
            <p className="mt-6 border-l-2 border-signal/60 pl-4 text-sm leading-relaxed text-foreground/70">{c.teamExample[language]}</p>
          </div>
          <dl className="divide-y divide-foreground/12 border-y border-foreground/12">
            {ENGINE_TEAM.map((row) => (
              <div key={row.part.es} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,.9fr)_minmax(0,.8fr)_minmax(0,1.3fr)] sm:gap-6">
                <dt className={label}>{row.part[language]}</dt>
                <dd className="text-base font-medium text-foreground">{row.who}</dd>
                <dd className="text-sm leading-relaxed text-foreground/70">{row.why[language]}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Agentes, fallas y dónde corre: tres columnas cortas. */}
        <div className="mt-20 grid gap-12 lg:grid-cols-3">
          <div><h3 className={subheading}>{c.agentsTitle[language]}</h3><Bullets items={ENGINE_AGENTS} language={language} /></div>
          <div><h3 className={subheading}>{c.failsTitle[language]}</h3><Bullets items={ENGINE_FAILS} language={language} /></div>
          <div>
            <h3 className={subheading}>{c.runsTitle[language]}</h3>
            <Bullets items={ENGINE_RUNS} language={language} />
            <Link href={localePath(language, "/lab")} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {c.labLink[language]}<ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Arquitecturas: el diagrama interactivo de cada caso. */}
        <div className="mt-20">
          <h3 className={subheading}>{c.architecturesTitle[language]}</h3>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">{c.architecturesBody[language]}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {ENGINE_ARCHITECTURES.map((item) => (
              <li key={item.slug}>
                <Link href={`${localePath(language, `/casos-de-exito/${item.slug}`)}#case-architecture`} className="group flex h-full min-h-24 flex-col justify-between rounded-2xl border border-foreground/15 p-5 transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {item.kind && <span className={label}>{item.kind[language]}</span>}
                  <span className="mt-3 flex items-center justify-between gap-3 text-lg font-medium text-foreground group-hover:text-signal">{item.title[language]}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* El stack: una sola tabla por familia, en lugar de tres listas sueltas. */}
        <div className="mt-20">
          <h3 className={subheading}>{c.stackTitle[language]}</h3>
          <dl className="mt-6 divide-y divide-foreground/12 border-y border-foreground/12">
            {ENGINE_STACK.map((row) => (
              <div key={row.id} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,.25fr)_minmax(0,1fr)] sm:gap-6">
                <dt className={label}>{row.label[language]}</dt>
                <dd className="text-sm leading-relaxed text-foreground/80">{row.tools.map((tool) => tool[language]).join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
