import { Img, staticFile, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { TRAILER_COPY } from "./copy";
import {
  C,
  CropBrackets,
  EASE_IN,
  EASE_IN_OUT,
  FILM_SIZE,
  FONT,
  Footage,
  Grain,
  LOOK,
  SHOTS,
  SceneHeader,
  TIMING,
  Tag,
  box,
  hash,
  ivory,
  lerp,
  mixRect,
  ramp,
  sceneOf,
  signal,
  useStage,
  wall,
  type Rect,
} from "./kit";

/**
 * La caja donde se ve cada edición: debajo del rótulo en vertical, a la
 * derecha del rótulo en horizontal.
 */
function editCard(land: boolean, tall = 1180): Rect {
  return land ? { x: 760, y: 130, width: 1060, height: 820 } : { x: 80, y: 470, width: 920, height: tall };
}

/**
 * 03 · Reencuadre (8–11 s). La toma en 16:9; el visor 9:16 empieza al centro,
 * sobre los monitores, y se desliza hasta la persona. Después el recorte se
 * despega y se vuelve la pieza vertical.
 */
export function ReframeScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].reframe;
  const viewer: Rect = land ? { x: 760, y: 236, width: 1060, height: 596.25 } : { x: 0, y: 600, width: 1080, height: 607.5 };
  const s0 = viewer.width / FILM_SIZE.width;
  const cropW = (FILM_SIZE.height * 9) / 16;
  const cropX = lerp((FILM_SIZE.width - cropW) / 2, 606, ramp(frame, 14, 40, EASE_IN_OUT));
  const cropRect: Rect = { x: viewer.x + cropX * s0, y: viewer.y, width: cropW * s0, height: viewer.height };
  const card: Rect = land ? { x: 1048, y: 110, width: 483.75, height: 860 } : { x: 229, y: 560, width: 622, height: 1105.8 };
  const lift = ramp(frame, 46, 68, EASE_IN_OUT);
  const rect = mixRect(cropRect, card, lift);
  const scale = rect.height / FILM_SIZE.height;
  const push = lerp(1, 1.04, ramp(frame, 68, 90, (t) => t));
  const viewerIn = ramp(frame, -6, 6);
  const viewerOut = ramp(frame, 46, 58);
  const veil = ramp(frame, 36, 46) * (1 - viewerOut);
  const brackets = ramp(frame, 8, 16);
  const ready = ramp(frame, 70, 78);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <SceneHeader index={1} chip={copy.chip} line={copy.line} frame={frame} />
      <div style={{ ...box(viewer), overflow: "hidden", opacity: viewerIn * (1 - viewerOut) }}>
        <Footage at={SHOTS.monitors} frame={{ x: 0, y: 0, width: viewer.width, height: viewer.height }} filter={LOOK.graded} />
        <div style={{ position: "absolute", left: cropRect.x - viewer.x, top: 0, width: cropRect.width, height: viewer.height, boxShadow: `0 0 0 2400px ${wall(0.72 * veil)}` }} />
        <Tag style={{ left: 24, top: 22, opacity: 1 - veil }}>16:9</Tag>
      </div>
      {lift > 0 ? (
        <div style={{ ...box(rect), overflow: "hidden", borderRadius: lerp(0, 26, lift), boxShadow: `0 30px 90px ${wall(0.7 * lift)}` }}>
          <Footage
            at={SHOTS.monitors}
            frame={{ x: 0, y: 0, width: rect.width, height: rect.height }}
            inner={{ x: -cropX * scale * push + (rect.width * (1 - push)) / 2, y: (rect.height * (1 - push)) / 2, width: FILM_SIZE.width * scale * push, height: FILM_SIZE.height * scale * push }}
            filter={LOOK.graded}
          />
          <Tag tone="signal" style={{ left: 20, top: 20, opacity: ready, translate: `0 ${(1 - ready) * -10}px` }}>
            ✓ {copy.ready}
          </Tag>
        </div>
      ) : null}
      <CropBrackets rect={lift > 0 ? { x: rect.x - 10, y: rect.y - 10, width: rect.width + 20, height: rect.height + 20 } : cropRect} opacity={brackets * (1 - ramp(frame, 76, 86))} />
      <div style={{ position: "absolute", left: cropRect.x, top: viewer.y - 46, width: cropRect.width, textAlign: "center", fontFamily: FONT.mono, fontSize: 21, letterSpacing: "0.12em", color: C.signal, opacity: brackets * (1 - lift) }}>9:16</div>
    </div>
  );
}

/** Barras de una forma de onda (determinísticas). */
function waveBars(count: number, seed: number) {
  return Array.from({ length: count }, (_, i) => {
    const envelope = 0.35 + 0.65 * Math.abs(Math.sin((i / count) * Math.PI * 3.2 + seed));
    return 0.18 + 0.82 * envelope * (0.45 + 0.55 * hash(i * 7 + seed));
  });
}

