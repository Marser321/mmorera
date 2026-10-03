"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  LEGACY_STACKS,
  MODERN_BENCHMARK,
  calculateAdLossImpact,
  type LegacyStackPreset,
} from "@/data/benchmarkArenaData";
import {
  Gauge,
  Zap,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

export function LighthouseBenchmarkArena() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Selected stack & ad spend
  const [selectedStackId, setSelectedStackId] = useState<"wordpress" | "wix" | "agency_legacy">("wordpress");
  const [monthlyAdSpend, setMonthlyAdSpend] = useState<number>(1500);

  // Network simulation trigger
  const [simulating, setSimulating] = useState<boolean>(false);
  const [legacyLoaded, setLegacyLoaded] = useState<boolean>(false);
  const [modernLoaded, setModernLoaded] = useState<boolean>(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup pending timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const stack = useMemo<LegacyStackPreset>(
    () => LEGACY_STACKS.find((s) => s.id === selectedStackId) ?? LEGACY_STACKS[0],
    [selectedStackId]
  );

  const report = useMemo(
    () => calculateAdLossImpact(stack, monthlyAdSpend),
    [stack, monthlyAdSpend]
  );

  const handleSimulateLoad = () => {
    setSimulating(true);
    setModernLoaded(false);
    setLegacyLoaded(false);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate([10, 20, 10]); } catch {}
    }

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [
      setTimeout(() => {
        setModernLoaded(true);
      }, 400),
      setTimeout(() => {
        setLegacyLoaded(true);
        setSimulating(false);
      }, 3200),
    ];
  };

  const whatsappPrefillUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve usando el Benchmark de Velocidad en tu web comparando con ${stack.name.es}. Con un gasto de ~$${monthlyAdSpend} USD/mes en pauta, estimo que estoy perdiendo ~$${report.wastedSpendMonthly} USD/mes por lentitud. Quiero auditar mi sitio.`
      : `Hi Mario, I was testing your Speed Benchmark comparing against ${stack.name.en}. With ~$${monthlyAdSpend} USD/mo ad spend, I'm losing ~$${report.wastedSpendMonthly} USD/mo due to slow loading. I'd like a site audit.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [stack, monthlyAdSpend, report, isEs]);

  return (
    <section
      id="benchmark-velocidad"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Resplandor ambiental de alerta vs señal */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(113,243,162,0.1)_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_#71F3A2]" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
              {isEs ? "01.5 · Arena de Rendimiento & Auditoría B2B" : "01.5 · Performance Arena & B2B Audit"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Tu web puede ser un cohete o una fuga silenciosa de clientes."
                : "Your website is either a rocket or a silent client leak."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Más del 50% de los usuarios móviles abandonan un sitio si tarda más de 3 segundos en abrir. Si hacés pauta publicitaria en Meta o Google, una web lenta destruye tu retorno de inversión antes de que el cliente lea una sola palabra."
              : "Over 50% of mobile visitors abandon a website if it takes more than 3 seconds to load. If you run ads on Meta or Google, slow pages burn your ad budget before customers even read a single headline."}
          </Reveal>
        </div>

        {/* ─── 1. SELECTOR TÁCTIL DE ARQUITECTURA ACTUAL ─── */}
        <div className="mt-10">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-3">
            {isEs ? "Paso 1: Seleccioná la tecnología típica de tu web actual" : "Step 1: Select your current website tech"}
          </span>
          <div className="grid gap-3.5 sm:grid-cols-3">
            {LEGACY_STACKS.map((s) => {
              const isSelected = s.id === selectedStackId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStackId(s.id)}
                  className={`group relative text-left rounded-2xl p-5 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-destructive/50 bg-card/90 shadow-[0_8px_30px_rgba(255,85,85,0.15)] light:bg-card"
                      : "border-white/10 bg-card/30 hover:border-white/20 hover:bg-card/50 light:bg-card/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertTriangle className="h-3 w-3" />
                      Lighthouse {s.lighthouseScore}/100
                    </span>
                    <span className="text-[11px] font-mono text-foreground/40">{s.lcpSeconds}s LCP</span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                    {s.name[language]}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/60 leading-relaxed">{s.subtitle[language]}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5 text-[11px] font-mono text-destructive/80">
                    <span>Fuga de tráfico:</span>
                    <span className="font-bold">{(s.trafficLossPct * 100).toFixed(0)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 2. STAGE COMPARATIVO: DIALES DE LIGHTHOUSE & IMPACTO FINANCIERO ─── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Panel Izquierdo: Comparación Frente a Frente */}
          <div className="rounded-3xl border border-white/14 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-foreground/40" />
                  {isEs ? "Comparativa Directa de Rendimiento" : "Head-to-Head Performance"}
                </span>
                <span className="font-mono text-[10px] uppercase text-signal bg-signal/10 border border-signal/20 px-2.5 py-1 rounded-full">
                  {report.speedDeltaMultiplier}x {isEs ? "MÁS RÁPIDO" : "FASTER"}
                </span>
              </div>

              {/* Diales lado a lado */}
              <div className="grid grid-cols-2 gap-4 text-center">
                {/* Dial Legacy */}
                <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-5 flex flex-col items-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-destructive/30">
                    <span className="text-3xl font-black font-mono text-destructive">{stack.lighthouseScore}</span>
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground/80">{stack.name[language]}</h4>
                  <span className="text-[11px] font-mono text-destructive mt-1">
                    {isEs ? "Deficiente / Lento" : "Poor / Slow"}
                  </span>
                  <div className="mt-3 w-full border-t border-destructive/10 pt-2 text-[10px] font-mono text-foreground/50 space-y-1">
                    <div>LCP: {stack.lcpSeconds}s</div>
                    <div>FCP: {stack.fcpSeconds}s</div>
                    <div>CLS: {stack.clsScore}</div>
                  </div>
                </div>

                {/* Dial Mario Morera Modern */}
                <div className="rounded-2xl border border-signal/30 bg-signal/[0.05] p-5 flex flex-col items-center shadow-[0_0_25px_rgba(113,243,162,0.1)]">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-signal shadow-[0_0_20px_#71F3A2]">
                    <span className="text-3xl font-black font-mono text-signal">{MODERN_BENCHMARK.lighthouseScore}</span>
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground">{isEs ? "Sistema Mario Morera" : "Mario Morera System"}</h4>
                  <span className="text-[11px] font-mono text-signal mt-1">
                    {isEs ? "Rendimiento Élite" : "Elite Performance"}
                  </span>
                  <div className="mt-3 w-full border-t border-signal/15 pt-2 text-[10px] font-mono text-foreground/60 space-y-1">
                    <div>LCP: {MODERN_BENCHMARK.lcpSeconds}s</div>
                    <div>FCP: {MODERN_BENCHMARK.fcpSeconds}s</div>
                    <div>CLS: {MODERN_BENCHMARK.clsScore}</div>
                  </div>
                </div>
              </div>

              {/* Seguridad & Arquitectura */}
              <div className="mt-6 rounded-2xl border border-white/8 bg-background/50 p-4 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-red-400/90">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{stack.vulnerabilities[language]}</span>
                </div>
                <div className="flex items-start gap-2 text-signal">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{MODERN_BENCHMARK.securityRating[language]}</span>
                </div>
              </div>
            </div>

            {/* Simulador de Carga 4G */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <button
                onClick={handleSimulateLoad}
                disabled={simulating}
                className="w-full pressable inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-foreground hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Smartphone className="h-4 w-4 text-signal" />
                {simulating
                  ? isEs
                    ? "Simulando red 4G throttled..."
                    : "Simulating throttled 4G..."
                  : isEs
                  ? "⚡ Simular Carga en Red Móvil 4G"
                  : "⚡ Simulate 4G Mobile Load"}
              </button>

              {/* Indicadores de carga simultánea */}
              <div className="mt-3 grid grid-cols-2 gap-3 text-center text-[10px] font-mono">
                <div
                  className={`rounded-lg p-2 border transition-colors ${
                    legacyLoaded
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : simulating
                      ? "border-white/20 bg-white/5 text-foreground/60 animate-pulse"
                      : "border-white/5 text-foreground/40"
                  }`}
                >
                  {legacyLoaded ? "Cargado en 3.2s" : simulating ? "Descargando 32 plugins..." : "En espera"}
                </div>
                <div
                  className={`rounded-lg p-2 border transition-colors ${
                    modernLoaded
                      ? "border-signal/40 bg-signal/10 text-signal font-bold"
                      : simulating
                      ? "border-white/20 bg-white/5 text-foreground/60 animate-pulse"
                      : "border-white/5 text-foreground/40"
                  }`}
                >
                  {modernLoaded ? "⚡ Hidratado en 0.4s" : simulating ? "Cargando Edge CDN..." : "En espera"}
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho: Calculadora de Dinero Perdido en Pauta */}
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/14 bg-card/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-destructive" />
                  {isEs ? "Calculador de Dinero Quemado en Pauta" : "Ad Spend Burn Calculator"}
                </span>
                <span className="text-[10px] font-mono text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                  {isEs ? "Fuga Silenciosa" : "Silent Leak"}
                </span>
              </div>

              {/* Slider de Inversión Publicitaria Mensual */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-foreground/70">
                    {isEs ? "Tu Inversión Mensual en Ads (Meta / Google):" : "Monthly Ad Spend (Meta / Google):"}
                  </span>
                  <span className="text-base font-bold text-signal font-mono">
                    ${monthlyAdSpend.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={10000}
                  step={100}
                  value={monthlyAdSpend}
                  onChange={(e) => setMonthlyAdSpend(Number(e.target.value))}
                  className="w-full accent-signal cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-foreground/40 mt-1">
                  <span>$200/mes</span>
                  <span>$10,000/mes</span>
                </div>
              </div>

              {/* Métricas de Pérdida Financiera */}
              <div className="mt-6 grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.08] p-4 text-center">
                  <span className="text-[10px] font-mono uppercase text-destructive/90 block">
                    {isEs ? "Pérdida Mensual Estimada" : "Estimated Monthly Loss"}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-destructive mt-1 block">
                    -${report.wastedSpendMonthly.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-destructive/80">USD / mes</span>
                </div>

                <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.08] p-4 text-center">
                  <span className="text-[10px] font-mono uppercase text-destructive/90 block">
                    {isEs ? "Pérdida Anual Proyectada" : "Projected Annual Loss"}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-destructive mt-1 block">
                    -${report.wastedSpendAnnual.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-destructive/80">USD / año</span>
                </div>
              </div>

              {/* Clics y Prospectos Recuperados */}
              <div className="mt-4 rounded-2xl border border-signal/20 bg-signal/[0.04] p-4 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-signal shrink-0" />
                  <span className="text-foreground/80">
                    {isEs ? "Prospectos recuperados por velocidad:" : "Visitors recovered via speed:"}
                  </span>
                </div>
                <span className="font-bold text-signal text-sm">
                  +{report.recoveredTrafficVisitors.toLocaleString()} {isEs ? "visitas" : "clicks"}
                </span>
              </div>
            </div>

            {/* CTA de Conversión Directa */}
            <div className="rounded-3xl border border-white/14 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between flex-1">
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  {isEs ? "¿Querés saber el puntaje exacto de tu sitio web?" : "Want to know your exact website score?"}
                </h4>
                <p className="mt-2 text-xs text-foreground/60 leading-relaxed">
                  {isEs
                    ? "Escribime por WhatsApp con el enlace de tu negocio. Te envío un diagnóstico técnico en video de 3 minutos analizando tu PageSpeed, Core Web Vitals y oportunidades de aceleración."
                    : "Send me your business URL on WhatsApp. I'll reply with a 3-minute video audit dissecting your PageSpeed, Core Web Vitals, and speed acceleration opportunities."}
                </p>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <a
                  href={whatsappPrefillUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-semibold text-black transition-transform hover:scale-[1.02] bg-signal shadow-[0_0_20px_rgba(113,243,162,0.35)]"
                >
                  <span>{isEs ? "Pedir auditoría de velocidad por WhatsApp" : "Request speed audit via WhatsApp"}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
