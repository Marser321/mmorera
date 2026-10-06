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

/**
 * Geometría congelada que calculó Archify para un diagrama
 * (scripts/build-archify-layouts.mjs): rutas ortogonales sin cruces y placas
 * de etiqueta con holgura respecto de cajas y otras rutas.
 */
export interface ArchifyLayout {
  source: string;
  viewBox: [number, number];
  components: Array<{ id: string; x: number; y: number; w: number; h: number }>;
  boundaries: Array<{ label: string; kind: string; x: number; y: number; w: number; h: number }>;
  connections: Array<{
    from: string;
    to: string;
    points: Array<[number, number]>;
    label?: { text: string; x: number; y: number; w: number; h: number };
  }>;
}

/** Ruta SVG de una polilínea de Archify. */
export function polylinePath(points: Array<[number, number]>) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
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
