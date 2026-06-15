'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PROJECTS_DATA } from './projectsData';
import { ProjectCaseDialog } from './ProjectCaseDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

// --- COMPONENTE INTERNO DE TEXT SCRAMBLE BILINGÜE ---
function ScrambleText({ text, active }: { text: string; active: boolean }) {
    const [displayedText, setDisplayedText] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%#$@*';

    useEffect(() => {
        if (!active) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(text);
            }, 0);
            return () => clearTimeout(timeoutId);
        }

        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayedText(() => 
                text.split('').map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iterations) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );

            iterations += 1/3;
            if (iterations >= text.length) {
                clearInterval(interval);
                setDisplayedText(text);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [active, text]);

    return <span>{displayedText}</span>;
}



export function PortfolioGrid() {
    const { isDevMode } = useDevMode();
    const { language } = useLanguage();
    
    const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

    return (
        <section id="portfolio-grid" className="py-24 md:py-32 relative bg-transparent overflow-hidden">
            {/* Glow de Fondo */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none translate-y-1/3 translate-x-1/3" />
            <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                {/* HUD Header Panel Minimalista */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-7xl mb-12 border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] font-bold tracking-[0.16em] text-zinc-500 uppercase relative"
                >
                    <div className="flex items-center gap-2 text-fuchsia-400/80">
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuchsia-500"></span>
                        </span>
                        <span>03_COMPILED_CASES</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 font-black">
                        <Trophy className="h-3 w-3 text-fuchsia-400/80" />
                        <span>{language === 'es' ? 'CASOS DE ESTUDIO · PORTFOLIO' : 'CASE STUDIES · PORTFOLIO'}</span>
                    </div>
                </motion.div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div className="text-left max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                            {language === 'es' ? 'Proyectos' : 'Compiled'}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400">
                                {language === 'es' ? 'Compilados' : 'Projects'}
                            </span>
                        </h2>
                        <p className="text-zinc-400 font-light text-base leading-relaxed">
                            {language === 'es'
                                ? 'Diseño interfaces interactivas y arquitecturas de automatización B2B orientadas al rendimiento y la experiencia del usuario.'
                                : 'I design interactive interfaces and B2B automation architectures focused on performance and user experience.'
                            }
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {PROJECTS_DATA.map((project) => {
                                const isHovered = hoveredProjectId === project.id;
                                return (
                                    <Dialog key={project.id}>
                                        <DialogTrigger asChild>
                                            <div
                                                className="group relative bg-neutral-950/60 backdrop-blur-md border border-white/5 hover:border-violet-500/80 hover:bg-neutral-950 hover:backdrop-blur-none hover:shadow-[0_0_35px_rgba(139,92,246,0.15)] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col justify-end aspect-[16/10] cursor-pointer"
                                                onMouseEnter={() => setHoveredProjectId(project.id)}
                                                onMouseLeave={() => setHoveredProjectId(null)}
                                            >
                                                {/* Imagen de Portada del Proyecto */}
                                                <div
                                                    className="absolute inset-0 z-0 bg-cover bg-center opacity-30 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                                                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/40 to-transparent z-10" />

                                                {/* CONTENIDO DE LA TARJETA SIMPLIFICADO */}
                                                <div className="absolute inset-0 flex flex-col justify-end p-5 z-20 text-left">
                                                    
                                                    {/* Scramble Title */}
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                                        <ScrambleText text={project.title[language]} active={isHovered} />
                                                    </h3>
                                                    
                                                    {/* Footer con Stack y botón minimalista */}
                                                    <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                                                        <div className="flex gap-1 flex-wrap">
                                                            {project.stack.slice(0, 3).map(s => (
                                                                <span key={s} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span className="flex items-center gap-1.5 text-[9px] font-mono font-black text-violet-400 group-hover:text-white transition-colors">
                                                            {language === 'es' ? 'VER TECNOLOGÍAS' : 'VIEW TECH'}
                                                            <Play className="w-3 h-3 text-violet-400 fill-violet-400/20 group-hover:fill-white/20 transition-all" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogTrigger>

                                        {/* Modal detallado de caso de estudio (narrativa + visor demo) */}
                                        <ProjectCaseDialog project={project} />
                                    </Dialog>
                                );
                            })}
                </div>
            </div>

            {/* Dev Mode Wireframe Overlay */}
            {isDevMode && (
                <div className="absolute inset-0 z-0 border-[6px] border-emerald-500/20 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/10" />
                    <span className="absolute bottom-4 left-4 font-mono text-[8px] text-emerald-500/30 uppercase tracking-widest">
                        Wireframe Active // Portfolio Grid Mode: Aspect 16:10 Grid
                    </span>
                </div>
            )}
        </section>
    );
}
