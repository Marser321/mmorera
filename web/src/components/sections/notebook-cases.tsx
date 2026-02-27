"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileSearch, GraduationCap, BrainCircuit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cases = [
    {
        id: "case-1",
        title: "Auditoría de Llamadas de Ventas",
        category: "RAG & Análisis",
        description: "Transformamos horas de grabaciones en insights estructurados. Extraé objeciones comunes, fricciones de compra y evalúa el SLA de tus cerradores en segundos usando NotebookLM.",
        icon: FileSearch,
        color: "from-blue-500/20 to-cyan-500/5",
        iconColor: "text-blue-400",
        border: "border-blue-500/20"
    },
    {
        id: "case-2",
        title: "Propuestas Comerciales B2B",
        category: "Generación Documental",
        description: "Alimentá a la IA con RFPs, briefs de clientes y tu portafolio histórico. Generá propuestas de 40 páginas, perfectamente referenciadas y alineadas al dolor exacto del cliente.",
        icon: BookOpen,
        color: "from-purple-500/20 to-fuchsia-500/5",
        iconColor: "text-purple-400",
        border: "border-purple-500/20"
    },
    {
        id: "case-3",
        title: "Wiki Interna & Onboarding",
        category: "Gestión del Conocimiento",
        description: "¿Nuevos empleados? Centralizamos manuales, SOPs y procesos operativos en un asistente conversacional capaz de responder cualquier duda técnica citando la fuente exacta.",
        icon: GraduationCap,
        color: "from-emerald-500/20 to-green-500/5",
        iconColor: "text-emerald-400",
        border: "border-emerald-500/20"
    }
];

export function NotebookCases() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section id="casos-uso" className="py-24 md:py-32 relative bg-background overflow-hidden border-b border-white/5" ref={containerRef}>
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left side: Context & CTA */}
                    <div className="lg:col-span-5 flex flex-col items-start">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-6">
                            <BrainCircuit className="w-4 h-4 text-primary" />
                            Aplicaciones del Mundo Real
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
                            Tu empresa ya tiene los datos. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Nosotros los hacemos hablar.</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed font-medium mb-10 max-w-lg">
                            Cruzamos tus grabaciones de ventas, propuestas y manuales con IA documental. El resultado: insights accionables en segundos, no semanas. Sin fricciones, sin curva de aprendizaje.
                        </p>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group w-full max-w-md">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                            <h3 className="text-white font-bold mb-2">¿Te picó la curiosidad?</h3>
                            <p className="text-sm text-zinc-400 mb-6">Agenda una asesoría a fondo con nuestro equipo para auditar tus procesos y encontrar &quot;casos de oro&quot; específicos en tu negocio.</p>
                            <Button
                                className="w-full bg-white text-black hover:bg-zinc-200 h-12 rounded-xl font-bold transition-all shadow-lg active:scale-95 group/btn"
                                onClick={() => {
                                    document.getElementById('auditoria')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Descubrí tus &quot;Casos de Oro&quot;
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Right side: Use Cases Stack */}
                    <div className="lg:col-span-7 flex flex-col gap-6 lg:pl-10">
                        {cases.map((useCase, index) => (
                            <motion.div
                                key={useCase.id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 }}
                                className={cn(
                                    "relative p-6 md:p-8 rounded-3xl border bg-[#050505]/80 backdrop-blur-2xl transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col sm:flex-row gap-6 items-start overflow-hidden group",
                                    useCase.border
                                )}
                            >
                                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-20 transition-opacity duration-500", useCase.color)} />

                                <div className={cn("shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border bg-black/40 shadow-inner z-10", useCase.border)}>
                                    <useCase.icon className={cn("w-7 h-7", useCase.iconColor)} />
                                </div>

                                <div className="space-y-3 z-10">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{useCase.title}</h3>
                                    </div>
                                    <span className={cn("inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-black/50 border", useCase.border, useCase.iconColor)}>
                                        {useCase.category}
                                    </span>
                                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-medium mt-3">
                                        {useCase.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
