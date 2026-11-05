import { Img, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE_COPY } from "./copy";
import { EASE_IN_OUT, GrainFill, SampleCanvas, SampleTag, Still, brand, emph, lerp, ramp, tint, type SampleProps } from "./kit";

const B = brand("lnb-saas");
const P = B.palette;
const W = 1080;
const H = 1920;
const SEGMENT = 80;
const SHOT = { width: 1920, height: 1080 };
const CREAM = "#FBF7EF";

/** Un toque para pasar de historia: el círculo que deja el dedo a la derecha. */
function Tap({ frame, at }: { frame: number; at: number }) {
  const t = (frame - at) / 10;
  if (t < 0 || t > 1) return null;
  return <div style={{ position: "absolute", left: 860, top: 900, width: 120, height: 120, borderRadius: 60, border: `4px solid ${tint("#FFFFFF", 0.8 * (1 - t))}`, background: tint("#FFFFFF", 0.22 * (1 - t)), scale: `${lerp(0.5, 1.4, t)}` }} />;
}

/** Texto de historia: cada línea con su fondo, como lo deja la app. */
function StoryText({ text, frame, at, top }: { text: string; frame: number; at: number; top: number }) {
  const t = ramp(frame, at, at + 12, EASE_IN_OUT);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, textAlign: "center", opacity: t, scale: `${lerp(0.9, 1, t)}`, translate: `0 ${(1 - t) * 30}px` }}>
      <span style={{ fontFamily: B.fonts.display, fontWeight: 600, fontSize: 82, lineHeight: 1.32, color: P.bg, background: CREAM, padding: "4px 22px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", borderRadius: 14 }}>
        {emph(text, { color: P.accentDeep, fontStyle: "italic" })}
      </span>
    </div>
  );
}

/** Una captura de la web como recorte pegado en la historia. */
function Sticker({ src, crop, frame, at, box, rotate }: { src: string; crop: readonly [number, number]; frame: number; at: number; box: { x: number; y: number; width: number; height: number }; rotate: number }) {
  const t = ramp(frame, at, at + 14, EASE_IN_OUT);
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.width, height: box.height, borderRadius: 34, overflow: "hidden", boxShadow: `0 40px 90px ${tint("#000000", 0.45)}`, border: `6px solid ${CREAM}`, rotate: `${rotate * t}deg`, opacity: t, scale: `${lerp(0.7, 1, t)}` }}>
      <Still src={src} size={SHOT} frame={{ x: 0, y: 0, width: box.width - 12, height: box.height - 12 }} focal={crop} zoom={1.02} />
    </div>
  );
}

/**
 * Historia · La Nueva Brasil (9:16, 8 s). Tres historias seguidas con la
 * barra de progreso, el encabezado de la cuenta, una encuesta y un enlace:
 * la cafetería, el plan de suscripción y el pedido exprés de su web.
 */
