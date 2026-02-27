"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
 * COMPARACIÓN: NEXO vs Agencia Tradicional vs In-House
 * Tabla animada que destaca ventajas competitivas.
 * ═══════════════════════════════════════════════════ */

interface ComparisonRow {
    feature: string;
    nexo: boolean | string;
    agencia: boolean | string;
    inhouse: boolean | string;
}

const rows: ComparisonRow[] = [
    { feature: "Implementación en < 4 semanas", nexo: true, agencia: false, inhouse: false },
    { feature: "Automatización IA 24/7", nexo: true, agencia: false, inhouse: "Parcial" },
    { feature: "Transfer de conocimiento al equipo", nexo: true, agencia: false, inhouse: "Parcial" },
    { feature: "Sin contratos anuales", nexo: true, agencia: false, inhouse: true },
    { feature: "ROI medible desde el mes 1", nexo: true, agencia: "Prometen", inhouse: false },
    { feature: "Stack tecnológico propio", nexo: true, agencia: false, inhouse: true },
    { feature: "Costo mensual < $2,000", nexo: true, agencia: false, inhouse: false },
    { feature: "Escalabilidad sin nómina extra", nexo: true, agencia: "Parcial", inhouse: false },
];

function CellContent({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
    if (value === true) {
        return (
            <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center mx-auto",
                    highlight ? "bg-emerald-500/20" : "bg-white/5"
                )}
            >
                <Check className={cn("w-4 h-4", highlight ? "text-emerald-400" : "text-white/50")} />
            </motion.div>
        );
    }
    if (value === false) {
        return (
            <div className="w-7 h-7 rounded-full flex items-center justify-center mx-auto bg-white/[0.02]">
                <X className="w-4 h-4 text-white/15" />
            </div>
        );
    }
    return (
        <span className="text-xs text-yellow-400/70 font-medium">{value}</span>
    );
}

export function ComparisonTable() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <section className="py-20 sm:py-28 relative bg-[#050505] overflow-hidden" id="comparador">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] text-white/60 font-mono tracking-[0.3em] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                        Comparador
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading text-white tracking-tight">
                        ¿Por qué <span className="text-emerald-400 italic font-light">NEXO</span> y no la alternativa?
                    </h2>
                    <p className="text-lg text-white/40 font-light leading-relaxed">
                        Comparamos lo que realmente importa: velocidad, costos y resultados tangibles.
                    </p>
                </div>

                {/* Tabla */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
                >
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-0 border-b border-white/10 text-center">
                        <div className="p-4 md:p-6 text-left">
                            <span className="text-xs font-mono uppercase tracking-widest text-white/30">Feature</span>
                        </div>
                        <div className="p-4 md:p-6 bg-emerald-500/5 border-x border-white/5">
                            <span className="text-sm font-black text-emerald-400 tracking-tight">NEXO</span>
                        </div>
                        <div className="p-4 md:p-6">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-wider">Agencia</span>
                        </div>
                        <div className="p-4 md:p-6">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-wider">In-House</span>
                        </div>
                    </div>

                    {/* Data Rows */}
                    {rows.map((row, i) => (
                        <motion.div
                            key={row.feature}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            className={cn(
                                "grid grid-cols-4 gap-0 text-center items-center",
                                i < rows.length - 1 && "border-b border-white/5"
                            )}
                        >
                            <div className="p-4 md:p-5 text-left">
                                <span className="text-sm text-white/60 font-medium">{row.feature}</span>
                            </div>
                            <div className="p-4 md:p-5 bg-emerald-500/5 border-x border-white/5">
                                <CellContent value={row.nexo} highlight />
                            </div>
                            <div className="p-4 md:p-5">
                                <CellContent value={row.agencia} />
                            </div>
                            <div className="p-4 md:p-5">
                                <CellContent value={row.inhouse} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 group"
                    >
                        Elegir NEXO
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
