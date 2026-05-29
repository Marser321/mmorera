"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useTransform, MotionValue } from "framer-motion";
import { Clock, Percent, Timer, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";

/* ─── Datos de métricas ─── */
const METRICS = [
    {
        icon: Clock,
        value: 83,
        prefix: "-",
        suffix: "%",
        label: "Tiempo de respuesta",
        detail: "De 60 min promedio a menos de 10 min con automatización.",
        source: "HubSpot Research",
        tone: "text-sky-400",
        toneBg: "bg-sky-400",
        toneBorder: "border-sky-400/20",
        toneBgSoft: "bg-sky-400/10",
    },
    {
        icon: TrendingUp,
        value: 34,
        prefix: "+",
        suffix: "%",
        label: "Tasa de conversión",
        detail: "Pipeline estructurado con scoring IA prioriza leads calientes.",
        source: "Benchmark operativo",
        tone: "text-primary",
        toneBg: "bg-primary",
        toneBorder: "border-primary/20",
        toneBgSoft: "bg-primary/10",
    },
    {
        icon: Timer,
        value: 15,
        prefix: "",
        suffix: "h/sem",
        label: "Horas ahorradas",
        detail: "Gestión manual eliminada con workflows y respuestas automáticas.",
        source: "Salesforce State of Marketing",
        tone: "text-violet-400",
        toneBg: "bg-violet-400",
        toneBorder: "border-violet-400/20",
        toneBgSoft: "bg-violet-400/10",
    },
    {
        icon: Percent,
        value: 21,
        prefix: "",
        suffix: "×",
        label: "Probabilidad de venta",
        detail: "Responder en menos de 1 minuto multiplica la conversión.",
        source: "Lead Response Study",
        tone: "text-amber-300",
        toneBg: "bg-amber-300",
        toneBorder: "border-amber-300/20",
        toneBgSoft: "bg-amber-300/10",
    },
] as const;

/* ─── Counter animado ─── */
function AnimatedCounter({
    targetValue,
    prefix,
    suffix,
    isInView,
}: {
    targetValue: number;
    prefix: string;
    suffix: string;
    isInView: boolean;
}) {
    const spring = useSpring(0, { stiffness: 50, damping: 20 });

    // Disparar la animación cuando entra en vista
    if (isInView) {
        spring.set(targetValue);
    }

    const display = useTransform(spring, (v: number) => `${prefix}${Math.round(v)}${suffix}`);

    return <AnimatedCounterDisplay value={display} />;
}

function AnimatedCounterDisplay({ value }: { value: MotionValue<string> }) {
    return (
        <motion.span className="text-4xl font-black text-white md:text-5xl">
            {value}
        </motion.span>
    );
}

/* ─── Componente principal ─── */
export function CRMMetricsImpact() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

    return (
        <section
            ref={sectionRef}
            id="metricas-crm"
            className="relative overflow-hidden py-20 md:py-28"
            aria-labelledby="metricas-crm-heading"
        >
            {/* Fondo */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,245,178,0.06),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] opacity-15" />

            <Container className="relative z-10">
                {/* Header */}
                <motion.div
                    className="mx-auto mb-14 max-w-3xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                        Impacto medible
                    </div>
                    <h2
                        id="metricas-crm-heading"
                        className="font-heading text-3xl tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        Resultados que se sienten en la operación
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Estos números no son proyecciones teóricas. Son benchmarks de operaciones que pasaron de gestionar leads a mano a usar un CRM con automatizaciones e IA.
                    </p>
                </motion.div>

                {/* Grid de métricas */}
                <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {METRICS.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <motion.article
                                key={metric.label}
                                className={`relative overflow-hidden rounded-2xl border ${metric.toneBorder} bg-[#050706]/80 p-5 backdrop-blur-xl`}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: index * 0.1 }}
                            >
                                {/* Glow superior */}
                                <div className={`absolute inset-x-0 top-0 h-px ${metric.toneBg} opacity-40`} />
                                <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${metric.toneBgSoft} blur-[50px]`} />

                                <div className="relative z-10">
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.toneBorder} ${metric.toneBgSoft} ${metric.tone}`}>
                                        <Icon className="h-5 w-5" />
                                    </span>

                                    <div className="mt-5">
                                        <AnimatedCounter
                                            targetValue={metric.value}
                                            prefix={metric.prefix}
                                            suffix={metric.suffix}
                                            isInView={isInView}
                                        />
                                    </div>

                                    <h3 className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-white">
                                        {metric.label}
                                    </h3>
                                    <p className="mt-2 text-xs leading-relaxed text-white/48">
                                        {metric.detail}
                                    </p>

                                    {/* Fuente */}
                                    <div className="mt-4 border-t border-white/8 pt-3">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                                            Fuente: {metric.source}
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
