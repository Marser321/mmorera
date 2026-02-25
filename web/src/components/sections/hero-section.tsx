'use client';

import { ArrowRight, Eye } from 'lucide-react';
import { motion, useScroll, useTransform, LazyMotion } from 'framer-motion';
import { useRef, Fragment } from 'react';
import { cn } from '@/lib/utils';

const loadFeatures = () =>
    import('framer-motion').then((res) => res.domAnimation);

const HERO_CONTENT = {
    badge: 'Resultados reales · IA sin humo',
    title: ['Aumentá tu ', 'ROI medible', ' sin inflar tu nómina'],
    subtitle: 'Infraestructura de conversión B2B: automatizamos tus campañas, pruebas A/B y seguimiento de leads con un equipo extendido. Dejamos de adivinar y empezamos a escalar.',
};

const METRICAS = [
    { valor: '+80%', label: 'Leads cualificados' },
    { valor: '<5 min', label: 'Tiempo de respuesta' },
    { valor: '-35%', label: 'Costos operativos' },
] as const;

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const containerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const containerY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    return (
        <LazyMotion features={loadFeatures}>
            <section
                ref={containerRef}
                className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-20 bg-mesh noise-overlay"
                aria-labelledby="hero-heading"
            >
                {/* Decoración de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]"
                    />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                </div>

                <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center">
                    <motion.div
                        style={{ opacity: containerOpacity, y: containerY }}
                        className="text-center mb-12 max-w-4xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[10px] font-bold text-emerald-500 backdrop-blur-xl mb-8 tracking-[0.3em] uppercase">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-3 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                {HERO_CONTENT.badge}
                            </div>
                        </motion.div>

                        {/* Título principal */}
                        <motion.h1
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase"
                        >
                            {HERO_CONTENT.title[0]}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white/40">
                                {HERO_CONTENT.title[1]}
                            </span>
                            <br />
                            {HERO_CONTENT.title[2]}
                        </motion.h1>

                        {/* Subtítulo */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto max-w-[700px] text-lg md:text-xl text-white/40 mb-12 leading-relaxed font-light"
                        >
                            &ldquo;{HERO_CONTENT.subtitle}&rdquo;
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group liquid-glass px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest text-white border-white/20 hover:border-emerald-500/50 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.1)] active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-3 justify-center">
                                    Solicitar Auditoría de IA <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500 text-emerald-400" />
                                </span>
                            </button>

                            <button
                                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest border border-white/5 hover:bg-white/5 transition-all duration-500 text-white/40 hover:text-white"
                            >
                                <Eye className="inline mr-2 w-4 h-4" /> Ver Ecosistemas
                            </button>
                        </motion.div>

                        {/* Métricas rápidas — prueba social */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/5 w-full max-w-lg mx-auto"
                        >
                            {METRICAS.map((m) => (
                                <div key={m.label} className="flex flex-col items-center gap-1">
                                    <span className="font-mono text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white/60 sm:text-3xl">
                                        {m.valor}
                                    </span>
                                    <span className="text-xs text-white/30 sm:text-sm">
                                        {m.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Indicadores técnicos */}
                <div className="absolute bottom-12 left-12 hidden xl:block">
                    <div className="flex flex-col gap-2 font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-white/10" />
                            System Architecture: 0.5.4v
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-white/10" />
                            Core Engine: Pulse
                        </div>
                    </div>
                </div>
            </section>
        </LazyMotion>
    );
}
