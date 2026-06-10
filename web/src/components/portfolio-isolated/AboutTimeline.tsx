'use client';

import { Briefcase, CheckCircle2, Clapperboard, Code2, Workflow } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { useLanguage, type Language } from '@/context/LanguageContext';

const CONTENT: Record<Language, {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
    profileLabel: string;
    profileItems: Array<{ label: string; value: string }>;
    pillars: Array<{
        title: string;
        description: string;
        items: string[];
        icon: typeof Clapperboard;
    }>;
    approachTitle: string;
    approachItems: string[];
}> = {
    es: {
        eyebrow: 'Sobre mí · Trayectoria',
        title: 'Una mirada práctica entre creatividad, tecnología y operación',
        lead: 'No vengo de una sola disciplina. Mi trabajo mezcla criterio visual, construcción digital y experiencia operativa para resolver problemas reales con sistemas simples de entender.',
        paragraphs: [
            'Empecé en operaciones y logística, en entornos donde el orden, los tiempos y la capacidad de resolver imprevistos importan de verdad. Esa base me dio una forma de trabajar muy concreta: entender el proceso antes de elegir la herramienta.',
            'Con el tiempo sumé diseño, video, motion, desarrollo frontend, automatización e IA. Hoy uso esa combinación para crear piezas y sistemas que no solo se ven bien, sino que ayudan a vender, ordenar o acelerar una operación.',
        ],
        profileLabel: 'Perfil de trabajo',
        profileItems: [
            { label: 'Base', value: 'Operaciones reales y resolución práctica' },
            { label: 'Foco', value: 'Experiencias digitales, contenido y sistemas' },
            { label: 'Diferencial', value: 'Conectar áreas que normalmente trabajan separadas' },
        ],
        pillars: [
            {
                title: 'Creatividad aplicada',
                description: 'Dirección visual, video, motion e identidad con criterio comercial.',
                items: ['Postproducción', 'Motion', 'Marca', 'Contenido'],
                icon: Clapperboard,
            },
            {
                title: 'Producto digital',
                description: 'Interfaces, landing pages y experiencias web pensadas para conversión.',
                items: ['Next.js', 'React', 'UX', 'Performance'],
                icon: Code2,
            },
            {
                title: 'Sistemas operativos',
                description: 'Automatizaciones, CRM, flujos y procesos que reducen trabajo manual.',
                items: ['CRM', 'IA', 'n8n', 'WhatsApp'],
                icon: Workflow,
            },
        ],
        approachTitle: 'Cómo suelo aportar valor',
        approachItems: [
            'Traduzco ideas ambiguas en una estructura ejecutable.',
            'Detecto qué parte del negocio necesita diseño, código, automatización o simplemente mejor criterio.',
            'Trabajo con herramientas modernas sin perder de vista la operación real.',
            'Itero rápido, pero cuido los detalles que hacen que una entrega se sienta terminada.',
        ],
    },
    en: {
        eyebrow: 'About me · Background',
        title: 'A practical view across creativity, technology and operations',
        lead: 'I do not come from a single discipline. My work combines visual judgment, digital building and operational experience to solve real problems with systems that are easy to understand.',
        paragraphs: [
            'I started in operations and logistics, in environments where order, timing and solving unexpected issues really matter. That base gave me a practical way to work: understand the process before choosing the tool.',
            'Over time I added design, video, motion, frontend development, automation and AI. Today I use that mix to create assets and systems that do not just look good, but help sell, organize or accelerate an operation.',
        ],
        profileLabel: 'Work profile',
        profileItems: [
            { label: 'Base', value: 'Real operations and practical problem solving' },
            { label: 'Focus', value: 'Digital experiences, content and systems' },
            { label: 'Difference', value: 'Connecting areas that usually work apart' },
        ],
        pillars: [
            {
                title: 'Applied creativity',
                description: 'Visual direction, video, motion and identity with commercial judgment.',
                items: ['Post-production', 'Motion', 'Brand', 'Content'],
                icon: Clapperboard,
            },
            {
                title: 'Digital product',
                description: 'Interfaces, landing pages and web experiences designed for conversion.',
                items: ['Next.js', 'React', 'UX', 'Performance'],
                icon: Code2,
            },
            {
                title: 'Operating systems',
                description: 'Automations, CRM, workflows and processes that reduce manual work.',
                items: ['CRM', 'AI', 'n8n', 'WhatsApp'],
                icon: Workflow,
            },
        ],
        approachTitle: 'How I usually create value',
        approachItems: [
            'I translate ambiguous ideas into an executable structure.',
            'I detect which part of the business needs design, code, automation or simply better judgment.',
            'I work with modern tools without losing sight of the real operation.',
            'I iterate quickly, while caring for the details that make a delivery feel finished.',
        ],
    },
};

export function AboutTimeline() {
    const { language } = useLanguage();
    const copy = CONTENT[language];

    return (
        <section
            id="sobre-mi-timeline"
            className="relative overflow-hidden bg-black py-20 md:py-28"
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <Container className="relative z-10">
                <div className="grid gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-start">
                    <div className="max-w-3xl">
                        <span className="mb-4 block font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-emerald-300/80">
                            {copy.eyebrow}
                        </span>
                        <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
                            {copy.title}
                        </h2>
                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
                            {copy.lead}
                        </p>
                        <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/52 md:text-base">
                            {copy.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    <aside className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                <Briefcase className="size-5" />
                            </span>
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                                    {copy.profileLabel}
                                </p>
                                <p className="text-sm font-semibold text-white">Mario Morera</p>
                            </div>
                        </div>

                        <dl className="space-y-4">
                            {copy.profileItems.map((item) => (
                                <div key={item.label} className="border-t border-white/10 pt-4">
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                                        {item.label}
                                    </dt>
                                    <dd className="mt-1 text-sm leading-relaxed text-white/72">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </aside>
                </div>

                <div className="mt-14 grid gap-4 md:grid-cols-3">
                    {copy.pillars.map((pillar) => {
                        const Icon = pillar.icon;

                        return (
                            <article
                                key={pillar.title}
                                className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="grid size-10 place-items-center rounded-lg border border-violet-300/20 bg-violet-300/10 text-violet-200">
                                        <Icon className="size-5" />
                                    </span>
                                    <h3 className="text-base font-black uppercase tracking-tight text-white">
                                        {pillar.title}
                                    </h3>
                                </div>
                                <p className="min-h-[4.5rem] text-sm leading-relaxed text-white/55">
                                    {pillar.description}
                                </p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {pillar.items.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-white/10 bg-black/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/48"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-sm">
                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">
                                {copy.approachTitle}
                            </p>
                        </div>
                        <ul className="grid flex-1 gap-4 md:grid-cols-2">
                            {copy.approachItems.map((item) => (
                                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/62">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Container>
        </section>
    );
}
