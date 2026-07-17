export type PortraitFrameStatus = "idle" | "loading" | "loaded" | "failed";

export interface PortraitFrameSequence {
  poster: string;
  frames: readonly string[];
  mobileFrames: readonly string[];
  aspectRatio: number;
  preloadRadius: number;
}

export interface PortraitFrameBlend {
  from: number;
  to: number;
  mix: number;
}

export interface PortraitRenderablePair {
  from: number | null;
  to: number | null;
  mix: number;
}

const DESKTOP_BASE = "/profile/author-sequence/desktop";
const MOBILE_BASE = "/profile/author-sequence/mobile";

export const PORTRAIT_FRAME_SEQUENCE: PortraitFrameSequence = {
  poster: "/profile/author-sequence/poster.jpg",
  frames: Array.from({ length: 8 }, (_, index) => `${DESKTOP_BASE}/frame-${String(index + 1).padStart(2, "0")}.jpg`),
  mobileFrames: [1, 2, 3, 5, 7, 8].map((index) => `${MOBILE_BASE}/frame-${String(index).padStart(2, "0")}.jpg`),
  aspectRatio: 2 / 3,
  preloadRadius: 1,
};

export function resolveFrameBlend(progress: number, count: number): PortraitFrameBlend {
  if (count <= 1) return { from: 0, to: 0, mix: 0 };
  const safeProgress = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const scaled = safeProgress * (count - 1);
  const from = Math.floor(scaled);
  const to = Math.min(count - 1, from + 1);
  return { from, to, mix: to === from ? 0 : scaled - from };
}

export function resolveFrameCrossfade(mix: number): number {
  const safeMix = Number.isFinite(mix) ? Math.min(1, Math.max(0, mix)) : 0;
  const transition = Math.min(1, Math.max(0, (safeMix - 0.78) / 0.22));
  return transition * transition * (3 - 2 * transition);
}

export function resolvePreloadWindow(
  blend: PortraitFrameBlend,
  count: number,
  radius: number,
): number[] {
  if (count <= 0) return [];
  const safeRadius = Math.max(0, Math.floor(radius));
  const start = Math.max(0, Math.min(blend.from, blend.to) - safeRadius);
  const end = Math.min(count - 1, Math.max(blend.from, blend.to) + safeRadius);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function shouldPreloadFrame(status?: PortraitFrameStatus): boolean {
  return status === undefined || status === "idle";
}

export function resolveRenderablePair(
  blend: PortraitFrameBlend,
  statuses: readonly (PortraitFrameStatus | undefined)[],
  lastLoadedIndex: number | null,
): PortraitRenderablePair {
  const fromLoaded = statuses[blend.from] === "loaded";
  const toLoaded = statuses[blend.to] === "loaded";
  const fallbackLoaded = lastLoadedIndex !== null && statuses[lastLoadedIndex] === "loaded";
  const from = fromLoaded
    ? blend.from
    : fallbackLoaded
      ? lastLoadedIndex
      : toLoaded
        ? blend.to
        : null;
  const to = toLoaded ? blend.to : from;
  return {
    from,
    to,
    mix: from === blend.from && to === blend.to ? blend.mix : 0,
  };
}
