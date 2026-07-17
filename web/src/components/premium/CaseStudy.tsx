"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import type { ProjectCase } from "@/types/site";

export function CaseStudy({ project }: { project: ProjectCase }) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <main id="contenido-principal" className="bg-transparent pb-28 pt-32 sm:pt-36">
      <article>
        <header className="px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
            <Link href={localePath(language, "/casos-de-exito")} className="inline-flex items-center gap-2 rounded-md text-sm text-[#F3F0E8]/48 hover:text-[#F3F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ArrowLeft className="h-4 w-4" />{isEs ? "Volver al archivo" : "Back to archive"}</Link>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
              <div><div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#55D8FF]">{project.tracks.map((track) => <span key={track}>{track}</span>)}{project.kind && <span>{project.kind[language]}</span>}{project.year && <span>{project.year}</span>}</div><h1 className="mt-5 text-[clamp(3.7rem,9vw,9.5rem)] font-medium leading-[.87] tracking-[-.075em] text-[#F3F0E8]">{project.title[language]}</h1></div>
              <div className="lg:pb-3"><p className="text-xl leading-8 tracking-[-.015em] text-[#F3F0E8]/62">{project.summary[language]}</p>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F3F0E8] px-5 py-3 text-sm font-semibold text-[#070809]">{isEs ? "Ver producto" : "View product"}<ArrowUpRight className="h-4 w-4" /></a>}</div>
            </div>
          </div>
        </header>

        <div className="mx-auto mt-16 max-w-[1680px] px-3 sm:px-6"><div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0D1114]"><Image src={project.media[0].src} alt={project.media[0].alt[language]} fill priority sizes="100vw" className="object-cover" /></div></div>

        <div className="mx-auto mt-20 grid max-w-[1480px] gap-14 px-5 sm:px-8 lg:grid-cols-[.55fr_1.45fr] lg:px-12">
          <aside className="space-y-8">
            {project.client && <div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/30">{isEs ? "Cliente" : "Client"}</p><p className="mt-3 text-sm leading-6 text-[#F3F0E8]/65">{project.client[language]}</p></div>}
            <div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/30">{isEs ? "Rol" : "Role"}</p><p className="mt-3 text-sm leading-6 text-[#F3F0E8]/65">{project.role[language]}</p></div>
            <div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/30">Stack</p><div className="mt-3 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-[#F3F0E8]/55">{item}</span>)}</div></div>
            <div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/30">{isEs ? "Evidencia" : "Evidence"}</p>{project.evidence.map((item) => <p key={item[language]} className="mt-3 text-sm leading-6 text-[#F3F0E8]/55">{item[language]}</p>)}</div>
          </aside>
          <div>
            <section className="border-t border-white/12 py-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#B68CFF]">01 · {isEs ? "El desafío" : "The challenge"}</p><h2 className="mt-5 max-w-3xl text-3xl font-medium leading-tight tracking-[-.04em] text-[#F3F0E8] sm:text-5xl">{project.challenge[language]}</h2></section>
            <section className="border-t border-white/12 py-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#55D8FF]">02 · {isEs ? "Restricciones" : "Constraints"}</p><ul className="mt-6 space-y-3">{project.constraints.map((item) => <li key={item[language]} className="flex gap-4 text-lg leading-7 text-[#F3F0E8]/55"><span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-[#55D8FF]" />{item[language]}</li>)}</ul></section>
            <section className="border-t border-white/12 py-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#71F3A2]">03 · {isEs ? "Decisiones" : "Decisions"}</p><ol className="mt-6 space-y-5">{project.decisions.map((item, index) => <li key={item[language]} className="grid grid-cols-[38px_1fr] gap-3 text-lg leading-7 text-[#F3F0E8]/65"><span className="font-mono text-[10px] text-[#F3F0E8]/25">0{index + 1}</span>{item[language]}</li>)}</ol></section>
            <section className="border-y border-white/12 py-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/35">04 · {isEs ? "Resultado" : "Outcome"}</p><p className="mt-5 max-w-3xl text-3xl font-medium leading-tight tracking-[-.04em] text-[#F3F0E8] sm:text-5xl">{project.result[language]}</p></section>
          </div>
        </div>
      </article>
    </main>
  );
}
