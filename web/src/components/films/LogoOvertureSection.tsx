"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { PlayerRef } from "@remotion/player";
import { useLanguage } from "@/context/LanguageContext";
import { LOGO_OVERTURE_FRAMES } from "./compositions/logoOvertureTiming";
import type { FilmSource } from "./FilmCanvas";
import { FilmStage, useFilmFormat } from "./FilmStage";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { BRAND_GLYPHS } from "@/data/brandGlyphs";

// Cuadro en que las dos flechas ya se unieron en «>Σ»: el póster lo pinta
// quieto mientras carga el Player, y la película arranca desde ahí.
const START_FRAME = 88;
const PromptGlyph = BRAND_GLYPHS.prompt.Icon;

function OverturePoster() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(40%_45%_at_50%_47%,rgba(113,243,162,.16),transparent_70%)]" />
      <PromptGlyph className="absolute left-1/2 top-[47%] h-auto w-[22%] -translate-x-1/2 -translate-y-1/2 text-[#71F3A2] drop-shadow-[0_0_24px_rgba(113,243,162,.45)]" />
    </div>
  );
}

/**
 * Entrada del monograma antes del perfil: el prompt de código que gira hasta
 * ser la doble M. Se reproduce una sola vez al verse y queda en el sello;
 * se puede volver a ver. Con reduced-motion se muestra el sello final.
 */
export function LogoOvertureSection() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const format = useFilmFormat();
  const reducedMotion = useReducedMotionSafe() === true;
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const [visible, setVisible] = useState(false);
  const [ended, setEnded] = useState(false);
  const playedRef = useRef(false);
  const lastFrame = LOGO_OVERTURE_FRAMES - 1;

  useEffect(() => {
    if (!player || reducedMotion) return;
    if (visible && !playedRef.current) {
      playedRef.current = true;
      player.seekTo(START_FRAME);
      player.play();
    } else if (!visible) {
      player.pause();
    }
  }, [player, reducedMotion, visible]);

  useEffect(() => {
    if (!player) return;
    const onEnded = () => setEnded(true);
    const onPlay = () => setEnded(false);
    player.addEventListener("ended", onEnded);
    player.addEventListener("play", onPlay);
    return () => {
      player.removeEventListener("ended", onEnded);
      player.removeEventListener("play", onPlay);
    };
  }, [player]);

  const replay = () => {
    if (!player) return;
    try {
      navigator.vibrate(8);
    } catch {}
    player.seekTo(0);
    player.play();
  };

  const source = useMemo<FilmSource>(() => ({ kind: "logo", durationInFrames: LOGO_OVERTURE_FRAMES, props: { language } }), [language]);

  return (
    <section className="relative px-5 pb-6 pt-20 sm:px-8 lg:px-12" aria-label="Mario Morera · AI Automation & Operations">
      <div className="relative mx-auto max-w-[1280px]">
        <FilmStage
          source={source}
          format={format}
          onPlayer={setPlayer}
          onVisibleChange={setVisible}
          initialFrame={reducedMotion ? lastFrame : START_FRAME}
          poster={player || reducedMotion ? undefined : <OverturePoster />}
          className="rounded-none border-0 bg-transparent"
        />
        {ended && !reducedMotion ? (
          <button
            type="button"
            onClick={replay}
            className="pressable absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/14 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[.16em] text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.14)]"
          >
            <RotateCcw className="h-3 w-3" />
            {isEs ? "Ver de nuevo" : "Replay"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
