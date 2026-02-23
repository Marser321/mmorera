"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Activity, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";

export function SkillLeadQualifier() {
    const [input, setInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{
        nombre_cliente: string;
        servicio: string;
        clasificacion: "CALIENTE" | "MEDIO" | "FRIO" | null;
    } | null>(null);

    // Palabras clave MVP para simular la IA
    const hotKeywords = ["urgente", "5000", "presupuesto alto", "comprar", "agencia", "automatización completa", "inmediato", "ahora"];
    const coldKeywords = ["información", "duda", "barato", "consulta", "gratis", "precio", "curiosidad"];

    const analyzeLead = () => {
        if (!input.trim()) return;

        setIsAnalyzing(true);
        setResult(null);

        // Simulamos el delay de la API (LLM)
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let classification: "CALIENTE" | "MEDIO" | "FRIO" = "MEDIO";

            if (hotKeywords.some(kw => lowerInput.includes(kw))) {
                classification = "CALIENTE";
            } else if (coldKeywords.some(kw => lowerInput.includes(kw))) {
                classification = "FRIO";
            }

            setResult({
                nombre_cliente: "Lead_Web_Demo",
                servicio: input,
                clasificacion: classification
            });
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Input Form (Client Side) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-transparent rounded-t-2xl opacity-50"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Formulario de Contacto</h3>
                        <p className="text-xs text-muted-foreground">Simula lo que escribiría tu cliente potencial</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">¿En qué podemos ayudarte?</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ej: Necesito una automatización urgente de $5000 para mi agencia..."
                            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <Button
                        onClick={analyzeLead}
                        disabled={isAnalyzing || !input.trim()}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-base font-medium transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                    >
                        {isAnalyzing ? (
                            <>
                                <Activity className="w-5 h-5 mr-2 animate-pulse" />
                                Analizando Intención...
                            </>
                        ) : (
                            <>
                                Simular Envío de Lead
                                <Send className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Column: AI Console (Agency Side) */}
            <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[400px]">

                <div className="border-b border-white/5 bg-white/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Bot className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-mono text-sm tracking-tight text-emerald-100">AI_Router_Engine</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                </div>

                <div className="p-6 flex-1 font-mono text-sm overflow-y-auto relative">
                    {/* Scanning Animation overlay */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 text-emerald-400 border border-emerald-500/20 rounded-b-2xl">
                            <Activity className="w-8 h-8 animate-spin mb-3" />
                            <span className="animate-pulse tracking-widest text-xs uppercase">Evaluando Variables Múltiples...</span>
                        </div>
                    )}

                    {!result && !isAnalyzing ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Bot className="w-12 h-12 mb-4 opacity-20" />
                            <p>Esperando payload de entrada...</p>
                        </div>
                    ) : null}

                    {result && !isAnalyzing && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-muted-foreground mb-2">{">"} Analizando objeto JSON de entrada... OK</div>
                            <div className="text-muted-foreground mb-4">{">"} Ejecutando Prompt Maestro (Clasificador)... OK</div>

                            <div className="bg-black/50 rounded-lg p-4 border border-white/5">
                                <pre className="text-emerald-400 whitespace-pre-wrap word-break">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>

                            {/* Action taken based on classification */}
                            <div className="mt-6 border-t border-white/10 pt-4">
                                {result.clasificacion === "CALIENTE" && (
                                    <div className="flex items-start gap-3 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-xs mb-1 uppercase tracking-widest text-red-300">Acción Ejecutada</p>
                                            <p className="text-xs">Ticket alto detectado. Alerta enviada inmediatamente al canal #ventas en Slack y asignado a un Closer.</p>
                                        </div>
                                    </div>
                                )}
                                {result.clasificacion === "MEDIO" && (
                                    <div className="flex items-start gap-3 text-yellow-400 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-xs mb-1 uppercase tracking-widest text-yellow-300">Acción Ejecutada</p>
                                            <p className="text-xs">Lead estándar. Introducido en N8N para campaña de nutrición (Nurturing) vía Email.</p>
                                        </div>
                                    </div>
                                )}
                                {result.clasificacion === "FRIO" && (
                                    <div className="flex items-start gap-3 text-blue-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-xs mb-1 uppercase tracking-widest text-blue-300">Acción Ejecutada</p>
                                            <p className="text-xs">Consulta general. Respondido automáticamente por el Agente FAQ (Skill 3) para no gastar tiempo humano.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
