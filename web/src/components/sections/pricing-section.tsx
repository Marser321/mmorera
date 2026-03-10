'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    BillingCycle,
    BILLING_LABELS,
    DISCOUNTS,
    PLANS
} from './pricing/constants';
import { PricingCard } from './pricing/pricing-card';
import { TrojanHorses } from './pricing/trojan-horses';
import { ServicePacks } from './pricing/service-packs';
import { FreeDemos } from './pricing/free-demos';

export function PricingSection() {
    const [billingCycle, setBillingCycle] = React.useState<BillingCycle>('trimestral');

    // Calcular el ahorro máximo dinámicamente (plan Enterprise anual)
    const maxSavings = Math.round(PLANS[2].basePrice * DISCOUNTS[billingCycle] * BILLING_LABELS[billingCycle].months);

    return (
        <section id="pricing" className="py-32 bg-transparent relative overflow-hidden">
            {/* Background Effects Premium */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* ═══════════════════════════════════════
                 * CABALLOS DE TROYA — Servicios Gancho
                 * ═══════════════════════════════════════ */}
                <TrojanHorses />

                {/* ═══════════════════════════════════════
                 * PLANES ESTRATÉGICOS
                 * ═══════════════════════════════════════ */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight uppercase">
                            Invertí en{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
                                Autonomía
                            </span>
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
                            No te vendemos una caja negra. Te enseñamos a manejar el motor.
                            <br />
                            <span className="text-white/60 font-medium">Tu equipo se queda con las herramientas y el conocimiento. Además, somos 100% transparentes: <strong className="text-emerald-400 uppercase tracking-widest text-sm ml-1">cobramos solo lo que vas a usar</strong>.</span>
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <span className="text-xs text-orange-400 font-medium">
                                * Los precios son referenciales y pueden variar según el alcance del proyecto, tiempo requerido y disponibilidad.
                            </span>
                        </div>
                    </motion.div>

                    {/* Filosofía badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 mb-8"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 backdrop-blur-xl">
                            <GraduationCap className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-300 uppercase tracking-widest">
                                Filosofía &ldquo;Enseñar a Pescar&rdquo;
                            </span>
                            <span className="text-xs text-white/40">— Capacitación incluida en cada plan</span>
                        </div>
                    </motion.div>

                    {/* Toggle Trimestral / Semestral / Anual */}
                    <div className="flex items-center justify-center gap-2 bg-black/40 w-fit mx-auto px-3 py-3 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.05)] relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                        {(Object.keys(BILLING_LABELS) as BillingCycle[]).map((cycle) => (
                            <button
                                key={cycle}
                                onClick={() => setBillingCycle(cycle)}
                                className={cn(
                                    "relative text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 font-bold px-5 py-2.5 rounded-full",
                                    billingCycle === cycle
                                        ? "bg-white/10 text-white shadow-lg"
                                        : "text-white/30 hover:text-white/60"
                                )}
                            >
                                {BILLING_LABELS[cycle].label}
                                {BILLING_LABELS[cycle].badge && (
                                    <span className="absolute -top-2 -right-1 text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                                        {BILLING_LABELS[cycle].badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Banner de Ahorro Dinámico */}
                    {maxSavings > 0 && (
                        <motion.div
                            key={billingCycle}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl">
                                <span className="text-sm text-emerald-300 font-bold">
                                    💰 Ahorrás hasta <span className="text-emerald-400 text-base font-black">${maxSavings.toLocaleString()}</span> con el plan {billingCycle}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
                    {PLANS.map((plan, index) => (
                        <PricingCard
                            key={plan.name}
                            plan={plan}
                            billing={billingCycle}
                            index={index}
                        />
                    ))}
                </div>

                {/* ═══════════════════════════════════════
                 * PAQUETES DE SERVICIOS INDIVIDUALES
                 * ═══════════════════════════════════════ */}
                <ServicePacks />

                {/* ═══════════════════════════════════════
                 * DEMOS GRATIS — "Probá Antes de Pagar"
                 * ═══════════════════════════════════════ */}
                <FreeDemos />

                {/* Sección "Enseñar a Pescar" explicativa */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 max-w-4xl mx-auto"
                >
                    <div className="relative bg-gradient-to-br from-white/[0.03] to-transparent rounded-3xl border border-white/10 p-8 md:p-12 overflow-hidden">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                                    ¿Por qué{' '}
                                    <span className="text-emerald-400">&ldquo;Enseñar a Pescar&rdquo;</span>?
                                </h3>
                                <p className="text-white/50 leading-relaxed font-light">
                                    Otros te venden dependencia perpetua. Nosotros te damos el sistema
                                    <strong className="text-white/80"> y la capacitación</strong> para que tu equipo
                                    lo domine. En 3 a 6 meses, volás solo.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    'Construimos tu infraestructura de IA',
                                    'Capacitamos a tu equipo para operarla',
                                    'Transferimos el conocimiento completo',
                                    'Tu empresa se queda con TODO',
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm text-white/70 font-medium">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default PricingSection;
