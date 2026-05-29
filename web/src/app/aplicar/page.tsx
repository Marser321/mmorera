'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, ArrowLeft, CheckCircle2, Building2, DollarSign, Cpu, User } from 'lucide-react';
import { submitLead } from '@/actions/submit-lead';

/**
 * Application Funnel — Formulario de Calificación B2B.
 * 
 * Diseñado para filtrar prospectos de bajo presupuesto y calificar leads
 * de alto valor antes de agendar una consulta. El formulario multi-step
 * reduce la fricción cognitiva y maximiza la tasa de finalización.
 */

interface FormData {
    name: string;
    email: string;
    company: string;
    revenue: string;
    challenge: string;
    timeline: string;
}

const STEPS = [
    { id: 'intro', title: 'About You', icon: User },
    { id: 'company', title: 'Your Business', icon: Building2 },
    { id: 'challenge', title: 'The Challenge', icon: Cpu },
    { id: 'budget', title: 'Investment', icon: DollarSign },
];

const REVENUE_OPTIONS = [
    'Pre-revenue / Early Stage',
    '$10K – $50K / month',
    '$50K – $200K / month',
    '$200K – $1M / month',
    '$1M+ / month',
];

const TIMELINE_OPTIONS = [
    'ASAP — We needed this yesterday',
    '1-3 months',
    '3-6 months',
    'Just exploring options',
];

export default function ApplicationPage() {
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        company: '',
        revenue: '',
        challenge: '',
        timeline: '',
    });

    const updateField = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const canAdvance = (): boolean => {
        switch (step) {
            case 0: return formData.name.length > 1 && formData.email.includes('@');
            case 1: return formData.company.length > 1 && formData.revenue !== '';
            case 2: return formData.challenge.length > 10;
            case 3: return formData.timeline !== '';
            default: return false;
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const leadData = {
            nombre: formData.name,
            email: formData.email,
            empresa: formData.company,
            servicios_interes: ['brief_aplicar'],
            mensaje: formData.challenge,
            revenue: formData.revenue,
            timeline: formData.timeline
        };

        // Formato del mensaje para WhatsApp
        const waMessage = `Hola Mario! 👋 Acabo de completar el brief para mi proyecto.\n\n` +
            `*Nombre:* ${formData.name}\n` +
            `*Email:* ${formData.email}\n` +
            `*Empresa:* ${formData.company}\n` +
            `*Facturación Mensual:* ${formData.revenue}\n` +
            `*Timeline de Despliegue:* ${formData.timeline}\n\n` +
            `*Desafío/Bottleneck:* ${formData.challenge}`;

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


    if (submitted) {
        return (
            <main id="contenido-principal" className="pt-24 min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-lg px-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                    </motion.div>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                        Application Received
                    </h1>
                    <p className="text-white/50 text-lg leading-relaxed mb-8">
                        Thank you, <span className="text-white font-medium">{formData.name}</span>. 
                        I&apos;ll review your submission and reach out within <span className="text-emerald-400 font-bold">48 hours</span> with 
                        a custom strategy brief.
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </a>
                </motion.div>
            </main>
        );
    }

    return (
        <main id="contenido-principal" className="pt-24 min-h-screen">
            <div className="container mx-auto px-4 max-w-2xl py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                        Application Funnel
                    </p>
                    <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Let&apos;s Build Your <span className="text-gradient">System</span>
                    </h1>
                    <p className="text-white/40 max-w-lg mx-auto">
                        This is not a contact form. It&apos;s a qualification process to ensure 
                        we&apos;re the right fit for each other.
                    </p>
                </motion.div>

                {/* Indicador de progreso */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2">
                            <motion.div
                                animate={{
                                    scale: step === i ? 1.1 : 1,
                                    backgroundColor: i <= step
                                        ? 'rgba(16, 185, 129, 0.3)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                }}
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center
                                    border transition-colors duration-300
                                    ${i <= step
                                        ? 'border-emerald-500/40 text-emerald-400'
                                        : 'border-white/10 text-white/20'
                                    }
                                `}
                            >
                                <s.icon className="w-4 h-4" />
                            </motion.div>
                            {i < STEPS.length - 1 && (
                                <div className={`w-8 h-px transition-colors duration-500 ${i < step ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Formulario multi-step */}
                <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-card rounded-2xl p-8 md:p-10 min-h-[280px] flex flex-col"
                        >
                            <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                {(() => { const Icon = STEPS[step].icon; return <Icon className="w-5 h-5 text-emerald-400" />; })()}
                                {STEPS[step].title}
                            </h2>
                            <p className="text-white/30 text-sm mb-6">Step {step + 1} of {STEPS.length}</p>

                            {/* Step 0: Info personal */}
                            {step === 0 && (
                                <div className="space-y-5 flex-1">
                                    <div>
                                        <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="John Smith"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="john@company.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 1: Empresa */}
                            {step === 1 && (
                                <div className="space-y-5 flex-1">
                                    <div>
                                        <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Company / Project Name</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => updateField('company', e.target.value)}
                                            placeholder="Acme Corp"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Monthly Revenue</label>
                                        <div className="grid gap-2">
                                            {REVENUE_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => updateField('revenue', opt)}
                                                    className={`
                                                        text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200
                                                        ${formData.revenue === opt
                                                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                                                        }
                                                    `}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Desafío técnico */}
                            {step === 2 && (
                                <div className="space-y-5 flex-1">
                                    <div>
                                        <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                                            What&apos;s your biggest operational bottleneck?
                                        </label>
                                        <textarea
                                            value={formData.challenge}
                                            onChange={(e) => updateField('challenge', e.target.value)}
                                            placeholder="We're losing leads because our follow-up process is manual and takes 72+ hours..."
                                            rows={5}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
                                        />
                                        <p className="text-white/20 text-xs mt-2">
                                            Be specific. The more detail, the better I can assess if my systems are the right fit.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Timeline */}
                            {step === 3 && (
                                <div className="space-y-5 flex-1">
                                    <div>
                                        <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                                            When do you need this deployed?
                                        </label>
                                        <div className="grid gap-2">
                                            {TIMELINE_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => updateField('timeline', opt)}
                                                    className={`
                                                        text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200
                                                        ${formData.timeline === opt
                                                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                                                        }
                                                    `}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Controles de navegación */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            type="button"
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                            className="flex items-center gap-2 text-sm text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {step < STEPS.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={!canAdvance()}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm uppercase tracking-wider hover:bg-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canAdvance() || submitting}
                                className="flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-sm uppercase tracking-wider hover:bg-emerald-500/35 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        )}

                    </div>
                </form>
            </div>
        </main>
    );
}
