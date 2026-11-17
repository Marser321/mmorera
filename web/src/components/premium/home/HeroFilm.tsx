"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { HERO_FILM, HERO_FILM_ALT, HERO_FILM_PHONE_QUERY } from "@/data/heroFilm";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/utils";

function subscribePhone(onChange: () => void) {
  const media = window.matchMedia(HERO_FILM_PHONE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** Qué corte toca: no se sabe hasta estar en el navegador, así el servidor no elige por nadie. */
function useHeroCut(): "wide" | "tall" | null {
  return useSyncExternalStore(
    subscribePhone,
    () => (window.matchMedia(HERO_FILM_PHONE_QUERY).matches ? "tall" : "wide"),
    () => null,
  );
}

/**
 * El film del hero. El póster está en el HTML desde el primer instante, y el
 * navegador baja uno solo: el del corte que le toca. El video se monta después,
 * en silencio, y también es uno solo. Se pausa fuera de pantalla y sigue donde
 * estaba al volver. Con movimiento reducido no hay video: queda el plano que
 * cuenta la historia.
 */
export function HeroFilm({ language, className }: { language: "es" | "en"; className?: string }) {
  const isEs = language === "es";
  const reducedMotion = useReducedMotionSafe();
  const cutId = useHeroCut();
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [readyCut, setReadyCut] = useState<string | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.15 });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && playing) void video.play().catch(() => {});
    else video.pause();
  }, [inView, playing, cutId, reducedMotion]);

  const film = cutId ? HERO_FILM[cutId] : null;
  const showVideo = film !== null && !reducedMotion;

  return (
    <div ref={boxRef} data-hero-film={cutId ?? "poster"} className={cn("relative overflow-hidden bg-background", className)}>
      <picture>
        <source media={`(prefers-reduced-motion: reduce) and ${HERO_FILM_PHONE_QUERY}`} srcSet={HERO_FILM.tall.still} />
        <source media="(prefers-reduced-motion: reduce)" srcSet={HERO_FILM.wide.still} />
        <source media={HERO_FILM_PHONE_QUERY} srcSet={HERO_FILM.tall.poster} />
        {/* next/image no elige archivo por movimiento reducido: va un <picture> a mano. */}
        <img src={HERO_FILM.wide.poster} alt={HERO_FILM_ALT[language]} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {showVideo && (
        <video
          key={cutId}
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setReadyCut(cutId)}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", readyCut === cutId ? "opacity-100" : "opacity-0")}
        >
          <source src={film.webm} type='video/webm; codecs="av01.0.05M.08"' />
          <source src={film.mp4} type="video/mp4" />
        </video>
      )}
      {showVideo && (
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-pressed={!playing}
          className="absolute bottom-3 right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-5 sm:right-5"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          <span className="sr-only">{playing ? (isEs ? "Pausar el film" : "Pause the film") : isEs ? "Reproducir el film" : "Play the film"}</span>
        </button>
      )}
    </div>
  );
}
