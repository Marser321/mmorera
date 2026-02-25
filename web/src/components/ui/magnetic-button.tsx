"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface MagneticButtonProps {
    children: React.ReactNode;
    /** Intensidad del efecto magnético (px de desplazamiento máximo). Default: 8 */
    intensity?: number;
    className?: string;
}

/**
 * MagneticButton — wrapper con efecto de "atracción magnética".
 * El contenido se desplaza sutilmente hacia el cursor al hacer hover,
 * creando una sensación de interacción física premium.
 *
 * @example
 * <MagneticButton>
 *   <Button variant="shimmer" size="lg">CTA</Button>
 * </MagneticButton>
 */
export function MagneticButton({
    children,
    intensity = 8,
    className,
}: MagneticButtonProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    /* Posición raw del desplazamiento */
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    /* Spring suaves para movimiento orgánico */
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    /* Rotación 3D sutil basada en la posición */
    const rotateX = useTransform(ySpring, [-intensity, intensity], [2, -2]);
    const rotateY = useTransform(xSpring, [-intensity, intensity], [-2, 2]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        /* Calcular desplazamiento relativo al centro */
        const deltaX = ((e.clientX - centerX) / (rect.width / 2)) * intensity;
        const deltaY = ((e.clientY - centerY) / (rect.height / 2)) * intensity;

        x.set(deltaX);
        y.set(deltaY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                x: xSpring,
                y: ySpring,
                rotateX,
                rotateY,
                transformPerspective: 800,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
