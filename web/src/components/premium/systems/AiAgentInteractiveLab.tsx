"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  AI_AGENT_PRESETS,
  type AgentTypeConfig,
  type AgentScenario,
} from "@/data/aiAgentLabData";
import {
  Bot,
  Calendar,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  MessageSquare,
  Activity,
  Terminal,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export function AiAgentInteractiveLab() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // State
  const [selectedAgentId, setSelectedAgentId] = useState<string>("qualifier");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("high-ticket");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [simulatedTyping, setSimulatedTyping] = useState<boolean>(false);
  const [displayedReply, setDisplayedReply] = useState<string>("");

  const currentAgent = useMemo<AgentTypeConfig>(
    () => AI_AGENT_PRESETS.find((a) => a.id === selectedAgentId) ?? AI_AGENT_PRESETS[0],
    [selectedAgentId]
  );

  const currentScenario = useMemo<AgentScenario>(
    () =>
      currentAgent.scenarios.find((s) => s.id === activeScenarioId) ??
      currentAgent.scenarios[0],
    [currentAgent, activeScenarioId]
  );

  // Sync active scenario when agent changes
  useEffect(() => {
    setActiveScenarioId(currentAgent.scenarios[0].id);
  }, [currentAgent]);

  // Simulate typewriter effect on scenario change
  useEffect(() => {
    const fullText = currentScenario.agentReply[language];
    setSimulatedTyping(true);
    setDisplayedReply("");

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx += 3;
      if (currentIdx >= fullText.length) {
        setDisplayedReply(fullText);
        setSimulatedTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedReply(fullText.slice(0, currentIdx));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [currentScenario, language]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(currentScenario.webhookPayload, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const whatsappPrefilledUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, probé el ${currentAgent.name.es} en tu laboratorio interactivo y quiero evaluar cómo integrarlo a nuestro WhatsApp y CRM.`
      : `Hi Mario, I tested the ${currentAgent.name.en} in your interactive lab and want to evaluate deploying it into our WhatsApp & CRM setup.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [currentAgent, isEs]);

  return (
    <section
      id="laboratorio-agentes"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Resplandor ambiental adaptativo */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 30%, ${currentAgent.accentColor}18 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500"
              style={{ backgroundColor: currentAgent.accentColor, color: currentAgent.accentColor }}
            />
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: currentAgent.accentColor }}
            >
              {isEs ? "Laboratorio Interactivo · Agentes de IA en Vivo" : "Interactive Lab · Live Production AI Agents"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Interactuá con un agente real. Mirá cómo clasifica y ejecuta."
                : "Chat with a live agent. Watch how it qualifies and executes."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "No son chatbots tontos de árbol de decisión con botones rígidos. Son agentes con contexto de negocio que razonan, extraen parámetros comerciales y disparan webhooks instantáneos a tu CRM."
              : "These aren't static decision-tree chatbots with rigid buttons. They are commercial-grade agents that reason in natural language, extract business entities, and fire instant webhooks to your CRM."}
          </Reveal>
        </div>

        {/* ─── 1. TABS DE AGENTES DISPONIBLES ─── */}
        <div className="mt-10 flex flex-wrap gap-3">
          {AI_AGENT_PRESETS.map((agent) => {
            const isActive = selectedAgentId === agent.id;
            return (
              <motion.button
                key={agent.id}
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                    try { navigator.vibrate(10); } catch {}
                  }
                  setSelectedAgentId(agent.id);
                }}
                aria-pressed={isActive}
                aria-label={agent.name[language]}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex items-center gap-2.5 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold transition-all min-h-[46px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  isActive
                    ? "text-neutral-950 shadow-lg font-bold"
                    : "border border-white/12 bg-card/60 text-foreground/75 hover:border-white/25 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.12)]"
                }`}
                style={{
                  backgroundColor: isActive ? agent.accentColor : undefined,
                }}
              >
                {agent.id === "qualifier" && <Bot className="h-4 w-4" />}
                {agent.id === "scheduler" && <Calendar className="h-4 w-4" />}
                {agent.id === "reactivator" && <Zap className="h-4 w-4" />}
                <span>{agent.name[language]}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tagline del agente activo */}
        <motion.p
          key={selectedAgentId}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-xs sm:text-sm text-foreground/65 max-w-2xl font-light"
        >
          {currentAgent.tagline[language]}
        </motion.p>

        {/* ─── 2. CASOS DE PRUEBA / ESCENARIOS DEL AGENTE ─── */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/45 mr-1">
            {isEs ? "Escenario de simulación:" : "Simulation Scenario:"}
          </span>
          {currentAgent.scenarios.map((sc) => {
            const isScActive = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                    try { navigator.vibrate(8); } catch {}
                  }
                  setActiveScenarioId(sc.id);
                }}
                aria-pressed={isScActive}
                aria-label={sc.title[language]}
                className={`rounded-xl px-4 py-2 text-xs font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  isScActive
                    ? "border border-white/30 bg-white/15 text-foreground shadow-sm font-semibold"
                    : "border border-white/8 bg-white/[0.03] text-foreground/60 hover:border-white/15 hover:text-foreground"
                }`}
              >
                <span>{sc.title[language]}</span>
                <span
                  className="ml-2 inline-block rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                  style={{
                    backgroundColor: `${currentAgent.accentColor}25`,
                    color: currentAgent.accentColor,
                  }}
                >
                  {sc.badge[language]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── 3. INTERFAZ SPLIT: CHAT EN VIVO VS BAJO EL CAPÓ (TELEMETRÍA) ─── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 rounded-3xl border border-white/10 bg-card/75 p-5 sm:p-8 backdrop-blur-2xl shadow-3xl light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90">
          {/* LADO IZQUIERDO: Conversación WhatsApp Simulada */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/10 bg-black/50 p-5 sm:p-6 backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-foreground/60">
                <span className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                  {isEs ? "WhatsApp Business API · En Vivo" : "WhatsApp Business API · Live"}
                </span>
                <span className="text-[10px]">Latency: ~180ms</span>
              </div>

              {/* Mensajes */}
              <div className="mt-6 space-y-4">
                {/* Mensaje del Prospecto */}
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-foreground/60 text-xs font-mono">
                    US
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/10 p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed shadow-sm">
                    <p>{currentScenario.userMessage[language]}</p>
                    <span className="text-[10px] text-foreground/40 mt-1.5 block font-mono">
                      03:14 AM · Entrante
                    </span>
                  </div>
                </div>

                {/* Respuesta del Agente de IA */}
                <div className="flex items-start gap-3 max-w-[88%] ml-auto flex-row-reverse">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-neutral-950 font-bold text-xs"
                    style={{ backgroundColor: currentAgent.accentColor }}
                  >
                    AI
                  </div>
                  <div
                    className="rounded-2xl rounded-tr-sm border p-4 text-xs sm:text-sm text-foreground leading-relaxed shadow-md"
                    style={{
                      borderColor: `${currentAgent.accentColor}40`,
                      backgroundColor: `${currentAgent.accentColor}12`,
                    }}
                  >
                    <p>
                      {displayedReply}
                      {simulatedTyping && (
                        <span className="inline-block w-1.5 h-3.5 bg-signal animate-pulse ml-1" />
                      )}
                    </p>
                    <span
                      className="text-[10px] mt-1.5 block font-mono font-medium"
                      style={{ color: currentAgent.accentColor }}
                    >
                      03:14 AM · Agente IA (+28s)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input simulado inactivo */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-foreground/40 font-mono">
              <span>{isEs ? "Canal conectado y monitoreado 24/7" : "Channel connected and monitored 24/7"}</span>
              <span className="flex items-center gap-1.5 text-signal font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>SSL Secured</span>
              </span>
            </div>
          </div>

          {/* LADO DERECHO: BAJO EL CAPÓ (Extracción de Entidades & Webhook JSON) */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-5 sm:p-6 backdrop-blur-md">
            <div>
              {/* Header de telemetría */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-accent" />
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {isEs ? "Telemetría & Payload de Ejecución" : "Telemetry & Execution Payload"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-foreground/75 hover:bg-white/10 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-signal" />
                      <span className="text-signal">{isEs ? "Copiado" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{isEs ? "Copiar JSON" : "Copy JSON"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Entidades Extraídas en Vivo */}
              <div className="mt-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-2">
                  {isEs ? "Entidades Comerciales Extraídas:" : "Extracted Commercial Entities:"}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-2.5">
                    <span className="text-[10px] text-foreground/45 block">INTENT</span>
                    <span className="text-foreground/90 font-medium truncate block">
                      {currentScenario.extractedEntities.intent}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-2.5">
                    <span className="text-[10px] text-foreground/45 block">BUDGET</span>
                    <span className="text-signal font-semibold truncate block">
                      {currentScenario.extractedEntities.budget}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-2.5">
                    <span className="text-[10px] text-foreground/45 block">URGENCY</span>
                    <span className="text-amber-400 font-medium truncate block">
                      {currentScenario.extractedEntities.urgency}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-2.5">
                    <span className="text-[10px] text-foreground/45 block">DECISION MAKER</span>
                    <span className="text-accent font-medium truncate block">
                      {currentScenario.extractedEntities.decisionMaker}
                    </span>
                  </div>
                </div>
              </div>

              {/* Webhook JSON Viewer */}
              <div className="mt-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-2">
                  {isEs ? "Webhook Disparado al CRM en Milisegundos:" : "Webhook Fired to CRM in Milliseconds:"}
                </span>
                <pre className="rounded-xl border border-white/10 bg-neutral-950 p-3.5 text-[11px] font-mono text-accent overflow-x-auto leading-relaxed max-h-[190px]">
                  <code>{JSON.stringify(currentScenario.webhookPayload, null, 2)}</code>
                </pre>
              </div>
            </div>

            {/* Acción ejecutada en el CRM */}
            <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center gap-2 text-xs">
              <Sparkles className="h-4 w-4 text-signal shrink-0" />
              <span className="text-foreground/80 font-sans">
                <strong className="text-foreground font-medium">{isEs ? "Acción Automática: " : "Automated Action: "}</strong>
                {currentScenario.webhookPayload.action}
              </span>
            </div>
          </div>
        </div>

        {/* ─── 4. CTA CONTEXTUAL ─── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 light:bg-white/[0.8]">
          <div className="max-w-xl">
            <h4 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              {isEs
                ? `¿Querés incorporar este ${currentAgent.name.es} en tu negocio?`
                : `Want to deploy this ${currentAgent.name.en} into your operations?`}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-foreground/60 leading-relaxed">
              {isEs
                ? "Lo configuramos con tus políticas, FAQs y tono de marca, y lo conectamos a tu base de datos o CRM en producción."
                : "We tailor it with your company policies, FAQs, and brand voice, connected directly to your production CRM."}
            </p>
          </div>

          <motion.a
            href={whatsappPrefilledUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-xs sm:text-sm font-bold text-neutral-950 shadow-[0_0_25px_rgba(37,211,102,0.35)] transition-all hover:bg-[#22c35e]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{isEs ? "Implementar este agente" : "Deploy this agent"}</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
