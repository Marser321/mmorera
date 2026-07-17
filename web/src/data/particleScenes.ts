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
    mode: "locked",
    techNames: PARTICLE_SCENE_TECH_NAMES.systems,
    accent: "#71F3A2",
    anchor: "hero-right",
    density: 0.78,
    intensity: 0.58,
    interaction: "ambient",
    timing: TIMING,
    fallback: "n8n formado con puntos marfil.",
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
      mode: "locked",
      techNames: PARTICLE_SCENE_TECH_NAMES.studio,
      intensity: 0.58,
    };
  }
  if (sceneName === "cases" || sceneName === "apply") return PARTICLE_SCENES.case;
  return PARTICLE_SCENES.identity;
}
