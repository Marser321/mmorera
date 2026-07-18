"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DrawRule } from "@/components/motion/DrawRule";
import { Reveal } from "@/components/scroll/Reveal";

interface MethodStep {
  title: string;
  body: string;
}

/**
 * Método como línea de tiempo: cada fila converge (número+título desde la
 * izquierda, descripción desde la derecha) y un conector vertical se dibuja
 * scrubbed con el scroll mientras se leen los cuatro pasos.
 */
export function MethodTimeline({ eyebrow, title, steps }: { eyebrow: string; title: string; steps: MethodStep[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 65%"] });

  return (
    <section data-home-section="method" className="bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1480px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{eyebrow}</p>
        <SplitReveal
          as="h2"
          text={title}
          className="mt-5 max-w-4xl text-[clamp(2.5rem,5vw,5.8rem)] font-medium leading-[.98] tracking-[-0.055em] text-foreground"
        />
        <div className="relative mt-16">
          <DrawRule progress={scrollYProgress} origin="top" className="absolute bottom-0 left-0 top-0 block w-px bg-signal/40" />
          <ol ref={listRef} className="border-t border-white/12 pl-6 sm:pl-8 light:border-[rgb(var(--ink-rgb)/0.12)]">
            {steps.map((step, index) => (
              <li key={step.title} className="group grid gap-4 border-b border-white/10 py-7 sm:grid-cols-[80px_1fr_1fr] sm:items-start light:border-[rgb(var(--ink-rgb)/0.1)]">
                <Reveal as="span" x={-24} y={0} className="font-mono text-[10px] text-foreground/30 transition-colors duration-300 group-hover:text-signal">
                  0{index + 1}
                </Reveal>
                <Reveal as="h3" x={-24} y={0} delay={0.05} className="text-2xl font-medium tracking-[-0.035em] text-foreground transition-transform duration-300 group-hover:translate-x-1">
                  {step.title}
                </Reveal>
                <Reveal as="p" x={24} y={0} delay={0.1} className="max-w-lg text-sm leading-6 text-foreground/48">
                  {step.body}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
