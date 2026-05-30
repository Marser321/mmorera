'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    Building2, 
    DollarSign, 
    Cpu, 
    User, 
    Film, 
    Play, 
    Settings,
    Activity,
    Check
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

// Coloreador de sintaxis para el Inspector JSON en tiempo real
function StateHighlighter({ code }: { code: string }) {
    const lines = code.split('\n');
    return (
        <pre className="font-mono text-[9px] leading-relaxed text-zinc-400 select-text overflow-x-auto">
            <code>
                {lines.map((line, idx) => {
                    let renderedLine: React.ReactNode = line;
                    const trimmed = line.trim();
                    
                    if (trimmed.startsWith('//')) {
                        renderedLine = <span className="text-zinc-600 italic">{line}</span>;
                    } else {
                        // Coloreado por regex
                        const parts = line.split(/("[^"]*"|:\s*true|:\s*false|:\s*\d+|\b(?:const|let|var)\b)/g);
                        renderedLine = parts.map((part, pIdx) => {
                            if (part.match(/^"[^"]*"$/)) {
                                return <span key={pIdx} className="text-amber-300">{part}</span>;
                            }
                            if (part.match(/\b(const|let|var)\b/)) {
                                return <span key={pIdx} className="text-purple-400 font-semibold">{part}</span>;
                            }
                            if (part.includes('true') || part.includes('false')) {
                                return <span key={pIdx} className="text-emerald-400 font-medium">{part}</span>;
                            }
                            if (part.match(/:\s*\d+/)) {
                                const num = part.split(':')[1].trim();
                                return (
                                    <span key={pIdx}>
                                        <span className="text-zinc-400">: </span>
                                        <span className="text-orange-400">{num}</span>
                                    </span>
                                );
                            }
                            return <span key={pIdx}>{part}</span>;
                        });
                    }

                    return (
                        <div key={idx} className="table-row">
                            <span className="table-cell text-zinc-800 pr-3 text-right select-none w-5 border-r border-white/5">{idx + 1}</span>
                            <span className="table-cell whitespace-pre pl-3 text-zinc-300">{renderedLine}</span>
                        </div>
                    );
                })}
            </code>
        </pre>
    );
}

// Renderizado gráfico de la señal de FPS en la pantalla de DaVinci Deliver Queue
function RenderGraph({ active }: { active: boolean }) {
    const pointsCount = 20;
    const [points, setPoints] = useState<number[]>(Array(pointsCount).fill(30));

    useEffect(() => {
        if (!active) return;

        const interval = setInterval(() => {
            setPoints(prev => {
                const nextVal = Math.round(20 + Math.random() * 25);
                const updated = [...prev.slice(1), nextVal];
                return updated;
            });
        }, 150);

        return () => clearInterval(interval);
    }, [active]);

    // Mapear puntos a un path de SVG
    const pathD = useMemo(() => {
        return points.map((p, idx) => {
            const x = (idx / (pointsCount - 1)) * 140;
            const y = 50 - (p / 50) * 40; // Rango 0-50 invertido para SVG coord
            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    }, [points]);

    return (
        <div className="w-36 h-12 relative border border-white/5 bg-black/40 rounded p-1">
            <span className="absolute top-1 left-1.5 font-mono text-[6px] text-zinc-500">SPEED (FPS)</span>
            <svg className="w-full h-full stroke-violet-400 fill-none" viewBox="0 0 140 50">
                <path d={pathD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
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
    const [renderProgress, setRenderProgress] = useState(0);
    const [renderStatus, setRenderStatus] = useState('');
    const [fpsSimulated, setFpsSimulated] = useState(32);
    
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

    // Simular los FPS fluctuando en el render
    useEffect(() => {
        if (!submitting) return;
        const interval = setInterval(() => {
            setFpsSimulated(Math.round(22 + Math.random() * 24));
        }, 300);
        return () => clearInterval(interval);
    }, [submitting]);

    // Lógica del Renderizado de DaVinci Deliver
    const handleFormSubmit = async () => {
        setSubmitting(true);
        setRenderProgress(0);
        
        const phases = [
            { 
                prog: 15, 
                msg: { 
                    es: 'ESTABLISHING SECURE WEBHOOK TUNNEL... [200 OK]', 
                    en: 'ESTABLISHING SECURE WEBHOOK TUNNEL... [200 OK]' 
                } 
            },
            { 
                prog: 42, 
                msg: { 
                    es: 'COMPILING STRATEGY BRIEF PAYLOAD... [DONE]', 
                    en: 'COMPILING STRATEGY BRIEF PAYLOAD... [DONE]' 
                } 
            },
            { 
                prog: 68, 
                msg: { 
                    es: 'INJECTING STATE VARIABLES INTO PIPELINE... [DONE]', 
                    en: 'INJECTING STATE VARIABLES INTO PIPELINE... [DONE]' 
                } 
            },
            { 
                prog: 88, 
                msg: { 
                    es: 'QUEUEING WHATSAPP DISPATCH GATEWAY... [PENDING]', 
                    en: 'QUEUEING WHATSAPP DISPATCH GATEWAY... [PENDING]' 
                } 
            },
            { 
                prog: 100, 
                msg: { 
                    es: 'RENDER COMPLETED SUCCESSFULLY. EXPORTfinished.', 
                    en: 'RENDER COMPLETED SUCCESSFULLY. EXPORTfinished.' 
                } 
            }
        ];

        for (const phase of phases) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setRenderProgress(phase.prog);
            setRenderStatus(phase.msg[language]);
        }

        const leadData = {
            nombre: formData.name,
            email: formData.email,
            empresa: formData.company,
            servicios_interes: trackId ? ['brief_aplicar', `track_${trackId}`] : ['brief_aplicar'],
            mensaje: formData.challenge,
            revenue: formData.revenue,
            timeline: formData.timeline
        };

        const trackLabel = trackId === 'design' ? 'Diseño / Creativo' : trackId === 'software' ? 'Software / Sistemas' : '—';

        const waMessage = language === 'es'
            ? `¡Hola Mario! 👋 Acabo de completar el brief para mi proyecto.\n\n` +
              `*Interés:* ${trackLabel}\n` +
              `*Nombre:* ${formData.name}\n` +
              `*Email:* ${formData.email}\n` +
              `*Empresa:* ${formData.company}\n` +
              `*Facturación Mensual:* ${formData.revenue}\n` +
              `*Timeline de Despliegue:* ${formData.timeline}\n\n` +
              `*Desafío/Bottleneck:* ${formData.challenge}`
            : `Hello Mario! 👋 I just completed the brief for my project.\n\n` +
              `*Interest:* ${trackLabel}\n` +
              `*Name:* ${formData.name}\n` +
              `*Email:* ${formData.email}\n` +
              `*Company:* ${formData.company}\n` +
              `*Monthly Revenue:* ${formData.revenue}\n` +
              `*Timeline:* ${formData.timeline}\n\n` +
              `*Challenge/Bottleneck:* ${formData.challenge}`;

        const waUrl = `https://wa.me/59892323675?text=${encodeURIComponent(waMessage)}`;

        try {
            window.open(waUrl, '_blank');
            await submitLead(leadData);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Objeto JS compilado formateado para el Inspector reactivo
    const inspectCode = useMemo(() => {
        return `// Memory stack: state.applicationForm

const leadState: LeadSchema = {
  name: "${formData.name || 'undefined'}",
  email: "${formData.email || 'undefined'}",
  company: "${formData.company || 'undefined'}",
  revenue: "${formData.revenue || 'null'}",
  challenge: "${formData.challenge ? formData.challenge.replace(/"/g, '\\"') : '""'}",
  timeline: "${formData.timeline || 'null'}",
  isValid: ${canAdvance() ? 'true' : 'false'},
  currentStep: ${step}
};`;
    }, [formData, step, canAdvance]);

    // Pantalla de Éxito
    if (submitted) {
        return (
            <div className="min-h-[500px] flex items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md px-8 py-12 bg-neutral-950 border border-white/10 rounded-3xl backdrop-blur-md shadow-3xl text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-emerald-500" />
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                        {language === 'es' ? 'Diagnóstico Completado' : 'Diagnosis Received'}
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        {language === 'es'
                            ? `Gracias, ${formData.name}. Acabamos de disparar los activadores de tu automatización. Te contactaré en menos de 48 horas.`
                            : `Thank you, ${formData.name}. We have triggered the automation workflows. I will reach out in less than 48 hours.`
                        }
                    </p>
                    <div className="inline-flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 border border-white/5 bg-neutral-900 px-3 py-1.5 rounded-lg select-none">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>PIPELINE DISPATCHED: STATUS 200 OK</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <section id="aplicar-os-section" className="py-24 relative bg-transparent overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ──── COLUMNA IZQUIERDA: FORMULARIO MULTI-STEP ──── */}
                    <div className="lg:col-span-7">
                        <div className="bg-neutral-950/70 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
                            
                            {/* SIMULADOR DE COLA DE RENDERIZADO DaVinci Resolve (DELIVER JOB QUEUE) */}
                            <AnimatePresence>
                                {submitting && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-neutral-950/98 z-50 flex flex-col justify-between p-8 rounded-3xl font-mono text-xs select-none"
                                    >
                                        {/* Cabecera del Panel Deliver */}
                                        <div className="flex items-center justify-between pb-3 border-b border-white/5 w-full">
                                            <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                                                <Film className="w-4 h-4 text-violet-400" />
                                                <span>RESOLVE DELIVER QUEUE // RENDERING JOB 1</span>
                                            </div>
                                            <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 border border-red-500/30 rounded uppercase animate-pulse">
                                                EXPORTING
                                            </span>
                                        </div>

                                        {/* Contenido Central: Estadísticas de Render */}
                                        <div className="grid grid-cols-2 gap-6 w-full py-4 text-left">
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-zinc-500 text-[8px] block">JOB FILE NAME</span>
                                                    <span className="text-white text-[10px] font-bold">Strategy_Brief_Mario.mov</span>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-500 text-[8px] block">TARGET FORMAT</span>
                                                    <span className="text-zinc-300 text-[9px]">QuickTime ProRes 422 HQ</span>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-500 text-[8px] block">RENDER RESOLUTION</span>
                                                    <span className="text-zinc-300 text-[9px]">3840x2160 UHD (Color: ACES)</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 flex flex-col items-end text-right">
                                                <div>
                                                    <span className="text-zinc-500 text-[8px] block">RENDER SPEED</span>
                                                    <span className="text-emerald-400 text-[10px] font-bold">{fpsSimulated} FPS</span>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-500 text-[8px] block">TIME REMAINING</span>
                                                    <span className="text-zinc-300 text-[9px]">
                                                        {renderProgress === 100 ? '00:00:00' : `00:00:0${Math.ceil((100 - renderProgress) / 15)}`}
                                                    </span>
                                                </div>
                                                <div className="pt-1">
                                                    <RenderGraph active={submitting} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Barra de progreso */}
                                        <div className="w-full space-y-2">
                                            <div className="flex justify-between items-center text-[9px] text-zinc-500">
                                                <span>ENCODING STATUS:</span>
                                                <span className="text-violet-400 font-bold">{renderProgress}%</span>
                                            </div>
                                            
                                            <div className="w-full h-2.5 bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${renderProgress}%` }}
                                                    transition={{ ease: "easeInOut" }}
                                                />
                                            </div>

                                            <div className="text-[8px] text-zinc-600 truncate pt-2">
                                                {renderStatus}
                                            </div>
                                        </div>

                                        {/* Pie del Panel */}
                                        <div className="text-zinc-500 text-[8px] border-t border-white/5 pt-3 w-full text-center">
                                            Job Size: ~142.4 MB | Audio Track: 2ch 24-bit 48kHz | Target Gateway: cal.com
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Encabezado del Formulario */}
                            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6 select-none">
                                <h3 className="text-white font-bold text-base flex items-center gap-2">
                                    {(() => { 
                                        const Icon = STEPS[step].icon; 
                                        return <Icon className="w-4 h-4 text-emerald-400" />; 
                                    })()}
                                    {STEPS[step].title[language]}
                                </h3>
                                <span className="font-mono text-[9px] text-zinc-500">
                                    {language === 'es' ? `Paso ${step + 1} de ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}
                                </span>
                            </div>

                            {/* Formulario Inputs */}
                            <div className="min-h-[220px] flex flex-col justify-center text-left">
                                {step === 0 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                                {language === 'es' ? 'Nombre Completo' : 'Full Name'}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => updateField('name', e.target.value)}
                                                placeholder={language === 'es' ? 'Esteban Quito' : 'John Doe'}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                                {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateField('email', e.target.value)}
                                                placeholder={language === 'es' ? 'esteban@empresa.com' : 'john@company.com'}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                                {language === 'es' ? 'Nombre de la Empresa' : 'Company Name'}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => updateField('company', e.target.value)}
                                                placeholder={language === 'es' ? 'Quito S.A.' : 'Doe Industries'}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider mb-2">
                                                {language === 'es' ? 'Facturación Mensual' : 'Monthly Revenue'}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
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
                                                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
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
                                        <label className="block text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5">
                                            {language === 'es' 
                                                ? '¿Cuál es tu mayor cuello de botella operativo?' 
                                                : 'What is your biggest operational bottleneck?'
                                            }
                                        </label>
                                        <textarea
                                            value={formData.challenge}
                                            onChange={(e) => updateField('challenge', e.target.value)}
                                            placeholder={language === 'es'
                                                ? 'Perdemos leads por falta de velocidad de respuesta en WhatsApp...'
                                                : 'We lose leads due to slow response times on WhatsApp...'
                                            }
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none font-sans"
                                        />
                                    </div>
                                )}

                                {step === 3 && (
                                    <div>
                                        <label className="block text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider mb-2">
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
                                                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                                : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
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
                            <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5 font-mono text-xs">
                                <button
                                    type="button"
                                    onClick={() => setStep(prev => Math.max(0, prev - 1))}
                                    disabled={step === 0}
                                    className="flex items-center gap-1.5 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors cursor-pointer select-none border-0 bg-transparent p-0"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> PREV
                                </button>

                                {step < STEPS.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(prev => prev + 1)}
                                        disabled={!canAdvance()}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-20 cursor-pointer select-none"
                                    >
                                        NEXT <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleFormSubmit}
                                        disabled={!canAdvance() || submitting}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/40 disabled:opacity-20 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.15)] select-none"
                                    >
                                        RENDER BRIEF <Play className="w-3.5 h-3.5 fill-emerald-300/20" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ──── COLUMNA DERECHA: INSPECTOR DE ESTADO REACTIVO (JS) ──── */}
                    <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col h-full min-h-[300px]">
                        
                        {/* Header del Inspector */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 select-none">
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Reactive State Inspector</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-[8px] text-zinc-600">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                <span>STATE_LIVESTREAM</span>
                            </div>
                        </div>

                        {/* Código Coloreado */}
                        <div className="flex-1 overflow-auto max-h-[300px] text-left">
                            <StateHighlighter code={inspectCode} />
                        </div>
                    </div>

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
