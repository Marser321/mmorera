"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════
 * TRUSTED BY STRIP
 * Marquee infinito de logos de herramientas del stack.
 * SVGs inline con efecto escala de grises → color en hover.
 * ═══════════════════════════════════════════════════ */

interface TechLogo {
    name: string;
    svg: React.ReactNode;
}

// Logos SVG simplificados del stack tecnológico
const techLogos: TechLogo[] = [
    {
        name: "Next.js",
        svg: (
            <svg viewBox="0 0 180 180" className="w-8 h-8" fill="currentColor">
                <path d="M75.2 34L148 130.7l-10 7.3L63.6 34h11.6zM108 34h11.6L75.2 96.3 63.6 82.7 108 34z" />
                <circle cx="90" cy="90" r="85" fill="none" stroke="currentColor" strokeWidth="6" />
            </svg>
        ),
    },
    {
        name: "Supabase",
        svg: (
            <svg viewBox="0 0 109 113" className="w-8 h-8" fill="none">
                <path d="M63.7 110.3c-2.6 3.3-8.1 1.5-8.1-2.7V69.7h51.8c4.7 0 7.2 5.5 4.2 9.1L63.7 110.3z" fill="url(#supa-a)" />
                <path d="M63.7 110.3c-2.6 3.3-8.1 1.5-8.1-2.7V69.7h51.8c4.7 0 7.2 5.5 4.2 9.1L63.7 110.3z" fill="currentColor" fillOpacity="0.2" />
                <path d="M45.3 2.7c2.6-3.3 8.1-1.5 8.1 2.7v37.9H1.6c-4.7 0-7.2-5.5-4.2-9.1L45.3 2.7z" fill="currentColor" />
                <defs>
                    <linearGradient id="supa-a" x1="53.97" y1="82.6" x2="94.17" y2="97.98" gradientUnits="userSpaceOnUse">
                        <stop stopColor="currentColor" stopOpacity="0.6" />
                        <stop offset="1" stopColor="currentColor" />
                    </linearGradient>
                </defs>
            </svg>
        ),
    },
    {
        name: "OpenAI",
        svg: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M22.28 9.37a5.88 5.88 0 0 0-.51-4.87 5.96 5.96 0 0 0-6.41-2.81A5.88 5.88 0 0 0 10.93 0a5.96 5.96 0 0 0-5.69 4.1 5.88 5.88 0 0 0-3.93 2.84 5.96 5.96 0 0 0 .73 6.96 5.88 5.88 0 0 0 .51 4.87 5.96 5.96 0 0 0 6.41 2.81A5.88 5.88 0 0 0 13.39 24a5.96 5.96 0 0 0 5.69-4.1 5.88 5.88 0 0 0 3.93-2.84 5.96 5.96 0 0 0-.73-6.96v-.73zM13.39 22.34a4.41 4.41 0 0 1-2.83-1.02l.14-.08 4.71-2.72a.77.77 0 0 0 .39-.67v-6.63l1.99 1.15a.07.07 0 0 1 .04.06v5.51a4.44 4.44 0 0 1-4.44 4.4zM3.73 18.25a4.41 4.41 0 0 1-.53-2.97l.14.08 4.71 2.72a.77.77 0 0 0 .77 0l5.75-3.32v2.3a.07.07 0 0 1-.03.06l-4.76 2.75a4.44 4.44 0 0 1-6.05-1.62zM2.35 7.88a4.41 4.41 0 0 1 2.3-1.94v5.6a.77.77 0 0 0 .38.67l5.75 3.32-1.99 1.15a.07.07 0 0 1-.07 0L3.96 13.93a4.44 4.44 0 0 1-1.61-6.05zm16.48 3.84-5.75-3.32 1.99-1.15a.07.07 0 0 1 .07 0l4.76 2.75a4.44 4.44 0 0 1-.68 8.02v-5.63a.77.77 0 0 0-.39-.67zM20.8 9.5l-.14-.08-4.71-2.72a.77.77 0 0 0-.77 0L9.43 10.02V7.72a.07.07 0 0 1 .03-.06l4.76-2.75a4.44 4.44 0 0 1 6.58 4.59zM8.3 13.38l-1.99-1.15a.07.07 0 0 1-.04-.06V6.66a4.44 4.44 0 0 1 7.29-3.4l-.14.08-4.71 2.72a.77.77 0 0 0-.39.67l-.02 6.65zM9.43 11.7l2.56-1.48 2.56 1.48v2.96l-2.56 1.48-2.56-1.48V11.7z" />
            </svg>
        ),
    },
    {
        name: "n8n",
        svg: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H8v-4h3v4zm5 0h-3v-4h3v4zm0-6H8V8h8v2z" />
            </svg>
        ),
    },
    {
        name: "WhatsApp API",
        svg: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M17.47 14.38l-2.38-.7a1 1 0 0 0-.97.24l-.56.52a10.1 10.1 0 0 1-3.02-3.02l.52-.56a1 1 0 0 0 .24-.97l-.7-2.38a1 1 0 0 0-.95-.7h-1.1a1.5 1.5 0 0 0-1.5 1.66 13.76 13.76 0 0 0 12.02 12.02 1.5 1.5 0 0 0 1.66-1.5v-1.1a1 1 0 0 0-.7-.95z" />
                <path d="M12 2a10 10 0 0 1 10 10 1 1 0 0 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1 0-2z" />
                <path d="M12 6a6 6 0 0 1 6 6 1 1 0 0 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1 0-2z" />
            </svg>
        ),
    },
    {
        name: "Vercel",
        svg: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M12 1L24 22H0L12 1z" />
            </svg>
        ),
    },
    {
        name: "Framer Motion",
        svg: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M4 0h16v8H12L4 0zM4 8h8l8 8H4V8zM4 16h8l-8 8v-8z" />
            </svg>
        ),
    },
    {
        name: "Google AI",
        svg: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M12 11h8.53a10.47 10.47 0 0 1-3.59 8.18A7.34 7.34 0 0 1 12 21a9 9 0 0 1 0-18 8.68 8.68 0 0 1 6.07 2.39L15.65 7.8A5.22 5.22 0 0 0 12 6.36a5.64 5.64 0 1 0 5.76 6.64H12V11z" />
            </svg>
        ),
    },
];

// Duplicar para marquee infinito
const duplicatedLogos = [...techLogos, ...techLogos];

export function TrustedByStrip() {
    return (
        <section className="py-10 relative bg-black overflow-hidden border-y border-white/5">
            {/* Label */}
            <div className="text-center mb-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/25">
                    Infraestructura que usan las empresas líderes
                </span>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden">
                {/* Gradient fade izquierda */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
                {/* Gradient fade derecha */}
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />

                {/* Marquee Track */}
                <motion.div
                    className="flex items-center gap-12 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedLogos.map((logo, i) => (
                        <div
                            key={`${logo.name}-${i}`}
                            className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-500 group cursor-default shrink-0"
                        >
                            <div className="text-white/25 group-hover:text-white/80 transition-colors duration-500">
                                {logo.svg}
                            </div>
                            <span className="text-xs font-medium text-white/20 group-hover:text-white/60 transition-colors duration-500 whitespace-nowrap">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
