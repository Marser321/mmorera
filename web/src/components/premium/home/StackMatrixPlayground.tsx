"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  STACK_LAYERS,
  calculateStackFriction,
  type StackToolOption,
} from "@/data/stackMatrixData";
import {
  Sparkles,
  Layers,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Zap,
  RotateCcw,
} from "lucide-react";

export function StackMatrixPlayground() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Selected tool IDs per layer
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>({
    web: "nextjs",
    messaging: "whatsapp-ai",
    crm: "ghl",
    billing: "stripe-auto",
  });

  const frictionReport = useMemo(
    () => calculateStackFriction(selectedTools),
    [selectedTools]
  );

  const isOptimal = frictionReport.rating === "optimal";

  const handleSelectTool = (layerId: string, toolId: string) => {
    setSelectedTools((prev) => ({
      ...prev,
      [layerId]: toolId,
    }));
  };

  const handleApplyOptimal = () => {
    setSelectedTools({
      web: "nextjs",
      messaging: "whatsapp-ai",
      crm: "ghl",
      billing: "stripe-auto",
    });
  };

  const whatsappPrefilledUrl = useMemo(() => {
    const allTools = STACK_LAYERS.flatMap((l) => l.options);
    const toolNames = Object.values(selectedTools)
      .map((id) => allTools.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const text = isEs
      ? `Hola Mario, configuré mi ecosistema en el visualizador de tu web con: [${toolNames}]. Quiero evaluar cómo unificar esta arquitectura para mi empresa.`
      : `Hi Mario, I configured my stack on your interactive matrix: [${toolNames}]. I'd like to evaluate unifying this architecture for our business.`;

    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [selectedTools, isEs]);

  return (
    <section
      id="matriz-stack"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Luz reactiva ambiental */}
      <motion.div
        animate={{
          background: isOptimal
            ? "radial-gradient(ellipse at 50% 25%, rgba(113,243,162,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 25%, rgba(245,158,11,0.12) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500 ${
                isOptimal ? "bg-signal text-signal" : "bg-amber-400 text-amber-400"
              }`}
            />
            <p
              className={`font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
                isOptimal ? "text-signal" : "text-amber-400"
              }`}
            >
              {isEs ? "Visualizador de Ecosistemas · Matriz de Conectores" : "Ecosystem Visualizer · Connector Mesh"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Configurá tus herramientas. Mirá dónde se corta la corriente."
                : "Select your tool stack. Watch where the flow breaks."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Un negocio no se traba por falta de esfuerzo, sino por fricción entre islas de software. Marcá las herramientas que usás hoy y el analizador calculará el índice de fricción de tu operación."
              : "Companies rarely stall from lack of effort; they choke on friction between software silos. Tap the tools you run today and see your operation's real friction score."}
          </Reveal>
        </div>

        {/* ─── BOTÓN RÁPIDO DE OPTIMIZACIÓN ─── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-signal" />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {isEs ? "Probar arquitectura recomendada de Mario Morera:" : "Test Mario Morera's recommended architecture:"}
            </span>
          </div>
          <motion.button
            type="button"
            onClick={handleApplyOptimal}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full border border-signal/40 bg-signal/15 px-4 py-2 text-xs font-semibold text-signal hover:bg-signal/25 shadow-[0_0_15px_rgba(113,243,162,0.2)] transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isEs ? "Aplicar Circuito Óptimo" : "Apply Optimal Circuit"}</span>
          </motion.button>
        </div>

        {/* ─── 4 CAPAS DEL ECOSISTEMA (GRID INTERACTIVO) ─── */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STACK_LAYERS.map((layer) => {
            const currentSelectedToolId = selectedTools[layer.id];

            return (
              <div
                key={layer.id}
                className="rounded-3xl border border-white/10 bg-card/70 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
                    <span className="font-mono text-xs font-semibold text-signal">
                      CAPA {layer.layerNumber}
                    </span>
                    <span className="font-mono text-[10px] text-foreground/45 uppercase tracking-wider">
                      {layer.id.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground tracking-tight">
                    {layer.title[language]}
                  </h3>

                  {/* Opciones de la Capa */}
                  <div className="mt-4 space-y-2.5">
                    {layer.options.map((tool) => {
                      const isSelected = currentSelectedToolId === tool.id;

                      return (
                        <motion.button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(layer.id, tool.id)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left rounded-2xl border p-3.5 transition-all ${
                            isSelected
                              ? tool.isRecommended
                                ? "border-signal/60 bg-signal/15 text-foreground shadow-[0_0_18px_rgba(113,243,162,0.18)]"
                                : "border-amber-400/60 bg-amber-400/10 text-foreground shadow-[0_0_18px_rgba(245,158,11,0.15)]"
                              : "border-white/8 bg-white/[0.02] text-foreground/70 hover:border-white/20 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-tight">
                              {tool.name}
                            </span>
                            {isSelected && (
                              <span
                                className={`flex h-2 w-2 rounded-full ${
                                  tool.isRecommended ? "bg-signal" : "bg-amber-400"
                                }`}
                              />
                            )}
                          </div>
                          <p className="mt-1 text-[11px] leading-snug text-foreground/55 font-light">
                            {tool.notes[language]}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── TELEMETRÍA DEL CIRCUITO Y REPORTE DE FRICCIÓN ─── */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-card/75 p-6 sm:p-8 backdrop-blur-2xl shadow-3xl light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90">
          <div className="grid gap-6 lg:grid-cols-12 items-center">
            {/* Índice de Fricción */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                {isEs ? "Diagnóstico de Fricción Operativa" : "Operational Friction Diagnostic"}
              </span>
              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${
                    isOptimal ? "text-signal" : "text-amber-400"
                  }`}
                >
                  {frictionReport.frictionPercentage}%
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground">
                  {frictionReport.label[language]}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-foreground/65 leading-relaxed">
                {isOptimal
                  ? isEs
                    ? "Tus herramientas se comunican por webhooks automáticos. Cero carga manual de datos y respuesta instantánea al cliente."
                    : "Your software stack talks via instant webhooks. Zero manual spreadsheets and instantaneous lead qualification."
                  : isEs
                  ? "Existen cuellos de botella manuales. Tu equipo pierde tiempo pasando datos de un lado a otro y los clientes se enfrían esperando respuesta."
                  : "Manual bottlenecks detected. Your team burns hours copy-pasting data across apps while leads go cold waiting for replies."}
              </p>
            </div>

            {/* Métricas clave comparadas */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-5 lg:pt-0 lg:pl-8 light:border-[rgb(var(--ink-rgb)/0.1)]">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono">
                <span className="text-foreground/50 block text-[10px] uppercase">
                  {isEs ? "Respuesta Inicial" : "Initial Reply"}
                </span>
                <span
                  className={`mt-1.5 block text-lg font-bold ${
                    isOptimal ? "text-signal" : "text-amber-400"
                  }`}
                >
                  {isOptimal ? "< 30 seg" : "> 4 horas"}
                </span>
                <span className="text-[10px] text-foreground/40 mt-1 block">
                  {isOptimal ? "24/7 con IA" : "Depende de horario"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono">
                <span className="text-foreground/50 block text-[10px] uppercase">
                  {isEs ? "Trazabilidad" : "Traceability"}
                </span>
                <span
                  className={`mt-1.5 block text-lg font-bold ${
                    isOptimal ? "text-cyan-400" : "text-red-400"
                  }`}
                >
                  {isOptimal ? "100% Unificada" : "Fragmentada"}
                </span>
                <span className="text-[10px] text-foreground/40 mt-1 block">
                  {isOptimal ? "CRM Central" : "En chat privado"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono col-span-2 sm:col-span-1">
                <span className="text-foreground/50 block text-[10px] uppercase">
                  {isEs ? "Cobros & Accesos" : "Billing & Access"}
                </span>
                <span
                  className={`mt-1.5 block text-lg font-bold ${
                    isOptimal ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {isOptimal ? "Inmediato" : "Manual"}
                </span>
                <span className="text-[10px] text-foreground/40 mt-1 block">
                  {isOptimal ? "Webhook Stripe" : "Comprobante foto"}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Contextual */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <h4 className="text-sm sm:text-base font-semibold text-foreground">
                {isEs
                  ? "¿Querés unificar este circuito sin meses de desarrollo?"
                  : "Want to unify this architecture without months of custom dev?"}
              </h4>
              <p className="mt-0.5 text-xs text-foreground/60">
                {isEs
                  ? "Diseñamos la integración de tus herramientas actuales en un sprint de 1 a 3 semanas."
                  : "We connect and automate your current tool stack in a 1 to 3 week sprint."}
              </p>
            </div>

            <motion.a
              href={whatsappPrefilledUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-xs sm:text-sm font-bold text-neutral-950 shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all hover:bg-[#22c35e]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{isEs ? "Consultar esta arquitectura" : "Discuss this architecture"}</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
