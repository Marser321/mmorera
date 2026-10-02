export interface SpringPhysicsPreset {
  id: "magnetic" | "fluid" | "hyper";
  name: {
    es: string;
    en: string;
  };
  subtitle: {
    es: string;
    en: string;
  };
  stiffness: number;
  damping: number;
  mass: number;
  glowColor: string;
  character: {
    es: string;
    en: string;
  };
}

export const SPRING_PRESETS: SpringPhysicsPreset[] = [
  {
    id: "magnetic",
    name: {
      es: "Deep Space Magnético",
      en: "Deep Space Magnetic",
    },
    subtitle: {
      es: "Táctil, controlado y de alta gama",
      en: "Tactile, restrained & high-end",
    },
    stiffness: 420,
    damping: 28,
    mass: 1.0,
    glowColor: "#71F3A2",
    character: {
      es: "Ideal para botones principales, menús en órbita y selectores de alta fidelidad.",
      en: "Perfect for hero buttons, orbital dial menus, and high-fidelity selectors.",
    },
  },
  {
    id: "fluid",
    name: {
      es: "Cristal Líquido & Resorte",
      en: "Liquid Glass & Bounce",
    },
    subtitle: {
      es: "Orgánico, elástico y expansivo",
      en: "Organic, elastic & expressive",
    },
    stiffness: 250,
    damping: 15,
    mass: 1.2,
    glowColor: "#55D8FF",
    character: {
      es: "Diseñado para modales cinematográficos, tarjetas bento y transiciones de marca.",
      en: "Designed for cinematic modals, bento cards, and branded transition layers.",
    },
  },
  {
    id: "hyper",
    name: {
      es: "Precisión Snappy Sub-frame",
      en: "Snappy Sub-frame Precision",
    },
    subtitle: {
      es: "Ultra-rápido, seco y milimétrico",
      en: "Ultra-fast, crisp & surgical",
    },
    stiffness: 650,
    damping: 38,
    mass: 0.7,
    glowColor: "#B68CFF",
    character: {
      es: "Optimizado para telemetría en vivo, filtros de datos e interfaces SaaS de alta densidad.",
      en: "Optimized for live telemetry, data filters, and high-density SaaS views.",
    },
  },
];

export interface KineticPhysicsParams {
  stiffness: number;
  damping: number;
  mass: number;
  glowIntensity: number; // 0.0 - 1.0
}

export function clampKineticParams(params: Partial<KineticPhysicsParams>): KineticPhysicsParams {
  return {
    stiffness: Math.max(80, Math.min(800, params.stiffness ?? 420)),
    damping: Math.max(8, Math.min(60, params.damping ?? 28)),
    mass: Math.max(0.3, Math.min(3.0, params.mass ?? 1.0)),
    glowIntensity: Math.max(0, Math.min(1, params.glowIntensity ?? 0.6)),
  };
}

export function generateMotionCodeSnippet(params: KineticPhysicsParams, color: string): string {
  return `// Framer Motion Spring Config (Mario Morera Studio)
const springTransition = {
  type: "spring",
  stiffness: ${params.stiffness},
  damping: ${params.damping},
  mass: ${params.mass.toFixed(1)},
};

<motion.div
  whileHover={{ scale: 1.05, y: -4 }}
  whileTap={{ scale: 0.96 }}
  transition={springTransition}
  className="rounded-2xl border border-[${color}]/30 backdrop-blur-xl"
/>`;
}
