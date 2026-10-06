/**
 * Geometría pura de la cámara de los films (sin Remotion, testeable).
 *
 * La captura cubre el visor a escala 1 y la cámara la recorre. Para no ampliar
 * nunca píxeles que no existen, el zoom máximo es la resolución nativa de la
 * captura dividida por el ancho con el que se dibuja a escala 1.
 */

export interface CameraKey {
  at: number;
  /** Zoom dentro de la pantalla (1 = encuadre completo). Se limita a la resolución nativa. */
  scale: number;
  /** Punto de la imagen (0–1) que queda al centro del encuadre. */
  fx: number;
  fy: number;
}

export interface CameraNote {
  /** Clave del rótulo (el texto sale de la copia localizada). */
  key: string;
  from: number;
  to: number;
  /** Rectángulo destacado en coordenadas de la imagen (0–1). */
  rect: [number, number, number, number];
}

export interface CameraShotSpec {
  name: string;
  /** Ruta real que muestra la captura (se escribe en la barra de la ventana). */
  path: string;
  from: number;
  duration: number;
  keys: CameraKey[];
  notes: CameraNote[];
}

/** Tamaño con el que la imagen cubre el visor a escala 1. */
export function coverSize(view: { w: number; h: number }, aspect: number) {
  const w = Math.max(view.w, view.h * aspect);
  return { w, h: w / aspect };
}

/** Zoom máximo sin ampliar la captura más allá de su resolución nativa. */
export function maxCameraScale(nativeWidth: number, view: { w: number; h: number }, aspect: number) {
  return Math.max(1, nativeWidth / coverSize(view, aspect).w);
}

/** Notas con tiempo absoluto de la película, para verificar que nunca conviven dos. */
export function absoluteNotes(shots: CameraShotSpec[]) {
  return shots.flatMap((shot) => shot.notes.map((note) => ({ ...note, shot: shot.name, start: shot.from + note.from, end: shot.from + note.to })));
}
