/**
 * Definición data-driven del "cruce" diseño/software.
 * Mapea cada track a su ruta, acentos visuales, pilares de servicio (services.ts)
 * y categorías de portfolio (para el filtro de casos-de-exito).
 */

export type TrackId = 'design' | 'software';

export type Pilar = 'media' | 'tech' | 'ops';

export interface TrackDef {
    id: TrackId;
    route: string;
    label: { es: string; en: string };
    tagline: { es: string; en: string };
    /** Clases Tailwind para el acento del track. */
    accentText: string;
    accentFrom: string;
    accentTo: string;
    /** Pilares de services.ts que pertenecen a este track (tech es el puente). */
    pilares: Pilar[];
    /** Categorías de portfolio que se muestran primero en este track. */
    categories: string[];
}

export const TRACKS: Record<TrackId, TrackDef> = {
    design: {
        id: 'design',
        route: '/estudio',
        label: { es: 'Diseño', en: 'Design' },
        tagline: {
            es: 'Video, motion, identidad y web premium',
            en: 'Video, motion, identity & premium web',
        },
        accentText: 'text-violet-300',
        accentFrom: 'from-violet-400',
        accentTo: 'to-cyan-400',
        pilares: ['media', 'tech'],
        categories: ['Creative Tech', 'UX Design', 'Conversion Design', 'Motion Design', 'Interactive Web', 'Showcase Web', 'UX/UI Design', 'Visual Hierarchy', 'Asset Optimization', 'Web Platforms'],
    },
    software: {
        id: 'software',
        route: '/sistemas',
        label: { es: 'Software', en: 'Software' },
        tagline: {
            es: 'CRM, automatización y apps a medida',
            en: 'CRM, automation & custom apps',
        },
        accentText: 'text-emerald-300',
        accentFrom: 'from-emerald-400',
        accentTo: 'to-cyan-400',
        pilares: ['tech', 'ops'],
        categories: ['SaaS Dashboard', 'Data Systems', 'Admin Panel', 'AI & Automation', 'UX Optimization', 'LinkedIn Tools', 'WhatsApp Automation', 'Operations', 'Stripe Payment', 'E-commerce', 'Inventory Control', 'SaaS App', 'Automation', 'Client Portal', 'Stripe Integration'],
    },
};

export const TRACK_IDS: TrackId[] = ['design', 'software'];

export function isTrackId(value: unknown): value is TrackId {
    return value === 'design' || value === 'software';
}
