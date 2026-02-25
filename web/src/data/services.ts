import { Servicio } from '@/types';

export const MOCK_SERVICES: Servicio[] = [
    {
        id: '1',
        nombre: 'Ecosistema Web',
        descripcion: 'No es una web, es tu mejor vendedor. Diseño estratégico que convierte visitantes en fanáticos de tu marca.',
        descripcion_corta: 'Funnel de Ventas',
        pilar: 'tech',
        icono: 'Monitor',
        precio_base: 2500,
        tipo_pago: 'unico',
        caracteristicas: ['Diseño de Conversión', 'Textos Persuasivos', 'Velocidad Extrema'],
        tecnologias: [],
        orden: 1
    },
    {
        id: '4',
        nombre: 'Agentes IA 24/7',
        descripcion: 'Tu mejor vendedor, clonado. Atiende, califica y agenda citas en WhatsApp mientras dormís.',
        descripcion_corta: 'Agendamiento IA',
        pilar: 'tech',
        icono: 'Layers',
        precio_base: 1200,
        tipo_pago: 'mensual',
        caracteristicas: ['Cierre de Ventas IA', 'Sincronización Total', 'Reactiva Clientes'],
        tecnologias: [],
        orden: 2
    },
    {
        id: '5',
        nombre: 'Traffic Acquisition',
        descripcion: 'Inundamos tu embudo con tráfico de alta calidad. Dejamos de adivinar y empezamos a ganar.',
        descripcion_corta: 'Paid Media',
        pilar: 'growth',
        icono: 'Share2',
        precio_base: 1500,
        tipo_pago: 'mensual',
        caracteristicas: ['Ads de Alta Precisión', 'Google High-Intent', 'Retargeting Inteligente'],
        tecnologias: [],
        orden: 3
    },
    {
        id: '2',
        nombre: 'E-commerce Empire',
        descripcion: 'Para marcas que buscan dominar. Checkout optimizado, ventas automáticas y lealtad programada.',
        descripcion_corta: 'Tiendas Premium',
        pilar: 'tech',
        icono: 'ShoppingCart',
        precio_base: 4500,
        tipo_pago: 'unico',
        caracteristicas: ['Tienda de Alto Nivel', 'Checkout 1-Clic', 'Ventas Recurrentes'],
        tecnologias: [],
        orden: 4
    },
    {
        id: '6',
        nombre: 'Cinema Branding',
        descripcion: 'Contenido que detiene el scroll. Producción visual que eleva tu marca a otro nivel.',
        descripcion_corta: 'Video High-End',
        pilar: 'media',
        icono: 'Video',
        precio_base: 2800,
        tipo_pago: 'unico',
        caracteristicas: ['Historias que Venden', 'Calidad Cine', 'Formato Viral'],
        tecnologias: [],
        orden: 5
    },
];
