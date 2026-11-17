import { HERO_FRAMES } from "./timing";

/**
 * Montaje del hero «El equipo» (guion en docs/films/HERO-EQUIPO.md).
 *
 * Cada plano parte de un cuadro generado. Si el plano ya tiene su clip
 * animado, se usa el clip; si no, el cuadro quieto con un movimiento lento de
 * cámara. Así el film se puede ver a tamaño real desde el primer día y los
 * clips se suman de a uno, sin tocar el reloj.
 */

/** Encuadre sobre el cuadro: escala (1 = el cuadro cubre la pantalla) y el punto que queda fijo, de 0 a 1. */
export interface Framing {
  scale: number;
  x: number;
  y: number;
}

/**
 * Un clip animado: archivo en film-sources/hero/clips/ y el cuadro (a 24 por
 * segundo) desde el que se usa. Con `pingPong` se usan solo esos cuadros, de
 * ida y de vuelta una vez, y después queda quieto en el primero: sirve cuando
 * el generador se equivoca más adelante y para convertir un gesto en dos.
 */
export interface ShotClip {
  file: string;
  from: number;
  pingPong?: number;
}

export interface MontageShot {
  id: string;
  /** Cuadro de partida, dentro de film-sources/hero/. */
  file: string;
  clip?: ShotClip;
  frames: number;
  from: Framing;
  to: Framing;
}

export type MontageId = "ancho" | "alto";

export const MONTAGE_SIZE: Record<MontageId, { width: number; height: number }> = {
  /** El cuadro completo, 16:9: es lo que entregan los generadores de video, así no se recorta nada. */
  ancho: { width: 1920, height: 1080 },
  /** En teléfono el film abre la pantalla en su propia ventana, y el texto va debajo. */
  alto: { width: 1080, height: 1350 },
};

/** Cuadros del fundido que une el final con el principio, para que el bucle no salte. */
export const LOOP_FADE = 12;

/**
 * Clips animados que ya existen (17/11). Mientras un plano no tiene clip, va
 * su cuadro quieto.
 * - pedido, discuten y resultado: Kling 4 a 1080p. Los tres salieron limpios,
 *   con los cinco robots estables.
 * - mano: Veo 3.1 Lite a 720p. El dedo se levanta y golpea en los primeros 45
 *   cuadros; después el generador inventa un sexto robot. De ida y vuelta son
 *   los dos golpes.
 * - caida: Veo 3.1 Lite a 720p. Toma mira a cámara, parpadea y Cable le toma
 *   la mano.
 */
const CLIPS: Partial<Record<"pedido" | "discuten" | "buscan" | "mano" | "relevo" | "caida" | "resultado", ShotClip>> = {
  pedido: { file: "pedido.mp4", from: 6 },
  discuten: { file: "discuten.mp4", from: 0 },
  mano: { file: "mano.mp4", from: 0, pingPong: 45 },
  caida: { file: "caida.mp4", from: 20 },
  resultado: { file: "resultado.mp4", from: 8 },
};

/** Qué cuadro del clip se ve en un momento del plano. */
export function clipFrame(clip: ShotClip, frame: number, frames: number): number {
  const local = Math.max(0, Math.min(frame, frames - 1));
  if (!clip.pingPong) return clip.from + local;
  const run = clip.pingPong;
  const cycle = Math.min(local, run * 2 - 1);
  return clip.from + (cycle < run ? cycle : run * 2 - 1 - cycle);
}

const still = (scale: number, x: number, y: number): Framing => ({ scale, x, y });

/**
 * Pantalla ancha: el cuadro entero, con los robots del centro a la derecha y
 * el negro libre a la izquierda, donde va el texto. La cámara apenas se
 * acerca, siempre hacia la acción.
 */
