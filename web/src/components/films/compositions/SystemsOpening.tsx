import { useMemo, type ComponentType } from "react";
import { FileText, Mail } from "lucide-react";
import { SiGooglesheets, SiInstagram, SiWhatsapp } from "react-icons/si";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { FilmBackdrop } from "../scenes/primitives";
import { FILM_COLORS, FILM_FONTS, ink, tint, useFilmLayout } from "../scenes/theme";
import { OPENING_TOOLS, openingFrame, type TextItem } from "./systemsOpeningLayout";

// type (no interface): el Player exige props indexables (Record<string, unknown>).
export type SystemsOpeningProps = {
  language: FilmLanguage;
};

/**
 * Cada herramienta suelta termina siendo un estado del riel:
 * Instagram → Captación, Formulario → Calificación, Planilla → CRM,
 * Email → Agenda, WhatsApp → Handoff.
 */
const ICONS: Record<(typeof OPENING_TOOLS)[number]["id"], ComponentType<{ size?: number; color?: string }>> = {
  instagram: SiInstagram,
  form: FileText,
  sheet: SiGooglesheets,
  email: Mail,
  whatsapp: SiWhatsapp,
};

const at = (item: TextItem) => ({ position: "absolute" as const, left: item.box.x, top: item.box.y, width: item.box.w, height: item.box.h, whiteSpace: "nowrap" as const, opacity: item.opacity });

/**
 * Film de apertura de /sistemas. Solo imagen: los textos largos viven en HTML.
 * Toda la coreografía sale de openingFrame() (verificada cuadro a cuadro por
 * tests): nada se pisa, los rótulos cambian en secuencia y el paquete viaja
 * solo por los cables.
 */
