import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
    PARTICLE_SCENE_LIMITS,
    PARTICLE_SCENE_TECH_NAMES,
    resolveParticleSceneName,
    resolveParticleSceneTechNames,
} from './particleSceneConfig';
import { resolveParticleScene } from './particleScenes';
import { TECH_STACK, type Family } from './techStack';

describe('particle scene resolver', () => {
    test('uses the approved editorial sequence for every protagonist scene', () => {
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.home, [
            'Figma',
            'Next.js',
            'Three.js',
            'Multi-model AI',
            'n8n',
            'Stripe',
        ]);
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.create, [
            'Figma',
            'Three.js',
            'Blender',
            'After Effects',
            'DaVinci Resolve',
        ]);
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.build, [
            'Next.js',
            'Multi-model AI',
            'TypeScript',
            'PostgreSQL',
            'Supabase',
            'Vercel',
        ]);
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.operations, [
            'n8n',
            'Multi-model AI',
            'HubSpot',
            'Stripe',
            'Shopify',
            'Google Analytics',
        ]);
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.studio, ['Figma']);
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.systems, ['n8n']);
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.cases, []);
        assert.deepEqual(PARTICLE_SCENE_TECH_NAMES.apply, []);
    });

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
        assert.deepEqual(resolveParticleSceneTechNames('/', [], true), [
            'Figma',
            'Next.js',
            'Three.js',
            'Multi-model AI',
            'n8n',
        ]);
        assert.deepEqual(resolveParticleSceneTechNames('/', [], false), PARTICLE_SCENE_TECH_NAMES.home);

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

    test('every configured scene name maps to a real tech with an icon or fallback', () => {
        const availableTech = new Map(TECH_STACK.map((tech) => [tech.name, tech]));
        for (const names of Object.values(PARTICLE_SCENE_TECH_NAMES)) {
            assert.ok(names.every((name) => availableTech.has(name)));
            assert.ok(names.every((name) => {
                const tech = availableTech.get(name);
                return Boolean(tech?.Icon || tech?.fallback);
            }));
        }

        for (const families of [['Media'], ['Web', 'Backend', 'AI']] as Family[][]) {
            const names = resolveParticleSceneTechNames('/', families);
            const scene = resolveParticleScene('/', families);
            assert.deepEqual(scene.techNames, names);
        }
    });

    test('keeps Next.js visible without featuring individual AI or messaging vendors', () => {
        const protagonistNames = new Set<string>([
            ...PARTICLE_SCENE_TECH_NAMES.home,
            ...PARTICLE_SCENE_TECH_NAMES.create,
            ...PARTICLE_SCENE_TECH_NAMES.build,
            ...PARTICLE_SCENE_TECH_NAMES.operations,
        ]);

        assert.ok(protagonistNames.has('Next.js'));
        assert.ok(!protagonistNames.has('OpenAI'));
        assert.ok(!protagonistNames.has('WhatsApp API'));
    });

    test('localizes the neutral AI mark and all home territory descriptors', () => {
        const multimodel = TECH_STACK.find((tech) => tech.name === 'Multi-model AI');
        assert.deepEqual(multimodel?.label, { es: 'IA multimodelo', en: 'Multi-model AI' });
        assert.deepEqual(multimodel?.descriptor, {
            es: 'Inteligencia aplicada',
            en: 'Applied intelligence',
        });

        const expectedDescriptors = {
            Figma: { es: 'Dirección visual', en: 'Visual direction' },
            'Next.js': { es: 'Producto digital', en: 'Digital product' },
            'Three.js': { es: 'Experiencias interactivas', en: 'Interactive experiences' },
            n8n: { es: 'Sistemas y automatización', en: 'Systems and automation' },
            Stripe: { es: 'Comercio y monetización', en: 'Commerce and monetization' },
        } as const;

        for (const [name, descriptor] of Object.entries(expectedDescriptors)) {
            assert.deepEqual(TECH_STACK.find((tech) => tech.name === name)?.descriptor, descriptor);
        }
    });
});
