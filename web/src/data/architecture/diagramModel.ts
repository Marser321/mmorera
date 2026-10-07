/**
 * Modelo compartido de los diagramas de Archify: lo usan el sitio ("Bajo el
 * capó": póster y explorador) y los films (`ArchitectureScene`). Puro, sin
 * React: rótulos de grupo, placas de etiqueta, tipografía de las cajas y
 * colores por rol.
 *
 * Todo sale de la geometría congelada por Archify (`*.layout.json`), así el
 * sitio y el film dibujan lo mismo en el mismo lugar.
 */
import { overlaps } from "@/lib/filmLayout";
import { edgeKey, typeRole, type ArchifyArchitecture, type ArchifyComponent, type ArchifyLayout, type Box } from "./archify";

/* ---------- Marco ---------- */

/** Margen (unidades del diagrama) alrededor de todo lo dibujado. */
export const FRAME_PAD = 24;

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

/** ¿El tramo ortogonal a→b atraviesa la caja (con holgura)? */
export function segmentTouches(a: [number, number], b: [number, number], box: Box, gap = 0) {
  const minX = Math.min(a[0], b[0]);
  const maxX = Math.max(a[0], b[0]);
  const minY = Math.min(a[1], b[1]);
  const maxY = Math.max(a[1], b[1]);
  return minX < box.x + box.w + gap && maxX > box.x - gap && minY < box.y + box.h + gap && maxY > box.y - gap;
}

/* ---------- Placas de etiqueta ---------- */

export type Plate = { key: string; text: string; x: number; y: number; w: number; h: number };

/** Cuerpo del texto de las placas. */
export const PLATE_FONT = 9;

export function connectionPlates(layout: ArchifyLayout): Plate[] {
  return layout.connections.flatMap((connection) => (connection.label ? [{ key: edgeKey(connection.from, connection.to), ...connection.label }] : []));
}

/**
 * `textLength` del texto de una placa: solo cuando podría no entrar
 * (estimación generosa de 0,6 em por carácter); así nunca se estira un texto
 * corto y uno largo se ajusta al ancho que validó Archify.
 */
export function plateTextLength(plate: Pick<Plate, "text" | "w">) {
  return plate.text.length * PLATE_FONT * 0.6 > plate.w - 6 ? plate.w - 6 : undefined;
}

/* ---------- Rótulos de grupo ---------- */

/** Rótulos de grupo: cuerpo, alto de la banda y ancho estimado por carácter (mayúsculas + tracking). */
export const TITLE_FONT = 9;
const TITLE_HEIGHT = 16;
const TITLE_EM_PER_CHAR = 0.78;
const TITLE_GAP = 3;

export type BoundaryTitle = { index: number; label: string; security: boolean; x: number; y: number; w: number; h: number; fontSize: number; fallback: boolean };

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
      layout.components.some((box) => overlaps(candidate, box, TITLE_GAP)) ||
      plates.some((plate) => overlaps(candidate, plate, TITLE_GAP)) ||
      placed.some((title) => overlaps(candidate, title, TITLE_GAP)) ||
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

/* ---------- Cajas de componente ---------- */

/** La etiqueta técnica se omite si su grupo ya la nombra (p. ej. "Next.js 16"). */
export function visibleTag(diagram: ArchifyArchitecture, component: ArchifyComponent) {
  if (!component.tag) return null;
  const wrapper = diagram.boundaries?.find((boundary) => boundary.wraps.includes(component.id));
  return wrapper?.label.toLowerCase().includes(component.tag.toLowerCase()) ? null : component.tag;
}

/** Familias CSS con las que se escriben las cajas (las de la marca del caso). */
export type CardFonts = { display: string; body: string; label: string };

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
export const TAG_SIZE = 8;
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
 * corta (sitio y film usan los mismos).
 */
export function cardTextSizes(component: ArchifyComponent, tag: string | null, width: number, fonts: CardFonts) {
  const inner = width - CARD_INSET_X;
  return {
    labelSize: fitSize(component.label, inner - (tag ? tagWidth(tag, fonts) : 0), fonts.display, LABEL_SIZES),
    subSize: component.sublabel ? fitSize(component.sublabel, inner, fonts.body, SUB_SIZES) : SUB_SIZES[0],
  };
}

/* ---------- Color por rol ---------- */

export type ComponentRole = ReturnType<typeof typeRole>;

/**
 * Rojo de peligro (componentes y grupos de seguridad). Es semántico, no de
 * ninguna marca: el mismo en todos los casos, con su versión para el tema claro.
 */
export const DANGER = { dark: "#E5484D", light: "#B4232A" } as const;

/** Color de cada rol con la paleta de una marca. */
export function roleColors(palette: { accent: string; accentSoft: string; muted: string }, danger: string = DANGER.dark): Record<ComponentRole, string> {
  return { danger, accent: palette.accent, accentSoft: palette.accentSoft, muted: palette.muted };
}
