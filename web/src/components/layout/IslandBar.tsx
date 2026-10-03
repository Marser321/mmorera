"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, Sparkles, Cpu, User, Briefcase, MessageCircle, Moon, Sun } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const NAV_ITEMS = [
  { id: "hero", icon: Home, es: "Inicio", en: "Home" },
  { id: "servicios", icon: Layers, es: "Servicios", en: "Services" },
  { id: "orquestacion", icon: Sparkles, es: "Órbita", en: "Orbit" },
  { id: "simulador", icon: Cpu, es: "Simulador", en: "Simulator" },
  { id: "perfil", icon: User, es: "Perfil", en: "Profile" },
  { id: "proyectos", icon: Briefcase, es: "Casos", en: "Cases" },
  { id: "contacto", icon: MessageCircle, es: "Contacto", en: "Contact" },
];

export function IslandBar() {
  const { language } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const isEs = language === "es";

  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      { threshold: [0.15, 0.35, 0.6], rootMargin: "-15% 0px -35% 0px" }
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
    /* Contenedor exterior fixed con flex justify-center: garantiza centrado absoluto e inmune al override de transform */
    <div className="fixed inset-x-0 bottom-3 sm:bottom-6 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
      <motion.nav
        initial={{ y: 50, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label={isEs ? "Barra de navegación flotante" : "Floating navigation dock"}
        className="pointer-events-auto max-w-full"
      >
        <div className="flex items-center gap-0.5 sm:gap-1.5 rounded-full border border-white/14 bg-[#070809]/92 p-1 sm:p-2 shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-all duration-300 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/95 light:shadow-[0_12px_36px_rgb(20_23_26/0.18)]">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredId === item.id;
            const Icon = item.icon;
            const label = item[language];

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileTap={{ scale: 0.92 }}
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
                className={`group relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-2 py-1.5 sm:px-3.5 sm:py-2.5 text-xs sm:text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] ${
                  isActive
                    ? "text-signal font-semibold"
                    : "text-foreground/60 hover:text-foreground hover:bg-white/[0.06]"
                }`}
              >
                {/* Pill activo animado que se desliza suavemente */}
                {isActive && (
                  <motion.div
                    layoutId="active-island-pill"
                    className="absolute inset-0 rounded-full border border-signal/40 bg-signal/15 shadow-[0_0_14px_rgba(113,243,162,0.25)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}

                {/* Ícono con micro-interacción de elevación al hover y active */}
                <motion.div
                  animate={{
                    y: isHovered ? -4 : isActive ? -1.5 : 0,
                    scale: isHovered ? 1.15 : isActive ? 1.08 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 480, damping: 24 }}
                  className="relative z-10 flex items-center justify-center shrink-0"
                >
                  <Icon
                    className={`h-[17px] w-[17px] sm:h-5 sm:w-5 transition-colors ${
                      isActive ? "text-signal" : "text-foreground/70 group-hover:text-foreground"
                    }`}
                  />
                </motion.div>

                {/* Label textual en pantallas medianas/grandes */}
                <span
                  className={`relative z-10 whitespace-nowrap overflow-hidden transition-all duration-300 hidden md:inline ${
                    isActive ? "opacity-100 max-w-28 text-signal" : "opacity-70 group-hover:opacity-100 max-w-28 text-foreground/70 group-hover:text-foreground"
                  }`}
                >
                  {label}
                </span>

                {/* Micro-glow sutil en hover */}
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 rounded-full bg-white/[0.05] pointer-events-none"
                  />
                )}
              </motion.button>
            );
          })}

          {/* Separador vertical limpio */}
          <div className="mx-0.5 sm:mx-1 h-4 sm:h-5 w-px bg-white/15 light:bg-[rgb(var(--ink-rgb)/0.15)] shrink-0" />

          {/* Botón WhatsApp directo con efecto pulse */}
          <motion.a
            href="https://wa.me/59892323675?text=Hola%20Mario,%20estuve%20viendo%20tu%20web%20y%20quiero%20conversar%20sobre%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 px-2 sm:px-3.5 py-1.5 sm:py-2.5 text-xs sm:text-[13px] font-semibold text-[#25D366] hover:bg-[#25D366]/30 hover:shadow-[0_0_16px_rgba(37,211,102,0.35)] transition-all min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] shrink-0"
            title={isEs ? "Hablar por WhatsApp directo" : "Chat directly on WhatsApp"}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </span>
            <span className="hidden sm:inline">WhatsApp</span>
          </motion.a>

          {/* Toggle Modo Oscuro/Claro */}
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ y: -3, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="flex h-[38px] w-[38px] sm:h-[44px] sm:w-[44px] items-center justify-center rounded-full text-foreground/65 hover:text-foreground hover:bg-white/10 transition-colors shrink-0"
            title={theme === "light" ? (isEs ? "Modo oscuro" : "Dark mode") : (isEs ? "Modo claro" : "Light mode")}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {theme === "light" ? <Moon className="h-[18px] w-[18px] sm:h-5 sm:w-5" /> : <Sun className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-amber-300" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>
    </div>
  );
}
