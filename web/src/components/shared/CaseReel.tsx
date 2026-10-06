"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import type { CaseReelSources } from "@/data/caseMedia";
import { cn } from "@/lib/utils";

/**
 * Reel de un caso real (grabado del sitio en vivo). Muestra el póster al
 * instante, monta el video recién al acercarse al viewport, lo reproduce solo
 * mientras se ve y respeta prefers-reduced-motion (queda en póster).
 * AV1/WebM primero (liviano) y H.264/MP4 como respaldo universal.
 */
export function CaseReel({
  reel,
  alt,
  className,
  playing = true,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: {
  reel: CaseReelSources;
  alt: string;
  className?: string;
  /** Permite que el padre pause el reel (p. ej. una escena inactiva). */
  playing?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && playing) void video.play().catch(() => {});
    else video.pause();
  }, [inView, playing, mounted]);

  const showVideo = mounted && !prefersReduced;

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden bg-card", className)}>
      <Image src={reel.poster} alt={alt} fill priority={priority} sizes={sizes} className="object-cover object-top" />
      {showVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={reel.poster}
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={reel.webm} type='video/webm; codecs="av01.0.05M.08"' />
          <source src={reel.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
