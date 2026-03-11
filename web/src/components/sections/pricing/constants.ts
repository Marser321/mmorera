import * as React from 'react';
import { Zap, Rocket, Crown, Sparkles, Bot, Globe, PenTool, Share2, Monitor, ShoppingCart, Video, BarChart3 } from 'lucide-react';

/* ═══════════════════════════════════════════════════
 * PLANES ESTRATÉGICOS — Modelo "Enseñar a Pescar"
 * Trimestral / Semestral / Anual con descuentos
 * ═══════════════════════════════════════════════════ */

export type BillingCycle = 'trimestral' | 'semestral' | 'anual';

// Descuentos progresivos por compromiso
export const DISCOUNTS: Record<BillingCycle, number> = {
    trimestral: 0,
    semestral: 0.10,
    anual: 0.20,
};

export const BILLING_LABELS: Record<BillingCycle, { label: string; badge?: string; months: number }> = {
    trimestral: { label: 'Trimestral', months: 3 },
    semestral: { label: 'Semestral', badge: '-10%', months: 6 },
    anual: { label: 'Anual', badge: '-20%', months: 12 },
};

export interface Plan {
    name: string;
    subtitle: string;
    description: string;
    basePrice: number; // precio base mensual (sin descuento)
    icon: React.ElementType;
    features: string[];
    capacitacion: string;
    highlight: boolean;
    badge?: string;
    accentColor: string;
    accentGlow: string;
}

export const PLANS: Plan[] = [
    {
        name: 'Piloto Automático',
        subtitle: 'Starter',
        description: 'Tu primer agente IA operativo en 48 horas. Ideal para validar el impacto de la automatización sin riesgo.',
        basePrice: 149,
        icon: Zap,
        features: [
            'Bot WhatsApp FAQ 24/7',
            '1 Automatización Core (n8n)',
            'Dashboard de Métricas Básico',
            'Soporte por Email',
        ],
        capacitacion: 'Onboarding de 1 mes para tu equipo',
        highlight: false,
        accentColor: 'text-emerald-400',
        accentGlow: 'rgba(16, 185, 129, 0.15)',
    },
    {
        name: 'Crecimiento Acelerado',
        subtitle: 'Growth',
        description: 'El motor completo de conversión B2B. CRM inteligente + automatizaciones multicapa + capacitación real.',
        basePrice: 399,
        icon: Rocket,
        features: [
            'CRM Autopilot + Lead Scoring',
            '3 Automatizaciones Avanzadas',
            'Testing A/B Continuo',
            'Reporting ROI en Tiempo Real',
            'Capacitación Equipo (3 meses)',
            'Soporte Prioritario WhatsApp',
        ],
        capacitacion: '3 meses de capacitación intensiva',
        highlight: true,
        badge: 'MÁS POPULAR',
        accentColor: 'text-blue-400',
        accentGlow: 'rgba(59, 130, 246, 0.15)',
    },
    {
        name: 'Autonomía Total',
        subtitle: 'Enterprise',
        description: 'Infraestructura completa de IA + transferencia total de conocimiento. Tu equipo vuela solo en 6 meses.',
        basePrice: 749,
        icon: Crown,
        features: [
            'RAG Corporativo Auto-actualizable',
            '5+ Automatizaciones Full-Stack',
            'Agentes IA Personalizados',
            'Integración ERP / CRM Legacy',
            'Capacitación Completa (6 meses)',
            'Transferencia Total de Conocimiento',
            'Acceso Directo a Ingeniería',
        ],
        capacitacion: '6 meses de capacitación + transferencia total',
        highlight: false,
        accentColor: 'text-violet-400',
        accentGlow: 'rgba(139, 92, 246, 0.15)',
    }
];

/* ═══════════════════════════════════════════════════
 * CABALLOS DE TROYA — Servicios gancho de entrada
 * Gratuitos o ultra-baratos para generar engagement
 * ═══════════════════════════════════════════════════ */
export interface TrojanHorse {
    name: string;
    description: string;
    icon: React.ElementType;
    price: string;
    priceBadgeColor: string;
    borderColor: string;
    glowColor: string;
    cta: string;
    features: string[];
}

