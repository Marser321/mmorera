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
        desafio: 'Catálogos de concesionarias lentos, con imágenes 360° pesadas y poca fluidez.',
        orquestacion: 'Assets optimizados y visor WebGL liviano para explorar vehículos desde mobile.',
        impacto: 'Experiencia inmersiva que vuelve el catálogo más atractivo y confiable.',
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
        desafio: 'Panel administrativo lento para reportes, inventario y lectura financiera diaria.',
        orquestacion: 'Tablero modular con caché local, vistas reactivas y métricas más claras.',
        impacto: 'Stock, márgenes y operación visibles con menos espera y menos fricción.',
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
        desafio: 'Evaluación manual de CVs lenta, repetitiva y difícil de comparar.',
        orquestacion: 'Pipeline IA para extraer datos clave, ordenar señales y sugerir mejoras.',
        impacto: 'Reporte claro de compatibilidad y acciones recomendadas en pocos segundos.',
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
        desafio: 'Servicios premium de personalización con tráfico, pero poca conversión.',
        orquestacion: 'Landing rápida con microinteracciones y recorrido visual orientado a consulta.',
        impacto: 'Marca más premium y camino de contacto más claro para leads de alto valor.',
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
        desafio: 'Búsqueda inmobiliaria lenta, con filtros confusos y poca respuesta en mobile.',
        orquestacion: 'Buscador reactivo con filtros claros y consultas optimizadas.',
        impacto: 'Listados más fáciles de explorar y consultas mejor orientadas desde el inicio.',
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
        desafio: 'Desarrollos premium difíciles de presentar a distancia con suficiente impacto.',
        orquestacion: 'Recorridos 360° con carga progresiva y navegación preparada para mobile.',
        impacto: 'Visita remota más convincente para elevar percepción y acelerar consultas.',
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
        desafio: 'Reservas manuales con ausencias frecuentes y tiempo operativo perdido.',
        orquestacion: 'Pago de seña, recordatorios y confirmaciones automáticas por WhatsApp.',
        impacto: 'Agenda más predecible, menos ausencias y reservas confirmadas sin llamadas.',
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
        desafio: 'Portafolio de carpintería fina con imágenes pesadas y carga lenta.',
        orquestacion: 'Compresión de assets y estructura visual simple para mostrar trabajos rápido.',
        impacto: 'Presentación más ágil para reuniones, tablets y consultas de clientes.',
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
        desafio: 'Catálogo público desconectado del stock y la cotización real de la concesionaria.',
        orquestacion: 'Panel simple para stock, catálogo y simulación de crédito desde una misma base.',
        impacto: 'Consulta y cotización más rápidas directamente desde smartphones.',
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
        desafio: 'Facturación empresarial con exceso de funciones y operación difícil de sostener.',
        orquestacion: 'Estructura modular donde cada negocio activa solo lo que necesita.',
        impacto: 'Administración más simple y menos costo por sistemas sobredimensionados.',
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
        desafio: 'Reservas y membresías presenciales que consumían tiempo de recepción.',
        orquestacion: 'Portal mobile-first para reservar clases y pagar membresías con pocos pasos.',
        impacto: 'Menos carga administrativa y socios con gestión más autónoma.',
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
        desafio: 'Oferta estética poco clara para pacientes que comparan tratamientos y precios.',
        orquestacion: 'Landing por capas con jerarquía visual y cotizador estimativo.',
        impacto: 'Propuesta más fácil de entender y reservas mejor precalificadas.',
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
