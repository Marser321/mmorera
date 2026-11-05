import { Sequence, useCurrentFrame } from "remotion";
import { SAMPLE_COPY } from "./copy";
import { BrandLogo, Clip, EASE_IN_OUT, Flash, GrainFill, SampleCanvas, SampleTag, Still, brand, emph, lerp, ramp, shake, slam, tint, type SampleProps } from "./kit";

const B = brand("mr-studio-tattoo");
const P = B.palette;
const W = 1080;
const H = 1920;
const FULL = { x: 0, y: 0, width: W, height: H };
const STEP = { width: 1920, height: 2200 };
const BEAT = 15;

/** Las capturas de la reserva, una por pulso (las de los artistas quedan fuera: salen personas). */
const STEPS = [
  { src: "portfolio/brands/mr-studio-tattoo/shots/live-1-edad.jpg", focal: [0.5, 0.36] },
  { src: "portfolio/brands/mr-studio-tattoo/shots/live-4-tamano.jpg", focal: [0.5, 0.4] },
  { src: "portfolio/brands/mr-studio-tattoo/shots/live-5-zona-antebrazo.jpg", focal: [0.5, 0.42] },
  { src: "portfolio/brands/mr-studio-tattoo/shots/live-6-concepto.jpg", focal: [0.5, 0.32] },
] as const;

/** Cortes del clip en el segundo compás (segundos): el proceso y la rosa terminada. */
const CUTS = [1.2, 3.4, 6.2, 8.8];

const GRADE = "contrast(1.14) saturate(1.12) brightness(0.84)";

function Caption({ lines, frame, at, accent }: { lines: readonly string[]; frame: number; at: number; accent: boolean }) {
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1160, textAlign: "center" }}>
      {lines.map((line, i) => {
        const s = slam(frame, at + i * 6, 6);
        return (
          <div
            key={line}
            style={{
              fontFamily: B.fonts.display,
              fontSize: 150,
              lineHeight: 0.98,
              textTransform: "uppercase",
              letterSpacing: "0.005em",
              color: accent && i === lines.length - 1 ? P.accentSoft : P.text,
              textShadow: `0 10px 40px ${tint(P.bg, 0.8)}`,
              opacity: s.opacity,
              scale: `${s.scale}`,
              filter: `blur(${s.blur}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}

/** Un corte de un pulso: entra más cerca y se abre un poco. */
function Punch({ at }: { at: number }) {
  const frame = useCurrentFrame();
  return <Clip id="mrstudio-rosa" frame={FULL} at={at} zoom={lerp(1.2, 1.1, ramp(frame, 0, BEAT))} filter={GRADE} />;
}

function StepShot({ index }: { index: number }) {
  const frame = useCurrentFrame();
  const shot = STEPS[index];
  return (
    <div style={{ position: "absolute", inset: 0, background: P.bg }}>
      <Still src={shot.src} size={STEP} frame={{ x: 0, y: 180, width: W, height: 1260 }} focal={shot.focal} zoom={lerp(1.14, 1.05, ramp(frame, 0, BEAT))} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 180, height: 1260, background: `linear-gradient(180deg, ${P.bg} 0%, transparent 14%, transparent 80%, ${P.bg} 100%)` }} />
    </div>
  );
}

/**
 * Reel · Mr. Studio Tattoo (9:16, 8 s). El gancho primero, en dos golpes sobre
 * el metraje del estudio; un compás de cortes en el pulso entre el proceso y
 * la rosa terminada; los pasos de la reserva, uno por golpe; y el cierre.
 */
export function ReelSample({ language }: SampleProps) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].reel;
  const cutting = frame >= 60 && frame < 180;
  const hit = shake(frame, Math.floor(frame / BEAT) * BEAT, cutting ? 9 : 0, 8);
  const step = Math.min(3, Math.floor((frame - 120) / BEAT));
  const endIn = ramp(frame, 180, 196, EASE_IN_OUT);

  return (
    <SampleCanvas aspect="9:16" background={P.bg}>
      <div style={{ position: "absolute", inset: 0, translate: `${hit.x}px ${hit.y}px` }}>
        <Sequence durationInFrames={60} layout="none">
          <Clip id="mrstudio-rosa" frame={FULL} at={0.4} zoom={lerp(1.04, 1.14, ramp(frame, 0, 60, (t) => t))} filter={GRADE} />
        </Sequence>
        {CUTS.map((at, i) => (
          <Sequence key={at} from={60 + i * BEAT} durationInFrames={BEAT} layout="none">
            <Punch at={at} />
          </Sequence>
        ))}
        {STEPS.map((shot, i) => (
          <Sequence key={shot.src} from={120 + i * BEAT} durationInFrames={BEAT} layout="none">
            <StepShot index={i} />
          </Sequence>
        ))}
        <Sequence from={180} layout="none">
          <Clip id="mrstudio-rosa" frame={FULL} at={8.9} zoom={lerp(1.2, 1.08, endIn)} filter={`contrast(1.1) saturate(1.05) brightness(${lerp(0.86, 0.4, endIn)})`} />
        </Sequence>
      </div>

      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${tint(P.bg, 0.55)} 0%, transparent 24%, transparent 52%, ${tint(P.bg, 0.86)} 100%)` }} />

      {frame < 30 ? <Caption lines={copy.hook} frame={frame} at={0} accent={false} /> : null}
      {frame >= 30 && frame < 60 ? <Caption lines={copy.hook2} frame={frame} at={30} accent /> : null}

      {frame >= 60 && frame < 120 ? (
        <div style={{ position: "absolute", left: 70, bottom: 250, padding: "14px 26px", borderRadius: 999, background: tint(P.bg, 0.72), border: `1.5px solid ${tint(P.accentSoft, 0.5)}`, fontFamily: B.fonts.body, fontWeight: 600, fontSize: 36, color: P.text, opacity: ramp(frame, 62, 70) }}>
          {copy.process}
        </div>
      ) : null}

      {frame >= 120 && frame < 180 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "20px 38px",
              borderRadius: 18,
              background: P.accent,
              color: P.onAccent,
              fontFamily: B.fonts.display,
              fontSize: 76,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              scale: `${lerp(1.25, 1, ramp(frame, 120 + step * BEAT, 120 + step * BEAT + 6))}`,
            }}
          >
            {copy.steps[step]}
          </span>
        </div>
      ) : null}

      {frame >= 180 ? (
        <div style={{ position: "absolute", left: 80, right: 80, top: 600, textAlign: "center", opacity: endIn }}>
          <BrandLogo src={B.logo.mark} width={300} style={{ position: "relative", display: "block", margin: "0 auto", translate: `0 ${(1 - endIn) * 30}px` }} />
          <div style={{ marginTop: 70, fontFamily: B.fonts.display, fontSize: 104, lineHeight: 1.02, textTransform: "uppercase", color: P.text }}>{emph(copy.closing, { color: P.accentSoft })}</div>
          <div style={{ marginTop: 48, display: "inline-block", padding: "18px 34px", borderRadius: 999, border: `2px solid ${P.accentSoft}`, fontFamily: B.fonts.body, fontWeight: 600, fontSize: 40, color: P.text, opacity: ramp(frame, 206, 218) }}>{copy.cta}</div>
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
