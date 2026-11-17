import { Composition, registerRoot } from "remotion";
import { HeroBoceto } from "@/components/films/hero/HeroBoceto";
import { HeroMontaje } from "@/components/films/hero/HeroMontaje";
import { MONTAGE_SIZE, montageFrames, type MontageId } from "@/components/films/hero/montaje";
import { HERO_FPS, HERO_FRAMES, HERO_SIZE } from "@/components/films/hero/timing";
import { FontGate } from "./FontGate";

/**
 * Raíz de Remotion del hero «El equipo». No la carga el sitio: la usan
 * `npx tsx scripts/render-hero-boceto.ts` y `npx tsx scripts/render-hero-montaje.ts`.
 *
 * - hero-boceto: el boceto con sus rótulos (escena, avance y dónde va el título).
 * - hero-boceto-limpio: el mismo, sin rótulos.
 * - hero-montaje-ancho y hero-montaje-alto: los cuadros de partida montados
 *   con el reloj del film, para pantalla ancha y para teléfono.
 */

function Boceto({ labels }: { labels: boolean }) {
  return (
    <FontGate>
      <HeroBoceto labels={labels} />
    </FontGate>
  );
}

const MONTAGES: MontageId[] = ["ancho", "alto"];

export function HeroRoot() {
  return (
    <>
      <Composition id="hero-boceto" component={Boceto} durationInFrames={HERO_FRAMES} fps={HERO_FPS} width={HERO_SIZE.width} height={HERO_SIZE.height} defaultProps={{ labels: true }} />
      <Composition id="hero-boceto-limpio" component={Boceto} durationInFrames={HERO_FRAMES} fps={HERO_FPS} width={HERO_SIZE.width} height={HERO_SIZE.height} defaultProps={{ labels: false }} />
      {MONTAGES.map((id) => (
        <Composition key={id} id={`hero-montaje-${id}`} component={HeroMontaje} durationInFrames={montageFrames(id)} fps={HERO_FPS} width={MONTAGE_SIZE[id].width} height={MONTAGE_SIZE[id].height} defaultProps={{ id }} />
      ))}
    </>
  );
}

registerRoot(HeroRoot);
