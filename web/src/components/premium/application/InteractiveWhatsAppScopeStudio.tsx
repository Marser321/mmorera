"use client";

import { useState, useMemo, useId, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Bot,
  Database,
  CreditCard,
  LineChart,
  MessageCircle,
  Copy,
  Check,
  CheckCheck,
  Zap,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  SCOPE_MODULES,
  VELOCITY_TIERS,
  calculateScopeSummary,
  type ScopeModule,
} from "@/data/whatsappScopeData";

const moduleIcons: Record<ScopeModule["iconName"], LucideIcon> = {
  globe: Globe,
  bot: Bot,
  database: Database,
  "credit-card": CreditCard,
  "line-chart": LineChart,
};

const volumePresets = [100, 500, 1500, 3000];

export function InteractiveWhatsAppScopeStudio() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const volumeInputId = useId();

  // State
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    "webapp",
    "ai-agent",
    "crm-pipeline",
  ]);
  const [selectedVelocityId, setSelectedVelocityId] = useState<string>("full");
  const [monthlyVolume, setMonthlyVolume] = useState<number>(500);
  const [copied, setCopied] = useState<boolean>(false);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Toggle module selection
  const handleToggleModule = (id: string) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(10); } catch {}
    }
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Calculate scope summary
  const summary = useMemo(
    () =>
      calculateScopeSummary(
        selectedModuleIds,
        selectedVelocityId,
        monthlyVolume,
        language
      ),
    [selectedModuleIds, selectedVelocityId, monthlyVolume, language]
  );

  // Copy to clipboard handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.formattedMessage);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(10); } catch {}
      }
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2400);
    } catch {
      // fallback
    }
  };

  return (
    <section
      id="estudio-alcance-whatsapp"
      className="relative isolate my-12 overflow-hidden rounded-[2rem] border border-white/10 bg-card/60 p-6 backdrop-blur-xl sm:p-10 lg:p-12 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Background glow effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-signal/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-[100px]"
      />

      {/* Header */}
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-xs font-mono text-signal">
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {isEs
              ? "01 · ESTUDIO DE ALCANCE INTERACTIVO"
              : "01 · INTERACTIVE SCOPE STUDIO"}
          </span>
        </div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
          {isEs
            ? "Diseñá tu arquitectura y testeala en WhatsApp en vivo."
            : "Design your architecture & test it live in WhatsApp."}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
          {isEs
            ? "Seleccioná los módulos que necesita tu empresa, calibrá la velocidad de entrega y mirá cómo se sintetiza el alcance en tiempo real listo para ejecutar sin llamadas exploratorias improductivas."
            : "Select the modules your business needs, calibrate delivery velocity, and watch the technical scope synthesize in real time ready to execute without wasteful discovery calls."}
        </p>
      </div>

      {/* Studio Grid */}
      <div className="relative z-10 mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* Left Column: Interactive Synthesizer */}
        <div className="space-y-8">
          {/* Step 1: System Modules */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground/80">
                {isEs ? "Paso 1: Módulos del Sistema" : "Step 1: System Modules"}
              </label>
              <span className="font-mono text-xs text-signal">
                {selectedModuleIds.length} / {SCOPE_MODULES.length}{" "}
                {isEs ? "activos" : "active"}
              </span>
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-1">
              {SCOPE_MODULES.map((mod) => {
                const isSelected = selectedModuleIds.includes(mod.id);
                const Icon = moduleIcons[mod.iconName];

                return (
                  <motion.button
                    key={mod.id}
                    type="button"
                    onClick={() => handleToggleModule(mod.id)}
                    aria-pressed={isSelected}
                    aria-label={mod.name[language]}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      isSelected
                        ? "border-signal/50 bg-signal/[0.08] shadow-[0_0_24px_rgba(113,243,162,0.12)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-white/40"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isSelected
                          ? "border-signal/40 bg-signal/20 text-signal"
                          : "border-white/10 bg-white/5 text-foreground/60 light:border-[rgb(var(--ink-rgb)/0.1)]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-foreground text-sm sm:text-base">
                          {mod.name[language]}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-signal/15 px-2 py-0.5 font-mono text-[10px] text-signal font-semibold">
                          +{mod.hoursSavedWeekly}h/
                          {isEs ? "sem" : "wk"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
                        {mod.description[language]}
                      </p>
                    </div>

                    {/* Checkmark indicator */}
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "border-signal bg-signal text-black"
                          : "border-white/20 bg-transparent text-transparent light:border-[rgb(var(--ink-rgb)/0.2)]"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Delivery Velocity */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground/80">
                {isEs
                  ? "Paso 2: Velocidad de Entrega"
                  : "Step 2: Delivery Velocity"}
              </label>
              <span className="font-mono text-xs text-accent">
                {summary.velocity.durationLabel[language]}
              </span>
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
              {VELOCITY_TIERS.map((tier) => {
                const isSelected = selectedVelocityId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                        try { navigator.vibrate(8); } catch {}
                      }
                      setSelectedVelocityId(tier.id);
                    }}
                    aria-pressed={isSelected}
                    aria-label={tier.name[language]}
                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      isSelected
                        ? "border-accent/60 bg-accent/[0.08] shadow-[0_0_20px_rgba(85,216,255,0.12)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-white/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-mono font-medium text-accent">
                          {tier.tag[language]}
                        </span>
                        <Clock className="h-3.5 w-3.5 text-foreground/50" />
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        {tier.name[language]}
                      </div>
                    </div>
                    <div className="mt-4 font-mono text-xs text-foreground/60 border-t border-white/5 pt-2 light:border-[rgb(var(--ink-rgb)/0.05)]">
                      {tier.durationLabel[language]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Estimated Monthly Volume */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor={volumeInputId} className="font-mono text-xs uppercase tracking-wider text-foreground/80">
                {isEs
                  ? "Paso 3: Volumen Operativo Mensual"
                  : "Step 3: Monthly Operational Volume"}
              </label>
              <span className="font-mono text-sm font-bold text-signal">
                ~{monthlyVolume.toLocaleString(isEs ? "es-AR" : "en-US")}{" "}
                {isEs ? "operaciones/mes" : "ops/month"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <input
                id={volumeInputId}
                type="range"
                min="50"
                max="3000"
                step="50"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-signal transition-colors hover:bg-white/20"
                aria-label={
                  isEs
                    ? "Control de volumen operativo mensual"
                    : "Monthly operational volume slider"
                }
              />

              {/* Volume quick presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {volumePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMonthlyVolume(preset)}
                    className={`rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                      monthlyVolume === preset
                        ? "bg-signal text-black font-semibold shadow-[0_0_12px_rgba(113,243,162,0.3)]"
                        : "border border-white/10 bg-white/5 text-foreground/70 hover:border-white/20 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.1)]"
                    }`}
                  >
                    {preset.toLocaleString()}{" "}
                    {isEs ? "ops" : "ops"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive WhatsApp Terminal Mockup */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0b141a] shadow-2xl light:border-[rgb(var(--ink-rgb)/0.15)]">
            {/* WhatsApp Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#202c33] px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal text-black font-bold text-sm">
                    MM
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#202c33] bg-[#25D366]" />
                </div>
                <div>
                  <div className="font-medium text-sm text-white">
                    Mario Morera
                  </div>
                  <div className="text-[11px] font-mono text-signal/90 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    {isEs ? "En línea · Systems Builder" : "Online · Systems Builder"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] text-white/70 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-signal" />
                  <span>E2E Direct</span>
                </div>
              </div>
            </div>

            {/* Chat Area Background */}
            <div className="relative min-h-[380px] p-4 sm:p-6 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]">
              {/* Encryption Banner */}
              <div className="mx-auto mb-4 max-w-xs rounded-lg bg-[#182229] px-3 py-1.5 text-center text-[10px] text-[#ffd279] shadow-sm">
                🔒{" "}
                {isEs
                  ? "Mensaje cifrado de extremo a extremo directamente con Mario Morera."
                  : "End-to-end encrypted direct message with Mario Morera."}
              </div>

              {/* Live Formatted WhatsApp Message Bubble */}
              <div className="flex justify-end">
                <motion.div
                  key={`${selectedModuleIds.join("-")}-${selectedVelocityId}-${monthlyVolume}`}
                  initial={{ opacity: 0.8, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative max-w-sm rounded-2xl rounded-tr-sm bg-[#005c4b] p-4 text-white shadow-md sm:max-w-md"
                >
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-white/95">
                    {summary.formattedMessage}
                  </pre>

                  {/* Bubble Footer */}
                  <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-white/60 font-mono">
                    <span>13:20</span>
                    <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Telemetry Summary Bar */}
            <div className="grid grid-cols-3 border-t border-white/10 bg-[#111b21] p-3 text-center text-xs font-mono">
              <div className="border-r border-white/10">
                <div className="text-foreground/50 text-[10px]">
                  {isEs ? "AHORRO ESTIMADO" : "ESTIMATED SAVINGS"}
                </div>
                <div className="text-signal font-semibold text-sm">
                  ~{summary.estimatedHoursSavedWeekly}h/
                  {isEs ? "sem" : "wk"}
                </div>
              </div>
              <div className="border-r border-white/10">
                <div className="text-foreground/50 text-[10px]">
                  {isEs ? "ENTREGA" : "DELIVERY"}
                </div>
                <div className="text-accent font-semibold text-sm">
                  {summary.velocity.days} {isEs ? "días" : "days"}
                </div>
              </div>
              <div>
                <div className="text-foreground/50 text-[10px]">
                  {isEs ? "PALANCA" : "LEVERAGE"}
                </div>
                <div className="text-track-create font-semibold text-sm">
                  {summary.estimatedEfficiencyFactor}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="border-t border-white/10 bg-[#202c33] p-4 space-y-2.5">
              <a
                href={summary.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-black shadow-[0_0_24px_rgba(37,211,102,0.3)] transition-transform hover:-translate-y-0.5 hover:bg-[#20bd5a]"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span>
                  {isEs
                    ? "Abrir en WhatsApp con este alcance"
                    : "Open in WhatsApp with this scope"}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="pressable flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-signal" />
                    <span className="text-signal">
                      {isEs
                        ? "¡Copiado al portapapeles!"
                        : "Copied to clipboard!"}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>
                      {isEs
                        ? "Copiar especificación técnica"
                        : "Copy technical specification"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
