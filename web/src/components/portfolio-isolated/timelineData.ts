export interface TimelineEvent {
    id: string;
    track: 'V1' | 'A1' | 'D1';
    timecode: string;
    title: { es: string; en: string };
    desc: { es: string; en: string };
    tech: string[];
    codec: string;
    resolution: string;
    fps: string;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        id: 'frontend-react',
        track: 'D1',
        timecode: '00:00:45:00',
        title: {
            es: 'Desarrollo Frontend React',
            en: 'React Frontend Development'
        },
        desc: {
            es: 'Maquetado de interfaces interactivas ultra fluidas. Optimización de bundles, performance en el lado del cliente y SEO técnico nativo.',
            en: 'Building ultra-fluid interactive interfaces. Bundle optimization, client-side performance, and native technical SEO.'
        },
        tech: ['React', 'Tailwind', 'Vite', 'TypeScript'],
        codec: 'TSX / Component v3',
        resolution: '1920x1080 (Client)',
        fps: '60.00 fps'
    },
    {
        id: 'postproduction',
        track: 'V1',
        timecode: '00:01:15:00',
        title: {
            es: 'Postproducción Audiovisual',
            en: 'Audiovisual Post-Production'
        },
        desc: {
            es: 'Edición en bruto, ritmos de corte agresivos para retención, y motion graphics personalizados en DaVinci Resolve.',
            en: 'Rough-cut editing, high-retention pacing, and custom motion graphics inside DaVinci Resolve.'
        },
        tech: ['ProRes', 'ACEScc', 'Resolve Studio', 'Fusion'],
        codec: 'Apple ProRes 422 HQ',
        resolution: '3840x2160 (UHD)',
        fps: '23.976 fps'
    },
    {
        id: 'ops-architecture',
        track: 'A1',
        timecode: '00:02:10:00',
        title: {
            es: 'Arquitectura de Operaciones',
            en: 'Operations Architecture'
        },
        desc: {
            es: 'Orquestación de pipelines automatizados. Conexión de bases de datos de leads con CRM mediante webhooks redundantes y n8n.',
            en: 'Orchestrating automated pipelines. Connecting lead databases to CRM via redundant webhooks and n8n.'
        },
        tech: ['n8n', 'APIs', 'Webhooks', 'Airtable'],
        codec: 'JSON Workflow Script',
        resolution: 'Redundant REST API',
        fps: 'Realtime Trigger'
    },
    {
        id: 'vibe-nextjs',
        track: 'D1',
        timecode: '00:03:00:00',
        title: {
            es: 'Vibe Coding & Next.js',
            en: 'Vibe Coding & Next.js'
        },
        desc: {
            es: 'Lanzamiento de MVPs complejos a velocidad récord. Integración ágil de React Server Components con autenticación y base de datos.',
            en: 'Launching complex MVPs at record speeds. Swift integration of React Server Components with auth and database APIs.'
        },
        tech: ['Next.js', 'Supabase', 'Framer Motion', 'Tailwind v3'],
        codec: 'SSR / Server Actions',
        resolution: 'Edge Rendered',
        fps: '120.00 fps'
    },
    {
        id: 'visual-identity',
        track: 'V1',
        timecode: '00:03:45:00',
        title: {
            es: 'Identidad Visual Premium',
            en: 'Premium Visual Identity'
        },
        desc: {
            es: 'Colorización cinematográfica profesional y diseño de sonido. Elevando el valor percibido del servicio para maximizar conversiones.',
            en: 'Professional cinematic color grading and sound design. Elevating perceived service value to maximize conversions.'
        },
        tech: ['DCI-P3', 'DaVinci Fairlight', 'Color Nodes'],
        codec: 'DaVinci YRGB Color',
        resolution: '4096x2160 (DCI 4K)',
        fps: '24.00 fps'
    },
    {
        id: 'systems-autopilot',
        track: 'A1',
        timecode: '00:04:20:00',
        title: {
            es: 'Sistemas Autopilot',
            en: 'Autopilot Systems'
        },
        desc: {
            es: 'Automatización completa de agendamiento y nutrición de leads. Campañas conversacionales instantáneas vía WhatsApp Business API.',
            en: 'Complete calendar scheduling and lead nurturing automation. Conversational workflows via WhatsApp Business API.'
        },
        tech: ['CRM', 'GoHighLevel', 'WhatsApp API', 'Claude API'],
        codec: 'n8n Webhook / GHL Flow',
        resolution: 'B2B CRM Automation',
        fps: 'Multi-Agent Loop'
    }
];
