'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Eye, Film, Code2, Rocket } from 'lucide-react';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';

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
            { name: 'Premiere Pro', meta: 'CODEC: ProRes 422 HQ · TIMELINE: Multicam' },
            { name: 'After Effects', meta: 'ENGINE: Mercury GPU · COMP: 32-bit Float' },
            { name: 'Photoshop / Lightroom', meta: 'COLOR: Adobe RGB · OUTPUT: DCI-P3' },
        ],
    },
    {
        id: 'construir',
        labelKey: 'track_construir',
        color: 'cyan',
        colorHex: '#22d3ee',
        Icon: Code2,
        tools: [
            { name: 'Next.js / React', meta: 'RSC: Server Components · CACHE: Edge Revalidate' },
            { name: 'TypeScript', meta: 'STRICT: true · TARGET: ES2022' },
            { name: 'Supabase / PostgreSQL', meta: 'AUTH: GoTrue/JWT · REALTIME: WebSockets' },
        ],
    },
    {
        id: 'escalar',
        labelKey: 'track_escalar',
        color: 'amber',
        colorHex: '#fbbf24',
        Icon: Rocket,
        tools: [
            { name: 'GoHighLevel', meta: 'ROLE: CRM Pipeline · API: REST + Webhooks' },
            { name: 'n8n Workflows', meta: 'HOST: Self-Hosted · LOGIC: Visual Nodes' },
            { name: 'WhatsApp API', meta: 'CHANNEL: Business · FLOW: Async Dispatch' },
        ],
    },
];

