'use client';

import * as React from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { ArrowUpRight, Zap, PlayCircle, Image as ImageIcon, Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';

const CATEGORIES = ['Todos', 'E-commerce', 'Sistemas', 'Agencias', 'Real Estate', 'Clínicas'];

const PROJECTS = [
    {
        id: 1,
        title: 'LNB SaaS',
        category: 'Sistemas',
        desc: 'Panel de administración en la nube para gestión interna de métricas empresariales.',
        metric: '+40% Efi.',
        color: 'from-violet-500/20',
        iframeUrl: 'https://lnb-saass.vercel.app/',
        imageUrls: ['/portfolio/lnb-saass.png'] // Array listo para compendio
    },
    {
        id: 2,
        title: 'EvoWrap Custom',
        category: 'Agencias',
        desc: 'Landing page inmersiva de alta conversión para servicios automotrices premium.',
        metric: '+150% Leads',
        color: 'from-orange-500/20',
        iframeUrl: 'https://evowrap.vercel.app/',
        imageUrls: ['/portfolio/evowrap.png']
    },
    {
        id: 4,
        title: 'Real Estate Brown',
        category: 'Real Estate',
        desc: 'Sistema avanzado de bienes raíces con cotizador integrado y recorridos virtuales.',
        metric: '10k+ Visitas',
        color: 'from-amber-500/20',
        iframeUrl: 'https://realstate2-brown.vercel.app/',
        imageUrls: ['/portfolio/realstate-brown.png']
    },
    {
        id: 5,
        title: 'Booking Clínico',
        category: 'Clínicas',
        desc: 'Sistema de reservas con validación de conflictos. Evita sobreturnos y automatiza recordatorios.',
        metric: '100% Aut.',
        color: 'from-emerald-500/20',
        iframeUrl: 'https://nb-oa7mhumgz-marios-projects-4a53e443.vercel.app/reservar',
        imageUrls: ['/portfolio/booking-clinico.png']
    },
    {
        id: 6,
        title: 'Henry Lasa',
        category: 'Agencias',
        desc: 'Portfolio personal y servicios de consultoría digital de alto nivel.',
        metric: 'Lead Magnet',
        color: 'from-zinc-500/20',
        iframeUrl: 'https://henrylasa-n4sx.vercel.app/',
        imageUrls: ['/portfolio/henrylasa.png']
    },
    {
        id: 7,
        title: 'Smartpoint Pro',
        category: 'Sistemas',
        desc: 'Sistema administrativo modular y escalable. Sin fricción, pagás por lo que usás.',
        metric: 'Cero Fricción',
        color: 'from-indigo-500/20',
        iframeUrl: 'https://smartpoint-rho.vercel.app/',
        imageUrls: ['/portfolio/smartpoint.png']
    },
    {
        id: 8,
        title: 'Gym Beta Sable',
        category: 'E-commerce',
        desc: 'Plataforma para gimnasios con planes de suscripción y reservas de clases.',
        metric: '+200% Subs',
        color: 'from-rose-500/20',
        iframeUrl: 'https://gym-beta-sable.vercel.app/',
        imageUrls: ['/portfolio/gym-beta.png']
    },
    {
        id: 9,
        title: 'N95 Gloves Boutique',
        category: 'E-commerce',
        desc: 'Tienda transaccional de extrema velocidad. Optimizada para no perder ventas.',
        metric: '+240% Conv.',
        color: 'from-blue-500/20',
        iframeUrl: 'https://n95-gloves-boutique.vercel.app/',
        imageUrls: ['/portfolio/n95-gloves.png']
    }
];

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 20 });

    const onMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY]);

    const onMouseLeave = React.useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const iframeContainerRef = React.useRef<HTMLDivElement>(null);

    const handleFullscreen = () => {
        if (iframeContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                iframeContainerRef.current.requestFullscreen();
            }
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="group relative"
        >
            <AnimatedCard className="aspect-[16/10] overflow-hidden bg-black/80 border-white/5 group-hover:border-white/20 transition-all duration-500 shadow-2xl">
                {/* Imagen de Fondo (Mockup Original) */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
                    style={{ backgroundImage: `url(${project.imageUrls?.[0] || ''})` }}
                />

                {/* Gradientes Oscuros para legibilidad (Fondo Oscuro -> Arriba Transparente) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />
                <div className={cn("absolute inset-0 bg-gradient-to-tr mix-blend-overlay z-0", project.color)} />

                {/* Patrón de fondo sutil que simula estructura de datos */}
                <div className="absolute inset-0 opacity-[0.03] z-0 mix-blend-overlay" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{project.category}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Zap className="w-3 h-3" />
                            {project.metric}
                        </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tighter group-hover:translate-x-2 transition-transform duration-500">
                        {project.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm group-hover:text-white/80 transition-colors duration-500">
                        {project.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 relative z-20">

                        {/* Modal Demo Interactiva */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full group/btn border border-emerald-400/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                                >
                                    <PlayCircle className="mr-2 w-4 h-4 text-emerald-100" />
                                    Demo Interactiva
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] md:h-[85vh] p-0 bg-neutral-950 border-white/10 flex flex-col overflow-hidden shadow-2xl">
                                <div className="p-4 md:px-6 md:py-4 border-b border-white/5 bg-neutral-900/50 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                                    <div>
                                        <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                                            {project.title} <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-black">Live Demo</span>
                                        </DialogTitle>
                                        <DialogDescription className="text-white/40 text-xs mt-1 max-w-xl hidden md:block">
                                            Esta es una maqueta alojada en servidores de prueba. Tu sistema de producción usará infraestructura Edge de ultra baja latencia.
                                        </DialogDescription>
                                    </div>

                                    {/* Controles de Dispositivo */}
                                    <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-lg">
                                        <button
                                            onClick={() => setDevice('desktop')}
                                            className={cn("p-2 rounded-md transition-colors", device === 'desktop' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white")}
                                            title="Vista Escritorio"
                                        >
                                            <Monitor className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDevice('tablet')}
                                            className={cn("p-2 rounded-md transition-colors", device === 'tablet' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white")}
                                            title="Vista Tablet"
                                        >
                                            <Tablet className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDevice('mobile')}
                                            className={cn("p-2 rounded-md transition-colors", device === 'mobile' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white")}
                                            title="Vista Móvil"
                                        >
                                            <Smartphone className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-5 bg-white/10 mx-2" />
                                        <button
                                            onClick={handleFullscreen}
                                            className="p-2 rounded-md text-white/40 hover:text-white transition-colors"
                                            title="Pantalla Completa"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Contenedor Iframe */}
                                <div className="flex-1 w-full bg-neutral-950 flex justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                                            <span className="text-white/30 text-xs tracking-widest uppercase">Cargando Entorno</span>
                                        </div>
                                    </div>
                                    <div
                                        ref={iframeContainerRef}
                                        className={cn(
                                            "relative h-full transition-all duration-500 ease-in-out bg-white",
                                            device === 'desktop' ? "w-full" :
                                                device === 'tablet' ? "w-[768px] border-x border-white/10 shadow-2xl" :
                                                    "w-[375px] border-x border-white/10 shadow-2xl"
                                        )}
                                    >
                                        <iframe
                                            src={project.iframeUrl}
                                            className="absolute inset-0 w-full h-full border-0 z-10"
                                            title={`Demo de ${project.title}`}
                                            loading="lazy"
                                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Modal Diseño Visual (Compendio de Imágenes) */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-black/50 backdrop-blur-md border-white/10 hover:bg-white/10 text-white/80 hover:text-white rounded-full group/btn transition-colors cursor-pointer"
                                >
                                    <ImageIcon className="mr-2 w-4 h-4 opacity-70" />
                                    UX/UI Compendio
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 bg-neutral-950/90 backdrop-blur-3xl border-white/10 flex flex-col overflow-hidden shadow-2xl">
                                <div className="p-4 md:px-6 md:py-4 border-b border-white/5 bg-neutral-900/80 flex justify-between items-center z-10 sticky top-0">
                                    <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                                        Exploración Visual <span className="text-white/40 text-sm font-normal">— {project.title}</span>
                                    </DialogTitle>
                                </div>

                                {/* Contenedor Scrollable para la Galería */}
                                <div className="flex-1 w-full overflow-y-auto p-4 md:p-12 pb-32 space-y-8 md:space-y-16">
                                    {project.imageUrls?.map((img, idx) => (
                                        <div key={idx} className="w-full flex justify-center">
                                            <img
                                                src={img}
                                                alt={`${project.title} screenshot ${idx + 1}`}
                                                className="max-w-full h-auto object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10"
                                            />
                                        </div>
                                    ))}

                                    {/* Mensaje por si no hay compendio completo aún */}
                                    {project.imageUrls?.length === 1 && (
                                        <div className="text-center py-20 px-4">
                                            <p className="text-white/40 text-sm max-w-md mx-auto">
                                                *Estamos renderizando el compendio completo de alta resolución para este proyecto mediante nuestros agentes IA. Pronto verás el desglose completo de la interfaz aquí.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            </AnimatedCard>
        </motion.div>
    );
}

export function PortfolioSection() {
    const [activeCategory, setActiveCategory] = React.useState('Todos');

    const filteredProjects = activeCategory === 'Todos'
        ? PROJECTS
        : PROJECTS.filter(p => p.category === activeCategory);

    return (
        <section id="portfolio" className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col mb-16 gap-8">
                    {/* Header y Filosofía */}
                    <div className="max-w-4xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block"
                        >
                            Casos de Uso & Filosofía
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]">
                            Software <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700">Sin Esperas</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-10">
                            <div>
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    El Método Tradicional
                                </h4>
                                <p className="text-white/40 font-light text-sm leading-relaxed mb-4">
                                    Las agencias te piden <strong>60 a 90 días de desarrollo</strong> y pagos inmensos por adelantado, bloqueando tu liquidez en proyectos que ni siquiera has podido validar en el mercado.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Nuestra Vía Rápida
                                </h4>
                                <p className="text-white/60 font-light text-sm leading-relaxed mb-4">
                                    <strong>Bajamos la barrera de entrada drásticamente.</strong> Podés acceder a un trial rápido, testear la plataforma por meses y validar tu ROI. Te entrenamos a tu equipo gratis, o te conseguimos al operador ideal.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <p className="text-xs text-white/50 leading-relaxed">
                                <strong className="text-white/80">Aviso sobre nuestras Demos:</strong> A diferencia de las plantillas genéricas, el núcleo de nuestros sistemas se adapta a la lógica y volumen de <em>tu propio negocio</em>. No tiene sentido mostrarte el backend privado de un cliente.
                                Por eso, los demos de abajo representan la estética y velocidad de respuesta (Frontend). Tu arquitectura tecnológica (Backend) será dimensionada desde lo más simple hasta operaciones escalables, <strong>garanteando que no pagues licencias ni servidores extra por lo que no usás</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-2 md:gap-3 bg-white/[0.02] p-2 rounded-2xl backdrop-blur-xl border border-white/5 self-start">
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat}
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "rounded-xl transition-all duration-300 px-4 md:px-6",
                                    activeCategory === cat
                                        ? 'bg-white text-black shadow-lg hover:bg-white/90 scale-105'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <span className="text-[10px] md:text-xs uppercase tracking-widest font-black">{cat}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Grid de Proyectos */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
