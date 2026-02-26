"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Activity, PenTool, CheckCircle2, Loader2 } from "lucide-react";
import { startOrResumeChatSession, saveChatMessage, getChatHistory } from "@/lib/chat-api";


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

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    useEffect(() => {
        const initChat = async () => {
            try {
                const id = await startOrResumeChatSession('proposal-generator');
                setSessionId(id);
                const history = await getChatHistory(id);
                // Si ya había historia para esta sesión, la restauramos (opcional según el UX que se  desee)
                if (history && history.length > 0) {
                    // Solo obtenemos la ultima propuesta generada si existe
                    const lastAssistMsg = history.reverse().find((m: { role: string; content: string }) => m.role === 'assistant');
                    if (lastAssistMsg) {
                        try { setProposal(JSON.parse(lastAssistMsg.content)); } catch { }
                    }
                }
            } catch (err) {
                console.error("No se pudo iniciar Supabase", err);
            } finally {
                setIsLoadingHistory(false);
            }
        };
        initChat();
    }, []);

    const generateProposal = async () => {
        if (!(input || "").trim() || !sessionId) return;

        setIsGenerating(true);
        setProposal(null);

        // Guardamos el input del user
        await saveChatMessage(sessionId, "user", input);

        // Simulamos el delay de generación (LLM)
        setTimeout(async () => {
            // Simulamos parseo de la IA (Mock data)
            const generated = {
                objetivo_proyecto: "Desarrollar un sistema integral de captación B2B automatizado para escalar la adquisición de clientes calificados, reduciendo la carga operativa del equipo de ventas actual mediante herramientas de IA y flujos de N8N.",
                nuestro_enfoque: "Implementaremos el Framework Medina: dividiremos el proyecto en Sprints modulares, comenzando con un Producto Mínimo Viable (MVP) enfocado en Calificación de Leads, para luego expandir al embudo completo de conversión en 4 semanas.",
                concepto_economico_1: 2500,
                concepto_economico_2: 1200,
                total: 3700
            };
            setProposal(generated);
            await saveChatMessage(sessionId, "assistant", JSON.stringify(generated));
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Input Form (Sales Rep Side) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-transparent rounded-t-2xl opacity-50"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <PenTool className="w-5 h-5 text-primary" />
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
                            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <Button
                        onClick={generateProposal}
                        disabled={isGenerating || !(input || "").trim()}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-base font-medium transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
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
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-mono text-sm tracking-tight text-white/80">AI_Proposal_Builder</span>
                        {isLoadingHistory && <Loader2 className="w-3 h-3 text-muted-foreground animate-spin ml-2" />}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    </div>
                </div>

                <div className="p-6 flex-1 font-mono text-sm overflow-y-auto relative">
                    {isGenerating && (
                        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 text-primary border border-primary/20 rounded-b-2xl">
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
                                <pre className="text-primary/90 whitespace-pre-wrap word-break">
                                    {JSON.stringify(proposal, null, 2)}
                                </pre>
                            </div>

                            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Tiempo ahorrado: ~2.5 horas</span>
                                <span className="flex items-center text-accent">
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
