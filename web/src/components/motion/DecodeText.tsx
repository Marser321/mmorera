'use client';

import { createElement, useEffect, useRef, useState, type ElementType } from 'react';
import { useReducedMotion } from 'framer-motion';

interface DecodeTextProps {
    text: string;
    as?: ElementType;
    className?: string;
    /** Duración total del decode en ms. */
    duration?: number;
    /** Si es false, el primer render muestra el texto directo y solo decodifica en cambios. */
    decodeOnMount?: boolean;
}

/** Glifos de telemetría: legibles en Space Mono sin volverse ruido visual. */
const GLYPHS = '<>/=+*·:#%&@$0123456789';

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Decodifica el texto al estilo consola: las posiciones se resuelven de
 * izquierda a derecha mientras las pendientes ciclan glifos mono. Se dispara
 * al montar (opcional) y en cada cambio de `text` — pensado para los labels
 * de telemetría que cambian junto al morph del campo de partículas.
 * Con reduced-motion el texto se intercambia directo, sin animación.
 */
export function DecodeText({
    text,
    as: Tag = 'span',
    className,
    duration = 640,
    decodeOnMount = false,
}: DecodeTextProps) {
    const reduced = useReducedMotion();
    const [display, setDisplay] = useState(text);
    const frameRef = useRef<number | null>(null);
    const mountedRef = useRef(false);

    useEffect(() => {
        const skipAnimation = reduced || (!mountedRef.current && !decodeOnMount);
        mountedRef.current = true;
        if (skipAnimation) {
            setDisplay(text);
            return;
        }

        const start = performance.now();
        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const resolved = Math.floor(progress * text.length);
            let next = text.slice(0, resolved);
            for (let index = resolved; index < text.length; index += 1) {
                next += text[index] === ' ' ? ' ' : randomGlyph();
            }
            setDisplay(next);
            if (progress < 1) frameRef.current = window.requestAnimationFrame(tick);
        };
        frameRef.current = window.requestAnimationFrame(tick);
        // rAF no dispara en pestañas ocultas: garantiza el texto final igual.
        const settle = window.setTimeout(() => {
            if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
            setDisplay(text);
        }, duration + 80);
        return () => {
            window.clearTimeout(settle);
            if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
        };
    }, [text, reduced, duration, decodeOnMount]);

    return createElement(Tag, { className, 'aria-label': text }, display);
}
