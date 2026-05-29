"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CalendarClock, Handshake, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const workModes = [
    {
        id: "project",
        title: "Proyecto puntual",
        category: "Cotización cerrada",
        description: "Alcance, entregables y tiempos claros para construir una solución concreta.",
        icon: BriefcaseBusiness,
        color: "from-emerald-500/20 to-green-500/5",
        iconColor: "text-emerald-400",
        border: "border-emerald-500/20"
    },
    {
        id: "full-time",
        title: "Integración full time",
        category: "Sujeto a disponibilidad",
        description: "Me integro al equipo para acelerar producto, automatización y sistemas desde adentro.",
        icon: Handshake,
        color: "from-blue-500/20 to-cyan-500/5",
        iconColor: "text-blue-400",
        border: "border-blue-500/20"
    },
    {
        id: "part-time",
        title: "Integración part time",
        category: "Fractional / flexible",
        description: "Acompaño algunas horas por semana para destrabar prioridades y dar continuidad técnica.",
        icon: CalendarClock,
        color: "from-amber-500/20 to-yellow-500/5",
        iconColor: "text-amber-400",
        border: "border-amber-500/20"
    }
];

export function NotebookCases() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section id="casos-uso" className="py-16 md:py-24 relative bg-transparent overflow-hidden border-b border-white/5" ref={containerRef}>
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full max-w-7xl">
                <div className="flex flex-col mb-10 items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-6">
                        <Workflow className="w-4 h-4 text-primary" />
                        Modalidades de Trabajo
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
                        Modalidades de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">trabajo.</span>
                    </h2>

                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium max-w-xl">
                        Tres formatos abiertos para adaptar mi participación al momento real de tu empresa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workModes.map((workMode, index) => (
                        <motion.div
                            key={workMode.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-5%" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-3xl border bg-[#050505]/80 backdrop-blur-2xl transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col items-start overflow-hidden group h-full",
                                workMode.border
                            )}
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500", workMode.color)} />

                            <div className={cn("shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border bg-black/40 shadow-inner z-10 mb-6", workMode.border)}>
                                <workMode.icon className={cn("w-7 h-7", workMode.iconColor)} />
                            </div>

                            <div className="space-y-3 z-10 flex-1 flex flex-col">
                                <span className={cn("inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-black/50 border self-start mb-2", workMode.border, workMode.iconColor)}>
                                    {workMode.category}
                                </span>
                                <h3 className="text-xl font-bold text-white tracking-tight">{workMode.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-medium mt-auto pt-2">
                                    {workMode.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 bg-white/5 border border-white/10 p-5 md:p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group w-full flex flex-col md:flex-row items-center justify-between gap-5 max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-white font-bold mb-2 text-xl">La modalidad se define caso a caso</h3>
                        <p className="text-sm text-zinc-400 max-w-md mx-auto md:mx-0">Conversamos el objetivo y elegimos el formato sin sobredimensionar.</p>
                    </div>
                    <Button
                        className="w-full md:w-auto bg-white text-black hover:bg-zinc-200 h-12 px-8 rounded-xl font-bold transition-all shadow-lg active:scale-95 group/btn shrink-0"
                        onClick={() => {
                            document.getElementById('auditoria')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Conversar modalidad
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
