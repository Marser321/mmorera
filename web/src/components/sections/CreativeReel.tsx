'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { HorizontalScroll } from '@/components/scroll/HorizontalScroll';
import { RevealHeading } from '@/components/type/RevealHeading';
import { Reveal } from '@/components/scroll/Reveal';
import { filterProjectsByTrack } from '@/data/projects';

/** Galería pin-horizontal del trabajo creativo (proyectos del track diseño). */
export function CreativeReel() {
    const { t } = useLanguage();
    const projects = filterProjectsByTrack('design');

    return (
        <section className="relative bg-black py-20 sm:py-28">
            <div className="container mx-auto mb-10 px-4 sm:px-6">
                <Reveal as="p" className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-violet-300/80">
                    {t('estudio', 'reel_eyebrow')}
                </Reveal>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <RevealHeading
                        text={t('estudio', 'reel_title')}
                        as="h2"
                        className="max-w-2xl text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                        {t('estudio', 'reel_hint')} →
                    </span>
                </div>
            </div>

            <HorizontalScroll trackClassName="gap-5 px-4 sm:px-6">
                {projects.map((p) => (
                    <article
                        key={p.id}
                        className="group relative flex h-[26rem] w-[78vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-black/80 sm:w-[24rem]"
                    >
                        <Image
                            src={p.imageUrls[0]}
                            alt={p.title}
                            fill
                            sizes="(max-width: 640px) 78vw, 24rem"
                            className="object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                        <div className="relative z-10 flex flex-col gap-3 p-6">
                            <div className="flex flex-wrap gap-1.5">
                                {p.category.slice(0, 2).map((c) => (
                                    <span
                                        key={c}
                                        className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300"
                                    >
                                        {c}
                                    </span>
                                ))}
                                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-violet-400/25 bg-violet-500/10 px-2 py-0.5 text-[9px] font-black text-violet-200">
                                    <Zap className="h-2.5 w-2.5" />
                                    {p.metric}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black tracking-tight text-white">{p.title}</h3>
                            <p className="line-clamp-2 text-xs leading-relaxed text-white/55">{p.impacto}</p>
                            <a
                                href={p.iframeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-black uppercase tracking-wider text-violet-300 transition-colors hover:text-violet-200"
                            >
                                {t('estudio', 'reel_view')}
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </article>
                ))}

                {/* Tarjeta final: todos los casos */}
                <Link
                    href="/casos-de-exito"
                    className="group flex h-[26rem] w-[70vw] shrink-0 snap-center flex-col items-center justify-center gap-4 rounded-3xl border border-violet-400/20 bg-violet-500/[0.06] p-6 text-center transition-colors hover:bg-violet-500/[0.12] sm:w-[20rem]"
                >
                    <span className="grid h-14 w-14 place-items-center rounded-full border border-violet-400/30 bg-black/40">
                        <ArrowRight className="h-6 w-6 text-violet-200 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                    <span className="text-lg font-black uppercase tracking-tight text-white">
                        {t('estudio', 'reel_all')}
                    </span>
                </Link>
            </HorizontalScroll>
        </section>
    );
}
