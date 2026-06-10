'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
    const [language, setLanguageState] = useState<Language>('es');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang === 'es' || savedLang === 'en') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLanguageState(savedLang);
        } else {
            // Detectar idioma del navegador
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'en') {
                setLanguageState('en');
            }
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
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
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, mounted }}>
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
