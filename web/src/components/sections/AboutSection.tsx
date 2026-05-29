'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Briefcase, GraduationCap, Compass, CheckCircle2 } from 'lucide-react';

export function AboutSection() {
    return (
        <section
            id="sobre-mi"
            className="py-24 md:py-32 relative bg-transparent overflow-hidden"
            aria-labelledby="about-heading"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <Container className="relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Columna Izquierda: Texto Bio */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-[10px] block"
                        >
                            Sobre Mí · Trayectoria
                        </motion.span>

                        <motion.h2
                            id="about-heading"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none"
                        >
                            Detrás de las <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">herramientas</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-6 text-zinc-300 font-light text-base md:text-lg leading-relaxed"
                        >
                            <p>
                                Empecé en el mundo de las operaciones y la logística, gestionando entornos complejos donde cada segundo cuenta y los imprevistos se resuelven en el acto. Esa experiencia en el mundo físico me enseñó a estructurar procesos, ser disciplinado y mantener la cabeza fría ante problemas grandes.
                            </p>
                            <p>
                                Hoy, fusiono ese bagaje analógico con mis pasiones digitales: el desarrollo frontend ágil (Vibe Coding), la postproducción audiovisual premium y el marketing moderno. No pretendo saberlo todo. La tecnología cambia cada día, y lo que realmente me define es una curiosidad obsesiva por testear cada nueva herramienta que sale al mercado, evaluar su viabilidad y aprender a dominarla para ponerla al servicio de un proyecto.
                            </p>
                            <p className="text-white font-normal border-l-2 border-emerald-500/40 pl-4 italic">
                                No me asustan los presupuestos ajustados ni los desafíos técnicos abiertos; me adapto a lo que la realidad exige para entregar algo funcional, limpio y de alto impacto.
                            </p>
                        </motion.div>
                    </div>

                    {/* Columna Derecha: Tarjeta de Ficha Técnica / CV Moderno */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden"
                    >
                        {/* Mesh gradient decorativo */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />

                        <h3 className="text-white font-bold text-lg tracking-tight mb-6 flex items-center gap-2">
                            <Compass className="w-5 h-5 text-emerald-400" />
                            Ficha de Enfoque
                        </h3>

                        <div className="space-y-6">
                            {/* Ítem 1 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Filosofía de Trabajo</h4>
                                    <p className="text-sm text-zinc-300 font-medium mt-1">Pragmatismo & Adaptabilidad</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">Soluciones directas alineadas a necesidades reales de negocio.</p>
                                </div>
                            </div>

                            {/* Ítem 2 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Curiosidad Activa</h4>
                                    <p className="text-sm text-zinc-300 font-medium mt-1">Aprendizaje e Iteración Continua</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">Evaluación diaria de tecnologías para descartar humo y adoptar valor.</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/5 w-full" />

                            {/* Checklist de Capacidades */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Sinergia de Habilidades</h4>
                                <ul className="space-y-2">
                                    {[
                                        'Despliegue ágil de Frontends en Next.js/React',
                                        'Orquestación de operaciones y automatizaciones',
                                        'Video de alto impacto e identidad visual',
                                        'Enfoque de resolución bajo presupuestos óptimos'
                                    ].map((skill, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-zinc-300 font-light">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400/80 shrink-0" />
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
