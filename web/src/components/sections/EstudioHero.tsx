'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clapperboard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RevealHeading } from '@/components/type/RevealHeading';
import { EASE_OUT } from '@/lib/motion';
import { BackgroundVideo } from '@/components/shared/BackgroundVideo';
import { useHighlightFamilies } from '@/context/ActiveTechContext';

export function EstudioHero() {
    const { t } = useLanguage();
    const fieldRef = useHighlightFamilies<HTMLElement>(['Web', 'Marketing']);

    return (
        <section ref={fieldRef} className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-black px-4 pt-24 text-center sm:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(167,139,250,0.16),transparent_42%),radial-gradient(circle_at_78%_62%,rgba(34,211,238,0.10),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:88px_88px] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_100%)]" />

            {/* Video de fondo creativo (interfaz de sitio web desintegrándose) */}
            <BackgroundVideo
                src="/videos/website-disintegrate.mp4"
                poster="/videos/posters/website-disintegrate.jpg"
                intensity="cinematic"
                scrim="center"
                tint="violet"
            />

            <div className="container relative z-10 mx-auto flex max-w-5xl flex-col items-center">
                {/* HUD Header Panel */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                    className="w-full max-w-4xl mb-12 border border-white/10 bg-black/45 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(167,139,250,0.05)] relative"
                >
                    {/* Grid de Fondo para el HUD */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_100%] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5 opacity-50 pointer-events-none" />
                    
                    {/* Barra de Telemetría Superior */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5 font-mono text-[9px] font-bold tracking-[0.16em] text-zinc-500 uppercase">
                        <div className="flex items-center gap-2 text-violet-400">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500"></span>
                            </span>
                            <span>TRACK_ID: 01_CREATIVE_MEDIA</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4">
                            <span>SYS.LATENCY: 0.00ms</span>
                            <span>STATUS: OPERATIONAL // 24FPS</span>
                            <span className="text-zinc-600">|</span>
                            <span>LOC: OS_NODE_01</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 font-black">
                            <Clapperboard className="h-3 w-3 text-violet-400" />
                            <span>{t('estudio', 'eyebrow')}</span>
                        </div>
                    </div>
                </motion.div>

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
