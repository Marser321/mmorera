"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkReel } from "./WorkReel";
import { CaseBento } from "./CaseBento";
import { ARCHIVE_CASES, FEATURED_CASES } from "@/data/projectCases";
import { hasFlagshipFilm } from "@/data/films/flagships/slugs";
import type { ProjectCase } from "@/types/site";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TickerNumber } from "@/components/motion/TickerNumber";
import { DrawRule } from "@/components/motion/DrawRule";
import { Reveal } from "@/components/scroll/Reveal";
import { ScrollProgressBar } from "@/components/scroll/ScrollProgressBar";

/**
 * WorkExperience — /casos-de-exito: header compacto, reel cinematográfico de
 * los destacados y archivo del resto. Framing: demos de capacidad, no
 * vitrinas infladas.
 */
export function WorkExperience() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const total = FEATURED_CASES.length + ARCHIVE_CASES.length;

  return (
    <main id="contenido-principal" className="bg-transparent pb-28 pt-36 lg:pt-44">
      <ScrollProgressBar />

      {/* Header compacto */}
      <header className="mx-auto flex min-h-[40vh] w-full max-w-[1480px] flex-col justify-end px-5 pb-4 sm:px-8 lg:px-12">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">
          {isEs ? "Trabajo" : "Work"}
        </p>
        <SplitReveal
          as="h1"
          mode="load"
          text={isEs ? "Trabajo que se puede abrir." : "Work you can open."}
          className="mt-6 max-w-5xl text-[clamp(2.8rem,6.5vw,7rem)] font-medium leading-[.9] tracking-[-.06em] text-foreground"
        />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-xl text-lg leading-7 text-foreground/55 light:text-muted-foreground">
            {isEs ? "Casos, implementaciones locales y demos; cada ficha deja claro su estado." : "Cases, local implementations and demos; each page makes its status clear."}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/55 light:text-muted-foreground/85">
            <TickerNumber value={total} /> · {isEs ? "casos" : "cases"}
          </p>
        </div>
        <DrawRule className="mt-10 block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
        <CaseJumpIndex projects={[...FEATURED_CASES, ...ARCHIVE_CASES]} isEs={isEs} language={language} />
      </header>

      {/* Reel cinematográfico (full-bleed) */}
      <WorkReel projects={FEATURED_CASES} />

      {/* Archivo de Proyectos & Sistemas */}
      <section className="mx-auto w-full max-w-[1480px] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12" aria-labelledby="archive-work">
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-accent">
            {isEs ? "Archivo Completo" : "Complete Archive"} · {String(ARCHIVE_CASES.length).padStart(2, "0")}
          </p>
          <h2 id="archive-work" className="mt-3 max-w-3xl text-[clamp(2.2rem,4.5vw,4.2rem)] font-medium leading-[.96] tracking-[-.055em] text-foreground">
            {isEs ? "Experiencias, productos y sistemas." : "Experiences, products and systems."}
          </h2>
        </div>
        <DrawRule className="mb-10 block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
        <Reveal y={24}>
          <CaseBento projects={ARCHIVE_CASES} />
        </Reveal>
      </section>

      {/* CTA de cierre: la banda marfil de la página. */}
      <section className="banda-marfil mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-end justify-between gap-8">
          <p className="max-w-4xl text-[clamp(2.2rem,4.2vw,4.4rem)] font-medium leading-[.95] tracking-[-.055em] text-foreground">
            {isEs ? "¿Qué querés hacer posible?" : "What do you want to make possible?"}
          </p>
          <Link
            href={localePath(language, "/aplicar")}
            className="pressable group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isEs ? "Hablemos" : "Let’s talk"}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

/**
 * Índice de acceso directo: todos los casos a un clic, sin recorrer el reel.
 * Los que tienen film insignia llevan su marca.
 */
function CaseJumpIndex({ projects, isEs, language }: { projects: ProjectCase[]; isEs: boolean; language: "es" | "en" }) {
  return (
    <nav aria-label={isEs ? "Ir directo a un caso" : "Jump to a case"} className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/55 light:text-muted-foreground">{isEs ? "Ir directo a un caso" : "Jump to a case"}</p>
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-foreground/55 light:text-muted-foreground">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
          {isEs ? "Film insignia" : "Flagship film"}
        </p>
      </div>
      {/* relative: los textos sr-only (absolutos) quedan dentro de la tira; si no, estiran la página en el teléfono. */}
      <ul className="relative mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
        {projects.map((project) => {
          const flagship = hasFlagshipFilm(project.slug);
          return (
            <li key={project.slug} className="shrink-0">
              <Link
                href={localePath(language, `/casos-de-exito/${project.slug}`)}
                className="inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full border border-white/12 px-3.5 py-1.5 text-sm text-foreground/70 transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)] light:hover:border-[rgb(var(--ink-rgb)/0.3)]"
              >
                {flagship ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" /> : null}
                {project.title[language]}
                {flagship ? <span className="sr-only">{isEs ? " (film insignia)" : " (flagship film)"}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
