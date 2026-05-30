'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clapperboard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RevealHeading } from '@/components/type/RevealHeading';
import { EASE_OUT } from '@/lib/motion';

export function EstudioHero() {
    const { t } = useLanguage();

    return (
        <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-black px-4 pt-24 text-center sm:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(167,139,250,0.16),transparent_42%),radial-gradient(circle_at_78%_62%,rgba(34,211,238,0.10),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:88px_88px] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_100%)]" />

            <div className="container relative z-10 mx-auto flex max-w-5xl flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-violet-200 backdrop-blur-xl"
                >
                    <Clapperboard className="h-3.5 w-3.5" />
                    {t('estudio', 'eyebrow')}
                </motion.span>

                <RevealHeading
                    text={t('estudio', 'title')}
                    as="h1"
                    gradient
                    trigger="mount"
                    stagger={0.12}
                    className="mb-6 max-w-4xl text-balance text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl md:text-8xl"
                />

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
                    className="mb-9 max-w-2xl text-pretty text-sm font-light leading-relaxed text-white/55 sm:text-lg"
                >
                    {t('estudio', 'subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.65, ease: EASE_OUT }}
                >
                    <Link
                        href="/aplicar?track=design"
                        className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-600/25 to-cyan-600/15 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(167,139,250,0.18)] backdrop-blur-2xl transition-all duration-500 hover:border-violet-300/50 sm:text-sm"
                    >
                        {t('estudio', 'cta')}
                        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
