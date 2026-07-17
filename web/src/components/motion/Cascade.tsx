'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { slideIn, stagger, STAGGER, VIEWPORT } from '@/lib/motion';

interface CascadeProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

/**
 * Contenedor de entradas escalonadas. Cada CascadeItem declara desde qué lado
 * entra (regla: el lado que ocupa visualmente; full-width sube). Bajo
 * reduced-motion todo se renderiza estático.
 */
export function Cascade({ children, delay = 0, className }: CascadeProps) {
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            variants={stagger(STAGGER.items, delay)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: VIEWPORT.margin }}
        >
            {children}
        </motion.div>
    );
}

interface CascadeItemProps {
    children: ReactNode;
    from?: 'left' | 'right' | 'up';
    className?: string;
}

export function CascadeItem({ children, from = 'up', className }: CascadeItemProps) {
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div className={className} variants={slideIn(from)}>
            {children}
        </motion.div>
    );
}
