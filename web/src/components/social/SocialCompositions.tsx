import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { reelBeatLayout, reelCasoLayout, reelComparacionLayout, reelConteoItemLayout, reelConteoNumeroLayout, reelEncuestaLayout, reelFirmaLayout, slideLayout } from "@/data/social/layout";
import type { CarruselVideoProps, ImagenesProp, ReelCasoProps, ReelComparacionProps, ReelConteoProps, ReelEncuestaProps, ReelTextoProps, SlideProps } from "@/data/social/render";
import { ecoDe, frames, invert, reelCasoBeats, reelComparacionBeats, reelConteoBeats, reelEncuestaBeats, reelTextoBeats, SLIDE_SECONDS, tonoDeDiapositiva, type Beat } from "@/data/social/timing";
import { socialSafeArea, SOCIAL_FORMATS, type Diapositiva, type Formato, type Tono } from "@/data/social/types";
import { EASE_IN_OUT, EASE_OUT, FILM_FONTS, progress } from "../films/scenes/theme";
import { Eco, ElementsLayer, Grain, SegmentedProgress, SOCIAL_COLORS, SocialFrame, TechnicalCornerCrosses } from "./SocialKit";

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
  const hit = spring({ frame, fps, config: { damping: 14, stiffness: 220, mass: 0.5 } });
  const fast = progress(frame, 0, 7, EASE_OUT);
  const exit = progress(frame, duration - 4, duration, EASE_IN_OUT);
  let scale = 1 + 0.02 * exit;
  let translateY = 0;
  let rotateX = 0;
  let rotateY = 0;
  let blur = exit * 2;
  let opacity = 1;

  if (transicion === "golpe") {
    // Punch fuerte frontal con rebote elástico seco
    scale *= 1.20 - 0.20 * hit;
    rotateX = (1 - fast) * 4;
  }
  if (transicion === "barrido") {
    // Punch-in angular en perspectiva (corte técnico) en lugar de desplazamiento lateral lento
    scale *= 1.15 - 0.15 * hit;
    rotateY = (index % 2 ? 1 : -1) * (1 - fast) * 3.5;
    translateY = (1 - fast) * 24;
    blur += (1 - fast) * 6;
  }
  if (transicion === "zoom") {
    // Zoom frontal decidido
    scale *= 0.86 + 0.14 * fast;
    blur += (1 - fast) * 6;
    opacity = progress(frame, 0, 3);
  }
  if (transicion === "flash") {
    scale *= 1.05 - 0.05 * fast;
  }

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
        transform: `translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        opacity,
      }}
    >
      {children}
      {transicion === "flash" ? (
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: 1 - progress(frame, 1, 6, EASE_OUT), mixBlendMode: "difference" }} />
      ) : null}
    </AbsoluteFill>
  );
}

/** Un pulso del reel: entrada con punch-in, perspectiva 3D, eco gigante detrás, dolly de cámara y texto cinético. */
function BeatScene({ beat, index, layout, contador, imagenes = {}, start, step }: { beat: Beat; index: number; layout: ReturnType<typeof reelBeatLayout>; contador?: string; imagenes?: ImagenesProp; start?: number; step?: number }) {
  const frame = useCurrentFrame();
  const push = 1 + 0.045 * progress(frame, 0, beat.duration, EASE_OUT);
  const tiltZ = Math.sin((frame / 45) * Math.PI) * 0.35;
  const exitAt = beat.rol === "firma" ? undefined : beat.duration - 6;
  // El eco ocupa la zona baja del cuadro (debajo del texto), cruzando de lado a lado.
  const textos = layout.elements.filter((element) => element.kind === "text" || element.kind === "image");
  const bottom = Math.max(...textos.map((element) => (element.kind === "text" ? element.block.box.y + element.block.box.h : element.kind === "image" ? element.box.y + element.box.h : 0)));
  const ecoTop = Math.max(bottom + 230, 1480);
  const isNum = beat.id.startsWith("num-");
  const layerStart = start ?? (isNum ? 0 : 2);
  const layerStep = step ?? (isNum ? 0 : 4);
  return (
    <Entrada transicion={beat.transicion} index={index} duration={beat.duration}>
      <SocialFrame tono={beat.tono} showGrid={true}>
        <TechnicalCornerCrosses tono={beat.tono} />
        {isNum ? null : <Eco text={beat.eco} tono={beat.tono} duration={beat.duration} top={ecoTop} direction={index % 2 ? -1 : 1} strength={0.22} />}
        <AbsoluteFill style={{ transform: `scale(${push}) rotateZ(${tiltZ}deg)`, transformOrigin: "50% 45%" }}>
          <ElementsLayer elements={layout.elements} tono={beat.tono} start={layerStart} step={layerStep} imagenes={imagenes} exitAt={exitAt} contador={contador} />
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

/** Línea de barrido óptico horizontal que corta la pantalla en el cambio de etapa. */
function HorizontalSweepCut({ duration = 10, y }: { duration?: number; y: number }) {
  const frame = useCurrentFrame();
  const sweep = progress(frame, 0, duration, EASE_OUT);
  if (frame >= duration) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: "100%",
        height: 3,
        background: "#FFFFFF",
        transformOrigin: "left",
        transform: `scaleX(${sweep})`,
        boxShadow: "0 0 16px rgba(255,255,255,0.85)",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

/** Reel de conteo (9:16): cuenta regresiva con números gigantes de golpe y pulsos de ítem con barrido. */
export function SocialReelConteo({ salida }: ReelConteoProps) {
  const beats = reelConteoBeats(salida);
  const count = beats.length - 1;
  return (
    <AbsoluteFill style={{ background: SOCIAL_COLORS[salida.tono ?? "oscuro"].bg }}>
      {beats.map((beat, index) => {
        let layout;
        if (beat.rol === "firma") {
          layout = reelFirmaLayout(beat.texto);
        } else if (beat.id === "gancho") {
          layout = reelBeatLayout(beat.texto, "gancho");
        } else if (beat.id.startsWith("num-")) {
          const num = parseInt(beat.texto, 10);
          layout = reelConteoNumeroLayout(num);
        } else if (beat.id.startsWith("item-")) {
          const num = parseInt(beat.kicker?.replace("N.º ", "") ?? "1", 10);
          const item = salida.items[num - 1] ?? { titulo: "", texto: "" };
          layout = reelConteoItemLayout(item.titulo, item.texto, beat.kicker ?? `N.º ${num}`);
        } else {
          layout = reelBeatLayout(beat.texto, "remate");
        }

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

function ComparacionBeatScene({
  beat,
  index,
  salida,
  contador,
}: {
  beat: Beat;
  index: number;
  salida: ReelComparacionProps["salida"];
  contador?: string;
}) {
  let layout;
  if (beat.rol === "firma") {
    layout = reelFirmaLayout(beat.texto);
  } else if (beat.id === "gancho") {
    layout = reelBeatLayout(beat.texto, "gancho");
  } else if (beat.id === "antes") {
    layout = reelComparacionLayout("antes", salida.antes, salida.despues);
  } else if (beat.id === "despues") {
    layout = reelComparacionLayout("despues", salida.antes, salida.despues);
  } else if (beat.id === "juntas") {
    layout = reelComparacionLayout("juntas", salida.antes, salida.despues);
  } else {
    layout = reelBeatLayout(beat.texto, "remate");
  }

  const safe = socialSafeArea("reel");
  const cutY = safe.y + Math.floor(safe.h / 2);

  return (
    <>
      <BeatScene beat={beat} index={index} layout={layout} contador={contador} />
      {beat.id === "despues" ? <HorizontalSweepCut duration={10} y={cutY} /> : null}
    </>
  );
}

/** Reel de comparación (9:16): antes vs después con pantalla partida y corte seco con barrido horizontal. */
export function SocialReelComparacion({ salida }: ReelComparacionProps) {
  const beats = reelComparacionBeats(salida);
  const count = beats.length - 1;
  return (
    <AbsoluteFill style={{ background: SOCIAL_COLORS[salida.tono ?? "oscuro"].bg }}>
      {beats.map((beat, index) => (
        <Sequence key={beat.id} name={beat.id} from={beat.from} durationInFrames={beat.duration}>
          <ComparacionBeatScene beat={beat} index={index} salida={salida} contador={beat.rol === "firma" ? undefined : `${two(index + 1)} / ${two(count)}`} />
        </Sequence>
      ))}
      <Progreso beats={beats} />
    </AbsoluteFill>
  );
}

function EncuestaBeatScene({
  beat,
  index,
  salida,
  contador,
}: {
  beat: Beat;
  index: number;
  salida: ReelEncuestaProps["salida"];
  contador?: string;
}) {
  const frame = useCurrentFrame();
  let layout;
  if (beat.rol === "firma") {
    layout = reelFirmaLayout(beat.texto);
  } else if (beat.id === "gancho") {
    layout = reelBeatLayout(beat.texto, "gancho");
  } else if (beat.id.startsWith("opcion-")) {
    const optIndex = parseInt(beat.id.replace("opcion-", ""), 10) - 1;
    // Al entrar se invierte por 0,4 s (12 frames) y vuelve
    const activa = frame < 12 ? optIndex : undefined;
    layout = reelEncuestaLayout(salida.pregunta, salida.opciones, optIndex, activa);
  } else {
    // "todas-juntas"
    layout = reelEncuestaLayout(salida.pregunta, salida.opciones, salida.opciones.length - 1, undefined, beat.texto);
  }

  return <BeatScene beat={beat} index={index} layout={layout} contador={contador} />;
}

/** Reel de encuesta (9:16): opciones iluminadas sucesivamente y llamado a la acción. */
export function SocialReelEncuesta({ salida }: ReelEncuestaProps) {
  const beats = reelEncuestaBeats(salida);
  const count = beats.length - 1;
  return (
    <AbsoluteFill style={{ background: SOCIAL_COLORS[salida.tono ?? "oscuro"].bg }}>
      {beats.map((beat, index) => (
        <Sequence key={beat.id} name={beat.id} from={beat.from} durationInFrames={beat.duration}>
          <EncuestaBeatScene beat={beat} index={index} salida={salida} contador={beat.rol === "firma" ? undefined : `${two(index + 1)} / ${two(count)}`} />
        </Sequence>
      ))}
      <Progreso beats={beats} />
    </AbsoluteFill>
  );
}