// ─────────────────────────────────────────────
// VU METER (Track: CREAR)
// ─────────────────────────────────────────────
function VuMeter({ isHovered }: { isHovered: boolean }) {
    const [bars, setBars] = useState<number[]>([0.4, 0.6, 0.5, 0.7, 0.3, 0.55]);
    const [peak, setPeak] = useState(-6.2);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isHovered) {
                // Clipping: todas al máximo
                setBars([0.95, 1.0, 0.98, 1.0, 0.96, 0.99]);
                setPeak(0.0);
            } else {
                setBars(prev => prev.map(() => 0.2 + Math.random() * 0.6));
                setPeak(parseFloat((-8 + Math.random() * 5).toFixed(1)));
            }
        }, 150);
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-end gap-[3px] h-8">
                {bars.map((val, i) => (
                    <motion.div
                        key={i}
                        className="w-[6px] rounded-sm"
                        animate={{
                            height: `${val * 100}%`,
                            backgroundColor: val > 0.9 ? '#ef4444' : val > 0.7 ? '#facc15' : '#a78bfa',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    />
                ))}
            </div>
            <span className={`font-mono text-[9px] tracking-wider ${isHovered ? 'text-red-400' : 'text-violet-400/70'}`}>
                PEAK: {peak.toFixed(1)} dB{isHovered ? ' ▲ CLIP' : ''}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────
// TERMINAL BUILD (Track: CONSTRUIR)
// ─────────────────────────────────────────────
const BUILD_COMMANDS = [
    { cmd: '$ next build', result: '✓ Compiled (2.1s)', bundle: '42.1 kB' },
    { cmd: '$ tsc --noEmit', result: '✓ No errors', bundle: '0 issues' },
    { cmd: '$ pnpm dev', result: '✓ Ready on :3000', bundle: 'HMR: 12ms' },
];

function TerminalBuild({ isHovered }: { isHovered: boolean }) {
    const [cmdIndex, setCmdIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [phase, setPhase] = useState<'typing' | 'spinner' | 'result' | 'pause'>('typing');
    const [spinnerFrame, setSpinnerFrame] = useState(0);
    const spinnerChars = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
    const speedMultiplier = isHovered ? 0.3 : 1;

    useEffect(() => {
        const command = BUILD_COMMANDS[cmdIndex];
        let timeout: NodeJS.Timeout;

        if (phase === 'typing') {
            if (displayedText.length < command.cmd.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(command.cmd.slice(0, displayedText.length + 1));
                }, 30 * speedMultiplier);
            } else {
                timeout = setTimeout(() => setPhase('spinner'), 200 * speedMultiplier);
            }
        } else if (phase === 'spinner') {
            if (spinnerFrame < 10) {
                timeout = setTimeout(() => setSpinnerFrame(prev => prev + 1), 80 * speedMultiplier);
            } else {
                setTimeout(() => setPhase('result'), 0);
            }
        } else if (phase === 'result') {
            timeout = setTimeout(() => setPhase('pause'), 3000);
        } else if (phase === 'pause') {
            timeout = setTimeout(() => {
                setCmdIndex(prev => (prev + 1) % BUILD_COMMANDS.length);
                setDisplayedText('');
                setPhase('typing');
                setSpinnerFrame(0);
            }, 500);
        }

        return () => clearTimeout(timeout);
    }, [phase, displayedText, spinnerFrame, cmdIndex, speedMultiplier]);

    const command = BUILD_COMMANDS[cmdIndex];

    return (
        <div className="flex flex-col gap-1 font-mono text-[10px] leading-relaxed h-8 justify-center">
            <div className="text-cyan-300/90 truncate">
                {displayedText}
                {phase === 'typing' && <span className="animate-pulse">▊</span>}
                {phase === 'spinner' && (
                    <span className="text-cyan-500 ml-1">{spinnerChars[spinnerFrame % spinnerChars.length]}</span>
                )}
            </div>
            {(phase === 'result' || phase === 'pause') && (
                <div className="text-emerald-400/80 truncate">{command.result} · {command.bundle}</div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// NETWORK MONITOR (Track: ESCALAR)
// ─────────────────────────────────────────────
const HTTP_CODES = ['200 OK', '201 Created', '302 Redirect', '200 OK'];

function NetworkMonitor({ isHovered }: { isHovered: boolean }) {
    const [latency, setLatency] = useState(142);
    const [codeIndex, setCodeIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isHovered) {
                setLatency(12);
            } else {
                setLatency(85 + Math.floor(Math.random() * 125));
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [isHovered]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCodeIndex(prev => (prev + 1) % HTTP_CODES.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-1.5 h-8 justify-center">
            <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                <span className="text-white/60 uppercase tracking-wider">ONLINE</span>
                <span className={`font-bold ${isHovered ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {latency}ms
                </span>
                {isHovered && <span className="text-emerald-400 text-[8px]">⚡</span>}
            </div>
            <span className="font-mono text-[9px] text-amber-400/60 tracking-wider">
                HTTP {HTTP_CODES[codeIndex]} ✓
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────
// TRACK CARD COMPONENT
// ─────────────────────────────────────────────
function TrackCard({ track, index }: { track: TrackData; index: number }) {
    const { t } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredTool, setHoveredTool] = useState<string | null>(null);

    const TrackIcon = track.Icon;

    // Color mapping por track
    const colorMap: Record<string, { border: string; bg: string; text: string; textDim: string; iconBg: string }> = {
        violet: {
            border: 'border-violet-500/30',
            bg: 'bg-violet-500/5',
            text: 'text-violet-400',
            textDim: 'text-violet-400/60',
            iconBg: 'bg-violet-500/10',
        },
        cyan: {
            border: 'border-cyan-500/30',
            bg: 'bg-cyan-500/5',
            text: 'text-cyan-400',
            textDim: 'text-cyan-400/60',
            iconBg: 'bg-cyan-500/10',
        },
        amber: {
            border: 'border-amber-500/30',
            bg: 'bg-amber-500/5',
            text: 'text-amber-400',
            textDim: 'text-amber-400/60',
            iconBg: 'bg-amber-500/10',
        },
    };

    const colors = colorMap[track.color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setHoveredTool(null); }}
            className={`relative flex flex-col rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-md p-5 transition-all duration-300 cursor-default min-w-[260px] flex-1 ${
                isHovered ? 'border-opacity-100 shadow-lg' : ''
            }`}
            style={isHovered ? { boxShadow: `0 0 30px ${track.colorHex}15` } : undefined}
        >
            {/* Header del track */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${colors.iconBg}`}>
                    <TrackIcon className={`w-4.5 h-4.5 ${colors.text}`} />
                </div>
                <span className={`font-mono text-xs font-black uppercase tracking-[0.3em] ${colors.text}`}>
                    {t('hero', track.labelKey)}
                </span>
            </div>

            {/* Indicador animado */}
            <div className="mb-4 min-h-[52px]">
                {track.id === 'crear' && <VuMeter isHovered={isHovered} />}
                {track.id === 'construir' && <TerminalBuild isHovered={isHovered} />}
                {track.id === 'escalar' && <NetworkMonitor isHovered={isHovered} />}
            </div>

            {/* Separador */}
            <div className={`w-full h-px ${colors.border} mb-3`} />

            {/* Lista de herramientas */}
            <div className="flex flex-col gap-1.5">
                {track.tools.map((tool) => (
                    <div key={tool.name} className="relative">
                        <button
                            className={`text-left w-full text-[11px] font-medium transition-colors duration-200 ${
                                hoveredTool === tool.name ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                            onMouseEnter={() => setHoveredTool(tool.name)}
                            onMouseLeave={() => setHoveredTool(null)}
                        >
                            {tool.name}
                        </button>
                        <AnimatePresence>
                            {hoveredTool === tool.name && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={`overflow-hidden font-mono text-[8px] ${colors.textDim} tracking-wider leading-relaxed`}
                                >
                                    → {tool.meta}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// HERO PORTFOLIO (MAIN COMPONENT)
// ─────────────────────────────────────────────
export function HeroPortfolio() {
    const { isDevMode, metrics, toggleDevMode } = useDevMode();
    const { t } = useLanguage();

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

    // Títulos bilingües
    const titleLine1 = t('hero', 'title1');
    const titleLine2 = t('hero', 'title2');
    const titleLine3 = t('hero', 'title3');

    return (
        <section className="relative w-full min-h-screen bg-black flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 select-none">

            {/* FONDO DECORATIVO: Gradientes suaves */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/[0.03] blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

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
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.9] mb-2">
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
                        className="block overflow-hidden py-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400"
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {titleLine2}
                    </motion.span>

                    {/* Línea 3 (solo en inglés: "Orchestrator") */}
                    {titleLine3 && (
                        <motion.span
                            className="block overflow-hidden py-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white/40"
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

                {/* ═══════════════════════════════════════════
                    LOS 3 TRACKS: CREAR · CONSTRUIR · ESCALAR
                    ═══════════════════════════════════════════ */}

                {/* Desktop: 3 columnas simétricas */}
                <div className="hidden md:flex w-full gap-4 mb-12">
                    {TRACKS.map((track, i) => (
                        <TrackCard key={track.id} track={track} index={i} />
                    ))}
                </div>

                {/* Mobile: Carrusel horizontal con scroll-snap */}
                <div className="md:hidden w-full mb-12">
                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 scrollbar-hide">
                        {TRACKS.map((track, i) => (
                            <div key={track.id} className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                                <TrackCard track={track} index={i} />
                            </div>
                        ))}
                    </div>
                    {/* Dots indicadores */}
                    <div className="flex justify-center gap-2 mt-3">
                        {TRACKS.map((track) => (
                            <div
                                key={track.id}
                                className="w-1.5 h-1.5 rounded-full bg-zinc-600"
                            />
                        ))}
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
