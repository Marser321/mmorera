'use client';

import { useLanguage } from '@/context/LanguageContext';
import { RevealHeading } from '@/components/type/RevealHeading';
import { Reveal } from '@/components/scroll/Reveal';

/** Línea de tiempo del proceso creativo: de la idea cruda a la pieza final. */
export function ProcessFilm() {
    const { t } = useLanguage();
    const steps = [1, 2, 3, 4].map((n) => ({
        n,
        title: t('estudio', `process_${n}_t`),
        detail: t('estudio', `process_${n}_d`),
    }));

    return (
        <section className="relative overflow-hidden bg-black py-20 sm:py-28">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167,139,250,0.08),transparent_45%)]" />
            <div className="container relative z-10 mx-auto px-4 sm:px-6">
                <Reveal as="p" className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-violet-300/80">
                    {t('estudio', 'process_eyebrow')}
                </Reveal>
                <RevealHeading
                    text={t('estudio', 'process_title')}
                    as="h2"
                    className="mb-14 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
                />

                <div className="relative grid gap-4 md:grid-cols-4">
                    <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-violet-400/0 via-violet-400/30 to-cyan-400/0 md:block" />
                    {steps.map((s, i) => (
                        <Reveal key={s.n} delay={i * 0.12} className="relative">
                            <div className="flex flex-col gap-3">
                                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-violet-400/30 bg-black text-lg font-black text-violet-200">
                                    {String(s.n).padStart(2, '0')}
                                </span>
                                <h3 className="text-base font-black uppercase tracking-tight text-white">{s.title}</h3>
                                <p className="text-sm leading-relaxed text-white/50">{s.detail}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
