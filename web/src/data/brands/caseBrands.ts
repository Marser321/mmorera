import type { CSSProperties } from "react";

/**
 * Marca de cada cliente, extraída de su propio código (no inventada). Los films
 * de caso se pintan con estos tokens: el Player vive dentro del DOM, así que
 * basta con redefinir las variables CSS del sitio en la raíz de la composición
 * para que todas las escenas tomen la paleta y la tipografía del cliente.
 */

export interface CaseBrand {
  slug: string;
  name: string;
  palette: {
    bg: string;
    surface: string;
    raised: string;
    line: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    accentDeep: string;
    onAccent: string;
  };
  /** Familias CSS (las variables vienen de app/fonts/brandFonts.ts). */
  fonts: { display: string; body: string; label: string };
  /** Los títulos de la marca van en mayúsculas (p. ej. Oswald en New Brothers). */
  uppercaseDisplay: boolean;
  logo: {
    mark: string;
    wordmark?: string;
    /** Cómo se lee el logo para las partículas: por opacidad o por tinta oscura. */
    particleMode: "alpha" | "dark";
  };
  radius: number;
  texture: "gold-dust" | "none";
  /** Fuente de los tokens, para auditar. */
  source: string;
}

export const CASE_BRANDS: Record<string, CaseBrand> = {
  "new-brothers-barberia": {
    slug: "new-brothers-barberia",
    name: "New Brothers",
    palette: {
      bg: "#0A0805",
      surface: "#15110A",
      raised: "#1E1810",
      line: "#3A2E17",
      text: "#F6E8C8",
      muted: "#A99C80",
      accent: "#D4AF37",
      accentSoft: "#F2CF62",
      accentDeep: "#B8871C",
      onAccent: "#0A0805",
    },
    fonts: {
      display: "var(--ff-brand-oswald), Oswald, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-oswald), Oswald, sans-serif",
    },
    uppercaseDisplay: false,
    logo: { mark: "/portfolio/brands/new-brothers-barberia/logo.png", particleMode: "dark" },
    radius: 16,
    texture: "gold-dust",
    source: "D:\\Barberia: src/lib/visual-skins.ts (NB Luxe), src/app/layout.tsx (Oswald + Inter)",
  },
  "fenix-medical-center": {
    slug: "fenix-medical-center",
    name: "Fenix Medical Center",
    palette: {
      bg: "#040a15",
      surface: "#0b1422",
      raised: "#101e34",
      line: "#1b2638",
      text: "#f8f6f0",
      muted: "#c9bfb2",
      accent: "#cb9334",
      accentSoft: "#f0cf7a",
      accentDeep: "#8a5d1d",
      onAccent: "#04070c",
    },
    fonts: {
      display: "var(--ff-brand-fraunces), Fraunces, serif",
      body: "var(--ff-brand-manrope), Manrope, sans-serif",
      label: "var(--ff-brand-manrope), Manrope, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/fenix-medical-center/mark.png",
      wordmark: "/portfolio/brands/fenix-medical-center/wordmark.png",
      particleMode: "alpha",
    },
    radius: 20,
    texture: "gold-dust",
    source: "D:\\fenix group\\fenix-medical-center: src/app/globals.css (@theme), src/lib/brand.ts",
  },
  "ad-media-solution": {
    slug: "ad-media-solution",
    name: "AD Media Solution",
    palette: {
      bg: "#020617",
      surface: "#0f172a",
      raised: "#162036",
      line: "#1e293b",
      text: "#F8FAFC",
      muted: "#94A3B8",
      accent: "#0066FF",
      accentSoft: "#7DD3FC",
      accentDeep: "#0044CC",
      onAccent: "#F8FAFC",
    },
    fonts: {
      display: "var(--ff-brand-montserrat), Montserrat, sans-serif",
      body: "var(--ff-brand-montserrat), Montserrat, sans-serif",
      label: "var(--ff-brand-montserrat), Montserrat, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/ad-media-solution/mark.png",
      wordmark: "/portfolio/brands/ad-media-solution/wordmark.png",
      particleMode: "alpha",
    },
    radius: 14,
    texture: "none",
    source: "D:\\1B Ecritorio Mac\\AD Media Solution: tailwind/globals (navy + electric blue, Montserrat)",
  },
  "lb-elite-wash-detail": {
    slug: "lb-elite-wash-detail",
    name: "L&B Elite Wash & Detail",
    palette: {
      bg: "#06080D",
      surface: "#0D1423",
      raised: "#161E30",
      line: "#262B33",
      text: "#E6EDF3",
      muted: "#9BA7B4",
      accent: "#1E6FE6",
      accentSoft: "#4A9AFF",
      accentDeep: "#1659C7",
      onAccent: "#FFFFFF",
    },
    fonts: {
      display: "var(--ff-brand-outfit), Outfit, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-inter), Inter, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/lb-elite-wash-detail/mark.png",
      wordmark: "/portfolio/brands/lb-elite-wash-detail/wordmark.png",
      particleMode: "alpha",
    },
    radius: 16,
    texture: "none",
    source: "LyB Elite Wash Details: site/styles.css (--accent #1E6FE6, Outfit + Inter)",
  },
};

export function getCaseBrand(slug: string): CaseBrand | undefined {
  return CASE_BRANDS[slug];
}

function hexToRgbTriplet(hex: string) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const number = Number.parseInt(full, 16);
  return `${(number >> 16) & 255} ${(number >> 8) & 255} ${number & 255}`;
}

/**
 * Variables CSS que convierten las escenas del film a la marca del cliente.
 * Sobrescriben los tokens del sitio solo dentro del subárbol del Player.
 */
export function brandCssVars(brand: CaseBrand): CSSProperties {
  const { palette, fonts } = brand;
  return {
    "--color-background": palette.bg,
    "--color-card": palette.surface,
    "--color-foreground": palette.text,
    "--color-signal": palette.accent,
    "--color-accent": palette.accentSoft,
    "--color-track-create": palette.accentDeep,
    "--ink-rgb": hexToRgbTriplet(palette.text),
    "--ff-body": fonts.body,
    "--ff-mono": fonts.label,
    "--ff-film-display": fonts.display,
  } as CSSProperties;
}
