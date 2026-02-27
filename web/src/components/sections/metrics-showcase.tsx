"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { TrendingUp, Clock, PiggyBank, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════
 * CONFIGURACIÓN DE MÉTRICAS
 * ═══════════════════════════════════════════════════ */

interface MetricConfig {
    id: string;
    numericValue: number;
    prefix: string;
    suffix: string;
    subtitle: string;
    description: string;
    icon: typeof Target;
    color: string;
    svgColor: string;
    glow: string;
    border: string;
    progress: number; // 0-100 para el SVG ring
}

const metrics: MetricConfig[] = [
    {
        id: "leads",
        numericValue: 80,
        prefix: "+",
        suffix: "%",
        subtitle: "Leads Cualificados",
        description: "Automatización ininterrumpida que filtra el ruido y te entrega solo oportunidades reales.",
        icon: Target,
        color: "text-blue-400",
        svgColor: "#3b82f6",
        glow: "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
        border: "border-blue-500/20",
        progress: 80,
    },
    {
        id: "speed",
        numericValue: 5,
        prefix: "< ",
        suffix: " Min",
        subtitle: "Tiempo de Respuesta",
        description: "Multiplica x21 tu probabilidad de cierre. El 78% del B2B compra al primero que responde.",
        icon: Clock,
        color: "text-emerald-400",
        svgColor: "#10b981",
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
        border: "border-emerald-500/20",
        progress: 95,
    },
    {
        id: "costs",
        numericValue: 35,
        prefix: "-",
        suffix: "%",
        subtitle: "Costos Operativos",
        description: "El poder de un Equipo Extendido de IA sin inflar nóminas ni horas extra.",
        icon: PiggyBank,
        color: "text-violet-400",
        svgColor: "#8b5cf6",
        glow: "shadow-[0_0_30px_rgba(139,92,246,0.2)]",
        border: "border-violet-500/20",
        progress: 65,
    },
    {
        id: "roi",
        numericValue: 20,
        prefix: "+",
        suffix: "%",
        subtitle: "ROI de Ventas",
        description: "Testing A/B continuo y optimización predictiva que impactan directo en el margen.",
        icon: TrendingUp,
        color: "text-orange-400",
        svgColor: "#f97316",
        glow: "shadow-[0_0_30px_rgba(249,115,22,0.2)]",
        border: "border-orange-500/20",
        progress: 70,
    }
];

/* ═══════════════════════════════════════════════════
 * CONTADOR ANIMADO
 * ═══════════════════════════════════════════════════ */

function AnimatedMetricCounter({ metric }: { metric: MetricConfig }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, metric.numericValue, {
                duration: 1.8,
                ease: [0.16, 1, 0.3, 1],
            });
            return controls.stop;
        }
    }, [isInView, count, metric.numericValue]);

    return (
        <h3 ref={ref} className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:animate-pulse">
            {metric.prefix}<motion.span>{rounded}</motion.span>{metric.suffix}
        </h3>
    );
}

/* ═══════════════════════════════════════════════════
 * SVG PROGRESS RING
 * ═══════════════════════════════════════════════════ */

function ProgressRing({ progress, color, isInView }: { progress: number; color: string; isInView: boolean }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="absolute -inset-1">
            {/* Track */}
            <circle
                cx="36" cy="36" r={radius}
                fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="3"
            />
            {/* Progress */}
            <motion.circle
                cx="36" cy="36" r={radius}
                fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: isInView ? strokeDashoffset : circumference }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                transform="rotate(-90 36 36)"
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════
 * COMPONENTE PRINCIPAL
 * ═══════════════════════════════════════════════════ */

export function MetricsShowcase() {
    return (
        <section className="py-20 relative bg-black overflow-hidden border-b border-white/5">
            {/* Background Mesh/Glow */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[200px] bg-primary/5 blur-[100px] rounded-[100%] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => (
                        <MetricCard key={metric.id} metric={metric} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function MetricCard({ metric, index }: { metric: MetricConfig; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const Icon = metric.icon;

    return (
        <motion.div
            ref={ref}
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
                {/* Icon con SVG Progress Ring */}
                <div className="relative w-[70px] h-[70px] mb-6 flex items-center justify-center">
                    <ProgressRing progress={metric.progress} color={metric.svgColor} isInView={isInView} />
                    <Icon className={cn("w-7 h-7 relative z-10", metric.color)} />
                </div>

                {/* Contador Animado */}
                <AnimatedMetricCounter metric={metric} />

                <h4 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-4">
                    {metric.subtitle}
                </h4>
                <p className="text-sm text-balance text-white/40 leading-relaxed font-medium">
                    {metric.description}
                </p>
            </div>
        </motion.div>
    );
}
