import { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { CAMPANAS_CHAPTERS, CAMPANAS_FILM, campanasChapter } from "@/data/films/campanasFilm";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { DustField } from "../scenes/brand/ParticleLogo";
import { Letterbox } from "../scenes/case/shared";
import { LogoMark } from "../scenes/LogoMark";
import { ChapterTicks, FilmBackdrop, Headline, HonestyBadge, Kicker } from "../scenes/primitives";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint, useFilmLayout } from "../scenes/theme";
import { campanasLayout, type CampanasLayout } from "./campanasFilmLayout";

// type (no interface): el Player exige props indexables (Record<string, unknown>).
export type CampanasFilmProps = { language: FilmLanguage };

type SceneProps = { layout: CampanasLayout; language: FilmLanguage; duration: number };

const film = CAMPANAS_FILM;

const boxStyle = (box: Box) => ({ position: "absolute" as const, left: box.x, top: box.y, width: box.w, height: box.h });
const panel = { background: ink(0.035), border: `1px solid ${ink(0.13)}`, borderRadius: 14 };

/** Rótulo y titular de cada escena: el mismo gesto en todas. */
function SceneHead({ layout, kicker, headline, spec }: { layout: CampanasLayout; kicker: string; headline: string; spec: CampanasLayout["before"]["headline"] }) {
  return (
    <>
      <Kicker from={6} size={layout.sizes.kicker} style={{ left: layout.top.kicker.x, top: layout.top.kicker.y }}>{kicker}</Kicker>
      <Headline text={headline} from={10} size={spec.size} style={{ left: spec.box.x, top: spec.box.y, width: spec.box.w }} />
    </>
  );
}

/* ─── 1 · Antes ─── */

