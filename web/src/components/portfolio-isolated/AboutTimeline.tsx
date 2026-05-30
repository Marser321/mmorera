'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { 
    Video, 
    Layers, 
    Code, 
    Play, 
    Pause, 
    SkipForward, 
    SkipBack, 
    Monitor, 
    Activity 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Container } from '@/components/ui/container';
import { TIMELINE_EVENTS, TimelineEvent } from './timelineData';

// Pista NLE → disciplina (la disciplina es lo primario; el código V1/A1/D1 es el guiño).
const DISCIPLINE = {
    V1: { key: 'creative', color: 'violet', Icon: Video, mono: 'WAVEFORM' },
    A1: { key: 'ops', color: 'amber', Icon: Layers, mono: 'FLOW' },
    D1: { key: 'dev', color: 'emerald', Icon: Code, mono: 'STDOUT' },
} as const;

type TrackId = 'V1' | 'A1' | 'D1';

// Monitor que REFLEJA la disciplina activa (no ruido):
// creativo = waveform · operaciones = grafo de nodos · desarrollo = stream de código.
function ScopeVisualizer({ track, isPlaying }: { track: TrackId | null; isPlaying: boolean }) {
    const reduce = useReducedMotion();
    const live = isPlaying && !reduce;
    const meta = track ? DISCIPLINE[track] : null;

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 rounded-lg overflow-hidden border border-white/5">
            {/* Grid de monitor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none" />

            {/* Etiqueta de modo (guiño mono) */}
            {meta && (
                <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[7px] text-white/40 z-20 bg-black/50 px-1.5 py-0.5 rounded">
                    <Activity className="w-2.5 h-2.5" />
                    <span>{meta.mono} MONITOR</span>
                </div>
            )}

            {/* STANDBY */}
            {!meta && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-full h-12 stroke-emerald-500/30 fill-none" viewBox="0 0 300 48">
                        <path d="M 0 24 Q 37.5 0, 75 24 T 150 24 T 225 24 T 300 24" strokeWidth="1.5">
                            {live && (
                                <animate attributeName="d" dur="2s" repeatCount="indefinite"
                                    values="M 0 24 Q 37.5 0, 75 24 T 150 24 T 225 24 T 300 24;M 0 24 Q 37.5 48, 75 24 T 150 24 T 225 24 T 300 24;M 0 24 Q 37.5 0, 75 24 T 150 24 T 225 24 T 300 24" />
                            )}
                        </path>
                    </svg>
                    <span className="absolute text-[8px] font-mono text-zinc-500 uppercase tracking-widest bg-black/60 px-2 py-0.5 border border-white/5 rounded">
                        STANDBY · SIGNAL
                    </span>
                </div>
            )}

            {/* CREATIVO: waveform */}
            {track === 'V1' && (
                <div className="flex items-end justify-between w-full h-24 px-4 z-10">
                    {Array.from({ length: 22 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-full mx-[1px] rounded-t-sm bg-gradient-to-t from-violet-500 to-fuchsia-500"
                            initial={{ height: '10%' }}
                            animate={live ? { height: ['10%', `${35 + (i * 37) % 60}%`, `${18 + (i * 19) % 40}%`, '10%'] } : { height: `${20 + (i * 29) % 55}%` }}
                            transition={{ duration: 0.7 + (i % 3) * 0.2, repeat: live ? Infinity : 0, repeatType: 'reverse', delay: i * 0.04, ease: 'easeInOut' }}
                        />
                    ))}
                </div>
            )}

            {/* OPERACIONES: grafo de nodos con un pulso recorriendo el flujo */}
            {track === 'A1' && (
                <svg className="w-[80%] h-20 z-10" viewBox="0 0 240 80" fill="none">
                    <path id="opsPath" d="M 20 40 L 90 20 L 150 60 L 220 30" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1.5" />
                    {[[20, 40], [90, 20], [150, 60], [220, 30]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="6" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5" />
                    ))}
                    {live && (
                        <circle r="3.5" fill="#fbbf24">
                            <animateMotion dur="2.4s" repeatCount="indefinite"><mpath href="#opsPath" /></animateMotion>
                        </circle>
                    )}
                </svg>
            )}

            {/* DESARROLLO: stream de código */}
            {track === 'D1' && (
                <div className="w-[82%] z-10 font-mono text-[8px] leading-relaxed text-emerald-400/80 space-y-1">
                    {['const stack = ["next","ts"]', 'build() // ✓ compiled', 'deploy --edge', 'ready on :3000'].map((line, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: live ? i * 0.25 : 0, duration: 0.3 }}>
                            <span className="text-zinc-600 mr-2">{String(i + 1).padStart(2, '0')}</span>{line}
                            {i === 3 && <span className={live ? 'animate-pulse' : ''}>▊</span>}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Scanline CRT */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-1/2 w-full animate-[scanline_6s_linear_infinite] pointer-events-none" />
        </div>
    );
}

export function AboutTimeline() {
    const { t, language } = useLanguage();
    
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Simulación del código de tiempo SMPTE en el reproductor
    const [smpteTime, setSmpteTime] = useState('00:00:00:00');

    // Medición del scroll en el Timeline
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ['start center', 'end center']
    });

    // Mapeamos el progreso del scroll a la posición vertical del playhead (0% a 100%)
    const playheadYRaw = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    const playheadY = useSpring(playheadYRaw, { stiffness: 90, damping: 20 });

    // Código de tiempo SMPTE que avanza si está reproduciendo
    useEffect(() => {
        let frame = 0;
        let sec = 0;
        let min = 0;
        let animationFrameId: number;

        if (isPlaying) {
            const updateSMPTE = () => {
                frame += 1;
                if (frame >= 24) {
                    frame = 0;
                    sec += 1;
                }
                if (sec >= 60) {
                    sec = 0;
                    min += 1;
                }

                const pad = (num: number) => num.toString().padStart(2, '0');
                setSmpteTime(`00:${pad(min)}:${pad(sec)}:${pad(frame)}`);
                
                animationFrameId = requestAnimationFrame(updateSMPTE);
            };
            animationFrameId = requestAnimationFrame(updateSMPTE);
        } else {
            // Sincronizar SMPTE con el scroll si no está reproduciendo
            const unsub = scrollYProgress.on("change", (latest) => {
                const totalFrames = Math.floor(latest * 8640); // ~6 minutos a 24fps
                const minVal = Math.floor(totalFrames / 1440);
                const secVal = Math.floor((totalFrames % 1440) / 24);
                const frameVal = totalFrames % 24;
                
                const pad = (num: number) => num.toString().padStart(2, '0');
                setSmpteTime(`00:${pad(minVal)}:${pad(secVal)}:${pad(frameVal)}`);
            });
            return () => unsub();
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, scrollYProgress]);

    // Lógica de Auto-scroll (Reproducción Automática)
    useEffect(() => {
        if (!isPlaying) return;

        let lastTime = performance.now();
        let animationFrameId: number;

        const autoScroll = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            // Desplazar 0.08px por milisegundo (~80px por segundo para suavidad)
            window.scrollBy({ top: 0.08 * delta, behavior: 'auto' });

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (window.scrollY >= maxScroll - 10) {
                setIsPlaying(false);
                return;
            }

            animationFrameId = requestAnimationFrame(autoScroll);
        };

        animationFrameId = requestAnimationFrame(autoScroll);

        // Detener autoplay ante interacción del usuario
        const stopPlaying = () => setIsPlaying(false);
        window.addEventListener('wheel', stopPlaying, { passive: true });
        window.addEventListener('touchmove', stopPlaying, { passive: true });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('wheel', stopPlaying);
            window.removeEventListener('touchmove', stopPlaying);
        };
    }, [isPlaying]);

    // Ir al hito específico haciendo scroll suave hasta su posición central
    const navigateToEvent = (evt: TimelineEvent) => {
        const element = document.getElementById(`timeline-event-${evt.id}`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            setActiveEvent(evt);
        }
    };

    const handlePrev = () => {
        if (!activeEvent) return;
        const currentIndex = TIMELINE_EVENTS.findIndex(e => e.id === activeEvent.id);
        if (currentIndex > 0) {
            navigateToEvent(TIMELINE_EVENTS[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (!activeEvent) {
            navigateToEvent(TIMELINE_EVENTS[0]);
            return;
        }
        const currentIndex = TIMELINE_EVENTS.findIndex(e => e.id === activeEvent.id);
        if (currentIndex < TIMELINE_EVENTS.length - 1) {
            navigateToEvent(TIMELINE_EVENTS[currentIndex + 1]);
        }
    };

    // Detallar metadatos del track activo
    const trackDetails = useMemo(() => {
        if (!activeEvent) {
            return {
                title: t('about', 'card_title'),
                codec: 'Analog Human v1.0',
                resolution: 'Real Life / Adaptive',
                fps: 'Uncapped',
                file: 'PROFILE.MOV'
            };
        }
        return {
            title: activeEvent.title[language],
            codec: activeEvent.codec,
            resolution: activeEvent.resolution,
            fps: activeEvent.fps,
            file: `${activeEvent.id.toUpperCase()}.mov`
        };
    }, [activeEvent, language, t]);

    return (
        <section
            ref={containerRef}
            id="sobre-mi-timeline"
            className="py-24 md:py-32 relative bg-transparent overflow-hidden"
        >
            {/* Luces de Fondo (Glow Deep Space) */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-violet-600/5 blur-[150px] rounded-full -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] rounded-full translate-x-1/2 pointer-events-none" />

            <Container className="relative z-10">
                {/* Título de la Sección */}
                <div className="flex flex-col mb-16 text-left">
                    <span className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-[10px] block mb-3">
                        {t('about', 'eyebrow')}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        {t('about', 'title_part1')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-emerald-400 to-cyan-500">
                            {t('about', 'title_part2')}
                        </span>
                    </h2>
                    <p className="max-w-3xl text-zinc-400 font-light text-base md:text-lg leading-relaxed">
                        {t('about', 'timeline_intro')}
                    </p>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/60">
                        {t('about', 'read_hint')}
                    </p>
                </div>

                {/* Grid Principal: Monitor (Izquierda) + Timeline (Derecha) */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ──── PANEL IZQUIERDO: SOURCE MONITOR (STICKY) ──── */}
                    <div className="lg:col-span-5 w-full lg:sticky lg:top-24 z-20 space-y-4">
                        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
                            
                            {/* Decoración superior estilo Hardware */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                                <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                    <span>MONITOR: SOURCE DECK</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono text-[9px]">
                                    {isPlaying ? (
                                        <>
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-red-500 font-bold">REC</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                            <span className="text-yellow-500">PAUSED</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Pantalla Simulada */}
                            <div className="aspect-video w-full mb-4 relative rounded-lg overflow-hidden border border-white/5 bg-zinc-900/50">
                                <ScopeVisualizer 
                                    track={activeEvent ? activeEvent.track : null} 
                                    isPlaying={isPlaying} 
                                />
                            </div>

                            {/* Controles de Transporte y Playhead SMPTE */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1 border-t border-white/5">
                                {/* SMPTE */}
                                <div className="font-mono text-[10px] text-white/40 bg-neutral-900 px-3 py-1.5 rounded border border-white/5 tracking-wider select-none">
                                    {smpteTime}
                                </div>

                                {/* Botones */}
                                <div className="flex items-center gap-1 bg-neutral-900 border border-white/5 p-1 rounded-lg">
                                    <button
                                        onClick={handlePrev}
                                        className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors"
                                        title="Hito Anterior"
                                    >
                                        <SkipBack className="w-4 h-4" />
                                    </button>
                                    
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className={`p-2 rounded-md transition-all ${
                                            isPlaying 
                                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                        }`}
                                        title={isPlaying ? 'Pausar Auto-scroll' : 'Iniciar Auto-scroll'}
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-400/20" />}
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors"
                                        title="Siguiente Hito"
                                    >
                                        <SkipForward className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Ficha Técnica Activa */}
                        <div className="bg-neutral-950/80 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                                <Monitor className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-white font-bold text-xs uppercase tracking-wider">
                                    {t('about', 'card_title')}
                                </h3>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeEvent ? activeEvent.id : 'profile'}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        {activeEvent ? (
                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                                                activeEvent.track === 'V1' ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' :
                                                activeEvent.track === 'A1' ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' :
                                                'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                            }`}>
                                                {t('about', `track_${DISCIPLINE[activeEvent.track].key}`)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-300">
                                                {t('about', 'profile_role')}
                                            </span>
                                        )}
                                        <h4 className="text-white font-black text-lg tracking-tight">
                                            {trackDetails.title}
                                        </h4>
                                    </div>

                                    {/* Breve descripción */}
                                    <p className="text-zinc-400 font-light text-xs leading-relaxed">
                                        {activeEvent 
                                            ? activeEvent.desc[language] 
                                            : t('about', 'p1')
                                        }
                                    </p>

                                    {!activeEvent && (
                                        <p className="text-zinc-400 font-light text-xs leading-relaxed">
                                            {t('about', 'p2')}
                                        </p>
                                    )}

                                    {/* Tecnologías o Sinergia */}
                                    <div>
                                        <span className="font-mono text-[8px] text-zinc-500 uppercase block tracking-wider mb-2">
                                            {activeEvent ? t('about', 'stack_label') : t('about', 'skills_label')}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {activeEvent ? (
                                                activeEvent.tech.map(tech => (
                                                    <span 
                                                        key={tech} 
                                                        className={`font-mono text-[8px] px-2 py-0.5 rounded border ${
                                                            activeEvent.track === 'V1' ? 'bg-violet-950/20 border-violet-500/20 text-violet-400' :
                                                            activeEvent.track === 'A1' ? 'bg-amber-950/20 border-amber-500/20 text-amber-400' :
                                                            'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                                                        }`}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))
                                            ) : (
                                                [
                                                    t('about', 'skill1'),
                                                    t('about', 'skill2'),
                                                    t('about', 'skill3'),
                                                    t('about', 'skill4')
                                                ].map((skill, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="text-[9px] px-2 py-1 rounded bg-white/5 border border-white/5 text-zinc-300 block w-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Specs (guiño cinematográfico, secundario) */}
                                    {activeEvent && (
                                        <div className="font-mono text-[8px] text-zinc-600 tracking-wider truncate border-t border-white/5 pt-3">
                                            {trackDetails.file} · {trackDetails.codec} · {trackDetails.fps}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ──── PANEL DERECHO: TIMELINE VERTICAL ──── */}
                    <div className="lg:col-span-7 relative w-full" ref={timelineRef}>
                        
                        {/* Cabecera flotante de tracks (Solo en Desktop) */}
                        <div className="hidden lg:grid grid-cols-3 gap-6 pb-4 mb-6 border-b border-white/10 sticky top-0 bg-neutral-950/80 backdrop-blur-sm z-10">
                            {([
                                { track: 'V1', Icon: Video, name: 'track_creative', sub: 'track_creative_sub', text: 'text-violet-300', icon: 'text-violet-400' },
                                { track: 'A1', Icon: Layers, name: 'track_ops', sub: 'track_ops_sub', text: 'text-amber-300', icon: 'text-amber-400' },
                                { track: 'D1', Icon: Code, name: 'track_dev', sub: 'track_dev_sub', text: 'text-emerald-300', icon: 'text-emerald-400' },
                            ] as const).map((h) => {
                                const Icon = h.Icon;
                                return (
                                    <div key={h.track} className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <Icon className={`w-3.5 h-3.5 ${h.icon}`} />
                                            <span className={`font-bold text-xs tracking-wide ${h.text}`}>{t('about', h.name)}</span>
                                            <span className="ml-auto font-mono text-[8px] text-zinc-700">{h.track}</span>
                                        </div>
                                        <span className="text-[9px] text-zinc-500 font-light">{t('about', h.sub)}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Contenedor del Timeline */}
                        <div className="relative pl-6 lg:pl-0">
                            
                            {/* Rieles de Fondo (Tracks) */}
                            {/* Mobile: 1 sola línea vertical central. Desktop: 3 líneas verticales de tracks */}
                            <div className="absolute inset-y-0 left-0 lg:left-auto lg:right-0 lg:w-full flex lg:grid lg:grid-cols-3 lg:gap-6 pointer-events-none">
                                <div className="w-px bg-white/10 h-full lg:mx-auto relative">
                                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-violet-500/20 via-violet-500/5 to-transparent" />
                                </div>
                                <div className="hidden lg:block w-px bg-white/10 h-full mx-auto relative">
                                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent" />
                                </div>
                                <div className="hidden lg:block w-px bg-white/10 h-full mx-auto relative">
                                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent" />
                                </div>
                            </div>

                            {/* Playhead Linea Flotante (Horizontal) */}
                            <motion.div
                                className="absolute left-0 lg:-left-2 lg:right-0 h-[2px] bg-emerald-500 z-10 pointer-events-none"
                                style={{ top: playheadY }}
                            >
                                {/* Marker del Playhead */}
                                <div className="absolute left-0 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 border-2 border-neutral-950 w-3 h-3 rounded-full shadow-[0_0_10px_#10b981]" />
                            </motion.div>

                            {/* Hitos del Timeline */}
                            <div className="space-y-12 lg:space-y-16 relative py-12">
                                {TIMELINE_EVENTS.map((evt) => {
                                    // Mapear track a color
                                    const trackColor = 
                                        evt.track === 'V1' ? 'violet' :
                                        evt.track === 'A1' ? 'amber' : 'emerald';
                                    
                                    // Determinar en qué columna de desktop cae el clip
                                    const columnClass = 
                                        evt.track === 'V1' ? 'lg:col-start-1' :
                                        evt.track === 'A1' ? 'lg:col-start-2' : 'lg:col-start-3';

                                    const isClipActive = activeEvent?.id === evt.id;

                                    return (
                                        <div 
                                            key={evt.id}
                                            id={`timeline-event-${evt.id}`}
                                            className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative"
                                        >
                                            <motion.div
                                                className={`lg:col-span-1 ${columnClass}`}
                                                onViewportEnter={() => {
                                                    setActiveEvent(evt);
                                                }}
                                                viewport={{ margin: "-35% 0px -40% 0px" }}
                                            >
                                                {/* Clip en la pista */}
                                                <button
                                                    onClick={() => navigateToEvent(evt)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-500 relative group overflow-hidden ${
                                                        isClipActive
                                                            ? trackColor === 'violet' ? 'bg-violet-950/20 border-violet-500/80 shadow-[0_0_20px_rgba(139,92,246,0.15)]' :
                                                              trackColor === 'amber' ? 'bg-amber-950/20 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.15)]' :
                                                              'bg-emerald-950/20 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                            : 'bg-neutral-950/40 border-white/5 hover:border-white/20'
                                                    }`}
                                                >
                                                    {/* Glow de fondo al estar activo */}
                                                    {isClipActive && (
                                                        <div className={`absolute inset-0 bg-radial-gradient ${
                                                            trackColor === 'violet' ? 'from-violet-500/5' :
                                                            trackColor === 'amber' ? 'from-amber-500/5' :
                                                            'from-emerald-500/5'
                                                        } to-transparent pointer-events-none`} />
                                                    )}

                                                    {/* Barra lateral de color identificatoria */}
                                                    <div className={`absolute top-0 bottom-0 left-0 w-[3px] ${
                                                        trackColor === 'violet' ? 'bg-violet-500' :
                                                        trackColor === 'amber' ? 'bg-amber-500' :
                                                        'bg-emerald-500'
                                                    }`} />

                                                    {/* Contenido del Clip */}
                                                    <div className="space-y-2.5 pl-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                {evt.track === 'V1' && <Video className="w-3.5 h-3.5 text-violet-400" />}
                                                                {evt.track === 'A1' && <Layers className="w-3.5 h-3.5 text-amber-400" />}
                                                                {evt.track === 'D1' && <Code className="w-3.5 h-3.5 text-emerald-400" />}
                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                                                                    {t('about', `track_${DISCIPLINE[evt.track].key}`)}
                                                                </span>
                                                                <span className="font-mono text-[7px] text-zinc-700 tracking-widest">{evt.track}</span>
                                                            </div>
                                                            <span className={`font-mono text-[8px] ${
                                                                isClipActive ? 'text-white' : 'text-zinc-600'
                                                            }`}>
                                                                {evt.timecode}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">
                                                            {evt.title[language]}
                                                        </h4>

                                                        {/* Preview de la descripción y tags (Visible en mobile porque colapsa, y útil en desktop) */}
                                                        <p className="text-[10px] text-zinc-400 font-light line-clamp-2">
                                                            {evt.desc[language]}
                                                        </p>

                                                        <div className="flex flex-wrap gap-1 pt-1">
                                                            {evt.tech.slice(0, 3).map(t => (
                                                                <span 
                                                                    key={t} 
                                                                    className="font-mono text-[7px] bg-white/5 border border-white/5 text-zinc-400 px-1.5 py-0.5 rounded"
                                                                >
                                                                    {t}
                                                                </span>
                                                            ))}
                                                            {evt.tech.length > 3 && (
                                                                <span className="font-mono text-[7px] text-zinc-600 px-1 py-0.5">
                                                                    +{evt.tech.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bus de convergencia: las 3 pistas se mezclan en el master */}
                            <div className="relative mt-4 pt-4">
                                <svg className="w-full h-14" viewBox="0 0 300 56" fill="none" preserveAspectRatio="none" aria-hidden="true">
                                    <path d="M 50 0 C 50 30, 150 26, 150 50" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.45" />
                                    <path d="M 150 0 L 150 50" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.45" />
                                    <path d="M 250 0 C 250 30, 150 26, 150 50" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.45" />
                                    <circle cx="150" cy="50" r="4" fill="#10F5B2" />
                                </svg>
                                <div className="flex flex-col items-center text-center -mt-1">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 px-4 py-2 backdrop-blur-md">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300/70">
                                            {t('about', 'output_label')}
                                        </span>
                                        <span className="text-sm font-black text-white">
                                            {t('about', 'output_value')}
                                        </span>
                                    </div>
                                    <span className="mt-2 text-[10px] text-zinc-500 font-light">
                                        {t('about', 'output_caption')}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
