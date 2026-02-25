'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

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
                    <div className="flex items-center justify-center gap-6 mt-12 bg-white/[0.02] w-fit mx-auto px-8 py-4 rounded-full border border-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setIsMonthly(true)}
                            className={cn("text-sm uppercase tracking-widest cursor-pointer transition-colors font-bold", isMonthly ? "text-emerald-400" : "text-white/20")}
                        >
                            Suscripción
                        </button>
                        <div className="w-px h-6 bg-white/10" />
                        <button
                            onClick={() => setIsMonthly(false)}
                            className={cn("text-sm uppercase tracking-widest cursor-pointer transition-colors font-bold", !isMonthly ? "text-white" : "text-white/20")}
                        >
                            Proyecto Único
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {SERVICES_PRICING.map((service, index) => {
                        const priceData = isMonthly ? service.monthly : service.oneTime;
                        return (
                            <motion.div
                                key={service.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "relative p-10 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-700 group flex flex-col hover:-translate-y-2",
                                    service.highlight
                                        ? "bg-white/[0.05] border-emerald-500/20 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] z-10"
                                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                )}
                            >
                                {service.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-2xl uppercase">
                                        Recomendado
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{service.name}</h3>
                                    <p className="text-white/40 text-sm leading-relaxed min-h-[48px] font-light">{service.description}</p>
                                </div>

                                <div className="mb-10 pb-10 border-b border-white/[0.05]">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-white/20 uppercase tracking-widest">Desde</span>
                                        <span className="text-5xl font-bold tracking-tighter text-white transition-all duration-300">
                                            ${priceData.price}
                                        </span>
                                    </div>
                                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                                        {priceData.label}
                                    </p>
                                </div>

                                <div className="space-y-5 mb-10 flex-grow">
                                    {service.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-4">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-emerald-500">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                            <span className="text-white/60 text-sm font-light leading-relaxed">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className={cn(
                                        "w-full h-16 rounded-2xl text-[10px] font-black tracking-[0.3em] transition-all duration-500 uppercase",
                                        service.highlight
                                            ? "bg-white text-black hover:bg-white/90 shadow-2xl"
                                            : "bg-white/[0.05] text-white hover:bg-white/10 border border-white/10"
                                    )}
                                >
                                    {isMonthly ? 'Iniciar Proyecto' : 'Cotizar Proyecto'}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default PricingSection;
