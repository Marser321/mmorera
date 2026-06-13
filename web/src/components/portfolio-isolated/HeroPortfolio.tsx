'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Eye, Film, Code2, Rocket } from 'lucide-react';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';

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
    tools: TrackTool[];
}

const TRACKS: TrackData[] = [
    {
        id: 'crear',
        labelKey: 'track_crear',
        color: 'violet',
        colorHex: '#a78bfa',
        Icon: Film,
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
        tools: [
            { name: 'Embudos & CRM de Ventas', meta: 'ROLE: CRM Pipeline · API: REST + Webhooks' },
            { name: 'Orquestación de Procesos', meta: 'HOST: Self-Hosted · LOGIC: Visual Nodes' },
            { name: 'Canales de Mensajería', meta: 'CHANNEL: Business · FLOW: Async Dispatch' },
        ],
    },
];



// ─────────────────────────────────────────────
// TRACK CARD COMPONENT
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// HERO PORTFOLIO (MAIN COMPONENT)
// ─────────────────────────────────────────────
export function HeroPortfolio() {
    const { isDevMode, metrics, toggleDevMode } = useDevMode();
    const { t, language } = useLanguage();
    const [activeTrack, setActiveTrack] = useState<string>('crear');

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
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('scroll', handleActivity);
        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
        };
    }, [handleActivity]);

    useEffect(() => {
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
    }, [isPlaying, formatTimecode]);

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

    // Títulos bilingües
    const titleLine1 = t('hero', 'title1');
    const titleLine2 = t('hero', 'title2');
    const titleLine3 = t('hero', 'title3');

    return (
        <section className="relative w-full min-h-screen bg-transparent flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 select-none">

            {/* FONDO DECORATIVO: Gradientes suaves */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/[0.03] blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

            {/* Video de Fondo Abstracto (Máquina de Crecimiento) */}
            <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none mix-blend-screen overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/growth-machine.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Núcleo de orquestación 3D (pieza firma) */}
            {show3D && (
                <div aria-hidden className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
                    <div className="h-[120vmin] w-[120vmin] max-h-[860px] max-w-[860px] opacity-70">
                        <OrchestrationCore />
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <div className="relative z-30 flex flex-col items-center w-full max-w-5xl text-center px-6">

                {/* Timecode inline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 flex items-center gap-2 font-mono text-[10px] text-zinc-500 tracking-widest"
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
                    className="max-w-2xl text-base sm:text-lg font-light text-zinc-400 leading-relaxed mb-12 text-pretty"
                >
                    {t('hero', 'subtitle')}
                </motion.p>

                {/* ─────────────────────────────────────────────
                    DISCIPLINAS INTERACTIVAS MINIMALISTAS
                    ───────────────────────────────────────────── */}
                <div className="w-full max-w-3xl mx-auto mb-16 mt-8">
                    <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap border-b border-white/5 pb-6">
                        {TRACKS.map((track) => {
                            const isActive = activeTrack === track.id;
                            const TrackIcon = track.Icon;
                            const colorClass = track.color === 'violet' 
                                ? 'text-violet-400' 
                                : track.color === 'cyan' 
                                ? 'text-cyan-400' 
                                : 'text-amber-400';
                            
                            return (
                                <button
                                    key={track.id}
                                    onMouseEnter={() => setActiveTrack(track.id)}
                                    onClick={() => setActiveTrack(track.id)}
                                    className={`flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                                        isActive 
                                            ? `bg-white/[0.03] border-white/15 ${colorClass} shadow-[0_0_15px_rgba(255,255,255,0.02)]`
                                            : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    <TrackIcon className="w-4.5 h-4.5" />
                                    <span className="font-mono text-xs font-black uppercase tracking-[0.2em]">
                                        {t('hero', track.labelKey)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Copy dinámico según la disciplina activa */}
                    <div className="min-h-[90px] mt-6 px-4 flex flex-col justify-center items-center">
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
                                        <p className="text-zinc-300 text-sm font-light leading-relaxed">
                                            {track.id === 'crear' 
                                                ? (language === 'es' ? 'Dirección de arte, edición audiovisual de alto impacto, corrección de color profesional y motion graphics premium para posicionar tu marca en la cima.' : 'Art direction, high-impact video editing, professional color grading, and premium motion graphics to position your brand at the top.')
                                                : track.id === 'construir'
                                                ? (language === 'es' ? 'Desarrollo frontend ágil, estructuración de interfaces dinámicas, lógica de tipos segura y bases de datos integradas en tiempo real.' : 'Agile frontend development, dynamic user interfaces structure, safe type architectures, and databases integrated in real time.')
                                                : (language === 'es' ? 'Embudos de venta avanzados, CRM comercial unificado, automatizaciones lógicas de procesos y mensajería automatizada 24/7.' : 'Advanced sales funnels, unified commercial CRM, logical process automation, and automated messaging running 24/7.')
                                            }
                                        </p>
                                        <div className="mt-3 flex justify-center gap-3 flex-wrap">
                                            {track.tools.map((tool) => (
                                                <span key={tool.name} className="text-[9px] font-mono text-zinc-500 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded-full">
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
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12"
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
                        className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-8 text-xs font-black uppercase text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white sm:h-14 sm:px-10"
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
