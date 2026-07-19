export type MotionBehavior = "static" | "loop" | "play-once" | "scroll";
export type MotionScrim = "none" | "left" | "right" | "center" | "form";

export interface MotionMediaSource {
  webp: string;
  avif?: string;
  webm?: string;
  mp4?: string;
  objectPosition?: string;
}

export interface MotionResponsiveSource {
  desktop: MotionMediaSource;
  mobile: MotionMediaSource;
}

export interface MotionPreviewSource {
  desktop: string;
  mobile: string;
}

export interface MotionAsset {
  id: "nucleo-decision" | "cinta-continuidad" | "telar-pulso" | "archivo-estratos" | "apertura-protegida";
  behavior: MotionBehavior;
  scrim: MotionScrim;
  pointerDrift?: number;
  previewOnly?: boolean;
  previewVideo?: MotionPreviewSource;
  variants: {
    dark: MotionResponsiveSource;
    light: MotionResponsiveSource;
  };
}

const ROOT = "/motion/backgrounds";
const PREVIEW_ROOT = "/motion/previews";

export function isMotionPreviewHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function previewVideo(desktop: "graphite" | "minimalist", mobile: "graphite" | "minimalist" | "camera" = desktop): MotionPreviewSource {
  return {
    desktop: `${PREVIEW_ROOT}/${desktop}-desktop.mp4`,
    mobile: `${PREVIEW_ROOT}/${mobile}-mobile.mp4`,
  };
}

function sources(
  id: MotionAsset["id"],
  theme: "dark" | "light",
  desktopPosition = "center",
  mobilePosition = "center bottom",
): MotionResponsiveSource {
  return {
    desktop: {
      webp: `${ROOT}/${id}-${theme}-desktop.webp`,
      avif: `${ROOT}/${id}-${theme}-desktop.avif`,
      objectPosition: desktopPosition,
    },
    mobile: {
      webp: `${ROOT}/${id}-${theme}-mobile.webp`,
      avif: `${ROOT}/${id}-${theme}-mobile.avif`,
      objectPosition: mobilePosition,
    },
  };
}

export const MOTION_ASSETS = {
  nucleus: {
    id: "nucleo-decision",
    behavior: "play-once",
    scrim: "left",
    previewOnly: true,
    previewVideo: previewVideo("graphite"),
    variants: {
      dark: sources("nucleo-decision", "dark", "center right"),
      light: sources("nucleo-decision", "light", "center right"),
    },
  },
  continuity: {
    id: "cinta-continuidad",
    behavior: "scroll",
    scrim: "left",
    previewOnly: true,
    previewVideo: previewVideo("minimalist"),
    variants: {
      dark: sources("cinta-continuidad", "dark"),
      light: sources("cinta-continuidad", "light"),
    },
  },
  pulse: {
    id: "telar-pulso",
    behavior: "loop",
    scrim: "left",
    pointerDrift: 12,
    previewOnly: true,
    previewVideo: previewVideo("graphite"),
    variants: {
      dark: sources("telar-pulso", "dark", "center right"),
      light: sources("telar-pulso", "light", "center right"),
    },
  },
  archive: {
    id: "archivo-estratos",
    behavior: "scroll",
    scrim: "left",
    previewOnly: true,
    previewVideo: previewVideo("minimalist"),
    variants: {
      dark: sources("archivo-estratos", "dark", "center right"),
      light: sources("archivo-estratos", "light", "center right"),
    },
  },
  opening: {
    id: "apertura-protegida",
    behavior: "play-once",
    scrim: "center",
    previewOnly: true,
    previewVideo: previewVideo("minimalist", "camera"),
    variants: {
      dark: sources("apertura-protegida", "dark", "center right"),
      light: sources("apertura-protegida", "light", "center right"),
    },
  },
} as const satisfies Record<string, MotionAsset>;
