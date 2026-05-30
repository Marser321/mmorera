'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { TrackProvider } from '@/context/TrackContext';
import { DevModeProvider } from '@/components/portfolio-isolated/DevModeContext';
import { SmoothScrollProvider } from './SmoothScrollProvider';

/**
 * Punto único de composición de providers de la app.
 * Orden: LanguageProvider (i18n) → TrackProvider (cruce diseño/software) →
 * DevModeProvider (HUD de telemetría dev-only, lo usan las secciones portfolio-isolated) →
 * SmoothScrollProvider (scroll, envuelve el contenido scrolleable).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <TrackProvider>
                <DevModeProvider>
                    <SmoothScrollProvider>{children}</SmoothScrollProvider>
                </DevModeProvider>
            </TrackProvider>
        </LanguageProvider>
    );
}
