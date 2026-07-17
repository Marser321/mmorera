'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { SPRING } from '@/lib/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface MagneticProps {
    children: ReactNode;
    /** Desplazamiento máximo en píxeles. */
    strength?: number;
    className?: string;
}

/**
 * Atracción magnética sutil para pills CTA. Solo con puntero fino y sin
 * reduced-motion; el hijo sigue siendo el elemento enfocable e interactivo.
 */
export function Magnetic({ children, strength = 8, className }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const finePointer = useMediaQuery('(pointer: fine)');
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, SPRING.snappy);
    const springY = useSpring(y, SPRING.snappy);

    if (reduced || !finePointer) {
        return <div className={className}>{children}</div>;
    }

    const handleMove = (event: PointerEvent<HTMLDivElement>) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        const offsetX = (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2);
        const offsetY = (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2);
        x.set(Math.max(-1, Math.min(1, offsetX)) * strength);
        y.set(Math.max(-1, Math.min(1, offsetY)) * strength);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ x: springX, y: springY, display: 'inline-block' }}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
        >
            {children}
        </motion.div>
    );
}
