'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Inbox, 
    Cpu, 
    Database, 
    MessageSquare, 
    BarChart2, 
    Zap, 
    Terminal, 
    RefreshCw, 
    Wifi 
} from 'lucide-react';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';
import { SYSTEMS_NODES, SystemNodeData } from './systemsData';

// Componente para mapear el icono por string
function NodeIcon({ name, className }: { name: string; className?: string }) {
    switch (name) {
        case 'Inbox': return <Inbox className={className} />;
        case 'Cpu': return <Cpu className={className} />;
        case 'Database': return <Database className={className} />;
        case 'MessageSquare': return <MessageSquare className={className} />;
        case 'BarChart2': return <BarChart2 className={className} />;
        case 'Zap': return <Zap className={className} />;
        default: return <Cpu className={className} />;
    }
}

// Coloreador de sintaxis JSON en tiempo real para la terminal
function HighlightedJSON({ obj }: { obj: Record<string, unknown> }) {
    const formattedLines = useMemo(() => {
        const str = JSON.stringify(obj, null, 2);
        return str.split('\n').map((line, idx) => {
            const keyMatch = line.match(/^(\s*)"([^"]+)":/);
            if (keyMatch) {
                const indent = keyMatch[1];
                const key = keyMatch[2];
                const rest = line.substring(keyMatch[0].length);
                
                let valClass = 'text-zinc-300';
                if (rest.includes('"')) valClass = 'text-amber-300/90';
                else if (rest.match(/\d+/)) valClass = 'text-orange-400';
                else if (rest.includes('true') || rest.includes('false')) valClass = 'text-emerald-400';
                
                return (
                    <div key={idx} className="font-mono text-[9px] leading-relaxed">
                        {indent}
                        <span className="text-zinc-600">&quot;</span>
                        <span className="text-zinc-100 font-medium">{key}</span>
                        <span className="text-zinc-600">&quot;:</span>
                        <span className={valClass}>{rest}</span>
                    </div>
                );
            }
            return (
                <div key={idx} className="font-mono text-[9px] leading-relaxed text-zinc-600">
                    {line}
                </div>
            );
        });
    }, [obj]);

    return <div className="space-y-0.5">{formattedLines}</div>;
}

