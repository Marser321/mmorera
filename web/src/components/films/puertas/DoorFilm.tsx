import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { C, EASE_IN_OUT, EASE_OUT, FONT, ivory, ramp, signal, wall } from "@/components/films/trailer/kit";
import { CONTENT_FORMATS, DOOR_COPY, WEBS_ADDRESS, campaignCopy } from "./copy";
import { DOORS, DOOR_SIZE, DOOR_SOURCE, SAFE, WEBS_UI, XFADE, doorFrames, secondShotStart, type DoorId, type DoorShot } from "./timing";

/**
 * Los films de las puertas de servicio (home, escena 02). Mismo criterio que
 * los reels de los casos (docs/films/CRITERIO-REELS.md): primero el cine, a
 * sangre y sin nada encima; después la interfaz, en la columna central, y el
 * video se repite sin salto. Cada puerta tiene su color (timing.ts). Todo sale
 * del cuadro: nada de transiciones CSS.
 */

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pad = (n: number) => String(n).padStart(4, "0");
/** Cuadros de cada plano, preparados por scripts/render-doors.ts. */
const plate = (door: DoorId, shot: 0 | 1, clipFrame: number) => staticFile(`${door}-${shot}/${pad(clipFrame)}.jpg`);

/** Dónde va la toma dentro del film: su punto focal cae en `target`, sin dejar bordes vacíos. */
export function placeShot(shot: DoorShot) {
  const scale = (DOOR_SIZE.height / DOOR_SOURCE.height) * shot.zoom;
  const width = DOOR_SOURCE.width * scale;
  const height = DOOR_SOURCE.height * scale;
  const within = (value: number, min: number) => Math.min(0, Math.max(min, value));
  return {
    left: within(shot.target[0] * DOOR_SIZE.width - shot.focal[0] * width, DOOR_SIZE.width - width),
    top: within(shot.target[1] * DOOR_SIZE.height - shot.focal[1] * height, DOOR_SIZE.height - height),
    width,
    height,
  };
}

function Plate({ door, shot, clipFrame, opacity = 1 }: { door: DoorId; shot: 0 | 1; clipFrame: number; opacity?: number }) {
  return <Img src={plate(door, shot, clipFrame)} style={{ position: "absolute", maxWidth: "none", opacity, ...placeShot(DOORS[door].shots[shot]) }} />;
}

/** Los dos planos, la cola que cierra el ciclo y el velo del color de la puerta. */
function Footage({ door }: { door: DoorId }) {
  const frame = useCurrentFrame();
  const total = doorFrames(door);
  const start = secondShotStart(door);
  const firstEnds = DOORS[door].shots[0].frames - XFADE;
  const tail = frame - (total - XFADE);
  const { tint, shade } = DOORS[door];
  return (
    <AbsoluteFill style={{ background: C.wall }}>
      {frame < firstEnds ? <Plate door={door} shot={0} clipFrame={frame + XFADE} /> : null}
      {frame >= start ? <Plate door={door} shot={1} clipFrame={frame - start} opacity={Math.min(1, (frame - start + 1) / (XFADE + 1))} /> : null}
      {tail >= 0 ? <Plate door={door} shot={0} clipFrame={tail} opacity={(tail + 1) / (XFADE + 1)} /> : null}
      {tint ? <AbsoluteFill style={{ background: tint.color, opacity: tint.strength, mixBlendMode: "soft-light" }} /> : null}
      {shade ? <AbsoluteFill style={{ background: C.wall, opacity: shade }} /> : null}
    </AbsoluteFill>
  );
}

