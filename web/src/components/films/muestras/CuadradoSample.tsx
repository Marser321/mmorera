import { Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE_COPY } from "./copy";
import { BrandLogo, Clip, EASE_IN_OUT, GrainFill, SampleCanvas, SampleTag, WordsIn, brand, lerp, ramp, tint, type SampleProps } from "./kit";

const B = brand("fenix-medical-center");
const P = B.palette;
const S = 1080;
const FULL = { x: 0, y: 0, width: S, height: S };
const BOOKING = [
  { src: "portfolio/brands/fenix-medical-center/shots/booking-1-dia.png", width: 488, height: 636 },
  { src: "portfolio/brands/fenix-medical-center/shots/booking-2-hora.png", width: 488, height: 418 },
  { src: "portfolio/brands/fenix-medical-center/shots/booking-3-datos.png", width: 488, height: 791 },
] as const;

/**
 * Cuadrado · Fenix Medical Center (1:1, 8 s). Una publicación de feed con el
 * ritmo de la marca: la recepción y la cámara hiperbárica de sus escenas,
 * las tres líneas de atención, la reserva en tres pasos y la firma.
 */
export function CuadradoSample({ language }: SampleProps) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].cuadrado;
  const end = ramp(frame, 180, 196, EASE_IN_OUT);

  return (
    <SampleCanvas aspect="1:1" background={P.bg}>
      <Sequence durationInFrames={60} layout="none">
        <Clip id="fenix-corridor" frame={FULL} at={0.5} focal={[0.5, 0.42]} zoom={lerp(1.06, 1.14, ramp(frame, 0, 60, (t) => t))} filter="contrast(1.04) saturate(1.02)" />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${tint(P.bg, 0.86)} 100%)` }} />
        <div style={{ position: "absolute", left: 80, right: 80, bottom: 120, textAlign: "center", fontFamily: B.fonts.display, fontWeight: 500, fontSize: 92, lineHeight: 1.05, color: P.text }}>
          <WordsIn text={copy.tagline} frame={frame} at={8} every={4} />
        </div>
        <div style={{ position: "absolute", left: 490, width: 100, bottom: 92, height: 2, background: P.accent, scale: `${ramp(frame, 26, 40)} 1` }} />
      </Sequence>

      <Sequence from={60} durationInFrames={60} layout="none">
        <Clip id="fenix-chamber" frame={FULL} at={1} focal={[0.42, 0.55]} zoom={lerp(1.18, 1.08, ramp(frame, 60, 120, (t) => t))} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${tint(P.bg, 0.82)} 0%, ${tint(P.bg, 0.2)} 60%, transparent 100%)` }} />
        <div style={{ position: "absolute", left: 90, top: 330, display: "flex", flexDirection: "column", gap: 26 }}>
          {copy.sublines.map((line, i) => {
            const t = ramp(frame, 62 + i * 15, 72 + i * 15, EASE_IN_OUT);
            return (
              <div key={line} style={{ display: "flex", alignItems: "center", gap: 22, opacity: t, translate: `${(1 - t) * -40}px 0` }}>
                <span style={{ width: 14, height: 14, borderRadius: 7, background: P.accentSoft }} />
                <span style={{ fontFamily: B.fonts.display, fontSize: 74, color: P.text }}>{line}</span>
              </div>
            );
          })}
        </div>
      </Sequence>

      <Sequence from={120} durationInFrames={60} layout="none">
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 60% at 50% 30%, ${tint(P.accent, 0.22)}, ${P.bg} 70%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: B.fonts.display, fontSize: 70, color: P.text, opacity: ramp(frame, 120, 130) }}>{copy.booking}</div>
        {BOOKING.map((shot, i) => {
          const t = ramp(frame, 122 + i * 15, 134 + i * 15, EASE_IN_OUT);
          const width = 290;
          const height = (shot.height / shot.width) * width;
          return (
            <div key={shot.src} style={{ position: "absolute", left: 75 + i * 320, top: 300, width, opacity: t, translate: `0 ${(1 - t) * 60}px` }}>
              <div style={{ fontFamily: B.fonts.label, fontWeight: 700, fontSize: 26, letterSpacing: "0.08em", textTransform: "uppercase", color: P.accentSoft, marginBottom: 16 }}>{copy.steps[i]}</div>
              <div style={{ width, height: Math.min(height, 560), borderRadius: 18, overflow: "hidden", border: `1.5px solid ${tint(P.accentSoft, 0.4)}`, boxShadow: `0 24px 60px ${tint("#000000", 0.5)}` }}>
                <Img src={staticFile(shot.src)} style={{ width, height, display: "block" }} />
              </div>
            </div>
          );
        })}
      </Sequence>

      <Sequence from={180} layout="none">
        <Clip id="fenix-corridor" frame={FULL} at={3} focal={[0.5, 0.42]} zoom={1.2} filter={`blur(${lerp(0, 18, end)}px) brightness(${lerp(1, 0.35, end)})`} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: end }}>
          <BrandLogo src={B.logo.wordmark ?? B.logo.mark} width={680} style={{ position: "relative", translate: `0 ${(1 - end) * 24}px` }} />
          <div style={{ marginTop: 56, fontFamily: B.fonts.display, fontStyle: "italic", fontSize: 54, color: P.text, opacity: ramp(frame, 196, 208) }}>{copy.tagline}</div>
          <div style={{ marginTop: 40, padding: "14px 30px", borderRadius: 999, border: `1.5px solid ${P.accentSoft}`, fontFamily: B.fonts.body, fontWeight: 600, fontSize: 32, color: P.accentSoft, opacity: ramp(frame, 206, 218) }}>{copy.url}</div>
        </div>
      </Sequence>

      <div style={{ position: "absolute", inset: 28, border: `1.5px solid ${tint(P.accentSoft, 0.45)}`, borderRadius: 6, pointerEvents: "none" }} />
      <GrainFill width={S} height={S} opacity={0.035} />
      <SampleTag language={language} color={P.text} background={tint(P.bg, 0.6)} style={{ right: 52, top: 52 }} />
    </SampleCanvas>
  );
}
