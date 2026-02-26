"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, ShieldX, ShieldCheck, Loader2 } from "lucide-react";
import { startOrResumeChatSession, saveChatMessage, getChatHistory } from "@/lib/chat-api";


type Message = {
    role: "user" | "assistant";
    content: string;
    isError?: boolean;
};

export function SkillStrictRAG() {
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hola. Soy el Agente RAG Corporativo. Solo tengo acceso a la base de datos interna de la empresa. ¿En qué puedo ayudarte?" }
    ]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    useEffect(() => {
        const initChat = async () => {
            try {
                const id = await startOrResumeChatSession('rag-strict');
                setSessionId(id);
                const history = await getChatHistory(id);
                if (history && history.length > 0) {
                    setMessages(history.map((msg: { role: string; content: string }) => ({
                        role: msg.role as "user" | "assistant",
                        content: msg.content
                    })));
                }
            } catch (err) {
                console.error("No se pudo iniciar supase", err);
            } finally {
                setIsLoadingHistory(false);
            }
        };
        initChat();
    }, []);

    // Mock RAG Logic con guardado en DB
    const handleSend = async () => {
        if (!(input || "").trim() || !sessionId) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsThinking(true);

        // Guardar mensaje del usuario
        await saveChatMessage(sessionId, "user", userMsg);

        setTimeout(async () => {
            const lowerInput = userMsg.toLowerCase();
            let response: Message;

            // Simple mock vector search
            if (lowerInput.includes("agencia") || lowerInput.includes("servicios") || lowerInput.includes("sistemas") || lowerInput.includes("precio")) {
                response = {
                    role: "assistant",
                    content: "Según la Base de Datos (Documento: Portfolio_2026.pdf), nuestros sistemas productizados incluyen: Calificadores de Leads, Generadores de Propuestas, RAGs Internos y Automatización de Seguimiento. Los Sprints comienzan desde los $2,000 USD dependiendo de la complejidad."
                };
            } else if (lowerInput.includes("tiempo") || lowerInput.includes("sprint") || lowerInput.includes("demora")) {
                response = {
                    role: "assistant",
                    content: "En la documentación interna (SLA_Operations.md) se establece que un MVP funcional de un agente de IA tarda aproximadamente de 2 a 4 semanas en desplegarse en producción."
                };
            } else {
                // Out of domain restriction (Anti-Hallucination)
                response = {
                    role: "assistant",
                    content: "ACCESO DENEGADO: Lo siento, actualmente no contamos con este tipo de información en nuestra base de conocimientos. Mi directiva me impide generar respuestas no verificadas sobre este tema.",
                    isError: true
                };
            }

            setMessages(prev => [...prev, response]);
            await saveChatMessage(sessionId, "assistant", response.content);
            setIsThinking(false);
        }, 1200);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Context / Explanation */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative h-full flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-transparent rounded-t-2xl opacity-50"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Cerebro RAG Restringido</h3>
                        <p className="text-xs text-muted-foreground">Sistema Anti-Alucinaciones</p>
                    </div>
                </div>

                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Los Chatbots tradicionales inventan respuestas cuando no saben algo. Esto es un riesgo enorme para tu reputación corporativa.
                    </p>
                    <p>
                        Esta Demo muestra un agente <strong>RAG (Retrieval-Augmented Generation)</strong> configurado con restricciones absolutas. Solo responde si encuentra la información en el &quot;PDF/Contexto&quot; que se le ha provisto.
                    </p>
                    <div className="bg-black/50 border border-white/5 p-4 rounded-xl mt-4">
                        <p className="text-white font-medium mb-2">Prueba preguntar:</p>
                        <ul className="list-disc list-inside space-y-1 text-accent/80">
                            <li>&quot;¿Qué servicios ofrece la agencia?&quot; (Dentro del dominio)</li>
                            <li>&quot;¿Cuánto demora un MVP?&quot; (Dentro del dominio)</li>
                            <li className="text-red-400/80">&quot;¿Quién ganó el mundial en 2022?&quot; (Fuera del dominio ➔ Bloqueado)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Column: Chat UI */}
            <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[450px]">

                <div className="border-b border-white/5 bg-white/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                            <Bot className="w-4 h-4 text-accent" />
                        </div>
                        <span className="font-mono text-sm tracking-tight text-white/80">Strict_RAG_Interface</span>
                        {isLoadingHistory && <Loader2 className="w-3 h-3 text-muted-foreground animate-spin ml-2" />}
                    </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-xl p-3 text-sm ${msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : msg.isError
                                    ? "bg-red-500/10 border border-red-500/20 text-red-100"
                                    : "bg-white/5 border border-white/10 text-muted-foreground"
                                }`}>
                                {msg.role === "assistant" && msg.isError && (
                                    <ShieldX className="w-4 h-4 text-red-400 mb-2" />
                                )}
                                <p className="leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                <div className="w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-black border-t border-white/5">
                    <div className="flex gap-2 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Hazle una pregunta al manual..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isThinking || !(input || "").trim()}
                            size="icon"
                            className="bg-accent hover:bg-accent/80 text-black shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
