"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
 * FAQ SECTION
 * Preguntas frecuentes con accordion animado.
 * CTAs contextuales dentro de respuestas clave.
 * ═══════════════════════════════════════════════════ */

interface FAQ {
    question: string;
    answer: string;
    hasCTA?: boolean;
}

const faqs: FAQ[] = [
    {
        question: "¿Cuánto tiempo tarda la implementación?",
        answer: "Depende del alcance, pero la mayoría de los proyectos se despliegan en 2 a 4 semanas. Arrancamos con un Sprint de Diagnóstico de 1 semana para mapear tus procesos, y luego implementamos por fases con entregables claros cada semana.",
    },
    {
        question: "¿Necesito conocimientos técnicos para usar las automatizaciones?",
        answer: "No. Nuestra filosofía es 'Enseñar a Pescar': diseñamos los sistemas para que tu equipo pueda operarlos de forma autónoma. Incluimos capacitación, documentación y soporte durante los primeros 90 días.",
    },
    {
        question: "¿Qué pasa si no funciona o no veo resultados?",
        answer: "Todos nuestros proyectos arrancan con un diagnóstico gratuito donde estimamos el ROI esperado. Si después de 60 días no ves mejoras medibles, ajustamos la estrategia sin costo extra. Estamos tan seguros del impacto que asumimos el riesgo.",
        hasCTA: true,
    },
    {
        question: "¿Con qué herramientas trabajan?",
        answer: "Usamos un stack moderno y probado: n8n para automatizaciones, Supabase para bases de datos, OpenAI y Google AI para agentes inteligentes, Next.js para web, y WhatsApp API para comunicación directa. Todo integrado y escalable.",
    },
    {
        question: "¿Puedo empezar con algo pequeño antes de comprometerme?",
        answer: "¡Absolutamente! Tenemos servicios 'Caballo de Troya' diseñados para eso: una Auditoría IA gratuita, un Bot de WhatsApp demo, o una Mini-Landing IA. Sin compromiso, sin letra chica. Si te convence el resultado, escalamos juntos.",
        hasCTA: true,
    },
    {
        question: "¿Trabajan con empresas de cualquier tamaño?",
        answer: "Trabajamos con PYMEs, startups y empresas medianas que facturan entre $100K y $10M anuales. Nuestros planes se adaptan: desde Piloto Automático ($499/mes) hasta Autonomía Total con infraestructura completa.",
    },
];

function AccordionItem({ faq, index }: { faq: FAQ; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border border-white/5 rounded-2xl overflow-hidden transition-colors duration-300",
                isOpen ? "bg-white/[0.03] border-white/10" : "bg-transparent hover:bg-white/[0.02]"
            )}
        >
            <button
                onClick={toggle}
                className="w-full flex items-center justify-between p-6 text-left group"
                aria-expanded={isOpen}
            >
                <span className="text-base font-semibold text-white/80 group-hover:text-white transition-colors pr-4">
                    {faq.question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-white/30" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="px-6 pb-6">
                            <p className="text-sm text-white/50 leading-relaxed font-light">
                                {faq.answer}
                            </p>

                            {faq.hasCTA && (
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                                >
                                    Quiero saber más
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQSection() {
    return (
        <section className="py-20 sm:py-28 relative bg-transparent overflow-hidden" id="faq">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] text-white/60 font-mono tracking-[0.3em] uppercase">
                        <MessageCircle className="w-3 h-3 mr-2" />
                        Preguntas Frecuentes
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading text-white tracking-tight">
                        Todo lo que necesitás <span className="text-primary italic font-light">saber</span>.
                    </h2>
                    <p className="text-lg text-white/40 font-light leading-relaxed">
                        Si tu pregunta no está acá, escribinos y te respondemos en menos de 24hs.
                    </p>
                </div>

                {/* Accordion */}
                <div className="max-w-3xl mx-auto space-y-3">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} faq={faq} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
