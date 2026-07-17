"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_IDENTITY, localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const isEs = language === "es";
  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#070809]/92 px-5 py-12 backdrop-blur-xl sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1480px] gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-xl font-semibold tracking-[-0.03em] text-[#F3F0E8]">{SITE_IDENTITY.brand}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#F3F0E8]/50">{isEs ? "Diseño, desarrollo, IA, automatización y CRM, del concepto a la operación." : "Design, development, AI, automation and CRM, from concept to operations."}</p>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F3F0E8]/35">{SITE_IDENTITY.location[language]}</p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <Link href={localePath(language, "/casos-de-exito")} className="text-[#F3F0E8]/55 hover:text-[#F3F0E8]">{isEs ? "Trabajo" : "Work"}</Link>
          <Link href={localePath(language, "/sistemas")} className="text-[#F3F0E8]/55 hover:text-[#F3F0E8]">{isEs ? "Sistemas" : "Systems"}</Link>
          <Link href={localePath(language, "/estudio")} className="text-[#F3F0E8]/55 hover:text-[#F3F0E8]">{isEs ? "Estudio" : "Studio"}</Link>
          <Link href={localePath(language, "/privacidad")} className="text-[#F3F0E8]/55 hover:text-[#F3F0E8]">{isEs ? "Privacidad" : "Privacy"}</Link>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <a href={`mailto:${SITE_IDENTITY.contact.email}`} className="inline-flex items-center gap-2 text-[#F3F0E8]">Email <ArrowUpRight className="h-3.5 w-3.5" /></a>
          <a href={SITE_IDENTITY.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#F3F0E8]/55 hover:text-[#F3F0E8]">LinkedIn <ArrowUpRight className="h-3.5 w-3.5" /></a>
          <a href={SITE_IDENTITY.social.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#F3F0E8]/55 hover:text-[#F3F0E8]">GitHub <ArrowUpRight className="h-3.5 w-3.5" /></a>
          <a href={SITE_IDENTITY.contact.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#F3F0E8]/55 hover:text-[#F3F0E8]">WhatsApp <ArrowUpRight className="h-3.5 w-3.5" /></a>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1480px] flex-col gap-2 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F3F0E8]/30 sm:flex-row sm:justify-between">
        <span>© Mario Morera</span><span>mmorera.agency</span>
      </div>
    </footer>
  );
}
