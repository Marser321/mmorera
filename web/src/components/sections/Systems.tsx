"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, Layers, MessageSquareDashed, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";

const systems = [
    {
        title: "Presencia que Convierte",
        description: "Web B2B optimizada para captar demanda, calificar tráfico y agendar llamadas automáticamente.",
        icon: <MousePointerClick className="w-6 h-6 text-primary" />,
        features: [
            "Landing pages de alta conversión",
            "Tests A/B automatizados",
            "Mecanismo de captura (Lead Capture)",
            "Redirección a CRM instantánea",
        ],
        popular: false,
    },
    {
        title: "Motor de Lead Magnets con IA",
        description: "Sistemas de contenido automatizado que resuelven problemas reales a cambio de datos de contacto.",
        icon: <Layers className="w-6 h-6 text-primary" />,
        features: [
            "Generación de reportes dinámicos",
            "Auditorías automatizadas interactivas",
            "Agentes de IA para nutrición inicial",
            "Calificación de lead ('Lead Scoring')",
        ],
        popular: true,
    },
    {
        title: "Autopilot de Seguimiento CRM",
        description: "Respuestas 24/7 y seguimientos enlatados pero personalizados. No más leads enfriados por demoras.",
        icon: <MessageSquareDashed className="w-6 h-6 text-primary" />,
        features: [
            "SLA de respuesta < 2 minutos",
            "Enriquecimiento de datos (Clearbit/Apollo)",
            "Secuencias de seguimiento dinámico",
            "Cierre de citas integrado al calendario",
        ],
        popular: false,
    },
];

export function Systems() {
    return (
        <section id="sistemas" className="py-20 md:py-32 bg-background relative border-t border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

            {/* Subtle glow behind systems */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Floating Tech Icons (Scrollytelling Background) */}
            <div className="absolute top-[10%] left-[5%] opacity-[0.02] mix-blend-overlay pointer-events-none animate-[bounce_9s_ease-in-out_infinite]">
                <Layers className="w-32 h-32 rotate-12" />
            </div>
            <div className="absolute bottom-[20%] right-[10%] opacity-[0.02] mix-blend-overlay pointer-events-none animate-[bounce_11s_ease-in-out_infinite_reverse]">
                <MousePointerClick className="w-40 h-40 -rotate-12" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
                >
                    <Badge variant="outline" className="mb-4 md:mb-6 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-xs font-semibold px-4 py-1.5 backdrop-blur-sm">
                        Ecosistema de Sistemas
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight text-balance leading-tight">
                        Activos digitales, <br className="hidden sm:block" /> no servicios enlatados.
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2 md:px-0 font-medium">
                        Implementamos infraestructura que trabaja 24/7. Cada sistema está diseñado quirúrgicamente para eliminar un cuello de botella en tu embudo de ventas.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {systems.map((system, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="h-full flex"
                        >
                            <Card
                                className={`w-full relative flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden group hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 ${system.popular ? 'border-transparent shadow-[0_0_40px_rgba(var(--primary),0.15)] bg-white/10' : ''}`}
                            >
                                {/* Animated border beam for popular card */}
                                {system.popular && (
                                    <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit] pointer-events-none">
                                        <div className="absolute top-[50%] left-[50%] aspect-square w-[200%] -translate-x-[50%] -translate-y-[50%] animate-[border-beam_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(var(--primary-rgb),0.8)_360deg)] opacity-70"></div>
                                        <div className="absolute inset-[1px] rounded-[inherit] bg-background/90 backdrop-blur-3xl"></div>
                                    </div>
                                )}

                                {system.popular && (
                                    <div className="absolute top-0 right-0 z-20">
                                        <div className="bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-lg">
                                            Más Implementado
                                        </div>
                                    </div>
                                )}

                                {/* Subtle hover glow inside card and border spotlight effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
                                {!system.popular && (
                                    <div className="absolute -inset-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-700 rounded-[inherit] pointer-events-none z-0 mix-blend-screen"></div>
                                )}

                                <CardHeader className="p-6 md:p-8 relative z-10">
                                    <div className="p-3.5 w-max rounded-xl bg-primary/10 border border-primary/20 mb-5 group-hover:scale-110 transition-transform duration-300">
                                        {system.icon}
                                    </div>
                                    <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">{system.title}</CardTitle>
                                    <CardDescription className="text-sm md:text-base mt-2 leading-relaxed text-muted-foreground/90 font-medium">
                                        {system.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 px-6 md:px-8 relative z-10">
                                    <ul className="space-y-3.5">
                                        {system.features.map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-start text-sm md:text-base text-muted-foreground font-medium group/item">
                                                <CheckCircle2 className="w-5 h-5 text-primary/80 mr-3 shrink-0 mt-0.5 group-hover/item:text-primary transition-colors" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="p-6 md:p-8 pt-0 relative z-10">
                                    <Button className={`w-full h-12 rounded-xl text-sm md:text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg ${system.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]" : "bg-white/5 hover:bg-white/10 text-foreground border border-white/10"}`} variant={system.popular ? "default" : "secondary"}>
                                        Analizar Arquitectura
                                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
