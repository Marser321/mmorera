'use client';

import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EASE_OUT } from '@/lib/motion';

interface TickerNumberProps {
    value: number;
    /** Relleno con ceros a la izquierda (ej. 2 → "07"). */
    pad?: number;
    duration?: number;
    className?: string;
}

/**
 * Contador que asciende hasta su valor al entrar en viewport, una sola vez.
 * Pensado para números con significado (cantidad de casos), en mono con
 * tabular-nums. Bajo reduced-motion muestra el valor final directo.
 */
export function TickerNumber({ value, pad = 2, duration = 1.2, className }: TickerNumberProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const reduced = useReducedMotion();
    const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
    const count = useMotionValue(0);
    const format = (raw: number) => String(Math.round(raw)).padStart(pad, '0');
    const [display, setDisplay] = useState(format(0));

    useMotionValueEvent(count, 'change', (latest) => setDisplay(format(latest)));

    useEffect(() => {
        if (!inView || reduced) return;
        const controls = animate(count, value, { duration, ease: EASE_OUT });
        return () => controls.stop();
    }, [inView, reduced, count, value, duration]);

    return (
        <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {reduced ? format(value) : display}
        </span>
    );
}
