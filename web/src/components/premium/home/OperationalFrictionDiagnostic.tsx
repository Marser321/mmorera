"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  FRICTION_SYMPTOMS,
  calculateFrictionDiagnostic,
  type FrictionSymptom,
} from "@/data/frictionDiagnosticData";
import {
  AlertTriangle,
  CheckCircle2,
  Zap,
  TrendingDown,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function OperationalFrictionDiagnostic() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Pre-select 2 common symptoms as realistic initial state
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "slow_response",
    "manual_data_entry",
  ]);

  const toggleSymptom = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const report = useMemo(
    () => calculateFrictionDiagnostic(selectedIds),
    [selectedIds]
  );

  // 1-Click Modernization Simulation
  const [isModernized, setIsModernized] = useState(false);

  const handleSimulateModernization = useCallback(() => {
    setIsModernized(true);
    setTimeout(() => {
      setSelectedIds([]);
      setIsModernized(false);
    }, 1200);
  }, []);

  const whatsappInquiryUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, hice el diagnóstico de deuda operativa en tu web (Score de fricción: ${report.frictionScorePct}%, ~${report.totalMonthlyHoursWasted}h perdidas/mes). Quiero evaluar un sprint para modernizar mi sistema.`
      : `Hi Mario, I completed the operational friction audit on your site (Friction score: ${report.frictionScorePct}%, ~${report.totalMonthlyHoursWasted}h wasted/mo). I want to evaluate a sprint to modernize my setup.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [report, isEs]);

  // Color mapping based on severity
  const severityColors = {
    healthy: {
      text: "text-signal",
      bg: "bg-signal/15",
      border: "border-signal/40",
      glow: "rgba(113,243,162,0.25)",
      label: { es: "Operación Eficiente", en: "Efficient Operation" },
    },
    moderate: {
      text: "text-amber-400",
      bg: "bg-amber-400/15",
      border: "border-amber-400/40",
      glow: "rgba(251,191,36,0.25)",
      label: { es: "Fricción Moderada", en: "Moderate Friction" },
    },
    critical: {
      text: "text-rose-400",
      bg: "bg-rose-400/15",
      border: "border-rose-400/40",
      glow: "rgba(244,63,94,0.25)",
      label: { es: "Fricción Crítica", en: "Critical Friction" },
    },
  }[report.severity];

  return (
    <section
      id="diagnostico-friccion"
      className="relative scroll-mt-24 border-t border-white/10 bg-card/20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/10"
    >
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_#71F3A2] animate-pulse" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                {isEs ? "Auditoría Táctil · Diagnóstico de Fricción" : "Tactile Audit · Operational Friction Diagnostic"}
              </p>
            </div>
            <SplitReveal
              as="h2"
              text={
                isEs
                  ? "Identificá dónde está perdiendo dinero tu operación."
                  : "Pinpoint where your operation is leaking revenue."
              }
              className="mt-4 text-[clamp(2.2rem,4.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
            />
            <Reveal as="p" className="mt-4 text-base leading-relaxed text-foreground/60 sm:text-lg">
              {isEs
                ? "Tildá los síntomas que ocurren en tu día a día. El motor calcula en vivo el nivel de deuda técnica, las horas tiradas a la basura y el sprint exacto para erradicarlos."
                : "Check the friction symptoms present in your daily operations. The engine calculates tech debt score, wasted team hours, and the exact sprint architecture to eliminate them."}
            </Reveal>
          </div>

          {/* Severity Badge */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-5 py-3.5 backdrop-blur-md">
            <AlertTriangle className={`h-5 w-5 ${severityColors.text} shrink-0`} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
                {isEs ? "Nivel de Diagnóstico" : "Diagnostic Status"}
              </p>
              <p className={`text-sm font-semibold font-mono ${severityColors.text}`}>
                {severityColors.label[language]} ({report.frictionScorePct}%)
              </p>
            </div>
          </div>
        </div>

        {/* ─── MAIN STAGE: CHECKLIST + REALTIME RADAR HUD ─── */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
          {/* Checklist of 5 Symptoms */}
          <div className="space-y-3.5">
            {FRICTION_SYMPTOMS.map((symptom) => {
              const isChecked = selectedIds.includes(symptom.id);

              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`group relative w-full text-left rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex items-start gap-4 ${
                    isChecked
                      ? "border-white/30 bg-card/80 shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
                      : "border-white/8 bg-white/[0.02] opacity-75 hover:opacity-100 hover:border-white/18"
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                      isChecked
                        ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                        : "border-white/20 bg-white/5 text-transparent group-hover:border-white/40"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-rose-400/90">
                        {symptom.badge[language]}
                      </span>

                      <div className="flex items-center gap-3 font-mono text-[10px] text-foreground/45">
                        <span>+{symptom.monthlyHoursImpact}h/mes</span>
                        <span>-${symptom.monthlyDollarsImpact} USD</span>
                      </div>
                    </div>

                    <h4 className="mt-2 text-sm sm:text-base font-semibold text-foreground leading-snug">
                      {symptom.title[language]}
                    </h4>

                    <p className="mt-2 text-xs text-foreground/55 leading-relaxed">
                      {symptom.description[language]}
                    </p>

                    {isChecked && (
                      <div className="mt-3.5 pt-3 border-t border-white/8 flex items-center gap-2 text-xs font-mono text-signal">
                        <Zap className="h-3.5 w-3.5 shrink-0" />
                        <span>{symptom.solutionComponent[language]}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Realtime Diagnostic HUD & Prescription */}
          <div className="sticky top-28 space-y-6">
            {/* Main Gauge Card */}
            <div className="rounded-3xl border border-white/12 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {isEs ? "Score de Deuda Operativa" : "Tech Debt Friction Score"}
                </span>

                <button
                  onClick={handleSimulateModernization}
                  disabled={isModernized || selectedIds.length === 0}
                  className="pressable inline-flex items-center gap-1.5 rounded-lg bg-signal/15 border border-signal/30 px-3 py-1 text-[11px] font-mono font-semibold text-signal hover:bg-signal/25 transition-colors disabled:opacity-40"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isEs ? "Modernizar 1-Clic" : "1-Click Modernize"}</span>
                </button>
              </div>

              {/* Big Friction Meter */}
              <div className="mt-6 text-center">
                <motion.div
                  key={report.frictionScorePct}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block"
                >
                  <span className={`text-6xl sm:text-7xl font-mono font-bold tracking-tight ${severityColors.text}`}>
                    {report.frictionScorePct}%
                  </span>
                </motion.div>
                <p className="mt-2 text-xs font-mono uppercase tracking-widest text-foreground/50">
                  {severityColors.label[language]} ({report.selectedCount} / {report.totalSymptoms} {isEs ? "síntomas" : "symptoms"})
                </p>

                {/* Progress bar */}
                <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      report.severity === "critical"
                        ? "bg-rose-500 shadow-[0_0_12px_#f43f5e]"
                        : report.severity === "moderate"
                        ? "bg-amber-400 shadow-[0_0_12px_#fbbf24]"
                        : "bg-signal shadow-[0_0_12px_#71F3A2]"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${report.frictionScorePct}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                </div>
              </div>

              {/* Losses Telemetry */}
              <div className="mt-8 grid grid-cols-2 gap-3 text-center border-t border-white/8 pt-6">
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <span className="text-[10px] font-mono uppercase text-foreground/40 block">
                    {isEs ? "Fuga Mensual" : "Monthly Leak"}
                  </span>
                  <span className="text-xl font-bold font-mono text-rose-400">
                    -${report.totalMonthlyDollarsLost} <span className="text-xs">USD</span>
                  </span>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <span className="text-[10px] font-mono uppercase text-foreground/40 block">
                    {isEs ? "Horas Tiradas" : "Wasted Hours"}
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    -{report.totalMonthlyHoursWasted}h <span className="text-xs">/ mes</span>
                  </span>
                </div>
              </div>

              {/* Recommended Sprint Prescription */}
              <div className="mt-6 rounded-2xl border border-signal/20 bg-signal/[0.04] p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-signal font-semibold block mb-1">
                  {isEs ? "Prescripción de Arquitectura" : "Architecture Prescription"}
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {report.prescribedSprint.name[language]}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {report.prescribedSprint.recommendedStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-foreground/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct CTA */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-signal px-6 py-4 text-sm font-semibold text-black transition-transform hover:scale-[1.02] shadow-[0_0_25px_rgba(113,243,162,0.35)]"
              >
                <span>{isEs ? "Erradicar estas fricciones" : "Eliminate these bottlenecks"}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
