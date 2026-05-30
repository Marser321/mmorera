'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Barra de progreso de lectura, fija arriba. Decorativa (aria-hidden). */
export function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

    return (
        <motion.div
            aria-hidden
            style={{ scaleX }}
            className="fixed inset-x-0 top-0 z-[200] h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary"
        />
    );
}
