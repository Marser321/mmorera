'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { VIEWPORT, EASE_OUT, DURATION } from '@/lib/motion';

interface RevealProps {
    children: ReactNode;
    as?: ElementType;
    x?: number;
    y?: number;
    delay?: number;
    duration?: number;
    once?: boolean;
    amount?: number;
    className?: string;
}

/**
 * Primitiva de reveal whileInView. Reemplaza el bloque initial/whileInView/viewport
 * repetido en decenas de secciones. Bajo reduced-motion renderiza el estado final.
 */
export function Reveal({
    children,
    as = 'div',
    x = 0,
    y = 24,
    delay = 0,
    duration = DURATION.base,
    once = true,
    amount,
    className,
}: RevealProps) {
    const reduced = useReducedMotion();

    if (reduced) {
        const Tag = as as ElementType<{ className?: string; children?: ReactNode }>;
        return <Tag className={className}>{children}</Tag>;
    }

    // motion[tag] está cacheado por Framer → referencia estable, sin remount.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionTag = (motion as any)[as as string] ?? motion.div;

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, x, y }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, ...(amount != null ? { amount } : { margin: VIEWPORT.margin }) }}
            transition={{ duration, delay, ease: EASE_OUT }}
        >
            {children}
        </MotionTag>
    );
}
