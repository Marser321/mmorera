import { Sequence, useCurrentFrame } from "remotion";
import { SAMPLE_COPY } from "./copy";
import type { ClipId } from "./clips";
import { BrandLogo, Clip, EASE_IN_OUT, GrainFill, SampleCanvas, SampleTag, WordsIn, brand, lerp, ramp, tint, type SampleProps } from "./kit";

const B = brand("truckers-choice");
const P = B.palette;
const W = 1920;
const H = 1080;
const FULL = { x: 0, y: 0, width: W, height: H };
/** Franjas de cine (2,39:1) que se abren para la firma. */
const BAR = (H - W / 2.39) / 2;

const CHAPTERS: Array<{ clip: ClipId; at: number; focal: readonly [number, number] }> = [
  { clip: "truckers-storm", at: 0.4, focal: [0.5, 0.55] },
  { clip: "truckers-network", at: 0.6, focal: [0.5, 0.5] },
  { clip: "truckers-sunrise", at: 0.6, focal: [0.6, 0.55] },
];

function Chapter({ index, language }: { index: number; language: SampleProps["language"] }) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].empresa;
  const chapter = CHAPTERS[index];
  const fade = ramp(frame, 0, 8) * (1 - ramp(frame, 54, 60));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade }}>
      <Clip id={chapter.clip} frame={FULL} at={chapter.at} focal={chapter.focal} zoom={lerp(1.04, 1.1, ramp(frame, 0, 60, (t) => t))} filter="contrast(1.08) saturate(1.06)" />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${tint(P.bg, 0.78)} 0%, ${tint(P.bg, 0.3)} 46%, transparent 70%)` }} />
      <div style={{ position: "absolute", left: 150, top: 560, width: 1000 }}>
        <div style={{ fontFamily: B.fonts.label, fontWeight: 600, fontSize: 26, letterSpacing: "0.2em", color: P.accentSoft, opacity: ramp(frame, 2, 10) }}>{copy.chapters[index].kicker}</div>
        <div style={{ marginTop: 20, fontFamily: B.fonts.display, fontWeight: 700, fontSize: 70, lineHeight: 1.1, letterSpacing: "-0.02em", color: P.text }}>
          <WordsIn text={copy.chapters[index].text} frame={frame} at={4} every={2} highlight={{ color: P.accent }} />
        </div>
      </div>
      {index === 2 ? (
        <div style={{ position: "absolute", left: 150, top: 820, display: "flex", gap: 16 }}>
          {copy.lines.map((line, i) => {
            const t = ramp(frame, 24 + i * 6, 32 + i * 6, EASE_IN_OUT);
            return (
              <span key={line} style={{ padding: "12px 24px", borderRadius: 999, border: `1.5px solid ${tint(P.accent, 0.6)}`, background: tint(P.bg, 0.55), fontFamily: B.fonts.body, fontWeight: 600, fontSize: 28, color: P.text, opacity: t, translate: `0 ${(1 - t) * 16}px` }}>
                {line}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Empresa · Truckers Choice (16:9, 8 s). Un film de marca con su relato de
 * la web («Una noche en la ruta»): la tormenta, la red de oficinas, el
 * amanecer y la firma. Franjas de cine que se abren al final.
 */
export function EmpresaSample({ language }: SampleProps) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].empresa;
  const open = ramp(frame, 180, 204, EASE_IN_OUT);
  const sign = ramp(frame, 186, 202, EASE_IN_OUT);

  return (
    <SampleCanvas aspect="16:9" background="#000000">
      {CHAPTERS.map((chapter, i) => (
        <Sequence key={chapter.clip} from={i * 60} durationInFrames={60} layout="none">
          <Chapter index={i} language={language} />
        </Sequence>
      ))}
      <Sequence from={180} layout="none">
        <Clip id="truckers-hero" frame={FULL} at={1} focal={[0.6, 0.55]} zoom={lerp(1.12, 1.04, open)} filter={`brightness(${lerp(0.9, 0.55, sign)}) contrast(1.06)`} style={{ opacity: ramp(frame, 180, 188) }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 60% at 50% 50%, transparent, ${tint(P.bg, 0.7)})` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: sign }}>
          <BrandLogo src={B.logo.wordmark ?? B.logo.mark} width={820} style={{ position: "relative", translate: `0 ${(1 - sign) * 30}px` }} />
          <div style={{ marginTop: 44, fontFamily: B.fonts.display, fontWeight: 700, fontSize: 58, color: P.text, letterSpacing: "-0.015em" }}>
            <WordsIn text={copy.tagline} frame={frame} at={196} every={2} highlight={{ color: P.accent }} />
          </div>
          <div style={{ marginTop: 28, fontFamily: B.fonts.label, fontWeight: 500, fontSize: 28, letterSpacing: "0.18em", textTransform: "uppercase", color: P.muted, opacity: ramp(frame, 212, 224) }}>{copy.offices}</div>
        </div>
      </Sequence>

      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR * (1 - open), background: "#000000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR * (1 - open), background: "#000000" }} />
      <GrainFill width={W} height={H} opacity={0.04} />
      <SampleTag language={language} color={P.text} background={tint("#000000", 0.5)} style={{ right: 48, top: BAR * (1 - open) + 28 }} />
    </SampleCanvas>
  );
}
