'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Sparkles, Zap, Trophy } from "lucide-react";
import { Servicio } from "@/types";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Servicio | null;
}

export function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
    if (!service) return null;

    const pilarColors = {
        tech: {
            glow: "bg-blue-500/20",
            border: "border-blue-500/30",
            text: "text-blue-400",
            gradient: "from-blue-600 to-cyan-500",
            shadow: "shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        },
        media: {
            glow: "bg-violet-500/20",
            border: "border-violet-500/30",
            text: "text-violet-400",
            gradient: "from-violet-600 to-fuchsia-500",
            shadow: "shadow-[0_0_30px_rgba(139,92,246,0.2)]"
        },
        growth: {
            glow: "bg-emerald-500/20",
            border: "border-emerald-500/30",
            text: "text-emerald-400",
            gradient: "from-emerald-600 to-teal-500",
            shadow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        }
    };

    const theme = pilarColors[service.pilar] || pilarColors.tech;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn(
                "w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 bg-[#0A0A0A] border transition-colors duration-500",
                theme.border
            )}>
                {/* Glow ambiental de fondo */}
                <div className={cn("absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 opacity-20 pointer-events-none", service.pilar === 'media' ? 'bg-violet-600' : service.pilar === 'growth' ? 'bg-emerald-600' : 'bg-blue-600')} />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative z-10 p-8 md:p-10"
                >
                    <DialogHeader className="mb-8 relative">
                        <div className="flex items-center justify-between mb-6">
                            <Badge variant="outline" className={cn("capitalize px-3 py-1 text-sm tracking-wider border bg-black/50 backdrop-blur-md", theme.border, theme.text)}>
                                {service.pilar === 'tech' ? <Zap className="w-3 h-3 mr-2" /> : service.pilar === 'media' ? <Sparkles className="w-3 h-3 mr-2" /> : <Trophy className="w-3 h-3 mr-2" />}
                                {service.pilar} Ecosystem
                            </Badge>

                            {service.precio_base && (
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Inversión Estratégica</span>
                                    <span className={cn("text-xl font-black font-mono tracking-tight", theme.text)}>
                                        ${service.precio_base}
                                        <span className="text-xs text-white/40 ml-1 font-sans font-normal">/ proyecto</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <DialogTitle className="text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter mb-4">
                            {service.nombre}
                        </DialogTitle>

                        <DialogDescription className="text-lg text-white/70 font-light leading-relaxed max-w-lg">
                            {service.descripcion}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Grid de Features */}
                    <div className="space-y-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-transparent via-white/20" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Lo que incluye tu Ecosistema</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-transparent via-white/20" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {service.caracteristicas.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + (idx * 0.05) }}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                                >
                                    <div className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-black/40 border border-white/10 group-hover:scale-110 transition-transform", theme.text)}>
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="md:justify-between items-center gap-4 pt-6 border-t border-white/10">
                        <Button variant="ghost" onClick={onClose} className="text-white/40 hover:text-white hover:bg-white/5">
                            Cerrar
                        </Button>
                        <Button
                            className={cn(
                                "w-full md:w-auto px-8 py-6 text-lg font-bold bg-gradient-to-r text-white border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group",
                                theme.gradient,
                                theme.shadow
                            )}
                        >
                            <span className="relative z-10 flex items-center">
                                Iniciar Transformación
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
