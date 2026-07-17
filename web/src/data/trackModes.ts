import type { TrackId } from "@/types/site";

export const TRACK_MODE_QUERY: Record<TrackId, "crear" | "construir" | "escalar"> = {
  create: "crear",
  build: "construir",
  scale: "escalar",
};

const TRACK_BY_MODE: Record<string, TrackId> = {
  crear: "create",
  construir: "build",
  escalar: "scale",
};

export function resolveTrackMode(mode?: string | null, fallback: TrackId = "create"): TrackId {
  return mode && TRACK_BY_MODE[mode] ? TRACK_BY_MODE[mode] : fallback;
}

export function isTrackMode(mode?: string | null): boolean {
  return Boolean(mode && TRACK_BY_MODE[mode]);
}
