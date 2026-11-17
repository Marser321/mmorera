"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { localePath, SITE_IDENTITY } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { SERVICE_SOLUTIONS } from "@/data/solutionsData";
import { SERVICE_GLYPHS } from "@/data/serviceGlyphs";
import { BRAND_GLYPHS } from "@/data/brandGlyphs";
import { particleScatter } from "@/lib/particleScatter";
import { EASE_OUT } from "@/lib/motion";
import { DecodeText } from "@/components/motion/DecodeText";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/scroll/Reveal";
import { FEATURED_CASES } from "@/data/projectCases";
import { IslandBar } from "@/components/layout/IslandBar";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";
import { MonogramaFundido } from "@/components/marca/MonogramaFundido";
import { HeroStage } from "@/components/premium/home/HeroStage";
import { HERO_STAGE_MS, HERO_STAGE_PAIRS } from "@/data/heroStage";
import { particleStage, STAGE_FRAME_NAME } from "@/lib/particleStage";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

// Secciones bajo el pliegue en chunks propios (con SSR: el HTML no cambia).
// Cada una es su propio límite de Suspense, así React hidrata por partes en
// vez de bloquear el hilo principal con todo el Home de una vez.
const ServicesStage = dynamic(() => import("@/components/premium/home/ServicesStage").then((m) => m.ServicesStage));
const ProjectIndex = dynamic(() => import("@/components/premium/ProjectIndex").then((m) => m.ProjectIndex));
const AuthorTrailer = dynamic(() => import("@/components/premium/home/AuthorTrailer").then((m) => m.AuthorTrailer));
const AplicarOS = dynamic(() => import("@/components/portfolio-isolated/AplicarOS").then((m) => m.AplicarOS));
import { MOTION_ASSETS } from "@/data/motionAssets";

const CV_DESTINATION = "/sobre-mi#cv";
/**
 * El recorrido del escenario arranca cuando la obertura de partículas ya formó
 * la doble M y se la vio un momento (`afterMonogram`). Si la obertura ya se vio
 * en esta visita, arranca enseguida (`later`). `atLatest` es el tope, por si
 * las partículas no llegan a avisar (sin WebGL, por ejemplo).
 */
const STAGE_STARTS_AFTER_MS = { afterMonogram: 1700, later: 0, atLatest: 12000 } as const;
/** Lo que van a dibujar las partículas en el recorrido: el marco de la ventana y el logo de cada tecnología. */
const STAGE_SHAPES: readonly string[] = [STAGE_FRAME_NAME, ...HERO_STAGE_PAIRS.map((pair) => pair.tech)];

/*
 * El home es un film corto en cinco escenas (3/11): 01 héroe con la obertura
 * de partículas, 02 servicios como puertas, 03 casos con su reel, 04 la
 * película de autor con el método y 05 el contacto. Cada escena dice una sola
 * cosa y termina en una puerta a su rama; lo largo vive en las ramas.
 */