export const TROJAN_HORSES: TrojanHorse[] = [
    {
        name: 'Auditoría IA',
        description: 'Diagnóstico completo de tus procesos en 30 minutos. Te mostramos exactamente dónde estás perdiendo dinero.',
        icon: Sparkles,
        price: 'GRATIS',
        priceBadgeColor: 'from-emerald-400 to-green-500',
        borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
        glowColor: 'bg-emerald-500/5',
        cta: 'Agendar Ahora',
        features: ['Mapa de procesos', 'Blueprint técnico', 'Estimación ROI'],
    },
    {
        name: 'Bot WhatsApp Demo',
        description: 'Tu propio agente IA respondiendo clientes 24/7. Probalo 7 días sin compromiso.',
        icon: Bot,
        price: '7 DÍAS GRATIS',
        priceBadgeColor: 'from-blue-400 to-cyan-500',
        borderColor: 'border-blue-500/30 hover:border-blue-500/60',
        glowColor: 'bg-blue-500/5',
        cta: 'Activar Demo',
        features: ['Bot activo 24/7', 'FAQs + Agendamiento', 'Sin tarjeta de crédito'],
    },
    {
        name: 'Mini-Landing IA',
        description: 'Landing page profesional generada con IA en 24 horas. Comprobá nuestra calidad.',
        icon: Globe,
        price: '$49',
        priceBadgeColor: 'from-violet-400 to-purple-500',
        borderColor: 'border-violet-500/30 hover:border-violet-500/60',
        glowColor: 'bg-violet-500/5',
        cta: 'Solicitar Landing',
        features: ['Diseño premium', 'SEO incluido', 'Entrega en 24hs'],
    },
];

/* ═══════════════════════════════════════════════════
 * PAQUETES DE SERVICIOS INDIVIDUALES
 * Precios provisorios — se actualizan con los reales
 * ═══════════════════════════════════════════════════ */
export interface ServicePack {
    name: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    includes: string[];
    price: string;
    period: string;
}

export const SERVICE_PACKS: ServicePack[] = [
    {
        name: 'Creación de Contenido',
        description: 'Copywriting, guiones, carruseles y newsletters listas para publicar.',
        icon: PenTool,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-500/10 border-orange-500/20',
        includes: ['8 Posts/mes', 'Copys SEO', 'Carruseles', 'Newsletter'],
        price: '200',
        period: 'mes',
    },
    {
        name: 'Social Media Manager',
        description: 'Gestión integral de tus redes sociales con estrategia y reportes.',
        icon: Share2,
        iconColor: 'text-pink-400',
        iconBg: 'bg-pink-500/10 border-pink-500/20',
        includes: ['Calendario Editorial', 'Publicación Diaria', 'Community Manager', 'Reporte Mensual'],
        price: '300',
        period: 'mes',
    },
    {
        name: 'Web & Landing Page',
        description: 'Diseño y desarrollo de presencia digital de alto impacto.',
        icon: Monitor,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
        includes: ['Diseño UX/UI', 'SEO Técnico', 'Hosting 1 Año', 'Analytics'],
        price: '700',
        period: 'proyecto',
    },
    {
        name: 'E-commerce',
        description: 'Tiendas online construidas para convertir y escalar.',
        icon: ShoppingCart,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        includes: ['Catálogo Ilimitado', 'Pasarela de Pagos', 'Checkout 1-Clic', 'Recuperación Carritos'],
        price: '1,500',
        period: 'proyecto',
    },
    {
        name: 'Producción Audiovisual',
        description: 'Contenido de video profesional: reels, spots y UGC.',
        icon: Video,
        iconColor: 'text-violet-400',
        iconBg: 'bg-violet-500/10 border-violet-500/20',
        includes: ['Guión', 'Grabación 4K', 'Edición Pro', 'Reels & Shorts'],
        price: '400',
        period: 'proyecto',
    },
    {
        name: 'Ads & Performance',
        description: 'Campañas pagadas en Meta y Google con optimización continua.',
        icon: BarChart3,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20',
        includes: ['Meta Ads', 'Google Ads', 'A/B Testing', 'Reporting ROI'],
        price: '250',
        period: 'mes',
    },
];
