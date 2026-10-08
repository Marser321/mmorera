"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { PlayerRef } from "@remotion/player";
import { Pause, Play } from "lucide-react";
import { resolveChapterIndex, type FilmLanguage, type Localized } from "@/data/films/filmTypes";

export interface ChapterLike {
  id: string;
  label: Localized;
  caption: Localized;
  from: number;
  durationInFrames: number;
}

/**
 * Sigue al Player: capítulo activo (estado React, cambia pocas veces) y
 * progreso por capítulo (mutación directa del DOM, 30 veces por segundo).
 */
export function useFilmPlayback(player: PlayerRef | null, chapters: ChapterLike[]) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const barsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (!player) return;
    const paint = (frame: number) => {
      setChapterIndex(resolveChapterIndex(chapters, frame));
      chapters.forEach((chapter, index) => {
        const bar = barsRef.current[index];
        if (!bar) return;
        const ratio = Math.min(1, Math.max(0, (frame - chapter.from) / chapter.durationInFrames));
        bar.style.transform = `scaleX(${ratio})`;
      });
    };
    const onFrame = (event: { detail: { frame: number } }) => paint(event.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("seeked", onFrame);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onPause);
    // Sincronía inicial fuera del cuerpo del efecto (el Player pudo montarse a mitad del film).
    const initial = window.requestAnimationFrame(() => {
      paint(player.getCurrentFrame());
      setPlaying(player.isPlaying());
    });
    return () => {
      window.cancelAnimationFrame(initial);
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("seeked", onFrame);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onPause);
    };
  }, [player, chapters]);

  return { chapterIndex, playing, barsRef };
}

/** Barra de capítulos + subtítulo HTML del capítulo activo. */
export function FilmChapters({
  chapters,
  chapterIndex,
  playing,
  barsRef,
  language,
  onSeekChapter,
  onTogglePlay,
  actions,
}: {
  chapters: ChapterLike[];
  chapterIndex: number;
  playing: boolean;
  barsRef: RefObject<Array<HTMLSpanElement | null>>;
  language: FilmLanguage;
  onSeekChapter: (index: number) => void;
  /** Sin callback no hay botón de reproducción (p. ej. el film con scroll). */
  onTogglePlay?: () => void;
  /** Acciones junto al subtítulo (p. ej. compartir el capítulo). */
  actions?: ReactNode;
}) {
  const isEs = language === "es";
  const active = chapters[chapterIndex];
  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        {onTogglePlay ? (
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={playing ? (isEs ? "Pausar film" : "Pause film") : (isEs ? "Reproducir film" : "Play film")}
            className="pressable inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/14 text-foreground transition-colors hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.14)]"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        ) : null}
        <ol className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }}>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => onSeekChapter(index)}
                aria-current={index === chapterIndex ? "step" : undefined}
                className="group w-full text-left focus-visible:outline-none"
              >
                <span className="relative block h-[2px] overflow-hidden rounded-full bg-white/12 light:bg-[rgb(var(--ink-rgb)/0.12)]">
                  <span
                    ref={(node) => {
                      barsRef.current[index] = node;
                    }}
                    className="absolute inset-0 origin-left scale-x-0 bg-signal"
                  />
                </span>
                <span
                  className={`mt-2 block truncate font-mono text-[9px] uppercase tracking-[.06em] transition-colors group-focus-visible:text-signal sm:text-[10px] sm:tracking-[.14em] ${
                    index === chapterIndex ? "text-foreground" : "text-[#F3F0E8]/55 group-hover:text-[#F3F0E8]/70 light:text-muted-foreground/80"
                  }`}
                >
                  <span className="hidden sm:inline">0{index + 1} · </span>
                  {chapter.label[language]}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p aria-live="polite" className="min-h-[3.5rem] max-w-3xl text-lg leading-7 text-[#F3F0E8]/70 light:text-muted-foreground">
          {active?.caption[language]}
        </p>
        {actions}
      </div>
    </div>
  );
}