const copy = {
  es: {
    eyebrow: "Mario Morera · AI Automation & Operations",
    title: "Orquesto la tecnología de tu negocio.",
    intro: "Web, agentes de IA, automatización y contenido, conectados y a tu nombre. Lo diseño y lo construyo yo, de punta a punta.",
    servicesHint: "Pasa por un servicio",
    cvLink: "¿Buscas a alguien para tu equipo? Ver CV →",
    talkWhatsapp: "Hablar por WhatsApp",
    startProject: "Ver el trabajo",
    scrollCue: "Recorre",
    archiveEyebrow: "03 — Casos",
    archiveTitle: "Lo que ya construí, funcionando.",
    archiveBody: "Pasa el mouse para verlo en movimiento. Ábrelo para ver qué resolvió y probarlo.",
    archiveCta: "Ver todos los casos",
    useCasesCta: "Casos de uso, contados como films",
    labCta: "Lab: demos que puedes tocar",
    contactEyebrow: "05 — Hablemos",
    contactTitle: "Hablemos de tu proyecto.",
    contactBody: "Cuéntame qué quieres resolver. Te respondo yo. Si buscas a alguien para tu equipo, también.",
    roleCta: "Consultar por un puesto",
    roleHint: "Te comparto mi CV y disponibilidad",
    roleSubject: "Puesto · Mario Morera",
    roleViewCv: "Ver CV",
    roleCopyEmail: "Copiar correo",
    emailCopied: "Correo copiado",
    emailCopyFallback: "El correo quedó seleccionado: cópialo con Ctrl+C (Cmd+C en Mac).",
    quickLine: "¿Más rápido? Escríbeme por WhatsApp.",
    projectCta: "Consultar por un proyecto",
    projectHint: "Brief de 2 minutos; se abre aquí",
  },
  en: {
    eyebrow: "Mario Morera · AI Automation & Operations",
    title: "I orchestrate your business technology.",
    intro: "Website, AI agents, automation and content, connected and in your name. I design it and build it myself, end to end.",
    servicesHint: "Hover a service",
    cvLink: "Hiring for your team? View my resume →",
    talkWhatsapp: "Chat on WhatsApp",
    startProject: "See the work",
    scrollCue: "Scroll",
    archiveEyebrow: "03 — Cases",
    archiveTitle: "What I've built, up and running.",
    archiveBody: "Hover to see it in motion. Open it to see what it solved and try it.",
    archiveCta: "See all cases",
    useCasesCta: "Use cases, told as films",
    labCta: "Lab: demos you can try",
    contactEyebrow: "05 — Let's talk",
    contactTitle: "Let's talk about your project.",
    contactBody: "Tell me what you want to solve. I reply myself. If you're hiring for your team, that too.",
    roleCta: "Discuss a role",
    roleHint: "I'll share my resume and availability",
    roleSubject: "Role · Mario Morera",
    roleViewCv: "View resume",
    roleCopyEmail: "Copy email",
    emailCopied: "Email copied",
    emailCopyFallback: "The email is selected: copy it with Ctrl+C (Cmd+C on Mac).",
    quickLine: "Faster? Message me on WhatsApp.",
    projectCta: "Discuss a project",
    projectHint: "2-minute brief; opens right here",
  },
};

/**
 * El hero tiene un escenario: las partículas dibujan el logo de una tecnología,
 * como siempre, y después se transforman en el marco de una ventana chica que
 * muestra algo hecho con ella (data/heroStage.ts), mientras se enciende su
 * servicio en la lista.
 */
