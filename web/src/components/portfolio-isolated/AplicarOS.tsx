'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    Building2, 
    DollarSign, 
    Cpu, 
    User 
} from 'lucide-react';
import { submitLead } from '@/actions/submit-lead';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTrack } from '@/context/TrackContext';
import { isTrackId, type TrackId } from '@/data/tracks';

interface FormData {
    name: string;
    email: string;
    company: string;
    revenue: string;
    challenge: string;
    timeline: string;
}



export function AplicarOS() {
    const { isDevMode } = useDevMode();
    const { language } = useLanguage();

    // Track del visitante: prioriza ?track= de la URL, si no usa el TrackContext.
    const { track: ctxTrack, setTrack: setCtxTrack } = useTrack();
    const [trackId, setTrackId] = useState<TrackId | null>(null);
    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get('track');
        if (isTrackId(param)) {
            setTrackId(param);
            setCtxTrack(param);
        } else if (ctxTrack) {
            setTrackId(ctxTrack);
        }
    }, [ctxTrack, setCtxTrack]);

    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        company: '',
        revenue: '',
        challenge: '',
        timeline: '',
    });

    // Definición de Pasos e Iconos Bilingües
    const STEPS = useMemo(() => [
        { id: 'intro', title: { es: 'Sobre Vos', en: 'About You' }, icon: User },
        { id: 'company', title: { es: 'Tu Negocio', en: 'Your Business' }, icon: Building2 },
        { id: 'challenge', title: { es: 'El Desafío', en: 'The Challenge' }, icon: Cpu },
        { id: 'budget', title: { es: 'Inversión', en: 'Investment' }, icon: DollarSign },
    ], []);

    // Opciones Bilingües
    const REVENUE_OPTIONS = useMemo(() => [
        { es: 'Pre-revenue / Early Stage', en: 'Pre-revenue / Early Stage' },
        { es: '$10K – $50K / mes', en: '$10K – $50K / mo' },
        { es: '$50K – $200K / mes', en: '$50K – $200K / mo' },
        { es: '$200K – $1M / mes', en: '$200K – $1M / mo' },
        { es: '$1M+ / mes', en: '$1M+ / mo' }
    ], []);

    const TIMELINE_OPTIONS = useMemo(() => [
        { es: 'ASAP — Lo necesitábamos ayer', en: 'ASAP — Needed yesterday' },
        { es: '1 a 3 meses', en: '1 to 3 months' },
        { es: '3 a 6 meses', en: '3 to 6 months' },
        { es: 'Solo explorando opciones', en: 'Just exploring options' }
    ], []);

    const updateField = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const canAdvance = useCallback((): boolean => {
        switch (step) {
            case 0: return formData.name.length > 1 && formData.email.includes('@');
            case 1: return formData.company.length > 1 && formData.revenue !== '';
            case 2: return formData.challenge.length > 8;
            case 3: return formData.timeline !== '';
            default: return false;
        }
    }, [step, formData]);

    // Lógica de Envío Directo del Formulario
    const handleFormSubmit = async () => {
        setSubmitting(true);
        setSubmitError(null);

        const leadData = {
            nombre: formData.name,
            email: formData.email,
            empresa: formData.company,
            servicios_interes: trackId ? ['brief_aplicar', `track_${trackId}`] : ['brief_aplicar'],
            mensaje: formData.challenge,
            revenue: formData.revenue,
            timeline: formData.timeline
        };

        try {
            const result = await submitLead(leadData);
            if (!result.success) throw new Error(result.error);
            setSubmitted(true);
        } catch {
            setSubmitError(language === 'es'
                ? 'No pude enviar el brief. Probá nuevamente o escribime por email.'
                : 'I could not send the brief. Try again or contact me by email.');
        } finally {
            setSubmitting(false);
        }
    };

    // Pantalla de Éxito
    if (submitted) {
        return (
            <div className="min-h-[500px] flex items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative max-w-md overflow-hidden rounded-[1.25rem] border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-[#0D1114]/88 light:bg-card/88 px-8 py-12 text-center shadow-2xl light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_12px_32px_rgb(20_23_26/0.1)] backdrop-blur-md"
                >
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-signal" />
                    <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-signal" />
                    <h2 className="mb-3 text-3xl font-medium tracking-[-.04em] text-foreground">
                        {language === 'es' ? 'Brief Recibido' : 'Brief Received'}
                    </h2>
                    <p className="text-zinc-400 light:text-muted-foreground text-sm leading-relaxed mb-6">
                        {language === 'es'
                            ? `Gracias, ${formData.name}. Tu información fue enviada correctamente. Voy a revisar el contexto y responderte por email.`
                            : `Thank you, ${formData.name}. Your details were sent successfully. I’ll review the context and reply by email.`
                        }
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <section id="aplicar-os-section" className="relative overflow-hidden bg-transparent px-0 py-14 pb-24 md:py-20">
            <div className="container mx-auto max-w-3xl px-0 sm:px-4">
                
                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-[#0D1114]/92 light:bg-card/94 p-4 shadow-2xl light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_12px_32px_rgb(20_23_26/0.1)] backdrop-blur-md md:p-8">

                    {/* Encabezado del Formulario */}
                    <div className="mb-5 flex items-center justify-between border-b border-white/5 light:border-[rgb(var(--ink-rgb)/0.05)] pb-4 select-none md:mb-6">
                        <h3 className="text-white light:text-foreground font-bold text-base flex items-center gap-2">
                            {(() => { const Icon = STEPS[step].icon; return <Icon className="h-4 w-4 text-signal" />; })()}
                            {STEPS[step].title[language]}
                        </h3>
                        <span className="font-mono text-[9px] text-zinc-500 light:text-muted-foreground">
                            {language === 'es' ? `Paso ${step + 1} de ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}
                        </span>
                    </div>

                    {/* Formulario Inputs */}
                    <div className="flex min-h-[210px] flex-col justify-center text-left md:min-h-[220px]">
                        {step === 0 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="brief-name" className="block text-zinc-500 light:text-muted-foreground font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                        {language === 'es' ? 'Nombre Completo' : 'Full Name'}
                                    </label>
                                    <input
                                        id="brief-name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder={language === 'es' ? 'Esteban Quito' : 'John Doe'}
                                        className="w-full rounded-xl border border-white/10 light:border-border bg-white/5 light:bg-input px-4 py-3 font-sans text-sm text-white light:text-foreground transition-all placeholder:text-white/35 light:placeholder:text-foreground/45 focus:border-signal/50 focus:outline-none focus:ring-1 focus:ring-signal/30"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="brief-email" className="block text-zinc-500 light:text-muted-foreground font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                        {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                                    </label>
                                    <input
                                        id="brief-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        placeholder={language === 'es' ? 'esteban@empresa.com' : 'john@company.com'}
                                        className="w-full rounded-xl border border-white/10 light:border-border bg-white/5 light:bg-input px-4 py-3 font-sans text-sm text-white light:text-foreground transition-all placeholder:text-white/35 light:placeholder:text-foreground/45 focus:border-signal/50 focus:outline-none focus:ring-1 focus:ring-signal/30"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="brief-company" className="block text-zinc-500 light:text-muted-foreground font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                        {language === 'es' ? 'Nombre de la Empresa' : 'Company Name'}
                                    </label>
                                    <input
                                        id="brief-company"
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => updateField('company', e.target.value)}
                                        placeholder={language === 'es' ? 'Quito S.A.' : 'Doe Industries'}
                                        className="w-full rounded-xl border border-white/10 light:border-border bg-white/5 light:bg-input px-4 py-3 font-sans text-sm text-white light:text-foreground transition-all placeholder:text-white/35 light:placeholder:text-foreground/45 focus:border-signal/50 focus:outline-none focus:ring-1 focus:ring-signal/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-500 light:text-muted-foreground font-mono text-[9px] uppercase font-bold tracking-wider mb-2">
                                        {language === 'es' ? 'Facturación Mensual' : 'Monthly Revenue'}
                                    </label>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {REVENUE_OPTIONS.map((opt) => {
                                            const label = opt[language];
                                            const isSelected = formData.revenue === label;
                                            return (
                                                <button
                                                    key={label}
                                                    type="button"
                                                    onClick={() => updateField('revenue', label)}
                                                    className={`text-left px-3 py-2.5 rounded-xl border text-[10px] font-mono transition-all duration-200 cursor-pointer ${
                                                        isSelected
                                                            ? 'border-signal/40 bg-signal/10 text-signal shadow-[0_0_15px_rgba(113,243,162,0.08)] light:shadow-none'
                                                            : 'bg-white/5 light:bg-[rgb(var(--ink-rgb)/0.05)] border-white/5 light:border-[rgb(var(--ink-rgb)/0.05)] text-zinc-400 light:text-muted-foreground hover:border-white/20 light:hover:border-[rgb(var(--ink-rgb)/0.2)] hover:text-white light:hover:text-foreground'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <label htmlFor="brief-challenge" className="block text-zinc-500 light:text-muted-foreground font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                    {language === 'es' 
                                        ? '¿Cuál es tu mayor cuello de botella operativo?' 
                                        : 'What is your biggest operational bottleneck?'
                                    }
                                </label>
                                <textarea
                                    id="brief-challenge"
                                    value={formData.challenge}
                                    onChange={(e) => updateField('challenge', e.target.value)}
                                    placeholder={language === 'es'
                                        ? 'Perdemos leads por falta de velocidad de respuesta en WhatsApp...'
                                        : 'We lose leads due to slow response times on WhatsApp...'
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-white/10 light:border-border bg-white/5 light:bg-input px-4 py-3 font-sans text-sm text-white light:text-foreground transition-all placeholder:text-white/35 light:placeholder:text-foreground/45 focus:border-signal/50 focus:outline-none focus:ring-1 focus:ring-signal/30"
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <label className="block text-zinc-500 light:text-muted-foreground font-mono text-[9px] uppercase font-bold tracking-wider mb-2">
                                    {language === 'es' 
                                        ? '¿Para cuándo necesitas desplegar el sistema?' 
                                        : 'When do you need to deploy the system?'
                                    }
                                </label>
                                <div className="grid gap-2">
                                    {TIMELINE_OPTIONS.map((opt) => {
                                        const label = opt[language];
                                        const isSelected = formData.timeline === label;
                                        return (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => updateField('timeline', label)}
                                                className={`text-left px-4 py-3 rounded-xl border text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                                                    isSelected
                                                        ? 'border-signal/40 bg-signal/10 text-signal shadow-[0_0_15px_rgba(113,243,162,0.08)] light:shadow-none'
                                                        : 'bg-white/5 light:bg-[rgb(var(--ink-rgb)/0.05)] border-white/5 light:border-[rgb(var(--ink-rgb)/0.05)] text-zinc-400 light:text-muted-foreground hover:border-white/20 light:hover:border-[rgb(var(--ink-rgb)/0.2)] hover:text-white light:hover:text-foreground'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controles de Navegación del Brief */}
                    <div className="sticky bottom-3 z-20 -mx-1 mt-6 flex items-center justify-between rounded-2xl border border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)] bg-background/92 p-3 font-mono text-xs shadow-[0_14px_40px_rgba(0,0,0,0.32)] light:shadow-[0_14px_40px_rgb(20_23_26/0.14)] backdrop-blur-xl md:static md:mx-0 md:mt-8 md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent md:p-0 md:pt-4 md:shadow-none md:backdrop-blur-none">
                        <button
                            type="button"
                            onClick={() => setStep(prev => Math.max(0, prev - 1))}
                            disabled={step === 0}
                            className="flex min-h-10 items-center gap-1.5 rounded-xl border-0 bg-transparent px-2 text-zinc-500 light:text-muted-foreground transition-colors hover:text-white light:hover:text-foreground disabled:opacity-20 cursor-pointer select-none"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> PREV
                        </button>

                        {step < STEPS.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(prev => prev + 1)}
                                disabled={!canAdvance()}
                                className="flex min-h-10 cursor-pointer select-none items-center gap-1.5 rounded-xl border border-signal/30 bg-signal/15 px-4 py-2 text-signal hover:bg-signal/25 disabled:opacity-20"
                            >
                                NEXT <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleFormSubmit}
                                disabled={!canAdvance() || submitting}
                                className="flex min-h-10 cursor-pointer select-none items-center gap-1.5 rounded-xl border border-signal/40 bg-signal/20 px-5 py-2.5 font-mono text-xs text-signal shadow-[0_0_20px_rgba(113,243,162,0.12)] light:shadow-none hover:bg-signal/30 disabled:opacity-20"
                            >
                                {submitting 
                                    ? (language === 'es' ? 'ENVIANDO...' : 'SENDING...') 
                                    : (language === 'es' ? 'ENVIAR BRIEF' : 'SUBMIT BRIEF')
                                } 
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    {submitError && (
                        <p role="alert" className="mt-4 rounded-xl border border-red-400/25 light:border-destructive/30 bg-red-400/[0.06] light:bg-destructive/10 px-4 py-3 text-sm leading-5 text-red-200 light:text-destructive">
                            {submitError}
                        </p>
                    )}
                </div>
            </div>

            {/* Dev Mode Wireframe Overlay */}
            {isDevMode && (
                <div className="absolute inset-0 z-0 border-[6px] border-emerald-500/20 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/10" />
                    <span className="absolute bottom-4 left-4 font-mono text-[8px] text-emerald-500/30 uppercase tracking-widest">
                        Wireframe Active // OS Form Alignment: 12-Column Grid
                    </span>
                </div>
            )}
        </section>
    );
}
