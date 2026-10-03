"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Check, X, Zap, ShieldCheck, Clock } from "lucide-react";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function IntegralValueSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const comparisonRows = [
    {
      metric: isEs ? "Punto de contacto" : "Point of contact",
      agency: isEs ? "Múltiples intermediarios (Account Manager, PM, diseñador, dev)" : "Multiple layers (Account Manager, PM, designer, dev)",
      mario: isEs ? "Un solo interlocutor técnico con criterio de punta a punta" : "Single technical point of contact with end-to-end vision",
    },
    {
      metric: isEs ? "Tiempo de entrega" : "Delivery turnaround",
      agency: isEs ? "8 a 16 semanas con semanas de reuniones sin código" : "8 to 16 weeks with endless alignment meetings",
      mario: isEs ? "Sprints ágiles de 1 a 3 semanas con avances vivos" : "Agile 1 to 3 week sprints shipping live code",
    },
    {
      metric: isEs ? "Coherencia de producto" : "Product consistency",
      agency: isEs ? "Teléfono descompuesto: el diseño promete lo que el dev no puede integrar" : "Disconnected: designers create Figma mockups devs struggle to build",
      mario: isEs ? "Diseño visual, código Next.js y CRM nacen completamente integrados" : "Visual design, Next.js code, and CRM are built in lockstep",
    },
    {
      metric: isEs ? "Estructura de costos" : "Cost structure",
      agency: isEs ? "Presupuestos inflados para mantener nóminas y burocracia" : "Bloated budgets funding agency overhead and salaries",
      mario: isEs ? "Precio directo y muy competitivo: pagás por solución, no por oficinas" : "Competitive, direct pricing: you pay for results, not agency overhead",
    },
  ];

  return (
    <section className="relative border-t border-white/10 bg-card/40 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/20">
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <Reveal as="p" className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {isEs ? "El Enfoque Contra-Corriente" : "The Counter-Intuitive Approach"}
          </Reveal>
          <SplitReveal
            as="h2"
            text={isEs ? "Un solo profesional integral supera a tres agencias descoordinadas." : "One integral operator beats three disconnected agencies."}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Muchos dicen que debés hiper-especializarte. La realidad es que las empresas no quieren lidiar con 4 freelancers que no se hablan. Quieren a una persona de confianza con criterio técnico que resuelva todo el ecosistema con el respaldo de agentes de IA."
              : "Many say you should hyper-specialize. The reality is that businesses do not want to manage 4 freelancers who never talk. They want one trusted partner with deep technical taste who resolves the entire ecosystem backed by AI agents."}
          </Reveal>
        </div>

        {/* 3 Pillars Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <Reveal y={16} delay={0.05} className="rounded-2xl border border-white/10 bg-background/80 p-6 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)]">
            <Zap className="h-6 w-6 text-signal mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              {isEs ? "Cero Teléfono Descompuesto" : "Zero Communication Breakdown"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">
              {isEs
                ? "La misma cabeza que define la dirección visual es la que escribe la lógica de reservas y conecta la base de datos. Sin fricción ni excusas."
                : "The same mind shaping art direction writes the booking logic and database architecture. No friction, no excuses."}
            </p>
          </Reveal>

          <Reveal y={16} delay={0.1} className="rounded-2xl border border-white/10 bg-background/80 p-6 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)]">
            <Clock className="h-6 w-6 text-accent mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              {isEs ? "Sprints Ágiles en Vivo" : "Live Agile Sprints"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">
              {isEs
                ? "Avanzamos viendo productos desplegados reales en días, no presentaciones estáticas de diapositivas que tardan un mes."
                : "We move fast by reviewing real deployed preview URLs in days, rather than static slide decks taking a month."}
            </p>
          </Reveal>

          <Reveal y={16} delay={0.15} className="rounded-2xl border border-white/10 bg-background/80 p-6 backdrop-blur-sm light:border-[rgb(var(--ink-rgb)/0.1)]">
            <ShieldCheck className="h-6 w-6 text-track-create mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              {isEs ? "Respaldo Agéntico de IA" : "AI Agent Orchestration"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">
              {isEs
                ? "Opero asistido por un ecosistema de agentes especializados en código, pruebas automatizadas y optimización para multiplicar la capacidad de entrega."
                : "I operate supported by specialized AI agents for code generation, test suites, and performance tuning to multiply output velocity."}
            </p>
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
                    <td className="p-4 sm:p-5 text-foreground/50 flex items-start gap-2">
                      <X className="h-4 w-4 shrink-0 text-red-400/80 mt-0.5" />
                      <span>{row.agency}</span>
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
