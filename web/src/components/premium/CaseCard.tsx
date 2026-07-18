"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { Parallax } from "@/components/scroll/Parallax";
import type { ProjectCase } from "@/types/site";

const trackLabels = {
  es: { create: "Crear", build: "Construir", scale: "Escalar" },
  en: { create: "Create", build: "Build", scale: "Scale" },
};

export function CaseCard({ project, priority = false, large = false }: { project: ProjectCase; priority?: boolean; large?: boolean }) {
  const { language } = useLanguage();
  return (
    <Link href={localePath(language, `/casos-de-exito/${project.slug}`)} className={`group pressable block overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0D1114]/86 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/86 ${large ? "md:col-span-2" : ""}`}>
      <div className={`relative overflow-hidden ${large ? "aspect-[16/9] md:aspect-[2/1]" : "aspect-[4/3]"}`}>
        {/* Parallax sutil de la portada dentro del marco (desktop; 108% de alto para no revelar bordes) */}
        <Parallax speed={14} className="absolute inset-x-0 -inset-y-[4%]">
          <Image src={project.media[0].src} alt={project.media[0].alt[language]} fill priority={priority} sizes={large ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]" />
        </Parallax>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-background)_80%,transparent),transparent)]" />
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-background/65 text-foreground backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 light:border-[rgb(var(--ink-rgb)/0.15)]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="mb-3 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/38">
            {project.tracks.map((track) => <span key={track}>{trackLabels[language][track]}</span>)}
            {project.kind && <span>{project.kind[language]}</span>}
            {project.year && <span>{project.year}</span>}
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">{project.title[language]}</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/52">{project.summary[language]}</p>
        </div>
        <div className="md:text-right">{project.client && <p className="mb-2 font-mono text-[9px] uppercase tracking-[.14em] text-foreground/28">{project.client[language]}</p>}<span className="link-draw font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/35">{language === "es" ? "Abrir caso" : "Open case"}</span></div>
      </div>
    </Link>
  );
}
