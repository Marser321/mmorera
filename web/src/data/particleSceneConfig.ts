import type { Family } from './techStack';

export const PARTICLE_SCENE_LIMITS = {
    desktop: 12,
    mobile: 7,
} as const;

export const PARTICLE_SCENE_TECH_NAMES = {
    home: [
        'OpenAI', 'n8n', 'React', 'GoHighLevel', 'Supabase', 'Shopify',
        'Google Analytics', 'Stripe', 'Anthropic', 'HubSpot', 'Next.js', 'WhatsApp API',
    ],
    studio: [
        'React', 'Google Analytics', 'Next.js', 'Google Ads', 'Framer', 'Webflow',
        'TypeScript', 'WordPress', 'Astro', 'Vercel', 'JavaScript', 'HTML5',
    ],
    systems: [
        'GoHighLevel', 'n8n', 'OpenAI', 'Supabase', 'WhatsApp API', 'PostgreSQL',
        'HubSpot', 'Make', 'Anthropic', 'Node.js', 'Salesforce', 'Zapier',
    ],
    cases: [
        'React', 'OpenAI', 'GoHighLevel', 'Next.js', 'Anthropic', 'HubSpot',
        'TypeScript', 'Google Gemini', 'Salesforce', 'Vercel', 'Pipedrive', 'Meta',
    ],
    operations: [
        'n8n', 'OpenAI', 'GoHighLevel', 'WhatsApp API', 'Anthropic', 'HubSpot',
        'Make', 'Google Gemini', 'Salesforce', 'Zapier', 'Meta', 'Pipedrive',
    ],
    apply: [
        'GoHighLevel', 'WhatsApp API', 'OpenAI', 'HubSpot', 'n8n', 'React',
        'Google Analytics', 'Supabase', 'Stripe', 'Make', 'Next.js', 'Anthropic',
    ],
    create: [
        'DaVinci Resolve', 'After Effects', 'Premiere Pro', 'Blender',
        'Figma', 'Photoshop', 'Illustrator', 'Audition',
    ],
    build: [
        'React', 'Next.js', 'TypeScript', 'Supabase', 'Node.js', 'OpenAI',
        'Anthropic', 'Vercel', 'JavaScript', 'PostgreSQL', 'Framer', 'HTML5',
    ],
} as const;

export type ParticleSceneName = keyof typeof PARTICLE_SCENE_TECH_NAMES;

const FAMILY_ORDER: Family[] = [
    'AI', 'Automation', 'Backend', 'Web', 'Commerce', 'Marketing', 'CRM', 'Media',
];

const ROUTE_SCENES: Record<string, ParticleSceneName> = {
    '/': 'home',
    '/estudio': 'studio',
    '/sistemas': 'systems',
    '/casos-de-exito': 'cases',
    '/aplicar': 'apply',
};

const SECTION_SCENES: Record<string, ParticleSceneName> = {
    'AI,Automation,CRM': 'operations',
    'Web,Marketing': 'studio',
    'AI,Automation,Backend,CRM': 'systems',
    'AI,Web,CRM': 'cases',
    // Tracks del hero: crear → create, construir → build (escalar reusa operations).
    'Media': 'create',
    'AI,Backend,Web': 'build',
};

function normalizedFamilyKey(families: Family[]): string {
    return FAMILY_ORDER.filter((family) => families.includes(family)).join(',');
}

export function resolveParticleSceneName(pathname: string, activeFamilies: Family[]): ParticleSceneName {
    return SECTION_SCENES[normalizedFamilyKey(activeFamilies)] ?? ROUTE_SCENES[pathname] ?? 'home';
}

export function resolveParticleSceneTechNames(
    pathname: string,
    activeFamilies: Family[],
    isMobile = false,
): readonly string[] {
    const sceneName = resolveParticleSceneName(pathname, activeFamilies);
    const limit = isMobile ? PARTICLE_SCENE_LIMITS.mobile : PARTICLE_SCENE_LIMITS.desktop;
    return PARTICLE_SCENE_TECH_NAMES[sceneName].slice(0, limit);
}