export function HomeExperience() {
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const c = copy[language];
  const [briefOpen, setBriefOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "copied" | "selected">("idle");
  const briefRef = useRef<HTMLDivElement>(null);
  const roleEmailRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const openFromHash = () => { if (window.location.hash === "#brief") setBriefOpen(true); };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    if (!briefOpen || !briefRef.current) return;
    const focusFirst = () => {
      const input = briefRef.current?.querySelector<HTMLElement>('input:not([type="hidden"]):not([tabindex="-1"]), textarea, select');
      if (!input) return false;
      input.focus();
      return true;
    };
    if (focusFirst()) return;
    const observer = new MutationObserver(() => { if (focusFirst()) observer.disconnect(); });
    observer.observe(briefRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [briefOpen]);

  async function copyRoleEmail() {
    try {
      await navigator.clipboard.writeText(SITE_IDENTITY.contact.email);
      setEmailStatus("copied");
    } catch {
      // El correo sigue disponible aunque el navegador deniegue el portapapeles.
      const email = roleEmailRef.current;
      if (email) {
        email.focus();
        const range = document.createRange();
        range.selectNodeContents(email);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setEmailStatus("selected");
    }
  }

  const { setFocusTechName, activeTechName } = useActiveTech();
  const [focusedService, setFocusedService] = useState<string | null>(null);

  // Escenario del hero: la tecnología que dibujan las partículas y en qué se convierte.
  const reducedMotion = useReducedMotionSafe();
  const [stageStarted, setStageStarted] = useState(false);
  const [stage, setStage] = useState<{ index: number; phase: "logo" | "film" }>({ index: 0, phase: "logo" });
  const [stagePlaying, setStagePlaying] = useState(true);
  const [heroInView, setHeroInView] = useState(true);
  const [wideScreen, setWideScreen] = useState(false);
  const stagePair = HERO_STAGE_PAIRS[stage.index] ?? HERO_STAGE_PAIRS[0];
  /** En pantalla angosta no hay paso de logo aparte: las partículas lo dibujan detrás del texto mientras se ve la ventana. */
  const stageStep = wideScreen ? stage.phase : "film";
  /** El servicio que se enciende en la lista: el que el visitante enfoca o, si no, el del par que se ve. */
  const stageServiceId = focusedService ?? (stageStarted ? stagePair.serviceId : null);
  const stageRunning = stageStarted && stagePlaying && !reducedMotion && focusedService === null && heroInView;
  /** El servicio que se nombra bajo la lista: el mismo que está encendido. */
  const shownSolution = SERVICE_SOLUTIONS.find((service) => service.id === stageServiceId);
  /**
   * Sin movimiento y en pantalla ancha no hay ventana: a la derecha queda la
   * marca quieta que deja el campo de partículas (la doble M o el glifo del
   * servicio enfocado), y la ventana le quedaría encima.
   */
  const stageWindow = !(reducedMotion && wideScreen);

  /** Enfocar un servicio salta a su par, directo a la ventana, aunque la obertura no haya terminado; el recorrido sigue desde ahí. */
  const focusService = (id: string) => {
    setFocusedService(id);
    const index = HERO_STAGE_PAIRS.findIndex((pair) => pair.serviceId === id);
    if (index < 0) return;
    setStage({ index, phase: "film" });
    setStageStarted(true);
  };

  // El recorrido espera a la obertura: arranca un momento después de que las partículas avisan que la doble M ya se reconoce.
  const monogramFormed = activeTechName === BRAND_GLYPHS.monogram.name;
  const stageWaitsSince = useRef<{ at: number; seen: boolean } | null>(null);
  useEffect(() => {
    if (stageStarted) return;
    if (!stageWaitsSince.current) {
      let seen = false;
      try {
        seen = window.sessionStorage.getItem("mm-obertura") === "1";
      } catch {
        // Sin almacenamiento se espera la obertura completa.
      }
      stageWaitsSince.current = { at: performance.now(), seen };
    }
    const { at, seen } = stageWaitsSince.current;
    const untilLatest = Math.max(0, at + STAGE_STARTS_AFTER_MS.atLatest - performance.now());
    const wait = seen || reducedMotion
      ? STAGE_STARTS_AFTER_MS.later
      : monogramFormed ? Math.min(STAGE_STARTS_AFTER_MS.afterMonogram, untilLatest) : untilLatest;
    const timer = window.setTimeout(() => setStageStarted(true), wait);
    return () => window.clearTimeout(timer);
  }, [monogramFormed, reducedMotion, stageStarted]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWideScreen(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Cada par tiene dos pasos: el logo en partículas y después la ventana con su film.
  // En pantalla angosta es uno solo, lo que dura el film.
  useEffect(() => {
    if (!stageRunning) return;
    const timer = window.setTimeout(() => {
      setStage((current) => (wideScreen && current.phase === "logo"
        ? { index: current.index, phase: "film" }
        : { index: (current.index + 1) % HERO_STAGE_PAIRS.length, phase: "logo" }));
    }, HERO_STAGE_MS[stageStep]);
    return () => window.clearTimeout(timer);
  }, [stage, stageRunning, stageStep, wideScreen]);

  // Las partículas dibujan el logo de la tecnología y, en pantalla ancha, después el marco de la ventana.
  useEffect(() => {
    const touring = stageStarted && !reducedMotion;
    // En pantalla ancha una forma se transforma directo en la siguiente: logo, marco, logo.
    // En pantalla angosta la ventana va debajo del texto, así que las partículas se quedan
    // con el logo de la tecnología que se está viendo.
    // Las formas del recorrido se preparan desde el principio, durante la obertura.
    particleStage.set({ morph: touring && wideScreen, warm: reducedMotion ? [] : STAGE_SHAPES });
    // Sin movimiento no hay recorrido: queda la marca quieta, o el glifo del servicio enfocado.
    if (reducedMotion) setFocusTechName(focusedService ? SERVICE_GLYPHS[focusedService]?.name ?? null : null);
    else if (!touring) setFocusTechName(null);
    else setFocusTechName(wideScreen && stageStep === "film" ? STAGE_FRAME_NAME : stagePair.tech);
  }, [focusedService, reducedMotion, setFocusTechName, stagePair.tech, stageStarted, stageStep, wideScreen]);
  useEffect(() => () => {
    setFocusTechName(null);
    particleStage.set({ morph: false, warm: [] });
  }, [setFocusTechName]);

  // Al salir del hero, el logo de partículas se abre y se disuelve (scrub).
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    particleScatter.set(value * 1.6);
    if (value > 0.35) setFocusedService(null);
    setHeroInView((previous) => (previous === value < 0.5 ? previous : value < 0.5));
  });
  useEffect(() => () => particleScatter.set(0), []);

  return (
    <main id="contenido-principal" className="relative pb-24">
      {/* ─── 1. HERO COMERCIAL Y DIRECTO ─── */}
      <section
        id="hero"
        ref={heroRef}
        data-home-section="hero"
        className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:flex-row lg:items-center lg:px-12"
      >
        <div className="relative z-10 mx-auto w-full max-w-[1480px]">
          <div className="max-w-4xl lg:max-w-[47%]">
            {/* Entradas del hero en CSS (.fade-up-in): visibles desde el primer
                paint, sin esperar la hidratación. */}
            {/* Eyebrow */}
            <div
              className="fade-up-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-3.5 py-1.5 backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/80 mb-6"
            >
              <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_#71F3A2]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/75 sm:text-[11px]">
                <DecodeText text={c.eyebrow} decodeOnMount duration={700} />
              </span>
            </div>

            {/* Una frase: qué hace. El resto lo cuentan las escenas. */}
            <SplitReveal
              as="h1"
              mode="load"
              delay={0.1}
              text={c.title}
              className="max-w-[13ch] text-[clamp(2.75rem,6.2vw,6.25rem)] font-medium leading-[0.94] tracking-[-0.06em] text-foreground"
            />

            <p
              className="fade-up-in mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg"
              style={{ animationDelay: "0.3s" }}
            >
              {c.intro}
            </p>

            {/* Servicios: se encienden al compás del escenario; al enfocar uno, el escenario salta a su par */}
            <div className="fade-up-in mt-7" style={{ animationDelay: "0.45s" }}>
              <ul className="flex flex-wrap gap-2" onPointerLeave={() => setFocusedService(null)}>
                {SERVICE_SOLUTIONS.map((service) => {
                  const active = stageServiceId === service.id;
                  // Cada servicio lleva el color de su par en el escenario.
                  const accent = HERO_STAGE_PAIRS.find((pair) => pair.serviceId === service.id)?.tone ?? service.accent;
                  return (
                    <li key={service.id}>
                      <a
                        href="#servicios"
                        onPointerEnter={(event) => { if (event.pointerType === "mouse") focusService(service.id); }}
                        onFocus={() => focusService(service.id)}
                        onBlur={() => setFocusedService(null)}
                        aria-describedby={active ? "hero-service-promise" : undefined}
                        className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-foreground/40 bg-foreground/10 text-foreground" : "border-white/10 bg-card/50 text-foreground/75 light:border-[rgb(var(--ink-rgb)/0.1)]"}`}
                      >
                        {/* Mientras se ve el film, la línea marca cuánto falta para la tecnología siguiente. */}
                        {active && stageRunning && stageStep === "film" && (
                          <span key={stage.index} aria-hidden="true" className="door-progress absolute inset-x-0 bottom-0 h-[2px] origin-left" style={{ backgroundColor: accent, animationDuration: `${HERO_STAGE_MS.film}ms` }} />
                        )}
                        <span
                          className="h-1.5 w-1.5 rounded-full transition-transform duration-300"
                          style={{ backgroundColor: accent, transform: active ? "scale(1.6)" : undefined }}
                        />
                        {service.shortTitle[language]}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 h-6 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={shownSolution?.id ?? "hint"}
                    id={shownSolution ? "hero-service-promise" : undefined}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                    className={shownSolution ? "text-sm text-foreground/80" : "font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55 hidden [@media(hover:hover)]:block"}
                  >
                    {shownSolution ? shownSolution.headline[language] : `↳ ${c.servicesHint}`}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fade-up-in mt-6 flex flex-wrap items-center gap-3.5" style={{ animationDelay: "0.6s" }}>
              <Magnetic>
                <a
                  href="#proyectos"
                  className="pressable inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {c.startProject}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Magnetic>

              <Magnetic>
                <a
                  href="https://wa.me/59892323675?text=Hola%20Mario,%20estoy%20viendo%20tu%20sitio%20y%20quiero%20hacerte%20una%20consulta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable inline-flex items-center gap-2.5 rounded-full border border-signal/40 bg-signal/15 px-6 py-3.5 text-sm font-semibold text-signal backdrop-blur-md transition-all hover:bg-signal/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <MessageCircle className="h-4 w-4" />
                  {c.talkWhatsapp}
                </a>
              </Magnetic>
            </div>
            <Link href={CV_DESTINATION.startsWith("#") ? CV_DESTINATION : localePath(language, CV_DESTINATION)} className="mt-4 inline-flex min-h-11 items-center text-sm text-foreground/65 underline decoration-foreground/25 underline-offset-4 hover:text-signal hover:decoration-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.cvLink}</Link>
          </div>
        </div>

        {/* El escenario: la ventana va donde las partículas dibujan el logo, y aparece cuando el logo se transforma. */}
        {/* Está montada desde el principio: en pantalla angosta guarda su lugar y lo de abajo no salta cuando aparece. */}
        {stageWindow && (
          <div className="relative z-10 mx-auto mt-10 w-full max-w-xl lg:absolute lg:left-[78vw] lg:top-[51svh] lg:mt-0 lg:w-[min(34vw,540px)] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-[54%]">
            <HeroStage pair={stagePair} visible={stageStarted && stageStep === "film"} framed={wideScreen} playing={stagePlaying} onTogglePlaying={() => setStagePlaying((value) => !value)} language={language} />
          </div>
        )}

        {/* Invitación a recorrer: un punto que baja por una línea fina */}
        <a
          href="#servicios"
          className="fade-up-in absolute bottom-10 right-12 z-20 hidden flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
          style={{ animationDelay: "1.2s" }}
        >
          <span className="[writing-mode:vertical-rl]">{c.scrollCue}</span>
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-foreground/15">
            <span className="scroll-cue-dot absolute left-1/2 top-0 h-3 w-[3px] -translate-x-1/2 rounded-full bg-signal" />
          </span>
        </a>
      </section>

      {/* ─── 2. SERVICIOS: cuatro puertas con su prueba en movimiento ─── */}
      <ServicesStage />

      {/* ─── 3. CASOS: índice con el reel de cada uno ─── */}
      <section id="proyectos" data-home-section="proyectos" className="scroll-mt-20 bg-background px-5 py-16 sm:px-8 sm:py-24 lg:px-12 border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-6 pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] md:items-end md:pb-12">
            <div>
              <Reveal as="p" x={-20} y={0} className="font-mono text-[10px] uppercase tracking-[.2em] text-signal">
                {c.archiveEyebrow}
              </Reveal>
              <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,4.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                {c.archiveTitle}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/60 sm:text-base md:justify-self-end">{c.archiveBody}</p>
          </div>

          <Reveal y={24}>
            <ProjectIndex projects={FEATURED_CASES} />
          </Reveal>

          {/* Puertas de la escena: el archivo completo, los casos contados como films y las demos */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <Link
              href={localePath(language, "/casos-de-exito")}
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {c.archiveCta}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            {([["casos-de-uso", "/casos-de-uso", c.useCasesCta], ["lab", "/lab", c.labCta]] as const).map(([door, path, label]) => (
              <Link
                key={door}
                href={localePath(language, path)}
                data-explore-door={door}
                className="group inline-flex min-h-11 items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. CÓMO TRABAJO: la película de autor con el método ─── */}
      <AuthorTrailer />

      {/* ─── 5. CONTACTO: dos caminos y el brief ─── */}
      <section id="contacto" data-home-section="contacto" className="scroll-mt-20 relative isolate overflow-hidden border-t border-white/10 bg-relieve px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/20">
        <MotionBackdrop asset={MOTION_ASSETS.opening} intensity={0.28} scrim="center" />
        {/* Monograma fundido en el margen: firma el cierre sin pisar el texto. */}
        <MonogramaFundido className="absolute left-[-7vw] top-10 z-0 w-[min(34vw,520px)] max-lg:hidden" fundido="diagonal" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal as="p" className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {c.contactEyebrow}
          </Reveal>
          <SplitReveal
            as="h2"
            text={c.contactTitle}
            className="mt-3 text-[clamp(2.2rem,4.5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-foreground/60">
            {c.contactBody}
          </Reveal>
          {/* Dos caminos: empleadores y clientes no llenan el mismo formulario. */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-foreground/15 bg-background/60 px-5 py-4 text-left">
              <a href={`mailto:${SITE_IDENTITY.contact.email}?subject=${encodeURIComponent(c.roleSubject)}`} className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-foreground hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {c.roleCta}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </a>
              <p className="mt-1 text-xs leading-relaxed text-foreground/75">{c.roleHint}</p>
              <p ref={roleEmailRef} tabIndex={-1} className="mt-3 break-all text-sm text-foreground/80 select-text">{SITE_IDENTITY.contact.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-5">
                <Link href={localePath(language, "/sobre-mi#cv")} className="inline-flex min-h-11 items-center text-sm font-semibold text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.roleViewCv}</Link>
                <button type="button" onClick={copyRoleEmail} className="inline-flex min-h-11 items-center text-sm font-semibold text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.roleCopyEmail}</button>
              </div>
              <p aria-live="polite" aria-atomic="true" className="text-xs leading-relaxed text-foreground/75">{emailStatus === "copied" ? c.emailCopied : emailStatus === "selected" ? c.emailCopyFallback : ""}</p>

            </div>
            <button type="button" aria-expanded={briefOpen} aria-controls="brief" onClick={() => setBriefOpen((open) => !open)} className="group rounded-2xl border border-foreground/15 bg-background/60 px-5 py-4 text-left transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
                {c.projectCta}
                <ArrowUpRight aria-hidden="true" className={`h-4 w-4 shrink-0 text-foreground/50 ${briefOpen ? "-rotate-45" : "rotate-90"}`} />
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-foreground/75">{c.projectHint}</span>
            </button>
          </div>
          <a href={SITE_IDENTITY.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center text-sm leading-relaxed text-foreground/75 underline underline-offset-4 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.quickLine}</a>
        </div>

        {/* Mantener montado conserva el borrador; hidden evita espacio y tabulación al cerrar. */}
        <div id="brief" ref={briefRef} hidden={!briefOpen} className="relative z-10 mt-8 scroll-mt-20">
          <AplicarOS />
        </div>
      </section>

      {/* ─── ISLAND BAR (Barra flotante inferior de acceso rápido) ─── */}
      <IslandBar />
    </main>
  );
}
