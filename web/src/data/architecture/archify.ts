/**
 * Tipos y geometría de los diagramas de arquitectura en formato Archify
 * (tt-a1i/archify, MIT). El JSON es la fuente: el mismo archivo se valida con
 * la CLI de Archify, se recorre en los films y se muestra interactivo.
 *
 * Variantes por diagrama `<nombre>`:
 * - `<nombre>.json` (español, apaisado) y `<nombre>.portrait.json` (mismo
 *   contenido, posiciones para 4:5 y pantallas angostas);
 * - `<nombre>.en.json`: traducción (no repite posiciones);
 * - `*.layout.json`: geometría que congela scripts/build-archify-layouts.ts
 *   para cada combinación de orientación e idioma.
 */

import type { Box } from "@/lib/filmLayout";

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

/** Traducción de un diagrama: textos por id (componentes, vistas) o por clave (grupos, conexiones). */
export interface ArchifyTranslation {
  title: string;
  components: Record<string, { label: string; sublabel?: string; tag?: string }>;
  /** Etiqueta de grupo en español → etiqueta traducida. */
  boundaries: Record<string, string>;
  /** `from>to` → etiqueta de la conexión. */
  connections: Record<string, string>;
  views: Record<string, { label: string; note?: string }>;
}

export const edgeKey = (from: string, to: string) => `${from}>${to}`;

/** Aplica una traducción al diagrama (las posiciones no cambian). */
export function localizeDiagram(diagram: ArchifyArchitecture, translation: ArchifyTranslation): ArchifyArchitecture {
  return {
    ...diagram,
    meta: {
      ...diagram.meta,
      title: translation.title,
      views: diagram.meta.views?.map((view) => ({ ...view, ...translation.views[view.id] })),
    },
    components: diagram.components.map((component) => ({ ...component, ...translation.components[component.id] })),
    boundaries: diagram.boundaries?.map((boundary) => ({ ...boundary, label: translation.boundaries[boundary.label] ?? boundary.label })),
    connections: diagram.connections.map((connection) =>
      connection.label ? { ...connection, label: translation.connections[edgeKey(connection.from, connection.to)] ?? connection.label } : connection,
    ),
    cards: undefined,
  };
}

/** Qué queda en foco en una vista (null = todo): mismo criterio en el film y en el diagrama interactivo. */
export function viewFocus(diagram: ArchifyArchitecture, viewId: string | null) {
  const view = viewId ? diagram.meta.views?.find((item) => item.id === viewId) : undefined;
  if (!view) return null;
  const nodes = new Set(view.focus);
  const edges = new Set(diagram.connections.filter((connection) => nodes.has(connection.from) && nodes.has(connection.to)).map((connection) => edgeKey(connection.from, connection.to)));
  const boundaries = new Set((diagram.boundaries ?? []).filter((boundary) => boundary.wraps.some((id) => nodes.has(id))).map((boundary) => boundary.label));
  return { view, nodes, edges, boundaries };
}

/** Rol de color por tipo de componente (la paleta concreta la pone cada marca). */
export function typeRole(type: ArchifyComponentType): "danger" | "accent" | "accentSoft" | "muted" {
  switch (type) {
    case "security":
      return "danger";
    case "database":
    case "frontend":
      return "accent";
    case "backend":
    case "cloud":
      return "accentSoft";
    default:
      return "muted";
  }
}

/** El mismo `Box` de la geometría de los films (una sola definición). */
export type { Box };

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
