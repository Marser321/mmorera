'use client';

import Image from 'next/image';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useReducedMotion,
    type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ArrowUpRight, Trophy, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PROJECTS_DATA, type ProjectData } from './projectsData';
import { ProjectCaseDialog } from './ProjectCaseDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

/**
 * PortfolioReel — Galería de portfolio como showcase a pantalla completa con
 * scroll lateral (el scroll vertical se traduce en desplazamiento horizontal).
 * Cada proyecto ocupa un panel con una ventana flotante animada (portada en
 * marco tipo navegador) y textos grandes que cuentan el desarrollo y el stack.
 *
 * Desktop sin reduced-motion: pin + translateX ligado al scroll, con animación
 * por "foco" de cada panel. Móvil/reduced-motion: carrusel nativo snap-x.
 */

function browserUrl(project: ProjectData): string {
    return `mariomorera.dev/work/${project.filename.split('.')[0].toLowerCase()}`;
}

// ── Bloque de texto grande + ventana flotante (compartido desktop/móvil) ──
function PanelBody({
    project,
    index,
    total,
    focus,
    simple,
}: {
    project: ProjectData;
    index: number;
    total: number;
    focus?: MotionValue<number>;
    simple: boolean;
}) {
    const { language } = useLanguage();

    // Hover tilt (solo desktop interactivo).
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const pxSpring = useSpring(px, { stiffness: 200, damping: 20, mass: 0.4 });
    const pySpring = useSpring(py, { stiffness: 200, damping: 20, mass: 0.4 });
    const rotateY = useTransform(pxSpring, [-1, 1], [-7, 7]);
    const rotateX = useTransform(pySpring, [-1, 1], [6, -6]);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (simple) return;
        const rect = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
        py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const resetTilt = () => {
        px.set(0);
        py.set(0);
    };

    // Animación por foco (scroll). En modo simple quedan en valor neutro.
    const fallback = useMotionValue(1);
    const f = focus ?? fallback;
    const winScale = useTransform(f, [0, 1], [0.9, 1]);
    const winOpacity = useTransform(f, [0, 1], [0.45, 1]);
    const textX = useTransform(f, [0, 1], [56, 0]);
    const textOpacity = useTransform(f, [0, 1], [0.25, 1]);

    return (
        <div className="mx-auto flex h-full w-full max-w-[92rem] flex-col items-center gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:gap-14 lg:py-0 xl:px-10">
            {/* Textos grandes flotantes */}
            <motion.div
                style={simple ? undefined : { x: textX, opacity: textOpacity }}
                className="order-2 flex w-full min-w-0 flex-col lg:order-1 lg:w-[40%] xl:w-[38%]"
            >
                <div className="mb-4 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-violet-300/80">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className="h-px w-8 bg-violet-300/40" />
                    <span className="text-zinc-500">{String(total).padStart(2, '0')}</span>
                </div>

                <div className="mb-4 flex flex-wrap gap-1.5">
                    {project.category[language].slice(0, 3).map((c) => (
                        <span
                            key={c}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                <h3
                    className="max-w-3xl break-words text-3xl font-black uppercase leading-[1.02] tracking-tight text-white [text-wrap:balance] sm:text-5xl sm:leading-[0.98] lg:text-6xl xl:text-7xl"
                    style={{ fontFamily: 'var(--ff-display)' }}
                >
                    {project.title[language]}
                </h3>

                {/* Desarrollo del proyecto */}
                <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
                    {project.orquestacion[language]}
                </p>

                {/* Tecnologías implementadas */}
                <div className="mt-6">
                    <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        {language === 'es' ? 'Tecnologías' : 'Technologies'}
                    </span>
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

                {/* Métrica + CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-200">
                        <Sparkles className="h-3 w-3" />
                        {project.metric[language]}
                    </span>
                    <DialogTrigger asChild>
                        <button className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-center text-[11px] font-black uppercase leading-tight tracking-wider text-neutral-950 transition-transform hover:-translate-y-0.5 cursor-pointer">
                            {language === 'es' ? 'Ver caso' : 'View case'}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                    </DialogTrigger>
                    <a
                        href={project.iframeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-center text-[11px] font-black uppercase leading-tight tracking-wider text-white/70 transition-colors hover:border-white/30 hover:text-white"
                    >
                        {language === 'es' ? 'En vivo' : 'Live'}
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </div>
            </motion.div>

            {/* Ventana flotante tipo navegador */}
            <motion.div
                style={simple ? undefined : { scale: winScale, opacity: winOpacity }}
                onPointerMove={handlePointerMove}
                onPointerLeave={resetTilt}
                className="order-1 w-full min-w-0 lg:order-2 lg:w-[60%] xl:w-[62%]"
            >
                <motion.div
                    style={simple ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-sm"
                >
                    {/* Barra del navegador simulado */}
                    <div className="flex items-center gap-3 border-b border-white/5 bg-neutral-900/80 px-4 py-2.5">
                        <div className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
                        </div>
                        <div className="mx-auto max-w-[68%] flex-1 truncate rounded-md border border-white/5 bg-black/40 px-3 py-1 text-center font-mono text-[10px] text-zinc-400">
                            {browserUrl(project)}
                        </div>
                    </div>

                    {/* Portada */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                        <Image
                            src={project.imageUrl}
                            alt={project.title[language]}
                            fill
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

// ── Panel desktop (pin + scroll lateral): calcula su foco desde el progreso ──
function ReelPanelDesktop({
    project,
    index,
    total,
    progress,
}: {
    project: ProjectData;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    const focus = useTransform(progress, (p) => {
        const pos = p * (total - 1);
        return Math.max(0, 1 - Math.abs(pos - index));
    });

    return (
        <Dialog>
            <div className="flex h-[100svh] w-screen shrink-0 items-center">
                <PanelBody project={project} index={index} total={total} focus={focus} simple={false} />
            </div>
            <ProjectCaseDialog project={project} />
        </Dialog>
    );
}

// ── Panel móvil / reduced-motion (carrusel snap, entrada whileInView) ──
function ReelPanelSimple({
    project,
    index,
    total,
}: {
    project: ProjectData;
    index: number;
    total: number;
}) {
    const { language } = useLanguage();

    return (
        <Dialog>
            <article className="w-[86vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 shadow-[0_18px_60px_rgba(0,0,0,0.36)] sm:w-[72vw] md:w-[56vw]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <Image
                        src={project.imageUrl}
                        alt={project.title[language]}
                        fill
                        sizes="(max-width: 768px) 86vw, 56vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/35 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[9px] font-black text-white/65 backdrop-blur-md">
                        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </div>
                </div>

                <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {project.category[language].slice(0, 2).map((c) => (
                            <span
                                key={c}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300"
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                    <h3
                        className="break-words text-2xl font-black uppercase leading-tight tracking-tight text-white [text-wrap:balance]"
                        style={{ fontFamily: 'var(--ff-display)' }}
                    >
                        {project.title[language]}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                        {project.impacto[language]}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 3).map((s) => (
                            <span key={s} className="rounded border border-white/8 bg-white/[0.04] px-2 py-1 font-mono text-[9px] text-white/45">
                                {s}
                            </span>
                        ))}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <DialogTrigger asChild>
                            <button className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wider text-neutral-950">
                                {language === 'es' ? 'Ver caso' : 'View case'}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </DialogTrigger>
                        <a
                            href={project.iframeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white/65"
                        >
                            {language === 'es' ? 'En vivo' : 'Live'}
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </article>
            <ProjectCaseDialog project={project} />
        </Dialog>
    );
}

export function PortfolioReel() {
    const { language } = useLanguage();
    // El pin de dos columnas necesita ancho lg (≥1024). Por debajo (móvil y
    // tablet) usamos el carrusel nativo: más legible y sin riesgo de recorte.
    const isCompact = useMediaQuery('(max-width: 1023px)');
    const prefersReduced = useReducedMotion();
    const simple = isCompact || !!prefersReduced;

    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [distance, setDistance] = useState(0);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
    const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

    const total = PROJECTS_DATA.length;

    useEffect(() => {
        if (simple) return;
        const calc = () => {
            const el = trackRef.current;
            if (el) setDistance(Math.max(0, el.scrollWidth - el.offsetWidth));
        };
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, [simple]);

    const Header = (
        <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                    <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-violet-300/80">
                        <Trophy className="h-3 w-3" />
                        <span>{language === 'es' ? 'Portfolio · Casos' : 'Portfolio · Cases'}</span>
                    </div>
                    <h2
                        className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
                        style={{ fontFamily: 'var(--ff-display)' }}
                    >
                        {language === 'es' ? 'Proyectos' : 'Compiled'}{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                            {language === 'es' ? 'Compilados' : 'Projects'}
                        </span>
                    </h2>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                    {simple
                        ? (language === 'es' ? 'Deslizá →' : 'Swipe →')
                        : (language === 'es' ? 'Scrolleá ↓ para recorrer →' : 'Scroll ↓ to browse →')}
                </span>
            </div>
        </div>
    );

    // Móvil / reduced-motion: carrusel horizontal nativo (accesible).
    if (simple) {
        return (
            <section id="portfolio-reel" className="relative py-20">
                {Header}
                <div className="overflow-x-auto snap-x snap-mandatory pb-4">
                    <div className="flex gap-4 px-4 sm:px-6">
                        {PROJECTS_DATA.map((project, index) => (
                            <ReelPanelSimple key={project.id} project={project} index={index} total={total} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Desktop: pin + scroll lateral.
    return (
        <section id="portfolio-reel" className="relative">
            <div className="pt-20">{Header}</div>
            <section ref={sectionRef} className="relative" style={{ height: `${total * 85}vh` }}>
                <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
                    <motion.div ref={trackRef} style={{ x }} className="flex">
                        {PROJECTS_DATA.map((project, index) => (
                            <ReelPanelDesktop
                                key={project.id}
                                project={project}
                                index={index}
                                total={total}
                                progress={scrollYProgress}
                            />
                        ))}
                    </motion.div>

                    {/* Barra de progreso del recorrido */}
                    <motion.div
                        aria-hidden
                        style={{ scaleX: scrollYProgress }}
                        className="absolute bottom-8 left-1/2 h-px w-40 -translate-x-1/2 origin-left bg-gradient-to-r from-violet-400 to-fuchsia-400"
                    />
                </div>
            </section>
        </section>
    );
}
