"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, Link2 } from "lucide-react";
import type { PlayerRef } from "@remotion/player";
import type { CaseFilmScript } from "@/data/films/caseFilms";
import { getFlagshipFilm } from "@/data/films/flagships";
import { BRAND_FONT_VARIABLES } from "./brandFonts";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { FilmChapters, useFilmPlayback } from "./FilmChapters";
import type { FilmSource } from "./FilmCanvas";
import { FilmStage, useFilmFormat } from "./FilmStage";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/** Enlace directo a un capítulo: `/casos-de-exito/<caso>#film-<capítulo>`. */
const HASH_PREFIX = "#film-";

function chapterFromHash(chapters: { id: string }[]) {
  const { hash } = window.location;
  if (!hash.startsWith(HASH_PREFIX)) return -1;
  const id = decodeURIComponent(hash.slice(HASH_PREFIX.length));
  return chapters.findIndex((chapter) => chapter.id === id);
}

/** Cuadro quieto de un capítulo (movimiento reducido): casi al final, con todo armado. */
const stillFrameOf = (chapter: { from: number; durationInFrames: number }) => chapter.from + chapter.durationInFrames - 24;

function tap() {
  try {
    navigator.vibrate(8);
  } catch {}
}

/** Portapapeles con respaldo: hay navegadores (y vistas embebidas) que niegan la API async. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.append(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {}
    area.remove();
    return copied;
  }
}

type ShareState = "idle" | "copied" | "address-bar";

const SHARE_LABELS: Record<FilmLanguage, Record<ShareState, string>> = {
  es: { idle: "Compartir este capítulo", copied: "Enlace copiado", "address-bar": "Enlace listo en la barra" },
  en: { idle: "Share this chapter", copied: "Link copied", "address-bar": "Link ready in the address bar" },
};

/**
 * Film "Cómo lo resolví" de un caso. Se reproduce al verse (una vez, sin
 * loop: termina en la firma), pausa al salir y deja recorrer los capítulos.
 * Los subtítulos son el texto real del caso.
 */
export function CaseFilmSection({ script, language }: { script: CaseFilmScript; language: FilmLanguage }) {
  const isEs = language === "es";
  const format = useFilmFormat();
  const reducedMotion = useReducedMotionSafe() === true;
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const [visible, setVisible] = useState(false);
  const [shareState, setShareState] = useState<ShareState>("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const userPausedRef = useRef(false);
  // Film insignia (guion propio con la marca del cliente) o la plantilla de caso.
  const flagship = getFlagshipFilm(script.slug);
  const chapters = flagship?.chapters ?? script.chapters;
  const durationInFrames = flagship?.durationInFrames ?? script.durationInFrames;
  const { chapterIndex, playing, barsRef } = useFilmPlayback(player, chapters);
  const lastFrame = durationInFrames - 1;

  // Llegar con #film-<capítulo>: el film está más abajo y el Player se monta
  // recién al acercarse, así que primero se baja hasta la sección.
  useEffect(() => {
    if (chapterFromHash(chapters) >= 0) sectionRef.current?.scrollIntoView({ block: "start" });
  }, [chapters]);

  // Con el Player listo (y ante cada cambio del hash), se salta al capítulo.
  useEffect(() => {
    if (!player) return;
    const seekFromHash = () => {
      const index = chapterFromHash(chapters);
      if (index < 0) return;
      sectionRef.current?.scrollIntoView({ block: "start" });
      player.seekTo(reducedMotion ? stillFrameOf(chapters[index]) : chapters[index].from);
    };
    seekFromHash();
    window.addEventListener("hashchange", seekFromHash);
    return () => window.removeEventListener("hashchange", seekFromHash);
  }, [chapters, player, reducedMotion]);

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
    // La barra de direcciones queda lista para compartir (sin sumar historial;
    // se conserva el estado del router de Next).
    window.history.replaceState(window.history.state, "", `${HASH_PREFIX}${chapters[index].id}`);
    if (reducedMotion) {
      player.seekTo(stillFrameOf(chapters[index]));
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

  const shareChapter = async () => {
    const chapter = chapters[chapterIndex];
    const url = `${window.location.origin}${window.location.pathname}${HASH_PREFIX}${chapter.id}`;
    tap();
    // En el teléfono, la hoja de compartir del sistema; en escritorio, el portapapeles.
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    // Si no se puede copiar, el enlace igual queda en la barra de direcciones.
    window.history.replaceState(window.history.state, "", `${HASH_PREFIX}${chapter.id}`);
    setShareState((await copyText(url)) ? "copied" : "address-bar");
    window.setTimeout(() => setShareState("idle"), 2400);
  };

  const source = useMemo<FilmSource>(
    () =>
      flagship
        ? { kind: "flagship", durationInFrames: flagship.durationInFrames, props: { slug: script.slug, language } }
        : { kind: "case", durationInFrames: script.durationInFrames, props: { script, language } },
    [flagship, language, script],
  );

  return (
    <section ref={sectionRef} id="film" className={`mx-auto mt-16 max-w-[1680px] scroll-mt-20 px-3 sm:px-6 ${BRAND_FONT_VARIABLES}`} aria-labelledby="case-film-title">
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
          actions={
            <button
              type="button"
              onClick={shareChapter}
              className="pressable inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/14 px-4 py-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#F3F0E8]/70 transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.14)] light:text-muted-foreground"
            >
              {shareState === "idle" ? <Link2 className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-signal" />}
              <span aria-live="polite">{SHARE_LABELS[language][shareState]}</span>
            </button>
          }
        />
      </div>
    </section>
  );
}
