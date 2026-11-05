import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { AiScene, CaptionsScene, ColorScene, ReframeScene } from "./EditScenes";
import { CodeScene, FinaleScene } from "./ClosingScenes";
import { HookScene, TitleScene } from "./OpeningScenes";
import { BridgeScene, StyleScene, WallScene } from "./StyleScenes";
import { EditorChrome, Grain } from "./kit";

/**
 * Trailer de la fábrica de contenido (60 s, 30 fps, 120 BPM), en vertical y
 * en horizontal. Primero una toma del film de autor pasa por cada edición:
 * reencuadre, subtítulos, color y escenas con IA. Después, en la caída, los
 * siete estilos que más se piden, cada uno con el material de una web que
 * hizo Mario: persona, empresa, VSL, reel, historia, cuadrado y carrusel. Al
 * final, los siete en los dos idiomas, la firma de una persona y el código.
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
        durationInFrames={90}
        premountFor={fps}
      >
        <ReframeScene language={language} />
      </Sequence>
      <Sequence
        name="Subtítulos"
        from={330}
        durationInFrames={90}
        premountFor={fps}
      >
        <CaptionsScene language={language} />
      </Sequence>
      <Sequence
        name="Color"
        from={420}
        durationInFrames={90}
        premountFor={fps}
      >
        <ColorScene language={language} />
      </Sequence>
      <Sequence
        name="Escenas con IA"
        from={510}
        durationInFrames={90}
        premountFor={fps}
      >
        <AiScene language={language} />
      </Sequence>
      <Sequence
        name="Puente"
        from={600}
        durationInFrames={120}
        premountFor={fps}
      >
        <BridgeScene language={language} />
      </Sequence>
      <Sequence
        name="Persona"
        from={720}
        durationInFrames={120}
        premountFor={fps}
      >
        <StyleScene id="persona" language={language} />
      </Sequence>
      <Sequence
        name="Empresa"
        from={840}
        durationInFrames={120}
        premountFor={fps}
      >
        <StyleScene id="empresa" language={language} />
      </Sequence>
      <Sequence
        name="VSL"
        from={960}
        durationInFrames={120}
        premountFor={fps}
      >
        <StyleScene id="vsl" language={language} />
      </Sequence>
      <Sequence
        name="Reel"
        from={1080}
        durationInFrames={60}
        premountFor={fps}
      >
        <StyleScene id="reel" language={language} />
      </Sequence>
      <Sequence
        name="Historia"
        from={1140}
        durationInFrames={90}
        premountFor={fps}
      >
        <StyleScene id="historia" language={language} />
      </Sequence>
      <Sequence
        name="Cuadrado"
        from={1230}
        durationInFrames={60}
        premountFor={fps}
      >
        <StyleScene id="cuadrado" language={language} />
      </Sequence>
      <Sequence
        name="Carrusel"
        from={1290}
        durationInFrames={120}
        premountFor={fps}
      >
        <StyleScene id="carrusel" language={language} />
      </Sequence>
      <Sequence
        name="Muro"
        from={1410}
        durationInFrames={120}
        premountFor={fps}
      >
        <WallScene language={language} />
      </Sequence>
      <Sequence
        name="Código"
        from={1530}
        durationInFrames={90}
        premountFor={fps}
      >
        <CodeScene language={language} />
      </Sequence>
      <Sequence
        name="Cierre"
        from={1620}
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
