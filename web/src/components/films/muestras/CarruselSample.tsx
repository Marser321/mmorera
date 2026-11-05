import { useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { SAMPLE_COPY } from "./copy";
import { BrandLogo, EASE_IN_OUT, GrainFill, SampleCanvas, SampleTag, Still, brand, lerp, ramp, tint, type SampleProps } from "./kit";

const B = brand("evowrap");
const P = B.palette;
export const CAROUSEL_SLIDE = { width: 1080, height: 1350 } as const;
const W = CAROUSEL_SLIDE.width;
const H = CAROUSEL_SLIDE.height;
const DIR = "portfolio/brands/evowrap";

/** Una foto por lámina: la portada, las cuatro especialidades y el cierre. */
const PHOTOS = [
  { src: `${DIR}/ferrari-after.jpg`, size: { width: 1024, height: 1024 }, focal: [0.5, 0.56] },
  { src: `${DIR}/ceramic-reflection.jpg`, size: { width: 736, height: 1308 }, focal: [0.5, 0.36] },
  { src: `${DIR}/ppf-application.jpg`, size: { width: 1080, height: 1080 }, focal: [0.5, 0.5] },
  { src: `${DIR}/matte-black-gtr.jpg`, size: { width: 1000, height: 667 }, focal: [0.42, 0.5] },
  { src: `${DIR}/detailing-interior.jpg`, size: { width: 758, height: 1045 }, focal: [0.5, 0.5] },
  { src: `${DIR}/porsche-ceramic-shine.jpg`, size: { width: 1080, height: 1920 }, focal: [0.5, 0.74] },
] as const;

export const CAROUSEL_SLIDES = PHOTOS.length;

function Counter({ index }: { index: number }) {
  return (
    <div style={{ position: "absolute", right: 48, top: 48, padding: "10px 20px", borderRadius: 999, background: tint(P.bg, 0.66), border: `1px solid ${tint(P.text, 0.2)}`, fontFamily: B.fonts.label, fontWeight: 600, fontSize: 26, color: P.text, fontVariantNumeric: "tabular-nums" }}>
      {String(index + 1).padStart(2, "0")}/{String(CAROUSEL_SLIDES).padStart(2, "0")}
    </div>
  );
}

/**
 * Una lámina del carrusel (4:5), quieta salvo un acercamiento lento de la foto.
 * `t` va de 0 a 1 mientras la lámina está en pantalla.
 */
export function CarouselSlide({ index, language, t = 0 }: { index: number; language: FilmLanguage; t?: number }) {
  const copy = SAMPLE_COPY[language].carrusel;
  const photo = PHOTOS[index];
  const zoom = lerp(1.04, 1.1, t);
  const display = { fontFamily: B.fonts.display, textTransform: "uppercase", color: P.text, letterSpacing: "0.01em" } as const;

  if (index === 0) {
    return (
      <SampleCanvas aspect="4:5" background={P.bg}>
        <Still src={photo.src} size={photo.size} frame={{ x: 0, y: 0, width: W, height: H }} focal={photo.focal} zoom={zoom} filter="contrast(1.08) brightness(0.92)" />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${tint(P.bg, 0.7)} 0%, transparent 26%, transparent 46%, ${tint(P.bg, 0.94)} 80%)` }} />
        <BrandLogo src={B.logo.wordmark ?? B.logo.mark} width={300} white style={{ left: 56, top: 60 }} />
        <div style={{ position: "absolute", left: 56, right: 56, top: 820 }}>
          <div style={{ fontFamily: B.fonts.label, fontWeight: 600, fontSize: 28, letterSpacing: "0.16em", textTransform: "uppercase", color: P.accentSoft }}>{copy.kicker}</div>
          <div style={{ ...display, marginTop: 22, fontWeight: 800, fontSize: 82, lineHeight: 1.08 }}>{copy.title}</div>
        </div>
        <div style={{ position: "absolute", right: 56, bottom: 64, display: "flex", alignItems: "center", gap: 14, fontFamily: B.fonts.label, fontWeight: 600, fontSize: 30, color: P.accentSoft }}>
          {copy.swipe}
          <svg width={48} height={24} viewBox="0 0 48 24" fill="none" stroke={P.accentSoft} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h42M34 3l10 9-10 9" />
          </svg>
        </div>
        <Counter index={index} />
      </SampleCanvas>
    );
  }

  if (index === CAROUSEL_SLIDES - 1) {
    return (
      <SampleCanvas aspect="4:5" background={P.bg}>
        <Still src={photo.src} size={photo.size} frame={{ x: 0, y: 0, width: W, height: H }} focal={photo.focal} zoom={zoom * 1.1} filter="brightness(0.5) contrast(1.1)" />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(80% 60% at 50% 50%, ${tint(P.bg, 0.3)}, ${tint(P.bg, 0.92)} 90%)` }} />
        <div style={{ position: "absolute", left: 70, right: 70, top: 420, textAlign: "center" }}>
          <div style={{ ...display, fontWeight: 800, fontSize: 92, lineHeight: 1.06 }}>{copy.closing}</div>
          <div style={{ marginTop: 56, display: "inline-block", padding: "24px 46px", borderRadius: 14, background: P.accent, color: P.onAccent, fontFamily: B.fonts.body, fontWeight: 700, fontSize: 40 }}>{copy.cta}</div>
          <div style={{ marginTop: 34, fontFamily: B.fonts.label, fontSize: 30, letterSpacing: "0.06em", color: P.muted }}>{copy.url}</div>
        </div>
        <BrandLogo src={B.logo.wordmark ?? B.logo.mark} width={240} white style={{ left: W / 2 - 120, bottom: 90, opacity: 0.85 }} />
        <Counter index={index} />
      </SampleCanvas>
    );
  }

  const item = copy.items[index - 1];
  return (
    <SampleCanvas aspect="4:5" background={P.bg}>
      <Still src={photo.src} size={photo.size} frame={{ x: 0, y: 0, width: W, height: 860 }} focal={photo.focal} zoom={zoom} filter="contrast(1.06)" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 220, background: `linear-gradient(180deg, transparent, ${P.bg})` }} />
      <div style={{ position: "absolute", left: 56, right: 56, top: 840 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: B.fonts.display, fontWeight: 800, fontSize: 46, color: P.accent }}>{String(index).padStart(2, "0")}</span>
          <span style={{ height: 2, flex: 1, background: tint(P.accent, 0.4) }} />
          <span style={{ padding: "10px 20px", borderRadius: 999, border: `1.5px solid ${P.accent}`, fontFamily: B.fonts.label, fontWeight: 600, fontSize: 26, color: P.accentSoft, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.badge}</span>
        </div>
        <div style={{ ...display, marginTop: 30, fontWeight: 800, fontSize: 70, lineHeight: 1.08 }}>{item.title}</div>
        <div style={{ marginTop: 24, fontFamily: B.fonts.body, fontSize: 42, lineHeight: 1.25, color: tint(P.text, 0.78) }}>{item.line}</div>
      </div>
      <Counter index={index} />
    </SampleCanvas>
  );
}

