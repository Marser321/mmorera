import { Servicio } from '@/types';

export const MOCK_SERVICES: Servicio[] = [
    {
        id: '0',
        nombre: 'Consultoría y Auditoría Estratégica',
        descripcion: 'Para el CEO: No adivines qué necesita tu empresa. Nuestro proceso comienza diagnosticando tus cuellos de botella exactos para garantizar un retorno de inversión (ROI) seguro. Estructuramos una oferta de Producto Mínimo Viable (MVP) para que veas resultados operativos reales y rápidos, minimizando el riesgo financiero.',
        descripcion_corta: 'Auditoría & MVP',
        pilar: 'tech',
        icono: 'Search',
        precio_base: 500,
        tipo_pago: 'unico',
        caracteristicas: ['Diagnóstico de Cuellos de Botella', 'Oferta MVP', 'Minimización de Riesgo'],
        tecnologias: [],
        orden: 0
    },
    {
        id: '1',
        nombre: 'Desarrollo Web Autónomo (Vibe Coding)',
        descripcion: 'Para el CEO: Crear plataformas web complejas o tiendas de E-commerce de alto impacto solía tomar meses de trabajo y presupuestos desorbitados. Gracias a nuestra metodología de vanguardia, construimos, probamos y lanzamos tu ecosistema digital premium en cuestión de días, acelerando tu salida al mercado.',
        descripcion_corta: 'Web & E-commerce',
        pilar: 'tech',
        icono: 'Monitor',
        precio_base: 2500,
        tipo_pago: 'unico',
        caracteristicas: ['Lanzamiento en Días', 'Ecosistema Premium', 'Alta Conversión'],
        tecnologias: [],
        orden: 1
    },
    {
        id: '2',
        nombre: 'Modernización de CRMs y Arquitectura Agéntica',
        descripcion: 'Para el CEO: ¿Tienes un sistema antiguo (legacy) y te aterra el costo y el riesgo de reconstruirlo desde cero? Tenemos la solución "Anti-Riesgo". Conservamos tu infraestructura actual y la hacemos inteligente conectándole tecnología de última generación. Modernizamos tu empresa de forma impecable y sin interrumpir tus operaciones.',
        descripcion_corta: 'CRM & Agentes',
        pilar: 'tech',
        icono: 'Layers',
        precio_base: 1200,
        tipo_pago: 'mensual',
        caracteristicas: ['Solución Anti-Riesgo', 'Integración Sistema Legacy', 'Operación Ininterrumpida'],
        tecnologias: [],
        orden: 2
    },
    {
        id: '3',
        nombre: 'Operaciones, Backend Seguro y Empleados Digitales',
        descripcion: 'Para el CEO: Imagina tener agentes de ventas y soporte al cliente trabajando incansablemente 24/7 a través de WhatsApp y Telegram. Nuestros "Empleados Sintéticos" atienden a tus clientes al instante, leen los manuales de tu empresa a la perfección y nunca inventan información. Todo esto, asegurando que los datos confidenciales de tu empresa nunca caigan en manos equivocadas.',
        descripcion_corta: 'Backend & Empleados IA',
        pilar: 'tech',
        icono: 'Users',
        precio_base: 1800,
        tipo_pago: 'mensual',
        caracteristicas: ['Empleados Sintéticos 24/7', 'Respuestas Precisas (RAG)', 'Seguridad de Datos'],
        tecnologias: [],
        orden: 3
    },
    {
        id: '4',
        nombre: 'Ecosistemas de Marketing y Escalabilidad',
        descripcion: 'Para el CEO: Dejamos atrás el marketing de vanidad. Somos ingenieros de ingresos. Construimos campañas que se retroalimentan solas en todos tus canales. Nuestro "Caballo de Troya" para multiplicar tus ventas es la Inundación de Nichos: usamos IA para gestionar ejércitos de micro-influencers que logran que la gente realmente compre, a una fracción del costo de la publicidad tradicional.',
        descripcion_corta: 'Marketing & Influencers',
        pilar: 'growth',
        icono: 'Share2',
        precio_base: 1500,
        tipo_pago: 'mensual',
        caracteristicas: ['Ingeniería de Ingresos', 'Inundación de Nichos', 'Micro-influencers IA'],
        tecnologias: [],
        orden: 4
    }
];
