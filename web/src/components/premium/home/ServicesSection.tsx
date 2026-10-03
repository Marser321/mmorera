"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SERVICE_SOLUTIONS } from "@/data/solutionsData";
import { Check, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function ServicesSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <section id="servicios" className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]">
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <Reveal as="p" className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {isEs ? "Servicios & Sistemas" : "Services & Systems"}
          </Reveal>
          <SplitReveal
            as="h2"
            text={isEs ? "Soluciones reales construidas a medida de tu negocio." : "Real solutions custom-built for your business."}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Sin plantillas genéricas ni promesas vacías. Cada sistema se diseña y programa para resolver un cuello de botella real de captación u operación."
              : "No generic templates or empty hype. Each system is designed and built to resolve a real bottleneck in client acquisition or daily operations."}
          </Reveal>
        </div>

        {/* Grid de Servicios */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {SERVICE_SOLUTIONS.map((service, index) => (
            <Reveal
              key={service.id}
              y={24}
              delay={index * 0.08}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-card/80 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-signal/40 hover:bg-card hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90"
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      borderColor: `${service.accent}40`,
                      backgroundColor: `${service.accent}12`,
                      color: service.accent,
                    }}
                  >
                    {service.tag[language]}
                  </span>
                  <span className="font-mono text-xs text-foreground/30">0{index + 1}</span>
                </div>

                {/* Title & Direct Value */}
                <h3 className="mt-5 text-xl sm:text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-signal">
                  {service.title[language]}
                </h3>
                <p className="mt-2 text-sm text-foreground/70 sm:text-base leading-snug">
                  {service.headline[language]}
                </p>

                {/* Deliverables List (Curated & Fast) */}
                <div className="mt-5 border-t border-white/8 pt-4 light:border-[rgb(var(--ink-rgb)/0.08)]">
                  <ul className="space-y-2">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-foreground/75">
                        <Check className="h-3.5 w-3.5 shrink-0 text-signal" />
                        <span>{item[language]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 border-t border-white/8 pt-4 light:border-[rgb(var(--ink-rgb)/0.08)] flex items-center justify-between gap-4">
                <span className="text-xs text-foreground/50 font-mono">
                  {service.idealFor[language].split(".")[0]}
                </span>
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal hover:underline shrink-0"
                >
                  {isEs ? "Consultar" : "Inquire"}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
