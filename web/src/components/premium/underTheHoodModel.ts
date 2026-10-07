/**
 * Modelo puro de "Bajo el capó": estados de foco, nodos y aristas del
 * diagrama interactivo y tokens de color. Sin React ni @xyflow/react: lo usan
 * el póster del server, el explorador del cliente y los tests.
 *
 * La geometría compartida con los films (marco, rótulos de grupo, placas,
 * tipografía de las cajas y colores por rol) vive en
 * `@/data/architecture/diagramModel`: sitio y film dibujan lo mismo.
 */
import { edgeKey, typeRole, viewFocus, type ArchifyArchitecture, type ArchifyComponent, type ArchifyComponentType, type ArchifyLayout, type Box } from "@/data/architecture/archify";
import type { ArchitectureOrientation } from "@/data/architecture/bundle";
import {
  boundaryTitles,
  cardTextSizes,
  connectionPlates,
  DANGER,
  diagramFrame,
  visibleTag,
  type BoundaryTitle,
  type CardFonts,
  type ComponentRole,
  type Plate,
} from "@/data/architecture/diagramModel";
import type { CaseBrand } from "@/data/brands/caseBrands";
import type { FilmLanguage } from "@/data/films/filmTypes";

/**
 * Ancho del contenedor (px) desde el que se usa la versión apaisada. Por
 * debajo, la vertical: en tablets la apaisada quedaba con texto de 5–6 px y
 * la vertical lo lleva a 9–13 px con el mismo ancho.
 */
export const LANDSCAPE_MIN_WIDTH = 960;
/** Opacidad de lo que queda fuera de foco en una vista. */
export const DIM_OPACITY = 0.22;

export const boundaryNodeId = (index: number) => `__boundary-${index}`;

export function orientationFor(width: number): ArchitectureOrientation {
  return width < LANDSCAPE_MIN_WIDTH ? "portrait" : "landscape";
}

/** Proporción del lienzo en teléfonos (CSS aspect-ratio): cuadrado, o la del marco si ya es más alto. */
export function narrowAspect(frame: Box) {
  return frame.w > frame.h ? "1 / 1" : `${frame.w} / ${frame.h}`;
}

/** Tipografías del sitio para casos sin marca cargada. */
export const SITE_FONTS: CardFonts = {
  display: "var(--ff-display), var(--ff-body), sans-serif",
  body: "var(--ff-body), sans-serif",
  label: "var(--ff-mono), monospace",
};

export {
  boundaryTitles,
  cardTextSizes,
  CARD_INSET_X,
  connectionPlates,
  DANGER,
  DEFAULT_FONT_WIDTH,
  diagramFrame,
  fitSize,
  fontWidth,
  FRAME_PAD,
  LABEL_SIZES,
  PLATE_FONT,
  plateTextLength,
  roleColors,
  segmentTouches,
  SUB_SIZES,
  tagWidth,
  textEm,
  textWidth,
  TITLE_FONT,
  titleWidth,
  visibleTag,
  type BoundaryTitle,
  type CardFonts,
  type ComponentRole,
  type Plate,
} from "@/data/architecture/diagramModel";

export type ComponentSpec = {
  id: string;
  component: ArchifyComponent;
  role: ComponentRole;
  tag: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  labelSize: number;
  subSize: number;
};
export type RouteSpec = { id: string; from: string; to: string; points: Array<[number, number]>; variant: string | null; plate: Plate | null };
export type BoundarySpec = { id: string; index: number; label: string; security: boolean; x: number; y: number; w: number; h: number };

export type ArchitectureModel = {
  orientation: ArchitectureOrientation;
  diagram: ArchifyArchitecture;
  frame: Box;
  /** Componentes en orden de lectura (columnas en apaisado, filas en vertical): también es el orden de tabulación. */
  components: ComponentSpec[];
  routes: RouteSpec[];
  boundaries: BoundarySpec[];
  plates: Plate[];
  titles: BoundaryTitle[];
};

