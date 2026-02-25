"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { submitLead } from '@/actions/submit-lead';
import type { Lead } from '@/types';
import { Send, CheckCircle, Sparkles } from 'lucide-react';

export function ContactForm() {
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [nombre, setNombre] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [telefono] = React.useState('');
    const [empresa] = React.useState('');
    const [interes, setInteres] = React.useState('web');
    const [mensaje, setMensaje] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const leadData: Lead = {
            nombre,
            email,
            telefono: telefono || undefined,
            empresa: empresa || undefined,
            servicios_interes: [interes],
            mensaje: mensaje || undefined
        };

        // Formato del mensaje para WhatsApp
        const waMessage = `Hola! 👋 Quiero escalar mi negocio.\n\n` +
            `*Nombre:* ${nombre}\n` +
            `*Email:* ${email}\n` +
            `*Prioridad:* ${interes}\n` +
            `*Detalles:* ${mensaje || 'Sin detalles adicionales'}`;

        const waNumber = "5491136515838";
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

        try {
            window.open(waUrl, '_blank');
            await submitLead(leadData);
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-primary/10">
                        <Sparkles className="w-24 h-24" />
                    </div>

                    <div className="grid lg:grid-cols-5 gap-16 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-heading tracking-tight text-white mb-10 leading-[1.1] md:leading-[0.9]">
                                    Diseñemos el <br /><span className="text-primary text-glow">Próximo Nivel.</span>
                                </h2>
                                <p className="text-xl text-white/50 leading-relaxed font-light">
                                    Buscamos proyectos con visión de futuro y empresas listas para expandir su impacto.
                                    <br /><br />
                                    <span className="text-white/80 font-medium italic">&ldquo;La mediocridad es cara; la excelencia es una inversión en tu futuro.&rdquo;</span>
                                </p>
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-5 text-white/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Acceso Directo a Ingeniería</span>
                                </div>
                                <div className="flex items-center gap-5 text-white/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Auditoría de Dominio Digital</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Recibido!</h3>
                                    <p className="text-white/60">Nuestro equipo analizará tu caso y te contactará pronto.</p>
                                    <Button onClick={() => setIsSubmitted(false)} variant="link" className="mt-6 text-accent">
                                        Enviar otro mensaje
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-white/40 block">Nombre</label>
                                            <input id="name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Mario"
                                                className="w-full bg-white/5 border border-white/10 text-white focus:border-primary/50 h-12 rounded-xl px-4 outline-none transition-colors" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-white/40 block">Email Corporativo</label>
                                            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="mario@empresa.com"
                                                className="w-full bg-white/5 border border-white/10 text-white focus:border-primary/50 h-12 rounded-xl px-4 outline-none transition-colors" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="type" className="text-xs font-mono uppercase tracking-widest text-white/40 block">Tu Prioridad</label>
                                        <select id="type" value={interes} onChange={(e) => setInteres(e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none transition-colors">
                                            <option value="web">Automatización de Ventas</option>
                                            <option value="media">Desarrollo Web High-Ticket</option>
                                            <option value="auto">IA & Chatbots</option>
                                            <option value="full">Solución Full Infrastructure</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-white/40 block">¿Cómo podemos ayudarte?</label>
                                        <textarea id="message" value={mensaje} onChange={(e) => setMensaje(e.target.value)}
                                            placeholder="Breve descripción de tu negocio y objetivos..."
                                            className="w-full min-h-[120px] bg-white/5 border border-white/10 text-white focus:border-primary/50 rounded-xl py-4 px-4 outline-none transition-colors resize-none" />
                                    </div>

                                    <button type="submit"
                                        className="w-full h-16 bg-white text-black hover:bg-primary hover:text-white font-bold text-xl rounded-2xl transition-all duration-500 shadow-2xl group flex items-center justify-center disabled:opacity-50 glass-card"
                                        disabled={submitting}>
                                        {submitting ? 'Enviando...' : 'Empezar Ahora'}
                                        <Send className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                    <p className="text-[10px] text-center text-white/10 uppercase tracking-[0.3em] mt-4">
                                        *Cupos limitados para garantizar la excelencia en cada despliegue.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
