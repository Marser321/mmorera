'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Sparkles, ArrowRight, Eye, Film, Code2, Rocket } from 'lucide-react';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useActiveTech } from '@/context/ActiveTechContext';
import type { Family } from '@/data/techStack';
import { EASE_OUT, DURATION, fadeUp } from '@/lib/motion';
import dynamic from 'next/dynamic';
import { useIsMobile } from '@/hooks/useMediaQuery';

// Núcleo 3D del hero — cargado sin SSR para mantener three fuera del bundle inicial.
const OrchestrationCore = dynamic(
    () => import('@/components/shared/OrchestrationCore').then((m) => m.OrchestrationCore),
    { ssr: false },
);

// ─────────────────────────────────────────────
// TRACK DATA
// ─────────────────────────────────────────────
interface TrackTool {
    name: string;
    meta: string; // Una línea de metadata técnica para hover
}

interface TrackData {
    id: string;
    labelKey: string;
    color: string;       // Color base del track (Tailwind class prefix)
    colorHex: string;    // Hex para SVG/Canvas
    Icon: React.ComponentType<{ className?: string }>;
    families: Family[];  // Familias del campo de partículas que se resaltan en hover
    tools: TrackTool[];
}

const TRACKS: TrackData[] = [
    {
        id: 'crear',
        labelKey: 'track_crear',
        color: 'fuchsia',
        colorHex: '#e879f9',
        Icon: Film,
        families: ['Media'],
        tools: [
            { name: 'Edición Audiovisual', meta: 'CODEC: ProRes 422 HQ · TIMELINE: Multicam' },
            { name: 'Efectos & Gráficos', meta: 'ENGINE: Mercury GPU · COMP: 32-bit Float' },
            { name: 'Dirección de Arte & Color', meta: 'COLOR: Adobe RGB · OUTPUT: DCI-P3' },
        ],
    },
    {
        id: 'construir',
        labelKey: 'track_construir',
        color: 'cyan',
        colorHex: '#22d3ee',
        Icon: Code2,
        families: ['Web', 'Backend', 'AI'],
        tools: [
            { name: 'Desarrollo Frontend', meta: 'RSC: Server Components · CACHE: Edge Revalidate' },
            { name: 'Arquitectura de Tipos', meta: 'STRICT: true · TARGET: ES2022' },
            { name: 'Motores de Datos', meta: 'AUTH: GoTrue/JWT · REALTIME: WebSockets' },
        ],
    },
    {
        id: 'escalar',
        labelKey: 'track_escalar',
        color: 'amber',
        colorHex: '#fbbf24',
        Icon: Rocket,
        families: ['Automation', 'CRM', 'AI'],
        tools: [
            { name: 'Embudos & CRM de Ventas', meta: 'ROLE: CRM Pipeline · API: REST + Webhooks' },
            { name: 'Orquestación de Procesos', meta: 'HOST: Self-Hosted · LOGIC: Visual Nodes' },
            { name: 'Canales de Mensajería', meta: 'CHANNEL: Business · FLOW: Async Dispatch' },
        ],
    },
];



// hex → rgba para teñir el indicador del selector con el color del track activo.
function hexToRgba(hex: string, alpha: number): string {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// Entrada del selector: el contenedor aparece mientras se ensambla el logo y
// revela las 3 opciones una por una (paso a paso).
const selectorBar: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: DURATION.base,
            ease: EASE_OUT,
            delay: 0.6,
            when: 'beforeChildren',
            staggerChildren: 0.12,
            delayChildren: 0.85,
        },
    },
};

