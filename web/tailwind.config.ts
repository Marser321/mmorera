import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

/* Las variables `--color-*` guardan colores completos (hex/oklch), no canales
   sueltos, así que Tailwind no puede inyectarles un canal alfa por sí solo:
   sin esto, `bg-card/74` o `text-foreground/48` no generaban ninguna regla y
   el elemento quedaba a opacidad plena (o directamente sin fondo).
   Con el color como función interceptamos el modificador y mezclamos. */
type ColorFn = (options?: { opacityValue?: string | number; opacityVariable?: string }) => string;

const withAlpha =
  (name: string): ColorFn =>
    ({ opacityValue } = {}) => {
      const value = `var(--color-${name})`;
      if (opacityValue === undefined || opacityValue === null) return value;
      // Sin modificador Tailwind pasa `var(--tw-*-opacity)`: el color va tal cual.
      const raw = String(opacityValue);
      if (raw.includes("var(--tw-")) return value;
      const ratio = Number(raw);
      const amount = Number.isFinite(ratio)
        ? `${Number((ratio * 100).toFixed(4))}%`
        : `calc(${raw} * 100%)`;
      return `color-mix(in srgb, ${value} ${amount}, transparent)`;
    };

// Tailwind acepta colores como función en runtime, pero sus tipos de v3 solo
// modelan strings: el cast es por el tipado, no por el comportamiento.
const color = (name: string) => withAlpha(name) as unknown as string;

/* El sitio está escrito dark-first: lo no prefijado ES el modo oscuro.
   `light:` es la variante para el gemelo "Master Print" (ver LIGHT_MODE_DESIGN.md). */
const lightVariant = plugin(({ addVariant }) => {
  addVariant("light", "html.light &");
});

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: color("background"),
        foreground: color("foreground"),
        card: { DEFAULT: color("card"), foreground: color("card-foreground") },
        popover: { DEFAULT: color("popover"), foreground: color("popover-foreground") },
        primary: { DEFAULT: color("primary"), foreground: color("primary-foreground") },
        secondary: { DEFAULT: color("secondary"), foreground: color("secondary-foreground") },
        muted: { DEFAULT: color("muted"), foreground: color("muted-foreground") },
        accent: { DEFAULT: color("accent"), foreground: color("accent-foreground") },
        signal: { DEFAULT: color("signal"), foreground: color("signal-foreground") },
        destructive: { DEFAULT: color("destructive"), foreground: color("destructive-foreground") },
        border: color("border"),
        ring: color("ring"),
        input: color("input"),
        "track-create": color("track-create"),
        "track-build": color("track-build"),
        "track-scale": color("track-scale"),
      },
      fontFamily: {
        sans: ["var(--ff-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--ff-display)", "var(--ff-body)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--ff-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, step) => [step, String(step / 100)]),
      ),
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [animate, lightVariant],
};

export default config;
