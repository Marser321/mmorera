'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useTheme } from '@/context/ThemeContext';

/**
 * Fondo de video reutilizable, pensado para presencia "cinematográfica" sin
 * sacrificar legibilidad. Encapsula el patrón que antes se copiaba a mano en
 * cada sección y suma:
 *  - mix-blend-screen sobre fondo oscuro: solo brillan las luces del video,
 *    los negros desaparecen → se puede subir la presencia sin "lavar" el texto.
 *    En Master Print (claro) el video aporta tintas, no luces: mix-blend-multiply
 *    + ~30% menos opacidad (ver LIGHT_MODE_DESIGN.md).
 *  - scrim direccional + tint tonal por encima para garantizar contraste.
 *  - poster como fallback inmediato (sin frame negro al cargar).
 *  - IntersectionObserver: el video se monta y reproduce solo dentro del
 *    viewport y se pausa al salir (evita varios videos corriendo a la vez).
 *  - prefers-reduced-motion: muestra solo el poster, sin reproducir.
 */

type Intensity = 'subtle' | 'medium' | 'cinematic';
type Scrim = 'bottom' | 'top' | 'left' | 'right' | 'radial' | 'center' | 'none';
type Tint = 'violet' | 'cyan' | 'signal' | 'none';

interface BackgroundVideoProps {
    /** Ruta al .mp4 en /public, ej: '/videos/growth-machine.mp4' */
    src: string;
    /** Ruta opcional al .webm (se ofrece primero si está disponible) */
    srcWebm?: string;
    /** Poster/fallback estático, ej: '/videos/posters/growth-machine.jpg' */
    poster?: string;
    /** Presencia del video. Default 'cinematic'. */
    intensity?: Intensity;
    /** Capa de contraste para proteger el texto según dónde cae. Default 'center'. */
    scrim?: Scrim;
    /** Tinte tonal coherente con el track de la sección. Default 'none'. */
    tint?: Tint;
    /** object-position del video/poster, ej: 'center 30%'. */
    objectPosition?: string;
    /** Clases extra para el contenedor. */
    className?: string;
}

const OPACITY: Record<Intensity, number> = {
    subtle: 0.12,
    medium: 0.24,
    cinematic: 0.42,
};

// Atenuación negra uniforme por encima del video: da un "piso" de contraste
// parejo para que el texto sea legible aunque el video tenga zonas brillantes.
const BASE_DIM: Record<Intensity, number> = {
    subtle: 0.1,
    medium: 0.26,
    cinematic: 0.38,
};

// Neones legibles solo sobre oscuro. Gemelo "print": mismo carácter tonal
// (violeta/cian/verde), densidad de tinta para leerse sobre marfil.
const TINT_RGB: Record<Exclude<Tint, 'none'>, string> = {
    violet: '167, 139, 250',
    cyan: '34, 211, 238',
    signal: '52, 211, 153',
};

const TINT_RGB_LIGHT: Record<Exclude<Tint, 'none'>, string> = {
    violet: '109, 67, 204', // track-create print (#6D43CC)
    cyan: '10, 126, 164', // track-build / accent print (#0A7EA4)
    signal: '14, 122, 70', // track-scale / signal print (#0E7A46)
};

