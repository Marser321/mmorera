'use client';

import { motion } from 'framer-motion';
import { LOGO_PATHS } from '@/data/brand/logoPaths';

export function LogoMM({ className = "w-10 h-10", animated = true }: { className?: string, animated?: boolean }) {
    return (
        <motion.svg
            viewBox="0 0 2239.69 1885.03"
            className={className}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Base / Lado derecho del M y el anillo */}
            <motion.path
                d={LOGO_PATHS.ring}
                initial={animated ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* V central / Brazo diagonal */}
            <motion.path
                d={LOGO_PATHS.crown}
                initial={animated ? { opacity: 0, x: 100, y: -100 } : { opacity: 1, x: 0, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
            {/* Pilar izquierdo de la M */}
            <motion.path
                d={LOGO_PATHS.pillar}
                initial={animated ? { opacity: 0, x: -100, y: 100 } : { opacity: 1, x: 0, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            />
        </motion.svg>
    );
}
