"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  TRANSFORMATION_CASES,
  type TransformationCase,
} from "@/data/transformationDiffData";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

export function TransformationDiffViewer() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Selected case
  const [selectedCaseId, setSelectedCaseId] = useState<string>("new-brothers");
  // Toggle: "before" | "after"
  const [activeMode, setActiveMode] = useState<"before" | "after">("after");

  const currentCase = useMemo<TransformationCase>(
    () =>
      TRANSFORMATION_CASES.find((c) => c.id === selectedCaseId) ??
      TRANSFORMATION_CASES[0],
    [selectedCaseId]
  );

  const isAfter = activeMode === "after";

  return (
    <div className="rounded-3xl border border-white/10 bg-card/70 p-6 sm:p-10 backdrop-blur-2xl shadow-3xl mb-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90">
      {/* Header del visualizador */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: currentCase.accentColor }}
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
              {isEs ? "Inspector de Transformación Operativa" : "Operational Transformation Inspector"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground mt-1">
            {isEs ? "El Antes vs. Después en Producción Real" : "Before vs. After in Production"}
          </h3>
        </div>

        {/* Toggle de Modo: Antes vs Después */}
        <div className="flex items-center p-1 rounded-2xl border border-white/12 bg-black/40 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveMode("before")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              !isAfter
                ? "bg-destructive/20 text-destructive border border-destructive/40 shadow-md font-semibold"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {isEs ? "🛑 Antes (Fricción)" : "🛑 Before (Friction)"}
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("after")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              isAfter
                ? "bg-signal/20 text-signal border border-signal/40 shadow-[0_0_15px_rgba(113,243,162,0.2)] font-semibold"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {isEs ? "⚡ Después (Sistema Mario Morera)" : "⚡ After (Mario Morera Stack)"}
          </button>
        </div>
      </div>

      {/* Selector de Casos */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {TRANSFORMATION_CASES.map((item) => {
          const isSelected = selectedCaseId === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setSelectedCaseId(item.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-xl px-4 py-2.5 text-xs font-mono transition-all ${
                isSelected
                  ? "border text-foreground shadow-md font-semibold bg-white/10"
                  : "border border-white/8 bg-white/[0.02] text-foreground/60 hover:border-white/20 hover:text-foreground"
              }`}
              style={{
                borderColor: isSelected ? item.accentColor : undefined,
                boxShadow: isSelected ? `0 0 15px ${item.accentColor}25` : undefined,
              }}
            >
              <span>{item.clientName}</span>
              <span className="block text-[10px] text-foreground/45 mt-0.5">
                {item.industry[language]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ─── TARJETA DINÁMICA DE ESTADO (ANTES / DESPUÉS) ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCaseId}-${activeMode}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-8 rounded-2xl border p-6 sm:p-8 backdrop-blur-md"
          style={{
            borderColor: isAfter ? `${currentCase.accentColor}40` : "rgba(255,85,85,0.3)",
            backgroundColor: isAfter ? `${currentCase.accentColor}08` : "rgba(255,85,85,0.04)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span
              className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                isAfter
                  ? "bg-signal/15 text-signal border border-signal/30"
                  : "bg-destructive/15 text-destructive border border-destructive/30"
              }`}
            >
              {isAfter
                ? isEs
                  ? "Sistema Implementado & En Vivo"
                  : "Live Implemented System"
                : isEs
                ? "Problema & Cuello de Botella Previo"
                : "Previous Bottleneck"}
            </span>

            {/* Latencia & Conversión */}
            <div className="flex items-center gap-4 text-xs font-mono text-foreground/70">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {isAfter
                    ? currentCase.afterState.responseLatency
                    : currentCase.beforeState.responseLatency}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-signal" />
                <span>
                  {isAfter
                    ? currentCase.afterState.conversionRate
                    : currentCase.beforeState.conversionRate}
                </span>
              </span>
            </div>
          </div>

          <h4 className="mt-4 text-lg sm:text-2xl font-medium tracking-tight text-foreground">
            {isAfter
              ? currentCase.afterState.title[language]
              : currentCase.beforeState.title[language]}
          </h4>

          {/* Lista de Puntos */}
          <ul className="mt-6 space-y-3">
            {isAfter
              ? currentCase.afterState.systemHighlights.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/85">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-signal mt-0.5" />
                    <span>{pt[language]}</span>
                  </li>
                ))
              : currentCase.beforeState.frictionPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/85">
                    <XCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                    <span>{pt[language]}</span>
                  </li>
                ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      {/* ─── DELTAS DE MÉTRICAS VERIFICADAS ─── */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentCase.metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono flex flex-col justify-between"
          >
            <span className="text-foreground/50 text-[10px] uppercase tracking-wider block">
              {m.label[language]}
            </span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-sm text-foreground/50 line-through">
                {m.before}
              </span>
              <span className="text-xl font-bold text-signal">
                {m.after}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-foreground/40">{isEs ? "Impacto:" : "Delta:"}</span>
              <span className="text-signal font-semibold">{m.improvement}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con link directo al proyecto en vivo */}
      <div className="mt-6 pt-6 border-t border-white/8 flex items-center justify-between text-xs">
        <span className="text-foreground/50">
          {isEs ? "Proyecto operando hoy en producción" : "Project live in production today"}
        </span>
        <a
          href={currentCase.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-signal hover:underline"
        >
          <span>{isEs ? "Abrir sitio web en vivo" : "Open live website"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
