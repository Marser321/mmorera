import { Composition, registerRoot } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { CONTENT_SAMPLES, type SampleId } from "@/data/contentSamples";
import { ContentTrailer } from "@/components/films/trailer/ContentTrailer";
import timing from "@/components/films/trailer/timing.json";
import { SAMPLE_COMPONENTS, SAMPLE_SIZE } from "@/components/films/muestras";
import { FontGate } from "./FontGate";

/**
 * Raíz de Remotion de la fábrica de contenido (la pieza de «Contenido con IA»
 * del home y de /fabricas). No la carga el sitio: la usa
 * `npx tsx scripts/render-trailer.ts`, que también mezcla la banda sonora.
 *
 * - content-trailer-<idioma>: el trailer vertical (1080×1920).
 * - content-trailer-<idioma>-16x9: el mismo trailer en horizontal (1920×1080).
 * - muestra-<estilo>-<idioma>: las siete muestras, cada una en su formato.
 */

const LANGUAGES: FilmLanguage[] = ["es", "en"];

function TrailerRender({ language }: { language: FilmLanguage }) {
  return (
    <FontGate>
      <ContentTrailer language={language} />
    </FontGate>
  );
}

function SampleRender({ id, language }: { id: SampleId; language: FilmLanguage }) {
  const Sample = SAMPLE_COMPONENTS[id];
  return (
    <FontGate>
      <Sample language={language} />
    </FontGate>
  );
}

export function TrailerRoot() {
  return (
    <>
      {LANGUAGES.map((language) => (
        <Composition key={language} id={`content-trailer-${language}`} component={TrailerRender} durationInFrames={timing.total} fps={timing.fps} width={1080} height={1920} defaultProps={{ language }} />
      ))}
      {LANGUAGES.map((language) => (
        <Composition key={`${language}-16x9`} id={`content-trailer-${language}-16x9`} component={TrailerRender} durationInFrames={timing.total} fps={timing.fps} width={1920} height={1080} defaultProps={{ language }} />
      ))}
      {CONTENT_SAMPLES.flatMap((sample) =>
        LANGUAGES.map((language) => (
          <Composition
            key={`${sample.id}-${language}`}
            id={`muestra-${sample.id}-${language}`}
            component={SampleRender}
            durationInFrames={sample.frames}
            fps={30}
            width={SAMPLE_SIZE[sample.aspect].width}
            height={SAMPLE_SIZE[sample.aspect].height}
            defaultProps={{ id: sample.id, language }}
          />
        )),
      )}
    </>
  );
}

registerRoot(TrailerRoot);
