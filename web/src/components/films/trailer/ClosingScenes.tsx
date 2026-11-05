import type { ReactNode } from "react";
import { staticFile, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { DustField, ParticleLogo } from "../scenes/brand/ParticleLogo";
import { TRAILER_COPY } from "./copy";
import { C, EASE_IN, FONT, Flash, SceneHeader, StoneMonogram, TIMING, box, ivory, lerp, ramp, signal, timelineSegments, useStage, type Rect } from "./kit";
import { TRAILER_CODE } from "./trailerCode";

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
 * 16 · Código (51–54 s). La revelación: este mismo video, como código y
 * como línea de tiempo, con el cabezal recorriendo sus diecisiete escenas.
 */
export function CodeScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].code;
  const panel: Rect = land ? { x: 760, y: 120, width: 1060, height: 520 } : { x: 80, y: 600, width: 920, height: 640 };
  const timeline: Rect = land ? { x: 760, y: 670, width: 1060, height: 290 } : { x: 80, y: 1272, width: 920, height: 300 };
  const lineHeight = land ? 34 : 37;
  const visible = Math.floor((panel.height - 76) / lineHeight);
  const scroll = ramp(frame, 14, 84, (t) => t) * (TRAILER_CODE.length - visible) * lineHeight;
  const reveal = (i: number) => ramp(frame, 4 + Math.min(i, visible) * 1.1, 10 + Math.min(i, visible) * 1.1);
  const head = ramp(frame, 10, 84, (t) => t);
  const playFrame = Math.round(head * TIMING.total);
  const panelIn = ramp(frame, -6, 8);
  const exit = ramp(frame, 80, 90, EASE_IN);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <SceneHeader index={6} chip={copy.chip} line={copy.line} frame={frame} size={76} sub={copy.sub} subAt={26} exitAt={80} />
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
              <div key={i} style={{ display: "flex", height: lineHeight, alignItems: "center", fontFamily: FONT.mono, fontSize: land ? 20 : 22, whiteSpace: "pre", color: C.ivory, opacity: reveal(i) }}>
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
        {timelineSegments(timeline.width - 48, 5, 24).map(({ scene, width, left }, i) => {
          const active = playFrame >= scene.from && playFrame < scene.from + scene.duration;
          return (
            <div key={scene.id}>
              <div style={{ position: "absolute", left, top: 74, width, height: 92, borderRadius: 8, background: active ? signal(0.22) : ivory(0.08), border: `1.5px solid ${active ? C.signal : ivory(0.14)}`, display: "grid", placeItems: "center", fontFamily: FONT.mono, fontSize: 14, color: active ? C.signal : ivory(0.55) }}>
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
 * 17 · Cierre (54–60 s). Las partículas del sitio dibujan el monograma; queda
 * la marca con su textura de piedra, el servicio, la capa humana y la dirección.
 */
export function FinaleScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].finale;
  const size = land ? 420 : 620;
  const center = land ? { x: 960, y: 370 } : { x: 540, y: 760 };
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
      <ParticleLogo src={staticFile("marca/monograma.svg")} mode="alpha" colors={[C.ivory, C.ivory, "#CFC8BA", C.signal]} size={size} center={center} formFrom={-18} formTo={40} count={2600} restAlpha={0.28} />
      <StoneMonogram size={size} style={{ left: center.x - size / 2, top: center.y - logoHeight / 2, opacity: solid, scale: `${breathe}` }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: land ? 640 : 1150, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: land ? 64 : 70, lineHeight: 1.05, letterSpacing: "-0.035em", color: C.ivory, opacity: service, translate: `0 ${(1 - service) * 30}px` }}>{copy.service}</div>
        <div style={{ marginTop: land ? 20 : 26, fontFamily: FONT.body, fontWeight: 400, fontSize: land ? 40 : 44, letterSpacing: "-0.015em", color: ivory(0.74), opacity: human, translate: `0 ${(1 - human) * 24}px` }}>{copy.human}</div>
        <div style={{ marginTop: land ? 40 : 54, display: "inline-block", padding: "16px 32px", borderRadius: 999, border: `1.5px solid ${signal(0.5)}`, fontFamily: FONT.mono, fontSize: land ? 30 : 32, letterSpacing: "0.04em", color: C.signal, opacity: url, scale: `${lerp(0.92, 1, url)}` }}>{copy.url}</div>
      </div>
      <Flash frame={frame} at={0} peak={0.4} length={8} />
      <div style={{ position: "absolute", inset: 0, background: C.wall, opacity: fadeOut }} />
    </div>
  );
}
