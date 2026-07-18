"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { localePath } from "@/config/site";

const stages = [
  { id: "capture", title: { es: "Captación", en: "Acquisition" }, text: { es: "Formularios, pauta, WhatsApp y fuentes que ya existen.", en: "Forms, paid media, WhatsApp and the sources already in use." } },
  { id: "qualify", title: { es: "Calificación", en: "Qualification" }, text: { es: "Reglas y señales que ordenan prioridad y próximo paso.", en: "Rules and signals that organise priority and next steps." } },
  { id: "crm", title: { es: "CRM", en: "CRM" }, text: { es: "Una historia única del prospecto, visible para el equipo.", en: "A single prospect history, visible to the team." } },
  { id: "agenda", title: { es: "Agenda", en: "Booking" }, text: { es: "Disponibilidad, confirmaciones y recordatorios conectados.", en: "Connected availability, confirmations and reminders." } },
  { id: "handoff", title: { es: "Handoff", en: "Handoff" }, text: { es: "El contexto llega a la persona correcta y queda registrado.", en: "Context reaches the right person and remains recorded." } },
];

export function SystemsExperience() {
  const { language } = useLanguage();
  const { setActiveFamilies, setHeroVisible, activeTechName } = useActiveTech();
  const heroRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(2);
  const isEs = language === "es";

  useEffect(() => {
    setActiveFamilies(["CRM", "Automation", "Backend", "AI"]);
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
      <section ref={heroRef} className="flex min-h-[72svh] items-end px-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div className="pb-4 lg:pb-8"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-signal">{isEs ? "Sistemas" : "Systems"} · CRM / IA / Automatización</p><h1 className="mt-6 max-w-[920px] text-[clamp(3.35rem,7vw,7.8rem)] font-medium leading-[.89] tracking-[-.07em] text-foreground">{isEs ? "Menos herramientas sueltas. Más continuidad operativa." : "Fewer disconnected tools. More operational continuity."}</h1></div>
          <div className="flex min-h-[42vh] flex-col justify-between border-t border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] pt-4 lg:mb-8"><div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/32 light:text-muted-foreground/85">{isEs ? "Tecnología contextual" : "Contextual technology"}</p><p className="mt-2 text-2xl font-medium tracking-[-.035em] text-foreground">{activeTechName ?? "n8n"}</p></div><span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_18px_#71F3A2] light:shadow-none" /></div><div><p className="max-w-xl text-lg leading-7 text-[#F3F0E8]/58 light:text-muted-foreground">{isEs ? "Diseño sistemas que conectan captación, seguimiento, agenda y operación. La automatización aparece donde reduce fricción; la IA, donde mejora una decisión." : "I design systems that connect acquisition, follow-up, booking and operations. Automation appears where it removes friction; AI where it improves a decision."}</p><Link href={localePath(language, "/aplicar")} className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">{isEs ? "Contame tu sistema" : "Tell me about your system"}<ArrowUpRight className="h-4 w-4" /></Link></div></div>
        </div>
      </section>

      <section className="mt-24 border-y border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-card px-5 py-16 sm:px-8 lg:px-12 lg:py-24" aria-labelledby="system-map-title">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#F3F0E8]/35 light:text-muted-foreground/85">01 · {isEs ? "Mapa operativo" : "Operational map"}</p><h2 id="system-map-title" className="mt-4 text-3xl font-medium tracking-[-.04em] text-foreground sm:text-5xl">{isEs ? "Un flujo, cinco estados visibles." : "One flow, five visible states."}</h2></div><p className="font-mono text-[9px] uppercase tracking-widest text-[#F3F0E8]/28 light:text-muted-foreground/85">{isEs ? "Seleccioná un nodo" : "Select a node"}</p></div>
          <div className="mt-12 rounded-[1.5rem] border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-background p-4 sm:p-6">
            <div className="grid gap-2 lg:grid-cols-5">
              {stages.map((stage, index) => <div key={stage.id} className="flex items-center"><button type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`min-h-28 w-full rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${active === index ? "border-signal/50 bg-signal/[.08]" : "border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)] bg-white/[.025] light:bg-[rgb(var(--ink-rgb)/0.025)] hover:border-white/20 light:hover:border-[rgb(var(--ink-rgb)/0.2)]"}`}><span className="font-mono text-[9px] text-[#F3F0E8]/28 light:text-muted-foreground/85">0{index + 1}</span><span className="mt-6 block text-lg font-medium text-foreground">{stage.title[language]}</span></button>{index < stages.length - 1 && <ChevronRight className="mx-1 hidden h-4 w-4 shrink-0 text-[#F3F0E8]/18 light:text-muted-foreground/70 lg:block" />}</div>)}
            </div>
            <div className="mt-4 grid gap-4 rounded-2xl border border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)] bg-white/[.025] light:bg-[rgb(var(--ink-rgb)/0.025)] p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-signal">{stages[active].title[language]}</p><p className="mt-3 max-w-2xl text-xl leading-7 text-[#F3F0E8]/65 light:text-muted-foreground">{stages[active].text[language]}</p></div><span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_20px_#71F3A2] light:shadow-none" /></div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1480px]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">02 · {isEs ? "Qué construyo" : "What I build"}</p><div className="mt-10 grid border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] lg:grid-cols-3">
          {[
            [isEs ? "CRM operativo" : "Operational CRM", isEs ? "Pipeline, datos, permisos y vistas alineados con el proceso real." : "Pipeline, data, permissions and views aligned with the real process."],
            [isEs ? "Automatizaciones" : "Automations", isEs ? "Eventos, mensajes y tareas que avanzan sin perder trazabilidad." : "Events, messages and tasks that move without losing traceability."],
            [isEs ? "Herramientas con IA" : "AI tools", isEs ? "Clasificación, extracción y asistencia incorporadas dentro del flujo." : "Classification, extraction and assistance built into the workflow."],
          ].map(([title, text], index) => <article key={title} className="min-h-72 border-b border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] p-6 lg:border-b-0 lg:border-r"><span className="font-mono text-[9px] text-[#F3F0E8]/25 light:text-muted-foreground/85">0{index + 1}</span><h3 className="mt-20 text-3xl font-medium tracking-[-.04em] text-foreground">{title}</h3><p className="mt-4 max-w-sm text-sm leading-6 text-[#F3F0E8]/48 light:text-muted-foreground">{text}</p></article>)}
        </div></div>
      </section>

      <section className="px-5 pt-4 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-8 border-y border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] py-10 md:grid-cols-[1fr_auto] md:items-center md:py-14"><h2 className="max-w-4xl text-[clamp(2.4rem,4.5vw,5rem)] font-medium leading-[.98] tracking-[-.05em] text-foreground">{isEs ? "El sistema correcto se nota porque el trabajo deja de romperse entre herramientas." : "The right system is visible when work stops breaking between tools."}</h2><Link href={localePath(language, "/aplicar")} className="inline-flex items-center gap-2 text-sm text-foreground md:justify-self-end">{isEs ? "Revisar un flujo" : "Review a workflow"}<ArrowUpRight className="h-4 w-4" /></Link></div>
      </section>
    </main>
  );
}