export function SistemasBlueprint() {
    const { isDevMode } = useDevMode();
    const { language } = useLanguage();

    const [selectedNode, setSelectedNode] = useState<SystemNodeData | null>(null);
    const [hoveredNode, setHoveredNode] = useState<SystemNodeData | null>(null);
    const [nodeLatencies, setNodeLatencies] = useState<Record<string, number>>({});
    
    // Logs vivos auto-generados para la consola cuando no hay inspección activa
    const [liveLogs, setLiveLogs] = useState<Array<{ id: number; text: string; time: string; type: string }>>([]);
    const logIdCounter = useRef(0);
    const liveLogsContainerRef = useRef<HTMLDivElement>(null);

    // Simulación de fluctuación de latencia
    useEffect(() => {
        const interval = setInterval(() => {
            const updated: Record<string, number> = {};
            SYSTEMS_NODES.forEach(node => {
                const variance = Math.round((Math.random() - 0.5) * (node.initialLatency * 0.15));
                updated[node.id] = Math.max(1, node.initialLatency + variance);
            });
            setNodeLatencies(updated);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    // Stream de logs dinámicos en vivo
    useEffect(() => {
        // Logs iniciales de relleno rápido
        const initialLogs = [
            { id: ++logIdCounter.current, text: 'SYSTEM: Pipeline initialized. Listening for webhooks...', time: '17:15:00', type: 'info' },
            { id: ++logIdCounter.current, text: 'DATABASE: Connected to Postgres database (insforge_db)', time: '17:15:01', type: 'success' },
            { id: ++logIdCounter.current, text: 'METRICS: Cache metrics synced. Listening on port 443', time: '17:15:02', type: 'info' }
        ];
        setLiveLogs(initialLogs);

        const logsTemplates = [
            { text: { es: 'INBOUND: Formulario recibido en /api/leads', en: 'INBOUND: Form submit caught at /api/leads' }, type: 'info' },
            { text: { es: 'ROUTER: Parsing webhook payload. Event: form_submit', en: 'ROUTER: Parsing webhook payload. Event: form_submit' }, type: 'info' },
            { text: { es: 'AI_QUALIFIER: Llamando API de OpenAI. Analizando intenciones...', en: 'AI_QUALIFIER: Calling OpenAI API. Assessing buyer intent...' }, type: 'info' },
            { text: { es: 'AI_QUALIFIER: Score asignado: 94/100. Lead calificado.', en: 'AI_QUALIFIER: Score assigned: 94/100. Qualified lead.' }, type: 'success' },
            { text: { es: 'CRM_SYNC: Registrando contacto ID: ct_92381 en GoHighLevel.', en: 'CRM_SYNC: Registering contact ID: ct_92381 in GoHighLevel.' }, type: 'info' },
            { text: { es: 'WHATSAPP_ALERT: Despachando plantilla de agendamiento vía API.', en: 'WHATSAPP_ALERT: Dispatching scheduling template via API.' }, type: 'info' },
            { text: { es: 'METRICS: ROI e historial recalculados en base de datos.', en: 'METRICS: ROI and history recalculated in db.' }, type: 'success' }
        ];

        let index = 0;
        const interval = setInterval(() => {
            // No alimentar logs si el usuario está inspeccionando activamente con hover o click
            if (hoveredNode || selectedNode) return;

            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            
            const template = logsTemplates[index];
            const newLog = {
                id: ++logIdCounter.current,
                text: template.text[language],
                time: timeStr,
                type: template.type
            };

            setLiveLogs(prev => {
                const updated = [...prev, newLog];
                // Mantener los últimos 20 logs para no sobrecargar el DOM
                return updated.slice(-20);
            });

            index = (index + 1) % logsTemplates.length;
        }, 2200);

        return () => clearInterval(interval);
    }, [hoveredNode, selectedNode, language]);

    // Auto-scroll al final del contenedor de logs
    useEffect(() => {
        if (liveLogsContainerRef.current) {
            liveLogsContainerRef.current.scrollTop = liveLogsContainerRef.current.scrollHeight;
        }
    }, [liveLogs]);

    const activeInspectNode = hoveredNode || selectedNode;

    return (
        <section id="sistemas-blueprint" className="py-24 md:py-32 relative bg-transparent overflow-hidden">
            {/* Luces de Fondo (Deep Space) */}
            <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                
                {/* Encabezado */}
                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <span className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-[10px] block mb-3">
                        {language === 'es' ? 'AUTOMATIZACIONES · BLUEPRINT' : 'AUTOMATIONS · BLUEPRINT'}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        {language === 'es' ? 'Flujo de Datos' : 'Data Pipeline'}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500">
                            {language === 'es' ? 'Operativo' : 'In Action'}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-base text-zinc-400 font-light leading-relaxed">
                        {language === 'es'
                            ? 'Un sistema de captación B2B no es estático: es una coreografía de eventos, latencias y llamadas API en cascada. Inspeccioná los nodos del circuito para ver telemetría y payloads reales.'
                            : 'A B2B capture system is not static: it is a choreography of cascading events, latencies, and API calls. Inspect the circuit nodes to see live telemetry and payloads.'
                        }
                    </p>
                </div>

                {/* ──── CIRCUITO DE BLUEPRINT (DESKTOP) ──── */}
                <div className="relative mx-auto hidden md:block max-w-5xl rounded-[2.5rem] border border-white/10 bg-neutral-950/70 p-12 backdrop-blur-xl shadow-3xl overflow-hidden group/blueprint">
                    
                    {/* Rejilla de Fondo Técnica */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

                    {/* LIENZO SVG PARA CABLES DE FIBRA OPTICA (Conexión 1 -> 2 -> 3 -> 4 -> 5 -> 6) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 480" preserveAspectRatio="none">
                        {/* Definición de gradientes y brillos */}
                        <defs>
                            <linearGradient id="cable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                            </linearGradient>
                            <filter id="glow-light">
                                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Cables estáticos de fondo */}
                        <path 
                            d="M 166 120 L 500 120 L 833 120 L 833 360 L 500 360 L 166 360 L 166 120" 
                            fill="none" 
                            stroke="url(#cable-grad)" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-40"
                        />

                        {/* Impulso de datos corriendo (Animado) */}
                        <path 
                            d="M 166 120 L 500 120 L 833 120 L 833 360 L 500 360 L 166 360 Z" 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="3" 
                            strokeDasharray="30 200" 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow-light)"
                            className="animate-[dash_8s_linear_infinite]"
                        />

                        <path 
                            d="M 166 120 L 500 120 L 833 120 L 833 360 L 500 360 L 166 360 Z" 
                            fill="none" 
                            stroke="#06b6d4" 
                            strokeWidth="3" 
                            strokeDasharray="20 250" 
                            strokeDashoffset="120"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow-light)"
                            className="animate-[dash_6s_linear_infinite]"
                        />
                    </svg>

                    {/* Nodos del Grafo (Grid de 3 Col x 2 Filas, Flujo en Serpiente) */}
                    <div className="relative z-10 grid grid-cols-3 gap-y-24 gap-x-12">
                        {/* Fila superior (Izquierda a Derecha): Nodos 1, 2, 3 */}
                        {SYSTEMS_NODES.slice(0, 3).map((node, index) => {
                            const isSelected = selectedNode?.id === node.id;
                            const isHovered = hoveredNode?.id === node.id;
                            const currentLatency = nodeLatencies[node.id] || node.initialLatency;

                            return (
                                <motion.div
                                    key={node.id}
                                    onMouseEnter={() => setHoveredNode(node)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={() => setSelectedNode(isSelected ? null : node)}
                                    className={`relative rounded-2xl border p-5 text-left cursor-pointer transition-all duration-300 select-none flex flex-col justify-between h-48 ${
                                        isSelected || isHovered
                                            ? 'border-cyan-400 bg-neutral-950 shadow-[0_0_25px_rgba(34,211,238,0.15)] z-20' 
                                            : 'border-white/5 bg-neutral-950/60 hover:border-white/20'
                                    }`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                                            isSelected || isHovered
                                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                                : 'bg-white/5 border-white/5 text-zinc-500'
                                        }`}>
                                            <NodeIcon name={node.iconName} className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-600">
                                            <span>STEP 0{index + 1}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                            {node.title[language]}
                                        </h3>
                                        <p className="mt-1 text-[10px] text-zinc-400 font-light leading-relaxed line-clamp-2">
                                            {node.detail[language]}
                                        </p>
                                    </div>

                                    {/* Telemetría Integrada */}
                                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[8px] text-zinc-500">
                                        <span>LATENCY</span>
                                        <span className="text-white font-medium">{currentLatency}ms</span>
                                    </div>
                                    <div className="flex items-center justify-between font-mono text-[8px] text-zinc-500">
                                        <span>STATUS</span>
                                        <span className={node.httpStatus < 300 ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                                            {node.httpStatus} OK
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Fila inferior (Derecha a Izquierda): Nodos 6, 5, 4 (Revertido visualmente para mantener serpiente) */}
                        {/* index = 5, 4, 3 */}
                        {[5, 4, 3].map((nodeIdx) => {
                            const node = SYSTEMS_NODES[nodeIdx];
                            const isSelected = selectedNode?.id === node.id;
                            const isHovered = hoveredNode?.id === node.id;
                            const currentLatency = nodeLatencies[node.id] || node.initialLatency;

                            return (
                                <motion.div
                                    key={node.id}
                                    onMouseEnter={() => setHoveredNode(node)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={() => setSelectedNode(isSelected ? null : node)}
                                    className={`relative rounded-2xl border p-5 text-left cursor-pointer transition-all duration-300 select-none flex flex-col justify-between h-48 ${
                                        isSelected || isHovered
                                            ? 'border-emerald-400 bg-neutral-950 shadow-[0_0_25px_rgba(16,185,129,0.15)] z-20' 
                                            : 'border-white/5 bg-neutral-950/60 hover:border-white/20'
                                    }`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                                            isSelected || isHovered
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                : 'bg-white/5 border-white/5 text-zinc-500'
                                        }`}>
                                            <NodeIcon name={node.iconName} className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-600">
                                            <span>STEP 0{nodeIdx + 1}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                            {node.title[language]}
                                        </h3>
                                        <p className="mt-1 text-[10px] text-zinc-400 font-light leading-relaxed line-clamp-2">
                                            {node.detail[language]}
                                        </p>
                                    </div>

                                    {/* Telemetría Integrada */}
                                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[8px] text-zinc-500">
                                        <span>LATENCY</span>
                                        <span className="text-white font-medium">{currentLatency}ms</span>
                                    </div>
                                    <div className="flex items-center justify-between font-mono text-[8px] text-zinc-500">
                                        <span>STATUS</span>
                                        <span className={node.httpStatus < 300 ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                                            {node.httpStatus} OK
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ──── CIRCUITO DE BLUEPRINT (MOBILE) ──── */}
                <div className="grid gap-4 md:hidden max-w-md mx-auto relative pl-8">
                    {/* Línea vertical izquierda de circuito */}
                    <div className="absolute top-4 bottom-4 left-3 w-[2px] bg-gradient-to-b from-cyan-500 via-emerald-500 to-violet-500" />
                    
                    {SYSTEMS_NODES.map((node, index) => {
                        const isSelected = selectedNode?.id === node.id;
                        const currentLatency = nodeLatencies[node.id] || node.initialLatency;

                        return (
                            <div
                                key={node.id}
                                onClick={() => setSelectedNode(isSelected ? null : node)}
                                className={`relative rounded-xl border p-4 text-left cursor-pointer transition-all duration-300 ${
                                    isSelected 
                                        ? 'border-emerald-500 bg-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                                        : 'border-white/5 bg-neutral-950/60'
                                }`}
                            >
                                {/* Círculo indicador en el riel */}
                                <div className={`absolute left-[-26px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-neutral-950 z-10 transition-colors duration-300 ${
                                    isSelected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'
                                }`} />

                                <div className="flex items-start gap-3">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                        isSelected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/5 text-zinc-500'
                                    }`}>
                                        <NodeIcon name={node.iconName} className="h-4.5 w-4.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-white">
                                                {node.title[language]}
                                            </h3>
                                            <span className="font-mono text-[7px] text-zinc-500">
                                                0{index + 1} | {currentLatency}ms
                                            </span>
                                        </div>
                                        <p className="text-[9px] text-zinc-400 mt-1 line-clamp-2 font-light">
                                            {node.detail[language]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ──── LA CONSOLA DE TELEMETRÍA Y LOGS VIVOS ──── */}
                <div className="mt-12 max-w-5xl mx-auto bg-black border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    
                    {/* Header de Terminal */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                        <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                            <span>System Diagnostics Terminal</span>
                        </div>

                        {/* Botón de reset/desinspeccionar si hay un nodo inspeccionado */}
                        {activeInspectNode ? (
                            <button 
                                onClick={() => {
                                    setSelectedNode(null);
                                    setHoveredNode(null);
                                }}
                                className="flex items-center gap-1 font-mono text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md hover:bg-emerald-500/20 transition-colors"
                            >
                                <RefreshCw className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '3s' }} />
                                <span>{language === 'es' ? 'VER LOGS EN VIVO' : 'RESUME LIVE STREAM'}</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-1 font-mono text-[8px] text-emerald-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{language === 'es' ? 'CONSOLA EN VIVO' : 'LIVE CONSOLE'}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6">
                        
                        {/* Columna Izquierda: Log Stream (Vivos o específicos de Nodo) */}
                        <div className="lg:col-span-7 flex flex-col h-60">
                            <div className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest pb-1 border-b border-white/5 mb-2">
                                {activeInspectNode 
                                    ? `NODE LOGS // ${activeInspectNode.id.toUpperCase()}` 
                                    : 'EVENT STREAM // INCOMING PIPELINE'
                                }
                            </div>
                            
                            <div 
                                ref={liveLogsContainerRef}
                                className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2.5 text-left pr-2 scrollbar-thin scrollbar-thumb-white/10"
                            >
                                <AnimatePresence mode="popLayout">
                                    {activeInspectNode ? (
                                        // Logs específicos del Nodo Inspeccionado
                                        <motion.div
                                            key={`inspect-${activeInspectNode.id}`}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="space-y-2.5"
                                        >
                                            <p className="text-zinc-500 italic">
                                                {language === 'es' 
                                                    ? `// Mostrando logs detallados para '${activeInspectNode.title[language]}'. Engine: ${activeInspectNode.tech}`
                                                    : `// Showing detailed logs for '${activeInspectNode.title[language]}'. Engine: ${activeInspectNode.tech}`
                                                }
                                            </p>
                                            {activeInspectNode.logs.map((log, idx) => (
                                                <div 
                                                    key={idx}
                                                    className={`leading-relaxed ${
                                                        log.type === 'success' ? 'text-emerald-400' :
                                                        log.type === 'warn' ? 'text-yellow-400' :
                                                        log.type === 'error' ? 'text-red-400' : 'text-zinc-300'
                                                    }`}
                                                >
                                                    <span className="text-zinc-600 mr-2">[INSPECT]</span>
                                                    &gt; {log[language]}
                                                </div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        // Logs vivos generales del pipeline
                                        liveLogs.map((log) => (
                                            <motion.div
                                                key={log.id}
                                                layout
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`leading-relaxed ${
                                                    log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'
                                                }`}
                                            >
                                                <span className="text-zinc-600 mr-2">[{log.time}]</span>
                                                {log.text}
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Columna Derecha: JSON Schema Payload */}
                        <div className="lg:col-span-5 flex flex-col h-60 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
                            <div className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest pb-1 border-b border-white/5 mb-2 flex items-center justify-between">
                                <span>PAYLOAD SCHEMA</span>
                                {activeInspectNode && (
                                    <span className="text-cyan-400 font-bold">{activeInspectNode.tech}</span>
                                )}
                            </div>

                            <div className="flex-1 overflow-auto bg-neutral-950 p-3 rounded-lg border border-white/5 select-text text-left">
                                {activeInspectNode ? (
                                    <HighlightedJSON obj={activeInspectNode.payload} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <Wifi className="w-6 h-6 text-zinc-600 animate-pulse mb-2" />
                                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                                            {language === 'es' 
                                                ? 'Inspecciona un nodo para analizar su JSON Payload Schema'
                                                : 'Inspect a node to analyze its JSON Payload Schema'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Overlay para DevMode */}
            {isDevMode && (
                <div className="absolute inset-0 z-0 border-[6px] border-emerald-500/20 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/10" />
                    <span className="absolute bottom-4 left-4 font-mono text-[8px] text-emerald-500/30 uppercase tracking-widest">
                        Blueprint Node Graph // Active Connections: 6 // Circuit Loop: serp_v2
                    </span>
                </div>
            )}
        </section>
    );
}
