'use client';

import { useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
    children: ReactNode;
    /** Segundos por loop completo. */
    speed?: number;
    reverse?: boolean;
    pauseOnHover?: boolean;
    className?: string;
    gap?: string;
}

/**
 * Marquesina infinita (CSS keyframe `marquee` en globals.css). Pausa en hover y,
 * bajo reduced-motion, queda estática (sin animación).
 */
export function Marquee({
    children,
    speed = 28,
    reverse = false,
    pauseOnHover = true,
    className,
    gap = '2rem',
}: MarqueeProps) {
    const reduced = useReducedMotion();

    if (reduced) {
        return (
            <div className={cn('flex overflow-hidden', className)} style={{ gap }}>
                {children}
            </div>
        );
    }

    return (
        <div className={cn('group flex overflow-hidden', className)}>
            <div
                className={cn(
                    'flex shrink-0',
                    pauseOnHover && 'group-hover:[animation-play-state:paused]',
                )}
                style={
                    {
                        gap,
                        animation: `marquee ${speed}s linear infinite`,
                        animationDirection: reverse ? 'reverse' : 'normal',
                    } as CSSProperties
                }
            >
                <div className="flex shrink-0" style={{ gap, marginRight: gap }}>
                    {children}
                </div>
                <div className="flex shrink-0" style={{ gap, marginRight: gap }} aria-hidden>
                    {children}
                </div>
            </div>
        </div>
    );
}
