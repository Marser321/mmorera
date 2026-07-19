"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TrackId } from "@/types/site";

type RailTrack = {
  color: string;
  title: { es: string; en: string };
  statement: { es: string; en: string };
  tools: readonly string[];
};

interface TrackRailProps {
  language: "es" | "en";
  tracks: Record<TrackId, RailTrack>;
  activeTrack: TrackId;
  modeSelected: boolean;
  resolveAccent: (color: string) => string;
  onSelect: (track: TrackId) => void;
}

const TRACK_IDS: TrackId[] = ["create", "build", "scale"];

export function TrackRail({ language, tracks, activeTrack, modeSelected, resolveAccent, onSelect }: TrackRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<TrackId, HTMLButtonElement | null>>({ create: null, build: null, scale: null });
  const interactionRef = useRef(false);
  const draggedRef = useRef(false);
  const pointerRef = useRef<{ id: number; x: number; scrollLeft: number } | null>(null);
  const scrollTimerRef = useRef<number | null>(null);

  const closestTrack = useCallback((): TrackId => {
    const rail = railRef.current;
    if (!rail) return activeTrack;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    return TRACK_IDS.reduce((nearest, id) => {
      const card = cardRefs.current[id];
      const current = cardRefs.current[nearest];
      if (!card || !current) return nearest;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const currentCenter = current.offsetLeft + current.offsetWidth / 2;
      return Math.abs(cardCenter - center) < Math.abs(currentCenter - center) ? id : nearest;
    }, TRACK_IDS[0]);
  }, [activeTrack]);

  const scrollToTrack = useCallback((track: TrackId, userInitiated = false) => {
    if (userInitiated) interactionRef.current = true;
    cardRefs.current[track]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, []);

  useEffect(() => {
    if (!modeSelected) return;
    const frame = window.requestAnimationFrame(() => scrollToTrack(activeTrack));
    return () => window.cancelAnimationFrame(frame);
  }, [activeTrack, modeSelected, scrollToTrack]);

  useEffect(() => () => {
    if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
  }, []);

  const commitClosest = useCallback(() => {
    if (!interactionRef.current) return;
    const next = closestTrack();
    if (!modeSelected || next !== activeTrack) onSelect(next);
  }, [activeTrack, closestTrack, modeSelected, onSelect]);

  const onScroll = () => {
    if (!interactionRef.current) return;
    if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(commitClosest, 140);
  };

  const moveBy = (delta: number) => {
    const current = modeSelected ? TRACK_IDS.indexOf(activeTrack) : 0;
    const next = Math.max(0, Math.min(TRACK_IDS.length - 1, current + delta));
    interactionRef.current = true;
    onSelect(TRACK_IDS[next]);
    scrollToTrack(TRACK_IDS[next], true);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    interactionRef.current = true;
    if (event.pointerType === "touch") return;
    const rail = railRef.current;
    if (!rail || event.button !== 0) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX, scrollLeft: rail.scrollLeft };
    draggedRef.current = false;
    rail.setPointerCapture(event.pointerId);
    rail.dataset.dragging = "true";
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const pointer = pointerRef.current;
    if (!rail || !pointer || pointer.id !== event.pointerId) return;
    const delta = event.clientX - pointer.x;
    if (Math.abs(delta) > 4) draggedRef.current = true;
    rail.scrollLeft = pointer.scrollLeft - delta;
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || pointerRef.current?.id !== event.pointerId) return;
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    pointerRef.current = null;
    delete rail.dataset.dragging;
    if (draggedRef.current) {
      const next = closestTrack();
      onSelect(next);
      scrollToTrack(next, true);
      window.setTimeout(() => { draggedRef.current = false; }, 0);
    }
  };

  return (
    <div className="mt-10">
      <div className="mb-5 flex items-center justify-end gap-2">
        <button type="button" onClick={() => moveBy(-1)} aria-label={language === "es" ? "Modo anterior" : "Previous mode"} className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-foreground/62 transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)] light:hover:border-[rgb(var(--ink-rgb)/0.3)]">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => moveBy(1)} aria-label={language === "es" ? "Modo siguiente" : "Next mode"} className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-foreground/62 transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)] light:hover:border-[rgb(var(--ink-rgb)/0.3)]">
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={railRef}
        data-testid="track-rail"
        tabIndex={0}
        role="region"
        aria-label={language === "es" ? "Modos de trabajo" : "Ways of working"}
        onWheel={() => { interactionRef.current = true; }}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); moveBy(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); moveBy(-1); }
          if (event.key === "Home") { event.preventDefault(); onSelect(TRACK_IDS[0]); scrollToTrack(TRACK_IDS[0], true); }
          if (event.key === "End") { event.preventDefault(); onSelect(TRACK_IDS[2]); scrollToTrack(TRACK_IDS[2], true); }
        }}
        className="-mx-5 flex snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain px-[7vw] pb-5 pt-1 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:-mx-8 sm:gap-4 lg:-mx-12 lg:gap-6 lg:px-[calc((100vw-min(100vw,1480px))/2+3rem)] [&::-webkit-scrollbar]:hidden [&[data-dragging=true]]:cursor-grabbing [&[data-dragging=true]]:select-none"
      >
        {TRACK_IDS.map((track) => {
          const item = tracks[track];
          const active = modeSelected && activeTrack === track;
          const accent = resolveAccent(item.color);
          return (
            <button
              key={track}
              ref={(node) => { cardRefs.current[track] = node; }}
              type="button"
              aria-pressed={active}
              data-track={track}
              onClick={(event) => {
                if (draggedRef.current) { event.preventDefault(); return; }
                interactionRef.current = true;
                onSelect(track);
                scrollToTrack(track, true);
              }}
              style={{ "--track-accent": accent } as CSSProperties}
              className={`group relative min-h-[360px] w-[86vw] max-w-[920px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border p-7 text-left transition-[transform,opacity,background-color,border-color] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none sm:min-h-[420px] sm:p-10 lg:w-[72vw] ${active ? "scale-100 border-[var(--track-accent)]/50 bg-white/[.055] opacity-100 light:bg-[rgb(var(--ink-rgb)/0.055)]" : "scale-[.965] border-white/10 bg-white/[.018] opacity-60 hover:opacity-90 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-[rgb(var(--ink-rgb)/0.018)] motion-reduce:scale-100"}`}
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-left bg-[var(--track-accent)]" />
              <span className="font-mono text-[9px] uppercase tracking-[.17em] text-[var(--track-accent)]">{language === "es" ? "Modo" : "Mode"}</span>
              <div className="mt-20 sm:mt-28">
                <h3 className="text-[clamp(2.8rem,7vw,6.5rem)] font-medium leading-[.9] tracking-[-.06em] text-foreground">{item.title[language]}</h3>
                <p className="mt-6 max-w-2xl text-[clamp(1.2rem,2.4vw,2rem)] leading-[1.15] tracking-[-.025em] text-foreground/68">{item.statement[language]}</p>
                <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[.14em] text-foreground/34">{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
