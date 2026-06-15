"use client";

import { ArrowRight, BrainCircuit, ClipboardList, Megaphone, TrendingUp } from 'lucide-react';
import { Container } from "@/components/ui/container";
import { useLanguage } from '@/context/LanguageContext';
import { BackgroundVideo } from '@/components/shared/BackgroundVideo';
import { useHighlightFamilies } from '@/context/ActiveTechContext';

export function PhilosophySection() {
    const { t } = useLanguage();
    const fieldRef = useHighlightFamilies<HTMLElement>(['Automation', 'AI', 'CRM']);

    const thinkingLayers = [
        {
            title: t('philosophy', 'card1_title'),
            description: t('philosophy', 'card1_desc'),
            icon: ClipboardList,
        },
        {
            title: t('philosophy', 'card2_title'),
            description: t('philosophy', 'card2_desc'),
            icon: Megaphone,
        },
        {
            title: t('philosophy', 'card3_title'),
            description: t('philosophy', 'card3_desc'),
            icon: TrendingUp,
        },
    ];

    const badges = [
        t('philosophy', 'badge1'),
        t('philosophy', 'badge2'),
        t('philosophy', 'badge3')
    ];

    return (
        <section
            id="filosofia"
            ref={fieldRef}
            className="py-20 md:py-24 relative bg-transparent"
            aria-labelledby="filosofia-heading"
        >
            <Container className="relative z-10">
                <div className="max-w-5xl mx-auto bg-white/[0.012] border border-white/10 rounded-3xl p-6 md:p-10 lg:p-12 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,255,179,0.1),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_48%)] pointer-events-none" />
                    {/* Video de fondo: infografía corporativa (orquestación del sistema) */}
                    <BackgroundVideo
                        src="/videos/corporate-infographic.mp4"
                        poster="/videos/posters/corporate-infographic.jpg"
                        intensity="cinematic"
                        scrim="radial"
                        tint="signal"
                    />

                    <div className="relative z-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-start text-left">
                        <div className="space-y-6">
                            <h2
                                id="filosofia-heading"
                                className="text-3xl md:text-4xl lg:text-5xl font-heading text-white tracking-tight"
                            >
                                <span className="text-primary block mb-2 text-sm uppercase tracking-widest font-mono">{t('philosophy', 'eyebrow')}</span>
                                {t('philosophy', 'title')}
                            </h2>
                            <p className="text-base md:text-lg text-white/[0.66] font-light leading-relaxed">
                                {t('philosophy', 'desc1')}
                            </p>
                            <p className="text-base md:text-lg text-white/[0.86] font-medium leading-relaxed">
                                {t('philosophy', 'desc2')}
                            </p>

                            <div className="flex flex-wrap gap-3 pt-1">
                                {badges.map((label) => (
                                    <span
                                        key={label}
                                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/[0.72]"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => { window.location.href = '/aplicar'; }}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-black bg-white hover:bg-zinc-200 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {t('philosophy', 'cta')}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 lg:pl-8 lg:border-l border-white/10">
                            <div className="rounded-2xl border border-primary/25 bg-primary/[0.045] p-5 backdrop-blur-[2px]">
                                <BrainCircuit className="mb-4 h-6 w-6 text-primary" />
                                <h3 className="text-xl md:text-2xl font-heading text-white tracking-tight">
                                    {t('philosophy', 'lateral_title')}
                                </h3>
                                <p className="mt-3 text-sm md:text-base text-white/60 leading-relaxed">
                                    {t('philosophy', 'lateral_desc')}
                                </p>
                            </div>

                            <div className="grid gap-3">
                                {thinkingLayers.map(({ title, description, icon: Icon }) => (
                                    <article
                                        key={title}
                                        className="group rounded-2xl border border-white/10 bg-black/[0.12] p-4 backdrop-blur-[2px] transition-colors duration-300 hover:border-primary/35 hover:bg-primary/[0.04]"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                                                    {title}
                                                </h4>
                                                <p className="mt-2 text-sm leading-relaxed text-white/[0.58]">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
