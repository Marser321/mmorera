"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommit,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Terminal,
  Activity,
  ArrowUpRight,
  Database,
  Bot,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  SPRINT_MILESTONES,
  ASYNC_LEVERAGE_METRICS,
  type MilestoneEvent,
} from "@/data/asyncDeliveryData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

const eventIcons: Record<MilestoneEvent["type"], LucideIcon> = {
  git: GitCommit,
  deploy: Zap,
  db: Database,
  ai: Bot,
  qa: ShieldCheck,
};

export function AsyncSprintDeliveryRadar() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const activeMilestone = SPRINT_MILESTONES[activePhaseIndex];

  const whatsAppMessage = isEs
    ? `Hola Mario, estuve viendo el Radar de Entrega Asíncrona en tu sitio (Fase ${activeMilestone.phaseNumber}: ${activeMilestone.name.es}) y quiero coordinar un sprint con esta metodología ágil sin reuniones.`
    : `Hi Mario, I was checking out the Async Delivery Radar on your site (Phase ${activeMilestone.phaseNumber}: ${activeMilestone.name.en}) and want to start an agile sprint with zero unnecessary meetings.`;

  const whatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    whatsAppMessage
  )}`;

  return (
    <section
      id="radar-entrega"
      className="relative isolate my-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#070b10] p-6 backdrop-blur-2xl sm:p-10 lg:p-12 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-signal/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[130px]"
      />

      {/* Header */}
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-xs font-mono text-signal">
          <Activity className="h-3.5 w-3.5" />
          <span>
            {isEs
              ? "07.05 · RADAR DE ENTREGA ASÍNCRONA & LIVE CLIENT STREAM"
              : "07.05 · ASYNC SPRINT RADAR & CLIENT STREAM"}
          </span>
        </div>
        <h2 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
          {isEs
            ? "Sin reuniones inútiles. Visibilidad total día por día."
            : "Zero wasteful meetings. Total visibility day by day."}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
          {isEs
            ? "Mientras las agencias tradicionales consumen 18 horas al mes en llamadas improductivas, acá recibís acceso a tu staging en 72h, commits verificables en GitHub y un demo en video semanal de 4 minutos."
            : "While traditional agencies waste 18 hours a month on redundant meetings, here you get your private staging in 72h, verifiable GitHub commits, and a crisp 4-minute weekly video walkthrough."}
        </p>
      </div>

      {/* Radar Console Grid */}
      <div className="relative z-10 mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* Left: 4 Milestone Step Cards */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between font-mono text-xs uppercase text-foreground/60 mb-2">
            <span>{isEs ? "Fases del Sprint (21 Días)" : "Sprint Phases (21 Days)"}</span>
            <span className="text-signal">
              {isEs ? "Fase Activa" : "Active Phase"}: 0{activeMilestone.phaseNumber} / 04
            </span>
          </div>

          {SPRINT_MILESTONES.map((milestone, idx) => {
            const isActive = activePhaseIndex === idx;
            return (
              <motion.button
                key={milestone.id}
                type="button"
                onClick={() => setActivePhaseIndex(idx)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`relative w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                  isActive
                    ? "border-signal/50 bg-signal/[0.08] shadow-[0_0_30px_rgba(113,243,162,0.12)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-white/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold border ${
                        isActive
                          ? "border-signal/50 bg-signal text-black shadow-[0_0_12px_rgba(113,243,162,0.4)]"
                          : "border-white/15 bg-white/5 text-foreground/60"
                      }`}
                    >
                      0{milestone.phaseNumber}
                    </span>
                    <div>
                      <span className="font-mono text-xs text-signal font-medium">
                        {milestone.dayRange[language]}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">
                        {milestone.name[language]}
                      </h3>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-foreground/60">
                    {milestone.deliverableBadge[language]}
                  </span>
                </div>

                {/* Deliverables summary preview */}
                <div className="mt-3.5 pl-12 space-y-1.5 border-t border-white/5 pt-3">
                  {milestone.deliverables[language].slice(0, 2).map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center gap-2 text-xs text-foreground/65"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-signal/80 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right: Simulated Client Stream & Telemetry HUD */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0b1017] shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#141b24] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-foreground/60 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-signal" />
                  client-stream.mmorera.agency
                </span>
              </div>

              <div className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] text-signal font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                <span>LIVE FEED</span>
              </div>
            </div>

            {/* Staging URL bar */}
            <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-2.5 font-mono text-xs">
              <span className="text-foreground/50 truncate">
                {activeMilestone.telemetry.previewUrl}
              </span>
              <span className="shrink-0 text-signal flex items-center gap-1 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5" />
                HTTPS 200 OK
              </span>
            </div>

            {/* Live Feed Events */}
            <div className="p-4 sm:p-5 space-y-3.5 min-h-[260px]">
              <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/45 mb-2">
                {isEs ? "Registro Asíncrono de Despliegue" : "Async Deployment Stream"}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMilestone.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  {activeMilestone.events.map((event, eventIdx) => {
                    const EventIcon = eventIcons[event.type];
                    return (
                      <div
                        key={eventIdx}
                        className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-colors hover:border-white/10"
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-foreground/50">
                          <span className="flex items-center gap-1.5 text-signal">
                            <EventIcon className="h-3.5 w-3.5" />
                            {event.tag}
                          </span>
                          <span>{event.time}</span>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-foreground/85 leading-relaxed">
                          {event.message[language]}
                        </p>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Telemetry Bar */}
            <div className="grid grid-cols-3 border-t border-white/10 bg-[#0f141d] p-3 text-center font-mono">
              <div className="border-r border-white/10">
                <div className="text-[10px] text-foreground/50">COMMITS</div>
                <div className="text-signal font-bold text-sm">
                  {activeMilestone.telemetry.commitsCount}+
                </div>
              </div>
              <div className="border-r border-white/10">
                <div className="text-[10px] text-foreground/50">LIGHTHOUSE</div>
                <div className="text-accent font-bold text-sm">
                  {activeMilestone.telemetry.lighthouseScore} / 100
                </div>
              </div>
              <div>
                <div className="text-[10px] text-foreground/50">TESTS PASSING</div>
                <div className="text-track-create font-bold text-sm">
                  {activeMilestone.telemetry.testPassingCount} / {activeMilestone.telemetry.testPassingCount}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-white/10 bg-[#141b24] p-4">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-5 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(113,243,162,0.3)] transition-transform hover:-translate-y-0.5"
              >
                <span>
                  {isEs
                    ? "Iniciar mi sprint con esta metodología"
                    : "Start my sprint with this methodology"}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Leverage Metrics Footer */}
      <div className="relative z-10 mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-3 text-center font-mono">
        <div className="border-b border-white/5 pb-3 sm:border-b-0 sm:border-r sm:pb-0">
          <div className="text-2xl font-bold text-signal">
            +{ASYNC_LEVERAGE_METRICS.hoursSavedInMeetings}h
          </div>
          <div className="mt-1 text-xs text-foreground/60">
            {isEs
              ? "Reuniones improductivas eliminadas"
              : "Wasteful meetings eliminated"}
          </div>
        </div>

        <div className="border-b border-white/5 pb-3 sm:border-b-0 sm:border-r sm:pb-0">
          <div className="text-2xl font-bold text-accent">
            &lt;{ASYNC_LEVERAGE_METRICS.stagingAvailabilityHours}h
          </div>
          <div className="mt-1 text-xs text-foreground/60">
            {isEs
              ? "Para tu primer staging vivo"
              : "To your first live staging URL"}
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold text-track-create">100%</div>
          <div className="mt-1 text-xs text-foreground/60">
            {isEs
              ? "Código propio transferido en GitHub"
              : "Proprietary code transferred in GitHub"}
          </div>
        </div>
      </div>
    </section>
  );
}
