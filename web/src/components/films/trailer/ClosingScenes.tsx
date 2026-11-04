import type { ReactNode } from "react";
import { staticFile, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { DustField, ParticleLogo } from "../scenes/brand/ParticleLogo";
import { PIECE_TITLE, TRAILER_COPY } from "./copy";
import { Piece } from "./Piece";
import { C, EASE_IN, FONT, Flash, SceneHeader, StoneMonogram, TIMING, box, ivory, lerp, ramp, shake, signal, slam, timelineSegments, wall, type Rect } from "./kit";
import { TRAILER_CODE } from "./trailerCode";

/**
 * 09 · Revisión (32–36 s), el respiro. La pieza terminada y la revisión de
 * una persona: tres comprobaciones, una por pulso, y el sello.
 */
export function ReviewScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const copy = TRAILER_COPY[language].review;
  const checks = TIMING.cues.reviewChecks.map((at) => at - 960);
  const stampAt = TIMING.cues.reviewStamp - 960;
  const card: Rect = { x: 80, y: 500, width: 440, height: 782.2 };
  const panel: Rect = { x: 552, y: 560, width: 448, height: 560 };
  const cardIn = ramp(frame, -6, 10);
  const panelIn = ramp(frame, 2, 16);
  const stamp = slam(frame, stampAt, 8);
  const hit = shake(frame, stampAt, 7, 10);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall, translate: `${hit.x}px ${hit.y}px` }}>
      <SceneHeader index={7} chip={copy.chip} line={copy.line} frame={frame} exitAt={110} />
      <div style={{ ...box(card), borderRadius: 22, overflow: "hidden", border: `1px solid ${ivory(0.14)}`, opacity: cardIn, translate: `0 ${(1 - cardIn) * 40}px`, boxShadow: `0 30px 80px ${wall(0.6)}` }}>
        <Piece width={card.width} height={card.height} lines={PIECE_TITLE[language]} />
      </div>
      <div style={{ ...box(panel), borderRadius: 24, background: C.relief, border: `1px solid ${ivory(0.14)}`, padding: "34px 34px", opacity: panelIn, translate: `${(1 - panelIn) * 60}px 0` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT.mono, fontSize: 21, letterSpacing: "0.14em", textTransform: "uppercase", color: ivory(0.7) }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.signal }} />
          {copy.panel}
        </div>
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 34 }}>
          {copy.checks.map((label, i) => {
            const fill = ramp(frame, checks[i], checks[i] + 5);
            const draw = ramp(frame, checks[i] + 2, checks[i] + 9);
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <svg width={52} height={52} viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
                  <rect x={2} y={2} width={48} height={48} rx={13} fill={fill > 0 ? signal(fill) : "none"} stroke={fill > 0 ? C.signal : ivory(0.3)} strokeWidth={2.5} />
                  <path d="M15 27 L23 35 L38 18" fill="none" stroke={C.wall} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - draw)} />
                </svg>
                <span style={{ fontFamily: FONT.body, fontSize: 36, lineHeight: 1.12, fontWeight: 500, letterSpacing: "-0.02em", color: fill > 0 ? C.ivory : ivory(0.55) }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1336,
          translate: "-50% 0",
          padding: "22px 32px",
          borderRadius: 22,
          border: `3px solid ${C.signal}`,
          background: wall(0.88),
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: FONT.body,
          fontWeight: 600,
          fontSize: 42,
          letterSpacing: "-0.02em",
          color: C.signal,
          whiteSpace: "nowrap",
          opacity: stamp.opacity,
          scale: `${stamp.scale}`,
          filter: `blur(${stamp.blur}px)`,
          rotate: "-4deg",
          boxShadow: `0 20px 60px ${wall(0.7)}`,
        }}
      >
        <svg width={44} height={44} viewBox="0 0 44 44">
          <circle cx={22} cy={22} r={20} fill={C.signal} />
          <path d="M12 23 L19 30 L32 15" fill="none" stroke={C.wall} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {copy.stamp}
      </div>
    </div>
  );
}