// ─────────────────────────────────────────────
// HERO PORTFOLIO (MAIN COMPONENT)
// ─────────────────────────────────────────────
export function HeroPortfolio() {
    const { isDevMode, metrics, toggleDevMode } = useDevMode();
    const { t, language } = useLanguage();
    const { setActiveFamilies } = useActiveTech();
    const isMobile = useIsMobile();
    const [activeTrack, setActiveTrack] = useState<string>('crear');

    // El track activo manda qué familias se resaltan en el campo de partículas
    // global → al pasar el mouse, los logos del fondo cambian a esa disciplina.
    useEffect(() => {
        if (isMobile) {
            setActiveFamilies([]);
            return;
        }
        const track = TRACKS.find((tr) => tr.id === activeTrack);
        if (track) setActiveFamilies(track.families);
    }, [activeTrack, isMobile, setActiveFamilies]);

    // Intro guiada: al cargar, el indicador barre los 3 modos (cambiando el fondo
    // de verdad) y se posa en el default. Cualquier interacción lo cancela.
    const introTimers = useRef<number[]>([]);
    const introActive = useRef(true);

    const stopIntro = useCallback(() => {
        introActive.current = false;
        introTimers.current.forEach((id) => clearTimeout(id));
        introTimers.current = [];
    }, []);

    const selectTrack = useCallback((id: string) => {
        stopIntro();
        setActiveTrack(id);
    }, [stopIntro]);

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || isMobile) {
            introActive.current = false;
            return;
        }
        const sequence = ['construir', 'escalar', 'crear']; // arranca en 'crear', barre y vuelve
        let delay = 1100; // tras el reveal de opciones / mientras se ensambla el logo
        const timers = introTimers.current;
        sequence.forEach((id) => {
            const tid = window.setTimeout(() => {
                if (!introActive.current) return;
                setActiveTrack(id);
            }, delay);
            timers.push(tid);
            delay += 950;
        });
        return () => {
            timers.forEach((id) => clearTimeout(id));
        };
    }, [isMobile]);

    // --- TIMECODE PLAYER (23.976 FPS) ---
    const [timecode, setTimecode] = useState('01:00:00:00');
    const [isPlaying, setIsPlaying] = useState(false);
    const frameRef = useRef(0);
    const lastUpdateRef = useRef(0);
    const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);

    const formatTimecode = useCallback((totalFrames: number) => {
        const fps = 24;
        const ff = String(totalFrames % fps).padStart(2, '0');
        const totalSecs = Math.floor(totalFrames / fps);
        const ss = String(totalSecs % 60).padStart(2, '0');
        const totalMins = Math.floor(totalSecs / 60);
        const mm = String(totalMins % 60).padStart(2, '0');
        const hh = String(Math.floor(totalMins / 60) % 24).padStart(2, '0');
        return `${hh}:${mm}:${ss}:${ff}`;
    }, []);

    const handleActivity = useCallback(() => {
        setIsPlaying(true);
        if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
        mouseTimerRef.current = setTimeout(() => setIsPlaying(false), 500);
    }, []);

    useEffect(() => {
        if (isMobile) {
            return;
        }
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('scroll', handleActivity);
        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
        };
    }, [handleActivity, isMobile]);

    useEffect(() => {
        if (isMobile) return;

        let reqId: number;
        const updateClock = (timestamp: number) => {
            if (isPlaying) {
                if (timestamp - lastUpdateRef.current >= 41.7) {
                    frameRef.current += 1;
                    setTimecode(formatTimecode(frameRef.current));
                    lastUpdateRef.current = timestamp;
                }
            }
            reqId = requestAnimationFrame(updateClock);
        };
        reqId = requestAnimationFrame(updateClock);
        return () => cancelAnimationFrame(reqId);
    }, [isPlaying, formatTimecode, isMobile]);

    // --- DEV MODE VIA ATAJO DE TECLADO (Cmd+Shift+D) ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
                e.preventDefault();
                toggleDevMode();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleDevMode]);

    // Núcleo 3D sólo en desktop sin reduced-motion (fallback: campo generativo + glows)
    const [show3D, setShow3D] = useState(false);
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const desktop = window.matchMedia('(min-width: 1024px)').matches;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShow3D(desktop && !reduce);
    }, []);

    // Color ambiental del track activo (tiñe los glows del hero).
    const activeTrackColor = TRACKS.find((tr) => tr.id === activeTrack)?.colorHex ?? '#a78bfa';

    // Títulos bilingües
    const titleLine1 = t('hero', 'title1');
    const titleLine2 = t('hero', 'title2');
    const titleLine3 = t('hero', 'title3');

    return (
        <section className="relative w-full min-h-screen bg-transparent flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 select-none">

            {/* FONDO DECORATIVO: glows que se tiñen con el track activo */}
            <div
                aria-hidden
                className="absolute top-0 left-1/4 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-[0.05] transition-colors duration-700"
                style={{ backgroundColor: activeTrackColor }}
            />
            <div
                aria-hidden
                className="absolute bottom-0 right-1/4 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-[0.04] transition-colors duration-700"
                style={{ backgroundColor: activeTrackColor }}
            />

            {/* Núcleo de orquestación 3D (pieza firma) */}
            {show3D && (
                <div aria-hidden className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
                    <div className="h-[78vmin] w-[78vmin] max-h-[560px] max-w-[560px] opacity-90">
                        <OrchestrationCore />
                    </div>
                </div>
            )}

            {/* Scrim/viñeta: asegura la legibilidad del texto sobre el núcleo 3D
                y las partículas, sin apagar el logo central. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 60% at 50% 52%, rgba(8,10,14,0.62) 0%, rgba(8,10,14,0.34) 42%, transparent 72%)',
                }}
            />

            {/* CONTENIDO PRINCIPAL */}
            <div className="relative z-30 flex flex-col items-center w-full max-w-5xl text-center px-6">

                {/* Timecode inline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 hidden items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 sm:flex"
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                    <span className="text-zinc-300 font-bold">{timecode}</span>
                    <span className="text-zinc-600">·</span>
                    <span>23.976fps</span>
                    <span className="text-zinc-600">·</span>
                    <span>REC 709</span>
                </motion.div>

                {/* Título con clip-path reveal */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-[-0.02em] text-white leading-[0.92] mb-2">
                    {/* Línea 1 */}
                    <motion.span
                        className="block overflow-hidden py-1"
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {titleLine1}
                    </motion.span>

                    {/* Línea 2 */}
                    <motion.span
                        className="block overflow-hidden py-1 text-transparent bg-clip-text"
                        style={{ backgroundImage: 'linear-gradient(90deg, var(--color-signal), var(--color-accent))' }}
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {titleLine2}
                    </motion.span>

                    {/* Línea 3 (solo en inglés: "Orchestrator") */}
                    {titleLine3 && (
                        <motion.span
                            className="block overflow-hidden py-1 text-transparent bg-clip-text"
                            style={{ backgroundImage: 'linear-gradient(90deg, var(--color-accent), color-mix(in oklch, var(--color-foreground) 45%, transparent))' }}
                            initial={{ clipPath: 'inset(0 100% 0 0)' }}
                            animate={{ clipPath: 'inset(0 0% 0 0)' }}
                            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {titleLine3}
                        </motion.span>
                    )}
                </h1>

                {/* Subtítulo */}
                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="max-w-2xl text-base sm:text-lg font-normal text-zinc-200 leading-relaxed mb-12 text-pretty [text-shadow:0_1px_12px_rgba(0,0,0,0.55)]"
                >
                    {t('hero', 'subtitle')}
                </motion.p>

                {/* ─────────────────────────────────────────────
                    DISCIPLINAS INTERACTIVAS MINIMALISTAS
                    ───────────────────────────────────────────── */}
                <div className="w-full max-w-3xl mx-auto mb-16 mt-8">
                    {/* Toggle segmentado: indicador deslizante marca la disciplina activa */}
                    <div className="flex justify-center">
                        <motion.div
                            variants={selectorBar}
                            initial="hidden"
                            animate="visible"
                            className="relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl"
                        >
                            {TRACKS.map((track) => {
                                const isActive = activeTrack === track.id;
                                const TrackIcon = track.Icon;
                                const colorClass = track.color === 'fuchsia'
                                    ? 'text-fuchsia-400'
                                    : track.color === 'cyan'
                                    ? 'text-cyan-400'
                                    : 'text-amber-400';

                                return (
                                    <motion.button
                                        key={track.id}
                                        variants={fadeUp}
                                        onMouseEnter={() => selectTrack(track.id)}
                                        onClick={() => selectTrack(track.id)}
                                        onFocus={() => selectTrack(track.id)}
                                        aria-pressed={isActive}
                                        className="relative flex items-center gap-2 rounded-full px-3 py-2.5 transition-colors duration-300 cursor-pointer sm:px-6"
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="trackIndicator"
                                                aria-hidden
                                                initial={false}
                                                className="absolute inset-0 rounded-full border"
                                                style={{
                                                    backgroundColor: hexToRgba(track.colorHex, 0.12),
                                                    borderColor: hexToRgba(track.colorHex, 0.4),
                                                    boxShadow: `0 0 22px ${hexToRgba(track.colorHex, 0.22)}`,
                                                }}
                                                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                            />
                                        )}
                                        <TrackIcon
                                            className={`relative z-10 h-4 w-4 transition-colors duration-300 sm:h-[18px] sm:w-[18px] ${
                                                isActive ? colorClass : 'text-zinc-500'
                                            }`}
                                        />
                                        <span
                                            className={`relative z-10 font-mono text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-300 sm:text-xs ${
                                                isActive ? 'text-white' : 'text-zinc-500'
                                            }`}
                                        >
                                            {t('hero', track.labelKey)}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Copy dinámico según la disciplina activa */}
                    <div className="min-h-[90px] mt-8 px-4 flex flex-col justify-center items-center">
                        <AnimatePresence mode="wait">
                            {TRACKS.map((track) => {
                                if (track.id !== activeTrack) return null;
                                return (
                                    <motion.div
                                        key={track.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.25 }}
                                        className="text-center max-w-xl"
                                    >
                                        <p className="text-zinc-100 text-sm sm:text-base font-normal leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.55)]">
                                            {track.id === 'crear'
                                                ? (language === 'es' ? 'Dirección de arte, edición de alto impacto, color profesional y motion graphics premium.' : 'Art direction, high-impact editing, pro color grading and premium motion graphics.')
                                                : track.id === 'construir'
                                                ? (language === 'es' ? 'Frontend ágil, interfaces dinámicas, tipos seguros y datos en tiempo real.' : 'Agile frontend, dynamic interfaces, safe types and real-time data.')
                                                : (language === 'es' ? 'Embudos de venta, CRM unificado, automatización de procesos y mensajería 24/7.' : 'Sales funnels, unified CRM, process automation and 24/7 messaging.')
                                            }
                                        </p>
                                        <div className="mt-3 flex justify-center gap-3 flex-wrap">
                                            {track.tools.map((tool) => (
                                                <span key={tool.name} className="text-[9px] font-mono text-zinc-200 bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                    {tool.name}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.3 }}
                    className="mb-12 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
                >
                    <motion.a
                        href="/aplicar"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-600/20 to-cyan-600/10 px-8 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(16,185,129,0.1)] backdrop-blur-2xl transition-all duration-300 sm:h-14 sm:px-10"
                    >
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <Sparkles className="w-4 h-4 text-emerald-300" />
                            {t('hero', 'cta_build')}
                            <ArrowRight className="w-4 h-4 text-emerald-400 transition-transform duration-300 group-hover:translate-x-2" />
                        </span>
                    </motion.a>

                    <motion.a
                        href="/casos-de-exito"
                        whileTap={{ scale: 0.98 }}
                        className="hidden h-12 items-center justify-center rounded-full border border-white/10 px-8 text-xs font-black uppercase text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white sm:inline-flex sm:h-14 sm:px-10"
                    >
                        <Eye className="mr-2 w-4 h-4" />
                        {t('hero', 'cta_cases')} →
                    </motion.a>
                </motion.div>

                {/* Firma: Mario Morera */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                    className="flex flex-col items-center gap-0.5"
                >
                    <span className="font-mono text-sm text-zinc-500 tracking-wider">
                        {t('hero', 'signature')}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
                        {t('hero', 'signature_role')}
                    </span>
                </motion.div>
            </div>

            {/* DEV MODE: HUD Overlay (activado con Cmd+Shift+D) */}
            <AnimatePresence>
                {isDevMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 pointer-events-none"
                    >
                        {/* Grid de alineación */}
                        <div className="absolute inset-0 border-[3px] border-emerald-500/15" />
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10" />
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/10" />

                        {/* Status bar inferior */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/80 border-t border-emerald-500/20 flex items-center justify-between px-6 font-mono text-[9px] text-emerald-500/60 pointer-events-auto">
                            <span>FPS: <span className="text-white font-bold">{metrics.fps}</span></span>
                            <span>DOM: <span className="text-white font-bold">{metrics.domNodes}</span></span>
                            <span>HEAP: <span className="text-white font-bold">{metrics.memoryUsed}</span></span>
                            <button
                                onClick={toggleDevMode}
                                className="text-emerald-400 hover:text-emerald-300 transition-colors pointer-events-auto"
                            >
                                [×] CLOSE HUD
                            </button>
                        </div>

                        {/* Label de componente */}
                        <span className="absolute top-4 left-4 font-mono text-[8px] text-emerald-500/40 uppercase">
                            {'<HeroPortfolio /> // Cmd+Shift+D to toggle'}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
