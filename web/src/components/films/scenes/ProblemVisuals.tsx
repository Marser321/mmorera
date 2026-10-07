import type { ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { FilmLanguage, Localized } from "@/data/films/filmTypes";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "./theme";

export type VisualBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type ProblemVisualProps = {
  box: VisualBox;
  signals: string[];
  language: FilmLanguage;
  portrait: boolean;
  /** Frame (relativo a la secuencia) en el que arranca el diagnóstico. */
  diagnosisAt: number;
  breakpoint: string;
  lanes?: Array<{ label: Localized; signals: number[] }>;
  /** Frames entre un mensaje y el siguiente (por defecto 30). */
  appearEvery?: number;
};

/** Empuje de cámara + rótulo de quiebre que comparten los tres visuales. */
function DiagnosisFrame({ box, frame, diagnosisAt, breakpoint, portrait, children }: Pick<ProblemVisualProps, "box" | "diagnosisAt" | "breakpoint" | "portrait"> & { frame: number; children: ReactNode }) {
  const push = progress(frame, diagnosisAt, diagnosisAt + 60, EASE_IN_OUT);
  const label = progress(frame, diagnosisAt + 24, diagnosisAt + 44);
  const size = portrait ? 30 : 20;
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h }}>
      <div style={{ position: "absolute", inset: 0, scale: `${1 + push * 0.035}`, transformOrigin: "50% 40%" }}>{children}</div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: portrait ? -10 : -6,
          display: "flex",
          justifyContent: "center",
          opacity: label,
          translate: `0px ${(1 - label) * 16}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: size * 0.6,
            padding: `${size * 0.6}px ${size * 1.1}px`,
            borderRadius: 999,
            border: `1px solid ${tint(FILM_COLORS.danger, 55)}`,
            background: tint(FILM_COLORS.danger, 12),
            color: FILM_COLORS.fg,
            fontFamily: FILM_FONTS.mono,
            fontSize: size,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ width: size * 0.5, height: size * 0.5, borderRadius: 99, background: FILM_COLORS.danger }} />
          {breakpoint}
        </div>
      </div>
    </div>
  );
}

/* ─── Chat: los mensajes se apilan y el diagnóstico los ordena en carriles ─── */

/**
 * El orden de los carriles está coreografiado para que ninguna burbuja pase
 * por encima de otra: primero todas se achican en su lugar al ancho del carril
 * (cabe en dos líneas, sin cortar el texto); después viajan de a una, de
 * derecha a izquierda, en horizontal por su propia fila y en vertical por una
 * columna que todavía está vacía.
 */
export function ChatPile(props: ProblemVisualProps) {
  const frame = useCurrentFrame();
  const { box, signals, portrait, diagnosisAt, lanes, language, appearEvery = 30 } = props;
  const chatFont = portrait ? 32 : 23;
  const bubbleHeight = chatFont * 2.5;
  const chatX = 28;
  const chatTop = portrait ? 96 : 70;
  const rowGap = portrait ? 92 : 76;
  const chatWidth = Math.min(box.w - chatX * 2, portrait ? 680 : 500);
  const laneCount = Math.max(1, lanes?.length ?? 1);
  const colWidth = box.w / laneCount;
  const laneWidth = colWidth - 24;
  // Dos líneas de texto del carril ocupan el mismo alto que una burbuja del chat.
  const laneFont = Math.min(chatFont * 0.7, (bubbleHeight - 20) / 2.5);
  const laneTop = portrait ? 96 : 72;
  const laneGap = 12;
  const chrome = 1 - progress(frame, diagnosisAt, diagnosisAt + 24);
  const typingDots = [0, 1, 2].map((dot) => 0.25 + 0.75 * Math.abs(Math.sin((frame + dot * 6) / 9)));

  // Destino de cada burbuja y orden de viaje (carriles de derecha a izquierda).
  const placement = signals.map((_, index) => {
    const lane = lanes?.findIndex((item) => item.signals.includes(index)) ?? -1;
    const row = lane >= 0 ? [...lanes![lane].signals].sort((a, b) => a - b).indexOf(index) : 0;
    return { lane, row };
  });
  const travelOrder = signals
    .map((_, index) => index)
    .filter((index) => placement[index].lane >= 0)
    .sort((a, b) => placement[b].lane - placement[a].lane || placement[a].row - placement[b].row);
  const sortAt = diagnosisAt + 8;
  const shrink = progress(frame, sortAt, sortAt + 16, EASE_IN_OUT);
  const travelFrom = sortAt + 18;

  return (
    <DiagnosisFrame {...props} frame={frame}>
      {/* Marco de conversación (se desarma al diagnosticar) */}
      <div style={{ position: "absolute", inset: 0, borderRadius: portrait ? 40 : 30, border: `1px solid ${ink(0.12)}`, background: ink(0.025), opacity: chrome }} />
      <div style={{ position: "absolute", left: 28, top: 22, right: 28, display: "flex", justifyContent: "space-between", fontFamily: FILM_FONTS.mono, fontSize: portrait ? 24 : 16, letterSpacing: "0.14em", textTransform: "uppercase", color: ink(0.5), opacity: chrome }}>
        <span>WhatsApp</span>
        <span style={{ color: FILM_COLORS.danger }}>
          {signals.filter((_, index) => frame >= 24 + index * appearEvery).length} {language === "es" ? "sin responder" : "unanswered"}
        </span>
      </div>

      {lanes?.map((lane, laneIndex) => (
        <div
          key={lane.label.es}
          style={{
            position: "absolute",
            left: laneIndex * colWidth + 8,
            width: colWidth - 16,
            top: portrait ? 30 : 24,
            bottom: portrait ? 90 : 70,
            borderRadius: 22,
            border: `1px dashed ${ink(0.18)}`,
            opacity: progress(frame, diagnosisAt + 10, diagnosisAt + 34),
          }}
        >
          <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FILM_FONTS.mono, fontSize: portrait ? 24 : 16, letterSpacing: "0.14em", textTransform: "uppercase", color: [FILM_COLORS.accent, FILM_COLORS.create, FILM_COLORS.signal][laneIndex % 3] }}>
            {lane.label[language]}
          </div>
        </div>
      ))}

      {signals.map((signal, index) => {
        const appear = 24 + index * appearEvery;
        const pop = progress(frame, appear, appear + 14);
        const { lane, row } = placement[index];
        const chatY = chatTop + index * rowGap;
        const step = travelOrder.indexOf(index);
        const start = travelFrom + Math.max(0, step) * 12;
        const across = lane >= 0 ? progress(frame, start, start + 10, EASE_IN_OUT) : 0;
        const up = lane >= 0 ? progress(frame, start + 10, start + 22, EASE_IN_OUT) : 0;
        const laneX = lane * colWidth + 12;
        const laneY = laneTop + row * (bubbleHeight + laneGap);
        // Achicarse lleva la burbuja al borde de la primera columna; después viaja.
        const x = interpolate(shrink, [0, 1], [chatX, 12]) + across * (laneX - 12);
        const y = chatY + up * (laneY - chatY);
        const font = interpolate(shrink, [0, 1], [chatFont, laneFont]);
        const width = interpolate(shrink, [0, 1], [chatWidth, laneWidth]);
        const padX = font * 0.9;
        return (
          <div
            key={signal}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width,
              height: bubbleHeight,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              padding: `0 ${padX}px`,
              borderRadius: `${chatFont * 0.9}px ${chatFont * 0.9}px ${chatFont * 0.9}px 6px`,
              background: ink(0.07),
              border: `1px solid ${ink(0.1)}`,
              color: FILM_COLORS.fg,
              fontFamily: FILM_FONTS.body,
              fontSize: font,
              lineHeight: 1.25,
              overflow: "hidden",
              translate: `${x}px ${y + (1 - pop) * 18}px`,
              scale: `${0.94 + pop * 0.06}`,
              opacity: lane >= 0 ? pop : pop * (1 - shrink),
            }}
          >
            <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{signal}</span>
          </div>
        );
      })}

      {/* "Escribiendo…" que nunca llega */}
      <div style={{ position: "absolute", right: 28, top: chatTop + signals.length * rowGap, display: "flex", gap: 8, padding: "16px 20px", borderRadius: 999, background: tint(FILM_COLORS.signal, 10), opacity: chrome * progress(frame, 30, 44) }}>
        {typingDots.map((opacity, dot) => (
          <span key={dot} style={{ width: portrait ? 14 : 10, height: portrait ? 14 : 10, borderRadius: 99, background: FILM_COLORS.signal, opacity }} />
        ))}
      </div>
    </DiagnosisFrame>
  );
}

/* ─── Reloj nocturno: el formulario espera toda la noche ─── */

const START_MINUTES = 23 * 60 + 45;
const NIGHT_MINUTES = 9 * 60 + 15; // 23:45 → 09:00

function formatClock(totalMinutes: number) {
  const minutes = Math.floor(totalMinutes) % (24 * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function NightClock(props: ProblemVisualProps) {
  const frame = useCurrentFrame();
  const { signals, portrait, diagnosisAt, language } = props;
  const elapsed = interpolate(frame, [30, 195], [0, NIGHT_MINUTES], { ...CLAMP, easing: EASE_IN_OUT });
  const late = progress(frame, diagnosisAt, diagnosisAt + 20);
  const unread = 0.35 + 0.65 * Math.abs(Math.sin(frame / 10));
  const clockSize = portrait ? 190 : 150;

  return (
    <DiagnosisFrame {...props} frame={frame}>
      <div style={{ position: "absolute", left: 0, right: 0, top: portrait ? 10 : 0, textAlign: "center", fontFamily: FILM_FONTS.mono, fontSize: clockSize, letterSpacing: "-0.04em", color: late > 0.5 ? FILM_COLORS.danger : FILM_COLORS.fg, opacity: progress(frame, 0, 16) }}>
        {formatClock(START_MINUTES + elapsed)}
      </div>
      {/* La noche pasa: barra de 23:45 a 09:12 */}
      <div style={{ position: "absolute", left: "12%", right: "12%", top: clockSize * 1.22 + (portrait ? 10 : 0), height: 3, background: ink(0.1), borderRadius: 9 }}>
        <div style={{ width: "100%", height: "100%", background: late > 0.5 ? FILM_COLORS.danger : FILM_COLORS.accent, transformOrigin: "left", scale: `${elapsed / NIGHT_MINUTES} 1`, borderRadius: 9 }} />
      </div>
      <div style={{ position: "absolute", left: "12%", right: "12%", top: clockSize * 1.22 + (portrait ? 30 : 16), display: "flex", justifyContent: "space-between", fontFamily: FILM_FONTS.mono, fontSize: portrait ? 22 : 15, color: ink(0.45), letterSpacing: "0.12em" }}>
        <span>23:45</span>
        <span style={{ opacity: late, color: FILM_COLORS.danger }}>{language === "es" ? "9 h 15 min sin respuesta" : "9 h 15 min without a reply"}</span>
        <span>09:00</span>
      </div>

      {/* Notificación que nadie abre */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: clockSize * 1.22 + (portrait ? 110 : 76),
          padding: portrait ? "30px 34px" : "22px 26px",
          borderRadius: 24,
          border: `1px solid ${ink(0.12)}`,
          background: ink(0.04),
          opacity: progress(frame, 12, 28),
          translate: `0px ${(1 - progress(frame, 12, 28)) * 20}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FILM_FONTS.body, fontSize: portrait ? 34 : 25, color: FILM_COLORS.fg }}>
          <span style={{ width: portrait ? 16 : 12, height: portrait ? 16 : 12, borderRadius: 99, background: FILM_COLORS.accent, opacity: unread }} />
          {signals[0]}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: portrait ? 20 : 14 }}>
          {signals.slice(1).map((signal, index) => (
            <span key={signal} style={{ padding: "6px 14px", borderRadius: 999, border: `1px solid ${ink(0.12)}`, fontFamily: FILM_FONTS.mono, fontSize: portrait ? 22 : 15, color: ink(0.55), opacity: progress(frame, 40 + index * 14, 54 + index * 14) }}>
              {signal}
            </span>
          ))}
        </div>
      </div>
    </DiagnosisFrame>
  );
}