export function buildArchitectureModel(diagram: ArchifyArchitecture, layout: ArchifyLayout, orientation: ArchitectureOrientation, fonts: CardFonts = SITE_FONTS): ArchitectureModel {
  const byId = new Map(diagram.components.map((component) => [component.id, component]));
  const components = layout.components
    .flatMap((box): ComponentSpec[] => {
      const component = byId.get(box.id);
      if (!component) return [];
      const tag = visibleTag(diagram, component);
      return [{ id: box.id, component, role: typeRole(component.type), tag, x: box.x, y: box.y, w: box.w, h: box.h, ...cardTextSizes(component, tag, box.w, fonts) }];
    })
    .sort((a, b) => (orientation === "landscape" ? a.x - b.x || a.y - b.y : a.y - b.y || a.x - b.x));
  const routes = layout.connections.map((connection) => {
    const source = diagram.connections.find((item) => item.from === connection.from && item.to === connection.to);
    const key = edgeKey(connection.from, connection.to);
    return {
      id: key,
      from: connection.from,
      to: connection.to,
      points: connection.points,
      variant: source?.variant ?? null,
      plate: connection.label ? { key, ...connection.label } : null,
    };
  });
  return {
    orientation,
    diagram,
    frame: diagramFrame(layout),
    components,
    routes,
    boundaries: layout.boundaries.map((boundary, index) => ({ id: boundaryNodeId(index), index, label: boundary.label, security: boundary.kind === "security-group", x: boundary.x, y: boundary.y, w: boundary.w, h: boundary.h })),
    plates: connectionPlates(layout),
    titles: boundaryTitles(layout),
  };
}

/** Qué queda en foco: una vista (sus nodos) o un componente abierto en el inspector (él y sus vecinos). null = todo. */
export type FocusState = { nodes: Set<string>; edges: Set<string>; boundaries: Set<string> } | null;

export function focusState(diagram: ArchifyArchitecture, viewId: string | null, selectedId: string | null): FocusState {
  if (selectedId && diagram.components.some((component) => component.id === selectedId)) {
    const touching = diagram.connections.filter((connection) => connection.from === selectedId || connection.to === selectedId);
    const nodes = new Set([selectedId, ...touching.flatMap((connection) => [connection.from, connection.to])]);
    const edges = new Set(touching.map((connection) => edgeKey(connection.from, connection.to)));
    const boundaries = new Set((diagram.boundaries ?? []).filter((boundary) => boundary.wraps.some((id) => nodes.has(id))).map((boundary) => boundary.label));
    return { nodes, edges, boundaries };
  }
  const focus = viewFocus(diagram, viewId);
  return focus ? { nodes: focus.nodes, edges: focus.edges, boundaries: focus.boundaries } : null;
}

export const isDimmed = (focus: FocusState, kind: "nodes" | "edges" | "boundaries", id: string) => (focus ? !focus[kind].has(id) : false);

export type ComponentLink = { id: string; label: string; via: string | null };

/** Entradas y salidas de un componente, con la etiqueta de cada conexión. */
export function componentLinks(diagram: ArchifyArchitecture, id: string) {
  const labelOf = (componentId: string) => diagram.components.find((component) => component.id === componentId)?.label ?? componentId;
  return {
    incoming: diagram.connections.filter((connection) => connection.to === id).map((connection) => ({ id: connection.from, label: labelOf(connection.from), via: connection.label ?? null })),
    outgoing: diagram.connections.filter((connection) => connection.from === id).map((connection) => ({ id: connection.to, label: labelOf(connection.to), via: connection.label ?? null })),
  };
}

/** Vistas guiadas que incluyen al componente. */
export function viewsWith(diagram: ArchifyArchitecture, id: string) {
  return (diagram.meta.views ?? []).filter((view) => view.focus.includes(id));
}

const TYPE_LABELS: Record<string, Record<FilmLanguage, string>> = {
  external: { es: "Externo", en: "External" },
  frontend: { es: "Frontend", en: "Frontend" },
  backend: { es: "Backend", en: "Backend" },
  security: { es: "Seguridad", en: "Security" },
  database: { es: "Base de datos", en: "Database" },
  cloud: { es: "Nube", en: "Cloud" },
};

export function typeLabel(type: ArchifyComponentType, language: FilmLanguage) {
  return TYPE_LABELS[type]?.[language] ?? type;
}

