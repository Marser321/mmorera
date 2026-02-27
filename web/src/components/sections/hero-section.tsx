'use client';

import { ArrowRight, Eye } from 'lucide-react';
import { HeroNeuralSVG } from './HeroNeuralSVG';
import { motion, useScroll, useTransform, LazyMotion } from 'framer-motion';
import { useRef } from 'react';


const loadFeatures = () =>
    import('framer-motion').then((res) => res.domAnimation);

const HERO_CONTENT = {
    badge: 'Resultados reales · ROI comprobable',
    title: ['Tu competencia ya ', 'automatizó.', ' ¿Seguís perdiendo?'],
    subtitle: 'Implementamos agentes IA que califican, nutren y cierran ventas 24/7. Tu equipo deja de perseguir y empieza a cerrar.',
};



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
                {/* Decoración de fondo Avanzada (Vortex & Mesh) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-black/50">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 right-[10%] w-[800px] h-[800px] bg-[conic-gradient(at_center,transparent_20%,rgba(16,185,129,0.15)_50%,transparent_100%)] rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.1, 0.3, 0.1],
                            rotate: [0, -90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)] rounded-full blur-[120px]"
                    />
                    {/* Dark grid overlay para textura premium */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
                </div>

                {/* Red Neuronal SVG Animada */}
                <HeroNeuralSVG />

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
                                    Quiero mi Diagnóstico Gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500 text-emerald-400" />
                                </span>
                            </button>

                            <button
                                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest border border-white/5 hover:bg-white/5 transition-all duration-500 text-white/40 hover:text-white"
                            >
                                <Eye className="inline mr-2 w-4 h-4" /> Mirá cómo funciona →
                            </button>
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
