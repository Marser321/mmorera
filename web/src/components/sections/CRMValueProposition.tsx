"use client";

import { motion } from "framer-motion";
import {
    Database,
    Eye,
    History,
    LineChart,
    Users,
    Workflow,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Datos ─── */
const VALUE_BLOCKS = [
    { icon: Database, key: "block1" },
    { icon: History, key: "block2" },
    { icon: LineChart, key: "block3" },
] as const;

const ORBIT_NODES = [
    { icon: Users, key: "orbit_contactos", angle: 0 },
    { icon: Workflow, key: "orbit_workflows", angle: 72 },
    { icon: Eye, key: "orbit_pipeline", angle: 144 },
    { icon: LineChart, key: "orbit_reporting", angle: 216 },
    { icon: History, key: "orbit_historial", angle: 288 },
];

/* Variantes de animación */
const blockVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            delay: 0.15 + i * 0.12,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
};

/* ─── Componente principal ─── */
export function CRMValueProposition() {
    const { t } = useLanguage();
    return (
        <section
            id="valor-crm"
            className="relative overflow-hidden py-20 md:py-28"
            aria-labelledby="valor-crm-heading"
        >
            {/* Fondo sutil */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,245,178,0.08),transparent_50%)]" />

            <Container className="relative z-10">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    {/* ─── Columna izquierda: Texto ─── */}
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                                {t('crm_value', 'eyebrow')}
                            </div>
                            <h2
                                id="valor-crm-heading"
                                className="max-w-2xl font-heading text-3xl tracking-tight text-white md:text-5xl lg:text-6xl"
                            >
                                {t('crm_value', 'title')}
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                                {t('crm_value', 'intro')}
                            </p>
                        </motion.div>

                        <div className="mt-10 space-y-5">
                            {VALUE_BLOCKS.map((block, i) => {
                                const Icon = block.icon;
                                return (
                                    <motion.div
                                        key={block.key}
                                        custom={i}
                                        variants={blockVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        className="group flex gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-colors duration-300 hover:border-primary/25 hover:bg-primary/[0.04]"
                                    >
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
                                                {t('crm_value', `${block.key}_title`)}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-white/52">
                                                {t('crm_value', `${block.key}_desc`)}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-8"
                        >
                            <a
                                href="#flujo-ghl"
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-white"
                            >
                                {t('crm_value', 'cta')}
                            </a>
                        </motion.div>
                    </div>

                    {/* ─── Columna derecha: Diagrama orbital ─── */}
                    <motion.div
                        className="relative mx-auto aspect-square w-full max-w-[380px]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Anillo orbital SVG */}
                        <svg
                            className="absolute inset-0 h-full w-full"
                            viewBox="0 0 380 380"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#10F5B2" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#10F5B2" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="190"
                                cy="190"
                                r="140"
                                fill="none"
                                stroke="url(#orbitGrad)"
                                strokeWidth="1.5"
                                strokeDasharray="6 8"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 190 190"
                                    to="360 190 190"
                                    dur="60s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            {/* Anillo interior sutil */}
                            <circle
                                cx="190"
                                cy="190"
                                r="80"
                                fill="none"
                                stroke="#10F5B2"
                                strokeWidth="0.5"
                                strokeDasharray="3 6"
                                opacity="0.2"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="360 190 190"
                                    to="0 190 190"
                                    dur="45s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </svg>

                        {/* Núcleo central */}
                        <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-black/60 shadow-[0_0_40px_rgba(16,245,178,0.3)] backdrop-blur-xl">
                            <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-primary">
                                CRM
                            </span>
                        </div>

                        {/* Nodos orbitales */}
                        {ORBIT_NODES.map((node, i) => {
                            const Icon = node.icon;
                            const rad = ((node.angle - 90) * Math.PI) / 180;
                            const radius = 140;
                            const cx = 190 + radius * Math.cos(rad);
                            const cy = 190 + radius * Math.sin(rad);
                            // Convertir a porcentaje del contenedor
                            const leftPct = (cx / 380) * 100;
                            const topPct = (cy / 380) * 100;

                            return (
                                <div
                                    key={node.key}
                                    className="absolute z-10"
                                    style={{
                                        left: `${leftPct}%`,
                                        top: `${topPct}%`,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <motion.div
                                        data-orbit-node
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                                    >
                                        <div data-orbit-dot className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-black/50 text-primary shadow-[0_0_18px_rgba(16,245,178,0.2)] backdrop-blur-xl">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span data-orbit-label className="absolute left-1/2 top-full mt-1.5 w-24 -translate-x-1/2 text-center font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">
                                            {t('crm_value', node.key)}
                                        </span>
                                    </motion.div>
                                </div>
                            );
                        })}

                        {/* Glow de fondo */}
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
