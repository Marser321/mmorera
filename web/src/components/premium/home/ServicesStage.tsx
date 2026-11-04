"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { SERVICE_SOLUTIONS, type ServiceSolution } from "@/data/solutionsData";
import { getProjectCase } from "@/data/projectCases";
import { getCaseMedia } from "@/data/caseMedia";
import { AGENT_DEMO_SCRIPT } from "@/data/agentDemoScript";
import { VIDEO_GALLERY, galleryMedia } from "@/data/videoGallery";
import { CaseReel } from "@/components/shared/CaseReel";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Escena 2 del home: los cuatro servicios como cuatro puertas. Cada una
 * muestra su prueba en movimiento, no un párrafo: el reel real de una web,
 * la demo guiada del agente, el recorrido de una consulta y una pieza de
 * video. En escritorio la puerta enfocada se abre y las demás quedan en
 * reposo con su nombre de canto; mientras nadie interactúa, el foco avanza
 * solo. En el teléfono, una lista corta: los reels llegan en la escena de casos.
 */

const AUTO_ADVANCE_MS = 7000;

const copy = {
  es: {
    eyebrow: "02 — Servicios",
    title: "¿Qué necesitas resolver?",
    hint: "Pasa por cada puerta",
    open: "Ver cómo funciona",
    capabilities: "Detrás de estos cuatro servicios hay nueve capacidades.",
    capabilitiesCta: "Explóralas",
    agentLabel: "Demo guiada · datos de muestra",
    flowLabel: "Ejemplo · sin datos de clientes",
    realCase: "Caso real",
    flow: ["Llega una consulta", "Entra a tu CRM", "Avisa a quien corresponde", "Sale el seguimiento"],
    handoff: "Pasa a una persona",
  },
  en: {
    eyebrow: "02 — Services",
    title: "What do you need solved?",
    hint: "Hover each door",
    open: "See how it works",
    capabilities: "Behind these four services there are nine capabilities.",
    capabilitiesCta: "Explore them",
    agentLabel: "Guided demo · sample data",
    flowLabel: "Example · no client data",
    realCase: "Real case",
    flow: ["An enquiry comes in", "It lands in your CRM", "The right person is notified", "Follow-up goes out"],
    handoff: "Handed to a person",
  },
} as const;

type Copy = (typeof copy)[Language];

const CONTENT_PIECE = VIDEO_GALLERY.find((piece) => piece.slug === "fabrica-trailer") ?? VIDEO_GALLERY[0];

function visualLabel(service: ServiceSolution, c: Copy, language: Language): string {
  if (service.id === "booking-payments") return c.agentLabel;
  if (service.id === "crm-automation") return c.flowLabel;
  if (service.id === "ai-software") return CONTENT_PIECE.label[language];
  const project = getProjectCase(service.proofSlug);
  return project ? `${c.realCase} · ${project.title[language]}` : c.realCase;
}

