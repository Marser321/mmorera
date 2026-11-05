"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PlayerRef } from "@remotion/player";
import { CAMPANAS_CHAPTERS, CAMPANAS_DURATION, CAMPANAS_FILM } from "@/data/films/campanasFilm";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { FilmChapters, useFilmPlayback } from "./FilmChapters";
import type { FilmSource } from "./FilmCanvas";
import { FilmStage, useFilmFormat } from "./FilmStage";

/** Cuadro quieto de un capítulo (movimiento reducido): casi al final, con todo armado. */
const stillFrameOf = (chapter: { from: number; durationInFrames: number }) => chapter.from + chapter.durationInFrames - 24;

/**
 * Sala de la cinemática de /campanas. Se reproduce al verse (una vez, sin loop:
 * termina en la firma), pausa al salir y deja recorrer los capítulos. Con
 * movimiento reducido arranca quieta en el capítulo central y cada capítulo es
 * un cuadro fijo. Los subtítulos son texto real de la página.
 */
export function CampanasFilmRoom({ language }: { language: FilmLanguage }) {
  const format = useFilmFormat();
  const reducedMotion = useReducedMotionSafe() === true;
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const [visible, setVisible] = useState(false);
  const userPausedRef = useRef(false);
  const lastFrame = CAMPANAS_DURATION - 1;
  const { chapterIndex, playing, barsRef } = useFilmPlayback(player, CAMPANAS_CHAPTERS);
  const source = useMemo<FilmSource>(() => ({ kind: "campanas", durationInFrames: CAMPANAS_DURATION, props: { language } }), [language]);

  useEffect(() => {
    if (!player) return;
    if (visible && !reducedMotion && !userPausedRef.current && player.getCurrentFrame() < lastFrame) player.play();
    else player.pause();
  }, [lastFrame, player, reducedMotion, visible]);

  useEffect(() => {
    const pauseHidden = () => {
      if (document.hidden) player?.pause();
    };
    document.addEventListener("visibilitychange", pauseHidden);
    return () => document.removeEventListener("visibilitychange", pauseHidden);
  }, [player]);

  const seekChapter = (index: number) => {
    if (!player) return;
    const chapter = CAMPANAS_CHAPTERS[index];
    if (reducedMotion) {
      player.seekTo(stillFrameOf(chapter));
      return;
    }
    player.seekTo(chapter.from);
    if (!userPausedRef.current) player.play();
  };

  const togglePlay = () => {
    if (!player) return;
    if (player.isPlaying()) {
      userPausedRef.current = true;
      player.pause();
      return;
    }
    userPausedRef.current = false;
    if (player.getCurrentFrame() >= lastFrame) player.seekTo(0);
    player.play();
  };

  return (
    <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
      <FilmStage
        source={source}
        format={format}
        onPlayer={setPlayer}
        onVisibleChange={setVisible}
        initialFrame={reducedMotion ? stillFrameOf(CAMPANAS_CHAPTERS[3]) : 0}
        className="shadow-[0_50px_140px_-50px_rgba(0,0,0,0.85)]"
        poster={
          <div className="flex h-full flex-col justify-end gap-3 p-6 sm:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-accent">{CAMPANAS_FILM.badge[language]}</p>
            <p className="max-w-3xl text-balance text-2xl font-medium leading-tight tracking-[-.03em] text-foreground sm:text-4xl">{CAMPANAS_FILM.person.headline[language]}</p>
          </div>
        }
      />
      <FilmChapters
        chapters={CAMPANAS_CHAPTERS}
        chapterIndex={chapterIndex}
        playing={playing}
        barsRef={barsRef}
        language={language}
        onSeekChapter={seekChapter}
        onTogglePlay={togglePlay}
      />
    </div>
  );
}
