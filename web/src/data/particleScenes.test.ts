import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
    PARTICLE_SCENE_LIMITS,
    PARTICLE_SCENE_TECH_NAMES,
    resolveParticleSceneName,
    resolveParticleSceneTechNames,
} from './particleSceneConfig';
import { resolveParticleScene } from './particleScenes';
import type { Family } from './techStack';

describe('particle scene resolver', () => {
    test('returns distinct curated scenes for the main routes', () => {
        const home = resolveParticleSceneName('/', []);
        const studio = resolveParticleSceneName('/estudio', ['Web', 'Marketing']);
        const systems = resolveParticleSceneName('/sistemas', ['CRM', 'Automation', 'Backend', 'AI']);
        const cases = resolveParticleSceneName('/casos-de-exito', ['Web', 'AI', 'CRM']);

        assert.equal(new Set([home, studio, systems, cases]).size, 4);
        assert.notDeepEqual(PARTICLE_SCENE_TECH_NAMES.home, PARTICLE_SCENE_TECH_NAMES.studio);
        assert.notDeepEqual(PARTICLE_SCENE_TECH_NAMES.studio, PARTICLE_SCENE_TECH_NAMES.systems);
    });

    test('section families override the route scene deterministically', () => {
        const first = resolveParticleSceneName('/', ['Automation', 'AI', 'CRM']);
        const reordered = resolveParticleSceneName('/', ['CRM', 'Automation', 'AI']);

        assert.equal(first, 'operations');
        assert.equal(reordered, first);
    });

    test('respects desktop/mobile limits and never duplicates logos', () => {
        for (const isMobile of [false, true]) {
            const names = resolveParticleSceneTechNames('/', [], isMobile);
            const limit = isMobile ? PARTICLE_SCENE_LIMITS.mobile : PARTICLE_SCENE_LIMITS.desktop;

            assert.ok(names.length <= limit);
            assert.equal(new Set(names).size, names.length);
        }

        for (const names of Object.values(PARTICLE_SCENE_TECH_NAMES)) {
            assert.ok(names.length <= PARTICLE_SCENE_LIMITS.desktop);
            assert.equal(new Set(names).size, names.length);
            assert.ok(names.every((name) => name.length > 0));
        }
    });

    test('hero tracks resolve to their dedicated scenes', () => {
        const crear: Family[] = ['Media'];
        const construir: Family[] = ['Web', 'Backend', 'AI'];
        const escalar: Family[] = ['Automation', 'CRM', 'AI'];

        assert.equal(resolveParticleSceneName('/', crear), 'create');
        assert.equal(resolveParticleSceneName('/', construir), 'build');
        assert.equal(resolveParticleSceneName('/', escalar), 'operations');
    });

    test('every scene name maps to a real tech with an icon or fallback', () => {
        for (const families of [['Media'], ['Web', 'Backend', 'AI']] as Family[][]) {
            const names = resolveParticleSceneTechNames('/', families);
            const scene = resolveParticleScene('/', families);
            assert.equal(scene.techs.length, names.length);
        }
    });
});
