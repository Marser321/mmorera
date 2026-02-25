'use client';

import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Check, Zap, Rocket, Crown, GraduationCap, ArrowRight, PenTool, Share2, Monitor, ShoppingCart, Video, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════
 * PLANES ESTRATÉGICOS — Modelo "Enseñar a Pescar"
 * Trimestral / Semestral / Anual con descuentos
 * ═══════════════════════════════════════════════════ */

type BillingCycle = 'trimestral' | 'semestral' | 'anual';

// Descuentos progresivos por compromiso
const DISCOUNTS: Record<BillingCycle, number> = {
    trimestral: 0,
    semestral: 0.10,
    anual: 0.20,
};

const BILLING_LABELS: Record<BillingCycle, { label: string; badge?: string; months: number }> = {
    trimestral: { label: 'Trimestral', months: 3 },
    semestral: { label: 'Semestral', badge: '-10%', months: 6 },
    anual: { label: 'Anual', badge: '-20%', months: 12 },
};

interface Plan {
    name: string;
    subtitle: string;
    description: string;
    basePrice: number; // precio base mensual (sin descuento)
    icon: React.ElementType;
    features: string[];
    capacitacion: string;
    highlight: boolean;
    badge?: string;
    accentColor: string;
    accentGlow: string;
}

const PLANS: Plan[] = [
    {
        name: 'Piloto Automático',
        subtitle: 'Starter',
        description: 'Tu primer agente IA operativo en 48 horas. Ideal para validar el impacto de la automatización sin riesgo.',
        basePrice: 299,
        icon: Zap,
        features: [
            'Bot WhatsApp FAQ 24/7',
            '1 Automatización Core (n8n)',
            'Dashboard de Métricas Básico',
            'Soporte por Email',
        ],
        capacitacion: 'Onboarding de 1 mes para tu equipo',
        highlight: false,
        accentColor: 'text-emerald-400',
        accentGlow: 'rgba(16, 185, 129, 0.15)',
    },
    {
        name: 'Crecimiento Acelerado',
        subtitle: 'Growth',
        description: 'El motor completo de conversión B2B. CRM inteligente + automatizaciones multicapa + capacitación real.',
        basePrice: 799,
        icon: Rocket,
        features: [
            'CRM Autopilot + Lead Scoring',
            '3 Automatizaciones Avanzadas',
            'Testing A/B Continuo',
            'Reporting ROI en Tiempo Real',
            'Capacitación Equipo (3 meses)',
            'Soporte Prioritario WhatsApp',
        ],
        capacitacion: '3 meses de capacitación intensiva',
        highlight: true,
        badge: 'MÁS POPULAR',
        accentColor: 'text-blue-400',
        accentGlow: 'rgba(59, 130, 246, 0.15)',
    },
    {
        name: 'Autonomía Total',
        subtitle: 'Enterprise',
        description: 'Infraestructura completa de IA + transferencia total de conocimiento. Tu equipo vuela solo en 6 meses.',
        basePrice: 1499,
        icon: Crown,
        features: [
            'RAG Corporativo Auto-actualizable',
            '5+ Automatizaciones Full-Stack',
            'Agentes IA Personalizados',
            'Integración ERP / CRM Legacy',
            'Capacitación Completa (6 meses)',
            'Transferencia Total de Conocimiento',
            'Acceso Directo a Ingeniería',
        ],
        capacitacion: '6 meses de capacitación + transferencia total',
        highlight: false,
        accentColor: 'text-violet-400',
        accentGlow: 'rgba(139, 92, 246, 0.15)',
    }
];

/* ═══════════════════════════════════════════════════
 * PAQUETES DE SERVICIOS INDIVIDUALES
 * Precios provisorios — se actualizan con los reales
 * ═══════════════════════════════════════════════════ */
interface ServicePack {
    name: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    includes: string[];
    price: string;
    period: string;
}