export function SystemsOpening({ language }: SystemsOpeningProps) {
  const frame = useCurrentFrame();
  const { portrait } = useFilmLayout();
  const state = useMemo(() => openingFrame(frame, portrait ? "portrait" : "landscape", language), [frame, portrait, language]);
  const { spec, tools, lead, crack, pill, cables, packet } = state;
  const { tile } = spec;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FILM_FONTS.body, color: FILM_COLORS.fg }}>
      <FilmBackdrop />

      {/* Cables del riel: solo entre bordes, por debajo de los mosaicos */}
      {cables.map((cable, index) => {
        const vertical = cable.from.x === cable.to.x;
        const length = vertical ? cable.to.y - cable.from.y : cable.to.x - cable.from.x;
        return (
          <div
            key={`cable-${OPENING_TOOLS[index].id}`}
            style={{
              position: "absolute",
              left: cable.from.x,
              top: cable.from.y,
              width: vertical ? 2 : length,
              height: vertical ? length : 2,
              translate: vertical ? "-1px 0px" : "0px -1px",
              background: ink(0.14),
              transformOrigin: vertical ? "50% 0%" : "0% 50%",
              scale: vertical ? `1 ${cable.draw}` : `${cable.draw} 1`,
            }}
          >
            <div style={{ width: "100%", height: "100%", background: FILM_COLORS.signal, transformOrigin: vertical ? "50% 0%" : "0% 50%", scale: vertical ? `1 ${cable.lit}` : `${cable.lit} 1` }} />
          </div>
        );
      })}

      {/* Paquete que recorre el sistema (beat 4): solo sobre el cable */}
      {packet ? (
        <div
          style={{
            position: "absolute",
            left: packet.point.x,
            top: packet.point.y,
            width: spec.packet.size,
            height: spec.packet.size,
            translate: "-50% -50%",
            borderRadius: 99,
            background: FILM_COLORS.signal,
            boxShadow: `0 0 0 ${spec.packet.halo}px ${tint(FILM_COLORS.signal, 24)}`,
            opacity: packet.opacity,
          }}
        />
      ) : null}

      {/* Grieta donde se pierde el lead (beat 2): en una columna libre */}
      <div
        style={{
          position: "absolute",
          left: spec.crack.x,
          top: spec.crack.top,
          width: 3,
          height: spec.crack.bottom - spec.crack.top,
          translate: "-1.5px 0px",
          backgroundImage: `repeating-linear-gradient(to bottom, ${FILM_COLORS.danger} 0 10px, transparent 10px 18px)`,
          transformOrigin: "50% 0%",
          scale: `1 ${crack.draw}`,
          opacity: crack.opacity,
        }}
      />

      {/* Herramientas → estados */}
      {tools.map((tool, index) => {
        const { id } = OPENING_TOOLS[index];
        const Icon = ICONS[id];
        const lit = tool.glow > 0.3;
        return (
          <div key={id}>
            {/* Aviso de mensaje nuevo (beat 1): un pulso corto que no llega a los rótulos */}
            <div
              style={{
                position: "absolute",
                left: tool.center.x,
                top: tool.center.y,
                width: tile,
                height: tile,
                translate: "-50% -50%",
                borderRadius: tile * 0.3,
                border: `2px solid ${tint(FILM_COLORS.accent, 55)}`,
                scale: `${tool.ping.scale * tool.scale}`,
                opacity: tool.ping.opacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: tool.center.x,
                top: tool.center.y,
                width: tile,
                height: tile,
                translate: "-50% -50%",
                boxSizing: "border-box",
                borderRadius: tile * 0.3,
                border: `1px solid ${lit ? tint(FILM_COLORS.signal, 65) : ink(0.16)}`,
                background: lit ? `linear-gradient(150deg, ${tint(FILM_COLORS.signal, 14)}, transparent 70%), ${FILM_COLORS.card}` : FILM_COLORS.card,
                boxShadow: `0 0 ${28 * tool.glow}px ${tint(FILM_COLORS.signal, 22 * tool.glow)}, 0 16px 40px ${ink(0.06)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: tool.enter,
                scale: `${tool.scale}`,
              }}
            >
              <div style={{ display: "flex", opacity: 1 - tool.iconDim * 0.55 }}>
                <Icon size={tile * 0.38} color={lit ? "var(--color-signal)" : "rgb(var(--ink-rgb) / 0.82)"} />
              </div>
            </div>
            {/* Mensajes sin leer: pegado a la esquina del mosaico */}
            <div
              style={{
                position: "absolute",
                left: tool.badge.box.x,
                top: tool.badge.box.y,
                width: tool.badge.box.w,
                height: tool.badge.box.h,
                borderRadius: 99,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: tool.badge.lost > 0.5 ? FILM_COLORS.danger : FILM_COLORS.accent,
                color: "var(--color-background)",
                fontFamily: FILM_FONTS.mono,
                fontSize: tile * 0.17,
                fontWeight: 700,
                opacity: tool.badge.opacity,
              }}
            >
              {tool.badge.count}
            </div>
            {/* Rótulo de la herramienta (sale antes de que el mosaico viaje) */}
            <div style={{ ...at(tool.toolLabel), fontFamily: FILM_FONTS.mono, fontSize: spec.toolLabel.size, lineHeight: 1.25, letterSpacing: "0.08em", color: ink(0.6), textAlign: "center" }}>
              {tool.toolLabel.text}
            </div>
            {/* Estado del riel (entra cuando el mosaico ya llegó) */}
            <div style={{ ...at(tool.number), fontFamily: FILM_FONTS.mono, fontSize: spec.number.size, lineHeight: 1.25, letterSpacing: "0.16em", color: lit ? FILM_COLORS.signal : ink(0.45) }}>
              {tool.number.text}
            </div>
            <div style={{ ...at(tool.title), fontFamily: FILM_FONTS.body, fontSize: spec.title.size, lineHeight: 1.25, letterSpacing: "-0.02em", color: lit ? FILM_COLORS.fg : ink(0.72), textAlign: portrait ? "left" : "center" }}>
              {tool.title.text}
            </div>
            {/* Estado del prospecto al pasar el paquete */}
            <div
              style={{
                ...at(tool.chip),
                boxSizing: "border-box",
                padding: `${spec.chip.padY}px ${spec.chip.padX}px`,
                borderRadius: 999,
                border: `1px solid ${tint(FILM_COLORS.signal, 40)}`,
                background: tint(FILM_COLORS.signal, 10),
                fontFamily: FILM_FONTS.mono,
                fontSize: spec.chip.size,
                lineHeight: 1.25,
                letterSpacing: "0.06em",
                color: FILM_COLORS.signal,
              }}
            >
              {tool.chip.text}
            </div>
          </div>
        );
      })}

      {/* "Acá se pierde": al costado de la grieta, cuando el lead ya cayó */}
      <div
        style={{
          ...at(pill),
          boxSizing: "border-box",
          padding: `${spec.pill.padY}px ${spec.pill.padX}px`,
          borderRadius: 999,
          border: `1px solid ${tint(FILM_COLORS.danger, 55)}`,
          background: FILM_COLORS.card,
          color: FILM_COLORS.fg,
          fontFamily: FILM_FONTS.mono,
          fontSize: spec.pill.size,
          lineHeight: 1.25,
          letterSpacing: "0.12em",
        }}
      >
        {pill.text}
      </div>

      {/* El lead (beat 2): se posa encima de cada herramienta y salta por arriba */}
      <div
        style={{
          position: "absolute",
          left: lead.point.x,
          top: lead.point.y,
          width: spec.lead.size,
          height: spec.lead.size,
          translate: "-50% -50%",
          borderRadius: 99,
          background: FILM_COLORS.accent,
          boxShadow: `0 0 0 ${spec.lead.halo}px ${tint(FILM_COLORS.accent, 22)}`,
          opacity: lead.opacity,
        }}
      />
    </AbsoluteFill>
  );
}
