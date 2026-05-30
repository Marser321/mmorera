'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ForkDoors } from './ForkDoors';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** Palabra con reveal por máscara (entrada al montar, está sobre el fold). */
function Word({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
    return (
        <span className="inline-block overflow-hidden align-bottom">
            <motion.span
                className={cn('inline-block', className)}
                initial={{ y: '115%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, delay, ease: EASE_OUT }}
            >
                {text}
            </motion.span>
        </span>
    );
}

/**
 * Hero del cruce: la pregunta kinética dominante "¿Necesitás diseño o software?"
 * + las dos puertas. Acción posible sin scroll (todo sobre el fold).
 */
export function HeroFork() {
    const { t } = useLanguage();

    return (
        <section
            className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-4 pb-28 pt-24 sm:px-6"
            aria-labelledby="fork-heading"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_28%,rgba(167,139,250,0.10),transparent_35%),radial-gradient(circle_at_75%_30%,rgba(16,185,129,0.10),transparent_35%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:88px_88px] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_100%)]" />

            <div className="container relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/50 backdrop-blur-xl"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    {t('fork', 'eyebrow')}
                </motion.span>

                <h1
                    id="fork-heading"
                    className="mb-6 max-w-4xl text-balance text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl"
                >
                    <Word text={t('fork', 'q_pre')} delay={0.05} />{' '}
                    <Word
                        text={t('fork', 'q_design')}
                        delay={0.18}
                        className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent"
                    />{' '}
                    <Word text={t('fork', 'q_or')} delay={0.32} />{' '}
                    <Word
                        text={t('fork', 'q_software')}
                        delay={0.45}
                        className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent"
                    />
                    <span>?</span>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
                    className="mb-10 max-w-2xl text-pretty text-sm font-light leading-relaxed text-white/55 sm:text-lg"
                >
                    {t('fork', 'subhead')}
                </motion.p>

                <ForkDoors />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.95 }}
                    className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30"
                >
                    {t('fork', 'scroll_hint')}
                </motion.p>
            </div>
        </section>
    );
}
