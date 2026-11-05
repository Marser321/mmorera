export interface RateLimiterOptions {
  /** Cuántos envíos se aceptan dentro de la ventana. */
  limit: number;
  windowMs: number;
  /** Tope de claves en memoria: al pasarlo se olvida la menos reciente. */
  maxKeys?: number;
  now?: () => number;
}

/**
 * Límite de envíos por ventana de tiempo, en la memoria del proceso. En Vercel
 * cada instancia lleva su propia cuenta y la pierde al reiniciarse: frena las
 * ráfagas desde un mismo origen, no un ataque distribuido. Para eso está el
 * firewall de Vercel.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 5000, now = Date.now }: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  return {
    allow(key: string): boolean {
      const time = now();
      const recent = (hits.get(key) ?? []).filter((at) => time - at < windowMs);
      const allowed = recent.length < limit;
      if (allowed) recent.push(time);
      // Borrar y volver a poner deja la clave al final: Map recuerda el orden.
      hits.delete(key);
      hits.set(key, recent);
      if (hits.size > maxKeys) hits.delete(hits.keys().next().value as string);
      return allowed;
    },
    get size() {
      return hits.size;
    },
  };
}
