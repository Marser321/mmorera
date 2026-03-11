import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, MessageCircle, BarChart3, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FreeDemos() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 max-w-5xl mx-auto"
        >
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <Play className="w-3.5 h-3.5" />
                    Experiencia En Vivo
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                    Probá{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Antes de Pagar</span>
                </h3>
                <p className="text-sm text-white/40 max-w-lg mx-auto font-light">
                    No te pedimos que confíes ciegamente. Tocá, interactuá, comprobá.
                </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                {[
                    {
                        icon: MessageCircle,
                        title: 'Chat IA Vivo',
                        description: 'Probá nuestro asistente ahora mismo. Hacé click en la burbuja de chat abajo a la derecha.',
                        cta: 'Abrir Chat →',
                        color: 'text-blue-400',
                        border: 'border-blue-500/20 hover:border-blue-500/40',
                    },
                    {
                        icon: BarChart3,
                        title: 'Calculadora ROI',
                        description: 'Calculá cuánto ahorrás automatizando. Probala más arriba en esta misma página.',
                        cta: 'Ver Calculadora →',
                        color: 'text-emerald-400',
                        border: 'border-emerald-500/20 hover:border-emerald-500/40',
                    },
                    {
                        icon: Sparkles,
                        title: 'Auditoría Express',
                        description: 'Diagnóstico gratuito en 30 minutos. Sin compromiso, sin surprises.',
                        cta: 'Agendar Gratis →',
                        color: 'text-amber-400',
                        border: 'border-amber-500/20 hover:border-amber-500/40',
                    },
                ].map((demo, i) => {
                    const DIcon = demo.icon;
                    return (
                        <motion.div
                            key={demo.title}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn("group bg-black/40 border rounded-2xl p-6 hover:bg-black/60 transition-all duration-500 hover:-translate-y-1", demo.border)}
                        >
                            <DIcon className={cn("w-8 h-8 mb-4", demo.color)} />
                            <h4 className="text-base font-bold text-white mb-2">{demo.title}</h4>
                            <p className="text-xs text-white/40 leading-relaxed mb-4">{demo.description}</p>
                            <button
                                onClick={() => {
                                    if (demo.title === 'Calculadora ROI') {
                                        document.getElementById('roi')?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                            >
                                {demo.cta}
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
