import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { reelBeatLayout, reelCasoLayout, reelFirmaLayout, slideLayout } from "@/data/social/layout";
import type { CarruselVideoProps, ImagenesProp, ReelCasoProps, ReelTextoProps, SlideProps } from "@/data/social/render";
import { ecoDe, frames, invert, reelCasoBeats, reelTextoBeats, SLIDE_SECONDS, tonoDeDiapositiva, type Beat } from "@/data/social/timing";
import { socialSafeArea, SOCIAL_FORMATS, type Diapositiva, type Formato, type Tono } from "@/data/social/types";
import { EASE_IN_OUT, EASE_OUT, FILM_FONTS, progress } from "../films/scenes/theme";
import { Eco, ElementsLayer, Grain, SegmentedProgress, SOCIAL_COLORS, SocialFrame } from "./SocialKit";

/**
 * Composiciones de las piezas de redes (las registra remotion/socialRoot.tsx).
 * Blanco y negro con energía: la fuerza sale del movimiento (golpes de escala,
 * barridos, flashes), de la escala (ecos gigantes en contorno) y de la
 * textura (grano). La geometría del texto viene de data/social/layout.ts.
 */

const sizesOf = (imagenes: ImagenesProp) => Object.fromEntries(Object.entries(imagenes).map(([slot, image]) => [slot, { w: image.w, h: image.h }]));

/** Palabra gigante de la portada: el énfasis o la palabra más larga del título. */
const ecoDeDiapositiva = (slide: Diapositiva) => (slide.tipo === "portada" ? ecoDe(slide.titulo) : "");

/** Hilo continuo: cruza todas las diapositivas a la misma altura; el punto marca dónde estás. */
function Hilo({ formato, pagina, tono }: { formato: Formato; pagina: { n: number; total: number }; tono: Tono }) {
  const frame = useCurrentFrame();
  const { width, height } = SOCIAL_FORMATS[formato];
  const c = SOCIAL_COLORS[tono];
  const safe = socialSafeArea(formato);
  const y = Math.round((safe.y + safe.h + height) / 2);
  const x = (width * (pagina.n - 0.5)) / pagina.total;
  const draw = progress(frame, 2, 26, EASE_OUT);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: y, width, height: 2, background: c.line }} />
      <div style={{ position: "absolute", left: 0, top: y, width: x * draw, height: 2, background: c.fg }} />
      <div style={{ position: "absolute", left: x - 7, top: y - 6, width: 14, height: 14, borderRadius: 14, background: c.fg, transform: `scale(${draw})` }} />
    </>
  );
}

/** Si el rótulo ya numera ("01 · Contexto"), el número gigante usa ese; si no, el de página. */
function numeroDeRotulo(slide: Diapositiva) {
  const match = "kicker" in slide && slide.kicker ? slide.kicker.match(/^(\d{1,2})(?!\d)/) : null;
  return match ? Number(match[1]) : undefined;
}

/** Número de página gigante en contorno, recortado contra el borde derecho. */
function NumeroGigante({ n, tono, formato }: { n: number; tono: Tono; formato: Formato }) {
  const frame = useCurrentFrame();
  const { width, height } = SOCIAL_FORMATS[formato];
  const c = SOCIAL_COLORS[tono];
  const size = formato === "cuadrado" ? 560 : 680;
  const show = progress(frame, 0, 22, EASE_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: width - size * 0.92,
        top: height - size * 0.98,
        fontFamily: FILM_FONTS.body,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.06em",
        color: "transparent",
        WebkitTextStroke: `2px ${c.fg}`,
        opacity: 0.12 * show,
        transform: `translateY(${(1 - show) * 60}px)`,
      }}
    >
      {String(n).padStart(2, "0")}
    </div>
  );
}

/** Indicador de "deslizá" en la portada: una flecha que empuja hacia la derecha. */
function Desliza({ formato, tono }: { formato: Formato; tono: Tono }) {
  const frame = useCurrentFrame();
  const safe = socialSafeArea(formato);
  const c = SOCIAL_COLORS[tono];
  const nudge = 14 * Math.max(0, Math.sin((frame / 30) * Math.PI * 1.4));
  const show = progress(frame, 30, 50, EASE_OUT);
  const y = safe.y + safe.h - 30;
  const x = safe.x + safe.w / 2 - 110;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: show, color: c.fg, fontFamily: FILM_FONTS.mono, fontWeight: 700, fontSize: 20, letterSpacing: "0.14em" }}>
      DESLIZÁ
      <div style={{ position: "relative", width: 90, height: 2, background: c.fg, transform: `translateX(${nudge}px)` }}>
        <div style={{ position: "absolute", right: -2, top: -6, width: 14, height: 14, borderTop: `2px solid ${c.fg}`, borderRight: `2px solid ${c.fg}`, transform: "rotate(45deg)" }} />
      </div>
    </div>
  );
}

function Slide({ formato, slide, pagina, tono, imagenes, exitAt }: SlideProps & { exitAt?: number }) {
  const layout = slideLayout(formato, slide, pagina, sizesOf(imagenes));
  const t = pagina ? tonoDeDiapositiva(slide, pagina.n - 1, tono) : slide.tipo === "cierre" ? invert(tono) : tono;
  const safe = socialSafeArea(formato);
  const contenido = pagina && slide.tipo !== "portada" && slide.tipo !== "cierre";
  return (
    <SocialFrame tono={t}>
      {slide.tipo === "portada" ? <Eco text={ecoDeDiapositiva(slide)} tono={t} duration={frames(SLIDE_SECONDS)} top={safe.y + safe.h * 0.22} /> : null}
      {contenido ? <NumeroGigante n={numeroDeRotulo(slide) ?? pagina.n} tono={t} formato={formato} /> : null}
      <ElementsLayer elements={layout.elements} tono={t} imagenes={imagenes} exitAt={exitAt} />
      {pagina && pagina.total > 1 ? <Hilo formato={formato} pagina={pagina} tono={t} /> : null}
      {slide.tipo === "portada" && pagina && pagina.total > 1 ? <Desliza formato={formato} tono={t} /> : null}
      <Grain opacity={t === "oscuro" ? 0.1 : 0.07} />
    </SocialFrame>
  );
}

