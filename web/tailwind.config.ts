import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const color = (name: string) => `var(--color-${name})`;

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
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "conic-spin": "conic-spin 8s linear infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
