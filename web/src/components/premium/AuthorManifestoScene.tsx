"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { SITE_IDENTITY } from "@/config/site";
import {
  PORTRAIT_FRAME_SEQUENCE,
  resolveFrameBlend,
  resolveFrameCrossfade,
  resolvePreloadWindow,
  resolveRenderablePair,
  shouldPreloadFrame,
  type PortraitFrameBlend,
  type PortraitRenderablePair,
  type PortraitFrameSequence,
  type PortraitFrameStatus,
} from "@/data/portraitFrameSequence";
import { useResolvedMediaQuery } from "@/hooks/useMediaQuery";

export interface AuthorManifestoCopy {
  eyebrow: string;
  convergence: string;
  headline: string;
  body: string;
  principleLabel: string;
  principle: string;
  signature: string;
  portraitNote: string;
}

interface AuthorManifestoSceneProps {
  language: "es" | "en";
  copy: AuthorManifestoCopy;
  sequence?: PortraitFrameSequence;
}

const EMPTY_BLEND: PortraitFrameBlend = { from: 0, to: 1, mix: 0 };
const EMPTY_RENDERABLE: PortraitRenderablePair = { from: null, to: null, mix: 0 };
type SequenceKey = "desktop" | "mobile";

function markImageLoaded(
  image: HTMLImageElement,
  onReady: () => void,
) {
  const decoded = typeof image.decode === "function"
    ? image.decode().catch(() => undefined)
    : Promise.resolve();
  void decoded.then(onReady);
}

