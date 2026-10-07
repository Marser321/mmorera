/**
 * Modelo puro de "Bajo el capó": geometría, estados de foco, nodos y aristas
 * del diagrama interactivo y tokens de color. Sin React ni @xyflow/react: lo
 * usan el póster del server, el explorador del cliente y los tests.
 *
 * Todo sale de la geometría congelada por Archify (`*.layout.json`): las
 * cajas, rutas y placas se dibujan exactamente donde Archify las validó, así
 * nada se pisa en ninguna orientación ni idioma.
 */
import { edgeKey, typeRole, viewFocus, type ArchifyArchitecture, type ArchifyComponent, type ArchifyComponentType, type ArchifyLayout, type Box } from "@/data/architecture/archify";
import type { ArchitectureOrientation } from "@/data/architecture/bundle";
import type { CaseBrand } from "@/data/brands/caseBrands";
import type { FilmLanguage } from "@/data/films/filmTypes";

/**
 * Ancho del contenedor (px) desde el que se usa la versión apaisada. Por
 * debajo, la vertical: en tablets la apaisada quedaba con texto de 5–6 px y
 * la vertical lo lleva a 9–13 px con el mismo ancho.
 */
export const LANDSCAPE_MIN_WIDTH = 960;
/** Margen (unidades del diagrama) alrededor de todo lo dibujado. */
export const FRAME_PAD = 24;
/** Opacidad de lo que queda fuera de foco en una vista. */
export const DIM_OPACITY = 0.22;
/** Rótulos de grupo: cuerpo, alto de la banda y ancho estimado por carácter (mayúsculas + tracking). */
export const TITLE_FONT = 9;
const TITLE_HEIGHT = 16;
const TITLE_EM_PER_CHAR = 0.78;
const TITLE_GAP = 3;

export const boundaryNodeId = (index: number) => `__boundary-${index}`;

export type ComponentRole = ReturnType<typeof typeRole>;

export function orientationFor(width: number): ArchitectureOrientation {
  return width < LANDSCAPE_MIN_WIDTH ? "portrait" : "landscape";
}

/** Marco del dibujo: todo lo que se pinta (cajas, grupos, rutas y placas) más un margen. */
export function diagramFrame(layout: ArchifyLayout, pad = FRAME_PAD): Box {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const add = (x: number, y: number, w = 0, h = 0) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  };
  layout.components.forEach((box) => add(box.x, box.y, box.w, box.h));
  layout.boundaries.forEach((box) => add(box.x, box.y, box.w, box.h));
  layout.connections.forEach((connection) => {
    connection.points.forEach(([x, y]) => add(x, y));
    if (connection.label) add(connection.label.x, connection.label.y, connection.label.w, connection.label.h);
  });
  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: layout.viewBox[0], h: layout.viewBox[1] };
  return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
}

/** Proporción del lienzo en teléfonos (CSS aspect-ratio): cuadrado, o la del marco si ya es más alto. */
export function narrowAspect(frame: Box) {
  return frame.w > frame.h ? "1 / 1" : `${frame.w} / ${frame.h}`;
}

const rectsTouch = (a: Box, b: Box, gap = 0) => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;

/** ¿El tramo ortogonal a→b atraviesa la caja (con holgura)? */
function segmentTouches(a: [number, number], b: [number, number], box: Box, gap = 0) {
  const minX = Math.min(a[0], b[0]);
  const maxX = Math.max(a[0], b[0]);
  const minY = Math.min(a[1], b[1]);
  const maxY = Math.max(a[1], b[1]);
  return minX < box.x + box.w + gap && maxX > box.x - gap && minY < box.y + box.h + gap && maxY > box.y - gap;
}

export type Plate = { key: string; text: string; x: number; y: number; w: number; h: number };
export type BoundaryTitle = { index: number; label: string; security: boolean; x: number; y: number; w: number; h: number; fontSize: number; fallback: boolean };

export function connectionPlates(layout: ArchifyLayout): Plate[] {
  return layout.connections.flatMap((connection) => (connection.label ? [{ key: edgeKey(connection.from, connection.to), ...connection.label }] : []));
}

/** Ancho reservado para un rótulo de grupo (mayúsculas con tracking, estimación generosa). */
export function titleWidth(label: string, fontSize = TITLE_FONT) {
  return Math.ceil(label.length * fontSize * TITLE_EM_PER_CHAR + 4);
}

/**
 * Rótulo de cada grupo en la banda superior de su marco, en el primer tramo
 * (de izquierda a derecha) que no toca rutas, cajas, placas ni otro rótulo.
 * Archify garantiza la banda libre de cajas; las rutas que entran por arriba
 * pueden cruzarla, así que se busca el hueco.
 */