/** Oscurece el centro mientras hay algo para leer; los costados siguen siendo cine. */
function Dim({ from, out, strength = 0.5 }: { from: number; out: number; strength?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(62% 56% at 50% 36%, ${wall(1)} 0%, ${wall(0.8)} 52%, ${wall(0.25)} 100%)`,
        opacity: interpolate(frame, [from - 6, from + 10, out - 8, out], [0, strength, strength, 0], CLAMP),
      }}
    />
  );
}

/** Entra subiendo y se va con el resto de la interfaz. */
function useEnter(at: number, out: number, length = 9): CSSProperties {
  const frame = useCurrentFrame();
  const shown = ramp(frame, at, at + length, EASE_OUT);
  return {
    opacity: shown * (1 - ramp(frame, out - 8, out, EASE_IN_OUT)),
    translate: `0px ${(1 - shown) * 26}px`,
  };
}

const column: CSSProperties = { position: "absolute", left: SAFE.x, top: SAFE.top, width: SAFE.width, display: "flex", flexDirection: "column", gap: 18 };
const glass: CSSProperties = { background: wall(0.8), border: `1.5px solid ${ivory(0.16)}`, color: ivory(0.94) };
const bubbleText: CSSProperties = { fontFamily: FONT.body, fontSize: 33, lineHeight: 1.26, fontWeight: 500, letterSpacing: "-0.01em" };

// ── 01 · Webs y landings ──────────────────────────────────────────────────

const WINDOW = { width: 480, bar: 34, view: 300 } as const;
/** El botón «Arma tu Cotización» dentro de la captura (1600×1000), llevado a la ventana. */
const CTA = { x: (118 / 1280) * WINDOW.width, y: (687 / 800) * WINDOW.view };

/** El lavado sigue de fondo; adelante, la web del caso: un clic y aparece el cotizador. */
function WebsOverlay() {
  const frame = useCurrentFrame();
  const { overlayFrom: from, overlayOut: out, tone } = DOORS.webs;
  const enter = useEnter(from, out, 11);
  const click = from + 38;
  const travel = ramp(frame, from + 16, click - 3, EASE_IN_OUT);
  const pressed = ramp(frame, click, click + 3) * (1 - ramp(frame, click + 3, click + 9));
  const turned = ramp(frame, click + 6, click + 20, EASE_IN_OUT);
  const cursorGone = ramp(frame, click + 14, click + 22);
  return (
    <>
      <Dim from={from} out={out} strength={0.38} />
      <div style={{ position: "absolute", left: SAFE.x + (SAFE.width - WINDOW.width) / 2, top: SAFE.top, width: WINDOW.width, ...enter }}>
        <div style={{ overflow: "hidden", borderRadius: 18, border: `1.5px solid ${ivory(0.22)}`, background: C.wall, boxShadow: `0 40px 90px -30px ${wall(0.95)}` }}>
          <div style={{ height: WINDOW.bar, display: "flex", alignItems: "center", gap: 7, padding: "0 14px", background: "#141413", borderBottom: `1px solid ${ivory(0.1)}` }}>
            {[0, 1, 2].map((dot) => (
              <span key={dot} style={{ width: 9, height: 9, borderRadius: 9, background: ivory(0.22) }} />
            ))}
            <span style={{ marginLeft: 10, padding: "3px 12px", borderRadius: 20, background: ivory(0.07), color: ivory(0.62), fontFamily: FONT.mono, fontSize: 13 }}>{WEBS_ADDRESS}</span>
          </div>
          {/* La página: la portada y, al clic, sube el cotizador. */}
          <div style={{ position: "relative", height: WINDOW.view, overflow: "hidden" }}>
            <Img src={staticFile(`webs-ui/${WEBS_UI[0]}`)} style={{ position: "absolute", left: 0, top: -turned * WINDOW.view, width: WINDOW.width, height: WINDOW.view }} />
            <Img src={staticFile(`webs-ui/${WEBS_UI[1]}`)} style={{ position: "absolute", left: 0, top: (1 - turned) * WINDOW.view, width: WINDOW.width, height: WINDOW.view }} />
          </div>
        </div>
        {/* El clic: un anillo del color de la puerta y el puntero que llega al botón. */}
        <span
          style={{
            position: "absolute",
            left: CTA.x - 22,
            top: WINDOW.bar + CTA.y - 22,
            width: 44,
            height: 44,
            borderRadius: 44,
            border: `2px solid ${tone}`,
            opacity: pressed,
            scale: String(0.6 + ramp(frame, click, click + 9) * 0.9),
          }}
        />
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: interpolate(travel, [0, 1], [WINDOW.width - 70, CTA.x - 3]),
            top: WINDOW.bar + interpolate(travel, [0, 1], [WINDOW.view - 40, CTA.y - 2]),
            opacity: ramp(frame, from + 12, from + 18) * (1 - cursorGone),
            scale: String(1 - pressed * 0.14),
          }}
        >
          <path d="M4 2.5 19.5 12l-7 1.6L9.4 21 4 2.5Z" fill={C.ivory} stroke={C.wall} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}

// ── 02 · Agentes de IA ────────────────────────────────────────────────────

/** Mientras el barbero corta, alguien pregunta y el agente responde. */
function AgentesOverlay({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { overlayFrom: from, overlayOut: out } = DOORS.agentes;
  const copy = DOOR_COPY[language];
  const answerAt = from + 38;
  const question = useEnter(from + 2, out);
  const answer = useEnter(answerAt, out);
  const handoff = useEnter(from + 68, out);
  const typing = ramp(frame, from + 16, from + 22) * (1 - ramp(frame, answerAt - 4, answerAt));
  return (
    <>
      <Dim from={from} out={out} />
      <div style={column}>
        <div style={{ ...bubbleText, ...question, alignSelf: "flex-end", maxWidth: 470, padding: "16px 24px", borderRadius: "28px 28px 8px 28px", background: ivory(0.97), color: C.wall }}>{copy.question}</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, display: "flex", gap: 9, padding: "22px 24px", borderRadius: "28px 28px 28px 8px", opacity: typing, ...glass }}>
            {[0, 1, 2].map((dot) => (
              <span key={dot} style={{ width: 11, height: 11, borderRadius: 11, background: ivory(0.5 + 0.45 * Math.max(0, Math.sin(((frame - from) / 5 - dot * 0.9) * 1.6))) }} />
            ))}
          </div>
          <div style={{ ...bubbleText, ...answer, maxWidth: 470, padding: "16px 24px", borderRadius: "28px 28px 28px 8px", ...glass }}>{copy.answer}</div>
        </div>
        <div style={{ ...handoff, alignSelf: "center", display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 40, border: `2px solid ${signal(0.5)}`, background: wall(0.7), color: C.signal, fontFamily: FONT.body, fontSize: 26, fontWeight: 500 }}>
          <span style={{ width: 11, height: 11, borderRadius: 11, background: C.signal }} />
          {copy.handoff}
        </div>
      </div>
    </>
  );
}

// ── 03 · Automatización y CRM ─────────────────────────────────────────────

const ROW = 66;
const ROW_GAP = 18;
const NODE = 56;
const STEP = 15;

/** Una reserva en te_Cargo: un pulso baja y enciende cada paso, sin que nadie lo empuje. */
function SistemasOverlay({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { overlayFrom: from, overlayOut: out, tone } = DOORS.sistemas;
  const flow = DOOR_COPY[language].flow;
  const gone = 1 - ramp(frame, out - 8, out, EASE_IN_OUT);
  const first = from + 8;
  const last = first + STEP * (flow.length - 1);
  const span = (ROW + ROW_GAP) * (flow.length - 1);
  const travelled = interpolate(frame, [first, last], [0, span], { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <>
      <Dim from={from} out={out} />
      <div style={{ position: "absolute", left: SAFE.x, top: SAFE.top, width: SAFE.width, display: "flex", justifyContent: "center", opacity: gone }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: ROW_GAP }}>
          {/* La línea que une los pasos y el tramo que el pulso ya recorrió. */}
          <div style={{ position: "absolute", left: NODE / 2 - 1, top: ROW / 2, width: 2, height: span, background: ivory(0.18), opacity: ramp(frame, from, from + 10) }} />
          <div style={{ position: "absolute", left: NODE / 2 - 1.5, top: ROW / 2, width: 3, height: travelled, background: tone, boxShadow: `0 0 18px ${tone}` }} />
          {flow.map((label, index) => {
            const at = first + STEP * index;
            const reached = ramp(frame, at - 2, at + 6, EASE_OUT);
            const shown = ramp(frame, at - 4, at + 6, EASE_OUT);
            return (
              <div key={label} style={{ position: "relative", height: ROW, display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    width: NODE,
                    height: NODE,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: NODE,
                    border: `2px solid ${tone}`,
                    background: `color-mix(in srgb, ${tone} ${Math.round(reached * 100)}%, ${C.wall})`,
                    color: reached > 0.5 ? C.wall : tone,
                    fontFamily: FONT.mono,
                    fontSize: 19,
                    fontWeight: 700,
                    opacity: ramp(frame, from + index * 2, from + 8 + index * 2),
                    boxShadow: `0 0 ${26 * reached}px ${tone}`,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span style={{ ...bubbleText, fontSize: 28, padding: "12px 20px", borderRadius: 16, whiteSpace: "nowrap", opacity: shown, translate: `${(1 - shown) * -18}px 0px`, ...glass }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── 04 · Contenido con IA ─────────────────────────────────────────────────

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CENTER = { x: DOOR_SIZE.width / 2, y: 310 };
const centered = (width: number, height: number): Box => ({ x: CENTER.x - width / 2, y: CENTER.y - height / 2, width, height });
/** La misma escena, reencuadrada a cada formato. */
const CROPS: readonly [Box, Box, Box] = [centered(500, 281), centered(236, 420), centered(380, 380)];
const mix = (a: Box, b: Box, t: number): Box => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, width: a.width + (b.width - a.width) * t, height: a.height + (b.height - a.height) * t });

function Corner({ style }: { style: CSSProperties }) {
  return <span style={{ position: "absolute", width: 34, height: 34, ...style }} />;
}

/** Una escena generada, todas las piezas: el visor salta de 16:9 a 9:16 y a 1:1 sobre la misma imagen. */
function ContenidoOverlay() {
  const frame = useCurrentFrame();
  const { overlayFrom: from, overlayOut: out } = DOORS.contenido;
  const toVertical = from + 32;
  const toSquare = toVertical + 30;
  const first = ramp(frame, toVertical, toVertical + 8, EASE_IN_OUT);
  const second = ramp(frame, toSquare, toSquare + 8, EASE_IN_OUT);
  const rect = mix(mix(CROPS[0], CROPS[1], first), CROPS[2], second);
  const shown = ramp(frame, from, from + 6) * (1 - ramp(frame, out - 6, out, EASE_IN_OUT));
  const settle = 1 + 0.07 * (1 - ramp(frame, from, from + 8, EASE_OUT));
  const format = CONTENT_FORMATS[frame < toVertical + 4 ? 0 : frame < toSquare + 4 ? 1 : 2];
  const line = `3px solid ${C.ivory}`;
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height, opacity: shown, scale: String(settle), boxShadow: `0 0 0 2000px ${wall(0.5)}` }}>
      <Corner style={{ left: -1.5, top: -1.5, borderLeft: line, borderTop: line }} />
      <Corner style={{ right: -1.5, top: -1.5, borderRight: line, borderTop: line }} />
      <Corner style={{ left: -1.5, bottom: -1.5, borderLeft: line, borderBottom: line }} />
      <Corner style={{ right: -1.5, bottom: -1.5, borderRight: line, borderBottom: line }} />
      <span style={{ position: "absolute", left: 14, top: 14, display: "flex", gap: 9, alignItems: "center", padding: "6px 12px", borderRadius: 8, background: C.ivory, color: C.wall, fontFamily: FONT.mono, fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
        {format.ratio}
        <span style={{ opacity: 0.6 }}>{format.piece}</span>
      </span>
    </div>
  );
}

// ── Campañas con IA (portada de /campanas) ────────────────────────────────

const FINDING = 52;
/** La pregunta ocupa dos líneas en los dos idiomas: la caja no cambia de alto mientras se escribe. */
const PROMPT = { size: 27, leading: 1.22, pad: 14 } as const;
const FINDING_GAP = 10;

/** Una pregunta a la cuenta de anuncios: la máquina encuentra tres cosas y una persona decide cada una. */
function CampanasOverlay({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { overlayFrom: from, overlayOut: out, tone } = DOORS.campanas;
  const copy = campaignCopy(language);
  const prompt = useEnter(from + 2, out);
  const decides = useEnter(from + 76, out);
  const gone = 1 - ramp(frame, out - 8, out, EASE_IN_OUT);
  // La pregunta se escribe sola, letra por letra.
  const typed = Math.round(interpolate(frame, [from + 4, from + 20], [0, copy.prompt.length], CLAMP));
  return (
    <>
      <Dim from={from} out={out} strength={0.62} />
      <div style={{ ...column, gap: 14 }}>
        <div style={{ ...prompt, display: "flex", alignItems: "flex-start", gap: 14, padding: `${PROMPT.pad}px 20px`, minHeight: PROMPT.size * PROMPT.leading * 2 + PROMPT.pad * 2, boxSizing: "border-box", borderRadius: 18, background: wall(0.86), border: `2px solid ${tone}`, color: ivory(0.96), fontFamily: FONT.body, fontSize: PROMPT.size, lineHeight: PROMPT.leading, fontWeight: 500, letterSpacing: "-0.01em", boxShadow: `0 0 34px color-mix(in srgb, ${tone} 34%, transparent)` }}>
          <span style={{ width: 12, height: 12, flexShrink: 0, marginTop: (PROMPT.size * PROMPT.leading - 12) / 2, borderRadius: 12, background: tone, boxShadow: `0 0 16px ${tone}` }} />
          <span>{copy.prompt.slice(0, typed)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: FINDING_GAP, opacity: gone }}>
          {copy.rows.map((row, index) => {
            const at = from + 22 + index * 10;
            const shown = ramp(frame, at, at + 8, EASE_OUT);
            const decided = ramp(frame, from + 52 + index * 8, from + 58 + index * 8, EASE_OUT);
            const mark = row.approved ? C.signal : ivory(0.9);
            return (
              <div key={row.id} style={{ ...glass, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: FINDING, padding: "0 16px 0 18px", borderRadius: 14, opacity: shown, translate: `0px ${(1 - shown) * 16}px`, fontFamily: FONT.body, fontSize: 25, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
                <span>{row.title}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 30, border: `1.5px solid ${row.approved ? signal(0.6) : ivory(0.4)}`, color: mark, fontSize: 18, opacity: decided, scale: String(1.12 - 0.12 * decided) }}>
                  <span style={{ width: 8, height: 8, borderRadius: 8, background: mark }} />
                  {row.verdict}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ ...decides, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10, color: tone, fontWeight: 700 }}>
            <span style={{ width: 22, height: 2, background: tone }} />
            {copy.decides}
          </span>
          <span style={{ color: ivory(0.6) }}>{copy.badge}</span>
        </div>
      </div>
    </>
  );
}

// ── El film de cada puerta ────────────────────────────────────────────────

export function DoorFilm({ door, language }: { door: DoorId; language: FilmLanguage }) {
  const overlays: Record<DoorId, ReactNode> = {
    webs: <WebsOverlay />,
    agentes: <AgentesOverlay language={language} />,
    sistemas: <SistemasOverlay language={language} />,
    contenido: <ContenidoOverlay />,
    campanas: <CampanasOverlay language={language} />,
  };
  return (
    <AbsoluteFill style={{ background: C.wall, overflow: "hidden" }}>
      <Footage door={door} />
      {overlays[door]}
    </AbsoluteFill>
  );
}
