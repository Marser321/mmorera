"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import type { PlayerRef } from "@remotion/player";
import { useLanguage } from "@/context/LanguageContext";
import { OPENING_BEATS, OPENING_DURATION } from "@/data/films/systemsFilms";
import { useResolvedMediaQuery } from "@/hooks/useMediaQuery";
import { FilmChapters, useFilmPlayback } from "./FilmChapters";
import type { FilmSource } from "./FilmCanvas";
import { FilmStage, useFilmFormat } from "./FilmStage";

/** Tramo del scroll que recorre el film; el resto sostiene el último cuadro. */
const SCRUB_START = 0.02;
const SCRUB_END = 0.9;
const LAST_FRAME = OPENING_DURATION - 1;

function frameForProgress(value: number) {
  const ratio = Math.min(1, Math.max(0, (value - SCRUB_START) / (SCRUB_END - SCRUB_START)));
  return Math.round(ratio * LAST_FRAME);
}

function Header({ isEs }: { isEs: boolean }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#F3F0E8]/35 light:text-muted-foreground/85">01 · {isEs ? "Mapa operativo" : "Operational map"}</p>
        <h2 id="opening-film-title" className="mt-4 text-3xl font-medium tracking-[-.04em] text-foreground sm:text-5xl">
          {isEs ? "De herramientas sueltas a un sistema." : "From scattered tools to one system."}
        </h2>
      </div>
    </div>
  );
}

/**
 * Film de apertura de /sistemas. En escritorio es el único pin con scrub de
 * la página (regla 1 de lib/motion.ts): el scroll mueve el timeline del
 * Player. En móvil se reproduce al verse; con reduced-motion queda el cuadro
 * final y los beats se leen como texto.
 */
export function ScrollFilm() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const desktop = useResolvedMediaQuery("(min-width: 1024px)");
  const reduced = useResolvedMediaQuery("(prefers-reduced-motion: reduce)");
  const format = useFilmFormat();
  const pinned = desktop === true && reduced === false;
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const { chapterIndex, playing, barsRef } = useFilmPlayback(player, OPENING_BEATS);
  const source = useMemo<FilmSource>(() => ({ kind: "opening", durationInFrames: OPENING_DURATION, props: { language } }), [language]);

  return pinned ? (
    <PinnedFilm source={source} player={player} setPlayer={setPlayer} chapterIndex={chapterIndex} barsRef={barsRef} isEs={isEs} />
  ) : (
    <InlineFilm
      source={source}
      format={format}
      player={player}
      setPlayer={setPlayer}
      chapterIndex={chapterIndex}
      playing={playing}
      barsRef={barsRef}
      reduced={reduced === true}
    />
  );
}

type FilmControls = {
  source: FilmSource;
  player: PlayerRef | null;
  setPlayer: (player: PlayerRef | null) => void;
  chapterIndex: number;
  barsRef: ReturnType<typeof useFilmPlayback>["barsRef"];
};

function PinnedFilm({ source, player, setPlayer, chapterIndex, barsRef, isEs }: FilmControls & { isEs: boolean }) {
  const { language } = useLanguage();
  const trackRef = useRef<HTMLElement>(null);
  const latestRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  const seek = useCallback(() => {
    rafRef.current = null;
    player?.seekTo(frameForProgress(latestRef.current));
  }, [player]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    latestRef.current = value;
    if (rafRef.current === null) rafRef.current = window.requestAnimationFrame(seek);
  });

  // Al montar el Player, se alinea con la posición de scroll actual.
  useEffect(() => {
    latestRef.current = scrollYProgress.get();
    player?.seekTo(frameForProgress(latestRef.current));
  }, [player, scrollYProgress]);

  useEffect(() => () => {
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
  }, []);

  // Los beats llevan el scroll al tramo correspondiente.
  const scrollToBeat = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const start = track.getBoundingClientRect().top + window.scrollY;
    const scrollable = track.offsetHeight - window.innerHeight;
    const ratio = (OPENING_BEATS[index].from + OPENING_BEATS[index].durationInFrames * 0.7) / LAST_FRAME;
    const target = start + (SCRUB_START + ratio * (SCRUB_END - SCRUB_START)) * scrollable;
    try {
      navigator.vibrate(8);
    } catch {}
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section ref={trackRef} className="relative h-[420vh]" aria-labelledby="opening-film-title">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-5 pt-20 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1480px]">
          <Header isEs={isEs} />
          <div className="mx-auto mt-6" style={{ maxWidth: "min(100%, calc((100svh - 330px) * 16 / 9))" }}>
            <FilmStage source={source} format="landscape" onPlayer={setPlayer} />
            <FilmChapters
              chapters={OPENING_BEATS}
              chapterIndex={chapterIndex}
              playing={false}
              barsRef={barsRef}
              language={language}
              onSeekChapter={scrollToBeat}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InlineFilm({
  source,
  format,
  player,
  setPlayer,
  chapterIndex,
  playing,
  barsRef,
  reduced,
}: FilmControls & { format: ReturnType<typeof useFilmFormat>; playing: boolean; reduced: boolean }) {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [visible, setVisible] = useState(false);
  const userPausedRef = useRef(false);
  const loopTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!player) return;
    if (visible && !reduced && !userPausedRef.current) player.play();
    else player.pause();
  }, [player, reduced, visible]);

  // En loop suave: sostiene el cuadro final y vuelve a empezar.
  useEffect(() => {
    if (!player) return;
    const onEnded = () => {
      if (reduced || userPausedRef.current) return;
      loopTimerRef.current = window.setTimeout(() => {
        player.seekTo(0);
        player.play();
      }, 1600);
    };
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("ended", onEnded);
      if (loopTimerRef.current !== null) window.clearTimeout(loopTimerRef.current);
    };
  }, [player, reduced]);

  const seekBeat = (index: number) => {
    if (!player) return;
    const beat = OPENING_BEATS[index];
    try {
      navigator.vibrate(8);
    } catch {}
    if (reduced) {
      player.seekTo(beat.from + beat.durationInFrames - 1);
      return;
    }
    player.seekTo(beat.from);
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
    if (player.getCurrentFrame() >= LAST_FRAME) player.seekTo(0);
    player.play();
  };

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20" aria-labelledby="opening-film-title">
      <div className="mx-auto max-w-[1480px]">
        <Header isEs={isEs} />
        <div className="mt-8">
          <FilmStage source={source} format={format} onPlayer={setPlayer} onVisibleChange={setVisible} initialFrame={reduced ? LAST_FRAME : 0} />
          <FilmChapters
            chapters={OPENING_BEATS}
            chapterIndex={chapterIndex}
            playing={playing}
            barsRef={barsRef}
            language={language}
            onSeekChapter={seekBeat}
            onTogglePlay={togglePlay}
          />
        </div>
      </div>
    </section>
  );
}
