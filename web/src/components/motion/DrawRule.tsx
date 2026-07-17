'use client';

import { motion, useReducedMotion, type MotionValue } from 'framer-motion';
import { DURATION, EASE_OUT, VIEWPORT } from '@/lib/motion';

interface DrawRuleProps {
    /** Lado desde el que se dibuja la regla. */
    origin?: 'left' | 'right' | 'top' | 'bottom';
    /** MotionValue 0→1 para conectores scrubbed por scroll (reemplaza whileInView). */
    progress?: MotionValue<number>;
    delay?: number;
    className?: string;
}

const AXIS_Y = new Set(['top', 'bottom']);

/**
 * Regla de 1px que se dibuja: la grammar visual del sitio (border-white/10)
 * convertida en momento. Decorativa (aria-hidden); el tamaño y color vienen
 * del className (ej. "block h-px w-full bg-white/10").
 */
export function DrawRule({ origin = 'left', progress, delay = 0, className }: DrawRuleProps) {
    const reduced = useReducedMotion();
    const vertical = AXIS_Y.has(origin);

    if (reduced) {
        return <span aria-hidden className={className} />;
    }

    if (progress) {
        return (
            <motion.span
                aria-hidden
                className={className}
                style={vertical ? { scaleY: progress, transformOrigin: origin, willChange: 'transform' } : { scaleX: progress, transformOrigin: origin, willChange: 'transform' }}
            />
        );
    }

    return (
        <motion.span
            aria-hidden
            className={className}
            style={{ transformOrigin: origin }}
            initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
            whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
            viewport={{ once: true, margin: VIEWPORT.margin }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT, delay }}
        />
    );
}
