"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CONTENT_SAMPLES, getContentSample, type SampleAspect, type SampleId } from "@/data/contentSamples";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const copy = {
  es: {
    title: "Siete estilos, con escenas de las webs que hice",
    intro: "Cada muestra está hecha en código con el material de una web: sus clips, sus capturas y su marca. Muestran cómo se vería tu contenido; no son campañas publicadas.",
    group: "Elige un estilo",
  },
  en: {
    title: "Seven styles, from scenes of sites I built",
    intro: "Each sample is built in code from a website's own material: its clips, its screenshots and its brand. They show how your content would look; they're not published campaigns.",
    group: "Pick a style",
  },
} as const;

/** Alto del escenario: la muestra crece hasta ahí y su ancho sale de su proporción. */
const STAGE_HEIGHT = "min(70svh, 680px)";
const RATIO: Record<SampleAspect, number> = { "9:16": 9 / 16, "16:9": 16 / 9, "1:1": 1, "4:5": 4 / 5 };

/**
 * Muestrario de /fabricas (T49): los siete estilos que más se piden (persona,
 * empresa, VSL, reel, historia, cuadrado y carrusel). Uno a la vez, en su
 * formato real, mudo y en bucle mientras está a la vista; con movimiento
 * reducido, su póster y los controles del video.
 */
export function StyleShowcase({ language }: { language: "es" | "en" }) {
  const c = copy[language];
  const id = useId();
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState<SampleId>("persona");
  const [inView, setInView] = useState(false);
  const sample = getContentSample(current);
  const src = sample.src[language];
  const poster = sample.poster[language];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    if (inView) void video.play().catch(() => {});
    else video.pause();
  }, [inView, reduced, src]);

  return (
    <section ref={sectionRef} data-style-showcase aria-labelledby={`${id}-title`} className="mx-auto mt-16 max-w-[1480px] px-5 sm:mt-20 sm:px-8 lg:px-12">
      <h2 id={`${id}-title`} className="max-w-3xl text-3xl font-medium leading-tight tracking-[-.03em] text-foreground">{c.title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/75">{c.intro}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div role="group" aria-label={c.group} className="flex flex-wrap gap-2 lg:flex-col">
          {CONTENT_SAMPLES.map((item, index) => {
            const on = item.id === current;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                aria-controls={`${id}-stage`}
                onClick={() => setCurrent(item.id)}
                className={`inline-flex min-h-11 items-center justify-between gap-4 rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-full ${on ? "border-signal bg-signal/10 text-signal" : "border-foreground/20 text-foreground hover:border-foreground/45"}`}
              >
                <span className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-mono text-[11px] opacity-60">{String(index + 1).padStart(2, "0")}</span>
                  {item.style[language]}
                </span>
                <span className="font-mono text-[11px] font-normal opacity-70">{item.aspect}</span>
              </button>
            );
          })}
        </div>
        <figure id={`${id}-stage`} className="min-w-0">
          <div className="flex items-center justify-center rounded-2xl border border-foreground/12 bg-[#0B0B0A] p-3 sm:p-5" style={{ height: `calc(${STAGE_HEIGHT} + 2.5rem)` }}>
            <div data-sample={current} className="relative overflow-hidden rounded-xl border border-white/10" style={{ aspectRatio: String(RATIO[sample.aspect]), width: `min(100%, calc(${STAGE_HEIGHT} * ${RATIO[sample.aspect].toFixed(4)}))` }}>
              <video key={src} ref={videoRef} src={src} poster={poster} muted loop playsInline controls={reduced} preload="none" aria-label={`${sample.style[language]} · ${sample.brand}`} className="h-full w-full object-cover" />
            </div>
          </div>
          <figcaption aria-live="polite" className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl font-medium text-foreground">{sample.style[language]}</span>
            <span className="text-base text-foreground/75">{sample.pitch[language]}</span>
            <span className="basis-full rounded-none text-xs leading-relaxed text-foreground/60">{sample.source[language]}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
