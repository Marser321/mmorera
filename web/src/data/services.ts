import { Servicio } from '@/types';

export const MOCK_SERVICES: Servicio[] = [
    {
        id: '1',
        nombre: 'Infraestructura de Crecimiento',
        descripcion: 'La capa base. Landing pages orientadas a acción, tracking avanzado y elementos de confianza. Dejamos tu ecosistema listo para convertir tráfico en ventas.',
        descripcion_corta: 'Webs de Conversión',
        pilar: 'tech',
        icono: 'Monitor',
        precio_base: 2500,
        tipo_pago: 'unico',
        caracteristicas: ['Diseño de Alto Rendimiento', 'Tracking de Conversiones (UX)', 'Integración CRM Base'],
        tecnologias: [],
        orden: 1
    },
    {
        id: '2',
        nombre: 'Ads Launch & Creative Factory',
        descripcion: 'Sistema de adquisición pagada con aprendizaje iterativo. Lanzamos campañas y testeamos creatividades en volumen con IA para dominar tu nicho.',
        descripcion_corta: 'Tráfico Pago + Testing A/B',
        pilar: 'growth',
        icono: 'Share2',
        precio_base: 1500,
        tipo_pago: 'mensual',
        caracteristicas: ['Google High-Intent Ads', 'Meta Ads Factory', 'Reporting ROI Claro'],
        tecnologias: [],
        orden: 2
    },
    {
        id: '3',
        nombre: 'CRM Autopilot & Follow-up',
        descripcion: 'Respuesta en <5 minutos 24/7. Agentes IA que califican, secuencias de email Nurturing y lead scoring predictivo para que no pierdas ni una sola oportunidad.',
        descripcion_corta: 'Agentes IA + Ventas',
        pilar: 'tech',
        icono: 'Layers',
        precio_base: 1200,
        tipo_pago: 'mensual',
        caracteristicas: ['Follow-up <5 min', 'Lead Scoring', 'Reactivación de Leads Fríos'],
        tecnologias: [],
        orden: 3
    },
    {
        id: '4',
        nombre: 'Video Repurposing Engine',
        descripcion: 'Contenido corto a escala. Transformamos tus videos largos en decenas de cápsulas optimizadas para Reels y TikTok, impulsando tu alcance orgánico y pagado.',
        descripcion_corta: 'Formatos Virales IA',
        pilar: 'media',
        icono: 'Video',
        precio_base: 1800,
        tipo_pago: 'mensual',
        caracteristicas: ['De 1 Video a 20 Shorts', 'Hooks Persuasivos', 'Edición Retención Alta'],
        tecnologias: [],
        orden: 4
    },
    {
        id: '5',
        nombre: 'E-commerce Empire',
        descripcion: 'Tiendas online construidas para facturar en automático. Checkout de 1-clic, upselling inteligente y recuperación de carritos abandonados.',
        descripcion_corta: 'Tiendas de Alto Nivel',
        pilar: 'tech',
        icono: 'ShoppingCart',
        precio_base: 4500,
        tipo_pago: 'unico',
        caracteristicas: ['Checkout Optimizado', 'Upselling Automatizado', 'Lealtad Programada'],
        tecnologias: [],
        orden: 5
    }
];
