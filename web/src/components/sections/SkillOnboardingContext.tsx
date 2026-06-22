import { Users, LayoutDashboard, Calendar, Camera } from "lucide-react";
import { AppTab } from "./useSkillOnboardingBot";

interface SkillOnboardingContextProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    setInput: (input: string) => void;
    handleSendAction: (e?: React.FormEvent) => void;
}

export function SkillOnboardingContext({ activeTab, setActiveTab, setInput, handleSendAction }: SkillOnboardingContextProps) {
    return (
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
    );
}
