"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { localePath } from "@/config/site";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";
import { MOTION_ASSETS } from "@/data/motionAssets";
import { CapabilitiesOrbit } from "@/components/premium/estudio/CapabilitiesOrbit";
import { InteractiveDesignTokenStudio } from "@/components/premium/estudio/InteractiveDesignTokenStudio";
import { VanguardInteractionPlayground } from "@/components/premium/estudio/VanguardInteractionPlayground";

export function StudioExperience() {
  const { language } = useLanguage();
  const { setActiveFamilies, setHeroVisible, activeTechName } = useActiveTech();
  const heroRef = useRef<HTMLElement>(null);
  const isEs = language === "es";
  useEffect(() => { setActiveFamilies(["Media", "Marketing", "Web"]); return () => setActiveFamilies([]); }, [setActiveFamilies]);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [setHeroVisible]);
  return (
    <main id="contenido-principal" className="bg-transparent pb-28 pt-36 sm:pt-44">
      <section ref={heroRef} className="flex min-h-[72svh] items-end px-5 sm:px-8 lg:px-12"><div className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end"><div className="pb-4 lg:pb-8"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-track-create">{isEs ? "Estudio" : "Studio"} · Design / Motion / Creative Tech</p><h1 className="mt-6 max-w-[940px] text-[clamp(3.5rem,7.4vw,8.2rem)] font-medium leading-[.87] tracking-[-.075em] text-foreground">{isEs ? "La tecnología también puede tener pulso." : "Technology can have a pulse, too."}</h1></div><div className="flex min-h-[42vh] flex-col justify-between border-t border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] pt-4 lg:mb-8"><div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/32 light:text-muted-foreground/85">{isEs ? "Tecnología contextual" : "Contextual technology"}</p><p className="mt-2 text-2xl font-medium tracking-[-.035em] text-foreground">{activeTechName ?? "Figma"}</p></div><span className="h-2 w-2 rounded-full bg-track-create shadow-[0_0_18px_#B68CFF] light:shadow-none" /></div><p className="max-w-xl text-xl leading-8 text-[#F3F0E8]/62 light:text-muted-foreground">{isEs ? "Diseño y construyo experiencias donde forma, interacción y código responden a la misma intención." : "I design and build experiences where form, interaction and code answer to the same intent."}</p></div></div></section>
      <CapabilitiesOrbit language={language} />
      <InteractiveDesignTokenStudio />
      <VanguardInteractionPlayground />
      <section className="relative isolate overflow-hidden border-t border-white/10 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]">
        <MotionBackdrop asset={MOTION_ASSETS.pulse} intensity={0.4} />
        <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">
              02 · {isEs ? "Del concepto al navegador" : "From concept to browser"}
            </p>
            <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-medium leading-[.98] tracking-[-.055em] text-foreground">
              {isEs ? "Una sola intención, de la dirección al código." : "One intent, from direction to code."}
            </h2>
          </div>
          <div className="rounded-2xl border border-white/12 bg-background/80 p-6 backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.12)]">
            <p className="text-base leading-relaxed text-foreground/70">
              {isEs
                ? "Dirección de arte, prototipado e ingeniería frontend en una sola pasada. Cero intermediarios, 100% fiel a lo diseñado."
                : "Art direction, prototyping, and frontend engineering in a single pass. Zero handoff friction, shipped straight to production."}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 border-t border-white/8 pt-4 light:border-[rgb(var(--ink-rgb)/0.08)]">
              <Link
                href={localePath(language, "/casos-de-exito")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal hover:underline"
              >
                {isEs ? "Ver archivo de trabajo" : "View work archive"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={localePath(language, "/aplicar")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/65 hover:text-foreground"
              >
                {isEs ? "Proponer un proyecto" : "Propose a project"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