/** Puntos del carrusel: el activo se estira. */
export function CarouselDots({ position }: { position: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", gap: 12 }}>
      {Array.from({ length: CAROUSEL_SLIDES }, (_, i) => {
        const near = Math.max(0, 1 - Math.abs(position - i));
        return <span key={i} style={{ width: lerp(14, 44, near), height: 14, borderRadius: 7, background: near > 0.5 ? P.accent : tint(P.text, 0.35) }} />;
      })}
    </div>
  );
}

/**
 * Carrusel · EvoWrap (4:5, 12 s). Seis láminas con la marca de su web: la
 * portada, sus cuatro especialidades con sus fotos y el cierre. Se deslizan
 * en el pulso, con el dedo y los puntos del carrusel, una por compás.
 */
export function CarruselSample({ language, slideFrames = 60 }: SampleProps & { slideFrames?: number }) {
  const frame = useCurrentFrame();
  const swipe = 14;
  const current = Math.min(CAROUSEL_SLIDES - 1, Math.floor(frame / slideFrames));
  const into = frame - current * slideFrames;
  // La lámina siguiente entra durante los últimos cuadros de la actual.
  const moving = current < CAROUSEL_SLIDES - 1 ? ramp(into, slideFrames - swipe, slideFrames, EASE_IN_OUT) : 0;
  const position = current + moving;
  const finger = current < CAROUSEL_SLIDES - 1 ? ramp(into, slideFrames - swipe - 6, slideFrames - swipe) * (1 - ramp(into, slideFrames - 2, slideFrames)) : 0;

  return (
    <SampleCanvas aspect="4:5" background={P.bg}>
      {[current, current + 1].filter((i) => i < CAROUSEL_SLIDES).map((i) => (
        <div key={i} style={{ position: "absolute", left: (i - position) * W, top: 0, width: W, height: H }}>
          <CarouselSlide index={i} language={language} t={ramp(frame, i * slideFrames - swipe, (i + 1) * slideFrames, (x) => x)} />
        </div>
      ))}
      <CarouselDots position={position} />
      {finger > 0 ? <div style={{ position: "absolute", left: lerp(820, 260, moving), top: 980, width: 110, height: 110, borderRadius: 55, background: tint("#FFFFFF", 0.32 * finger), border: `3px solid ${tint("#FFFFFF", 0.75 * finger)}` }} /> : null}
      <GrainFill width={W} height={H} opacity={0.035} />
      <SampleTag language={language} color={P.text} background={tint(P.bg, 0.6)} style={{ left: 48, bottom: 80 }} />
    </SampleCanvas>
  );
}
