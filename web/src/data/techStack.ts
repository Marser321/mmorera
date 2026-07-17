import type { IconType } from 'react-icons';
import { MultiModelAiMark } from '@/components/icons/MultiModelAiMark';
import {
    SiAnthropic,
    SiAstro,
    SiBlender,
    SiDavinciresolve,
    SiFigma,
    SiFramer,
    SiGoogleads,
    SiGoogleanalytics,
    SiGooglegemini,
    SiHtml5,
    SiHubspot,
    SiJavascript,
    SiMake,
    SiMeta,
    SiN8N,
    SiNextdotjs,
    SiNodedotjs,
    SiOpenai,
    SiPostgresql,
    SiReact,
    SiSalesforce,
    SiShopify,
    SiStripe,
    SiSupabase,
    SiThreedotjs,
    SiTypescript,
    SiVercel,
    SiVite,
    SiWebflow,
    SiWhatsapp,
    SiWoocommerce,
    SiWordpress,
    SiX,
    SiZapier,
    SiZoho,
} from 'react-icons/si';

/**
 * Fuente única del stack tecnológico. La usan tanto la tira de logos
 * (`TrustedByStrip`) como el campo de partículas (`TechParticleField`),
 * que agrupa las partículas en "enjambres" de color por familia.
 */

export type Family =
    | 'AI'
    | 'Automation'
    | 'Backend'
    | 'Web'
    | 'Commerce'
    | 'Marketing'
    | 'CRM'
    | 'Media';

export interface Tech {
    name: string;
    category: Family;
    Icon?: IconType;
    fallback?: string;
    label?: LocalizedTechCopy;
    descriptor?: LocalizedTechCopy;
}

export interface LocalizedTechCopy {
    es: string;
    en: string;
}

export interface FamilyMeta {
    id: Family;
    /** Etiqueta legible (es). */
    label: string;
    /** Color del enjambre (hex), coherente con la paleta Deep Space. */
    color: string;
}

// Orden fijo → cada familia tiene un índice estable (0–6) para los shaders.
export const FAMILIES: FamilyMeta[] = [
    { id: 'AI', label: 'IA', color: '#a78bfa' },
    { id: 'Automation', label: 'Automatización', color: '#2ec8d8' },
    { id: 'Backend', label: 'Backend', color: '#38bdf8' },
    { id: 'Web', label: 'Web', color: '#93e83a' },
    { id: 'Commerce', label: 'Commerce', color: '#f472b6' },
    { id: 'Marketing', label: 'Marketing', color: '#fb923c' },
    { id: 'CRM', label: 'CRM', color: '#fbbf24' },
    { id: 'Media', label: 'Audiovisual', color: '#e879f9' },
];

export const FAMILY_ORDER: Family[] = FAMILIES.map((f) => f.id);

export const familyIndex = (f: Family): number => FAMILY_ORDER.indexOf(f);

