'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { ROUTE_FAMILIES, type Family } from '@/data/techStack';

/**
 * Orquesta qué familias de tecnología están "activas" (resaltadas) en el
 * campo de partículas global. El default sale de la ruta (ROUTE_FAMILIES) y
 * las secciones pueden tomar el control vía `useHighlightFamilies` cuando
 * entran al centro del viewport (scroll-aware). Set vacío = todas parejas.
 */

interface ActiveTechValue {
    activeFamilies: Family[];
    setActiveFamilies: (families: Family[]) => void;
    heroVisible: boolean;
    setHeroVisible: (visible: boolean) => void;
    activeTechName: string | null;
    setActiveTechName: (name: string | null) => void;
}

const ActiveTechContext = createContext<ActiveTechValue | null>(null);

export function ActiveTechProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [override, setOverride] = useState<{ pathname: string; families: Family[] } | null>(null);
    const [visibility, setVisibility] = useState<{ pathname: string; visible: boolean } | null>(null);
    const [activeTech, setActiveTech] = useState<{ pathname: string; name: string | null } | null>(null);

    const activeFamilies = useMemo<Family[]>(
        () => override?.pathname === pathname ? override.families : ROUTE_FAMILIES[pathname] ?? [],
        [override, pathname],
    );

    const setActiveFamilies = useCallback((families: Family[]) => {
        setOverride({ pathname, families });
    }, [pathname]);

    const heroVisible = visibility?.pathname === pathname ? visibility.visible : true;
    const setHeroVisible = useCallback((visible: boolean) => {
        setVisibility({ pathname, visible });
    }, [pathname]);
    const activeTechName = activeTech?.pathname === pathname ? activeTech.name : null;
    const setActiveTechName = useCallback((name: string | null) => {
        setActiveTech({ pathname, name });
    }, [pathname]);

    const value = useMemo(
        () => ({ activeFamilies, setActiveFamilies, heroVisible, setHeroVisible, activeTechName, setActiveTechName }),
        [activeFamilies, setActiveFamilies, heroVisible, setHeroVisible, activeTechName, setActiveTechName],
    );

    return <ActiveTechContext.Provider value={value}>{children}</ActiveTechContext.Provider>;
}

export function useActiveTech(): ActiveTechValue {
    const ctx = useContext(ActiveTechContext);
    // Fallback no-op para que el campo funcione aunque falte el provider.
    return ctx ?? {
        activeFamilies: [],
        setActiveFamilies: () => {},
        heroVisible: true,
        setHeroVisible: () => {},
        activeTechName: null,
        setActiveTechName: () => {},
    };
}

/**
 * Adjuntá el ref devuelto al elemento raíz de una sección: cuando esa sección
 * cruza el centro del viewport, sus familias pasan a estar activas.
 */
export function useHighlightFamilies<T extends HTMLElement = HTMLElement>(families: Family[]) {
    const { setActiveFamilies } = useActiveTech();
    const ref = useRef<T | null>(null);
    const key = families.join(',');

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const target = (key ? key.split(',') : []) as Family[];
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setActiveFamilies(target);
            },
            // Banda central del viewport: la sección "en foco" gana.
            { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [key, setActiveFamilies]);

    return ref;
}
