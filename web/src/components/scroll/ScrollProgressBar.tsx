'use client';

import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

/**
 * Transporte / playhead de "La Consola": el scroll es el cabezal que scrubbea
 * la pista del sitio. Toda la página se trata como un "reel" de 1 minuto, y el
 * timecode avanza 00:00 → 01:00 a medida que bajás. Decorativa (aria-hidden).
 * Los pulsos son CSS, así que reduced-motion los neutraliza vía globals.css.
 *
 * La franja exterior de la pista es h-4 con overflow-hidden: contiene el spill
 * horizontal del cabezal en los extremos (evita scrollbar) sin recortar la pista.
 */
const REEL_SECONDS = 60;

function formatTimecode(seconds: number) {
    const clamped = Math.min(Math.max(seconds, 0), REEL_SECONDS);
    const mm = Math.floor(clamped / 60).toString().padStart(2, '0');
    const ss = Math.floor(clamped % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
}

export function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
    const width = useTransform(progress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);
    const [tc, setTc] = useState('00:00');

    useMotionValueEvent(progress, 'change', (v) => {
        setTc(formatTimecode(Math.min(Math.max(v, 0), 1) * REEL_SECONDS));
    });

    return (
        <div aria-hidden className="fixed inset-x-0 top-0 z-[200] pointer-events-none">
            {/* Pista del scrubber */}
            <div className="relative h-4 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-white/[0.08]" />
                <motion.div
                    style={{ width }}
                    className="absolute left-0 top-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary"
                >
                    {/* Cabezal / playhead: anillo "live" + punto sólido con glow */}
                    <span className="absolute right-0 top-[1.5px] block h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/40 animate-ping" />
                    <span className="absolute right-0 top-[1.5px] block h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary shadow-[0_0_14px_3px] shadow-primary/70" />
                </motion.div>
            </div>

            {/* Timecode del transporte — scrubbea con el scroll (oculto en xs) */}
            <div className="absolute left-1/2 top-[10px] hidden -translate-x-1/2 items-center gap-1.5 font-mono text-[10px] tracking-widest sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold tabular-nums text-foreground/85">{tc}</span>
                <span className="text-foreground/35">/ 01:00</span>
            </div>
        </div>
    );
}
