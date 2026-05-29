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
    return (
        <section
            id="enfoque"
            className="relative overflow-hidden bg-transparent py-20 md:py-28"
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
                        className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400"
                    >
                        Adaptive Approach
                    </motion.span>
                    <motion.h2
                        id="enfoque-heading"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="mb-6 text-3xl font-black leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl"
                    >
                        Tools change daily.{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                            Criteria doesn&apos;t.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/55 md:text-lg"
                    >
                        I don&apos;t choose tools because they are new. I study where each one performs best, where it breaks, and how it can attack a specific layer of the problem. The goal is modular execution: solve the big system, then refine the small details that make it feel intentional.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-md md:p-8">
                        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[90px]" />
                        <div className="relative z-10">
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">
                                <Workflow className="h-4 w-4" />
                                Modular diagnosis
                            </div>

                            <h3 className="text-2xl font-black leading-tight text-white md:text-3xl">
                                The stack is built around the problem, not the other way around.
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
                                A landing page, CRM, video edit or AI flow are only useful when they have a clear job. I separate the system into modules, assign the right tool to each layer, and keep refining until the invisible details stop leaking value.
                            </p>

                            <div className="mt-8 space-y-4">
                                {REFINEMENT_STEPS.map((step, index) => {
                                    const Icon = step.icon;
                                    return (
                                        <motion.div
                                            key={step.label}
                                            initial={{ opacity: 0, x: -12 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.12 + index * 0.08 }}
                                            className="grid grid-cols-[auto_1fr] gap-4"
                                        >
                                            <div className="relative">
                                                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/35 text-emerald-300">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                {index < REFINEMENT_STEPS.length - 1 && (
                                                    <div className="absolute left-1/2 top-12 h-6 w-px -translate-x-1/2 bg-white/10" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-[0.16em] text-white">
                                                    {step.label}
                                                </p>
                                                <p className="mt-1 text-sm leading-relaxed text-white/45">
                                                    {step.detail}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <a
                                href="/aplicar"
                                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-300 transition-colors hover:text-white"
                            >
                                Let&apos;s discuss your project
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {PERFORMANCE_MODULES.map((module, index) => {
                            const Icon = module.icon;
                            return (
                                <motion.article
                                    key={module.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.08 + index * 0.06 }}
                                    className={cn(
                                        "group relative overflow-hidden rounded-2xl border bg-white/[0.018] p-5 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.04]",
                                        module.border
                                    )}
                                >
                                    <div className={cn("absolute inset-x-0 top-0 h-px opacity-60", module.bg)} />
                                    <div className="flex items-start gap-4">
                                        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl border", module.border, module.bg, module.tone)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", module.tone)}>
                                                {module.tool}
                                            </p>
                                            <h3 className="mt-2 text-base font-black text-white">
                                                {module.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-white/48">
                                                {module.role}
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
