"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { CaseReel } from "@/components/shared/CaseReel";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import type { CaseTrailer as CaseTrailerData } from "@/types/site";

/** 27 → "0:27", como en un reproductor. */
const runtime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

/**
 * El tráiler de un caso, a todo el ancho y antes de la ficha: se reproduce
 * solo mientras se ve, sin sonido, y se puede pausar. Con movimiento reducido
 * queda en su póster.
 */
export function CaseTrailer({ trailer, name, language }: { trailer: CaseTrailerData; name: string; language: "es" | "en" }) {
  const isEs = language === "es";
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useReducedMotionSafe() === true;
  return (
    <section aria-labelledby="case-trailer" className="mx-auto mt-12 max-w-[1480px] px-5 sm:mt-16 sm:px-8 lg:px-12">
      <h2 id="case-trailer" className="sr-only">
        {isEs ? `Tráiler de ${name}` : `${name} trailer`}
      </h2>
      <figure>
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
          <CaseReel reel={trailer} alt={trailer.caption[language]} playing={playing} priority sizes="(min-width: 1480px) 1384px, 100vw" className="aspect-video w-full" />
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-pressed={!playing}
              className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-4 sm:right-4"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              <span className="sr-only">{playing ? (isEs ? "Pausar el tráiler" : "Pause the trailer") : isEs ? "Reproducir el tráiler" : "Play the trailer"}</span>
            </button>
          )}
        </div>
        <figcaption className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-5">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[.16em] text-foreground/55 light:text-muted-foreground">
            {isEs ? "Tráiler" : "Trailer"} · {runtime(trailer.seconds)}
          </span>
          <span className="max-w-3xl text-sm leading-6 text-foreground/60 light:text-muted-foreground">{trailer.caption[language]}</span>
        </figcaption>
      </figure>
    </section>
  );
}
