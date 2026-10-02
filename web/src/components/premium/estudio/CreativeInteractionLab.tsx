"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  INTERACTION_PRESETS,
  calculateTilt,
  scrambleStep,
  generateInteractionCodeSnippet,
  type InteractionPreset,
} from "@/data/creativeInteractionData";
import {
  Sparkles,
  Layers,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ArrowRight,
  Zap,
  Eye,
  Activity,
} from "lucide-react";

export function CreativeInteractionLab() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [activePresetId, setActivePresetId] = useState<string>("tilt_card");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // ─── 1. 3D TILT STATE ───
  const tiltCardRef = useRef<HTMLDivElement>(null);
  const [tiltState, setTiltState] = useState({
    rotateX: 0,
    rotateY: 0,
    sheenX: 50,
    sheenY: 50,
  });
  const [maxAngle, setMaxAngle] = useState(20);
  const [sheenOpacity, setSheenOpacity] = useState(0.4);

  const handleTiltMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltCardRef.current) return;
      const rect = tiltCardRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const result = calculateTilt(offsetX, offsetY, rect.width, rect.height, {
        maxAngle,
        perspective: 1000,
        sheenOpacity,
      });
      setTiltState(result);
    },
    [maxAngle, sheenOpacity]
  );

  const handleTiltMouseLeave = useCallback(() => {
    setTiltState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  }, []);

  // ─── 2. SCRAMBLE TEXT STATE ───
  const [customText, setCustomText] = useState("HIGH IMPACT");
  const [displayedText, setDisplayedText] = useState("HIGH IMPACT");
  const [isScrambling, setIsScrambling] = useState(false);

  const runScramble = useCallback(
    (target: string) => {
      setIsScrambling(true);
      const startTime = performance.now();
      const duration = 750;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplayedText(scrambleStep(target, progress));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayedText(target);
          setIsScrambling(false);
        }
      };

      requestAnimationFrame(animate);
    },
    []
  );

  useEffect(() => {
    if (activePresetId === "scramble_text") {
      runScramble(customText);
    }
  }, [activePresetId, customText, runScramble]);

  // ─── 3. MAGNETIC BUTTON STATE ───
  const magneticAreaRef = useRef<HTMLDivElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const handleMagneticMouseMove = useCallback((e: React.MouseEvent) => {
    if (!magneticAreaRef.current) return;
    const rect = magneticAreaRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist < 180) {
      setMagneticOffset({ x: dx * 0.42, y: dy * 0.42 });
    } else {
      setMagneticOffset({ x: 0, y: 0 });
    }
  }, []);

  const handleMagneticMouseLeave = useCallback(() => {
    setMagneticOffset({ x: 0, y: 0 });
  }, []);

  // ─── 4. BORDER SPOTLIGHT STATE ───
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });
  const [isHoveringSpotlight, setIsHoveringSpotlight] = useState(false);

  const handleSpotlightMouseMove = useCallback((e: React.MouseEvent) => {
    if (!spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    setSpotlightCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Active Preset Object
  const currentPreset = useMemo(
    () => INTERACTION_PRESETS.find((p) => p.id === activePresetId) || INTERACTION_PRESETS[0],
    [activePresetId]
  );

  const codeSnippet = useMemo(
    () => generateInteractionCodeSnippet(activePresetId),
    [activePresetId]
  );

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const whatsappInquiryUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve probando el Laboratorio de Micro-Interacciones en /estudio (${currentPreset.name.es}). Me interesa incorporar este nivel de diseño y física interactiva en mi próximo proyecto.`
      : `Hi Mario, I was testing the Micro-Interaction Lab on /estudio (${currentPreset.name.en}). I want to incorporate this level of interactive physics into my next web experience.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [currentPreset, isEs]);

  return (
    <section
      id="laboratorio-interactivo"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]"
    >
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_#71F3A2] animate-pulse" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                {isEs ? "Laboratorio de Micro-Interacciones · 60 FPS" : "Micro-Interaction Sandbox · 60 FPS"}
              </p>
            </div>
            <SplitReveal
              as="h2"
              text={
                isEs
                  ? "Física táctil que convierte visitantes en clientes."
                  : "Tactile physics turning visitors into clients."
              }
              className="mt-4 text-[clamp(2.2rem,4.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
            />
            <Reveal as="p" className="mt-4 text-base leading-relaxed text-foreground/60 sm:text-lg">
              {isEs
                ? "Las interfaces estáticas ya no retienen atención. Probá en vivo cuatro técnicas de interacción con resortes, perspectiva 3D y shaders CSS que elevan el valor percibido de cualquier producto digital."
                : "Static websites no longer hold attention. Test four live interactive techniques with spring physics, 3D perspective, and CSS shaders that drastically elevate your digital product's perceived craft."}
            </Reveal>
          </div>

          {/* Quick Metrics Tag */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-5 py-3.5 backdrop-blur-md">
            <Activity className="h-4 w-4 text-signal shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45">
                {isEs ? "Impacto Medible" : "Measurable Impact"}
              </p>
              <p className="text-sm font-semibold text-signal font-mono">
                {currentPreset.impactMetric[language]}
              </p>
            </div>
          </div>
        </div>

        {/* ─── SELECTOR DE PRESETS (TABS TÁCTILES) ─── */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-b border-white/8 pb-4">
          {INTERACTION_PRESETS.map((preset) => {
            const isActive = preset.id === activePresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setActivePresetId(preset.id)}
                className={`group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-mono text-xs transition-all ${
                  isActive
                    ? "border border-signal/40 bg-signal/15 text-signal font-semibold shadow-[0_0_20px_rgba(113,243,162,0.18)]"
                    : "border border-white/8 bg-white/[0.02] text-foreground/60 hover:bg-white/[0.06] hover:text-foreground hover:border-white/15"
                }`}
              >
                <span className="text-[10px] opacity-50 uppercase tracking-widest">{preset.tag}</span>
                <span>{preset.name[language]}</span>
              </button>
            );
          })}
        </div>

        {/* ─── CANVAS INTERACTIVO PRINCIPAL ─── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] items-start">
          {/* Main Stage */}
          <div className="relative min-h-[460px] sm:min-h-[520px] rounded-3xl border border-white/12 bg-card/40 p-6 sm:p-12 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Background Grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(113,243,162,0.06)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* PRESET 1: 3D PERSPECTIVE TILT */}
            {activePresetId === "tilt_card" && (
              <div
                ref={tiltCardRef}
                onMouseMove={handleTiltMouseMove}
                onMouseLeave={handleTiltMouseLeave}
                className="relative cursor-pointer select-none py-6"
                style={{ perspective: 1200 }}
              >
                <motion.div
                  animate={{
                    rotateX: tiltState.rotateX,
                    rotateY: tiltState.rotateY,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  className="relative w-[300px] sm:w-[380px] rounded-3xl border border-white/20 bg-gradient-to-br from-card via-[#0F1418] to-card p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Dynamic Specular Sheen */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
                    style={{
                      opacity: sheenOpacity,
                      background: `radial-gradient(circle at ${tiltState.sheenX}% ${tiltState.sheenY}%, rgba(255,255,255,0.35) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Floating Depth Elements */}
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-semibold">
                      Mario Morera · Studio
                    </span>
                    <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_#71F3A2]" />
                  </div>

                  <div className="mt-8" style={{ transform: "translateZ(45px)" }}>
                    <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {isEs ? "Arquitectura Viva" : "Living Architecture"}
                    </p>
                    <p className="mt-2 text-xs text-foreground/60 leading-relaxed">
                      {isEs
                        ? "Mové el cursor sobre esta tarjeta para inspeccionar el ángulo de rotación giroscópico y el reflejo dinámico."
                        : "Move your pointer over this card to inspect the gyroscopic rotational tilt and specular shine."}
                    </p>
                  </div>

                  <div
                    className="mt-8 flex items-center justify-between border-t border-white/10 pt-4"
                    style={{ transform: "translateZ(35px)" }}
                  >
                    <div className="font-mono text-[11px] text-foreground/45">
                      <span>X: {tiltState.rotateX}°</span>{" "}
                      <span className="ml-2">Y: {tiltState.rotateY}°</span>
                    </div>
                    <span className="text-[10px] font-mono text-signal bg-signal/10 px-2 py-0.5 rounded-full border border-signal/20">
                      Preserve-3D
                    </span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* PRESET 2: SCRAMBLE KINETIC TYPOGRAPHY */}
            {activePresetId === "scramble_text" && (
              <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
                <div className="rounded-2xl border border-white/10 bg-background/80 px-6 py-8 backdrop-blur-md w-full">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-signal block mb-3">
                    {isEs ? "Buffer de Resolución de Glifos" : "Glyph Resolution Buffer"}
                  </span>
                  <p className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-foreground min-h-[60px] flex items-center justify-center">
                    {displayedText}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.toUpperCase().slice(0, 22))}
                    placeholder={isEs ? "Escribí tu marca..." : "Type your brand..."}
                    className="rounded-xl border border-white/15 bg-card px-4 py-2.5 text-xs font-mono text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-signal w-48 sm:w-56"
                  />
                  <button
                    onClick={() => runScramble(customText || "MARIO MORERA")}
                    disabled={isScrambling}
                    className="pressable inline-flex items-center gap-2 rounded-xl bg-signal px-5 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    <RotateCcw className={`h-3.5 w-3.5 ${isScrambling ? "animate-spin" : ""}`} />
                    <span>{isEs ? "Re-scramblear" : "Re-scramble"}</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["TESLA", "STRIPE", "LINEAR", "NEXT.JS 16", "DEEP SPACE"].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setCustomText(brand);
                        runScramble(brand);
                      }}
                      className="text-[10px] font-mono text-foreground/50 hover:text-signal px-2 py-1 rounded border border-white/8 hover:border-signal/30"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PRESET 3: MAGNETIC BUTTON */}
            {activePresetId === "magnetic_button" && (
              <div
                ref={magneticAreaRef}
                onMouseMove={handleMagneticMouseMove}
                onMouseLeave={handleMagneticMouseLeave}
                className="relative z-10 w-full h-80 rounded-2xl border border-dashed border-white/15 flex flex-col items-center justify-center cursor-crosshair"
              >
                <span className="pointer-events-none absolute top-4 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                  {isEs
                    ? "Radio de atracción magnética: 180px · Acercá el cursor"
                    : "Magnetic attraction field: 180px · Bring cursor close"}
                </span>

                <motion.button
                  animate={{ x: magneticOffset.x, y: magneticOffset.y }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="pressable group relative flex items-center gap-3 rounded-full bg-signal px-8 py-4 text-base font-semibold text-black shadow-[0_0_30px_rgba(113,243,162,0.4)]"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>{isEs ? "Botón Magnético" : "Magnetic Button"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <div className="pointer-events-none absolute bottom-4 font-mono text-[10px] text-foreground/40">
                  Offset: X={Math.round(magneticOffset.x)}px | Y={Math.round(magneticOffset.y)}px
                </div>
              </div>
            )}

            {/* PRESET 4: BORDER SPOTLIGHT */}
            {activePresetId === "border_spotlight" && (
              <div
                ref={spotlightRef}
                onMouseMove={handleSpotlightMouseMove}
                onMouseEnter={() => setIsHoveringSpotlight(true)}
                onMouseLeave={() => setIsHoveringSpotlight(false)}
                className="group relative w-full max-w-md rounded-3xl border border-white/10 bg-card p-8 sm:p-10 overflow-hidden cursor-pointer"
              >
                {/* Dynamic Spotlight Glow */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
                  style={{
                    opacity: isHoveringSpotlight ? 1 : 0,
                    background: `radial-gradient(350px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(113,243,162,0.4), transparent 60%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                      Conic Shader
                    </span>
                    <span className="h-2 w-2 rounded-full bg-signal animate-ping" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                    {isEs ? "Borde Reactivo al Cursor" : "Cursor-Reactive Border"}
                  </h3>
                  <p className="mt-3 text-sm text-foreground/65 leading-relaxed">
                    {isEs
                      ? "La iluminación del perímetro se recalcula matemáticamente según las coordenadas relativas del puntero en cada fotograma."
                      : "The border glow coordinates are re-computed mathematically relative to the pointer coordinates on every animation frame."}
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-foreground/50">
                    <span>X: {Math.round(spotlightCoords.x)}px</span>
                    <span>Y: {Math.round(spotlightCoords.y)}px</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── SIDEBAR: TELEMETRÍA, AJUSTES Y CÓDIGO ─── */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-signal" />
                <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-semibold">
                  {isEs ? "Ficha Técnica" : "Technical Specs"}
                </h4>
              </div>

              <p className="mt-3 text-sm text-foreground/70 leading-snug">
                {currentPreset.subtitle[language]}
              </p>

              {/* Stack tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {currentPreset.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/8 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-foreground/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Sliders for Tilt Card if active */}
              {activePresetId === "tilt_card" && (
                <div className="mt-6 border-t border-white/8 pt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-foreground/60 mb-1">
                      <span>{isEs ? "Ángulo Máximo" : "Max Tilt Angle"}</span>
                      <span className="text-signal">{maxAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={35}
                      value={maxAngle}
                      onChange={(e) => setMaxAngle(Number(e.target.value))}
                      className="w-full accent-signal"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-foreground/60 mb-1">
                      <span>{isEs ? "Opacidad Reflejo" : "Sheen Opacity"}</span>
                      <span className="text-signal">{Math.round(sheenOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={0.8}
                      step={0.05}
                      value={sheenOpacity}
                      onChange={(e) => setSheenOpacity(Number(e.target.value))}
                      className="w-full accent-signal"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-2xl border border-white/10 bg-[#0A0D10] p-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-signal" />
                  <span className="font-mono text-xs text-foreground/70">
                    Framer Motion / Tailwind
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-foreground/80 hover:bg-white/10 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-signal" />
                      <span className="text-signal">{isEs ? "Copiado" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>{isEs ? "Copiar" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="mt-3 max-h-48 overflow-x-auto text-[11px] font-mono leading-relaxed text-foreground/60">
                <code>{codeSnippet}</code>
              </pre>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="rounded-2xl border border-signal/20 bg-signal/[0.05] p-5">
              <p className="text-xs text-foreground/70 leading-relaxed">
                {isEs
                  ? "¿Querés que tu web tenga este nivel de dinamismo y retención? Hablemos directamente sin intermediarios."
                  : "Want your brand website to feature this tier of fluid dynamism? Let's discuss your project directly."}
              </p>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-4 py-3 text-xs font-semibold text-black transition-transform hover:scale-[1.01]"
              >
                <span>{isEs ? "Consultar esta interacción" : "Inquire about this interaction"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
