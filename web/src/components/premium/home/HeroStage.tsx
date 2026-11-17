"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { CaseReel } from "@/components/shared/CaseReel";
import { localePath } from "@/config/site";
import { HERO_STAGE_MS, HERO_STAGE_PAIRS, type HeroStagePair } from "@/data/heroStage";
import { particleStage, STAGE_OUTSET_PX } from "@/lib/particleStage";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const SIZES = "(max-width: 1024px) 100vw, 36vw";
/** Lo que tarda la ventana en aparecer del todo, una vez que empieza. */
const ENTER_MS = 750;
/** Lo que tarda la ventana en irse. Recién después cambia lo que muestra. */
const LEAVE_MS = 300;

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
  // Con marco, la ventana espera a que el logo se rompa y lo arme.
  const revealMs = framed && !reducedMotion ? HERO_STAGE_MS.reveal : 0;

  // Lo que muestra la ventana. Mientras se va sigue con el par que tenía (si no, en el
  // fundido se vería el siguiente); ya invisible pasa al próximo, que así llega cargado.
  const [shown, setShown] = useState(pair);
  if (visible && shown !== pair) setShown(pair);
  useEffect(() => {
    if (visible || shown === pair) return;
    const timer = window.setTimeout(() => setShown(pair), LEAVE_MS + 100);
    return () => window.clearTimeout(timer);
  }, [pair, shown, visible]);

  // El film arranca cuando la ventana empieza a verse: no se pierde el principio
  // ni llega a dar la vuelta antes de que cambie el par.
  const [rolling, setRolling] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setRolling(true), revealMs);
    return () => {
      window.clearTimeout(timer);
      setRolling(false);
    };
  }, [revealMs, visible]);

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
    frame = window.requestAnimationFrame(measure);
    return () => {
      window.cancelAnimationFrame(frame);
      particleStage.reset();
    };
  }, [withFrame]);

  // El marco toma el color del par. Si el par cambia con la ventana abierta
  // (alguien eligió otro servicio), el marco se queda y pasa de un color al otro.
  useEffect(() => {
    if (withFrame) particleStage.set({ tint: shown.tone });
  }, [shown.tone, withFrame]);

  const tone = shown.tone;
  const next = HERO_STAGE_PAIRS[(HERO_STAGE_PAIRS.indexOf(shown) + 1) % HERO_STAGE_PAIRS.length];

  return (
    <div
      data-hero-stage
      data-stage-pair={pair.id}
      data-stage-shown={shown.id}
      data-stage-visible={visible}
      aria-hidden={!visible}
      // Entra despacio, mientras las partículas terminan de cerrar el marco; se va rápido, antes de que el marco se suelte.
      // Los tiempos van en línea: con tailwindcss-animate, las clases duration-[…] y delay-[…] son ambiguas y no se generan.
      className={`relative transition-[opacity,transform] ${visible ? "opacity-100 ease-in-out" : "pointer-events-none scale-[0.97] opacity-0 ease-out"}`}
      style={{ transitionDuration: `${visible ? ENTER_MS : LEAVE_MS}ms`, transitionDelay: `${visible ? revealMs : 0}ms` }}
    >
      <p className="mb-3 flex flex-wrap items-baseline gap-x-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/60 sm:text-[11px] lg:mb-8 lg:justify-center">
        <span style={{ color: tone }}>{shown.tech}</span>
        <span aria-hidden="true">→</span>
        <span>{shown.becomes[language]}</span>
      </p>
      <div
        ref={frameRef}
        className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-[#0B0B0A] transition-shadow duration-500"
        style={{ boxShadow: `0 0 0 1px ${tone}55, 0 36px 110px -48px ${tone}` }}
      >
        {/* El póster del par que sigue se pide antes, para que el cambio no muestre la ventana vacía. */}
        {next !== shown && !reducedMotion && (
          <Image src={next.reel[language].poster} alt="" aria-hidden="true" fill sizes={SIZES} className="pointer-events-none object-cover object-top opacity-0" />
        )}
        {/* Solo el film del par que se ve está montado. La clave lo arranca desde el principio y lo hace entrar desde el negro. */}
        <div key={shown.id} className="stage-swap absolute inset-0">
          <CaseReel reel={shown.reel[language]} alt="" playing={rolling && playing} restartOnPlay sizes={SIZES} className="absolute inset-0 h-full w-full" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-4">
          <Link
            href={localePath(language, shown.href)}
            tabIndex={visible ? undefined : -1}
            className="inline-flex min-h-11 min-w-0 items-center gap-1.5 text-sm text-[#ECE7DD] underline decoration-white/25 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span className="truncate">{shown.source[language]}</span>
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
