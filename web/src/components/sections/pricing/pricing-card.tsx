import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Check, GraduationCap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Plan, BillingCycle, DISCOUNTS, BILLING_LABELS } from './constants';

/* ═══════════════════════════════════
 * COMPONENTE: PricingCard
 * ═══════════════════════════════════ */
export function PricingCard({ plan, billing, index }: { plan: Plan; billing: BillingCycle; index: number }) {
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
                <span className="relative z-10">Reservar mi Lugar</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                <span className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            </button>
        </motion.div>
    );
}
