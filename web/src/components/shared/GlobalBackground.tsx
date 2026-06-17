'use client';

import { FAMILIES, type Family } from '@/data/techStack';
import { useActiveTech } from '@/context/ActiveTechContext';
import { TechParticleField } from './TechParticleField';

/**
 * Fondo global de "La Consola": grid de circuito técnico + glows ambientales de
 * señal + el campo generativo reactivo. Es una sola capa compartida (z-[-1])
 * detrás de todo el sitio. Reemplaza los iconos flotantes decorativos por una
 * textura coherente.
 */
export function GlobalBackground() {
    const { activeFamilies } = useActiveTech();
    const glowFamilies: Family[] = activeFamilies.length ? activeFamilies : ['Web', 'Automation'];
    const primaryGlow = FAMILIES.find((family) => family.id === glowFamilies[0])?.color ?? '#93e83a';
    const secondaryGlow = FAMILIES.find((family) => family.id === glowFamilies[1])?.color ?? '#2ec8d8';
    const tertiaryGlow = FAMILIES.find((family) => family.id === glowFamilies[2])?.color ?? primaryGlow;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
            {/* Grid de circuito técnico */}
            <div className="absolute inset-0 opacity-[0.1] md:opacity-[0.08]">
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

            {/* Glows ambientales que acompañan la familia activa */}
            <div
                className="absolute left-[8%] top-[12%] h-[72vw] max-h-[620px] w-[72vw] max-w-[620px] rounded-full opacity-[0.04] blur-[110px] mix-blend-screen transition-colors duration-[1200ms] md:h-[42vw] md:w-[42vw] md:opacity-[0.055] md:blur-[140px]"
                style={{ backgroundColor: primaryGlow }}
            />
            <div
                className="absolute bottom-[8%] right-[8%] h-[76vw] max-h-[660px] w-[76vw] max-w-[660px] rounded-full opacity-[0.035] blur-[120px] mix-blend-screen transition-colors duration-[1200ms] md:h-[44vw] md:w-[44vw] md:opacity-[0.05] md:blur-[150px]"
                style={{ backgroundColor: secondaryGlow }}
            />
            <div
                className="absolute right-[36%] top-[42%] h-[24vw] max-h-[360px] w-[24vw] max-w-[360px] rounded-full opacity-[0.035] blur-[120px] mix-blend-screen transition-colors duration-[1200ms]"
                style={{ backgroundColor: tertiaryGlow }}
            />

            {/* Campo de partículas = stack tecnológico (WebGL, fallback 2D) */}
            <div className="absolute inset-0 hidden opacity-80 md:block">
                <TechParticleField />
            </div>

            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,9,0.18)_52%,rgba(7,8,9,0.42)_100%)]"
            />
        </div>
    );
}
