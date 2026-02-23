"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Phone, PhoneOff, Activity, Volume2 } from "lucide-react";

export function SkillVoiceAgent() {
    const [isCalling, setIsCalling] = useState(false);
    const [transcript, setTranscript] = useState<{ role: "agent" | "user", text: string }[]>([]);
    const [callStep, setCallStep] = useState(0);

    const startCall = () => {
        setIsCalling(true);
        setTranscript([]);
        setCallStep(0);
    };

    const stopCall = () => {
        setIsCalling(false);
        setCallStep(0);
    };

    useEffect(() => {
        if (!isCalling) return;

        const delays = [
            { role: "agent" as const, text: "Hola, te comunicás con el asistente virtual de la clínica. ¿En qué te puedo ayudar?", time: 1000 },
            { role: "user" as const, text: "Hola. Quería saber si tienen turnos para mañana a la tarde.", time: 3500 },
            { role: "agent" as const, text: "Déjame revisar el calendario... Sí, claro. Tenemos disponibilidad mañana a las dieciséis horas o a las diecisiete treinta. ¿Cuál prefieres?", time: 6500 },
            { role: "user" as const, text: "A las dieciséis perfecto.", time: 10000 },
            { role: "agent" as const, text: "Excelente. Te he agendado para mañana a las dieciséis horas. Te enviaremos un WhatsApp de confirmación. ¡Hasta luego!", time: 12500 },
            { role: "system" as const, text: "--- FIN DE LA LLAMADA ---", time: 15000 }
        ];

        const timeouts: NodeJS.Timeout[] = [];

        delays.forEach((entry, index) => {
            if (index >= callStep) {
                const timeout = setTimeout(() => {
                    if (entry.role === "system") {
                        setIsCalling(false);
                    } else {
                        setTranscript(prev => [...prev, { role: entry.role, text: entry.text }]);
                    }
                    setCallStep(index + 1);
                }, entry.time - (callStep > 0 ? delays[callStep - 1].time : 0));
                timeouts.push(timeout);
            }
        });

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [isCalling, callStep]);

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-500 min-h-[400px]">
            {/* Left Column: Phone Visualization */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative h-full flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-primary to-transparent rounded-t-2xl opacity-50"></div>

                <div className="text-center mb-10">
                    <h3 className="text-xl font-bold mb-2">Asistente Telefónico 24/7</h3>
                    <p className="text-sm text-muted-foreground">Demostración: Reserva de Turnos</p>
                </div>

                {/* Orb / Pulsing Avatar */}
                <div className="relative mb-12">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isCalling ? 'bg-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.4)] scale-110' : 'bg-white/5 border border-white/10'
                        }`}>
                        <Volume2 className={`w-12 h-12 ${isCalling ? 'text-white animate-pulse' : 'text-muted-foreground opacity-50'}`} />
                    </div>

                    {isCalling && (
                        <>
                            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-2 border-orange-500/50 animate-ping opacity-75"></div>
                            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border border-orange-500/30 animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
                        </>
                    )}
                </div>

                <div className="flex gap-4">
                    {!isCalling ? (
                        <Button
                            onClick={startCall}
                            size="lg"
                            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all"
                        >
                            <Phone className="w-5 h-5 mr-3 fill-current" />
                            Simular Llamada
                        </Button>
                    ) : (
                        <Button
                            onClick={stopCall}
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 animate-in fade-in transition-all"
                        >
                            <PhoneOff className="w-5 h-5 mr-3" />
                            Colgar
                        </Button>
                    )}
                </div>
            </div>

            {/* Right Column: Transcript */}
            <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">

                <div className="border-b border-white/5 bg-white/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <Mic className="w-4 h-4 text-orange-400" />
                        </div>
                        <span className="font-mono text-sm tracking-tight text-orange-100">Live_Transcript_Log</span>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    {!isCalling && transcript.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Activity className="w-12 h-12 mb-4 opacity-20" />
                            <p>Inicia la simulación para ver la transcripción.</p>
                        </div>
                    ) : null}

                    {transcript.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[85%] rounded-xl p-3 text-sm flex flex-col ${msg.role === "user"
                                    ? "bg-white/10 border border-white/20 text-white"
                                    : "bg-orange-500/10 border border-orange-500/20 text-orange-50"
                                }`}>
                                <span className={`text-[10px] uppercase tracking-wider mb-1 font-mono ${msg.role === "user" ? "text-white/50" : "text-orange-400/80"}`}>
                                    {msg.role === "agent" ? "Asistente AI" : "Cliente"}
                                </span>
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}

                    {isCalling && (
                        <div className="flex items-center gap-2 text-orange-400/50 mt-4 animate-pulse px-2 font-mono text-xs">
                            <Activity className="w-4 h-4" />
                            <span>Escuchando...</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
