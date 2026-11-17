import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { LOOP_FADE, MONTAGE, clipFolder, clipFrame, shotStarts, type Framing, type MontageId, type MontageShot } from "./montaje";

/**
 * El hero «El equipo» armado con sus cuadros de partida y, donde ya existen,
 * sus clips animados (como secuencia de cuadros). Todo sale del número de
 * cuadro: sin transiciones de CSS ni animaciones del navegador.
 */

const pad = (n: number) => String(n).padStart(4, "0");

function frameStyle(framing: Framing) {
  const origin = `${framing.x * 100}% ${framing.y * 100}%`;
  return { objectPosition: origin, transformOrigin: origin, transform: `scale(${framing.scale})` };
}

function mix(from: Framing, to: Framing, progress: number): Framing {
  return {
    scale: from.scale + (to.scale - from.scale) * progress,
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
}

/** El cuadro que se ve en un momento del plano: el del clip si lo tiene, o el cuadro quieto. */
function shotSource(shot: MontageShot, frame: number) {
  if (!shot.clip) return staticFile(shot.file);
  return staticFile(`${clipFolder(shot.clip.file)}/${pad(clipFrame(shot.clip, frame, shot.frames))}.jpg`);
}

function Shot({ shot }: { shot: MontageShot }) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, shot.frames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0A" }}>
      <Img src={shotSource(shot, Math.max(0, frame))} style={{ width: "100%", height: "100%", objectFit: "cover", ...frameStyle(mix(shot.from, shot.to, progress)) }} />
    </AbsoluteFill>
  );
}

export function HeroMontaje({ id }: { id: MontageId }) {
  const frame = useCurrentFrame();
  const shots = MONTAGE[id];
  const starts = shotStarts(id);
  const total = starts[starts.length - 1]! + shots[shots.length - 1]!.frames;
  const first = shots[0]!;
  // El final se funde con el primer cuadro: el bucle del sitio no salta.
  const loop = interpolate(frame, [total - LOOP_FADE, total - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0A" }}>
      {shots.map((shot, index) => (
        <Sequence key={`${shot.id}-${index}`} from={starts[index]} durationInFrames={shot.frames}>
          <Shot shot={shot} />
        </Sequence>
      ))}
      {loop > 0 && (
        <AbsoluteFill style={{ opacity: loop }}>
          <Img src={shotSource(first, 0)} style={{ width: "100%", height: "100%", objectFit: "cover", ...frameStyle(first.from) }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
