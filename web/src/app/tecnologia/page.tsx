import { AILab } from "@/components/sections/AILab";
import { Workflow } from "@/components/sections/Workflow";
import Link from "next/link";
import { ArrowLeft, Beaker } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Laboratorio Técnico | Agencia Mario",
    description: "Desglose técnico de la arquitectura de agentes, flujos, LLMs y sistemas subyacentes.",
};

export default function TecnologiaPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header / Intro Area */}
            <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver a la vista ejecutiva
                </Link>

                <div className="max-w-3xl mb-8 md:mb-16">
                    <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-xs font-semibold px-4 py-2 backdrop-blur-sm flex items-center w-max gap-2 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                        <Beaker className="w-4 h-4" />
                        <span>Deep Tech & Arquitectura</span>
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-balance text-white leading-tight">
                        La sala de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500">máquinas</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
                        Bienvenido a nuestro laboratorio. Aquí exponemos los motores, las trazas de ejecución,
                        los prompts complejos y el stack que permite correr agentes 24/7 sin fallos.
                        Diseñado para CTOs, líderes técnicos y curiosos de la implementación real.
                    </p>
                </div>
            </div>

            {/* Technical Sections */}
            <Workflow />
            <AILab />
        </div>
    );
}
