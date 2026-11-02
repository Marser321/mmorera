"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import type { LocalizedText } from "@/types/site";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export interface VideoGalleryItem {
  slug: string;
  title: LocalizedText;
  poster: { src: string; alt: LocalizedText };
  src: string;
  /** Duración comprobada, como en un reproductor: m:ss. */
  duration: string;
  tools: string[];
}

export function VideoGallery({ videos, language, demo = false }: { videos: VideoGalleryItem[]; language: "es" | "en"; demo?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const reducedMotion = useReducedMotionSafe();
  const videoRef = useRef<HTMLVideoElement>(null);
  const id = useId();
  useEffect(() => { if (active) videoRef.current?.focus({ preventScroll: true }); }, [active]);
  if (!videos.length) return null;

  return <section data-video-gallery aria-labelledby={`${id}-title`} className="mx-auto mt-16 max-w-[1480px] px-5 sm:mt-20 sm:px-8 lg:px-12">
    <h2 id={`${id}-title`} className="text-3xl font-medium leading-tight tracking-[-.03em] text-foreground">{language === "es" ? "Piezas hechas con este sistema" : "Pieces made with this system"}</h2>
    <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
      {videos.map((item, index) => <article key={item.slug} aria-labelledby={`${id}-item-${index}`}>
        <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-foreground/15 bg-background">
          {active === item.slug ? <video key={item.slug} ref={videoRef} controls playsInline preload="metadata" autoPlay={!reducedMotion} poster={item.poster.src} tabIndex={0} aria-label={item.title[language]} className="h-full w-full object-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
            <source src={item.src} type="video/mp4" />
          </video> : <Image src={item.poster.src} alt={item.poster.alt[language]} fill sizes="(min-width: 640px) 50vw, 100vw" unoptimized={item.poster.src.startsWith("data:")} className="object-contain" />}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h3 id={`${id}-item-${index}`} className="text-xl font-medium text-foreground">{item.title[language]}</h3>
          {demo && <span className="rounded border border-signal/40 px-2 py-1 text-xs font-semibold text-signal">Demo</span>}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-relaxed text-foreground/75">{item.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
        <button type="button" onClick={() => setActive(item.slug)} aria-labelledby={`${id}-watch-${index} ${id}-item-${index}`} className="mt-3 inline-flex min-h-12 items-center rounded-xl border border-foreground/25 px-4 py-3 text-left text-sm font-semibold text-foreground hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span id={`${id}-watch-${index}`}>{language === "es" ? "Ver el video" : "Watch the video"} · {item.duration}</span>
        </button>
      </article>)}
    </div>
  </section>;
}
