"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Sprout, Heart, Scale, Factory, Truck, Building, Scissors, Dumbbell, Utensils, BrainCircuit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cases = [
    {
        id: "case-1",
        title: "Agropecuaria y Agronegocios",
        category: "Sector Primario",
        description: "Trazabilidad inteligente de ganado, pesaje y monitoreo de pastizales con drones IA, y modelos predictivos para anticipar el rendimiento de cultivos (como la soja) basados en clima e históricos.",
        icon: Sprout,
        color: "from-emerald-500/20 to-green-500/5",
        iconColor: "text-emerald-400",
        border: "border-emerald-500/20"
    },
    {
        id: "case-2",
        title: "Clínicas Médicas y Salud",
        category: "Atención Pacientes",
        description: "Triaje inteligente para pre-diagnóstico y derivación. Recepcionistas de Voz IA que atienden 24/7. Agendamiento predictivo sin horas muertas y automatización de validación en historias clínicas.",
        icon: Heart,
        color: "from-blue-500/20 to-cyan-500/5",
        iconColor: "text-blue-400",
        border: "border-blue-500/20"
    },
    {
        id: "case-3",
        title: "Estudios Jurídicos y Legales",
        category: "LegalTech",
        description: "Automatización en la redacción de contratos, copilotos de IA en procesadores de texto, resumen inteligente de hilos de correos y análisis predictivo de patrones de jueces o litigios.",
        icon: Scale,
        color: "from-amber-500/20 to-yellow-500/5",
        iconColor: "text-amber-400",
        border: "border-amber-500/20"
    },
    {
        id: "case-4",
        title: "Industria y Manufactura",
        category: "Operaciones",
        description: "Mantenimiento predictivo con sensores IoT para predecir fallas meses antes. Control de calidad automatizado mediante visión computarizada para detectar anomalías y reducir desperdicio.",
        icon: Factory,
        color: "from-zinc-500/20 to-neutral-500/5",
        iconColor: "text-zinc-400",
        border: "border-zinc-500/20"
    },
    {
        id: "case-5",
        title: "Logística y Distribución",
        category: "Supply Chain",
        description: "Optimización predictiva de rutas analizando clima, tráfico en vivo y carga. Algoritmos de despacho integrados para reducir la ineficiencia y los costosos kilómetros en vacío hasta en un 35%.",
        icon: Truck,
        color: "from-blue-600/20 to-indigo-500/5",
        iconColor: "text-blue-500",
        border: "border-blue-600/20"
    },
    {
        id: "case-6",
        title: "Inmobiliarias y Bienes Raíces",
        category: "Real Estate",
        description: "Staging digital en 3D, generadores de tours virtuales y edición dinámica de reels con Voz IA. Chatbots pre-calificadores que derivan leads depurados a tus asesores.",
        icon: Building,
        color: "from-violet-500/20 to-purple-500/5",
        iconColor: "text-violet-400",
        border: "border-violet-500/20"
    },
    {
        id: "case-7",
        title: "Barberías y Salones",
        category: "Estética",
        description: "Agendamiento visual sin fricción. Pasarelas para cobro de señas y depósitos para mitigar no-shows. Recordatorios automáticos en WhatsApp y promos de reactivación de clientes.",
        icon: Scissors,
        color: "from-rose-500/20 to-pink-500/5",
        iconColor: "text-rose-400",
        border: "border-rose-500/20"
    },
    {
        id: "case-8",
        title: "Gimnasios y Clubes",
        category: "Deportes",
        description: "Software para gestión de clases en tiempo real con listas de espera auto-gestionadas. Cobro automático de membresías sin rechazos por tarjeta. Asistentes IA de soporte para los socios.",
        icon: Dumbbell,
        color: "from-orange-500/20 to-amber-500/5",
        iconColor: "text-orange-400",
        border: "border-orange-500/20"
    },
    {
        id: "case-9",
        title: "Restaurantes y Gastronomía",
        category: "Hospitality",
        description: "Agentes telefónicos para gestión de reservas y listas de espera. Control predictivo de inventarios frente a la demanda y creación en piloto automático de turnos de personal.",
        icon: Utensils,
        color: "from-red-500/20 to-orange-500/5",
        iconColor: "text-red-400",
        border: "border-red-500/20"
    }
];

export function NotebookCases() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section id="casos-uso" className="py-24 md:py-32 relative bg-transparent overflow-hidden border-b border-white/5" ref={containerRef}>
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full max-w-7xl">
                <div className="flex flex-col mb-16 items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-6">
                        <BrainCircuit className="w-4 h-4 text-primary" />
                        Verticales de Negocio
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
                        Soluciones Específicas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">por Rubro.</span>
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed font-medium mb-10 max-w-2xl">
                        Entendemos que cada sector tiene sus propios cuellos de botella. Adaptamos tecnología hiper-específica que ataca directamente las necesidades de tu industria.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((useCase, index) => (
                        <motion.div
                            key={useCase.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-5%" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 md:p-8 rounded-3xl border bg-[#050505]/80 backdrop-blur-2xl transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col items-start overflow-hidden group h-full",
                                useCase.border
                            )}
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500", useCase.color)} />

                            <div className={cn("shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border bg-black/40 shadow-inner z-10 mb-6", useCase.border)}>
                                <useCase.icon className={cn("w-7 h-7", useCase.iconColor)} />
                            </div>

                            <div className="space-y-3 z-10 flex-1 flex flex-col">
                                <span className={cn("inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-black/50 border self-start mb-2", useCase.border, useCase.iconColor)}>
                                    {useCase.category}
                                </span>
                                <h3 className="text-xl font-bold text-white tracking-tight">{useCase.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-medium mt-auto pt-2">
                                    {useCase.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md relative overflow-hidden group w-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-white font-bold mb-2 text-xl">¿Tu industria no está en la lista?</h3>
                        <p className="text-sm text-zinc-400 max-w-md mx-auto md:mx-0">Diseñamos arquitecturas a medida. Agenda una asesoría para evaluar tus necesidades específicas.</p>
                    </div>
                    <Button
                        className="w-full md:w-auto bg-white text-black hover:bg-zinc-200 h-12 px-8 rounded-xl font-bold transition-all shadow-lg active:scale-95 group/btn shrink-0"
                        onClick={() => {
                            document.getElementById('auditoria')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Descubrir Soluciones
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