/** Una pestaña de plataforma: filas sin texto, porque aquí importa el desorden. */
function TabWindow({ box, title, index, sizes }: { box: Box; title: string; index: number; sizes: CampanasLayout["sizes"] }) {
  const frame = useCurrentFrame();
  const enter = progress(frame, 14 + index * 12, 40 + index * 12);
  const widths = [78, 54, 66, 42, 72, 58];
  return (
    <div style={{ ...boxStyle(box), ...panel, background: FILM_COLORS.card, overflow: "hidden", opacity: enter, translate: `0px ${(1 - enter) * 30}px`, boxShadow: `0 24px 60px -30px rgb(0 0 0 / 0.65)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: sizes.mono * 2.3, padding: "0 16px", borderBottom: `1px solid ${ink(0.1)}`, fontFamily: FILM_FONTS.mono, fontSize: sizes.mono, color: ink(0.7) }}>
        <span style={{ width: 8, height: 8, borderRadius: 9, background: ink(0.25) }} />
        {title}
      </div>
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        {widths.map((width, row) => (
          <div key={row} style={{ display: "flex", gap: 10 }}>
            <span style={{ height: 8, width: `${width}%`, borderRadius: 9, background: ink(0.11) }} />
            <span style={{ height: 8, flex: 1, borderRadius: 9, background: ink(0.06) }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** La planilla que se llena a mano, fila por fila, con cada viaje del cursor. */
function Sheet({ box, title, sizes, hops }: { box: Box; title: string; sizes: CampanasLayout["sizes"]; hops: number[] }) {
  const frame = useCurrentFrame();
  const enter = progress(frame, 56, 84);
  const rows = 7;
  return (
    <div style={{ ...boxStyle(box), ...panel, background: FILM_COLORS.bg, overflow: "hidden", opacity: enter, translate: `0px ${(1 - enter) * 36}px`, boxShadow: `0 40px 80px -36px rgb(0 0 0 / 0.8)` }}>
      <div style={{ display: "flex", alignItems: "center", height: sizes.mono * 2.3, padding: "0 16px", borderBottom: `1px solid ${ink(0.1)}`, fontFamily: FILM_FONTS.mono, fontSize: sizes.mono, color: FILM_COLORS.fg }}>{title}</div>
      <div style={{ display: "grid", gridTemplateRows: `repeat(${rows}, 1fr)`, height: `calc(100% - ${sizes.mono * 2.3}px)` }}>
        {Array.from({ length: rows }, (_, row) => {
          const filled = progress(frame, hops[row] ?? 9999, (hops[row] ?? 9999) + 10);
          return (
            <div key={row} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", borderBottom: `1px solid ${ink(0.07)}` }}>
              {[0, 1, 2, 3].map((cell) => (
                <div key={cell} style={{ borderLeft: cell ? `1px solid ${ink(0.07)}` : undefined, display: "flex", alignItems: "center", padding: "0 10px" }}>
                  <span style={{ height: 6, width: `${cell === 0 ? 76 : 52}%`, borderRadius: 9, background: tint(FILM_COLORS.signal, 58), opacity: filled, transformOrigin: "left center", scale: `${filled} 1` }} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** El cursor que va y viene entre las pestañas y la planilla. */
function Cursor({ tabs, sheet, hops, size }: { tabs: Box[]; sheet: Box; hops: number[]; size: number }) {
  const frame = useCurrentFrame();
  const points = hops.flatMap((hop, index) => {
    const tab = tabs[index % tabs.length];
    return [
      { at: hop - 20, x: tab.x + tab.w * 0.42, y: tab.y + tab.h * 0.48 },
      { at: hop, x: sheet.x + sheet.w * 0.3, y: sheet.y + sheet.h * (0.22 + (index % 7) * 0.1) },
    ];
  });
  const input = points.map((point) => point.at);
  const x = interpolate(frame, input, points.map((point) => point.x), { ...CLAMP, easing: EASE_IN_OUT });
  const y = interpolate(frame, input, points.map((point) => point.y), { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, opacity: progress(frame, hops[0] - 24, hops[0] - 12), filter: "drop-shadow(0 2px 4px rgb(0 0 0 / 0.6))" }}>
      <path d="M4 2l15 11-7 1-3 7z" fill={FILM_COLORS.fg} stroke={FILM_COLORS.bg} strokeWidth="1.2" />
    </svg>
  );
}

/** El reloj corre más rápido que el trabajo: esa es toda la escena. */
function MorningClock({ box, label, sizes, land, duration }: { box: Box; label: string; sizes: CampanasLayout["sizes"]; land: boolean; duration: number }) {
  const frame = useCurrentFrame();
  const ratio = progress(frame, 40, duration - 30, EASE_IN_OUT);
  const minutes = 9 * 60 + Math.floor((ratio * 225) / 5) * 5;
  const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  const ring = land ? 224 : 150;
  const radius = ring / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  return (
    <div style={{ ...boxStyle(box), display: "flex", flexDirection: land ? "column" : "row", alignItems: "center", justifyContent: "center", gap: land ? 18 : 34, opacity: progress(frame, 30, 54) }}>
      <div style={{ position: "relative", width: ring, height: ring }}>
        <svg width={ring} height={ring} style={{ position: "absolute", inset: 0, rotate: "-90deg" }}>
          <circle cx={ring / 2} cy={ring / 2} r={radius} fill="none" stroke={ink(0.12)} strokeWidth={3} />
          <circle cx={ring / 2} cy={ring / 2} r={radius} fill="none" stroke={FILM_COLORS.fg} strokeWidth={3} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - ratio)} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FILM_FONTS.mono, fontSize: land ? 50 : 42, color: FILM_COLORS.fg, fontVariantNumeric: "tabular-nums" }}>{time}</div>
      </div>
      <div style={{ fontFamily: FILM_FONTS.mono, fontSize: sizes.small, letterSpacing: "0.12em", textTransform: "uppercase", color: ink(0.6), textAlign: "center" }}>{label}</div>
    </div>
  );
}

function BeforeScene({ layout, language, duration }: SceneProps) {
  const { before, sizes, land } = layout;
  // Cada viaje del cursor copia una fila: el trabajo avanza de a poco.
  const hops = [96, 136, 176, 212, 244, 272, 300];
  return (
    <Fade duration={duration}>
      <SceneHead layout={layout} kicker={film.before.kicker[language]} headline={film.before.headline[language]} spec={before.headline} />
      {film.before.tabs.map((title, index) => <TabWindow key={title} box={before.tabs[index]} title={title} index={index} sizes={sizes} />)}
      <Sheet box={before.sheet} title={film.before.sheet[language]} sizes={sizes} hops={hops} />
      <Cursor tabs={before.tabs} sheet={before.sheet} hops={hops} size={land ? 26 : 34} />
      <MorningClock box={before.clock} label={film.before.clock[language]} sizes={sizes} land={land} duration={duration} />
    </Fade>
  );
}

/* ─── 2 · Una pregunta ─── */

function QuestionScene({ layout, language, duration }: SceneProps) {
  const frame = useCurrentFrame();
  const { question, sizes, land } = layout;
  const prompt = film.question.prompt[language];
  const typed = Math.round(interpolate(frame, [30, 104], [0, prompt.length], CLAMP));
  const sent = 116;
  const flash = interpolate(frame, [sent, sent + 8, sent + 40], [0, 1, 0], CLAMP);
  const reading = progress(frame, sent + 28, sent + 118, EASE_IN_OUT);
  const seconds = Math.round(reading * film.question.seconds);
  const from = { x: question.prompt.x + question.prompt.w / 2, y: question.prompt.y + question.prompt.h };
  return (
    <Fade duration={duration}>
      <SceneHead layout={layout} kicker={film.question.kicker[language]} headline={film.question.headline[language]} spec={question.headline} />

      {/* La barra: una sola línea reemplaza a las cinco pestañas. */}
      <div style={{ ...boxStyle(question.prompt), ...panel, background: FILM_COLORS.bg, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", opacity: progress(frame, 14, 30), border: `1px solid ${tint(FILM_COLORS.signal, 28 + flash * 60)}`, boxShadow: `0 0 ${40 + flash * 60}px -18px ${tint(FILM_COLORS.signal, 45 + flash * 45)}` }}>
        <span style={{ fontFamily: FILM_FONTS.mono, fontSize: sizes.body + 6, color: FILM_COLORS.signal }}>&gt;</span>
        <span style={{ fontSize: land ? 31 : 34, color: FILM_COLORS.fg, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          {prompt.slice(0, typed)}
          <span style={{ display: "inline-block", width: 2, height: "1em", marginLeft: 3, verticalAlign: "-0.14em", background: FILM_COLORS.signal, opacity: frame < sent && Math.floor(frame / 12) % 2 === 0 ? 1 : 0 }} />
        </span>
      </div>

      {/* Las líneas bajan a cada fuente y los datos suben por ellas. */}
      <svg width={layout.area.x * 2 + layout.area.w} height={question.sources[0].y + question.sources[0].h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {question.sources.map((source, index) => {
          const to = { x: source.x + source.w / 2, y: source.y };
          const draw = progress(frame, sent + 6 + index * 4, sent + 34 + index * 4);
          const path = `M${from.x} ${from.y} C${from.x} ${(from.y + to.y) / 2} ${to.x} ${(from.y + to.y) / 2} ${to.x} ${to.y}`;
          return <path key={source.x} d={path} pathLength={1} fill="none" stroke={ink(0.24)} strokeWidth={1.5} strokeDasharray={1} strokeDashoffset={1 - draw} />;
        })}
        {question.sources.flatMap((source, index) => [0, 1, 2].map((pulse) => {
          const to = { x: source.x + source.w / 2, y: source.y };
          const span = 34;
          const raw = (frame - (sent + 30) - index * 5 - pulse * 12) / span;
          const cycle = raw - Math.floor(raw);
          const alive = raw >= 0 && frame < sent + 122;
          const t1 = 1 - cycle;
          const mid = (from.y + to.y) / 2;
          // Punto sobre la misma curva Bézier, de la fuente hacia la pregunta.
          const u = 1 - t1;
          const x = u ** 3 * from.x + 3 * u ** 2 * t1 * from.x + 3 * u * t1 ** 2 * to.x + t1 ** 3 * to.x;
          const y = u ** 3 * from.y + 3 * u ** 2 * t1 * mid + 3 * u * t1 ** 2 * mid + t1 ** 3 * to.y;
          return <circle key={`${source.x}-${pulse}`} cx={x} cy={y} r={land ? 3.5 : 5} fill={FILM_COLORS.signal} opacity={alive ? 0.9 : 0} />;
        }))}
      </svg>

      {film.question.sources.map((source, index) => {
        const box = question.sources[index];
        const on = progress(frame, sent + 22 + index * 4, sent + 40 + index * 4);
        return (
          <div key={source} style={{ ...boxStyle(box), ...panel, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FILM_FONTS.mono, fontSize: sizes.mono - (land ? 1 : 3), color: FILM_COLORS.fg, whiteSpace: "nowrap", opacity: on, border: `1px solid ${tint(FILM_COLORS.signal, 12 + reading * 30)}` }}>{source}</div>
        );
      })}

      {[...film.question.counters.map((counter) => ({ value: Math.round(counter.value * reading), label: counter.label[language] })), { value: seconds, label: film.question.elapsed[language] }].map((item, index) => {
        const box = question.counters[index];
        const highlight = index === 3;
        return (
          <div key={item.label} style={{ ...boxStyle(box), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6, opacity: progress(frame, sent + 26, sent + 44) }}>
            <span style={{ fontFamily: FILM_FONTS.mono, fontSize: land ? 56 : 62, color: highlight ? FILM_COLORS.signal : FILM_COLORS.fg, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{item.value}</span>
            <span style={{ fontFamily: FILM_FONTS.mono, fontSize: sizes.small, letterSpacing: "0.12em", textTransform: "uppercase", color: ink(0.6) }}>{item.label}</span>
          </div>
        );
      })}
    </Fade>
  );
}

/* ─── 3 · Lo que ve la máquina ─── */

/** Una curva de muestra que se dibuja y marca dónde cambió algo. */
function TrendChart({ box, label, sizes }: { box: Box; label: string; sizes: CampanasLayout["sizes"] }) {
  const frame = useCurrentFrame();
  const { series } = film.machine;
  const pad = 26;
  const top = sizes.small * 3;
  const width = box.w - pad * 2;
  const height = box.h - top - pad;
  const min = Math.min(...series) - 4;
  const max = Math.max(...series) + 4;
  const points = series.map((value, index) => ({ x: (index / (series.length - 1)) * width, y: height - ((value - min) / (max - min)) * height }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");
  const draw = progress(frame, 24, 96, EASE_IN_OUT);
  const last = points[points.length - 1];
  const mark = progress(frame, 92, 116);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <div style={{ ...boxStyle(box), ...panel, opacity: progress(frame, 14, 34) }}>
      <div style={{ position: "absolute", left: pad, top: pad - 4, fontFamily: FILM_FONTS.mono, fontSize: sizes.small, letterSpacing: "0.08em", color: ink(0.62) }}>{label}</div>
      <svg width={width} height={height} style={{ position: "absolute", left: pad, top, overflow: "visible" }}>
        {[0.25, 0.5, 0.75].map((level) => <line key={level} x1={0} x2={width} y1={height * level} y2={height * level} stroke={ink(0.07)} />)}
        <path d={line} pathLength={1} fill="none" stroke={FILM_COLORS.fg} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - draw} />
        <circle cx={last.x} cy={last.y} r={14 + pulse * 7} fill={tint(FILM_COLORS.signal, 20)} opacity={mark} />
        <circle cx={last.x} cy={last.y} r={6} fill={FILM_COLORS.signal} opacity={mark} />
      </svg>
    </div>
  );
}

function MachineScene({ layout, language, duration }: SceneProps) {
  const frame = useCurrentFrame();
  const { machine, sizes, land } = layout;
  return (
    <Fade duration={duration}>
      <SceneHead layout={layout} kicker={film.machine.kicker[language]} headline={film.machine.headline[language]} spec={machine.headline} />
      <TrendChart box={machine.chart} label={film.machine.chart[language]} sizes={sizes} />
      {film.machine.findings.map((finding, index) => {
        const box = machine.findings[index];
        const start = 104 + index * 36;
        const enter = progress(frame, start, start + 26);
        return (
          <div key={finding.id} style={{ ...boxStyle(box), ...panel, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: land ? "0 26px" : "0 28px", opacity: enter, translate: `${(1 - enter) * 44}px 0px`, borderLeft: `3px solid ${FILM_COLORS.signal}` }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: sizes.title, fontWeight: 500, letterSpacing: "-0.02em", color: FILM_COLORS.fg, lineHeight: 1.15 }}>{finding.title[language]}</div>
              <div style={{ marginTop: 6, fontSize: sizes.body - (land ? 3 : 2), color: ink(0.66), lineHeight: 1.25 }}>{finding.detail[language]}</div>
            </div>
            <div style={{ flexShrink: 0, fontFamily: FILM_FONTS.mono, fontSize: sizes.mono + (land ? 1 : -1), color: FILM_COLORS.signal, whiteSpace: "nowrap" }}>{finding.metric[language]}</div>
          </div>
        );
      })}
    </Fade>
  );
}

/* ─── 4 · Lo que decide una persona ─── */

function PersonScene({ layout, language, duration }: SceneProps) {
  const frame = useCurrentFrame();
  const { person, sizes, land } = layout;
  const gateDraw = progress(frame, 50, 90, EASE_IN_OUT);
  const firstDecision = 120;
  const spacing = 136;
  return (
    <Fade duration={duration}>
      <SceneHead layout={layout} kicker={film.person.kicker[language]} headline={film.person.headline[language]} spec={person.headline} />

      <div style={{ ...boxStyle(person.labels.proposes), fontFamily: FILM_FONTS.mono, fontSize: sizes.small, letterSpacing: "0.12em", textTransform: "uppercase", color: ink(0.6), opacity: progress(frame, 44, 62) }}>{film.person.proposes[language]}</div>
      <div style={{ ...boxStyle(person.labels.decides), fontFamily: FILM_FONTS.mono, fontSize: sizes.small, letterSpacing: "0.12em", textTransform: "uppercase", color: FILM_COLORS.signal, opacity: progress(frame, 44, 62) }}>{film.person.decides[language]}</div>

      {/* La compuerta: nada cruza sin pasar por el criterio de una persona. */}
      <div style={{ position: "absolute", left: person.gate.x - 1, top: person.gate.top, width: 2, height: (person.gate.bottom - person.gate.top) * gateDraw, background: FILM_COLORS.signal, boxShadow: `0 0 26px 1px ${tint(FILM_COLORS.signal, 55)}` }} />

      {film.person.decisions.map((decision, index) => {
        const row = person.rows[index];
        const at = firstDecision + index * spacing;
        const enter = progress(frame, 56 + index * 12, 80 + index * 12);
        const reach = progress(frame, at, at + 22, EASE_IN_OUT);
        const passed = progress(frame, at + 22, at + 46);
        const reason = progress(frame, at + 46, at + 70);
        const color = decision.approved ? FILM_COLORS.signal : FILM_COLORS.accent;
        return (
          <div key={decision.id}>
            <div style={{ ...boxStyle(row.proposal), ...panel, display: "flex", alignItems: "center", padding: land ? "0 22px" : "0 22px", opacity: enter, translate: `${reach * (land ? 14 : 8)}px 0px`, fontSize: sizes.body, color: FILM_COLORS.fg, lineHeight: 1.2 }}>
              {/* Lo que la persona frena queda tachado, no borrado. La raya sigue al texto aunque ocupe dos líneas. */}
              <span style={{ opacity: decision.approved ? 1 : 1 - passed * 0.4, backgroundImage: decision.approved ? undefined : `linear-gradient(${FILM_COLORS.accent}, ${FILM_COLORS.accent})`, backgroundRepeat: "no-repeat", backgroundPosition: "0 58%", backgroundSize: `${passed * 100}% 2px`, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>
                {decision.proposal[language]}
              </span>
            </div>

            <div style={{ position: "absolute", left: row.node.x - 11, top: row.node.y - 11, width: 22, height: 22, borderRadius: 99, background: FILM_COLORS.bg, border: `2px solid ${tint(color, 30 + reach * 70)}`, opacity: gateDraw, boxShadow: `0 0 ${reach * 28}px ${tint(color, reach * 60)}` }}>
              <div style={{ position: "absolute", inset: 4, borderRadius: 99, background: color, opacity: reach }} />
            </div>

            <div style={{ ...boxStyle(row.decision), ...panel, display: "flex", flexDirection: "column", justifyContent: "center", gap: land ? 6 : 8, padding: land ? "0 24px" : "0 22px", opacity: passed, translate: `${(1 - passed) * -30}px 0px`, border: `1px solid ${tint(color, 42)}`, background: tint(color, 7) }}>
              <div style={{ fontFamily: FILM_FONTS.mono, fontSize: sizes.mono, letterSpacing: "0.1em", textTransform: "uppercase", color }}>{decision.verdict[language]}</div>
              <div style={{ fontSize: sizes.body, lineHeight: 1.2, color: FILM_COLORS.fg, opacity: reason, translate: `0px ${(1 - reason) * 10}px` }}>{decision.reason[language]}</div>
            </div>
          </div>
        );
      })}
    </Fade>
  );
}

/* ─── 5 · Toda la cuenta ─── */

function AccountScene({ layout, language, duration }: SceneProps) {
  const frame = useCurrentFrame();
  const { account, sizes, area, land } = layout;
  const { center, core } = account;
  const ring = progress(frame, 16, 62, EASE_IN_OUT);
  return (
    <Fade duration={duration}>
      <SceneHead layout={layout} kicker={film.account.kicker[language]} headline={film.account.headline[language]} spec={account.headline} />

      <svg width={area.x * 2 + area.w} height={area.y + area.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {account.nodes.map((node, index) => {
          const draw = progress(frame, 44 + index * 10, 74 + index * 10);
          const raw = (frame - (84 + index * 10)) / 46;
          const cycle = raw - Math.floor(raw);
          return (
            <g key={film.account.nodes[index].es}>
              <line x1={center.x} y1={center.y} x2={center.x + (node.cx - center.x) * draw} y2={center.y + (node.cy - center.y) * draw} stroke={ink(0.2)} strokeWidth={1.5} />
              <circle cx={center.x + (node.cx - center.x) * cycle} cy={center.y + (node.cy - center.y) * cycle} r={land ? 3.5 : 5} fill={FILM_COLORS.signal} opacity={raw >= 0 ? 0.9 * (1 - cycle * 0.4) : 0} />
            </g>
          );
        })}
      </svg>

      {account.nodes.map((node, index) => {
        const enter = progress(frame, 56 + index * 10, 80 + index * 10);
        const pulse = interpolate(frame, [120 + index * 18, 132 + index * 18, 166 + index * 18], [0, 1, 0.25], CLAMP);
        return (
          <div key={film.account.nodes[index].es} style={{ ...boxStyle(node), ...panel, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: FILM_COLORS.card, fontSize: sizes.body, color: FILM_COLORS.fg, opacity: enter, scale: `${0.92 + enter * 0.08}`, border: `1px solid ${tint(FILM_COLORS.signal, 14 + pulse * 66)}`, boxShadow: `0 0 ${pulse * 30}px -6px ${tint(FILM_COLORS.signal, pulse * 70)}` }}>
            <span style={{ width: 8, height: 8, borderRadius: 9, background: FILM_COLORS.signal, opacity: 0.35 + pulse * 0.65 }} />
            {film.account.nodes[index][language]}
          </div>
        );
      })}

      <div style={{ position: "absolute", left: center.x, top: center.y, translate: "-50% -50%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ width: core, height: core, borderRadius: 999, background: FILM_COLORS.card, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 70px -10px ${tint(FILM_COLORS.signal, 34)}` }}>
          <LogoMark id="campanas-core" size={core * 0.9} ring={ring} />
        </div>
        <div style={{ fontFamily: FILM_FONTS.mono, fontSize: sizes.small, letterSpacing: "0.12em", textTransform: "uppercase", color: FILM_COLORS.signal, opacity: progress(frame, 56, 76), background: FILM_COLORS.card, padding: "2px 10px", borderRadius: 6 }}>{film.account.center[language]}</div>
      </div>
    </Fade>
  );
}

