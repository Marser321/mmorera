'use client';

import { useScroll, useReducedMotion } from 'framer-motion';
import type { RefObject } from 'react';

/**
 * Lee el progreso de scroll de un elemento (0→1) integrado con Lenis.
 * Devuelve también prefersReduced para que el consumidor aplane sus transforms.
 */
export function useScrollScene(
    ref: RefObject<HTMLElement | null>,
    // offset de Framer: por defecto entra por abajo, sale por arriba
    offset: ['start end', 'end start'] | [string, string] = ['start end', 'end start'],
) {
    const { scrollYProgress } = useScroll({
        target: ref as RefObject<HTMLElement>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        offset: offset as any,
    });
    const prefersReduced = useReducedMotion();
    return { progress: scrollYProgress, prefersReduced };
}
