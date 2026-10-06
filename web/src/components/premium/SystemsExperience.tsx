"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { localePath } from "@/config/site";
import { BackgroundVideo } from "@/components/shared/BackgroundVideo";
import { TickerNumber } from "@/components/motion/TickerNumber";

// Cada escena es su propio chunk (SSR conservado): la página hidrata por partes.
const ScrollFilm = dynamic(() => import("@/components/films/ScrollFilm").then((m) => m.ScrollFilm));
const UseCaseFilmRoom = dynamic(() => import("@/components/films/UseCaseFilmRoom").then((m) => m.UseCaseFilmRoom));
const OmnichannelInboxSimulator = dynamic(() => import("@/components/premium/systems/OmnichannelInboxSimulator").then((m) => m.OmnichannelInboxSimulator));

const telemetry = [
  { value: 5, suffix: "", label: { es: "Estados visibles del flujo", en: "Visible flow states" } },
  { value: 24, suffix: "/7", label: { es: "Operación sin pausa", en: "Uninterrupted operation" } },
  { value: 5, prefix: "<", suffix: " min", label: { es: "Primera respuesta al lead", en: "First lead response" } },
  { value: 1, suffix: "", label: { es: "Historia única del prospecto", en: "Single prospect history" } },
];

export function SystemsExperience() {
  const { language } = useLanguage();
  const { setActiveFamilies, setHeroVisible, activeTechName } = useActiveTech();
  const heroRef = useRef<HTMLElement>(null);
  const isEs = language === "es";

  useEffect(() => {
    setActiveFamilies(["CRM", "Automation", "Backend", "Infrastructure", "AI"]);
    return () => setActiveFamilies([]);
  }, [setActiveFamilies]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [setHeroVisible]);

  return (
    <main id="contenido-principal" className="bg-transparent pb-28 pt-36 sm:pt-44">
      <section ref={heroRef} className="relative isolate flex min-h-[72svh] items-end overflow-hidden px-5 sm:px-8 lg:px-12">
        <BackgroundVideo
          src="/videos/graphite-core.mp4"
          poster="/videos/posters/graphite-core.jpg"
          intensity="subtle"
          scrim="left"
          tint="signal"
        />
        <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div className="pb-4 lg:pb-8"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-signal">{isEs ? "Sistemas" : "Systems"} · CRM / IA / Automatización</p><h1 className="mt-6 max-w-[920px] text-[clamp(3.35rem,7vw,7.8rem)] font-medium leading-[.89] tracking-[-.07em] text-foreground">{isEs ? "Conecto lo que hoy trabaja separado." : "I connect what works separately today."}</h1></div>
          <div className="flex min-h-[42vh] flex-col justify-between border-t border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] pt-4 lg:mb-8"><div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/32 light:text-muted-foreground/85">{isEs ? "Tecnología contextual" : "Contextual technology"}</p><p className="mt-2 text-2xl font-medium tracking-[-.035em] text-foreground">{activeTechName ?? "n8n"}</p></div><span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_18px_#71F3A2] light:shadow-none" /></div><div><p className="max-w-xl text-lg leading-7 text-[#F3F0E8]/58 light:text-muted-foreground">{isEs ? "CRM, automatización e IA dentro de un flujo que el equipo puede ver y usar." : "CRM, automation and AI inside a flow the team can see and use."}</p><Link href={localePath(language, "/aplicar")} className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">{isEs ? "Hablemos" : "Let’s talk"}<ArrowUpRight className="h-4 w-4" /></Link></div></div>
        </div>
      </section>

      {/* ─── 01 FILM DE APERTURA: el scroll recorre el timeline ─── */}
      <ScrollFilm />

      {/* Telemetría del sistema: números que se levantan al entrar en vista */}
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20" aria-label={isEs ? "Telemetría del sistema" : "System telemetry"}>
        <div className="mx-auto grid max-w-[1480px] grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {telemetry.map((metric) => (
            <div key={metric.label.es} className="border-t border-white/12 pt-5 light:border-[rgb(var(--ink-rgb)/0.12)]">
              <p className="font-mono text-4xl tracking-[-.04em] text-foreground sm:text-5xl">
                {metric.prefix}
                <TickerNumber value={metric.value} />
                {metric.suffix}
              </p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/38 light:text-muted-foreground/85">
                {metric.label[language]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 02 CASOS DE USO: films interactivos (problema → sistema) ─── */}
      <UseCaseFilmRoom />

      {/* ─── 03 BANDEJA OMNICANAL & SPEED-TO-LEAD EN TIEMPO REAL ─── */}
      <OmnichannelInboxSimulator />

      <section className="px-5 pt-4 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-8 border-y border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] py-10 md:grid-cols-[1fr_auto] md:items-center md:py-14"><h2 className="max-w-4xl text-[clamp(2.4rem,4.5vw,5rem)] font-medium leading-[.98] tracking-[-.05em] text-foreground">{isEs ? "El sistema correcto se nota porque el trabajo deja de romperse entre herramientas." : "The right system is visible when work stops breaking between tools."}</h2><Link href={localePath(language, "/aplicar")} className="inline-flex items-center gap-2 text-sm text-foreground md:justify-self-end">{isEs ? "Revisar un flujo" : "Review a workflow"}<ArrowUpRight className="h-4 w-4" /></Link></div>
      </section>
    </main>
  );
}
