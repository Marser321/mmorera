"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Player, type PlayerRef } from "@remotion/player";
import { BRAND_FONT_VARIABLES } from "@/components/films/brandFonts";
import { LAB_DEMOS, SceneLab } from "@/components/films/lab/SceneLab";
import { FILM_FORMATS, FILM_FPS, type FilmLanguage } from "@/data/films/filmTypes";

/**
 * Laboratorio de escenas (solo `next dev`): cada escena de la biblioteca de
 * films, aislada, con su marca y formato. En la consola, window.__films.lab
 * permite recorrerla cuadro por cuadro (seekTo).
 *   /films-lab?scene=FactWall&brand=fenix-medical-center&format=portrait&lang=en&guides=1
 */
function Lab() {
  const params = useSearchParams();
  const scene = params.get("scene") ?? Object.keys(LAB_DEMOS)[0] ?? "";
  const demo = LAB_DEMOS[scene];
  const brand = params.get("brand") ?? demo?.brand ?? "fenix-medical-center";
  const format = params.get("format") === "portrait" ? "portrait" : "landscape";
  const language: FilmLanguage = params.get("lang") === "en" ? "en" : "es";
  const guides = params.get("guides") === "1";
  const { width, height } = FILM_FORMATS[format];
  const register = useCallback((player: PlayerRef | null) => {
    const registry = ((window as unknown as { __films?: Record<string, PlayerRef | null> }).__films ??= {});
    registry.lab = player;
  }, []);

  return (
    <main className={`min-h-screen bg-black p-6 text-white ${BRAND_FONT_VARIABLES}`}>
      <nav className="mb-4 flex flex-wrap gap-2 font-mono text-xs">
        {Object.keys(LAB_DEMOS).map((name) => (
          <a key={name} href={`?scene=${name}&format=${format}&lang=${language}${guides ? "&guides=1" : ""}`} className={`rounded border px-2 py-1 ${name === scene ? "border-white" : "border-white/20 text-white/60"}`}>
            {name}
          </a>
        ))}
      </nav>
      {demo ? (
        <div data-film-stage="lab" style={{ width: format === "portrait" ? 540 : "min(1500px, calc(100vw - 48px))", aspectRatio: `${width} / ${height}` }}>
          <Player
            ref={register}
            component={SceneLab}
            inputProps={{ scene, brand, language, guides }}
            durationInFrames={demo.duration}
            fps={FILM_FPS}
            compositionWidth={width}
            compositionHeight={height}
            loop
            acknowledgeRemotionLicense
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <p>Sin demos todavía.</p>
      )}
    </main>
  );
}

export default function FilmsLabPage() {
  return (
    <Suspense>
      <Lab />
    </Suspense>
  );
}
