"use client";

import { ArrowRight, BrainCircuit, ClipboardList, Megaphone, TrendingUp } from 'lucide-react';
import { Container } from "@/components/ui/container";

const THINKING_LAYERS = [
    {
        title: "Administración",
        description: "Ordenar procesos, prioridades, datos y decisiones para que el negocio deje de depender de memoria, urgencias o intuición.",
        icon: ClipboardList,
    },
    {
        title: "Marketing",
        description: "Traducir lo que hacés en una propuesta clara, medible y alineada con el tipo de cliente que realmente querés atraer.",
        icon: Megaphone,
    },
    {
        title: "Ventas",
        description: "Diseñar seguimientos, automatizaciones y puntos de contacto que conviertan interés en conversaciones y oportunidades reales.",
        icon: TrendingUp,
    },
];

export function PhilosophySection() {
    return (
        <section
            id="filosofia"
            className="py-20 md:py-24 relative bg-transparent"
            aria-labelledby="filosofia-heading"
        >
            <Container className="relative z-10">
                <div className="max-w-5xl mx-auto bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 lg:p-12 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,255,179,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_48%)] pointer-events-none" />

                    <div className="relative z-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-start text-left">
                        <div className="space-y-6">
                            <h2
                                id="filosofia-heading"
                                className="text-3xl md:text-4xl lg:text-5xl font-heading text-white tracking-tight"
                            >
                                <span className="text-primary block mb-2 text-sm uppercase tracking-widest font-mono">Nuestra Filosofía</span>
                                Versatilidad para resolver problemas reales
                            </h2>
                            <p className="text-base md:text-lg text-white/[0.66] font-light leading-relaxed">
                                No encaro cada proyecto como una lista de tareas técnicas. Primero miro el negocio completo: cómo se administra, cómo comunica, cómo vende y dónde se escapa valor en el día a día.
                            </p>
                            <p className="text-base md:text-lg text-white/[0.86] font-medium leading-relaxed">
                                Mi ventaja está en el enfoque generalista: cruzar capas de análisis, pensamiento lateral y ejecución digital para encontrar soluciones que conecten operación, marketing y ventas.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-1">
                                {["Criterio comercial", "Mentalidad técnica", "Compromiso operativo"].map((label) => (
                                    <span
                                        key={label}
                                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/[0.72]"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => { window.location.href = '/aplicar'; }}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-black bg-white hover:bg-zinc-200 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Hablemos de tu caso
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 lg:pl-8 lg:border-l border-white/10">
                            <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5">
                                <BrainCircuit className="mb-4 h-6 w-6 text-primary" />
                                <h3 className="text-xl md:text-2xl font-heading text-white tracking-tight">
                                    Pensamiento lateral aplicado al crecimiento
                                </h3>
                                <p className="mt-3 text-sm md:text-base text-white/60 leading-relaxed">
                                    A veces la solución no es más publicidad, más software o más automatización. Es entender qué pieza del sistema está frenando a las demás y construir desde ahí.
                                </p>
                            </div>

                            <div className="grid gap-3">
                                {THINKING_LAYERS.map(({ title, description, icon: Icon }) => (
                                    <article
                                        key={title}
                                        className="group rounded-2xl border border-white/10 bg-black/[0.22] p-4 transition-colors duration-300 hover:border-primary/35 hover:bg-primary/[0.04]"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                                                    {title}
                                                </h4>
                                                <p className="mt-2 text-sm leading-relaxed text-white/[0.58]">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
