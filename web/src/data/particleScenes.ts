import type { ParticleSceneDefinition, ParticleSceneId } from "@/types/site";
import type { Family } from "./techStack";
import {
  PARTICLE_SCENE_TECH_NAMES,
  resolveParticleSceneName,
} from "./particleSceneConfig";

const TIMING = {
  assembleMs: 1100,
  holdMs: 4200,
  dissolveMs: 900,
} as const;

/* Gemelos "print" de los acentos neón: mismo carácter tonal, densidad de
   tinta legible sobre marfil (ver LIGHT_MODE_DESIGN.md). Los acentos de las
   escenas se declaran en dark; en modo claro se resuelven con este mapa. */
export const PRINT_ACCENT: Record<string, string> = {
  "#F3F0E8": "#14171A",
  "#B68CFF": "#6D43CC",
  "#55D8FF": "#0A7EA4",
  "#71F3A2": "#0E7A46",
};

export function themedAccent(accent: string, theme: "dark" | "light"): string {
  return theme === "light" ? PRINT_ACCENT[accent] ?? accent : accent;
}

export const PARTICLE_SCENES: Record<ParticleSceneId, ParticleSceneDefinition> = {
  identity: {
    id: "identity",
    mode: "sequence",
    techNames: PARTICLE_SCENE_TECH_NAMES.home,
    accent: "#F3F0E8",
    anchor: "hero-right",
    density: 1,
    intensity: 0.92,
    interaction: "repel-attract",
    timing: TIMING,
    fallback: "Tecnología actual formada con puntos marfil.",
  },
  create: {
    id: "create",
    mode: "sequence",
    techNames: PARTICLE_SCENE_TECH_NAMES.create,
    accent: "#B68CFF",
    anchor: "hero-right",
    density: 0.92,
    intensity: 0.86,
    interaction: "repel-attract",
    timing: TIMING,
    fallback: "Tecnología creativa formada con puntos marfil.",
  },
  build: {
    id: "build",
    mode: "sequence",
    techNames: PARTICLE_SCENE_TECH_NAMES.build,
    accent: "#55D8FF",
    anchor: "hero-right",
    density: 1,
    intensity: 0.88,
    interaction: "repel-attract",
    timing: TIMING,
    fallback: "Tecnología de producto formada con puntos marfil.",
  },
  scale: {
    id: "scale",
    mode: "sequence",
    techNames: PARTICLE_SCENE_TECH_NAMES.operations,
    accent: "#71F3A2",
    anchor: "hero-right",
    density: 0.94,
    intensity: 0.86,
    interaction: "repel-attract",
    timing: TIMING,
    fallback: "Tecnología operativa formada con puntos marfil.",
  },
  crm: {
    id: "crm",
    mode: "sequence",
    techNames: PARTICLE_SCENE_TECH_NAMES.systems,
    accent: "#71F3A2",
    anchor: "hero-right",
    density: 0.78,
    intensity: 0.58,
    interaction: "ambient",
    timing: TIMING,
    fallback: "Tecnología operativa formada con puntos marfil.",
  },
  case: {
    id: "case",
    mode: "ambient",
    techNames: [],
    accent: "#55D8FF",
    anchor: "ambient",
    density: 0.55,
    intensity: 0.32,
    interaction: "ambient",
    timing: TIMING,
    fallback: "Campo ambiental de puntos marfil.",
  },
};

export function resolveParticleScene(pathnameOrId = "/", activeFamilies: Family[] = []): ParticleSceneDefinition {
  if (pathnameOrId in PARTICLE_SCENES) {
    return PARTICLE_SCENES[pathnameOrId as ParticleSceneId];
  }

  const sceneName = resolveParticleSceneName(pathnameOrId, activeFamilies);
  if (sceneName === "create") return PARTICLE_SCENES.create;
  if (sceneName === "build") return PARTICLE_SCENES.build;
  if (sceneName === "operations") return PARTICLE_SCENES.scale;
  if (sceneName === "systems") return PARTICLE_SCENES.crm;
  if (sceneName === "studio") {
    return {
      ...PARTICLE_SCENES.create,
      mode: "sequence",
      techNames: PARTICLE_SCENE_TECH_NAMES.studio,
      intensity: 0.58,
    };
  }
  if (sceneName === "cases" || sceneName === "apply") return PARTICLE_SCENES.case;
  return PARTICLE_SCENES.identity;
}
