"use client";

import { useLanguage } from "@/context/LanguageContext";
import { WORKFLOW_STAGES } from "@/data/solutionsData";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function WorkflowSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <section id="metodo" className="relative scroll-mt-24 border-t border-white/10 bg-card/30 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/20">
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <Reveal as="p" className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {isEs ? "Metodología de Trabajo" : "Execution Blueprint"}
          </Reveal>
          <SplitReveal
            as="h2"
            text={isEs ? "Del problema a un sistema vivo en producción." : "From problem to deployed live software."}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Un proceso probado en 4 etapas para que nunca haya sorpresas, retrasos de meses ni presupuestos fuera de control."
              : "A battle-tested 4-stage process ensuring zero surprises, no multi-month delays, and strict budget predictability."}
          </Reveal>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STAGES.map((stage, idx) => (
            <Reveal
              key={stage.step}
              y={20}
              delay={idx * 0.08}
              className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-background/80 p-6 sm:p-7 backdrop-blur-sm transition-all hover:border-signal/40 hover:bg-background light:border-[rgb(var(--ink-rgb)/0.1)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold tracking-tighter text-signal/80">
                    {stage.step}
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground/60 light:border-[rgb(var(--ink-rgb)/0.12)]">
                    {stage.badge[language]}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-medium text-foreground">
                  {stage.title[language]}
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-foreground/60">
                  {stage.description[language]}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 light:border-[rgb(var(--ink-rgb)/0.05)]">
                <span className="font-mono text-[10px] text-foreground/35 uppercase tracking-wider">
                  {isEs ? `Etapa 0${idx + 1}` : `Phase 0${idx + 1}`}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
