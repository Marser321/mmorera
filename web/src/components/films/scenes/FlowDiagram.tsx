import { useCurrentFrame } from "remotion";
import { FLOW_TIMING, type FilmLanguage, type FilmStage } from "@/data/films/filmTypes";
import { FLOW_MONO_TRACKING, logLine, nodeMeta, packetOpacity, packetPoint, packetTimeline, type FlowGeometry } from "./flowLayout";
import { EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "./theme";

type FlowDiagramProps = {
  stages: FilmStage[];
  language: FilmLanguage;
  /** Cajas, cables y tamaños calculados en flowLayout (los mismos que verifican los tests). */
  geometry: FlowGeometry;
  selectedNodeId?: string | null;
  onNodeSelect?: (stageId: string) => void;
};

/**
 * Diagrama del flujo: los nodos entran, los cables se dibujan y un paquete
 * recorre el sistema. El paquete viaja solo por los cables, de borde a borde:
 * al llegar, la etapa se enciende y, tras una pausa, sale por el cable
 * siguiente. Nunca pasa por encima de un nodo. Los nodos son clicables
 * (pausan el film y abren el inspector fuera del cuadro).
 */
export function FlowDiagram({ stages, language, geometry, selectedNodeId, onNodeSelect }: FlowDiagramProps) {
  const frame = useCurrentFrame();
  const { portrait, nodes, anchors, cables, text } = geometry;
  const { activations, legs } = packetTimeline(stages.length);

  // Tramo activo del paquete (si está viajando) y su avance en el cable.
  const legIndex = legs.findIndex((leg) => frame > leg.depart && frame < leg.arrive);
  const legProgress = legs.map((leg) => progress(frame, leg.depart, leg.arrive, EASE_IN_OUT));
  const packetU = legIndex >= 0 ? legProgress[legIndex] : 0;
  const packet = legIndex >= 0 ? packetPoint(geometry, legIndex, packetU) : null;
  const packetSize = geometry.packet.size;

  return (
    <>
      {/* Cables: solo entre bordes; el relleno avanza con el paquete */}
      {cables.map((cable, index) => {
        const draw = progress(frame, FLOW_TIMING.cablesIn + index * 9, FLOW_TIMING.cablesIn + 30 + index * 9);
        const lit = legProgress[index];
        const length = portrait ? cable.to.y - cable.from.y : cable.to.x - cable.from.x;
        return (
          <div
            key={`cable-${stages[index].id}`}
            style={{
              position: "absolute",
              left: cable.from.x,
              top: cable.from.y,
              width: portrait ? 2 : length,
              height: portrait ? length : 2,
              translate: portrait ? "-1px 0px" : "0px -1px",
              background: ink(0.14),
              borderRadius: 9,
              transformOrigin: portrait ? "50% 0%" : "0% 50%",
              scale: portrait ? `1 ${draw}` : `${draw} 1`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: FILM_COLORS.signal,
                transformOrigin: portrait ? "50% 0%" : "0% 50%",
                scale: portrait ? `1 ${lit}` : `${lit} 1`,
                borderRadius: 9,
              }}
            />
          </div>
        );
      })}

      {/* Paquete de datos: por debajo de los nodos y solo sobre el cable */}
      {packet ? (
        <div
          style={{
            position: "absolute",
            left: packet.x,
            top: packet.y,
            width: packetSize,
            height: packetSize,
            translate: "-50% -50%",
            borderRadius: 99,
            background: FILM_COLORS.signal,
            boxShadow: `0 0 0 ${geometry.packet.halo}px ${tint(FILM_COLORS.signal, 24)}`,
            opacity: packetOpacity(packetU),
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* Nodos */}
      {stages.map((stage, index) => {
        const enter = progress(frame, FLOW_TIMING.nodesIn + index * 7, FLOW_TIMING.nodesIn + 22 + index * 7);
        const lit = progress(frame, activations[index] - 2, activations[index] + 10);
        const on = lit > 0.5;
        const selected = selectedNodeId === stage.id;
        // Tiempo de la muestra: aparece entero al encenderse (sin conteo intermedio).
        const meta = nodeMeta(stage);
        const node = nodes[index];
        const anchor = anchors[index];
        const borderColor = selected ? FILM_COLORS.accent : on ? tint(FILM_COLORS.signal, 65) : ink(0.12);
        return (
          <div key={stage.id}>
            {/* Punto en el riel (4:5): la etapa se enciende cuando llega el paquete */}
            {portrait ? (
              <div
                style={{
                  position: "absolute",
                  left: anchor.x,
                  top: anchor.y,
                  width: geometry.dot,
                  height: geometry.dot,
                  translate: "-50% -50%",
                  boxSizing: "border-box",
                  borderRadius: 99,
                  border: `2px solid ${on ? FILM_COLORS.signal : ink(0.3)}`,
                  background: on ? FILM_COLORS.signal : FILM_COLORS.card,
                  boxShadow: `0 0 0 ${6 * lit}px ${tint(FILM_COLORS.signal, 16)}`,
                  opacity: enter,
                }}
              />
            ) : null}
            <div
              role="presentation"
              onClick={onNodeSelect ? () => onNodeSelect(stage.id) : undefined}
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                width: node.w,
                height: node.h,
                boxSizing: "border-box",
                padding: `${text.padY}px ${text.padX}px`,
                borderRadius: geometry.radius,
                border: `${selected ? 2 : 1}px solid ${borderColor}`,
                // Siempre opaco: nada de lo que pasa por detrás se ve a través.
                background: on ? `linear-gradient(160deg, ${tint(FILM_COLORS.signal, 12)}, transparent 70%), ${FILM_COLORS.card}` : FILM_COLORS.card,
                boxShadow: `0 0 ${portrait ? 28 : 22}px ${tint(FILM_COLORS.signal, 14 * lit)}`,
                opacity: enter,
                translate: `0px ${(1 - enter) * 22}px`,
                scale: `${0.97 + enter * 0.03}`,
                cursor: onNodeSelect ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontFamily: FILM_FONTS.mono, fontSize: text.mono, lineHeight: 1.3, letterSpacing: `${FLOW_MONO_TRACKING}em`, color: on ? FILM_COLORS.signal : ink(0.4), whiteSpace: "nowrap" }}>
                <span>0{index + 1}</span>
                <span style={{ opacity: lit }}>{meta || "✓"}</span>
              </div>
              <div style={{ fontFamily: FILM_FONTS.body, fontSize: text.title, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.03em", color: FILM_COLORS.fg }}>
                {stage.title[language]}
              </div>
              <div style={{ fontFamily: FILM_FONTS.mono, fontSize: text.mono, lineHeight: 1.3, color: ink(0.5) }}>
                {stage.technology}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

/** Registro de eventos que se escribe a medida que el paquete llega a cada nodo. */
export function LogStream({ stages, language, left, top, width, size }: { stages: FilmStage[]; language: FilmLanguage; left: number; top: number; width: number; size: number }) {
  const frame = useCurrentFrame();
  const { activations } = packetTimeline(stages.length);
  return (
    <div style={{ position: "absolute", left, top, width, fontFamily: FILM_FONTS.mono, fontSize: size, lineHeight: 1.75, color: ink(0.5) }}>
      {stages.map((stage, index) => {
        const shown = progress(frame, activations[index], activations[index] + 10);
        const isLatest = frame >= activations[index] && (index === stages.length - 1 || frame < activations[index + 1]);
        const line = logLine(stages, index, language);
        return (
          <div key={stage.id} style={{ opacity: shown, translate: `${(1 - shown) * -10}px 0px`, color: isLatest ? FILM_COLORS.fg : ink(0.45), whiteSpace: "nowrap" }}>
            <span style={{ color: FILM_COLORS.signal }}>{line.stamp}</span> {line.rest}
          </div>
        );
      })}
    </div>
  );
}
