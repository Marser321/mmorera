"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CaseCard } from "./CaseCard";
import { WorkReel } from "./WorkReel";
import { ARCHIVE_CASES, FEATURED_CASES } from "@/data/projectCases";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TickerNumber } from "@/components/motion/TickerNumber";
import { DrawRule } from "@/components/motion/DrawRule";
import { Reveal } from "@/components/scroll/Reveal";
import { ScrollProgressBar } from "@/components/scroll/ScrollProgressBar";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";
import { MOTION_ASSETS } from "@/data/motionAssets";

/**
 * WorkExperience — /casos-de-exito: header compacto, reel cinematográfico de
 * los seis destacados y archivo del resto. Framing: demos de capacidad, no
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
          {isEs ? "Demos de capacidad" : "Capability demos"}
        </p>
        <SplitReveal
          as="h1"
          mode="load"
          text={isEs ? "Algunos de los proyectos que puedo construir." : "Some of the projects I can build."}
          className="mt-6 max-w-5xl text-[clamp(2.8rem,6.5vw,7rem)] font-medium leading-[.9] tracking-[-.06em] text-foreground"
        />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-xl text-lg leading-7 text-[#F3F0E8]/55 light:text-muted-foreground">
            {isEs ? "Demos reales, desplegadas y navegables. Sin humo." : "Real, deployed, browsable demos. No smoke."}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/30 light:text-muted-foreground/85">
            <TickerNumber value={total} /> · {isEs ? "demos en línea" : "demos online"}
          </p>
        </div>
        <DrawRule className="mt-10 block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
      </header>

      {/* Reel cinematográfico (full-bleed) */}
      <WorkReel projects={FEATURED_CASES} />

      <section className="relative isolate flex min-h-[74svh] items-end overflow-hidden border-y border-white/10 bg-background px-5 pb-14 sm:px-8 lg:min-h-[82svh] lg:px-12 lg:pb-20 light:border-[rgb(var(--ink-rgb)/0.1)]" aria-labelledby="archive-work">
        <MotionBackdrop asset={MOTION_ASSETS.archive} intensity={0.9} />
        <div className="relative z-10 mx-auto w-full max-w-[1480px]">
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-foreground/46">
            {isEs ? "Archivo" : "Archive"} · {String(ARCHIVE_CASES.length).padStart(2, "0")}
          </p>
          <h2 id="archive-work" className="mt-4 max-w-3xl text-[clamp(2.8rem,5.4vw,6rem)] font-medium leading-[.94] tracking-[-.055em] text-foreground">
            {isEs ? "Experiencias, productos y sistemas." : "Experiences, products and systems."}
          </h2>
        </div>
      </section>

      {/* Archivo */}
      <section className="mx-auto w-full max-w-[1480px] px-5 pt-20 sm:px-8 lg:px-12" aria-labelledby="archive-work">
        <DrawRule className="mb-10 block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ARCHIVE_CASES.map((project, index) => (
            <Reveal
              key={project.slug}
              x={index % 3 === 0 ? -28 : index % 3 === 2 ? 28 : 0}
              y={index % 3 === 1 ? 24 : 0}
              delay={(index % 3) * 0.08}
            >
              <CaseCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA de cierre */}
      <section className="mx-auto mt-24 w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] py-8">
          <p className="text-lg text-[#F3F0E8]/55 light:text-muted-foreground">
            {isEs ? "¿Querés algo de este nivel para tu negocio?" : "Want something at this level for your business?"}
          </p>
          <Link
            href={localePath(language, "/aplicar")}
            className="link-draw group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.16em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isEs ? "Aplicar a un proyecto" : "Apply for a project"}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
