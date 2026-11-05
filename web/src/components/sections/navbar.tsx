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
    services: "Servicios", work: "Casos", successCases: "Casos de éxito", useCases: "Casos de uso", capabilities: "Capacidades", explore: "Explora",
    systems: "Automatización y CRM", studio: "Webs y landings", agents: "Agentes de IA", content: "Contenido con IA", campaigns: "Campañas con IA", profile: "Sobre mí · CV",
    cta: "Hablemos", menu: "Abrir menú", close: "Cerrar menú", utility: "Abrir utilidades",
    toLight: "Cambiar a modo claro", toDark: "Cambiar a modo oscuro", language: "Idioma", theme: "Tema",
  },
  en: {
    services: "Services", work: "Cases", successCases: "Case studies", useCases: "Use cases", capabilities: "Capabilities", explore: "Explore",
    systems: "Automation & CRM", studio: "Websites & landing pages", agents: "AI agents", content: "AI content", campaigns: "AI campaigns", profile: "About · Resume",
    cta: "Let's talk", menu: "Open menu", close: "Close menu", utility: "Open utilities",
    toLight: "Switch to light mode", toDark: "Switch to dark mode", language: "Language", theme: "Theme",
  },
};

type NavLink = { label: string; href: string };

/** Desplegable del menú de escritorio: flechas, Home/End y Escape, como un menú de navegación. */
function NavDropdown({ id, label, links, active }: { id: string; label: string; links: NavLink[]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function openMenu(last = false) {
    setOpen(true);
    requestAnimationFrame(() => {
      const items = ref.current?.querySelectorAll<HTMLAnchorElement>("a");
      items?.[last ? items.length - 1 : 0]?.focus();
    });
  }

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onBlur={(event) => {
      // Safari no enfoca el enlace que se toca: el foco se pierde sin destino
      // (relatedTarget null). Cerrar ahí quitaría el enlace antes del clic. Solo se
      // cierra si el foco fue a otro lado; los toques afuera los cierra el pointerdown.
      const next = event.relatedTarget as Node | null;
      if (next && !event.currentTarget.contains(next)) setOpen(false);
    }} onKeyDown={(event) => {
      const items = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>("a")];
      const index = items.indexOf(document.activeElement as HTMLAnchorElement);
      if (index < 0 || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    }}>
      <button ref={buttonRef} type="button" aria-expanded={open} aria-controls={id} onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); openMenu(event.key === "ArrowUp"); }
      }} className={`flex min-h-11 items-center gap-1 rounded-md text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "text-foreground" : "text-foreground/75"}`}>
        {label}<span aria-hidden="true">▾</span>
      </button>
      {open && <div id={id} className="absolute left-0 top-full w-72 rounded-xl border border-foreground/15 bg-popover p-2 shadow-lg">
        {links.map((item) => <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.label}</Link>)}
      </div>}
    </div>
  );
}

