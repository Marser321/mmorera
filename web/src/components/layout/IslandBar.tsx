"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Home, Briefcase, Sparkles, MessageCircle, Moon, Sun, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const NAV_ITEMS = [
  { id: "hero", icon: Home, es: "Inicio", en: "Home" },
  { id: "servicios", icon: Briefcase, es: "Servicios", en: "Services" },
  { id: "orquestacion", icon: Sparkles, es: "Órbita", en: "Orbit" },
  { id: "criterio", icon: Compass, es: "Criterio", en: "Strategy" },
  { id: "proyectos", icon: Sparkles, es: "Casos", en: "Cases" },
  { id: "contacto", icon: MessageCircle, es: "Contacto", en: "Contact" },
];

export function IslandBar() {
  const { language } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const isEs = language === "es";

  const [expanded, setExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const lastScrollYRef = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollYRef.current;
    if (Math.abs(delta) < 20) return;
    lastScrollYRef.current = latest;

    if (delta > 0 && latest > 200) {
      setExpanded(false);
    } else if (delta < 0) {
      setExpanded(true);
    }
  });

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: [0.1, 0.3, 0.6], rootMargin: "-20% 0px -40% 0px" }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isEs ? "Barra flotante de navegación" : "Floating navigation bar"}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div
        className={`flex items-center gap-1 rounded-full border border-white/12 bg-[#070809]/85 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/90 light:shadow-[0_8px_32px_rgb(20_23_26/0.15)] ${
          expanded ? "px-2.5 sm:px-4" : "px-2"
        }`}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          const label = item[language];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`relative flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "text-signal"
                  : "text-foreground/60 hover:text-foreground hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-island-pill"
                  className="absolute inset-0 rounded-full border border-signal/40 bg-signal/15"
                  transition={{ duration: 0.25 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              <span
                className={`relative z-10 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  expanded
                    ? "max-w-20 opacity-100 hidden sm:inline"
                    : isActive
                    ? "max-w-20 opacity-100 inline"
                    : "max-w-0 opacity-0 hidden"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}

        {/* Separador */}
        <div className="mx-1 h-4 w-px bg-white/15 light:bg-[rgb(var(--ink-rgb)/0.15)]" />

        {/* Botón WhatsApp directo */}
        <a
          href="https://wa.me/59892323675?text=Hola%20Mario,%20estuve%20viendo%20tu%20web%20y%20quiero%20conversar%20sobre%20un%20proyecto"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 px-3 py-1.5 text-xs font-medium text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
          title={isEs ? "Hablar por WhatsApp" : "Chat on WhatsApp"}
        >
          <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Toggle Modo Oscuro/Claro */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 hover:text-foreground hover:bg-white/10 transition-colors"
          title={theme === "light" ? "Modo oscuro" : "Modo claro"}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-300" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
}
