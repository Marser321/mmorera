import { Sequence, useCurrentFrame } from "remotion";
import { SAMPLE_COPY } from "./copy";
import { Clip, EASE_IN_OUT, Flash, GrainFill, SampleCanvas, SampleTag, Still, brand, emph, lerp, ramp, shake, slam, tint, type SampleProps } from "./kit";
import type { ClipId } from "./clips";

/**
 * Atelier es la marca de ejemplo de mi demo de gimnasios (marca blanca). Las tipografías son las
 * de New Brothers, Oswald e Inter, también propias. La paleta, negro cálido y latón, es la de la demo.
 */
const FONTS = brand("new-brothers-barberia").fonts;
const P = { bg: "#0C0B09", text: "#F5F1EA", muted: "#BDB3A2", accent: "#B08D57", accentSoft: "#F1DCB2", onAccent: "#0C0B09" };
const W = 1080;
const H = 1920;
const FULL = { x: 0, y: 0, width: W, height: H };
const BEAT = 15;

/** Las pantallas de la app del socio, una por pulso (capturas de la demo, datos de ejemplo). */
const STEPS = [
  { src: "portfolio/brands/gimnasio-demo/shots/socio-reservar.jpg", focal: [0.5, 0.3] },
  { src: "portfolio/brands/gimnasio-demo/shots/socio-pase.jpg", focal: [0.5, 0.34] },
  { src: "portfolio/brands/gimnasio-demo/shots/socio-inicio.jpg", focal: [0.5, 0.26] },
  { src: "portfolio/brands/gimnasio-demo/shots/socio-progreso.jpg", focal: [0.5, 0.3] },
] as const;
const STEP_SIZE = { width: 1080, height: 2338 };

/** Cortes del segundo compás: las cinemáticas de la demo, una por pulso. */
const CUTS: { id: ClipId; focal: readonly [number, number] }[] = [
  { id: "gym-magnesio", focal: [0.62, 0.5] },
  { id: "gym-repeticion", focal: [0.8, 0.5] },
  { id: "gym-atencion", focal: [0.5, 0.5] },
  { id: "gym-llegada", focal: [0.68, 0.5] },
];

const GRADE = "contrast(1.08) saturate(1.04) brightness(0.86)";

