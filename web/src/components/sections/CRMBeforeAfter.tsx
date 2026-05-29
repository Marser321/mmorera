"use client";

import { motion } from "framer-motion";
import {
    AlertTriangle,
    ArrowRight,
    BotMessageSquare,
    CalendarCheck,
    CheckCircle2,
    FileSpreadsheet,
    Gauge,
    MailX,
    MessageSquareOff,
    PieChart,
    Timer,
    Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";

/* ─── Datos ─── */
const BEFORE_ITEMS = [
    { icon: FileSpreadsheet, text: "Leads en hojas de cálculo o peor, en la cabeza" },
    { icon: MessageSquareOff, text: "Seguimiento por memoria — se pierde el hilo" },
    { icon: MailX, text: "Emails manuales sin personalización ni timing" },
    { icon: Timer, text: "Respuesta promedio: horas o días" },
    { icon: AlertTriangle, text: "Cero visibilidad de pipeline o conversión" },
] as const;

const AFTER_ITEMS = [
    { icon: Gauge, text: "Leads capturados y calificados automáticamente" },
    { icon: BotMessageSquare, text: "Secuencias inteligentes activas 24/7" },
    { icon: PieChart, text: "Pipeline en tiempo real con dueños y etapas" },
    { icon: Zap, text: "IA responde en menos de 60 segundos" },
    { icon: CalendarCheck, text: "Agenda sin fricción integrada al flujo" },
] as const;

/* Variantes */
const panelVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

/* ─── Componente principal ─── */
export function CRMBeforeAfter() {
    return (
        <section
            id="antes-despues-crm"
            className="relative overflow-hidden border-y border-white/5 bg-[#030807] py-20 md:py-28"
            aria-labelledby="antes-despues-heading"
        >
            {/* Fondos decorativos */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(239,68,68,0.1),transparent_35%),radial-gradient(circle_at_85%_60%,rgba(16,245,178,0.12),transparent_40%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

            <Container className="relative z-10">
                {/* Header */}
                <motion.div
                    className="mx-auto mb-14 max-w-3xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                        Transformación real
                    </div>
                    <h2
                        id="antes-despues-heading"
                        className="font-heading text-3xl tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        De operación manual a{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white/90 to-primary">
                            sistema activo
                        </span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Así se ve la diferencia entre gestionar clientes "a mano" y tener un CRM operativo con automatizaciones e IA.
                    </p>
                </motion.div>

                {/* Grid Before / After */}
                <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
                    {/* ─── Panel ANTES ─── */}
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-8%" }}
                        className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-red-950/[0.15] p-6 shadow-2xl md:p-8"
                    >
                        <div className="pointer-events-none absolute -left-16 top-4 h-48 w-48 rounded-full bg-red-500/15 blur-[80px]" />
                        <div className="relative z-10">
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-red-300">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Sin CRM
                            </div>
                            <h3 className="text-2xl font-black text-white sm:text-3xl">
                                Operación desconectada
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/50">
                                Información dispersa, sin procesos claros ni visibilidad de la operación comercial.
                            </p>

                            <div className="mt-8 space-y-3">
                                {BEFORE_ITEMS.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.text}
                                            custom={i}
                                            variants={itemVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="flex items-start gap-3 rounded-xl border border-white/6 bg-black/20 p-3"
                                        >
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                                                <Icon className="h-4 w-4 text-red-300" />
                                            </span>
                                            <span className="text-sm leading-snug text-white/60">{item.text}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Barra de "performance" baja */}
                            <div className="mt-8 rounded-xl border border-white/8 bg-black/30 p-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-white/40">Conversión estimada</span>
                                    <span className="font-mono font-bold text-red-300">~3%</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        className="h-full rounded-full bg-red-400/60"
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "12%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── Puente central ─── */}
                    <div className="flex items-center justify-center py-2 lg:px-2 lg:py-0">
                        <motion.div
                            className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-[0_0_40px_rgba(16,245,178,0.2)]"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
                        </motion.div>
                    </div>

                    {/* ─── Panel DESPUÉS ─── */}
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-8%" }}
                        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-emerald-950/[0.12] p-6 shadow-2xl md:p-8"
                    >
                        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-primary/15 blur-[90px]" />
                        <div className="relative z-10">
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Con CRM + IA
                            </div>
                            <h3 className="text-2xl font-black text-white sm:text-3xl">
                                Sistema que convierte
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/55">
                                Cada lead tiene dueño, contexto y siguiente paso automatizado desde el primer contacto.
                            </p>

                            <div className="mt-8 space-y-3">
                                {AFTER_ITEMS.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.text}
                                            custom={i}
                                            variants={itemVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="flex items-start gap-3 rounded-xl border border-white/6 bg-black/20 p-3"
                                        >
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                                                <Icon className="h-4 w-4 text-primary" />
                                            </span>
                                            <span className="text-sm leading-snug text-white/65">{item.text}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Barra de "performance" alta */}
                            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.06] p-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-primary">Conversión estimada</span>
                                    <span className="font-mono font-bold text-primary">+34%</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(16,245,178,0.7)]"
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "78%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
