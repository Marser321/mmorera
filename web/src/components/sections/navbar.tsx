"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cpu, Trophy, Send } from "lucide-react";
import { LogoMM } from '@/components/shared/LogoMM';

const NAV_ITEMS = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/sistemas", icon: Cpu, label: "Systems" },
    { href: "/casos-de-exito", icon: Trophy, label: "Case Studies" },
];

/** CTA del embudo de aplicación */
const CTA_ITEM = { href: "/aplicar", icon: Send, label: "Apply" };

const SCROLL_DELTA_THRESHOLD = 18;
const EXPAND_COLLAPSE_COOLDOWN = 420;

export function Navbar() {
    const [expanded, setExpanded] = useState(true);
    const pathname = usePathname();
    const expandedRef = useRef(expanded);
    const lastScrollYRef = useRef(0);
    const lastToggleAtRef = useRef(0);

    const { scrollY } = useScroll();

    const setExpandedStable = (next: boolean) => {
        if (expandedRef.current === next) return;
        expandedRef.current = next;
        setExpanded(next);
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollYRef.current;
        const delta = latest - previous;
        if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) return;

        lastScrollYRef.current = latest;

        const now = performance.now();
        if (now - lastToggleAtRef.current < EXPAND_COLLAPSE_COOLDOWN) return;

        if (delta > 0 && latest > 160) {
            lastToggleAtRef.current = now;
            setExpandedStable(false);
        } else if (delta < 0) {
            lastToggleAtRef.current = now;
            setExpandedStable(true);
        }
    });

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
            <motion.div
                className={`
          flex items-center justify-center gap-0.5 sm:gap-1
          bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-full transform-gpu
          transition-[padding,border-radius,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          max-w-[calc(100vw-1.5rem)] sm:max-w-none
          ${expanded
                        ? "px-2 py-2 rounded-[1.75rem] sm:px-6 sm:py-3"
                        : "px-2 py-2 rounded-full"
                    }
        `}
            >
                {/* Logo integrado en la isla */}
                <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                    relative flex items-center justify-center overflow-hidden transition-[width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${expanded ? "w-8 sm:w-10 opacity-100 mr-0.5 sm:mr-1" : "w-0 opacity-0 mr-0"}
                `}>
                    <LogoMM className="w-6 h-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                </motion.div>

                {/* Separator */}
                <div className={`
                     h-4 w-px bg-white/20 transition-[width,opacity,margin] duration-500 delay-100
                     ${expanded ? "opacity-100 mr-1" : "opacity-0 mr-0 w-0"}
                `} />

                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} passHref>
                            <motion.button
                                aria-label={item.label}
                                whileTap={{ scale: 0.9 }}
                                className={`
                                    relative flex items-center py-2 rounded-full h-9 sm:h-10
                                    transition-colors duration-300 cursor-pointer transform-gpu
                                    ${isActive
                                        ? "text-white"
                                        : "text-white/50 hover:text-white/80"
                                    }
                                    ${expanded ? "gap-1.5 px-2 sm:gap-2 sm:px-3" : "gap-0 px-2.5 sm:px-2.5"}
                                `}
                            >
                                {/* Indicador activo — glow detrás */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                )}

                                <span className="relative z-10 grid size-[18px] shrink-0 place-items-center sm:size-5">
                                    <Icon className="size-[18px] sm:size-5" />
                                </span>

                                {/* Label — solo visible cuando expanded */}
                                <span
                                    className={`
                                        relative z-10 hidden sm:inline-block text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden
                                        transition-[max-width,opacity,transform,margin] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                                        ${expanded ? "max-w-24 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-1"}
                                    `}
                                >
                                    {item.label}
                                </span>
                                
                                {/* Mobile Label — Solo el activo para ahorrar espacio */}
                                <span
                                    className={`
                                        relative z-10 inline-block sm:hidden text-[10px] font-medium whitespace-nowrap overflow-hidden
                                        transition-[max-width,opacity,transform,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                                        ${expanded && isActive ? "max-w-16 opacity-100 translate-x-0 ml-1" : "max-w-0 opacity-0 -translate-x-1 ml-0"}
                                    `}
                                >
                                    {item.label}
                                </span>
                            </motion.button>
                        </Link>
                    );
                })}

                {/* Separator antes del CTA */}
                <div className={`
                     h-4 w-px bg-white/20 transition-[width,opacity,margin] duration-500 delay-100
                     ${expanded ? "opacity-100 ml-1" : "opacity-0 ml-0 w-0"}
                `} />

                {/* CTA — Embudo de Aplicación */}
                <Link href={CTA_ITEM.href} passHref>
                    <motion.button
                        aria-label={CTA_ITEM.label}
                        whileTap={{ scale: 0.9 }}
                        className={`
                            relative flex items-center py-2 rounded-full h-9 sm:h-10
                            bg-emerald-500/20 border border-emerald-500/30 text-emerald-300
                            hover:bg-emerald-500/30 hover:border-emerald-400/50 hover:text-emerald-200
                            transition-all duration-300 cursor-pointer transform-gpu
                            shadow-[0_0_12px_rgba(16,185,129,0.15)]
                            ${pathname === CTA_ITEM.href ? "bg-emerald-500/30 border-emerald-400/50 text-emerald-200" : ""}
                            ${expanded ? "gap-1.5 px-3 sm:gap-2 sm:px-4" : "gap-0 px-2.5 sm:px-3"}
                        `}
                    >
                        {/* Pulse ring animado */}
                        <span className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping opacity-30" />
                        <span className="relative z-10 grid size-4 shrink-0 place-items-center">
                            <CTA_ITEM.icon className="size-4" />
                        </span>
                        <span
                            className={`
                                relative z-10 hidden sm:inline-block text-xs font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden
                                transition-[max-width,opacity,transform,margin] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                                ${expanded ? "max-w-20 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-1"}
                            `}
                        >
                            {CTA_ITEM.label}
                        </span>
                    </motion.button>
                </Link>
            </motion.div>
        </motion.nav>
    );
}
