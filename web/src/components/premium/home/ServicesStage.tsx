"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { SERVICE_SOLUTIONS, type ServiceSolution } from "@/data/solutionsData";
import { getProjectCase } from "@/data/projectCases";
import { getCaseMedia } from "@/data/caseMedia";
import { getDoorFilm } from "@/data/doorFilms";
import { CaseReel } from "@/components/shared/CaseReel";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Escena 2 del home: los cuatro servicios como cuatro puertas. Cada una
 * lleva un film a sangre hecho en Remotion (components/films/puertas), con el
 * mismo criterio (primero el cine, después la interfaz) y un color propio:
 * el azul del lavado de L&B con su web, el dorado de la barbería con la
 * conversación del agente, el verde de te_Cargo con una reserva que se cobra
 * sola y el coral de Vespera con el reencuadre de una escena generada. En
 * escritorio la puerta enfocada se abre y las demás quedan en reposo con su
 * nombre de canto; mientras nadie interactúa, el foco avanza solo. En el
 * teléfono, una lista corta: los reels llegan en la escena de casos.
 */

/** Lo que dura el film más largo: cada puerta alcanza a contar lo suyo. */
const AUTO_ADVANCE_MS = 8000;

const copy = {
  es: {
    eyebrow: "02 — Servicios",
    title: "¿Qué necesitas resolver?",
    hint: "Pasa por cada puerta",
    open: "Ver cómo funciona",
    capabilities: "Detrás de estos cuatro servicios hay nueve capacidades.",
    capabilitiesCta: "Explóralas",
    seeCase: "ver el caso",
  },
  en: {
    eyebrow: "02 — Services",
    title: "What do you need solved?",
    hint: "Hover each door",
    open: "See how it works",
    capabilities: "Behind these four services there are nine capabilities.",
    capabilitiesCta: "Explore them",
    seeCase: "view the case",
  },
} as const;

/** Qué se ve en el film de la puerta; sin film, el nombre del caso que prueba el servicio. */
function visualLabel(service: ServiceSolution, language: Language): string {
  return getDoorFilm(service.id, language)?.source[language] ?? getProjectCase(service.proofSlug)?.title[language] ?? "";
}

/** El color de la puerta: el de su film; si no tiene, el del servicio. */
const doorTone = (service: ServiceSolution, language: Language) => getDoorFilm(service.id, language)?.tone ?? service.accent;

/** El film de la puerta, a sangre: el de la propia puerta o el reel del caso que la prueba. */
function DoorVisual({ service, language, live }: { service: ServiceSolution; language: Language; live: boolean }) {
  const reel = getDoorFilm(service.id, language) ?? getCaseMedia(service.proofSlug)?.reel;
  return reel ? <CaseReel key={reel.webm} reel={reel} alt="" playing={live} restartOnPlay className="absolute inset-0 h-full w-full" sizes="(min-width: 1024px) 45vw, 100vw" /> : null;
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
            const caseSlug = getDoorFilm(service.id, language)?.caseSlug;
            return (
              <li
                key={service.id}
                data-door={service.id}
                data-active={isActive || undefined}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") focusDoor(index); }}
                onFocus={() => focusDoor(index)}
                className={`group relative flex min-w-0 flex-col justify-end overflow-hidden rounded-[1.6rem] border bg-[#0B0B0A] transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isActive ? "border-white/25" : "border-white/10"}`}
                style={{ flexGrow: isActive ? "var(--door-open)" : 1, flexBasis: 0 }}
              >
                <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${isActive ? "opacity-100" : "opacity-60"}`}>
                  <DoorVisual service={service} language={language} live={isActive && inView} />
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,10,.92)_0%,rgba(11,11,10,.35)_16%,rgba(11,11,10,0)_30%,rgba(11,11,10,0)_42%,rgba(11,11,10,.9)_64%,rgba(11,11,10,.97)_78%,#0B0B0A_100%)]" />

                {/* Arriba: número y qué se está viendo. Si el film sale de un caso con página, el rótulo lleva a ese caso. */}
                <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[#ECE7DD]/70">{String(index + 1).padStart(2, "0")}</span>
                  {caseSlug ? (
                    <Link
                      href={localePath(language, `/casos-de-exito/${caseSlug}`)}
                      data-door-case={caseSlug}
                      tabIndex={isActive ? undefined : -1}
                      aria-hidden={isActive ? undefined : true}
                      className={`-my-3 inline-flex min-w-0 items-center gap-1.5 rounded py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ECE7DD]/70 transition-[opacity,color] duration-500 hover:text-[#ECE7DD] focus-visible:text-[#ECE7DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECE7DD]/70 ${isActive ? "pointer-events-auto opacity-100" : "opacity-0"}`}
                    >
                      <span className="truncate">{visualLabel(service, language)}</span>
                      <span className="sr-only">: {c.seeCase}</span>
                      <ArrowUpRight aria-hidden="true" className="h-3 w-3 shrink-0" />
                    </Link>
                  ) : (
                    <span className={`truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[#ECE7DD]/70 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
                      {visualLabel(service, language)}
                    </span>
                  )}
                </div>

                {/* En reposo: el nombre de canto, de abajo hacia arriba */}
                <p
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-6 left-5 rotate-180 whitespace-nowrap text-[clamp(1.35rem,1.8vw,1.85rem)] font-medium leading-none tracking-[-0.04em] text-[#ECE7DD] transition-opacity duration-500 [writing-mode:vertical-rl] ${isActive ? "opacity-0" : "opacity-100"}`}
                >
                  {service.shortTitle[language]}
                </p>

                {/* Abierta: nombre, promesa y la puerta a su página. Este bloque no lleva
                    posición para que el enlace cubra toda la puerta, abierta o cerrada:
                    en una pantalla táctil no hay hover, así que tocarla lleva al servicio.
                    Es un ítem flex: el z-10 lo sube sobre el degradado sin cambiar eso. */}
                <div className={`z-10 mx-6 mb-6 transition-opacity duration-500 ${isActive ? "opacity-100 delay-200" : "opacity-0"}`}>
                  <span aria-hidden="true" className="block h-px w-10" style={{ backgroundColor: doorTone(service, language) }} />
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
                    style={{ backgroundColor: doorTone(service, language), animationDuration: `${AUTO_ADVANCE_MS}ms` }}
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
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: doorTone(service, language) }} />
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
