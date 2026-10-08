import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { reelBeatLayout, reelCasoLayout, reelFirmaLayout, slideLayout } from "@/data/social/layout";
import type { CarruselVideoProps, ImagenesProp, ReelCasoProps, ReelTextoProps, SlideProps } from "@/data/social/render";
import { frames, invert, reelCasoBeats, reelTextoBeats, SLIDE_SECONDS, totalFrames, type Beat } from "@/data/social/timing";
import { socialSafeArea, type Diapositiva, type Formato, type Tono } from "@/data/social/types";
import { EASE_IN_OUT, EASE_OUT, progress } from "../films/scenes/theme";
import { ElementsLayer, SOCIAL_COLORS, SocialFrame } from "./SocialKit";

/**
 * Composiciones de las piezas de redes (las registra remotion/socialRoot.tsx).
 * Todo movimiento sale del frame; la geometría viene de data/social/layout.ts.
 */

const sizesOf = (imagenes: ImagenesProp) => Object.fromEntries(Object.entries(imagenes).map(([slot, image]) => [slot, { w: image.w, h: image.h }]));

/** El cierre se invierte: es el signo de puntuación del carrusel. */
const tonoDe = (slide: Diapositiva, tono: Tono): Tono => (slide.tipo === "cierre" ? invert(tono) : tono);

function Slide({ formato, slide, pagina, tono, imagenes, exitAt }: SlideProps & { exitAt?: number }) {
  const layout = slideLayout(formato, slide, pagina, sizesOf(imagenes));
  const t = tonoDe(slide, tono);
  return (
    <SocialFrame tono={t}>
      <ElementsLayer elements={layout.elements} tono={t} imagenes={imagenes} exitAt={exitAt} />
    </SocialFrame>
  );
}

/** Una diapositiva: el cuadro fijo (PNG) es el último, con todo armado. */
export function SocialSlide(props: SlideProps) {
  return <Slide {...props} />;
}

/** El carrusel como video (TikTok, Shorts o LinkedIn): una diapositiva por pulso. */
export function SocialCarruselVideo({ formato, diapositivas, tono, imagenes }: CarruselVideoProps) {
  const each = frames(SLIDE_SECONDS);
  return (
    <AbsoluteFill>
      {diapositivas.map((slide, index) => (
        <Sequence key={index} from={index * each} durationInFrames={each}>
          <Slide formato={formato} slide={slide} pagina={{ n: index + 1, total: diapositivas.length }} tono={tono} imagenes={imagenes} exitAt={index < diapositivas.length - 1 ? each - 10 : undefined} />
        </Sequence>
      ))}
      <Progress formato={formato} total={diapositivas.length * each} tono={tono} />
    </AbsoluteFill>
  );
}

/** Barra de progreso fina sobre la zona segura: retiene la mirada hasta el final. */
function Progress({ formato, total, tono, tonoEn }: { formato: Formato; total: number; tono: Tono; tonoEn?: (frame: number) => Tono }) {
  const frame = useCurrentFrame();
  const safe = socialSafeArea(formato);
  const c = SOCIAL_COLORS[tonoEn ? tonoEn(frame) : tono];
  const y = formato === "reel" ? safe.y - 46 : safe.y - 40;
  return (
    <>
      <div style={{ position: "absolute", left: safe.x, top: y, width: safe.w, height: 3, background: c.line }} />
      <div style={{ position: "absolute", left: safe.x, top: y, width: safe.w * Math.min(1, frame / total), height: 3, background: c.fg }} />
    </>
  );
}

/**
 * Un pulso del reel: la cámara se acerca apenas mientras dura, el texto entra
 * por máscara y sale hacia arriba antes del corte. Si el color cambia respecto
 * del pulso anterior, el nuevo fondo sube como una cortina.
 */
function BeatScene({ beat, previous, layout, contador, imagenes = {} }: { beat: Beat; previous?: Beat; layout: ReturnType<typeof reelBeatLayout>; contador?: string; imagenes?: ImagenesProp }) {
  const frame = useCurrentFrame();
  const push = 1.035 - 0.035 * progress(frame, 0, beat.duration, EASE_OUT);
  const wipe = previous && previous.tono !== beat.tono ? progress(frame, 0, 9, EASE_IN_OUT) : 1;
  const exitAt = beat.rol === "firma" ? undefined : beat.duration - 9;
  return (
    <AbsoluteFill style={{ clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)` }}>
      <SocialFrame tono={beat.tono}>
        <AbsoluteFill style={{ transform: `scale(${push})` }}>
          <ElementsLayer elements={layout.elements} tono={beat.tono} start={3} step={5} imagenes={imagenes} exitAt={exitAt} contador={contador} />
        </AbsoluteFill>
      </SocialFrame>
    </AbsoluteFill>
  );
}

const two = (n: number) => String(n).padStart(2, "0");

function tonoEnFrame(beats: Beat[]) {
  return (frame: number) => (beats.find((beat) => frame >= beat.from && frame < beat.from + beat.duration) ?? beats[beats.length - 1]).tono;
}

/** Reel de texto (9:16): gancho → pulsos → remate invertido → firma. */
export function SocialReelTexto({ salida }: ReelTextoProps) {
  const beats = reelTextoBeats(salida);
  const count = beats.length - 1;
  return (
    <AbsoluteFill style={{ background: SOCIAL_COLORS[salida.tono ?? "oscuro"].bg }}>
      {beats.map((beat, index) => {
        const layout = beat.rol === "firma" ? reelFirmaLayout(beat.texto) : reelBeatLayout(beat.texto, beat.rol === "pulso" ? "pulso" : beat.rol === "remate" ? "remate" : "gancho", beat.kicker);
        return (
          <Sequence key={beat.id} name={beat.id} from={beat.from} durationInFrames={beat.duration}>
            <BeatScene beat={beat} previous={beats[index - 1]} layout={layout} contador={beat.rol === "firma" ? undefined : `${two(index + 1)} / ${two(count)}`} />
          </Sequence>
        );
      })}
      <Progress formato="reel" total={totalFrames(beats)} tono={salida.tono ?? "oscuro"} tonoEn={tonoEnFrame(beats)} />
    </AbsoluteFill>
  );
}

/** Reel de caso (9:16): el problema, tres decisiones sobre cuadros del film y el enlace al caso. */
export function SocialReelCaso({ salida, nombre, placas }: ReelCasoProps) {
  const beats = reelCasoBeats(salida, nombre);
  const count = beats.length - 1;
  return (
    <AbsoluteFill style={{ background: SOCIAL_COLORS.oscuro.bg }}>
      {beats.map((beat, index) => {
        const layout = beat.rol === "firma" ? reelFirmaLayout(beat.texto, `mmorera.agency/casos-de-exito/${salida.caso}`) : beat.rol === "remate" ? reelBeatLayout(beat.texto, "remate") : reelCasoLayout(beat.texto, beat.kicker ?? "", Boolean(beat.placa));
        const imagenes: ImagenesProp = beat.placa ? { placa: { src: placas[beat.placa], w: 1600, h: 900 } } : {};
        return (
          <Sequence key={beat.id} name={beat.id} from={beat.from} durationInFrames={beat.duration}>
            <BeatScene beat={beat} previous={beats[index - 1]} layout={layout} imagenes={imagenes} contador={beat.rol === "firma" ? undefined : `${two(index + 1)} / ${two(count)}`} />
          </Sequence>
        );
      })}
      <Progress formato="reel" total={totalFrames(beats)} tono="oscuro" tonoEn={tonoEnFrame(beats)} />
    </AbsoluteFill>
  );
}
