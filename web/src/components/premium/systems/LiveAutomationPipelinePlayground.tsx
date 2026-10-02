"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  PIPELINE_SCENARIOS,
  calculatePipelineEfficiency,
  type PipelineScenarioId,
  type PipelineStageNode,
} from "@/data/automationPipelineData";
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Terminal,
  FileCode,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export function LiveAutomationPipelinePlayground() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [selectedScenarioId, setSelectedScenarioId] =
    useState<PipelineScenarioId>("inbound_web_lead");
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inspectorTab, setInspectorTab] = useState<"payload" | "logs">("payload");

  const scenario = useMemo(
    () =>
      PIPELINE_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
      PIPELINE_SCENARIOS[0],
    [selectedScenarioId]
  );

  const activeStage: PipelineStageNode = scenario.stages[activeStageIndex];

  const efficiency = useMemo(
    () => calculatePipelineEfficiency(selectedScenarioId),
    [selectedScenarioId]
  );

  // Auto-advance through stages when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStageIndex((prev) => {
        if (prev < scenario.stages.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 1100);

    return () => clearInterval(timer);
  }, [isPlaying, scenario.stages.length]);

  const handleTriggerPulse = useCallback(() => {
    setActiveStageIndex(0);
    setIsPlaying(true);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setActiveStageIndex(0);
  }, []);

  const whatsappInquiryUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve probando el simulador de pipeline de automatización en /sistemas (${scenario.name.es}). Quiero implementar este flujo de trabajo en mi empresa.`
      : `Hi Mario, I was testing the live automation pipeline simulator on /sistemas (${scenario.name.en}). I want to implement this automated workflow in my business.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [scenario, isEs]);

  return (
    <section
      id="pipeline-en-vivo"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]"
    >
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_#71F3A2] animate-pulse" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                {isEs ? "Simulador de Flujo & Webhooks en Tiempo Real" : "Live Event Bus & Webhook Dispatcher"}
              </p>
            </div>
            <SplitReveal
              as="h2"
              text={
                isEs
                  ? "Mirá cómo viaja la corriente: de un webhook a tu CRM en 400ms."
                  : "Watch the current travel: from webhook to CRM in 400ms."
              }
              className="mt-4 text-[clamp(2.2rem,4.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
            />
            <Reveal as="p" className="mt-4 text-base leading-relaxed text-foreground/60 sm:text-lg">
              {isEs
                ? "Las automatizaciones no son cajas negras. Dispará eventos de negocio en vivo para inspeccionar la cascada de llamadas API, firmas criptográficas y sincronizaciones en milisegundos."
                : "Automations are not black boxes. Fire real business triggers to inspect the cascading API calls, cryptographic signatures, and database syncs in milliseconds."}
            </Reveal>
          </div>

          {/* Efficiency Metric Tag */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-5 py-3.5 backdrop-blur-md">
            <Clock className="h-4 w-4 text-signal shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
                {isEs ? "Velocidad Operativa" : "Execution Speed"}
              </p>
              <p className="text-sm font-semibold text-signal font-mono">
                {scenario.totalDurationMs}ms vs {scenario.manualDurationHours}h manual
              </p>
            </div>
          </div>
        </div>

        {/* ─── SCENARIO SELECTOR (3 TABS) ─── */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-b border-white/8 pb-4">
          {PIPELINE_SCENARIOS.map((scen) => {
            const isSelected = scen.id === selectedScenarioId;
            return (
              <button
                key={scen.id}
                onClick={() => {
                  setSelectedScenarioId(scen.id);
                  setActiveStageIndex(0);
                  setIsPlaying(false);
                }}
                className={`group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-mono text-xs transition-all ${
                  isSelected
                    ? "border border-signal/40 bg-signal/15 text-signal font-semibold shadow-[0_0_20px_rgba(113,243,162,0.18)]"
                    : "border border-white/8 bg-white/[0.02] text-foreground/60 hover:bg-white/[0.06] hover:text-foreground hover:border-white/15"
                }`}
              >
                <span className="text-[10px] opacity-50 uppercase tracking-widest">{scen.badge[language]}</span>
                <span>{scen.name[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Trigger Context & Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-card/40 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/10 border border-signal/20 text-signal">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 block">
                {isEs ? "Disparador de Negocio" : "Business Trigger"}
              </span>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {scenario.triggerDescription[language]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPulse}
              className="pressable inline-flex items-center gap-2 rounded-xl bg-signal px-4 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              <Play className="h-3.5 w-3.5 fill-black" />
              <span>{isEs ? "Disparar Pulso" : "Trigger Pulse"}</span>
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-mono text-foreground hover:bg-white/10 transition-colors"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? (isEs ? "Pausar" : "Pause") : (isEs ? "Continuar" : "Resume")}</span>
            </button>

            <button
              onClick={handleReset}
              title={isEs ? "Reiniciar" : "Reset"}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-foreground hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ─── GRAPH DE NODOS (5 ETAPAS EN FILA) ─── */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 relative">
          {scenario.stages.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            const isCompleted = idx < activeStageIndex;

            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStageIndex(idx);
                  setIsPlaying(false);
                }}
                className={`group relative text-left rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                  isActive
                    ? "border-signal bg-signal/[0.08] shadow-[0_0_30px_rgba(113,243,162,0.22)] scale-[1.02]"
                    : isCompleted
                    ? "border-white/20 bg-card/70 opacity-90"
                    : "border-white/8 bg-white/[0.02] opacity-60 hover:opacity-100 hover:border-white/15"
                }`}
              >
                {/* Header Node */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${
                      isActive
                        ? "bg-signal/20 text-signal"
                        : isCompleted
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-white/5 text-foreground/40"
                    }`}
                  >
                    STEP 0{stage.stepNumber}
                  </span>

                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isActive ? "text-signal" : "text-foreground/40"
                    }`}
                  >
                    {stage.latencyMs}ms
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-foreground leading-snug">
                  {stage.title[language]}
                </h4>

                <p className="mt-1 font-mono text-[10px] text-foreground/50 truncate">
                  {stage.technology}
                </p>

                <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-foreground/40">HTTP Status</span>
                  <span className={stage.httpStatus < 300 ? "text-signal font-semibold" : "text-amber-400 font-semibold"}>
                    {stage.httpStatus} OK
                  </span>
                </div>

                {/* Pulse Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-node-indicator"
                    className="absolute -bottom-px left-4 right-4 h-0.5 bg-signal shadow-[0_0_8px_#71F3A2]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── STAGE INSPECTOR: PAYLOAD & LOGS ─── */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#0A0D10] p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-signal animate-ping" />
              <span className="font-mono text-xs text-foreground/75 font-semibold">
                {isEs ? "Inspección de Nodo Activo" : "Active Node Telemetry"}: {activeStage.title[language]}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-foreground/50">
                {activeStage.technology}
              </span>
            </div>

            {/* Sub-tabs for Payload vs Logs */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.02] p-1">
              <button
                onClick={() => setInspectorTab("payload")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-colors ${
                  inspectorTab === "payload"
                    ? "bg-signal text-black font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <FileCode className="h-3 w-3" />
                <span>JSON Payload</span>
              </button>
              <button
                onClick={() => setInspectorTab("logs")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-colors ${
                  inspectorTab === "logs"
                    ? "bg-signal text-black font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <Terminal className="h-3 w-3" />
                <span>System Logs</span>
              </button>
            </div>
          </div>

          {/* Inspector Content */}
          <div className="mt-5">
            <p className="text-xs text-foreground/60 leading-relaxed mb-4">
              {activeStage.summary[language]}
            </p>

            {inspectorTab === "payload" ? (
              <pre className="max-h-64 overflow-x-auto rounded-xl border border-white/8 bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-signal/90">
                <code>{JSON.stringify(activeStage.payload, null, 2)}</code>
              </pre>
            ) : (
              <div className="space-y-2 rounded-xl border border-white/8 bg-black/60 p-4 font-mono text-[11px]">
                {activeStage.logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-3">
                    <span className="text-foreground/35 shrink-0">[{log.timestamp}]</span>
                    <span
                      className={
                        log.level === "success"
                          ? "text-signal"
                          : log.level === "warn"
                          ? "text-amber-400"
                          : "text-foreground/75"
                      }
                    >
                      {log.message[language]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comparative ROI Footer */}
          <div className="mt-6 pt-5 border-t border-white/8 grid gap-4 sm:grid-cols-3 text-center sm:text-left items-center">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
              <span className="text-[10px] font-mono uppercase text-foreground/40 block">Tiempo Total del Flujo</span>
              <span className="text-lg font-bold font-mono text-signal">{scenario.totalDurationMs} ms</span>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
              <span className="text-[10px] font-mono uppercase text-foreground/40 block">Horas Ahorradas Mensuales</span>
              <span className="text-lg font-bold font-mono text-foreground">+{efficiency.hoursSavedPerMonth}h / mes</span>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
              <span className="text-[10px] font-mono uppercase text-foreground/40 block">Cierre de Ventas Adicional</span>
              <span className="text-lg font-bold font-mono text-cyan-400">+{scenario.conversionLiftPct}% lift</span>
            </div>
          </div>

          {/* CTA Link */}
          <div className="mt-6 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-foreground/50 max-w-xl">
              {isEs
                ? "Construido con código propio en Next.js Edge, PostgreSQL y APIs oficiales. Cero servidores caídos, cero intermediarios innecesarios."
                : "Built with custom Next.js Edge code, PostgreSQL, and official APIs. Zero downtime, zero unnecessary intermediaries."}
            </p>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-xs font-semibold text-black transition-transform hover:scale-[1.02] shadow-[0_0_15px_rgba(113,243,162,0.3)]"
            >
              <span>{isEs ? "Automatizar este flujo en mi empresa" : "Automate this workflow in my company"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
