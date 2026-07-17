"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { ProjectCase, TrackId } from "@/types/site";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { LiveDemoModal } from "./LiveDemoModal";

/**
 * WorkReel — reel cinematográfico de los proyectos destacados: el scroll
 * vertical se traduce en un travelling horizontal con un panel por proyecto.
 * Desktop sin reduced-motion: pin + translateX con animación por "foco".
 * Móvil / reduced-motion: carrusel nativo snap-x accesible.
 */

const trackLabels = {
  es: { create: "Crear", build: "Construir", scale: "Escalar" },
  en: { create: "Create", build: "Build", scale: "Scale" },
};

const TRACK_ACCENT: Record<TrackId, string> = {
  create: "#B68CFF",
  build: "#55D8FF",
  scale: "#71F3A2",
};

function accentFor(project: ProjectCase): string {
  return project.accent ?? TRACK_ACCENT[project.tracks[0] ?? "build"];
}

function domainFor(project: ProjectCase): string | null {
  if (!project.liveUrl) return null;
  try {
    return new URL(project.liveUrl).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function PanelActions({ project, compact = false }: { project: ProjectCase; compact?: boolean }) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <div className={compact ? "mt-5 flex flex-wrap gap-2" : "mt-9 flex flex-wrap items-center gap-3"}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="pressable inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#F3F0E8] px-5 py-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#070809] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55D8FF]"
        >
          {isEs ? "Ver demo en vivo" : "View live demo"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#F3F0E8]/60 transition-colors hover:border-white/30 hover:text-[#F3F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55D8FF]"
        >
          {isEs ? "Abrir sitio" : "Open site"}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

// ── Panel desktop: foco derivado del progreso del reel ──
function ReelPanel({
  project,
  index,
  total,
  progress,
}: {
  project: ProjectCase;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { language } = useLanguage();
  const accent = accentFor(project);
  const domain = domainFor(project);

  const focus = useTransform(progress, (p) => {
    const pos = p * (total - 1);
    return Math.max(0, 1 - Math.abs(pos - index));
  });

  // Tilt sutil con puntero (clamp ±4°).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const pxSpring = useSpring(px, { stiffness: 200, damping: 20, mass: 0.4 });
  const pySpring = useSpring(py, { stiffness: 200, damping: 20, mass: 0.4 });
  const rotateY = useTransform(pxSpring, [-1, 1], [-4, 4]);
  const rotateX = useTransform(pySpring, [-1, 1], [4, -4]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const resetTilt = () => {
    px.set(0);
    py.set(0);
  };

  const winScale = useTransform(focus, [0, 1], [0.92, 1]);
  const winOpacity = useTransform(focus, [0, 1], [0.4, 1]);
  const textX = useTransform(focus, [0, 1], [56, 0]);
  const textOpacity = useTransform(focus, [0, 1], [0.2, 1]);
  const glowOpacity = useTransform(focus, [0, 1], [0, 1]);

  return (
    <Dialog>
      <div className="relative flex h-[100svh] w-screen shrink-0 items-center overflow-hidden">
        {/* Numeral fantasma de fondo */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-[3vw] top-1/2 -translate-y-1/2 select-none text-[18vw] font-medium leading-none text-white/[0.03]"
          style={{ fontFamily: "var(--ff-display)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Glow de acento ligado al foco */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ opacity: glowOpacity, background: `radial-gradient(ellipse at 68% 40%, ${accent}20, transparent 60%)` }}
        />

        <div className="relative mx-auto grid h-full w-full max-w-[1480px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.42fr_.58fr] lg:gap-14 xl:px-10">
          {/* Texto */}
          <motion.div style={{ x: textX, opacity: textOpacity }} className="min-w-0">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.22em]">
              <span style={{ color: accent }}>
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span aria-hidden className="h-px w-8 bg-white/15" />
              <span className="text-[#F3F0E8]/40">
                {project.tracks.map((track) => trackLabels[language][track]).join(" · ")}
              </span>
            </div>

            <h3 className="mt-6 max-w-3xl break-words text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[.9] tracking-[-.05em] text-[#F3F0E8] [text-wrap:balance]">
              {project.title[language]}
            </h3>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#F3F0E8]/55">{project.summary[language]}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[.08em] text-[#F3F0E8]/50"
                >
                  {item}
                </span>
              ))}
            </div>

            <PanelActions project={project} />
          </motion.div>

          {/* Marco premium con la portada */}
          <motion.div
            style={{ scale: winScale, opacity: winOpacity }}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            className="min-w-0"
          >
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0D1114] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={project.media[0].src}
                  alt={project.media[0].alt[language]}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1023px) 86vw, 55vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070809]/35 via-transparent to-transparent" />
              </div>
            </motion.div>
            {domain && (
              <div className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[.12em] text-[#F3F0E8]/35">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <span>{domain}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <LiveDemoModal project={project} />
    </Dialog>
  );
}

// ── Card móvil / reduced-motion (carrusel snap nativo) ──
function ReelCardSimple({ project, index, total }: { project: ProjectCase; index: number; total: number }) {
  const { language } = useLanguage();
  const accent = accentFor(project);
  const domain = domainFor(project);

  return (
    <Dialog>
      <article className="w-[86vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0D1114]/86 shadow-[0_18px_60px_rgba(0,0,0,0.36)] sm:w-[72vw] md:w-[56vw]">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={project.media[0].src}
            alt={project.media[0].alt[language]}
            fill
            sizes="(max-width: 768px) 86vw, 56vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070809] via-[#070809]/30 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#070809]/60 px-2.5 py-1 font-mono text-[9px] text-[#F3F0E8]/65 backdrop-blur-md">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[.16em]">
            <span style={{ color: accent }}>{project.tracks.map((track) => trackLabels[language][track]).join(" · ")}</span>
          </div>
          <h3 className="mt-3 break-words text-2xl font-medium leading-tight tracking-[-.04em] text-[#F3F0E8] [text-wrap:balance]">
            {project.title[language]}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#F3F0E8]/52">{project.summary[language]}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9px] text-[#F3F0E8]/45">
                {item}
              </span>
            ))}
          </div>
          <PanelActions project={project} compact />
          {domain && (
            <div className="mt-4 flex items-center gap-2 font-mono text-[9px] tracking-[.12em] text-[#F3F0E8]/30">
              <span aria-hidden className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
              <span>{domain}</span>
            </div>
          )}
        </div>
      </article>
      <LiveDemoModal project={project} />
    </Dialog>
  );
}

export function WorkReel({ projects }: { projects: ProjectCase[] }) {
  const { language } = useLanguage();
  const isEs = language === "es";
  // El pin de dos columnas necesita ancho lg (≥1024). Por debajo (móvil y
  // tablet) usamos el carrusel nativo: más legible y sin riesgo de recorte.
  const isCompact = useMediaQuery("(max-width: 1023px)");
  const prefersReduced = useReducedMotion();
  const simple = isCompact || !!prefersReduced;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(1);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.02], [1, 0]);

  const total = projects.length;

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(total, Math.max(1, Math.round(p * (total - 1)) + 1)));
  });

  useEffect(() => {
    if (simple) return;
    const calc = () => {
      const el = trackRef.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - el.offsetWidth));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [simple]);

  // Móvil / reduced-motion: carrusel horizontal nativo (accesible por teclado).
  if (simple) {
    return (
      <section aria-label={isEs ? "Proyectos destacados" : "Featured projects"} className="relative py-12">
        <div
          role="region"
          aria-label={isEs ? "Proyectos destacados" : "Featured projects"}
          tabIndex={0}
          className="snap-x snap-mandatory overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55D8FF]"
        >
          <div className="flex gap-4 px-5 sm:px-8">
            {projects.map((project, index) => (
              <ReelCardSimple key={project.slug} project={project} index={index} total={total} />
            ))}
          </div>
        </div>
        <p className="mt-2 px-5 font-mono text-[10px] uppercase tracking-[.2em] text-[#F3F0E8]/30 sm:px-8">
          {isEs ? "Deslizá →" : "Swipe →"}
        </p>
      </section>
    );
  }

  // Desktop: pin + travelling lateral.
  return (
    <section
      ref={sectionRef}
      aria-label={isEs ? "Proyectos destacados" : "Featured projects"}
      className="relative"
      style={{ height: `${total * 85}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex">
          {projects.map((project, index) => (
            <ReelPanel key={project.slug} project={project} index={index} total={total} progress={scrollYProgress} />
          ))}
        </motion.div>

        {/* Overlay inferior: hint + contador + progreso */}
        <div className="pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-3">
          <motion.span style={{ opacity: hintOpacity }} className="font-mono text-[10px] uppercase tracking-[.2em] text-[#F3F0E8]/35">
            {isEs ? "Scrolleá ↓" : "Scroll ↓"}
          </motion.span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tabular-nums tracking-[.2em] text-[#F3F0E8]/45">
              {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="relative h-px w-44 overflow-hidden bg-white/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-0 origin-left bg-gradient-to-r from-[#55D8FF] to-[#71F3A2]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