/** Resumen honesto para la vista "Todo": solo cuenta lo que está en el diagrama. */
export function diagramSummary(diagram: ArchifyArchitecture, language: FilmLanguage) {
  const components = diagram.components.length;
  const connections = diagram.connections.length;
  const views = diagram.meta.views?.length ?? 0;
  return language === "es"
    ? `${components} componentes, ${connections} conexiones y ${views} recorridos guiados.`
    : `${components} components, ${connections} connections and ${views} guided paths.`;
}

/* ---------- Color ---------- */

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((char) => char + char).join("") : value.slice(0, 6);
  const number = Number.parseInt(full, 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

/** Mezcla en sRGB: `weight` de `a` y el resto de `b`. */
export function mixHex(a: string, b: string, weight: number) {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  const channel = (x: number, y: number) => Math.round(x * weight + y * (1 - weight)).toString(16).padStart(2, "0");
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
}

function luminance(hex: string) {
  const [r, g, b] = parseHex(hex).map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste WCAG entre dos colores hex. */
export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export type CasePalette = CaseBrand["palette"];

/** Paleta neutra (tokens oscuros del sitio) para casos sin marca cargada. */
export const SITE_PALETTE: CasePalette = {
  bg: "#070809",
  surface: "#0D1114",
  raised: "#141A1F",
  line: "#263038",
  text: "#F3F0E8",
  muted: "#9AA3AD",
  accent: "#55D8FF",
  accentSoft: "#71F3A2",
  accentDeep: "#0A7EA4",
  onAccent: "#070809",
};

export const THEME_KEYS = ["canvas", "surface", "raised", "line", "text", "muted", "accent", "accent-soft", "accent-ink", "danger", "route", "plate", "pill-mix", "pill-ink", "border-mix", "tab-bg", "tab-ink"] as const;
export type ThemeKey = (typeof THEME_KEYS)[number];
export type ThemeTokens = Record<ThemeKey, string>;

/**
 * Oscura con la paleta tal cual; clara derivada: papel del tono del texto,
 * tinta del fondo y acentos profundos. Las píldoras van teñidas con el color
 * del tipo y texto de tinta, así contrastan con cualquier paleta.
 */
export function explorerTheme(palette: CasePalette): { dark: ThemeTokens; light: ThemeTokens } {
  const dark: ThemeTokens = {
    canvas: palette.bg,
    surface: mixHex(palette.surface, palette.bg, 0.55),
    raised: palette.raised,
    line: palette.line,
    text: palette.text,
    muted: palette.muted,
    accent: palette.accent,
    "accent-soft": palette.accentSoft,
    "accent-ink": palette.accentSoft,
    danger: DANGER.dark,
    route: mixHex(palette.accent, palette.bg, 0.6),
    plate: palette.bg,
    "pill-mix": "24%",
    "pill-ink": palette.text,
    "border-mix": "45%",
    "tab-bg": palette.accent,
    "tab-ink": palette.onAccent,
  };
  const paper = mixHex(palette.text, "#FFFFFF", 0.35);
  const ink = palette.bg;
  const deep = mixHex(palette.accentDeep, ink, 0.78);
  const light: ThemeTokens = {
    canvas: paper,
    surface: mixHex(palette.accentDeep, paper, 0.06),
    raised: mixHex("#FFFFFF", paper, 0.7),
    line: mixHex(ink, paper, 0.14),
    text: ink,
    muted: mixHex(ink, palette.muted, 0.6),
    accent: deep,
    "accent-soft": palette.accentDeep,
    "accent-ink": mixHex(palette.accentDeep, ink, 0.62),
    danger: DANGER.light,
    route: mixHex(palette.accentDeep, ink, 0.9),
    plate: paper,
    "pill-mix": "16%",
    "pill-ink": ink,
    "border-mix": "72%",
    "tab-bg": ink,
    "tab-ink": paper,
  };
  return { dark, light };
}

/** Variables CSS de ambos temas para el contenedor (el CSS del módulo elige según `html.light`). */
export function themeVars(palette: CasePalette, radius: number) {
  const { dark, light } = explorerTheme(palette);
  const vars: Record<string, string> = { "--uth-radius": String(radius) };
  for (const key of THEME_KEYS) {
    vars[`--uth-d-${key}`] = dark[key];
    vars[`--uth-l-${key}`] = light[key];
  }
  return vars;
}
