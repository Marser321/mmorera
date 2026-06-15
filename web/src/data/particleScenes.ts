import { TECH_STACK, type Family, type Tech } from './techStack';
import {
    resolveParticleSceneName,
    resolveParticleSceneTechNames,
} from './particleSceneConfig';

export interface ParticleScene {
    id: string;
    families: Family[];
    techs: Tech[];
}

const TECH_BY_NAME = new Map(TECH_STACK.map((tech) => [tech.name, tech]));

function sceneTechs(names: readonly string[]): Tech[] {
    const unique = new Set<string>();

    return names
        .map((name) => TECH_BY_NAME.get(name))
        .filter((tech): tech is Tech => {
            if (!tech || (!tech.Icon && !tech.fallback) || unique.has(tech.name)) return false;
            unique.add(tech.name);
            return true;
        });
}

/**
 * Convierte ruta + familias activas en una escena estable. Las familias de una
 * sección tienen prioridad; si no hay una escena específica se usa la ruta.
 */
export function resolveParticleScene(
    pathname: string,
    activeFamilies: Family[],
    isMobile = false,
): ParticleScene {
    const sceneName = resolveParticleSceneName(pathname, activeFamilies);
    const techNames = resolveParticleSceneTechNames(pathname, activeFamilies, isMobile);

    return {
        id: `${sceneName}-${isMobile ? 'mobile' : 'desktop'}`,
        families: [...activeFamilies],
        techs: sceneTechs(techNames),
    };
}
