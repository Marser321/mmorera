"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import type { PlayerRef } from "@remotion/player";
import type { CaseFilmScript } from "@/data/films/caseFilms";
import { getFlagshipFilm } from "@/data/films/flagships";
import { BRAND_FONT_VARIABLES } from "./brandFonts";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { FilmChapters, useFilmPlayback } from "./FilmChapters";
import type { FilmSource } from "./FilmCanvas";
import { FilmStage, useFilmFormat } from "./FilmStage";

function tap() {
  try {
    navigator.vibrate(8);
  } catch {}
}

/**
 * Film "Cómo lo resolví" de un caso. Se reproduce al verse (una vez, sin
 * loop: termina en la firma), pausa al salir y deja recorrer los capítulos.
 * Los subtítulos son el texto real del caso.
 */
export function CaseFilmSection({ script, language }: { script: CaseFilmScript; language: FilmLanguage }) {
  const isEs = language === "es";
  const format = useFilmFormat();
  const reducedMotion = useReducedMotion() === true;
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const [visible, setVisible] = useState(false);
  const userPausedRef = useRef(false);
  // Film insignia (guion propio con la marca del cliente) o la plantilla de caso.
  const flagship = getFlagshipFilm(script.slug);
  const chapters = flagship?.chapters ?? script.chapters;
  const durationInFrames = flagship?.durationInFrames ?? script.durationInFrames;
  const { chapterIndex, playing, barsRef } = useFilmPlayback(player, chapters);
  const lastFrame = durationInFrames - 1;
  const stillFrame = (index: number) => {
    const chapter = chapters[index];
    return chapter.from + chapter.durationInFrames - 24;
  };

  // Al verse arranca (o sigue); al salir pausa. Nunca vuelve a empezar solo.
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
    tap();
    if (reducedMotion) {
      player.seekTo(stillFrame(index));
      return;
    }
    player.seekTo(chapters[index].from);
    if (!userPausedRef.current) player.play();
  };

  const togglePlay = () => {
    if (!player) return;
    tap();
    if (player.isPlaying()) {
      userPausedRef.current = true;
      player.pause();
      return;
    }
    userPausedRef.current = false;
    if (player.getCurrentFrame() >= lastFrame) player.seekTo(0);
    player.play();
  };

  const source = useMemo<FilmSource>(
    () =>
      flagship
        ? { kind: "flagship", durationInFrames: flagship.durationInFrames, props: { slug: script.slug, language } }
        : { kind: "case", durationInFrames: script.durationInFrames, props: { script, language } },
    [flagship, language, script],
  );

  return (
    <section className={`mx-auto mt-16 max-w-[1680px] px-3 sm:px-6 ${BRAND_FONT_VARIABLES}`} aria-labelledby="case-film-title">
      <h2 id="case-film-title" className="sr-only">{isEs ? "Cómo lo resolví" : "How I solved it"}</h2>
      <FilmStage
        source={source}
        format={format}
        onPlayer={setPlayer}
        onVisibleChange={setVisible}
        initialFrame={reducedMotion ? lastFrame : 0}
        className="shadow-[0_50px_140px_-50px_rgba(0,0,0,0.85)]"
        poster={
          script.reel ? (
            <Image src={script.reel.poster} alt="" fill priority sizes="100vw" className="object-cover object-top opacity-40" />
          ) : null
        }
      />
      <div className="mx-auto max-w-[1480px] px-2 sm:px-6">
        <FilmChapters
          chapters={chapters}
          chapterIndex={chapterIndex}
          playing={playing}
          barsRef={barsRef}
          language={language}
          onSeekChapter={seekChapter}
          onTogglePlay={togglePlay}
        />
      </div>
    </section>
  );
}