/**
 * 04 · Subtítulos (11–14 s). La forma de onda corre debajo; cada palabra
 * entra en su golpe y la que suena se marca con la señal de la marca.
 */
export function CaptionsScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].captions;
  const card = editCard(land);
  const times = TIMING.cues.captionWords.map((at) => at - sceneOf("captions").from);
  const lines = copy.words;
  const lineIndex = frame >= times[3] ? 1 : 0;
  const offset = lineIndex === 0 ? 0 : 3;
  const bars = waveBars(60, 2.1);
  const head = ramp(frame, 6, 84, (t) => t);
  const cardIn = ramp(frame, -6, 8);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <SceneHeader index={2} chip={copy.chip} line={copy.line} frame={frame} />
      <div style={{ ...box(card), overflow: "hidden", borderRadius: 28, opacity: cardIn, scale: `${lerp(0.96, 1, cardIn)}`, border: `1px solid ${ivory(0.12)}` }}>
        <Footage at={SHOTS.frontal} frame={{ x: 0, y: 0, width: card.width, height: card.height }} focal={[0.68, 0.36]} zoom={lerp(1.02, 1.08, ramp(frame, 0, 90, (t) => t))} filter={`${LOOK.graded} brightness(0.9)`} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 45%, ${wall(0.78)} 82%, ${wall(0.92)} 100%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: land ? 470 : 742, display: "flex", justifyContent: "center", gap: 12 }}>
          {lines[lineIndex].map((word, i) => {
            const at = times[offset + i];
            const nextAt = times[offset + i + 1] ?? 999;
            const t = ramp(frame, at, at + 6);
            const active = frame >= at && frame < nextAt && !(lineIndex === 1 && i === 2 && frame > at + 24);
            return (
              <span
                key={`${lineIndex}-${word}`}
                style={{
                  display: "inline-block",
                  padding: "4px 16px 10px",
                  borderRadius: 16,
                  fontFamily: FONT.body,
                  fontWeight: 700,
                  fontSize: 76,
                  letterSpacing: "-0.03em",
                  color: active ? C.wall : C.ivory,
                  background: active ? C.signal : "transparent",
                  textShadow: active ? "none" : `0 6px 30px ${wall(0.7)}`,
                  opacity: t,
                  scale: `${lerp(1.25, 1, t)}`,
                  translate: `0 ${(1 - t) * 24}px`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 48, right: 48, top: land ? 640 : 930, height: land ? 100 : 120, display: "flex", alignItems: "center", gap: 5 }}>
          {bars.map((height, i) => {
            const played = i / bars.length <= head;
            return <div key={i} style={{ flex: 1, height: `${height * 100}%`, borderRadius: 3, background: played ? C.signal : ivory(0.3) }} />;
          })}
          <div style={{ position: "absolute", left: `${head * 100}%`, top: -18, bottom: -18, width: 3, background: C.ivory, boxShadow: `0 0 18px ${ivory(0.6)}` }} />
        </div>
        <Tag style={{ left: 24, top: 24 }}>Auto · ES · EN</Tag>
      </div>
    </div>
  );
}

/**
 * 05 · Color (14–17 s). Antes y después con una cortina que va y viene en
 * el pulso; después, tres looks seguidos: cálido, frío y el de la marca.
 */
export function ColorScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].color;
  const card = editCard(land);
  const inner: Rect = { x: 0, y: 0, width: card.width, height: card.height };
  const looks = TIMING.cues.colorLooks.map((at) => at - sceneOf("color").from);
  const split =
    frame < 22
      ? lerp(1, 0.3, ramp(frame, 4, 22, EASE_IN_OUT))
      : frame < 34
        ? lerp(0.3, 0.64, ramp(frame, 22, 32, EASE_IN_OUT))
        : lerp(0.64, 0, ramp(frame, 34, 44, EASE_IN_OUT));
  const labels = ramp(frame, 6, 12) * (1 - ramp(frame, 40, 44));
  const warm = ramp(frame, looks[0], looks[0] + 5);
  const cool = ramp(frame, looks[1], looks[1] + 5);
  const brand = ramp(frame, looks[2], looks[2] + 5);
  const activeLook = frame >= looks[2] ? 2 : frame >= looks[1] ? 1 : frame >= looks[0] ? 0 : -1;
  const pills = ramp(frame, looks[0] - 8, looks[0]);
  const cardIn = ramp(frame, -6, 8);
  const zoom = lerp(1.02, 1.07, ramp(frame, 0, 90, (t) => t));
  const shot = { at: SHOTS.shoulder, focal: [0.36, 0.45] as const };

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <SceneHeader index={3} chip={copy.chip} line={copy.line} frame={frame} />
      <div style={{ ...box(card), overflow: "hidden", borderRadius: 28, opacity: cardIn, border: `1px solid ${ivory(0.12)}` }}>
        <Footage at={shot.at} frame={inner} focal={shot.focal} zoom={zoom} filter={LOOK.graded} />
        <Footage at={shot.at} frame={inner} focal={shot.focal} zoom={zoom} filter={LOOK.warm} style={{ opacity: warm }} />
        <Footage at={shot.at} frame={inner} focal={shot.focal} zoom={zoom} filter={LOOK.cool} style={{ opacity: cool }} />
        <Footage at={shot.at} frame={inner} focal={shot.focal} zoom={zoom} filter={LOOK.brand} style={{ opacity: brand }} />
        {split > 0.001 ? <Footage at={shot.at} frame={inner} focal={shot.focal} zoom={zoom} filter={LOOK.flat} style={{ clipPath: `inset(0 ${(1 - split) * 100}% 0 0)` }} /> : null}
        {split > 0.001 && split < 0.999 ? (
          <div style={{ position: "absolute", left: split * card.width - 2, top: 0, bottom: 0, width: 4, background: C.signal, boxShadow: `0 0 24px ${signal(0.7)}` }}>
            <div style={{ position: "absolute", left: -30, top: card.height / 2 - 32, width: 64, height: 64, borderRadius: 32, background: C.wall, border: `3px solid ${C.signal}`, display: "grid", placeItems: "center", fontFamily: FONT.mono, fontSize: 26, color: C.signal }}>‹›</div>
          </div>
        ) : null}
        <Tag style={{ left: 24, top: 24, opacity: labels }}>{copy.before}</Tag>
        <Tag tone="signal" style={{ right: 24, top: 24, opacity: labels }}>
          {copy.after}
        </Tag>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 28, display: "flex", gap: 12, opacity: pills, translate: `0 ${(1 - pills) * 20}px` }}>
          {copy.looks.map((look, i) => (
            <div
              key={look}
              style={{
                flex: 1,
                padding: "16px 0",
                borderRadius: 999,
                textAlign: "center",
                fontFamily: FONT.mono,
                fontSize: 22,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: activeLook === i ? C.wall : C.ivory,
                background: activeLook === i ? C.signal : wall(0.66),
                border: `1px solid ${activeLook === i ? C.signal : ivory(0.2)}`,
              }}
            >
              {look}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const AI_PLATE = "portfolio/fabrica/cambiar-menu-archivo-editable/03-arte-diseno.webp";

/**
 * 06 · Escenas con IA (17–20 s). La placa generada aparece como sale de un
 * modelo de imagen: ruido que se resuelve de arriba abajo. Lleva su rótulo,
 * como en las láminas de la marca, y la cámara entra para el puente.
 */
export function AiScene({ language }: { language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const { land } = useStage();
  const copy = TRAILER_COPY[language].ai;
  const card = editCard(land, 1150);
  const progress = ramp(frame, 6, 42, EASE_IN_OUT);
  const readyAt = TIMING.cues.aiReady - sceneOf("ai").from;
  const tag = ramp(frame, readyAt, readyAt + 10);
  const push = lerp(1, 1.05, ramp(frame, 42, 80, (t) => t)) * lerp(1, 1.3, ramp(frame, 78, 90, EASE_IN));
  const cardIn = ramp(frame, -6, 8);
  const noiseShift = Math.floor(frame / 2);
  const scanY = progress * card.height;
  const exit = ramp(frame, 80, 90, EASE_IN);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.wall }}>
      <SceneHeader index={4} chip={copy.chip} line={copy.line} frame={frame} exitAt={78} />
      <div style={{ ...box(card), overflow: "hidden", borderRadius: lerp(28, 0, exit), opacity: cardIn, border: `1px solid ${ivory(0.12)}` }}>
        <div style={{ position: "absolute", inset: 0, scale: `${push}` }}>
          <Img src={staticFile(AI_PLATE)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(1.25) contrast(0.7)" }} />
          <div style={{ position: "absolute", inset: -200, opacity: 0.9 * (1 - progress), translate: `${(hash(noiseShift) - 0.5) * 300}px ${(hash(noiseShift + 9) - 0.5) * 300}px`, scale: "3" }}>
            <Grain opacity={1} />
          </div>
          <Img src={staticFile(AI_PLATE)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)` }} />
        </div>
        {progress > 0 && progress < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: scanY - 1, height: 3, background: C.signal, boxShadow: `0 0 30px 6px ${signal(0.55)}` }} /> : null}
        <Tag tone={progress >= 1 ? "signal" : "dark"} style={{ left: 24, top: 24 }}>
          {progress >= 1 ? `✓ ${copy.ready}` : `${copy.status} · ${String(Math.round(progress * 100)).padStart(2, "0")}%`}
        </Tag>
        <Tag style={{ left: 24, bottom: 26, opacity: tag * (1 - exit), translate: `0 ${(1 - tag) * 14}px` }}>
          {copy.tag[0]} · {copy.tag[1]}
        </Tag>
      </div>
      <div style={{ position: "absolute", inset: 0, background: C.ivory, opacity: ramp(frame, 84, 90, EASE_IN) * 0.6 }} />
    </div>
  );
}