/** Conversación corta de la demo guiada: pregunta, respuesta y el traspaso a una persona. */
function ChatGlimpse({ language, live, c }: { language: Language; live: boolean; c: Copy }) {
  const question = AGENT_DEMO_SCRIPT.options[0];
  const messages = [
    { from: "agent", text: AGENT_DEMO_SCRIPT.greeting[language] },
    { from: "user", text: question.question[language] },
    { from: "agent", text: question.answer[0][language] },
    { from: "note", text: c.handoff },
  ] as const;
  return (
    <div className="absolute inset-x-0 top-0 bottom-[38%] flex items-center justify-center px-5">
      <div className="w-full max-w-[19rem] space-y-2.5" key={live ? "live" : "rest"}>
        {messages.map((message, index) => (
          <p
            key={message.text}
            className={`w-fit max-w-[88%] text-[13px] leading-snug ${live ? "fade-up-in" : ""} ${
              message.from === "user"
                ? "ml-auto rounded-2xl rounded-br-md bg-[#ECE7DD] px-3.5 py-2 text-[#0B0B0A]"
                : message.from === "agent"
                  ? "rounded-2xl rounded-bl-md border border-white/12 bg-white/[.07] px-3.5 py-2 text-[#ECE7DD]/90"
                  : "mx-auto flex items-center gap-2 rounded-full border border-[#71F3A2]/35 px-3 py-1 text-[12px] text-[#71F3A2]"
            }`}
            style={live ? { animationDelay: `${0.25 + index * 0.85}s` } : undefined}
          >
            {message.from === "note" ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#71F3A2]" /> : null}
            {message.text}
          </p>
        ))}
      </div>
    </div>
  );
}

/** El recorrido de una consulta: cuatro estaciones y un pulso que las cruza. */
function FlowGlimpse({ live, c }: { live: boolean; c: Copy }) {
  return (
    <div className="absolute inset-x-0 top-0 bottom-[38%] flex items-center justify-center px-6">
      <ol className="relative w-full max-w-[17rem] space-y-3.5">
        <span aria-hidden="true" className="absolute bottom-4 left-[0.95rem] top-4 w-px bg-white/15" />
        {live ? <span aria-hidden="true" className="door-flow-pulse absolute left-[0.95rem] top-4 h-10 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,#B68CFF,transparent)]" /> : null}
        {c.flow.map((step, index) => (
          <li key={step} className="relative flex items-center gap-3">
            <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#B68CFF]/45 bg-[#0B0B0A] font-mono text-[10px] text-[#B68CFF]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`rounded-xl border border-white/12 bg-white/[.06] px-3 py-2 text-[13px] text-[#ECE7DD]/88 ${live ? "fade-up-in" : ""}`} style={live ? { animationDelay: `${0.2 + index * 0.45}s` } : undefined}>
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** El trailer de la fábrica, vertical, centrado sobre su propio póster. */
function ContentGlimpse({ language, live, reduced }: { language: Language; live: boolean; reduced: boolean }) {
  const src = galleryMedia(CONTENT_PIECE.src, language);
  const poster = galleryMedia(CONTENT_PIECE.poster, language);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (live) void video.play().catch(() => {});
    else video.pause();
  }, [live, src]);
  return (
    <div className="absolute inset-x-0 top-0 bottom-[30%] flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- póster decorativo de fondo, mismo archivo que el del video */}
      <img src={poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl" />
      <div className="relative aspect-[9/16] h-[86%] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)]">
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element -- póster quieto con movimiento reducido
          <img src={poster} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        ) : (
          <video key={src} ref={videoRef} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden="true" className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
}

function DoorVisual({ service, language, live, reduced, c }: { service: ServiceSolution; language: Language; live: boolean; reduced: boolean; c: Copy }) {
  if (service.id === "booking-payments") return <ChatGlimpse language={language} live={live && !reduced} c={c} />;
  if (service.id === "crm-automation") return <FlowGlimpse live={live && !reduced} c={c} />;
  if (service.id === "ai-software") return <ContentGlimpse language={language} live={live} reduced={reduced} />;
  const media = getCaseMedia(service.proofSlug);
  return media ? <CaseReel reel={media.reel} alt="" playing={live} className="absolute inset-0 h-full w-full" sizes="(min-width: 1024px) 45vw, 100vw" /> : null;
}

export function ServicesStage() {
  const { language } = useLanguage();
  const c = copy[language];
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [inView, setInView] = useState(false);
  // Quien mira manda: con la primera interacción, el foco deja de avanzar solo.
  const [steered, setSteered] = useState(false);
  const autoplay = inView && !steered && !reduced;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % SERVICE_SOLUTIONS.length);
      setCycle((value) => value + 1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, active, cycle]);

  const focusDoor = (index: number) => {
    setSteered(true);
    setActive(index);
  };

  return (
    <section
      ref={sectionRef}
      id="servicios"
      data-home-section="servicios"
      aria-labelledby="servicios-titulo"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-16 sm:px-8 sm:py-24 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]"
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal as="p" className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              {c.eyebrow}
            </Reveal>
            <SplitReveal
              as="h2"
              text={c.title}
              className="mt-3 text-[clamp(2.2rem,4.5vw,4.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground"
            />
          </div>
          <p aria-hidden="true" className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55 lg:[@media(hover:hover)]:block">
            ↳ {c.hint}
          </p>
        </div>
        <span id="servicios-titulo" className="sr-only">{c.title}</span>

        {/* Escritorio: cuatro puertas que se abren */}
        <ul className="mt-8 hidden h-[min(60svh,600px)] min-h-[480px] gap-3 lg:flex [--door-open:1.9] xl:[--door-open:2.5]">
          {SERVICE_SOLUTIONS.map((service, index) => {
            const isActive = index === active;
            return (
              <li
                key={service.id}
                data-door={service.id}
                data-active={isActive || undefined}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") focusDoor(index); }}
                onFocus={() => focusDoor(index)}
                className={`group relative min-w-0 overflow-hidden rounded-[1.6rem] border bg-[#0B0B0A] transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isActive ? "border-white/25" : "border-white/10"}`}
                style={{ flexGrow: isActive ? "var(--door-open)" : 1, flexBasis: 0 }}
              >
                <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${isActive ? "opacity-100" : "opacity-35"}`}>
                  <DoorVisual service={service} language={language} live={isActive && inView} reduced={reduced} c={c} />
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,10,.92)_0%,rgba(11,11,10,.35)_16%,rgba(11,11,10,0)_30%,rgba(11,11,10,0)_42%,rgba(11,11,10,.9)_64%,rgba(11,11,10,.97)_78%,#0B0B0A_100%)]" />

                {/* Arriba: número y qué se está viendo */}
                <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[#ECE7DD]/70">{String(index + 1).padStart(2, "0")}</span>
                  <span className={`truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[#ECE7DD]/70 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
                    {visualLabel(service, c, language)}
                  </span>
                </div>

                {/* En reposo: el nombre de canto, de abajo hacia arriba */}
                <p
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-6 left-5 rotate-180 whitespace-nowrap text-[clamp(1.35rem,1.8vw,1.85rem)] font-medium leading-none tracking-[-0.04em] text-[#ECE7DD] transition-opacity duration-500 [writing-mode:vertical-rl] ${isActive ? "opacity-0" : "opacity-100"}`}
                >
                  {service.shortTitle[language]}
                </p>

                {/* Abierta: nombre, promesa y la puerta a su página */}
                <div className={`absolute inset-x-6 bottom-6 transition-opacity duration-500 ${isActive ? "opacity-100 delay-200" : "opacity-0"}`}>
                  <span aria-hidden="true" className="block h-px w-10" style={{ backgroundColor: service.accent }} />
                  <h3 className="mt-4 text-[clamp(1.75rem,2.6vw,2.6rem)] font-medium leading-[1] tracking-[-0.045em] text-[#ECE7DD]">
                    <Link
                      href={localePath(language, service.path)}
                      className="whitespace-nowrap after:absolute after:inset-0 after:rounded-[1.6rem] after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[#55D8FF]"
                    >
                      {service.shortTitle[language]}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#ECE7DD]/78">{service.headline[language]}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#ECE7DD]">
                    {c.open}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>

                {/* Avance automático: una línea que se llena en el color del servicio */}
                {isActive && autoplay ? (
                  <span
                    key={`progress-${cycle}`}
                    aria-hidden="true"
                    className="door-progress absolute inset-x-0 bottom-0 h-[2px] origin-left"
                    style={{ backgroundColor: service.accent, animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        {/* Teléfono y tablet: lista corta, cada fila lleva a su servicio */}
        <ol className="mt-8 border-b border-foreground/15 lg:hidden">
          {SERVICE_SOLUTIONS.map((service, index) => (
            <li key={service.id} className="border-t border-foreground/15">
              <Link
                href={localePath(language, service.path)}
                className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-3 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="pt-1.5 font-mono text-xs text-foreground/60">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="flex items-center gap-2.5 text-[1.6rem] font-medium leading-tight tracking-[-0.04em] text-foreground">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: service.accent }} />
                    {service.shortTitle[language]}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-foreground/70">{service.headline[language]}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="mt-2 h-5 w-5 text-foreground/50 transition-colors group-hover:text-signal" />
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-foreground/70 sm:text-base">
          {c.capabilities}
          <Link
            href={localePath(language, "/capacidades")}
            data-explore-door="capacidades"
            className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {c.capabilitiesCta}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </p>
      </div>
    </section>
  );
}
