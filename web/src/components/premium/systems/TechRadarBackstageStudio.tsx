"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  Play,
  Pause,
  RotateCcw,
  Cpu,
  TrendingUp,
  RefreshCw,
  Search,
  FileText,
  CheckCircle2,
  Target,
  Share2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  TECH_ALERTS,
  MODEL_RECOMMENDATIONS,
  CONTENT_BLUEPRINTS,
  PARALLEL_CRAWLER_AGENTS,
  calculateMultiModelArbitrage,
  generateCustomBlueprint,
  generateFormattedBlueprintText,
  type TechAlert,
  type ModelUseCaseRecommendation,
  type ContentBlueprint,
  type ParallelCrawlerAgent,
} from "@/data/techRadarData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

export function TechRadarBackstageStudio() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Tab State: 'radar' | 'arbitrage' | 'studio'
  const [activeTab, setActiveTab] = useState<"radar" | "arbitrage" | "studio">("radar");

  // Tab 1: Radar & Crawler State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [crawlerAgents, setCrawlerAgents] = useState<ParallelCrawlerAgent[]>(PARALLEL_CRAWLER_AGENTS);
  const [lastSyncTime, setLastSyncTime] = useState<string>(isEs ? "hace 2 minutos" : "2 minutes ago");

  // Tab 2: Multi-Model Arbitrage Calculator State
  const [monthlyOps, setMonthlyOps] = useState<number>(50000);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(MODEL_RECOMMENDATIONS[0].id);

  // Tab 3: Anti-Dispersion Studio State
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(CONTENT_BLUEPRINTS[0].id);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [activeFormat, setActiveFormat] = useState<"reel" | "youtube" | "linkedin">("reel");
  const [customBlueprint, setCustomBlueprint] = useState<ContentBlueprint | null>(null);

  // Teleprompter / Recording HUD State
  const [isRecordingHudOpen, setIsRecordingHudOpen] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isRecordingTimerRunning, setIsRecordingTimerRunning] = useState<boolean>(false);
  const [completedAnchors, setCompletedAnchors] = useState<number[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [copied, setCopied] = useState<boolean>(false);

  // Arbitrage calculation
  const arbitrageData = useMemo(() => calculateMultiModelArbitrage(monthlyOps), [monthlyOps]);

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

  // Active Blueprint resolution
  const activeBlueprint = useMemo(() => {
    if (customBlueprint) return customBlueprint;
    return (
      CONTENT_BLUEPRINTS.find((b) => b.id === selectedBlueprintId) ||
      CONTENT_BLUEPRINTS[0]
    );
  }, [selectedBlueprintId, customBlueprint]);

  const formattedBlueprint = useMemo(
    () => generateFormattedBlueprintText(activeBlueprint, language),
    [activeBlueprint, language]
  );

  // Parallel Crawler Sweep Trigger
  const triggerParallelSweep = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(10);

    setCrawlerAgents((prev) =>
      prev.map((agent) => ({ ...agent, status: "scanning" }))
    );

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setCrawlerAgents((current) =>
            current.map((agent) => ({ ...agent, status: "synced" }))
          );
          setLastSyncTime(isEs ? "hace 5 segundos (verificado)" : "5 seconds ago (verified)");
          return 100;
        }
        return prev + 20;
      });
    }, 280);
  };

  // Recording Timer effect
  useEffect(() => {
    if (isRecordingTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecordingTimerRunning]);

  const toggleAnchorCompleted = (index: number) => {
    setCompletedAnchors((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedBlueprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // fallback
    }
  };

  // Convert News to Blueprint
  const convertNewsToBlueprint = (alert: TechAlert) => {
    const generated = generateCustomBlueprint(
      isEs ? alert.title.es : alert.title.en,
      activeFormat,
      language
    );
    setCustomBlueprint(generated);
    setActiveTab("studio");
  };

  const handleGenerateCustom = () => {
    if (!customTopic.trim()) return;
    const generated = generateCustomBlueprint(customTopic.trim(), activeFormat, language);
    setCustomBlueprint(generated);
  };

  const sendToWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    formattedBlueprint
  )}`;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-mono text-cyan-400">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span>
            {isEs
              ? "01.95 · DETRÁS DE ESCENA: RADAR DE INTELIGENCIA & BACKSTAGE OS"
              : "01.95 · BACKSTAGE OS: LIVE TECH RADAR & MULTI-MODEL ARBITRAGE"}
          </span>
        </div>

        <h2 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white sm:text-4xl light:text-ink">
          {isEs
            ? "El Detrás de Escena: Noticias en Vivo, Arbitraje Multi-Modelo y Blueprints Anti-Dispersión"
            : "The Backstage OS: Live News Sweeper, Multi-Model Arbitrage & Anti-Dispersion Blueprints"}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base light:text-ink/80">
          {isEs
            ? "Un sistema autónomo para concentrar breaking updates de la industria (WhatsApp API, LLMs, CRMs), simular la física de costos entre modelos de IA y generar guiones estructurados para grabar Reels y YouTube sin perder el foco."
            : "An autonomous operating system concentrating breaking industry updates (WhatsApp API, LLMs, CRMs), modeling multi-vendor token economics, and generating structured blueprints to record video content without dispersing."}
        </p>
      </div>

      {/* Main Mode Navigation Bar (Spring Pills) */}
      <div className="relative z-10 mt-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setActiveTab("radar")}
          className={`relative flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
            activeTab === "radar"
              ? "text-black font-semibold shadow-lg light:text-black"
              : "text-white/70 hover:text-white light:text-ink/70 light:hover:text-ink"
          }`}
        >
          {activeTab === "radar" && (
            <motion.div
              layoutId="backstage-tab-pill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-signal"
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Radio className="h-4 w-4" />
            {isEs ? "Radar & Ingesta en Vivo" : "Live Radar & Ingestion"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("arbitrage")}
          className={`relative flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
            activeTab === "arbitrage"
              ? "text-black font-semibold shadow-lg light:text-black"
              : "text-white/70 hover:text-white light:text-ink/70 light:hover:text-ink"
          }`}
        >
          {activeTab === "arbitrage" && (
            <motion.div
              layoutId="backstage-tab-pill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-signal"
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            {isEs ? "Arbitraje & Matriz Multi-Modelo" : "Multi-Model Arbitrage Matrix"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`relative flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
            activeTab === "studio"
              ? "text-black font-semibold shadow-lg light:text-black"
              : "text-white/70 hover:text-white light:text-ink/70 light:hover:text-ink"
          }`}
        >
          {activeTab === "studio" && (
            <motion.div
              layoutId="backstage-tab-pill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-signal"
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Video className="h-4 w-4" />
            {isEs ? "Estudio Anti-Dispersión & Teleprompter" : "Anti-Dispersion Studio & HUD"}
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: RADAR & INGESTA DE NOTICIAS EN VIVO + CRAWLER PARALELO
      ========================================================================= */}
      {activeTab === "radar" && (
        <motion.div
          key="tab-radar"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 mt-8 space-y-8"
        >
          {/* Autonomous Crawler Sweeper Terminal */}
          <div className="rounded-2xl border border-cyan-500/20 bg-[#090d14] p-5 shadow-2xl">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-signal animate-ping" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-white">
                    {isEs
                      ? "Motor de Ingesta & Agentes Paralelos de Búsqueda"
                      : "Parallel Web Crawlers & Autonomous Ingestion Engine"}
                  </h3>
                  <p className="text-xs text-white/50">
                    {isEs
                      ? `5 agentes paralelos monitoreando changelogs de Meta, Anthropic, DeepSeek, CRMs y Telefonía · Última sincronización: ${lastSyncTime}`
                      : `5 parallel agents crawling Meta, Anthropic, DeepSeek, CRMs and Voice changelogs · Last sync: ${lastSyncTime}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerParallelSweep}
                disabled={isScanning}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-mono font-medium text-cyan-300 transition-all hover:bg-cyan-500/20 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin text-cyan-400" : ""}`} />
                {isScanning
                  ? isEs
                    ? `Escaneando Fuentes (${scanProgress}%)`
                    : `Crawling Sources (${scanProgress}%)`
                  : isEs
                  ? "⚡ Disparar Barrido de Agentes"
                  : "⚡ Trigger Parallel Sweep"}
              </button>
            </div>

            {/* Progress Bar when scanning */}
            {isScanning && (
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-signal"
                  style={{ width: `${scanProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            )}

            {/* Crawler Agents Grid */}
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {crawlerAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">{agent.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ${
                        agent.status === "scanning"
                          ? "bg-amber-400/20 text-amber-300 animate-pulse"
                          : "bg-signal/20 text-signal"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {agent.status === "scanning" ? "FETCHING" : "200 OK"}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-white/40 truncate">
                    {agent.sourceTarget}
                  </div>
                  <div className="mt-2 text-[11px] leading-relaxed text-white/70">
                    {isEs ? agent.lastEvent.es : agent.lastEvent.en}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
                    <span>{agent.latencyMs}ms ping</span>
                    <span>{agent.payloadSizeKb} KB parsed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-mono text-white/50">
              {isEs ? "Filtrar Inteligencia:" : "Filter Intelligence:"}
            </span>
            {[
              { id: "all", label: isEs ? "Todas las Actualizaciones" : "All Updates" },
              { id: "whatsapp", label: "WhatsApp & Meta API" },
              { id: "llm", label: isEs ? "LLMs & Modelos Chinos" : "LLMs & Open Models" },
              { id: "crm", label: isEs ? "CRMs & Soberanía de Datos" : "CRMs & Data Sovereignty" },
              { id: "voice", label: isEs ? "Telefonía de Voz IA" : "Voice AI Telephony" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                  selectedCategory === cat.id
                    ? "border border-signal/50 bg-signal/15 text-signal font-semibold"
                    : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tech Alerts Feed */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b1017] p-6 shadow-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-[#0e141d]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-0.5 text-[11px] font-mono text-cyan-300">
                      {isEs ? alert.badge.es : alert.badge.en}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                        alert.impactScore === "critical"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30 font-bold"
                          : alert.impactScore === "high"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {alert.impactScore === "critical"
                        ? isEs
                          ? "🚨 Impacto Crítico"
                          : "🚨 Critical Impact"
                        : alert.impactScore === "high"
                        ? isEs
                          ? "⚡ Alta Palanca"
                          : "⚡ High Leverage"
                        : isEs
                        ? "💡 Táctico"
                        : "💡 Tactical"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white sm:text-lg">
                    {isEs ? alert.title.es : alert.title.en}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-white/70 sm:text-sm">
                    {isEs ? alert.summary.es : alert.summary.en}
                  </p>

                  <div className="mt-4 rounded-xl border border-signal/20 bg-signal/[0.04] p-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-signal">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{isEs ? "Criterio de Mario Morera:" : "Mario Morera Thesis:"}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/80">
                      {isEs ? alert.practicalRecommendation.es : alert.practicalRecommendation.en}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {alert.recommendedStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => convertNewsToBlueprint(alert)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 transition-all hover:bg-cyan-400/20 active:scale-95"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>{isEs ? "Crear Blueprint con esto" : "Create Blueprint from this"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-white/30">
                    {isEs ? `Fuente verificada: ${alert.sourceName}` : `Verified source: ${alert.sourceName}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          TAB 2: ARBITRAJE & MATRIZ MULTI-MODELO ("¿POR QUÉ NO UNA SOLA IA?")
      ========================================================================= */}
      {activeTab === "arbitrage" && (
        <motion.div
          key="tab-arbitrage"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 mt-8 space-y-8"
        >
          {/* Multi-Model Token Economics & Arbitrage Calculator */}
          <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-2xl sm:p-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3 py-0.5 text-xs font-mono text-signal">
                <Cpu className="h-3.5 w-3.5" />
                {isEs ? "Calculador de Arbitraje de Costes & Latencia" : "Multi-Model Token Arbitrage Simulator"}
              </span>
              <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {isEs
                  ? "¿Por qué casarse con una sola IA destruye el margen de tu empresa?"
                  : "Why marrying a single AI model destroys your enterprise margins"}
              </h3>
              <p className="mt-1 text-xs text-white/60 sm:text-sm">
                {isEs
                  ? "Muchos preguntan '¿tú usas Claude o ChatGPT?'. La respuesta correcta es: orquestar todas. Cada modelo tiene un vector de ventaja matemática que debe ser aprovechado."
                  : "People ask 'do you use Claude or ChatGPT?'. The correct engineering answer is: orchestrate all of them based on cost, latency, and context depth."}
              </p>
            </div>

            {/* Volume Slider Control */}
            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <label htmlFor="ops-slider" className="text-xs font-mono text-white/70">
                  {isEs
                    ? "Volumen mensual de operaciones (mensajes, leads, consultas RAG):"
                    : "Monthly operations volume (messages, leads, RAG queries):"}
                </label>
                <span className="font-mono text-lg font-bold text-cyan-400">
                  {monthlyOps.toLocaleString()} {isEs ? "ops/mes" : "ops/mo"}
                </span>
              </div>

              <input
                id="ops-slider"
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={monthlyOps}
                onChange={(e) => setMonthlyOps(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-cyan-400"
              />

              {/* Quick Presets */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[10000, 25000, 50000, 100000, 200000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMonthlyOps(preset)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all ${
                      monthlyOps === preset
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {preset.toLocaleString()} ops
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-Side Comparison Duel */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Monolithic Naive Stack */}
              <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-red-400">
                    {isEs ? "ENFOQUE TRADICIONAL MONOLÍTICO" : "TRADITIONAL MONOLITHIC STACK"}
                  </span>
                  <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-mono text-red-300">
                    100% GPT-4o / Claude Opus
                  </span>
                </div>

                <div className="mt-4 font-mono text-3xl font-extrabold text-white">
                  ${arbitrageData.singleModelCost.toLocaleString()} USD
                  <span className="text-xs font-normal text-white/40">/{isEs ? "mes" : "mo"}</span>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-white/70">
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{isEs ? "Latencia promedio alta: ~2,400ms" : "High average latency: ~2,400ms"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{isEs ? "Cero redundancia: si la API cae, tu negocio frena" : "Zero fallback redundancy: single point of failure"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{isEs ? "Quemás presupuesto pagando razonamiento caro para un simple 'hola'" : "Burning margin using frontier reasoning for simple greetings"}</span>
                  </li>
                </ul>
              </div>

              {/* Mario Morera Multi-Model Orchestration */}
              <div className="rounded-2xl border border-signal/40 bg-signal/[0.06] p-5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-signal">
                    {isEs ? "ARQUITECTURA MARIO MORERA" : "MARIO MORERA ORCHESTRATED STACK"}
                  </span>
                  <span className="rounded bg-signal/20 px-2 py-0.5 text-[10px] font-mono text-signal font-bold">
                    Multi-Model Edge Router
                  </span>
                </div>

                <div className="mt-4 font-mono text-3xl font-extrabold text-signal">
                  ${arbitrageData.orchestratedCost.toLocaleString()} USD
                  <span className="text-xs font-normal text-white/40">/{isEs ? "mes" : "mo"}</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>
                    {isEs
                      ? `Ahorrás $${arbitrageData.monthlySavingsUsd.toLocaleString()} USD/mes (${arbitrageData.savingsPercentage}% de ahorro)`
                      : `Saving $${arbitrageData.monthlySavingsUsd.toLocaleString()} USD/mo (${arbitrageData.savingsPercentage}% savings)`}
                  </span>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-signal shrink-0" />
                    <span>{isEs ? "Latencia ultrabaja P95: 340ms (86% más rápido)" : "Ultra-low P95 latency: 340ms (86% faster)"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-signal shrink-0" />
                    <span>{isEs ? "100% redundancia: Failover automático entre Google, Anthropic y DeepSeek" : "100% redundancy: Automatic failover across 3 independent vendors"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-signal shrink-0" />
                    <span>{isEs ? "Enrutador inteligente: Cada centavo va al modelo exacto" : "Smart Router: Every prompt matches its exact cost/power tier"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Traffic Allocation Breakdown Bars */}
            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4 font-mono text-xs">
              <div className="text-white/60 mb-2">
                {isEs ? "Distribución Óptima del Tráfico Operativo:" : "Optimal Operational Traffic Breakdown:"}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
                  <div className="text-cyan-300 font-bold">65% · Gemini 2.5 Flash</div>
                  <div className="text-[11px] text-white/50 mt-1">
                    {isEs ? "Triaje de leads, WhatsApp, chats veloces sub-400ms" : "Lead triage, WhatsApp chats, sub-400ms speed"}
                  </div>
                  <div className="text-cyan-400 text-sm font-semibold mt-2">
                    ${arbitrageData.breakdown.triageCost} USD
                  </div>
                </div>

                <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-3">
                  <div className="text-purple-300 font-bold">25% · DeepSeek R1 / V3</div>
                  <div className="text-[11px] text-white/50 mt-1">
                    {isEs ? "RAG, análisis de PDFs, extracción de bases de datos" : "RAG pipelines, bulk PDF parsing, DB queries"}
                  </div>
                  <div className="text-purple-400 text-sm font-semibold mt-2">
                    ${arbitrageData.breakdown.ragCost} USD
                  </div>
                </div>

                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                  <div className="text-amber-300 font-bold">10% · Claude 3.7 Sonnet</div>
                  <div className="text-[11px] text-white/50 mt-1">
                    {isEs ? "Decisiones críticas, código TypeScript estricto, lógica compleja" : "Critical decisions, strict TypeScript, complex logic"}
                  </div>
                  <div className="text-amber-400 text-sm font-semibold mt-2">
                    ${arbitrageData.breakdown.logicCost} USD
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tactical Use Cases ("¿Qué usar para qué?") */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/60">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>{isEs ? "GUÍA TÁCTICA: ¿QUÉ MODELO USAR PARA CADA CASO?" : "TACTICAL MATRIX: WHAT MODEL FOR WHAT TASK?"}</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {MODEL_RECOMMENDATIONS.map((useCase) => (
                <button
                  key={useCase.id}
                  type="button"
                  onClick={() => setSelectedUseCaseId(useCase.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    selectedUseCaseId === useCase.id
                      ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg"
                      : "border-white/10 bg-[#0b1017] hover:border-white/20 hover:bg-[#0e141d]"
                  }`}
                >
                  <div className="text-xs font-bold text-white">
                    {isEs ? useCase.taskTitle.es : useCase.taskTitle.en}
                  </div>
                  <div className="mt-2 text-xs font-mono font-semibold text-cyan-300">
                    {useCase.recommendedModel}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>{useCase.latencyTarget}</span>
                    <span className="text-signal">{useCase.costEstimate10kOps}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Use Case In-Depth Card */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1017] p-6 shadow-xl">
              <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
                <div>
                  <span className="text-xs font-mono text-cyan-400">
                    {isEs ? "Modelo Recomendado" : "Recommended Model"}
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {activeUseCase.recommendedModel}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
                    {activeUseCase.latencyTarget}
                  </span>
                  <span className="rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-xs font-mono text-signal">
                    {activeUseCase.costEstimate10kOps} / 10k ops
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-signal/20 bg-signal/[0.04] p-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-signal">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isEs ? "¿Por qué esta elección?" : "Why this choice?"}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                    {isEs ? activeUseCase.whyThisChoice.es : activeUseCase.whyThisChoice.en}
                  </p>
                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>{isEs ? "¿Qué evitar terminantemente?" : "What to avoid?"}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                    {isEs ? activeUseCase.whatToAvoid.es : activeUseCase.whatToAvoid.en}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-1.5 text-white/60">
                  <span>{isEs ? "Herramientas de soporte:" : "Supporting tools:"}</span>
                  {activeUseCase.supportingTools.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
                    isEs
                      ? `Hola Mario, vi tu comparador multi-modelo. Quiero auditar la arquitectura de IA de mi empresa para implementar ${activeUseCase.recommendedModel} y bajar costos.`
                      : `Hi Mario, I saw your multi-model comparison. I want to audit our AI architecture to deploy ${activeUseCase.recommendedModel} and slash token costs.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-signal/40 bg-signal/15 px-3 py-1.5 text-xs font-mono font-medium text-signal transition-all hover:bg-signal/25"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{isEs ? "Cotizar esta arquitectura" : "Quote this architecture"}</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          TAB 3: ESTUDIO ANTI-DISPERSIÓN & TELEPROMPTER HUD
      ========================================================================= */}
      {activeTab === "studio" && (
        <motion.div
          key="tab-studio"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 mt-8 space-y-8"
        >
          {/* Studio Controls Header */}
          <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-2xl sm:p-8">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-0.5 text-xs font-mono text-cyan-400">
                  <Video className="h-3.5 w-3.5" />
                  {isEs ? "Generador de Blueprints Anti-Dispersión" : "Anti-Dispersion Blueprint Studio"}
                </span>
                <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  {isEs
                    ? "Grabá con naturalidad sin perderte ni desviar el tema"
                    : "Record naturally with solid anchor points and zero dispersion"}
                </h3>
                <p className="mt-1 text-xs text-white/60 sm:text-sm">
                  {isEs
                    ? "Estructura quirúrgica: Hook de 3s, la trampa común, demostración en pantalla, 3 puntos de anclaje irrenunciables y llamada a la acción."
                    : "Surgical structure: 3-second hook, common trap, on-screen architecture, 3 core anchor points, and direct conversion CTA."}
                </p>
              </div>

              {/* HUD / Teleprompter Toggle Button */}
              <button
                type="button"
                onClick={() => setIsRecordingHudOpen(!isRecordingHudOpen)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold transition-all ${
                  isRecordingHudOpen
                    ? "border border-red-500 bg-red-500/20 text-red-300 animate-pulse"
                    : "border border-cyan-400/40 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25"
                }`}
              >
                <Target className="h-4 w-4" />
                <span>
                  {isRecordingHudOpen
                    ? isEs
                      ? "🔴 Modo HUD Activo (Cerrar)"
                      : "🔴 HUD Mode Active (Close)"
                    : isEs
                    ? "🎯 Activar Modo HUD / Grabación"
                    : "🎯 Open Recording HUD Mode"}
                </span>
              </button>
            </div>

            {/* Custom Topic Generator Bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder={
                    isEs
                      ? "O ingresá un tema libre: 'Por qué no usar WhatsApp Web con 5 vendedores'..."
                      : "Or type a custom topic: 'Why WhatsApp Web breaks with 5 sales reps'..."
                  }
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateCustom()}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Format Selector */}
              <div className="flex gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 font-mono text-xs">
                {(["reel", "youtube", "linkedin"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setActiveFormat(fmt)}
                    className={`rounded-lg px-3 py-1.5 uppercase transition-all ${
                      activeFormat === fmt
                        ? "bg-cyan-500/30 text-cyan-300 font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerateCustom}
                className="rounded-xl border border-cyan-400/40 bg-cyan-400/20 px-4 py-2.5 text-xs font-mono font-semibold text-cyan-300 hover:bg-cyan-400/30"
              >
                {isEs ? "Generar" : "Generate"}
              </button>
            </div>

            {/* Built-in Blueprints Preset Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-white/50">
                {isEs ? "Blueprints de Producción:" : "Production Blueprints:"}
              </span>
              {CONTENT_BLUEPRINTS.map((bp) => (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() => {
                    setSelectedBlueprintId(bp.id);
                    setCustomBlueprint(null);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                    !customBlueprint && selectedBlueprintId === bp.id
                      ? "border border-cyan-400/50 bg-cyan-400/20 text-cyan-300 font-semibold"
                      : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  {isEs ? bp.topicTitle.es : bp.topicTitle.en}
                </button>
              ))}
            </div>
          </div>

          {/* RECORDING HUD / TELEPROMPTER OVERLAY (When active) */}
          <AnimatePresence>
            {isRecordingHudOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-3xl border-2 border-red-500/50 bg-[#070b12] p-6 shadow-2xl sm:p-8"
              >
                {/* HUD Header with Timer */}
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 items-center justify-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                    </span>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                        {isEs ? "HUD DE GRABACIÓN EN VIVO · PANTALLA SECUNDARIA" : "LIVE RECORDING HUD · SECONDARY DISPLAY"}
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {isEs ? activeBlueprint.topicTitle.es : activeBlueprint.topicTitle.en}
                      </h4>
                    </div>
                  </div>

                  {/* Stopwatch Controls */}
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-2xl font-black text-red-400 bg-red-950/40 border border-red-500/40 px-3 py-1 rounded-xl">
                      {formatTimer(recordingSeconds)}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsRecordingTimerRunning(!isRecordingTimerRunning)}
                      className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                      {isRecordingTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsRecordingTimerRunning(false);
                        setRecordingSeconds(0);
                        setCompletedAnchors([]);
                      }}
                      className="rounded-xl border border-white/20 bg-white/10 p-2 text-white/60 hover:text-white"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Anchor Points Checklist Cards (Large high-contrast display) */}
                <div className="mt-6">
                  <div className="text-xs font-mono text-cyan-400 mb-3">
                    {isEs
                      ? "TOCA CADA ANCLA MIENTRAS GRABÁS PARA NO SALIRTE DEL GUION:"
                      : "CLICK EACH ANCHOR POINT AS YOU SPEAK TO MAINTAIN FOCUS:"}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {activeBlueprint.anchorPoints[language].map((point, idx) => {
                      const isDone = completedAnchors.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleAnchorCompleted(idx)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            isDone
                              ? "border-signal/50 bg-signal/15 opacity-60 line-through"
                              : "border-cyan-400/40 bg-cyan-950/20 hover:border-cyan-400"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white/60">{`PUNTO 0${idx + 1}`}</span>
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-signal" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                            )}
                          </div>
                          <div className="mt-2 text-sm font-bold text-white leading-snug">
                            {point}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Hook & Screen Cues */}
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 text-xs font-mono">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-amber-400 font-bold">{isEs ? "🎣 EL GANCHO:" : "🎣 HOOK:"}</span>
                    <p className="mt-1 text-white/80">{isEs ? activeBlueprint.hook.es : activeBlueprint.hook.en}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-cyan-400 font-bold">{isEs ? "🛠️ QUÉ MOSTRAR:" : "🛠️ SCREEN CUE:"}</span>
                    <p className="mt-1 text-white/80">{isEs ? activeBlueprint.coreArchitecture.es : activeBlueprint.coreArchitecture.en}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Static Blueprint Card View */}
          <div className="rounded-3xl border border-white/10 bg-[#0b1017] p-6 shadow-xl sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
              <div>
                <span className="rounded bg-cyan-400/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                  {isEs ? activeBlueprint.durationLabel.es : activeBlueprint.durationLabel.en}
                </span>
                <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  {isEs ? activeBlueprint.topicTitle.es : activeBlueprint.topicTitle.en}
                </h3>
              </div>

              {/* Action Buttons: WhatsApp & Copy */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-mono font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
                >
                  {copied ? <Check className="h-4 w-4 text-signal" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? (isEs ? "¡Copiado!" : "Copied!") : (isEs ? "Copiar Guion" : "Copy Blueprint")}</span>
                </button>

                <a
                  href={sendToWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-signal/50 bg-signal/20 px-4 py-2.5 text-xs font-mono font-bold text-signal transition-all hover:bg-signal/30 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isEs ? "Enviar a mi WhatsApp" : "Send to my WhatsApp"}</span>
                </a>
              </div>
            </div>

            {/* Blueprint Sections Breakdown */}
            <div className="mt-6 space-y-4">
              {/* Section 1: Hook */}
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.03] p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">1</span>
                  <span>{isEs ? "EL GANCHO (0:00 - 0:05)" : "THE HOOK (0:00 - 0:05)"}</span>
                </div>
                <p className="mt-2 text-sm font-semibold italic text-white sm:text-base">
                  {isEs ? activeBlueprint.hook.es : activeBlueprint.hook.en}
                </p>
              </div>

              {/* Section 2: Trap */}
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">2</span>
                  <span>{isEs ? "LA TRAMPA / EL ERROR COMÚN" : "THE COMMON TRAP / BREAKDOWN"}</span>
                </div>
                <p className="mt-2 text-sm text-white/80">
                  {isEs ? activeBlueprint.trapWarning.es : activeBlueprint.trapWarning.en}
                </p>
              </div>

              {/* Section 3: Screen Architecture */}
              <div className="rounded-2xl border border-purple-400/20 bg-purple-400/[0.03] p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-400/20 text-purple-300">3</span>
                  <span>{isEs ? "DEMOSTRACIÓN EN PANTALLA / CÓDIGO" : "ON-SCREEN ARCHITECTURE / CODE DEMO"}</span>
                </div>
                <p className="mt-2 text-sm text-white/80 font-mono">
                  {isEs ? activeBlueprint.coreArchitecture.es : activeBlueprint.coreArchitecture.en}
                </p>
              </div>

              {/* Section 4: 3 Anchor Points */}
              <div className="rounded-2xl border border-signal/30 bg-signal/[0.03] p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-signal">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-signal/20 text-signal">4</span>
                  <span>{isEs ? "TRES PUNTOS DE ANCLAJE (ANTI-DISPERSIÓN)" : "THREE ANCHOR POINTS (ANTI-DISPERSION)"}</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {activeBlueprint.anchorPoints[language].map((point, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/90 font-medium"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: CTA */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white/60">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/60">5</span>
                  <span>{isEs ? "CIERRE & LLAMADA A LA ACCIÓN" : "CLOSING & DIRECT CALL TO ACTION"}</span>
                </div>
                <p className="mt-2 text-sm text-white/90">
                  {isEs ? activeBlueprint.closingCta.es : activeBlueprint.closingCta.en}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
