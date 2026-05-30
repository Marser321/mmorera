'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RevealHeading } from '@/components/type/RevealHeading';
import { Reveal } from '@/components/scroll/Reveal';

/** CTA de cierre del track software → embudo /aplicar con track=software. */
export function SystemsApplyCTA() {
    const { t } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-black py-20 sm:py-28">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.10),transparent_50%)]" />
            <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center sm:px-6">
                <Reveal as="p" className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-emerald-300/80">
                    {t('sistemas', 'apply_eyebrow')}
                </Reveal>
                <RevealHeading
                    text={t('sistemas', 'apply_title')}
                    as="h2"
                    className="mb-8 max-w-2xl text-3xl font-black uppercase leading-[1.02] tracking-tight text-white sm:text-5xl"
                />
                <Link
                    href="/aplicar?track=software"
                    className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-emerald-400/30 bg-gradient-to-r from-emerald-600/25 to-cyan-600/15 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(16,185,129,0.18)] backdrop-blur-2xl transition-all duration-500 hover:border-emerald-300/50 sm:text-sm"
                >
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                    {t('sistemas', 'apply_cta')}
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </Link>
            </div>
        </section>
    );
}
