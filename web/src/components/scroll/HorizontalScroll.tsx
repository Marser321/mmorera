'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

interface HorizontalScrollProps {
    children: ReactNode;
    className?: string;
    trackClassName?: string;
    /** Alto del track vertical que controla el avance horizontal. */
    heightVh?: number;
}

/**
 * Convierte scroll vertical en desplazamiento horizontal de un track (galería).
 * Mide la distancia real de overflow para terminar siempre alineado.
 * En móvil cae a carrusel nativo snap-x (scroll real, accesible por teclado/touch).
 */
export function HorizontalScroll({
    children,
    className,
    trackClassName,
    heightVh = 300,
}: HorizontalScrollProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [distance, setDistance] = useState(0);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
    const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

    useEffect(() => {
        if (isMobile) return;
        const calc = () => {
            const el = trackRef.current;
            if (el) setDistance(Math.max(0, el.scrollWidth - el.offsetWidth));
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, [isMobile, children]);

    if (isMobile) {
        return (
            <div className={cn('overflow-x-auto snap-x snap-mandatory', className)}>
                <div className={cn('flex', trackClassName)}>{children}</div>
            </div>
        );
    }

    return (
        <section ref={sectionRef} className={cn('relative', className)} style={{ height: `${heightVh}vh` }}>
            <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
                <motion.div ref={trackRef} style={{ x }} className={cn('flex', trackClassName)}>
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
