'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { SpiralTechHeroScene } from './hero-section';
import { RevealHeading } from '@/components/type/RevealHeading';
import { EASE_OUT } from '@/lib/motion';

/**
 * El "mostrame todo" para indecisos: reusa la espiral del hero original como
 * centro visual y la reenmarca con tipografía kinética — "todo como un sistema".
 */
export function OrchestratorManifesto() {
    const { t } = useLanguage();

    return (
        <section id="orquestador" className="relative min-h-[100svh] overflow-hidden bg-black">
            <SpiralTechHeroScene />

            <div className="container relative z-20 mx-auto flex flex-col items-center px-4 pt-24 text-center sm:pt-28 md:px-6">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300/80 backdrop-blur-xl"
                >
                    {t('fork', 'manifesto_eyebrow')}
                </motion.span>

                <RevealHeading
                    text={t('fork', 'manifesto_title')}
                    as="h2"
                    className="mx-auto max-w-3xl text-balance text-3xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl"
                />

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
                    className="mx-auto mt-5 max-w-xl text-pretty text-sm font-light leading-relaxed text-white/55 sm:text-lg"
                >
                    {t('fork', 'manifesto_desc')}
                </motion.p>
            </div>
        </section>
    );
}
