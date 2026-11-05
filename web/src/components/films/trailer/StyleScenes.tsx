import type { CSSProperties, ReactNode } from "react";
import { Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { CONTENT_SAMPLES, getContentSample, type ContentSample, type SampleId } from "@/data/contentSamples";
import { CAROUSEL_SLIDE, CAROUSEL_SLIDES, CarouselSlide, CarruselSample } from "../muestras/CarruselSample";
import { SAMPLE_COMPONENTS, SAMPLE_SIZE } from "../muestras";
import { TRAILER_COPY } from "./copy";
import { C, EASE_IN, EASE_IN_OUT, EASE_OUT, FONT, Flash, SceneChip, SceneHeader, TIMING, box, hash, isFullBleed, ivory, lerp, ramp, sceneOf, shake, slam, useStage, wall, type Rect } from "./kit";

// ── El puente: de una toma a las webs ─────────────────────────────────────

const SITES = ["ad-media-solution", "america-tramites", "autohub-360", "doge-sm", "evowrap", "hub-profesional-ai", "lb-elite-wash-detail", "lnb-saas", "mr-studio-tattoo", "new-brothers-barberia", "punta-360", "rangel-oviedo-group", "truckers-choice"];
/** Capturas con personas: quedan fuera del mosaico. */
const WITH_PEOPLE = ["new-brothers-barberia-desktop-3", "truckers-choice-desktop-3"];
/** Capturas del sitio para el mosaico (doge-sm no cargó en el teléfono). */
const DESKTOP = SITES.flatMap((site) => [1, 2, 3].map((n) => `portfolio/shots/${site}-desktop-${n}.jpg`)).filter((src) => !WITH_PEOPLE.some((shot) => src.includes(shot)));
const MOBILE = SITES.filter((site) => site !== "doge-sm").flatMap((site) => [1, 2].map((n) => `portfolio/shots/${site}-mobile-${n}.jpg`));

/** Una tira de capturas que corre (vertical en el teléfono, horizontal en la pantalla ancha). */
function Lane({ shots, index, frame, land, tile, gap, across }: { shots: string[]; index: number; frame: number; land: boolean; tile: { width: number; height: number }; gap: number; across: number }) {
  const dir = index % 2 === 0 ? -1 : 1;
  // Arranca lento y acelera hacia la caída.
  const travel = frame * 5 + frame * frame * 0.11;
  const step = (land ? tile.width : tile.height) + gap;
  const shift = hash(index * 3.1) * step * 3 + dir * travel;
  const start = -(((shift % step) + step) % step);
  // El lado largo mide 1920 en los dos formatos.
  const count = Math.ceil(1920 / step) + 2;
  const first = Math.floor(shift / step);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const src = shots[(((index * 5 + (i + first) * 3) % shots.length) + shots.length) % shots.length];
        const along = start + i * step;
        const rect: Rect = land ? { x: along, y: across, width: tile.width, height: tile.height } : { x: across, y: along, width: tile.width, height: tile.height };
        return <Img key={i} src={staticFile(src)} style={{ ...box(rect), objectFit: "cover", borderRadius: 14, border: `1px solid ${ivory(0.12)}` }} />;
      })}
    </>
  );
}

/**
 * 07 · El puente (20–24 s). No solo una toma: las webs enteras. Corren las
 * capturas de los sitios que hizo Mario, cada vez más rápido, hasta la caída.
 */
