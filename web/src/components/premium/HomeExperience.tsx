"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { localePath } from "@/config/site";
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
import type { AuthorManifestoCopy } from "@/components/premium/AuthorManifestoScene";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";

// Secciones bajo el pliegue en chunks propios (con SSR: el HTML no cambia).
// Cada una es su propio límite de Suspense, así React hidrata por partes en
// vez de bloquear el hilo principal con todo el Home de una vez.
const ServicesSection = dynamic(() => import("@/components/premium/home/ServicesSection").then((m) => m.ServicesSection));
const ProjectIndex = dynamic(() => import("@/components/premium/ProjectIndex").then((m) => m.ProjectIndex));
const FilmRail = dynamic(() => import("@/components/films/FilmRail").then((m) => m.FilmRail));
const OrchestrationWheelSection = dynamic(() => import("@/components/premium/home/OrchestrationWheelSection").then((m) => m.OrchestrationWheelSection));
const LogoOvertureSection = dynamic(() => import("@/components/films/LogoOvertureSection").then((m) => m.LogoOvertureSection));
const AuthorManifestoScene = dynamic(() => import("@/components/premium/AuthorManifestoScene").then((m) => m.AuthorManifestoScene));
const WorkflowSection = dynamic(() => import("@/components/premium/home/WorkflowSection").then((m) => m.WorkflowSection));
const AplicarOS = dynamic(() => import("@/components/portfolio-isolated/AplicarOS").then((m) => m.AplicarOS));
import { MOTION_ASSETS } from "@/data/motionAssets";

const copy = {
  es: {
    eyebrow: "Mario Morera · Creative Technologist & Systems Builder",
    title: "Todo tu ecosistema digital, resuelto por una sola persona.",
    intro: "Webs que venden, reservas y cobros automáticos, CRM e inteligencia artificial aplicada. Diseño y desarrollo de punta a punta, sin intermediarios.",
    services: [
      { id: "web-ecommerce", label: "Webs & E-commerce" },
      { id: "booking-payments", label: "Reservas & Cobros" },
      { id: "crm-automation", label: "CRM & Automatización" },
      { id: "ai-software", label: "IA a medida" },
    ],
    servicesHint: "Pasá por un servicio",
    talkWhatsapp: "Hablar por WhatsApp",
    startProject: "Iniciar Proyecto",
    archiveEyebrow: "Proyectos",
    archiveTitle: "Trabajo real, en producción.",
    archiveBody: "Sitios y sistemas operando hoy. Abrí cada caso para verlo en vivo.",
    archiveCta: "Ver todos los casos",
    contactEyebrow: "Contacto Directo",
    contactTitle: "¿Qué querés construir o automatizar?",
    contactBody: "Completá el brief en 2 minutos o escribime directo por WhatsApp.",
    capacity: "Cupos limitados · 4 a 5 proyectos por trimestre",
  },
  en: {
    eyebrow: "Mario Morera · Creative Technologist & Systems Builder",
    title: "Your entire digital ecosystem, engineered by one person.",
    intro: "Websites that sell, automated bookings and payments, CRM and applied AI. Design and development end to end, with no intermediaries.",
    services: [
      { id: "web-ecommerce", label: "Websites & E-commerce" },
      { id: "booking-payments", label: "Bookings & Payments" },
      { id: "crm-automation", label: "CRM & Automation" },
      { id: "ai-software", label: "Custom AI" },
    ],
    servicesHint: "Hover a service",
    talkWhatsapp: "Chat on WhatsApp",
    startProject: "Start Project",
    archiveEyebrow: "Projects",
    archiveTitle: "Real work, in production.",
    archiveBody: "Sites and systems running today. Open each case to see it live.",
    archiveCta: "See all cases",
    contactEyebrow: "Direct Contact",
    contactTitle: "What do you want to build or automate?",
    contactBody: "Fill out the 2-minute brief or message me directly on WhatsApp.",
    capacity: "Limited spots · 4 to 5 projects per quarter",
  },
};

const authorManifestoCopy = {
  es: {
    eyebrow: "Perfil & Filosofía",
    convergence: "Una sola dirección",
    headline: "Una sola dirección para todo lo que una idea necesita.",
    body: "Diseño de alto impacto, arquitectura en Next.js 16 y automatización con IA. Sin intermediarios, directo a producción.",
    principleLabel: "Principio",
    principle: "Sistemas propios con identidad clara, construidos para operar y facturar.",
    signature: "Mario Morera",
  },
  en: {
    eyebrow: "Profile & Philosophy",
    convergence: "One direction",
    headline: "One direction for everything an idea needs.",
    body: "High-impact design, Next.js 16 architecture, and AI automation. Zero intermediaries, shipped straight to production.",
    principleLabel: "Principle",
    principle: "Proprietary systems with clear identity, engineered to operate and generate revenue.",
    signature: "Mario Morera",
  },
} satisfies Record<"es" | "en", AuthorManifestoCopy>;

export function HomeExperience() {
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const c = copy[language];
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
                    className={focusedSolution ? "text-sm text-foreground/80" : "font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55 max-sm:hidden"}
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
                  href="#contacto"
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
                  className="pressable inline-flex items-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 px-6 py-3.5 text-sm font-semibold text-[#25D366] backdrop-blur-md transition-all hover:bg-[#25D366]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {c.talkWhatsapp}
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. SERVICIOS Y SOLUCIONES (4 servicios claros) ─── */}
      <ServicesSection />

      {/* ─── 3. PROYECTOS EN PRODUCCIÓN (Índice con preview viva) ─── */}
      <section id="proyectos" className="scroll-mt-20 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-6 py-8 md:grid-cols-[.4fr_1.6fr] md:items-end md:py-12">
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

          <FilmRail />

          <Reveal y={24}>
            <ProjectIndex projects={FEATURED_CASES} />
          </Reveal>
        </div>
      </section>

      {/* ─── 4. LA RUEDA INTERACTIVA DE ORQUESTACIÓN (Stack conectado) ─── */}
      <OrchestrationWheelSection />

      {/* ─── 5. PERFIL & FILOSOFÍA (Cinemática interactiva) ─── */}
      <div id="perfil" className="scroll-mt-20">
        {/* Entrada del monograma: el prompt de código que gira hasta ser la doble M */}
        <LogoOvertureSection />
        <AuthorManifestoScene
          language={language}
          copy={authorManifestoCopy[language]}
        />
      </div>

      {/* ─── 6. METODOLOGÍA (4 fases claras) ─── */}
      <WorkflowSection />

      {/* ─── 7. CONTACTO DIRECTO & FORMULARIO INTERACTIVO ─── */}
      <section id="contacto" className="scroll-mt-20 relative isolate overflow-hidden border-t border-white/10 bg-card/40 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/20">
        <MotionBackdrop asset={MOTION_ASSETS.opening} intensity={0.28} scrim="center" />
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
          <Reveal as="p" className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 font-mono text-[11px] text-amber-400">
            {c.capacity}
          </Reveal>
        </div>

        {/* Embedded Brief Form */}
        <div className="mt-8">
          <AplicarOS />
        </div>
      </section>

      {/* ─── ISLAND BAR (Barra flotante inferior de acceso rápido) ─── */}
      <IslandBar />
    </main>
  );
}
