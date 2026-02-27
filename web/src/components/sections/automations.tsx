'use client';

import { motion } from 'framer-motion';
import { Mail, Database, MessageSquare, Calendar, DollarSign, ArrowRight, Sparkles, Share2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Automations() {
    const steps = [
        { icon: Mail, label: 'Lead Capture', sub: 'Captura Prospectos', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { icon: Sparkles, label: 'Data Enrichment', sub: 'Enriquecimiento', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
        { icon: Database, label: 'Nurture Intelligence', sub: 'Nutrición IA', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        { icon: MessageSquare, label: 'Conversión Directa', sub: 'Cierre de Ventas', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        { icon: Calendar, label: 'Agenda Calificada', sub: 'Citas Automáticas', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { icon: Share2, label: 'Global Scaling', sub: 'Escalamiento Masivo', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { icon: DollarSign, label: 'Revenue System', sub: 'Retorno Optimizado', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { icon: Zap, label: 'Continuous Growth', sub: 'Crecimiento Infinito', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    ];

    return (
        <section id="automatizacion" className="py-32 bg-black relative overflow-hidden">
            {/* Fondo de circuito técnico */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 0 50 L 50 50 M 50 0 L 50 50 M 50 50 L 100 50 M 50 50 L 50 100" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                            <circle cx="50" cy="50" r="1.5" fill="white" fillOpacity="0.4" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit)" />
                </svg>
            </div>

            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.02] border border-white/5 mb-8 backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.4em]">Arquitectura de Crecimiento</span>
                        </div>
                        <h2 className="text-5xl md:text-[7rem] font-bold text-white mb-10 tracking-tight uppercase leading-[0.85]">
                            Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-white/20">Autónomo.</span>
                        </h2>
                        <div className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-white/5 opacity-30" />
                            <p className="text-xl md:text-2xl text-white/50 font-light leading-relaxed relative z-10">
                                Mientras vos gestionás manualmente, tus competidores automatizaron hace 6 meses. Cada día sin automatizar es dinero que <span className="text-white font-medium">no recuperás.</span> Diseñamos infraestructuras de crecimiento autónomo que convierten leads en activos de alto valor.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="relative max-w-7xl mx-auto py-20 px-4">
                    {/* Línea de conexión pulsante (Desktop) */}
                    <div className="absolute top-1/2 left-10 right-10 h-[2px] -translate-y-[6rem] hidden xl:block overflow-visible">
                        <svg className="w-full h-full overflow-visible">
                            <motion.path
                                d="M 0 1 L 1200 1"
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="3"
                                strokeDasharray="15 25"
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: -200 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Data Pulses viajando por el pipeline */}
                            {[0, 2.5, 5].map((delay, i) => (
                                <motion.circle
                                    key={i}
                                    r="4"
                                    cy="1"
                                    fill={["#3b82f6", "#8b5cf6", "#06b6d4"][i]}
                                    initial={{ cx: -20, opacity: 0 }}
                                    animate={{ cx: [-20, 1220], opacity: [0, 1, 1, 1, 0] }}
                                    transition={{
                                        duration: 6,
                                        delay,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    filter="url(#dataPulseGlow)"
                                />
                            ))}
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                    <stop offset="25%" stopColor="#3b82f6" stopOpacity="1" />
                                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                                    <stop offset="75%" stopColor="#06b6d4" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                                </linearGradient>
                                <filter id="dataPulseGlow" x="-100%" y="-100%" width="300%" height="300%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                className="flex flex-col items-center group"
                            >
                                <div className={cn(
                                    "w-24 h-24 md:w-28 md:h-28 rounded-[2.5rem] flex items-center justify-center border backdrop-blur-3xl mb-8 relative transition-all duration-700 z-10",
                                    step.bg, step.border,
                                    "group-hover:scale-110 group-hover:-translate-y-4 group-hover:rotate-[10deg] shadow-2xl"
                                )}>
                                    <div className={cn("absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-2xl", step.bg)} />
                                    <step.icon className={cn("w-10 h-10 md:w-12 md:h-12 relative z-10 transition-transform duration-700 group-hover:scale-110", step.color)} />
                                </div>

                                <div className="text-center group-hover:translate-y-[-0.5rem] transition-transform duration-500">
                                    <h3 className={cn("text-base md:text-lg font-black tracking-tight mb-1 uppercase", step.color)}>
                                        {step.label}
                                    </h3>
                                    <p className="text-white/40 text-[10px] md:text-xs font-bold leading-tight tracking-[0.2em] uppercase">
                                        {step.sub}
                                    </p>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="lg:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/10">
                                        <ArrowRight className="w-6 h-6 rotate-90" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
