import {
    Clapperboard,
    Code2,
    Database,
    Megaphone,
    Server,
    ShoppingBag,
    Sparkles,
    Users,
    Workflow,
    type LucideIcon,
} from 'lucide-react';
import { FAMILIES, techByFamilies, type Family, type LocalizedTechCopy, type Tech } from './techStack';

/**
 * Órbita de capacidades: la vista "mapa" del stack. Cada nodo es una familia
 * de `FAMILIES` — no duplica tecnologías, las deriva de `TECH_STACK` — y añade
 * lo que la órbita necesita para narrar: un icono, una frase, el grafo de
 * familias que se combinan y la profundidad de práctica.
 */

/** core = práctica diaria · active = producción habitual · exploring = en incorporación. */
export type SkillStance = 'core' | 'active' | 'exploring';

export interface SkillOrbitNode {
    id: Family;
    label: LocalizedTechCopy;
    blurb: LocalizedTechCopy;
    /** Hex del enjambre (dark). En claro se resuelve con `themedAccent()`. */
    color: string;
    Icon: LucideIcon;
    /** Familias con las que esta se combina habitualmente (grafo simétrico). */
    related: Family[];
    /** 0–100 — profundidad de práctica, no "porcentaje de conocimiento". */
    depth: number;
    stance: SkillStance;
}

const ICONS: Record<Family, LucideIcon> = {
    AI: Sparkles,
    Automation: Workflow,
    Backend: Database,
    Web: Code2,
    Commerce: ShoppingBag,
    Marketing: Megaphone,
    CRM: Users,
    Media: Clapperboard,
    Infrastructure: Server,
};

const COPY: Record<Family, { label: LocalizedTechCopy; blurb: LocalizedTechCopy; related: Family[]; depth: number; stance: SkillStance }> = {
    AI: {
        label: { es: 'IA aplicada', en: 'Applied AI' },
        blurb: {
            es: 'Modelos y agentes puestos a trabajar dentro del producto, no al costado: resumen, deciden y ejecutan con contexto real.',
            en: 'Models and agents put to work inside the product, not beside it: they summarize, decide and act with real context.',
        },
        related: ['Automation', 'Backend', 'CRM'],
        depth: 92,
        stance: 'core',
    },
    Automation: {
        label: { es: 'Automatización', en: 'Automation' },
        blurb: {
            es: 'Flujos que conectan las piezas sueltas de una operación para que el trabajo repetido deje de depender de alguien.',
            en: 'Flows that connect the loose pieces of an operation so repeated work stops depending on a person.',
        },
        related: ['AI', 'CRM', 'Backend'],
        depth: 90,
        stance: 'core',
    },
    Backend: {
        label: { es: 'Backend & datos', en: 'Backend & data' },
        blurb: {
            es: 'El modelo de datos y la lógica que sostienen el producto cuando deja de ser un prototipo.',
            en: 'The data model and logic that hold the product up once it stops being a prototype.',
        },
        related: ['Web', 'Infrastructure', 'AI', 'Automation'],
        depth: 78,
        stance: 'active',
    },
    Web: {
        label: { es: 'Experiencias web', en: 'Web experiences' },
        blurb: {
            es: 'Diseño y desarrollo donde el movimiento ayuda a entender, recordar y actuar.',
            en: 'Design and development where motion helps people understand, remember and act.',
        },
        related: ['Backend', 'Media', 'Infrastructure'],
        depth: 95,
        stance: 'core',
    },
    Commerce: {
        label: { es: 'Commerce', en: 'Commerce' },
        blurb: {
            es: 'Del catálogo al cobro: tiendas y checkouts donde comprar no tiene fricción ni sorpresas.',
            en: 'From catalog to checkout: stores where buying has no friction and no surprises.',
        },
        related: ['Web', 'Marketing', 'CRM'],
        depth: 66,
        stance: 'active',
    },
    Marketing: {
        label: { es: 'Marketing & medición', en: 'Marketing & measurement' },
        blurb: {
            es: 'Campañas y analítica conectadas al producto, para que cada decisión tenga evidencia detrás.',
            en: 'Campaigns and analytics wired to the product, so every decision has evidence behind it.',
        },
        related: ['Commerce', 'CRM', 'Media'],
        depth: 62,
        stance: 'active',
    },
    CRM: {
        label: { es: 'CRM & operación', en: 'CRM & operations' },
        blurb: {
            es: 'El sistema donde vive la relación con el cliente: seguimiento, etapas y respuestas que no se pierden.',
            en: 'The system where the customer relationship lives: follow-up, stages and replies that never get lost.',
        },
        related: ['Automation', 'Marketing', 'Commerce', 'AI'],
        depth: 80,
        stance: 'core',
    },
    Media: {
        label: { es: 'Dirección visual', en: 'Visual direction' },
        blurb: {
            es: 'Un sistema de decisiones para que identidad, interfaz y contenido hablen el mismo idioma — con motion y 3D cuando la idea lo pide.',
            en: 'A decision system that makes identity, interface and content speak the same language — with motion and 3D when the idea calls for it.',
        },
        related: ['Web', 'Marketing'],
        depth: 88,
        stance: 'core',
    },
    Infrastructure: {
        label: { es: 'Infraestructura', en: 'Infrastructure' },
        blurb: {
            es: 'Despliegue, entornos y observabilidad: que lo construido siga en pie sin vigilancia permanente.',
            en: 'Deploys, environments and observability: keeping what was built standing without constant watch.',
        },
        related: ['Backend', 'Web'],
        depth: 70,
        stance: 'active',
    },
};

export const SKILL_ORBIT: SkillOrbitNode[] = FAMILIES.map((family) => ({
    id: family.id,
    color: family.color,
    Icon: ICONS[family.id],
    ...COPY[family.id],
}));

/** Tecnologías reales de una familia, en el orden de TECH_STACK. */
export const techsForFamily = (family: Family): Tech[] => techByFamilies([family]);
