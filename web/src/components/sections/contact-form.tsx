"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { submitLead } from '@/actions/submit-lead';
import type { ContactFormData } from '@/types';
import { Send, CheckCircle2, Sparkles, Mail, Linkedin, Github, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function ContactForm() {
    const { t, language } = useLanguage();
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [nombre, setNombre] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [mensaje, setMensaje] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const leadData: ContactFormData = {
            nombre,
            email,
            servicios_interes: ['contacto_directo'],
            mensaje: mensaje || undefined
        };

        // Formato del mensaje para WhatsApp según el idioma
        const waMessage = language === 'es'
            ? `Hola Mario! 👋 Vi tu portfolio y quiero charlar contigo sobre un proyecto.\n\n` +
              `*Nombre:* ${nombre}\n` +
              `*Email:* ${email}\n` +
              `*Mensaje:* ${mensaje || 'Sin detalles adicionales'}`
            : `Hi Mario! 👋 I saw your portfolio and want to chat with you about a project.\n\n` +
              `*Name:* ${nombre}\n` +
              `*Email:* ${email}\n` +
              `*Message:* ${mensaje || 'No additional details'}`;

        const waNumber = "59892323675";
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
        <section id="contact" className="py-24 bg-transparent relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-primary/10 pointer-events-none">
                        <Sparkles className="w-20 h-20" />
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                        {/* Columna Izquierda: Mensaje & Redes */}
                        <div className="lg:col-span-2 space-y-8 text-left">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6 leading-none uppercase">
                                    {t('contact', 'title')}
                                </h2>
                                <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light">
                                    {t('contact', 'subtitle')}
                                </p>
                            </div>

                            {/* Canales Directos */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
                                    {language === 'es' ? 'Canales Directos' : 'Direct Channels'}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="https://www.linkedin.com/in/mariomorera"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="LinkedIn"
                                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all hover:scale-105"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="https://github.com/mariomorera"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="GitHub"
                                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all hover:scale-105"
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="mailto:mario@mmorera.com"
                                        title={language === 'es' ? 'Enviar correo electrónico' : 'Send email'}
                                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all hover:scale-105"
                                    >
                                        <Mail className="w-5 h-5" />
                                    </a>
                                    <a
                                        href={`https://wa.me/59892323675?text=${encodeURIComponent(
                                            language === 'es'
                                                ? 'Hola Mario! 👋 Vi tu portfolio y quiero charlar contigo sobre un proyecto.'
                                                : 'Hi Mario! 👋 I saw your portfolio and want to chat with you about a project.'
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={language === 'es' ? 'WhatsApp Directo' : 'Direct WhatsApp'}
                                        className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40 transition-all hover:scale-105"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Formulario Simplificado */}
                        <div className="lg:col-span-3 w-full">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t('contact', 'msg_success_title')}</h3>
                                    <p className="text-white/60">{t('contact', 'msg_success_desc')}</p>
                                    <Button onClick={() => setIsSubmitted(false)} variant="link" className="mt-6 text-accent">
                                        {language === 'es' ? 'Enviar otro mensaje' : 'Send another message'}
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                                            {t('contact', 'label_name')}
                                        </label>
                                        <input
                                            id="name"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder={language === 'es' ? 'Tu nombre completo' : 'Your full name'}
                                            className="w-full bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500/50 h-12 rounded-xl px-4 outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                                            {t('contact', 'label_email')}
                                        </label>
                                        <input
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="w-full bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500/50 h-12 rounded-xl px-4 outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                                            {t('contact', 'label_message')}
                                        </label>
                                        <textarea
                                            id="message"
                                            value={mensaje}
                                            onChange={(e) => setMensaje(e.target.value)}
                                            placeholder={t('contact', 'placeholder_message')}
                                            className="w-full min-h-[140px] bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500/50 rounded-xl py-3 px-4 outline-none transition-colors resize-none"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-14 bg-white text-black hover:bg-emerald-500 hover:text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl group flex items-center justify-center disabled:opacity-50 cursor-pointer"
                                        disabled={submitting}
                                    >
                                        {submitting ? t('contact', 'btn_sending') : t('contact', 'btn_send')}
                                        <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

