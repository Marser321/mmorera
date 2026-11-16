import { useEffect, useState, type ReactNode } from "react";
import { Composition, continueRender, delayRender, registerRoot, staticFile } from "remotion";
import { VesperaReel, VesperaTrailer } from "@/components/films/vespera/VesperaFilm";
import { REEL_FRAMES, TRAILER_FRAMES, VESPERA_FPS, VESPERA_REEL_SIZE, VESPERA_SIZE } from "@/components/films/vespera/timing";

/**
 * Raíz de Remotion del tráiler y el reel de Vespera. No la carga el sitio: la
 * usa `npx tsx scripts/render-vespera.ts`.
 */

/** Las fuentes de la demo (Cormorant y Plus Jakarta Sans, OFL), desde film-sources/vespera/fonts. */
const FONTS = [
  { family: "Vespera Cormorant", file: "fonts/cormorant-normal.woff2", weight: "400 700", style: "normal" },
  { family: "Vespera Cormorant", file: "fonts/cormorant-italic.woff2", weight: "400 700", style: "italic" },
  { family: "Vespera Jakarta", file: "fonts/jakarta-normal.woff2", weight: "300 700", style: "normal" },
];

function VesperaFonts({ children }: { children: ReactNode }) {
  const [handle] = useState(() => delayRender("Fuentes de Vespera"));
  useEffect(() => {
    const faces = FONTS.map((font) => new FontFace(font.family, `url(${staticFile(font.file)})`, { weight: font.weight, style: font.style }));
    void Promise.all(faces.map((face) => face.load().then((loaded) => document.fonts.add(loaded)))).then(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
}

const Trailer = () => (
  <VesperaFonts>
    <VesperaTrailer />
  </VesperaFonts>
);

const Reel = () => (
  <VesperaFonts>
    <VesperaReel />
  </VesperaFonts>
);

export function VesperaRoot() {
  return (
    <>
      <Composition id="vespera-trailer" component={Trailer} durationInFrames={TRAILER_FRAMES} fps={VESPERA_FPS} width={VESPERA_SIZE.width} height={VESPERA_SIZE.height} />
      <Composition id="vespera-reel" component={Reel} durationInFrames={REEL_FRAMES} fps={VESPERA_FPS} width={VESPERA_REEL_SIZE.width} height={VESPERA_REEL_SIZE.height} />
    </>
  );
}

registerRoot(VesperaRoot);
