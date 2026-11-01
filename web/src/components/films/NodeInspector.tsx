"use client";

import { Play, X } from "lucide-react";
import type { FilmLanguage, FilmStage } from "@/data/films/filmTypes";

/**
 * Inspector de una etapa del flujo. Se abre al tocar un nodo (el film queda
 * en pausa) y muestra tecnología, tiempos de la muestra y el payload.
 */
export function NodeInspector({
  stage,
  index,
  total,
  language,
  example,
  onClose,
  onResume,
}: {
  stage: FilmStage;
  index: number;
  total: number;
  language: FilmLanguage;
  example: boolean;
  onClose: () => void;
  onResume: () => void;
}) {
  const isEs = language === "es";
  return (
    <div
      role="dialog"
      aria-label={isEs ? `Etapa ${index + 1}: ${stage.title.es}` : `Step ${index + 1}: ${stage.title.en}`}
      className="flex max-h-full flex-col rounded-[1.25rem] border border-white/12 bg-background/92 p-5 shadow-[0_24px_80px_rgb(0_0_0/0.35)] backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.12)] light:shadow-[0_24px_80px_rgb(var(--ink-rgb)/0.12)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-signal">
            {isEs ? "Etapa" : "Step"} {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-xl font-medium tracking-[-.03em] text-foreground">{stage.title[language]}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={isEs ? "Cerrar inspector" : "Close inspector"}
          className="rounded-full border border-white/12 p-2 text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.12)]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-[10px] uppercase tracking-[.12em]">
        <div className="col-span-2 rounded-xl border border-white/8 p-3 light:border-[rgb(var(--ink-rgb)/0.1)]">
          <dt className="text-foreground/55">{isEs ? "Tecnología" : "Technology"}</dt>
          <dd className="mt-1 normal-case tracking-normal text-foreground">{stage.technology}</dd>
        </div>
        {stage.latencyMs !== undefined ? (
          <div className="rounded-xl border border-white/8 p-3 light:border-[rgb(var(--ink-rgb)/0.1)]">
            <dt className="text-foreground/55">{isEs ? "Latencia" : "Latency"}</dt>
            <dd className="mt-1 text-signal">{stage.latencyMs} ms</dd>
          </div>
        ) : null}
        {stage.httpStatus !== undefined ? (
          <div className="rounded-xl border border-white/8 p-3 light:border-[rgb(var(--ink-rgb)/0.1)]">
            <dt className="text-foreground/55">HTTP</dt>
            <dd className="mt-1 text-signal">{stage.httpStatus}</dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-4 text-sm leading-6 text-foreground/70">{stage.summary[language]}</p>

      {stage.payload ? (
        <pre className="mt-4 min-h-0 flex-1 overflow-auto rounded-xl border border-white/8 bg-foreground/[.04] p-3 font-mono text-[10.5px] leading-relaxed text-foreground/80 light:border-[rgb(var(--ink-rgb)/0.1)]">
          <code>{JSON.stringify(stage.payload, null, 2)}</code>
        </pre>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-foreground/55">
          {example ? (isEs ? "Datos de muestra" : "Sample data") : (isEs ? "Caso real" : "Real case")}
        </span>
        <button
          type="button"
          onClick={onResume}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <Play className="h-3 w-3" />
          {isEs ? "Seguir el film" : "Resume film"}
        </button>
      </div>
    </div>
  );
}
