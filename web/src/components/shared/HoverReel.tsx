"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { CaseReel } from "@/components/shared/CaseReel";
import type { CaseReelSources } from "@/data/caseMedia";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Un reel que descansa en su póster y se reproduce al pasar el mouse o al
 * tocarlo. Para grillas con varios reels: así nunca corren todos a la vez.
 * Con movimiento reducido queda en el póster, sin botón.
 */
export function HoverReel({
  reel,
  name,
  language,
  className,
  sizes,
}: {
  reel: CaseReelSources;
  /** De qué es el reel, para el nombre del botón. */
  name: string;
  language: "es" | "en";
  /** La caja: proporción, borde y esquinas. */
  className?: string;
  sizes?: string;
}) {
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotionSafe() === true;
  const isEs = language === "es";
  if (reducedMotion) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <CaseReel reel={reel} alt="" playing={false} restartOnPlay className="absolute inset-0 h-full w-full" sizes={sizes} />
      </div>
    );
  }
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${active ? (isEs ? "Pausar el reel de" : "Pause the reel for") : isEs ? "Reproducir el reel de" : "Play the reel for"} ${name}`}
      onClick={() => setActive((value) => !value)}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setActive(false); }}
      className={cn("relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", className)}
    >
      <CaseReel reel={reel} alt="" playing={active} restartOnPlay className="absolute inset-0 h-full w-full" sizes={sizes} />
      <span aria-hidden="true" className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white">
        {active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
