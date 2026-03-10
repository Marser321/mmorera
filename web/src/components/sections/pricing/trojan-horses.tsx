import * as React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TROJAN_HORSES } from './constants';

export function TrojanHorses() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 max-w-5xl mx-auto"
        >
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <Gift className="w-3.5 h-3.5" />
                    Sin Riesgo
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                    Probá{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">Gratis</span>
                </h2>
                <p className="text-lg text-white/40 max-w-xl mx-auto font-light">
                    Empezá sin compromiso. Demostramos valor antes de pedir un peso.
                </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
                {TROJAN_HORSES.map((th, i) => {
                    const Icon = th.icon;
                    return (
                        <motion.div
                            key={th.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "group relative bg-black/60 border rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden",
                                th.borderColor
                            )}
                        >
                            {/* Glow bg */}
                            <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-40 pointer-events-none transition-opacity group-hover:opacity-80", th.glowColor)} />

                            {/* Price badge */}
                            <div className="relative z-10">
                                <div className={cn("inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-wider text-white bg-gradient-to-r mb-4 shadow-lg", th.priceBadgeColor)}>
                                    🔥 {th.price}
                                </div>

                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-white/80" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white">{th.name}</h4>
                                        <p className="text-xs text-white/40 mt-1 leading-relaxed">{th.description}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {th.features.map((f, j) => (
                                        <span key={j} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/50">
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white hover:text-black transition-all duration-300 group-hover:shadow-lg"
                                >
                                    {th.cta} →
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
