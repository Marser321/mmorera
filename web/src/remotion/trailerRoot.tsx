import { Composition, registerRoot } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { ContentTrailer } from "@/components/films/trailer/ContentTrailer";
import timing from "@/components/films/trailer/timing.json";
import { FontGate } from "./FontGate";

/**
 * Raíz de Remotion del trailer de la fábrica de contenido (la pieza de
 * «Contenido con IA» del home y de /fabricas). No la carga el sitio: la usa
 * `npx tsx scripts/render-trailer.ts`, que también mezcla la banda sonora.
 * Composiciones: content-trailer-es y content-trailer-en (1080×1920, 30 fps).
 */

function TrailerRender({ language }: { language: FilmLanguage }) {
  return (
    <FontGate>
      <ContentTrailer language={language} />
    </FontGate>
  );
}

export function TrailerRoot() {
  return (
    <>
      <Composition
        id="content-trailer-es"
        component={TrailerRender}
        durationInFrames={timing.total}
        fps={timing.fps}
        width={1080}
        height={1920}
        defaultProps={{ language: "es" as FilmLanguage }}
      />
      <Composition
        id="content-trailer-en"
        component={TrailerRender}
        durationInFrames={timing.total}
        fps={timing.fps}
        width={1080}
        height={1920}
        defaultProps={{ language: "en" as FilmLanguage }}
      />
    </>
  );
}

registerRoot(TrailerRoot);
