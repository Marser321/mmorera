'use client';

import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';

/**
 * Inicializa Lenis una sola vez en el root (modo root = no agrega wrapper DOM,
 * controla el scroll de window). Un solo loop RAF vía autoRaf (default true).
 *
 * Bajo prefers-reduced-motion no se monta Lenis: se devuelve el scroll nativo.
 * Como en modo root ReactLenis renderiza los children sin envoltorio, alternar
 * entre con/sin Lenis no cambia el DOM → sin hydration mismatch.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const prefersReduced = useReducedMotion();

    if (prefersReduced) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                duration: 1.1,
                lerp: 0.1,
                smoothWheel: true,
                syncTouch: false, // touch nativo en móvil (perf + momentum iOS)
            }}
        >
            {children}
        </ReactLenis>
    );
}
