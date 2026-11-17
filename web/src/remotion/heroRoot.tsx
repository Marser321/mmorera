import { Composition, registerRoot } from "remotion";
import { HeroBoceto } from "@/components/films/hero/HeroBoceto";
import { HERO_FPS, HERO_FRAMES, HERO_SIZE } from "@/components/films/hero/timing";
import { FontGate } from "./FontGate";

/**
 * Raíz de Remotion del hero «El equipo». No la carga el sitio: la usa
 * `npx tsx scripts/render-hero-boceto.ts`.
 *
 * - hero-boceto: el boceto con sus rótulos (escena, avance y dónde va el título).
 * - hero-boceto-limpio: el mismo, sin rótulos.
 */

function Boceto({ labels }: { labels: boolean }) {
  return (
    <FontGate>
      <HeroBoceto labels={labels} />
    </FontGate>
  );
}

export function HeroRoot() {
  return (
    <>
      <Composition id="hero-boceto" component={Boceto} durationInFrames={HERO_FRAMES} fps={HERO_FPS} width={HERO_SIZE.width} height={HERO_SIZE.height} defaultProps={{ labels: true }} />
      <Composition id="hero-boceto-limpio" component={Boceto} durationInFrames={HERO_FRAMES} fps={HERO_FPS} width={HERO_SIZE.width} height={HERO_SIZE.height} defaultProps={{ labels: false }} />
    </>
  );
}

registerRoot(HeroRoot);
