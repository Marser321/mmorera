import type { Box } from "@/lib/filmLayout";
import { LOGO_RING, LOGO_VIEWBOX } from "@/data/brand/logoPaths";
import { SOCIAL_FORMATS } from "./types";

/**
 * Mosaico del feed: nueve portadas 4:5 que, vistas en la grilla del perfil
 * (3 × 3, cada una recortada a 3:4), arman el monograma de piedra en el
 * centro. Un filo de luz recorre el anillo y cambia de violeta a azul y a
 * verde: cada portada toma el color de su tramo y lo usa como única luz.
 * Puro, sin React: lo usan el layout, el render y los tests.
 *
 * Las celdas se numeran como se leen: 1 arriba a la izquierda, 9 abajo a la
 * derecha. Instagram muestra primero lo último publicado: se publican de la
 * 9 a la 1, y el mosaico se ve entero cuando el total de posts es múltiplo de 3.
 */

const TILE = SOCIAL_FORMATS.feed;
/** Lo que la grilla muestra de cada portada: el centro, en 3:4. */
const CELL_W = 1012;
const GAP = 12;
const W = CELL_W * 3 + GAP * 2;
const H = TILE.height * 3 + GAP * 2;
const LOGO_W = Math.round(W * (1040 / 1088));
const LOGO_H = Math.round((LOGO_W * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width);
const LOGO_X = Math.round((W - LOGO_W) / 2);
const LOGO_Y = Math.round((H - LOGO_H) / 2);
const K = LOGO_W / LOGO_VIEWBOX.width;

export const MOSAICO = {
  width: W,
  height: H,
  cellW: CELL_W,
  gap: GAP,
  /** Margen de cada portada que la grilla recorta a los lados. */
  recorte: (TILE.width - CELL_W) / 2,
  logo: { x: LOGO_X, y: LOGO_Y, w: LOGO_W, h: LOGO_H },
  /** Anillo del monograma, en coordenadas del mosaico. */
  anillo: { cx: LOGO_X + LOGO_RING.cx * K, cy: LOGO_Y + LOGO_RING.cy * K, r: LOGO_RING.outerRadius * K },
  /** Desde dónde arranca la vuelta de color (grados, 0 = arriba, horario). */
  desde: -60,
} as const;

/** Los tres colores del sitio (crear, construir, escalar), en el orden de la vuelta. */
export const VUELTA = ["#B68CFF", "#55D8FF", "#71F3A2", "#B68CFF"] as const;

export const esCelda = (celda: unknown): celda is number => Number.isInteger(celda) && (celda as number) >= 1 && (celda as number) <= 9;

/** Esquina de la portada (1080×1350) dentro del mosaico. */
export function origenDeCelda(celda: number) {
  const col = (celda - 1) % 3;
  const row = Math.floor((celda - 1) / 3);
  return { x: col * (CELL_W + GAP) - MOSAICO.recorte, y: row * (TILE.height + GAP) };
}

const hex = (value: string) => [1, 3, 5].map((index) => parseInt(value.slice(index, index + 2), 16));

/** Color de la vuelta en un ángulo (0 = arriba, horario). */
export function colorDeAngulo(grados: number) {
  const t = ((((grados - MOSAICO.desde) % 360) + 360) % 360) / 360;
  const scaled = t * (VUELTA.length - 1);
  const index = Math.min(VUELTA.length - 2, Math.floor(scaled));
  const a = hex(VUELTA[index]);
  const b = hex(VUELTA[index + 1]);
  const mix = a.map((channel, i) => Math.round(channel + (b[i] - channel) * (scaled - index)));
  return `#${mix.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** La luz de una celda: el color del tramo de anillo que le toca. La del centro no lleva. */
export function luzDeCelda(celda: number): string | undefined {
  if (celda === 5) return undefined;
  const origen = origenDeCelda(celda);
  const dx = origen.x + TILE.width / 2 - MOSAICO.anillo.cx;
  const dy = origen.y + TILE.height / 2 - MOSAICO.anillo.cy;
  return colorDeAngulo((Math.atan2(dx, -dy) * 180) / Math.PI);
}

/**
 * Dónde va el texto de cada portada (coordenadas de la portada), fuera del
 * monograma: arriba en la fila de arriba, abajo en la de abajo, y en los
 * costados libres en la del medio. La del centro no lleva texto.
 */
export function cajaDeCelda(celda: number): { box: Box; ancla: "arriba" | "abajo" } | null {
  if (celda <= 3) return { box: { x: 96, y: 104, w: 888, h: 620 }, ancla: "arriba" };
  if (celda === 4) return { box: { x: 96, y: 104, w: 300, h: 420 }, ancla: "arriba" };
  if (celda === 5) return null;
  if (celda === 6) return { box: { x: 548, y: 780, w: 436, h: 466 }, ancla: "abajo" };
  return { box: { x: 96, y: 680, w: 888, h: 566 }, ancla: "abajo" };
}
