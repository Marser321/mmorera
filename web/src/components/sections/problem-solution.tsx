'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    Bot,
    Clock3,
    FileWarning,
    MessageCircleOff,
    Radar,
    Sparkles,
    Zap,
} from 'lucide-react';

const PAIN_POINTS = [
    { label: 'Respuesta lenta', detail: 'Leads enfriándose antes del primer contacto.', icon: Clock3 },
    { label: 'Operación manual', detail: 'Tareas repetidas que consumen foco comercial.', icon: FileWarning },
    { label: 'Seguimiento débil', detail: 'Oportunidades que se pierden entre canales.', icon: MessageCircleOff },
];

const SYSTEM_STEPS = ['Captación', 'Calificación', 'Seguimiento'];

export function ProblemSolution() {
    return (
        <section className="relative overflow-hidden border-y border-white/5 bg-[#030807] px-4 py-14 pb-28 sm:px-6 md:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(239,68,68,0.13),transparent_34%),radial-gradient(circle_at_82%_58%,rgba(16,185,129,0.16),transparent_38%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

            <div className="container relative z-10 mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">
                        <Radar className="h-4 w-4 text-emerald-400" />
                        Diagnóstico operativo
                    </div>
                    <h2 className="mx-auto max-w-4xl text-3xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl md:text-6xl text-balance">
                        De fuga comercial a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-500">
                            sistema activo.
                        </span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-lg">
                        Detectamos dónde se pierden oportunidades y armamos la infraestructura CRM para responder, nutrir y convertir más rápido.
                    </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
                    <ProblemPanel />
                    <Bridge />
                    <SolutionPanel />
                </div>
            </div>
        </section>
    );
}

function ProblemPanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-red-950/[0.18] p-6 shadow-2xl md:p-8"
        >
            <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-red-500/15 blur-[90px]" />
            <div className="relative z-10">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-red-300">
                    <AlertTriangle className="h-4 w-4" />
                    Fuga de ingresos
                </div>

                <h3 className="max-w-lg text-2xl font-black leading-tight text-white sm:text-4xl">
                    Cada minuto sin sistema deja oportunidades abiertas.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                    Cuando marketing, atención y ventas trabajan desconectados, el lead espera, compara y se va.
                </p>

                <div className="mt-8 grid gap-3">
                    {PAIN_POINTS.map((item) => (
                        <div key={item.label} className="flex gap-3 rounded-2xl border border-white/8 bg-black/25 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                                <item.icon className="h-5 w-5 text-red-300" />
                            </div>
                            <div>
                                <p className="font-bold text-white">{item.label}</p>
                                <p className="mt-1 text-sm leading-relaxed text-white/45">{item.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function Bridge() {
    return (
        <div className="flex items-center justify-center py-1 lg:px-1 lg:py-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 shadow-[0_0_40px_rgba(16,185,129,0.18)] lg:h-14 lg:w-14">
                <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
            </div>
        </div>
    );
}

function SolutionPanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950/[0.18] p-6 shadow-2xl md:p-8"
        >
            <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-emerald-500/18 blur-[100px]" />
            <div className="relative z-10">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                    <Bot className="h-4 w-4" />
                    Infraestructura activa
                </div>

                <h3 className="max-w-lg text-2xl font-black leading-tight text-white sm:text-4xl">
                    Un ecosistema que responde, ordena y convierte.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                    Conectamos campañas, web, GoHighLevel e IA para que cada contacto tenga dueño, contexto y siguiente paso.
                </p>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-5">
                    <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/70">Estado</p>
                            <p className="mt-1 font-bold text-white">Sistema listo para operar</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-black shadow-[0_0_24px_rgba(52,211,153,0.35)]">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {SYSTEM_STEPS.map((label, index) => (
                            <div key={label}>
                                <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                                    <span>{label}</span>
                                    <span>Activo</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        initial={{ width: '16%' }}
                                        whileInView={{ width: '100%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.1, delay: index * 0.16 }}
                                        className="h-full rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.7)]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/aplicar"
                        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-6 py-4 text-sm font-black uppercase text-black transition hover:bg-white active:scale-[0.98] sm:w-auto"
                    >
                        Activar ecosistema
                        <Zap className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
