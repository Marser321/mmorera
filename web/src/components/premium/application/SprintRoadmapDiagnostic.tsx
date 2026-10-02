"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  SPRINT_TIMELINE_TIERS,
  type SprintTimelineTier,
  type SprintPhase,
} from "@/data/sprintRoadmapData";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Layers,
  Terminal,
} from "lucide-react";

export function SprintRoadmapDiagnostic() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Selected tier
  const [selectedTierId, setSelectedTierId] = useState<"fast_web" | "automation_crm" | "integral_system">("automation_crm");
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const tier = useMemo<SprintTimelineTier>(
    () => SPRINT_TIMELINE_TIERS.find((t) => t.id === selectedTierId) ?? SPRINT_TIMELINE_TIERS[1],
    [selectedTierId]
  );

  const activePhase: SprintPhase = tier.phases[activePhaseIndex] ?? tier.phases[0];

  const handleSelectTier = (tierId: "fast_web" | "automation_crm" | "integral_system") => {
    setSelectedTierId(tierId);
    setActivePhaseIndex(0);
  };

  const scrollToBrief = () => {
    const el = document.getElementById("brief-form") || document.getElementById("contenido-principal");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const whatsappPrefillUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve revisando el Roadmap de Sprint para ${tier.name.es} (${tier.badge.es}). Quiero consultar disponibilidad para iniciar mi proyecto.`
      : `Hi Mario, I was checking the Sprint Roadmap for ${tier.name.en} (${tier.badge.en}). I'd like to check sprint availability for my project.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [tier, isEs]);

  return (
    <section
      id="sprint-roadmap"
      className="relative scroll-mt-24 border-b border-white/10 pb-16 pt-12 light:border-[rgb(var(--ink-rgb)/0.1)]"
    >
      {/* Resplandor reactivo */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 10%, ${tier.accentColor}12 0%, transparent 60%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500"
              style={{ backgroundColor: tier.accentColor, color: tier.accentColor }}
            />
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: tier.accentColor }}
            >
              {isEs ? "00 · Cronograma & Entregables de Sprint" : "00 · Sprint Roadmap & Deliverables"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Elegí tu alcance y mirá qué se construye cada semana."
                : "Choose your scope and see what ships each week."
            }
            className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/60">
            {isEs
              ? "Cero reuniones eternas, cero empleados juniors y sin cotizaciones infladas. Todo proyecto se ejecuta en un sprint cerrado de 1 a 3 semanas con fechas de entrega milimétricas y código propio."
              : "Zero endless meetings, zero junior handoffs, and zero inflated retainers. Every project runs in a fixed 1 to 3 week sprint with surgical delivery dates and 100% custom code."}
          </Reveal>
        </div>

        {/* ─── 1. SELECTOR TÁCTIL DE ALCANCE ─── */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {SPRINT_TIMELINE_TIERS.map((t) => {
            const isSelected = t.id === selectedTierId;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTier(t.id)}
                className={`group relative text-left rounded-2xl p-4 sm:p-5 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-white/30 bg-card/90 shadow-[0_8px_30px_rgba(0,0,0,0.5)] light:bg-card"
                    : "border-white/10 bg-card/30 hover:border-white/20 hover:bg-card/50 light:bg-card/20"
                }`}
                style={{
                  borderColor: isSelected ? t.accentColor : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
                    style={{
                      backgroundColor: isSelected ? `${t.accentColor}25` : "rgba(255,255,255,0.06)",
                      color: isSelected ? t.accentColor : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <Clock className="h-3 w-3" />
                    {t.badge[language]}
                  </span>
                  <span className="text-[11px] font-mono text-foreground/40">{t.totalDays} {isEs ? "días" : "days"}</span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                  {t.name[language]}
                </h3>
                <p className="mt-1 text-xs text-foreground/60 leading-relaxed line-clamp-2">
                  {t.summary[language]}
                </p>
              </button>
            );
          })}
        </div>

        {/* ─── 2. TIMELINE DÍA A DÍA (GANTT INTERACTIVO) ─── */}
        <div className="mt-8 rounded-3xl border border-white/14 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <span className="font-mono text-xs text-foreground/70 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-signal" />
              {isEs ? "Fases del Cronograma en Tiempo Real" : "Realtime Sprint Milestones"}
            </span>
            <div className="flex items-center gap-2 font-mono text-xs" style={{ color: tier.accentColor }}>
              <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: tier.accentColor }} />
              <span>SPRINT DE {tier.totalDays} DÍAS</span>
            </div>
          </div>

          {/* Stepper de Fases */}
          <div className="grid gap-3 sm:grid-cols-3">
            {tier.phases.map((phase, idx) => {
              const isActive = idx === activePhaseIndex;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`relative text-left rounded-xl p-4 border transition-all ${
                    isActive
                      ? "border-signal/40 bg-signal/[0.08] shadow-[0_0_20px_rgba(113,243,162,0.15)]"
                      : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                  style={{
                    borderColor: isActive ? tier.accentColor : undefined,
                    backgroundColor: isActive ? `${tier.accentColor}12` : undefined,
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-wider block"
                    style={{ color: isActive ? tier.accentColor : "rgba(255,255,255,0.4)" }}
                  >
                    {phase.dayRange}
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-foreground">{phase.title[language]}</h4>
                </button>
              );
            })}
          </div>

          {/* Detalle de la fase activa con entregables */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mt-6 rounded-2xl border border-white/10 bg-background/50 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-3 mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase text-signal">
                    {activePhase.dayRange} · {isEs ? "Objetivo de la Fase" : "Milestone Focus"}
                  </span>
                  <h4 className="text-base font-semibold text-foreground mt-0.5">{activePhase.title[language]}</h4>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-mono text-foreground/60 border border-white/10">
                  {activePhase.deliverables[language].length} {isEs ? "entregables clave" : "key deliverables"}
                </span>
              </div>

              <p className="text-sm text-foreground/70 leading-relaxed mb-5">{activePhase.description[language]}</p>

              {/* Lista de entregables verificados */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 block mb-2.5">
                  {isEs ? "Entregables Verificados de esta Fase:" : "Verified Deliverables for this Phase:"}
                </span>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {activePhase.deliverables[language].map((deliv, dIdx) => (
                    <div
                      key={dIdx}
                      className="rounded-xl border border-white/8 bg-white/[0.02] p-3 flex items-start gap-2.5 text-xs text-foreground/85"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-signal mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ─── 3. GARANTÍAS DE CALIDAD DEL SPRINT ─── */}
          <div className="mt-6 pt-5 border-t border-white/10 grid gap-3 sm:grid-cols-3">
            {tier.guarantees[language].map((guar, gIdx) => (
              <div key={gIdx} className="flex items-start gap-2 text-xs text-foreground/70">
                <ShieldCheck className="h-4 w-4 shrink-0 text-signal mt-0.5" />
                <span>{guar}</span>
              </div>
            ))}
          </div>

          {/* ─── 4. BOTONES DE ACCIÓN ─── */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={scrollToBrief}
              className="pressable inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: tier.accentColor,
                boxShadow: `0 0 20px ${tier.accentColor}35`,
              }}
            >
              <span>{isEs ? "Completar Brief con este Alcance" : "Fill Brief with this Scope"}</span>
              <ArrowDown className="h-4 w-4" />
            </button>

            <a
              href={whatsappPrefillUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-5 py-3.5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
            >
              <span>{isEs ? "Consultar disponibilidad por WhatsApp" : "Check sprint availability via WhatsApp"}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
