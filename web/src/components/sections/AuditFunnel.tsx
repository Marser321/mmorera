"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Clock, CheckCircle2, Activity } from "lucide-react";

export function AuditFunnel() {
    return (
        <section id="auditoria" className="py-20 md:py-32 relative overflow-hidden bg-background border-t border-white/5">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>

            {/* Subtle glow for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Floating Tech Icons (Scrollytelling Background) */}
            <div className="absolute top-[30%] left-[20%] opacity-[0.015] mix-blend-overlay pointer-events-none animate-[bounce_10s_ease-in-out_infinite] z-0">
                <Activity className="w-64 h-64 rotate-[-20deg]" />
            </div>
            <div className="absolute bottom-[10%] right-[15%] opacity-[0.015] mix-blend-overlay pointer-events-none animate-[bounce_12s_ease-in-out_infinite_reverse] z-0">
                <BarChart3 className="w-80 h-80 rotate-[15deg]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

                    {/* Left: Value Proposition */}
                    <div className="w-full lg:w-1/2 space-y-8 md:space-y-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                                <Activity className="w-3.5 h-3.5" />
                                Paso_Cero: Diagnóstico
                            </div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                                Tu Radiografía de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500">Ineficiencia</span> en 30 Min
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                                Mientras leés esto, tu empresa está perdiendo dinero en procesos manuales. En 30 minutos te mostramos exactamente dónde y cuánto. Sin compromiso, sin letra chica.
                            </p>
                        </div>

                        <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-300">Entregables Claros:</h4>
                            <ul className="space-y-4">
                                {[
                                    "Mapa de procesos AS-IS (Dónde pierdes dinero hoy)",
                                    "Backlog Priorizado (Qué automatizar primero según esfuerzo/impacto)",
                                    "Blueprint técnico del Sistema Recomendado + Plan de Sprint",
                                    "Estimación de ROI Operativo (Horas ahorradas / SLA proyectado)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-zinc-300 text-sm md:text-base font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium bg-black/50 px-4 py-2 rounded-lg border border-white/5">
                                <Clock className="w-4 h-4 text-primary" />
                                Llamada de 30 mins
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium bg-black/50 px-4 py-2 rounded-lg border border-white/5">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                B2B High-Ticket & Startups
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Interface (Simulated Calendar/Form) */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            {/* Glass effect */}
                            <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-md pointer-events-none"></div>

                            <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight relative z-10">Solicitar Diagnóstico</h3>
                            <p className="text-sm md:text-base text-muted-foreground mb-8 relative z-10 font-medium">Debido a la alta demanda, filtraremos a las empresas que mejor encajen con nuestros sistemas.</p>

                            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block ml-1">Nombre</label>
                                        <input type="text" className="w-full bg-black/80 border border-white/10 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white" placeholder="Juan Pérez" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block ml-1">Email Corporativo</label>
                                        <input type="email" className="w-full bg-black/80 border border-white/10 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white" placeholder="juan@empresa.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block ml-1">¿Cuál es tu mayor cuello de botella actual?</label>
                                    <div className="relative">
                                        <select className="w-full bg-black/80 border border-white/10 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white appearance-none pr-10">
                                            <option value="">Selecciona el mayor dolor de tu empresa...</option>
                                            <option value="1">🔴 Perdiendo ventas por respuesta tardía a leads</option>
                                            <option value="2">🟡 Carritos abandonados / Falta de retargeting</option>
                                            <option value="3">🔵 Sin seguimiento a referidos o antiguos clientes</option>
                                            <option value="4">🟣 Equipo saturado (Falta de atención especializada / SLA lento)</option>
                                            <option value="5">⚪ Otra área operativa</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-400">
                                            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-xl text-sm md:text-base font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all group mt-2"
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Ver Calendario de Disponibilidad
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
