"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Input } from "./input";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "agent", text: "¡Hola! Soy el agente de Agencia Mario. ¿En qué sistema de automatización estás interesado?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { role: "user", text: input }]);
        setInput("");

        // Simulate agent typing and response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "agent", text: "Interesante. Para darte la mejor recomendación técnica, ¿podrías agendar una breve auditoría gratuita?" }
            ]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Default Bubble */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform"
                >
                    <MessageSquare className="w-6 h-6" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] sm:w-[380px] h-[500px] flex flex-col shadow-2xl shadow-primary/20 border-white/10 bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-white/5 bg-primary/5 rounded-t-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Mario AI</h3>
                                <p className="text-xs text-primary/80 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> En línea
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                                        {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-muted text-foreground rounded-tr-sm" : "bg-primary/10 border border-primary/20 text-foreground rounded-tl-sm"}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>

                    <CardFooter className="p-3 border-t border-white/5">
                        <form onSubmit={handleSend} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                className="bg-background border-white/10 focus-visible:ring-primary/50"
                            />
                            <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
