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
  "mr-studio-tattoo": {
    slug: "mr-studio-tattoo",
    name: "Mr. Studio Tattoo",
    palette: {
      bg: "#07090F",
      surface: "#151A28",
      raised: "#1E2435",
      line: "#2A3142",
      text: "#E8EDF6",
      muted: "#9BA7BA",
      accent: "#2A4DE8",
      accentSoft: "#7C93FF",
      accentDeep: "#1744FA",
      onAccent: "#E8EDF6",
    },
    fonts: {
      display: "var(--ff-brand-anton), Anton, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-inter), Inter, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/mr-studio-tattoo/mark.png",
      particleMode: "alpha",
    },
    radius: 6,
    texture: "none",
    source: "mrstudiotattoo.com en vivo (2026-10-07): variables CSS --background, --card, --primary #2a4de8, --ring #1744fa; Anton + Inter",
  },
  "truckers-choice": {
    slug: "truckers-choice",
    name: "Truckers Choice",
    palette: {
      bg: "#050810",
      surface: "#0F1626",
      raised: "#151E32",
      line: "#21242C",
      text: "#F2F5FA",
      muted: "#9CA3AF",
      accent: "#FFB020",
      accentSoft: "#FFC861",
      accentDeep: "#E89400",
      onAccent: "#050810",
    },
    fonts: {
      display: "var(--ff-brand-manrope), Manrope, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-inter), Inter, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/truckers-choice/mark.png",
      wordmark: "/portfolio/brands/truckers-choice/wordmark.png",
      particleMode: "alpha",
    },
    radius: 12,
    texture: "none",
    source: "truckers-choice-web-site.vercel.app en vivo (2026-10-07): clases compiladas bg #050810, superficie #0F1626, ámbar #FFB020 (--primitive-amber 38 100% 56%), texto #F2F5FA; Manrope (--font-display) + Inter (--font-body). accentSoft/accentDeep: el mismo ámbar aclarado y oscurecido para los acentos de texto",
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
      // El PNG no tiene canal alfa (logo sobre blanco): por opacidad las partículas formaban un cuadrado.
      particleMode: "dark",
    },
    radius: 16,
    texture: "none",
    source: "LyB Elite Wash Details: site/styles.css (--accent #1E6FE6, Outfit + Inter)",
  },
  "rangel-oviedo-group": {
    slug: "rangel-oviedo-group",
    name: "Rangel Oviedo Group",
    palette: {
      bg: "#0B0A08",
      surface: "#1A1612",
      raised: "#2D2421",
      line: "#2D2421",
      text: "#F5F1E8",
      muted: "#A8A29E",
      accent: "#C9A864",
      accentSoft: "#D4B16F",
      accentDeep: "#9A3412",
      onAccent: "#0B0A08",
    },
    fonts: {
      display: "var(--ff-brand-playfair-display), 'Playfair Display', serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-inter), Inter, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/rangel-oviedo-group/mark.png",
      wordmark: "/portfolio/brands/rangel-oviedo-group/wordmark.png",
      particleMode: "alpha",
    },
    radius: 8,
    texture: "none",
    source: "rangeloviedo-tor8.vercel.app en vivo (2026-10-07): variables CSS compiladas --ro-ink #0B0A08, --ro-surface #1A1612, --ro-paper #F5F1E8, acento cobre #C9A864 (--ro-accent); Playfair Display + Inter",
  },
  "america-tramites": {
    slug: "america-tramites",
    name: "América Trámites",
    palette: {
      bg: "#050B14",
      surface: "#0A1322",
      raised: "#0D192C",
      line: "#1E293B",
      text: "#F8FAFC",
      muted: "#94A3B8",
      accent: "#BE0000",
      accentSoft: "#EF4444",
      accentDeep: "#990000",
      onAccent: "#FFFFFF",
    },
    fonts: {
      display: "var(--ff-brand-montserrat), Montserrat, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-inter), Inter, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/america-tramites/mark.png",
      wordmark: "/portfolio/brands/america-tramites/wordmark.png",
      particleMode: "alpha",
    },
    radius: 8,
    texture: "none",
    source: "CSS servido (/assets/index-44aAmVww.css y clases compiladas de Tailwind): fondo #050B14, superficie #0A1322, superficie elevada #0D192C, borde #1E293B, texto #F8FAFC, acento rojo #BE0000; Montserrat + Inter",
  },
  "evowrap": {
    slug: "evowrap",
    name: "EvoWrap",
    palette: {
      bg: "#050505",
      surface: "#0A0A0A",
      raised: "#171717",
      line: "#262626",
      text: "#FFFFFF",
      muted: "#A3A3A3",
      accent: "#F59E0B",
      accentSoft: "#FBBF24",
      accentDeep: "#D97706",
      onAccent: "#050505",
    },
    fonts: {
      display: "var(--ff-brand-orbitron), Orbitron, sans-serif",
      body: "var(--ff-brand-geist), Geist, sans-serif",
      label: "var(--ff-brand-geist), Geist, sans-serif",
    },
    uppercaseDisplay: true,
    logo: {
      mark: "/portfolio/brands/evowrap/mark.png",
      wordmark: "/portfolio/brands/evowrap/wordmark.png",
      particleMode: "alpha",
    },
    radius: 8,
    texture: "none",
    source: "CSS servido (_next/static/chunks/*.css): fondo #050505, superficie #0A0A0A, superficie elevada #171717, bordes #262626, texto #FFFFFF, acento ámbar #F59E0B (suave #FBBF24, profundo #D97706); Orbitron + Geist",
  },
  "autohub-360": {
    slug: "autohub-360",
    name: "AutoHub 360",
    palette: {
      bg: "#020617",
      surface: "#0F172A",
      raised: "#1E293B",
      line: "#334155",
      text: "#F8FAFC",
      muted: "#94A3B8",
      accent: "#DC2626",
      accentSoft: "#EF4444",
      accentDeep: "#991B1B",
      onAccent: "#FFFFFF",
    },
    fonts: {
      display: "var(--ff-brand-inter), Inter, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-inter), Inter, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/autohub-360/mark.png",
      wordmark: "/portfolio/brands/autohub-360/wordmark.png",
      particleMode: "alpha",
    },
    radius: 12,
    texture: "none",
    source: "CSS servido (_next/static/chunks/*.css): fondo #020617, superficie #0F172A, superficie elevada #1E293B, líneas #334155, texto #F8FAFC, acento rojo #DC2626; Inter",
  },
  "doge-sm": {
    slug: "doge-sm",
    name: "DOGE.S.M LLC",
    palette: {
      bg: "#0B0B0F",
      surface: "#131318",
      raised: "#1B1B22",
      line: "#24242D",
      text: "#F4F4F5",
      muted: "#A1A1AA",
      accent: "#D62828",
      accentSoft: "#EF4444",
      accentDeep: "#790302",
      onAccent: "#FFFFFF",
    },
    fonts: {
      display: "var(--ff-brand-michroma), Michroma, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-michroma), Michroma, sans-serif",
    },
    uppercaseDisplay: true,
    logo: {
      mark: "/portfolio/brands/doge-sm/mark.png",
      wordmark: "/portfolio/brands/doge-sm/wordmark.png",
      particleMode: "alpha",
    },
    radius: 16,
    texture: "none",
    source: "CSS servido de doge-27dp.vercel.app: --surface-0 #0B0B0F, --surface-1 #131318, --surface-2 #1B1B22, --surface-3 #24242D, --text-primary #F4F4F5, --text-secondary #A1A1AA, --brand #D62828, --brand-deep #790302; Michroma + Inter",
  },
  "punta-360": {
    slug: "punta-360",
    name: "Punta360",
    palette: {
      bg: "#020617",
      surface: "#0B1120",
      raised: "#131D31",
      line: "#1E293B",
      text: "#F8FAFC",
      muted: "#94A3B8",
      accent: "#F59E0B",
      accentSoft: "#FBBF24",
      accentDeep: "#D97706",
      onAccent: "#020617",
    },
    fonts: {
      display: "var(--ff-brand-geist), Geist, sans-serif",
      body: "var(--ff-brand-geist), Geist, sans-serif",
      label: "var(--ff-brand-geist), Geist, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/punta-360/mark.png",
      wordmark: "/portfolio/brands/punta-360/wordmark.png",
      particleMode: "alpha",
    },
    radius: 24,
    texture: "none",
    source: "CSS servido de punta-360.vercel.app: bg-slate-950 #020617, text-amber-500 #F59E0B, amber-400 #FBBF24, amber-600 #D97706, Geist sans-serif, border-white/10",
  },
  "lnb-saas": {
    slug: "lnb-saas",
    name: "La Nueva Brasil",
    palette: {
      bg: "#1C1917",
      surface: "#292524",
      raised: "#44403C",
      line: "#44403C",
      text: "#F5F5F4",
      muted: "#B5AEA8",
      accent: "#D97706",
      accentSoft: "#FBBF24",
      accentDeep: "#B45309",
      onAccent: "#1C1917",
    },
    fonts: {
      display: "var(--ff-brand-playfair-display), 'Playfair Display', Georgia, serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-inter), Inter, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/lnb-saas/mark.png",
      wordmark: "/portfolio/brands/lnb-saas/wordmark.png",
      particleMode: "alpha",
    },
    radius: 16,
    texture: "none",
    source: "CSS y DOM servido de lnb-saass.vercel.app: bg-stone-900 #1C1917, text-amber-500 #F59E0B, amber-600 #D97706, Playfair Display + Inter",
  },
  "hub-profesional-ai": {
    slug: "hub-profesional-ai",
    name: "Hub Profesional",
    palette: {
      bg: "#050505",
      surface: "#121212",
      raised: "#1C1C1C",
      line: "#2E2E2E",
      text: "#F5F5F5",
      muted: "#B0B0B0",
      accent: "#FF3B30",
      accentSoft: "#FF6961",
      accentDeep: "#CC2F26",
      onAccent: "#050505",
    },
    fonts: {
      display: "var(--ff-brand-geist), Geist, sans-serif",
      body: "var(--ff-brand-inter), Inter, sans-serif",
      label: "var(--ff-brand-geist), Geist, sans-serif",
    },
    uppercaseDisplay: false,
    logo: {
      mark: "/portfolio/brands/hub-profesional-ai/mark.png",
      wordmark: "/portfolio/brands/hub-profesional-ai/wordmark.png",
      particleMode: "alpha",
    },
    radius: 12,
    texture: "none",
    source: "CSS y DOM servido de profecionalcv.vercel.app: noir #050505, card #121212, accent red #FF3B30, Geist + Inter",
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
