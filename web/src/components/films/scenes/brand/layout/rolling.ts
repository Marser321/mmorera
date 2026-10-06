/**
 * Entrada de una cifra carácter por carácter (puro, testeable).
 *
 * A diferencia de un conteo, cada carácter es siempre el del valor final: la
 * cifra sube por su máscara, nunca muestra un número intermedio. Si alguien
 * pausa el film en medio de la entrada, lo que ve es el dato verificado (o una
 * parte de él), no "57 specs" camino a 79.
 */

/** Avance (0–1) de cada carácter: el primero arranca antes, el último termina en t = 1. */
export function rollingSteps(count: number, t: number, stagger = 0.35) {
  if (t >= 1) return Array<number>(count).fill(1);
  const n = Math.max(1, count);
  // Cada carácter dura `span`; entre uno y el siguiente hay `stagger × span`.
  const span = 1 / (1 + stagger * (n - 1));
  return Array.from({ length: count }, (_, index) => {
    const start = index * stagger * span;
    return Math.min(1, Math.max(0, (t - start) / span));
  });
}
