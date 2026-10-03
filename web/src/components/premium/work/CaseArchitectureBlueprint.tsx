"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  getCaseTopology,
  type CaseTopologyBlueprint,
  type TopologyNode,
} from "@/data/caseTopologyData";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
} from "lucide-react";

interface CaseArchitectureBlueprintProps {
  projectSlug: string;
  projectTitle: string;
  accentColor?: string;
}

export function CaseArchitectureBlueprint({
  projectSlug,
  projectTitle,
  accentColor = "#71F3A2",
}: CaseArchitectureBlueprintProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  const topology: CaseTopologyBlueprint = useMemo(
    () => getCaseTopology(projectSlug, accentColor),
    [projectSlug, accentColor]
  );

  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedNode, setSimulatedNode] = useState<number | null>(null);
  const pulseTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      pulseTimersRef.current.forEach((t) => window.clearTimeout(t));
      pulseTimersRef.current = [];
    };
  }, []);

  const activeNode: TopologyNode = topology.nodes[activeNodeIndex] ?? topology.nodes[0];

  const handleSimulatePulse = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatedNode(0);
    setActiveNodeIndex(0);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }

    pulseTimersRef.current.forEach((t) => window.clearTimeout(t));
    pulseTimersRef.current = [];

    const stepInterval = 800; // ms per node

    pulseTimersRef.current.push(
      window.setTimeout(() => {
        setSimulatedNode(1);
        setActiveNodeIndex(1);
      }, stepInterval),
      window.setTimeout(() => {
        setSimulatedNode(2);
        setActiveNodeIndex(2);
      }, stepInterval * 2),
      window.setTimeout(() => {
        setSimulatedNode(3);
        setActiveNodeIndex(3);
      }, stepInterval * 3),
      window.setTimeout(() => {
        setIsSimulating(false);
        setSimulatedNode(null);
      }, stepInterval * 4)
    );
  };

  const whatsappPrefillUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve viendo la arquitectura del caso de estudio de ${projectTitle} en tu web. Me gustaría evaluar una solución con una topología similar para mi negocio.`
      : `Hi Mario, I was inspecting the system architecture blueprint for the ${projectTitle} case study on your site. I'd like to explore a similar topology for my business.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [projectTitle, isEs]);

  return (
    <section
      id="topologia-sistema"
      className="relative scroll-mt-24 border-t border-white/12 py-16 light:border-[rgb(var(--ink-rgb)/0.12)] overflow-hidden"
    >
      {/* Resplandor reactivo */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 20%, ${topology.accentColor}15 0%, transparent 60%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500"
              style={{ backgroundColor: topology.accentColor, color: topology.accentColor }}
            />
            <p
              className="font-mono text-[9px] uppercase tracking-[.18em]"
              style={{ color: topology.accentColor }}
            >
              05 · {isEs ? "Topología del Sistema & Flujo de Datos" : "System Topology & Live Data Flow"}
            </p>
          </div>
          <SplitReveal
            as="h3"
            text={topology.headline[language]}
            className="mt-3 text-2xl font-medium leading-tight tracking-[-.04em] text-foreground sm:text-4xl"
          />
          <Reveal as="p" className="mt-3 text-sm leading-relaxed text-foreground/60 sm:text-base">
            {isEs
              ? "Tocá cualquier nodo para inspeccionar los eventos bajo el capó o dispará un paquete de prueba para ver el recorrido de los datos en tiempo real."
              : "Tap any node to inspect under-the-hood data events or launch a test pulse to trace data movement in real time."}
          </Reveal>
        </div>

        {/* ─── 1. DIAGRAMA DE NODOS CONECTADOS ─── */}
        <div className="mt-8 rounded-3xl border border-white/14 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <span className="font-mono text-xs text-foreground/70 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-4 w-4 text-signal" />
              {isEs ? "Circuito de 4 Etapas Interconectadas" : "4-Stage Interconnected Circuit"}
            </span>

            {/* Botón Disparador de Pulso */}
            <button
              onClick={handleSimulatePulse}
              disabled={isSimulating}
              className="pressable inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
              style={{
                backgroundColor: topology.accentColor,
                boxShadow: `0 0 15px ${topology.accentColor}35`,
              }}
            >
              {isSimulating ? (
                <>
                  <Activity className="h-3.5 w-3.5 animate-spin" />
                  <span>{isEs ? "Transmitiendo paquete..." : "Streaming packet..."}</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>{isEs ? "Disparar Pulso de Prueba" : "Launch Test Pulse"}</span>
                </>
              )}
            </button>
          </div>

          {/* Nodos del diagrama */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topology.nodes.map((node, idx) => {
              const isSelected = idx === activeNodeIndex;
              const isPulseActive = simulatedNode === idx;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeIndex(idx)}
                  className={`group relative text-left rounded-2xl p-4 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                    isPulseActive
                      ? "ring-2 ring-white scale-[1.03] shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                      : isSelected
                      ? "border-white/30 bg-card/90 shadow-[0_8px_25px_rgba(0,0,0,0.5)] light:bg-card"
                      : "border-white/10 bg-card/30 hover:border-white/20 hover:bg-card/50 light:bg-card/20"
                  }`}
                  style={{
                    borderColor: isSelected || isPulseActive ? topology.accentColor : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-foreground/40">0{idx + 1}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-mono uppercase"
                      style={{
                        backgroundColor: isSelected ? `${topology.accentColor}25` : "rgba(255,255,255,0.06)",
                        color: isSelected ? topology.accentColor : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {node.metricHighlight}
                    </span>
                  </div>

                  <h4 className="mt-3 text-sm font-semibold text-foreground group-hover:text-foreground transition-colors line-clamp-2">
                    {node.name[language]}
                  </h4>

                  <span className="mt-2 block text-[10px] font-mono text-foreground/50 truncate">
                    {node.statusBadge[language]}
                  </span>

                  {isPulseActive && (
                    <motion.div
                      layoutId="pulse-indicator"
                      className="absolute -bottom-1 inset-x-4 h-1 rounded-full bg-white shadow-[0_0_12px_#ffffff]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── 2. INSPECTOR DETALLADO DEL NODO SELECCIONADO ─── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 rounded-2xl border border-white/10 bg-background/50 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: topology.accentColor }}
                  />
                  <span className="font-mono text-xs text-foreground/80 font-semibold">
                    {activeNode.name[language]}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-foreground/50">{isEs ? "Estado:" : "Status:"}</span>
                  <span className="text-signal font-semibold">{activeNode.statusBadge[language]}</span>
                </div>
              </div>

              <p className="text-sm text-foreground/70 leading-relaxed">
                {activeNode.payloadSummary[language]}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ─── 3. CTA DE CONVERSIÓN DIRECTA ─── */}
          <div className="mt-6 border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-foreground/50 font-mono">
              {isEs ? "Arquitectura a medida sin juniors · 21 días" : "Custom architecture with zero juniors · 21 days"}
            </span>

            <a
              href={whatsappPrefillUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-5 py-3 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
            >
              <span>{isEs ? "Consultar por un flujo similar" : "Inquire about a similar workflow"}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
