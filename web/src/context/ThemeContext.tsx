'use client';

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'mm-theme';

/** Color de la barra del navegador por tema (meta theme-color). */
const THEME_COLOR: Record<Theme, string> = {
    dark: '#070809',
    light: '#F3F0E8',
};

/* La clase en <html> es la fuente de verdad del tema (la pone el script
   anti-FOUC de layout.tsx antes del primer paint). React se suscribe a ella
   vía useSyncExternalStore: en SSR/hidratación siempre 'dark' (lo que emite
   el server) y en cliente el valor real — sin setState en efectos ni flash. */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function readDocumentTheme(): Theme {
    return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', THEME_COLOR[theme]);
    listeners.forEach((listener) => listener());
}

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    setTheme: () => undefined,
    toggle: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useSyncExternalStore(subscribe, readDocumentTheme, () => 'dark' as Theme);

    const setTheme = useCallback((next: Theme) => {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
            /* modo incógnito estricto: el tema vive solo esta sesión */
        }
        // Crossfade del documento con View Transitions donde exista; el cambio
        // es instantáneo con reduced-motion o sin soporte.
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced && 'startViewTransition' in document) {
            (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => applyTheme(next));
        } else {
            applyTheme(next);
        }
    }, []);

    const toggle = useCallback(() => {
        setTheme(readDocumentTheme() === 'light' ? 'dark' : 'light');
    }, [setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
