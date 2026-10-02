"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  INDUSTRY_FILTERS,
  SOLUTION_FILTERS,
  filterProjects,
  type MatchedProject,
} from "@/data/caseSolutionMatcherData";
import {
  Filter,
  ArrowUpRight,
  ExternalLink,
  Zap,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function CaseSolutionMatcher() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedSolution, setSelectedSolution] = useState<string>("all");

  const { projects, averagePageSpeed, averageSprintWeeks } = useMemo(
    () => filterProjects(selectedIndustry, selectedSolution),
    [selectedIndustry, selectedSolution]
  );

  const activeIndustry = useMemo(
    () =>
      INDUSTRY_FILTERS.find((i) => i.id === selectedIndustry) ||
      INDUSTRY_FILTERS[0],
    [selectedIndustry]
  );

  const whatsappInquiryUrl = useMemo(() => {
    const indName = activeIndustry.name[language];
    const text = isEs
      ? `Hola Mario, estuve explorando tus casos de éxito en la categoría [${indName}]. Tengo un negocio en este rubro y quiero evaluar una solución similar.`
      : `Hi Mario, I was exploring your case studies in the [${indName}] category. I have a business in this field and want to explore a similar solution.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [activeIndustry, language, isEs]);

  return (
    <section
      id="filtro-soluciones"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]"
    >
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_#71F3A2] animate-pulse" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                {isEs ? "Matriz Táctil · Casos por Industria & Solución" : "Tactile Matrix · Cases by Industry & Outcome"}
              </p>
            </div>
            <SplitReveal
              as="h2"
              text={
                isEs
                  ? "Buscá soluciones probadas en tu tipo de negocio."
                  : "Find proven solutions in your specific industry."
              }
              className="mt-4 text-[clamp(2.2rem,4.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
            />
            <Reveal as="p" className="mt-4 text-base leading-relaxed text-foreground/60 sm:text-lg">
              {isEs
                ? "Filtrá por nicho o tipo de arquitectura para ver resultados tangibles, métricas reales y el circuito técnico desplegado en cada caso."
                : "Filter by niche or architecture type to see tangible business outcomes, verified PageSpeed scores, and deployed system topologies."}
            </Reveal>
          </div>

          {/* Telemetry pill */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card/60 px-5 py-3.5 backdrop-blur-md">
            <div>
              <p className="font-mono text-[10px] uppercase text-foreground/45">
                {isEs ? "Velocidad Promedio" : "Avg PageSpeed"}
              </p>
              <p className="text-base font-bold font-mono text-signal">
                {averagePageSpeed} / 100
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-mono text-[10px] uppercase text-foreground/45">
                {isEs ? "Plazo Típico" : "Typical Sprint"}
              </p>
              <p className="text-base font-bold font-mono text-foreground">
                {averageSprintWeeks} {isEs ? "semanas" : "weeks"}
              </p>
            </div>
          </div>
        </div>

        {/* ─── FILTROS TÁCTILES CON PILLS ANIMADAS ─── */}
        <div className="mt-10 space-y-4">
          {/* Row 1: Industrias */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 block mb-2">
              {isEs ? "1. Filtrar por Industria" : "1. Filter by Industry"}
            </span>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_FILTERS.map((ind) => {
                const isActive = ind.id === selectedIndustry;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndustry(ind.id)}
                    className={`relative rounded-xl px-4 py-2 font-mono text-xs transition-colors flex items-center gap-2 ${
                      isActive
                        ? "text-black font-semibold"
                        : "border border-white/8 bg-white/[0.02] text-foreground/60 hover:text-foreground hover:bg-white/[0.06]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-industry-pill"
                        className="absolute inset-0 rounded-xl bg-signal shadow-[0_0_15px_rgba(113,243,162,0.35)]"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{ind.name[language]}</span>
                    <span
                      className={`relative z-10 text-[9px] rounded-md px-1.5 py-0.2 ${
                        isActive ? "bg-black/20 text-black" : "bg-white/5 text-foreground/40"
                      }`}
                    >
                      {ind.badge[language]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Soluciones */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 block mb-2">
              {isEs ? "2. Filtrar por Tipo de Solución" : "2. Filter by Solution Type"}
            </span>
            <div className="flex flex-wrap gap-2">
              {SOLUTION_FILTERS.map((sol) => {
                const isActive = sol.id === selectedSolution;
                return (
                  <button
                    key={sol.id}
                    onClick={() => setSelectedSolution(sol.id)}
                    className={`relative rounded-xl px-4 py-2 font-mono text-xs transition-colors ${
                      isActive
                        ? "text-black font-semibold"
                        : "border border-white/8 bg-white/[0.02] text-foreground/60 hover:text-foreground hover:bg-white/[0.06]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-solution-pill"
                        className="absolute inset-0 rounded-xl bg-cyan-400 shadow-[0_0_15px_rgba(85,216,255,0.35)]"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{sol.name[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── GRID DE CASOS RESULTANTES ─── */}
        <motion.div
          layout
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-card/70 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-signal/40 hover:bg-card hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              >
                <div>
                  {/* Top Metric Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        borderColor: `${project.accent}40`,
                        backgroundColor: `${project.accent}12`,
                        color: project.accent,
                      }}
                    >
                      <Zap className="h-3 w-3" />
                      {project.metricBadge[language]}
                    </span>

                    <span className="font-mono text-[11px] font-bold text-signal">
                      {project.pageSpeedScore} Score
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-signal">
                    {project.title[language]}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-foreground/60 leading-relaxed">
                    {project.summary[language]}
                  </p>

                  {/* Tech stack */}
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/8 pt-4">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-foreground/55"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 border-t border-white/8 pt-4 flex items-center justify-between gap-3">
                  <Link
                    href={localePath(language, `/casos-de-exito/${project.slug}#topologia-sistema`)}
                    className="inline-flex items-center gap-1 text-xs font-mono text-signal hover:underline"
                  >
                    <span>{isEs ? "Topología" : "Topology"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-white/10 transition-colors"
                  >
                    <span>{isEs ? "Abrir Web" : "Live Site"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Closing Consultation Strip */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-card/40 p-5 backdrop-blur-md">
          <p className="text-xs sm:text-sm text-foreground/70 max-w-xl">
            {isEs
              ? "¿Tu modelo de negocio no encaja exactamente con estos ejemplos? Hablemos de los requerimientos puntuales de tu operación."
              : "Does your business model have unique operational requirements? Let's discuss your exact system architecture."}
          </p>

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pressable inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-xs font-semibold text-black transition-transform hover:scale-[1.02] shadow-[0_0_15px_rgba(113,243,162,0.3)]"
          >
            <span>{isEs ? `Consultar para ${activeIndustry.name.es}` : `Inquire for ${activeIndustry.name.en}`}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
