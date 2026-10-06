import type { ComponentType } from "react";
import { FileText, Mail } from "lucide-react";
import { SiGooglesheets, SiInstagram, SiWhatsapp } from "react-icons/si";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { FilmLanguage, Localized } from "@/data/films/filmTypes";
import { OPENING_BEAT_FRAMES, SYSTEM_RAIL_STAGES } from "@/data/films/systemsFilms";
import { FilmBackdrop } from "../scenes/primitives";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint, useFilmLayout } from "../scenes/theme";

// type (no interface): el Player exige props indexables (Record<string, unknown>).
export type SystemsOpeningProps = {
  language: FilmLanguage;
};

type Point = { x: number; y: number };

/**
 * Cada herramienta suelta termina siendo un estado del riel:
 * Instagram → Captación, Formulario → Calificación, Planilla → CRM,
 * Email → Agenda, WhatsApp → Handoff.
 */
const TOOLS: Array<{ id: string; label: Localized; Icon: ComponentType<{ size?: number; color?: string }>; landscape: Point; portrait: Point }> = [
  { id: "instagram", label: { es: "Instagram", en: "Instagram" }, Icon: SiInstagram, landscape: { x: 1190, y: 250 }, portrait: { x: 300, y: 250 } },
  { id: "form", label: { es: "Formulario", en: "Form" }, Icon: FileText, landscape: { x: 330, y: 250 }, portrait: { x: 640, y: 380 } },
  { id: "sheet", label: { es: "Planilla", en: "Spreadsheet" }, Icon: SiGooglesheets, landscape: { x: 990, y: 640 }, portrait: { x: 270, y: 720 } },
  { id: "email", label: { es: "Email", en: "Email" }, Icon: Mail, landscape: { x: 480, y: 660 }, portrait: { x: 720, y: 820 } },
  { id: "whatsapp", label: { es: "WhatsApp", en: "WhatsApp" }, Icon: SiWhatsapp, landscape: { x: 740, y: 170 }, portrait: { x: 540, y: 1110 } },
];

/** Estado ilustrativo del prospecto al pasar por cada etapa (beat 4). */
const LEAD_STATES: Localized[] = [
  { es: "Formulario web", en: "Web form" },
  { es: "Prioridad A", en: "Priority A" },
  { es: "Historia única", en: "Single history" },
  { es: "Jue 10:00 ✓", en: "Thu 10:00 ✓" },
  { es: "Asignado al equipo", en: "Assigned to the team" },
];

const B = OPENING_BEAT_FRAMES;

function arc(from: Point, to: Point, t: number, height: number): Point {
  return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t - Math.sin(Math.PI * t) * height };
}

