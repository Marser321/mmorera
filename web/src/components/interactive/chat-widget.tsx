"use client";

import * as React from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";

/**
 * ChatWidget — burbuja interactiva de IA.
 * Usa Vercel AI SDK (useChat) para manejar el estado conversacional efímero.
 */
export function ChatWidget() {
    const [abierto, setAbierto] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Vercel AI SDK
    // @ts-expect-error Types mismatch in AI SDK
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        // @ts-expect-error Internal API path
        api: '/api/chat',
        // Mensaje inicial optimista, guardado en el cliente para dar contexto.
        initialMessages: [
            {
                id: 'msg_1',
                role: 'assistant',
                content: "¡Hola! Soy NEXO. ¿Cómo te puedo ayudar hoy con potenciar tu negocio?",
            }
        ]
    }) as { messages: { id?: string, role: string, content: string }[], input: string, handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void, isLoading: boolean };

    // Auto-scroll al último mensaje
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Focus al input cuando se abre
    React.useEffect(() => {
        if (abierto && inputRef.current) {
            inputRef.current.focus();
        }
    }, [abierto]);

    // Usamos el id por defecto de useChat para los keys de los mensajes
    return (
        <>
            {/* Panel del Chat */}
            <div
                className={cn(
                    "fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm transition-all duration-300 origin-bottom-right",
                    abierto
                        ? "scale-100 opacity-100 pointer-events-auto"
                        : "scale-95 opacity-0 pointer-events-none"
                )}
                role="dialog"
                aria-label="Chat con asistente de IA"
                aria-hidden={!abierto}
            >
                <div className="glass rounded-2xl border border-border/30 shadow-2xl shadow-primary/10 overflow-hidden flex flex-col max-h-[70vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/20 bg-card/40">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/15 flex items-center justify-center">
                                <Bot className="size-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    NEXO AI
                                </p>
                                <p className="text-[0.65rem] text-muted-foreground flex gap-1 items-center">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    En Línea
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 hover:bg-white/5"
                            onClick={() => setAbierto(false)}
                            aria-label="Cerrar chat"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>

                    {/* Mensajes */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] scroll-smooth"
                    >
                        {messages.map((msg: { id?: string, role: string, content: string }, index: number) => (
                            <div
                                key={msg.id || `chat-msg-${index}`}
                                className={cn(
                                    "flex gap-2 items-end",
                                    msg.role === "user" && "flex-row-reverse"
                                )}
                            >
                                <div
                                    className={cn(
                                        "size-6 rounded-full flex items-center justify-center shrink-0",
                                        msg.role === "user"
                                            ? "bg-secondary text-foreground"
                                            : "bg-primary/15 text-primary"
                                    )}
                                    aria-hidden="true"
                                >
                                    {msg.role === "user" ? (
                                        <User className="size-3" />
                                    ) : (
                                        <Bot className="size-3" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                            : "bg-card/60 border border-white/5 text-foreground rounded-bl-sm"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Indicador "escribiendo..." si la API está respondiendo */}
                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                            <div className="flex gap-2 items-end">
                                <div
                                    className="size-6 rounded-full bg-primary/15 flex items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <Bot className="size-3 text-primary" />
                                </div>
                                <div className="bg-card/60 border border-white/5 rounded-xl rounded-bl-sm px-3 py-2">
                                    <div className="flex gap-1" aria-label="Escribiendo...">
                                        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                                        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                                        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="border-t border-border/20 p-3 bg-card/20 backdrop-blur-md">
                        <div className="flex gap-2 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Escribí tu mensaje..."
                                className="flex-1 bg-background/50 border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                                aria-label="Mensaje para el asistente"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                variant="default"
                                size="icon"
                                disabled={!(input || "").trim() || isLoading}
                                aria-label="Enviar mensaje"
                                className="shrink-0 h-[42px] w-[42px] transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                            >
                                <Send className="size-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground/60 mt-2">NEXO AI puede cometer errores.</p>
                    </form>
                </div>
            </div>

            {/* Botón flotante */}
            <Button
                variant="default"
                size="icon"
                className={cn(
                    "fixed bottom-4 right-4 z-50 size-14 rounded-full shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-110",
                    abierto ? "rotate-90 scale-100 shadow-none hover:rotate-90 hover:scale-95" : "animate-glow-pulse"
                )}
                onClick={() => setAbierto(!abierto)}
                aria-label={abierto ? "Cerrar asistente IA" : "Abrir asistente IA"}
            >
                {abierto ? (
                    <X className="size-6 transition-transform" />
                ) : (
                    <MessageCircle className="size-6" />
                )}
            </Button>
        </>
    );
}