export function BridgeScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].bridge;
  const lines = TIMING.cues.bridgeLines.map((at) => at - sceneOf("bridge").from);
  const rush = ramp(frame, 92, 120, EASE_IN);
  const lanes = land
    ? [0, 1, 2, 3].map((i) => ({ across: 40 + i * 260, tile: { width: 352, height: 220 } }))
    : [0, 1, 2, 3].map((i) => ({ across: 30 + i * 260, tile: { width: 240, height: 519 } }));
  const sub = ramp(frame, 52, 64);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: ramp(frame, 0, 10) * (land ? 0.78 : 0.62) + rush * 0.3, scale: `${lerp(1, 1.5, rush)}`, filter: `blur(${rush * 6}px) brightness(${lerp(0.9, 1.25, rush)})` }}>
        {lanes.map((lane, i) => (
          <Lane key={i} shots={land ? DESKTOP : MOBILE} index={i} frame={frame} land={land} tile={lane.tile} gap={20} across={lane.across} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: land
            ? `radial-gradient(50% 46% at 50% 50%, ${wall(0.95)} 0%, ${wall(0.8)} 62%, ${wall(0.12)} 100%)`
            : `radial-gradient(90% 42% at 50% 50%, ${wall(0.92)} 0%, ${wall(0.66)} 55%, ${wall(0.2)} 100%)`,
          opacity: 1 - rush * 0.7,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: land ? 330 : 760, textAlign: "center", opacity: 1 - rush }}>
        {copy.lines.map((line, i) => {
          const s = slam(frame, lines[i], 7);
          return (
            <div key={line} style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: land ? 104 : 92, lineHeight: 1.12, letterSpacing: "-0.03em", color: i === 1 ? C.signal : C.ivory, opacity: s.opacity, scale: `${s.scale}`, filter: `blur(${s.blur}px)`, whiteSpace: "nowrap" }}>
              {line}
            </div>
          );
        })}
        <div style={{ marginTop: land ? 34 : 40, fontFamily: FONT.body, fontWeight: 500, fontSize: land ? 40 : 44, color: ivory(0.78), opacity: sub, translate: `0 ${(1 - sub) * 20}px` }}>{copy.sub}</div>
      </div>
      {lines.map((at) => (
        <Flash key={at} frame={frame} at={at} peak={0.14} length={5} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: C.ivory, opacity: ramp(frame, 112, 120, EASE_IN) * 0.5 }} />
    </div>
  );
}

// ── Los siete estilos ─────────────────────────────────────────────────────

/** Desde qué cuadro de cada muestra arranca su tramo en el trailer. */
const TRAILER_OFFSET: Record<SampleId, number> = { persona: 0, empresa: 8, vsl: 0, reel: 30, historia: 50, cuadrado: 0, carrusel: 0 };

/** Dónde va el rótulo cuando la muestra llena la pantalla: en un lugar libre de su propia interfaz. */
const LABEL_SPOT: Partial<Record<SampleId, CSSProperties>> = {
  empresa: { left: 56, bottom: 12 }, // dentro de la franja de cine
  vsl: { left: 56, bottom: 118 }, // sobre los capítulos del reproductor
  reel: { left: 40, top: 40 },
  historia: { left: 40, bottom: 156 },
};

/** Encaja una muestra (su tamaño nativo) dentro de una caja, centrada. */
function fit(id: SampleId, area: Rect): Rect & { scale: number } {
  const native = SAMPLE_SIZE[getContentSample(id).aspect];
  const scale = Math.min(area.width / native.width, area.height / native.height);
  const width = native.width * scale;
  const height = native.height * scale;
  return { x: area.x + (area.width - width) / 2, y: area.y + (area.height - height) / 2, width, height, scale };
}

/** Un pulso mínimo en cada golpe: la imagen respira con la música. */
const beatPulse = (frame: number, amount = 0.012) => 1 + amount * (1 - (frame % TIMING.beat) / TIMING.beat) ** 3;

/** La muestra a su tamaño nativo, escalada y corriendo desde `offset`. */
function SampleRun({ id, language, scale, offset, slideFrames = 30 }: { id: SampleId; language: FilmLanguage; scale: number; offset: number; slideFrames?: number }) {
  const native = SAMPLE_SIZE[getContentSample(id).aspect];
  const Sample = SAMPLE_COMPONENTS[id];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: native.width, height: native.height, scale: `${scale}`, transformOrigin: "0 0" }}>
      <Sequence from={-offset} layout="none">
        {id === "carrusel" ? <CarruselSample language={language} slideFrames={slideFrames} /> : <Sample language={language} />}
      </Sequence>
    </div>
  );
}

/** Una muestra corriendo dentro de su tarjeta. */
function SampleCard({ id, language, rect, offset, style }: { id: SampleId; language: FilmLanguage; rect: Rect & { scale: number }; offset: number; style?: CSSProperties }) {
  return (
    <div style={{ ...box(rect), overflow: "hidden", borderRadius: 22, border: `1px solid ${ivory(0.16)}`, boxShadow: `0 40px 110px ${wall(0.75)}`, background: C.relief, ...style }}>
      <SampleRun id={id} language={language} scale={rect.scale} offset={offset} />
    </div>
  );
}

/** La misma muestra, enorme y desenfocada, como luz de fondo de su escena. */
function SampleAmbient({ id, language, offset }: { id: SampleId; language: FilmLanguage; offset: number }) {
  const { width, height } = useStage();
  const native = SAMPLE_SIZE[getContentSample(id).aspect];
  const scale = Math.max(width / native.width, height / native.height) * 1.1;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.32, filter: "blur(46px) saturate(1.25)" }}>
      <div style={{ position: "absolute", left: (width - native.width * scale) / 2, top: (height - native.height * scale) / 2 }}>
        <SampleRun id={id} language={language} scale={scale} offset={offset} />
      </div>
    </div>
  );
}

