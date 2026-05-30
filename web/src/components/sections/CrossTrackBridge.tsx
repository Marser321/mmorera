'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTrack } from '@/context/TrackContext';
import { RevealHeading } from '@/components/type/RevealHeading';
import { Reveal } from '@/components/scroll/Reveal';
import { TRACKS, type TrackId } from '@/data/tracks';

/** Puente al otro track (el upsell "y si además necesitás..."). Fija el track al navegar. */
export function CrossTrackBridge({ to }: { to: TrackId }) {
    const { t } = useLanguage();
    const { setTrack } = useTrack();
    const isSoftware = to === 'software';

    const eyebrow = t('bridge', isSoftware ? 'to_software_eyebrow' : 'to_design_eyebrow');
    const title = t('bridge', isSoftware ? 'to_software_title' : 'to_design_title');
    const cta = t('bridge', isSoftware ? 'to_software_cta' : 'to_design_cta');

    const accentText = isSoftware ? 'text-emerald-300/80' : 'text-violet-300/80';
    const ctaClass = isSoftware
        ? 'border-emerald-400/30 bg-gradient-to-r from-emerald-600/25 to-cyan-600/15 hover:border-emerald-300/50 shadow-[0_0_40px_rgba(16,185,129,0.16)]'
        : 'border-violet-400/30 bg-gradient-to-r from-violet-600/25 to-cyan-600/15 hover:border-violet-300/50 shadow-[0_0_40px_rgba(167,139,250,0.16)]';

    return (
        <section className="relative bg-black py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="glass-card flex flex-col items-center gap-5 rounded-3xl p-8 text-center sm:p-12">
                    <Reveal as="p" className={`font-mono text-[11px] font-black uppercase tracking-[0.3em] ${accentText}`}>
                        {eyebrow}
                    </Reveal>
                    <RevealHeading
                        text={title}
                        as="h2"
                        className="max-w-3xl text-2xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-4xl"
                    />
                    <Link
                        href={TRACKS[to].route}
                        onClick={() => setTrack(to)}
                        className={`group mt-2 inline-flex min-h-12 items-center gap-3 rounded-full border px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white backdrop-blur-2xl transition-all duration-500 sm:text-sm ${ctaClass}`}
                    >
                        {cta}
                        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
