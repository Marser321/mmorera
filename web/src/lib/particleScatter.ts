/**
 * Progreso de dispersión del logo de partículas (0 = formado, 1 = disperso).
 * Lo escribe la sección que manda (el hero del Home, según su scroll) y lo lee
 * el shader en cada frame. Es un store mutable a propósito: pasar el scroll por
 * contexto de React re-renderizaría todo el árbol en cada evento.
 */
let scatter = 0;
const listeners = new Set<(value: number) => void>();

export const particleScatter = {
  get: () => scatter,
  set: (value: number) => {
    const next = Math.min(1, Math.max(0, value));
    if (next === scatter) return;
    scatter = next;
    listeners.forEach((listener) => listener(next));
  },
  /** Para reaccionar a umbrales (p. ej. pausar el canvas), no frame a frame. */
  subscribe: (listener: (value: number) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
