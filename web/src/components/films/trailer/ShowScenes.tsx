import { Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { PIECE_TITLE, TRAILER_COPY } from "./copy";
import { Piece } from "./Piece";
import { C, EASE_IN, FONT, Flash, Footage, LOOK, SHOTS, SceneHeader, TIMING, Tag, box, hash, ivory, lerp, ramp, shake, wall, type Rect } from "./kit";

const FULL: Rect = { x: 0, y: 0, width: 1080, height: 1920 };

/** Cuatro golpes del primer compás: tomas a pantalla completa, una por pulso. */
const PUNCHES = [
  { at: SHOTS.keys, focal: [0.5, 0.5] },
  { at: SHOTS.stylus, focal: [0.56, 0.5] },
  { at: SHOTS.face, focal: [0.47, 0.45] },
  { at: SHOTS.tablet, focal: [0.5, 0.5] },
] as const;

/** Tomas que rotan por las tres franjas del segundo compás. */
const STRIPS = [
  { at: SHOTS.graph, focal: [0.4, 0.5] },
  { at: SHOTS.motion, focal: [0.55, 0.45] },
  // La toma de los monitores corta a los 1,77 s: en movimiento arranca antes para no cruzar el corte.
  { at: SHOTS.monitors - 0.55, focal: [0.62, 0.45] },
  { at: SHOTS.shoulder, focal: [0.38, 0.45] },
  { at: SHOTS.keys, focal: [0.5, 0.5] },
] as const;

/** Indicador de pulso: cuatro cuadros que se encienden en cada golpe. */
function BeatMeter({ frame }: { frame: number }) {
  const beat = Math.floor(frame / TIMING.beat) % 4;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.12em", color: ivory(0.7) }}>
      <span>{TIMING.bpm} BPM</span>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ width: 22, height: 22, borderRadius: 5, background: i === beat ? C.signal : ivory(0.16) }} />
      ))}
    </div>
  );
}

/**
 * 07 · Ritmo (24–28 s), la caída. Primer compás: cuatro tomas a pantalla
 * completa, un corte por pulso. Segundo compás: tres franjas que se cruzan
 * como un multicámara y se cierran sobre la línea del medio.
 */
export function RhythmScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = TRAILER_COPY[language].rhythm;
  const beat = TIMING.beat;
  const inStrips = frame >= 60;
  const collapse = ramp(frame, 106, 120, EASE_IN);
  const punchIndex = Math.min(3, Math.floor(frame / beat));
  const punch = 1 - ramp(frame, punchIndex * beat, punchIndex * beat + 9);
  const hit = shake(frame, punchIndex * beat, 9, 8);
  const strips: Rect[] = [
    { x: 0, y: 468, width: 1080, height: 400 },
    { x: 0, y: 888, width: 1080, height: 400 },
    { x: 0, y: 1308, width: 1080, height: 400 },
  ];
  const stripBeat = Math.floor((frame - 60) / beat);
  const stripSlide = 1 - ramp(frame, 60 + Math.max(0, stripBeat) * beat, 60 + Math.max(0, stripBeat) * beat + 10);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      {!inStrips ? (
        <div style={{ position: "absolute", inset: 0, translate: `${hit.x}px ${hit.y}px` }}>
          {PUNCHES.map((shot, i) => (
            <Sequence key={shot.at} from={i * beat} durationInFrames={beat} premountFor={fps}>
              <Footage at={shot.at} play frame={FULL} focal={shot.focal} zoom={1 + punch * 0.14} filter={`${LOOK.graded} brightness(0.92)`} />
            </Sequence>
          ))}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${wall(0.88)} 0%, ${wall(0.55)} 22%, transparent 36%, transparent 80%, ${wall(0.6)} 100%)` }} />
        </div>
      ) : (
        strips.map((strip, i) => {
          const direction = i % 2 === 0 ? -1 : 1;
          return (
            <div key={i} style={{ ...box(strip), overflow: "hidden", translate: `${direction * stripSlide * 90}px 0`, scale: `1 ${1 - collapse}`, borderTop: `1px solid ${ivory(0.1)}`, borderBottom: `1px solid ${ivory(0.1)}` }}>
              {[0, 1, 2, 3].map((b) => {
                const shot = STRIPS[(i + b) % STRIPS.length];
                return (
                  <Sequence key={b} from={60 + b * beat} durationInFrames={beat} premountFor={fps}>
                    <Footage at={shot.at + hash(i + b) * 0.2} play frame={{ x: 0, y: 0, width: strip.width, height: strip.height }} focal={shot.focal} zoom={1.02} filter={LOOK.graded} />
                  </Sequence>
                );
              })}
            </div>
          );
        })
      )}
      <SceneHeader index={5} chip={copy.chip} line={copy.line} frame={frame} exitAt={110} right={<BeatMeter frame={frame} />} />
      {[0, 1, 2, 3].map((i) => (
        <Flash key={i} frame={frame} at={i * beat} peak={i === 0 ? 0.55 : 0.18} length={i === 0 ? 8 : 4} />
      ))}
      <Flash frame={frame} at={60} peak={0.18} length={4} />
    </div>
  );
}

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

/**
 * 08 · Formatos (28–32 s). La pieza se abre en cuatro proporciones, cada una
 * con su composición; en el pulso, los títulos cambian de idioma.
 */
export function FormatsScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const copy = TRAILER_COPY[language].formats;
  const other: FilmLanguage = language === "es" ? "en" : "es";
  const flipAt = TIMING.cues.formatsFlip - 840;
  const cards: Rect[] = [
    { x: 80, y: 488, width: 430, height: 764.4 },
    { x: 540, y: 488, width: 460, height: 575 },
    { x: 540, y: 1093, width: 460, height: 460 },
    { x: 80, y: 1282, width: 430, height: 241.9 },
  ];
  const origin = { x: 540, y: 1020 };
  const exit = ramp(frame, 108, 120, EASE_IN);
  const flipped = frame >= flipAt + 3;
  const lines = PIECE_TITLE[language].map((line, i) => scramble(line, PIECE_TITLE[other][i], frame, flipAt));

  const toggle = (
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
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <SceneHeader index={6} chip={copy.chip} line={copy.line} frame={frame} exitAt={110} right={toggle} />
      {cards.map((card, i) => {
        const t = ramp(frame, -4 + i * 2, 14 + i * 2);
        const x = lerp(origin.x - card.width / 2, card.x, t);
        const y = lerp(origin.y - card.height / 2, card.y, t);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: card.width, height: card.height, borderRadius: 20, overflow: "hidden", border: `1px solid ${ivory(0.14)}`, opacity: t * (1 - exit), scale: `${lerp(0.5, 1, t) * lerp(1, 0.94, exit)}`, boxShadow: `0 24px 70px ${wall(0.6)}` }}>
            <Piece width={card.width} height={card.height} lines={lines} label={null} />
            <Tag tone={i === 0 ? "signal" : "dark"} style={{ right: 12, top: 12, fontSize: 15, padding: "6px 11px", opacity: ramp(frame, 26 + i * 3, 34 + i * 3) }}>
              {copy.labels[i]}
            </Tag>
          </div>
        );
      })}
    </div>
  );
}
