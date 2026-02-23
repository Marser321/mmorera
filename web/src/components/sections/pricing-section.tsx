"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, ShieldAlert, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const pricingPlans = [
    {
        name: "Starter Pack",
        badge: "MVP",
        price: "$1,500 - $3,000",
        period: "setup",
        description: "Validación de Vibe. Ideal para agencias que necesitan digitalizar su propuesta de valor rápidamente.",
        features: [
            "Landing Page de Alta Conversión",
            "Configuración de 1 Módulo IA (ej. Chatbot NotebookLM)",
            "Base de Datos Básica en InsForge",
            "Diseño 'Deep Space' (Dark Mode)"
        ],
        icon: ShieldAlert,
        color: "blue",
        highlighted: false,
        btnText: "Iniciar MVP",
    },
    {
        name: "Growth Pack",
        badge: "Escala",
        price: "$5,000 - $10,000",
        period: "setup + retainer",
        description: "Pipeline Omnicanal. Para agencias que buscan escalar operaciones sin contratar más personal humano.",
        features: [
            "Módulos interconectados (CRM + Contenido)",
            "Servidor MCP dedicado (n8n)",
            "Dashboard de métricas en tiempo real",
            "Soporte prioritario y optimización continua",
            "Capacitación del equipo interno"
        ],
        icon: Zap,
        color: "indigo",
        highlighted: true, // Destacado
        btnText: "Acelerar Crecimiento",
    },
    {
        name: "Strategic Pack",
        badge: "Empresa",
        price: "$15k+",
        period: "setup custom",
        description: "IA Operating System. Transformación total con memoria institucional profunda y agentes operando el 70% de tus tareas.",
        features: [
            "Automatización del 70% de tareas repetitivas",
            "Memoria institucional profunda personalizada",
            "Sistemas multi-agente complejos",
            "Integraciones corporativas a medida",
            "SLA garantizado 99.9% Uptime"
        ],
        icon: Sparkles,
        color: "purple",
        highlighted: false,
        btnText: "Agendar Consultoría",
    }
];

export function PricingSection() {
    return (
        <section id="pricing" className="relative py-24 bg-slate-950 overflow-hidden border-t border-slate-800">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 space-y-16">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
                    >
                        <Zap size={16} />
                        <span>Modelo de Escala</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                    >
                        Precios Vinculados al <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Procesamiento</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400"
                    >
                        No pagas por horas, pagas por capacidad operativa. Nuestros paquetes crecen junto a los agentes que operan tu negocio.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={cn(
                                "relative flex flex-col rounded-3xl bg-slate-900/40 border backdrop-blur-sm transition-all duration-300",
                                plan.highlighted
                                    ? "border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.15)] lg:-translate-y-4"
                                    : "border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/60"
                            )}
                        >
                            {/* Popular Ribbon for highlighted plan */}
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full text-white text-xs font-bold tracking-wider shadow-lg">
                                    MÁS POPULAR
                                </div>
                            )}

                            <div className="p-8 pb-0">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className={cn(
                                            "inline-flex items-center justify-center p-2.5 rounded-xl mb-4",
                                            plan.color === "blue" && "bg-blue-500/10 text-blue-400",
                                            plan.color === "indigo" && "bg-indigo-500/10 text-indigo-400",
                                            plan.color === "purple" && "bg-purple-500/10 text-purple-400"
                                        )}>
                                            <plan.icon size={24} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                                        <span className="text-sm font-medium text-slate-400">{plan.badge}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium mt-1">/{plan.period}</div>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed mb-8 h-12">
                                    {plan.description}
                                </p>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-8" />
                            </div>

                            <div className="px-8 pb-8 flex-1 flex flex-col">
                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-emerald-400" />
                                            </div>
                                            <span className="text-sm text-slate-300 leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="#contact"
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300",
                                        plan.highlighted
                                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                            : "bg-slate-800 hover:bg-slate-700 text-white"
                                    )}
                                >
                                    {plan.btnText}
                                    <ChevronRight size={18} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PricingSection;
