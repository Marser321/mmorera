"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useRef } from "react";

/* ═══════════════════════════════════════════════════
 * DATOS DE TESTIMONIOS
 * ═══════════════════════════════════════════════════ */

interface Testimonio {
    nombre: string;
    cargo: string;
    empresa: string;
    quote: string;
    resultado: string;
    iniciales: string;
    accentColor: string;
}

const testimonios: Testimonio[] = [
    {
        nombre: "Felipe T.",
        cargo: "CMO",
        empresa: "TechSolutions AR",
        quote:
            "Nuestro seguimiento era lento. Con la infraestructura IA respondemos leads en menos de 10 minutos (antes tardábamos días) y aumentamos clientes un 40% en 3 meses.",
        resultado: "Conversiones +40%",
        iniciales: "FT",
        accentColor: "text-blue-400",
    },
    {
        nombre: "María I.",
        cargo: "Directora de Marketing",
        empresa: "Innotech UY",
        quote:
            "Equilibramos la carga con un equipo externo. Tras automatizar campañas, vimos +60% leads nuevos sin aumentar nómina, y el CAC bajó un 20%.",
        resultado: "+60% leads, -20% CAC",
        iniciales: "MI",
        accentColor: "text-emerald-400",
    },
    {
        nombre: "Diego R.",
        cargo: "Founder & CEO",
        empresa: "ScaleUp Latam",
        quote:
            "Pasamos de cerrar 3 deals al mes a 12 en el primer trimestre. Los agentes IA califican y nutren leads mientras dormimos. Literalmente duplicamos facturación.",
        resultado: "Facturación x2 en 90 días",
        iniciales: "DR",
        accentColor: "text-violet-400",
    },
    {
        nombre: "Carolina M.",
        cargo: "Head of Operations",
        empresa: "NexGen Commerce",
        quote:
            "Eliminamos 30 horas semanales de tareas manuales y ahora el equipo se enfoca en estrategia. El ROI del primer mes ya cubrió la inversión completa.",
        resultado: "-30hs/sem manuales",
        iniciales: "CM",
        accentColor: "text-orange-400",
    },
];

/* ═══════════════════════════════════════════════════
 * CONTADOR DE SOCIAL PROOF ANIMADO
 * ═══════════════════════════════════════════════════ */

function SocialProofCounter() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, 47, { duration: 2, ease: [0.16, 1, 0.3, 1] });
            return controls.stop;
        }
    }, [isInView, count]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">
                <motion.span>{rounded}</motion.span>+ empresas escalando con nosotros
            </span>
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
 * TESTIMONIAL CARD
 * ═══════════════════════════════════════════════════ */

function TestimonialCard({ t, isActive }: { t: Testimonio; isActive: boolean }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.95 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl p-8 bg-white/[0.03] border border-white/10 backdrop-blur-sm overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Quote icon */}
            <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" aria-hidden />

            {/* Quote text */}
            <blockquote className="text-base text-white/70 leading-relaxed mb-6 italic relative z-10">
                &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Resultado badge */}
            <div className={`inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold mb-6 ${t.accentColor}`}>
                {t.resultado}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/80 font-bold text-sm">
                    {t.iniciales}
                </div>
                <div>
                    <cite className="text-sm font-bold text-white not-italic block">
                        {t.nombre}
                    </cite>
                    <span className="text-xs text-white/40">
                        {t.cargo}, {t.empresa}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
 * COMPONENTE PRINCIPAL
 * ═══════════════════════════════════════════════════ */

export function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotate cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonios.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const goTo = useCallback((idx: number) => {
        setActiveIndex(idx);
    }, []);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + testimonios.length) % testimonios.length);
    }, []);

    const goNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % testimonios.length);
    }, []);

    return (
        <section
            id="testimonios"
            className="py-20 sm:py-28 relative bg-black overflow-hidden"
            aria-labelledby="testimonios-heading"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[200px] bg-primary/5 blur-[100px] rounded-[100%] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 space-y-6">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] text-white/60 font-mono tracking-[0.3em] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        Testimonios
                    </div>
                    <h2
                        id="testimonios-heading"
                        className="text-4xl md:text-5xl font-heading text-white tracking-tight"
                    >
                        Lo que dicen quienes ya <span className="text-primary italic font-light">escalaron</span>.
                    </h2>

                    {/* Social Proof Counter */}
                    <SocialProofCounter />
                </div>

                {/* Desktop: Grid 2x2 */}
                <div className="hidden md:grid grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {testimonios.map((t) => (
                        <TestimonialCard key={t.nombre} t={t} isActive={true} />
                    ))}
                </div>

                {/* Mobile: Carousel */}
                <div className="md:hidden relative">
                    <AnimatePresence mode="wait">
                        <TestimonialCard
                            key={activeIndex}
                            t={testimonios[activeIndex]}
                            isActive={true}
                        />
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={goPrev}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                            aria-label="Testimonio anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonios.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex
                                        ? "bg-primary w-6"
                                        : "bg-white/20 hover:bg-white/40"
                                        }`}
                                    aria-label={`Ir al testimonio ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={goNext}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                            aria-label="Testimonio siguiente"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
