"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  ECOSYSTEM_MODULES,
  calculateEcosystemMetrics,
  type EcosystemModule,
} from "@/data/ecosystemConfiguratorData";
import {
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export function InteractiveEcosystemConfigurator() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Default selected: Web + WhatsApp AI
  const [selectedIds, setSelectedIds] = useState<string[]>(["web", "whatsapp_ai", "crm"]);

  const toggleModule = (id: string) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(10); } catch {}
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const report = useMemo(
    () => calculateEcosystemMetrics(selectedIds),
    [selectedIds]
  );

  const selectedModules = useMemo(
    () => ECOSYSTEM_MODULES.filter((m) => selectedIds.includes(m.id)),
    [selectedIds]
  );

  const whatsappPrefillUrl = useMemo(() => {
    const moduleNames = selectedModules.map((m) => m.name[language]).join(", ");
    const text = isEs
      ? `Hola Mario, estuve configurando mi ecosistema en tu sitio web. Me interesa integrar: [${moduleNames}] con un sprint proyectado de ~${report.estimatedSprintDays} días. Quiero coordinar los detalles.`
      : `Hi Mario, I was configuring my custom ecosystem on your site. I'm interested in: [${moduleNames}] with a projected sprint of ~${report.estimatedSprintDays} days. Let's discuss details.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [selectedModules, report, language, isEs]);

  return (
    <div className="mt-20 rounded-3xl border border-white/12 bg-card/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Resplandor ambiental */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(113,243,162,0.12)_0%,transparent_65%)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_#71F3A2] animate-pulse" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
              {isEs ? "Configurador Táctil · Diseñá tu Arquitectura" : "Tactile Configurator · Design Your Architecture"}
            </p>
          </div>
          <SplitReveal
            as="h3"
            text={
              isEs
                ? "Seleccioná tus módulos. Mirá cómo se ensambla el sistema."
                : "Select your modules. Watch the system assemble."
            }
            className="mt-3 text-[clamp(1.8rem,3.5vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.04em] text-foreground"
          />
          <Reveal as="p" className="mt-3 text-sm sm:text-base leading-relaxed text-foreground/60">
            {isEs
              ? "Activá o desactivá los componentes de tu solución. El motor calcula en vivo los días de sprint, las horas operativas recuperadas y la reducción de fricción para tu equipo."
              : "Toggle your solution's components. The engine calculates sprint timeline, monthly hours saved, and friction reduction in real time."}
          </Reveal>
        </div>

        {/* ─── 1. MÓDULOS SELECCIONABLES (5 CARDS TÁCTILES) ─── */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ECOSYSTEM_MODULES.map((mod) => {
            const isSelected = selectedIds.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                aria-pressed={isSelected}
                aria-label={mod.name[language]}
                className={`group relative text-left rounded-2xl p-4 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  isSelected
                    ? "border-white/40 bg-card/90 shadow-[0_8px_30px_rgba(0,0,0,0.5)] scale-[1.02] light:bg-card"
                    : "border-white/8 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 opacity-70 hover:opacity-100"
                }`}
                style={{
                  borderColor: isSelected ? mod.accentColor : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold"
                    style={{
                      backgroundColor: isSelected ? `${mod.accentColor}25` : "rgba(255,255,255,0.06)",
                      color: isSelected ? mod.accentColor : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {mod.tag}
                  </span>
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? "border-transparent" : "border-white/20"
                    }`}
                    style={{
                      backgroundColor: isSelected ? mod.accentColor : "transparent",
                    }}
                  >
                    {isSelected && <Check className="h-3 w-3 text-black stroke-[3]" />}
                  </div>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-foreground group-hover:text-foreground transition-colors">
                  {mod.name[language]}
                </h4>
                <p className="mt-1 text-xs text-foreground/50 leading-tight line-clamp-2">
                  {mod.subtitle[language]}
                </p>

                <div className="mt-3 pt-2 border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-foreground/50">
                  <span>+{mod.monthlyHoursSaved}h/mes</span>
                  <span style={{ color: isSelected ? mod.accentColor : undefined }}>
                    +{mod.conversionLiftPct}% conv.
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── 2. STAGE DEL CIRCUITO & TELEMETRÍA EN VIVO ─── */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-background/50 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-signal" />
              <span className="font-mono text-xs uppercase tracking-wider text-foreground/70">
                {isEs ? "Topología del Ecosistema Ensamblado" : "Assembled Ecosystem Topology"}
              </span>
            </div>
            <span className="text-xs font-mono text-signal bg-signal/10 px-3 py-1 rounded-full border border-signal/20">
              {report.recommendedSprintTier[language]}
            </span>
          </div>

          {/* Módulos conectados activamente */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 py-4">
            {selectedModules.length > 0 ? (
              selectedModules.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-xl px-4 py-2.5 border text-xs font-mono flex items-center gap-2 backdrop-blur-md shadow-lg"
                  style={{
                    borderColor: `${m.accentColor}50`,
                    backgroundColor: `${m.accentColor}12`,
                    color: m.accentColor,
                  }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.accentColor }} />
                  <span className="font-semibold text-foreground">{m.name[language]}</span>
                  {idx < selectedModules.length - 1 && (
                    <span className="text-foreground/30 ml-1">→</span>
                  )}
                </motion.div>
              ))
            ) : (
              <span className="text-xs font-mono text-foreground/40">
                {isEs ? "Seleccioná al menos un módulo arriba para ensamblar tu circuito" : "Select at least one module above to assemble your circuit"}
              </span>
            )}
          </div>

          {/* HUD de Métricas Proyectadas */}
          <div className="mt-6 pt-5 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <span className="text-[10px] font-mono uppercase text-foreground/40 block">Plazo de Sprint</span>
              <span className="text-xl font-bold font-mono text-signal">
                {report.estimatedSprintDays} {isEs ? "días" : "days"}
              </span>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <span className="text-[10px] font-mono uppercase text-foreground/40 block">Horas Ahorradas</span>
              <span className="text-xl font-bold font-mono text-foreground">
                +{report.totalMonthlyHoursSaved}h / mes
              </span>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <span className="text-[10px] font-mono uppercase text-foreground/40 block">Lift Conversión</span>
              <span className="text-xl font-bold font-mono text-accent">
                +{report.projectedConversionLiftPct}%
              </span>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <span className="text-[10px] font-mono uppercase text-foreground/40 block">Fricción Menos</span>
              <span className="text-xl font-bold font-mono text-track-create">
                -{report.frictionReductionPct}%
              </span>
            </div>
          </div>

          {/* CTA de Cotización Directa */}
          <div className="mt-6 pt-5 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-foreground/60 leading-relaxed max-w-xl">
              {isEs
                ? "Todo construido directamente por Mario Morera. Sin agencias intermediarias, sin plantillas lentas y con garantía de entrega cerrada."
                : "Everything built directly by Mario Morera. Zero intermediary agency layers, zero slow templates, and fixed delivery guarantee."}
            </p>

            <a
              href={whatsappPrefillUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] bg-signal shadow-[0_0_20px_rgba(113,243,162,0.35)]"
            >
              <span>{isEs ? "Cotizar esta configuración" : "Quote this configuration"}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
