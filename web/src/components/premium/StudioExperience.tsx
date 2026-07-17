"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { localePath } from "@/config/site";

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
  const capabilities = [
    [isEs ? "Dirección visual" : "Visual direction", isEs ? "Un sistema de decisiones para que identidad, interfaz y contenido hablen el mismo idioma." : "A decision system that makes identity, interface and content speak the same language."],
    [isEs ? "Experiencias web" : "Web experiences", isEs ? "Diseño y desarrollo donde el movimiento ayuda a entender, recordar y actuar." : "Design and development where motion helps people understand, remember and act."],
    [isEs ? "Motion & 3D" : "Motion & 3D", isEs ? "Piezas y prototipos interactivos para explicar productos, espacios o ideas complejas." : "Interactive pieces and prototypes for explaining products, spaces or complex ideas."],
  ];
  return (
    <main id="contenido-principal" className="bg-transparent pb-28 pt-36 sm:pt-44">
      <section ref={heroRef} className="flex min-h-[72svh] items-end px-5 sm:px-8 lg:px-12"><div className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end"><div className="pb-4 lg:pb-8"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#B68CFF]">{isEs ? "Estudio" : "Studio"} · Design / Motion / Creative Tech</p><h1 className="mt-6 max-w-[940px] text-[clamp(3.5rem,7.4vw,8.2rem)] font-medium leading-[.87] tracking-[-.075em] text-[#F3F0E8]">{isEs ? "La tecnología también puede tener pulso." : "Technology can have a pulse, too."}</h1></div><div className="flex min-h-[42vh] flex-col justify-between border-t border-white/12 pt-4 lg:mb-8"><div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/32">{isEs ? "Tecnología contextual" : "Contextual technology"}</p><p className="mt-2 text-2xl font-medium tracking-[-.035em] text-[#F3F0E8]">{activeTechName ?? "Figma"}</p></div><span className="h-2 w-2 rounded-full bg-[#B68CFF] shadow-[0_0_18px_#B68CFF]" /></div><div><p className="max-w-xl text-xl leading-8 text-[#F3F0E8]/62">{isEs ? "Trabajo en el punto donde una idea necesita forma, interacción y una implementación que no destruya la intención." : "I work at the point where an idea needs form, interaction and an implementation that preserves the intent."}</p><p className="mt-5 max-w-xl text-sm leading-6 text-[#F3F0E8]/40">{isEs ? "Forma, interacción y código se revisan como una sola decisión hasta que la experiencia llega completa al navegador." : "Form, interaction and code are reviewed as one decision until the complete experience reaches the browser."}</p></div></div></div></section>
      <section className="mt-24 border-y border-white/10 bg-[#0D1114] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1480px]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#F3F0E8]/35">01 · {isEs ? "Capacidades" : "Capabilities"}</p><div className="mt-10 grid border-t border-white/10 lg:grid-cols-3">{capabilities.map(([title, text], index) => <article key={title} className="min-h-[360px] border-b border-white/10 p-6 lg:border-b-0 lg:border-r"><span className="font-mono text-[9px] text-[#F3F0E8]/25">0{index + 1}</span><h2 className="mt-24 text-4xl font-medium tracking-[-.045em] text-[#F3F0E8]">{title}</h2><p className="mt-5 max-w-sm text-base leading-6 text-[#F3F0E8]/48">{text}</p></article>)}</div></div></section>
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[1fr_1fr] lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#55D8FF]">02 · {isEs ? "Del concepto al navegador" : "From concept to browser"}</p><h2 className="mt-5 text-[clamp(2.8rem,5vw,5.8rem)] font-medium leading-[.95] tracking-[-.055em] text-[#F3F0E8]">{isEs ? "Una sola intención, de la dirección al código." : "One intent, from direction to code."}</h2></div><div className="lg:justify-self-end"><p className="max-w-xl text-lg leading-7 text-[#F3F0E8]/55">{isEs ? "Puedo explorar la forma, prototipar la interacción y construir la experiencia final. Eso reduce la distancia entre lo que se imagina y lo que realmente llega a producción." : "I can explore the form, prototype the interaction and build the experience. That reduces the distance between what is imagined and what actually ships."}</p><div className="mt-7 flex flex-wrap gap-6"><Link href={localePath(language, "/casos-de-exito")} className="inline-flex items-center gap-2 border-b border-white/20 pb-1 text-sm text-[#F3F0E8]">{isEs ? "Ver archivo creativo" : "View creative archive"}<ArrowUpRight className="h-4 w-4" /></Link><Link href={localePath(language, "/aplicar")} className="inline-flex items-center gap-2 text-sm text-[#F3F0E8]/55">{isEs ? "Proponer una experiencia" : "Propose an experience"}<ArrowUpRight className="h-4 w-4" /></Link></div></div></div></section>
    </main>
  );
}
