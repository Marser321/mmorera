'use client';

import type { ReactNode } from 'react';
import { useTrack } from '@/context/TrackContext';
import type { TrackId } from '@/data/tracks';

interface TrackedProps {
    only: TrackId;
    children: ReactNode;
    fallback?: ReactNode;
}

/** Renderiza `children` sólo cuando el track activo coincide con `only`. */
export function Tracked({ only, children, fallback = null }: TrackedProps) {
    const { track, mounted } = useTrack();
    if (!mounted) return <>{fallback}</>;
    return track === only ? <>{children}</> : <>{fallback}</>;
}
