"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
    DatabaseZap,
    LineChart,
    FileText,
    Network,
    Slack,
    Database,
    Trello,
    Calculator,
    ChevronRight,
    Terminal,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Data Flow Animation (CRM Autónomo)
const DataFlowAnim = () => {
    return (
        <div className="relative w-full h-48 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Base database icon */}
            <div className="absolute left-8 text-slate-600">
                <Database size={40} />
            </div>

            {/* Target insight icon */}
            <div className="absolute right-8 text-cyan-500 z-10 p-3 bg-slate-800/80 backdrop-blur-md rounded-xl border border-cyan-500/30">
                <LineChart size={32} />
            </div>

            {/* Path */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path
                    d="M 60,96 L 200,96 C 250,96 250,96 300,96"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                    className="w-full"
                />
            </svg>

            {/* Glowing moving particles */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    initial={{ left: "60px", top: "48%", opacity: 0, scale: 0.5 }}
                    animate={{
                        left: ["60px", "60%", "calc(100% - 60px)"],
                        opacity: [0, 1, 1, 0],
                        scale: [0.5, 1.2, 0.8, 0]
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/10 to-blue-900/20 pointer-events-none" />
        </div>
    );
};

// 2. Typing Ghost Effect (Pipeline de Contenido)
const TypingGhostAnim = () => {
    const text = "> Generando 30 días de contenido estelar... _";
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let i = 0;
        let timer: NodeJS.Timeout;
        let isMounted = true;

        const type = () => {
            if (!isMounted) return;
            if (i < text.length) {
                setDisplayText(text.slice(0, i + 1));
                i++;
                timer = setTimeout(type, 80 + Math.random() * 50);
            } else {
                setIsTyping(false);
                timer = setTimeout(() => {
                    if (!isMounted) return;
                    i = 0;
                    setDisplayText("");
                    setIsTyping(true);
                    type();
                }, 3000); // Restart after 3s
            }
        };

        timer = setTimeout(type, 500);
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="relative w-full h-48 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex flex-col justify-end p-4 font-mono text-sm">
            {/* Scanner line background effect */}
            <motion.div
                className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent z-0 blur-sm"
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 flex items-start gap-2 text-emerald-400">
                <Terminal size={16} className="mt-1 opacity-70 shrink-0" />
                <div className="flex-1">
                    <p className="text-slate-400 mb-2">Analyzing base documents...</p>
                    <p className="text-slate-300 mb-2">Extracting brand voice & SEO keywords...</p>
                    <p className={isTyping ? "text-emerald-400" : "text-emerald-500"}>
                        {displayText}
                        {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

// 3. Node Expansion (Arquitecto de Onboarding)
const NodeExpansionAnim = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.5 });

    return (
        <div ref={containerRef} className="relative w-full h-48 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Expanded connections state */}
            {isInView && (
                <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
                    <svg className="absolute w-full h-full overflow-visible">
                        <motion.line
                            x1="50%" y1="50%"
                            x2="25%" y2="25%"
                            stroke="rgba(79,70,229,0.4)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8 }}
                        />
                        <motion.line
                            x1="50%" y1="50%"
                            x2="75%" y2="25%"
                            stroke="rgba(79,70,229,0.4)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        />
                        <motion.line
                            x1="50%" y1="50%"
                            x2="50%" y2="75%"
                            stroke="rgba(79,70,229,0.4)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                    </svg>
                </div>
            )}

            {/* Center Node */}
            <motion.div
                className="absolute z-20 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] border-2 border-indigo-400"
                whileHover={{ scale: 1.1 }}
            >
                <Network className="text-white" size={28} />
            </motion.div>

            {/* Satellite Nodes */}
            {isInView && (
                <>
                    {/* Node 1: Slack */}
                    <motion.div
                        className="absolute z-10 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-lg left-[25%] top-[25%] -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                    >
                        <Slack className="text-pink-400" size={20} />
                    </motion.div>

                    {/* Node 2: Drive */}
                    <motion.div
                        className="absolute z-10 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-lg left-[75%] top-[25%] -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1, type: "spring", bounce: 0.5 }}
                    >
                        <FileText className="text-blue-400" size={20} />
                    </motion.div>

                    {/* Node 3: Jira */}
                    <motion.div
                        className="absolute z-10 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-lg left-[50%] top-[75%] -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.5 }}
                    >
                        <Trello className="text-blue-500" size={20} />
                    </motion.div>
                </>
            )}

            {/* Expanding rings */}
            {isInView && (
                <motion.div
                    className="absolute w-16 h-16 rounded-full border border-indigo-500/50"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
            )}
        </div>
    );
};

// 4. Counter Jump (Calculadora de ROI Dinámica)
const CounterJumpAnim = () => {
    const [sliderValue, setSliderValue] = useState(50);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    // Animate to new value when slider changes
    useEffect(() => {
        const targetValue = sliderValue * 1250; // Arbitrary multiplier for ROI
        const controls = animate(count, targetValue, {
            duration: 1.5,
            ease: "easeOut",
        });
        return controls.stop;
    }, [sliderValue, count]);

    return (
        <div className="relative w-full h-48 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-6">
            <div className="text-slate-400 text-sm mb-2 font-medium tracking-wide">AHORRO ANUAL PROYECTADO</div>

            <div className="flex items-center gap-1 mb-6">
                <span className="text-3xl font-bold text-green-400">$</span>
                <motion.span className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                    {rounded}
                </motion.span>
            </div>

            <div className="w-full max-w-[80%] flex flex-col items-center gap-2">
                <div className="flex justify-between w-full text-xs text-slate-500">
                    <span>10 Leads/mes</span>
                    <span>100+ Leads/mes</span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                    aria-label="Volumen de leads"
                />
            </div>
        </div>
    );
};

// --- Main Section Component ---

const portfolioItems = [
    {
        id: "crm",
        title: "CRM Autónomo con InsForge",
        description: "Sistema que no solo guarda datos, sino que identifica churn y propone ofertas automáticamente consultando la base de datos PostgreSQL en tiempo real.",
        icon: DatabaseZap,
        animation: <DataFlowAnim />,
        color: "cyan",
        tags: ["PostgreSQL", "Predictivo", "Retención"]
    },
    {
        id: "content",
        title: "Pipeline de Contenido Infinito",
        description: "Basado en NotebookLM. El cliente sube un video o PDF y el agente genera 30 días de contenido (SEO, Reels, Hilos) deduciendo y manteniendo la voz de la marca.",
        icon: FileText,
        animation: <TypingGhostAnim />,
        color: "emerald",
        tags: ["NotebookLM", "SEO", "Omnicanal"]
    },
    {
        id: "onboarding",
        title: "Arquitecto de Onboarding",
        description: "Un agente que configura automáticamente el entorno de trabajo completo de un nuevo cliente (Slack, Drive, Jira) usando nuestro servidor MCP propietario (n8n).",
        icon: Network,
        animation: <NodeExpansionAnim />,
        color: "indigo",
        tags: ["n8n", "MCP", "Workflow"]
    },
    {
        id: "roi",
        title: "Calculadora de ROI Dinámica",
        description: "Analizamos tu operación actual y proyectamos el ahorro anual hiper-personalizado al implementar nuestras automatizaciones en tu rubro específico.",
        icon: Calculator,
        animation: <CounterJumpAnim />,
        color: "green",
        tags: ["Finanzas", "Proyección", "Lead Magnet"]
    }
];

export function PortfolioSection() {
    return (
        <section id="portfolio" className="relative py-24 bg-slate-950 overflow-hidden border-t border-slate-800">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 space-y-16">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
                    >
                        <Sparkles size={16} />
                        <span>Portafolio &quot;IA-First&quot;</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                    >
                        Hablamos con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Resultados Visibles</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400"
                    >
                        Nuestros sistemas no son simples scripts; son agentes cognitivos con &quot;vida propia&quot; que operan tu negocio 24/7.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {portfolioItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group flex flex-col rounded-2xl bg-slate-900/40 border border-slate-800/60 overflow-hidden hover:bg-slate-900/60 hover:border-slate-700 transition-colors duration-300 shadow-xl"
                        >
                            {/* Animation Container */}
                            <div className="p-4 sm:p-6 border-b border-slate-800/60 bg-slate-950/30">
                                {item.animation}
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn(
                                        "p-2 rounded-lg flex items-center justify-center",
                                        item.color === "cyan" && "bg-cyan-500/10 text-cyan-400",
                                        item.color === "emerald" && "bg-emerald-500/10 text-emerald-400",
                                        item.color === "indigo" && "bg-indigo-500/10 text-indigo-400",
                                        item.color === "green" && "bg-green-500/10 text-green-400"
                                    )}>
                                        <item.icon size={20} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-slate-400 leading-relaxed mb-6 flex-1">
                                    {item.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 mt-auto">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50 group-hover:border-slate-600 transition-colors shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                    <div className="ml-auto">
                                        <button className="text-slate-500 hover:text-white transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Ver más detalles">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PortfolioSection;
