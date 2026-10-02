"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, MessageCircle, CheckCircle2, Shield, Zap } from "lucide-react";
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
import { IntegralValueSection } from "@/components/premium/home/IntegralValueSection";
import { ExclusivitySection } from "@/components/premium/home/ExclusivitySection";
import { OrchestrationWheelSection } from "@/components/premium/home/OrchestrationWheelSection";
import { DecisionHubSection } from "@/components/premium/home/DecisionHubSection";
import { WorkflowSection } from "@/components/premium/home/WorkflowSection";
import { IslandBar } from "@/components/layout/IslandBar";
import { AplicarOS } from "@/components/portfolio-isolated/AplicarOS";
import { BackgroundVideo } from "@/components/shared/BackgroundVideo";

const copy = {
  es: {
    eyebrow: "Mario Morera · Creative Technologist & Systems Builder",
    title: "Todo tu ecosistema digital, resuelto por una sola persona.",
    intro: "Diseño web de alto impacto en Next.js, sistemas de automatización con IA y CRM a medida. Sin intermediarios, sin burocracia y orientado a resultados medibles.",
    viewWork: "Ver Proyectos",
    talkWhatsapp: "Hablar por WhatsApp",
    startProject: "Iniciar Proyecto",
    archiveEyebrow: "Portafolio & Evidencia Viva",
    archiveTitle: "Casos de Estudio & Proyectos en Producción",
    archiveBody: "Sistemas reales operando hoy. Hacé clic para abrir la web en vivo y ver el desglose técnico de cada solución.",
    archiveCta: "Explorar todos los casos",
    contactEyebrow: "Contacto Directo",
    contactTitle: "¿Qué querés construir o automatizar?",
    contactBody: "Completá el formulario en 2 minutos para evaluar tu caso o escribime directo por WhatsApp para una respuesta inmediata.",
    badges: [
      { icon: Zap, text: "95+ Google PageSpeed" },
      { icon: Shield, text: "Código Propio en Next.js 15" },
      { icon: CheckCircle2, text: "Sprints de 1 a 3 semanas" },
    ],
  },
  en: {
    eyebrow: "Mario Morera · Creative Technologist & Systems Builder",
    title: "Your entire digital ecosystem, engineered by one person.",
    intro: "High-performance Next.js web development, custom CRM and AI automation workflows. Zero intermediaries, zero bureaucracy, built for real business outcomes.",
    viewWork: "View Projects",
    talkWhatsapp: "Chat on WhatsApp",
    startProject: "Start Project",
    archiveEyebrow: "Portfolio & Live Evidence",
    archiveTitle: "Case Studies & Live Production Deployments",
    archiveBody: "Real systems operating in production today. Click to explore the live website and technical breakdown of each solution.",
    archiveCta: "Explore all cases",
    contactEyebrow: "Direct Contact",
    contactTitle: "What do you want to build or automate?",
    contactBody: "Fill out the 2-minute brief to evaluate your setup or text me directly on WhatsApp for an express response.",
    badges: [
      { icon: Zap, text: "95+ Google PageSpeed" },
      { icon: Shield, text: "Custom Next.js 15 Codebase" },
      { icon: CheckCircle2, text: "1 to 3 Week Sprints" },
    ],
  },
};

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

            {/* Badges Rápidos */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.45 }}
              className="mt-6 flex flex-wrap gap-4 pt-2 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]"
            >
              {c.badges.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono text-foreground/60">
                    <Icon className="h-3.5 w-3.5 text-signal" />
                    <span>{b.text}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Magnetic>
                <a
                  href="#proyectos"
                  className="pressable inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {c.viewWork}
                  <ArrowDownRight className="h-4 w-4" />
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

              <Magnetic>
                <a
                  href="#contacto"
                  className="pressable inline-flex items-center gap-2 rounded-full border border-white/14 bg-background/50 px-5 py-3.5 text-sm font-medium text-foreground/80 transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground light:border-[rgb(var(--ink-rgb)/0.14)]"
                >
                  {c.startProject}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 2. SERVICIOS Y SOLUCIONES (Cards limpias estilo AD Media) ─── */}
      <ServicesSection />

      {/* ─── 3. LA RUEDA INTERACTIVA DE ORQUESTACIÓN (Menú con atmósfera reactiva) ─── */}
      <OrchestrationWheelSection />

      {/* ─── 4. LA TESIS CONTRA-CORRIENTE: EL OPERADOR INTEGRAL ─── */}
      <IntegralValueSection />

      {/* ─── 5. EXCLUSIVIDAD: 4 A 5 PROYECTOS POR TRIMESTRE (Cero Juniors) ─── */}
      <ExclusivitySection />

      {/* ─── 6. CENTRO DE CRITERIO (Dilemas CRM y Estrategia Visual) ─── */}
      <DecisionHubSection />

      {/* ─── 7. BLUEPRINT DE METODOLOGÍA (4 Fases claras) ─── */}
      <WorkflowSection />

      {/* ─── 6. CATÁLOGO DE CASOS REALES (Bento de proyectos en producción) ─── */}
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
            <CaseBento projects={FEATURED_CASES} featureFirst className="pt-6 pb-12" />
          </Reveal>
        </div>
      </section>

      {/* ─── 7. CONTACTO DIRECTO & FORMULARIO INTERACTIVO ─── */}
      <section id="contacto" className="scroll-mt-20 relative isolate overflow-hidden border-t border-white/10 bg-card/40 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/20">
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
        </div>

        {/* Embedded Brief Form */}
        <div className="mt-8">
          <AplicarOS />
        </div>
      </section>

      {/* ─── 8. ISLAND BAR (Barra flotante inferior de acceso rápido) ─── */}
      <IslandBar />
    </main>
  );
}
