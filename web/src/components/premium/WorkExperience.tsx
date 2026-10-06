"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkReel } from "./WorkReel";
import { CaseBento } from "./CaseBento";
import { ARCHIVE_CASES, FEATURED_CASES } from "@/data/projectCases";
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
          <p className="max-w-xl text-lg leading-7 text-[#F3F0E8]/55 light:text-muted-foreground">
            {isEs ? "Casos y demos reales, desplegados y navegables." : "Real cases and demos, deployed and browsable."}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/30 light:text-muted-foreground/85">
            <TickerNumber value={total} /> · {isEs ? "demos en línea" : "demos online"}
          </p>
        </div>
        <DrawRule className="mt-10 block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
      </header>

      {/* Reel cinematográfico (full-bleed) */}
      <WorkReel projects={FEATURED_CASES} />

      {/* Archivo de Proyectos & Sistemas */}
      <section className="mx-auto w-full max-w-[1480px] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12" aria-labelledby="archive-work">
        <div className="mb-10">
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-accent">
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

      {/* CTA de cierre */}
      <section className="mx-auto mt-24 w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] py-8">
          <p className="text-lg text-[#F3F0E8]/55 light:text-muted-foreground">
            {isEs ? "¿Qué querés hacer posible?" : "What do you want to make possible?"}
          </p>
          <Link
            href={localePath(language, "/aplicar")}
            className="link-draw group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.16em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isEs ? "Hablemos" : "Let’s talk"}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
