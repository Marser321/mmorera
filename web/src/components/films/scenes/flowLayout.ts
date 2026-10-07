import { nodeActivationFrame, type FilmLanguage, type FilmStage } from "@/data/films/filmTypes";
import { safeArea, type Box } from "@/lib/filmLayout";
import { bodyWidth, lineCount, monoWidth } from "./siteText";

/**
 * Geometría pura del diagrama de flujo de los casos de uso (FlowDiagram).
 *
 * Regla: el paquete viaja solo por los cables, de borde a borde, y nunca pasa
 * por encima de un nodo. Al llegar, el nodo se enciende; después sale por el
 * cable siguiente. Los textos de cada nodo se dimensionan para entrar enteros
 * (sin elipsis) en su caja.
 */

export type Point = { x: number; y: number };

export type FlowCable = { from: Point; to: Point };

export type FlowGeometry = {
  portrait: boolean;
  nodes: Box[];
  /** 4:5: centro del punto del riel de cada etapa. 16:9: centro del nodo. */
  anchors: Point[];
  /** Tramos de cable visibles, del borde de un nodo (o punto) al borde del siguiente. */
  cables: FlowCable[];
  /** Diámetro del punto del riel (solo 4:5). */
  dot: number;
  /** Paquete: diámetro del punto y ancho del halo. */
  packet: { size: number; halo: number };
  text: { title: number; mono: number; padX: number; padY: number; gap: number; titleLines: number; techLines: number };
  radius: number;
  /** Borde inferior del diagrama (para ubicar lo que va debajo). */
  bottom: number;
};

const LANDSCAPE_MIN_GAP = 96;
const LANDSCAPE_MAX_NODE = 260;
const PORTRAIT_RAIL_X = 104;
const PORTRAIT_NODE_X = 152;
const PORTRAIT_MAX_GAP = 64;

/** Tracking de los rótulos mono del nodo (número y latencia). */
export const FLOW_MONO_TRACKING = 0.12;

function fitSize(texts: string[], width: number, lines: number, sizes: number[], measure: (text: string, size: number) => number) {
  for (const size of sizes) if (texts.every((text) => lineCount(text, width, (word) => measure(word, size)) <= lines)) return size;
  return sizes[sizes.length - 1];
}

function maxLines(texts: string[], width: number, measure: (text: string) => number) {
  return Math.max(1, ...texts.map((text) => lineCount(text, width, measure)));
}

/** Rótulo superior del nodo: latencia y estado HTTP (solo en flujos de ejemplo). */
export function nodeMeta(stage: FilmStage) {
  return stage.latencyMs === undefined ? "" : `${stage.latencyMs} ms · ${stage.httpStatus ?? ""}`.trim();
}

