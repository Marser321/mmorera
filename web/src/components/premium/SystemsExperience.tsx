"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { localePath } from "@/config/site";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";
import { BackgroundVideo } from "@/components/shared/BackgroundVideo";
import { DecodeText } from "@/components/motion/DecodeText";
import { TickerNumber } from "@/components/motion/TickerNumber";
import { MOTION_ASSETS } from "@/data/motionAssets";

const stages = [
  { id: "capture", title: { es: "Captación", en: "Acquisition" }, text: { es: "Formularios, pauta, WhatsApp y fuentes que ya existen.", en: "Forms, paid media, WhatsApp and the sources already in use." } },
  { id: "qualify", title: { es: "Calificación", en: "Qualification" }, text: { es: "Reglas y señales que ordenan prioridad y próximo paso.", en: "Rules and signals that organise priority and next steps." } },
  { id: "crm", title: { es: "CRM", en: "CRM" }, text: { es: "Una historia única del prospecto, visible para el equipo.", en: "A single prospect history, visible to the team." } },
  { id: "agenda", title: { es: "Agenda", en: "Booking" }, text: { es: "Disponibilidad, confirmaciones y recordatorios conectados.", en: "Connected availability, confirmations and reminders." } },
  { id: "handoff", title: { es: "Handoff", en: "Handoff" }, text: { es: "El contexto llega a la persona correcta y queda registrado.", en: "Context reaches the right person and remains recorded." } },
];

const telemetry = [
  { value: 5, suffix: "", label: { es: "Estados visibles del flujo", en: "Visible flow states" } },
  { value: 24, suffix: "/7", label: { es: "Operación sin pausa", en: "Uninterrupted operation" } },
  { value: 5, prefix: "<", suffix: " min", label: { es: "Primera respuesta al lead", en: "First lead response" } },
  { value: 1, suffix: "", label: { es: "Historia única del prospecto", en: "Single prospect history" } },
];

const AUTO_ADVANCE_MS = 4500;

