import { interpolate, useCurrentFrame } from "remotion";
import { FLOW_TIMING, nodeActivationFrame, type FilmLanguage, type FilmStage } from "@/data/films/filmTypes";
import { CLAMP, EASE_IN_OUT, FILM_COLORS, FILM_FONTS, ink, progress, tint } from "./theme";

interface FlowDiagramProps {
  stages: FilmStage[];
  language: FilmLanguage;
  portrait: boolean;
  top: number;
  selectedNodeId?: string | null;
  onNodeSelect?: (stageId: string) => void;
}

/**
 * Diagrama del flujo: los nodos entran, los cables se dibujan y un paquete
 * recorre el sistema encendiendo cada etapa. Los nodos son clicables
 * (pausan el film y abren el inspector fuera del cuadro).
 */
export function FlowDiagram({ stages, language, portrait, top, selectedNodeId, onNodeSelect }: FlowDiagramProps) {
  const frame = useCurrentFrame();
  const total = stages.length;
  const activations = stages.map((_, index) => nodeActivationFrame(index, total));

  // Geometría: fila en 16:9, columna con riel a la izquierda en 4:5.
  const nodeWidth = portrait ? 780 : Math.min(250, 1360 / total - 40);
  const nodeHeight = portrait ? 150 : 178;
  const span = portrait ? 1350 - top - 230 : 1360;
  const step = total > 1 ? (span - (portrait ? nodeHeight : nodeWidth)) / (total - 1) : 0;
  const railX = 140;
  const centers = stages.map((_, index) =>
    portrait
      ? { x: railX, y: top + nodeHeight / 2 + index * step }
      : { x: 120 + nodeWidth / 2 + index * step, y: top + nodeHeight / 2 },
  );

  // Paquete: avanza entre centros con una pausa natural en cada nodo.
  const travel = interpolate(frame, [FLOW_TIMING.travelStart, FLOW_TIMING.travelEnd], [0, total - 1], CLAMP);
  const segmentIndex = Math.min(total - 2, Math.floor(travel));
  const local = EASE_IN_OUT(Math.min(1, travel - Math.max(0, segmentIndex)));
  const from = centers[Math.max(0, segmentIndex)];
  const to = centers[Math.min(total - 1, Math.max(0, segmentIndex) + 1)];
  const packet = { x: from.x + (to.x - from.x) * local, y: from.y + (to.y - from.y) * local };
  const packetVisible = progress(frame, FLOW_TIMING.travelStart - 10, FLOW_TIMING.travelStart) * (1 - progress(frame, FLOW_TIMING.travelEnd + 20, FLOW_TIMING.travelEnd + 36));

  const titleSize = portrait ? 36 : 22;
  const monoSize = portrait ? 22 : 14;

  return (
    <>
      {/* Cables */}
      {centers.slice(0, -1).map((center, index) => {
        const next = centers[index + 1];
        const draw = progress(frame, FLOW_TIMING.cablesIn + index * 9, FLOW_TIMING.cablesIn + 30 + index * 9);
        const lit = progress(frame, activations[index], activations[index + 1]);
        const length = portrait ? next.y - center.y : next.x - center.x;
        return (
          <div
            key={`cable-${stages[index].id}`}
            style={{
              position: "absolute",
              left: center.x,
              top: center.y,
              width: portrait ? 3 : length,
              height: portrait ? length : 3,
              translate: portrait ? "-1.5px 0px" : "0px -1.5px",
              background: ink(0.12),
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
                boxShadow: `0 0 18px ${tint(FILM_COLORS.signal, 70)}`,
                transformOrigin: portrait ? "50% 0%" : "0% 50%",
                scale: portrait ? `1 ${lit}` : `${lit} 1`,
                borderRadius: 9,
              }}
            />
          </div>
        );
      })}

      {/* Nodos */}
      {stages.map((stage, index) => {
        const enter = progress(frame, FLOW_TIMING.nodesIn + index * 7, FLOW_TIMING.nodesIn + 22 + index * 7);
        const lit = progress(frame, activations[index] - 4, activations[index] + 8);
        const selected = selectedNodeId === stage.id;
        const latency = stage.latencyMs === undefined ? null : Math.round(interpolate(frame, [activations[index], activations[index] + 14], [0, stage.latencyMs], CLAMP));
        const center = centers[index];
        const left = portrait ? railX + 70 : center.x - nodeWidth / 2;
        const nodeTop = portrait ? center.y - nodeHeight / 2 : top;
        const borderColor = selected ? FILM_COLORS.accent : lit > 0.5 ? tint(FILM_COLORS.signal, 65) : ink(0.12);
        return (
          <div key={stage.id}>
            {/* Punto en el riel */}
            <div
              style={{
                position: "absolute",
                left: center.x,
                top: center.y,
                width: portrait ? 26 : 16,
                height: portrait ? 26 : 16,
                translate: "-50% -50%",
                borderRadius: 99,
                border: `2px solid ${lit > 0.5 ? FILM_COLORS.signal : ink(0.3)}`,
                background: lit > 0.5 ? FILM_COLORS.signal : FILM_COLORS.card,
                opacity: enter,
                zIndex: 2,
                display: portrait ? "block" : "none",
              }}
            />
            <div
              role="presentation"
              onClick={onNodeSelect ? () => onNodeSelect(stage.id) : undefined}
              style={{
                position: "absolute",
                left,
                top: nodeTop,
                width: nodeWidth,
                height: nodeHeight,
                boxSizing: "border-box",
                padding: portrait ? "22px 28px" : "18px 20px",
                borderRadius: portrait ? 28 : 22,
                border: `${selected ? 2 : 1}px solid ${borderColor}`,
                background: lit > 0.5 ? `linear-gradient(160deg, ${tint(FILM_COLORS.signal, 12)}, ${FILM_COLORS.card} 70%)` : FILM_COLORS.card,
                boxShadow: lit > 0.5 ? `0 0 ${portrait ? 46 : 36}px ${tint(FILM_COLORS.signal, 18)}` : "none",
                opacity: enter,
                translate: `0px ${(1 - enter) * 26}px`,
                scale: `${0.96 + enter * 0.04 + (selected ? 0.02 : 0)}`,
                cursor: onNodeSelect ? "pointer" : "default",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FILM_FONTS.mono, fontSize: monoSize, letterSpacing: "0.12em", color: lit > 0.5 ? FILM_COLORS.signal : ink(0.4) }}>
                <span>0{index + 1}</span>
                {latency !== null && lit > 0 ? <span>{latency} ms · {stage.httpStatus}</span> : <span>{lit > 0.5 ? "✓" : ""}</span>}
              </div>
              <div style={{ fontFamily: FILM_FONTS.body, fontSize: titleSize, fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.03em", color: FILM_COLORS.fg }}>
                {stage.title[language]}
              </div>
              <div style={{ fontFamily: FILM_FONTS.mono, fontSize: monoSize, color: ink(0.5), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {stage.technology}
              </div>
            </div>
          </div>
        );
      })}

      {/* Paquete de datos */}
      <div
        style={{
          position: "absolute",
          left: packet.x,
          top: packet.y,
          width: portrait ? 30 : 22,
          height: portrait ? 30 : 22,
          translate: "-50% -50%",
          borderRadius: 99,
          background: FILM_COLORS.signal,
          boxShadow: `0 0 0 ${portrait ? 10 : 8}px ${tint(FILM_COLORS.signal, 22)}, 0 0 40px ${tint(FILM_COLORS.signal, 80)}`,
          opacity: packetVisible,
          // Viaja por debajo de los nodos: desaparece al entrar y la etapa se enciende.
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/** Registro de eventos que se escribe a medida que el paquete pasa por cada nodo. */
export function LogStream({ stages, language, left, top, width, size }: { stages: FilmStage[]; language: FilmLanguage; left: number; top: number; width: number; size: number }) {
  const frame = useCurrentFrame();
  const activations = stages.map((_, index) => nodeActivationFrame(index, stages.length));
  const elapsed = stages.map((_, index) => stages.slice(0, index + 1).reduce((total, stage) => total + (stage.latencyMs ?? 0), 0));
  return (
    <div style={{ position: "absolute", left, top, width, fontFamily: FILM_FONTS.mono, fontSize: size, lineHeight: 1.75, color: ink(0.5) }}>
      {stages.map((stage, index) => {
        const shown = progress(frame, activations[index], activations[index] + 8);
        const isLatest = frame >= activations[index] && (index === stages.length - 1 || frame < activations[index + 1]);
        const stamp = stage.latencyMs === undefined ? `${language === "es" ? "paso" : "step"} ${index + 1}` : `00:00.${String(elapsed[index]).padStart(3, "0")}`;
        return (
          <div key={stage.id} style={{ opacity: shown, translate: `${(1 - shown) * -12}px 0px`, color: isLatest ? FILM_COLORS.fg : ink(0.45), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <span style={{ color: FILM_COLORS.signal }}>[{stamp}]</span> {stage.httpStatus ? `${stage.httpStatus} · ` : ""}{stage.id} · {stage.summary[language]}
          </div>
        );
      })}
    </div>
  );
}