export function boundaryTitles(layout: ArchifyLayout): BoundaryTitle[] {
  const plates = connectionPlates(layout);
  const placed: BoundaryTitle[] = [];
  layout.boundaries.forEach((boundary, index) => {
    const y = boundary.y + 4;
    const available = boundary.w - 12;
    const w = Math.min(available, titleWidth(boundary.label));
    const blocked = (candidate: Box) =>
      layout.components.some((box) => rectsTouch(candidate, box, TITLE_GAP)) ||
      plates.some((plate) => rectsTouch(candidate, plate, TITLE_GAP)) ||
      placed.some((title) => rectsTouch(candidate, title, TITLE_GAP)) ||
      layout.connections.some((connection) => connection.points.slice(1).some((point, step) => segmentTouches(connection.points[step], point, candidate, TITLE_GAP)));
    let slot: number | null = null;
    for (let x = boundary.x + 6; x + w <= boundary.x + boundary.w - 6; x += 2) {
      if (!blocked({ x, y, w, h: TITLE_HEIGHT })) {
        slot = x;
        break;
      }
    }
    placed.push({
      index,
      label: boundary.label,
      security: boundary.kind === "security-group",
      x: slot ?? boundary.x + 6,
      y,
      w,
      h: TITLE_HEIGHT,
      fontSize: TITLE_FONT,
      fallback: slot === null,
    });
  });
  return placed;
}

/** La etiqueta técnica se omite si su grupo ya la nombra (p. ej. "Next.js 16"), igual que en el film. */
export function visibleTag(diagram: ArchifyArchitecture, component: ArchifyComponent) {
  if (!component.tag) return null;
  const wrapper = diagram.boundaries?.find((boundary) => boundary.wraps.includes(component.id));
  return wrapper?.label.toLowerCase().includes(component.tag.toLowerCase()) ? null : component.tag;
}

/* ---------- Tipografía de las cajas ---------- */

/** Familias CSS con las que se escriben las cajas (las de la marca del caso). */
export type CardFonts = { display: string; body: string; label: string };

/** Tipografías del sitio para casos sin marca cargada. */
export const SITE_FONTS: CardFonts = {
  display: "var(--ff-display), var(--ff-body), sans-serif",
  body: "var(--ff-body), sans-serif",
  label: "var(--ff-mono), monospace",
};

/** Ancho aproximado de un carácter (em) en una sans de proporciones normales. */
function charEm(char: string) {
  if (char === "→") return 1;
  if (char === "·") return 0.3;
  if (/[ilj.,:;'’|!]/.test(char)) return 0.28;
  if (/[ftrI\-/()[\] ]/.test(char)) return 0.36;
  if (/[mwMW]/.test(char)) return 0.85;
  if (/[A-Z]/.test(char)) return 0.68;
  if (/[0-9]/.test(char)) return 0.58;
  if (char === "_") return 0.55;
  return 0.54;
}

/** Ancho estimado de un texto en em (multiplicar por el cuerpo y por `fontWidth`). */
export const textEm = (text: string) => Array.from(text).reduce((sum, char) => sum + charEm(char), 0);

/**
 * Factor de ancho de cada familia respecto de la estimación de `textEm`,
 * medido en Chromium con las fuentes de las marcas (peso de las cajas), con
 * holgura sobre el caso más ancho medido. Una familia desconocida usa el más
 * ancho de la tabla.
 */
const FONT_WIDTH: Array<[RegExp, number]> = [
  [/oswald/i, 0.94],
  [/fraunces/i, 1.12],
  [/manrope/i, 1.08],
  [/inter\b/i, 1.13],
  [/montserrat/i, 1.25],
];
export const DEFAULT_FONT_WIDTH = 1.25;

export function fontWidth(family: string) {
  return FONT_WIDTH.find(([pattern]) => pattern.test(family))?.[1] ?? DEFAULT_FONT_WIDTH;
}

/** Ancho estimado (unidades del diagrama) de un texto en una familia y un cuerpo. */
export const textWidth = (text: string, family: string, size: number) => textEm(text) * fontWidth(family) * size;

/** Cuerpos posibles del título y de la bajada de una caja, de mayor a menor. */
export const LABEL_SIZES = [13, 12.5, 12, 11.5, 11] as const;
export const SUB_SIZES = [9.5, 9, 8.5] as const;
/** Lo que la caja come a lo ancho: padding (10 + 10) y borde (1,5 + 1,5). */
export const CARD_INSET_X = 23;
/** Píldora de la etiqueta técnica: cuerpo 8 en negrita, padding 6 + 6 y separación 6. */
const TAG_SIZE = 8;
const TAG_EXTRA = 18;

export function tagWidth(tag: string, fonts: CardFonts) {
  return textWidth(tag, fonts.label, TAG_SIZE) * 1.06 + TAG_EXTRA;
}

/** El cuerpo más grande de la escala con el que el texto entra en el ancho (o el menor, con elipsis de resguardo). */
export function fitSize(text: string, width: number, family: string, sizes: readonly number[]) {
  return sizes.find((size) => textWidth(text, family, size) <= width) ?? sizes[sizes.length - 1];
}

/**
 * Cuerpos del título y de la bajada de una caja: el más grande que entra
 * entero en una línea con la tipografía de la marca, así ningún nombre se
 * corta (el póster y el explorador usan los mismos).
 */
export function cardTextSizes(component: ArchifyComponent, tag: string | null, width: number, fonts: CardFonts) {
  const inner = width - CARD_INSET_X;
  return {
    labelSize: fitSize(component.label, inner - (tag ? tagWidth(tag, fonts) : 0), fonts.display, LABEL_SIZES),
    subSize: component.sublabel ? fitSize(component.sublabel, inner, fonts.body, SUB_SIZES) : SUB_SIZES[0],
  };
}

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
    danger: "#E5484D",
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
    danger: "#B4232A",
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