/* ─── 6 · La firma ─── */

function SignatureScene({ layout, language }: SceneProps) {
  const frame = useCurrentFrame();
  const { signature } = layout;
  const turn = progress(frame, 30, 66, EASE_IN_OUT);
  const crownShift = interpolate(progress(frame, 2, 30, EASE_IN_OUT), [0, 1], [-1.5, 0]);
  const bodyShift = interpolate(progress(frame, 8, 34, EASE_IN_OUT), [0, 1], [1.5, 0]);
  const signalShare = Math.round(100 * (1 - turn));
  const centered = { textAlign: "center" as const, display: "flex", justifyContent: "center", flexWrap: "wrap" as const };
  return (
    <AbsoluteFill style={{ opacity: progress(frame, 0, 16) }}>
      <div style={{ position: "absolute", left: signature.logo.x, top: signature.logo.y, translate: "-50% -50%" }}>
        <LogoMark
          id="campanas-signature"
          size={signature.logo.size}
          crownShift={crownShift}
          bodyShift={bodyShift}
          rotation={interpolate(turn, [0, 1], [-90, 0])}
          ring={progress(frame, 50, 88, EASE_IN_OUT)}
          interiorColor={`color-mix(in srgb, var(--color-signal) ${signalShare}%, var(--color-foreground))`}
          glow={0.5 * (1 - turn)}
        />
      </div>
      <Headline text={film.signature.first[language]} from={70} size={signature.first.size} color={ink(0.72)} style={{ left: signature.first.x, top: signature.first.y, width: signature.first.w, ...centered }} />
      <Headline text={film.signature.second[language]} from={96} size={signature.second.size} color={FILM_COLORS.signal} style={{ left: signature.second.x, top: signature.second.y, width: signature.second.w, ...centered }} />
      <div style={{ position: "absolute", left: signature.name.x, top: signature.name.y, width: signature.name.w, textAlign: "center", fontFamily: FILM_FONTS.mono, fontSize: signature.name.size, letterSpacing: "0.2em", textTransform: "uppercase", color: ink(0.6), opacity: progress(frame, 132, 156) }}>{film.signature.name}</div>
    </AbsoluteFill>
  );
}

