"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, PiggyBank, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
    {
        id: "leads",
        title: "+80%",
        subtitle: "Leads Cualificados",
        description: "Automatización ininterrumpida que filtra el ruido y te entrega solo oportunidades reales.",
        icon: Target,
        color: "text-blue-400",
        glow: "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
        border: "border-blue-500/20",
    },
    {
        id: "speed",
        title: "< 5 Min",
        subtitle: "Tiempo de Respuesta",
        description: "Multiplica x21 tu probabilidad de cierre. El 78% del B2B compra al primero que responde.",
        icon: Clock,
        color: "text-emerald-400",
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
        border: "border-emerald-500/20",
    },
    {
        id: "costs",
        title: "-35%",
        subtitle: "Costos Operativos",
        description: "El poder de un Equipo Extendido de IA sin inflar nóminas ni horas extra.",
        icon: PiggyBank,
        color: "text-violet-400",
        glow: "shadow-[0_0_30px_rgba(139,92,246,0.2)]",
        border: "border-violet-500/20",
    },
    {
        id: "roi",
        title: "+20%",
        subtitle: "ROI de Ventas",
        description: "Testing A/B continuo y optimización predictiva que impactan directo en el margen.",
        icon: TrendingUp,
        color: "text-orange-400",
        glow: "shadow-[0_0_30px_rgba(249,115,22,0.2)]",
        border: "border-orange-500/20",
    }
];

export function MetricsShowcase() {
    return (
        <section className="py-20 relative bg-black overflow-hidden border-b border-white/5">
            {/* Background Mesh/Glow */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[200px] bg-primary/5 blur-[100px] rounded-[100%] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "group relative p-8 rounded-3xl bg-white/[0.02] border transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm overflow-hidden",
                                metric.border,
                                metric.glow
                            )}
                        >
                            {/* Inner ambient glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col items-start">
                                <metric.icon className={cn("w-8 h-8 mb-6", metric.color)} />
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                                    {metric.title}
                                </h3>
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-4">
                                    {metric.subtitle}
                                </h4>
                                <p className="text-sm text-balance text-white/40 leading-relaxed font-medium">
                                    {metric.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