// Todas las paradas usan var(--color-background) en vez de negro crudo: en
// dark resuelve a #070809 (mismo resultado visual que antes); en light
// resuelve a #F3F0E8 (marfil) → el "velo" se vuelve papel, no tinta negra.
function scrimBackground(scrim: Scrim): string | undefined {
    const bg = (alpha: number) => `color-mix(in srgb, var(--color-background) ${alpha * 100}%, transparent)`;
    switch (scrim) {
        case 'bottom':
            return `linear-gradient(to top, ${bg(0.92)} 0%, ${bg(0.55)} 38%, ${bg(0.12)} 100%)`;
        case 'top':
            return `linear-gradient(to bottom, ${bg(0.92)} 0%, ${bg(0.55)} 38%, ${bg(0.12)} 100%)`;
        case 'left':
            return `linear-gradient(to right, ${bg(0.92)} 0%, ${bg(0.5)} 42%, ${bg(0.08)} 100%)`;
        case 'right':
            return `linear-gradient(to left, ${bg(0.92)} 0%, ${bg(0.5)} 42%, ${bg(0.08)} 100%)`;
        case 'center':
            // Oscurece/aclara el centro para títulos centrados; deja respirar los bordes.
            return `radial-gradient(ellipse 65% 60% at 50% 50%, ${bg(0.82)} 0%, ${bg(0.5)} 48%, ${bg(0.18)} 100%)`;
        case 'radial':
            // Viñeta: deja ver el video al centro y vela los bordes.
            return `radial-gradient(ellipse 78% 72% at 50% 50%, transparent 0%, ${bg(0.5)} 76%, ${bg(0.9)} 100%)`;
        case 'none':
        default:
            return undefined;
    }
}

export function BackgroundVideo({
    src,
    srcWebm,
    poster,
    intensity = 'cinematic',
    scrim = 'center',
    tint = 'none',
    objectPosition = 'center',
    className = '',
}: BackgroundVideoProps) {
    const prefersReduced = useReducedMotion();
    const isMobile = useIsMobile();
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasEntered, setHasEntered] = useState(false);
    const [inView, setInView] = useState(false);

    // Observa el viewport: monta el video al acercarse y controla play/pause.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
                if (entry.isIntersecting) setHasEntered(true);
            },
            { rootMargin: '200px 0px', threshold: 0.01 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Reproduce solo dentro del viewport; pausa al salir.
    useEffect(() => {
        const video = videoRef.current;
        if (!video || prefersReduced) return;
        if (inView) {
            video.play().catch(() => {
                /* autoplay puede ser rechazado; el poster cubre el hueco */
            });
        } else {
            video.pause();
        }
    }, [inView, hasEntered, prefersReduced]);

    const baseOpacity = isMobile ? Math.min(OPACITY[intensity], 0.16) : OPACITY[intensity];
    // Master Print: el video aporta tinta, no luz — ~30% menos presencia que en dark.
    const opacity = theme === 'light' ? baseOpacity * 0.7 : baseOpacity;
    const scrimBg = scrimBackground(scrim);
    const showVideo = hasEntered && !prefersReduced && !isMobile;
    const baseDim = isMobile ? Math.max(BASE_DIM[intensity], 0.42) : BASE_DIM[intensity];
    const tintRgb = theme === 'light' ? TINT_RGB_LIGHT : TINT_RGB;

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
        >
            {/* Capa de media (poster + video) con la presencia y el blend.
                Dark: screen (solo aporta luces). Light: multiply (solo aporta tintas). */}
            <div className="absolute inset-0 mix-blend-screen light:mix-blend-multiply" style={{ opacity }}>
                {poster && (
                    <Image
                        src={poster}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover"
                        style={{ objectPosition }}
                    />
                )}
                {showVideo && (
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster={poster}
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ objectPosition }}
                    >
                        {srcWebm && <source src={srcWebm} type="video/webm" />}
                        <source src={src} type="video/mp4" />
                    </video>
                )}
            </div>

            {/* Piso de contraste uniforme: dark oscurece hacia negro, light vela hacia papel */}
            <div className="absolute inset-0 bg-background" style={{ opacity: baseDim }} />

            {/* Tinte tonal coherente con el track de la sección */}
            {tint !== 'none' && (
                <div
                    className="absolute inset-0 mix-blend-soft-light"
                    style={{
                        background: `radial-gradient(ellipse 90% 80% at 50% 45%, rgba(${tintRgb[tint]}, 0.22), transparent 70%)`,
                    }}
                />
            )}

            {/* Scrim de contraste (oscurece de verdad para proteger el texto) */}
            {scrimBg && <div className="absolute inset-0" style={{ background: scrimBg }} />}
        </div>
    );
}
