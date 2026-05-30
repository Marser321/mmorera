import { TRACKS, type TrackId } from './tracks';

export interface Project {
    id: number;
    title: string;
    category: string[];
    desafio: string;
    orquestacion: string;
    impacto: string;
    metric: string;
    color: string;
    iframeUrl: string;
    imageUrls: string[];
    stack: string[];
}

export const PROJECTS: Project[] = [
    {
        id: 0,
        title: 'AutoHub',
        category: ['Creative Tech', 'UX Design', 'Optimization'],
        desafio: 'Concesionarias con carga lenta de imágenes 360° y catálogos de vehículos rígidos.',
        orquestacion: 'Compresión inteligente de assets y visor interactivo WebGL de ultra-bajo consumo de memoria.',
        impacto: 'Navegación automotriz inmersiva y fluida en cualquier dispositivo móvil sin demoras.',
        metric: 'UX Inmersiva',
        color: 'from-blue-600/20',
        iframeUrl: 'https://auto-indol-five.vercel.app/',
        imageUrls: ['/portfolio/autohub-cover-v2.png', '/portfolio/auto-hub.png', '/portfolio/autohub-transparent.png'],
        stack: ['Next.js', 'Framer Motion', 'WebGL', 'Tailwind']
    },
    {
        id: 1,
        title: 'LNB SaaS',
        category: ['SaaS Dashboard', 'Data Systems', 'Admin Panel'],
        desafio: 'Panel administrativo lento que dificultaba la toma de decisiones financieras en tiempo real.',
        orquestacion: 'Tablero modular optimizado con caché local y flujos reactivos de datos en tiempo real.',
        impacto: 'Control de inventario integrado y lectura instantánea de métricas clave del negocio.',
        metric: 'SaaS Panel',
        color: 'from-violet-500/20',
        iframeUrl: 'https://lnb-saass.vercel.app/',
        imageUrls: ['/portfolio/lnb-saass.png'],
        stack: ['React', 'Tailwind CSS', 'ChartJS', 'REST APIs']
    },
    {
        id: 3,
        title: 'Hub Profesional',
        category: ['AI & Automation', 'UX Optimization', 'LinkedIn Tools'],
        desafio: 'Revisión y análisis manual lento de CVs de candidatos por parte de consultores de RRHH.',
        orquestacion: 'Conexión automatizada con modelos de OpenAI para extracción y evaluación veloz de aptitudes.',
        impacto: 'Sugerencias de optimización generadas al instante con cálculo de métricas de impacto real.',
        metric: 'AI-Optimized',
        color: 'from-indigo-600/20',
        iframeUrl: 'https://profecionalcv.vercel.app/',
        imageUrls: ['/portfolio/profesional-cv.png'],
        stack: ['Next.js', 'OpenAI API', 'Tailwind', 'PostgreSQL']
    },
    {
        id: 2,
        title: 'EvoWrap Custom',
        category: ['Creative Tech', 'Conversion Design', 'SEO Technical'],
        desafio: 'Captación ineficiente de prospectos de alto valor para servicios automotrices personalizados.',
        orquestacion: 'Landing page interactiva con micro-animaciones diseñadas para guiar la intención de compra.',
        impacto: 'Conversión orgánica mejorada y presentación premium de la calidad de los acabados.',
        metric: 'Conversion++',
        color: 'from-orange-500/20',
        iframeUrl: 'https://evowrap.vercel.app/',
        imageUrls: ['/portfolio/evowrap.png'],
        stack: ['HTML5/JS', 'Tailwind CSS', 'Framer Motion', 'SEO']
    },
    {
        id: 4,
        title: 'Directorio Inmobiliario',
        category: ['Web Platforms', 'Real Estate', 'Dynamic Filters'],
        desafio: 'Búsqueda de propiedades de forma compleja en portales inmobiliarios lentos o desactualizados.',
        orquestacion: 'Buscador reactivo con filtros avanzados y consultas optimizadas para evitar retrasos en red.',
        impacto: 'Localización veloz de listados de inmobiliarias con cotizador inteligente integrado.',
        metric: 'Dynamic Search',
        color: 'from-amber-500/20',
        iframeUrl: 'https://directorio-inmobiliarias-ten.vercel.app/',
        imageUrls: ['/portfolio/realstate-cover-v2.png', '/portfolio/realstate-brown.png'],
        stack: ['Next.js', 'React Context', 'Tailwind CSS', 'PostgreSQL']
    },
    {
        id: 13,
        title: 'Punta 360',
        category: ['Motion Design', 'Interactive Web', 'Real Estate'],
        desafio: 'Imposibilidad de exhibir desarrollos urbanísticos premium y propiedades costeras de forma remota.',
        orquestacion: 'Integración fluida de entornos y vistas 360° optimizadas para carga progresiva móvil.',
        impacto: 'Experiencia inmersiva fluida que eleva la percepción de valor de cada desarrollo costero.',
        metric: 'Virtual Tour',
        color: 'from-blue-400/20',
        iframeUrl: 'https://punta-360.vercel.app/',
        imageUrls: ['/portfolio/punta-360.png'],
        stack: ['HTML5/JS', 'Three.js', 'Tailwind CSS', 'DaVinci Resolve']
    },
    {
        id: 5,
        title: 'Booking Barbería',
        category: ['WhatsApp Automation', 'Operations', 'Stripe Payment'],
        desafio: 'Alta tasa de ausentismo en reservas de turnos que provocaba tiempos muertos operativos.',
        orquestacion: 'Flujo automático de recordatorios por WhatsApp con cobro previo de seña de seguridad.',
        impacto: 'Fidelización de la agenda diaria de clientes y reducción inmediata de ausencias no avisadas.',
        metric: 'Booking System',
        color: 'from-orange-500/20',
        iframeUrl: 'https://nb-oa7mhumgz-marios-projects-4a53e443.vercel.app/reservar',
        imageUrls: ['/portfolio/booking-clinico.png'],
        stack: ['React', 'Node.js', 'Stripe API', 'WhatsApp API']
    },
    {
        id: 6,
        title: 'Carpintería Lasa v2',
        category: ['Showcase Web', 'UX/UI Design', 'Asset Optimization'],
        desafio: 'Portafolio digital de carpintería fina que demoraba en cargar imágenes de alta definición.',
        orquestacion: 'Optimización de pesos mediante formatos modernos de compresión automatizada.',
        impacto: 'Carga instantánea de trabajos a alta resolución, ideal para ventas frente a clientes en tablet.',
        metric: 'Fast Loading',
        color: 'from-zinc-500/20',
        iframeUrl: 'https://jenrylasaweb.vercel.app/',
        imageUrls: ['/portfolio/henrylasa.png'],
        stack: ['HTML5', 'Tailwind CSS', 'Vercel Deploy']
    },
    {
        id: 14,
        title: 'Fede Motos',
        category: ['E-commerce', 'Operations', 'Inventory Control'],
        desafio: 'Desconexión entre el catálogo público de motos y el control real de stock en la concesionaria.',
        orquestacion: 'Sincronización ágil de base de datos local y panel simplificado de cotización de crédito.',
        impacto: 'Checkout y simulación financiera rápidos directamente desde smartphones de clientes.',
        metric: 'Inventory Flow',
        color: 'from-red-600/20',
        iframeUrl: 'https://fede-motos.vercel.app/',
        imageUrls: ['/portfolio/fede-motos.png'],
        stack: ['Next.js', 'SQLite', 'Tailwind CSS', 'REST API']
    },
    {
        id: 7,
        title: 'Smartpoint Pro',
        category: ['Operations', 'SaaS App', 'Automation'],
        desafio: 'Sistemas de facturación empresarial complicados con exceso de funciones no deseadas.',
        orquestacion: 'Estructura modular donde el usuario habilita solo lo que su operativa necesita en el día.',
        impacto: 'Simplificación administrativa y ahorro de costos al evitar sistemas sobredimensionados.',
        metric: 'Modular App',
        color: 'from-indigo-500/20',
        iframeUrl: 'https://smartpoint-rho.vercel.app/',
        imageUrls: ['/portfolio/smartpoint.png'],
        stack: ['React', 'Supabase', 'Tailwind CSS', 'PostgreSQL']
    },
    {
        id: 8,
        title: 'Gym Beta Sable',
        category: ['Operations', 'Client Portal', 'Stripe Integration'],
        desafio: 'Proceso complejo para agendar clases y pagar membresías mensuales de forma presencial.',
        orquestacion: 'Portal mobile-first diseñado para que los socios reserven y paguen en menos de 10 segundos.',
        impacto: 'Gestión administrativa autogestionable y reducción del tiempo empleado en recepción.',
        metric: 'Client Portal',
        color: 'from-rose-500/20',
        iframeUrl: 'https://gym-beta-sable.vercel.app/',
        imageUrls: ['/portfolio/gym-beta.png'],
        stack: ['Next.js', 'Stripe Subscriptions', 'Tailwind CSS']
    },
    {
        id: 10,
        title: 'Clínica Estética Advanced',
        category: ['Showcase Web', 'UX/UI Design', 'Visual Hierarchy'],
        desafio: 'Confusión de pacientes por la falta de estructura visual en la oferta de tratamientos estéticos.',
        orquestacion: 'Landing inmersiva estructurada por capas con cotizador estimativo para tratamientos complejos.',
        impacto: 'Comprensión inmediata de la propuesta de la clínica y precalificación de reservas.',
        metric: 'UI Showcase',
        color: 'from-rose-400/20',
        iframeUrl: 'https://clinicaest-tica.vercel.app/',
        imageUrls: ['/portfolio/clinica-estetica.png'],
        stack: ['React', 'Framer Motion', 'Tailwind CSS']
    }
];

/** ¿El proyecto pertenece al track dado? (según sus categorías). */
export function projectMatchesTrack(project: Project, track: TrackId): boolean {
    const set = new Set(TRACKS[track].categories);
    return project.category.some((c) => set.has(c));
}

/** Proyectos del track (o todos si track es null). */
export function filterProjectsByTrack(track: TrackId | null): Project[] {
    if (!track) return PROJECTS;
    return PROJECTS.filter((p) => projectMatchesTrack(p, track));
}
