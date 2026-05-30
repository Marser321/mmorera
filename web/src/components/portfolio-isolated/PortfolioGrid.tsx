'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, 
    Folder, 
    FileCode, 
    Monitor, 
    Tablet, 
    Smartphone, 
    ExternalLink, 
    Settings, 
    Film, 
    Code, 
    Terminal,
    Sparkles,
    Eye,
    EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PROJECTS_DATA, ProjectData } from './projectsData';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from '@/components/ui/dialog';

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

// --- COLOREADOR DE SINTAXIS PARA EL MOCK DE CÓDIGO (VS CODE EDITOR) ---
function CodeHighlighter({ code }: { code: string }) {
    const lines = code.split('\n');
    
    return (
        <pre className="font-mono text-[10px] leading-relaxed text-zinc-300 overflow-x-auto p-4 select-text">
            <code>
                {lines.map((line, idx) => {
                    let renderedLine: React.ReactNode = line;
                    
                    const trimmed = line.trim();
                    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('*/')) {
                        // Colorear JSDocs específicos en rosa/negrita
                        if (trimmed.includes('@challenge') || trimmed.includes('@solution') || trimmed.includes('@module') || trimmed.includes('@description') || trimmed.includes('@handler')) {
                            const parts = line.split(/(@\w+)/);
                            renderedLine = (
                                <span className="text-zinc-500 italic">
                                    {parts.map((part, pIdx) => {
                                        if (part.startsWith('@')) {
                                            return <span key={pIdx} className="text-rose-400 font-semibold">{part}</span>;
                                        }
                                        return <span key={pIdx}>{part}</span>;
                                    })}
                                </span>
                            );
                        } else {
                            renderedLine = <span className="text-emerald-500/80 italic">{line}</span>;
                        }
                    } else {
                        // Resaltar palabras clave e hilos de string
                        const parts = line.split(/("[^"]*"|'[^']*'|\b(?:import|export|function|const|let|var|return|def|class|from|await|async|if|else|try|catch|new|private|constructor)\b)/g);
                        
                        renderedLine = parts.map((part, pIdx) => {
                            if (part.match(/^"[^"]*"$/) || part.match(/^'[^']*'$/)) {
                                return <span key={pIdx} className="text-amber-200/90">{part}</span>;
                            }
                            if (part.match(/\b(import|export|function|const|let|var|return|def|class|from|await|async|if|else|try|catch|new|private|constructor)\b/)) {
                                return <span key={pIdx} className="text-purple-400 font-semibold">{part}</span>;
                            }
                            if (part.match(/^\d+$/)) {
                                return <span key={pIdx} className="text-orange-400">{part}</span>;
                            }
                            return <span key={pIdx}>{part}</span>;
                        });
                    }
                    
                    return (
                        <div key={idx} className="table-row">
                            <span className="table-cell text-zinc-700 pr-4 text-right select-none w-6 font-mono text-[9px] border-r border-white/5">{idx + 1}</span>
                            <span className="table-cell whitespace-pre pl-4">{renderedLine}</span>
                        </div>
                    );
                })}
            </code>
        </pre>
    );
}

// --- VISUALIZADOR DE CANAL DE AUDIO FLUTUANTE (DaVinci HUD) ---
function AudioLevelsHUD({ active }: { active: boolean }) {
    const barsCount = 8;
    return (
        <div className="flex flex-col gap-[3px] w-5 bg-black/60 border border-white/10 p-1 rounded h-20 justify-between items-center select-none">
            <div className="flex gap-[1px] h-full items-end">
                {/* Canal Izquierdo */}
                <div className="flex flex-col gap-[1px] h-full justify-end">
                    {Array.from({ length: barsCount }).map((_, i) => {
                        const colorClass = i < 2 ? 'bg-red-500' : i < 4 ? 'bg-yellow-400' : 'bg-emerald-400';
                        return (
                            <div 
                                key={i} 
                                className={cn(
                                    "w-1 h-[6px] rounded-[1px] transition-all",
                                    active ? colorClass : 'bg-zinc-800'
                                )} 
                                style={active ? {
                                    animation: `pulse 0.4s ease-in-out infinite alternate`,
                                    animationDelay: `${i * 0.05}s`
                                } : undefined}
                            />
                        );
                    })}
                </div>
                {/* Canal Derecho */}
                <div className="flex flex-col gap-[1px] h-full justify-end">
                    {Array.from({ length: barsCount }).map((_, i) => {
                        const colorClass = i < 2 ? 'bg-red-500' : i < 4 ? 'bg-yellow-400' : 'bg-emerald-400';
                        return (
                            <div 
                                key={i} 
                                className={cn(
                                    "w-1 h-[6px] rounded-[1px] transition-all",
                                    active ? colorClass : 'bg-zinc-800'
                                )} 
                                style={active ? {
                                    animation: `pulse 0.35s ease-in-out infinite alternate`,
                                    animationDelay: `${(7 - i) * 0.04}s`
                                } : undefined}
                            />
                        );
                    })}
                </div>
            </div>
            <span className="text-[6px] font-mono text-zinc-500 tracking-tighter">CH1/2</span>
        </div>
    );
}

