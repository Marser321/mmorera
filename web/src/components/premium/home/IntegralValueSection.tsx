"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Check, X, Zap, ShieldCheck, Clock, Flame } from "lucide-react";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function IntegralValueSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const comparisonRows = [
    {
      metric: isEs ? "Punto de contacto" : "Point of contact",
      agency: isEs ? "Múltiples intermediarios (PM, ejecutivos, diseñador, dev)" : "Multiple layers (Account Manager, PM, designer, dev)",
      mario: isEs ? "Un solo interlocutor técnico con criterio de punta a punta" : "Single technical point of contact with end-to-end vision",
    },
    {
      metric: isEs ? "Tiempo de entrega" : "Delivery turnaround",
      agency: isEs ? "8 a 16 semanas con semanas de reuniones sin código" : "8 to 16 weeks with endless alignment meetings",
      mario: isEs ? "Sprints ágiles de 1 a 3 semanas con avances vivos" : "Agile 1 to 3 week sprints shipping live code",
    },
    {
      metric: isEs ? "Coherencia de producto" : "Product consistency",
      agency: isEs ? "Teléfono descompuesto: diseño y código nacen separados" : "Disconnected: designers create mockups devs struggle to build",
      mario: isEs ? "Diseño visual, Next.js 16 y automatizaciones nacen integrados" : "Visual design, Next.js 16, and automations are built in lockstep",
    },
    {
      metric: isEs ? "Estructura de costos" : "Cost structure",
      agency: isEs ? "Presupuestos inflados para mantener nóminas y oficinas" : "Bloated budgets funding agency overhead and salaries",
      mario: isEs ? "Inversión directa en la solución, sin sobrecostos de burocracia" : "Competitive, direct pricing: you pay for results, not agency overhead",
    },
  ];

  return (
    <section className="relative border-t border-white/10 bg-card/40 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/20">
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-400">
            <Flame className="h-3.5 w-3.5" />
            <span>{isEs ? "Capacidad Limitada: 4 a 5 Proyectos por Trimestre" : "Limited Capacity: 4 to 5 Projects per Quarter"}</span>
          </div>
          <SplitReveal
            as="h2"
            text={isEs ? "Un solo operador integral. Cero intermediarios." : "One integral operator. Zero intermediaries."}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-4 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "La coherencia de un producto se rompe cuando pasa por 4 personas que no se hablan. Trabajo de punta a punta: diseño visual, arquitectura en Next.js 16 y automatizaciones con IA."
              : "Product consistency breaks when handed across 4 different people. I build end-to-end: visual design, Next.js 16 architecture, and AI automations."}
          </Reveal>
        </div>

        {/* 3 Pillars Compact Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Reveal y={12} delay={0.05} className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-background/80 p-4 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isEs ? "Dedicación 1 a 1" : "1-on-1 Focus"}
              </h3>
              <p className="text-xs text-foreground/60">
                {isEs ? "Cero juniors ni terceros delegados." : "Zero juniors or outsourced contractors."}
              </p>
            </div>
          </Reveal>

          <Reveal y={12} delay={0.1} className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-background/80 p-4 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isEs ? "Sprints de 1 a 3 Semanas" : "1 to 3 Week Sprints"}
              </h3>
              <p className="text-xs text-foreground/60">
                {isEs ? "Entregas reales en días, no meses." : "Real deployments in days, not months."}
              </p>
            </div>
          </Reveal>

          <Reveal y={12} delay={0.15} className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-background/80 p-4 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-track-create/10 text-track-create">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isEs ? "Código Propio Next.js 16" : "Custom Next.js 16"}
              </h3>
              <p className="text-xs text-foreground/60">
                {isEs ? "Arquitectura sólida para facturar y crecer." : "Solid codebase built to scale revenue."}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Tabla Comparativa */}
        <Reveal y={20} delay={0.2} className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-background/90 shadow-xl light:border-[rgb(var(--ink-rgb)/0.1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-card/60 text-xs font-mono uppercase tracking-wider text-foreground/50 light:border-[rgb(var(--ink-rgb)/0.1)]">
                  <th className="p-4 sm:p-5">{isEs ? "Factor Clave" : "Key Factor"}</th>
                  <th className="p-4 sm:p-5 text-red-300/80">{isEs ? "Agencia Tradicional" : "Traditional Agency"}</th>
                  <th className="p-4 sm:p-5 text-signal font-semibold">{isEs ? "Mario Morera (Operador Integral)" : "Mario Morera (Integral Operator)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 light:divide-[rgb(var(--ink-rgb)/0.05)]">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-white/[0.02]">
                    <td className="p-4 sm:p-5 font-medium text-foreground/80">{row.metric}</td>
                    <td className="p-4 sm:p-5 text-foreground/50">
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 shrink-0 text-red-400/80 mt-0.5" />
                        <span>{row.agency}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-foreground/90 font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 text-signal mt-0.5" />
                        <span>{row.mario}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