function Caption({ lines, frame, at, accent }: { lines: readonly string[]; frame: number; at: number; accent: boolean }) {
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1160, textAlign: "center" }}>
      {lines.map((line, i) => {
        const s = slam(frame, at + i * 6, 6);
        return (
          <div key={line} style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 140, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.01em",
            color: accent && i === lines.length - 1 ? P.accentSoft : P.text, textShadow: `0 10px 40px ${tint(P.bg, 0.8)}`, opacity: s.opacity, scale: `${s.scale}`, filter: `blur(${s.blur}px)` }}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

function Punch({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const cut = CUTS[index];
  return <Clip id={cut.id} frame={FULL} at={0.2} focal={cut.focal} zoom={lerp(1.18, 1.08, ramp(frame, 0, BEAT))} filter={GRADE} />;
}

function StepShot({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const shot = STEPS[index];
  return (
    <div style={{ position: "absolute", inset: 0, background: P.bg }}>
      <Still src={shot.src} size={STEP_SIZE} frame={{ x: 140, y: 170, width: W - 280, height: 1300 }} focal={shot.focal} zoom={lerp(1.08, 1.02, ramp(frame, 0, BEAT))} style={{ borderRadius: 48, boxShadow: `0 0 0 3px ${tint(P.accent, 0.6)}` }} />
    </div>
  );
}

/**
 * Reel · Atelier, la demo de gimnasios (9:16, 8 s). El gancho, en dos golpes, sobre la sala con luz
 * de mañana; un compás de cortes en el pulso entre las cinemáticas de la demo; la app del socio,
 * una pantalla por golpe; y el cierre de noche.
 */
export function ReelSample({ language }: SampleProps) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].reel;
  const cutting = frame >= 60 && frame < 120;
  const hit = shake(frame, Math.floor(frame / BEAT) * BEAT, cutting ? 8 : 0, 8);
  const step = Math.min(3, Math.floor((frame - 120) / BEAT));
  const endIn = ramp(frame, 180, 196, EASE_IN_OUT);

  return (
    <SampleCanvas aspect="9:16" background={P.bg}>
      <div style={{ position: "absolute", inset: 0, translate: `${hit.x}px ${hit.y}px` }}>
        <Sequence durationInFrames={60} layout="none">
          <Clip id="gym-dia" frame={FULL} at={0.2} zoom={lerp(1.04, 1.12, ramp(frame, 0, 60, (t) => t))} filter={GRADE} />
        </Sequence>
        {CUTS.map((cut, i) => (
          <Sequence key={cut.id} from={60 + i * BEAT} durationInFrames={BEAT} layout="none">
            <Punch index={i} />
          </Sequence>
        ))}
        {STEPS.map((shot, i) => (
          <Sequence key={shot.src} from={120 + i * BEAT} durationInFrames={BEAT} layout="none">
            <StepShot index={i} />
          </Sequence>
        ))}
        <Sequence from={180} layout="none">
          <Clip id="gym-noche" frame={FULL} at={0.4} focal={[0.6, 0.5]} zoom={lerp(1.16, 1.06, endIn)} filter={`contrast(1.06) brightness(${lerp(0.9, 0.55, endIn)})`} />
        </Sequence>
      </div>

      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${tint(P.bg, 0.5)} 0%, transparent 24%, transparent 52%, ${tint(P.bg, 0.84)} 100%)` }} />

      {frame < 30 ? <Caption lines={copy.hook} frame={frame} at={0} accent={false} /> : null}
      {frame >= 30 && frame < 60 ? <Caption lines={copy.hook2} frame={frame} at={30} accent /> : null}

      {frame >= 60 && frame < 120 ? (
        <div style={{ position: "absolute", left: 70, bottom: 250, padding: "14px 26px", borderRadius: 999, background: tint(P.bg, 0.72), border: `1.5px solid ${tint(P.accentSoft, 0.5)}`, fontFamily: FONTS.body, fontWeight: 600, fontSize: 36, color: P.text, opacity: ramp(frame, 62, 70) }}>
          {copy.process}
        </div>
      ) : null}

      {frame >= 120 && frame < 180 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1540, textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "20px 38px", borderRadius: 18, background: P.accent, color: P.onAccent, fontFamily: FONTS.display, fontWeight: 600, fontSize: 72, textTransform: "uppercase", letterSpacing: "0.01em",
            scale: `${lerp(1.25, 1, ramp(frame, 120 + step * BEAT, 120 + step * BEAT + 6))}` }}>
            {copy.steps[step]}
          </span>
        </div>
      ) : null}

      {frame >= 180 ? (
        <div style={{ position: "absolute", left: 80, right: 80, top: 640, textAlign: "center", opacity: endIn }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 64, letterSpacing: "0.32em", color: P.accentSoft, translate: `0 ${(1 - endIn) * 30}px` }}>ATELIER</div>
          <div style={{ marginTop: 70, fontFamily: FONTS.display, fontWeight: 600, fontSize: 104, lineHeight: 1.02, textTransform: "uppercase", color: P.text }}>{emph(copy.closing, { color: P.accentSoft })}</div>
          <div style={{ marginTop: 48, display: "inline-block", padding: "18px 34px", borderRadius: 999, border: `2px solid ${P.accentSoft}`, fontFamily: FONTS.body, fontWeight: 600, fontSize: 40, color: P.text, opacity: ramp(frame, 206, 218) }}>{copy.cta}</div>
        </div>
      ) : null}

      {[60, 75, 90, 105, 120, 135, 150, 165, 180].map((at) => (
        <Flash key={at} frame={frame} at={at} peak={at === 60 || at === 120 || at === 180 ? 0.32 : 0.12} length={5} />
      ))}
      <GrainFill width={W} height={H} opacity={0.045} />
      <SampleTag language={language} color={P.text} background={tint(P.bg, 0.6)} style={{ right: 40, top: 40 }} />
    </SampleCanvas>
  );
}
