import { Servicio } from '@/types';

export const MOCK_SERVICES: Servicio[] = [
    {
        id: 'postproduccion-remota',
        nombre: 'Postproducción Audiovisual Remota',
        descripcion: 'Edición de video avanzada, motion graphics premium, corrección de color profesional y diseño de sonido. Recibo tu material desde cualquier parte del mundo y lo transformo en piezas de alto impacto visual listas para competir.',
        descripcion_corta: 'High-End Video',
        pilar: 'media',
        icono: 'Video',
        precio_base: null,
        tipo_pago: 'mensual',
        caracteristicas: ['Edición Avanzada', 'Motion Graphics', 'Color & Sonido', 'Visuales Premium'],
        tecnologias: [],
        orden: 0
    },
    {
        id: 'desarrollo-agil',
        nombre: 'Desarrollo Ágil de Aplicaciones',
        descripcion: 'Creación de MVPs, landing pages de alta conversión y aplicaciones web funcionales en tiempo récord asistido por IA. Desarrollo ágil enfocado en lanzar rápido, medir y validar ideas de negocio.',
        descripcion_corta: 'Vibe Coding',
        pilar: 'tech',
        icono: 'Monitor',
        precio_base: null,
        tipo_pago: 'unico',
        caracteristicas: ['MVPs Veloces', 'High Conversion', 'Desarrollo IA', 'Framer Motion'],
        tecnologias: [],
        orden: 1
    },
    {
        id: 'automatizaciones-integraciones',
        nombre: 'Automatizaciones e Integraciones',
        descripcion: 'Estructuración de procesos internos. Conexión de bases de datos, optimización de CRM e integración de ecosistemas automatizados en canales de comunicación (como WhatsApp) para que tu negocio funcione en piloto automático.',
        descripcion_corta: 'Digital Ops',
        pilar: 'ops',
        icono: 'Layers',
        precio_base: null,
        tipo_pago: 'unico',
        caracteristicas: ['Procesos Internos', 'WhatsApp & CRM', 'Ecosistema Automatizado', 'Bases de Datos'],
        tecnologias: [],
        orden: 2
    }
];
