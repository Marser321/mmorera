"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  SPRING_PRESETS,
  type SpringPhysicsPreset,
  clampKineticParams,
  generateMotionCodeSnippet,
} from "@/data/kineticMotionData";
import {
  Sparkles,
  Sliders,
  Move,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Code2,
  Maximize2,
} from "lucide-react";

export function KineticMotionLab() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Selected preset & active physics params
  const [selectedPresetId, setSelectedPresetId] = useState<"magnetic" | "fluid" | "hyper">("magnetic");
  const activePreset = useMemo<SpringPhysicsPreset>(
    () => SPRING_PRESETS.find((p) => p.id === selectedPresetId) ?? SPRING_PRESETS[0],
    [selectedPresetId]
  );

  const [stiffness, setStiffness] = useState<number>(activePreset.stiffness);
  const [damping, setDamping] = useState<number>(activePreset.damping);
  const [mass, setMass] = useState<number>(activePreset.mass);
  const [glowIntensity, setGlowIntensity] = useState<number>(0.75);

  // Copy feedback state
  const [copied, setCopied] = useState<boolean>(false);

  // Sync sliders when switching preset
  const handleSelectPreset = (preset: SpringPhysicsPreset) => {
    setSelectedPresetId(preset.id);
    setStiffness(preset.stiffness);
    setDamping(preset.damping);
    setMass(preset.mass);
  };

  const currentParams = useMemo(
    () => clampKineticParams({ stiffness, damping, mass, glowIntensity }),
    [stiffness, damping, mass, glowIntensity]
  );

  const codeSnippet = useMemo(
    () => generateMotionCodeSnippet(currentParams, activePreset.glowColor),
    [currentParams, activePreset.glowColor]
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const constraintsRef = useRef<HTMLDivElement>(null);

  const whatsappPrefillUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve probando el Laboratorio Cinético en tu Estudio con el preset ${activePreset.name.es} (stiffness: ${stiffness}, damping: ${damping}). Me interesa diseñar una experiencia web interactiva para mi marca.`
      : `Hi Mario, I was testing the Kinetic Motion Lab in your Studio with the ${activePreset.name.en} preset (stiffness: ${stiffness}, damping: ${damping}). I'd like to build an interactive web experience for my brand.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [activePreset, stiffness, damping, isEs]);

  return (
    <section
      id="laboratorio-cinetico"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Resplandor ambiental reactivo con el color del preset activo */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 20%, ${activePreset.glowColor}15 0%, transparent 65%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500"
              style={{ backgroundColor: activePreset.glowColor, color: activePreset.glowColor }}
            />
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: activePreset.glowColor }}
            >
              {isEs ? "01.5 · Laboratorio Cinético & Física Spring" : "01.5 · Kinetic Lab & Spring Physics"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Calibrá la física antes de escribir la primera línea de código."
                : "Calibrate motion physics before writing the first line of code."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Las animaciones que emocionan no son lineales ni rígidas: responden a resortes físicos reales. Regulá la rigidez, masa y rebote de este elemento táctil y observá cómo cambia la personalidad de la interfaz en tiempo real."
              : "Inspiring animations aren't linear: they obey real spring mechanics. Adjust stiffness, mass, and damping on this tactile canvas to observe how interface personality transforms in real time."}
          </Reveal>
        </div>

        {/* ─── 1. PRESETS CINÉTICOS (CARDS DE ESTILO) ─── */}
        <div className="mt-10">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-3">
            {isEs ? "Paso 1: Seleccioná un carácter de movimiento" : "Step 1: Select a motion persona"}
          </span>
          <div className="grid gap-3.5 sm:grid-cols-3">
            {SPRING_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative text-left rounded-2xl p-5 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-white/30 bg-card/90 shadow-[0_8px_30px_rgba(0,0,0,0.5)] light:bg-card"
                      : "border-white/10 bg-card/30 hover:border-white/20 hover:bg-card/50 light:bg-card/20"
                  }`}
                  style={{
                    borderColor: isSelected ? preset.glowColor : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
                      style={{
                        backgroundColor: isSelected ? `${preset.glowColor}25` : "rgba(255,255,255,0.06)",
                        color: isSelected ? preset.glowColor : "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                      {preset.id}
                    </span>
                    <span className="text-[11px] font-mono text-foreground/40">
                      k={preset.stiffness} · c={preset.damping}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                    {preset.name[language]}
                  </h3>
                  <p className="mt-0.5 text-xs font-mono text-foreground/50">{preset.subtitle[language]}</p>
                  <p className="mt-2 text-xs text-foreground/60 leading-relaxed">{preset.character[language]}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 2. STAGE INTERACTIVO: CANVAS DE FÍSICA & SLIDERS TÁCTILES ─── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Panel Izquierdo: Playground con Objeto Arrastrable */}
          <div
            ref={constraintsRef}
            className="rounded-3xl border border-white/14 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]"
          >
            {/* Header del Canvas */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 z-10">
              <div className="flex items-center gap-2">
                <Move className="h-4 w-4 text-foreground/50" />
                <span className="font-mono text-xs text-foreground/70 uppercase tracking-wider">
                  {isEs ? "Canvas Físico · Arrastrá y Soltá" : "Physics Canvas · Drag & Release"}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-foreground/40">
                <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: activePreset.glowColor }} />
                <span>SPRING ENGINE ACTIVO</span>
              </div>
            </div>

            {/* Zona de interacción con física */}
            <div className="relative flex-1 flex items-center justify-center my-8">
              {/* Círculos concéntricos de referencia */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="h-48 w-48 rounded-full border border-dashed border-white/30" />
                <div className="absolute h-72 w-72 rounded-full border border-dashed border-white/20" />
              </div>

              {/* Objeto Táctil Arrastrable con Física Real */}
              <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.6}
                dragTransition={{
                  bounceStiffness: stiffness,
                  bounceDamping: damping,
                }}
                whileHover={{ scale: 1.06, cursor: "grab" }}
                whileTap={{ scale: 0.94, cursor: "grabbing" }}
                transition={{
                  type: "spring",
                  stiffness: stiffness,
                  damping: damping,
                  mass: mass,
                }}
                className="relative z-20 flex flex-col items-center justify-center rounded-3xl p-7 text-center select-none shadow-2xl backdrop-blur-2xl"
                style={{
                  backgroundColor: "rgba(20, 20, 25, 0.85)",
                  border: `1.5px solid ${activePreset.glowColor}`,
                  boxShadow: `0 0 ${glowIntensity * 45}px ${activePreset.glowColor}50, inset 0 0 20px rgba(255,255,255,0.05)`,
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl mb-3 shadow-lg"
                  style={{
                    backgroundColor: `${activePreset.glowColor}25`,
                    color: activePreset.glowColor,
                  }}
                >
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-foreground tracking-tight">{activePreset.name[language]}</h4>
                <p className="mt-1 text-xs text-foreground/60 font-mono">
                  k={stiffness} · c={damping} · m={mass}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-foreground/40 bg-white/5 rounded-full px-2.5 py-1">
                  <Maximize2 className="h-3 w-3" />
                  {isEs ? "Arrastrame hacia los bordes" : "Drag me towards edges"}
                </span>
              </motion.div>
            </div>

            {/* Footer con micro-telemetría */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs font-mono text-foreground/50 z-10">
              <span>{isEs ? "Restitución de impacto: Instantánea" : "Restitution: Instant"}</span>
              <span style={{ color: activePreset.glowColor }}>60 FPS GPU ACCELERATED</span>
            </div>
          </div>

          {/* Panel Derecho: Sliders de Ajuste Fino & Generador de Código */}
          <div className="flex flex-col gap-4">
            {/* Controles de Sliders */}
            <div className="rounded-3xl border border-white/14 bg-card/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-foreground/40" />
                  {isEs ? "Calibración Fina de Parámetros" : "Fine-Tuning Controls"}
                </span>
                <span className="text-[10px] font-mono text-signal">MOTOR EN TIEMPO REAL</span>
              </div>

              <div className="space-y-5">
                {/* Stiffness Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-foreground/70">
                      {isEs ? "Rigidez del Resorte (Stiffness)" : "Spring Stiffness"}
                    </span>
                    <span className="font-bold" style={{ color: activePreset.glowColor }}>
                      {stiffness}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={800}
                    step={10}
                    value={stiffness}
                    onChange={(e) => setStiffness(Number(e.target.value))}
                    className="w-full accent-signal cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-foreground/40 mt-1">
                    <span>100 (Elástico)</span>
                    <span>800 (Rígido)</span>
                  </div>
                </div>

                {/* Damping Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-foreground/70">
                      {isEs ? "Freno / Amortiguación (Damping)" : "Spring Damping"}
                    </span>
                    <span className="font-bold" style={{ color: activePreset.glowColor }}>
                      {damping}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={1}
                    value={damping}
                    onChange={(e) => setDamping(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-foreground/40 mt-1">
                    <span>10 (Mucho rebote)</span>
                    <span>50 (Sin rebote)</span>
                  </div>
                </div>

                {/* Mass Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-foreground/70">
                      {isEs ? "Inercia / Masa (Mass)" : "Virtual Mass"}
                    </span>
                    <span className="font-bold" style={{ color: activePreset.glowColor }}>
                      {mass.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    className="w-full accent-violet-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-foreground/40 mt-1">
                    <span>0.5 (Pluma)</span>
                    <span>2.5 (Pesado)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generador de Código Limpio */}
            <div className="rounded-3xl border border-white/14 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50 flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-foreground/40" />
                    {isEs ? "Configuración Framer Motion Lista para Prod" : "Framer Motion Prod-Ready Snippet"}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="pressable inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-foreground/80 hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-signal" />
                        <span className="text-signal">{isEs ? "¡Copiado!" : "Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{isEs ? "Copiar" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="rounded-xl border border-white/8 bg-black/40 p-4 text-[11px] font-mono text-foreground/80 overflow-x-auto leading-relaxed">
                  {codeSnippet}
                </pre>
              </div>

              {/* Botón de Conversión Directa */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <a
                  href={whatsappPrefillUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: activePreset.glowColor,
                    boxShadow: `0 0 20px ${activePreset.glowColor}35`,
                  }}
                >
                  <span>{isEs ? "Diseñar una experiencia interactiva" : "Design an interactive experience"}</span>
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