const SERVICE_PACKS: ServicePack[] = [
    {
        name: 'Creación de Contenido',
        description: 'Copywriting, guiones, carruseles y newsletters listas para publicar.',
        icon: PenTool,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-500/10 border-orange-500/20',
        includes: ['8 Posts/mes', 'Copys SEO', 'Carruseles', 'Newsletter'],
        price: '450',
        period: 'mes',
    },
    {
        name: 'Social Media Manager',
        description: 'Gestión integral de tus redes sociales con estrategia y reportes.',
        icon: Share2,
        iconColor: 'text-pink-400',
        iconBg: 'bg-pink-500/10 border-pink-500/20',
        includes: ['Calendario Editorial', 'Publicación Diaria', 'Community Manager', 'Reporte Mensual'],
        price: '600',
        period: 'mes',
    },
    {
        name: 'Web & Landing Page',
        description: 'Diseño y desarrollo de presencia digital de alto impacto.',
        icon: Monitor,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
        includes: ['Diseño UX/UI', 'SEO Técnico', 'Hosting 1 Año', 'Analytics'],
        price: '1,500',
        period: 'proyecto',
    },
    {
        name: 'E-commerce',
        description: 'Tiendas online construidas para convertir y escalar.',
        icon: ShoppingCart,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        includes: ['Catálogo Ilimitado', 'Pasarela de Pagos', 'Checkout 1-Clic', 'Recuperación Carritos'],
        price: '3,500',
        period: 'proyecto',
    },
    {
        name: 'Producción Audiovisual',
        description: 'Contenido de video profesional: reels, spots y UGC.',
        icon: Video,
        iconColor: 'text-violet-400',
        iconBg: 'bg-violet-500/10 border-violet-500/20',
        includes: ['Guión', 'Grabación 4K', 'Edición Pro', 'Reels & Shorts'],
        price: '800',
        period: 'proyecto',
    },
    {
        name: 'Ads & Performance',
        description: 'Campañas pagadas en Meta y Google con optimización continua.',
        icon: BarChart3,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20',
        includes: ['Meta Ads', 'Google Ads', 'A/B Testing', 'Reporting ROI'],
        price: '500',
        period: 'mes',
    },
];