const ANCHO: MontageShot[] = [
  { id: "pedido", file: "h1-pedido.jpg", clip: CLIPS.pedido, frames: 72, from: still(1, 0.62, 0.7), to: still(1.04, 0.62, 0.7) },
  { id: "discuten", file: "h2-discuten.jpg", clip: CLIPS.discuten, frames: 120, from: still(1, 0.6, 0.7), to: still(1.05, 0.6, 0.7) },
  { id: "buscan", file: "h3-buscan.jpg", clip: CLIPS.buscan, frames: 96, from: still(1, 0.55, 0.75), to: still(1.04, 0.55, 0.75) },
  { id: "mano", file: "h4-mano.jpg", clip: CLIPS.mano, frames: 96, from: still(1, 0.6, 0.6), to: still(1.04, 0.6, 0.6) },
  { id: "relevo", file: "h5-relevo.jpg", clip: CLIPS.relevo, frames: 40, from: still(1, 0.6, 0.7), to: still(1.03, 0.6, 0.7) },
  { id: "caida", file: "h6-caida.jpg", clip: CLIPS.caida, frames: 44, from: still(1, 0.65, 0.75), to: still(1.03, 0.65, 0.75) },
  { id: "resultado", file: "h7-resultado.jpg", clip: CLIPS.resultado, frames: 60, from: still(1, 0.75, 0.7), to: still(1.05, 0.75, 0.7) },
];

/**
 * Teléfono: dos o tres robots por plano. Los cinco aparecen por cortes; juntos
 * y diminutos no se leen. Casi todos los planos son recortes del cuadro ancho
 * y de su clip, así el teléfono también ve el movimiento. La caída usa su
 * cuadro vertical propio: el recorte del clip, que es de 720p, quedaba blando.
 */
const ALTO: MontageShot[] = [
  { id: "pedido", file: "h1-pedido.jpg", clip: CLIPS.pedido, frames: 72, from: still(1, 0.4, 0.7), to: still(1.03, 0.4, 0.7) },
  { id: "discuten", file: "h2-discuten.jpg", clip: CLIPS.discuten, frames: 72, from: still(1, 0.54, 0.7), to: still(1.04, 0.54, 0.7) },
  { id: "guino", file: "h2-discuten.jpg", clip: CLIPS.discuten && { ...CLIPS.discuten, from: CLIPS.discuten.from + 72 }, frames: 48, from: still(1, 1, 0.6), to: still(1.04, 1, 0.6) },
  { id: "buscan", file: "h3-buscan.jpg", clip: CLIPS.buscan, frames: 96, from: still(1, 0.51, 0.75), to: still(1, 0.57, 0.75) },
  { id: "mano", file: "h4-mano.jpg", clip: CLIPS.mano, frames: 96, from: still(1, 0.69, 0.6), to: still(1.04, 0.69, 0.6) },
  { id: "relevo", file: "h5-relevo.jpg", clip: CLIPS.relevo, frames: 40, from: still(1, 0.75, 0.7), to: still(1.03, 0.75, 0.7) },
  { id: "caida", file: "v2-caida.jpg", frames: 44, from: still(1, 0.5, 0.7), to: still(1.04, 0.5, 0.7) },
  { id: "resultado", file: "h7-resultado.jpg", clip: CLIPS.resultado, frames: 60, from: still(1, 0.87, 0.7), to: still(1.04, 0.87, 0.7) },
];

export const MONTAGE: Record<MontageId, MontageShot[]> = { ancho: ANCHO, alto: ALTO };

/** Cuadro en el que arranca cada plano. */
export function shotStarts(id: MontageId): number[] {
  let from = 0;
  return MONTAGE[id].map((shot) => {
    const start = from;
    from += shot.frames;
    return start;
  });
}

export function montageFrames(id: MontageId): number {
  return MONTAGE[id].reduce((total, shot) => total + shot.frames, 0);
}

/** Los cuadros quietos que necesita el render, sin repetir. */
export function montageFiles(): string[] {
  return [...new Set([...ANCHO, ...ALTO].map((shot) => shot.file))];
}

/** Los clips que necesita el render, con cuántos cuadros se usan de cada uno como máximo. */
export function montageClips(): { file: string; frames: number }[] {
  const needed = new Map<string, number>();
  for (const shot of [...ANCHO, ...ALTO]) {
    if (!shot.clip) continue;
    needed.set(shot.clip.file, Math.max(needed.get(shot.clip.file) ?? 0, shot.clip.from + (shot.clip.pingPong ?? shot.frames)));
  }
  return [...needed].map(([file, frames]) => ({ file, frames }));
}

/** Carpeta de cuadros de un clip dentro de la carpeta pública del render. */
export function clipFolder(file: string): string {
  return `clip-${file.replace(/\.[a-z0-9]+$/i, "")}`;
}

export { HERO_FRAMES };
