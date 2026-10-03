"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Zap,
  TrendingDown,
  DollarSign,
  Flame,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  MessageCircle,
  Activity,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  RESPONSE_TIME_TIERS,
  calculateLeadDecay,
  getDecayCurveSvgPath,
  type ResponseTimeTier,
} from "@/data/leadVelocityData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

export function LeadVelocityDecayArena() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Controls state
  const [adSpend, setAdSpend] = useState<number>(3000);
  const [ticketValue, setTicketValue] = useState<number>(1500);
  const [selectedTierId, setSelectedTierId] = useState<string>("tier-2h");

  // Live Race Simulation State
  const [isRaceRunning, setIsRaceRunning] = useState<boolean>(false);
  const [raceStepFast, setRaceStepFast] = useState<number>(0);
  const [raceStepSlow, setRaceStepSlow] = useState<number>(0);
  const [raceTimerSeconds, setRaceTimerSeconds] = useState<number>(0);

  // Calculation results
  const metrics = useMemo(
    () => calculateLeadDecay(adSpend, ticketValue, selectedTierId),
    [adSpend, ticketValue, selectedTierId]
  );

  const activeTier = metrics.activeTier;

  // Trigger Live Race
  const startLiveRace = () => {
    if (isRaceRunning) return;
    setIsRaceRunning(true);
    setRaceStepFast(1);
    setRaceStepSlow(1);
    setRaceTimerSeconds(0);

    // Fast track sequence (18s simulation accelerated in 2.5 seconds)
    setTimeout(() => setRaceStepFast(2), 500);
    setTimeout(() => setRaceStepFast(3), 1200);
    setTimeout(() => setRaceStepFast(4), 2200); // Won!

    // Slow track sequence (stalls and fails)
    setTimeout(() => setRaceStepSlow(2), 900);
    setTimeout(() => setRaceStepSlow(3), 2000);
    setTimeout(() => {
      setRaceStepSlow(4); // Lost to competitor
      setIsRaceRunning(false);
    }, 3200);
  };

  // WhatsApp Pre-filled message
  const whatsappText = isEs
    ? `Hola Mario, estuve probando tu simulador de velocidad de leads. Actualmente en mi empresa tardamos aprox. ${activeTier.timeDisplay} en responder y calculé que estamos perdiendo ~$${metrics.adSpendBurnedMonthly.toLocaleString()} USD/mes de pauta publicitaria. Me interesa implementar tu operador de respuesta en 18s.`
    : `Hi Mario, I was testing your lead velocity simulator. Currently my team takes ~${activeTier.timeDisplay} to reply and I calculated we are burning ~$${metrics.adSpendBurnedMonthly.toLocaleString()} USD/mo in ad spend. I want to deploy your 18-second AI operator.`;

  const sendWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    whatsappText
  )}`;

  // SVG Curve Dimensions
  const svgWidth = 600;
  const svgHeight = 180;
  const svgPath = useMemo(() => getDecayCurveSvgPath(svgWidth, svgHeight), []);

  // Marker X coordinate based on tier index
  const tierIndex = RESPONSE_TIME_TIERS.findIndex((t) => t.id === selectedTierId);
  const markerX = (tierIndex / (RESPONSE_TIME_TIERS.length - 1)) * svgWidth;
  const markerY = svgHeight * (1 - activeTier.contactRatePct / 100);

  return (
    <section
      id="velocidad-leads"
      className="relative isolate my-20 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#06080d] p-6 backdrop-blur-2xl sm:p-10 lg:p-14 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Background ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-[150px] transition-colors duration-700 ${
          activeTier.zone === "optimal"
            ? "bg-signal/15"
            : activeTier.zone === "warning"
            ? "bg-amber-500/15"
            : "bg-destructive/15"
        }`}
      />

      {/* Eyebrow and Header */}
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono text-accent">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span>
            {isEs
              ? "01.45 · AUDITORÍA DE VELOCIDAD & DECADENCIA DEL LEAD"
              : "01.45 · LEAD VELOCITY & SPEED-TO-LEAD DECAY ARENA"}
          </span>
        </div>

        <h2 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white sm:text-4xl light:text-ink">
          {isEs
            ? "La Curva de Muerte del Lead: Cuánto dinero de pauta estás quemando por tardar en responder"
            : "The Lead Mortality Curve: How much ad spend you burn by responding too late"}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base light:text-ink/80">
          {isEs
            ? "Estudios empíricos demuestran que responder en 18 segundos vs 2 horas multiplica por 21x la probabilidad de cerrar la venta. Cuando un prospecto se enfría, no solo perdés el cliente: le regalás tu inversión publicitaria a tu competencia."
            : "Data shows responding in 18 seconds vs 2 hours makes you 21x more likely to close. When a lead goes cold, you don't just lose the deal: you donate your paid ad budget to your competitors."}
        </p>
      </div>

      {/* Main Interactive Workbench */}
      <div className="relative z-10 mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Sliders & Tier Selector (7 Cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Sliders Card */}
          <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-xl sm:p-7">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/50">
              <DollarSign className="h-4 w-4 text-accent" />
              <span>{isEs ? "Parámetros de tu Negocio" : "Your Business Parameters"}</span>
            </h3>

            {/* Slider 1: Monthly Ad Spend */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <label htmlFor="ad-spend-slider" className="text-white/70">
                  {isEs ? "Inversión Mensual en Pauta (Meta / Google):" : "Monthly Paid Ad Spend (Meta / Google):"}
                </label>
                <span className="text-base font-bold text-accent font-mono">
                  ${adSpend.toLocaleString()} USD
                </span>
              </div>
              <input
                id="ad-spend-slider"
                type="range"
                min="500"
                max="20000"
                step="500"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-accent"
              />
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[1000, 3000, 5000, 10000, 20000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAdSpend(preset)}
                    className={`rounded-xl px-3 py-1.5 min-h-[38px] flex items-center justify-center text-[11px] font-mono transition-all ${
                      adSpend === preset
                        ? "bg-accent/20 text-accent border border-accent/40 font-semibold"
                        : "bg-white/5 text-white/50 hover:text-white"
                    }`}
                  >
                    ${preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Ticket Value */}
            <div className="mt-6 border-t border-white/5 pt-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <label htmlFor="ticket-slider" className="text-white/70">
                  {isEs ? "Ticket Promedio / Valor de Venta por Cliente:" : "Average Deal Value / Customer Ticket:"}
                </label>
                <span className="text-base font-bold text-signal font-mono">
                  ${ticketValue.toLocaleString()} USD
                </span>
              </div>
              <input
                id="ticket-slider"
                type="range"
                min="200"
                max="10000"
                step="100"
                value={ticketValue}
                onChange={(e) => setTicketValue(Number(e.target.value))}
                className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-signal"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[500, 1500, 3000, 6000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTicketValue(preset)}
                    className={`rounded-lg px-2.5 py-0.5 text-[11px] font-mono transition-all ${
                      ticketValue === preset
                        ? "bg-signal/20 text-signal border border-signal/40"
                        : "bg-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    ${preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Time Stepper (6 Tiers) */}
          <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-xl sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/50">
                <Clock className="h-4 w-4 text-accent" />
                <span>{isEs ? "Tiempo de Respuesta Actual de tu Equipo:" : "Your Current Response Time:"}</span>
              </h3>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                  activeTier.zone === "optimal"
                    ? "bg-signal/20 text-signal"
                    : activeTier.zone === "warning"
                    ? "bg-amber-400/20 text-amber-300"
                    : "bg-destructive/20 text-destructive"
                }`}
              >
                {activeTier.zone === "optimal"
                  ? isEs
                    ? "Zona Óptima"
                    : "Optimal Zone"
                  : activeTier.zone === "warning"
                  ? isEs
                    ? "Fricción Humana"
                    : "Friction Zone"
                  : isEs
                  ? "Zona de Muerte"
                  : "Mortality Zone"}
              </span>
            </div>

            {/* Tier Buttons Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {RESPONSE_TIME_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    selectedTierId === tier.id
                      ? tier.zone === "optimal"
                        ? "border-signal/60 bg-signal/15 shadow-[0_0_15px_rgba(113,243,162,0.15)]"
                        : tier.zone === "warning"
                        ? "border-amber-400/60 bg-amber-400/15"
                        : "border-destructive/60 bg-destructive/15 shadow-[0_0_15px_rgba(255,85,85,0.15)]"
                      : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-white">
                      {tier.timeDisplay}
                    </span>
                    <span
                      className={`text-xs font-mono ${
                        tier.contactRatePct >= 70
                          ? "text-signal"
                          : tier.contactRatePct >= 30
                          ? "text-amber-400"
                          : "text-destructive"
                      }`}
                    >
                      {tier.contactRatePct}%
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-white/50 truncate">
                    {tier.label[language].split("(")[0]}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Tier Diagnostic */}
            <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs font-mono">
              <div className="text-white/80 font-medium leading-relaxed">
                {isEs ? activeTier.description.es : activeTier.description.en}
              </div>
              <div className="mt-2 text-white/40">
                <span className="text-white/60">{isEs ? "Realidad operativa: " : "Operational reality: "}</span>
                {isEs ? activeTier.humanReality.es : activeTier.humanReality.en}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Telemetry & Real-Time Curve (5 Cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Dynamic SVG Exponential Decay Curve */}
          <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-xl sm:p-7">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/50 uppercase tracking-wider">
                {isEs ? "Curva de Sobrevivencia del Prospecto" : "Lead Survivability Curve"}
              </span>
              <span className="text-accent font-bold">
                {activeTier.contactRatePct}% {isEs ? "Tasa de Contacto" : "Contact Rate"}
              </span>
            </div>

            {/* SVG Visualizer */}
            <div className="relative mt-4 h-[180px] w-full overflow-hidden rounded-xl border border-white/5 bg-black/40 p-2">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="decayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#71F3A2" />
                    <stop offset="25%" stopColor="#55D8FF" />
                    <stop offset="50%" stopColor="#FFB86C" />
                    <stop offset="100%" stopColor="#FF5555" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />

                {/* Exponential decay path */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="url(#decayGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Active marker with spring animation */}
                <motion.circle
                  animate={{ cx: markerX, cy: markerY }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  r="7"
                  className={activeTier.zone === "optimal" ? "fill-signal" : activeTier.zone === "warning" ? "fill-amber-400" : "fill-destructive"}
                />
                <motion.circle
                  animate={{ cx: markerX, cy: markerY }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  r="14"
                  className={`animate-ping opacity-40 ${
                    activeTier.zone === "optimal"
                      ? "fill-signal"
                      : activeTier.zone === "warning"
                      ? "fill-amber-400"
                      : "fill-destructive"
                  }`}
                />
              </svg>

              {/* Labels on SVG */}
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-signal">
                18s (94%)
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-destructive">
                24h+ (2.5%)
              </div>
            </div>

            {/* Three Critical Impact Meters */}
            <div className="mt-6 space-y-3 font-mono">
              {/* Stat 1: Burned Ad Spend */}
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
                <div className="flex items-center justify-between text-xs text-destructive">
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4" />
                    {isEs ? "Pauta Incinerada / Desperdiciada:" : "Incinerated Ad Spend:"}
                  </span>
                  <span className="font-bold text-destructive">
                    {metrics.adSpendBurnedPct}% {isEs ? "perdido" : "lost"}
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  -${metrics.adSpendBurnedMonthly.toLocaleString()} USD
                  <span className="text-xs font-normal text-white/40">/{isEs ? "mes" : "mo"}</span>
                </div>
              </div>

              {/* Stat 2: Lost Deals */}
              <div className="rounded-2xl border border-amber-400/20 bg-amber-950/15 p-4">
                <div className="flex items-center justify-between text-xs text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4" />
                    {isEs ? "Ventas Perdidas por Lentitud:" : "Deals Lost to Slow Response:"}
                  </span>
                  <span className="font-bold text-amber-300">
                    {metrics.dealsLostMonthly} {isEs ? "ventas/mes" : "deals/mo"}
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  {metrics.dealsLostMonthly} {isEs ? "clientes perdidos" : "lost clients"}
                </div>
              </div>

              {/* Stat 3: Annual Recoverable Revenue */}
              <div className="rounded-2xl border border-signal/40 bg-signal/[0.06] p-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-signal">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="h-4 w-4" />
                    {isEs ? "Ingresos Recuperables con Operador 18s:" : "Recoverable Revenue with 18s AI:"}
                  </span>
                  <span className="rounded bg-signal/20 px-2 py-0.5 text-[10px] text-signal font-bold">
                    {isEs ? "Impacto Anual" : "Annual Run Rate"}
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-signal sm:text-3xl">
                  +${metrics.annualRecoverableRevenue.toLocaleString()} USD
                  <span className="text-xs font-normal text-white/50">/{isEs ? "año" : "year"}</span>
                </div>
              </div>
            </div>

            {/* Direct Conversion Action Button */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <a
                href={sendWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl border border-signal/50 bg-signal/20 py-3.5 text-center font-mono text-xs font-bold text-signal shadow-lg transition-all hover:bg-signal/30 active:scale-95"
              >
                <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>
                  {isEs
                    ? "Blindar mis Leads con Respuesta en 18s"
                    : "Protect my Leads with 18s Response"}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LIVE RACE SIMULATION: Duelo de Velocidad en Tiempo Real
      ========================================================================= */}
      <div className="relative z-10 mt-12 rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3 py-0.5 text-xs font-mono text-signal">
              <Zap className="h-3.5 w-3.5" />
              {isEs ? "Simulador de Duelo en Tiempo Real" : "Real-Time Speed Duel Simulator"}
            </span>
            <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              {isEs
                ? "Duelo en Vivo: Un lead entra ahora a las 23:45hs por WhatsApp"
                : "Live Duel: A lead opts in right now at 11:45 PM via WhatsApp"}
            </h3>
            <p className="mt-1 text-xs text-white/60">
              {isEs
                ? "Comprueba qué le pasa al prospecto en tu equipo actual vs con el Operador de IA de Mario Morera."
                : "Watch the lead experience unfold with your current team vs Mario Morera's Edge AI Operator."}
            </p>
          </div>

          <button
            type="button"
            onClick={startLiveRace}
            disabled={isRaceRunning}
            className="inline-flex items-center gap-2 rounded-xl border border-signal/50 bg-signal/20 px-5 py-3 text-xs font-mono font-bold text-signal transition-all hover:bg-signal/30 active:scale-95 disabled:opacity-50"
          >
            {isRaceRunning ? <Activity className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span>
              {isRaceRunning
                ? isEs
                  ? "Duelo en Curso..."
                  : "Duel in Progress..."
                : isEs
                ? "⚡ Disparar Prueba de Velocidad"
                : "⚡ Start Live Speed Test"}
            </span>
          </button>
        </div>

        {/* Dual Lane Race Visualization */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Lane 1: Mario Morera Edge AI (18s) */}
          <div className="rounded-2xl border border-signal/30 bg-signal/[0.03] p-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-signal">
                {isEs ? "CARRIL A · OPERADOR IA MARIO MORERA" : "LANE A · MARIO MORERA AI OPERATOR"}
              </span>
              <span className="rounded bg-signal/20 px-2 py-0.5 text-[10px] text-signal font-bold">
                18.2s TOTAL
              </span>
            </div>

            {/* Steps Progress */}
            <div className="mt-4 space-y-3 text-xs font-mono">
              <div className={`flex items-center gap-2.5 ${raceStepFast >= 1 ? "text-white" : "text-white/30"}`}>
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${raceStepFast >= 1 ? "text-signal" : "text-white/20"}`} />
                <span>0.2s · Webhook recibido en Edge CDN (Next.js 16)</span>
              </div>
              <div className={`flex items-center gap-2.5 ${raceStepFast >= 2 ? "text-white" : "text-white/30"}`}>
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${raceStepFast >= 2 ? "text-signal" : "text-white/20"}`} />
                <span>1.4s · IA califica presupuesto y necesidad en WhatsApp</span>
              </div>
              <div className={`flex items-center gap-2.5 ${raceStepFast >= 3 ? "text-white" : "text-white/30"}`}>
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${raceStepFast >= 3 ? "text-signal" : "text-white/20"}`} />
                <span>12.5s · Lead responde y elige horario en Google Meet</span>
              </div>
              <div className={`flex items-center gap-2.5 ${raceStepFast >= 4 ? "text-signal font-bold" : "text-white/30"}`}>
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${raceStepFast >= 4 ? "text-signal" : "text-white/20"}`} />
                <span>18.2s · Cita bloqueada en CRM + Alerta en teléfono del dueño</span>
              </div>
            </div>

            {raceStepFast === 4 && (
              <div className="mt-4 rounded-xl border border-signal/40 bg-signal/20 p-2.5 text-center text-xs font-mono font-bold text-signal">
                {isEs ? "✅ PROSPECTO CAPTURADO & CALIFICADO (0% FUGA)" : "✅ LEAD CAPTURED & QUALIFIED (0% LOSS)"}
              </div>
            )}
          </div>

          {/* Lane 2: Traditional Human Team (2 Hours) */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-destructive">
                {isEs ? "CARRIL B · PROCESO MANUAL TRADICIONAL" : "LANE B · TRADITIONAL MANUAL PROCESS"}
              </span>
              <span className="rounded bg-destructive/20 px-2 py-0.5 text-[10px] text-destructive font-bold">
                2h+ DELAY
              </span>
            </div>

            {/* Steps Progress */}
            <div className="mt-4 space-y-3 text-xs font-mono">
              <div className={`flex items-center gap-2.5 ${raceStepSlow >= 1 ? "text-white" : "text-white/30"}`}>
                <span className="h-4 w-4 flex items-center justify-center font-bold text-white/40">1</span>
                <span>0.0s · Lead completa formulario a las 23:45hs</span>
              </div>
              <div className={`flex items-center gap-2.5 ${raceStepSlow >= 2 ? "text-amber-300" : "text-white/30"}`}>
                <AlertTriangle className={`h-4 w-4 shrink-0 ${raceStepSlow >= 2 ? "text-amber-400" : "text-white/20"}`} />
                <span>15m · Equipo no disponible (fuera de horario comercial)</span>
              </div>
              <div className={`flex items-center gap-2.5 ${raceStepSlow >= 3 ? "text-destructive" : "text-white/30"}`}>
                <AlertTriangle className={`h-4 w-4 shrink-0 ${raceStepSlow >= 3 ? "text-destructive" : "text-white/20"}`} />
                <span>45m · Lead entra a Google y contacta al competidor</span>
              </div>
              <div className={`flex items-center gap-2.5 ${raceStepSlow >= 4 ? "text-destructive font-bold" : "text-white/30"}`}>
                <ShieldAlert className={`h-4 w-4 shrink-0 ${raceStepSlow >= 4 ? "text-destructive" : "text-white/20"}`} />
                <span>+2.5h · Vendedor responde al día siguiente: "Ya compré"</span>
              </div>
            </div>

            {raceStepSlow === 4 && (
              <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/20 p-2.5 text-center text-xs font-mono font-bold text-destructive">
                {isEs ? "🛑 LEAD PERDIDO · 100% PAUTA INCINERADA" : "🛑 LEAD LOST · 100% AD SPEND INCINERATED"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
