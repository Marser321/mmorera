"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cpu, Trophy, Send, Palette } from "lucide-react";
import { LogoMM } from '@/components/shared/LogoMM';
import { useLanguage } from '@/context/LanguageContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const HOME_ITEM = { href: "/", icon: Home, label: "Home" };
const STUDIO_ITEM = { href: "/estudio", icon: Palette, label: "Studio" };
const SYSTEMS_ITEM = { href: "/sistemas", icon: Cpu, label: "Systems" };
const CASES_ITEM = { href: "/casos-de-exito", icon: Trophy, label: "Case Studies" };

/** CTA del embudo de aplicación */
const CTA_ITEM = { href: "/aplicar", icon: Send, label: "Apply" };

const SCROLL_DELTA_THRESHOLD = 18;
const EXPAND_COLLAPSE_COOLDOWN = 420;

export function Navbar() {
    const { t } = useLanguage();
    const [expanded, setExpanded] = useState(true);
    const pathname = usePathname();
    const isMobileNav = useMediaQuery('(max-width: 639px)');

    const navItems = [HOME_ITEM, SYSTEMS_ITEM, STUDIO_ITEM, CASES_ITEM];
    const navExpanded = isMobileNav ? false : expanded;
    const expandedRef = useRef(expanded);
    const lastScrollYRef = useRef(0);
    const lastToggleAtRef = useRef(0);

    const getTranslationKey = (label: string) => {
        if (label === "Home") return "home";
        if (label === "Studio") return "studio";
        if (label === "Systems") return "systems";
        if (label === "Case Studies") return "cases";
        if (label === "Apply") return "apply";
        return label.toLowerCase();
    };

    const { scrollY } = useScroll();

    const setExpandedStable = (next: boolean) => {
        if (expandedRef.current === next) return;
        expandedRef.current = next;
        setExpanded(next);
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (isMobileNav) return;
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
          flex items-center justify-center gap-1
          bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-full transform-gpu
          transition-[padding,border-radius,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          max-w-[calc(100vw-1.5rem)] sm:max-w-none
          ${navExpanded
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
                    relative hidden items-center justify-center overflow-hidden transition-[width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex
                    ${navExpanded ? "sm:w-10 sm:opacity-100 sm:mr-1" : "sm:w-0 sm:opacity-0 sm:mr-0"}
                `}>
                    <LogoMM className="w-6 h-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                </motion.div>

                {/* Separator */}
                <div className={`
                     hidden h-4 w-px bg-white/20 transition-[width,opacity,margin] duration-500 delay-100 sm:block
                     ${navExpanded ? "opacity-100 mr-1" : "opacity-0 mr-0 w-0"}
                `} />

                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} passHref>
                            <motion.button
                                aria-label={item.label}
                                whileTap={{ scale: 0.9 }}
                                className={`
                                    relative flex h-10 w-10 items-center justify-center rounded-full py-2 sm:h-10 sm:w-auto
                                    transition-colors duration-300 cursor-pointer transform-gpu
                                    ${isActive
                                        ? "text-white"
                                        : "text-white/50 hover:text-white/80"
                                    }
                                    ${navExpanded ? "gap-1.5 px-2 sm:gap-2 sm:px-3" : "gap-0 px-0 sm:px-2.5"}
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
                                        ${navExpanded ? "max-w-24 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-1"}
                                    `}
                                >
                                    {t('navbar', getTranslationKey(item.label))}
                                </span>
                            </motion.button>
                        </Link>
                    );
                })}

                {/* Separator antes del CTA */}
                <div className={`
                     hidden h-4 w-px bg-white/20 transition-[width,opacity,margin] duration-500 delay-100 sm:block
                     ${navExpanded ? "opacity-100 ml-1" : "opacity-0 ml-0 w-0"}
                `} />

                {/* CTA — Embudo de Aplicación */}
                <Link href={CTA_ITEM.href} passHref>
                    <motion.button
                        aria-label={t('navbar', getTranslationKey(CTA_ITEM.label))}
                        whileTap={{ scale: 0.9 }}
                        className={`
                            relative flex h-10 w-10 items-center justify-center rounded-full py-2 sm:h-10 sm:w-auto
                            bg-emerald-500/20 border border-emerald-500/30 text-emerald-300
                            hover:bg-emerald-500/30 hover:border-emerald-400/50 hover:text-emerald-200
                            transition-all duration-300 cursor-pointer transform-gpu
                            shadow-[0_0_12px_rgba(16,185,129,0.15)]
                            ${pathname === CTA_ITEM.href ? "bg-emerald-500/30 border-emerald-400/50 text-emerald-200" : ""}
                            ${navExpanded ? "gap-1.5 px-3 sm:gap-2 sm:px-4" : "gap-0 px-0 sm:px-3"}
                        `}
                    >
                        {/* Pulse ring animado */}
                        <span className="absolute inset-0 hidden rounded-full border border-emerald-400/20 animate-ping opacity-30 sm:block" />
                        <span className="relative z-10 grid size-4 shrink-0 place-items-center">
                            <CTA_ITEM.icon className="size-4" />
                        </span>
                        <span
                            className={`
                                relative z-10 hidden sm:inline-block text-xs font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden
                                transition-[max-width,opacity,transform,margin] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                                ${navExpanded ? "max-w-20 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-1"}
                            `}
                        >
                            {t('navbar', getTranslationKey(CTA_ITEM.label))}
                        </span>
                    </motion.button>
                </Link>
            </motion.div>
        </motion.nav>
    );
}