export function PricingSection() {
    const [billing, setBilling] = React.useState<BillingCycle>('semestral');

    return (
        <section id="pricing" className="py-32 bg-background relative overflow-hidden">
            {/* Background Effects Premium */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
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
                            <span className="text-white/60 font-medium">Tu equipo se queda con las herramientas Y el conocimiento.</span>
                        </p>
                    </motion.div>

                    {/* Filosofía badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 mb-12"
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
                                onClick={() => setBilling(cycle)}
                                className={cn(
                                    "relative text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 font-bold px-5 py-2.5 rounded-full",
                                    billing === cycle
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
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
                    {PLANS.map((plan, index) => (
                        <PricingCard
                            key={plan.name}
                            plan={plan}
                            billing={billing}
                            index={index}
                        />
                    ))}
                </div>

                {/* ═══════════════════════════════════════
                 * PAQUETES DE SERVICIOS INDIVIDUALES
                 * ═══════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 max-w-6xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-3">¿Necesitás algo puntual?</p>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Servicios{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Individuales</span>
                        </h3>
                        <p className="text-sm text-white/40 mt-3 max-w-lg mx-auto font-light">
                            Contratá solo lo que necesitás. Todos combinables con cualquier plan.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SERVICE_PACKS.map((pack, i) => {
                            const Icon = pack.icon;
                            return (
                                <motion.div
                                    key={pack.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="group relative bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-black/60 transition-all duration-500 hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", pack.iconBg)}>
                                            <Icon className={cn("w-5 h-5", pack.iconColor)} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-base font-bold text-white truncate">{pack.name}</h4>
                                            <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{pack.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {pack.includes.map((item, j) => (
                                            <span key={j} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/50">
                                                {item}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-end justify-between pt-4 border-t border-white/5">
                                        <div>
                                            <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-bold block">Desde</span>
                                            <span className="text-2xl font-black text-white">${pack.price}</span>
                                            <span className="text-xs text-white/30 font-medium">/{pack.period}</span>
                                        </div>
                                        <button
                                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                                        >
                                            Cotizar →
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

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

/* ═══════════════════════════════════
 * COMPONENTE: PricingCard
 * ═══════════════════════════════════ */
function PricingCard({ plan, billing, index }: { plan: Plan; billing: BillingCycle; index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const discount = DISCOUNTS[billing];
    const monthlyPrice = Math.round(plan.basePrice * (1 - discount));
    const totalMonths = BILLING_LABELS[billing].months;
    const totalPrice = monthlyPrice * totalMonths;
    const Icon = plan.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.15 }}
            onMouseMove={handleMouseMove}
            className={cn(
                "group relative p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 flex flex-col hover:-translate-y-2",
                plan.highlight
                    ? "bg-black/80 border-blue-500/30 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.2)] z-10 scale-[1.02]"
                    : "bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/60"
            )}
        >
            {/* Hover Spotlight Effect */}
            <motion.div
                className={cn(
                    "pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100",
                    plan.highlight ? "duration-500 opacity-40" : ""
                )}
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            ${plan.accentGlow},
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Glowing border for Highlighted */}
            {plan.highlight && (
                <div className="absolute inset-0 rounded-[inherit] p-[1px] bg-gradient-to-b from-blue-500/50 via-transparent to-transparent opacity-50 pointer-events-none animate-pulse" />
            )}

            {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] shadow-[0_0_20px_rgba(59,130,246,0.5)] uppercase">
                    {plan.badge}
                </div>
            )}

            {/* Header */}
            <div className="mb-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border",
                        plan.highlight
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : "bg-white/5 border-white/10 text-white/60"
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{plan.subtitle}</p>
                        <h3 className={cn("text-xl font-black tracking-tight", plan.highlight ? "text-white" : "text-white/90")}>
                            {plan.name}
                        </h3>
                    </div>
                </div>
                <p className="text-white/40 text-sm leading-relaxed font-light">{plan.description}</p>
            </div>

            {/* Pricing */}
            <div className="mb-8 pb-8 border-b border-white/10 relative z-10">
                <div className="flex items-baseline gap-2">
                    <span className={cn(
                        "text-5xl font-black tracking-tighter transition-all duration-300",
                        plan.highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500" : "text-white"
                    )}>
                        ${monthlyPrice}
                    </span>
                    <span className="text-sm text-white/30 font-medium">/mes</span>
                </div>
                {discount > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-white/20 line-through">${plan.basePrice}/mes</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Ahorrás ${(plan.basePrice - monthlyPrice) * totalMonths}
                        </span>
                    </div>
                )}
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">
                    ${totalPrice.toLocaleString()} total · {totalMonths} meses
                </p>
            </div>

            {/* Features */}
            <div className="space-y-3.5 mb-8 flex-grow relative z-10">
                {plan.features.map((feature, i) => (
                    <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + (i * 0.05) }}
                        className="flex items-start gap-3"
                    >
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border",
                            plan.highlight
                                ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                                : "border-white/10 bg-white/5 text-white/40 group-hover:text-white/60 group-hover:border-white/20 transition-colors"
                        )}>
                            <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={cn("text-sm font-medium leading-relaxed", plan.highlight ? "text-white/80" : "text-white/50 group-hover:text-white/70 transition-colors")}>
                            {feature}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Capacitación badge */}
            <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                    <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-300/80">{plan.capacitacion}</span>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={cn(
                    "w-full h-16 rounded-2xl text-xs font-black tracking-[0.2em] transition-all duration-500 uppercase relative z-10 overflow-hidden group/btn flex items-center justify-center gap-3",
                    plan.highlight
                        ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:bg-blue-400"
                        : "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/30"
                )}
            >
                <span className="relative z-10">Empezar Ahora</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                <span className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            </button>
        </motion.div>
    );
}

export default PricingSection;
