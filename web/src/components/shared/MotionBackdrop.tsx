"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useResolvedMediaQuery } from "@/hooks/useMediaQuery";
import { isMotionPreviewHost } from "@/data/motionAssets";
import type { MotionAsset, MotionMediaSource, MotionScrim } from "@/data/motionAssets";

let activeMotionVideo: HTMLVideoElement | null = null;

const SCRIMS: Record<MotionScrim, string | undefined> = {
  none: undefined,
  left: "linear-gradient(90deg, color-mix(in srgb, var(--color-background) 96%, transparent) 0%, color-mix(in srgb, var(--color-background) 76%, transparent) 34%, color-mix(in srgb, var(--color-background) 18%, transparent) 68%, transparent 100%)",
  right: "linear-gradient(270deg, color-mix(in srgb, var(--color-background) 96%, transparent) 0%, color-mix(in srgb, var(--color-background) 72%, transparent) 36%, transparent 72%)",
  center: "radial-gradient(ellipse 68% 66% at 50% 50%, color-mix(in srgb, var(--color-background) 10%, transparent), color-mix(in srgb, var(--color-background) 76%, transparent) 100%)",
  form: "radial-gradient(ellipse 62% 72% at 50% 48%, color-mix(in srgb, var(--color-background) 42%, transparent), color-mix(in srgb, var(--color-background) 92%, transparent) 100%)",
};

interface MotionBackdropProps {
  asset: MotionAsset;
  className?: string;
  mediaClassName?: string;
  intensity?: number;
  scrim?: MotionScrim;
  priority?: boolean;
}

function Poster({ source, priority }: { source: MotionMediaSource; priority: boolean }) {
  return (
    <picture className="absolute inset-0 block h-full w-full">
      {source.avif && <source srcSet={source.avif} type="image/avif" />}
      <img
        src={source.webp}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
        style={{ objectPosition: source.objectPosition ?? "center" }}
      />
    </picture>
  );
}

export function MotionBackdrop({
  asset,
  className = "",
  mediaClassName = "",
  intensity = 1,
  scrim = asset.scrim,
  priority = false,
}: MotionBackdropProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion() === true;
  const desktopMatch = useResolvedMediaQuery("(min-width: 768px)");
  const isDesktop = desktopMatch === true;
  const [hasEntered, setHasEntered] = useState(false);
  const [inView, setInView] = useState(false);
  const [previewHost, setPreviewHost] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end start"] });
  const scrollScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.025, 1, 1.018]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerSpringX = useSpring(pointerX, { stiffness: 65, damping: 24, mass: 0.8 });
  const pointerSpringY = useSpring(pointerY, { stiffness: 65, damping: 24, mass: 0.8 });

  const activeSources = useMemo(() => {
    const viewport = isDesktop ? "desktop" : "mobile";
    return {
      dark: asset.variants.dark[viewport],
      light: asset.variants.light[viewport],
    };
  }, [asset, isDesktop]);
  const themedSource = theme === "light" ? activeSources.light : activeSources.dark;
  const viewport = isDesktop ? "desktop" : "mobile";
  const previewVideoSource = previewHost ? asset.previewVideo?.[viewport] : undefined;
  const videoWebm = previewVideoSource ? undefined : themedSource.webm;
  const videoMp4 = previewVideoSource ?? themedSource.mp4;
  const usesPreviewVideo = Boolean(previewVideoSource);
  const videoVisibleForTheme = !usesPreviewVideo || theme === "dark";
  const canMountVideo = !reducedMotion && hasEntered && !videoFailed && Boolean(videoWebm || videoMp4);

  useEffect(() => {
    setPreviewHost(isMotionPreviewHost(window.location.hostname));
  }, []);

  useEffect(() => {
    setVideoFailed(false);
    setVideoReady(false);
  }, [videoMp4, videoWebm]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setHasEntered(true);
    }, { rootMargin: "240px 0px", threshold: 0.01 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDesktop || reducedMotion || !asset.pointerDrift || !inView) return;
    const onPointerMove = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      pointerX.set(nx * asset.pointerDrift!);
      pointerY.set(ny * asset.pointerDrift!);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      pointerX.set(0);
      pointerY.set(0);
    };
  }, [asset.pointerDrift, inView, isDesktop, pointerX, pointerY, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion || asset.behavior === "scroll") return;
    const pausePlayback = () => {
      video.pause();
      if (activeMotionVideo === video) activeMotionVideo = null;
    };
    const syncPlayback = () => {
      if (!inView || document.hidden || !videoVisibleForTheme) {
        pausePlayback();
        return;
      }
      if (activeMotionVideo && activeMotionVideo !== video) activeMotionVideo.pause();
      activeMotionVideo = video;
      video.play().catch(() => undefined);
    };
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      pausePlayback();
    };
  }, [asset.behavior, canMountVideo, inView, reducedMotion, videoVisibleForTheme]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;
    if (!video || !inView || !videoVisibleForTheme || asset.behavior !== "scroll" || !Number.isFinite(video.duration)) return;
    video.pause();
    video.currentTime = Math.min(video.duration, Math.max(0, progress * video.duration));
  });

  const mediaStyle = reducedMotion
    ? undefined
    : asset.behavior === "scroll"
      ? { scale: scrollScale, y: scrollY, x: pointerSpringX }
      : { x: pointerSpringX, y: pointerSpringY };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-motion-asset={asset.id}
      data-motion-behavior={asset.behavior}
      data-motion-in-view={inView ? "true" : "false"}
      data-motion-preview={usesPreviewVideo ? "enabled" : asset.previewOnly ? "disabled" : "none"}
      data-motion-video-status={reducedMotion ? "reduced" : videoFailed ? "fallback" : canMountVideo ? videoReady ? "ready" : "loading" : "poster"}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        className={`absolute -inset-[1.5%] ${mediaClassName}`}
        style={{ ...mediaStyle, opacity: intensity }}
      >
        <div className={`absolute inset-0 ${asset.behavior === "loop" && !reducedMotion ? "motion-ambient-drift" : ""}`}>
          <div className={`absolute inset-0 transition-opacity duration-500 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}>
            <Poster source={activeSources.dark} priority={priority} />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-500 ${theme === "light" ? "opacity-100" : "opacity-0"}`}>
            <Poster source={activeSources.light} priority={priority} />
          </div>
          {canMountVideo && (
            <video
              key={`${videoWebm ?? ""}-${videoMp4 ?? ""}`}
              ref={videoRef}
              muted
              playsInline
              preload="metadata"
              loop={asset.behavior === "loop"}
              data-motion-video={asset.id}
              data-motion-video-preview={usesPreviewVideo ? "true" : "false"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${videoReady && videoVisibleForTheme ? "opacity-100" : "opacity-0"}`}
              style={{ objectPosition: usesPreviewVideo ? activeSources.dark.objectPosition ?? "center" : themedSource.objectPosition ?? "center" }}
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
              onEnded={() => {
                if (activeMotionVideo === videoRef.current) activeMotionVideo = null;
              }}
            >
              {videoWebm && <source src={videoWebm} type="video/webm" />}
              {videoMp4 && <source src={videoMp4} type="video/mp4" />}
            </video>
          )}
        </div>
      </motion.div>
      {SCRIMS[scrim] && <div className="absolute inset-0" style={{ background: SCRIMS[scrim] }} />}
    </div>
  );
}
