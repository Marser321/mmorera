'use client';

import * as React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ServiceModal } from '@/components/shared/ServiceModal';
import { Servicio } from '@/types';
import { Layers, Monitor, Smartphone, Video, Share2, ChevronRight, ChevronLeft, ShoppingCart, Bookmark } from 'lucide-react';
import { MOCK_SERVICES } from '@/data/services';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const iconMap: Record<string, React.ReactNode> = {
    Monitor: <Monitor className="w-8 h-8" />,
    ShoppingCart: <ShoppingCart className="w-8 h-8" />,
    Layers: <Layers className="w-8 h-8" />,
    Video: <Video className="w-8 h-8" />,
    Share2: <Share2 className="w-8 h-8" />,
    Smartphone: <Smartphone className="w-8 h-8" />,
};

export function ServicesCatalog() {
    const [bookmarks, setBookmarks] = React.useState<string[]>([]);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [services, setServices] = React.useState<Servicio[]>(MOCK_SERVICES);
    const [selectedService, setSelectedService] = React.useState<Servicio | null>(null);

    React.useEffect(() => {
        const fetchServices = async () => {
            if (!supabase) { setServices(MOCK_SERVICES); return; }
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('orden', { ascending: true });
            if (!error && data && data.length > 0) {
                setServices(data as unknown as Servicio[]);
            }
        };
        fetchServices();
    }, []);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem('nexo_bookmarks');
            if (raw) setBookmarks(JSON.parse(raw) as string[]);
        } catch { /* ignorar */ } finally { setIsLoaded(true); }
    }, []);

    React.useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('nexo_bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks, isLoaded]);

    const toggleBookmark = (id: string) => {
        setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
    };

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const scrollLeft = () => { scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' }); };
    const scrollRight = () => { scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' }); };

    return (
        <section id="servicios" className="py-24 bg-background relative overflow-hidden min-h-screen flex flex-col pt-12 z-20">
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 mb-8 md:mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
                        Nuestras Capacidades
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase relative z-10">
                        ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 animate-gradient-x bg-[length:200%_auto]">digital</span>
                    </h2>
                    <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
                        Módulos de alto rendimiento diseñados para integrarse y escalar.
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

            {/* Desktop Horizontal Scroll */}
            <div className="hidden md:block relative w-full z-20 group/scroll pl-4 md:pl-[10vw]">
                <div className="flex justify-end gap-2 pr-4 md:pr-[10vw] mb-4">
                    <button onClick={scrollLeft} className="p-3 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button onClick={scrollRight} className="p-3 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto py-12 snap-x snap-mandatory gap-6 px-4 pr-[20vw]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
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

function MobileCard({ service, index: _index, isBookmarked, toggleBookmark, onSelect }: {
    service: Servicio; index: number; isBookmarked: boolean;
    toggleBookmark: (id: string) => void; onSelect: () => void;
}) {
    const isTech = service.pilar === 'tech';
    const isMedia = service.pilar === 'media';
    const borderColor = isTech ? 'border-blue-500/30' : isMedia ? 'border-violet-500/30' : 'border-emerald-500/30';
    const textColor = isTech ? 'text-blue-400' : isMedia ? 'text-violet-400' : 'text-emerald-400';

    return (
        <motion.div
            initial={{ opacity: 0.5, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-20%", amount: 0.5 }}
            className={cn("relative rounded-3xl border overflow-hidden backdrop-blur-md shadow-lg", borderColor,
                isTech ? "bg-slate-950/80" : isMedia ? "bg-fuchsia-950/80" : "bg-emerald-950/80"
            )}
        >
            <div className="p-6 relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border backdrop-blur-md", borderColor, textColor,
                        isTech ? "bg-blue-500/10" : isMedia ? "bg-violet-500/10" : "bg-emerald-500/10"
                    )}>
                        {iconMap[service.icono] || <Layers className="w-6 h-6" />}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(service.id); }} className="p-2 -mr-2 text-white/40 hover:text-white transition-colors">
                        <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-yellow-400 text-yellow-400")} />
                    </button>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">{service.nombre}</h3>
                    <p className="text-gray-200 text-sm leading-relaxed font-medium">{service.descripcion}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {service.caracteristicas.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded bg-black/40 border border-white/10 text-white/70">{f}</span>
                    ))}
                </div>
                <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] uppercase text-white/50 tracking-wider font-bold">Inversión</div>
                        <div className="text-xl font-black text-white">${service.precio_base}</div>
                    </div>
                    <button onClick={onSelect} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-black transition-transform active:scale-95 shadow-lg",
                        isTech ? "bg-blue-400" : isMedia ? "bg-violet-400" : "bg-emerald-400"
                    )}>Ver Detalles</button>
                </div>
            </div>
        </motion.div>
    );
}

function ServiceCard({ service, index, toggleBookmark, isBookmarked, onSelect }: {
    service: Servicio; index: number; toggleBookmark: (id: string) => void;
    isBookmarked: boolean; onSelect: () => void;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const borderClass = service.pilar === 'tech' ? 'group-hover/card:border-blue-500/50' : service.pilar === 'media' ? 'group-hover/card:border-violet-500/50' : 'group-hover/card:border-emerald-500/50';

    return (
        <motion.div
            className="snap-start shrink-0 w-[300px] md:w-[400px] h-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div
                className={cn("group/card relative min-h-[520px] h-full bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col", borderClass)}
                onMouseMove={handleMouseMove}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover/card:opacity-100 transition duration-500"
                    style={{
                        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.08), transparent 40%)`
                    }}
                />

                <div className="p-8 h-full flex flex-col relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover/card:scale-110 shadow-lg",
                            service.pilar === 'tech' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                service.pilar === 'media' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' :
                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        )}>
                            {iconMap[service.icono] || <Layers className="w-8 h-8" />}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(service.id); }} className="p-3 rounded-full hover:bg-white/5 transition-colors">
                            <Bookmark className={cn("w-5 h-5 transition-colors", isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-white/20")} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h3 className="text-3xl font-black text-white leading-tight">{service.nombre}</h3>
                        <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{service.descripcion}</p>
                    </div>

                    <div className="mt-auto space-y-5">
                        <div className="flex flex-wrap gap-2">
                            {service.caracteristicas.slice(0, 3).map((feature, i) => (
                                <span key={i} className="text-[10px] font-mono tracking-wider px-3 py-1.5 rounded-lg border border-white/5 text-white/40 bg-white/5">{feature}</span>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-white/5 flex items-end justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Inversión desde</span>
                                <span className={cn("text-2xl font-black tracking-tight",
                                    service.pilar === 'tech' ? 'text-blue-400' : service.pilar === 'media' ? 'text-violet-400' : 'text-emerald-400'
                                )}>${service.precio_base}</span>
                            </div>
                            <button onClick={onSelect} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover/card:bg-white group-hover/card:text-black transition-all duration-300">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
