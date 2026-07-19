"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SITE_IDENTITY } from "@/config/site";
import {
  PERSONAL_FILM_SEQUENCE,
  resolveFilmStage,
  resolveFilmTime,
  resolvePersonalFilmSource,
  shouldSeekFilm,
  type PersonalFilmSequence,
  type PersonalFilmStage,
} from "@/data/personalFilmSequence";
import { useResolvedMediaQuery } from "@/hooks/useMediaQuery";

export interface AuthorManifestoCopy {
  eyebrow: string;
  convergence: string;
  headline: string;
  body: string;
  principleLabel: string;
  principle: string;
  signature: string;
}

interface AuthorManifestoSceneProps {
  language: "es" | "en";
  copy: AuthorManifestoCopy;
  sequence?: PersonalFilmSequence;
}

function DirectLinks({ interactive = true }: { interactive?: boolean }) {
  return (
    <div
      inert={!interactive}
      aria-hidden={!interactive}
      className={`mt-6 flex flex-wrap content-start gap-x-5 gap-y-3 ${interactive ? "" : "pointer-events-none select-none"}`}
    >
      {[
        ["Email", `mailto:${SITE_IDENTITY.contact.email}`],
        ["WhatsApp", SITE_IDENTITY.contact.whatsapp],
      ].map(([label, href]) => (
        <a
          key={label}
          href={href}
          target={label === "WhatsApp" ? "_blank" : undefined}
          rel={label === "WhatsApp" ? "noreferrer" : undefined}
          tabIndex={interactive ? undefined : -1}
          className="inline-flex items-center gap-2 border-b border-white/24 pb-1 text-sm text-[#F3F0E8] transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55D8FF]"
        >
          {label}<ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  );
}

function EditorialCopy({
  copy,
  headlineOpacity,
  headlineY,
  detailsOpacity,
  detailsY,
  animate = false,
  linksInteractive = true,
  compact = false,
}: {
  copy: AuthorManifestoCopy;
  headlineOpacity?: MotionValue<number>;
  headlineY?: MotionValue<number>;
  detailsOpacity?: MotionValue<number>;
  detailsY?: MotionValue<number>;
  animate?: boolean;
  linksInteractive?: boolean;
  compact?: boolean;
}) {
  return (
    <div>
      <motion.div style={animate ? { opacity: headlineOpacity, y: headlineY } : undefined}>
        <h2 className={compact
          ? "text-[clamp(2.55rem,10vw,4.5rem)] font-medium leading-[.92] tracking-[-.06em] text-[#F3F0E8]"
          : "text-[clamp(2.65rem,5vw,6rem)] font-medium leading-[.92] tracking-[-.063em] text-[#F3F0E8]"}
        >
          {copy.headline}
        </h2>
      </motion.div>
      <motion.div
        style={animate ? { opacity: detailsOpacity, y: detailsY } : undefined}
        className="mt-7 border-t border-white/16 pt-6 lg:grid lg:grid-cols-[1.35fr_.65fr] lg:gap-10"
      >
        <p className="max-w-2xl text-base leading-7 text-[#F3F0E8]/66">{copy.body}</p>
        <div className="mt-8 lg:mt-0">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#B68CFF]">{copy.principleLabel}</p>
          <p className="mt-3 text-[15px] leading-6 text-[#F3F0E8]/84">{copy.principle}</p>
          <DirectLinks interactive={linksInteractive} />
        </div>
      </motion.div>
    </div>
  );
}

function AuthorManifestoSceneComponent({
  language,
  copy,
  sequence = PERSONAL_FILM_SEQUENCE,
}: AuthorManifestoSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const filmTrackRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekFrameRef = useRef<number | null>(null);
  const latestProgressRef = useRef(0);
  const targetTimeRef = useRef(0);
  const desktopMatch = useResolvedMediaQuery("(min-width: 1024px)");
  const reducedMotionMatch = useResolvedMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = desktopMatch === true;
  const viewportResolved = desktopMatch !== null;
  const motionPreferenceResolved = reducedMotionMatch !== null;
  const reducedMotion = reducedMotionMatch === true;
  const source = resolvePersonalFilmSource(sequence, isDesktop);
  const sourceKey = `${source.webm}|${source.mp4}`;
  const sequenceMode = isDesktop ? "desktop" : "mobile";
  const [nearViewport, setNearViewport] = useState(false);
  const [videoState, setVideoState] = useState<{ source: string; status: "idle" | "ready" | "failed" }>({ source: "", status: "idle" });
  const [detailsReady, setDetailsReady] = useState(false);
  const [filmStage, setFilmStage] = useState<PersonalFilmStage>("introduction");
  const videoReady = videoState.source === sourceKey && videoState.status === "ready";
  const videoFailed = videoState.source === sourceKey && videoState.status === "failed";

  const { scrollYProgress: sectionProgress } = useScroll({
    target: filmTrackRef,
    offset: ["start start", "end end"],
  });
  const nameOpacity = useTransform(sectionProgress, [0, 0.095, 0.124], [1, 1, 0]);
  const nameY = useTransform(sectionProgress, [0, 0.124], [0, -24]);
  const createOpacity = useTransform(sectionProgress, [0.124, 0.145, 0.335, 0.364], [0, 1, 1, 0]);
  const createX = useTransform(sectionProgress, [0.124, 0.16], [-50, 0]);
  const buildOpacity = useTransform(sectionProgress, [0.364, 0.385, 0.535, 0.561], [0, 1, 1, 0]);
  const buildX = useTransform(sectionProgress, [0.364, 0.4], [50, 0]);
  const scaleOpacity = useTransform(sectionProgress, [0.561, 0.585, 0.805, 0.833], [0, 1, 1, 0]);
  const scaleX = useTransform(sectionProgress, [0.561, 0.6], [-50, 0]);
  const convergenceOpacity = useTransform(sectionProgress, [0.833, 0.855, 0.915, 0.94], [0, 1, 1, 0]);
  const convergenceY = useTransform(sectionProgress, [0.833, 0.865], [30, 0]);
  const convergenceScale = useTransform(sectionProgress, [0.833, 0.875], [0.97, 1]);
  const headlineOpacity = useTransform(sectionProgress, [0.94, 0.965, 1], [0, 1, 1]);
  const headlineY = useTransform(sectionProgress, [0.94, 0.975], [36, 0]);
  const detailsOpacity = useTransform(sectionProgress, [0.955, 0.982, 1], [0, 1, 1]);
  const detailsY = useTransform(sectionProgress, [0.955, 0.99], [22, 0]);
  const sceneScale = useTransform(sectionProgress, [0, 1], [1.015, 1]);
  const leftScrimOpacity = useTransform(sectionProgress, [0, 0.82, 0.91], [1, 1, 0.24]);
  const finalScrimOpacity = useTransform(sectionProgress, [0.91, 0.95, 1], [0, 0.82, 0.88]);

  const syncFilmProgress = useCallback((progress: number) => {
    latestProgressRef.current = progress;
    targetTimeRef.current = resolveFilmTime(progress, sequence);
    const nextStage = resolveFilmStage(progress, sequence);
    setFilmStage((current) => current === nextStage ? current : nextStage);
    const nextDetailsReady = progress >= 0.94;
    setDetailsReady((current) => current === nextDetailsReady ? current : nextDetailsReady);
    if (visualRef.current) visualRef.current.dataset.filmTime = targetTimeRef.current.toFixed(3);
    if (reducedMotion || document.hidden || seekFrameRef.current !== null) return;
    seekFrameRef.current = window.requestAnimationFrame(() => {
      seekFrameRef.current = null;
      const video = videoRef.current;
      if (!video || video.readyState < 1 || video.seeking) return;
      const availableDuration = Number.isFinite(video.duration)
        ? Math.min(video.duration, sequence.duration)
        : sequence.duration;
      const target = Math.min(availableDuration, targetTimeRef.current);
      video.pause();
      if (shouldSeekFilm(video.currentTime, target, sequence.seekThreshold)) video.currentTime = target;
    });
  }, [reducedMotion, sequence]);

  useMotionValueEvent(sectionProgress, "change", syncFilmProgress);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNearViewport(true);
    }, { rootMargin: sequence.preloadMargin, threshold: 0.01 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [sequence.preloadMargin]);

  useEffect(() => {
    if (!viewportResolved || !motionPreferenceResolved) return;
    const frame = window.requestAnimationFrame(() => syncFilmProgress(sectionProgress.get()));
    const syncVisibility = () => {
      if (!document.hidden) syncFilmProgress(latestProgressRef.current);
    };
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", syncVisibility);
      if (seekFrameRef.current !== null) window.cancelAnimationFrame(seekFrameRef.current);
      seekFrameRef.current = null;
    };
  }, [motionPreferenceResolved, sectionProgress, syncFilmProgress, viewportResolved]);

  const canMountVideo = viewportResolved && motionPreferenceResolved && nearViewport && !reducedMotion && !videoFailed;
  const linksInteractive = reducedMotion || detailsReady;
  const imageLabel = language === "es"
    ? "Mario Morera creando interfaces, productos y sistemas en su estudio"
    : "Mario Morera creating interfaces, products and systems in his studio";
  const practiceVerbs = language === "es"
    ? { create: "Crear", build: "Construir", scale: "Escalar" }
    : { create: "Create", build: "Build", scale: "Scale" };
  const videoStatus = reducedMotion
    ? "reduced"
    : videoFailed
      ? "fallback"
      : canMountVideo
        ? videoReady ? "ready" : "loading"
        : "poster";

  const filmVisual = (
    <motion.div
      ref={visualRef}
      role="img"
      aria-label={imageLabel}
      data-sequence-mode={reducedMotion ? "reduced" : sequenceMode}
      data-sequence-state={reducedMotion ? "closing" : filmStage}
      data-film-status={videoStatus}
      data-film-time={reducedMotion ? sequence.duration.toFixed(3) : "0.000"}
      className="absolute inset-0 overflow-hidden bg-[#050607]"
      style={reducedMotion ? undefined : { scale: sceneScale }}
    >
      <picture className="absolute inset-0 block h-full w-full">
        <source srcSet={source.posterAvif} type="image/avif" />
        <img
          src={source.posterWebp}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain object-top lg:object-cover lg:object-center"
        />
      </picture>
      {canMountVideo && (
        <video
          key={`${source.webm}-${source.mp4}`}
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={source.posterWebp}
          aria-hidden="true"
          data-personal-film
          className={`absolute inset-0 h-full w-full object-contain object-top transition-opacity duration-300 lg:object-cover lg:object-center ${videoReady ? "opacity-100" : "opacity-0"}`}
          onLoadedMetadata={(event) => {
            event.currentTarget.pause();
            syncFilmProgress(latestProgressRef.current);
          }}
          onLoadedData={() => setVideoState({ source: sourceKey, status: "ready" })}
          onSeeked={() => syncFilmProgress(latestProgressRef.current)}
          onError={() => setVideoState({ source: sourceKey, status: "failed" })}
        >
          <source src={source.webm} type="video/webm; codecs=vp9" />
          <source src={source.mp4} type="video/mp4" />
        </video>
      )}
      <motion.div
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(5,6,7,.97)_0%,rgba(5,6,7,.78)_30%,rgba(5,6,7,.2)_58%,rgba(5,6,7,.04)_100%)] lg:block"
        style={{ opacity: reducedMotion ? 0.24 : leftScrimOpacity }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,7,.08)_0%,rgba(5,6,7,.03)_48%,rgba(5,6,7,.9)_76%,#050607_100%)] lg:bg-[radial-gradient(circle_at_70%_42%,transparent_0%,rgba(5,6,7,.06)_40%,rgba(5,6,7,.4)_100%)]" />
      <motion.div
        className="absolute inset-y-0 right-0 hidden w-[68%] bg-[linear-gradient(270deg,rgba(5,6,7,.96)_0%,rgba(5,6,7,.82)_48%,transparent_100%)] lg:block"
        style={{ opacity: reducedMotion ? 0.88 : finalScrimOpacity }}
      />
    </motion.div>
  );

  return (
    <section
      ref={sectionRef}
      id="perfil"
      data-home-section="manifesto"
      data-testid="author-manifesto"
      className="relative scroll-mt-28 overflow-clip border-y border-white/10 bg-[#050607] text-[#F3F0E8]"
    >
      <p className="sr-only">{copy.convergence}: {practiceVerbs.create}, {practiceVerbs.build}, {practiceVerbs.scale}.</p>

      {reducedMotion ? (
        <div ref={filmTrackRef} className="relative min-h-[100svh] overflow-hidden px-5 py-20 sm:px-8 lg:px-12 lg:py-12">
          {filmVisual}
          <div className="relative z-20 mx-auto flex min-h-[calc(100svh-10rem)] max-w-[1480px] flex-col justify-between">
            <div className="flex items-start border-t border-white/18 pt-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#B68CFF]">{copy.eyebrow}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#F3F0E8]/48">Mario Morera · Perfil</p>
              </div>
            </div>
            <div className="max-w-[900px] pt-28 lg:ml-auto lg:w-[62vw]">
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#F3F0E8]/54">{copy.signature}</p>
              <p className="mt-5 max-w-3xl text-[clamp(2.6rem,5vw,5.8rem)] font-medium uppercase leading-[.86] tracking-[-.07em] text-[#F3F0E8]">{copy.convergence}</p>
              <div className="mt-10"><EditorialCopy copy={copy} compact={!isDesktop} /></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div ref={filmTrackRef} data-film-track className="relative h-[420vh]">
            <div className="sticky top-0 h-[100svh] overflow-hidden px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
              {filmVisual}
              <div className="relative z-20 mx-auto h-full max-w-[1480px]">
                <div className="flex items-start border-t border-white/18 pt-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#B68CFF]">{copy.eyebrow}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#F3F0E8]/48">Mario Morera · Perfil</p>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-[8%] top-20 lg:bottom-auto lg:top-[25%] lg:max-w-[850px]" aria-hidden="true">
                  <motion.div style={{ opacity: nameOpacity, y: nameY }} className="absolute bottom-0 left-0 lg:bottom-auto lg:top-0">
                    <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#F3F0E8]/54">{copy.signature}</p>
                    <p className="mt-4 text-[clamp(3.6rem,8vw,8rem)] font-medium leading-[.77] tracking-[-.085em] text-[#F3F0E8]">Mario<br />Morera</p>
                  </motion.div>
                  <motion.p style={{ opacity: createOpacity, x: createX }} className="absolute bottom-0 left-0 text-[clamp(3.6rem,10vw,10rem)] font-medium uppercase leading-none tracking-[-.08em] text-[#B68CFF] lg:bottom-auto lg:top-[18%]">{practiceVerbs.create}</motion.p>
                  <motion.p style={{ opacity: buildOpacity, x: buildX }} className="absolute bottom-0 left-0 text-[clamp(3.25rem,9vw,9rem)] font-medium uppercase leading-none tracking-[-.08em] text-[#55D8FF] lg:bottom-auto lg:top-[18%]">{practiceVerbs.build}</motion.p>
                  <motion.p style={{ opacity: scaleOpacity, x: scaleX }} className="absolute bottom-0 left-0 text-[clamp(3.6rem,10vw,10rem)] font-medium uppercase leading-none tracking-[-.08em] text-[#71F3A2] lg:bottom-auto lg:top-[18%]">{practiceVerbs.scale}</motion.p>
                  <motion.p
                    style={{ opacity: convergenceOpacity, y: convergenceY, scale: convergenceScale }}
                    className="absolute bottom-0 left-0 max-w-[800px] origin-left text-[clamp(2.5rem,6.2vw,7rem)] font-medium uppercase leading-[.83] tracking-[-.07em] text-[#F3F0E8] lg:bottom-auto lg:top-[8%]"
                  >
                    {copy.convergence}
                  </motion.p>
                </div>

                <motion.div
                  aria-hidden="true"
                  style={{ opacity: headlineOpacity, y: headlineY }}
                  className="absolute inset-x-0 bottom-[4%] bg-[linear-gradient(180deg,transparent_0%,rgba(5,6,7,.96)_20%,#050607_100%)] px-1 pb-2 pt-14 lg:hidden"
                >
                  <p className="max-w-[680px] text-[clamp(2.15rem,9vw,4rem)] font-medium leading-[.91] tracking-[-.06em] text-[#F3F0E8]">
                    {copy.headline}
                  </p>
                </motion.div>

                <div className="absolute bottom-[4%] right-0 hidden w-[62vw] max-w-[920px] lg:block">
                  <EditorialCopy
                    copy={copy}
                    headlineOpacity={headlineOpacity}
                    headlineY={headlineY}
                    detailsOpacity={detailsOpacity}
                    detailsY={detailsY}
                    animate
                    linksInteractive={linksInteractive}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 px-5 pb-20 pt-4 sm:px-8 sm:pb-24 lg:hidden">
            <EditorialCopy copy={copy} compact />
          </div>
        </>
      )}
    </section>
  );
}

export const AuthorManifestoScene = memo(AuthorManifestoSceneComponent);
AuthorManifestoScene.displayName = "AuthorManifestoScene";
