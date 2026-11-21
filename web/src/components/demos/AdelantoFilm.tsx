"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * El lugar del film de lanzamiento. Mientras el film se produce, corre un
 * adelanto mudo hecho con las cuatro escenas; solo se reproduce a la vista y
 * se puede pausar. Con movimiento reducido queda en su póster.
 */
export function AdelantoFilm({ mp4, poster, rotulo }: { mp4: string; poster: string; rotulo: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [pausado, setPausado] = useState(false);
  const [aLaVista, setALaVista] = useState(false);
  const reducido = useReducedMotionSafe() === true;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (aLaVista && !pausado && !reducido) void v.play().catch(() => {});
    else v.pause();
  }, [aLaVista, pausado, reducido]);

  return (
    <figure className="relative">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] border border-foreground/15 bg-[#E9E6E0]">
        <video
          ref={ref}
          src={mp4}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={rotulo}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!reducido && (
          <button
            type="button"
            onClick={() => setPausado((p) => !p)}
            aria-pressed={pausado}
            className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-4 sm:right-4"
          >
            {pausado ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            <span className="sr-only">{pausado ? "Reproducir el adelanto" : "Pausar el adelanto"}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-foreground/65">
        <span aria-hidden="true" className="tono-fondo h-px w-8 shrink-0" />
        {rotulo}
      </figcaption>
    </figure>
  );
}
