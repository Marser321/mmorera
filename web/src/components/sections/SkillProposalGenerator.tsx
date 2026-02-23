"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Activity, PenTool, CheckCircle2 } from "lucide-react";

export function SkillProposalGenerator() {
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [proposal, setProposal] = useState<{
        objetivo_proyecto: string;
        nuestro_enfoque: string;
        concepto_economico_1: number;
        concepto_economico_2: number;
        total: number;
    } | null>(null);

    const generateProposal = () => {
        if (!input.trim()) return;

        setIsGenerating(true);
        setProposal(null);

        // Simulamos el delay de generación (LLM)
        setTimeout(() => {
            // Simulamos parseo de la IA (Mock data)
            setProposal({
                objetivo_proyecto: "Desarrollar un sistema integral de captación B2B automatizado para escalar la adquisición de clientes calificados, reduciendo la carga operativa del equipo de ventas actual mediante herramientas de IA y flujos de N8N.",
                nuestro_enfoque: "Implementaremos el Framework Medina: dividiremos el proyecto en Sprints modulares, comenzando con un Producto Mínimo Viable (MVP) enfocado en Calificación de Leads, para luego expandir al embudo completo de conversión en 4 semanas.",
                concepto_economico_1: 2500,
                concepto_economico_2: 1200,
                total: 3700
            });
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Input Form (Sales Rep Side) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-primary to-transparent rounded-t-2xl opacity-50"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <PenTool className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Notas de Discovery</h3>
                        <p className="text-xs text-muted-foreground">Escribe los apuntes desordenados de tu reunión</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Apuntes Crudos</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ej: El cliente quiere automatizar ventas B2B. Dice que pierde mucho tiempo. Presupuesto max 4k. Quiere un MVP rápido."
                            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm resize-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <Button
                        onClick={generateProposal}
                        disabled={isGenerating || !input.trim()}
                        className="w-full bg-purple-600 text-white hover:bg-purple-700 h-12 rounded-xl text-base font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                    >
                        {isGenerating ? (
                            <>
                                <Activity className="w-5 h-5 mr-2 animate-pulse" />
                                Redactando Propuesta...
                            </>
                        ) : (
                            <>
                                Generar Propuesta Comercial
                                <FileText className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Column: AI Console (Output) */}
            <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[400px]">

                <div className="border-b border-white/5 bg-white/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Bot className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="font-mono text-sm tracking-tight text-purple-100">AI_Proposal_Builder</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    </div>
                </div>

                <div className="p-6 flex-1 font-mono text-sm overflow-y-auto relative">
                    {isGenerating && (
                        <div className="absolute inset-0 bg-purple-950/20 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 text-purple-400 border border-purple-500/20 rounded-b-2xl">
                            <Activity className="w-8 h-8 animate-spin mb-3" />
                            <span className="animate-pulse tracking-widest text-xs uppercase">Transformando apuntes en Copy Persuasivo...</span>
                        </div>
                    )}

                    {!proposal && !isGenerating ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <FileText className="w-12 h-12 mb-4 opacity-20" />
                            <p>Esperando notas de la reunión...</p>
                        </div>
                    ) : null}

                    {proposal && !isGenerating && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-muted-foreground mb-2">{">"} Estructurando JSON y enviando vía N8N a Google Slides... OK</div>

                            <div className="bg-black/50 rounded-lg p-4 border border-white/5">
                                <pre className="text-purple-300 whitespace-pre-wrap word-break">
                                    {JSON.stringify(proposal, null, 2)}
                                </pre>
                            </div>

                            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Tiempo ahorrado: ~2.5 horas</span>
                                <span className="flex items-center text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> PDF Listo para Enviar
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
