'use client';

import Image from 'next/image';
import { ExternalLink, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { filterProjectsByTrack } from '@/data/projects';
import { RevealHeading } from '@/components/type/RevealHeading';
import { Reveal } from '@/components/scroll/Reveal';

/** Showcase de apps/MVPs a medida (proyectos del track software). El "construyo producto, no sólo configuro CRM". */
export function AppsBuildSection() {
    const { t } = useLanguage();
    const projects = filterProjectsByTrack('software').slice(0, 6);

    return (
        <section className="relative bg-black py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6">
                <Reveal as="p" className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-emerald-300/80">
                    {t('sistemas', 'apps_eyebrow')}
                </Reveal>
                <RevealHeading
                    text={t('sistemas', 'apps_title')}
                    as="h2"
                    className="max-w-3xl text-3xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-5xl"
                />
                <Reveal as="p" delay={0.1} className="mb-12 mt-5 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                    {t('sistemas', 'apps_desc')}
                </Reveal>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((p, i) => (
                        <Reveal key={p.id} delay={(i % 3) * 0.08} className="h-full">
                            <article className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-black/80">
                                <Image
                                    src={p.imageUrls[0]}
                                    alt={p.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover opacity-45 transition-all duration-700 group-hover:scale-105 group-hover:opacity-30"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent" />
                                <div className="relative z-10 flex flex-col gap-2 p-5">
                                    <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black text-emerald-200">
                                        <Zap className="h-2.5 w-2.5" />
                                        {p.metric}
                                    </span>
                                    <h3 className="text-xl font-black tracking-tight text-white">{p.title}</h3>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-white/55">{p.impacto}</p>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        {p.stack.slice(0, 3).map((s) => (
                                            <span key={s} className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/45">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={p.iframeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-black uppercase tracking-wider text-emerald-300 transition-colors hover:text-emerald-200"
                                    >
                                        {t('sistemas', 'apps_view')}
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