/* ─── Tarjeta de CRM quieta en "Propuesta enviada" ─── */

const STALE_COLUMNS: Localized[] = [
  { es: "Contactado", en: "Contacted" },
  { es: "Propuesta enviada", en: "Proposal sent" },
  { es: "Negociación", en: "Negotiation" },
];

export function StaleCard(props: ProblemVisualProps) {
  const frame = useCurrentFrame();
  const { box, signals, portrait, diagnosisAt, language } = props;
  const hours = interpolate(frame, [30, 195], [0, 24], { ...CLAMP, easing: EASE_IN_OUT });
  const flagged = progress(frame, diagnosisAt + 6, diagnosisAt + 24);
  const colWidth = box.w / 3;
  const label = portrait ? 22 : 15;

  return (
    <DiagnosisFrame {...props} frame={frame}>
      {STALE_COLUMNS.map((column, index) => (
        <div
          key={column.es}
          style={{
            position: "absolute",
            left: index * colWidth + 8,
            width: colWidth - 16,
            top: 0,
            bottom: portrait ? 90 : 70,
            borderRadius: 22,
            background: ink(index === 1 ? 0.05 : 0.025),
            border: `1px solid ${ink(0.08)}`,
            opacity: progress(frame, index * 6, index * 6 + 16),
          }}
        >
          <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FILM_FONTS.mono, fontSize: label, letterSpacing: "0.12em", textTransform: "uppercase", color: ink(0.5) }}>
            {column[language]}
          </div>
        </div>
      ))}

      {/* La columna siguiente queda bloqueada */}
      <div style={{ position: "absolute", left: 2 * colWidth + 8, width: colWidth - 16, top: portrait ? 120 : 90, height: portrait ? 260 : 190, borderRadius: 18, border: `2px dashed ${tint(FILM_COLORS.danger, 55)}`, opacity: flagged, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FILM_FONTS.mono, fontSize: portrait ? 60 : 44, color: FILM_COLORS.danger }}>
        ×
      </div>

      <div
        style={{
          position: "absolute",
          left: colWidth + 20,
          width: colWidth - 40,
          top: portrait ? 90 : 66,
          padding: portrait ? 26 : 18,
          borderRadius: 20,
          background: FILM_COLORS.card,
          border: `1px solid ${flagged > 0.5 ? tint(FILM_COLORS.danger, 60) : ink(0.14)}`,
          boxShadow: `0 18px 50px ${ink(0.08)}`,
          opacity: progress(frame, 14, 30) * interpolate(hours, [0, 24], [1, 0.72]),
          translate: `0px ${(1 - progress(frame, 14, 30)) * 20}px`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: FILM_FONTS.mono, fontSize: label, color: ink(0.55) }}>
          <span>L-8841</span>
          <span style={{ color: hours > 23 ? FILM_COLORS.danger : ink(0.55), fontSize: label * 1.4 }}>{Math.floor(hours)} h</span>
        </div>
        <div style={{ marginTop: portrait ? 14 : 10, fontFamily: FILM_FONTS.body, fontSize: portrait ? 34 : 23, color: FILM_COLORS.fg, letterSpacing: "-0.02em" }}>
          {language === "es" ? "Propuesta comercial" : "Commercial proposal"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: portrait ? 18 : 12 }}>
          {signals.map((signal, index) => (
            <span key={signal} style={{ fontFamily: FILM_FONTS.mono, fontSize: label, color: index === signals.length - 1 && flagged > 0.5 ? FILM_COLORS.danger : ink(0.5), opacity: progress(frame, 40 + index * 16, 54 + index * 16) }}>
              · {signal}
            </span>
          ))}
        </div>
      </div>
    </DiagnosisFrame>
  );
}

export const PROBLEM_VISUALS = {
  chat: ChatPile,
  clock: NightClock,
  "stale-card": StaleCard,
} as const;
