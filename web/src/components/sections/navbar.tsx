"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoMM } from "@/components/shared/LogoMM";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";

const labels = {
  es: { work: "Trabajo", systems: "Sistemas", studio: "Estudio", profile: "Perfil", cta: "Contame tu proyecto", menu: "Abrir menú", close: "Cerrar menú" },
  en: { work: "Work", systems: "Systems", studio: "Studio", profile: "Profile", cta: "Tell me about your project", menu: "Open menu", close: "Close menu" },
};

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const copy = labels[language];
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
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between rounded-xl border border-white/10 bg-[#070809]/72 px-4 shadow-[0_16px_46px_rgba(0,0,0,.24)] backdrop-blur-xl sm:px-5">
        <Link href={localePath(language, "/")} className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3F0E8]" aria-label="Mario Morera — Home">
          <LogoMM className="h-7 w-7 text-[#F3F0E8] transition-transform duration-500 group-hover:rotate-[-6deg]" />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#F3F0E8]">Mario Morera</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={`relative rounded-md py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3F0E8] ${isActive(item.href) ? "text-[#F3F0E8]" : "text-[#F3F0E8]/58 hover:text-[#F3F0E8]"}`}>
              {item.label}
              {isActive(item.href) && <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-4 bg-[#55D8FF]" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-white/10 p-1 sm:flex" aria-label={language === "es" ? "Cambiar idioma" : "Change language"}>
            {(["es", "en"] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setLanguage(lang)} aria-pressed={language === lang} className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3F0E8] ${language === lang ? "bg-[#F3F0E8] text-[#070809]" : "text-[#F3F0E8]/45 hover:text-[#F3F0E8]"}`}>{lang}</button>
            ))}
          </div>
          <Link href={localePath(language, "/aplicar")} className="hidden rounded-full bg-[#F3F0E8] px-4 py-2.5 text-sm font-semibold text-[#070809] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55D8FF] md:inline-flex">
            {copy.cta}
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? copy.close : copy.menu} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-[#F3F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3F0E8] lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 -z-10 flex min-h-[100dvh] flex-col bg-[#070809] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 lg:hidden">
          <nav className="flex flex-1 flex-col justify-center gap-2" aria-label={language === "es" ? "Navegación móvil" : "Mobile navigation"}>
            {links.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-white/10 py-5 text-[clamp(2rem,9vw,4rem)] font-medium leading-none tracking-[-0.05em] text-[#F3F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3F0E8]">
                {item.label}<span className="font-mono text-xs text-[#F3F0E8]/35">0{index + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" onClick={() => { setOpen(false); setLanguage(language === "es" ? "en" : "es"); }} className="rounded-full border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#F3F0E8]">
              {language === "es" ? "English" : "Español"}
            </button>
            <Link href={localePath(language, "/aplicar")} onClick={() => setOpen(false)} className="rounded-full bg-[#F3F0E8] px-5 py-3 text-sm font-semibold text-[#070809]">{copy.cta}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
