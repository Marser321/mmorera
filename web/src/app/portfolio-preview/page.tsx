'use client';

import React from 'react';
import { DevModeProvider } from '@/components/portfolio-isolated/DevModeContext';
import { HeroPortfolio } from '@/components/portfolio-isolated/HeroPortfolio';
import { AboutTimeline } from '@/components/portfolio-isolated/AboutTimeline';
import { SistemasBlueprint } from '@/components/portfolio-isolated/SistemasBlueprint';
import { PortfolioGrid } from '@/components/portfolio-isolated/PortfolioGrid';
import { AplicarOS } from '@/components/portfolio-isolated/AplicarOS';

/**
 * Página de Previsualización Aislada para el Portafolio Interactivo de Mario Morera.
 * 
 * Esta ruta permite verificar el flujo completo de animaciones cinéticas,
 * el Dev Mode con métricas reales, la línea de tiempo multitrack y la grilla
 * dual (Media Pool / Repo) de forma segura en desarrollo.
 */
export default function PortfolioPreviewPage() {
    return (
        <DevModeProvider>
            <main id="contenido-principal" className="min-h-screen bg-black">
                {/* 1. Portada con Timecode y Grafo de Nodos */}
                <HeroPortfolio />

                {/* 2. Trayectoria como Línea de Tiempo Multi-pista */}
                <AboutTimeline />

                {/* 3. Blueprint Operativo interactivo con logs de red */}
                <SistemasBlueprint />

                {/* 4. Portafolio Grid (Media Pool vs VS Code explorer) */}
                <PortfolioGrid />

                {/* 5. Formulario de Aplicación con JSON debugger y Renderizador */}
                <AplicarOS />
            </main>
        </DevModeProvider>
    );
}
