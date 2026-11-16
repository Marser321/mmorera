"use client";

import { PausableReel } from "@/components/shared/PausableReel";
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
  return (
    <section aria-labelledby="case-trailer" className="mx-auto mt-12 max-w-[1480px] px-5 sm:mt-16 sm:px-8 lg:px-12">
      <h2 id="case-trailer" className="sr-only">
        {isEs ? `Tráiler de ${name}` : `${name} trailer`}
      </h2>
      <figure>
        <PausableReel reel={trailer} alt={trailer.caption[language]} language={language} priority sizes="(min-width: 1480px) 1384px, 100vw" className="aspect-video w-full rounded-[1.5rem] border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]" />
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
