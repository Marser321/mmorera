"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { DURATION, EASE_OUT } from "@/lib/motion";
import type { TrackId } from "@/types/site";
import { DecodeText } from "@/components/motion/DecodeText";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/scroll/Reveal";
import { CaseBento } from "@/components/premium/CaseBento";
import { FEATURED_CASES } from "@/data/projectCases";
import { ServicesSection } from "@/components/premium/home/ServicesSection";
import { OrchestrationWheelSection } from "@/components/premium/home/OrchestrationWheelSection";
import { WorkflowSection } from "@/components/premium/home/WorkflowSection";
import { IslandBar } from "@/components/layout/IslandBar";
import { AplicarOS } from "@/components/portfolio-isolated/AplicarOS";
import { BackgroundVideo } from "@/components/shared/BackgroundVideo";
import { AuthorManifestoScene, type AuthorManifestoCopy } from "@/components/premium/AuthorManifestoScene";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";
import { MOTION_ASSETS } from "@/data/motionAssets";

const copy = {
  es: {
    eyebrow: "Mario Morera · Creative Technologist & Systems Builder",
    title: "Todo tu ecosistema digital, resuelto por una sola persona.",
    intro: "Webs que venden, reservas y cobros automáticos, CRM e inteligencia artificial aplicada. Diseño y desarrollo de punta a punta, sin intermediarios.",
    services: ["Webs & E-commerce", "Reservas & Cobros", "CRM & Automatización", "IA a medida"],
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
    services: ["Websites & E-commerce", "Bookings & Payments", "CRM & Automation", "Custom AI"],
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

export function HomeExperience({
  initialTrack: _track = "build",
}: {
  initialTrack?: TrackId;
  initialModeSelected?: boolean;
} = {}) {
  void _track;
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const c = copy[language];

  return (
    <main id="contenido-principal" className="relative pb-24">
      {/* ─── 1. HERO COMERCIAL Y DIRECTO ─── */}
      <section
        id="hero"
        ref={heroRef}
        data-home-section="hero"
        className="relative min-h-[92svh] flex items-center px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24 lg:px-12 overflow-hidden"
      >
        <BackgroundVideo
          src="/videos/graphite-core.mp4"
          poster="/videos/posters/graphite-core.jpg"
          intensity="subtle"
          scrim="radial"
          tint="signal"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1480px]">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-3.5 py-1.5 backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/80 mb-6"
            >
              <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_#71F3A2]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/75 sm:text-[11px]">
                <DecodeText text={c.eyebrow} decodeOnMount duration={700} />
              </span>
            </motion.div>

            {/* Main Punchy Title */}
            <SplitReveal
              as="h1"
              mode="load"
              delay={0.1}
              text={c.title}
              className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.055em] text-foreground"
            />

            {/* Direct Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.3 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-xl font-light"
            >
              {c.intro}
            </motion.p>

            {/* Servicios en una línea */}
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.45 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {c.services.map((service) => (
                <li key={service}>
                  <a
                    href="#servicios"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/50 px-3.5 py-1.5 text-xs font-medium text-foreground/75 backdrop-blur-md transition-colors hover:border-signal/40 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.1)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    {service}
                  </a>
                </li>
              ))}
            </motion.ul>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 2. SERVICIOS Y SOLUCIONES (4 servicios claros) ─── */}
      <ServicesSection />

      {/* ─── 3. PROYECTOS EN PRODUCCIÓN (Bento de casos destacados) ─── */}
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

          <Reveal y={24}>
            <CaseBento projects={FEATURED_CASES} featureFirst className="pb-4" />
          </Reveal>
        </div>
      </section>

      {/* ─── 4. LA RUEDA INTERACTIVA DE ORQUESTACIÓN (Stack conectado) ─── */}
      <OrchestrationWheelSection />

      {/* ─── 5. PERFIL & FILOSOFÍA (Cinemática interactiva) ─── */}
      <div id="perfil" className="scroll-mt-20">
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