/** Colorea una línea de JSX: etiquetas, atributos, valores y textos. */
function highlight(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(<\/?)([A-Za-z]+)|(\/?>)|([A-Za-z]+)(=)|(\{[^}]*\})|("[^"]*")/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(line))) {
    if (match.index > last) parts.push(<span key={key++}>{line.slice(last, match.index)}</span>);
    if (match[1]) {
      parts.push(<span key={key++} style={{ color: ivory(0.42) }}>{match[1]}</span>);
      parts.push(<span key={key++} style={{ color: C.signal }}>{match[2]}</span>);
    } else if (match[3]) parts.push(<span key={key++} style={{ color: ivory(0.42) }}>{match[3]}</span>);
    else if (match[4]) {
      parts.push(<span key={key++} style={{ color: ivory(0.78) }}>{match[4]}</span>);
      parts.push(<span key={key++} style={{ color: ivory(0.42) }}>{match[5]}</span>);
    } else if (match[6]) parts.push(<span key={key++} style={{ color: C.violet }}>{match[6]}</span>);
    else if (match[7]) parts.push(<span key={key++} style={{ color: C.amber }}>{match[7]}</span>);
    last = pattern.lastIndex;
  }
  if (last < line.length) parts.push(<span key={key++}>{line.slice(last)}</span>);
  return parts;
}

/**
 * 10 · Código (36–40 s). La revelación: este mismo video, como código y
 * como línea de tiempo, con el cabezal recorriendo las once escenas.
 */
