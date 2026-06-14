'use client';

import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from '@/context/LanguageContext';
import { TrackProvider } from '@/context/TrackContext';
import { DevModeProvider } from '@/components/portfolio-isolated/DevModeContext';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { ActiveTechProvider } from '@/context/ActiveTechContext';

/**
 * Punto único de composición de providers de la app.
 * Orden: LanguageProvider (i18n) → TrackProvider (cruce diseño/software) →
 * DevModeProvider (HUD de telemetría dev-only, lo usan las secciones portfolio-isolated) →
 * SmoothScrollProvider (scroll, envuelve el contenido scrolleable).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        // reducedMotion="user" hace que TODA animación de framer-motion respete
        // prefers-reduced-motion (las CSS ya las neutraliza globals.css). Las de
        // transform/layout se vuelven instantáneas; opacity sigue para no ocultar
        // contenido. Cierra el gap detectado en la auditoría de accesibilidad.
        <MotionConfig reducedMotion="user">
            <LanguageProvider>
                <ActiveTechProvider>
                    <TrackProvider>
                        <DevModeProvider>
                            <SmoothScrollProvider>{children}</SmoothScrollProvider>
                        </DevModeProvider>
                    </TrackProvider>
                </ActiveTechProvider>
            </LanguageProvider>
        </MotionConfig>
    );
}
