'use client';

import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICES_PRICING = [
    {
        name: 'Web & Landing',
        description: 'Presencia digital de alto impacto y velocidad.',
        features: ['Diseño UX/UI Premium', 'SEO Técnico Optimizado', 'Dominio y Hosting (1 año)', 'Integración de Analytics'],
        monthly: { price: '150', label: 'Mantenimiento + SEO' },
        oneTime: { price: '1,500', label: 'Desarrollo Completo' },
        highlight: false
    },
    {
        name: 'E-commerce',
        description: 'Tiendas online diseñadas para convertir.',
        features: ['Catálogo Ilimitado', 'Pasarela de Pagos', 'Panel de Administración', 'Recuperación de Carritos'],
        monthly: { price: '300', label: 'Gestión + Soporte' },
        oneTime: { price: '3,500', label: 'Desarrollo Tienda' },
        highlight: true
    },
    {
        name: 'Apps a Medida',
        description: 'Soluciones nativas para iOS y Android.',
        features: ['Desarrollo Cross-Platform', 'Notificaciones Push', 'Base de Datos Real-time', 'Panel Super Admin'],
        monthly: { price: '800', label: 'Infraestructura' },
        oneTime: { price: '5,000+', label: 'MVP Desarrollo' },
        highlight: false
    },
    {
        name: 'Automatización AI',
        description: 'Optimiza flujos y ahorra horas de trabajo.',
        features: ['Chatbots IA (GPT-4)', 'Conexión CRM', 'Email Marketing Auto', 'Dashboard de Métricas'],
        monthly: { price: '200', label: 'Suscripción + Update' },
        oneTime: { price: '800', label: 'Setup Inicial' },
        highlight: false
    },
    {
        name: 'Social Growth',
        description: 'Estrategias virales y contenido de valor.',
        features: ['Calendario de Contenidos', 'Edición de Reels/TikTok', 'Gestión de Comunidad', 'Reportes de Crecimiento'],
        monthly: { price: '600', label: 'Gestión Mensual' },
        oneTime: { price: '500', label: 'Auditoría + Estrategia' },
        highlight: true
    },
    {
        name: 'Producción Media',
        description: 'Contenido audiovisual de calidad cinematográfica.',
        features: ['Guión y Storyboard', 'Grabación 4K', 'Edición y Color Grading', 'Drones y FPV'],
        monthly: { price: '800', label: 'Pack Recurrente' },
        oneTime: { price: '1,200', label: 'Proyecto Único' },
        highlight: false
    }
];

export function PricingSection() {
    const [isMonthly, setIsMonthly] = React.useState(true);

    return (
        <section id="pricing" className="py-32 bg-background relative overflow-hidden">
            {/* Background Effects Premium */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight uppercase">
                            Servicios <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Premium</span>
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
                            Desde desarrollos puntuales hasta acompañamiento continuo de alto nivel.
                        </p>
                    </motion.div>

                    {/* Toggle mensual / proyecto único */}
                    <div className="flex items-center justify-center gap-6 mt-12 bg-black/40 w-fit mx-auto px-8 py-4 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden group/toggle">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                        <button
                            onClick={() => setIsMonthly(true)}
                            className={cn("text-sm uppercase tracking-widest cursor-pointer transition-all duration-300 font-bold relative z-10", isMonthly ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "text-white/30 hover:text-white/60")}
                        >
                            Suscripción
                        </button>
                        <div className="w-px h-6 bg-white/10" />
                        <button
                            onClick={() => setIsMonthly(false)}
                            className={cn("text-sm uppercase tracking-widest cursor-pointer transition-all duration-300 font-bold relative z-10", !isMonthly ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/30 hover:text-white/60")}
                        >
                            Proyecto Único
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">
                    {SERVICES_PRICING.map((service, index) => {
                        const priceData = isMonthly ? service.monthly : service.oneTime;
                        return (
                            <PricingCard
                                key={service.name}
                                service={service}
                                priceData={priceData}
                                isMonthly={isMonthly}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// Extraemos la tarjeta a un componente para manejar estados locales como el mouseX e Y (Spotlight effect)
function PricingCard({ service, priceData, isMonthly, index }: { service: { name: string; description: string; features: string[]; highlight: boolean }, priceData: { price: string; label: string }, isMonthly: boolean, index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className={cn(
                "group relative p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 flex flex-col hover:-translate-y-2",
                service.highlight
                    ? "bg-black/80 border-white/20 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)] z-10"
                    : "bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/60"
            )}
        >
            {/* Hover Spotlight Effect */}
            <motion.div
                className={cn(
                    "pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100",
                    service.highlight ? "duration-500 opacity-60" : "" // Highlight cards always have a bit of ambient glow
                )}
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            ${service.highlight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)'},
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Glowing inner border line for Highlighted */}
            {service.highlight && (
                <div className="absolute inset-0 rounded-[inherit] p-[1px] bg-gradient-to-b from-emerald-500/50 via-transparent to-transparent opacity-50 pointer-events-none animate-pulse"></div>
            )}

            {service.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-black px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.5)] uppercase">
                    Recomendado
                </div>
            )}

            <div className="mb-8 relative z-10">
                <h3 className={cn("text-2xl font-bold mb-3 tracking-tight", service.highlight ? "text-white" : "text-white/90")}>{service.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed min-h-[48px] font-light">{service.description}</p>
            </div>

            <div className="mb-10 pb-10 border-b border-white/10 relative z-10">
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-white/30 uppercase tracking-widest">Desde</span>
                    <span className={cn(
                        "text-5xl font-black tracking-tighter transition-all duration-300",
                        service.highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500" : "text-white"
                    )}>
                        ${priceData.price}
                    </span>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">
                    {priceData.label}
                </p>
            </div>

            <div className="space-y-4 mb-10 flex-grow relative z-10">
                {service.features.map((feature: string, i: number) => (
                    <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + (i * 0.1) }}
                        className="flex items-start gap-4"
                    >
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border",
                            service.highlight ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-white/40 group-hover:text-white/60 group-hover:border-white/20 transition-colors"
                        )}>
                            <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={cn("text-sm font-medium leading-relaxed", service.highlight ? "text-white/80" : "text-white/50 group-hover:text-white/70 transition-colors")}>{feature}</span>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={cn(
                    "w-full h-16 rounded-2xl text-xs font-black tracking-[0.2em] transition-all duration-500 uppercase relative z-10 overflow-hidden group/btn",
                    service.highlight
                        ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-emerald-400"
                        : "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/30"
                )}
            >
                <span className="relative z-10">{isMonthly ? 'Iniciar Proyecto' : 'Cotizar Proyecto'}</span>
                {/* Liquid sweep on button hover */}
                <span className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>
            </button>
        </motion.div>
    );
}

export default PricingSection;
