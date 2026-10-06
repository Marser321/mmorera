"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { PlayerRef } from "@remotion/player";
import type { FilmFormat } from "@/data/films/filmTypes";
import { useResolvedMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import type { FilmSource } from "./FilmCanvas";

const FilmCanvas = dynamic(() => import("./FilmCanvas").then((mod) => mod.FilmCanvas), { ssr: false });

/** 16:9 desde md; 4:5 en teléfonos. null mientras el breakpoint no resolvió. */
export function useFilmFormat(): FilmFormat | null {
  const wide = useResolvedMediaQuery("(min-width: 768px)");
  if (wide === null) return null;
  return wide ? "landscape" : "portrait";
}

/**
 * Escenario de un film: reserva el aspect-ratio (sin CLS), muestra el póster
 * HTML al instante y monta el Player recién al acercarse al viewport, igual
 * que CaseReel con los videos.
 */
export function FilmStage({
  source,
  format,
  onPlayer,
  onVisibleChange,
  initialFrame,
  poster,
  className,
  children,
}: {
  source: FilmSource;
  format: FilmFormat | null;
  onPlayer: (player: PlayerRef | null) => void;
  onVisibleChange?: (visible: boolean) => void;
  initialFrame?: number;
  /** Contenido estático mientras el Player no está montado. */
  poster?: ReactNode;
  className?: string;
  /** Capas encima del film (p. ej. el inspector de nodos). */
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const visibleRef = useRef(onVisibleChange);

  useEffect(() => {
    visibleRef.current = onVisibleChange;
  }, [onVisibleChange]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    /* El runtime de Remotion no compite con la carga inicial: se monta cuando
       el film ya se ve, o cuando está cerca y la persona empezó a recorrer la
       página (scroll, toque, tecla). Sin interacción, nada se evalúa fuera de
       pantalla. */
    let near = false;
    let interacted = false;
    const interactionEvents = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const;
    const onInteract = () => {
      interacted = true;
      if (near) setMounted(true);
      interactionEvents.forEach((type) => window.removeEventListener(type, onInteract));
    };
    interactionEvents.forEach((type) => window.addEventListener(type, onInteract, { passive: true }));

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near && interacted) setMounted(true);
      },
      { rootMargin: "300px 0px" },
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
        visibleRef.current?.(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35] },
    );
    nearObserver.observe(element);
    visibilityObserver.observe(element);
    return () => {
      interactionEvents.forEach((type) => window.removeEventListener(type, onInteract));
      nearObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const aspect = format === "portrait" ? "4 / 5" : "16 / 9";

  return (
    <div
      ref={containerRef}
      data-film-stage={source.kind}
      className={cn("relative w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-card light:border-[rgb(var(--ink-rgb)/0.1)]", className)}
      style={{ aspectRatio: aspect }}
    >
      {poster ? <div className="absolute inset-0">{poster}</div> : null}
      {mounted && format ? (
        <div className="absolute inset-0" aria-hidden="true">
          <FilmCanvas key={format} source={source} format={format} onPlayer={onPlayer} initialFrame={initialFrame} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