/** Una diapositiva: el cuadro fijo (PNG) es el último, con todo armado. */
export function SocialSlide(props: SlideProps) {
  return <Slide {...props} />;
}

/** El carrusel como video (TikTok, Shorts o LinkedIn): una diapositiva por pulso, con golpe de entrada. */
export function SocialCarruselVideo({ formato, diapositivas, tono, imagenes }: CarruselVideoProps) {
  const each = frames(SLIDE_SECONDS);
  return (
    <AbsoluteFill>
      {diapositivas.map((slide, index) => (
        <Sequence key={index} from={index * each} durationInFrames={each}>
          <Entrada transicion={index === 0 ? "zoom" : index % 2 ? "barrido" : "golpe"} index={index} duration={each}>
            <Slide formato={formato} slide={slide} pagina={{ n: index + 1, total: diapositivas.length }} tono={tono} imagenes={imagenes} exitAt={index < diapositivas.length - 1 ? each - 8 : undefined} />
          </Entrada>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

/**
 * Cómo entra un pulso: golpe (la escala cae con un rebote), barrido (entra de
 * costado con desenfoque de movimiento), zoom (crece desde el fondo) o flash
 * (un destello del color opuesto). Al final, un empuje corto hacia el corte.
 */
function Entrada({ transicion, index, duration, children }: { transicion: Beat["transicion"]; index: number; duration: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = spring({ frame, fps, config: { damping: 12, stiffness: 190, mass: 0.6 } });
  const fast = progress(frame, 0, 9, EASE_OUT);
  const exit = progress(frame, duration - 5, duration, EASE_IN_OUT);
  let scale = 1 + 0.035 * exit;
  let x = 0;
  let blur = exit * 4;
  let opacity = 1;
  if (transicion === "golpe") scale *= 1.24 - 0.24 * hit;
  if (transicion === "barrido") {
    x = (index % 2 ? -1 : 1) * (1 - fast) * 100;
    blur += (1 - fast) * 22;
  }
  if (transicion === "zoom") {
    scale *= 0.62 + 0.38 * fast;
    blur += (1 - fast) * 14;
    opacity = progress(frame, 0, 4);
  }
  if (transicion === "flash") scale *= 1.08 - 0.08 * fast;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%) scale(${scale})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, opacity }}>
      {children}
      {transicion === "flash" ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: 1 - progress(frame, 1, 7, EASE_OUT), mixBlendMode: "difference" }} /> : null}
    </AbsoluteFill>
  );
}

/** Un pulso del reel: entrada con su transición, eco gigante detrás, cámara que se acerca y texto cinético. */
function BeatScene({ beat, index, layout, contador, imagenes = {} }: { beat: Beat; index: number; layout: ReturnType<typeof reelBeatLayout>; contador?: string; imagenes?: ImagenesProp }) {
  const frame = useCurrentFrame();
  const push = 1 + 0.045 * progress(frame, 0, beat.duration, EASE_OUT);
  const exitAt = beat.rol === "firma" ? undefined : beat.duration - 8;
  // El eco ocupa la zona baja del cuadro (debajo del texto), cruzando de lado a lado.
  const textos = layout.elements.filter((element) => element.kind === "text" || element.kind === "image");
  const bottom = Math.max(...textos.map((element) => (element.kind === "text" ? element.block.box.y + element.block.box.h : element.kind === "image" ? element.box.y + element.box.h : 0)));
  const ecoTop = Math.max(bottom + 230, 1480);
  return (
    <Entrada transicion={beat.transicion} index={index} duration={beat.duration}>
      <SocialFrame tono={beat.tono}>
        <Eco text={beat.eco} tono={beat.tono} duration={beat.duration} top={ecoTop} direction={index % 2 ? -1 : 1} strength={0.24} />
        <AbsoluteFill style={{ transform: `scale(${push})` }}>
          <ElementsLayer elements={layout.elements} tono={beat.tono} start={2} step={4} imagenes={imagenes} exitAt={exitAt} contador={contador} />
        </AbsoluteFill>
        <Grain opacity={beat.tono === "oscuro" ? 0.11 : 0.08} />
      </SocialFrame>
    </Entrada>
  );
}

const two = (n: number) => String(n).padStart(2, "0");

function Progreso({ beats }: { beats: Beat[] }) {
  const safe = socialSafeArea("reel");
  const segments = beats.filter((beat) => beat.rol !== "firma");
  return <SegmentedProgress segments={segments} box={{ x: safe.x, y: safe.y - 48, w: safe.w, h: 5 }} />;
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
            <BeatScene beat={beat} index={index} layout={layout} contador={beat.rol === "firma" ? undefined : `${two(index + 1)} / ${two(count)}`} />
          </Sequence>
        );
      })}
      <Progreso beats={beats} />
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
            <BeatScene beat={beat} index={index} layout={layout} imagenes={imagenes} contador={beat.rol === "firma" ? undefined : `${two(index + 1)} / ${two(count)}`} />
          </Sequence>
        );
      })}
      <Progreso beats={beats} />
    </AbsoluteFill>
  );
}
