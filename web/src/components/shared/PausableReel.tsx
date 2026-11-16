"use client";

import { useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { CaseReel } from "@/components/shared/CaseReel";
import type { CaseReelSources } from "@/data/caseMedia";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Un film que se reproduce solo mientras se ve, sin sonido, con un botón para
 * pausarlo (todo lo que se mueve más de cinco segundos se tiene que poder
 * frenar). Con movimiento reducido queda en su póster y el botón no aparece.
 */
export function PausableReel({
  reel,
  alt = "",
  language,
  className,
  style,
  priority = false,
  sizes,
}: {
  reel: CaseReelSources;
  alt?: string;
  language: "es" | "en";
  /** La caja: tamaño, proporción, borde y esquinas. */
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  sizes?: string;
}) {
  const isEs = language === "es";
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useReducedMotionSafe() === true;
  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      <CaseReel reel={reel} alt={alt} playing={playing} priority={priority} sizes={sizes} className="absolute inset-0 h-full w-full" />
      {!reducedMotion && (
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-pressed={!playing}
          className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-4 sm:right-4"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          <span className="sr-only">{playing ? (isEs ? "Pausar el video" : "Pause the video") : isEs ? "Reproducir el video" : "Play the video"}</span>
        </button>
      )}
    </div>
  );
}
