'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { Zap, PlayCircle, Image as ImageIcon, Monitor, Tablet, Smartphone, Maximize2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { PROJECTS, type Project, projectMatchesTrack } from '@/data/projects';
import { useTrack } from '@/context/TrackContext';
import { useLanguage } from '@/context/LanguageContext';
import { TRACKS, TRACK_IDS, type TrackId } from '@/data/tracks';

function ProjectCard({ project }: { project: Project }) {
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
            <AnimatedCard className="aspect-[16/11] md:aspect-[16/10] overflow-hidden bg-black/85 border-white/5 group-hover:border-white/20 transition-all duration-500 shadow-2xl flex flex-col justify-end">
                {/* Imagen de Fondo (Mockup Original) */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                    style={{ backgroundImage: `url(${project.imageUrls?.[0] || ''})` }}
                />

                {/* Gradientes Oscuros para legibilidad (Fondo Oscuro -> Arriba Transparente) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/30 z-0" />
                <div className={cn("absolute inset-0 bg-gradient-to-tr mix-blend-overlay z-0 opacity-40", project.color)} />

                {/* Patrón de fondo sutil que simula estructura de datos */}
                <div className="absolute inset-0 opacity-[0.02] z-0 mix-blend-overlay" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />

                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7 z-10">
                    {/* Etiquetas de Sinergia (Top Badges) */}
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div className="flex flex-wrap gap-1">
                            {project.category.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] px-2 py-0.5 rounded text-zinc-300 text-[9px] font-bold uppercase tracking-wider"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <Zap className="w-2.5 h-2.5" />
                            {project.metric}
                        </div>
                    </div>

                    {/* Título del Proyecto */}
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tighter group-hover:translate-x-1.5 transition-transform duration-500">
                        {project.title}
                    </h3>

                    {/* Desglose en 3 Líneas (Problema -> Herramientas -> Resultado) */}
                    <div className="space-y-1.5 mb-4 text-left max-w-lg">
                        <div className="text-[11px] md:text-xs text-zinc-400 font-light leading-relaxed group-hover:text-zinc-200 transition-colors duration-500">
                            <span className="text-emerald-500 font-bold mr-1">Desafío:</span> {project.desafio}
                        </div>
                        <div className="text-[11px] md:text-xs text-zinc-400 font-light leading-relaxed group-hover:text-zinc-200 transition-colors duration-500">
                            <span className="text-blue-400 font-bold mr-1">Orquestación:</span> {project.orquestacion}
                        </div>
                        <div className="text-[11px] md:text-xs text-zinc-400 font-light leading-relaxed group-hover:text-zinc-200 transition-colors duration-500">
                            <span className="text-violet-400 font-bold mr-1">Impacto:</span> {project.impacto}
                        </div>
                    </div>

                    {/* Fila de Herramientas + CTA */}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/[0.05]">
                        {/* Stack tecnológico */}
                        <div className="flex flex-wrap gap-1">
                            {project.stack.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-zinc-500 group-hover:text-zinc-300 transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* CTA Discreto pero Claro */}
                        <div className="flex items-center gap-3 relative z-20">
                            {/* Modal Demo Interactiva */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        className="text-xs font-bold text-white hover:text-emerald-400 flex items-center gap-1 group/link transition-colors cursor-pointer bg-transparent border-0 p-0"
                                    >
                                        Ver solución
                                        <PlayCircle className="w-3.5 h-3.5 text-zinc-400 group-hover/link:text-emerald-400 transition-colors" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] md:h-[85vh] p-0 bg-neutral-950 border-white/10 flex flex-col overflow-hidden shadow-2xl">
                                    <div className="p-4 md:px-6 md:py-4 border-b border-white/5 bg-neutral-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
                                        <div className="w-full md:w-auto overflow-hidden">
                                            <DialogTitle className="text-white text-base md:text-lg font-bold flex flex-wrap items-center gap-2">
                                                <span className="truncate max-w-[200px] md:max-w-none">{project.title}</span>
                                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-black shrink-0">Live Demo</span>
                                            </DialogTitle>
                                            <DialogDescription className="text-white/40 text-xs mt-1 max-w-xl hidden md:block">
                                                Esta es una maqueta alojada en servidores de prueba. Tu sistema de producción usará infraestructura Edge de ultra baja latencia.
                                            </DialogDescription>
                                        </div>

                                        {/* Controles de Dispositivo */}
                                        <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-lg self-end md:self-auto shrink-0 overflow-x-auto max-w-full">
                                            <button
                                                onClick={() => setDevice('desktop')}
                                                className={cn("p-2 rounded-md transition-colors shrink-0", device === 'desktop' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white")}
                                                title="Vista Escritorio"
                                            >
                                                <Monitor className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDevice('tablet')}
                                                className={cn("p-2 rounded-md transition-colors shrink-0", device === 'tablet' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white")}
                                                title="Vista Tablet"
                                            >
                                                <Tablet className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDevice('mobile')}
                                                className={cn("p-2 rounded-md transition-colors shrink-0", device === 'mobile' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white")}
                                                title="Vista Móvil"
                                            >
                                                <Smartphone className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-5 bg-white/10 mx-2 shrink-0" />
                                            <button
                                                onClick={handleFullscreen}
                                                className="p-2 rounded-md text-white/40 hover:text-white transition-colors shrink-0"
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
                                                "relative h-full transition-all duration-500 ease-in-out bg-white mx-auto",
                                                device === 'desktop' ? "w-full" :
                                                    device === 'tablet' ? "w-full max-w-[768px] border-x border-white/10 shadow-2xl" :
                                                        "w-full max-w-[375px] border-x border-white/10 shadow-2xl"
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
                                    <button
                                        className="text-xs font-bold text-zinc-500 hover:text-zinc-300 flex items-center gap-1 group/link transition-colors cursor-pointer bg-transparent border-0 p-0"
                                    >
                                        Explorar caso
                                        <ImageIcon className="w-3.5 h-3.5 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                                    </button>
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
                                                <Image
                                                    src={img}
                                                    alt={`${project.title} screenshot ${idx + 1}`}
                                                    width={1200}
                                                    height={800}
                                                    sizes="(max-width: 768px) 100vw, 1200px"
                                                    className="w-full h-auto object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10"
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

                </div>
            </AnimatedCard>
        </motion.div>
    );
}

export function PortfolioSection() {
    const { track, mounted } = useTrack();
    const { language } = useLanguage();
    const [filter, setFilter] = React.useState<'all' | TrackId>('all');

    // Default: filtra al track elegido una vez montado (el usuario puede cambiarlo).
    React.useEffect(() => {
        if (mounted && track) setFilter(track);
    }, [mounted, track]);

    const visible = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => projectMatchesTrack(p, filter));

    return (
        <section id="portfolio" className="py-24 md:py-32 bg-transparent relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col mb-14 gap-8">
                    {/* Header y Filosofía */}
                    <div className="max-w-4xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block"
                        >
                            Casos de Uso & Soluciones
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]">
                            Proyectos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700">Acción</span>
                        </h2>

                        <p className="text-white/60 font-medium text-lg leading-relaxed max-w-3xl mt-4">
                            Una muestra de cómo combino diseño, código y automatizaciones para resolver problemas específicos. No me ato a una sola tecnología; uso la herramienta exacta que el proyecto requiere para ser eficiente.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-10">
                            <div>
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Capacidad de Resolución
                                </h4>
                                <p className="text-white/40 font-light text-sm leading-relaxed mb-4">
                                    Entiendo que el código es solo una herramienta para resolver problemas reales de negocio. Mi enfoque está en simplificar procesos, acortar los tiempos de desarrollo y entregar valor tangible con soluciones directas.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Elección Inteligente del Stack
                                </h4>
                                <p className="text-white/40 font-light text-sm leading-relaxed mb-4">
                                    No implemento arquitecturas sobredimensionadas que encarezcan el mantenimiento o compliquen la operativa. Selecciono tecnologías estables, rápidas y adecuadas para cada escenario.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <p className="text-xs text-white/50 leading-relaxed">
                                <strong className="text-white/80">Nota sobre la exploración de demos:</strong> Las demos a continuación representan implementaciones interactivas de frontend y flujos de usuario funcionales. Para cada proyecto, la arquitectura de backend y la lógica de base de datos se adaptan a las necesidades operativas reales, garantizando eficiencia y evitando costos de infraestructura innecesarios.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtro por track */}
                <div className="mb-10 flex flex-wrap gap-2">
                    {([
                        { id: 'all' as const, label: language === 'es' ? 'Todos' : 'All' },
                        ...TRACK_IDS.map((id) => ({ id, label: TRACKS[id].label[language] })),
                    ]).map((chip) => {
                        const active = filter === chip.id;
                        return (
                            <button
                                key={chip.id}
                                onClick={() => setFilter(chip.id)}
                                className={cn(
                                    'rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer',
                                    active
                                        ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                                        : 'border-white/10 bg-white/[0.03] text-white/45 hover:text-white/80 hover:border-white/20',
                                )}
                            >
                                {chip.label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid de Proyectos */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    <AnimatePresence mode='popLayout'>
                        {visible.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
