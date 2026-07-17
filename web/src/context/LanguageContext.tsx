'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { translations } from '@/data/translations';

export type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    t: (section: string, key: string) => string;
    mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const language: Language = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (lang: Language) => {
        if (lang === language) return;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        const pathWithoutLocale = language === 'en'
            ? pathname.replace(/^\/en(?=\/|$)/, '') || '/'
            : pathname;
        const nextPath = lang === 'en'
            ? pathWithoutLocale === '/' ? '/en' : `/en${pathWithoutLocale}`
            : pathWithoutLocale;
        router.push(`${nextPath}${window.location.search}${window.location.hash}`);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'es' ? 'en' : 'es');
    };

    // Función de traducción
    const t = (section: string, key: string): string => {
        const sec = translations[section as keyof typeof translations] as Record<string, Record<Language, string> & { es?: string; en?: string }> | undefined;
        if (!sec) return key;
        
        const item = sec[key];
        if (!item) return key;

        // Respetar valores intencionalmente vacíos ('') como traducción válida:
        // un '' no debe caer al fallback de la key (que el CSS uppercase mostraba
        // como "TITLE3"). Sólo caemos al fallback si el valor es undefined.
        if (typeof item[language] === 'string') return item[language];
        if (typeof item['es'] === 'string') return item['es'];
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, mounted: true }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
