import { useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { TRAILER_COPY } from "./copy";
import { C, EASE_IN, EASE_IN_OUT, FONT, Flash, Footage, LOOK, SHOTS, TIMING, Tag, Vignette, box, ivory, lerp, mixRect, ramp, shake, signal, slam, useStage, wall, type Rect } from "./kit";

/** Punto focal de la toma frontal: la persona está a la derecha del cuadro. */
export const FRONTAL_FOCAL = [0.68, 0.4] as const;

/** Mezcla dos looks: del plano «sin editar» al graduado. */
function gradeFilter(t: number, dim = 1) {
  return `saturate(${lerp(0.3, 1.1, t)}) contrast(${lerp(0.76, 1.14, t)}) brightness(${lerp(1.12, 0.97, t) * dim}) sepia(${lerp(0, 0.1, t)})`;
}

/**
 * 01 · El gancho (0–4 s). La toma cruda en 16:9, sin color, y un pedido que
 * se escribe solo: «conviértela en un reel». Al Enter, en el pulso, la toma
 * se vuelve vertical, toma color y llena la pantalla para el título.
 */
export function HookScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { width, height, land } = useStage();
  const copy = TRAILER_COPY[language];
  const { enter, typingFrom, typingFramesPerChar } = TIMING.cues;

  const appear = ramp(frame, 0, 14);
  const toCard = ramp(frame, enter, enter + 24, EASE_IN_OUT);
  const toFull = ramp(frame, 98, 120, EASE_IN);
  const full: Rect = { x: 0, y: 0, width, height };
  // Vertical: la toma se vuelve una pieza 9:16 y después llena la pantalla.
  // Horizontal: la toma ya es 16:9; al Enter toma color y se abre a pantalla completa.
  const raw: Rect = land ? { x: 360, y: 150, width: 1200, height: 675 } : { x: 80, y: 600, width: 920, height: 517.5 };
  const card: Rect = { x: 205, y: 330, width: 670, height: 1191 };
  const rect = land ? mixRect(raw, full, toCard) : toFull > 0 ? mixRect(card, full, toFull) : mixRect(raw, card, toCard);
  const grade = ramp(frame, enter + 14, enter + 20);
  const radius = land ? lerp(18, 0, toCard) : lerp(lerp(18, 26, toCard), 0, toFull);
  const dim = lerp(1, 0.5, toFull);

  const typed = Math.max(0, Math.min(copy.prompt.length, Math.floor((frame - typingFrom) / typingFramesPerChar)));
  const typingDone = typed >= copy.prompt.length;
  const caretOn = !typingDone || Math.floor(frame / 8) % 2 === 0;
  const send = ramp(frame, enter - 6, enter);
  const promptOut = ramp(frame, enter + 2, enter + 16, EASE_IN);
  const labelsOut = 1 - ramp(frame, enter, enter + 8);
  const hit = shake(frame, enter, 8, 10);
  const prompt = land ? { left: 360, top: 868, width: 1200, height: 112, font: 44 } : { left: 80, top: 1200, width: 920, height: 124, font: 48 };

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall, translate: `${hit.x}px ${hit.y}px` }}>
      <div style={{ ...box(rect), overflow: "hidden", borderRadius: radius, opacity: appear, scale: `${lerp(0.97, 1, appear)}`, border: (land ? toCard : toFull) > 0.9 ? "none" : `1px solid ${ivory(0.14)}`, boxShadow: `0 40px 120px ${wall(0.6)}` }}>
        <Footage at={SHOTS.frontal} frame={{ x: 0, y: 0, width: rect.width, height: rect.height }} focal={FRONTAL_FOCAL} zoom={lerp(1, 1.04, ramp(frame, 0, enter))} filter={gradeFilter(grade, dim)} />
        <div style={{ position: "absolute", inset: 0, opacity: labelsOut }}>
          <Tag style={{ left: 22, top: 22 }}>{copy.rawTag}</Tag>
          <Tag style={{ right: 22, top: 22 }}>{copy.rawMeta}</Tag>
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 24, height: 3, borderRadius: 2, background: ivory(0.22) }}>
            <div style={{ width: `${ramp(frame, 6, enter, (t) => t) * 18}%`, height: "100%", background: C.ivory }} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: prompt.left,
          top: prompt.top,
          width: prompt.width,
          height: prompt.height,
          borderRadius: prompt.height / 2,
          background: C.relief,
          border: `1.5px solid ${send > 0 ? signal(0.35 + send * 0.5) : ivory(0.16)}`,
          display: "flex",
          alignItems: "center",
          padding: "0 22px 0 40px",
          gap: 22,
          opacity: appear * (1 - promptOut),
          translate: `0 ${promptOut * 80}px`,
        }}
      >
        <span style={{ fontFamily: FONT.mono, fontSize: prompt.font - 8, color: C.signal }}>&gt;</span>
        <span style={{ flex: 1, fontFamily: FONT.body, fontSize: prompt.font, fontWeight: 500, letterSpacing: "-0.02em", color: C.ivory, whiteSpace: "nowrap" }}>
          {copy.prompt.slice(0, typed)}
          <span style={{ display: "inline-block", width: 4, height: prompt.font + 4, marginLeft: 4, translate: "0 9px", background: C.signal, opacity: caretOn ? 1 : 0 }} />
        </span>
        <span
          style={{
            width: prompt.height - 44,
            height: prompt.height - 44,
            borderRadius: (prompt.height - 44) / 2,
            display: "grid",
            placeItems: "center",
            background: send > 0 ? C.signal : ivory(0.1),
            color: send > 0 ? C.wall : ivory(0.5),
            fontFamily: FONT.mono,
            fontSize: 34,
            scale: `${1 + Math.sin(Math.min(1, Math.max(0, (frame - enter) / 8)) * Math.PI) * 0.14}`,
          }}
        >
          ↵
        </span>
      </div>
      <Vignette strength={0.35} />
      <Flash frame={frame} at={enter} peak={0.14} length={6} />
    </div>
  );
}

