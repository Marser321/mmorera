"use client";

import * as React from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Mensaje {
    id: number;
    contenido: string;
    emisor: "bot" | "usuario";
}

const respuestasSimuladas = [
    "¡Hola! Soy el asistente de MMORE. ¿En qué puedo ayudarte hoy?",
    "Podemos analizar tus procesos actuales de marketing y encontrar puntos de automatización con alto impacto. ¿Te interesa saber más sobre nuestra Auditoría de IA?",
    "Nuestra auditoría incluye: mapa de procesos, backlog priorizado, blueprint del sistema recomendado y estimación de ROI. Todo sin compromiso.",
    "¡Genial! Podés agendar directamente desde la sección de Auditoría en esta misma página, o escribirnos a hola@mmore.agency. Respondemos en menos de 24 horas.",
];

/**
 * ChatWidget — burbuja de IA interactiva persistente.
 * Panel expandible con glassmorphism, simulación de respuestas IA.
 * Accesible: role="dialog", aria-label, focus management.
 */
export function ChatWidget() {
    const [abierto, setAbierto] = React.useState(false);
    const [mensajes, setMensajes] = React.useState<Mensaje[]>([]);
    const [inputValor, setInputValor] = React.useState("");
    const [escribiendo, setEscribiendo] = React.useState(false);
    const [respuestaIndex, setRespuestaIndex] = React.useState(0);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Auto-scroll al último mensaje
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensajes]);

    // Focus al input cuando se abre
    React.useEffect(() => {
        if (abierto && inputRef.current) {
            inputRef.current.focus();
        }
    }, [abierto]);

    // Enviar mensaje inicial cuando se abre por primera vez
    React.useEffect(() => {
        if (abierto && mensajes.length === 0) {
            setEscribiendo(true);
            const timer = setTimeout(() => {
                setMensajes([
                    { id: 1, contenido: respuestasSimuladas[0], emisor: "bot" },
                ]);
                setEscribiendo(false);
                setRespuestaIndex(1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [abierto, mensajes.length]);

    const enviarMensaje = () => {
        if (!inputValor.trim() || escribiendo) return;

        const nuevoMensaje: Mensaje = {
            id: mensajes.length + 1,
            contenido: inputValor,
            emisor: "usuario",
        };

        setMensajes((prev) => [...prev, nuevoMensaje]);
        setInputValor("");
        setEscribiendo(true);

        // Respuesta simulada
        setTimeout(() => {
            const respuesta =
                respuestasSimuladas[respuestaIndex % respuestasSimuladas.length];
            setMensajes((prev) => [
                ...prev,
                { id: prev.length + 1, contenido: respuesta, emisor: "bot" },
            ]);
            setEscribiendo(false);
            setRespuestaIndex((prev) => prev + 1);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    };

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
                                    Asistente IA
                                </p>
                                <p className="text-[0.65rem] text-muted-foreground">
                                    Respuesta inmediata
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => setAbierto(false)}
                            aria-label="Cerrar chat"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>

                    {/* Mensajes */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]"
                    >
                        {mensajes.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-2 items-end",
                                    msg.emisor === "usuario" && "flex-row-reverse"
                                )}
                            >
                                <div
                                    className={cn(
                                        "size-6 rounded-full flex items-center justify-center shrink-0",
                                        msg.emisor === "bot"
                                            ? "bg-primary/15 text-primary"
                                            : "bg-secondary text-foreground"
                                    )}
                                    aria-hidden="true"
                                >
                                    {msg.emisor === "bot" ? (
                                        <Bot className="size-3" />
                                    ) : (
                                        <User className="size-3" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                                        msg.emisor === "bot"
                                            ? "bg-card/60 text-foreground rounded-bl-sm"
                                            : "bg-primary text-primary-foreground rounded-br-sm"
                                    )}
                                >
                                    {msg.contenido}
                                </div>
                            </div>
                        ))}

                        {/* Indicador "escribiendo..." */}
                        {escribiendo && (
                            <div className="flex gap-2 items-end">
                                <div
                                    className="size-6 rounded-full bg-primary/15 flex items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <Bot className="size-3 text-primary" />
                                </div>
                                <div className="bg-card/60 rounded-xl rounded-bl-sm px-3 py-2">
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
                    <div className="border-t border-border/20 p-3 bg-card/20">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValor}
                                onChange={(e) => setInputValor(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribí tu mensaje..."
                                className="flex-1 bg-card/40 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                aria-label="Mensaje para el asistente"
                                disabled={escribiendo}
                            />
                            <Button
                                variant="default"
                                size="icon"
                                onClick={enviarMensaje}
                                disabled={!inputValor.trim() || escribiendo}
                                aria-label="Enviar mensaje"
                            >
                                <Send className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón flotante */}
            <Button
                variant="default"
                size="icon"
                className={cn(
                    "fixed bottom-4 right-4 z-50 size-14 rounded-full shadow-lg shadow-primary/30 animate-glow-pulse",
                    abierto && "shadow-none animate-none"
                )}
                onClick={() => setAbierto(!abierto)}
                aria-label={abierto ? "Cerrar asistente IA" : "Abrir asistente IA"}
            >
                {abierto ? (
                    <X className="size-6" />
                ) : (
                    <MessageCircle className="size-6" />
                )}
            </Button>
        </>
    );
}
