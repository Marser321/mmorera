'use client';

import * as React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ServiceModal } from '@/components/shared/ServiceModal';
import { Servicio } from '@/types';
import { Layers, Monitor, Video, Share2, ChevronRight, Bookmark } from 'lucide-react';
import { MOCK_SERVICES, localizeServicio } from '@/data/services';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
    Monitor: <Monitor className="w-8 h-8" />,
    Layers: <Layers className="w-8 h-8" />,
    Video: <Video className="w-8 h-8" />,
    Share2: <Share2 className="w-8 h-8" />,
};

/** Devuelve estilos de color según pilar */
function getPillarStyle(pilar: string) {
    switch (pilar) {
        case 'tech': return { border: 'border-primary/30', text: 'text-primary', bg: 'bg-primary/10', hoverBorder: 'group-hover/card:border-primary/50' };
        case 'media': return { border: 'border-secondary/30', text: 'text-white/70', bg: 'bg-secondary/20', hoverBorder: 'group-hover/card:border-white/20' };
        case 'growth': return { border: 'border-accent/30', text: 'text-accent', bg: 'bg-accent/10', hoverBorder: 'group-hover/card:border-accent/50' };
        case 'ops': return { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10', hoverBorder: 'group-hover/card:border-amber-500/50' };
        default: return { border: 'border-white/10', text: 'text-white/50', bg: 'bg-white/5', hoverBorder: 'group-hover/card:border-white/20' };
    }
}

export function ServicesCatalog() {
    const { t, language } = useLanguage();
    const [bookmarks, setBookmarks] = React.useState<string[]>([]);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const services = MOCK_SERVICES.map((s) => localizeServicio(s, language));
    const [selectedService, setSelectedService] = React.useState<Servicio | null>(null);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        let active = true;

        queueMicrotask(() => {
            if (!active) return;
            try {
                const raw = localStorage.getItem('nexo_bookmarks');
                if (raw) setBookmarks(JSON.parse(raw) as string[]);
            } catch {
                /* ignorar */
            } finally {
                setIsLoaded(true);
            }
        });

        return () => {
            active = false;
        };
    }, []);

    React.useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('nexo_bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks, isLoaded]);

    const toggleBookmark = (id: string) => {
        setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
    };

    return (
        <section id="servicios" className="py-24 bg-transparent relative overflow-hidden min-h-screen flex flex-col pt-12 z-20">
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 mb-8 md:mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        {t('services', 'catalog_eyebrow')}
                    </div>
                    <h2 className="text-4xl md:text-7xl font-heading text-white mb-6 tracking-tighter uppercase relative z-10">
                        {t('services', 'catalog_title_pre')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x bg-[length:200%_auto]">{t('services', 'catalog_title_accent')}</span>
                    </h2>
                    <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
                        {t('services', 'catalog_subtitle')}
                    </p>
                </motion.div>
            </div>

            {/* Mobile Stack */}
            <div className="flex flex-col gap-6 px-4 pb-16 md:hidden">
                {services.map((service, index) => (
                    <MobileCard
                        key={service.id}
                        service={service}
                        index={index}
                        isBookmarked={bookmarks.includes(service.id)}
                        toggleBookmark={toggleBookmark}
                        onSelect={() => setSelectedService(service)}
                    />
                ))}
            </div>

            {/* Desktop Grid Layout (3 Columnas Simétricas) */}
            <div className="hidden md:block relative w-full z-20 max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-3 gap-6 py-12">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                            toggleBookmark={toggleBookmark}
                            isBookmarked={bookmarks.includes(service.id)}
                            onSelect={() => setSelectedService(service)}
                        />
                    ))}
                </div>
            </div>

            <ServiceModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService}
            />
        </section>
    );
}

function MobileCard({ service, isBookmarked, toggleBookmark, onSelect }: {
    service: Servicio; index: number; isBookmarked: boolean;
    toggleBookmark: (id: string) => void; onSelect: () => void;
}) {
    const { t } = useLanguage();
    const style = getPillarStyle(service.pilar);

    return (
        <motion.div
            initial={{ opacity: 0.5, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-20%", amount: 0.5 }}
            className={cn("relative rounded-3xl border overflow-hidden backdrop-blur-md shadow-lg bg-black/60", style.border)}
        >
            <div className="p-6 relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border backdrop-blur-md", style.border, style.text, style.bg)}>
                        {iconMap[service.icono] || <Layers className="w-6 h-6" />}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(service.id); }} className="p-2 -mr-2 text-white/40 hover:text-white transition-colors">
                        <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-yellow-400 text-yellow-400")} />
                    </button>
                </div>
                <div className="text-left">
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">{service.nombre}</h3>
                    <p className="text-white/60 text-sm leading-relaxed font-light">{service.descripcion}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {service.caracteristicas.slice(0, 4).map((f, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-black/40 border border-white/10 text-white/50">{f}</span>
                    ))}
                </div>
                <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] uppercase text-white/50 tracking-wider font-mono">{service.descripcion_corta}</div>
                    </div>
                    <button onClick={onSelect} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-lg cursor-pointer",
                        service.pilar === 'tech' ? "bg-primary text-black" :
                        service.pilar === 'media' ? "bg-white text-black" :
                        service.pilar === 'ops' ? "bg-amber-400 text-black" :
                        "bg-accent text-black"
                    )}>{t('services', 'card_more')} →</button>
                </div>
            </div>
        </motion.div>
    );
}

function ServiceCard({ service, index, toggleBookmark, isBookmarked, onSelect }: {
    service: Servicio; index: number; toggleBookmark: (id: string) => void;
    isBookmarked: boolean; onSelect: () => void;
}) {
    const { t } = useLanguage();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const style = getPillarStyle(service.pilar);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            className="w-full flex flex-col h-auto stretch"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div
                className={cn("group/card relative min-h-[480px] flex-1 bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col", style.hoverBorder)}
                onMouseMove={handleMouseMove}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover/card:opacity-100 transition duration-500"
                    style={{
                        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.08), transparent 40%)`
                    }}
                />

                <div className="p-8 h-full flex flex-col relative z-10 text-left">
                    <div className="flex justify-between items-start mb-8">
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover/card:scale-110 shadow-lg",
                            style.bg, style.text, 'border', style.border
                        )}>
                            {iconMap[service.icono] || <Layers className="w-8 h-8" />}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(service.id); }} className="p-3 rounded-full hover:bg-white/5 transition-colors">
                            <Bookmark className={cn("w-5 h-5 transition-colors", isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-white/20")} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h3 className="text-2xl font-black text-white leading-tight">{service.nombre}</h3>
                        <p className="text-white/50 text-sm leading-relaxed font-light">{service.descripcion}</p>
                    </div>

                    <div className="mt-auto space-y-5">
                        <div className="flex flex-wrap gap-2">
                            {service.caracteristicas.slice(0, 4).map((feature, i) => (
                                <span key={i} className="text-[10px] font-mono tracking-wider px-3 py-1.5 rounded-lg border border-white/5 text-white/40 bg-white/5">{feature}</span>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-white/5 flex items-end justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{t('services', 'card_concept')}</span>
                                <span className={cn("text-lg font-black tracking-tight", style.text)}>{service.descripcion_corta}</span>
                            </div>
                            <button onClick={onSelect} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover/card:bg-white group-hover/card:text-black transition-all duration-300 cursor-pointer">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