/**
 * 02 · El título (4–8 s): «Una toma. Todas las piezas.» golpeando en el
 * pulso sobre la misma toma, ya graduada, y la promesa: sin volver a grabar.
 */
export function TitleScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { width, height, land } = useStage();
  const copy = TRAILER_COPY[language];
  const slams = TIMING.cues.titleSlams.map((at) => at - 120);
  const subAt = TIMING.cues.titleSub - 120;
  const out = ramp(frame, 104, 120, EASE_IN);
  const hits = slams.map((at) => shake(frame, at, 12, 12));
  const hit = hits.reduce((sum, h) => ({ x: sum.x + h.x, y: sum.y + h.y }), { x: 0, y: 0 });
  const sub = ramp(frame, subAt, subAt + 12);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <Footage at={SHOTS.frontal} frame={{ x: 0, y: 0, width, height }} focal={FRONTAL_FOCAL} zoom={lerp(1, 1.1, ramp(frame, 0, 120, (t) => t))} filter={`${LOOK.graded} brightness(${land ? 0.6 : 0.46})`} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: land
            ? `linear-gradient(90deg, ${wall(0.82)} 0%, ${wall(0.45)} 42%, transparent 68%), linear-gradient(180deg, transparent 70%, ${wall(0.6)} 100%)`
            : `linear-gradient(180deg, ${wall(0.55)} 0%, ${wall(0.15)} 38%, ${wall(0.25)} 62%, ${wall(0.85)} 100%)`,
        }}
      />
      <div style={{ position: "absolute", ...(land ? { left: 120, top: 280 } : { left: 80, right: 60, top: 640 }), translate: `${hit.x}px ${hit.y}px`, opacity: 1 - out, filter: `blur(${out * 8}px)`, scale: `${lerp(1, 0.96, out)}` }}>
        {copy.title.map((line, i) => {
          const s = slam(frame, slams[i]);
          return (
            <div
              key={line}
              style={{
                fontFamily: FONT.display,
                fontWeight: 800,
                fontSize: 118,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: i === 0 ? C.ivory : i === 1 ? C.ivory : C.signal,
                opacity: s.opacity,
                scale: `${s.scale}`,
                filter: `blur(${s.blur}px)`,
                transformOrigin: "left center",
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          );
        })}
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 22, opacity: sub, translate: `${(1 - sub) * -30}px 0` }}>
          <span style={{ width: 64, height: 3, background: C.signal }} />
          <span style={{ fontFamily: FONT.body, fontWeight: 500, fontSize: 56, letterSpacing: "-0.02em", color: C.ivory }}>{copy.titleSub}</span>
        </div>
      </div>
      <Vignette strength={0.5} />
      {slams.map((at) => (
        <Flash key={at} frame={frame} at={at} peak={0.16} length={5} />
      ))}
    </div>
  );
}
