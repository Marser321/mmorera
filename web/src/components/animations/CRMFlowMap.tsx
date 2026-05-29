"use client";

import { motion } from "framer-motion";
import {
    BarChart2,
    Bot,
    CalendarDays,
    Gauge,
    Inbox,
    MessageSquareText,
    Send,
} from "lucide-react";

/* Variantes para stagger en mobile */
const mobileCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

const FLOW_STEPS = [
    { title: "Lead entra", detail: "Ads, landing o referido.", icon: Inbox },
    { title: "GHL captura", detail: "Fuente, etiqueta y contacto.", icon: Gauge },
    { title: "IA califica", detail: "Fit, urgencia e intención.", icon: Bot },
    { title: "Nurturing", detail: "WhatsApp + email contextual.", icon: MessageSquareText },
    { title: "Agenda", detail: "Reunión sin fricción.", icon: CalendarDays },
    { title: "Pipeline", detail: "Tarea, dueño y etapa.", icon: Send },
    { title: "Dashboard", detail: "Medición para ajustar.", icon: BarChart2 },
] as const;

export function CRMFlowMap() {
    return (
        <section
            id="flujo-ghl"
            className="relative overflow-hidden py-20 md:py-28"
            aria-labelledby="flujo-ghl-heading"
        >
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                        Flujo conectado
                    </div>
                    <h2
                        id="flujo-ghl-heading"
                        className="font-heading text-4xl tracking-tight text-white md:text-6xl"
                    >
                        Del primer contacto al cierre, sin perder señales
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        GoHighLevel funciona como centro de mando: cada interacción alimenta el CRM, activa el siguiente paso y deja evidencia para decidir mejor.
                    </p>
                </div>

                <div className="relative mx-auto hidden max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#050706]/90 p-5 backdrop-blur-xl md:block">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:74px_74px] opacity-30" />
                    <div className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/55 to-transparent" />

                    {/* Dot viajero — SVG overlay con animateMotion (GPU-accelerated, sin repaints) */}
                    <svg
                        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                        viewBox="0 0 1000 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <defs>
                            <filter id="dotGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <path id="flowDotPath" d="M 70 50 L 930 50" fill="none" stroke="none" />
                        <rect rx="6" ry="6" width="32" height="10" y="-5" fill="#10F5B2" filter="url(#dotGlow)">
                            <animateMotion
                                dur="6.5s"
                                repeatCount="indefinite"
                                calcMode="spline"
                                keySplines="0.42 0 0.58 1"
                                keyTimes="0;1"
                            >
                                <mpath href="#flowDotPath" />
                            </animateMotion>
                        </rect>
                    </svg>

                    <div className="relative z-10 grid grid-cols-7 gap-3">
                        {FLOW_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.article
                                    key={step.title}
                                    className="relative min-h-56 rounded-2xl border border-white/10 bg-black/55 p-4 text-left shadow-[0_16px_45px_rgba(0,0,0,0.32)]"
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.45, delay: index * 0.05 }}
                                >
                                    <div className="mb-5 flex items-center justify-between">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="font-mono text-[10px] font-black text-white/25">
                                            0{index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.13em] text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-3 text-xs leading-relaxed text-white/50">{step.detail}</p>
                                    <div className="absolute bottom-4 left-4 right-4 h-1 overflow-hidden rounded-full bg-white/8">
                                        <motion.div
                                            className="h-full rounded-full bg-primary shadow-[0_0_8px_rgba(16,245,178,0.6)]"
                                            initial={{ width: "0%" }}
                                            whileInView={{ width: "100%" }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.75, delay: 0.18 + index * 0.08 }}
                                        />
                                    </div>
                                    {index < FLOW_STEPS.length - 1 && (
                                        <span
                                            className="absolute -right-2 top-1/2 z-30 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-[#071813]"
                                            aria-hidden="true"
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        </span>
                                    )}
                                </motion.article>
                            );
                        })}
                    </div>
                </div>

                <div className="mx-auto grid max-w-xl gap-0 md:hidden">
                    {FLOW_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.article
                                key={step.title}
                                className="relative pb-4"
                                custom={index}
                                variants={mobileCardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-5%" }}
                            >
                                {index < FLOW_STEPS.length - 1 && (
                                    <span className="absolute bottom-0 left-6 top-14 w-px bg-primary/35" aria-hidden="true" />
                                )}
                                <div className="relative rounded-2xl border border-white/10 bg-black/40 p-4">
                                    <div className="flex gap-4">
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <div className="font-mono text-[10px] font-black text-primary/70">
                                                0{index + 1}
                                            </div>
                                            <h3 className="mt-1 text-sm font-black uppercase tracking-[0.13em] text-white">
                                                {step.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-relaxed text-white/52">{step.detail}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