export function flowGeometry(stages: FilmStage[], language: FilmLanguage, portrait: boolean, top: number): FlowGeometry {
  const count = stages.length;
  const titles = stages.map((stage) => stage.title[language]);
  const techs = stages.map((stage) => stage.technology);

  if (!portrait) {
    const area = safeArea("landscape");
    const nodeWidth = Math.min(LANDSCAPE_MAX_NODE, Math.floor((area.w - LANDSCAPE_MIN_GAP * (count - 1)) / count));
    const gap = count > 1 ? (area.w - nodeWidth * count) / (count - 1) : 0;
    const padX = 18;
    const padY = 18;
    const inner = nodeWidth - padX * 2;
    const title = fitSize(titles, inner, 3, [22, 21, 20, 19, 18], (word, size) => bodyWidth(word, size, -0.03));
    const mono = fitSize(techs, inner, 2, [13, 12], (word, size) => monoWidth(word, size));
    const titleLines = maxLines(titles, inner, (word) => bodyWidth(word, title, -0.03));
    const techLines = maxLines(techs, inner, (word) => monoWidth(word, mono));
    const textGap = 10;
    const height = Math.ceil(padY * 2 + mono * 1.3 + textGap + titleLines * title * 1.1 + textGap + techLines * mono * 1.3) + 8;
    const nodes = stages.map((_, index) => ({ x: area.x + index * (nodeWidth + gap), y: top, w: nodeWidth, h: height }));
    const anchors = nodes.map((node) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 }));
    const cables = nodes.slice(0, -1).map((node, index) => ({
      from: { x: node.x + node.w, y: anchors[index].y },
      to: { x: nodes[index + 1].x, y: anchors[index].y },
    }));
    return {
      portrait,
      nodes,
      anchors,
      cables,
      dot: 0,
      packet: { size: 12, halo: 4 },
      text: { title, mono, padX, padY, gap: textGap, titleLines, techLines },
      radius: 22,
      bottom: top + height,
    };
  }

  const area = safeArea("portrait");
  const nodeWidth = area.x + area.w - PORTRAIT_NODE_X;
  const padX = 26;
  const padY = 20;
  const inner = nodeWidth - padX * 2;
  const title = fitSize(titles, inner, 1, [34, 32, 30, 28], (word, size) => bodyWidth(word, size, -0.03));
  const mono = fitSize(techs, inner, 1, [20, 19, 18], (word, size) => monoWidth(word, size));
  const textGap = 8;
  const height = Math.ceil(padY * 2 + mono * 1.3 + textGap + title * 1.1 + textGap + mono * 1.3);
  const available = area.y + area.h - 14 - top;
  const gap = count > 1 ? Math.min(PORTRAIT_MAX_GAP, (available - height * count) / (count - 1)) : 0;
  const nodes = stages.map((_, index) => ({ x: PORTRAIT_NODE_X, y: top + index * (height + gap), w: nodeWidth, h: height }));
  const dot = 22;
  const anchors = nodes.map((node) => ({ x: PORTRAIT_RAIL_X, y: node.y + node.h / 2 }));
  const cables = anchors.slice(0, -1).map((anchor, index) => ({
    from: { x: anchor.x, y: anchor.y + dot / 2 },
    to: { x: anchor.x, y: anchors[index + 1].y - dot / 2 },
  }));
  return {
    portrait,
    nodes,
    anchors,
    cables,
    dot,
    packet: { size: 16, halo: 5 },
    text: { title, mono, padX, padY, gap: textGap, titleLines: 1, techLines: 1 },
    radius: 26,
    bottom: nodes[nodes.length - 1].y + height,
  };
}

/** Radio total del paquete (punto + halo + un poco de resplandor). */
export const packetReach = (geometry: FlowGeometry) => geometry.packet.size / 2 + geometry.packet.halo + 3;

/**
 * Tiempos del paquete: llega a la etapa i en su frame de activación (igual
 * que el registro y el inspector) y, tras una pausa, sale por el cable i.
 */
export function packetTimeline(count: number) {
  const activations = Array.from({ length: count }, (_, index) => nodeActivationFrame(index, count));
  const legs = activations.slice(0, -1).map((at, index) => {
    const span = activations[index + 1] - at;
    return { depart: at + span * 0.3, arrive: activations[index + 1] };
  });
  return { activations, legs };
}

/** Punto del paquete en el cable `index` para un avance `u` (0–1). Recorre el cable sin tocar los bordes. */
export function packetPoint(geometry: FlowGeometry, index: number, u: number): Point {
  const cable = geometry.cables[index];
  const reach = packetReach(geometry) + 2;
  const dx = cable.to.x - cable.from.x;
  const dy = cable.to.y - cable.from.y;
  const length = Math.hypot(dx, dy);
  const start = Math.min(reach, length / 2);
  const travel = Math.max(0, length - start * 2);
  const along = start + travel * Math.min(1, Math.max(0, u));
  return { x: cable.from.x + (dx / length) * along, y: cable.from.y + (dy / length) * along };
}

/** Opacidad del paquete a lo largo del cable: aparece al salir del borde y se apaga al llegar. */
export function packetOpacity(u: number) {
  if (u <= 0 || u >= 1) return 0;
  return Math.min(1, u / 0.12, (1 - u) / 0.12);
}

/** Texto de una línea del registro de eventos (LogStream). */
export function logLine(stages: FilmStage[], index: number, language: FilmLanguage) {
  const stage = stages[index];
  const elapsed = stages.slice(0, index + 1).reduce((total, item) => total + (item.latencyMs ?? 0), 0);
  const stamp = stage.latencyMs === undefined ? `${language === "es" ? "paso" : "step"} ${index + 1}` : `00:00.${String(elapsed).padStart(3, "0")}`;
  return { stamp: `[${stamp}]`, rest: `${stage.httpStatus ? `${stage.httpStatus} · ` : ""}${stage.id} · ${stage.summary[language]}` };
}
