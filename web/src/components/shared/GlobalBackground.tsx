'use client';

import { useEffect, useState } from 'react';
import { TechParticleField } from './TechParticleField';

/**
 * Fondo global de "La Consola": grid de circuito técnico + glows ambientales de
 * señal + el campo generativo reactivo. Es una sola capa compartida (z-[-1])
 * detrás de todo el sitio. Reemplaza los iconos flotantes decorativos por una
 * textura coherente.
 */
export function GlobalBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
            {/* Grid de circuito técnico */}
            <div className="absolute inset-0 opacity-[0.12]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="circuit-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 0 50 L 50 50 M 50 0 L 50 50 M 50 50 L 100 50 M 50 50 L 50 100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-white" />
                            <circle cx="50" cy="50" r="1.5" fill="currentColor" fillOpacity="0.4" className="text-white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit-bg)" />
                </svg>
            </div>

            {/* Glows ambientales (señal) */}
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-accent/5 blur-[120px] rounded-full mix-blend-screen" />

            {/* Campo de partículas = stack tecnológico (WebGL, fallback 2D) */}
            <TechParticleField />
        </div>
    );
}
