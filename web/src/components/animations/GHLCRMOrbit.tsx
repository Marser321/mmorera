"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    CalendarCheck,
    CheckCircle2,
    CircleDot,
    Clock3,
    MailCheck,
    MessageSquareText,
    Sparkles,
    UserRoundCheck,
    Workflow,
} from "lucide-react";

const LEADS = [
    { name: "Consulta web", source: "Landing", status: "Nuevo", score: "82" },
    { name: "WhatsApp", source: "Campaña Meta", status: "Calificado", score: "91" },
    { name: "Referido", source: "Equipo", status: "Agenda", score: "76" },
] as const;

const PIPELINE = [
    { label: "Nuevo", value: "18", tone: "bg-sky-400" },
    { label: "Calificado", value: "11", tone: "bg-primary" },
    { label: "Reunión", value: "7", tone: "bg-violet-400" },
    { label: "Propuesta", value: "4", tone: "bg-amber-300" },
] as const;

const AUTOMATIONS = [
    { label: "IA califica intención", icon: Sparkles },
    { label: "WhatsApp confirma agenda", icon: MessageSquareText },
    { label: "Email nutre oportunidad", icon: MailCheck },
] as const;

export function GHLCRMOrbit() {
    return (
        <div className="relative mx-auto w-full max-w-6xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050706]/95 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,245,178,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_26%)]" />
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                <div className="relative z-10 rounded-[1.5rem] border border-white/8 bg-black/45">
                    <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 md:px-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                                <Workflow className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                                    GHL command center
                                </div>
                                <div className="text-sm font-bold text-white">CRM operativo en vivo</div>
                            </div>
                        </div>
                        <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary md:flex">
                            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(16,245,178,0.9)]" />
                            Automatizaciones activas
                        </div>
                    </div>

                    <div className="relative grid gap-3 p-3 md:grid-cols-[1fr_1.18fr_1fr] md:p-5">
                        <ConnectionLayer />
                        <InboxPanel />
                        <PipelinePanel />
                        <AutomationPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConnectionLayer() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block"
            viewBox="0 0 1100 430"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="crmBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10F5B2" stopOpacity="0.12" />
                    <stop offset="45%" stopColor="#10F5B2" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.2" />
                </linearGradient>
                <filter id="crmGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d="M 286 124 C 382 124, 394 112, 504 112"
                fill="none"
                stroke="url(#crmBeam)"
                strokeWidth="2"
                filter="url(#crmGlow)"
            />
            <path
                d="M 286 218 C 420 218, 435 246, 540 246"
                fill="none"
                stroke="url(#crmBeam)"
                strokeWidth="2"
                filter="url(#crmGlow)"
            />
            <path
                d="M 730 154 C 820 154, 826 118, 930 118"
                fill="none"
                stroke="url(#crmBeam)"
                strokeWidth="2"
                filter="url(#crmGlow)"
            />
            <path
                d="M 730 262 C 830 262, 826 292, 930 292"
                fill="none"
                stroke="url(#crmBeam)"
                strokeWidth="2"
                filter="url(#crmGlow)"
            />
            {/* Ruta completa para el dot viajero — path nombrado para animateMotion */}
            <path
                id="crmTravelPath"
                d="M 286 124 C 382 124, 394 112, 504 112 C 610 112, 628 154, 730 154 C 820 154, 826 118, 930 118"
                fill="none"
                stroke="none"
            />
            <circle r="5" fill="#10F5B2" filter="url(#crmGlow)">
                <animateMotion
                    dur="4.2s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1"
                    keyTimes="0;1"
                >
                    <mpath href="#crmTravelPath" />
                </animateMotion>
            </circle>
        </svg>
    );
}

function InboxPanel() {
    return (
        <section
            className="relative z-20 rounded-2xl border border-white/10 bg-[#080d0b]/95 p-4 text-left shadow-[0_18px_60px_rgba(0,0,0,0.42)]"
        >
            <PanelHeader icon={UserRoundCheck} eyebrow="Inbox" title="Leads entrantes" />
            <div className="mt-4 space-y-3">
                {LEADS.map((lead, index) => (
                    <motion.div
                        key={lead.name}
                        className="rounded-xl border border-white/8 bg-black/35 p-3"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: index * 0.1 }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="font-bold text-white">{lead.name}</div>
                                <div className="mt-1 text-xs text-white/45">{lead.source}</div>
                            </div>
                            <div className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                                {lead.score}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-white/48">
                            <span>{lead.status}</span>
                            <span className="flex items-center gap-1 text-primary/80">
                                <CircleDot className="h-3 w-3" />
                                enrutado
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function PipelinePanel() {
    return (
        <section
            className="relative z-20 rounded-2xl border border-primary/25 bg-[#07110e]/95 p-4 text-left shadow-[0_0_42px_rgba(16,245,178,0.12),0_18px_60px_rgba(0,0,0,0.42)]"
        >
            <PanelHeader icon={BarChart3} eyebrow="Pipeline" title="Oportunidades por etapa" />
            <div className="mt-5 grid grid-cols-2 gap-3">
                {PIPELINE.map((stage, index) => (
                    <div
                        key={stage.label}
                        className="rounded-xl border border-white/8 bg-black/35 p-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white/58">{stage.label}</span>
                            <span className={`h-2 w-2 rounded-full ${stage.tone}`} />
                        </div>
                        <div className="mt-3 text-3xl font-black text-white">{stage.value}</div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                className={`h-full rounded-full ${stage.tone}`}
                                initial={{ width: "0%" }}
                                whileInView={{ width: `${48 + index * 12}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.15 + index * 0.12 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/8 bg-black/30 p-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-white/45">Conversión estimada</span>
                    <span className="font-mono font-bold text-primary">+34%</span>
                </div>
            </div>
        </section>
    );
}

function AutomationPanel() {
    return (
        <section
            className="relative z-20 rounded-2xl border border-white/10 bg-[#080d0b]/95 p-4 text-left shadow-[0_18px_60px_rgba(0,0,0,0.42)]"
        >
            <PanelHeader icon={Workflow} eyebrow="Automations" title="Siguiente acción" />
            <div className="mt-4 space-y-3">
                {AUTOMATIONS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.label}
                            className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/35 p-3"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                                <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-bold text-white">{item.label}</div>
                                <div className="mt-1 flex items-center gap-2 text-[11px] text-white/42">
                                    <Clock3 className="h-3 w-3" />
                                    listo para disparar
                                </div>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary">Human handoff</span>
                    <CalendarCheck className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/52">
                    Cuando el lead está listo, el sistema agenda o deriva al equipo con contexto.
                </p>
            </div>
        </section>
    );
}

function PanelHeader({
    icon: Icon,
    eyebrow,
    title,
}: {
    icon: React.ElementType;
    eyebrow: string;
    title: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-primary">
                <Icon className="h-5 w-5" />
            </span>
            <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary/75">
                    {eyebrow}
                </div>
                <h3 className="text-base font-black text-white">{title}</h3>
            </div>
        </div>
    );
}
