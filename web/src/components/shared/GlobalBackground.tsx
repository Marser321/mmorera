'use client';

import { motion } from 'framer-motion';
import { Mail, Database, MessageSquare, Calendar, DollarSign, Sparkles, Share2, Zap, BrainCircuit, LineChart, Code } from 'lucide-react';
import { SiAdobephotoshop, SiAdobeillustrator, SiAdobepremierepro, SiAdobeaftereffects, SiDavinciresolve, SiWordpress, SiGoogleads, SiShopify, SiFigma, SiSupabase, SiVercel, SiZapier } from 'react-icons/si';
import { FaMeta, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

const FLOATING_ICONS = [
    // Marketing & Ventas (Lucide)
    { icon: Mail, color: 'text-blue-500/30' },
    { icon: Sparkles, color: 'text-indigo-500/30' },
    { icon: Database, color: 'text-violet-500/30' },
    { icon: MessageSquare, color: 'text-green-500/30' },
    { icon: Calendar, color: 'text-orange-500/30' },
    { icon: Share2, color: 'text-pink-500/30' },
    { icon: DollarSign, color: 'text-cyan-500/30' },
    { icon: Zap, color: 'text-emerald-500/30' },
    { icon: BrainCircuit, color: 'text-purple-500/30' },
    { icon: LineChart, color: 'text-rose-500/30' },
    { icon: Code, color: 'text-zinc-500/30' },

    // Suite Meta & Redes Sociales
    { icon: FaMeta, color: 'text-blue-500/25' },
    { icon: FaFacebook, color: 'text-blue-600/25' },
    { icon: FaInstagram, color: 'text-pink-600/25' },
    { icon: FaTiktok, color: 'text-white/20' },

    // Edición Audiovisual (Adobe & DaVinci)
    { icon: SiAdobephotoshop, color: 'text-blue-400/25' },
    { icon: SiAdobeillustrator, color: 'text-orange-400/25' },
    { icon: SiAdobepremierepro, color: 'text-purple-400/25' },
    { icon: SiAdobeaftereffects, color: 'text-violet-500/25' },
    { icon: SiDavinciresolve, color: 'text-red-500/25' },

    // E-commerce, Web & Plataformas
    { icon: SiWordpress, color: 'text-sky-500/25' },
    { icon: SiGoogleads, color: 'text-blue-500/25' },
    { icon: SiShopify, color: 'text-green-500/25' },
    { icon: SiFigma, color: 'text-orange-500/25' },

    // Tech & Automatización
    { icon: SiSupabase, color: 'text-emerald-500/25' },
    { icon: SiVercel, color: 'text-white/20' },
    { icon: SiZapier, color: 'text-orange-600/25' }
];

export function GlobalBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
            {/* Fondo de circuito técnico (Grid) */}
            <div className="absolute inset-0 opacity-[0.15]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="circuit-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 0 50 L 50 50 M 50 0 L 50 50 M 50 50 L 100 50 M 50 50 L 50 100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-white" />
                            <circle cx="50" cy="50" r="1.5" fill="currentColor" fillOpacity="0.4" className="text-white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit-bg)" />
                </svg>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-accent/5 blur-[120px] rounded-full mix-blend-screen" />

            {/* Iconos flotantes decorativos */}
            {FLOATING_ICONS.map((item, index) => {
                const Icon = item.icon;
                // Distribuir más iconos ocupando todo el ancho y alto del viewport
                const totalIcons = FLOATING_ICONS.length;
                const gridCols = Math.ceil(Math.sqrt(totalIcons * 2)); // Grid virtual

                // Distribución para cubrir pantalla completa
                const col = index % gridCols;
                const row = Math.floor(index / gridCols);

                // Mapear grid a porcentajes de posición X e Y (evitando los bordes de la pantalla extremos)
                const posX = 5 + (col * (90 / gridCols)) + ((row % 2) * 5);
                const posY = 5 + (index * (90 / totalIcons)) + (Math.sin(index) * 5);

                const duration = 20 + (index % 15) * 2;
                const size = index % 3 === 0 ? 'w-10 h-10 md:w-14 md:h-14' : 'w-6 h-6 md:w-8 md:h-8';

                return (
                    <motion.div
                        key={index}
                        className={`absolute ${item.color}`}
                        style={{ left: `${posX}%`, top: `${posY}%` }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, 20, 0],
                            rotate: [-5, 5, -5],
                            opacity: [0.1, 0.4, 0.1]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                        }}
                    >
                        <Icon className={`${size} blur-[1px]`} />
                    </motion.div>
                );
            })}
        </div>
    );
}
