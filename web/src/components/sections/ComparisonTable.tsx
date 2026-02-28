"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
 * COMPARACIÓN: NEXO vs Agencia Tradicional vs In-House
 * Tabla animada que destaca ventajas competitivas.
 * ═══════════════════════════════════════════════════ */

import { Button } from "@/components/ui/button";

// Al no encontrar el componente Container en la ruta @/components/shared/container, usaremos un div estándar
// con las clases típicas de un contenedor de Shadcn o del proyecto.
const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("container mx-auto px-4", className)}>
        {children}
    </div>
);

interface ComparisonRow {
    feature: string;
    mmorera: boolean | string;
    agencia: boolean | string;
    inhouse: boolean | string;
}

const rows: ComparisonRow[] = [
    { feature: "Implementación en < 4 semanas", mmorera: true, agencia: false, inhouse: false },
    { feature: "Automatización IA 24/7", mmorera: true, agencia: false, inhouse: "Parcial" },
    { feature: "Transfer de conocimiento al equipo", mmorera: true, agencia: false, inhouse: "Parcial" },
    { feature: "Sin contratos anuales", mmorera: true, agencia: false, inhouse: true },
    { feature: "ROI medible desde el mes 1", mmorera: true, agencia: "Prometen", inhouse: false },
    { feature: "Stack tecnológico propio", mmorera: true, agencia: false, inhouse: true },
    { feature: "Costo mensual < $2,000", mmorera: true, agencia: false, inhouse: false },
    { feature: "Escalabilidad sin nómina extra", mmorera: true, agencia: "Parcial", inhouse: false },
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
                    highlight ? "bg-primary/20" : "bg-white/5"
                )}
            >
                <Check className={cn("w-4 h-4", highlight ? "text-primary" : "text-white/50")} />
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
        <section className="py-20 sm:py-28 relative bg-transparent overflow-hidden" id="comparador">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <Container className="relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                        ¿Por qué <span className="text-primary italic font-light">MMorera SME</span> y no la alternativa?
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
                        No competimos por precio, competimos por ejecución técnica y velocidad de retorno.
                    </p>
                </div>

                <div className="overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide" ref={ref}>
                    <div className="min-w-[800px] bg-[#0A0A0A]/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="p-6 md:p-8 text-white/50 font-mono text-[10px] uppercase tracking-widest">Ventaja Estratégica</th>
                                    <th className="p-6 md:p-8 text-center border-x border-white/5 bg-primary/5">
                                        <span className="text-sm font-black text-primary tracking-tight">MMorera SME</span>
                                    </th>
                                    <th className="p-6 md:p-8 text-center text-white/30 text-xs font-bold uppercase tracking-widest">Agencia Tradicional</th>
                                    <th className="p-6 md:p-8 text-center text-white/30 text-xs font-bold uppercase tracking-widest">In-House Team</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.map((row, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: i * 0.1 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="p-6 md:p-8 text-white/80 font-medium tracking-tight text-sm">{row.feature}</td>
                                        <td className="p-6 md:p-8 text-center border-x border-white/5 bg-primary/[0.01] group-hover:bg-primary/[0.03] transition-colors">
                                            <CellContent value={row.mmorera} highlight />
                                        </td>
                                        <td className="p-6 md:p-8 text-center">
                                            <CellContent value={row.agencia} />
                                        </td>
                                        <td className="p-6 md:p-8 text-center">
                                            <CellContent value={row.inhouse} />
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-primary hover:bg-white text-black font-black px-10 py-6 rounded-full group overflow-hidden relative shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Elegir MMorera SME
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
