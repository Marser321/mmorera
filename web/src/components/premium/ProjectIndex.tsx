"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { getCaseMedia } from "@/data/caseMedia";
import { CaseReel } from "@/components/shared/CaseReel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_OUT } from "@/lib/motion";
import type { ProjectCase } from "@/types/site";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { hasFlagshipFilm } from "@/data/films/flagships/slugs";

/**
 * Índice de proyectos: lista tipográfica grande. En desktop, una preview
 * flotante sigue al cursor y muestra el reel real del caso enfocado (la tira
 * vertical se desliza al índice activo y se inclina con la velocidad del
 * mouse). En pantallas táctiles cada fila trae su reel inline.
 */
export function ProjectIndex({ projects }: { projects: ProjectCase[] }) {
  const { language } = useLanguage();
  const isEs = language === "es";
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const prefersReduced = useReducedMotionSafe();
  const [active, setActive] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 260, damping: 30, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 260, damping: 30, mass: 0.6 });
  const velocityX = useVelocity(pointerX);
  const rotate = useSpring(useTransform(velocityX, [-2400, 2400], [-9, 9], { clamp: true }), { stiffness: 180, damping: 22 });

  const showPreview = finePointer && active !== null;
  const stripIndex = active ?? lastActive;

  return (
    <div
      className="relative"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        pointerX.set(event.clientX);
        pointerY.set(event.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-b border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
        {projects.map((project, index) => {
          const media = getCaseMedia(project.slug);
          const dimmed = active !== null && active !== index;
          return (
            <li key={project.slug} className="border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
              <Link
                href={localePath(language, `/casos-de-exito/${project.slug}`)}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  setActive(index);
                  setLastActive(index);
                }}
                onFocus={() => {
                  setActive(index);
                  setLastActive(index);
                }}
                onBlur={() => setActive(null)}
                className="group block py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:py-9"
              >
                {/* Reel inline en táctil (CSS, así SSR e hidratación coinciden) */}
                <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] [@media(hover:hover)_and_(pointer:fine)]:hidden">
                    {media ? (
                      <CaseReel reel={media.reel} alt={project.title[language]} className="aspect-[16/10]" />
                    ) : (
                      project.media[0] && (
                        <div className="relative aspect-[16/10]">
                          <Image src={project.media[0].src} alt={project.media[0].alt[language]} fill sizes="100vw" className="object-cover object-top" />
                        </div>
                      )
                    )}
                </div>
                <div
                  className={`grid items-baseline gap-x-8 gap-y-2 transition-[opacity,transform] duration-500 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,16rem)_auto] ${dimmed ? "opacity-30" : "opacity-100"} ${active === index ? "md:translate-x-3" : ""}`}
                >
                  <span className="font-mono text-xs text-foreground/60">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-[clamp(2rem,5vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.055em] text-foreground">
                    {project.title[language]}
                  </h3>
                  <p className="text-sm leading-snug text-foreground/55 md:text-right">
                    {hasFlagshipFilm(project.slug) ? (
                      <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[.16em] text-signal md:justify-end">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
                        {language === "es" ? "Film insignia" : "Flagship film"}
                      </span>
                    ) : null}
                    {project.summary[language].split(":")[0].split(".")[0]}
                  </p>
                  <span className="hidden h-11 w-11 place-items-center rounded-full border border-white/15 text-foreground/70 transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-background md:grid light:border-[rgb(var(--ink-rgb)/0.15)]">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Preview flotante (desktop) */}
      {finePointer && (
        <AnimatePresence>
          {showPreview && (
            // Capas: seguir al cursor (x/y) → centrar (CSS) → escala + inclinación.
            <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40" style={{ x, y }}>
              <div className="-translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="relative h-[260px] w-[400px] xl:h-[300px] xl:w-[460px]"
                  style={{ rotate: prefersReduced ? 0 : rotate }}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <div className="h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                    <motion.div
                      className="h-full w-full"
                      animate={{ y: `${-stripIndex * 100}%` }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                    >
                      {projects.map((project, index) => {
                        const media = getCaseMedia(project.slug);
                        return (
                          <div key={project.slug} className="relative h-full w-full">
                            {media ? (
                              <CaseReel reel={media.reel} alt="" playing={index === stripIndex} className="h-full w-full" sizes="460px" />
                            ) : (
                              project.media[0] && <Image src={project.media[0].src} alt="" fill sizes="460px" className="object-cover object-top" />
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  </div>
                  <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-signal text-[11px] font-semibold text-background shadow-[0_0_40px_rgba(113,243,162,0.45)]">
                    {isEs ? "Ver caso" : "View case"}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
