import { Servicio } from '@/types';

export const MOCK_SERVICES: Servicio[] = [
    {
        id: '0',
        nombre: 'Ecosistemas de Marketing y Escalabilidad',
        descripcion: 'Dejamos atrás las métricas vanidosas. Somos ingenieros de ingresos. Construimos campañas de Ads multiplataforma (Meta, Google, TikTok), SEO agresivo y embudos de conversión optimizados que traen leads calificados todos los días y multiplican tus ventas al menor costo de adquisición posible.',
        descripcion_corta: 'Growth Marketing',
        pilar: 'growth',
        icono: 'Search',
        precio_base: 1500,
        tipo_pago: 'mensual',
        caracteristicas: ['Ads de Alto Rendimiento', 'Embudos de Conversión', 'SEO y Captación'],
        tecnologias: [],
        orden: 0
    },
    {
        id: '1',
        nombre: 'Desarrollo Web & Tiendas E-commerce',
        descripcion: 'Tu web es tu mejor vendedor. Construimos plataformas rápidas, seguras y visualmente impactantes (Next.js & React) diseñadas obsesivamente para convertir clics en clientes. Desde Landing Pages de alta velocidad hasta e-commerces complejos que escalan sin romperse.',
        descripcion_corta: 'Web & E-commerce',
        pilar: 'tech',
        icono: 'Monitor',
        precio_base: 2500,
        tipo_pago: 'unico',
        caracteristicas: ['Lanzamiento Acelerado', 'Ecosistema Premium', 'Alta Conversión'],
        tecnologias: [],
        orden: 1
    },
    {
        id: '2',
        nombre: 'Creación de Contenido y Medios (Short-Form)',
        descripcion: 'Atención es la moneda actual. Nos encargamos de la dirección creativa, edición premium y distribución de contenido viral (TikToks, Reels, YouTube Shorts) diseñado para capturar la atención de tu avatar ideal y alimentar constantemente tu maquinaria de ventas y anuncios.',
        descripcion_corta: 'Media & Social',
        pilar: 'media',
        icono: 'Video',
        precio_base: 1200,
        tipo_pago: 'mensual',
        caracteristicas: ['Edición Viral', 'Guiones Estratégicos', 'Distribución Multi-channel'],
        tecnologias: [],
        orden: 2
    },
    {
        id: '3',
        nombre: 'Arquitectura Agéntica y Automatización IA',
        descripcion: 'Desplegamos un ejército de "Empleados Sintéticos" (Agentes IA) que califican prospectos, responden dudas por WhatsApp 24/7 y agendan reuniones de manera automática. Integramos y modernizamos tu CRM actual, creando infraestructuras autónomas y seguras que eliminan los cuellos de botella de tu equipo comercial.',
        descripcion_corta: 'Agentes IA & CRM',
        pilar: 'tech',
        icono: 'Users',
        precio_base: 1800,
        tipo_pago: 'mensual',
        caracteristicas: ['Empleados IA 24/7', 'Integración CRM Legacy', 'Cierre Automatizado'],
        tecnologias: [],
        orden: 3
    },
    {
        id: '4',
        nombre: 'Consultoría y Auditoría Estructural',
        descripcion: 'Antes de construir, necesitamos medir. Diagnosticamos tu infraestructura digital (Tráfico, Branding, Sistemas, IA) en un sprint de auditoría intensivo. Te entregamos un blueprint (mapa de ruta) con los cuellos de botella exactos y los módulos necesarios para desbloquear tu próxima etapa de crecimiento.',
        descripcion_corta: 'Auditoría & Blueprint',
        pilar: 'tech',
        icono: 'Layers',
        precio_base: 500,
        tipo_pago: 'unico',
        caracteristicas: ['Diagnóstico 360', 'Blueprint de Escala', 'Identificación de Fugas'],
        tecnologias: [],
        orden: 4
    }
];
