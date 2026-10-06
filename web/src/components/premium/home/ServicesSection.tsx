"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { SERVICE_SOLUTIONS, type ServiceSolution } from "@/data/solutionsData";
import { getProjectCase } from "@/data/projectCases";
import { getCaseMedia } from "@/data/caseMedia";
import { CaseReel } from "@/components/shared/CaseReel";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { EASE_OUT } from "@/lib/motion";
import type { Language } from "@/context/LanguageContext";

/**
 * Servicios como escenas: a la izquierda cada servicio ocupa su propio tramo
 * de scroll; a la derecha, un escenario fijo muestra el caso real que lo
 * demuestra (reel grabado del sitio en vivo). Vender = promesa + prueba juntas.
 * El escenario es `sticky` CSS con IntersectionObserver: cero motion values
 * atados al scroll.
 * En mobile no hay pin: cada servicio lleva su prueba inline.
 */

const copy = {
  es: {
    eyebrow: "Servicios",
    title: "Cuatro cosas que hago, cada una con prueba en vivo.",
    intro: "Elegí lo que necesitás resolver. Cada servicio viene con un proyecto real que ya lo resuelve.",
    talk: "Hablemos de esto",
    seenIn: "Visto en",
    viewCase: "Ver caso",
    idealFor: "Ideal para",
  },
  en: {
    eyebrow: "Services",
    title: "Four things I do, each one proven live.",
    intro: "Pick what you need solved. Each service comes with a real project already solving it.",
    talk: "Let's talk about this",
    seenIn: "Seen in",
    viewCase: "View case",
    idealFor: "Ideal for",
  },
} as const;

function hostname(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function ProofMedia({
  service,
  language,
  playing,
  className,
}: {
  service: ServiceSolution;
  language: Language;
  playing: boolean;
  className?: string;
}) {
  const project = getProjectCase(service.proofSlug);
  const media = getCaseMedia(service.proofSlug);
  const alt = project ? project.title[language] : service.title[language];
  if (media) return <CaseReel reel={media.reel} alt={alt} playing={playing} className={className} />;
  if (project?.media[0]) {
    return (
      <div className={`relative overflow-hidden bg-card ${className ?? ""}`}>
        <Image src={project.media[0].src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top" />
      </div>
    );
  }
  return null;
}

export function ServicesSection() {
  const { language } = useLanguage();
  const c = copy[language];
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  // La escena que cruza el centro del viewport es la activa.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    blockRefs.current.forEach((block) => block && observer.observe(block));
    return () => observer.disconnect();
  }, []);

  const activeService = SERVICE_SOLUTIONS[active];
  const activeProject = getProjectCase(activeService.proofSlug);

  return (
    <section
      id="servicios"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]"
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="max-w-3xl">
          <Reveal as="p" className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            {c.eyebrow}
          </Reveal>
          <SplitReveal
            as="h2"
            text={c.title}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {c.intro}
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Escenas de texto */}
          <div>
            {SERVICE_SOLUTIONS.map((service, index) => {
              const project = getProjectCase(service.proofSlug);
              const isActive = index === active;
              return (
                <article
                  key={service.id}
                  ref={(node) => {
                    blockRefs.current[index] = node;
                  }}
                  data-index={index}
                  aria-labelledby={`service-${service.id}`}
                  className={`flex flex-col justify-center border-t border-white/10 py-10 transition-opacity duration-500 light:border-[rgb(var(--ink-rgb)/0.1)] lg:min-h-[78vh] lg:border-t-0 lg:py-0 ${isActive ? "lg:opacity-100" : "lg:opacity-30"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-foreground/60">0{index + 1}</span>
                    <span
                      className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider"
                      style={{ borderColor: `${service.accent}40`, backgroundColor: `${service.accent}12`, color: service.accent }}
                    >
                      {service.tag[language]}
                    </span>
                  </div>
                  <h3
                    id={`service-${service.id}`}
                    className="mt-5 text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.02] tracking-[-0.045em] text-foreground"
                  >
                    {service.title[language]}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
                    {service.headline[language]}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <li key={item[language]} className="flex items-start gap-2.5 text-sm text-foreground/75 sm:text-base">
                        <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: service.accent }} aria-hidden="true" />
                        <span>{item[language]}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 max-w-xl font-mono text-[11px] leading-relaxed text-foreground/60">
                    {c.idealFor}: {service.idealFor[language].split(".")[0].toLowerCase()}.
                  </p>

                  {/* Prueba inline (mobile/tablet) */}
                  <div className="mt-7 lg:hidden">
                    <div className="overflow-hidden rounded-2xl border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
                      <ProofMedia service={service} language={language} playing className="aspect-[16/10]" />
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a
                      href="#contacto"
                      className="pressable inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {c.talk}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    {project && (
                      <Link
                        href={localePath(language, `/casos-de-exito/${project.slug}`)}
                        className="group inline-flex items-center gap-1.5 text-sm text-foreground/65 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {c.seenIn} <span className="font-medium text-foreground">{project.title[language]}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Escenario fijo con la prueba (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-[12vh] flex h-[76vh] flex-col justify-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-25 blur-3xl transition-colors duration-700"
                style={{ background: `radial-gradient(closest-side, ${activeService.accent}55, transparent)` }}
              />
              <Link
                href={localePath(language, `/casos-de-exito/${activeService.proofSlug}`)}
                data-cursor-label={c.viewCase}
                aria-label={`${c.viewCase}: ${activeProject?.title[language] ?? ""}`}
                className="block overflow-hidden rounded-[1.5rem] border border-white/12 bg-card/80 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.75)] transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.12)]"
              >
                {/* Barra de navegador con la URL real */}
                <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 light:border-[rgb(var(--ink-rgb)/0.1)]">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                  </div>
                  <div className="flex-1 truncate rounded-full bg-foreground/[0.06] px-3 py-1 text-center font-mono text-[11px] text-foreground/55">
                    {hostname(activeProject?.liveUrl)}
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-signal">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                    Live
                  </span>
                </div>
                <div className="relative aspect-[16/10]">
                  {SERVICE_SOLUTIONS.map((service, index) => {
                    const isActive = index === active;
                    return (
                      <motion.div
                        key={service.id}
                        className="absolute inset-0"
                        initial={false}
                        // Solo transform + opacity (regla 2 de lib/motion.ts): la escena
                        // anterior sale hacia arriba y la siguiente entra desde abajo.
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? "0%" : index < active ? "-8%" : "8%",
                          scale: isActive ? 1 : 1.04,
                        }}
                        transition={{ duration: 0.9, ease: EASE_OUT }}
                        style={{ zIndex: isActive ? 2 : 1 }}
                      >
                        <ProofMedia service={service} language={language} playing={isActive} className="h-full w-full" />
                      </motion.div>
                    );
                  })}
                </div>
              </Link>

              {/* Pie: caso + progreso */}
              <div className="mt-5 flex items-center justify-between gap-6">
                <p className="truncate text-sm text-foreground/60">
                  {c.seenIn} <span className="text-foreground">{activeProject?.title[language]}</span>
                </p>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {SERVICE_SOLUTIONS.map((service, index) => (
                    <span key={service.id} className="h-1 w-8 overflow-hidden rounded-full bg-foreground/10">
                      <motion.span
                        className="block h-full rounded-full"
                        style={{ backgroundColor: service.accent }}
                        initial={false}
                        animate={{ width: index <= active ? "100%" : "0%" }}
                        transition={{ duration: 0.6, ease: EASE_OUT }}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
