"use client";

import { BookOpen, FileText, BarChart, Globe, ArrowRight, Library } from "lucide-react";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";

const resources = [
    {
        title: "Guías y Blueprints Sectoriales",
        description: "Descarga documentos técnicos detallados sobre la transformación de industrias. Aprende cómo el sector asegurador usa Inteligencia Documental para procesar hasta un 80% de los reclamos de forma autónoma.",
        icon: FileText,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "Reportes de Impacto Sostenible",
        description: "Descubre en estudios de caso cómo pymes logísticas y manufactureras aplican mantenimiento y ruteo predictivo para bajar hasta un 14% su consumo de combustible.",
        icon: BarChart,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        title: "Blog de Tendencias (2026)",
        description: "Artículos de nuestros arquitectos. Entiende por qué dejamos atrás a los chatbots estáticos para operar con IA Agéntica autónoma en flujos complejos.",
        icon: Globe,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        title: "Directorio de Profesionales",
        description: "Curaduría de las mejores prácticas. Sistemas donde arquitectos integran IA generativa con modelos BIM para toma de decisiones de sostenibilidad estratégicas tempranas.",
        icon: BookOpen,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    }
];

export function KnowledgeCenter() {
    return (
        <section
            id="recursos"
            className="py-24 sm:py-32 relative bg-transparent border-t border-white/5"
            aria-labelledby="knowledge-heading"
        >
            <Container className="relative z-10 flex flex-col items-center">
                <div className="text-center mb-16 md:mb-24 space-y-6 max-w-3xl">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] text-primary font-mono tracking-[0.3em] uppercase mx-auto">
                        <Library className="w-3.5 h-3.5 mr-2" />
                        Centro de Conocimiento
                    </div>
                    <h2
                        id="knowledge-heading"
                        className="text-4xl md:text-5xl font-heading text-white tracking-tight"
                    >
                        Aprende y <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Descubre</span>
                    </h2>
                    <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl mx-auto">
                        Nuestra misión no es solo implementar tecnología, sino educar al mercado para que tome decisiones estratégicas con total confianza.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    {resources.map((resource, index) => {
                        const Icon = resource.icon;
                        return (
                            <motion.div
                                key={resource.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-5%" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`group relative rounded-3xl p-8 transition-all hover:-translate-y-2 border bg-white/[0.02] overflow-hidden ${resource.border} backdrop-blur-md`}
                            >
                                <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${resource.bg}`} />

                                <div className="relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border bg-black/50 shadow-inner ${resource.border} ${resource.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                                        {resource.title}
                                    </h3>
                                    <p className="text-white/50 mb-6 font-light leading-relaxed text-sm">
                                        {resource.description}
                                    </p>
                                    <button className={`flex items-center text-sm font-bold uppercase tracking-widest ${resource.color} group-hover:text-white transition-colors`}>
                                        Explorar <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
