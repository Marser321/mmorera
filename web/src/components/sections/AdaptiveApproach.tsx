"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Bot,
    Code2,
    Film,
    Gauge,
    MessageSquare,
    MousePointer2,
    Route,
    SlidersHorizontal,
    Sparkles,
    Workflow,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const PERFORMANCE_MODULES = [
    {
        title: "Product interface",
        tool: "Next.js / React",
        role: "When the experience needs speed, structure and a polished frontend.",
        icon: Code2,
        tone: "text-sky-300",
        border: "border-sky-400/20",
        bg: "bg-sky-400/[0.06]",
    },
    {
        title: "Automation logic",
        tool: "GoHighLevel + flows",
        role: "When leads, reminders, handoffs and follow-ups need to move without manual friction.",
        icon: Workflow,
        tone: "text-emerald-300",
        border: "border-emerald-400/20",
        bg: "bg-emerald-400/[0.06]",
    },
    {
        title: "Conversational layer",
        tool: "AI / WhatsApp API",
        role: "When the system has to qualify, answer and route people with context.",
        icon: MessageSquare,
        tone: "text-cyan-300",
        border: "border-cyan-400/20",
        bg: "bg-cyan-400/[0.06]",
    },
    {
        title: "Visual precision",
        tool: "DaVinci + motion",
        role: "When content, rhythm and perception need to feel premium, not improvised.",
        icon: Film,
        tone: "text-violet-300",
        border: "border-violet-400/20",
        bg: "bg-violet-400/[0.06]",
    },
    {
        title: "Decision support",
        tool: "LLMs + lateral thinking",
        role: "When the hard part is framing the problem before choosing the stack.",
        icon: Bot,
        tone: "text-amber-300",
        border: "border-amber-400/20",
        bg: "bg-amber-400/[0.06]",
    },
    {
        title: "Detail refinement",
        tool: "Micro-interactions",
        role: "When small UX, copy or timing details decide whether the system feels finished.",
        icon: MousePointer2,
        tone: "text-rose-300",
        border: "border-rose-400/20",
        bg: "bg-rose-400/[0.06]",
    },
] as const;

const REFINEMENT_STEPS = [
    { label: "Diagnose", detail: "Where is the real bottleneck?", icon: Route },
    { label: "Match", detail: "Which tool performs best here?", icon: SlidersHorizontal },
    { label: "Refine", detail: "What tiny detail changes the outcome?", icon: Sparkles },
    { label: "Integrate", detail: "How does it connect with the whole system?", icon: Gauge },
] as const;

export function AdaptiveApproach() {
    const { t } = useLanguage();

    const getStepTranslation = (idx: number) => {
        if (idx === 0) return { label: t('adaptive', 'badge_diagnose'), detail: t('adaptive', 'detail_diagnose') };
        if (idx === 1) return { label: t('adaptive', 'badge_match'), detail: t('adaptive', 'detail_match') };
        if (idx === 2) return { label: t('adaptive', 'badge_refine'), detail: t('adaptive', 'detail_refine') };
        if (idx === 3) return { label: t('adaptive', 'badge_integrate'), detail: t('adaptive', 'detail_integrate') };
        return { label: '', detail: '' };
    };

    const getModuleTranslation = (idx: number) => {
        return {
            title: t('adaptive', `module${idx}_title`),
            tool: t('adaptive', `module${idx}_tool`),
            desc: t('adaptive', `module${idx}_desc`),
        };
    };

    return (
        <section
            id="enfoque"
            className="relative overflow-hidden bg-transparent py-16 md:py-20"
            aria-labelledby="enfoque-heading"
        >
            <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[150px]" />
            <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <Container className="relative z-10">
                <div className="mx-auto max-w-3xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400"
                    >
                        {t('adaptive', 'eyebrow')}
                    </motion.span>
                    <motion.h2
                        id="enfoque-heading"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="mb-4 text-3xl font-black leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl"
                    >
                        {t('adaptive', 'title_part1')}{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                            {t('adaptive', 'title_part2')}
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/55 md:text-lg"
                    >
                        {t('adaptive', 'subtitle')}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="mx-auto mt-9 grid max-w-6xl gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-md md:p-6">
                        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[90px]" />
                        <div className="relative z-10">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">
                                <Workflow className="h-3.5 w-3.5" />
                                {t('adaptive', 'card_badge')}
                            </div>

                            <h3 className="text-xl font-black leading-tight text-white md:text-2xl">
                                {t('adaptive', 'card_title')}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/55">
                                {t('adaptive', 'card_desc')}
                            </p>

                            <div className="mt-6 space-y-3">
                                {REFINEMENT_STEPS.map((step, index) => {
                                    const Icon = step.icon;
                                    const { label, detail } = getStepTranslation(index);
                                    return (
                                        <motion.div
                                            key={step.label}
                                            initial={{ opacity: 0, x: -12 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.12 + index * 0.08 }}
                                            className="grid grid-cols-[auto_1fr] gap-3"
                                        >
                                            <div className="relative">
                                                <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/35 text-emerald-300">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                {index < REFINEMENT_STEPS.length - 1 && (
                                                    <div className="absolute left-1/2 top-10 h-5 w-px -translate-x-1/2 bg-white/10" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-[0.16em] text-white">
                                                    {label}
                                                </p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-white/45">
                                                    {detail}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <a
                                href="/aplicar"
                                className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 transition-colors hover:text-white"
                            >
                                {t('adaptive', 'card_cta')}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:auto-rows-max">
                        {PERFORMANCE_MODULES.map((module, index) => {
                            const Icon = module.icon;
                            const { title, tool, desc } = getModuleTranslation(index);
                            return (
                                <motion.article
                                    key={module.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.08 + index * 0.06 }}
                                    className={cn(
                                        "group relative overflow-hidden rounded-2xl border bg-white/[0.018] p-4 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.04]",
                                        module.border
                                    )}
                                >
                                    <div className={cn("absolute inset-x-0 top-0 h-px opacity-60", module.bg)} />
                                    <div className="flex items-start gap-3">
                                        <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border", module.border, module.bg, module.tone)}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", module.tone)}>
                                                {tool}
                                            </p>
                                            <h3 className="mt-1.5 text-sm font-black text-white">
                                                {title}
                                            </h3>
                                            <p className="mt-1.5 text-xs leading-relaxed text-white/48">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