export function PortfolioGrid() {
    const { isDevMode } = useDevMode();
    const { language } = useLanguage();
    
    const [viewMode, setViewMode] = useState<'media' | 'repo'>('media');
    const [selectedProject, setSelectedProject] = useState<ProjectData>(PROJECTS_DATA[0]);
    const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    
    // Control de Sidebar colapsable en mobile para Explorer
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Ajustar sidebar automáticamente al cambiar de tamaño
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id="portfolio-grid" className="py-24 md:py-32 relative bg-transparent overflow-hidden">
            {/* Glow de Fondo */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none translate-y-1/3 translate-x-1/3" />
            <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div className="text-left max-w-2xl">
                        <span className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-[10px] block mb-3">
                            {language === 'es' ? 'CASOS DE ESTUDIO · PORTFOLIO' : 'CASE STUDIES · PORTFOLIO'}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                            {language === 'es' ? 'Proyectos' : 'Compiled'}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400">
                                {language === 'es' ? 'Compilados' : 'Projects'}
                            </span>
                        </h2>
                        <p className="text-zinc-400 font-light text-base leading-relaxed">
                            {language === 'es'
                                ? 'Diseño interfaces cinéticas y arquitecturas de automatización B2B. Alterná de modo para auditar mi trabajo bajo la mirada de un editor audiovisual o directamente desde el código fuente.'
                                : 'I build kinetic user interfaces and B2B automation architectures. Toggle views to inspect my projects under the lens of a video editor or directly from the source code.'
                            }
                        </p>
                    </div>

                    {/* ──── SWAPPER DE VISTA (MEDIA POOL VS EXPLORER) ──── */}
                    <div className="flex bg-neutral-900/80 border border-white/10 p-1 rounded-xl shrink-0 font-mono text-xs select-none">
                        <button
                            onClick={() => setViewMode('media')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer",
                                viewMode === 'media' 
                                    ? "bg-violet-600/20 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]" 
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Film className="w-3.5 h-3.5" />
                            <span>Media Pool</span>
                        </button>
                        <button
                            onClick={() => setViewMode('repo')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer",
                                viewMode === 'repo' 
                                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Code className="w-3.5 h-3.5" />
                            <span>VS Code Explorer</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    
                    {/* ──── VISTA A: MEDIA POOL MODE (DaVinci Mockup) ──── */}
                    {viewMode === 'media' && (
                        <motion.div
                            key="media"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {PROJECTS_DATA.map((project) => {
                                const isHovered = hoveredProjectId === project.id;
                                return (
                                    <div
                                        key={project.id}
                                        className="group relative bg-neutral-950 border border-white/5 hover:border-violet-500/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col justify-end aspect-[16/10] cursor-pointer"
                                        onMouseEnter={() => setHoveredProjectId(project.id)}
                                        onMouseLeave={() => setHoveredProjectId(null)}
                                    >
                                        
                                        {/* HUD SUPERIOR: Codec & SMPTE Timecode */}
                                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20 pointer-events-none">
                                            <span className="font-mono text-[8px] bg-black/60 px-2 py-0.5 rounded text-violet-400 border border-violet-500/20 tracking-wider">
                                                {project.codec}
                                            </span>
                                            
                                            {/* Si está en hover, simular que se está reproduciendo el clip */}
                                            {isHovered ? (
                                                <div className="flex items-center gap-1.5 font-mono text-[8px] bg-red-600/20 px-2 py-0.5 rounded text-red-400 border border-red-500/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    <span>▶ PLAYING</span>
                                                </div>
                                            ) : (
                                                <span className="font-mono text-[8px] bg-black/60 px-2 py-0.5 rounded text-zinc-500">
                                                    {project.timecode}
                                                </span>
                                            )}
                                        </div>

                                        {/* OVERLAY HUD INTERACTIVO (Sólo en hover o mobile activo) */}
                                        <div className={cn(
                                            "absolute inset-0 z-10 border border-violet-500/20 transition-opacity duration-300 pointer-events-none",
                                            isHovered ? "opacity-100" : "opacity-0"
                                        )}>
                                            {/* Marcas de recorte (Crop Marks en esquinas) */}
                                            <div className="absolute top-8 left-8 w-3 h-3 border-t border-l border-white/30" />
                                            <div className="absolute top-8 right-8 w-3 h-3 border-t border-r border-white/30" />
                                            <div className="absolute bottom-8 left-8 w-3 h-3 border-b border-l border-white/30" />
                                            <div className="absolute bottom-8 right-8 w-3 h-3 border-b border-r border-white/30" />

                                            {/* Retículo sutil central */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/10 rounded-full" />

                                            {/* Audio Levels HUD a la derecha */}
                                            <div className="absolute right-3 bottom-16">
                                                <AudioLevelsHUD active={isHovered} />
                                            </div>
                                        </div>

                                        {/* Imagen de Portada del Proyecto */}
                                        <div
                                            className="absolute inset-0 z-0 bg-cover bg-center opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
                                            style={{ backgroundImage: `url(${project.imageUrl})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent z-10" />

                                        {/* CONTENIDO DE LA TARJETA */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-5 z-20 text-left">
                                            
                                            {/* Scramble Title */}
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                                <ScrambleText text={project.title[language]} active={isHovered} />
                                            </h3>
                                            
                                            {/* Descripción de Desafío */}
                                            <p className="text-[10px] text-zinc-400 font-light leading-relaxed mb-4 line-clamp-2">
                                                <span className="text-violet-400 font-bold">
                                                    {language === 'es' ? 'Desafío:' : 'Challenge:'}
                                                </span>{' '}
                                                {project.desafio[language]}
                                            </p>

                                            {/* Footer con Stack y cargador */}
                                            <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                                                <div className="flex gap-1">
                                                    {project.stack.slice(0, 3).map(s => (
                                                        <span key={s} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-500">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Demo Trigger */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button className="flex items-center gap-1.5 text-[9px] font-mono font-black text-violet-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0 group/btn">
                                                            LOAD CLIP
                                                            <Play className="w-3 h-3 text-violet-400 fill-violet-400/20 group-hover/btn:fill-white/20 transition-all" />
                                                        </button>
                                                    </DialogTrigger>
                                                    
                                                    {/* MODAL DE DEMO CON MARCOS MULTI-DISPOSITIVO */}
                                                    <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] md:h-[85vh] p-0 bg-neutral-950 border-white/10 flex flex-col overflow-hidden shadow-2xl">
                                                        <div className="p-4 border-b border-white/5 bg-neutral-900/50 flex justify-between items-center shrink-0">
                                                            <DialogTitle className="text-white text-sm font-bold flex items-center gap-2">
                                                                <Sparkles className="w-4 h-4 text-violet-400" />
                                                                <span>{project.title[language]}</span>
                                                                <span className="bg-violet-500/20 text-violet-400 text-[8px] px-2 py-0.5 rounded border border-violet-500/20 uppercase tracking-widest font-black shrink-0">
                                                                    {language === 'es' ? 'Previsualización Real' : 'Live Preview'}
                                                                </span>
                                                            </DialogTitle>
                                                            
                                                            {/* Selector de Dispositivos del Iframe */}
                                                            <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-lg">
                                                                <button 
                                                                    onClick={() => setDevice('desktop')} 
                                                                    className={cn("p-1.5 rounded transition-colors text-white/50 hover:text-white cursor-pointer", device === 'desktop' && "bg-white/10 text-white")}
                                                                    title="Desktop Mode"
                                                                >
                                                                    <Monitor className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => setDevice('tablet')} 
                                                                    className={cn("p-1.5 rounded transition-colors text-white/50 hover:text-white cursor-pointer", device === 'tablet' && "bg-white/10 text-white")}
                                                                    title="Tablet Mode"
                                                                >
                                                                    <Tablet className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => setDevice('mobile')} 
                                                                    className={cn("p-1.5 rounded transition-colors text-white/50 hover:text-white cursor-pointer", device === 'mobile' && "bg-white/10 text-white")}
                                                                    title="Mobile Mode"
                                                                >
                                                                    <Smartphone className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Navegador Simulado */}
                                                        <div className="bg-neutral-900 px-4 py-1.5 border-b border-white/5 flex items-center gap-3 select-none text-[10px] font-mono text-zinc-500">
                                                            <div className="flex gap-1.5">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                                            </div>
                                                            <div className="flex-1 bg-black/40 border border-white/5 px-3 py-1 rounded text-center text-zinc-400 truncate max-w-lg mx-auto">
                                                                https://mariomorera.dev/preview/{project.filename.split('.')[0].toLowerCase()}
                                                            </div>
                                                            <a 
                                                                href={project.iframeUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="flex items-center gap-1 text-violet-400 hover:text-white transition-colors"
                                                            >
                                                                <span>OPEN</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>

                                                        {/* Contenedor del Iframe */}
                                                        <div className="flex-1 w-full bg-neutral-950 flex justify-center items-center overflow-hidden p-6 relative">
                                                            <div className={cn(
                                                                "h-full border border-white/10 bg-black rounded-xl overflow-hidden transition-all duration-500 shadow-2xl relative",
                                                                device === 'desktop' ? "w-full" : device === 'tablet' ? "w-[768px] aspect-[4/3] max-h-[90%]" : "w-[375px] aspect-[9/16] max-h-[95%]"
                                                            )}>
                                                                <iframe
                                                                    src={project.iframeUrl}
                                                                    className="w-full h-full border-0 bg-neutral-950"
                                                                    title={`Demo of ${project.title[language]}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* ──── VISTA B: VS CODE EXPLORER MODE ──── */}
                    {viewMode === 'repo' && (
                        <motion.div
                            key="repo"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-12 gap-0 bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden min-h-[500px] shadow-2xl font-mono text-xs text-left"
                        >
                            {/* VS Code Actividades (Columna lateral angosta de iconos) */}
                            <div className="hidden md:flex flex-col items-center justify-between w-12 border-r border-white/10 bg-neutral-950/80 py-4 select-none">
                                <div className="flex flex-col gap-5 text-zinc-500">
                                    <button className="text-emerald-400 hover:text-emerald-300 transition-colors" title="Explorer">
                                        <Code className="w-5 h-5" />
                                    </button>
                                    <button className="hover:text-zinc-300 transition-colors" title="Source Control" disabled>
                                        <Terminal className="w-5 h-5 opacity-40 cursor-not-allowed" />
                                    </button>
                                    <button className="hover:text-zinc-300 transition-colors" title="Settings" disabled>
                                        <Settings className="w-5 h-5 opacity-40 cursor-not-allowed" />
                                    </button>
                                </div>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>

                            {/* Explorer Sidebar */}
                            {sidebarOpen && (
                                <div className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-white/10 bg-neutral-950/50 p-4 select-none">
                                    <div className="text-zinc-500 uppercase tracking-widest text-[9px] mb-4 font-black flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Settings className="w-3 h-3 text-zinc-500" /> 
                                            <span>WORKSPACE: MONOREPO</span>
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                                            <Folder className="w-3.5 h-3.5 text-amber-500" />
                                            <span>src/components</span>
                                        </div>
                                        <div className="pl-4 space-y-1.5">
                                            {PROJECTS_DATA.map((project) => {
                                                const isActive = selectedProject?.id === project.id;
                                                return (
                                                    <div
                                                        key={project.id}
                                                        onClick={() => setSelectedProject(project)}
                                                        className={cn(
                                                            "flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors",
                                                            isActive 
                                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <FileCode className={cn(
                                                                "w-3.5 h-3.5 shrink-0",
                                                                isActive ? "text-emerald-400" : "text-zinc-500"
                                                            )} />
                                                            <span className="truncate">{project.filename}</span>
                                                        </div>
                                                        <span className="text-[8px] text-zinc-600 shrink-0">{project.fileSize}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Simulated Code Editor Area */}
                            <div className={cn(
                                "flex flex-col bg-neutral-950/20",
                                sidebarOpen ? "col-span-12 md:col-span-8 lg:col-span-8" : "col-span-12 md:col-span-11"
                            )}>
                                {/* Editor Tab Headers */}
                                <div className="bg-neutral-950/80 border-b border-white/10 px-4 py-2 flex items-center justify-between select-none">
                                    <div className="flex items-center gap-1">
                                        {/* Toggle Sidebar Button en mobile */}
                                        <button 
                                            onClick={() => setSidebarOpen(!sidebarOpen)}
                                            className="mr-2 p-1 border border-white/10 rounded bg-black/40 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                            title={sidebarOpen ? "Hide File Tree" : "Show File Tree"}
                                        >
                                            {sidebarOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                        
                                        <span className="text-zinc-400 font-bold border-b-2 border-emerald-500 pb-[10px] pt-1 px-3 bg-neutral-950/40 text-[10px] flex items-center gap-1.5">
                                            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                                            {selectedProject.filename}
                                        </span>
                                    </div>
                                    <span className="text-[9px] text-zinc-600">UTF-8 // TypeScript React</span>
                                </div>

                                {/* Editor Code Body */}
                                <div className="flex-1 overflow-auto max-h-[380px] bg-neutral-950/40 relative">
                                    <CodeHighlighter code={selectedProject.codeMock.content} />
                                </div>

                                {/* Editor Footer / Status Bar */}
                                <div className="bg-neutral-950 border-t border-white/10 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 select-none font-mono text-[10px]">
                                    <div className="flex items-center gap-3 text-zinc-500">
                                        <span>git status: <span className="text-emerald-500 font-bold">staged / clean</span></span>
                                        <span>lines: {selectedProject.codeMock.content.split('\n').length}</span>
                                    </div>

                                    {/* Dialog trigger in Repo View */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] group/dev">
                                                npm run dev
                                                <ExternalLink className="w-3.5 h-3.5 text-emerald-300 group-hover/dev:translate-x-0.5 transition-transform" />
                                            </button>
                                        </DialogTrigger>
                                        
                                        {/* Modal duplicado para simplificar la renderización */}
                                        <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] md:h-[85vh] p-0 bg-neutral-950 border-white/10 flex flex-col overflow-hidden shadow-2xl">
                                            <div className="p-4 border-b border-white/5 bg-neutral-900/50 flex justify-between items-center shrink-0">
                                                <DialogTitle className="text-white text-sm font-bold flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                                    <span>{selectedProject.title[language]}</span>
                                                    <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-black shrink-0">
                                                        {language === 'es' ? 'Servidor de Desarrollo Vivo' : 'Live Dev Server'}
                                                    </span>
                                                </DialogTitle>
                                                <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-lg">
                                                    <button onClick={() => setDevice('desktop')} className={cn("p-1.5 rounded transition-colors text-white/50 hover:text-white cursor-pointer", device === 'desktop' && "bg-white/10 text-white")}><Monitor className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setDevice('tablet')} className={cn("p-1.5 rounded transition-colors text-white/50 hover:text-white cursor-pointer", device === 'tablet' && "bg-white/10 text-white")}><Tablet className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setDevice('mobile')} className={cn("p-1.5 rounded transition-colors text-white/50 hover:text-white cursor-pointer", device === 'mobile' && "bg-white/10 text-white")}><Smartphone className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>

                                            {/* Navegador Simulado */}
                                            <div className="bg-neutral-900 px-4 py-1.5 border-b border-white/5 flex items-center gap-3 select-none text-[10px] font-mono text-zinc-500">
                                                <div className="flex gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                                </div>
                                                <div className="flex-1 bg-black/40 border border-white/5 px-3 py-1 rounded text-center text-zinc-400 truncate max-w-lg mx-auto">
                                                    https://localhost:5173/preview/{selectedProject.filename.split('.')[0].toLowerCase()}
                                                </div>
                                                <a 
                                                    href={selectedProject.iframeUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex items-center gap-1 text-emerald-400 hover:text-white transition-colors"
                                                >
                                                    <span>OPEN</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>

                                            <div className="flex-1 w-full bg-neutral-950 flex justify-center items-center overflow-hidden p-6 relative">
                                                <div className={cn(
                                                    "h-full border border-white/10 bg-black rounded-xl overflow-hidden transition-all duration-500 shadow-2xl relative",
                                                    device === 'desktop' ? "w-full" : device === 'tablet' ? "w-[768px] aspect-[4/3] max-h-[90%]" : "w-[375px] aspect-[9/16] max-h-[95%]"
                                                )}>
                                                    <iframe
                                                        src={selectedProject.iframeUrl}
                                                        className="w-full h-full border-0 bg-neutral-950"
                                                        title={`Demo of ${selectedProject.title[language]}`}
                                                    />
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dev Mode Wireframe Overlay */}
            {isDevMode && (
                <div className="absolute inset-0 z-0 border-[6px] border-emerald-500/20 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/10" />
                    <span className="absolute bottom-4 left-4 font-mono text-[8px] text-emerald-500/30 uppercase tracking-widest">
                        Wireframe Active // Portfolio Grid Mode: {viewMode === 'media' ? 'Aspect 16:10 Grid' : 'Split Workspace Panel'}
                    </span>
                </div>
            )}
        </section>
    );
}
