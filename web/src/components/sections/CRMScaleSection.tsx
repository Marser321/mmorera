"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Building2, UserRoundCheck } from "lucide-react";
import { Container } from "@/components/ui/container";

const CRM_SCALES = [
    {
        title: "Freelancer",
        subtitle: "Nunca más depender de memoria",
        description: "Capturás consultas, respondés más rápido, agendás reuniones y sabés qué oportunidad necesita seguimiento.",
        points: ["Inbox centralizado", "Agenda automática", "Recordatorios simples"],
        metrics: ["1 usuario", "3 canales", "Agenda"],
        icon: UserRoundCheck,
    },
    {
        title: "Equipo comercial",
        subtitle: "Todos venden desde el mismo mapa",
        description: "Cada vendedor ve pipeline, tareas, conversaciones y próximos pasos sin duplicar planillas ni perseguir información.",
        points: ["Pipeline por etapa", "Tareas y handoff", "WhatsApp + email"],
        metrics: ["Roles", "Pipeline", "Tareas"],
        icon: BriefcaseBusiness,
    },
    {
        title: "Operación grande",
        subtitle: "Escalar sin perder control",
        description: "GHL se conecta con reporting, campañas, IA y procesos humanos para medir conversión y ordenar decisiones.",
        points: ["Dashboards ejecutivos", "Automatizaciones por segmento", "Control de performance"],
        metrics: ["Reporting", "IA", "SLA"],
        icon: Building2,
    },
] as const;

/* Variantes de entrada para las cards */
const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: i * 0.12,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
};

const bulletVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.35, delay: 0.4 + i * 0.08 },
    }),
};

export function CRMScaleSection() {
    return (
        <section className="relative py-20 md:py-28" aria-labelledby="crm-scale-heading">
            <Container className="relative z-10">
                <motion.div
                    className="mx-auto mb-12 max-w-3xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                        CRM segun escala
                    </div>
                    <h2
                        id="crm-scale-heading"
                        className="font-heading text-4xl tracking-tight text-white md:text-6xl"
                    >
                        El mismo sistema, distinto nivel de operación
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Un CRM bien armado no es solo para corporaciones. Sirve para ordenar tu primer flujo de clientes o coordinar equipos grandes con reglas claras.
                    </p>
                </motion.div>

                <div className="relative mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
                    {/* Línea decorativa animada */}
                    <motion.div
                        className="pointer-events-none absolute left-[16%] right-[16%] top-20 hidden h-px md:block"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ background: "linear-gradient(90deg, transparent, rgba(16,245,178,0.35), transparent)" }}
                    />
                    {CRM_SCALES.map((scale, index) => {
                        const Icon = scale.icon;
                        return (
                            <motion.article
                                key={scale.title}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-8%" }}
                                className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#050706]/80 p-5 backdrop-blur-xl transition-colors duration-300 hover:border-primary/25 hover:bg-primary/[0.035]"
                            >
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
                                <div className="absolute right-4 top-4 font-mono text-5xl font-black text-white/[0.035]">
                                    0{index + 1}
                                </div>
                                <div className="relative z-10">
                                    <div className="mb-6 flex items-center justify-between">
                                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                                            <Icon className="h-6 w-6" />
                                        </span>
                                        <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                                            módulo {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white">{scale.title}</h3>
                                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-primary/80">
                                        {scale.subtitle}
                                    </p>
                                    <p className="mt-4 min-h-20 text-sm leading-relaxed text-white/55 md:min-h-24">
                                        {scale.description}
                                    </p>

                                    <div className="mt-6 grid grid-cols-3 gap-2">
                                        {scale.metrics.map((metric) => (
                                            <div
                                                key={metric}
                                                className="rounded-xl border border-white/8 bg-white/[0.035] px-2 py-2 text-center"
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">
                                                    {metric}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 h-px bg-white/10" />
                                    <ul className="mt-5 space-y-3">
                                        {scale.points.map((point, pIdx) => (
                                            <motion.li
                                                key={point}
                                                custom={pIdx}
                                                variants={bulletVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                className="flex items-center gap-3 text-sm text-white/60"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                {point}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
