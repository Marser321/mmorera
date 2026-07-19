'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, Sparkles, User } from 'lucide-react';
import { submitLead } from '@/actions/submit-lead';
import type { ContactFormData } from '@/types';
import type { LeadField } from '@/lib/leadValidation';
import { useDevMode } from './DevModeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTrack } from '@/context/TrackContext';
import { isTrackId, type TrackId } from '@/data/tracks';

type BriefData = {
    name: string;
    email: string;
    company: string;
    projectStage: string;
    teamContext: string;
    challenge: string;
    timeline: string;
    website: string;
};

const initialData: BriefData = {
    name: '', email: '', company: '', projectStage: '', teamContext: '', challenge: '', timeline: '', website: '',
};

const fieldIds: Record<LeadField, string> = {
    nombre: 'brief-name',
    email: 'brief-email',
    empresa: 'brief-company',
    projectStage: 'brief-project-stage-idea',
    teamContext: 'brief-team-context-solo',
    mensaje: 'brief-project',
    timeline: 'brief-timeline-now',
};

export function AplicarOS() {
    const { isDevMode } = useDevMode();
    const { language } = useLanguage();
    const reducedMotion = useReducedMotion();
    const { track: contextTrack, setTrack: setContextTrack } = useTrack();
    const [trackId, setTrackId] = useState<TrackId | null>(null);
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<LeadField, string>>>({});
    const [formData, setFormData] = useState<BriefData>(initialData);
    const isEs = language === 'es';

    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get('track');
        if (isTrackId(param)) {
            setTrackId(param);
            setContextTrack(param);
        } else if (contextTrack) {
            setTrackId(contextTrack);
        }
    }, [contextTrack, setContextTrack]);

    useEffect(() => {
        if (!touched || submitted) return;
        const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener('beforeunload', warnBeforeUnload);
        return () => window.removeEventListener('beforeunload', warnBeforeUnload);
    }, [submitted, touched]);

    const steps = useMemo(() => [
        { title: isEs ? 'Vos' : 'You', icon: User },
        { title: isEs ? 'Contexto' : 'Context', icon: Layers3 },
        { title: isEs ? 'Proyecto' : 'Project', icon: Sparkles },
    ], [isEs]);

    const projectStages = useMemo(() => [
        { value: 'idea', es: 'Es una idea que todavía no existe.', en: 'It is an idea that does not exist yet.' },
        { value: 'new-version', es: 'Ya existe y necesita una nueva versión.', en: 'It exists and needs a new version.' },
        { value: 'grow', es: 'Funciona y necesita crecer.', en: 'It works and needs to grow.' },
        { value: 'connect', es: 'Varias piezas necesitan conectarse.', en: 'Several pieces need to connect.' },
    ], []);
    const teamContexts = useMemo(() => [
        { value: 'solo', es: 'Lo lidero personalmente.', en: 'I lead it personally.' },
        { value: 'small-team', es: 'Hay un equipo pequeño involucrado.', en: 'A small team is involved.' },
        { value: 'multiple-areas', es: 'Participan varias áreas.', en: 'Several areas are involved.' },
        { value: 'external-direction', es: 'Busco dirección externa de punta a punta.', en: 'I am looking for end-to-end external direction.' },
    ], []);
    const timelines = useMemo(() => [
        { value: 'now', es: 'Quiero empezar ahora.', en: 'I want to start now.' },
        { value: '1-3-months', es: 'En 1–3 meses.', en: 'In 1–3 months.' },
        { value: 'this-semester', es: 'Este semestre.', en: 'This semester.' },
        { value: 'exploring', es: 'Estoy explorando.', en: 'I am exploring.' },
    ], []);

    const updateField = (field: keyof BriefData, value: string, errorField?: LeadField) => {
        setTouched(true);
        setFormData((current) => ({ ...current, [field]: value }));
        if (errorField) setFieldErrors((current) => ({ ...current, [errorField]: undefined }));
        setSubmitError(null);
    };

    const validateStep = useCallback((targetStep: number) => {
        const errors: Partial<Record<LeadField, string>> = {};
        if (targetStep === 0) {
            if (formData.name.trim().length < 2) errors.nombre = isEs ? 'Ingresá tu nombre.' : 'Enter your name.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = isEs ? 'Ingresá un email válido.' : 'Enter a valid email.';
        }
        if (targetStep === 1) {
            if (!formData.projectStage) errors.projectStage = isEs ? 'Elegí el momento del proyecto.' : 'Choose the project stage.';
            if (!formData.teamContext) errors.teamContext = isEs ? 'Elegí el contexto del equipo.' : 'Choose the team context.';
        }
        if (targetStep === 2) {
            if (formData.challenge.trim().length < 20) errors.mensaje = isEs ? 'Contame un poco más: usá al menos 20 caracteres.' : 'Tell me a little more: use at least 20 characters.';
            if (!formData.timeline) errors.timeline = isEs ? 'Elegí un momento estimado de inicio.' : 'Choose an estimated start time.';
        }
        return errors;
    }, [formData, isEs]);

    const focusFirstError = (errors: Partial<Record<LeadField, string>>) => {
        const order: LeadField[] = ['nombre', 'email', 'empresa', 'projectStage', 'teamContext', 'mensaje', 'timeline'];
        const first = order.find((field) => errors[field]);
        if (!first) return;
        const errorStep = ['nombre', 'email'].includes(first) ? 0 : ['empresa', 'projectStage', 'teamContext'].includes(first) ? 1 : 2;
        setStep(errorStep);
        window.requestAnimationFrame(() => document.getElementById(fieldIds[first])?.focus());
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentErrors = validateStep(step);
        if (Object.keys(currentErrors).length > 0) {
            setFieldErrors((existing) => ({ ...existing, ...currentErrors }));
            focusFirstError(currentErrors);
            return;
        }
        if (step < steps.length - 1) {
            setStep((current) => current + 1);
            setSubmitError(null);
            return;
        }

        const allErrors = { ...validateStep(0), ...validateStep(1), ...validateStep(2) };
        if (Object.keys(allErrors).length > 0) {
            setFieldErrors(allErrors);
            focusFirstError(allErrors);
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        const leadData: ContactFormData = {
            nombre: formData.name,
            email: formData.email,
            empresa: formData.company,
            servicios_interes: trackId ? ['brief_aplicar', `track_${trackId}`] : ['brief_aplicar'],
            mensaje: formData.challenge,
            projectStage: formData.projectStage,
            teamContext: formData.teamContext,
            timeline: formData.timeline,
            website: formData.website,
        };

        try {
            const result = await submitLead(leadData);
            if (!result.success) {
                if (result.fieldErrors) {
                    setFieldErrors(result.fieldErrors);
                    focusFirstError(result.fieldErrors);
                }
                setSubmitError(isEs ? result.error : 'I could not send the context. Check the marked fields or try again.');
                return;
            }
            setSubmitted(true);
            setTouched(false);
        } catch {
            setSubmitError(isEs ? 'No pude enviar el contexto. Probá nuevamente o escribime por email.' : 'I could not send the context. Try again or contact me by email.');
        } finally {
            setSubmitting(false);
        }
    };

    const errorText = (field: LeadField) => fieldErrors[field] ? (
        <p id={`${fieldIds[field]}-error`} className="mt-2 text-sm leading-5 text-red-200 light:text-destructive">{fieldErrors[field]}</p>
    ) : null;

    if (submitted) {
        return (
            <div className="flex min-h-[500px] items-center justify-center text-center" aria-live="polite">
                <motion.div initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-md overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0D1114]/88 px-8 py-12 text-center shadow-2xl backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/88 light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_12px_32px_rgb(20_23_26/0.1)]">
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-signal" />
                    <CheckCircle2 aria-hidden="true" className="mx-auto mb-6 h-16 w-16 text-signal" />
                    <h2 className="mb-3 text-3xl font-medium tracking-[-.04em] text-foreground">{isEs ? 'Contexto recibido' : 'Context received'}</h2>
                    <p className="mb-6 text-sm leading-relaxed text-zinc-400 light:text-muted-foreground">{isEs ? `Gracias, ${formData.name}. Voy a revisar el contexto y responderte por email.` : `Thank you, ${formData.name}. I’ll review the context and reply by email.`}</p>
                </motion.div>
            </div>
        );
    }

    const StepIcon = steps[step].icon;
    const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white transition-[border-color,box-shadow,background-color] placeholder:text-white/35 focus-visible:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/30 light:border-border light:bg-input light:text-foreground light:placeholder:text-foreground/45";
    const radioCardClass = "flex min-h-12 cursor-pointer items-center rounded-xl border border-white/8 bg-white/[.035] px-4 py-3 text-sm leading-5 text-foreground/58 transition-[border-color,background-color,color] hover:border-white/22 hover:text-foreground peer-checked:border-signal/50 peer-checked:bg-signal/10 peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-[rgb(var(--ink-rgb)/0.035)] light:hover:border-[rgb(var(--ink-rgb)/0.22)]";

    return (
        <section id="aplicar-os-section" className="relative overflow-hidden bg-transparent px-0 pb-24 pt-14 md:py-20">
            <div className="container mx-auto max-w-3xl px-0 sm:px-4">
                <form name="project-brief" noValidate onSubmit={handleSubmit} onKeyDown={(event) => {
                    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
                    if (event.key === 'Enter' && target instanceof HTMLInputElement && target.type === 'radio') {
                        event.preventDefault();
                        event.currentTarget.requestSubmit();
                    }
                }} className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0D1114]/92 p-4 shadow-2xl backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/94 light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_12px_32px_rgb(20_23_26/0.1)] md:p-8">
                    <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="brief-website">Website</label>
                        <input id="brief-website" name="website" type="text" value={formData.website} onChange={(event) => updateField('website', event.target.value)} autoComplete="off" tabIndex={-1} />
                    </div>

                    <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4 light:border-[rgb(var(--ink-rgb)/0.05)]">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-white light:text-foreground"><StepIcon aria-hidden="true" className="h-4 w-4 text-signal" />{steps[step].title}</h2>
                        <span className="font-mono text-[9px] text-zinc-500 light:text-muted-foreground">{isEs ? `Paso ${step + 1} de ${steps.length}` : `Step ${step + 1} of ${steps.length}`}</span>
                    </div>

                    <div className="min-h-[320px] text-left">
                        {step === 0 && (
                            <fieldset className="space-y-5">
                                <legend className="sr-only">{isEs ? 'Tus datos' : 'Your details'}</legend>
                                <div>
                                    <label htmlFor="brief-name" className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 light:text-muted-foreground">{isEs ? 'Nombre' : 'Name'}</label>
                                    <input id="brief-name" name="nombre" type="text" value={formData.name} onChange={(event) => updateField('name', event.target.value, 'nombre')} autoComplete="name" maxLength={80} aria-invalid={Boolean(fieldErrors.nombre)} aria-describedby={fieldErrors.nombre ? 'brief-name-error' : undefined} placeholder={isEs ? 'Tu nombre…' : 'Your name…'} className={inputClass} />
                                    {errorText('nombre')}
                                </div>
                                <div>
                                    <label htmlFor="brief-email" className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 light:text-muted-foreground">Email</label>
                                    <input id="brief-email" name="email" type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value, 'email')} autoComplete="email" inputMode="email" spellCheck={false} maxLength={254} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'brief-email-error' : undefined} placeholder="nombre@empresa.com…" className={inputClass} />
                                    {errorText('email')}
                                </div>
                            </fieldset>
                        )}

                        {step === 1 && (
                            <div className="space-y-7">
                                <div>
                                    <label htmlFor="brief-company" className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 light:text-muted-foreground">{isEs ? 'Proyecto o empresa (opcional)' : 'Project or company (optional)'}</label>
                                    <input id="brief-company" name="empresa" type="text" value={formData.company} onChange={(event) => updateField('company', event.target.value, 'empresa')} autoComplete="organization" maxLength={120} placeholder={isEs ? 'Nombre del proyecto…' : 'Project name…'} className={inputClass} />
                                </div>
                                <fieldset>
                                    <legend className="mb-3 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 light:text-muted-foreground">{isEs ? 'Madurez' : 'Stage'}</legend>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {projectStages.map((option, index) => <label key={option.value} className="relative"><input id={`brief-project-stage-${option.value}`} className="peer sr-only" type="radio" name="projectStage" value={option.value} checked={formData.projectStage === option.value} onChange={() => updateField('projectStage', option.value, 'projectStage')} aria-describedby={fieldErrors.projectStage && index === 0 ? 'brief-project-stage-idea-error' : undefined} /><span className={radioCardClass}>{option[language]}</span></label>)}
                                    </div>
                                    {errorText('projectStage')}
                                </fieldset>
                                <fieldset>
                                    <legend className="mb-3 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 light:text-muted-foreground">{isEs ? 'Equipo' : 'Team'}</legend>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {teamContexts.map((option, index) => <label key={option.value} className="relative"><input id={`brief-team-context-${option.value}`} className="peer sr-only" type="radio" name="teamContext" value={option.value} checked={formData.teamContext === option.value} onChange={() => updateField('teamContext', option.value, 'teamContext')} aria-describedby={fieldErrors.teamContext && index === 0 ? 'brief-team-context-solo-error' : undefined} /><span className={radioCardClass}>{option[language]}</span></label>)}
                                    </div>
                                    {errorText('teamContext')}
                                </fieldset>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-7">
                                <div>
                                    <label htmlFor="brief-project" className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 light:text-muted-foreground">{isEs ? '¿Qué querés cambiar, construir o hacer posible?' : 'What do you want to change, build or make possible?'}</label>
                                    <textarea id="brief-project" name="mensaje" value={formData.challenge} onChange={(event) => updateField('challenge', event.target.value, 'mensaje')} autoComplete="off" maxLength={2000} rows={6} aria-invalid={Boolean(fieldErrors.mensaje)} aria-describedby={fieldErrors.mensaje ? 'brief-project-error' : undefined} placeholder={isEs ? 'El contexto, qué existe hoy y qué debería cambiar…' : 'The context, what exists today and what should change…'} className={`${inputClass} resize-y`} />
                                    <div className="flex items-start justify-between gap-4">{errorText('mensaje')}<span className="ml-auto mt-2 font-mono text-[9px] tabular-nums text-foreground/30">{formData.challenge.length}/2000</span></div>
                                </div>
                                <fieldset>
                                    <legend className="mb-3 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 light:text-muted-foreground">{isEs ? 'Momento estimado de inicio' : 'Estimated start time'}</legend>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {timelines.map((option, index) => <label key={option.value} className="relative"><input id={`brief-timeline-${option.value}`} className="peer sr-only" type="radio" name="timeline" value={option.value} checked={formData.timeline === option.value} onChange={() => updateField('timeline', option.value, 'timeline')} aria-describedby={fieldErrors.timeline && index === 0 ? 'brief-timeline-now-error' : undefined} /><span className={radioCardClass}>{option[language]}</span></label>)}
                                    </div>
                                    {errorText('timeline')}
                                </fieldset>
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-3 z-20 -mx-1 mt-8 flex items-center justify-between rounded-2xl border border-white/8 bg-background/92 p-3 font-mono text-xs shadow-[0_14px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.08)] light:shadow-[0_14px_40px_rgb(20_23_26/0.14)] md:static md:mx-0 md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent md:p-0 md:pt-5 md:shadow-none md:backdrop-blur-none">
                        <button type="button" onClick={() => { setStep((current) => Math.max(0, current - 1)); setSubmitError(null); }} disabled={step === 0 || submitting} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-25 light:text-muted-foreground light:hover:text-foreground"><ArrowLeft aria-hidden="true" className="h-4 w-4" />{isEs ? 'Atrás' : 'Back'}</button>
                        <button type="submit" disabled={submitting} className="flex min-h-11 items-center gap-2 rounded-xl border border-signal/40 bg-signal/15 px-5 text-signal transition-[background-color,opacity] hover:bg-signal/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:cursor-wait disabled:opacity-60">
                            {submitting ? (isEs ? 'Enviando…' : 'Sending…') : step < steps.length - 1 ? (isEs ? 'Continuar' : 'Continue') : (isEs ? 'Enviar contexto' : 'Send context')}
                            <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </button>
                    </div>

                    <div aria-live="polite" aria-atomic="true">
                        {submitError && <p role="alert" className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[0.06] px-4 py-3 text-sm leading-5 text-red-200 light:border-destructive/30 light:bg-destructive/10 light:text-destructive">{submitError}</p>}
                    </div>
                </form>
            </div>

            {isDevMode && <div inert className="pointer-events-none absolute inset-0 z-0 border-[6px] border-emerald-500/20"><div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/10" /><div className="absolute inset-y-0 left-1/2 w-px bg-emerald-500/10" /></div>}
        </section>
    );
}
