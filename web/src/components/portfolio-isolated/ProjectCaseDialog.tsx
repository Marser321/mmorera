'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import type { ProjectData } from './projectsData';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';

/**
 * Modal de caso de estudio. Responsivo:
 *  - Desktop (lg+): dos columnas (narrativa + visor en vivo) lado a lado.
 *  - Mobile/tablet (<lg): casi pantalla completa con tabs "Detalles" / "Demo",
 *    para que cada vista respire y el iframe no se apriete.
 * Surfacea más detalles del proyecto (categorías + stack) y el visor escala sin
 * desbordar. Debe ir dentro de un <Dialog> con su <DialogTrigger>.
 */
export function ProjectCaseDialog({ project }: { project: ProjectData }) {
    const { language } = useLanguage();
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [tab, setTab] = useState<'details' | 'demo'>('details');

    const detailsLabel = language === 'es' ? 'Detalles' : 'Details';
    const demoLabel = language === 'es' ? 'Demo en vivo' : 'Live Demo';

    return (
        <DialogContent
            className={cn(
                'flex flex-col gap-0 p-0 overflow-hidden bg-neutral-950/95 border-white/10 backdrop-blur-xl shadow-2xl',
                // Mobile/tablet: casi pantalla completa (rompe el cap sm:max-w-lg del base)
                'w-screen h-[100dvh] max-w-none sm:max-w-none rounded-none',
                // Desktop: panel centrado
                'lg:h-[85vh] lg:w-[1100px] lg:max-w-[95vw] lg:rounded-lg',
            )}
        >
            {/* Header siempre visible: badge + título + categorías */}
            <div className="shrink-0 border-b border-white/5 px-4 py-3 pr-12 sm:px-6 sm:py-4">
                <span className="mb-2 inline-block rounded border border-violet-500/20 bg-violet-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-violet-400">
                    {language === 'es' ? 'Caso de Estudio' : 'Case Study'}
                </span>
                <DialogTitle className="text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl lg:text-3xl">
                    {project.title[language]}
                </DialogTitle>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.category[language].map((c) => (
                        <span
                            key={c}
                            className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300"
                        >
                            {c}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tabs (solo < lg) */}
            <div className="flex shrink-0 border-b border-white/5 lg:hidden">
                {(['details', 'demo'] as const).map((tk) => (
                    <button
                        key={tk}
                        onClick={() => setTab(tk)}
                        className={cn(
                            'flex-1 py-3 font-mono text-[11px] font-black uppercase tracking-[0.15em] transition-colors cursor-pointer',
                            tab === tk
                                ? 'border-b-2 border-violet-500 text-white'
                                : 'border-b-2 border-transparent text-zinc-500 hover:text-zinc-300',
                        )}
                    >
                        {tk === 'details' ? detailsLabel : demoLabel}
                    </button>
                ))}
            </div>

            {/* Cuerpo: una pestaña por vez en < lg, dos columnas en lg+ */}
            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                {/* Panel Detalles */}
                <div
                    className={cn(
                        'min-h-0 flex-col overflow-y-auto border-white/5 p-5 text-zinc-300 sm:p-6 lg:w-1/2 lg:border-r lg:p-8',
                        tab === 'details' ? 'flex' : 'hidden',
                        'lg:flex',
                    )}
                >
                    <div className="space-y-6">
                        {/* Desafío */}
                        <div>
                            <h4 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                                {language === 'es' ? '01 // El Desafío' : '01 // The Challenge'}
                            </h4>
                            <p className="text-sm font-light leading-relaxed text-zinc-300">
                                {project.desafio[language]}
                            </p>
                        </div>

                        {/* Solución / Orquestación */}
                        <div>
                            <h4 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                                {language === 'es' ? '02 // Orquestación' : '02 // Orchestration'}
                            </h4>
                            <p className="text-sm font-light leading-relaxed text-zinc-300">
                                {project.orquestacion[language]}
                            </p>
                        </div>

                        {/* Impacto */}
                        <div>
                            <h4 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                                {language === 'es' ? '03 // Impacto Operativo' : '03 // Operational Impact'}
                            </h4>
                            <p className="text-sm font-light leading-relaxed text-zinc-300">
                                {project.impacto[language]}
                            </p>
                        </div>

                        {/* Tecnologías */}
                        <div>
                            <h4 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                                {language === 'es' ? '04 // Tecnologías' : '04 // Technologies'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {project.stack.map((s) => (
                                    <span
                                        key={s}
                                        className="rounded-md border border-violet-400/20 bg-violet-500/[0.07] px-2.5 py-1 font-mono text-[10px] text-violet-200"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Métrica Destacada */}
                    <div className="mt-6 flex shrink-0 items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 shadow-[inset_0_0_15px_rgba(255,255,255,0.01)]">
                        <div>
                            <span className="block font-mono text-[8px] uppercase tracking-wider text-zinc-500">
                                {language === 'es' ? 'Métrica de Éxito' : 'Success Metric'}
                            </span>
                            <span className="mt-0.5 block text-sm font-bold uppercase tracking-tight text-white">
                                {project.metric[language]}
                            </span>
                        </div>
                        <span className="rounded border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.05)]">
                            ROI +++
                        </span>
                    </div>
                </div>

                {/* Panel Demo */}
                <div
                    className={cn(
                        'min-h-0 flex-col bg-black/40 lg:w-1/2',
                        tab === 'demo' ? 'flex' : 'hidden',
                        'lg:flex',
                    )}
                >
                    <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-neutral-950 p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                            {language === 'es' ? 'Previsualización Real' : 'Live Preview'}
                        </span>

                        {/* Selector de Dispositivos */}
                        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 p-1">
                            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDevice(d)}
                                    className={cn(
                                        'cursor-pointer rounded p-1.5 text-white/50 transition-colors hover:text-white',
                                        device === d && 'bg-white/10 text-white',
                                    )}
                                    title={`${d.charAt(0).toUpperCase() + d.slice(1)} Mode`}
                                >
                                    {d === 'desktop' ? <Monitor className="h-3.5 w-3.5" /> : d === 'tablet' ? <Tablet className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navegador Simulado */}
                    <div className="flex shrink-0 select-none items-center gap-3 border-b border-white/5 bg-neutral-900 px-4 py-1.5 font-mono text-[10px] text-zinc-500">
                        <div className="flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-500/20" />
                            <span className="h-2 w-2 rounded-full bg-yellow-500/20" />
                            <span className="h-2 w-2 rounded-full bg-green-500/20" />
                        </div>
                        <div className="mx-auto min-w-0 flex-1 truncate rounded border border-white/5 bg-black/40 px-3 py-1 text-center text-zinc-400 max-w-[280px]">
                            mariomorera.dev/work/{project.filename.split('.')[0].toLowerCase()}
                        </div>
                        <a
                            href={project.iframeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex shrink-0 items-center gap-1 text-violet-400 transition-colors hover:text-white"
                        >
                            <span>OPEN</span>
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>

                    {/* Contenedor del Iframe — el marco escala según dispositivo sin desbordar */}
                    <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-neutral-950 p-3 sm:p-4">
                        <div
                            className={cn(
                                'relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl transition-all duration-500',
                                device === 'desktop'
                                    ? 'h-full w-full'
                                    : device === 'tablet'
                                    ? 'h-auto max-h-full w-full max-w-[768px] aspect-[4/3]'
                                    : 'h-auto max-h-full w-full max-w-[360px] aspect-[9/16]',
                            )}
                        >
                            <iframe
                                src={project.iframeUrl}
                                className="h-full w-full border-0 bg-neutral-950"
                                title={`Demo of ${project.title[language]}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
