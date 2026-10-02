"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  Play,
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  Zap,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  MessageSquare,
  Building2,
  Stethoscope,
  Briefcase,
  ShoppingBag,
} from "lucide-react";

import {
  NICHES,
  PIPELINE_STEPS,
  type BusinessNicheId,
  calculateSimulatorMetrics,
} from "@/data/pipelineSimulatorData";

export function PipelineSimulatorSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // State
  const [selectedNicheId, setSelectedNicheId] = useState<BusinessNicheId>("clinicas");
  const [leadVolume, setLeadVolume] = useState<number>(250);
  const [isAutomatedMode, setIsAutomatedMode] = useState<boolean>(true);
  const [activeStepSimulation, setActiveStepSimulation] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showConsoleTab, setShowConsoleTab] = useState<boolean>(false);

  const activeNiche = useMemo(
    () => NICHES.find((n) => n.id === selectedNicheId) ?? NICHES[0],
    [selectedNicheId]
  );

  // Calculations based on mode and volume
  const metrics = useMemo(
    () => calculateSimulatorMetrics(isAutomatedMode, leadVolume),
    [isAutomatedMode, leadVolume]
  );

  // Simulation runner
  const runLiveSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStepSimulation(0);

    setTimeout(() => setActiveStepSimulation(1), 700);
    setTimeout(() => setActiveStepSimulation(2), 1500);
    setTimeout(() => setActiveStepSimulation(3), 2300);
    setTimeout(() => {
      setIsSimulating(false);
    }, 3200);
  };

  const whatsappPrefilledUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, probé el simulador en tu web para un negocio de ${activeNiche.name.es} con ~${leadVolume} leads/mes. Me gustaría ver cómo estructurar este sistema para nosotros.`
      : `Hi Mario, I tested the live simulator on your site for a ${activeNiche.name.en} setup with ~${leadVolume} leads/mo. I'd love to see how to structure this system for our business.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [activeNiche, leadVolume, isEs]);

  return (
    <section
      id="simulador"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Luz ambiental interactiva según el nicho activo */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 20%, ${activeNiche.accentColor}18 0%, transparent 65%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500"
              style={{ backgroundColor: activeNiche.accentColor, color: activeNiche.accentColor }}
            />
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: activeNiche.accentColor }}
            >
              {isEs ? "Simulador Táctil B2B · Sandbox en Vivo" : "Tactile B2B Simulator · Live Sandbox"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Probá el flujo de tu empresa. Mirá dónde se pierden los clientes."
                : "Test your business pipeline. Watch where clients drop off."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Un sistema de captación y cierre no se evalúa en diapositivas teóricas: se prueba con datos. Seleccioná tu nicho, regulá tu volumen de prospectos y compará el costo del proceso manual frente a un circuito con IA y CRM."
              : "Lead acquisition and closing systems aren't judged on theory slides: they are battle-tested with numbers. Choose your industry, adjust volume, and compare the friction of manual handling vs. an automated AI & CRM workflow."}
          </Reveal>
        </div>

        {/* ─── 1. SELECTOR DE NICHO (Pills interactivos) ─── */}
        <div className="mt-10">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-3">
            {isEs ? "Paso 1: Seleccioná tu tipo de negocio" : "Step 1: Choose your business vertical"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {NICHES.map((niche) => {
              const isSelected = selectedNicheId === niche.id;
              const Icon = niche.icon;
              return (
                <motion.button
                  key={niche.id}
                  type="button"
                  onClick={() => setSelectedNicheId(niche.id)}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative text-left rounded-2xl border p-4 sm:p-5 transition-all backdrop-blur-md min-h-[96px] ${
                    isSelected
                      ? "border-opacity-70 bg-card/90 shadow-xl"
                      : "border-white/10 bg-card/40 text-foreground/70 hover:border-white/20 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/70"
                  }`}
                  style={{
                    borderColor: isSelected ? niche.accentColor : undefined,
                    boxShadow: isSelected ? `0 0 25px ${niche.accentColor}25` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
                      style={{
                        backgroundColor: isSelected ? `${niche.accentColor}20` : "rgba(255,255,255,0.06)",
                        color: isSelected ? niche.accentColor : "inherit",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: niche.accentColor }} />
                    )}
                  </div>
                  <h4 className="mt-3 font-semibold text-sm sm:text-base text-foreground tracking-tight">
                    {niche.name[language]}
                  </h4>
                  <p className="mt-1 font-mono text-[11px] text-foreground/50">
                    {niche.ticketLabel[language]}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Dolor típico del nicho */}
        <motion.div
          key={selectedNicheId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5 sm:px-4 text-xs sm:text-sm text-foreground/75 light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-white/[0.6]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <span>
            <strong className="text-foreground font-medium">{isEs ? "Fricción frecuente: " : "Common bottleneck: "}</strong>
            {activeNiche.typicalPain[language]}
          </span>
        </motion.div>

        {/* ─── 2. CONTROLES DEL SIMULADOR (Slider de leads + Toggle de Modo) ─── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12 items-center rounded-3xl border border-white/10 bg-card/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90">
          {/* Slider de volumen */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between">
              <label htmlFor="lead-volume-slider" className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground/70">
                <Users className="h-4 w-4 text-signal" />
                <span>{isEs ? "Volumen de prospectos al mes" : "Monthly lead volume"}</span>
              </label>
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight" style={{ color: activeNiche.accentColor }}>
                {leadVolume.toLocaleString()} {isEs ? "leads" : "leads"}
              </span>
            </div>

            <div className="relative mt-4">
              <input
                id="lead-volume-slider"
                type="range"
                min={30}
                max={1500}
                step={10}
                value={leadVolume}
                onChange={(e) => setLeadVolume(Number(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-white/15 accent-signal transition-all light:bg-black/15"
                style={{
                  accentColor: activeNiche.accentColor,
                }}
              />
              <div className="flex justify-between font-mono text-[10px] text-foreground/40 mt-2">
                <span>30 leads ({isEs ? "arranque" : "starter"})</span>
                <span>500 leads ({isEs ? "crecimiento" : "scaling"})</span>
                <span>1,500+ ({isEs ? "alto volumen" : "enterprise"})</span>
              </div>
            </div>
          </div>

          {/* Toggle de Modo: Manual vs Automatizado */}
          <div className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-5 lg:pt-0 lg:pl-8 light:border-[rgb(var(--ink-rgb)/0.1)]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 mb-2.5">
              {isEs ? "Paso 2: Modo de operación a simular" : "Step 2: Operational mode to simulate"}
            </span>

            <div className="grid grid-cols-2 p-1 rounded-2xl border border-white/12 bg-black/40 backdrop-blur-md light:bg-black/5">
              <button
                type="button"
                onClick={() => setIsAutomatedMode(false)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  !isAutomatedMode
                    ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-md font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <span>🛑</span>
                <span>{isEs ? "Manual Lento" : "Slow Manual"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAutomatedMode(true)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isAutomatedMode
                    ? "bg-signal/20 text-signal border border-signal/40 shadow-[0_0_15px_rgba(113,243,162,0.2)] font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <span>⚡</span>
                <span>{isEs ? "Operador IA & CRM" : "AI & CRM Stack"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── 3. EL PIPELINE VISUAL ANIMADO (WOW FACTOR) ─── */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-card/60 p-6 sm:p-10 backdrop-blur-2xl shadow-3xl relative overflow-hidden light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/85">
          {/* Header del canvas con botón de disparo */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                {isEs ? "Circuito de eventos en tiempo real" : "Live Event Pipeline Circuit"}
              </span>
              <h3 className="text-lg sm:text-2xl font-medium tracking-tight text-foreground mt-0.5">
                {isAutomatedMode
                  ? isEs
                    ? "Circuito Autónomo de Alta Frecuencia"
                    : "High-Frequency Autonomous Circuit"
                  : isEs
                  ? "Proceso Manual Tradicional con Fricción"
                  : "Traditional Manual Process with High Friction"}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConsoleTab(!showConsoleTab)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono transition-all ${
                  showConsoleTab
                    ? "border-signal bg-signal/15 text-signal"
                    : "border-white/12 bg-white/5 text-foreground/70 hover:border-white/25 hover:text-foreground"
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>{showConsoleTab ? (isEs ? "Ocultar Consola IA" : "Hide AI Console") : (isEs ? "Ver Consola IA" : "View AI Console")}</span>
              </button>

              <motion.button
                type="button"
                onClick={runLiveSimulation}
                disabled={isSimulating}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  isSimulating
                    ? "bg-white/10 text-foreground/50 cursor-not-allowed"
                    : "bg-signal text-neutral-950 shadow-[0_0_20px_rgba(113,243,162,0.4)] hover:brightness-110"
                }`}
              >
                <Play className={`h-4 w-4 ${isSimulating ? "animate-spin" : ""}`} />
                <span>
                  {isSimulating
                    ? isEs
                      ? "Disparando Paquete..."
                      : "Packet In Flight..."
                    : isEs
                    ? "Disparar Lead de Prueba"
                    : "Fire Test Lead"}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Consola de Agente IA Desplegable */}
          <AnimatePresence>
            {showConsoleTab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-b border-white/8 pb-6 mb-6 light:border-[rgb(var(--ink-rgb)/0.08)]"
              >
                <div className="rounded-2xl border border-white/12 bg-black/60 p-5 font-mono text-xs text-foreground/90 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-foreground/50">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                      {isEs ? "Simulación de Diálogo WhatsApp (3:15 AM · Domingo)" : "WhatsApp Dialogue Simulation (3:15 AM · Sunday)"}
                    </span>
                    <span className="text-[10px] uppercase">Latency: ~240ms</span>
                  </div>

                  {/* Diálogo */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-2.5 max-w-lg">
                      <div className="rounded-full bg-white/10 p-1.5 text-foreground/60 shrink-0">
                        <Users className="h-3.5 w-3.5" />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-white/10 p-3 text-foreground/90 text-xs">
                        <p className="font-sans">{activeNiche.simulatedClientQuery[language]}</p>
                        <span className="text-[10px] text-foreground/40 mt-1 block">03:15:10 AM · Lead</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 max-w-lg ml-auto flex-row-reverse">
                      <div className="rounded-full bg-signal/20 p-1.5 text-signal shrink-0">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="rounded-2xl rounded-tr-sm bg-signal/15 border border-signal/30 p-3 text-foreground text-xs">
                        <p className="font-sans">{activeNiche.simulatedAgentResponse[language]}</p>
                        <span className="text-[10px] text-signal/70 mt-1 block">03:15:34 AM · Agente IA (+24s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Payload */}
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-foreground/50 flex flex-wrap items-center justify-between gap-2">
                    <span>Webhook: <code className="text-signal">POST /api/v1/ghl/sync-contact</code></span>
                    <span>Status: <code className="text-signal">200 OK (Tags: [Calificado, Cita_Propuesta])</code></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pasos del Circuito en Grid interactivo */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 relative">
            {PIPELINE_STEPS.map((step, idx) => {
              const isCurrentStep = activeStepSimulation === idx;
              const status = isAutomatedMode ? step.automatedStatus : step.traditionalStatus;

              return (
                <motion.div
                  key={step.id}
                  animate={{
                    borderColor: isCurrentStep ? activeNiche.accentColor : "rgba(255,255,255,0.08)",
                    backgroundColor: isCurrentStep ? `${activeNiche.accentColor}10` : "rgba(255,255,255,0.02)",
                    scale: isCurrentStep ? 1.03 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="relative rounded-2xl border p-5 backdrop-blur-md flex flex-col justify-between min-h-[170px]"
                >
                  {/* Conector flecha visual entre nodos */}
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                      <div className="h-6 w-6 rounded-full bg-background border border-white/15 flex items-center justify-center text-foreground/40 shadow-md">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  )}

                  {/* Top info */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {step.label[language]}
                      </span>
                      {isCurrentStep && (
                        <span
                          className="flex h-2 w-2 rounded-full animate-ping"
                          style={{ backgroundColor: activeNiche.accentColor }}
                        />
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-foreground/50">
                      {step.sub[language]}
                    </p>
                  </div>

                  {/* Bottom status */}
                  <div className="mt-4 pt-3 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
                    <p
                      className={`text-xs leading-snug font-sans ${
                        status.bad ? "text-red-400 font-medium" : "text-foreground/80"
                      }`}
                    >
                      {status[language]}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
                      <Clock className="h-3 w-3 text-foreground/40" />
                      <span className={status.bad ? "text-red-400 font-semibold" : "text-signal font-semibold"}>
                        {status.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── 4. TELEMETRÍA Y ROI EN TIEMPO REAL ─── */}
          <div className="mt-10 pt-8 border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-4">
              {isEs ? "Impacto Operativo & Métricas Proyectadas" : "Operational Impact & Projected Metrics"}
            </span>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Métrica 1: Tiempo de respuesta */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-white/[0.6]">
                <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono">
                  <Clock className="h-4 w-4 text-signal" />
                  <span>{isEs ? "Tiempo 1ª Respuesta" : "1st Response Time"}</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                  {metrics.responseTime}
                </div>
                <span className="mt-1 block font-mono text-[10px] text-foreground/40">
                  {isAutomatedMode ? (isEs ? "24/7 sin comerciales despiertos" : "24/7 without awake reps") : (isEs ? "Horario laboral restringido" : "Working hours only")}
                </span>
              </div>

              {/* Métrica 2: Fuga de leads */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-white/[0.6]">
                <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span>{isEs ? "Fuga de Prospectos" : "Lead Drop-off"}</span>
                </div>
                <div
                  className={`mt-2 text-2xl sm:text-3xl font-bold tracking-tight font-mono ${
                    isAutomatedMode ? "text-signal" : "text-red-400"
                  }`}
                >
                  {metrics.dropOffRate}
                </div>
                <span className="mt-1 block font-mono text-[10px] text-foreground/40">
                  {isAutomatedMode ? (isEs ? "Captura y cierre en el minuto 1" : "Instant qualification") : (isEs ? "Se van a la competencia" : "Lost to competitors")}
                </span>
              </div>

              {/* Métrica 3: Horas de equipo ahorradas */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-white/[0.6]">
                <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>{isEs ? "Horas Ahorradas / Mes" : "Hours Saved / Month"}</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                  +{metrics.hoursSavedPerMonth}h
                </div>
                <span className="mt-1 block font-mono text-[10px] text-foreground/40">
                  {isEs ? "Cero tareas manuales repetitivas" : "Zero manual repetitive tasks"}
                </span>
              </div>

              {/* Métrica 4: Citas / Clientes cerrados proyectados */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-white/[0.6]">
                <div className="flex items-center gap-2 text-foreground/50 text-xs font-mono">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>{isEs ? "Cierres Proyectados" : "Projected Bookings"}</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-signal font-mono">
                  ~{metrics.leadsConverted} {isEs ? "cierres" : "deals"}
                </div>
                <span className="mt-1 block font-mono text-[10px] text-foreground/40">
                  {isAutomatedMode ? (isEs ? "Aporte incremental directo" : "Direct incremental output") : (isEs ? "Fricción alta" : "High friction")}
                </span>
              </div>
            </div>
          </div>

          {/* ─── 5. CTA CONTEXTUAL DE CIERRE DIRECTO ─── */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 light:bg-white/[0.8]">
            <div className="max-w-xl">
              <h4 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                {isEs
                  ? `¿Querés implementar este flujo para tu empresa de ${activeNiche.name.es}?`
                  : `Want this exact architecture built for your ${activeNiche.name.en} setup?`}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-foreground/60 leading-relaxed">
                {isEs
                  ? "Lo diseñamos, conectamos a tu WhatsApp y CRM actual, y lo dejamos operando en un sprint de 1 a 3 semanas."
                  : "We design it, connect it to your current WhatsApp & CRM, and deploy it live in a 1 to 3 week sprint."}
              </p>
            </div>

            <motion.a
              href={whatsappPrefilledUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-xs sm:text-sm font-bold text-neutral-950 shadow-[0_0_25px_rgba(37,211,102,0.35)] transition-all hover:bg-[#22c35e]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{isEs ? "Hablar sobre este flujo" : "Discuss this pipeline"}</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