export const TECH_STACK: Tech[] = [
    // AI
    {
        name: 'Multi-model AI',
        category: 'AI',
        Icon: MultiModelAiMark,
        label: { es: 'IA multimodelo', en: 'Multi-model AI' },
        descriptor: { es: 'Inteligencia aplicada', en: 'Applied intelligence' },
    },
    { name: 'OpenAI', category: 'AI', Icon: SiOpenai },
    { name: 'Anthropic', category: 'AI', Icon: SiAnthropic },
    { name: 'Google Gemini', category: 'AI', Icon: SiGooglegemini },
    { name: 'Grok / xAI', category: 'AI', Icon: SiX },
    { name: 'Meta', category: 'AI', Icon: SiMeta },
    // Automation
    {
        name: 'n8n',
        category: 'Automation',
        Icon: SiN8N,
        descriptor: { es: 'Sistemas y automatización', en: 'Systems and automation' },
    },
    { name: 'Make', category: 'Automation', Icon: SiMake },
    { name: 'Zapier', category: 'Automation', Icon: SiZapier },
    { name: 'WhatsApp API', category: 'Automation', Icon: SiWhatsapp },
    // Backend
    { name: 'Supabase', category: 'Backend', Icon: SiSupabase },
    { name: 'PostgreSQL', category: 'Backend', Icon: SiPostgresql },
    { name: 'Node.js', category: 'Backend', Icon: SiNodedotjs },
    // Web
    {
        name: 'Next.js',
        category: 'Web',
        Icon: SiNextdotjs,
        descriptor: { es: 'Producto digital', en: 'Digital product' },
    },
    {
        name: 'Three.js',
        category: 'Web',
        Icon: SiThreedotjs,
        descriptor: { es: 'Experiencias interactivas', en: 'Interactive experiences' },
    },
    { name: 'React', category: 'Web', Icon: SiReact },
    { name: 'TypeScript', category: 'Web', Icon: SiTypescript },
    { name: 'JavaScript', category: 'Web', Icon: SiJavascript },
    { name: 'HTML5', category: 'Web', Icon: SiHtml5 },
    { name: 'Vite', category: 'Web', Icon: SiVite },
    { name: 'Astro', category: 'Web', Icon: SiAstro },
    { name: 'WordPress', category: 'Web', Icon: SiWordpress },
    { name: 'Webflow', category: 'Web', Icon: SiWebflow },
    { name: 'Framer', category: 'Web', Icon: SiFramer },
    { name: 'Vercel', category: 'Web', Icon: SiVercel },
    // Commerce
    { name: 'Shopify', category: 'Commerce', Icon: SiShopify },
    { name: 'WooCommerce', category: 'Commerce', Icon: SiWoocommerce },
    {
        name: 'Stripe',
        category: 'Commerce',
        Icon: SiStripe,
        descriptor: { es: 'Comercio y monetización', en: 'Commerce and monetization' },
    },
    // Marketing
    { name: 'Google Ads', category: 'Marketing', Icon: SiGoogleads },
    { name: 'Google Analytics', category: 'Marketing', Icon: SiGoogleanalytics },
    // CRM
    { name: 'HubSpot', category: 'CRM', Icon: SiHubspot },
    { name: 'Salesforce', category: 'CRM', Icon: SiSalesforce },
    { name: 'Zoho CRM', category: 'CRM', Icon: SiZoho },
    { name: 'GoHighLevel', category: 'CRM', fallback: 'GHL' },
    { name: 'Pipedrive', category: 'CRM', fallback: 'PD' },
    // Media (audiovisual) — logos reales donde existen; etiqueta de texto para el resto.
    { name: 'DaVinci Resolve', category: 'Media', Icon: SiDavinciresolve },
    { name: 'Blender', category: 'Media', Icon: SiBlender },
    {
        name: 'Figma',
        category: 'Media',
        Icon: SiFigma,
        descriptor: { es: 'Dirección visual', en: 'Visual direction' },
    },
    { name: 'Premiere Pro', category: 'Media', fallback: 'Pr' },
    { name: 'After Effects', category: 'Media', fallback: 'Ae' },
    { name: 'Photoshop', category: 'Media', fallback: 'Ps' },
    { name: 'Illustrator', category: 'Media', fallback: 'Il' },
    { name: 'Audition', category: 'Media', fallback: 'Au' },
];

/** Techs de una o varias familias, conservando el orden de TECH_STACK. */
export const techByFamilies = (families: Family[]): Tech[] =>
    TECH_STACK.filter((t) => families.includes(t.category));

/** Cantidad de techs por familia → pesa el tamaño de cada enjambre. */
export const familyCounts = (): Record<Family, number> => {
    const counts = Object.fromEntries(FAMILY_ORDER.map((f) => [f, 0])) as Record<Family, number>;
    for (const t of TECH_STACK) counts[t.category] += 1;
    return counts;
};

/**
 * Familias que se resaltan por ruta (default del scroll-aware). Un set vacío
 * significa "todas parejas" (sin sección que domine).
 */
export const ROUTE_FAMILIES: Record<string, Family[]> = {
    '/': [],
    '/estudio': ['Web', 'Marketing'],
    '/sistemas': ['CRM', 'Automation', 'Backend', 'AI'],
    '/casos-de-exito': ['Web', 'AI', 'CRM'],
    '/aplicar': [],
};
