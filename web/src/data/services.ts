import { Servicio } from '@/types';
import type { Language } from '@/context/LanguageContext';

export const MOCK_SERVICES: Servicio[] = [
    {
        id: 'postproduccion-remota',
        nombre: 'Postproducción Audiovisual Remota',
        descripcion: 'Edición de video avanzada, motion graphics premium, corrección de color profesional y diseño de sonido. Recibo tu material desde cualquier parte del mundo y lo transformo en piezas de alto impacto visual listas para competir.',
        descripcion_corta: 'High-End Video',
        nombreEn: 'Remote Audiovisual Post-Production',
        descripcionEn: 'Advanced video editing, premium motion graphics, professional color grading and sound design. I receive your footage from anywhere in the world and turn it into high-impact visual pieces ready to compete.',
        descripcionCortaEn: 'High-End Video',
        pilar: 'media',
        icono: 'Video',
        precio_base: null,
        tipo_pago: 'mensual',
        caracteristicas: ['Edición Avanzada', 'Motion Graphics', 'Color & Sonido', 'Visuales Premium'],
        caracteristicasEn: ['Advanced Editing', 'Motion Graphics', 'Color & Sound', 'Premium Visuals'],
        tecnologias: [],
        orden: 0
    },
    {
        id: 'desarrollo-agil',
        nombre: 'Desarrollo Ágil de Aplicaciones',
        descripcion: 'Creación de MVPs, landing pages de alta conversión y aplicaciones web funcionales en tiempo récord asistido por IA. Desarrollo ágil enfocado en lanzar rápido, medir y validar ideas de negocio.',
        descripcion_corta: 'Vibe Coding',
        nombreEn: 'Agile App Development',
        descripcionEn: 'Building MVPs, high-conversion landing pages and functional web apps in record time, AI-assisted. Agile development focused on launching fast, measuring and validating business ideas.',
        descripcionCortaEn: 'Vibe Coding',
        pilar: 'tech',
        icono: 'Monitor',
        precio_base: null,
        tipo_pago: 'unico',
        caracteristicas: ['MVPs Veloces', 'High Conversion', 'Desarrollo IA', 'Framer Motion'],
        caracteristicasEn: ['Fast MVPs', 'High Conversion', 'AI Development', 'Framer Motion'],
        tecnologias: [],
        orden: 1
    },
    {
        id: 'automatizaciones-integraciones',
        nombre: 'Automatizaciones e Integraciones',
        descripcion: 'Estructuración de procesos internos. Conexión de bases de datos, optimización de CRM e integración de ecosistemas automatizados en canales de comunicación (como WhatsApp) para que tu negocio funcione en piloto automático.',
        descripcion_corta: 'Digital Ops',
        nombreEn: 'Automations & Integrations',
        descripcionEn: 'Structuring internal processes. Connecting databases, optimizing CRM and integrating automated ecosystems into communication channels (like WhatsApp) so your business runs on autopilot.',
        descripcionCortaEn: 'Digital Ops',
        pilar: 'ops',
        icono: 'Layers',
        precio_base: null,
        tipo_pago: 'unico',
        caracteristicas: ['Procesos Internos', 'WhatsApp & CRM', 'Ecosistema Automatizado', 'Bases de Datos'],
        caracteristicasEn: ['Internal Processes', 'WhatsApp & CRM', 'Automated Ecosystem', 'Databases'],
        tecnologias: [],
        orden: 2
    }
];

/** Devuelve el servicio con sus textos resueltos al idioma activo. */
export function localizeServicio(s: Servicio, language: Language): Servicio {
    if (language === 'es') return s;
    return {
        ...s,
        nombre: s.nombreEn ?? s.nombre,
        descripcion: s.descripcionEn ?? s.descripcion,
        descripcion_corta: s.descripcionCortaEn ?? s.descripcion_corta,
        caracteristicas: s.caracteristicasEn ?? s.caracteristicas,
    };
}
