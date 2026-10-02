"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  OMNICHANNEL_LEADS,
  type OmnichannelLead,
  type ChannelType,
} from "@/data/omnichannelInboxData";
import {
  Inbox,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Send,
  Calendar,
  Flame,
} from "lucide-react";

export function OmnichannelInboxSimulator() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [selectedLeadId, setSelectedLeadId] = useState<string>("lead-1");
  const [triggeredAction, setTriggeredAction] = useState<string | null>(null);
  const [actionFeedbackText, setActionFeedbackText] = useState<string | null>(null);

  const activeLead = useMemo<OmnichannelLead>(
    () => OMNICHANNEL_LEADS.find((l) => l.id === selectedLeadId) ?? OMNICHANNEL_LEADS[0],
    [selectedLeadId]
  );

  const handleTriggerAction = (actionId: string, feedback: string) => {
    setTriggeredAction(actionId);
    setActionFeedbackText(feedback);
    setTimeout(() => {
      setTriggeredAction(null);
      setActionFeedbackText(null);
    }, 4000);
  };

  const whatsappPrefillUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve probando el Simulador de Bandeja Unificada en tu web con el caso de ${activeLead.channelLabel}. Me interesa evaluar la centralización de canales y agentes de respuesta rápida para mi empresa.`
      : `Hi Mario, I was testing your Omnichannel Unified Inbox simulator with the ${activeLead.channelLabel} case. I'd like to centralize our customer messaging and fast-reply AI agents.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [activeLead, isEs]);

  return (
    <section
      id="bandeja-unificada"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Resplandor ambiental */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 15%, ${activeLead.channelColor}14 0%, transparent 60%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500"
              style={{ backgroundColor: activeLead.channelColor, color: activeLead.channelColor }}
            />
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: activeLead.channelColor }}
            >
              {isEs ? "01.7 · Bandeja Omnicanal & Speed-to-Lead" : "01.7 · Omnichannel Inbox & Speed-to-Lead"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Todos tus canales en un solo lugar. Respuesta en 18s con IA."
                : "All your channels in one place. Sub-18s replies with AI."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "WhatsApp Business, Instagram DM, formularios web y pauta publicitaria sincronizados en tiempo real. Tu equipo y los agentes de IA atienden desde una sola consola, sin prospectos perdidos entre pestañas ni olvidos."
              : "WhatsApp Business, Instagram DMs, web forms, and ad campaigns synced in real time. Your team and AI agents respond from one unified cockpit, ending dropped leads and lost chats forever."}
          </Reveal>
        </div>

        {/* ─── STAGE PRINCIPAL DE LA BANDEJA (3 PANELES) ─── */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.4fr_0.9fr]">
          {/* Panel 1: Lista de Prospectos Multicanal */}
          <div className="rounded-3xl border border-white/14 bg-card/60 p-5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
                  <Inbox className="h-3.5 w-3.5 text-foreground/40" />
                  {isEs ? "Bandeja Unificada" : "Unified Stream"}
                </span>
                <span className="text-[10px] font-mono text-signal bg-signal/10 px-2 py-0.5 rounded-full">
                  LIVE SYNC
                </span>
              </div>

              <div className="space-y-2.5">
                {OMNICHANNEL_LEADS.map((lead) => {
                  const isSelected = lead.id === selectedLeadId;
                  return (
                    <button
                      key={lead.id}
                      onClick={() => {
                        setSelectedLeadId(lead.id);
                        setTriggeredAction(null);
                        setActionFeedbackText(null);
                      }}
                      className={`w-full text-left rounded-2xl p-4 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                        isSelected
                          ? "border-white/30 bg-card/90 shadow-[0_6px_25px_rgba(0,0,0,0.5)] light:bg-card"
                          : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05]"
                      }`}
                      style={{
                        borderColor: isSelected ? lead.channelColor : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold"
                          style={{
                            backgroundColor: `${lead.channelColor}20`,
                            color: lead.channelColor,
                          }}
                        >
                          {lead.channelLabel}
                        </span>
                        <span className="text-[10px] font-mono text-signal flex items-center gap-1">
                          <Zap className="h-2.5 w-2.5" />
                          {lead.responseSpeedSec}s
                        </span>
                      </div>

                      <h4 className="mt-2 text-sm font-semibold text-foreground truncate">
                        {lead.customerName}
                      </h4>
                      <p className="text-xs text-foreground/50 truncate">{lead.companyName}</p>

                      <div className="mt-2.5 pt-2 border-t border-white/8 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-foreground/40">Valor:</span>
                        <span className="text-foreground/80 font-bold">${lead.dealValueUsd} USD</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-3 text-[10px] font-mono text-foreground/40 text-center">
              {isEs ? "3 de 3 canales sincronizados en tiempo real" : "3 of 3 channels in real-time sync"}
            </div>
          </div>

          {/* Panel 2: Línea de Conversación en Vivo */}
          <div className="rounded-3xl border border-white/14 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Header de conversación */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{
                      backgroundColor: `${activeLead.channelColor}25`,
                      color: activeLead.channelColor,
                      border: `1px solid ${activeLead.channelColor}40`,
                    }}
                  >
                    {activeLead.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{activeLead.customerName}</h4>
                    <p className="text-xs text-foreground/50 font-mono">{activeLead.channelLabel}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-signal/10 border border-signal/30 px-2.5 py-1 text-[10px] font-mono text-signal font-semibold">
                    {activeLead.currentStage[language]}
                  </span>
                </div>
              </div>

              {/* Mensajes */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {activeLead.messages.map((msg) => {
                  const isAgent = msg.sender === "ai_agent";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isAgent ? "justify-start" : "justify-end"}`}
                    >
                      {isAgent && (
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
                          style={{
                            backgroundColor: `${activeLead.channelColor}25`,
                            color: activeLead.channelColor,
                          }}
                        >
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                          isAgent
                            ? "bg-white/[0.08] border border-white/10 text-foreground"
                            : "bg-signal/15 border border-signal/30 text-foreground/90 ml-auto"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-[10px] font-mono opacity-50 mb-1">
                          <span>{isAgent ? "Agente IA Mario Morera" : activeLead.customerName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        {msg.text[language]}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Banner reactivo de acción disparada */}
            <AnimatePresence>
              {actionFeedbackText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 rounded-xl border border-signal/40 bg-signal/15 p-3 text-xs font-mono text-signal flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{actionFeedbackText}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Panel 3: Dossier de CRM & Disparadores Rápidos */}
          <div className="rounded-3xl border border-white/14 bg-card/60 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-signal" />
                  {isEs ? "Dossier del Prospecto" : "Prospect Dossier"}
                </span>
                <span className="text-[10px] font-mono text-foreground/40">CRM LIVE</span>
              </div>

              {/* Métricas clave */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-2xl border border-white/8 bg-background/50 p-3 text-center">
                  <span className="text-[9px] font-mono uppercase text-foreground/40 block">Intención</span>
                  <span className="text-xl font-bold font-mono text-signal">{activeLead.intentScore}%</span>
                  <span className="text-[9px] font-mono text-signal/80">A+ Calificado</span>
                </div>
                <div className="rounded-2xl border border-white/8 bg-background/50 p-3 text-center">
                  <span className="text-[9px] font-mono uppercase text-foreground/40 block">Oportunidad</span>
                  <span className="text-xl font-bold font-mono text-foreground">${activeLead.dealValueUsd}</span>
                  <span className="text-[9px] font-mono text-foreground/50">USD Estimados</span>
                </div>
              </div>

              <p className="text-xs text-foreground/65 leading-relaxed mb-5">
                {activeLead.summary[language]}
              </p>

              {/* Botones de acción de CRM con 1 clic */}
              <div className="space-y-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 block">
                  {isEs ? "Disparar Acción en CRM (1 Clic):" : "Trigger CRM Action (1 Click):"}
                </span>
                {activeLead.availableActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleTriggerAction(action.id, action.actionFeedback[language])}
                    className="w-full pressable text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 p-3 text-xs font-mono text-foreground transition-all flex items-center justify-between"
                  >
                    <span>{action.label[language]}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-signal shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Final */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <a
                href={whatsappPrefillUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable w-full inline-flex items-center justify-center gap-2 rounded-full py-3 px-4 text-xs font-semibold text-black transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: activeLead.channelColor,
                  boxShadow: `0 0 15px ${activeLead.channelColor}35`,
                }}
              >
                <span>{isEs ? "Unificar canales para mi empresa" : "Unify channels for my business"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
