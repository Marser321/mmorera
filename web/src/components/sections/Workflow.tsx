"use client";

import { Bot, Filter, PlayCircle, UserPlus } from "lucide-react";
import { HorizontalBeam, VerticalBeam } from "@/components/ui/conversion-flow";

export function Workflow() {
    const steps = [
        {
            title: "Captación de Lead",
            description: "El cliente potencial entra al embudo desde LinkedIn o Ads.",
            icon: <UserPlus className="w-6 h-6" />,
            color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            glowColor: "from-blue-500/20 to-cyan-500/20",
        },
        {
            title: "Calificación por IA",
            description: "Nuestro agente evalúa su perfil, empresa y nivel de urgencia.",
            icon: <Filter className="w-6 h-6" />,
            color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
            glowColor: "from-purple-500/20 to-pink-500/20",
        },
        {
            title: "Acción Personalizada",
            description: "Se genera un recurso, email o video dinámico a medida.",
            icon: <Bot className="w-6 h-6" />,
            color: "bg-primary/10 text-primary border-primary/20",
            glowColor: "from-primary/20 to-blue-500/20",
        },
        {
            title: "Cierre / Agenda",
            description: "Si el lead cumple requisitos, se bloquea espacio en calendario.",
            icon: <PlayCircle className="w-6 h-6" />,
            color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            glowColor: "from-emerald-500/20 to-green-500/20",
        },
    ];

    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-background border-t border-white/5">
            {/* Background noise */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col items-center">

                <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight">
                        Cómo opera la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500">arquitectura invisible</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto px-2 md:px-0">
                        No es magia, es ingeniería de procesos de precisión. Así funciona un embudo automatizado B2B desde el clic inicial hasta la llamada de cierre programada.
                    </p>
                </div>

                {/* Dashboard / Node Flow Container */}
                {/* Changed to max-w-6xl to give enough horizontal space for all 4 cards without overflowing */}
                <div className="relative max-w-6xl w-full bg-black/60 border border-white/10 rounded-3xl p-5 sm:p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">

                    {/* Top Bar for Dashboard aesthetics */}
                    <div className="absolute top-0 left-0 w-full h-12 border-b border-white/10 bg-white/5 rounded-t-3xl flex items-center px-4 sm:px-6 gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="ml-2 sm:ml-4 text-[10px] sm:text-xs text-muted-foreground font-mono tracking-widest uppercase flex items-center gap-2">
                            system-trace: live_pipeline
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        </span>
                    </div>

                    <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between md:justify-center xl:justify-between gap-6 md:gap-2 lg:gap-6 relative">

                        {/* Continuous Background connecting line (desktop) with animated beam inside */}
                        <div className="hidden md:block absolute top-[60px] md:top-[70px] left-8 right-8 h-px bg-white/5 z-0 overflow-hidden rounded-full">
                            <div className="w-[30%] h-full bg-primary shadow-[0_0_15px_3px_rgba(47,88,205,0.6)] animate-beam-x rounded-full"></div>
                        </div>

                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row items-center relative z-10 w-full md:w-auto"
                            >

                                {/* Node Card with Premium Glass & Glow */}
                                {/* Reduced fixed width slightly to fit seamlessly, text adjusts vertically */}
                                <div className="w-full md:w-44 lg:w-52 h-full flex flex-col items-center text-center p-4 lg:p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-xl relative group transition-all duration-500 hover:-translate-y-2">
                                    {/* Subtly animated glow behind the card on hover */}
                                    <div className={`absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br pointer-events-none ${step.glowColor}`}></div>

                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        <div className={`p-4 rounded-xl border mb-5 ${step.color} bg-black/50 shadow-inner group-hover:scale-110 transition-transform duration-500 relative overflow-hidden`}>
                                            {/* Sparkle inside the icon box */}
                                            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            {step.icon}
                                        </div>
                                        <h3 className="font-bold text-sm lg:text-base mb-2 text-white/90 group-hover:text-white transition-colors">{step.title}</h3>
                                        <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed transition-colors group-hover:text-muted-foreground/80">{step.description}</p>
                                    </div>

                                    {/* Bottom reflection line */}
                                    <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>

                                {/* Connectors (Mobile: Vertical Beam, Desktop: Horizontal Beam) */}
                                {index < steps.length - 1 && (
                                    <div className="my-2 md:my-0 md:mx-1 xl:mx-2 flex-shrink-0 z-0 flex items-center justify-center relative">
                                        <VerticalBeam className="md:hidden h-10 w-[2px]" />
                                        <HorizontalBeam className="hidden md:block w-4 lg:w-8 xl:w-12" />
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </section>
    );
}
