"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { CaseReel } from "@/components/shared/CaseReel";
import { localePath } from "@/config/site";
import type { HeroStagePair } from "@/data/heroStage";
import { particleStage, STAGE_OUTSET_PX } from "@/lib/particleStage";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * El escenario del hero: una ventana chica que muestra en qué se convierte la
 * tecnología que acaban de dibujar las partículas. No decide qué se ve ni
 * cuándo cambia (eso lo lleva el hero, que también enciende el servicio en la
 * lista): muestra el film del par activo y le dice al campo de partículas dónde
 * está y de qué color es, para que el logo se transforme en su marco.
 *
 * `framed`: en pantalla ancha la ventana aparece solo en el paso del film y
 * las partículas la enmarcan. En pantalla angosta queda siempre a la vista,
 * debajo del texto, sin marco.
 */
export function HeroStage({
  pair,
  visible,
  framed,
  playing,
  onTogglePlaying,
  language,
}: {
  pair: HeroStagePair;
  visible: boolean;
  framed: boolean;
  playing: boolean;
  onTogglePlaying: () => void;
  language: "es" | "en";
}) {
  const isEs = language === "es";
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionSafe();
  const withFrame = framed && visible && !reducedMotion;

  // Le cuenta a las partículas dónde está la ventana, cuadro a cuadro: se mueve con el scroll.
  useEffect(() => {
    if (!withFrame) return;
    let frame = 0;
    const measure = () => {
      const element = frameRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        particleStage.set({
          active: true,
          cx: ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1,
          cy: 1 - ((rect.top + rect.height / 2) / window.innerHeight) * 2,
          scale: (rect.width + STAGE_OUTSET_PX * 2) / window.innerHeight / 0.48,
        });
      }
      frame = window.requestAnimationFrame(measure);
    };
    particleStage.set({ tint: pair.tone });
    frame = window.requestAnimationFrame(measure);
    return () => {
      window.cancelAnimationFrame(frame);
      particleStage.reset();
    };
  }, [pair.tone, withFrame]);

  const tone = pair.tone;
  const reel = pair.reel[language];

  return (
    <div
      data-hero-stage
      data-stage-pair={pair.id}
      data-stage-visible={visible}
      aria-hidden={!visible}
      // Al abrirse espera a que las partículas armen el marco; al cerrarse se va antes de que se suelten.
      className={`relative transition-[opacity,transform] ease-out ${visible ? "opacity-100 delay-700 duration-700" : "pointer-events-none scale-[0.97] opacity-0 duration-300"}`}
    >
      <p className="mb-3 flex flex-wrap items-baseline gap-x-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/60 sm:text-[11px] lg:mb-8 lg:justify-center">
        <span style={{ color: tone }}>{pair.tech}</span>
        <span aria-hidden="true">→</span>
        <span>{pair.becomes[language]}</span>
      </p>
      <div
        ref={frameRef}
        className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-[#0B0B0A]"
        style={{ boxShadow: `0 0 0 1px ${tone}55, 0 36px 110px -48px ${tone}` }}
      >
        {/* Solo el film del par activo está montado. La clave lo vuelve a arrancar desde el principio. */}
        <CaseReel key={pair.id} reel={reel} alt="" playing={visible && playing} restartOnPlay sizes="(max-width: 1024px) 100vw, 36vw" className="absolute inset-0 h-full w-full" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-4">
          <Link
            href={localePath(language, pair.href)}
            tabIndex={visible ? undefined : -1}
            className="inline-flex min-h-11 min-w-0 items-center gap-1.5 text-sm text-[#ECE7DD] underline decoration-white/25 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span className="truncate">{pair.source[language]}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </Link>
          {!reducedMotion && (
            <button
              type="button"
              onClick={onTogglePlaying}
              aria-pressed={!playing}
              tabIndex={visible ? undefined : -1}
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
