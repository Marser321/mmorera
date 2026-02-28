"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Users, FileText, Camera, Paperclip, Clock, Calendar, CheckCircle2, AlertCircle, LayoutDashboard } from "lucide-react";
import { useChat } from "@ai-sdk/react";

type CustomDataMessage = {
    isAttachment?: boolean;
    attachmentType?: "image" | "document";
    filename?: string;
};

type AppTab = "dashboard" | "chat";
type ShiftState = "pending" | "clocked_in" | "clocked_out";

export function SkillOnboardingBot() {
    // Tab switching for the interactive mock phone
    const [activeTab, setActiveTab] = useState<AppTab>("dashboard");

    // Shift State
    const [shiftState, setShiftState] = useState<ShiftState>("pending");
    const [clockInTime, setClockInTime] = useState<string | null>(null);

    // Chat State with AI SDK
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, input, handleInputChange, setInput, append, isLoading } = useChat({
        // @ts-expect-error El SDK inferido no reconoce api, pero es válido en tiempo de ejecución
        api: '/api/chat-hr',
        initialMessages: [
            { id: '1', role: 'assistant', content: '¡Hola Martín! Soy el Agente de MMorera HR. Hoy tienes el turno de 14:00 a 22:00. Recuerda fichar cuando llegues al local. ¿Qué necesitas consultar?' }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    const [customMessages, setCustomMessages] = useState<Record<string, CustomDataMessage>>({});

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeTab === "chat") {
            scrollToBottom();
        }
    }, [messages, isLoading, activeTab]);

    const handleClockIn = () => {
        if (shiftState === "pending") {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            setClockInTime(timeString);
            setShiftState("clocked_in");

            // Background notification from the bot
            append({ role: "assistant", content: `⏱️ Marcaste entrada a las ${timeString}. Validado por geolocalización en sucursal Centro. ¡Buen turno!` });
        } else if (shiftState === "clocked_in") {
            setShiftState("clocked_out");
            append({ role: "assistant", content: `🚪 Marcaste salida. Total del turno: 8h 05m. Tus horas extra fueron registradas automáticamente.` });
        }
    };

    const handleSendAction = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!(input || "").trim() && !(input || "").includes("[IMAGE]") && !(input || "").includes("[SCHEDULE_REQ]")) return;

        let contentToSend = input;
        let isAttach = false;
        let cType: CustomDataMessage["attachmentType"] = undefined;
        let cFile = "";

        if (input === "[IMAGE]") {
            contentToSend = "Envío imagen adjunta: certificado_medico.jpg [IMAGE]";
            isAttach = true;
            cType = "image";
            cFile = "Certificado_Medico.jpg";
        } else if (input === "[SCHEDULE_REQ]") {
            contentToSend = "¿Puedo cambiar mi turno del Viernes por el de Pedro? [SCHEDULE_REQ]";
        }

        const newId = Date.now().toString();

        if (isAttach) {
            setCustomMessages(prev => ({ ...prev, [newId]: { isAttachment: true, attachmentType: cType, filename: cFile } }));
        }

        append({
            id: newId,
            role: "user",
            content: contentToSend
        });

        setInput("");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Context / Explanation */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-primary via-accent to-transparent rounded-t-3xl opacity-50"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-white mb-1">HR App & Asistencia IA</h3>
                        <p className="text-xs font-mono text-primary/70 uppercase tracking-widest">Employee Experience</p>
                    </div>
                </div>

                <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                        Controlar faltas, certificados médicos y cambios de turno a través de WhatsApp es un caos organizativo para el dueño del negocio.
                    </p>
                    <p>
                        Esta solución es un <strong>Software Centralizado con IA integrado</strong>. Reemplaza el reloj tradicional, lee justificativos médicos que mandan los empleados por foto y autogestiona la disponibilidad semanal sin depender del encargado.
                    </p>
                    <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl mt-6 space-y-4">
                        <p className="text-white font-semibold">Prueba la interactividad:</p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`flex items-center gap-2 px-4 py-2 hover:bg-white/10 border rounded-lg text-xs transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/50'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" /> Entra a &quot;Mi Portal&quot; y simula el fichaje de hoy.
                            </button>
                            <button
                                onClick={() => { setActiveTab("chat"); setInput("[SCHEDULE_REQ]"); setTimeout(() => handleSendAction(), 100); }}
                                className={`flex items-center gap-2 px-4 py-2 hover:bg-white/10 border rounded-lg text-xs transition-colors ${activeTab === 'chat' ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/50'}`}
                            >
                                <Calendar className="w-4 h-4 text-accent" /> Negocia un cambio de turno con la IA.
                            </button>
                            <button
                                onClick={() => { setActiveTab("chat"); setInput("[IMAGE]"); setTimeout(() => handleSendAction(), 100); }}
                                className={`flex items-center gap-2 px-4 py-2 hover:bg-white/10 border rounded-lg text-xs transition-colors ${activeTab === 'chat' ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/50'}`}
                            >
                                <Camera className="w-4 h-4 text-primary" /> Sube un justificativo médico de prueba.
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Mobile App UI */}
            <div className="flex justify-center -mt-4 md:mt-0 lg:ml-8">
                {/* Phone Container */}
                <div className="relative w-[320px] h-[650px] bg-black border-[6px] border-[#1f1f1f] rounded-[2.5rem] shadow-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 flex flex-col">

                    {/* Dynamic Island Notch */}
                    <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
                        <div className="w-24 h-6 bg-[#0a0a0a] rounded-b-xl border border-t-0 border-white/10"></div>
                    </div>

                    {/* App Header Tab Bar */}
                    <div className="pt-10 px-4 pb-0 bg-white/5 border-b border-white/5 flex gap-4">
                        <button
                            className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'dashboard' ? 'text-white' : 'text-white/40'}`}
                            onClick={() => setActiveTab("dashboard")}
                        >
                            Mi Portal
                            {activeTab === 'dashboard' && <div className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>}
                        </button>
                        <button
                            className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${activeTab === 'chat' ? 'text-white' : 'text-white/40'}`}
                            onClick={() => setActiveTab("chat")}
                        >
                            <Bot className="w-3.5 h-3.5" /> HR Bot
                            {messages.length > 1 && activeTab === 'dashboard' && (
                                <span className="absolute flex h-2 w-2 top-0 right-[-10px]">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                            )}
                            {activeTab === 'chat' && <div className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>}
                        </button>
                    </div>

                    {/* App Content */}
                    <div className="flex-1 overflow-y-auto bg-black custom-scrollbar relative">

                        {/* TAB 1: DASHBOARD / SCHEDULING */}
                        <div className={`absolute inset-0 p-5 space-y-6 transition-all duration-300 ${activeTab === 'dashboard' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>

                            {/* User Welcome */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Operaciones</p>
                                    <h4 className="text-xl font-bold text-white tracking-tight">Hola, Martín 👋</h4>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-white/10 flex items-center justify-center text-sm font-bold text-black">
                                    MS
                                </div>
                            </div>

                            {/* Clock In / Out Card */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                                {shiftState === "clocked_in" && <div className="absolute top-0 inset-x-0 h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
                                {shiftState === "clocked_out" && <div className="absolute top-0 inset-x-0 h-1 bg-muted-foreground"></div>}

                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-white/50" />
                                    <span className="text-xs font-medium text-white/80">Turno Actual</span>
                                </div>
                                <p className="text-lg font-bold text-primary mb-4">14:00 - 22:00 <span className="text-xs text-muted-foreground font-normal">(8 horas)</span></p>

                                <Button
                                    className={`w-full h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-lg ${shiftState === "pending"
                                        ? "bg-accent/20 text-accent hover:bg-accent/30 border border-accent/20"
                                        : shiftState === "clocked_in"
                                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                            : "bg-white/5 text-white/40 cursor-not-allowed border border-white/5"
                                        }`}
                                    onClick={handleClockIn}
                                    disabled={shiftState === "clocked_out"}
                                >
                                    {shiftState === "pending" && <><CheckCircle2 className="w-4 h-4 mr-2" /> Iniciar Jornada Local</>}
                                    {shiftState === "clocked_in" && <><AlertCircle className="w-4 h-4 mr-2" /> Finalizar Jornada</>}
                                    {shiftState === "clocked_out" && "Jornada Finalizada"}
                                </Button>

                                {shiftState === "clocked_in" && (
                                    <p className="text-[10px] text-center mt-3 text-green-400 font-mono tracking-wide">
                                        ● Fichaje guardado: {clockInTime} (GPS Validado)
                                    </p>
                                )}
                            </div>

                            {/* Schedule Overview */}
                            <div>
                                <h5 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Mi Cuadrante Semanal</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-11 bg-primary/10 rounded-lg flex flex-col items-center justify-center border border-primary/20">
                                                <span className="text-[9px] text-primary shrink-0 uppercase">Mie</span>
                                                <span className="text-sm font-black text-primary">15</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">Hoy (Sucursal Centro)</p>
                                                <p className="text-xs text-muted-foreground">14:00 - 22:00</p>
                                            </div>
                                        </div>
                                        {shiftState !== "clocked_out" && <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>}
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-11 bg-white/5 rounded-lg flex flex-col items-center justify-center">
                                                <span className="text-[9px] text-white/50 shrink-0 uppercase">Jue</span>
                                                <span className="text-sm font-black text-white/80">16</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">Sucursal Centro</p>
                                                <p className="text-xs text-muted-foreground">14:00 - 22:00</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-11 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col items-center justify-center text-red-400">
                                                <span className="text-[9px] shrink-0 uppercase">Vie</span>
                                                <span className="text-sm font-black text-red-400">17</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-red-400">Franco (Día Libre)</p>
                                                <p className="text-[10px] text-red-500/60">Sujeto a cambios</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAB 2: HR CHAT BOT */}
                        <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${activeTab === 'chat' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
                            <div className="p-4 flex-1 overflow-y-auto space-y-4 pt-6">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {messages.map((msg: any) => {
                                    const cData = customMessages[msg.id];
                                    return (
                                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm shadow-sm ${msg.role === "user"
                                                ? "bg-primary text-black rounded-tr-sm"
                                                : "bg-white/5 border border-white/10 text-white/80 rounded-tl-sm"
                                                }`}>
                                                {cData?.isAttachment ? (
                                                    <div className="flex items-center gap-2 opacity-90">
                                                        {cData.attachmentType === 'image' ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                        <span className="font-mono text-[10px] font-bold tracking-tight">{cData.filename}</span>
                                                    </div>
                                                ) : (
                                                    <p className="leading-relaxed">{msg.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-3.5 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} className="pb-2" />
                            </div>

                            {/* Chat Input Area */}
                            <form onSubmit={handleSendAction} className="p-3 bg-black border-t border-white/5 backdrop-blur-md">
                                <div className="flex gap-2 relative">
                                    <button
                                        type="button"
                                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                                        onClick={() => { setInput("[IMAGE]"); setTimeout(() => handleSendAction(), 100); }}
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="Pregunta o sube un justificativo..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-0 text-xs focus:outline-none focus:border-primary transition-colors text-white placeholder:text-white/30"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !(input || "").trim()}
                                        size="icon"
                                        className="bg-primary hover:bg-primary/80 text-black shrink-0 rounded-xl w-10 h-10 shadow-lg"
                                    >
                                        <Send className="w-4 h-4 -ml-0.5" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
