'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ParallaxProps {
    children: ReactNode;
    /** Píxeles de desplazamiento total a lo largo del recorrido. */
    speed?: number;
    axis?: 'x' | 'y';
    /** En móvil el parallax compite con el campo de partículas: apagado por defecto. */
    disableOnMobile?: boolean;
    className?: string;
}

export function Parallax({ children, speed = 60, axis = 'y', disableOnMobile = true, className }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const isMobile = useIsMobile();
    const disabled = reduced || (disableOnMobile && isMobile);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const move = useTransform(scrollYProgress, [0, 1], disabled ? [0, 0] : [speed, -speed]);

    return (
        <motion.div ref={ref} style={axis === 'y' ? { y: move } : { x: move }} className={className}>
            {children}
        </motion.div>
    );
}
