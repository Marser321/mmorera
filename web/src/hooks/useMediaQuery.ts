'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/** SSR-safe: arranca en false y resuelve tras montar (evita mismatch). */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        onChange();
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [query]);

    return matches;
}

/** true por debajo de md (768px). Usado para desactivar escenas pin en móvil. */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 767px)');
}

/** SSR-safe y con estado de resolución explícito para evitar trabajo del breakpoint incorrecto. */
export function useResolvedMediaQuery(query: string): boolean | null {
    const subscribe = useCallback((onStoreChange: () => void) => {
        const mediaQuery = window.matchMedia(query);
        mediaQuery.addEventListener('change', onStoreChange);
        return () => mediaQuery.removeEventListener('change', onStoreChange);
    }, [query]);
    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
    const getServerSnapshot = useCallback(() => null, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
