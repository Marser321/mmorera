'use client';

import { motion, useScroll, useVelocity, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface VelocityTextProps {
    children: ReactNode;
    className?: string;
    /** Sesgo máximo en grados a velocidad alta de scroll. */
    maxSkew?: number;
}

/** Texto que se inclina (skew) según la velocidad de scroll. Estático bajo reduced-motion. */
export function VelocityText({ children, className, maxSkew = 8 }: VelocityTextProps) {
    const reduced = useReducedMotion();
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);
    const smooth = useSpring(velocity, { stiffness: 200, damping: 50 });
    const skew = useTransform(smooth, [-2000, 0, 2000], [-maxSkew, 0, maxSkew], { clamp: true });

    if (reduced) {
        return <span className={className}>{children}</span>;
    }

    return (
        <motion.span style={{ skewX: skew, display: 'inline-block' }} className={className}>
            {children}
        </motion.span>
    );
}
