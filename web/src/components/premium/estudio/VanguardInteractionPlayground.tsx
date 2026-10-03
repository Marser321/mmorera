"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Sparkles,
  Layers,
  Code2,
  Copy,
  Check,
  Zap,
  Terminal,
  Compass,
  Cpu,
  Shield,
  MessageCircle,
  ArrowRight,
  Maximize2,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  VANGUARD_PATTERNS,
  getVanguardPattern,
  type VanguardPattern,
} from "@/data/vanguardInteractionData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

export function VanguardInteractionPlayground() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [activePatternId, setActivePatternId] = useState<string>("morphing-dock");
  const [copied, setCopied] = useState<boolean>(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // Pattern 1: Dock state
  const [activeDockItem, setActiveDockItem] = useState<string>("Home");
  const [dockExpanded, setDockExpanded] = useState<boolean>(false);

  // Pattern 2: Border Beam state
  const [beamDuration, setBeamDuration] = useState<number>(4);
  const [beamColor, setBeamColor] = useState<string>("cyan");

  // Pattern 3: Spotlight state
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number; opacity: number }>({
    x: 180,
    y: 120,
    opacity: 0,
  });

  // Pattern 4: Inertial Card state
  const cardX = useMotionValue(0);
  const cardRotate = useTransform(cardX, [-200, 200], [-18, 18]);
  const cardOpacity = useTransform(cardX, [-200, 0, 200], [0.6, 1, 0.6]);

  const activePattern = useMemo(
    () => getVanguardPattern(activePatternId) || VANGUARD_PATTERNS[0],
    [activePatternId]
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activePattern.snippet);
      setCopied(true);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(10);
        } catch {
          // ignore
        }
      }
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2400);
    } catch {
      // fallback
    }
  };

  const handleSpotlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  return (
    <section
      id="componentes-vanguardia"
      className="relative isolate my-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#06080d] p-6 backdrop-blur-2xl sm:p-10 lg:p-12 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Background ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-track-create/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[140px]"
      />

      {/* Header */}
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-track-create/30 bg-track-create/10 px-3.5 py-1 text-xs font-mono text-track-create">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>
            {isEs
              ? "02.5 · LABORATORIO DE COMPONENTES DE VANGUARDIA"
              : "02.5 · VANGUARD INTERACTION PLAYGROUND"}
          </span>
        </div>

        <h2 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white sm:text-4xl light:text-ink">
          {isEs
            ? "Micro-Interacciones de Próxima Generación: Docks Elásticos, Rayos Perimetrales & Spotlights"
            : "Next-Gen Micro-Interactions: Elastic Docks, Perimeter Beams & Radial Spotlights"}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base light:text-ink/80">
          {isEs
            ? "Patrones de diseño de frontera inspirados en Kokonut UI, Magic UI, Aceternity UI y Motion Primitives. Jugá con los parámetros en vivo o exportá el código para tu proyecto."
            : "Bleeding-edge UI patterns inspired by Kokonut UI, Magic UI, Aceternity UI, and Motion Primitives. Tweak parameters live or export production-ready React code."}
        </p>
      </div>

      {/* Selector Tabs (Pill style with spring physics) */}
      <div className="relative z-10 mt-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
        {VANGUARD_PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePatternId(p.id)}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono transition-all sm:text-sm ${
              activePatternId === p.id
                ? "text-black font-bold shadow-lg light:text-black"
                : "text-white/70 hover:text-white light:text-ink/70 light:hover:text-ink"
            }`}
          >
            {activePatternId === p.id && (
              <motion.div
                layoutId="vanguard-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-track-create via-accent to-signal"
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {p.category === "dock" && <Layers className="h-4 w-4" />}
              {p.category === "beam" && <Zap className="h-4 w-4" />}
              {p.category === "spotlight" && <Compass className="h-4 w-4" />}
              {p.category === "gesture" && <Maximize2 className="h-4 w-4" />}
              {isEs ? p.name.es : p.name.en}
            </span>
          </button>
        ))}
      </div>

      {/* Main Interactive Canvas & Code Split */}
      <div className="relative z-10 mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Live Interactive Demo Canvas (7 Cols) */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-2xl sm:p-8 lg:col-span-7">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded bg-track-create/20 px-2.5 py-0.5 text-xs font-mono font-bold text-track-create">
                {activePattern.inspiration}
              </span>
              <div className="flex gap-1.5">
                {activePattern.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-white/70 sm:text-sm">
              {isEs ? activePattern.description.es : activePattern.description.en}
            </p>
          </div>

          {/* Interactive Playground Canvas Box */}
          <div className="relative my-8 flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 sm:p-10">
            {/* 1. MORPHING DYNAMIC ISLAND DOCK */}
            {activePatternId === "morphing-dock" && (
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-2 backdrop-blur-2xl shadow-2xl"
                >
                  {[
                    { id: "Home", icon: Layers, label: "Home" },
                    { id: "Terminal", icon: Terminal, label: "Terminal" },
                    { id: "AI Agent", icon: Sparkles, label: "AI Agent" },
                    { id: "Security", icon: Shield, label: "Vault" },
                    { id: "Settings", icon: Sliders, label: "Config" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeDockItem === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        whileHover={{ scale: 1.25, y: -4 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setActiveDockItem(item.id)}
                        className={`relative rounded-full p-3 transition-colors ${
                          isActive
                            ? "bg-signal text-black font-bold shadow-[0_0_20px_#71F3A2]"
                            : "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.button>
                    );
                  })}
                </motion.div>
                <div className="font-mono text-xs text-white/50">
                  {isEs ? "Elemento activo:" : "Active element:"}{" "}
                  <span className="text-signal font-bold">{activeDockItem}</span>
                </div>
              </div>
            )}

            {/* 2. ANIMATED BORDER BEAM */}
            {activePatternId === "border-beam" && (
              <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0b1017] p-6 shadow-2xl overflow-hidden">
                {/* Simulated Border Beam running along perimeter */}
                <motion.div
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: beamDuration,
                    ease: "linear",
                  }}
                  className={`absolute -top-1 left-0 h-[3px] w-36 bg-gradient-to-r from-transparent ${
                    beamColor === "cyan" ? "via-cyan-400" : "via-signal"
                  } to-transparent blur-[1px]`}
                />

                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span>CHIP SET: N16 EDGE</span>
                  <span className="text-signal">99.98% EFFICIENCY</span>
                </div>
                <div className="mt-3 font-mono text-xl font-bold text-white">
                  {isEs ? "Rayo Perimetral Láser" : "Laser Perimeter Beam"}
                </div>
                <p className="mt-2 text-xs text-white/70">
                  {isEs
                    ? "Efecto de haz de luz fluido ejecutado 100% sobre aceleración por hardware GPU sin bloquear el hilo principal."
                    : "Fluid light tracer executed 100% on GPU hardware acceleration with zero main thread blockage."}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-white/40 border-t border-white/5 pt-3">
                  <span>SPEED: {beamDuration}s</span>
                  <button
                    type="button"
                    onClick={() => setBeamColor(beamColor === "cyan" ? "signal" : "cyan")}
                    className="text-accent hover:underline"
                  >
                    Color: {beamColor.toUpperCase()}
                  </button>
                </div>
              </div>
            )}

            {/* 3. CARD SPOTLIGHT */}
            {activePatternId === "card-spotlight" && (
              <div
                onMouseMove={handleSpotlightMove}
                onMouseLeave={() => setSpotlightPos((p) => ({ ...p, opacity: 0 }))}
                className="relative w-full max-w-sm cursor-crosshair rounded-3xl border border-white/15 bg-[#0b1017] p-6 shadow-2xl overflow-hidden"
              >
                {/* Spotlight gradient */}
                <div
                  style={{
                    background: `radial-gradient(280px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(113, 243, 162, 0.22), transparent 80%)`,
                    opacity: spotlightPos.opacity,
                  }}
                  className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                />

                <div className="relative z-10">
                  <div className="text-xs font-mono text-signal">SPOTLIGHT TRACKER</div>
                  <h4 className="mt-2 text-lg font-bold text-white">
                    {isEs ? "Mové el cursor sobre esta card" : "Move cursor across this card"}
                  </h4>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">
                    {isEs
                      ? "Iluminación volumétrica dinámica que revela detalles y bordes sutiles según la posición exacta del puntero."
                      : "Volumetric dynamic illumination revealing hidden micro-circuitry and glass borders based on pointer coordinates."}
                  </p>
                  <div className="mt-4 font-mono text-[11px] text-white/40">
                    X: {Math.round(spotlightPos.x)}px · Y: {Math.round(spotlightPos.y)}px
                  </div>
                </div>
              </div>
            )}

            {/* 4. INERTIAL GESTURAL CARD DECK */}
            {activePatternId === "inertial-deck" && (
              <div className="flex flex-col items-center">
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  style={{ x: cardX, rotate: cardRotate, opacity: cardOpacity }}
                  whileTap={{ cursor: "grabbing", scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="relative w-72 h-80 rounded-3xl border-2 border-accent/40 bg-[#0e141d] p-6 shadow-2xl cursor-grab flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-accent">
                    <span>GESTURE SPRING</span>
                    <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {isEs ? "Arrastrá esta tarjeta a los lados" : "Drag this card sideways"}
                    </h4>
                    <p className="mt-2 text-xs text-white/70">
                      {isEs
                        ? "La rotación angular y la restitución acompañan la velocidad de tu dedo."
                        : "Angular rotation and elastic restitution track your gesture velocity."}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-white/40 text-center">
                    {isEs ? "Soltá para restitución elástica" : "Release for spring bounce-back"}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Quick Fine-Tuning Controls */}
          {activePatternId === "border-beam" && (
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs font-mono">
              <span className="text-white/60">{isEs ? "Velocidad del rayo:" : "Beam velocity:"}</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={beamDuration}
                  aria-label={isEs ? "Velocidad del rayo perimetral" : "Border beam velocity"}
                  onChange={(e) => setBeamDuration(Number(e.target.value))}
                  className="h-1.5 w-28 cursor-pointer accent-accent"
                />
                <span className="text-accent font-bold">{beamDuration}s</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Production Code Generator & Export (5 Cols) */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-2xl sm:p-7 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-white/70">
                <Code2 className="h-4 w-4 text-signal" />
                <span>{isEs ? "Código React de Producción" : "Production React Code"}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-mono font-medium text-white transition-all hover:bg-white/10 active:scale-95"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? (isEs ? "¡Copiado!" : "Copied!") : (isEs ? "Copiar" : "Copy")}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="mt-4 max-h-[380px] overflow-x-auto rounded-2xl border border-white/5 bg-black/60 p-4 font-mono text-xs text-accent/90 leading-relaxed">
              <pre>
                <code>{activePattern.snippet}</code>
              </pre>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
                isEs
                  ? `Hola Mario, estuve probando tu laboratorio de componentes de vanguardia (${activePattern.name.es}). Quiero diseñar micro-interacciones de este calibre para mi web.`
                  : `Hi Mario, I was testing your vanguard interaction lab (${activePattern.name.en}). I want to build custom micro-interactions like this for my site.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-track-create/40 bg-track-create/20 py-3.5 text-center font-mono text-xs font-bold text-track-create transition-all hover:bg-track-create/30 active:scale-95 shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{isEs ? "Cotizar Interacciones a Medida" : "Commission Custom Interactions"}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
