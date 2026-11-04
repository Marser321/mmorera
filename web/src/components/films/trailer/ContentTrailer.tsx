import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { AiScene, CaptionsScene, ColorScene, ReframeScene } from "./EditScenes";
import { CodeScene, FinaleScene, ReviewScene } from "./ClosingScenes";
import { HookScene, TitleScene } from "./OpeningScenes";
import { FormatsScene, RhythmScene } from "./ShowScenes";
import { EditorChrome, Grain } from "./kit";

/**
 * Trailer de la fábrica de contenido (46 s, 9:16, 30 fps, 120 BPM). Una toma
 * del film de autor pasa por cada edición que hace el sistema: reencuadre,
 * subtítulos, color, escenas con IA, ritmo, formatos e idiomas, revisión de
 * una persona y, al final, el propio código del video.
 *
 * Los tiempos de cada escena viven aquí, en línea (los edita Remotion Studio),
 * y en timing.json, que también lee la banda sonora: trailerTiming.test.ts
 * comprueba que coincidan para que cada corte caiga en el pulso.
 */
export function ContentTrailer({ language }: { language: FilmLanguage }) {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0B0B0A" }}>
      <Sequence
        name="Gancho"
        from={0}
        durationInFrames={120}
        premountFor={fps}
      >
        <HookScene language={language} />
      </Sequence>
      <Sequence
        name="Título"
        from={120}
        durationInFrames={120}
        premountFor={fps}
      >
        <TitleScene language={language} />
      </Sequence>
      <Sequence
        name="Reencuadre"
        from={240}
        durationInFrames={120}
        premountFor={fps}
      >
        <ReframeScene language={language} />
      </Sequence>
      <Sequence
        name="Subtítulos"
        from={360}
        durationInFrames={120}
        premountFor={fps}
      >
        <CaptionsScene language={language} />
      </Sequence>
      <Sequence
        name="Color"
        from={480}
        durationInFrames={120}
        premountFor={fps}
      >
        <ColorScene language={language} />
      </Sequence>
      <Sequence
        name="Escenas con IA"
        from={600}
        durationInFrames={120}
        premountFor={fps}
      >
        <AiScene language={language} />
      </Sequence>
      <Sequence
        name="Ritmo"
        from={720}
        durationInFrames={120}
        premountFor={fps}
      >
        <RhythmScene language={language} />
      </Sequence>
      <Sequence
        name="Formatos"
        from={840}
        durationInFrames={120}
        premountFor={fps}
      >
        <FormatsScene language={language} />
      </Sequence>
      <Sequence
        name="Revisión"
        from={960}
        durationInFrames={120}
        premountFor={fps}
      >
        <ReviewScene language={language} />
      </Sequence>
      <Sequence
        name="Código"
        from={1080}
        durationInFrames={120}
        premountFor={fps}
      >
        <CodeScene language={language} />
      </Sequence>
      <Sequence
        name="Cierre"
        from={1200}
        durationInFrames={180}
        premountFor={fps}
      >
        <FinaleScene language={language} />
      </Sequence>
      <EditorChrome language={language} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
}
