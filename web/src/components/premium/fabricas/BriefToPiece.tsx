"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import type { BriefToPieceItem, BriefToPieceStageId, BriefToPieceWho } from "@/types/briefToPiece";

const copy = {
  es: {
    stages: { brief: "Brief", guion: "Guion", arte: "Arte", revision: "Revisión humana", final: "Pieza final" },
    who: { ia: "IA", persona: "Persona", herramienta: "Herramienta" },
    previous: "Anterior", next: "Siguiente",
  },
  en: {
    stages: { brief: "Brief", guion: "Script", arte: "Art", revision: "Human review", final: "Final piece" },
    who: { ia: "AI", persona: "Person", herramienta: "Tool" },
    previous: "Previous", next: "Next",
  },
} satisfies Record<"es" | "en", { stages: Record<BriefToPieceStageId, string>; who: Record<BriefToPieceWho, string>; previous: string; next: string }>;

export interface BriefToPieceProps {
  pieces: BriefToPieceItem[];
  language: "es" | "en";
  label?: string;
  demo?: boolean;
}

/** Comparar etapas no necesita una transición: cada cambio es inmediato en ambos modos. */
export function BriefToPiece({ pieces, language, label, demo = false }: BriefToPieceProps) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const pieceTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const c = copy[language];
  const currentPieceIndex = Math.min(pieceIndex, Math.max(0, pieces.length - 1));
  const piece = pieces[currentPieceIndex];
  const currentStageIndex = Math.min(stageIndex, Math.max(0, (piece?.stages.length ?? 0) - 1));
  const stage = piece?.stages[currentStageIndex];
  if (!piece || !stage) return null;
  const titleId = `${id}-title`;
  const piecePanelId = `${id}-piece-panel`;
  const stagePanelId = `${id}-stage-panel`;

  function selectPiece(index: number, focus = false) {
    setPieceIndex(index);
    setStageIndex(0);
    if (focus) pieceTabs.current[index]?.focus();
  }
  function selectStage(index: number, focus = false) {
    const next = Math.max(0, Math.min(index, piece.stages.length - 1));
    setStageIndex(next);
    if (focus) stageTabs.current[next]?.focus();
  }
  function step(delta: number) {
    const next = currentStageIndex + delta;
    selectStage(next, next === 0 || next === piece.stages.length - 1);
  }
  function navigateStages(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    selectStage(event.key === "Home" ? 0 : event.key === "End" ? piece.stages.length - 1 : currentStageIndex + (event.key === "ArrowRight" ? 1 : -1), true);
  }

  return <section data-brief-to-piece aria-labelledby={titleId} className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
    <div className="flex flex-wrap items-center gap-3">
      <h3 id={titleId} className="text-2xl font-medium leading-tight text-foreground">{piece.title[language]}</h3>
      {demo && <span className="rounded border border-signal/40 px-2 py-1 text-xs font-semibold text-signal">Demo</span>}
    </div>
    {pieces.length > 1 && <div role="tablist" aria-label={label} aria-labelledby={label ? undefined : titleId} className="mt-5 flex flex-wrap gap-2" onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? pieces.length - 1 : (currentPieceIndex + (event.key === "ArrowRight" ? 1 : -1) + pieces.length) % pieces.length;
      selectPiece(next, true);
    }}>
      {pieces.map((item, index) => <button key={item.slug} ref={node => { pieceTabs.current[index] = node; }} id={`${id}-piece-${index}`} type="button" role="tab" aria-selected={index === currentPieceIndex} aria-controls={piecePanelId} tabIndex={index === currentPieceIndex ? 0 : -1} onClick={() => selectPiece(index)} className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${index === currentPieceIndex ? "border-signal/50 bg-signal/10 text-signal" : "border-foreground/20 text-foreground/80 hover:border-foreground/50"}`}>{item.title[language]}</button>)}
    </div>}

    <div id={piecePanelId} role={pieces.length > 1 ? "tabpanel" : undefined} aria-labelledby={pieces.length > 1 ? `${id}-piece-${currentPieceIndex}` : titleId} className="mt-6">
      <div role="tablist" aria-label={Object.values(c.stages).join(" · ")} className="flex flex-wrap gap-2" onKeyDown={navigateStages}>
        {piece.stages.map((item, index) => <button key={item.stage} ref={node => { stageTabs.current[index] = node; }} id={`${id}-stage-${index}`} type="button" role="tab" aria-selected={index === currentStageIndex} aria-controls={stagePanelId} tabIndex={index === currentStageIndex ? 0 : -1} onClick={() => selectStage(index)} className={`min-h-11 rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${index === currentStageIndex ? "border-signal text-signal" : "border-foreground/20 text-foreground/75 hover:text-foreground"}`}>{c.stages[item.stage]}</button>)}
      </div>
      <div id={stagePanelId} role="tabpanel" aria-labelledby={`${id}-stage-${currentStageIndex}`} data-stage={stage.stage} className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-foreground/15 bg-background">
          <Image src={stage.image.src} alt={stage.image.alt[language]} fill sizes="(min-width: 1024px) 58vw, 100vw" unoptimized={stage.image.src.startsWith("data:")} className="object-contain" />
        </div>
        <div>
          <span className="inline-flex rounded border border-foreground/25 px-2 py-1 text-xs font-semibold text-foreground/80">{c.who[stage.who]}</span>
          <h4 className="mt-4 text-xl font-medium text-foreground">{stage.label[language]}</h4>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-foreground/75 sm:text-base">{stage.summary[language]}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" disabled={currentStageIndex === 0} onClick={() => step(-1)} className="min-h-12 rounded-xl border border-foreground/25 px-5 py-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40">{c.previous}</button>
            <button type="button" disabled={currentStageIndex === piece.stages.length - 1} onClick={() => step(1)} className="min-h-12 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40">{c.next}</button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
