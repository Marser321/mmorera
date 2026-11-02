"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SITE_IDENTITY, localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { Magnetic } from "@/components/motion/Magnetic";
import { MonogramaFundido } from "@/components/marca/MonogramaFundido";

const SERVICE_LINKS = [
  { path: "/estudio", label: { es: "Webs y landings", en: "Websites & landing pages" } },
  { path: "/agentes", label: { es: "Agentes de IA", en: "AI agents" } },
  { path: "/sistemas", label: { es: "Automatización y CRM", en: "Automation & CRM" } },
  { path: "/fabricas", label: { es: "Contenido con IA", en: "AI content" } },
];
const EXPLORE_LINKS = [
  { path: "/casos-de-exito", label: { es: "Casos de éxito", en: "Case studies" } },
  { path: "/casos-de-uso", label: { es: "Casos de uso", en: "Use cases" } },
  { path: "/capacidades", label: { es: "Capacidades", en: "Capabilities" } },
  { path: "/lab", label: { es: "Lab", en: "Lab" } },
  { path: "/sobre-mi", label: { es: "Sobre mí · CV", en: "About · Resume" } },
];

// El Home y /aplicar ya terminan en el formulario: ahí no se repite el cierre.
const CTA_HIDDEN = new Set(["/", "/en", "/aplicar", "/en/aplicar"]);

export function Footer() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const pathname = usePathname();
  const showCta = !CTA_HIDDEN.has(pathname);
  return (
    <footer className="relative z-20 overflow-hidden border-t border-white/10 bg-background/92 px-5 py-12 backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.1)] sm:px-8 lg:px-12">
      {/* Marca de agua: el monograma grande, recortado abajo a la derecha. */}
      <MonogramaFundido intensidad="marca" fundido="pie" className="absolute bottom-[-90px] right-[-5vw] -z-10 w-[min(56vw,580px)]" />
      {showCta && (
        <div className="mx-auto mb-16 max-w-[1480px] border-b border-white/10 pb-16 pt-8 light:border-[rgb(var(--ink-rgb)/0.1)] sm:pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {isEs ? "Trabajas directo conmigo" : "You work directly with me"}
          </p>
          <p className="mt-5 text-[clamp(3.2rem,10vw,10.5rem)] font-medium leading-[0.85] tracking-[-0.075em] text-foreground">
            {isEs ? "¿Qué construimos?" : "What do we build?"}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Magnetic>
              <Link href={localePath(language, "/aplicar")} className="pressable inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {isEs ? "Cuéntame tu proyecto" : "Tell me about your project"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={SITE_IDENTITY.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="pressable inline-flex items-center gap-2.5 rounded-full border border-signal/40 bg-signal/15 px-7 py-4 text-sm font-semibold text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>
      )}
      <div className="mx-auto grid max-w-[1480px] gap-10 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="text-xl font-semibold tracking-[-0.03em] text-foreground">{SITE_IDENTITY.brand}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-foreground/50">{isEs ? "AI Automation & Operations. Trabajas directo conmigo." : "AI Automation & Operations. You work directly with me."}</p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/45">{isEs ? "Servicios" : "Services"}</p>
          {SERVICE_LINKS.map((item) => <Link key={item.path} href={localePath(language, item.path)} className="text-foreground/55 hover:text-foreground">{item.label[language]}</Link>)}
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/45">{isEs ? "Explora" : "Explore"}</p>
          {EXPLORE_LINKS.map((item) => <Link key={item.path} href={localePath(language, item.path)} className="text-foreground/55 hover:text-foreground">{item.label[language]}</Link>)}
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <Link href={localePath(language, "/aplicar")} className="text-foreground/55 hover:text-foreground">{isEs ? "Cuéntame tu proyecto" : "Tell me about your project"}</Link>
          <a href={`mailto:${SITE_IDENTITY.contact.email}`} className="inline-flex items-center gap-2 text-foreground">Email <ArrowUpRight className="h-3.5 w-3.5" /></a>
          {pathname !== "/" && pathname !== "/en" && <a href={SITE_IDENTITY.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-foreground/55 hover:text-foreground">WhatsApp <ArrowUpRight className="h-3.5 w-3.5" /></a>}
          <Link href={localePath(language, "/privacidad")} className="text-foreground/75 underline decoration-foreground/30 underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">{isEs ? "Privacidad" : "Privacy"}</Link>
          <Link href={localePath(language, "/terminos")} className="text-foreground/75 underline decoration-foreground/30 underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">{isEs ? "Términos" : "Terms"}</Link>
          <Link href={localePath(language, "/cookies")} className="text-foreground/75 underline decoration-foreground/30 underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">{isEs ? "Cookies" : "Cookies"}</Link>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1480px] flex-col gap-2 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/55 light:border-[rgb(var(--ink-rgb)/0.1)] sm:flex-row sm:justify-between">
        <span>© Mario Morera</span><span>mmorera.agency</span>
      </div>
    </footer>
  );
}