export function SystemsExperience() {
  const { language } = useLanguage();
  const { setActiveFamilies, setHeroVisible, activeTechName } = useActiveTech();
  const heroRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion() === true;
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

  /* El circuito avanza solo; se pausa al interactuar (hover/focus) y
     nunca corre con reduced-motion. */
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % stages.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

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

      <section className="relative mt-20 h-[72svh] overflow-visible md:h-[110vh]" aria-hidden="true">
        <div className="h-full overflow-hidden border-y border-white/10 bg-background light:border-[rgb(var(--ink-rgb)/0.1)] md:sticky md:top-0 md:h-[100svh]">
          <MotionBackdrop asset={MOTION_ASSETS.continuity} intensity={0.9} />
          <div className="relative z-10 mx-auto flex h-full max-w-[1480px] items-end px-5 pb-12 sm:px-8 md:items-center md:pb-0 lg:px-12">
            <p className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[.18em] text-foreground/48">
              {stages.map((stage) => stage.title[language]).join(" → ")}
            </p>
          </div>
        </div>
      </section>

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

      <section className="relative isolate overflow-hidden border-y border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-card px-5 py-16 sm:px-8 lg:px-12 lg:py-24" aria-labelledby="system-map-title">
        <BackgroundVideo
          src="/videos/graphite-planes.mp4"
          poster="/videos/posters/graphite-planes.jpg"
          intensity="subtle"
          scrim="center"
          tint="cyan"
        />
        <div
          className="relative z-10 mx-auto max-w-[1480px]"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#F3F0E8]/35 light:text-muted-foreground/85">01 · {isEs ? "Mapa operativo" : "Operational map"}</p><h2 id="system-map-title" className="mt-4 text-3xl font-medium tracking-[-.04em] text-foreground sm:text-5xl">{isEs ? "Un flujo, cinco estados visibles." : "One flow, five visible states."}</h2></div><p className="font-mono text-[9px] uppercase tracking-widest text-[#F3F0E8]/28 light:text-muted-foreground/85">{isEs ? "La corriente recorre el circuito" : "Current runs through the circuit"}</p></div>

          <div className="mt-12 rounded-[1.5rem] border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-background/80 p-4 backdrop-blur-sm sm:p-6">
            {/* Nodos del circuito */}
            <div className="grid gap-2 lg:grid-cols-5">
              {stages.map((stage, index) => {
                const isActive = active === index;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-pressed={isActive}
                    className={`relative min-h-28 overflow-hidden rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      isActive
                        ? "border-signal/50 bg-signal/[.08] shadow-[0_0_32px_rgb(113_243_162/0.10)]"
                        : "border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)] bg-white/[.025] light:bg-[rgb(var(--ink-rgb)/0.025)] hover:border-white/20 light:hover:border-[rgb(var(--ink-rgb)/0.2)]"
                    }`}
                  >
                    <span className={`font-mono text-[9px] transition-colors ${isActive ? "text-signal" : "text-[#F3F0E8]/28 light:text-muted-foreground/85"}`}>0{index + 1}</span>
                    <span className="mt-6 block text-lg font-medium text-foreground">{stage.title[language]}</span>
                    {/* Progreso del auto-avance sobre el nodo activo */}
                    {isActive && !paused && !reducedMotion && (
                      <motion.span
                        key={active}
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-signal/70"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Riel conductor: la corriente viaja bajo los nodos; cada tick
                marca un estado y se enciende cuando la corriente lo alcanza */}
            <div aria-hidden="true" className="relative mt-5 hidden h-4 w-full lg:block">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 overflow-hidden bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.12)]">
                {!reducedMotion && (
                  <span className="animate-flow-pulse absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-signal to-transparent" />
                )}
              </div>
              {stages.map((stage, index) => (
                <span
                  key={stage.id}
                  className={`absolute top-1/2 h-[5px] w-px -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                    active === index
                      ? "h-3 bg-signal shadow-[0_0_12px_#71F3A2]"
                      : "bg-white/25 light:bg-[rgb(var(--ink-rgb)/0.25)]"
                  }`}
                  style={{ left: `${(index * 2 + 1) * 10}%` }}
                />
              ))}
            </div>

            {/* Lectura del estado activo: título decodificado + texto con crossfade */}
            <div className="mt-4 grid gap-4 rounded-2xl border border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)] bg-white/[.025] light:bg-[rgb(var(--ink-rgb)/0.025)] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <DecodeText
                  text={stages[active].title[language]}
                  className="font-mono text-[9px] uppercase tracking-[.16em] text-signal"
                />
                <div className="relative mt-3 min-h-14 max-w-2xl">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={stages[active].id}
                      initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="text-xl leading-7 text-[#F3F0E8]/65 light:text-muted-foreground"
                    >
                      {stages[active].text[language]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_20px_#71F3A2] light:shadow-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <BackgroundVideo
          src="/videos/ai-circuits.mp4"
          poster="/videos/posters/ai-circuits.jpg"
          intensity="subtle"
          scrim="bottom"
          tint="violet"
        />
        <div className="relative z-10 mx-auto max-w-[1480px]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">02 · {isEs ? "Qué construyo" : "What I build"}</p><div className="mt-10 grid border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] lg:grid-cols-3">
          {[
            [isEs ? "CRM operativo" : "Operational CRM", isEs ? "Pipeline, datos, permisos y vistas alineados con el proceso real." : "Pipeline, data, permissions and views aligned with the real process."],
            [isEs ? "Automatizaciones" : "Automations", isEs ? "Eventos, mensajes y tareas que avanzan sin perder trazabilidad." : "Events, messages and tasks that move without losing traceability."],
            [isEs ? "Herramientas con IA" : "AI tools", isEs ? "Clasificación, extracción y asistencia incorporadas dentro del flujo." : "Classification, extraction and assistance built into the workflow."],
          ].map(([title, text], index) => <SpotlightCard key={title} title={title} text={text} index={index} />)}
        </div></div>
      </section>

      <section className="px-5 pt-4 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-8 border-y border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] py-10 md:grid-cols-[1fr_auto] md:items-center md:py-14"><h2 className="max-w-4xl text-[clamp(2.4rem,4.5vw,5rem)] font-medium leading-[.98] tracking-[-.05em] text-foreground">{isEs ? "El sistema correcto se nota porque el trabajo deja de romperse entre herramientas." : "The right system is visible when work stops breaking between tools."}</h2><Link href={localePath(language, "/aplicar")} className="inline-flex items-center gap-2 text-sm text-foreground md:justify-self-end">{isEs ? "Revisar un flujo" : "Review a workflow"}<ArrowUpRight className="h-4 w-4" /></Link></div>
      </section>
    </main>
  );
}

/** Card con spotlight que sigue al cursor (solo desktop; sin depender de hover en móvil). */
function SpotlightCard({ title, text, index }: { title: string; text: string; index: number }) {
  const reducedMotion = useReducedMotion() === true;

  return (
    <article
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }}
      className="group relative min-h-72 overflow-hidden border-b border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] p-6 lg:border-b-0 lg:border-r"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgb(113 243 162 / 0.09), transparent 70%)",
        }}
      />
      <span className="font-mono text-[9px] text-[#F3F0E8]/25 light:text-muted-foreground/85">0{index + 1}</span>
      <h3 className="mt-20 text-3xl font-medium tracking-[-.04em] text-foreground">{title}</h3>
      <p className="mt-4 max-w-sm text-sm leading-6 text-[#F3F0E8]/48 light:text-muted-foreground">{text}</p>
    </article>
  );
}