function AuthorManifestoSceneComponent({
  language,
  copy,
  sequence = PORTRAIT_FRAME_SEQUENCE,
}: AuthorManifestoSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const desktopMatch = useResolvedMediaQuery("(min-width: 1024px)");
  const reducedMotionMatch = useResolvedMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = desktopMatch === true;
  const viewportResolved = desktopMatch !== null;
  const motionPreferenceResolved = reducedMotionMatch !== null;
  const reducedMotion = reducedMotionMatch === true;
  const frames = isDesktop ? sequence.frames : sequence.mobileFrames;
  const sequenceKey: SequenceKey = isDesktop ? "desktop" : "mobile";
  const [activeBlend, setActiveBlend] = useState<PortraitFrameBlend>(EMPTY_BLEND);
  const activeBlendRef = useRef<Record<SequenceKey, PortraitFrameBlend>>({
    desktop: EMPTY_BLEND,
    mobile: EMPTY_BLEND,
  });
  const activePairRef = useRef<Record<SequenceKey, string>>({
    desktop: "0:1",
    mobile: "0:1",
  });
  const [renderableByKey, setRenderableByKey] = useState<Record<SequenceKey, PortraitRenderablePair>>({
    desktop: EMPTY_RENDERABLE,
    mobile: EMPTY_RENDERABLE,
  });
  const statusesRef = useRef(new Map<string, PortraitFrameStatus>());
  const lastDisplayedRef = useRef<Record<SequenceKey, number | null>>({
    desktop: null,
    mobile: null,
  });
  const displayedHistoryRef = useRef<Record<SequenceKey, number[]>>({
    desktop: [],
    mobile: [],
  });
  const mountedRef = useRef(true);
  const frameMix = useMotionValue(0);
  const [detailsReady, setDetailsReady] = useState(false);
  const detailsReadyRef = useRef(false);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: mobilePortraitProgress } = useScroll({
    target: portraitRef,
    offset: ["start 90%", "end 90%"],
  });
  const frameProgress = isDesktop ? sectionProgress : mobilePortraitProgress;

  const nameOpacity = useTransform(sectionProgress, [0, 0.13, 0.18], [1, 1, 0]);
  const nameY = useTransform(sectionProgress, [0, 0.18], [0, -28]);
  const createOpacity = useTransform(sectionProgress, [0.16, 0.18, 0.34, 0.38], [0, 1, 1, 0]);
  const createX = useTransform(sectionProgress, [0.16, 0.2], [-60, 0]);
  const buildOpacity = useTransform(sectionProgress, [0.36, 0.38, 0.51, 0.55], [0, 1, 1, 0]);
  const buildX = useTransform(sectionProgress, [0.36, 0.4], [60, 0]);
  const scaleOpacity = useTransform(sectionProgress, [0.53, 0.55, 0.66, 0.7], [0, 1, 1, 0]);
  const scaleX = useTransform(sectionProgress, [0.53, 0.57], [-60, 0]);
  const convergenceOpacity = useTransform(sectionProgress, [0.68, 0.72, 0.82, 0.85], [0, 1, 1, 0]);
  const convergenceY = useTransform(sectionProgress, [0.68, 0.74], [36, 0]);
  const convergenceScale = useTransform(sectionProgress, [0.68, 0.76], [0.96, 1]);
  const headlineOpacity = useTransform(sectionProgress, [0.82, 0.86, 1], [0, 1, 1]);
  const headlineY = useTransform(sectionProgress, [0.82, 0.88], [42, 0]);
  const detailsOpacity = useTransform(sectionProgress, [0.91, 0.95, 1], [0, 1, 1]);
  const detailsY = useTransform(sectionProgress, [0.91, 0.97], [24, 0]);
  const portraitScale = useTransform(sectionProgress, [0, 0.58, 1], [1.06, 1.025, 1]);
  const shadowOpacity = useTransform(frameProgress, [0, 0.22, 0.62], [0.68, 0.42, 0.06]);

  const updateRenderable = useCallback((
    blend: PortraitFrameBlend,
    currentFrames: readonly string[],
    key: SequenceKey,
  ) => {
    const statuses = currentFrames.map((source) => statusesRef.current.get(source));
    const pair = resolveRenderablePair(blend, statuses, lastDisplayedRef.current[key]);
    setRenderableByKey((current) => {
      const previous = current[key];
      if (previous.from === pair.from && previous.to === pair.to) return current;
      return { ...current, [key]: pair };
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const syncFrameProgress = useCallback((progress: number) => {
    if (reducedMotion) return;
    const nextBlend = resolveFrameBlend(progress, frames.length);
    activeBlendRef.current[sequenceKey] = nextBlend;
    frameMix.set(resolveFrameCrossfade(nextBlend.mix));
    const pairKey = `${nextBlend.from}:${nextBlend.to}`;
    if (pairKey !== activePairRef.current[sequenceKey]) {
      activePairRef.current[sequenceKey] = pairKey;
      setActiveBlend(nextBlend);
      updateRenderable(nextBlend, frames, sequenceKey);
    }

    if (isDesktop) {
      const nextDetailsReady = progress >= 0.92;
      if (detailsReadyRef.current !== nextDetailsReady) {
        detailsReadyRef.current = nextDetailsReady;
        setDetailsReady(nextDetailsReady);
      }
    }
  }, [frameMix, frames, isDesktop, reducedMotion, sequenceKey, updateRenderable]);

  useMotionValueEvent(frameProgress, "change", syncFrameProgress);

  useEffect(() => {
    if (!viewportResolved || !motionPreferenceResolved) return;
    if (reducedMotion) return;
    const frameId = window.requestAnimationFrame(() => {
      syncFrameProgress(frameProgress.get());
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [frameProgress, motionPreferenceResolved, reducedMotion, syncFrameProgress, viewportResolved]);

  useEffect(() => {
    if (!viewportResolved || !motionPreferenceResolved || reducedMotion) return;
    const windowIndices = resolvePreloadWindow(
      activeBlend,
      frames.length,
      sequence.preloadRadius,
    );

    for (const index of windowIndices) {
      const source = frames[index];
      if (!source || !shouldPreloadFrame(statusesRef.current.get(source))) continue;
      statusesRef.current.set(source, "loading");
      const candidate = new window.Image();
      candidate.src = source;
      candidate.onload = () => markImageLoaded(candidate, () => {
        statusesRef.current.set(source, "loaded");
        if (mountedRef.current) updateRenderable(activeBlendRef.current[sequenceKey], frames, sequenceKey);
      });
      candidate.onerror = () => {
        statusesRef.current.set(source, "failed");
        if (mountedRef.current) updateRenderable(activeBlendRef.current[sequenceKey], frames, sequenceKey);
      };
    }
  }, [activeBlend, frames, motionPreferenceResolved, reducedMotion, sequence.preloadRadius, sequenceKey, updateRenderable, viewportResolved]);

  const recordRenderedFrame = useCallback((
    source: string,
    currentFrames: readonly string[],
    key: SequenceKey,
    rememberAsDisplayed: boolean,
  ) => {
    const index = currentFrames.indexOf(source);
    if (index < 0) return;
    statusesRef.current.set(source, "loaded");
    if (rememberAsDisplayed) {
      const history = displayedHistoryRef.current[key].filter((entry) => entry !== index);
      history.push(index);
      displayedHistoryRef.current[key] = history;
      lastDisplayedRef.current[key] = index;
    }
    updateRenderable(activeBlendRef.current[key], currentFrames, key);
  }, [updateRenderable]);

  const recordFailedFrame = useCallback((
    source: string,
    currentFrames: readonly string[],
    key: SequenceKey,
  ) => {
    const index = currentFrames.indexOf(source);
    if (index < 0) return;
    statusesRef.current.set(source, "failed");
    const history = displayedHistoryRef.current[key].filter((entry) => entry !== index);
    displayedHistoryRef.current[key] = history;
    lastDisplayedRef.current[key] = history.at(-1) ?? null;
    updateRenderable(activeBlendRef.current[key], currentFrames, key);
  }, [updateRenderable]);

  const renderable = reducedMotion
    ? { from: Math.max(0, frames.length - 1), to: Math.max(0, frames.length - 1), mix: 0 }
    : renderableByKey[sequenceKey];

  const primarySource = renderable.from === null ? sequence.poster : frames[renderable.from] ?? sequence.poster;
  const secondarySource = renderable.to === null ? primarySource : frames[renderable.to] ?? primarySource;
  const currentFrame = reducedMotion
    ? Math.max(0, frames.length - 1)
    : renderable.from ?? 0;
  const animateEditorialCopy = isDesktop && !reducedMotion;
  const linksInteractive = !isDesktop || reducedMotion || detailsReady;
  const portraitAspectRatio = Number.isFinite(sequence.aspectRatio) && sequence.aspectRatio > 0
    ? sequence.aspectRatio
    : 2 / 3;
  const imageLabel = language === "es"
    ? "Retrato editorial conceptual y ficticio de Mario Morera"
    : "Conceptual fictional editorial portrait of Mario Morera";
  const practiceVerbs = language === "es"
    ? { create: "Crear", build: "Construir", scale: "Escalar" }
    : { create: "Create", build: "Build", scale: "Scale" };

  return (
    <section
      ref={sectionRef}
      id="perfil"
      data-home-section="manifesto"
      data-testid="author-manifesto"
      className={`relative scroll-mt-28 border-y border-white/10 bg-[#080A0B] light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-background ${reducedMotion ? "lg:h-auto" : "lg:h-[250vh]"}`}
    >
      <p className="sr-only">
        {copy.convergence}: {practiceVerbs.create}, {practiceVerbs.build}, {practiceVerbs.scale}.
      </p>
      <div className={`relative px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-8 ${reducedMotion ? "lg:min-h-screen" : "lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden"}`}>
        <div className={`mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(420px,.94fr)] lg:items-stretch lg:gap-10 ${reducedMotion ? "lg:min-h-[calc(100svh-4rem)]" : "lg:h-full"}`}>
          <div className="relative z-20 order-2 flex flex-col lg:order-none lg:py-7">
            <div className="flex items-start justify-between gap-6 border-t border-white/14 pt-4 light:border-[rgb(var(--ink-rgb)/0.14)]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-track-create">{copy.eyebrow}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[.14em] text-foreground/42">{copy.portraitNote}</p>
              </div>
              <p className="max-w-36 text-right font-mono text-[10px] uppercase leading-4 tracking-[.13em] text-foreground/42">
                {SITE_IDENTITY.location[language]}
              </p>
            </div>

            <div className="mt-12 lg:hidden">
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/46">{copy.signature}</p>
              <p className="mt-4 text-[clamp(4.2rem,18vw,7rem)] font-medium leading-[.76] tracking-[-.085em] text-foreground">
                Mario<br />Morera
              </p>
              <div className="mt-14 space-y-1 text-[clamp(3rem,14vw,6.5rem)] font-medium uppercase leading-[.82] tracking-[-.075em]">
                <p className="text-track-create">{practiceVerbs.create}</p>
                <p className="text-track-build">{practiceVerbs.build}</p>
                <p className="text-track-scale">{practiceVerbs.scale}</p>
              </div>
              <p className="mt-12 border-t border-white/14 pt-5 text-[clamp(2rem,9vw,4rem)] font-medium uppercase leading-[.9] tracking-[-.06em] text-foreground light:border-[rgb(var(--ink-rgb)/0.14)]">
                {copy.convergence}
              </p>
            </div>

            <div className={`relative hidden lg:block ${reducedMotion ? "lg:pt-10" : "flex-1"}`} aria-hidden="true">
              {reducedMotion ? (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/46">{copy.signature}</p>
                  <p className="mt-5 text-[clamp(4.5rem,7.2vw,8.6rem)] font-medium leading-[.75] tracking-[-.085em] text-foreground">Mario<br />Morera</p>
                  <div className="mt-10 flex flex-wrap gap-x-5 text-[clamp(2rem,3.4vw,4.5rem)] font-medium uppercase leading-none tracking-[-.065em]">
                    <span className="text-track-create">{practiceVerbs.create}</span>
                    <span className="text-track-build">{practiceVerbs.build}</span>
                    <span className="text-track-scale">{practiceVerbs.scale}</span>
                  </div>
                  <p className="mt-8 max-w-3xl border-t border-white/14 pt-5 text-[clamp(2.4rem,4vw,5rem)] font-medium uppercase leading-[.88] tracking-[-.065em] text-foreground light:border-[rgb(var(--ink-rgb)/0.14)]">
                    {copy.convergence}
                  </p>
                </div>
              ) : (
                <>
                  <motion.div style={{ opacity: nameOpacity, y: nameY }} className="absolute inset-x-0 top-[24%]">
                    <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/46">{copy.signature}</p>
                    <p className="mt-5 text-[clamp(4.5rem,7.2vw,8.6rem)] font-medium leading-[.75] tracking-[-.085em] text-foreground">Mario<br />Morera</p>
                  </motion.div>
                  <motion.p style={{ opacity: createOpacity, x: createX }} className="absolute left-0 top-[40%] text-[clamp(5rem,9vw,11rem)] font-medium uppercase leading-none tracking-[-.085em] text-track-create">{practiceVerbs.create}</motion.p>
                  <motion.p style={{ opacity: buildOpacity, x: buildX }} className="absolute -right-[4vw] top-[40%] text-[clamp(4.5rem,8vw,10rem)] font-medium uppercase leading-none tracking-[-.085em] text-track-build">{practiceVerbs.build}</motion.p>
                  <motion.p style={{ opacity: scaleOpacity, x: scaleX }} className="absolute left-0 top-[40%] text-[clamp(5rem,9vw,11rem)] font-medium uppercase leading-none tracking-[-.085em] text-track-scale">{practiceVerbs.scale}</motion.p>
                  <motion.p
                    style={{ opacity: convergenceOpacity, y: convergenceY, scale: convergenceScale }}
                    className="absolute inset-x-0 top-[34%] max-w-[900px] origin-left text-[clamp(3.8rem,6.5vw,7.8rem)] font-medium uppercase leading-[.8] tracking-[-.075em] text-foreground"
                  >
                    {copy.convergence}
                  </motion.p>
                </>
              )}
            </div>

            <div className={`relative z-30 mt-12 ${reducedMotion ? "lg:static lg:mt-14 lg:w-auto" : "lg:absolute lg:bottom-[4.5%] lg:left-12 lg:mt-0 lg:w-[58vw] lg:max-w-[900px]"}`}>
              <motion.div style={animateEditorialCopy ? { opacity: headlineOpacity, y: headlineY } : undefined}>
                <h2 className="text-[clamp(2.65rem,5vw,6rem)] font-medium leading-[.92] tracking-[-.063em] text-foreground">
                  {copy.headline}
                </h2>
              </motion.div>

              <motion.div
                style={animateEditorialCopy ? { opacity: detailsOpacity, y: detailsY } : undefined}
                className="mt-9 border-t border-white/12 pt-6 lg:grid lg:grid-cols-[1.35fr_.65fr] lg:gap-10 light:border-[rgb(var(--ink-rgb)/0.12)]"
              >
                <p className="max-w-2xl text-base leading-7 text-foreground/62">{copy.body}</p>
                <div className="mt-8 lg:mt-0">
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-track-create">{copy.principleLabel}</p>
                  <p className="mt-3 text-[15px] leading-6 text-foreground/82">{copy.principle}</p>
                  <div
                    inert={!linksInteractive}
                    aria-hidden={!linksInteractive}
                    className={`mt-6 flex flex-wrap content-start gap-x-5 gap-y-3 ${linksInteractive ? "" : "pointer-events-none select-none"}`}
                  >
                    {[
                      ["LinkedIn", SITE_IDENTITY.social.linkedin],
                      ["GitHub", SITE_IDENTITY.social.github],
                      ["Email", `mailto:${SITE_IDENTITY.contact.email}`],
                    ].map(([label, href]) => (
                      <a
                        key={label}
                        href={href}
                        target={label === "Email" ? undefined : "_blank"}
                        rel={label === "Email" ? undefined : "noreferrer"}
                        tabIndex={linksInteractive ? undefined : -1}
                        className="inline-flex items-center gap-2 border-b border-white/20 pb-1 text-sm text-foreground transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent light:border-[rgb(var(--ink-rgb)/0.2)] light:hover:border-foreground"
                      >
                        {label}<ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            ref={portraitRef}
            role="img"
            aria-label={imageLabel}
            data-frame-index={currentFrame}
            data-sequence-mode={reducedMotion ? "reduced" : sequenceKey}
            className="relative z-10 order-1 w-full max-w-[560px] justify-self-center overflow-hidden bg-card lg:order-none lg:max-w-[60vh] lg:justify-self-end lg:self-center"
            style={animateEditorialCopy
              ? { scale: portraitScale, aspectRatio: portraitAspectRatio }
              : { aspectRatio: portraitAspectRatio }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cover bg-[center_30%] saturate-[.82]"
              style={{ backgroundImage: `url(${sequence.poster})` }}
            />
            <Image
              key={`primary-${primarySource}`}
              data-portrait-layer="primary"
              src={primarySource}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              loading="eager"
              draggable={false}
              className="object-cover object-[center_30%] saturate-[.82]"
              onLoad={(event) => {
                event.currentTarget.style.opacity = "1";
                recordRenderedFrame(primarySource, frames, sequenceKey, true);
              }}
              onError={(event) => {
                event.currentTarget.style.opacity = "0";
                recordFailedFrame(primarySource, frames, sequenceKey);
              }}
            />
            <motion.div className="absolute inset-0" style={{ opacity: reducedMotion ? 1 : frameMix }}>
              <Image
                key={`secondary-${secondarySource}`}
                data-portrait-layer="secondary"
                src={secondarySource}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                loading="eager"
                draggable={false}
                className="object-cover object-[center_30%] saturate-[.82]"
                onLoad={(event) => {
                  event.currentTarget.style.opacity = "1";
                  recordRenderedFrame(secondarySource, frames, sequenceKey, false);
                }}
                onError={(event) => {
                  event.currentTarget.style.opacity = "0";
                  recordFailedFrame(secondarySource, frames, sequenceKey);
                }}
              />
            </motion.div>
            <motion.div style={reducedMotion ? { opacity: 0.06 } : { opacity: shadowOpacity }} className="pointer-events-none absolute inset-0 bg-background" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-background)_2%,transparent)_35%,color-mix(in_srgb,var(--color-background)_76%,transparent)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-background)_24%,transparent),transparent_46%,color-mix(in_srgb,var(--color-track-create)_6%,transparent))]" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-5 border-t border-white/16 pt-3 sm:bottom-6 sm:left-6 sm:right-6 light:border-[rgb(var(--ink-rgb)/0.16)]">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/54">Mario Morera</p>
              <p className="text-right font-mono text-[10px] uppercase tracking-[.14em] text-foreground/42">Creative Technologist<br />&amp; Systems Builder</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const AuthorManifestoScene = memo(AuthorManifestoSceneComponent);
AuthorManifestoScene.displayName = "AuthorManifestoScene";
