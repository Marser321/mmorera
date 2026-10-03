"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, UserCheck, Flame, ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function ExclusivitySection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <section className="relative border-t border-white/10 bg-card/50 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/30">
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-400">
            <Flame className="h-3.5 w-3.5" />
            <span>{isEs ? "Capacidad Limitada: 4 a 5 Proyectos por Trimestre" : "Limited Capacity: 4 to 5 Projects per Quarter"}</span>
          </div>
          <SplitReveal
            as="h2"
            text={isEs ? "No vendo volumen. Elijo con quién trabajar y me comprometo al 100%." : "I don't sell volume. I select who to build for and commit 100%."}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "El secreto a voces de las agencias tradicionales es cobrarte $5,000–$10,000 al mes para pagar ejecutivos de cuenta, mientras tu proyecto real termina delegado en un desarrollador junior tercerizado que cobra por hora y no tiene compromiso real. Mi modelo es el opuesto."
              : "The open secret of traditional agencies is charging you $5k-$10k monthly for account managers, while your real project is delegated to an underpaid junior contractor. My model is the exact opposite."}
          </Reveal>
        </div>

        {/* 3 Value Pillars of Exclusivity */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <Reveal y={20} delay={0.05} className="rounded-2xl border border-white/10 bg-background/80 p-7 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)] flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-signal/15 border border-signal/30 flex items-center justify-center text-signal mb-5">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium text-foreground">
                {isEs ? "Dedicación Artesanal, Cero Juniors" : "Craftsman Focus, Zero Juniors"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                {isEs
                  ? "Hablas y trabajas directamente conmigo. Cada decisión de diseño, cada flujo de CRM y cada línea de código en Next.js pasa por mi criterio personal, asistido por una suite de agentes de IA."
                  : "You collaborate directly with me. Every design decision, CRM workflow, and line of Next.js code is shaped by my personal standards, powered by an AI agent suite."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
              <span className="font-mono text-[10px] text-signal font-semibold uppercase tracking-wider">
                {isEs ? "Piel en el juego" : "Skin in the game"}
              </span>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.1} className="rounded-2xl border border-white/10 bg-background/80 p-7 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)] flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium text-foreground">
                {isEs ? "Sistemas Construidos para Escalar" : "Systems Engineered to Scale"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                {isEs
                  ? "No entrego plantillas desechables de WordPress o Webflow que se rompen al mes. Construyo infraestructura sólida, veloz y mantenible que acompaña el crecimiento de tu facturación."
                  : "I do not ship fragile WordPress or Webflow templates. I engineer solid, fast, maintainable infrastructure designed to support growing revenue."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
              <span className="font-mono text-[10px] text-accent font-semibold uppercase tracking-wider">
                {isEs ? "Arquitectura a largo plazo" : "Long-term architecture"}
              </span>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.15} className="rounded-2xl border border-white/10 bg-background/80 p-7 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)] flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-track-create/15 border border-track-create/30 flex items-center justify-center text-track-create mb-5">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium text-foreground">
                {isEs ? "Tu Éxito es mi Caso de Estudio" : "Your Success is My Case Study"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                {isEs
                  ? "Como tomo pocos proyectos, mi reputación depende de que el tuyo sea un éxito rotundo: que facture, que reduzca trabajo operativo y que se vea impecable en producción."
                  : "Because I only take a few projects, my reputation hinges on yours being an undeniable success: driving revenue, eliminating manual toil, and looking stunning."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
              <span className="font-mono text-[10px] text-track-create font-semibold uppercase tracking-wider">
                {isEs ? "Resultados verificables" : "Verifiable outcomes"}
              </span>
            </div>
          </Reveal>
        </div>

        {/* Live Slot Counter Bar */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isEs ? "Disponibilidad Trimestral Activa" : "Active Quarterly Availability"}
              </p>
              <p className="text-xs text-foreground/60 font-mono">
                {isEs ? "2 de 5 cupos de proyecto disponibles para este ciclo" : "2 of 5 project slots currently available for this cycle"}
              </p>
            </div>
          </div>

          <a
            href="#contacto"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold text-background transition-transform hover:-translate-y-0.5 shrink-0"
          >
            {isEs ? "Postular mi proyecto" : "Apply for a project slot"}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
