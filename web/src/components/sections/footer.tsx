"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SITE_IDENTITY, localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { Magnetic } from "@/components/motion/Magnetic";

// El Home y /aplicar ya terminan en el formulario: ahí no se repite el cierre.
const CTA_HIDDEN = new Set(["/", "/en", "/aplicar", "/en/aplicar"]);

export function Footer() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const pathname = usePathname();
  const showCta = !CTA_HIDDEN.has(pathname);
  return (
    <footer className="relative z-20 border-t border-white/10 bg-background/92 px-5 py-12 backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.1)] sm:px-8 lg:px-12">
      {showCta && (
        <div className="mx-auto mb-16 max-w-[1480px] border-b border-white/10 pb-16 pt-8 light:border-[rgb(var(--ink-rgb)/0.1)] sm:pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {isEs ? "Cupos limitados · 4 a 5 proyectos por trimestre" : "Limited spots · 4 to 5 projects per quarter"}
          </p>
          <p className="mt-5 text-[clamp(3.2rem,10vw,10.5rem)] font-medium leading-[0.85] tracking-[-0.075em] text-foreground">
            {isEs ? "¿Qué construimos?" : "What do we build?"}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Magnetic>
              <Link href={localePath(language, "/aplicar")} className="pressable inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {isEs ? "Contame tu proyecto" : "Tell me about your project"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={SITE_IDENTITY.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="pressable inline-flex items-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 px-7 py-4 text-sm font-semibold text-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>
      )}
      <div className="mx-auto grid max-w-[1480px] gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-xl font-semibold tracking-[-0.03em] text-foreground">{SITE_IDENTITY.brand}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-foreground/50">{isEs ? "Diseño, producto y sistemas bajo una sola dirección." : "Design, product and systems under one direction."}</p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <Link href={localePath(language, "/casos-de-exito")} className="text-foreground/55 hover:text-foreground">{isEs ? "Casos de Éxito" : "Case Studies"}</Link>
          <Link href={localePath(language, "/sistemas")} className="text-foreground/55 hover:text-foreground">{isEs ? "Sistemas & CRM" : "Systems & CRM"}</Link>
          <Link href={localePath(language, "/estudio")} className="text-foreground/55 hover:text-foreground">{isEs ? "Estudio de Diseño" : "Design Studio"}</Link>
          <Link href={localePath(language, "/aplicar")} className="text-foreground/55 hover:text-foreground">{isEs ? "Iniciar Proyecto" : "Start Project"}</Link>
          <Link href={localePath(language, "/privacidad")} className="text-foreground/55 hover:text-foreground">{isEs ? "Privacidad" : "Privacy"}</Link>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <a href={`mailto:${SITE_IDENTITY.contact.email}`} className="inline-flex items-center gap-2 text-foreground">Email <ArrowUpRight className="h-3.5 w-3.5" /></a>
          <a href={SITE_IDENTITY.contact.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground/55 hover:text-foreground">WhatsApp <ArrowUpRight className="h-3.5 w-3.5" /></a>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1480px] flex-col gap-2 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/30 light:border-[rgb(var(--ink-rgb)/0.1)] sm:flex-row sm:justify-between">
        <span>© Mario Morera</span><span>mmorera.agency</span>
      </div>
    </footer>
  );
}