/** Film de apertura de /sistemas. Solo imagen: los textos viven en HTML. */
export function SystemsOpening({ language }: SystemsOpeningProps) {
  const frame = useCurrentFrame();
  const { portrait } = useFilmLayout();
  const tile = portrait ? 156 : 150;
  const railPoint = (index: number): Point => (portrait ? { x: 300, y: 230 + index * 220 } : { x: 200 + index * 300, y: 450 });

  // Beat 3: las herramientas viajan al riel; beat 4: el paquete lo recorre.
  const settle = TOOLS.map((_, index) => progress(frame, 2 * B + index * 6, 2 * B + 70 + index * 6, EASE_IN_OUT));
  const relabel = progress(frame, 2 * B + 60, 2 * B + 100);
  const drift = 1 - progress(frame, 2 * B, 2 * B + 40);
  const positions = TOOLS.map((tool, index) => {
    const scatter = portrait ? tool.portrait : tool.landscape;
    const target = railPoint(index);
    const wobble = { x: Math.sin(frame / 38 + index * 1.7) * 10 * drift, y: Math.cos(frame / 45 + index) * 8 * drift };
    return {
      x: interpolate(settle[index], [0, 1], [scatter.x, target.x]) + wobble.x,
      y: interpolate(settle[index], [0, 1], [scatter.y, target.y]) + wobble.y,
    };
  });

  // Beat 2: el lead salta entre herramientas y cae en la grieta.
  const leadHops = [
    { from: 0, to: 1, start: B + 10, end: B + 50 },
    { from: 1, to: 2, start: B + 58, end: B + 98 },
  ];
  const sheet = positions[2];
  const email = positions[3];
  const gapPoint = { x: (sheet.x + email.x) / 2, y: (sheet.y + email.y) / 2 };
  let lead: Point = positions[0];
  for (const hop of leadHops) {
    if (frame >= hop.start) lead = arc(positions[hop.from], positions[hop.to], progress(frame, hop.start, hop.end, EASE_IN_OUT), portrait ? 140 : 110);
  }
  if (frame >= B + 104) {
    const fall = progress(frame, B + 104, B + 140, EASE_IN_OUT);
    lead = { x: interpolate(fall, [0, 0.4, 1], [sheet.x, gapPoint.x, gapPoint.x]), y: interpolate(fall, [0, 0.4, 1], [sheet.y, gapPoint.y, gapPoint.y + (portrait ? 420 : 320)]) };
  }
  const leadOpacity = progress(frame, B, B + 10) * (1 - progress(frame, B + 128, B + 142));
  const crack = progress(frame, B + 110, B + 136) * (1 - progress(frame, 2 * B, 2 * B + 24));

  // Beat 4: el paquete recorre el riel dos veces y cada estado queda encendido.
  const loopA = interpolate(frame, [3 * B + 10, 3 * B + 75], [0, 4], { ...CLAMP, easing: EASE_IN_OUT });
  const loopB = interpolate(frame, [3 * B + 80, 3 * B + 140], [0, 4], { ...CLAMP, easing: EASE_IN_OUT });
  const packetPos = frame < 3 * B + 78 ? loopA : loopB;
  const packetVisible = progress(frame, 3 * B, 3 * B + 10);
  const packetIndex = Math.min(3, Math.floor(packetPos));
  const packetPoint = arc(railPoint(packetIndex), railPoint(packetIndex + 1), Math.min(1, packetPos - packetIndex), 0);
  const settled = progress(frame, 4 * B - 16, 4 * B - 2);

  const labelSize = portrait ? 34 : 24;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FILM_FONTS.body, color: FILM_COLORS.fg }}>
      <FilmBackdrop />

      {/* Cables del riel (beat 3) */}
      {TOOLS.slice(0, -1).map((tool, index) => {
        const a = railPoint(index);
        const b = railPoint(index + 1);
        const draw = progress(frame, 2 * B + 70 + index * 8, 2 * B + 110 + index * 8);
        const length = portrait ? b.y - a.y : b.x - a.x;
        const lit = Math.max(settled, interpolate(packetPos, [index, index + 1], [0, 1], CLAMP) * packetVisible);
        return (
          <div
            key={`cable-${tool.id}`}
            style={{
              position: "absolute",
              left: a.x,
              top: a.y,
              width: portrait ? 3 : length,
              height: portrait ? length : 3,
              translate: portrait ? "-1.5px 0px" : "0px -1.5px",
              background: ink(0.14),
              transformOrigin: portrait ? "50% 0%" : "0% 50%",
              scale: portrait ? `1 ${draw}` : `${draw} 1`,
            }}
          >
            <div style={{ width: "100%", height: "100%", background: FILM_COLORS.signal, boxShadow: `0 0 16px ${tint(FILM_COLORS.signal, 70)}`, transformOrigin: portrait ? "50% 0%" : "0% 50%", scale: portrait ? `1 ${lit}` : `${lit} 1` }} />
          </div>
        );
      })}

      {/* Herramientas → estados */}
      {TOOLS.map((tool, index) => {
        const point = positions[index];
        const enter = progress(frame, index * 7, index * 7 + 20);
        const ping = ((frame + index * 11) % 54) / 54;
        const unread = Math.min(9, 1 + Math.floor(Math.max(0, frame - index * 9) / 26));
        const badge = (1 - progress(frame, 2 * B, 2 * B + 20)) * enter;
        const lostBadge = progress(frame, B + 112, B + 126);
        const packetNear = Math.max(0, 1 - Math.abs(packetPos - index) * 1.4) * packetVisible;
        const glow = Math.max(packetNear, settled);
        const stage = SYSTEM_RAIL_STAGES[index];
        return (
          <div key={tool.id}>
            {/* Ping de mensaje nuevo (beat 1) */}
            <div
              style={{
                position: "absolute",
                left: point.x,
                top: point.y,
                width: tile,
                height: tile,
                translate: "-50% -50%",
                borderRadius: tile * 0.3,
                border: `2px solid ${tint(FILM_COLORS.accent, 60)}`,
                scale: `${1 + ping * 0.6}`,
                opacity: (1 - ping) * 0.5 * drift * enter,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: point.x,
                top: point.y,
                width: tile,
                height: tile,
                translate: "-50% -50%",
                borderRadius: tile * 0.3,
                border: `1px solid ${glow > 0.3 ? tint(FILM_COLORS.signal, 70) : ink(0.16)}`,
                background: glow > 0.3 ? `linear-gradient(150deg, ${tint(FILM_COLORS.signal, 18)}, ${FILM_COLORS.card})` : FILM_COLORS.card,
                boxShadow: `0 0 ${50 * glow}px ${tint(FILM_COLORS.signal, 30 * glow)}, 0 20px 50px ${ink(0.08)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: enter,
                scale: `${0.9 + enter * 0.1 + packetNear * 0.06}`,
              }}
            >
              <div style={{ opacity: 1 - relabel * 0.75 }}>
                <tool.Icon size={tile * 0.4} color={glow > 0.3 ? "var(--color-signal)" : "rgb(var(--ink-rgb) / 0.82)"} />
              </div>
              {/* Mensajes sin leer */}
              <div
                style={{
                  position: "absolute",
                  right: -tile * 0.12,
                  top: -tile * 0.12,
                  minWidth: tile * 0.3,
                  height: tile * 0.3,
                  borderRadius: 99,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: lostBadge > 0.5 ? FILM_COLORS.danger : FILM_COLORS.accent,
                  color: "var(--color-background)",
                  fontFamily: FILM_FONTS.mono,
                  fontSize: tile * 0.17,
                  fontWeight: 700,
                  opacity: badge,
                }}
              >
                {unread}
              </div>
            </div>
            {/* Número de estado sobre el nodo (aparece al alinearse en el riel) */}
            <div
              style={{
                position: "absolute",
                left: portrait ? point.x - tile * 0.5 - 16 : point.x,
                top: portrait ? point.y : point.y - tile * 0.5 - 18,
                translate: portrait ? "-100% -50%" : "-50% -100%",
                fontFamily: FILM_FONTS.mono,
                fontSize: portrait ? 26 : 17,
                letterSpacing: "0.16em",
                color: glow > 0.3 ? FILM_COLORS.signal : ink(0.45),
                opacity: relabel,
              }}
            >
              0{index + 1}
            </div>
            {/* Estado del prospecto al pasar el paquete */}
            <div
              style={{
                position: "absolute",
                left: portrait ? point.x + tile * 0.75 : point.x,
                top: portrait ? point.y + labelSize * 1.1 : point.y + tile * 0.72 + labelSize * 1.9,
                translate: portrait ? "0% 0%" : "-50% 0%",
                whiteSpace: "nowrap",
                padding: portrait ? "6px 14px" : "4px 10px",
                borderRadius: 999,
                border: `1px solid ${tint(FILM_COLORS.signal, 40)}`,
                background: tint(FILM_COLORS.signal, 10),
                fontFamily: FILM_FONTS.mono,
                fontSize: portrait ? 22 : 14,
                letterSpacing: "0.06em",
                color: FILM_COLORS.signal,
                opacity: progress(frame, 3 * B + 10 + index * 13, 3 * B + 20 + index * 13),
              }}
            >
              {LEAD_STATES[index][language]}
            </div>
            {/* Etiqueta: la herramienta se convierte en un estado del sistema */}
            {[
              { key: "tool", text: tool.label[language], opacity: 1 - relabel, font: FILM_FONTS.mono, size: labelSize, color: ink(0.6), spacing: "0.08em" },
              { key: "stage", text: stage.title[language], opacity: relabel, font: FILM_FONTS.body, size: labelSize * 1.3, color: glow > 0.3 ? FILM_COLORS.fg : ink(0.72), spacing: "-0.02em" },
            ].map((label) => (
              <div
                key={label.key}
                style={{
                  position: "absolute",
                  left: portrait ? point.x + tile * 0.75 : point.x,
                  top: portrait ? point.y : point.y + tile * 0.72,
                  translate: portrait ? "0% -50%" : "-50% 0%",
                  whiteSpace: "nowrap",
                  fontFamily: label.font,
                  fontSize: label.size,
                  letterSpacing: label.spacing,
                  color: label.color,
                  opacity: enter * label.opacity,
                }}
              >
                {label.text}
              </div>
            ))}
          </div>
        );
      })}

      {/* Grieta donde se pierde el lead (beat 2): encima de las herramientas */}
      <div
        style={{
          position: "absolute",
          left: gapPoint.x,
          top: gapPoint.y - (portrait ? 70 : 60),
          width: 4,
          height: portrait ? 420 : 340,
          translate: "-2px 0px",
          backgroundImage: `repeating-linear-gradient(to bottom, ${FILM_COLORS.danger} 0 10px, transparent 10px 18px)`,
          transformOrigin: "50% 0%",
          scale: `1 ${crack}`,
          opacity: crack,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: gapPoint.x,
          top: gapPoint.y - (portrait ? 96 : 84),
          translate: "-50% -100%",
          padding: portrait ? "12px 22px" : "10px 18px",
          borderRadius: 999,
          border: `1px solid ${tint(FILM_COLORS.danger, 55)}`,
          background: FILM_COLORS.card,
          boxShadow: `0 0 0 6px ${tint(FILM_COLORS.danger, 10)}`,
          color: FILM_COLORS.fg,
          fontFamily: FILM_FONTS.mono,
          fontSize: portrait ? 28 : 20,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          opacity: crack,
        }}
      >
        {language === "es" ? "Acá se pierde" : "Lost here"}
      </div>

      {/* El lead (beat 2) */}
      <div
        style={{
          position: "absolute",
          left: lead.x,
          top: lead.y,
          width: portrait ? 38 : 32,
          height: portrait ? 38 : 32,
          translate: "-50% -50%",
          borderRadius: 99,
          background: FILM_COLORS.accent,
          boxShadow: `0 0 0 8px ${tint(FILM_COLORS.accent, 22)}, 0 0 40px ${tint(FILM_COLORS.accent, 70)}`,
          opacity: leadOpacity,
        }}
      />

      {/* Paquete que recorre el sistema (beat 4) */}
      <div
        style={{
          position: "absolute",
          left: packetPoint.x,
          top: packetPoint.y,
          width: portrait ? 30 : 22,
          height: portrait ? 30 : 22,
          translate: "-50% -50%",
          borderRadius: 99,
          background: FILM_COLORS.signal,
          boxShadow: `0 0 0 8px ${tint(FILM_COLORS.signal, 22)}, 0 0 40px ${tint(FILM_COLORS.signal, 80)}`,
          opacity: packetVisible * (1 - settled),
        }}
      />
    </AbsoluteFill>
  );
}
