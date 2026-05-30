'use client';

import { useScroll, type MotionValue } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

interface SceneRender {
    progress: MotionValue<number>;
}

interface SceneProps {
    children: ReactNode | ((p: SceneRender) => ReactNode);
    /** Múltiplo del alto de viewport para el track de scroll (2 = pin por ~1 pantalla extra). */
    length?: number;
    pin?: boolean;
    className?: string;
    innerClassName?: string;
}

/**
 * Escena "pinned": un track alto + un viewport sticky que expone el progreso.
 * En móvil (o pin=false) cae a layout apilado normal para evitar jank/100vh iOS.
 *
 * El render-prop se invoca durante el render de Scene. Si necesitás hooks
 * (useTransform) basados en `progress`, hacelo en un sub-componente que reciba
 * `progress` como prop — no dentro del render-prop directamente.
 */
export function Scene({ children, length = 2, pin = true, className, innerClassName }: SceneProps) {
    const ref = useRef<HTMLElement>(null);
    const isMobile = useIsMobile();
    const pinned = pin && !isMobile;

    const { scrollYProgress } = useScroll({
        target: ref as React.RefObject<HTMLElement>,
        offset: pinned ? ['start start', 'end end'] : ['start end', 'end start'],
    });

    const content = typeof children === 'function' ? children({ progress: scrollYProgress }) : children;

    if (!pinned) {
        return (
            <section ref={ref} className={className}>
                <div className={innerClassName}>{content}</div>
            </section>
        );
    }

    return (
        <section ref={ref} className={cn('relative', className)} style={{ height: `${length * 100}vh` }}>
            <div className={cn('sticky top-0 flex h-[100svh] flex-col overflow-hidden', innerClassName)}>
                {content}
            </div>
        </section>
    );
}
