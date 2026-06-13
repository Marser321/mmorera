'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { type TrackId, isTrackId } from '@/data/tracks';

interface TrackContextType {
    track: TrackId | null;
    setTrack: (t: TrackId) => void;
    resetTrack: () => void;
    hasChosen: boolean;
    mounted: boolean;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);
const STORAGE_KEY = 'mm_track';

/**
 * Recuerda la elección del cruce (diseño/software) entre páginas.
 * Mismo patrón SSR-safe que LanguageContext: arranca en null en server y en el
 * primer render de cliente; el valor real se aplica en useEffect tras montar.
 */
export function TrackProvider({ children }: { children: React.ReactNode }) {
    const [track, setTrackState] = useState<TrackId | null>(null);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isTrackId(saved)) setTrackState(saved);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (pathname?.startsWith('/estudio')) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTrackState('design');
            localStorage.setItem(STORAGE_KEY, 'design');
        } else if (pathname?.startsWith('/sistemas')) {
            setTrackState('software');
            localStorage.setItem(STORAGE_KEY, 'software');
        }
    }, [pathname, mounted]);

    const setTrack = (t: TrackId) => {
        setTrackState(t);
        localStorage.setItem(STORAGE_KEY, t);
    };

    const resetTrack = () => {
        setTrackState(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <TrackContext.Provider
            value={{ track, setTrack, resetTrack, hasChosen: track !== null, mounted }}
        >
            {children}
        </TrackContext.Provider>
    );
}

export function useTrack() {
    const context = useContext(TrackContext);
    if (context === undefined) {
        throw new Error('useTrack must be used within a TrackProvider');
    }
    return context;
}
