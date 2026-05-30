'use client';

import { Monitor, Layers, Video, Check, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_SERVICES, localizeServicio } from '@/data/services';
import { RevealHeading } from '@/components/type/RevealHeading';
import { Reveal } from '@/components/scroll/Reveal';

const ICONS: Record<string, LucideIcon> = { Monitor, Layers, Video };

/** Servicios del track software (pilares tech + ops). */
export function SystemsServices() {
    const { t, language } = useLanguage();
    const services = MOCK_SERVICES
        .filter((s) => s.pilar === 'tech' || s.pilar === 'ops')
        .map((s) => localizeServicio(s, language));

    return (
        <section className="relative bg-black py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6">
                <Reveal as="p" className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-emerald-300/80">
                    {t('sistemas', 'services_eyebrow')}
                </Reveal>
                <RevealHeading
                    text={t('sistemas', 'services_title')}
                    as="h2"
                    className="mb-12 text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
                />

                <div className="grid gap-5 md:grid-cols-2">
                    {services.map((s, i) => {
                        const Icon = ICONS[s.icono] ?? Layers;
                        return (
                            <Reveal key={s.id} delay={i * 0.1} className="h-full">
                                <div className="glass-card flex h-full flex-col gap-5 rounded-3xl p-7 sm:p-8">
                                    <div className="flex items-center justify-between">
                                        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/25 bg-emerald-500/10 text-emerald-200">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
                                            {s.descripcion_corta}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase leading-tight tracking-tight text-white">
                                        {s.nombre}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/55">{s.descripcion}</p>
                                    <ul className="mt-auto grid grid-cols-2 gap-2 pt-2">
                                        {s.caracteristicas.map((c) => (
                                            <li key={c} className="flex items-center gap-2 text-xs text-white/65">
                                                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
