'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowRight, Clapperboard, Workflow, ChevronDown } from 'lucide-react';
import { useTrack } from '@/context/TrackContext';
import { useLanguage } from '@/context/LanguageContext';
import { EASE_OUT } from '@/lib/motion';

/**
 * Las dos puertas del cruce (diseño → /estudio, software → /sistemas) + el
 * escape "mostrame todo" que scrollea al manifiesto. Al elegir una puerta se
 * fija el track antes de navegar.
 */
export function ForkDoors() {
    const { setTrack } = useTrack();
    const { t } = useLanguage();
    const lenis = useLenis();

    const showAll = () => {
        const el = document.getElementById('orquestador');
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -40 });
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const doors = [
        {
            id: 'design' as const,
            href: '/estudio',
            Icon: Clapperboard,
            title: t('fork', 'door_design_title'),
            desc: t('fork', 'door_design_desc'),
            cta: t('fork', 'door_design_cta'),
            ring: 'hover:!border-violet-400/40',
            glow: 'hover:shadow-[0_0_60px_rgba(167,139,250,0.18)]',
            chip: 'from-violet-500/20 to-cyan-500/10 text-violet-200 border-violet-400/30',
            grad: 'from-violet-300 to-cyan-300',
        },
        {
            id: 'software' as const,
            href: '/sistemas',
            Icon: Workflow,
            title: t('fork', 'door_software_title'),
            desc: t('fork', 'door_software_desc'),
            cta: t('fork', 'door_software_cta'),
            ring: 'hover:!border-emerald-400/40',
            glow: 'hover:shadow-[0_0_60px_rgba(16,185,129,0.18)]',
            chip: 'from-emerald-500/20 to-cyan-500/10 text-emerald-200 border-emerald-400/30',
            grad: 'from-emerald-300 to-cyan-300',
        },
    ];

    return (
        <div className="w-full">
            <div className="grid w-full gap-4 sm:gap-6 md:grid-cols-2">
                {doors.map((door, i) => {
                    const Icon = door.Icon;
                    return (
                        <motion.div
                            key={door.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 + i * 0.12, ease: EASE_OUT }}
                        >
                            <Link
                                href={door.href}
                                onClick={() => setTrack(door.id)}
                                className={`glass-card group relative flex h-full flex-col items-start gap-4 rounded-3xl p-6 text-left transition-shadow duration-500 sm:p-8 ${door.ring} ${door.glow}`}
                            >
                                <span
                                    className={`inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] ${door.chip}`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    0{i + 1}
                                </span>
                                <h2
                                    className={`bg-gradient-to-r bg-clip-text text-2xl font-black uppercase leading-tight tracking-tight text-transparent sm:text-3xl ${door.grad}`}
                                >
                                    {door.title}
                                </h2>
                                <p className="text-sm leading-relaxed text-white/55 sm:text-base">
                                    {door.desc}
                                </p>
                                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-xs font-black uppercase tracking-wider text-white/80 transition-colors group-hover:text-white">
                                    {door.cta}
                                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                                </span>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={showAll}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white/50 transition-all duration-300 hover:border-white/25 hover:text-white/80"
                >
                    {t('fork', 'show_all')}
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
