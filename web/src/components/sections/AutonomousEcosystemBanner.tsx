"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";

export function AutonomousEcosystemBanner() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent z-10">
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto p-10 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl relative overflow-hidden text-center shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 opacity-50" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-[0.3em]">Arquitectura de Crecimiento</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight uppercase leading-[0.9]">
                            Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-white">Autónomo.</span>
                        </h2>

                        <p className="text-lg md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
                            Mientras vos gestionás manualmente, tus competidores automatizaron hace 6 meses. Cada día sin automatizar es dinero que <strong className="text-white font-medium">no recuperás</strong>. Diseñamos infraestructuras de crecimiento autónomo que convierten leads en activos de alto valor.
                        </p>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
