import { Easing, interpolate, useVideoConfig } from "remotion";

/**
 * Tokens de los films. Todo sale de las variables CSS del sitio: el Player
 * renderiza dentro del DOM de la página, así que el modo claro "Master Print"
 * se aplica solo. Nada de clases `transition-*`/`animate-*` dentro de una
 * composición: el movimiento se deriva del frame para poder hacer scrub.
 */

export const FILM_COLORS = {
  fg: "var(--color-foreground)",
  bg: "var(--color-background)",
  card: "var(--color-card)",
  signal: "var(--color-signal)",
  accent: "var(--color-accent)",
  create: "var(--color-track-create)",
  danger: "var(--color-destructive)",
} as const;

/** Tinta del tema con alpha: marfil en dark, grafito en light. */
export const ink = (alpha: number) => `rgb(var(--ink-rgb) / ${alpha})`;

/** Mezcla un token con transparencia (sirve para glows y velos de color). */
export const tint = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`;

export const FILM_FONTS = {
  /** Títulos: la tipografía de la marca del cliente si la hay, si no la del sitio. */
  display: "var(--ff-film-display, var(--ff-body)), system-ui, sans-serif",
  body: "var(--ff-body), system-ui, sans-serif",
  mono: "var(--ff-mono), ui-monospace, monospace",
} as const;

/** El mismo EASE_OUT de lib/motion.ts, en versión Remotion. */
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 entre dos frames, con el ease de la casa. */
export function progress(frame: number, from: number, to: number, easing = EASE_OUT) {
  return interpolate(frame, [from, to], [0, 1], { ...CLAMP, easing });
}

/** Ventana de visibilidad: entra, se sostiene y sale. */
export function windowed(frame: number, inFrom: number, inTo: number, outFrom: number, outTo: number) {
  return interpolate(frame, [inFrom, inTo, outFrom, outTo], [0, 1, 1, 0], { ...CLAMP, easing: EASE_OUT });
}

/** Formato de la composición actual: retrato (móvil 4:5) o apaisado (16:9). */
export function useFilmLayout() {
  const { width, height, fps } = useVideoConfig();
  const portrait = height > width;
  return { width, height, fps, portrait, unit: portrait ? width / 1080 : width / 1600 };
}
