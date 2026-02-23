"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Send, Activity, Target } from "lucide-react";

export function SkillColdOutbound() {
    const [nombre, setNombre] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [sector, setSector] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [email, setEmail] = useState<{
        asunto: string;
        cuerpo: string;
    } | null>(null);

    const generateEmail = () => {
        if (!nombre || !empresa || !sector) return;

        setIsGenerating(true);
        setEmail(null);

        setTimeout(() => {
            setEmail({
                asunto: `Re: Eficiencia operativa en ${empresa}`,
                cuerpo: `Hola ${nombre},\n\nEstuve revisando el perfil de ${empresa} y noté el crecimiento que están teniendo en el sector de ${sector}.\n\nUsualmente, las empresas con este volumen de clientes en ${sector} empiezan a perder hasta un 30% de oportunidades calificadas simplemente porque los equipos comerciales no dan abasto para responder a tiempo.\n\nHemos creado un sistema de asistentes de IA que atiende e interactúa (pre-califica) al 100% del tráfico en menos de 2 minutos, agendando reuniones directo en tu calendario.\n\nHe preparado una demo de 2 minutos específica para el flujo de ventas de ${empresa}. ¿Te interesaría verla el jueves o viernes?`
            });
            setIsGenerating(false);
        }, 1800);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Form */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-primary to-transparent rounded-t-2xl opacity-50"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Datos del Prospecto</h3>
                        <p className="text-xs text-muted-foreground">Extraídos vía Web Scraping (Simulado)</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Nombre del Contacto</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Laura"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Empresa</label>
                        <input
                            type="text"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            placeholder="Ej: TechCorp S.A."
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Sector / Keyword</label>
                        <input
                            type="text"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            placeholder="Ej: Software SaaS"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>

                    <Button
                        onClick={generateEmail}
                        disabled={isGenerating || !nombre || !empresa || !sector}
                        className="w-full mt-2 bg-cyan-600 text-white hover:bg-cyan-700 h-12 rounded-xl text-base font-medium transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]"
                    >
                        {isGenerating ? (
                            <>
                                <Activity className="w-5 h-5 mr-2 animate-pulse" />
                                Redactando Email Copy...
                            </>
                        ) : (
                            <>
                                Generar Email Hiper-Personalizado
                                <Send className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Column: Generated Email */}
            <div className="bg-[#f4f4f5] dark:bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[400px]">

                <div className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-black/50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">Gmail Draft / Instantly</span>
                    </div>
                </div>

                <div className="p-6 flex-1 text-sm relative">
                    {isGenerating && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-cyan-600 dark:text-cyan-400">
                            <Activity className="w-8 h-8 animate-spin mb-3" />
                            <span className="animate-pulse tracking-widest text-xs uppercase font-mono">Generando Copy B2B...</span>
                        </div>
                    )}

                    {!email && !isGenerating ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                            <Mail className="w-12 h-12 mb-4 opacity-20" />
                            <p>Introduce los datos para autogenerar el borrador.</p>
                        </div>
                    ) : null}

                    {email && !isGenerating && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-b border-black/10 dark:border-white/10 pb-3">
                                <p className="text-zinc-500 dark:text-zinc-400 mb-1">Para: prospecto@{empresa?.toLowerCase().replace(/\s/g, '') || 'empresa'}.com</p>
                                <p className="text-zinc-800 dark:text-zinc-100 font-semibold">Asunto: {email.asunto}</p>
                            </div>

                            <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {email.cuerpo}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
