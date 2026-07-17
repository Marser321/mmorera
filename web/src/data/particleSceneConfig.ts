import type { Family } from "./techStack";

export const PARTICLE_SCENE_LIMITS = {
  desktop: 6,
  mobile: 5,
} as const;

export const PARTICLE_SCENE_TECH_NAMES = {
  home: ["Figma", "Next.js", "Three.js", "Multi-model AI", "n8n", "Stripe"],
  create: ["Figma", "Three.js", "Blender", "After Effects", "DaVinci Resolve"],
  build: ["Next.js", "Multi-model AI", "TypeScript", "PostgreSQL", "Supabase", "Vercel"],
  operations: ["n8n", "Multi-model AI", "HubSpot", "Stripe", "Shopify", "Google Analytics"],
  studio: ["Figma"],
  systems: ["n8n"],
  cases: [],
  apply: [],
} as const;

export type ParticleSceneName = keyof typeof PARTICLE_SCENE_TECH_NAMES;

function hasAny(families: Family[], expected: Family[]): boolean {
  return expected.some((family) => families.includes(family));
}

export function resolveParticleSceneName(pathname: string, activeFamilies: Family[]): ParticleSceneName {
  const normalized = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

  if (normalized === "/") {
    if (hasAny(activeFamilies, ["Media", "Marketing"])) return "create";
    if (hasAny(activeFamilies, ["CRM", "Automation"])) return "operations";
    if (hasAny(activeFamilies, ["Web", "Backend", "AI"])) return "build";
    return "home";
  }
  if (normalized.startsWith("/estudio")) return "studio";
  if (normalized.startsWith("/sistemas")) return "systems";
  if (normalized.startsWith("/casos-de-exito")) return "cases";
  if (normalized.startsWith("/aplicar")) return "apply";
  return "home";
}

export function resolveParticleSceneTechNames(
  pathname: string,
  activeFamilies: Family[],
  isMobile = false,
): readonly string[] {
  const names = PARTICLE_SCENE_TECH_NAMES[resolveParticleSceneName(pathname, activeFamilies)];
  return names.slice(0, isMobile ? PARTICLE_SCENE_LIMITS.mobile : PARTICLE_SCENE_LIMITS.desktop);
}
