"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { HeroEquipo } from "@/components/premium/home/HeroEquipo";
import { SERVICE_SOLUTIONS } from "@/data/solutionsData";
import { SITE_IDENTITY } from "@/config/site";

const ServicesStage = dynamic(() => import("@/components/premium/home/ServicesStage").then((m) => m.ServicesStage));

/**
 * Maqueta del hero «El equipo» a tamaño real, fuera de la home. El texto es el
 * del hero publicado, copiado acá a propósito: la maqueta no toca la home.
 * Debajo van las puertas de Servicios, para ver la salida del film.
 */
const TEXT = {
  note: "Maqueta · dos planos animados, el resto en cuadros quietos · todavía no está en la home",
  eyebrow: "Mario Morera · AI Automation & Operations",
  title: "Orquesto la tecnología de tu negocio.",
  intro: "Web, agentes de IA, automatización y contenido, conectados y a tu nombre. Lo diseño y lo construyo yo, de punta a punta.",
  work: "Ver el trabajo",
  whatsapp: "Hablar por WhatsApp",
} as const;

export function HeroEquipoMaqueta() {
  return (
    <main id="contenido-principal" className="relative pb-24">
      <HeroEquipo language="es">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ECE7DD]/55 sm:text-[11px]">{TEXT.note}</p>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#71F3A2] shadow-[0_0_8px_#71F3A2]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#ECE7DD]/75 sm:text-[11px]">{TEXT.eyebrow}</span>
        </div>
        <h1 className="max-w-[13ch] text-[clamp(2.75rem,6.2vw,6.25rem)] lg:text-[clamp(3rem,5.2vw,5.25rem)] font-medium leading-[0.94] tracking-[-0.06em] text-[#ECE7DD]">{TEXT.title}</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#ECE7DD]/75 sm:text-lg">{TEXT.intro}</p>
        {/* En teléfono los botones van antes que los servicios, para que entren en la primera pantalla. */}
        <div className="mt-7 flex flex-col gap-7">
          <ul className="order-2 flex flex-wrap gap-2 sm:order-1">
            {SERVICE_SOLUTIONS.map((service) => (
              <li key={service.id}>
                <a href="#servicios" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-xs font-medium text-[#ECE7DD]/80 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: service.accent }} />
                  {service.shortTitle.es}
                </a>
              </li>
            ))}
          </ul>
          <div className="order-1 flex flex-wrap items-center gap-3.5 sm:order-2">
            <a href="#servicios" className="inline-flex items-center gap-2.5 rounded-full bg-[#ECE7DD] px-6 py-3.5 text-sm font-semibold text-[#0B0B0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {TEXT.work}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={SITE_IDENTITY.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full border border-[#71F3A2]/40 bg-[#71F3A2]/15 px-6 py-3.5 text-sm font-semibold text-[#71F3A2] backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#71F3A2]">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {TEXT.whatsapp}
            </a>
          </div>
        </div>
      </HeroEquipo>
      <ServicesStage />
    </main>
  );
}
