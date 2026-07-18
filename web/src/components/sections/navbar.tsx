"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { LogoMM } from "@/components/shared/LogoMM";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const labels = {
  es: { work: "Trabajo", systems: "Sistemas", studio: "Estudio", profile: "Perfil", cta: "Contame tu proyecto", menu: "Abrir menú", close: "Cerrar menú", toLight: "Cambiar a modo claro", toDark: "Cambiar a modo oscuro" },
  en: { work: "Work", systems: "Systems", studio: "Studio", profile: "Profile", cta: "Tell me about your project", menu: "Open menu", close: "Close menu", toLight: "Switch to light mode", toDark: "Switch to dark mode" },
};

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const copy = labels[language];
  const themeLabel = theme === "light" ? copy.toDark : copy.toLight;
  const links = [
    { label: copy.work, href: localePath(language, "/casos-de-exito") },
    { label: copy.systems, href: localePath(language, "/sistemas") },
    { label: copy.studio, href: localePath(language, "/estudio") },
    { label: copy.profile, href: `${localePath(language, "/")}#perfil` },
  ];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => {
    const route = href.split("#")[0];
    return route !== "/" && route !== "/en" && pathname.startsWith(route);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between rounded-xl border border-white/10 bg-background/72 px-4 shadow-[0_16px_46px_rgba(0,0,0,.24)] backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.1)] light:shadow-[0_1px_2px_rgb(20_23_26_/_0.06),0_12px_32px_rgb(20_23_26_/_0.1)] sm:px-5">
        <Link href={localePath(language, "/")} className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Mario Morera — Home">
          <LogoMM className="h-7 w-7 text-foreground transition-transform duration-500 group-hover:rotate-[-6deg]" />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">Mario Morera</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={`relative rounded-md py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(item.href) ? "text-foreground" : "text-foreground/58 hover:text-foreground"}`}>
              {item.label}
              {isActive(item.href) && <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-4 bg-accent" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-white/10 p-1 light:border-[rgb(var(--ink-rgb)/0.1)] sm:flex" aria-label={language === "es" ? "Cambiar idioma" : "Change language"}>
            {(["es", "en"] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setLanguage(lang)} aria-pressed={language === lang} className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${language === lang ? "bg-primary text-primary-foreground" : "text-foreground/45 hover:text-foreground"}`}>{lang}</button>
            ))}
          </div>
          <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className="hidden h-8 w-8 place-items-center rounded-full border border-white/10 text-foreground/58 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)] light:text-foreground/60 light:hover:text-foreground sm:grid">
            {theme === "light" ? <Moon className="h-[15px] w-[15px]" /> : <Sun className="h-[15px] w-[15px]" />}
          </button>
          <Link href={localePath(language, "/aplicar")} className="hidden rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex">
            {copy.cta}
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? copy.close : copy.menu} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)] lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 -z-10 flex min-h-[100dvh] flex-col bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 lg:hidden">
          <nav className="flex flex-1 flex-col justify-center gap-2" aria-label={language === "es" ? "Navegación móvil" : "Mobile navigation"}>
            {links.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-white/10 py-5 text-[clamp(2rem,9vw,4rem)] font-medium leading-none tracking-[-0.05em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.1)]">
                {item.label}<span className="font-mono text-xs text-foreground/35">0{index + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setOpen(false); setLanguage(language === "es" ? "en" : "es"); }} className="rounded-full border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground light:border-[rgb(var(--ink-rgb)/0.15)]">
                {language === "es" ? "English" : "Español"}
              </button>
              <button type="button" onClick={toggleTheme} aria-label={themeLabel} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-foreground light:border-[rgb(var(--ink-rgb)/0.15)]">
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>
            <Link href={localePath(language, "/aplicar")} onClick={() => setOpen(false)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">{copy.cta}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
