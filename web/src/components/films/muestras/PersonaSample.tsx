import { Sequence, useCurrentFrame } from "remotion";
import { C, FONT, Footage, LOOK, Monogram, SHOTS, ivory, signal, wall } from "../trailer/kit";
import { SAMPLE_COPY } from "./copy";
import { EASE_IN_OUT, GrainFill, SampleCanvas, SampleTag, lerp, markedWords, ramp, type SampleProps } from "./kit";

const W = 1080;
const H = 1350;
const FULL = { x: 0, y: 0, width: W, height: H };

/**
 * Las tomas del film de autor, dos por subtítulo: un corte en cada medio
 * compás. Cada una corre un segundo sin cruzar un corte del film (los cortes
 * están en 1,75 · 3,58 · 5,17 · 6,67 · 7,96 · 9,67 y 11,83 s).
 */
const SHOTS_BY_HALF = [
  { at: SHOTS.frontal, focal: [0.68, 0.4] },
  { at: 0.7, focal: [0.62, 0.4] },
  { at: SHOTS.keys, focal: [0.5, 0.5] },
  { at: 4.0, focal: [0.4, 0.5] },
  { at: 6.8, focal: [0.56, 0.5] },
  { at: SHOTS.tablet, focal: [0.5, 0.5] },
] as const;

/** El cierre corre dos segundos sobre la toma de la cara (11,83–14,2 s). */
const CLOSING_SHOT = { at: 11.9, focal: [0.47, 0.42] } as const;

function Shot({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const shot = SHOTS_BY_HALF[index];
  // Cada toma entra cerca y se abre: el «punch-in» de los videos de marca personal.
  return <Footage at={shot.at} play frame={FULL} focal={shot.focal} zoom={lerp(1.16, 1.06, ramp(frame, 0, 30))} filter={`${LOOK.graded} brightness(0.9)`} />;
}

function Caption({ lines, frame }: { lines: readonly string[]; frame: number }) {
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 860, textAlign: "center" }}>
      {lines.map((line, row) => (
        <div key={line} style={{ marginTop: row === 0 ? 0 : 6 }}>
          {markedWords(line).map(({ word, marked }, i) => {
            const at = row * 16 + i * 3;
            const t = ramp(frame, at, at + 6);
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: "inline-block",
                  margin: "0 8px",
                  padding: marked ? "0 18px 8px" : "0 0 8px",
                  borderRadius: 16,
                  fontFamily: FONT.body,
                  fontWeight: 700,
                  fontSize: 100,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  color: marked ? C.wall : C.ivory,
                  background: marked ? C.signal : "transparent",
                  textShadow: marked ? "none" : `0 6px 30px ${wall(0.75)}`,
                  opacity: t,
                  scale: `${lerp(1.3, 1, t)}`,
                  translate: `0 ${(1 - t) * 22}px`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * Persona · Mario Morera (4:5, 8 s). El video de marca personal: el film de
 * autor cortado en el pulso, subtítulos grandes con la palabra clave marcada,
 * el nombre con su rol y la frase de la casa. La marca es la propia: «pared».
 */
export function PersonaSample({ language }: SampleProps) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].persona;
  const caption = Math.min(2, Math.floor(frame / 60));
  const end = ramp(frame, 180, 196, EASE_IN_OUT);
  const nameIn = ramp(frame, 186, 200, EASE_IN_OUT);

  return (
    <SampleCanvas aspect="4:5" background={C.wall}>
      {SHOTS_BY_HALF.map((shot, i) => (
        <Sequence key={i} from={i * 30} durationInFrames={30} layout="none">
          <Shot index={i} />
        </Sequence>
      ))}
      <Sequence from={180} layout="none">
        <Footage at={CLOSING_SHOT.at} play frame={FULL} focal={CLOSING_SHOT.focal} zoom={lerp(1.12, 1.04, end)} filter={`${LOOK.graded} brightness(${lerp(0.9, 0.55, end)})`} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${wall(0.35)} 0%, transparent 22%, transparent 50%, ${wall(0.82)} 100%)` }} />

      {frame < 180 ? <Caption key={caption} lines={copy.captions[caption]} frame={frame - caption * 60} /> : null}

      {frame >= 180 ? (
        <>
          <div style={{ position: "absolute", left: 70, top: 850, opacity: nameIn, translate: `${(1 - nameIn) * -40}px 0` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ width: 8, height: 74, background: C.signal }} />
              <div>
                <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 64, letterSpacing: "-0.03em", color: C.ivory }}>{copy.name}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 24, letterSpacing: "0.14em", textTransform: "uppercase", color: ivory(0.72) }}>{copy.role}</div>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 1010, fontFamily: FONT.body, fontWeight: 500, fontSize: 52, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.ivory, opacity: ramp(frame, 200, 212) }}>
            {copy.closing.split("*").map((part, i) => (
              <span key={i} style={i % 2 === 1 ? { color: C.signal } : undefined}>
                {part}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 70, top: 1170, padding: "10px 22px", borderRadius: 999, border: `1.5px solid ${signal(0.5)}`, fontFamily: FONT.mono, fontSize: 26, color: C.signal, opacity: ramp(frame, 212, 222) }}>{copy.url}</div>
        </>
      ) : null}

      <Monogram size={84} style={{ position: "absolute", right: 56, bottom: 56, opacity: 0.7 }} />
      <GrainFill width={W} height={H} opacity={0.045} />
      <SampleTag language={language} color={C.ivory} background={wall(0.55)} style={{ right: 44, top: 44 }} />
    </SampleCanvas>
  );
}
