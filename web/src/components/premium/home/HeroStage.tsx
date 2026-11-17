"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { CaseReel } from "@/components/shared/CaseReel";
import { localePath } from "@/config/site";
import type { DoorFilm } from "@/data/doorFilms";
import { particleStage, STAGE_OUTSET_PX } from "@/lib/particleStage";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export interface StageItem {
  id: string;
  label: string;
  film: DoorFilm;
}

/** Desde este ancho la ventana va a la derecha del texto y las partículas arman su marco. */
const FRAME_QUERY = "(min-width: 1024px)";

/**
 * El escenario del hero: una ventana de cine con el trabajo real, un servicio
 * por vez. No decide qué se ve ni cuándo cambia (eso lo lleva el hero, que
 * también enciende el servicio en la lista): muestra el film del servicio
 * activo y le dice al campo de partículas dónde está y de qué color es, para
 * que arme su marco alrededor.
 */
export function HeroStage({
  items,
  activeId,
  open,
  playing,
  onTogglePlaying,
  language,
}: {
  items: StageItem[];
  activeId: string;
  /** La ventana se abre después de la obertura de partículas. */
  open: boolean;
  playing: boolean;
  onTogglePlaying: () => void;
  language: "es" | "en";
}) {
  const isEs = language === "es";
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionSafe();
  const active = items.find((item) => item.id === activeId) ?? items[0];

  // Le cuenta a las partículas dónde está la ventana, cuadro a cuadro: se mueve con el scroll.
  useEffect(() => {
    if (!open || reducedMotion) return;
    const media = window.matchMedia(FRAME_QUERY);
    let frame = 0;
    const measure = () => {
      const element = frameRef.current;
      if (element && media.matches) {
        const rect = element.getBoundingClientRect();
        const width = rect.width + STAGE_OUTSET_PX * 2;
        particleStage.set({
          active: true,
          cx: ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1,
          cy: 1 - ((rect.top + rect.height / 2) / window.innerHeight) * 2,
          scale: width / window.innerHeight / 0.48,
        });
      } else {
        particleStage.set({ active: false });
      }
      frame = window.requestAnimationFrame(measure);
    };
    frame = window.requestAnimationFrame(measure);
    return () => {
      window.cancelAnimationFrame(frame);
      particleStage.reset();
    };
  }, [open, reducedMotion]);

  // Cada cambio de servicio tiñe las partículas y las suelta un instante.
  useEffect(() => {
    if (!open || !active) return;
    particleStage.set({ tint: active.film.tone });
    particleStage.pulse();
  }, [active, open]);

  if (!active) return null;
  const tone = active.film.tone;

  return (
    <div
      data-hero-stage
      data-stage-active={active.id}
      className={`relative transition-[opacity,transform] duration-700 ease-out ${open ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <div
        ref={frameRef}
        className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#0B0B0A] transition-shadow duration-700"
        style={{ boxShadow: `0 0 0 1px ${tone}55, 0 40px 120px -50px ${tone}` }}
      >
        {/* Un film por servicio; solo el activo está montado. La clave lo vuelve a arrancar desde el principio. */}
        <CaseReel key={active.id} reel={active.film} alt="" playing={open && playing} restartOnPlay priority sizes="(max-width: 1024px) 100vw, 44vw" className="hero-stage-film absolute inset-0 h-full w-full" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: tone }}>{active.label}</p>
            {active.film.caseSlug ? (
              <Link
                href={localePath(language, `/casos-de-exito/${active.film.caseSlug}`)}
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm text-[#ECE7DD] underline decoration-white/25 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {active.film.source[language]}
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </Link>
            ) : (
              <p className="mt-1 flex min-h-11 items-center text-sm text-[#ECE7DD]/85">{active.film.source[language]}</p>
            )}
          </div>
          {!reducedMotion && (
            <button
              type="button"
              onClick={onTogglePlaying}
              aria-pressed={!playing}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              <span className="sr-only">{playing ? (isEs ? "Pausar el recorrido" : "Pause the tour") : isEs ? "Reanudar el recorrido" : "Resume the tour"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