export function CodeScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const copy = TRAILER_COPY[language].code;
  const panel: Rect = { x: 80, y: 600, width: 920, height: 640 };
  const timeline: Rect = { x: 80, y: 1272, width: 920, height: 300 };
  const lineHeight = 37;
  const scroll = ramp(frame, 18, 112, (t) => t) * (TRAILER_CODE.length - 14) * lineHeight;
  const reveal = (i: number) => ramp(frame, 6 + i * 1.2, 12 + i * 1.2);
  const head = ramp(frame, 14, 112, (t) => t);
  const playFrame = Math.round(head * TIMING.total);
  const panelIn = ramp(frame, -6, 8);
  const exit = ramp(frame, 108, 120, EASE_IN);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <SceneHeader index={8} chip={copy.chip} line={copy.line} frame={frame} size={76} sub={copy.sub} subAt={34} exitAt={108} />
      <div style={{ ...box(panel), borderRadius: 24, overflow: "hidden", background: C.relief, border: `1px solid ${ivory(0.14)}`, opacity: panelIn * (1 - exit), scale: `${lerp(0.97, 1, panelIn) * lerp(1, 0.96, exit)}` }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", gap: 10, padding: "0 24px", borderBottom: `1px solid ${ivory(0.1)}` }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 13, height: 13, borderRadius: 7, background: ivory(0.2) }} />
          ))}
          <span style={{ marginLeft: 14, fontFamily: FONT.mono, fontSize: 20, color: ivory(0.7) }}>ContentTrailer.tsx</span>
          <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: 18, color: C.signal }}>remotion</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 58, bottom: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 18 - scroll }}>
            {TRAILER_CODE.map((line, i) => (
              <div key={i} style={{ display: "flex", height: lineHeight, alignItems: "center", fontFamily: FONT.mono, fontSize: 22, whiteSpace: "pre", color: C.ivory, opacity: reveal(i) }}>
                <span style={{ width: 66, textAlign: "right", paddingRight: 22, color: ivory(0.28) }}>{i + 1}</span>
                <span>{highlight(line)}</span>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: `linear-gradient(180deg, ${C.relief}, transparent)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: `linear-gradient(0deg, ${C.relief}, transparent)` }} />
        </div>
      </div>
      <div style={{ ...box(timeline), borderRadius: 24, background: C.relief, border: `1px solid ${ivory(0.14)}`, opacity: ramp(frame, 0, 12) * (1 - exit) }}>
        <div style={{ position: "absolute", left: 24, right: 24, top: 22, display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: 19, letterSpacing: "0.12em", color: ivory(0.65) }}>
          <span>TIMELINE · 30 FPS</span>
          <span style={{ color: C.signal }}>{`00:${String(Math.floor(playFrame / 30)).padStart(2, "0")}:${String(playFrame % 30).padStart(2, "0")}`}</span>
        </div>
        {timelineSegments(timeline.width - 48, 6, 24).map(({ scene, width, left }, i) => {
          const active = playFrame >= scene.from && playFrame < scene.from + scene.duration;
          return (
            <div key={scene.id}>
              <div style={{ position: "absolute", left, top: 74, width, height: 92, borderRadius: 10, background: active ? signal(0.22) : ivory(0.08), border: `1.5px solid ${active ? C.signal : ivory(0.14)}`, display: "grid", placeItems: "center", fontFamily: FONT.mono, fontSize: 17, color: active ? C.signal : ivory(0.55) }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ position: "absolute", left, top: 182, width, height: 70, display: "flex", alignItems: "center", gap: 3, overflow: "hidden" }}>
                {Array.from({ length: Math.max(3, Math.round(width / 9)) }, (_, j) => (
                  <span key={j} style={{ flex: 1, height: `${20 + 70 * Math.abs(Math.sin(i * 1.7 + j * 0.9))}%`, borderRadius: 2, background: ivory(0.22) }} />
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 24 + head * (timeline.width - 48), top: 62, width: 3, height: 202, background: C.ivory, boxShadow: `0 0 16px ${ivory(0.6)}` }}>
          <div style={{ position: "absolute", left: -9, top: -10, width: 21, height: 14, borderRadius: 4, background: C.ivory }} />
        </div>
      </div>
    </div>
  );
}

/**
 * 11 · Cierre (40–46 s). Las partículas del sitio dibujan el monograma; queda
 * la marca con su textura de piedra, el servicio, la capa humana y la dirección.
 */
export function FinaleScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const copy = TRAILER_COPY[language].finale;
  const size = 620;
  const center = { x: 540, y: 760 };
  const logoHeight = size * (1885.03 / 2239.69);
  const solid = ramp(frame, 44, 64);
  const service = ramp(frame, 60, 74);
  const human = ramp(frame, 74, 88);
  const url = ramp(frame, 88, 100);
  const fadeOut = ramp(frame, 168, 180, EASE_IN);
  const breathe = 1 + Math.sin(frame / 40) * 0.006;

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <DustField color={C.ivory} count={70} seed={9} opacity={0.22} />
      <ParticleLogo src={staticFile("marca/monograma.svg")} mode="alpha" colors={[C.ivory, C.ivory, "#CFC8BA", C.signal]} size={size} center={center} formFrom={2} formTo={46} count={2600} restAlpha={0.28} />
      <StoneMonogram size={size} style={{ left: center.x - size / 2, top: center.y - logoHeight / 2, opacity: solid, scale: `${breathe}` }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 1150, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 70, lineHeight: 1.05, letterSpacing: "-0.035em", color: C.ivory, opacity: service, translate: `0 ${(1 - service) * 30}px` }}>{copy.service}</div>
        <div style={{ marginTop: 26, fontFamily: FONT.body, fontWeight: 400, fontSize: 44, letterSpacing: "-0.015em", color: ivory(0.74), opacity: human, translate: `0 ${(1 - human) * 24}px` }}>{copy.human}</div>
        <div style={{ marginTop: 54, display: "inline-block", padding: "16px 32px", borderRadius: 999, border: `1.5px solid ${signal(0.5)}`, fontFamily: FONT.mono, fontSize: 32, letterSpacing: "0.04em", color: C.signal, opacity: url, scale: `${lerp(0.92, 1, url)}` }}>{copy.url}</div>
      </div>
      <Flash frame={frame} at={0} peak={0.4} length={8} />
      <div style={{ position: "absolute", inset: 0, background: C.wall, opacity: fadeOut }} />
    </div>
  );
}
