'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
    const { language, toggleLanguage, mounted } = useLanguage();

    if (!mounted) {
        // Evitar mismatch de hidratación mostrando un esqueleto del mismo tamaño
        return (
            <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[101] w-20 h-9 rounded-full bg-black/60 border border-white/10 backdrop-blur-md opacity-50" />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[101]"
        >
            <button
                onClick={toggleLanguage}
                aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
                className="relative flex items-center w-20 h-9 rounded-full bg-black/60 border border-white/10 hover:border-white/20 backdrop-blur-md p-1 cursor-pointer overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors transform-gpu active:scale-95 group"
            >
                {/* Deslizador activo (Pill con glow) */}
                <motion.div
                    className="absolute top-1 bottom-1 w-[34px] rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    animate={{
                        x: language === 'es' ? 0 : 36,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                    }}
                />

                {/* Opción ES */}
                <span
                    className={`relative z-10 w-1/2 text-center font-mono text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                        language === 'es'
                            ? 'text-emerald-300'
                            : 'text-white/40 group-hover:text-white/70'
                    }`}
                >
                    ES
                </span>

                {/* Opción EN */}
                <span
                    className={`relative z-10 w-1/2 text-center font-mono text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                        language === 'en'
                            ? 'text-emerald-300'
                            : 'text-white/40 group-hover:text-white/70'
                    }`}
                >
                    EN
                </span>
            </button>
        </motion.div>
    );
}
