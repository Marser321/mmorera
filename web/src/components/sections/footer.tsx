'use client';

import { Instagram, Linkedin, Twitter, Mail } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { LogoMM } from '@/components/shared/LogoMM';

export function Footer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

    return (
        <footer ref={containerRef} className="relative bg-transparent pt-32 pb-12 overflow-hidden border-t border-white/5">
            {/* Background glow base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-emerald-500/10 rounded-[100%] blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <LogoMM className="w-12 h-12 text-white" />
                            <div className="flex flex-col -space-y-1">
                                <span className="text-2xl font-black tracking-tighter text-white">
                                    MMorera
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">
                                    SME Agency
                                </span>
                            </div>
                        </div>
                        <p className="text-white/40 max-w-sm font-light leading-relaxed">
                            No somos una agencia más. Somos el <span className="text-white font-medium italic">puente técnico</span> entre tu negocio tradicional y la vanguardia de la IA en 2026.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin, Mail].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold tracking-tight">Ecosistema</h4>
                        <ul className="space-y-4">
                            {['Servicios', 'Agentes', 'Filosofía', 'Precios'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/40 hover:text-white transition-colors text-sm font-light">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal / Contact */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold tracking-tight">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/40 hover:text-white transition-colors text-sm font-light">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-white/20 text-xs font-mono tracking-widest uppercase">
                        <span>® {new Date().getFullYear()} MMORERA SME AGENCY</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <span className="text-white/20 text-[10px] font-mono">FLOW: URUGUAY / GLOBAL</span>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-500/40 text-[10px] uppercase font-bold tracking-tighter">System Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
