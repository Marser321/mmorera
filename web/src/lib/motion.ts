import type { Variants } from "framer-motion";

/**
 * Fuente única de easings, duraciones y springs para todo el sitio.
 * Mantiene consistencia entre las secciones y los sistemas de scroll/tipografía.
 */

// Curva "ease-out" premium ya usada en hero-section.tsx
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
    fast: 0.4,
    base: 0.6,
    slow: 0.9,
} as const;

// Default para whileInView en todo el sitio (dispara una vez, un poco antes de entrar)
export const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

export const SPRING = {
    soft: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.6 },
    snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
    slow: { type: "spring" as const, stiffness: 45, damping: 18 },
};

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.base, ease: EASE_OUT },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

/** Contenedor que escalona la entrada de sus hijos. */
export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
});

/* ──────────────────────────────────────────────────────────────────────────
 * Capa "La Consola" — presets de scrollytelling y transiciones de ruta.
 * Compartidos por el sistema de escenas (Fase 2+). Todo respeta
 * prefers-reduced-motion porque globals.css neutraliza animación/transición.
 * ────────────────────────────────────────────────────────────────────────── */

// Transición de ruta — "corte" cinematográfico entre tracks/escenas.
export const routeTransition: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: DURATION.base, ease: EASE_OUT },
    },
    exit: {
        opacity: 0,
        y: -8,
        filter: "blur(8px)",
        transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
    },
};

// Reveal por máscara (clip) — para títulos en display (Unbounded).
export const clipReveal: Variants = {
    hidden: { clipPath: "inset(0 0 110% 0)", y: "0.15em" },
    visible: {
        clipPath: "inset(0 0 -2% 0)",
        y: 0,
        transition: { duration: DURATION.slow, ease: EASE_OUT },
    },
};

// Offsets estándar para useScroll (escena que entra y sale del viewport / pin).
export const SCENE_OFFSET = ["start end", "end start"] as const;
export const PIN_OFFSET = ["start start", "end end"] as const;