const SCENES = [
  { id: "before", name: "Antes", Scene: BeforeScene },
  { id: "question", name: "Una pregunta", Scene: QuestionScene },
  { id: "machine", name: "La máquina", Scene: MachineScene },
  { id: "person", name: "La persona", Scene: PersonScene },
  { id: "account", name: "Toda la cuenta", Scene: AccountScene },
  { id: "signature", name: "La firma", Scene: SignatureScene },
] as const;

/**
 * Cinemática de /campanas, hecha en código. De la mañana armando el reporte a la
 * pregunta que lo resuelve en segundos, y de ahí a lo importante: la máquina
 * propone y una persona decide, con lo que la cuenta no sabe. Un mismo guion se
 * compone en 16:9 o 4:5; todo el movimiento sale del frame.
 */
export function CampanasFilm({ language }: CampanasFilmProps) {
  const { fps, portrait } = useFilmLayout();
  const layout = useMemo(() => campanasLayout(portrait ? "portrait" : "landscape", language), [language, portrait]);
  return (
    <AbsoluteFill style={{ fontFamily: FILM_FONTS.body, color: FILM_COLORS.fg, overflow: "hidden" }}>
      <FilmBackdrop />
      <DustField color="#71F3A2" count={38} opacity={0.14} />
      {SCENES.map(({ id, name, Scene }) => {
        const chapter = campanasChapter(id);
        return (
          <Sequence key={id} name={name} from={chapter.from} durationInFrames={chapter.durationInFrames} premountFor={fps}>
            <Scene layout={layout} language={language} duration={chapter.durationInFrames} />
          </Sequence>
        );
      })}
      <HonestyBadge label={film.badge[language]} real={false} size={layout.top.badge.size} style={{ left: layout.top.badge.x, top: layout.top.badge.y, lineHeight: 1.25, whiteSpace: "nowrap", zIndex: 5 }} />
      <Letterbox portrait={portrait} />
      <ChapterTicks chapters={CAMPANAS_CHAPTERS} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }} />
    </AbsoluteFill>
  );
}