function PrimaryLink({ item, active }: { item: NavLink; active: boolean }) {
  return (
    <Link href={item.href} className={`relative rounded-md py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "text-foreground" : "text-foreground/58 hover:text-foreground"}`}>
      {item.label}
      {active && <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 mx-auto h-px w-4 bg-accent" />}
    </Link>
  );
}

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
  const profileLink: NavLink = { label: copy.profile, href: localePath(language, "/sobre-mi") };
  const capabilitiesLink: NavLink = { label: copy.capabilities, href: localePath(language, "/capacidades") };
  const serviceLinks: NavLink[] = [
    { label: copy.studio, href: localePath(language, "/estudio") },
    { label: copy.agents, href: localePath(language, "/agentes") },
    { label: copy.systems, href: localePath(language, "/sistemas") },
    { label: copy.content, href: localePath(language, "/fabricas") },
    { label: copy.campaigns, href: localePath(language, "/campanas") },
  ];
  const caseLinks: NavLink[] = [
    { label: copy.successCases, href: localePath(language, "/casos-de-exito") },
    { label: copy.useCases, href: localePath(language, "/casos-de-uso") },
  ];
  const contactHref = pathname === "/" || pathname === "/en" ? "#contacto" : localePath(language, "/aplicar");
  const exploreLinks: NavLink[] = [capabilitiesLink, ...caseLinks, profileLink];
  const [tucked, setTucked] = useState(false);

  // La barra se guarda al bajar (deja la pantalla a las escenas) y vuelve al
  // primer gesto hacia arriba o cerca del principio. Nunca con un menú abierto.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 120) setTucked(false);
        else if (delta > 6) setTucked(true);
        else if (delta < -6) setTucked(false);
        lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  const hidden = tucked && !mobileOpen && !utilityOpen;

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
    // Visible, la cabecera no lleva transform: el menú móvil (fixed) se ubica contra la ventana.
    <header
      data-tucked={hidden || undefined}
      onFocusCapture={() => setTucked(false)}
      className={`fixed inset-x-0 top-0 z-[100] px-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:px-6 ${hidden ? "-translate-y-[130%]" : ""}`}
    >
      <div className="relative mx-auto flex h-16 max-w-[1480px] items-center justify-between rounded-xl border border-white/10 bg-background/72 px-4 shadow-[0_16px_46px_rgba(0,0,0,.24)] backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.1)] light:shadow-[0_1px_2px_rgb(20_23_26_/_0.06),0_12px_32px_rgb(20_23_26_/_0.1)] sm:px-5">
        <Link href={localePath(language, "/")} className="group rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Mario Morera — Home">
          <LogoMM className="h-7 w-7 text-foreground transition-transform duration-500 group-hover:rotate-[-6deg] motion-reduce:transition-none" />
        </Link>

        {/* Centrado Absoluto en Escritorio */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-8 lg:flex" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
          <NavDropdown id="services-menu" label={copy.services} links={serviceLinks} active={serviceLinks.some((item) => isActive(item.href))} />
          <PrimaryLink item={capabilitiesLink} active={isActive(capabilitiesLink.href)} />
          <NavDropdown id="cases-menu" label={copy.work} links={caseLinks} active={caseLinks.some((item) => isActive(item.href))} />
          <PrimaryLink item={profileLink} active={isActive(profileLink.href)} />
        </nav>

        <div className="flex items-center gap-2">
          <Link href={contactHref} className="hidden rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none lg:inline-flex">
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
                  <span className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/55">{copy.language}</span>
                  <div className="flex gap-1">
                    {(["es", "en"] as const).map((lang) => (
                      <button key={lang} type="button" onClick={() => { setLanguage(lang); setUtilityOpen(false); }} aria-pressed={language === lang} className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.12em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${language === lang ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"}`}>{lang}</button>
                    ))}
                  </div>
                </div>
                <button type="button" onClick={() => { toggleTheme(); setUtilityOpen(false); }} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:hover:bg-[rgb(var(--ink-rgb)/0.06)]">
                  <span>{copy.theme}</span>
                  <span className="flex items-center gap-2 text-foreground/60">{theme === "light" ? copy.toDark : copy.toLight}{theme === "light" ? <Moon aria-hidden="true" className="h-4 w-4" /> : <Sun aria-hidden="true" className="h-4 w-4" />}</span>
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
        <div id="mobile-menu" className="fixed inset-0 -z-10 flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 lg:hidden">
          <nav className="flex flex-1 flex-col items-center gap-1 text-center" aria-label={language === "es" ? "Navegación móvil" : "Mobile navigation"}>
            {[{ title: copy.services, links: serviceLinks }, { title: copy.explore, links: exploreLinks }].map((group, groupIndex) => (
              <div key={group.title} className={`flex w-full flex-col items-center gap-1 ${groupIndex > 0 ? "mt-6" : ""}`}>
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-signal">{group.title}</p>
                {group.links.map((item, index) => (
                  <Link ref={groupIndex === 0 && index === 0 ? firstMobileLinkRef : undefined} key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="w-full border-b border-white/10 py-3 text-center text-[clamp(1.15rem,5vw,1.8rem)] font-medium leading-none tracking-[-0.03em] text-foreground transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.1)]">
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setMobileOpen(false); setLanguage(language === "es" ? "en" : "es"); }} className="rounded-full border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.15)]">
                {language === "es" ? "English" : "Español"}
              </button>
              <button type="button" onClick={toggleTheme} aria-label={themeLabel} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.15)]">
                {theme === "light" ? <Moon aria-hidden="true" className="h-4 w-4" /> : <Sun aria-hidden="true" className="h-4 w-4" />}
              </button>
            </div>
            <Link href={contactHref} onClick={() => setMobileOpen(false)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{copy.cta}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
