import { Sequence, useCurrentFrame } from "remotion";
import { SAMPLE_COPY } from "./copy";
import { BrandLogo, Clip, EASE_IN_OUT, GrainFill, SampleCanvas, SampleTag, Still, WordsIn, brand, lerp, ramp, tint, type SampleProps } from "./kit";

const B = brand("rangel-oviedo-group");
const P = B.palette;
const W = 1920;
const H = 1080;
const FULL = { x: 0, y: 0, width: W, height: H };
const DURATION = 240;

/** El reproductor del VSL: tiempo arriba, barra de avance con sus tres tramos abajo. */
function PlayerChrome({ frame, chapters }: { frame: number; chapters: readonly string[] }) {
  const seconds = Math.floor(frame / 30);
  const active = frame < 60 ? 0 : frame < 180 ? 1 : 2;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 16, fontFamily: B.fonts.label, fontWeight: 600, fontSize: 24, color: tint(P.text, 0.8), fontVariantNumeric: "tabular-nums" }}>
        <svg width={30} height={30} viewBox="0 0 24 24">
          <path d="M7 4l13 8-13 8z" fill={P.accent} />
        </svg>
        0:{String(seconds).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", gap: 10 }}>
        {chapters.map((label, i) => {
          const from = [0, 60, 180][i];
          const to = [60, 180, DURATION][i];
          const fill = Math.max(0, Math.min(1, (frame - from) / (to - from)));
          return (
            <div key={label} style={{ flex: to - from }}>
              <div style={{ fontFamily: B.fonts.label, fontWeight: 600, fontSize: 20, letterSpacing: "0.12em", textTransform: "uppercase", color: i === active ? P.accent : tint(P.text, 0.5), marginBottom: 12 }}>{label}</div>
              <div style={{ height: 7, borderRadius: 4, background: tint(P.text, 0.2), overflow: "hidden" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", background: P.accent }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/**
 * VSL · Rangel Oviedo Group (16:9, 8 s). El formato de video de venta: una
 * pregunta que engancha, la promesa de su web («filtramos el riesgo»), su
 * método en cinco etapas y el botón de su asesoría, con el reproductor a la vista.
 */
export function VslSample({ language }: SampleProps) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].vsl;
  const display = { fontFamily: B.fonts.display, color: P.text, letterSpacing: "-0.01em" } as const;
  const press = ramp(frame, 214, 218) * (1 - ramp(frame, 220, 226));
  const glow = 0.5 + 0.5 * Math.sin(frame / 5);

  return (
    <SampleCanvas aspect="16:9" background={P.bg}>
      <Sequence durationInFrames={60} layout="none">
        <Clip id="rangel-facade" frame={FULL} at={0.4} focal={[0.62, 0.5]} zoom={lerp(1.04, 1.12, ramp(frame, 0, 60, (t) => t))} filter="brightness(0.4) saturate(0.9)" />
        <div style={{ position: "absolute", left: 160, right: 160, top: 330, textAlign: "center", ...display, fontWeight: 600, fontSize: 104, lineHeight: 1.12 }}>
          <div><WordsIn text={copy.hook[0]} frame={frame} at={2} every={3} /></div>
          <div style={{ color: P.accentSoft, fontStyle: "italic" }}><WordsIn text={copy.hook[1]} frame={frame} at={14} every={3} /></div>
        </div>
      </Sequence>

      <Sequence from={60} durationInFrames={60} layout="none">
        <Clip id="rangel-living" frame={FULL} at={1} focal={[0.5, 0.55]} zoom={lerp(1.1, 1.03, ramp(frame, 60, 120, (t) => t))} filter="brightness(0.62) contrast(1.06)" />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 60% at 50% 50%, ${tint(P.bg, 0.25)}, ${tint(P.bg, 0.75)})` }} />
        <div style={{ position: "absolute", left: 200, right: 200, top: 350, textAlign: "center", ...display, fontWeight: 600, fontSize: 92, lineHeight: 1.14 }}>
          <WordsIn text={copy.risk} frame={frame - 60} at={2} every={3} highlight={{ color: P.accentSoft, fontStyle: "italic" }} />
        </div>
      </Sequence>

      <Sequence from={120} durationInFrames={60} layout="none">
        <div style={{ position: "absolute", inset: 0, background: P.bg }} />
        <Still src="portfolio/brands/rangel-oviedo-group/entrance.jpg" size={{ width: 1024, height: 1024 }} frame={{ x: 1080, y: 130, width: 700, height: 760 }} zoom={lerp(1.12, 1.04, ramp(frame, 120, 180, (t) => t))} style={{ borderRadius: 18, opacity: ramp(frame, 120, 132) }} />
        <div style={{ position: "absolute", left: 160, top: 170 }}>
          <div style={{ fontFamily: B.fonts.label, fontWeight: 600, fontSize: 26, letterSpacing: "0.2em", textTransform: "uppercase", color: P.accent, opacity: ramp(frame, 120, 128) }}>{copy.methodTitle}</div>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22 }}>
            {copy.steps.map((step, i) => {
              const t = ramp(frame, 124 + i * 8, 134 + i * 8, EASE_IN_OUT);
              return (
                <div key={step} style={{ display: "flex", alignItems: "baseline", gap: 26, opacity: t, translate: `${(1 - t) * -30}px 0` }}>
                  <span style={{ fontFamily: B.fonts.label, fontWeight: 600, fontSize: 30, color: P.accent, width: 54 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ ...display, fontWeight: 500, fontSize: 66 }}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Sequence>

      <Sequence from={180} layout="none">
        <Still src="portfolio/brands/rangel-oviedo-group/entrance.jpg" size={{ width: 1024, height: 1024 }} frame={FULL} zoom={1.25} filter="blur(14px) brightness(0.35)" />
        <div style={{ position: "absolute", left: 160, right: 160, top: 250, textAlign: "center" }}>
          <BrandLogo src={B.logo.wordmark ?? B.logo.mark} width={470} style={{ position: "relative", display: "block", margin: "0 auto", opacity: ramp(frame, 180, 192) }} />
          <div style={{ marginTop: 56, ...display, fontWeight: 600, fontSize: 84, lineHeight: 1.12 }}>
            <WordsIn text={copy.promise} frame={frame - 180} at={4} every={3} highlight={{ color: P.accentSoft, fontStyle: "italic" }} />
          </div>
          <div
            style={{
              marginTop: 60,
              display: "inline-flex",
              alignItems: "center",
              gap: 18,
              padding: "28px 52px",
              borderRadius: 12,
              background: P.accent,
              color: P.onAccent,
              fontFamily: B.fonts.body,
              fontWeight: 700,
              fontSize: 40,
              opacity: ramp(frame, 198, 208),
              scale: `${lerp(0.9, 1, ramp(frame, 198, 208, EASE_IN_OUT)) - press * 0.05}`,
              boxShadow: `0 0 ${40 + glow * 40}px ${tint(P.accent, 0.35 + glow * 0.2)}`,
            }}
          >
            {copy.cta}
            <span style={{ fontSize: 44 }}>→</span>
          </div>
        </div>
        <svg width={56} height={56} viewBox="0 0 24 24" style={{ position: "absolute", left: lerp(1500, 1180, ramp(frame, 200, 214, EASE_IN_OUT)), top: lerp(980, 742, ramp(frame, 200, 214, EASE_IN_OUT)), opacity: ramp(frame, 200, 206), scale: `${1 - press * 0.15}` }}>
          <path d="M5 3l14 8-6 2 3 7-3 1-3-7-5 4z" fill="#FFFFFF" stroke={P.bg} strokeWidth={1.2} />
        </svg>
      </Sequence>

      <PlayerChrome frame={frame} chapters={copy.chapters} />
      <GrainFill width={W} height={H} opacity={0.04} />
      <SampleTag language={language} color={P.text} background={tint(P.bg, 0.6)} style={{ right: 60, top: 44 }} />
    </SampleCanvas>
  );
}
