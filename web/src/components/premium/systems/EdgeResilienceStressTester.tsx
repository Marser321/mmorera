"use client";

import { useState, useMemo, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  Globe2,
  HardDrive,
  MessageCircle,
  Radio,
  Server,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  TRAFFIC_PRESETS,
  calculateResilienceTelemetry,
} from "@/data/edgeResilienceData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

export function EdgeResilienceStressTester() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const sliderId = useId();

  // State
  const [requestsPerSec, setRequestsPerSec] = useState<number>(2400);
  const [edgeShieldActive, setEdgeShieldActive] = useState<boolean>(true);

  // Computed telemetry
  const telemetry = useMemo(
    () =>
      calculateResilienceTelemetry(
        requestsPerSec,
        edgeShieldActive,
        language
      ),
    [requestsPerSec, edgeShieldActive, language]
  );

  const isLegacyCritical = telemetry.legacy.status === "critical";
  const isLegacyDegraded = telemetry.legacy.status === "degraded";

  const whatsAppMessage = isEs
    ? `Hola Mario, estuve probando el simulador de estrés de infraestructura en tu web a ${requestsPerSec.toLocaleString("es-AR")} req/s y quiero blindar mi plataforma para evitar caídas en producción.`
    : `Hi Mario, I was testing your infrastructure stress simulator at ${requestsPerSec.toLocaleString("en-US")} req/s and want to harden my platform to prevent production downtime.`;

  const whatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    whatsAppMessage
  )}`;

  return (
    <section
      id="stress-test-edge"
      className="relative isolate my-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#070b10] p-6 backdrop-blur-2xl sm:p-10 lg:p-12 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full blur-[140px] transition-colors duration-700 ${
          isLegacyCritical
            ? "bg-destructive/15"
            : isLegacyDegraded
            ? "bg-amber-500/15"
            : "bg-signal/10"
        }`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[140px]"
      />

      {/* Header */}
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono text-accent">
          <Activity className="h-3.5 w-3.5" />
          <span>
            {isEs
              ? "01.9 · BANCO DE PRUEBAS DE RESILIENCIA & ESTRÉS"
              : "01.9 · RESILIENCE & STRESS BENCHMARK ARENA"}
          </span>
        </div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
          {isEs
            ? "Simulá un pico masivo de tráfico y medí el punto de quiebre."
            : "Simulate a massive traffic surge and measure the breaking point."}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
          {isEs
            ? "Los monolitos y VPS tradicionales colapsan superadas las 3,000 req/s, perdiendo dinero de pauta y bloqueando compras. Mirá cómo la arquitectura Edge distribuida en Next.js 16 absorbe picos masivos con latencia plana de milisegundos."
            : "Legacy monoliths and VPS servers collapse past 3,000 req/s, bleeding ad budget and dropping sales. Watch how Mario Morera's Next.js 16 distributed Edge architecture absorbs massive surges with flat millisecond latency."}
        </p>
      </div>

      {/* Interactive Throttle Controller */}
      <div className="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-white/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label
              htmlFor={sliderId}
              className="font-mono text-xs uppercase tracking-wider text-foreground/75"
            >
              {isEs
                ? "Acelerador de Tráfico Concurrente"
                : "Concurrent Traffic Throttle"}
            </label>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-accent sm:text-4xl">
                {requestsPerSec.toLocaleString(isEs ? "es-AR" : "en-US")}
              </span>
              <span className="font-mono text-xs text-foreground/60">req / seg</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {TRAFFIC_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setRequestsPerSec(preset.requestsPerSec)}
                className={`rounded-xl px-3.5 py-2 font-mono text-xs transition-all min-h-[40px] flex items-center justify-center ${
                  requestsPerSec === preset.requestsPerSec
                    ? "bg-accent text-black font-semibold shadow-[0_0_16px_rgba(85,216,255,0.35)]"
                    : "border border-white/10 bg-white/5 text-foreground/70 hover:border-white/20 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.1)]"
                }`}
              >
                {preset.name[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-5">
          <input
            id={sliderId}
            type="range"
            min="100"
            max="60000"
            step="250"
            value={requestsPerSec}
            onChange={(e) => setRequestsPerSec(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-accent transition-all hover:bg-white/20"
            aria-label={
              isEs
                ? "Control deslizante de solicitudes por segundo"
                : "Requests per second slider"
            }
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] text-foreground/50">
            <span>100 req/s (Base)</span>
            <span>15,000 req/s (Prensa / Viral)</span>
            <span>60,000 req/s (Black Friday)</span>
          </div>
        </div>
      </div>

      {/* Duel Arena: Side-by-Side Comparison */}
      <div className="relative z-10 mt-8 grid gap-6 lg:grid-cols-2">
        {/* Left: Legacy VPS / Monolith */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 ${
            isLegacyCritical
              ? "border-destructive/60 bg-destructive/15 shadow-[0_0_40px_rgba(255,85,85,0.15)]"
              : isLegacyDegraded
              ? "border-amber-500/50 bg-amber-950/15"
              : "border-white/10 bg-white/[0.02]"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  isLegacyCritical
                    ? "border-destructive/50 bg-destructive/20 text-destructive animate-pulse"
                    : isLegacyDegraded
                    ? "border-amber-500/50 bg-amber-500/20 text-amber-400"
                    : "border-white/10 bg-white/5 text-foreground/60"
                }`}
              >
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  {isEs ? "Servidor Tradicional / VPS Monolito" : "Legacy VPS / Traditional Monolith"}
                </h3>
                <p className="text-xs text-foreground/50 font-mono">
                  Apache/Nginx · 1 VM Central · Sin Edge
                </p>
              </div>
            </div>

            {/* Status Pill */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                isLegacyCritical
                  ? "bg-destructive/20 text-destructive border border-destructive/50 animate-bounce"
                  : isLegacyDegraded
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-signal/20 text-signal border border-signal/30"
              }`}
            >
              {isLegacyCritical ? (
                <ShieldAlert className="h-3 w-3" />
              ) : isLegacyDegraded ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {telemetry.legacy.statusLabel[language]}
            </span>
          </div>

          {/* Metrics Gauges */}
          <div className="mt-6 space-y-4">
            {/* CPU */}
            <div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-foreground/70 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-foreground/50" />
                  CPU Load
                </span>
                <span
                  className={
                    telemetry.legacy.cpuUsage > 90
                      ? "text-destructive font-bold"
                      : "text-foreground/80"
                  }
                >
                  {telemetry.legacy.cpuUsage}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full transition-colors ${
                    telemetry.legacy.cpuUsage > 90
                      ? "bg-destructive"
                      : telemetry.legacy.cpuUsage > 60
                      ? "bg-amber-400"
                      : "bg-signal"
                  }`}
                  animate={{ width: `${telemetry.legacy.cpuUsage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Latency & Error Rate Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="font-mono text-[10px] uppercase text-foreground/50">
                  {isEs ? "Latencia P95" : "P95 Latency"}
                </span>
                <div
                  className={`mt-1 font-mono text-xl font-bold ${
                    telemetry.legacy.latencyMs > 1000
                      ? "text-destructive"
                      : telemetry.legacy.latencyMs > 400
                      ? "text-amber-400"
                      : "text-foreground"
                  }`}
                >
                  {telemetry.legacy.latencyMs.toLocaleString()}ms
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="font-mono text-[10px] uppercase text-foreground/50">
                  {isEs ? "Tasa Errores 502/504" : "502/504 Error Rate"}
                </span>
                <div
                  className={`mt-1 font-mono text-xl font-bold ${
                    telemetry.legacy.errorRatePercent > 5
                      ? "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {telemetry.legacy.errorRatePercent}%
                </div>
              </div>
            </div>
          </div>

          {/* Oscilloscope Waveform (Erratic / Failing) */}
          <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-foreground/50 mb-2">
              <span>{isEs ? "TELEMETRÍA DE RED" : "NETWORK OSCILLOSCOPE"}</span>
              <span className={isLegacyCritical ? "text-destructive animate-pulse" : ""}>
                {isLegacyCritical ? "PACKET LOSS SEVERO" : "PULSO REGULAR"}
              </span>
            </div>
            <svg
              className="h-14 w-full"
              viewBox="0 0 400 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                d={
                  isLegacyCritical
                    ? "M0,30 Q30,5 60,55 T120,2 T180,58 T240,0 T300,60 T360,5 T400,30"
                    : isLegacyDegraded
                    ? "M0,30 Q40,15 80,45 T160,18 T240,42 T320,20 T400,30"
                    : "M0,30 Q50,22 100,38 T200,24 T300,36 T400,30"
                }
                fill="none"
                stroke={isLegacyCritical ? "#FF5555" : isLegacyDegraded ? "#fbbf24" : "#71F3A2"}
                strokeWidth={isLegacyCritical ? "3" : "2"}
                strokeDasharray={isLegacyCritical ? "4 2" : "none"}
                animate={{
                  x: [0, -40],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isLegacyCritical ? 0.3 : 1.2,
                  ease: "linear",
                }}
              />
            </svg>
          </div>

          {/* Revenue Risk Alert */}
          {telemetry.estimatedLostRevenuePerHour > 0 && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-mono text-destructive flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-destructive shrink-0" />
                {isEs ? "Riesgo de fuga en pauta:" : "Ad spend hemorrhage:"}
              </span>
              <span className="font-bold">
                -${telemetry.estimatedLostRevenuePerHour.toLocaleString()}{" "}
                USD/{isEs ? "hora" : "hr"}
              </span>
            </div>
          )}
        </div>

        {/* Right: Mario Morera Next.js 16 Edge Architecture */}
        <div className="relative overflow-hidden rounded-2xl border border-signal/40 bg-gradient-to-br from-signal/[0.05] via-[#0b141a] to-accent/[0.05] p-6 shadow-[0_0_40px_rgba(113,243,162,0.1)]">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-signal/50 bg-signal/20 text-signal shadow-[0_0_16px_rgba(113,243,162,0.25)]">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base flex items-center gap-2">
                  <span>
                    {isEs
                      ? "Arquitectura Edge Mario Morera"
                      : "Mario Morera Edge Architecture"}
                  </span>
                  <span className="rounded-full bg-signal/20 px-2 py-0.5 font-mono text-[9px] text-signal font-bold">
                    Next.js 16
                  </span>
                </h3>
                <p className="text-xs text-foreground/50 font-mono">
                  {telemetry.edge.activeEdgeNodes} {isEs ? "PoPs Globales · Edge SSR · 0 Cold Starts" : "Global PoPs · Edge SSR · 0 Cold Starts"}
                </p>
              </div>
            </div>

            {/* Status Pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/50 bg-signal/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-signal shadow-[0_0_12px_rgba(113,243,162,0.2)]">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              {telemetry.edge.statusLabel[language]}
            </span>
          </div>

          {/* Metrics Gauges */}
          <div className="mt-6 space-y-4">
            {/* CPU */}
            <div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-foreground/70 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-signal" />
                  Edge Worker Load
                </span>
                <span className="text-signal font-bold">
                  {telemetry.edge.cpuUsage}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-signal shadow-[0_0_10px_#71F3A2]"
                  animate={{ width: `${telemetry.edge.cpuUsage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Latency & Error Rate Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="font-mono text-[10px] uppercase text-foreground/50">
                  {isEs ? "Latencia P95 Global" : "P95 Global Latency"}
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-signal">
                  {telemetry.edge.latencyMs}ms
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="font-mono text-[10px] uppercase text-foreground/50">
                  {isEs ? "Tasa Errores" : "Error Rate"}
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-accent">
                  {telemetry.edge.errorRatePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Oscilloscope Waveform (Harmonic & Laser Smooth) */}
          <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-foreground/50 mb-2">
              <span>{isEs ? "TELEMETRÍA DE BORDE" : "EDGE OSCILLOSCOPE"}</span>
              <span className="text-signal flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
                CACHE HIT {telemetry.edge.cacheHitRatePercent}%
              </span>
            </div>
            <svg
              className="h-14 w-full"
              viewBox="0 0 400 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                d="M0,30 Q50,26 100,34 T200,28 T300,32 T400,30"
                fill="none"
                stroke="#55D8FF"
                strokeWidth="2.5"
                animate={{
                  x: [0, -50],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </svg>
          </div>

          {/* Shield Protection Status */}
          <div className="mt-4 rounded-xl border border-signal/30 bg-signal/10 p-3 text-xs font-mono text-signal flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-signal shrink-0" />
              {isEs ? "Protección de pauta garantizada:" : "Guaranteed ad protection:"}
            </span>
            <span className="font-bold text-white">
              +${telemetry.savedAdSpendProtection.toLocaleString()}{" "}
              USD/{isEs ? "salvados" : "saved"}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Narrative & WhatsApp CTA */}
      <div className="relative z-10 mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-white/30">
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl">
          {telemetry.summaryText[language]}
        </p>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable shrink-0 inline-flex items-center gap-2.5 rounded-xl bg-signal px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_24px_rgba(113,243,162,0.3)] transition-transform hover:-translate-y-0.5 hover:bg-[#8ff7b8]"
        >
          <MessageCircle className="h-4 w-4" />
          <span>
            {isEs
              ? "Blindar mi plataforma en WhatsApp"
              : "Harden my platform on WhatsApp"}
          </span>
        </a>
      </div>
    </section>
  );
}
