"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, MoreHorizontal, Sun, X } from "lucide-react";
import { LogoMM } from "@/components/shared/LogoMM";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const labels = {
  es: {
    work: "Trabajo", systems: "Sistemas", studio: "Estudio", profile: "Perfil",
    cta: "Hablemos", menu: "Abrir menú", close: "Cerrar menú", utility: "Abrir utilidades",
    toLight: "Cambiar a modo claro", toDark: "Cambiar a modo oscuro", language: "Idioma", theme: "Tema",
  },
  en: {
    work: "Work", systems: "Systems", studio: "Studio", profile: "Profile",
    cta: "Let’s talk", menu: "Open menu", close: "Close menu", utility: "Open utilities",
    toLight: "Switch to light mode", toDark: "Switch to dark mode", language: "Language", theme: "Theme",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const utilityRef = useRef<HTMLDivElement>(null);
  const utilityButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const copy = labels[language];
  const themeLabel = theme === "light" ? copy.toDark : copy.toLight;
  const primaryLinks = [
    { label: copy.work, href: localePath(language, "/casos-de-exito") },
    { label: copy.systems, href: localePath(language, "/sistemas") },
    { label: copy.studio, href: localePath(language, "/estudio") },
  ];
  const profileLink = { label: copy.profile, href: `${localePath(language, "/")}#perfil` };
  const mobileLinks = [...primaryLinks, profileLink];

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        window.requestAnimationFrame(() => mobileButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const menu = document.getElementById("mobile-menu");
      const controls = menu ? [...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')] : [];
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!utilityOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!utilityRef.current?.contains(event.target as Node)) setUtilityOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUtilityOpen(false);
        utilityButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [utilityOpen]);

  const isActive = (href: string) => {
    const route = href.split("#")[0];
    return route !== "/" && route !== "/en" && pathname.startsWith(route);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between rounded-xl border border-white/10 bg-background/72 px-4 shadow-[0_16px_46px_rgba(0,0,0,.24)] backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.1)] light:shadow-[0_1px_2px_rgb(20_23_26_/_0.06),0_12px_32px_rgb(20_23_26_/_0.1)] sm:px-5">
        <Link href={localePath(language, "/")} className="group rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Mario Morera — Home">
          <LogoMM className="h-7 w-7 text-foreground transition-transform duration-500 group-hover:rotate-[-6deg] motion-reduce:transition-none" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className={`relative rounded-md py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(item.href) ? "text-foreground" : "text-foreground/58 hover:text-foreground"}`}>
              {item.label}
              {isActive(item.href) && <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 mx-auto h-px w-4 bg-accent" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={localePath(language, "/aplicar")} className="hidden rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none lg:inline-flex">
            {copy.cta}
          </Link>

          <div ref={utilityRef} className="relative hidden lg:block">
            <button ref={utilityButtonRef} type="button" onClick={() => setUtilityOpen((value) => !value)} aria-expanded={utilityOpen} aria-controls="desktop-utility-menu" aria-label={copy.utility} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-foreground/62 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)]">
              <MoreHorizontal aria-hidden="true" className="h-5 w-5" />
            </button>
            {utilityOpen && (
              <div id="desktop-utility-menu" className="absolute right-0 top-12 w-64 rounded-2xl border border-white/12 bg-popover p-2 text-popover-foreground shadow-[0_24px_64px_rgba(0,0,0,.32)] light:border-[rgb(var(--ink-rgb)/0.12)]">
                <Link href={profileLink.href} onClick={() => setUtilityOpen(false)} className="flex rounded-xl px-3 py-3 text-sm transition-colors hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:hover:bg-[rgb(var(--ink-rgb)/0.06)]">{profileLink.label}</Link>
                <div className="my-2 h-px bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
                <div className="flex items-center justify-between gap-4 px-3 py-2">
                  <span className="font-mono text-[9px] uppercase tracking-[.16em] text-foreground/42">{copy.language}</span>
                  <div className="flex gap-1">
                    {(["es", "en"] as const).map((lang) => (
                      <button key={lang} type="button" onClick={() => { setLanguage(lang); setUtilityOpen(false); }} aria-pressed={language === lang} className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.12em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${language === lang ? "bg-primary text-primary-foreground" : "text-foreground/48 hover:text-foreground"}`}>{lang}</button>
                    ))}
                  </div>
                </div>
                <button type="button" onClick={() => { toggleTheme(); setUtilityOpen(false); }} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:hover:bg-[rgb(var(--ink-rgb)/0.06)]">
                  <span>{copy.theme}</span>
                  <span className="flex items-center gap-2 text-foreground/48">{theme === "light" ? copy.toDark : copy.toLight}{theme === "light" ? <Moon aria-hidden="true" className="h-4 w-4" /> : <Sun aria-hidden="true" className="h-4 w-4" />}</span>
                </button>
              </div>
            )}
          </div>

          <button ref={mobileButtonRef} type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? copy.close : copy.menu} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)] lg:hidden">
            {mobileOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-0 -z-10 flex min-h-[100dvh] flex-col overscroll-contain bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 lg:hidden">
          <nav className="flex flex-1 flex-col justify-center gap-2" aria-label={language === "es" ? "Navegación móvil" : "Mobile navigation"}>
            {mobileLinks.map((item, index) => (
              <Link ref={index === 0 ? firstMobileLinkRef : undefined} key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-5 text-[clamp(2rem,9vw,4rem)] font-medium leading-none tracking-[-0.05em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.1)]">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setMobileOpen(false); setLanguage(language === "es" ? "en" : "es"); }} className="rounded-full border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.15)]">
                {language === "es" ? "English" : "Español"}
              </button>
              <button type="button" onClick={toggleTheme} aria-label={themeLabel} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.15)]">
                {theme === "light" ? <Moon aria-hidden="true" className="h-4 w-4" /> : <Sun aria-hidden="true" className="h-4 w-4" />}
              </button>
            </div>
            <Link href={localePath(language, "/aplicar")} onClick={() => setMobileOpen(false)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{copy.cta}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
