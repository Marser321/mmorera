"use client";

import { ArrowRight } from 'lucide-react';
import { Container } from "@/components/ui/container";

export function PhilosophySection() {
    return (
        <section
            id="filosofia"
            className="py-24 relative bg-transparent"
            aria-labelledby="filosofia-heading"
        >
            <Container className="relative z-10">
                <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start text-left">
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2
                                id="filosofia-heading"
                                className="text-3xl md:text-4xl font-heading text-white tracking-tight"
                            >
                                <span className="text-primary block mb-2 text-sm uppercase tracking-widest font-mono">Nuestra Filosofía</span>
                                El mundo empresarial cambió para siempre
                            </h2>
                            <p className="text-lg text-white/60 font-light leading-relaxed">
                                Pero la adaptación no tiene por qué ser dolorosa. No vendemos &quot;bots sueltos&quot; que terminan en el olvido; construimos ecosistemas digitales completos, desde marketing de alto rendimiento y desarrollo web hasta automatizaciones con IA que se adaptan a tu empresa.
                            </p>
                            <p className="text-lg text-white font-medium">
                                Somos el puente seguro entre tu negocio tradicional y la vanguardia tecnológica de 2026.
                            </p>

                            <div className="pt-6">
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-black bg-white hover:bg-zinc-200 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Da el Salto Ahora
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 space-y-6 md:pl-8 md:border-l border-white/10">
                            <h3 className="text-2xl md:text-3xl font-heading text-white tracking-tight">
                                Escala Global, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white/40">Raíces Locales</span>
                            </h3>
                            <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
                                Operamos desde Uruguay para el mundo. Aprovechamos la consolidación de nuestro país como hub tecnológico y de innovación en América Latina para exportar soluciones integrales (Marketing, Tech & IA) a clientes corporativos en Estados Unidos, Europa y toda la región, beneficiándonos de la alineación estratégica de zonas horarias y talento bilingüe de élite.
                            </p>
                            <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
                                Sin embargo, para nuestras empresas locales, ofrecemos un diferencial absoluto e irreemplazable: <strong className="text-white font-medium">el servicio presencial</strong>. Entendemos que la transformación digital requiere confianza. Si tu negocio en Uruguay lo demanda, nuestro equipo se sienta en tu mesa directiva, recorre tus instalaciones, audita tus operaciones en persona y capacita a tus trabajadores cara a cara. Brindamos la sofisticación de una agencia global con el apretón de manos y el respaldo humano de un socio local.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
