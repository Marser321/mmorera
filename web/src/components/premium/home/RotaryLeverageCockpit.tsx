"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  DIAL_TIERS,
  snapToNearestDialTier,
  type DialTier,
} from "@/data/rotaryDialData";
import {
  Gauge,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sliders,
} from "lucide-react";

export function RotaryLeverageCockpit() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [activeTierId, setActiveTierId] = useState<string>("tier_full_ecosystem");
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const activeTier = useMemo(
    () => DIAL_TIERS.find((t) => t.id === activeTierId) || DIAL_TIERS[3],
    [activeTierId]
  );

  // Knob rotation angle
  const knobAngle = activeTier.angle;

  // Calculate angle from pointer drag
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Angle in degrees from top (0 to 360)
    let degrees = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;

    const closest = snapToNearestDialTier(degrees);
    setActiveTierId(closest.id);
  }, []);

  const whatsappInquiryUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve girando el dial de palanca operativa en tu web (Nivel: ${activeTier.name.es}, Palanca: ${activeTier.multiplier}x). Quiero llevar mi negocio a este nivel de sistema.`
      : `Hi Mario, I was rotating the operational leverage dial on your site (Tier: ${activeTier.name.en}, Leverage: ${activeTier.multiplier}x). I want to bring my business to this level.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [activeTier, isEs]);

  // 24 radial notch ticks around the knob
  const NOTCHES_COUNT = 24;
  const notches = useMemo(() => {
    return Array.from({ length: NOTCHES_COUNT }, (_, idx) => {
      const angle = (idx / NOTCHES_COUNT) * 360;
      const isLit = angle <= knobAngle;
      return { idx, angle, isLit };
    });
  }, [knobAngle]);

  return (
    <section
      id="cockpit-operativo"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]"
    >
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_#71F3A2] animate-pulse" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                {isEs ? "Cockpit Táctil · Palanca Operativa" : "Tactile Cockpit · Operational Leverage"}
              </p>
            </div>
            <SplitReveal
              as="h2"
              text={
                isEs
                  ? "Girá el dial. Mirá cómo escala tu negocio."
                  : "Turn the dial. Watch your business scale."
              }
              className="mt-4 text-[clamp(2.2rem,4.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
            />
            <Reveal as="p" className="mt-4 text-base leading-relaxed text-foreground/60 sm:text-lg">
              {isEs
                ? "Una empresa atrapada en tareas manuales opera a 1.0x. Un ecosistema unificado con código Next.js y agentes de IA opera a 12.0x de palanca sin contratar más personal. Arrastrá la perilla física para sentir el salto."
                : "A business trapped in manual tasks operates at 1.0x. A unified ecosystem with Next.js code and AI agents operates at 12.0x leverage without bloating headcount. Drag the dial to feel the difference."}
            </Reveal>
          </div>

          {/* Quick HUD badge */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-5 py-3.5 backdrop-blur-md">
            <Gauge className="h-5 w-5 text-signal shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
                {isEs ? "Palanca Actual" : "Current Leverage"}
              </p>
              <p className="text-base font-bold font-mono text-signal">
                {activeTier.multiplier}x Multiplier
              </p>
            </div>
          </div>
        </div>

        {/* ─── 4 LEVEL PILLS (BUTTONS) ─── */}
        <div className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {DIAL_TIERS.map((tier) => {
            const isCurrent = tier.id === activeTierId;
            return (
              <button
                key={tier.id}
                onClick={() => setActiveTierId(tier.id)}
                className={`group relative text-left rounded-2xl p-4 border transition-all duration-300 ${
                  isCurrent
                    ? "border-white/30 bg-card/90 shadow-[0_8px_30px_rgba(0,0,0,0.5)] scale-[1.02]"
                    : "border-white/8 bg-white/[0.02] opacity-70 hover:opacity-100 hover:border-white/18"
                }`}
                style={{
                  borderColor: isCurrent ? tier.color : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: isCurrent ? `${tier.color}25` : "rgba(255,255,255,0.06)",
                      color: isCurrent ? tier.color : "rgba(255,255,255,0.5)",
                    }}
                  >
                    NIVEL 0{tier.level}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-foreground/50">
                    {tier.angle}°
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-foreground">
                  {tier.name[language]}
                </h4>

                <div className="mt-3 pt-2 border-t border-white/8 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-foreground/45">{tier.tag}</span>
                  <span style={{ color: isCurrent ? tier.color : undefined }}>
                    -{tier.frictionPct}% fricción
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── COCKPIT CENTRAL: ROTARY DIAL + OLED TELEMETRY HUD ─── */}
        <div className="mt-8 rounded-3xl border border-white/12 bg-card/40 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Ambient radial glow based on active tier */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-all duration-500"
            style={{
              background: `radial-gradient(ellipse at 35% 50%, ${activeTier.glowRgba} 0%, transparent 65%)`,
            }}
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-center">
            {/* 1. PHYSICAL ROTARY KNOB CANVAS */}
            <div className="flex flex-col items-center justify-center p-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-4 block">
                {isEs ? "Arrastrá la perilla o hacé clic" : "Drag knob or click positions"}
              </span>

              <div
                ref={dialRef}
                onPointerDown={(e) => {
                  setIsDragging(true);
                  handlePointerMove(e);
                }}
                onPointerMove={(e) => {
                  if (isDragging) handlePointerMove(e);
                }}
                onPointerUp={() => setIsDragging(false)}
                className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-full border border-white/15 bg-gradient-to-br from-[#12171C] via-[#0A0D10] to-[#12171C] p-4 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_15px_50px_rgba(0,0,0,0.8)] select-none"
              >
                {/* 24 Radial Notch Ticks */}
                {notches.map((notch) => {
                  return (
                    <div
                      key={notch.idx}
                      className="pointer-events-none absolute inset-0 flex justify-center"
                      style={{
                        transform: `rotate(${notch.angle}deg)`,
                      }}
                    >
                      <span
                        className={`h-2.5 w-0.5 rounded-full transition-all duration-300 ${
                          notch.isLit
                            ? "bg-signal shadow-[0_0_8px_#71F3A2]"
                            : "bg-white/15"
                        }`}
                      />
                    </div>
                  );
                })}

                {/* Rotating Center Knob */}
                <motion.div
                  animate={{ rotate: knobAngle }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full border-2 border-white/20 bg-gradient-to-br from-[#1F262E] via-[#0E1318] to-[#1A2128] shadow-[inset_0_2px_10px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center"
                >
                  {/* Knurled Grip Ring */}
                  <div className="absolute inset-2 rounded-full border border-dashed border-white/10" />

                  {/* LED Pointer Needle at top of knob */}
                  <div className="absolute top-2.5 h-6 w-1 rounded-full bg-signal shadow-[0_0_12px_#71F3A2]" />

                  {/* Center Metal Cap */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <span
                      className="text-3xl sm:text-4xl font-mono font-bold tracking-tight"
                      style={{ color: activeTier.color }}
                    >
                      {activeTier.multiplier}x
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/45 mt-1">
                      Leverage
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Angle Readout */}
              <div className="mt-4 font-mono text-xs text-foreground/50 flex items-center gap-2">
                <span>Angle: {knobAngle}°</span>
                <span>·</span>
                <span style={{ color: activeTier.color }}>{activeTier.tag}</span>
              </div>
            </div>

            {/* 2. OLED TELEMETRY DISPLAY */}
            <div className="rounded-3xl border border-white/12 bg-[#06080A] p-6 sm:p-8 backdrop-blur-2xl shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: activeTier.color }}
                  />
                  <span className="font-mono text-xs uppercase tracking-wider text-foreground/75 font-semibold">
                    {isEs ? "Estado Operativo" : "Operational State"}: Nivel 0{activeTier.level}
                  </span>
                </div>

                <span
                  className="rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase"
                  style={{
                    backgroundColor: `${activeTier.color}20`,
                    color: activeTier.color,
                    border: `1px solid ${activeTier.color}40`,
                  }}
                >
                  {activeTier.tag}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {activeTier.name[language]}
              </h3>

              <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                {activeTier.subtitle[language]}
              </p>

              {/* Telemetry Metrics Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/8 pt-5">
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
                  <span className="text-[10px] font-mono uppercase text-foreground/40 block">
                    {isEs ? "Speed-to-Lead" : "Speed-to-Lead"}
                  </span>
                  <span className="text-base font-bold font-mono text-foreground mt-1 block">
                    {activeTier.speedToLead[language]}
                  </span>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
                  <span className="text-[10px] font-mono uppercase text-foreground/40 block">
                    {isEs ? "Fricción Operativa" : "Operational Friction"}
                  </span>
                  <span
                    className="text-base font-bold font-mono mt-1 block"
                    style={{ color: activeTier.color }}
                  >
                    {activeTier.frictionPct}%
                  </span>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-foreground/40 block">
                    {isEs ? "Fuga Mensual" : "Monthly Leak"}
                  </span>
                  <span
                    className={`text-base font-bold font-mono mt-1 block ${
                      activeTier.monthlyLeakUsd === 0
                        ? "text-signal font-bold"
                        : "text-rose-400"
                    }`}
                  >
                    {activeTier.monthlyLeakUsd === 0
                      ? "$0 USD (Óptimo)"
                      : `-$${activeTier.monthlyLeakUsd} USD`}
                  </span>
                </div>
              </div>

              {/* Stack Architecture */}
              <div className="mt-6 pt-4 border-t border-white/8">
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 block mb-2">
                  {isEs ? "Componentes del Circuito" : "Circuit Stack Components"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeTier.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-foreground/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Strip */}
              <div className="mt-8 pt-5 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-foreground/60 max-w-md">
                  {activeTier.costStructure[language]}
                </p>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 text-xs font-semibold text-black transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(113,243,162,0.35)]"
                >
                  <span>{isEs ? "Implementar este nivel de palanca" : "Deploy this leverage tier"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
