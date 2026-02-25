'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { FileWarning, MessageCircleOff, Hourglass, AlertTriangle, Database, Zap, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export function ProblemSolution() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Desktop: clip-path circular reveal original
    const desktopClipPath = useTransform(scrollYProgress, [0, 1], ["circle(0% at 50% 50%)", "circle(250% at 50% 50%)"]);

    // Mobile: crossfade suave
    const mobileOpacityRed = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);
    const mobileOpacityGreen = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
    const mobileScaleGreen = useTransform(scrollYProgress, [0.3, 1], [1.1, 1]);

    const revealClipPath = isMobile ? undefined : desktopClipPath;

    // Light sweep durante reveal
    const sweepX = useTransform(scrollYProgress, [0.1, 0.5], ["-100%", "200%"]);
    const sweepOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.4, 0.6], [0, 1, 1, 0]);

    // Timings de contenido solución
    const solTitleY = useTransform(scrollYProgress, [0.2, 0.5, 0.9], [150, 0, 0]);
    const solTitleOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.9], [0, 1, 1]);
    const solBtnY = useTransform(scrollYProgress, [0.4, 0.7, 0.9], [100, 0, 0]);
    const solBtnOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.9], [0, 1, 1]);

    return (
        <div ref={containerRef} className="relative w-full md:h-[160dvh] bg-[#022c22] mb-[-1px]">
            <div className="relative md:sticky md:top-0 md:h-[100dvh] w-full overflow-hidden">

                {/* CAPA A: PROBLEMA (Rojo) */}
                <motion.div
                    style={isMobile ? { opacity: mobileOpacityRed } : {}}
                    className="relative md:absolute inset-0 z-0 bg-gradient-to-b from-[#1a0505] to-[#0A0000] flex items-center justify-center p-4 md:p-8 min-h-[90vh] md:min-h-0"
                >
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-[10px] text-red-500 font-mono tracking-[0.3em] uppercase"
                            >
                                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 mr-3 animate-pulse" />
                                Equipo Interno Saturado
                            </motion.div>
                            <h2 className="text-5xl md:text-[6rem] font-bold tracking-tight text-white leading-tight md:leading-[0.85]">
                                La Trampa del <br />
                                <span className="text-red-600">Seguimiento Lento.</span>
                            </h2>
                            <p className="text-xl text-white/60 md:text-white/40 leading-relaxed max-w-lg font-light">
                                Si tu departamento de ventas tarda más de 5 minutos en responder, el 78% de tus leads B2B le comprará al competidor que conteste primero. El trabajo manual quema tu presupuesto.
                            </p>
                        </div>

                        <div className="relative aspect-square max-w-[300px] md:max-w-none mx-auto md:mx-0">
                            <ChaosGroup isMobile={isMobile} />
                        </div>
                    </div>
                </motion.div>

                {/* CAPA B: SOLUCIÓN (Verde) — Reveal */}
                <motion.div
                    style={isMobile ? {
                        clipPath: 'none',
                        opacity: mobileOpacityGreen,
                        scale: mobileScaleGreen,
                        position: 'relative' as const
                    } : {
                        clipPath: revealClipPath,
                        position: 'absolute' as const,
                        top: 0, left: 0, right: 0, bottom: 0,
                        willChange: "clip-path"
                    }}
                    className="relative md:absolute z-10 bg-[#022c22] flex items-center justify-center border-t border-emerald-500/10 shadow-[0_-50px_100px_rgba(16,185,129,0.1)] min-h-[100vh] md:min-h-0 py-20 md:py-0"
                >
                    {/* Light Sweep */}
                    <motion.div
                        style={{ x: sweepX, opacity: sweepOpacity }}
                        className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent skew-x-12"
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#064e3b_0%,#022c22_100%)]" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                    <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-20">
                        <div className="space-y-6 md:space-y-8">
                            <motion.div
                                style={isMobile ? {} : { opacity: solTitleOpacity, y: solTitleY }}
                                className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-[10px] text-emerald-400 font-mono tracking-[0.4em] uppercase"
                            >
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-3 shadow-[0_0_12px_#10b981]" />
                                AI-First & Performance
                            </motion.div>
                            <motion.h2
                                style={isMobile ? {} : { opacity: solTitleOpacity, y: solTitleY }}
                                className="text-5xl md:text-[6rem] font-bold tracking-tight text-white leading-tight md:leading-[0.85]"
                            >
                                Infraestructura <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-white to-white/40">
                                    de Conversión.
                                </span>
                            </motion.h2>
                            <motion.p
                                style={isMobile ? {} : { opacity: solTitleOpacity, y: solTitleY }}
                                className="text-xl text-white/70 md:text-white/50 leading-relaxed max-w-lg font-light"
                            >
                                Implementamos un &quot;equipo extendido&quot; de agentes IA y automatizaciones que califican, nutren y cierran oportunidades 24/7. Reducí tu CAC y multiplicá x21 tus ventas.
                            </motion.p>

                            <motion.div style={isMobile ? {} : { opacity: solBtnOpacity, y: solBtnY }}>
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-emerald-500 hover:bg-white text-black font-black rounded-full px-10 py-5 text-xl group transition-all duration-500 w-full md:w-auto flex items-center justify-center"
                                >
                                    ESCALAR AHORA
                                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </motion.div>
                        </div>

                        {/* System Pulse Card */}
                        <div className="relative mt-8 md:mt-0">
                            <div className="absolute -inset-10 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
                            <SystemPulseCard />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function ChaosGroup({ isMobile }: { isMobile: boolean }) {
    const icons = [FileWarning, MessageCircleOff, Hourglass, AlertTriangle, Database, Zap, FileSpreadsheet];
    const count = isMobile ? 4 : 7;

    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
            {icons.slice(0, count).map((Icon, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className="absolute"
                    style={{
                        top: `${20 + (i * 12) % 60}%`,
                        left: `${10 + (i * 18) % 80}%`,
                    }}
                >
                    <div className={`${i % 3 === 0 ? 'w-20 h-20' : 'w-12 h-12'} bg-red-950/40 border border-red-500/30 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl`}>
                        <Icon className="text-red-500/80 w-1/2 h-1/2" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function SystemPulseCard() {
    return (
        <div className="relative w-full max-w-md bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden group mx-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                <div className="space-y-1">
                    <div className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest">Estado del Sistema</div>
                    <div className="text-white font-bold tracking-tight">Sistema Optimizado</div>
                </div>
                <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
            </div>

            <div className="space-y-6">
                {['Captación', 'Nutrición', 'Conversión'].map((label, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono">
                            <span>{label}</span>
                            <span>100%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                                className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex items-end justify-between">
                <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Ganancia de Eficiencia</p>
                    <p className="text-4xl font-black text-white">+84%</p>
                </div>
                <div className="text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-xs font-mono">
                    LISTO PARA ESCALAR
                </div>
            </div>
        </div>
    );
}