export function HistoriaSample({ language }: SampleProps) {
  const frame = useCurrentFrame();
  const copy = SAMPLE_COPY[language].historia;
  const segment = Math.min(2, Math.floor(frame / SEGMENT));
  const local = frame - segment * SEGMENT;
  const enter = ramp(local, 0, 8);
  const choice = ramp(frame, 128, 134);
  const link = ramp(frame, 186, 198, EASE_IN_OUT);

  return (
    <SampleCanvas aspect="9:16" background={P.bg}>
      <div style={{ position: "absolute", inset: 0, scale: `${lerp(1.04, 1, enter)}` }}>
        {segment === 0 ? <Still src="portfolio/brands/lnb-saas/bakery_bg.jpg" size={SHOT} frame={{ x: 0, y: 0, width: W, height: H }} focal={[0.42, 0.62]} zoom={lerp(1.02, 1.12, ramp(local, 0, SEGMENT, (t) => t))} filter="saturate(1.08) contrast(1.04)" /> : null}
        {segment === 1 ? (
          <>
            <Still src="portfolio/brands/lnb-saas/bakery_bg.jpg" size={SHOT} frame={{ x: 0, y: 0, width: W, height: H }} focal={[0.7, 0.5]} zoom={1.3} filter="blur(26px) brightness(0.7) saturate(1.2)" />
            <Sticker src="portfolio/brands/lnb-saas/shots/subscription.jpg" crop={[0.5, 0.55]} frame={local} at={4} box={{ x: 90, y: 640, width: 900, height: 620 }} rotate={-2.5} />
          </>
        ) : null}
        {segment === 2 ? (
          <>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${P.accentDeep}, ${P.bg} 70%)` }} />
            <Sticker src="portfolio/brands/lnb-saas/shots/express.jpg" crop={[0.32, 0.45]} frame={local} at={2} box={{ x: 110, y: 560, width: 860, height: 640 }} rotate={2} />
          </>
        ) : null}
      </div>

      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${tint("#000000", 0.5)} 0%, transparent 16%, transparent 78%, ${tint("#000000", 0.55)} 100%)` }} />

      {segment === 0 ? <StoryText text={copy.first} frame={local} at={10} top={1180} /> : null}
      {segment === 1 ? (
        <>
          <StoryText text={copy.second} frame={local} at={2} top={330} />
          <div style={{ position: "absolute", left: 160, right: 160, top: 1330, borderRadius: 30, background: CREAM, padding: "30px 34px 34px", boxShadow: `0 30px 70px ${tint("#000000", 0.4)}`, opacity: ramp(local, 14, 24), scale: `${lerp(0.8, 1, ramp(local, 14, 24, EASE_IN_OUT))}` }}>
            <div style={{ fontFamily: B.fonts.body, fontWeight: 700, fontSize: 40, color: P.bg, textAlign: "center" }}>{copy.poll.question}</div>
            {copy.poll.options.map((option, i) => {
              const picked = i === 1 ? choice : 0;
              return (
                <div key={option} style={{ marginTop: 20, height: 92, borderRadius: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: B.fonts.body, fontWeight: 700, fontSize: 38, color: picked > 0.5 ? P.onAccent : P.bg, background: picked > 0 ? P.accentSoft : tint(P.bg, 0.07), border: `2px solid ${picked > 0 ? P.accent : tint(P.bg, 0.12)}` }}>
                  {option}
                  {picked > 0.5 ? <span style={{ fontSize: 34 }}>✓</span> : null}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      {segment === 2 ? (
        <>
          <StoryText text={copy.third} frame={local} at={4} top={330} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1320, display: "flex", justifyContent: "center", opacity: link, scale: `${lerp(0.6, 1, link) + Math.sin(link * Math.PI) * 0.08}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "24px 40px", borderRadius: 26, background: CREAM, boxShadow: `0 24px 60px ${tint("#000000", 0.4)}`, fontFamily: B.fonts.body, fontWeight: 700, fontSize: 40, color: P.accentDeep }}>
              <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={P.accentDeep} strokeWidth={2.4} strokeLinecap="round">
                <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
              </svg>
              {copy.link}
            </div>
          </div>
        </>
      ) : null}

      {/* La interfaz de la historia: progreso, cuenta y respuesta. */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 30, display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: tint("#FFFFFF", 0.35), overflow: "hidden" }}>
            <div style={{ width: `${Math.max(0, Math.min(1, (frame - i * SEGMENT) / SEGMENT)) * 100}%`, height: "100%", background: "#FFFFFF" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, top: 64, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, overflow: "hidden", background: P.bg, border: `3px solid ${P.accentSoft}`, display: "grid", placeItems: "center" }}>
          <Img src={staticFile(B.logo.mark.replace(/^\//, ""))} style={{ width: 80, height: 80 }} />
        </div>
        <div style={{ fontFamily: B.fonts.body, color: "#FFFFFF", lineHeight: 1.2 }}>
          <div style={{ fontWeight: 700, fontSize: 36 }}>{copy.name}</div>
          <div style={{ fontSize: 28, opacity: 0.8 }}>{copy.place}</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: B.fonts.body, fontSize: 52, color: "#FFFFFF", letterSpacing: "0.1em" }}>··· ×</div>
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, bottom: 44, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ flex: 1, height: 104, borderRadius: 52, border: `2.5px solid ${tint("#FFFFFF", 0.7)}`, display: "flex", alignItems: "center", padding: "0 40px", fontFamily: B.fonts.body, fontSize: 34, color: tint("#FFFFFF", 0.85) }}>{copy.reply}</div>
        <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        </svg>
        <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8} strokeLinejoin="round">
          <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
        </svg>
      </div>

      <Tap frame={frame} at={SEGMENT - 8} />
      <Tap frame={frame} at={SEGMENT * 2 - 8} />
      <GrainFill width={W} height={H} opacity={0.035} />
      <SampleTag language={language} color="#FFFFFF" background={tint("#000000", 0.45)} style={{ right: 40, top: 180 }} />
    </SampleCanvas>
  );
}
