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

// Secciones bajo el pliegue en chunks propios (con SSR: el HTML no cambia).
// Cada una es su propio límite de Suspense, así React hidrata por partes en
// vez de bloquear el hilo principal con todo el Home de una vez.
const ServicesSection = dynamic(() => import("@/components/premium/home/ServicesSection").then((m) => m.ServicesSection));
const TryItCards = dynamic(() => import("@/components/premium/home/TryItCards").then((m) => m.TryItCards));
const HowIWorkSection = dynamic(() => import("@/components/premium/home/HowIWorkSection").then((m) => m.HowIWorkSection));
const AplicarOS = dynamic(() => import("@/components/portfolio-isolated/AplicarOS").then((m) => m.AplicarOS));
import { MOTION_ASSETS } from "@/data/motionAssets";

// Cambiar a "/cv" cuando exista T06.
const CV_DESTINATION = "#contacto";

const copy = {
  es: {
    eyebrow: "Mario Morera · AI Automation & Operations",
    title: "Orquesto la tecnología de tu negocio: web, agentes de IA y contenido.",
    intro: "Diseño y conecto tu web, tus automatizaciones, agentes que atienden por ti y sistemas que producen contenido. Hablas conmigo y lo construyo yo; coordino a tu equipo, las herramientas y los modelos de IA para que trabajen juntos.",
    services: [
      { id: "web-ecommerce", label: "Webs y landings" },
      { id: "booking-payments", label: "Agentes de IA" },
      { id: "crm-automation", label: "Automatización y CRM" },
      { id: "ai-software", label: "Contenido con IA" },
    ],
    servicesHint: "Pasa por un servicio",
    cvLink: "¿Buscas a alguien para tu equipo? Ver CV →",
    talkWhatsapp: "Hablar por WhatsApp",
    startProject: "Ver proyectos",
    archiveEyebrow: "Proyectos",
    archiveTitle: "Tres sistemas que puedes abrir hoy.",
    archiveBody: "Cada tarjeta dice qué es: implementado o demo. Ábrelo y pruébalo.",
    archiveCta: "Ver todos los casos",
    contactEyebrow: "Hablemos",
    contactTitle: "¿Un puesto o un proyecto?",
    contactBody: "Si buscas a alguien para tu equipo o tienes un proyecto concreto, elige el camino que corresponda. Te respondo yo.",
    roleCta: "Consultar por un puesto",
    roleHint: "Te comparto mi CV y disponibilidad",
    roleSubject: "Puesto · Mario Morera",
    roleCopyEmail: "Copiar correo",
    emailCopied: "Correo copiado",
    emailCopyFallback: "El correo quedó seleccionado: cópialo con Ctrl+C (Cmd+C en Mac).",
    quickLine: "¿Prefieres una consulta rápida? Escríbeme por WhatsApp.",
    projectCta: "Consultar por un proyecto",
    projectHint: "Brief de 2 minutos; se abre aquí",
  },
  en: {
    eyebrow: "Mario Morera · AI Automation & Operations",
    title: "I orchestrate your business technology: web, AI agents and content.",
    intro: "I design and connect your website, your automations, agents that answer for you and systems that produce content. You talk to me and I build it; I coordinate your team, the tools and the AI models so they work together.",
    services: [
      { id: "web-ecommerce", label: "Websites & landing pages" },
      { id: "booking-payments", label: "AI agents" },
      { id: "crm-automation", label: "Automation & CRM" },
      { id: "ai-software", label: "AI content" },
    ],
    servicesHint: "Hover a service",
    cvLink: "Hiring for your team? View my resume →",
    talkWhatsapp: "Chat on WhatsApp",
    startProject: "View projects",
    archiveEyebrow: "Projects",
    archiveTitle: "Three systems you can open today.",
    archiveBody: "Each card says what it is: live or demo. Open it and try it.",
    archiveCta: "See all cases",
    contactEyebrow: "Let's talk",
    contactTitle: "A role or a project?",
    contactBody: "Whether you're hiring for your team or have a specific project, pick the path that fits. I'll reply myself.",
    roleCta: "Discuss a role",
    roleHint: "I'll share my resume and availability",
    roleSubject: "Role · Mario Morera",
    roleCopyEmail: "Copy email",
    emailCopied: "Email copied",
    emailCopyFallback: "The email is selected: copy it with Ctrl+C (Cmd+C on Mac).",
    quickLine: "Prefer a quick question? Message me on WhatsApp.",
    projectCta: "Discuss a project",
    projectHint: "2-minute brief; opens right here",
  },
};

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

  const { setFocusTechName } = useActiveTech();
  const [focusedService, setFocusedService] = useState<string | null>(null);
  const focusedSolution = SERVICE_SOLUTIONS.find((service) => service.id === focusedService);

  // El servicio enfocado se dibuja con las partículas del fondo.
  useEffect(() => {
    setFocusTechName(focusedService ? SERVICE_GLYPHS[focusedService]?.name ?? null : null);
  }, [focusedService, setFocusTechName]);
  useEffect(() => () => setFocusTechName(null), [setFocusTechName]);

  // Al salir del hero, el logo de partículas se abre y se disuelve (scrub).
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    particleScatter.set(value * 1.6);
    if (value > 0.35) setFocusedService(null);
  });
  useEffect(() => () => particleScatter.set(0), []);

  return (
    <main id="contenido-principal" className="relative pb-24">
      {/* ─── 1. HERO COMERCIAL Y DIRECTO ─── */}
      <section
        id="hero"
        ref={heroRef}
        data-home-section="hero"
        className="relative min-h-[92svh] flex items-center px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24 lg:px-12 overflow-hidden"
      >
        <div className="relative z-10 mx-auto w-full max-w-[1480px]">
          <div className="max-w-4xl">
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

            {/* Main Punchy Title */}
            <SplitReveal
              as="h1"
              mode="load"
              delay={0.1}
              text={c.title}
              className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.055em] text-foreground"
            />

            {/* Direct Subtitle */}
            <p
              className="fade-up-in mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-xl font-light"
              style={{ animationDelay: "0.3s" }}
            >
              {c.intro}
            </p>

            {/* Servicios: al enfocarlos, las partículas dibujan su glifo */}
            <div className="fade-up-in mt-7" style={{ animationDelay: "0.45s" }}>
              <ul className="flex flex-wrap gap-2" onPointerLeave={() => setFocusedService(null)}>
                {c.services.map((service) => {
                  const active = focusedService === service.id;
                  const accent = SERVICE_SOLUTIONS.find((item) => item.id === service.id)?.accent ?? "#71F3A2";
                  return (
                    <li key={service.id}>
                      <a
                        href="#servicios"
                        onPointerEnter={(event) => { if (event.pointerType === "mouse") setFocusedService(service.id); }}
                        onFocus={() => setFocusedService(service.id)}
                        onBlur={() => setFocusedService(null)}
                        aria-describedby={active ? "hero-service-promise" : undefined}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-foreground/40 bg-foreground/10 text-foreground" : "border-white/10 bg-card/50 text-foreground/75 light:border-[rgb(var(--ink-rgb)/0.1)]"}`}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full transition-transform duration-300"
                          style={{ backgroundColor: accent, transform: active ? "scale(1.6)" : undefined }}
                        />
                        {service.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 h-6 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={focusedSolution?.id ?? "hint"}
                    id={focusedSolution ? "hero-service-promise" : undefined}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                    className={focusedSolution ? "text-sm text-foreground/80" : "font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55 hidden [@media(hover:hover)]:block"}
                  >
                    {focusedSolution ? focusedSolution.headline[language] : `↳ ${c.servicesHint}`}
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
            <Link href={CV_DESTINATION.startsWith("#") ? CV_DESTINATION : localePath(language, CV_DESTINATION)} className="mt-5 inline-flex min-h-11 items-center text-sm text-foreground/75 underline underline-offset-4 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.cvLink}</Link>
          </div>
        </div>
      </section>

      {/* ─── 2. SERVICIOS Y SOLUCIONES (4 servicios claros) ─── */}
      <ServicesSection />

      {/* ─── 3. PROYECTOS EN PRODUCCIÓN (Índice con preview viva) ─── */}
      <section id="proyectos" className="scroll-mt-20 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-6 py-8 md:grid-cols-[1.2fr_.8fr] md:items-end md:py-12">
            <div>
              <Reveal as="p" x={-20} y={0} className="font-mono text-[10px] uppercase tracking-[.2em] text-signal">
                {c.archiveEyebrow}
              </Reveal>
              <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,4.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                {c.archiveTitle}
              </h2>
            </div>
            <div className="md:justify-self-end max-w-xl">
              <p className="text-sm sm:text-base leading-relaxed text-foreground/60">{c.archiveBody}</p>
              <Link
                href={localePath(language, "/casos-de-exito")}
                className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {c.archiveCta}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <Reveal y={24}>
            <TryItCards projects={FEATURED_CASES} />
          </Reveal>
        </div>
      </section>

      <HowIWorkSection />

      {/* ─── 7. CONTACTO DIRECTO & FORMULARIO INTERACTIVO ─── */}
      <section id="contacto" className="scroll-mt-20 relative isolate overflow-hidden border-t border-white/10 bg-relieve px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/20">
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
              <button type="button" onClick={copyRoleEmail} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.roleCopyEmail}</button>
              <p aria-live="polite" aria-atomic="true" className="text-xs leading-relaxed text-foreground/75">{emailStatus === "copied" ? c.emailCopied : emailStatus === "selected" ? c.emailCopyFallback : ""}</p>
              {/* Ver CV queda oculto hasta que exista /cv (T06). */}
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
