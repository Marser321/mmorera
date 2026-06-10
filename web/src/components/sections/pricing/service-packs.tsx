import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SERVICE_PACKS } from './constants';

export function ServicePacks() {
    return (
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

                <div className="mt-4 max-w-lg mx-auto">
                    <span className="text-xs text-orange-400/80 font-medium">
                        * Valores base aproximados. Varían según escala, requerimientos técnicos y urgencia del proyecto.
                    </span>
                </div>
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
    );
}
