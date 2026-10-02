export interface ColorThemePreset {
  id: string;
  name: { es: string; en: string };
  tag: { es: string; en: string };
  accentColor: string;
  secondaryColor: string;
  surfaceColor: string;
  glowColor: string;
  description: { es: string; en: string };
}

export interface RadiusPreset {
  id: "sharp" | "modern" | "squircle";
  name: { es: string; en: string };
  px: number;
  tailwindClass: string;
}

export interface GlassPreset {
  id: "minimal" | "frosted" | "hyperglow";
  name: { es: string; en: string };
  blurPx: number;
  bgOpacity: number;
  borderOpacity: number;
}

export const COLOR_THEMES: ColorThemePreset[] = [
  {
    id: "signal-neo",
    name: { es: "Signal Neo-Terminal", en: "Signal Neo-Terminal" },
    tag: { es: "Firma Mario Morera", en: "Mario Morera Signature" },
    accentColor: "#71F3A2",
    secondaryColor: "#55D8FF",
    surfaceColor: "#0D1117",
    glowColor: "rgba(113, 243, 162, 0.25)",
    description: {
      es: "Verde señal de alta precisión sobre paleta oscura Deep Space con acentos cian.",
      en: "High-precision signal green over Deep Space dark palette with cyan accents.",
    },
  },
  {
    id: "obsidian-violet",
    name: { es: "Obsidian & Cyber Violet", en: "Obsidian & Cyber Violet" },
    tag: { es: "Lujo & Creatividad", en: "Luxury & Creative Tech" },
    accentColor: "#B68CFF",
    secondaryColor: "#FF79C6",
    surfaceColor: "#0A0813",
    glowColor: "rgba(182, 140, 255, 0.28)",
    description: {
      es: "Tonos violáceos profundos y magenta para marcas de software de alta gama.",
      en: "Deep violet and magenta hues tailored for premium software and AI brands.",
    },
  },
  {
    id: "solar-amber",
    name: { es: "Solar Kinetic & Amber", en: "Solar Kinetic & Amber" },
    tag: { es: "Energía & Conversión", en: "High Energy & Conversion" },
    accentColor: "#FFB86C",
    secondaryColor: "#FF5555",
    surfaceColor: "#0E0D0A",
    glowColor: "rgba(255, 184, 108, 0.25)",
    description: {
      es: "Ámbar solar cálido con acentos coral de alta tracción y urgencia visual.",
      en: "Warm solar amber with coral accents engineered for visual traction.",
    },
  },
  {
    id: "monochrome-titanium",
    name: { es: "Titanium & Cold Silver", en: "Titanium & Cold Silver" },
    tag: { es: "Minimalismo Suizo", en: "Swiss Precision" },
    accentColor: "#E6EDF3",
    secondaryColor: "#7D8590",
    surfaceColor: "#0C0D10",
    glowColor: "rgba(230, 237, 243, 0.20)",
    description: {
      es: "Monocromo sobrio de alto contraste inspirado en Dieter Rams y diseño editorial suizo.",
      en: "High-contrast monochrome inspired by Dieter Rams and Swiss editorial design.",
    },
  },
];

export const RADIUS_PRESETS: RadiusPreset[] = [
  {
    id: "sharp",
    name: { es: "Brutalista / Sharp (0px)", en: "Brutalist / Sharp (0px)" },
    px: 0,
    tailwindClass: "rounded-none",
  },
  {
    id: "modern",
    name: { es: "Ingeniería Moderna (12px)", en: "Engineered Modern (12px)" },
    px: 12,
    tailwindClass: "rounded-xl",
  },
  {
    id: "squircle",
    name: { es: "Squircle Orgánico (24px)", en: "Organic Squircle (24px)" },
    px: 24,
    tailwindClass: "rounded-3xl",
  },
];

export const GLASS_PRESETS: GlassPreset[] = [
  {
    id: "minimal",
    name: { es: "Sólido Mate", en: "Matte Solid" },
    blurPx: 0,
    bgOpacity: 0.95,
    borderOpacity: 0.1,
  },
  {
    id: "frosted",
    name: { es: "Glassmorphism Suave", en: "Frosted Glass" },
    blurPx: 16,
    bgOpacity: 0.5,
    borderOpacity: 0.15,
  },
  {
    id: "hyperglow",
    name: { es: "Hyperglow Neón", en: "Hyperglow Neon" },
    blurPx: 28,
    bgOpacity: 0.35,
    borderOpacity: 0.35,
  },
];

export function generateTailwindConfigSnippet(
  theme: ColorThemePreset,
  radius: RadiusPreset,
  glass: GlassPreset
): string {
  return `// tailwind.config.ts — Generado por MMORERA Design Token Studio
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          accent: '${theme.accentColor}',
          secondary: '${theme.secondaryColor}',
          surface: '${theme.surfaceColor}',
        },
      },
      borderRadius: {
        custom: '${radius.px}px',
      },
      backdropBlur: {
        custom: '${glass.blurPx}px',
      },
      boxShadow: {
        glow: '0 0 32px ${theme.glowColor}',
      },
    },
  },
};`;
}

export function generateCssVariablesSnippet(
  theme: ColorThemePreset,
  radius: RadiusPreset,
  glass: GlassPreset
): string {
  return `:root {
  --brand-accent: ${theme.accentColor};
  --brand-secondary: ${theme.secondaryColor};
  --brand-surface: ${theme.surfaceColor};
  --brand-glow: ${theme.glowColor};
  --radius-custom: ${radius.px}px;
  --glass-blur: ${glass.blurPx}px;
  --glass-opacity: ${glass.bgOpacity};
}`;
}