/** El índice de los siete estilos, con el actual marcado. */
function StyleIndex({ active, language, land }: { active: number; language: FilmLanguage; land: boolean }) {
  return (
    <div style={land ? { position: "absolute", left: 110, top: 640, display: "flex", flexDirection: "column", gap: 10 } : { position: "absolute", left: 80, right: 80, top: 1678, display: "flex", justifyContent: "space-between" }}>
      {CONTENT_SAMPLES.map((sample, i) => {
        const on = i === active;
        return (
          <div key={sample.id} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT.mono, fontSize: land ? 21 : 17, letterSpacing: "0.1em", textTransform: "uppercase", color: on ? C.signal : i < active ? ivory(0.55) : ivory(0.3) }}>
            {land ? <span style={{ width: 28 }}>{String(i + 1).padStart(2, "0")}</span> : null}
            <span style={{ width: on ? 26 : 8, height: 3, background: on ? C.signal : "transparent", display: land ? "block" : "none" }} />
            <span>{sample.style[language]}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Los textos de un estilo: número, nombre, frase y de dónde sale el material. */
function styleTexts(sample: ContentSample, index: number, language: FilmLanguage) {
  const copy = TRAILER_COPY[language].styles;
  return {
    number: `${String(index + 1).padStart(2, "0")} / ${String(CONTENT_SAMPLES.length).padStart(2, "0")}`,
    chip: copy.chip,
    name: sample.style[language],
    pitch: sample.pitch[language],
    source: sample.id === "persona" ? copy.own : copy.site.replace("{brand}", sample.brand),
  };
}

/** El rótulo sobre una muestra a pantalla completa: entra desde el borde y deja ver la pieza. */
function StyleLabel({ sample, index, language, land, frame }: { sample: ContentSample; index: number; language: FilmLanguage; land: boolean; frame: number }) {
  const text = styleTexts(sample, index, language);
  const t = ramp(frame, 2, 13, EASE_OUT);
  // La historia tiene poco lugar libre: va en una sola fila, sobre la barra de respuesta.
  const tight = sample.id === "historia";
  const row = land || tight;
  return (
    <div style={{ position: "absolute", ...LABEL_SPOT[sample.id], padding: row ? "10px 24px 12px" : "20px 28px 24px", borderRadius: 18, background: wall(0.78), border: `1px solid ${ivory(0.16)}`, opacity: t, translate: `${(1 - t) * -60}px 0` }}>
      <div style={{ display: "flex", flexDirection: row ? "row" : "column", alignItems: row ? "center" : "flex-start", gap: row ? 22 : 12 }}>
        {tight ? null : <SceneChip left={text.chip} right={text.number} style={{ fontSize: 18, padding: "6px 14px" }} />}
        <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: tight ? 48 : land ? 56 : 84, lineHeight: 1, letterSpacing: "-0.035em", color: C.ivory, whiteSpace: "nowrap" }}>{text.name}</span>
        <span style={{ fontFamily: FONT.body, fontWeight: 500, fontSize: tight ? 28 : land ? 34 : 38, letterSpacing: "-0.02em", color: ivory(0.82), whiteSpace: "nowrap" }}>{text.pitch}</span>
      </div>
      <div style={{ marginTop: row ? 6 : 10, fontFamily: FONT.mono, fontSize: tight ? 17 : 19, letterSpacing: "0.08em", color: ivory(0.58) }}>{text.source}</div>
    </div>
  );
}

/** El carrusel en horizontal: la tira de láminas se desliza, una por cada dos pulsos. */
function CarouselStrip({ language, frame }: { language: FilmLanguage; frame: number }) {
  const height = 700;
  const scale = height / CAROUSEL_SLIDE.height;
  const width = CAROUSEL_SLIDE.width * scale;
  const step = width + 28;
  const beats = TIMING.beat * 2;
  const move = Math.floor(frame / beats) + ramp(frame % beats, beats - 12, beats, EASE_IN_OUT);
  const enter = 1 - ramp(frame, 0, 12, EASE_OUT);
  return (
    <>
      {Array.from({ length: CAROUSEL_SLIDES }, (_, i) => {
        const x = 110 + (i - move + enter * 1.2) * step;
        if (x < -width || x > 1920) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 300, width, height, overflow: "hidden", borderRadius: 18, border: `1px solid ${ivory(0.16)}`, boxShadow: `0 30px 90px ${wall(0.7)}` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: CAROUSEL_SLIDE.width, height: CAROUSEL_SLIDE.height, scale: `${scale}`, transformOrigin: "0 0" }}>
              <CarouselSlide index={i} language={language} t={ramp(frame, 0, 120, (v) => v)} />
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * Barrido entre estilos: el corte cae en el pulso, y la imagen sale y entra
 * con velocidad en el mismo sentido. El primer estilo entra con la caída.
 */
function whip(frame: number, duration: number, index: number, span: number) {
  const out = ramp(frame, duration - 6, duration, EASE_IN);
  const into = index === 0 ? 0 : 1 - ramp(frame, 0, 7, EASE_OUT);
  const exitSide = index % 2 === 0 ? -1 : 1;
  const enterSide = index % 2 === 1 ? -1 : 1;
  // Crece lo justo para que el desplazamiento no deje ver el borde de la escena.
  return { x: (out * exitSide - into * enterSide) * span, blur: (out + into) * 12, scale: 1 + (out + into) * 0.34 };
}

/**
 * 08–14 · Los estilos (24–47 s). Cada uno es una muestra terminada, con la
 * marca de la web de donde sale su material: persona, empresa, VSL, reel,
 * historia, cuadrado y carrusel, un corte por estilo en el pulso. Las que
 * tienen el mismo formato que el video van a pantalla completa.
 */
export function StyleScene({ id, language }: { id: SampleId; language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { width, land } = useStage();
  const sample = getContentSample(id);
  const index = CONTENT_SAMPLES.findIndex((s) => s.id === id);
  const text = styleTexts(sample, index, language);
  const { duration } = sceneOf(id);
  const offset = TRAILER_OFFSET[id];
  const isDrop = index === 0;
  const hit = shake(frame, 0, isDrop ? 16 : 8, isDrop ? 14 : 9);
  const sweep = whip(frame, duration, index, land ? 300 : 180);
  const pulse = beatPulse(frame);
  const root: CSSProperties = { position: "absolute", inset: 0, background: C.wall, overflow: "hidden", translate: `${hit.x + sweep.x}px ${hit.y}px`, scale: `${sweep.scale}`, filter: sweep.blur > 0.1 ? `blur(${sweep.blur}px)` : undefined };

  if (isFullBleed(id, land)) {
    const scale = width / SAMPLE_SIZE[sample.aspect].width;
    return (
      <div style={root}>
        <div style={{ position: "absolute", inset: 0, scale: `${pulse}` }}>
          <SampleRun id={id} language={language} scale={scale} offset={offset} />
        </div>
        <StyleLabel sample={sample} index={index} language={language} land={land} frame={frame} />
        <Flash frame={frame} at={0} peak={0.12} length={4} />
      </div>
    );
  }

  const enter = ramp(frame, 0, 6, EASE_OUT);
  const name = slam(frame, 0, 7);
  const pitch = ramp(frame, 5, 15);
  const source = ramp(frame, 11, 20);
  const stripped = land && id === "carrusel";
  // Los nombres largos («Personal brand») bajan de tamaño para no meterse debajo de la tarjeta.
  const nameSize = text.name.length > 10 ? (land ? 72 : 96) : land ? 104 : 120;
  // En vertical, las piezas 16:9 van de borde a borde.
  const wideInTall = !land && sample.aspect === "16:9";
  const area: Rect = land ? { x: 760, y: 110, width: 1060, height: 860 } : wideInTall ? { x: 0, y: 760, width: 1080, height: 608 } : { x: 80, y: 540, width: 920, height: 1110 };
  const nameStyle: CSSProperties = { fontFamily: FONT.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.035em", color: C.ivory, opacity: name.opacity, scale: `${name.scale}`, filter: `blur(${name.blur}px)`, transformOrigin: "left center", whiteSpace: "nowrap" };
  const pitchStyle: CSSProperties = { fontFamily: FONT.body, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: ivory(0.82), opacity: pitch, translate: `0 ${(1 - pitch) * 18}px` };

  return (
    <div style={root}>
      <SampleAmbient id={id} language={language} offset={offset} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: land
            ? `linear-gradient(90deg, ${wall(0.92)} 0%, ${wall(0.78)} 36%, ${wall(0.35)} 100%)`
            : wideInTall
              ? `linear-gradient(180deg, ${wall(0.92)} 0%, ${wall(0.5)} 34%, ${wall(0.2)} 60%, ${wall(0.7)} 100%)`
              : `linear-gradient(180deg, ${wall(0.92)} 0%, ${wall(0.8)} 28%, ${wall(0.4)} 60%, ${wall(0.85)} 100%)`,
        }}
      />
      {stripped ? (
        <>
          <div style={{ position: "absolute", left: 110, right: 110, top: 96 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <SceneChip left={text.chip} right={text.number} />
              <span style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.12em", color: ivory(0.6) }}>{sample.aspect}</span>
              <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.08em", color: ivory(0.58), opacity: source }}>{text.source}</span>
            </div>
            <div style={{ marginTop: 20, display: "flex", alignItems: "baseline", gap: 30 }}>
              <span style={{ ...nameStyle, fontSize: 92 }}>{text.name}</span>
              <span style={{ ...pitchStyle, fontSize: 42 }}>{text.pitch}</span>
            </div>
          </div>
          <CarouselStrip language={language} frame={frame} />
        </>
      ) : (
        <>
          <div style={{ position: "absolute", ...(land ? { left: 110, top: 150, width: 600 } : { left: 80, right: 80, top: 170 }) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SceneChip left={text.chip} right={text.number} />
              <span style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.12em", color: ivory(0.6) }}>{sample.aspect}</span>
            </div>
            <div style={{ ...nameStyle, marginTop: 26, fontSize: nameSize }}>{text.name}</div>
            <div style={{ ...pitchStyle, marginTop: 22, fontSize: 46 }}>{text.pitch}</div>
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: land ? 20 : 22, letterSpacing: "0.08em", color: ivory(0.58), opacity: source, whiteSpace: "nowrap" }}>{text.source}</div>
          </div>
          <SampleCard
            id={id}
            language={language}
            rect={fit(id, area)}
            offset={offset}
            style={{ opacity: enter, scale: `${lerp(1.06, 1, enter) * pulse}`, filter: `blur(${(1 - enter) * 8}px)`, ...(wideInTall ? { borderRadius: 0, borderLeft: "none", borderRight: "none" } : null) }}
          />
          <StyleIndex active={index} language={language} land={land} />
        </>
      )}
      <Flash frame={frame} at={0} peak={isDrop ? 0.6 : 0.12} length={isDrop ? 10 : 4} />
    </div>
  );
}

// ── El muro: las siete juntas, en los dos idiomas ─────────────────────────

/** Cambia un texto por otro con letras que giran (determinístico). */
function scramble(from: string, to: string, frame: number, at: number) {
  if (frame < at) return from;
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const length = Math.max(from.length, to.length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    const settle = at + 3 + i * 0.6;
    if (frame >= settle) out += to[i] ?? "";
    else if (to[i] === " " || from[i] === " ") out += " ";
    else out += glyphs[Math.floor(hash(i * 13 + frame) * glyphs.length)];
  }
  return out;
}

/** Dónde cae cada muestra en el muro: centro, ancho, giro y qué tramo muestra. */
const WALL: Record<"portrait" | "landscape", Record<SampleId, { cx: number; cy: number; width: number; rotate: number; offset: number }>> = {
  portrait: {
    empresa: { cx: 370, cy: 600, width: 620, rotate: -3, offset: 196 },
    cuadrado: { cx: 840, cy: 590, width: 330, rotate: 4, offset: 196 },
    reel: { cx: 220, cy: 1060, width: 300, rotate: -4, offset: 190 },
    historia: { cx: 545, cy: 1030, width: 300, rotate: 2, offset: 140 },
    persona: { cx: 875, cy: 1070, width: 300, rotate: 5, offset: 190 },
    vsl: { cx: 380, cy: 1475, width: 600, rotate: 3, offset: 196 },
    carrusel: { cx: 860, cy: 1480, width: 310, rotate: -3, offset: 0 },
  },
  landscape: {
    reel: { cx: 270, cy: 600, width: 400, rotate: -3, offset: 190 },
    historia: { cx: 690, cy: 610, width: 400, rotate: 2, offset: 140 },
    empresa: { cx: 1190, cy: 350, width: 560, rotate: -2, offset: 196 },
    vsl: { cx: 1210, cy: 760, width: 560, rotate: 2, offset: 196 },
    persona: { cx: 1660, cy: 370, width: 300, rotate: 3, offset: 190 },
    carrusel: { cx: 1670, cy: 780, width: 300, rotate: -3, offset: 0 },
    cuadrado: { cx: 1450, cy: 555, width: 270, rotate: 4, offset: 196 },
  },
};

/**
 * 15 · El muro (47–51 s). Las siete muestras juntas; en el pulso cambian de
 * idioma, y una persona las firma: «Revisado por Mario».
 */
export function WallScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].wall;
  const other: FilmLanguage = language === "es" ? "en" : "es";
  const flipAt = TIMING.cues.wallFlip - sceneOf("wall").from;
  const stampAt = TIMING.cues.wallStamp - sceneOf("wall").from;
  const flipped = frame >= flipAt;
  const stamp = slam(frame, stampAt, 8);
  const hit = shake(frame, stampAt, 9, 10);
  const exit = ramp(frame, 108, 120, EASE_IN);
  const layout = WALL[land ? "landscape" : "portrait"];
  const center = land ? { x: 960, y: 560 } : { x: 540, y: 1040 };
  const line = scramble(copy.line, TRAILER_COPY[other].wall.line, frame, flipAt);

  const toggle: ReactNode = (
    <div style={{ display: "flex", borderRadius: 999, border: `1.5px solid ${ivory(0.22)}`, overflow: "hidden", fontFamily: FONT.mono, fontSize: 21, letterSpacing: "0.12em" }}>
      {[language, other].map((lang, i) => {
        const on = flipped ? i === 1 : i === 0;
        return (
          <span key={lang} style={{ padding: "9px 18px", background: on ? C.signal : "transparent", color: on ? C.wall : ivory(0.7) }}>
            {lang.toUpperCase()}
          </span>
        );
      })}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall, translate: `${hit.x}px ${hit.y}px` }}>
      {land ? (
        <div style={{ position: "absolute", left: 110, right: 110, top: 96, display: "flex", alignItems: "center", gap: 28, opacity: 1 - exit }}>
          <SceneChip left="05" right={copy.chip} style={{ opacity: ramp(frame, -4, 8) }} />
          <div style={{ fontFamily: FONT.body, fontWeight: 500, fontSize: 46, letterSpacing: "-0.025em", color: C.ivory }}>{line}</div>
          <div style={{ marginLeft: "auto" }}>{toggle}</div>
        </div>
      ) : (
        <SceneHeader index={5} chip={copy.chip} line={line} frame={frame} exitAt={108} right={toggle} />
      )}
      {CONTENT_SAMPLES.map((sample, i) => {
        const spot = layout[sample.id];
        const native = SAMPLE_SIZE[sample.aspect];
        const scale = spot.width / native.width;
        const height = native.height * scale;
        const t = ramp(frame, i * 3, 16 + i * 3, EASE_IN_OUT);
        const rect = { x: spot.cx - spot.width / 2, y: spot.cy - height / 2, width: spot.width, height, scale };
        return (
          <SampleCard
            key={`${sample.id}-${flipped ? other : language}`}
            id={sample.id}
            language={flipped ? other : language}
            rect={rect}
            offset={spot.offset}
            style={{ rotate: `${spot.rotate * t}deg`, opacity: t * (1 - exit), scale: `${lerp(0.5, 1, t) * lerp(1, 0.9, exit) * beatPulse(frame, 0.008)}`, translate: `${(1 - t) * (center.x - spot.cx)}px ${(1 - t) * (center.y - spot.cy)}px` }}
          />
        );
      })}
      <Flash frame={frame} at={flipAt} peak={0.18} length={5} />
      <div
        style={{
          position: "absolute",
          left: center.x,
          top: land ? 540 : 1000,
          translate: "-50% -50%",
          padding: "26px 40px",
          borderRadius: 24,
          border: `3px solid ${C.signal}`,
          background: wall(0.9),
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: FONT.body,
          fontWeight: 600,
          fontSize: land ? 56 : 54,
          letterSpacing: "-0.02em",
          color: C.signal,
          whiteSpace: "nowrap",
          opacity: stamp.opacity * (1 - exit),
          scale: `${stamp.scale}`,
          filter: `blur(${stamp.blur}px)`,
          rotate: "-5deg",
          boxShadow: `0 24px 80px ${wall(0.8)}`,
        }}
      >
        <svg width={52} height={52} viewBox="0 0 44 44">
          <circle cx={22} cy={22} r={20} fill={C.signal} />
          <path d="M12 23 L19 30 L32 15" fill="none" stroke={C.wall} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {copy.stamp}
      </div>
    </div>
  );
}
