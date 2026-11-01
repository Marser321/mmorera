"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PlayerRef } from "@remotion/player";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { nodeActivationFrame } from "@/data/films/filmTypes";
import { USE_CASE_FILMS } from "@/data/films/systemsFilms";
import { PROJECT_CASES } from "@/data/projectCases";
import { FilmChapters, useFilmPlayback } from "./FilmChapters";
import type { FilmSource } from "./FilmCanvas";
import { FilmStage, useFilmFormat } from "./FilmStage";
import { NodeInspector } from "./NodeInspector";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const ADVANCE_DELAY_MS = 1400;

function tap() {
  try {
    navigator.vibrate(8);
  } catch {}
}

/**
 * Sala de casos de uso de /sistemas: un solo Player cuyo guion cambia con
 * las pestañas. Se reproduce al entrar en pantalla, pausa al salir, avanza
 * solo al siguiente caso y cada nodo del flujo abre su inspector.
 */
export function UseCaseFilmRoom() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const format = useFilmFormat();
  const reducedMotion = useReducedMotionSafe() === true;
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const [active, setActive] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const userPausedRef = useRef(false);
  const visibleRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  /** Cuadro al que ir cuando el Player termine de cargar (un nodo tocado antes de tiempo). */
  const pendingSeekRef = useRef<number | null>(null);

  const film = USE_CASE_FILMS[active];
  const systemChapter = film.chapters[2];
  const caseTitle = film.caseTitle?.[language];
  const badgeLabel = film.kind === "real"
    ? `${isEs ? "Caso real" : "Real case"} · ${caseTitle ?? ""}`
    : isEs ? "Flujo de ejemplo · datos de muestra" : "Example flow · sample data";
  const { chapterIndex, playing, barsRef } = useFilmPlayback(player, film.chapters);

  /* Con reduced-motion no hay reproducción automática: cada capítulo se
     muestra como un cuadro fijo, ya compuesto. */
  const stillFrame = useCallback((index: number) => {
    const chapter = film.chapters[index];
    return chapter.from + chapter.durationInFrames - 24;
  }, [film]);

  const clearAdvance = useCallback(() => {
    if (advanceTimerRef.current === null) return;
    window.clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;
  }, []);

  const selectNode = useCallback((stageId: string) => {
    player?.pause();
    userPausedRef.current = true;
    clearAdvance();
    setSelectedNodeId(stageId);
    tap();
  }, [clearAdvance, player]);

  const selectFilm = useCallback((index: number, fromUser: boolean) => {
    clearAdvance();
    pendingSeekRef.current = null;
    setActive(index);
    setSelectedNodeId(null);
    if (fromUser) {
      userPausedRef.current = false;
      tap();
    }
    if (!player) return;
    if (reducedMotion) {
      player.seekTo(USE_CASE_FILMS[index].chapters[2].from + USE_CASE_FILMS[index].chapters[2].durationInFrames - 24);
      return;
    }
    player.seekTo(0);
    if (visibleRef.current && !userPausedRef.current) player.play();
  }, [clearAdvance, player, reducedMotion]);

  // Reproduce solo mientras se ve; respeta la pausa manual y reduced-motion.
  useEffect(() => {
    visibleRef.current = visible;
    if (!player) return;
    if (visible && !reducedMotion && !userPausedRef.current) player.play();
    else player.pause();
  }, [player, visible, reducedMotion]);

  // Al terminar un caso, pasa al siguiente (salvo pausa manual).
  useEffect(() => {
    if (!player) return;
    const onEnded = () => {
      if (userPausedRef.current || reducedMotion) return;
      advanceTimerRef.current = window.setTimeout(() => selectFilm((active + 1) % USE_CASE_FILMS.length, false), ADVANCE_DELAY_MS);
    };
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("ended", onEnded);
      clearAdvance();
    };
  }, [active, clearAdvance, player, reducedMotion, selectFilm]);

  useEffect(() => {
    const pauseHidden = () => {
      if (document.hidden) player?.pause();
    };
    document.addEventListener("visibilitychange", pauseHidden);
    return () => document.removeEventListener("visibilitychange", pauseHidden);
  }, [player]);

  const seekChapter = (index: number) => {
    setSelectedNodeId(null);
    clearAdvance();
    tap();
    const frame = reducedMotion ? stillFrame(index) : film.chapters[index].from;
    if (!player) {
      pendingSeekRef.current = frame;
      return;
    }
    player.seekTo(frame);
    if (!reducedMotion && !userPausedRef.current) player.play();
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
    setSelectedNodeId(null);
    if (player.getCurrentFrame() >= film.durationInFrames - 1) player.seekTo(0);
    player.play();
  };

  // El inspector es HTML: abre aunque el film todavía esté cargando; el salto
  // al nodo (o al capítulo) se hace cuando el Player está listo.
  const inspectStage = (index: number) => {
    const frame = systemChapter.from + Math.round(nodeActivationFrame(index, film.stages.length)) + 16;
    if (player) player.seekTo(frame);
    else pendingSeekRef.current = frame;
    selectNode(film.stages[index].id);
  };

  useEffect(() => {
    if (!player || pendingSeekRef.current === null) return;
    player.seekTo(pendingSeekRef.current);
    pendingSeekRef.current = null;
  }, [player]);

  const resume = () => {
    userPausedRef.current = false;
    setSelectedNodeId(null);
    if (!reducedMotion) player?.play();
  };

  const source = useMemo<FilmSource>(() => ({
    kind: "use-case",
    durationInFrames: film.durationInFrames,
    props: { script: film, language, badgeLabel, selectedNodeId, onNodeSelect: selectNode },
  }), [badgeLabel, film, language, selectNode, selectedNodeId]);

  const selectedIndex = selectedNodeId ? film.stages.findIndex((stage) => stage.id === selectedNodeId) : -1;
  const inspector = selectedIndex >= 0 ? (
    <NodeInspector
      stage={film.stages[selectedIndex]}
      index={selectedIndex}
      total={film.stages.length}
      language={language}
      example={film.kind === "example"}
      onClose={() => setSelectedNodeId(null)}
      onResume={resume}
    />
  ) : null;

  return (
    <section className="relative isolate border-y border-white/10 bg-card px-5 py-16 light:border-[rgb(var(--ink-rgb)/0.1)] sm:px-8 lg:px-12 lg:py-24" aria-labelledby="use-cases-title">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/55 light:text-muted-foreground/85">02 · {isEs ? "Casos de uso" : "Use cases"}</p>
            <h2 id="use-cases-title" className="mt-4 text-3xl font-medium tracking-[-.04em] text-foreground sm:text-5xl">
              {isEs ? "Del problema al sistema, paso a paso." : "From problem to system, step by step."}
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/55 light:text-muted-foreground/85">
            {isEs ? "Tocá un nodo para inspeccionarlo" : "Tap a node to inspect it"}
          </p>
        </div>

        <div role="tablist" aria-label={isEs ? "Casos de uso" : "Use cases"} className="mt-10 grid gap-2 md:grid-cols-3">
          {USE_CASE_FILMS.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`use-case-tab-${item.id}`}
                aria-selected={selected}
                aria-controls="use-case-panel"
                onClick={() => selectFilm(index, true)}
                className={`pressable rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  selected
                    ? "border-signal/50 bg-signal/[.08]"
                    : "border-white/8 bg-white/[.025] hover:border-white/20 light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-[rgb(var(--ink-rgb)/0.025)] light:hover:border-[rgb(var(--ink-rgb)/0.2)]"
                }`}
              >
                <span className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[.16em]">
                  <span className={selected ? "text-signal" : "text-foreground/55 light:text-muted-foreground/85"}>{item.category[language]}</span>
                  <span className={item.kind === "real" ? "text-signal" : "text-accent"}>
                    {item.kind === "real" ? (isEs ? "Caso real" : "Real case") : (isEs ? "Ejemplo" : "Example")}
                  </span>
                </span>
                <span className="mt-4 block text-lg font-medium tracking-[-.02em] text-foreground">{item.title[language]}</span>
              </button>
            );
          })}
        </div>

        {/* El film + capítulos entran en una pantalla de escritorio */}
        <div id="use-case-panel" role="tabpanel" aria-labelledby={`use-case-tab-${film.id}`} className="mx-auto mt-6" style={{ maxWidth: "min(100%, calc((100svh - 230px) * 16 / 9))" }}>
          <FilmStage
            source={source}
            format={format}
            onPlayer={setPlayer}
            onVisibleChange={setVisible}
            initialFrame={reducedMotion ? stillFrame(2) : 0}
            poster={
              <div className="flex h-full flex-col justify-end p-6 sm:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-signal">{film.category[language]}</p>
                <p className="mt-3 max-w-xl text-3xl font-medium tracking-[-.04em] text-foreground sm:text-5xl">{film.problem.headline[language]}</p>
              </div>
            }
          >
            {inspector && format === "landscape" ? (
              <div className="absolute right-4 top-4 z-10 flex max-h-[calc(100%-2rem)] w-[min(360px,46%)] flex-col">{inspector}</div>
            ) : null}
          </FilmStage>
          {inspector && format !== "landscape" ? <div className="mt-4">{inspector}</div> : null}

          <FilmChapters
            chapters={film.chapters}
            chapterIndex={chapterIndex}
            playing={playing}
            barsRef={barsRef}
            language={language}
            onSeekChapter={seekChapter}
            onTogglePlay={togglePlay}
          />

          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 light:border-[rgb(var(--ink-rgb)/0.1)] md:flex-row md:items-center md:justify-between">
            <ol aria-label={isEs ? "Etapas del flujo" : "Flow steps"} className="flex flex-wrap gap-2">
              {film.stages.map((stage, index) => (
                <li key={stage.id}>
                  <button
                    type="button"
                    onClick={() => inspectStage(index)}
                    aria-pressed={selectedNodeId === stage.id}
                    className={`pressable rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[.06em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      selectedNodeId === stage.id
                        ? "border-accent/60 text-foreground"
                        : "border-white/12 text-foreground/60 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.12)] light:text-muted-foreground"
                    }`}
                  >
                    0{index + 1} · {stage.title[language]}
                  </button>
                </li>
              ))}
            </ol>
            {film.caseSlug && caseTitle ? (
              <Link href={localePath(language, `/casos-de-exito/${film.caseSlug}`)} className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm text-foreground hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
                {isEs ? `Ver el caso ${caseTitle}` : `See the ${caseTitle} case`}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[.14em] text-foreground/55 light:text-muted-foreground/85">
                  {isEs ? "Flujo de ejemplo con datos de muestra" : "Example flow with sample data"}
                </p>
                {/* Un caso real que resuelve algo parecido, directo al capítulo de su film. */}
                {film.seenIn?.map((seen) => {
                  const title = PROJECT_CASES.find((project) => project.slug === seen.slug)?.title[language];
                  return title ? (
                    <Link key={seen.slug} href={localePath(language, `/casos-de-exito/${seen.slug}#film-${seen.chapter}`)} className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm text-foreground hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
                      {isEs ? `Visto en ${title}` : `Seen in ${title}`}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
