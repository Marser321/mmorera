'use client';

import { useEffect, useState } from 'react';

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
