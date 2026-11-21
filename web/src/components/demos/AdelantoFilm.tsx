"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * El film de la página: corre mudo y en bucle mientras está a la vista, y se puede pausar.
 * «Ver con sonido» lo reinicia con narrador y música (el navegador sólo deja sonar después de un toque).
 * Con movimiento reducido arranca en pausa sobre su póster.
 */
export function AdelantoFilm({ mp4, poster, rotulo, conSonido = false }: { mp4: string; poster: string; rotulo: string; conSonido?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [pausado, setPausado] = useState(false);
  const [aLaVista, setALaVista] = useState(false);
  const [suena, setSuena] = useState(false);
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
    // Con sonido lo pidió la persona: corre aunque el navegador crea que no está a la vista.
    if (suena ? !pausado : aLaVista && !pausado && !reducido) void v.play().catch(() => {});
    else v.pause();
  }, [aLaVista, pausado, reducido, suena]);

  const alternarSonido = () => {
    const v = ref.current;
    if (!v) return;
    const ahora = !suena;
    v.muted = !ahora;
    v.loop = !ahora;
    if (ahora) v.currentTime = 0;
    // Con sonido, el navegador exige que la reproducción salga del mismo toque.
    void v.play().catch(() => {});
    setSuena(ahora);
    setPausado(false);
  };

  return (
    <figure className="relative">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.6rem] border border-foreground/15 bg-[#0B0B0A]">
        <video
          ref={ref}
          src={mp4}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={rotulo}
          onEnded={() => { const v = ref.current; if (v) { v.muted = true; v.loop = true; void v.play().catch(() => {}); } setSuena(false); }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
          {conSonido && (
            <button
              type="button"
              onClick={alternarSonido}
              aria-pressed={suena}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 text-sm font-medium text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {suena ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
              {suena ? "Silenciar" : "Ver con sonido"}
            </button>
          )}
          {(!reducido || suena) && (
            <button
              type="button"
              onClick={() => setPausado(p => !p)}
              aria-pressed={pausado}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {pausado ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
              <span className="sr-only">{pausado ? "Reproducir el film" : "Pausar el film"}</span>
            </button>
          )}
        </div>
      </div>
      <figcaption className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-foreground/65">
        <span aria-hidden="true" className="tono-fondo h-px w-8 shrink-0" />
        {rotulo}
      </figcaption>
    </figure>
  );
}
