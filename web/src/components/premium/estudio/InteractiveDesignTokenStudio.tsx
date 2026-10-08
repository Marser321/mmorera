"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Sliders,
  Copy,
  Check,
  ArrowUpRight,
  Layers,
  CircleDot,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  COLOR_THEMES,
  RADIUS_PRESETS,
  GLASS_PRESETS,
  generateTailwindConfigSnippet,
  generateCssVariablesSnippet,
  type RadiusPreset,
  type GlassPreset,
} from "@/data/designTokenData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

export function InteractiveDesignTokenStudio() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // State
  const [selectedThemeId, setSelectedThemeId] = useState<string>("signal-neo");
  const [selectedRadiusId, setSelectedRadiusId] = useState<RadiusPreset["id"]>("modern");
  const [selectedGlassId, setSelectedGlassId] = useState<GlassPreset["id"]>("frosted");
  const [codeTab, setCodeTab] = useState<"tailwind" | "css">("tailwind");
  const [copied, setCopied] = useState<boolean>(false);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Active tokens
  const activeTheme = useMemo(
    () => COLOR_THEMES.find((t) => t.id === selectedThemeId) || COLOR_THEMES[0],
    [selectedThemeId]
  );
  const activeRadius = useMemo(
    () => RADIUS_PRESETS.find((r) => r.id === selectedRadiusId) || RADIUS_PRESETS[1],
    [selectedRadiusId]
  );
  const activeGlass = useMemo(
    () => GLASS_PRESETS.find((g) => g.id === selectedGlassId) || GLASS_PRESETS[1],
    [selectedGlassId]
  );

  // Code snippets
  const tailwindSnippet = useMemo(
    () => generateTailwindConfigSnippet(activeTheme, activeRadius, activeGlass),
    [activeTheme, activeRadius, activeGlass]
  );
  const cssSnippet = useMemo(
    () => generateCssVariablesSnippet(activeTheme, activeRadius, activeGlass),
    [activeTheme, activeRadius, activeGlass]
  );

  const activeSnippet = codeTab === "tailwind" ? tailwindSnippet : cssSnippet;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(10); } catch {}
      }
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2400);
    } catch {
      // fallback
    }
  };

  const whatsAppMessage = isEs
    ? `Hola Mario, estuve probando el Estudio de Tokens de Diseño en tu web con la paleta "${activeTheme.name.es}" (${activeTheme.accentColor}) y quiero desarrollar un sistema de diseño con esta estética para mi producto.`
    : `Hi Mario, I was testing your Design Token Studio with the "${activeTheme.name.en}" palette (${activeTheme.accentColor}) and want to build a design system with this aesthetic for my product.`;

  const whatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    whatsAppMessage
  )}`;

  return (
    <section
      id="estudio-tokens-diseno"
      className="relative isolate my-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#080a0f] p-6 backdrop-blur-2xl sm:p-10 lg:p-12 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Dynamic ambient halo based on chosen theme */}
      <motion.div
        aria-hidden="true"
        animate={{
          backgroundColor: activeTheme.glowColor,
        }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute -top-44 -right-44 h-[500px] w-[500px] rounded-full blur-[140px]"
      />

      {/* Header */}
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-mono text-foreground/80">
          <Palette className="h-3.5 w-3.5" style={{ color: activeTheme.accentColor }} />
          <span>
            {isEs
              ? "01.3 · ESTUDIO DE DESIGN TOKENS & ESTÉTICA"
              : "01.3 · DESIGN TOKEN & AESTHETIC STUDIO"}
          </span>
        </div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
          {isEs
            ? "Sintetizá la identidad visual de tu producto en tiempo real."
            : "Synthesize your product's visual identity in real time."}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
          {isEs
            ? "Explorá cómo la paleta cromática, el radio de curvatura y la refracción de vidrio transforman la experiencia antes de escribir una sola línea de código. Exportá la configuración lista para Tailwind CSS."
            : "Explore how color harmony, curvature physics, and glass refraction reshape the experience before writing a single line of code. Export production-ready Tailwind CSS configurations."}
        </p>
      </div>

      {/* Studio Workbench */}
      {/* min-w-0 en las columnas: el bloque de código no ensancha la grilla en el teléfono. */}
      <div className="relative z-10 mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start [&>*]:min-w-0">
        {/* Left Controls */}
        <div className="space-y-8">
          {/* Step 1: Color Themes */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground/80 flex items-center gap-2">
                <Palette className="h-4 w-4" style={{ color: activeTheme.accentColor }} />
                <span>{isEs ? "Paleta Cromática" : "Color Palette"}</span>
              </label>
              <span className="font-mono text-xs" style={{ color: activeTheme.accentColor }}>
                {activeTheme.tag[language]}
              </span>
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              {COLOR_THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <motion.button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedThemeId(theme.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-white/40 shadow-lg"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                    style={{
                      borderColor: isSelected ? theme.accentColor : undefined,
                      backgroundColor: isSelected ? `${theme.accentColor}12` : undefined,
                      boxShadow: isSelected ? `0 0 24px ${theme.glowColor}` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {theme.name[language]}
                      </span>
                      {/* Swatch dots */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.secondaryColor }}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-foreground/60 leading-relaxed">
                      {theme.description[language]}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Corner Radius */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-foreground/80 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-foreground/60" />
              <span>{isEs ? "Radio de Curvatura" : "Corner Curvature"}</span>
            </label>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
              {RADIUS_PRESETS.map((radius) => {
                const isSelected = selectedRadiusId === radius.id;
                return (
                  <button
                    key={radius.id}
                    type="button"
                    onClick={() => setSelectedRadiusId(radius.id)}
                    className={`rounded-xl border p-3.5 text-center transition-all ${
                      isSelected
                        ? "border-white/40 bg-white/10 font-semibold text-foreground"
                        : "border-white/10 bg-white/[0.02] text-foreground/70 hover:border-white/20"
                    }`}
                    style={{
                      borderColor: isSelected ? activeTheme.accentColor : undefined,
                      color: isSelected ? activeTheme.accentColor : undefined,
                    }}
                  >
                    <div className="text-xs font-mono">{radius.name[language]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Glassmorphism */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-foreground/80 flex items-center gap-2">
              <Layers className="h-4 w-4 text-foreground/60" />
              <span>{isEs ? "Refracción de Superficie" : "Surface Refraction"}</span>
            </label>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
              {GLASS_PRESETS.map((glass) => {
                const isSelected = selectedGlassId === glass.id;
                return (
                  <button
                    key={glass.id}
                    type="button"
                    onClick={() => setSelectedGlassId(glass.id)}
                    className={`rounded-xl border p-3.5 text-center transition-all ${
                      isSelected
                        ? "border-white/40 bg-white/10 font-semibold text-foreground"
                        : "border-white/10 bg-white/[0.02] text-foreground/70 hover:border-white/20"
                    }`}
                    style={{
                      borderColor: isSelected ? activeTheme.accentColor : undefined,
                      color: isSelected ? activeTheme.accentColor : undefined,
                    }}
                  >
                    <div className="text-xs font-mono">{glass.name[language]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Code Export Snippet */}
          <div className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCodeTab("tailwind")}
                  className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                    codeTab === "tailwind"
                      ? "bg-white/20 text-white font-semibold"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  tailwind.config.ts
                </button>
                <button
                  type="button"
                  onClick={() => setCodeTab("css")}
                  className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                    codeTab === "css"
                      ? "bg-white/20 text-white font-semibold"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  tokens.css
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-foreground/80 hover:border-white/30 hover:text-foreground transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      {isEs ? "Copiado" : "Copied"}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{isEs ? "Copiar" : "Copy"}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="mt-3 overflow-x-auto p-2 text-foreground/75 leading-relaxed">
              <code>{activeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Right: Live Interactive Card Canvas */}
        <div className="relative">
          <div className="font-mono text-xs uppercase tracking-wider text-foreground/50 mb-3 flex items-center justify-between">
            <span>{isEs ? "Vista de ejemplo · componente en vivo" : "Sample view · live component"}</span>
            <span style={{ color: activeTheme.accentColor }}>{activeTheme.name[language]}</span>
          </div>

          <motion.div
            layout
            className="relative overflow-hidden p-6 sm:p-8 transition-all duration-300 border shadow-2xl"
            style={{
              backgroundColor: activeTheme.surfaceColor,
              borderRadius: `${activeRadius.px}px`,
              borderColor: `rgba(255, 255, 255, ${activeGlass.borderOpacity})`,
              backdropFilter: `blur(${activeGlass.blurPx}px)`,
              boxShadow: `0 0 36px ${activeTheme.glowColor}`,
            }}
          >
            {/* Specular sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />

            {/* Mock Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center font-bold text-black"
                  style={{
                    backgroundColor: activeTheme.accentColor,
                    borderRadius: `${Math.max(4, activeRadius.px / 2)}px`,
                  }}
                >
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  {/* Contenido de la tarjeta de muestra: no es un encabezado de la página. */}
                  <p className="font-semibold text-foreground text-base">
                    Next.js 16 Edge Node
                  </p>
                  <p className="text-xs text-foreground/50 font-mono">
                    Production Cluster · v3.4.0
                  </p>
                </div>
              </div>

              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-semibold"
                style={{
                  backgroundColor: `${activeTheme.accentColor}20`,
                  color: activeTheme.accentColor,
                  borderRadius: `${Math.max(4, activeRadius.px / 2)}px`,
                  border: `1px solid ${activeTheme.accentColor}40`,
                }}
              >
                <CircleDot className="h-3 w-3 animate-pulse" />
                {isEs ? "Ejemplo" : "Sample"}
              </span>
            </div>

            {/* Mock Card Body */}
            <p className="mt-5 text-sm text-foreground/80 leading-relaxed">
              {isEs
                ? "Este componente se renderiza en tiempo real adaptando los tokens de borde, color de acento y física de refracción seleccionados en la consola izquierda."
                : "This component renders dynamically adapting the tokens for border radius, accent colors, and surface glass refraction chosen on the left workbench."}
            </p>

            {/* Mock Metrics Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div
                className="p-3.5 border border-white/5 bg-white/[0.03]"
                style={{ borderRadius: `${Math.max(6, activeRadius.px * 0.7)}px` }}
              >
                <div className="font-mono text-[10px] uppercase text-foreground/50">
                  {isEs ? "Radio" : "Radius"}
                </div>
                <div
                  className="mt-1 font-mono text-2xl font-bold"
                  style={{ color: activeTheme.accentColor }}
                >
                  {activeRadius.px}px
                </div>
              </div>

              <div
                className="p-3.5 border border-white/5 bg-white/[0.03]"
                style={{ borderRadius: `${Math.max(6, activeRadius.px * 0.7)}px` }}
              >
                <div className="font-mono text-[10px] uppercase text-foreground/50">
                  {isEs ? "Desenfoque" : "Blur"}
                </div>
                <div
                  className="mt-1 font-mono text-2xl font-bold"
                  style={{ color: activeTheme.secondaryColor }}
                >
                  {activeGlass.blurPx}px
                </div>
              </div>
            </div>

            {/* Mock Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="pressable px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: activeTheme.accentColor,
                  borderRadius: `${activeRadius.px}px`,
                  boxShadow: `0 0 20px ${activeTheme.glowColor}`,
                }}
              >
                {isEs ? "Iniciar Despliegue" : "Deploy Component"}
              </button>

              <button
                type="button"
                className="pressable px-5 py-3 text-sm font-medium text-foreground/80 border border-white/20 transition-colors hover:border-white/40 hover:text-foreground"
                style={{
                  borderRadius: `${activeRadius.px}px`,
                }}
              >
                {isEs ? "Ver Documentación" : "View Docs"}
              </button>
            </div>
          </motion.div>

          {/* WhatsApp Direct Action Bar */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-foreground/70 text-center sm:text-left">
              {isEs
                ? `¿Querés esta estética "${activeTheme.name.es}" en tu propio sistema?`
                : `Want this "${activeTheme.name.en}" design language on your system?`}
            </span>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable shrink-0 inline-flex items-center gap-2 rounded-xl bg-signal px-4 py-2.5 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              <span>{isEs ? "Consultar por WhatsApp" : "Inquire on WhatsApp"}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
