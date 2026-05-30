'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface TelemetryMetrics {
    fps: number;
    domNodes: number;
    memoryUsed: string;
}

interface DevModeContextType {
    isDevMode: boolean;
    toggleDevMode: () => void;
    metrics: TelemetryMetrics;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: React.ReactNode }) {
    const [isDevMode, setIsDevMode] = useState<boolean>(false);
    const [metrics, setMetrics] = useState<TelemetryMetrics>({
        fps: 60,
        domNodes: 0,
        memoryUsed: 'N/A',
    });

    const toggleDevMode = () => setIsDevMode(prev => !prev);

    // Cálculos de Telemetría Real en el Navegador
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(0);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isDevMode) {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
            return;
        }

        lastTimeRef.current = performance.now();
        frameCountRef.current = 0;

        const calculatePerformanceMetrics = () => {
            const now = performance.now();
            frameCountRef.current++;

            // Calcular FPS cada 1 segundo
            if (now >= lastTimeRef.current + 1000) {
                const calculatedFps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
                
                // Calcular Nodos DOM
                const calculatedDomNodes = document.getElementsByTagName('*').length;

                // Calcular Memoria (Chrome/Edge API extendida)
                let calculatedMemory = 'N/A';
                // @ts-expect-error: performance.memory is non-standard API in Chrome/Edge
                if (window.performance && window.performance.memory) {
                    // @ts-expect-error: usedJSHeapSize is only available on performance.memory
                    const used = window.performance.memory.usedJSHeapSize;
                    calculatedMemory = `${(used / 1024 / 1024).toFixed(1)} MB`;
                }

                setMetrics({
                    fps: Math.min(calculatedFps, 60), // Capado a 60 para evitar picos raros
                    domNodes: calculatedDomNodes,
                    memoryUsed: calculatedMemory,
                });

                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            requestRef.current = requestAnimationFrame(calculatePerformanceMetrics);
        };

        requestRef.current = requestAnimationFrame(calculatePerformanceMetrics);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isDevMode]);

    return (
        <DevModeContext.Provider value={{ isDevMode, toggleDevMode, metrics }}>
            {children}
        </DevModeContext.Provider>
    );
}

export function useDevMode() {
    const context = useContext(DevModeContext);
    if (!context) {
        throw new Error('useDevMode must be used within a DevModeProvider');
    }
    return context;
}
