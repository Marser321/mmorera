'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Footer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end end'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

    return (
        <footer ref={containerRef} className="relative bg-black pt-32 pb-12 overflow-hidden border-t border-white/5">
            {/* Background glow base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-emerald-500/10 rounded-[100%] blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 flex flex-col justify-between h-full min-h-[60vh]">

                {/* Top Section: CTA + Minimal Links */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-auto">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                            ¿Listo para dejar <br className="hidden md:block" /> de perder dinero?
                        </h2>
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors duration-500"
                        >
                            Agendar Llamada
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="flex flex-col md:items-end justify-between space-y-12 md:space-y-0">
                        {/* Status Sci-fi Component */}
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-emerald-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            SYSTEM_ONLINE // V.2.0.1
                        </div>

                        {/* Social Links Minimum */}
                        <div className="flex gap-4">
                            <Link href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all group">
                                <Instagram className="w-5 h-5 text-white/50 group-hover:text-pink-500 transition-colors" />
                            </Link>
                            <Link href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all group">
                                <Linkedin className="w-5 h-5 text-white/50 group-hover:text-blue-500 transition-colors" />
                            </Link>
                            <Link href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all group">
                                <Twitter className="w-5 h-5 text-white/50 group-hover:text-sky-500 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: MEGA TYPE */}
                <motion.div
                    style={{ y, opacity }}
                    className="w-full mt-20 flex justify-center items-end overflow-hidden"
                >
                    <h1 className="text-[18vw] leading-none font-black text-white/5 hover:text-white/10 transition-colors duration-700 select-none tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>
                        NEXO<span className="text-emerald-500/20">.</span>
                    </h1>
                </motion.div>

                {/* Legal Strip */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-widest text-white/20 border-t border-white/5 pt-4">
                    <span>® {new Date().getFullYear()} NEXO DIGITAL AGENCY</span>
                    <div className="flex gap-4 mt-2 md:mt-0 opacity-50">
                        <Link href="#" className="hover:text-white transition-colors">PRIVACIDAD</Link>
                        <Link href="#" className="hover:text-white transition-colors">TÉRMINOS</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
