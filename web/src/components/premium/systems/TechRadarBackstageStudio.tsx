"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  SlidersHorizontal,
  Video,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Zap,
  Bot,
  Database,
  PhoneCall,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  Terminal,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  TECH_ALERTS,
  MODEL_RECOMMENDATIONS,
  CONTENT_BLUEPRINTS,
  generateFormattedBlueprintText,
  type TechAlert,
  type ModelUseCaseRecommendation,
  type ContentBlueprint,
} from "@/data/techRadarData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

export function TechRadarBackstageStudio() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Tab State: 'radar' | 'matrix' | 'studio'
  const [activeTab, setActiveTab] = useState<"radar" | "matrix" | "studio">("radar");

  // Filter for alerts
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selected use case in matrix
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(
    MODEL_RECOMMENDATIONS[0].id
  );

  // Selected blueprint in studio
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(
    CONTENT_BLUEPRINTS[0].id
  );

  const [copied, setCopied] = useState<boolean>(false);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    if (selectedCategory === "all") return TECH_ALERTS;
    return TECH_ALERTS.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const activeUseCase = useMemo(
    () =>
      MODEL_RECOMMENDATIONS.find((m) => m.id === selectedUseCaseId) ||
      MODEL_RECOMMENDATIONS[0],
    [selectedUseCaseId]
  );

  const activeBlueprint = useMemo(
    () =>
      CONTENT_BLUEPRINTS.find((b) => b.id === selectedBlueprintId) ||
      CONTENT_BLUEPRINTS[0],
    [selectedBlueprintId]
  );

  const formattedBlueprint = useMemo(
    () => generateFormattedBlueprintText(activeBlueprint, language),
    [activeBlueprint, language]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedBlueprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // fallback
    }
  };

  const sendToWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    formattedBlueprint
  )}`;

  return (
    <section
      id="radar-inteligencia"
      className="relative isolate my-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#06080d] p-6 backdrop-blur-2xl sm:p-10 lg:p-12 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Background glowing gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-signal/10 blur-[140px]"
      />

      {/* Header */}
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-mono text-cyan-400">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span>
            {isEs
              ? "01.95 · RADAR DE INTELIGENCIA & BACKSTAGE STUDIO"
              : "01.95 · TECH INTELLIGENCE RADAR & BACKSTAGE STUDIO"}
          </span>
        </div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
          {isEs
            ? "El detrás de escena: criterio multi-modelo y blueprints anti-dispersión."
            : "The backstage: multi-model criteria & anti-dispersion blueprints."}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
          {isEs
            ? "Casarse con una sola herramienta es el error más costoso en tecnología. Monitoreá los cambios críticos del ecosistema en tiempo real, descubrí qué modelo usar para cada tarea y generá guiones estructurados para grabar sin perder el hilo."
            : "Single-vendor lock-in is the most expensive mistake in modern software. Track critical ecosystem updates, discover which AI or database fits each task, and generate structured blueprints to record video with zero fluff."}
        </p>
      </div>

      {/* Primary 3-Tab Navigator */}
      <div className="relative z-10 mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-4 light:border-[rgb(var(--ink-rgb)/0.1)]">
        <button
          type="button"
          onClick={() => setActiveTab("radar")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs transition-all ${
            activeTab === "radar"
              ? "bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(85,216,255,0.35)]"
              : "border border-white/10 bg-white/5 text-foreground/70 hover:border-white/20 hover:text-foreground"
          }`}
        >
          <Radio className="h-4 w-4" />
          <span>{isEs ? "Radar de Alertas en Vivo" : "Live Ecosystem Radar"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs transition-all ${
            activeTab === "matrix"
              ? "bg-signal text-black font-semibold shadow-[0_0_20px_rgba(113,243,162,0.35)]"
              : "border border-white/10 bg-white/5 text-foreground/70 hover:border-white/20 hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{isEs ? "Matriz Multi-Modelo (¿Qué usar?)" : "Multi-Model Matrix"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs transition-all ${
            activeTab === "studio"
              ? "bg-purple-400 text-black font-semibold shadow-[0_0_20px_rgba(182,140,255,0.35)]"
              : "border border-white/10 bg-white/5 text-foreground/70 hover:border-white/20 hover:text-foreground"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>{isEs ? "Backstage: Blueprints de Grabación" : "Backstage: Recording Blueprints"}</span>
        </button>
      </div>

      {/* TAB 1: RADAR DE ALERTAS EN VIVO */}
      {activeTab === "radar" && (
        <motion.div
          key="tab-radar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 mt-8 space-y-6"
        >
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: { es: "Todas las Alertas", en: "All Alerts" } },
              { id: "whatsapp", label: { es: "WhatsApp API", en: "WhatsApp API" } },
              { id: "llm", label: { es: "IAs & Modelos", en: "LLMs & Models" } },
              { id: "crm", label: { es: "CRMs & Datos", en: "CRMs & Data" } },
              { id: "voice", label: { es: "Telefonía de Voz", en: "Voice Telephony" } },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white/20 text-white font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {cat.label[language]}
              </button>
            ))}
          </div>

          {/* Alerts Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 transition-all hover:border-cyan-400/40 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-cyan-400 font-semibold border border-cyan-400/20">
                    <Zap className="h-3 w-3" />
                    {alert.badge[language]}
                  </span>
                  <span className="text-foreground/50">{alert.date}</span>
                </div>

                <h3 className="mt-3 font-semibold text-base sm:text-lg text-foreground">
                  {alert.title[language]}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-foreground/70 leading-relaxed">
                  {alert.summary[language]}
                </p>

                <div className="mt-4 rounded-xl border border-signal/20 bg-signal/[0.05] p-3 text-xs text-foreground/80">
                  <span className="font-mono text-signal font-semibold block mb-1">
                    {isEs ? "⚡ Recomendación Táctica:" : "⚡ Tactical Fix:"}
                  </span>
                  {alert.practicalRecommendation[language]}
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {alert.recommendedStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-foreground/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 2: MATRIZ MULTI-MODELO */}
      {activeTab === "matrix" && (
        <motion.div
          key="tab-matrix"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
        >
          {/* Left: Use Case Selector */}
          <div className="space-y-3">
            <label className="font-mono text-xs uppercase tracking-wider text-foreground/60 block mb-2">
              {isEs ? "Seleccioná el Caso de Uso Empresarial:" : "Select Business Use Case:"}
            </label>

            {MODEL_RECOMMENDATIONS.map((rec) => {
              const isSelected = selectedUseCaseId === rec.id;
              return (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setSelectedUseCaseId(rec.id)}
                  className={`w-full rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                    isSelected
                      ? "border-signal/50 bg-signal/[0.08] shadow-[0_0_24px_rgba(113,243,162,0.12)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm sm:text-base text-foreground">
                      {rec.taskTitle[language]}
                    </span>
                    <span className="font-mono text-xs text-signal font-semibold">
                      {rec.latencyTarget}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-mono text-foreground/60">
                    <span className="text-foreground/40">{isEs ? "Modelo:" : "Model:"}</span>{" "}
                    <span className="text-cyan-400 font-bold">{rec.recommendedModel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Technical Inspector Panel */}
          <div className="rounded-2xl border border-white/15 bg-[#0b1017] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-signal">
                  {isEs ? "CONFIGURACIÓN RECOMENDADA" : "RECOMMENDED CONFIGURATION"}
                </span>
                <h4 className="mt-1 font-bold text-lg text-foreground">
                  {activeUseCase.recommendedModel}
                </h4>
              </div>

              <span className="rounded-full bg-signal/15 px-3 py-1 font-mono text-xs font-bold text-signal border border-signal/30">
                {activeUseCase.costEstimate10kOps} / 10k ops
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <div>
                <span className="font-mono text-xs text-foreground/50 block mb-1">
                  {isEs ? "¿Por qué esta combinación?" : "Why this architecture?"}
                </span>
                <p className="text-foreground/85 leading-relaxed">
                  {activeUseCase.whyThisChoice[language]}
                </p>
              </div>

              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5">
                <span className="font-mono text-xs text-rose-400 font-semibold block mb-1 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {isEs ? "Qué evitar estrictamente:" : "Strictly avoid:"}
                </span>
                <p className="text-rose-200/80 leading-relaxed text-xs">
                  {activeUseCase.whatToAvoid[language]}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs text-foreground/50 block mb-2">
                  {isEs ? "Herramientas de Soporte / Pipeline:" : "Supporting Stack:"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeUseCase.supportingTools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-foreground/75"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: BACKSTAGE STUDIO: BLUEPRINTS DE GRABACIÓN */}
      {activeTab === "studio" && (
        <motion.div
          key="tab-studio"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start"
        >
          {/* Left: Blueprint Topic Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                {isEs ? "Elegí el Tema para Grabar:" : "Select Recording Topic:"}
              </label>
              <span className="font-mono text-xs text-purple-400">
                {activeBlueprint.durationLabel[language]}
              </span>
            </div>

            <div className="space-y-3">
              {CONTENT_BLUEPRINTS.map((bp) => {
                const isSelected = selectedBlueprintId === bp.id;
                return (
                  <button
                    key={bp.id}
                    type="button"
                    onClick={() => setSelectedBlueprintId(bp.id)}
                    className={`w-full rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                      isSelected
                        ? "border-purple-400/60 bg-purple-400/[0.08] shadow-[0_0_24px_rgba(182,140,255,0.15)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm sm:text-base text-foreground">
                        {bp.topicTitle[language]}
                      </span>
                      <span className="shrink-0 rounded-full bg-purple-400/20 px-2.5 py-0.5 font-mono text-[10px] text-purple-300 font-semibold uppercase">
                        {bp.format}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-foreground/60 line-clamp-2">
                      {bp.hook[language]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: The Anti-Dispersion Blueprint Teleprompter */}
          <div className="rounded-2xl border border-white/15 bg-[#0b1017] p-5 sm:p-7 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400 font-semibold">
                  {isEs ? "BLUEPRINT ANTI-DISPERSIÓN" : "ANTI-DISPERSION BLUEPRINT"}
                </span>
                <h4 className="mt-1 font-bold text-base sm:text-lg text-foreground">
                  {activeBlueprint.topicTitle[language]}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-mono text-foreground/80 hover:border-white/30 hover:text-foreground transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-signal" />
                      <span className="text-signal">{isEs ? "Copiado" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{isEs ? "Copiar" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Structured Teleprompter Breakdown */}
            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              {/* Hook */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <span className="font-mono text-xs text-purple-400 font-bold block mb-1">
                  🎣 {isEs ? "1. Gancho de Entrada (Hook 0:00 - 0:05):" : "1. The Hook (0:00 - 0:05):"}
                </span>
                <p className="text-foreground/90 font-medium italic">
                  {activeBlueprint.hook[language]}
                </p>
              </div>

              {/* Trap warning */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-200/90">
                <span className="font-mono font-bold block mb-1 text-amber-300">
                  ⚠️ {isEs ? "2. La Trampa / El Error Común:" : "2. The Common Mistake:"}
                </span>
                {activeBlueprint.trapWarning[language]}
              </div>

              {/* Core Architecture */}
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3.5 text-xs text-cyan-200/90">
                <span className="font-mono font-bold block mb-1 text-cyan-300">
                  🛠️ {isEs ? "3. Qué Mostrar en Pantalla (Demo / Código):" : "3. Screen Demo (Code / Flow):"}
                </span>
                {activeBlueprint.coreArchitecture[language]}
              </div>

              {/* Anchor points */}
              <div className="rounded-xl border border-signal/20 bg-signal/[0.04] p-3.5">
                <span className="font-mono text-xs text-signal font-bold block mb-2">
                  🎯 {isEs ? "4. Tres Puntos de Anclaje (Para no dispersarte):" : "4. Three Anchor Points (Stay on Track):"}
                </span>
                <ul className="space-y-1.5 text-xs text-foreground/80">
                  {activeBlueprint.anchorPoints[language].map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-signal font-mono">▸</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <span className="font-mono text-xs text-foreground/50 font-bold block mb-1">
                  🚀 {isEs ? "5. Cierre & CTA Directo:" : "5. Closing CTA:"}
                </span>
                <p className="text-foreground/80 text-xs italic">
                  {activeBlueprint.closingCta[language]}
                </p>
              </div>
            </div>

            {/* Direct Send to Phone via WhatsApp */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={sendToWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs sm:text-sm font-semibold text-black shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                <span>
                  {isEs
                    ? "Enviar este guión a mi WhatsApp para grabar desde el celular"
                    : "Send blueprint to my WhatsApp to record on mobile"}
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
