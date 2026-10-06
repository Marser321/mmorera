/**
 * Tipos y geometría de los diagramas de arquitectura en formato Archify
 * (tt-a1i/archify, MIT). El JSON es la fuente: el mismo archivo se valida con
 * la CLI de Archify, se recorre en los films y se muestra interactivo.
 */

export type ArchifyComponentType = "external" | "frontend" | "backend" | "security" | "database" | "cloud" | string;
export type ArchifySide = "left" | "right" | "top" | "bottom";

export interface ArchifyComponent {
  id: string;
  type: ArchifyComponentType;
  label: string;
  sublabel?: string;
  tag?: string;
  pos: [number, number];
  size: [number, number];
}

export interface ArchifyBoundary {
  kind: "region" | "security-group" | string;
  label: string;
  wraps: string[];
  pad?: number;
}

export interface ArchifyConnection {
  from: string;
  to: string;
  label?: string;
  variant?: "emphasis" | "dashed" | string;
  fromSide?: ArchifySide;
  toSide?: ArchifySide;
}

export interface ArchifyView {
  id: string;
  label: string;
  focus: string[];
  note?: string;
}

export interface ArchifyArchitecture {
  schema_version: number;
  diagram_type: "architecture";
  meta: { title: string; views?: ArchifyView[] };
  components: ArchifyComponent[];
  boundaries?: ArchifyBoundary[];
  connections: ArchifyConnection[];
  cards?: Array<{ dot?: string; title: string; items: string[] }>;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function componentBox(component: ArchifyComponent): Box {
  return { x: component.pos[0], y: component.pos[1], w: component.size[0], h: component.size[1] };
}

export function unionBox(boxes: Box[], pad = 0): Box {
  const minX = Math.min(...boxes.map((box) => box.x)) - pad;
  const minY = Math.min(...boxes.map((box) => box.y)) - pad;
  const maxX = Math.max(...boxes.map((box) => box.x + box.w)) + pad;
  const maxY = Math.max(...boxes.map((box) => box.y + box.h)) + pad;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export function boundaryBox(diagram: ArchifyArchitecture, boundary: ArchifyBoundary): Box {
  const boxes = diagram.components.filter((component) => boundary.wraps.includes(component.id)).map(componentBox);
  // Espacio extra arriba para la etiqueta del grupo.
  const box = unionBox(boxes, boundary.pad ?? 20);
  return { x: box.x, y: box.y - 14, w: box.w, h: box.h + 14 };
}

export function diagramBox(diagram: ArchifyArchitecture): Box {
  const boxes = [...diagram.components.map(componentBox), ...(diagram.boundaries ?? []).map((boundary) => boundaryBox(diagram, boundary))];
  return unionBox(boxes, 16);
}

function anchor(box: Box, side: ArchifySide) {
  switch (side) {
    case "left":
      return { x: box.x, y: box.y + box.h / 2 };
    case "right":
      return { x: box.x + box.w, y: box.y + box.h / 2 };
    case "top":
      return { x: box.x + box.w / 2, y: box.y };
    default:
      return { x: box.x + box.w / 2, y: box.y + box.h };
  }
}

/** Ruta ortogonal entre dos componentes (codos en el punto medio). */
export function connectionPath(diagram: ArchifyArchitecture, connection: ArchifyConnection) {
  const source = diagram.components.find((component) => component.id === connection.from);
  const target = diagram.components.find((component) => component.id === connection.to);
  if (!source || !target) return null;
  const a = componentBox(source);
  const b = componentBox(target);
  let fromSide = connection.fromSide;
  let toSide = connection.toSide;
  if (!fromSide || !toSide) {
    if (b.x >= a.x + a.w) [fromSide, toSide] = ["right", "left"];
    else if (b.x + b.w <= a.x) [fromSide, toSide] = ["left", "right"];
    else if (b.y >= a.y + a.h) [fromSide, toSide] = ["bottom", "top"];
    else [fromSide, toSide] = ["top", "bottom"];
  }
  const start = anchor(a, fromSide);
  const end = anchor(b, toSide);
  const horizontalStart = fromSide === "left" || fromSide === "right";
  const horizontalEnd = toSide === "left" || toSide === "right";
  let d: string;
  let mid: { x: number; y: number };
  if (horizontalStart && horizontalEnd) {
    const mx = (start.x + end.x) / 2;
    d = `M ${start.x} ${start.y} H ${mx} V ${end.y} H ${end.x}`;
    mid = { x: mx, y: (start.y + end.y) / 2 };
  } else if (!horizontalStart && !horizontalEnd) {
    const my = (start.y + end.y) / 2;
    d = `M ${start.x} ${start.y} V ${my} H ${end.x} V ${end.y}`;
    mid = { x: (start.x + end.x) / 2, y: my };
  } else if (!horizontalStart) {
    d = `M ${start.x} ${start.y} V ${end.y} H ${end.x}`;
    mid = { x: start.x, y: end.y };
  } else {
    d = `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
    mid = { x: end.x, y: start.y };
  }
  return { d, start, end, mid };
}
