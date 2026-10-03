"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  VOICE_AGENT_PERSONAS,
  type VoiceAgentPersona,
  type VoiceDialogueTurn,
} from "@/data/voiceAgentLabData";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  Activity,
  Zap,
  Volume2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Server,
  Code2,
} from "lucide-react";

export function VoiceAgentInteractiveSandbox() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Selected persona
  const [selectedId, setSelectedId] = useState<"clinic" | "realestate" | "dealership">("clinic");
  const persona = useMemo<VoiceAgentPersona>(
    () => VOICE_AGENT_PERSONAS.find((p) => p.id === selectedId) ?? VOICE_AGENT_PERSONAS[0],
    [selectedId]
  );

  // Call simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [callDuration, setCallDuration] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restart call simulation on persona switch
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTurnIndex(0);
    setCallDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedId]);

  // Call timeline stepper
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCallDuration((prev) => {
        const nextTime = prev + 1;
        // Step dialogue every 2.5 seconds
        const nextTurn = Math.floor(nextTime / 2.5);
        if (nextTurn < persona.dialogue.length) {
          setCurrentTurnIndex(nextTurn);
        } else {
          // Keep call at final turn or finish
          setCurrentTurnIndex(persona.dialogue.length - 1);
        }
        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, persona.dialogue.length]);

  const activeTurn: VoiceDialogueTurn = persona.dialogue[currentTurnIndex] ?? persona.dialogue[0];

  const handleStartCall = () => {
    setCurrentTurnIndex(0);
    setCallDuration(0);
    setIsPlaying(true);
  };

  const handleEndCall = () => {
    setIsPlaying(false);
    setCallDuration(0);
    setCurrentTurnIndex(0);
  };

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const whatsappPrefillUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, estuve probando el simulador de agente de voz con el perfil de ${persona.name.es}. Me interesa evaluar la implementación de un operador telefónico con IA para mi negocio.`
      : `Hi Mario, I was testing your Voice AI sandbox with the ${persona.name.en} persona. I'd like to explore an AI telephony agent for my company.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [persona, isEs]);

  return (
    <section
      id="sandbox-voz-ia"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Resplandor ambiental reactivo con el color de la persona */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 20%, ${persona.accentColor}18 0%, transparent 65%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500 animate-pulse"
              style={{ backgroundColor: persona.accentColor, color: persona.accentColor }}
            />
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: persona.accentColor }}
            >
              {isEs ? "Telefonía & Voz IA · Sandbox en Tiempo Real" : "Voice AI & Telephony · Realtime Sandbox"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Tu empresa atendiendo el teléfono a las 3 AM con latencia humana."
                : "Your company answering the phone at 3 AM with human-grade latency."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Los clientes no quieren esperar a que alguien lea un mensaje. Con un agente de voz con IA conectado a tu CRM y calendario, tus prospectos se agendan, cotizan y califican en la misma llamada."
              : "Customers don't want to wait hours for a reply. An AI voice agent connected to your CRM and calendar qualifies, quotes, and books appointments on the very first call."}
          </Reveal>
        </div>

        {/* ─── 1. SELECTOR DE PERSONA / CASO DE USO ─── */}
        <div className="mt-10">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-3">
            {isEs ? "Paso 1: Seleccioná un perfil de agente telefónico" : "Step 1: Select a voice agent persona"}
          </span>
          <div className="grid gap-3.5 sm:grid-cols-3">
            {VOICE_AGENT_PERSONAS.map((p) => {
              const isSelected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`group relative text-left rounded-2xl p-5 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-white/30 bg-card/90 shadow-[0_8px_30px_rgba(0,0,0,0.5)] light:bg-card"
                      : "border-white/10 bg-card/30 hover:border-white/20 hover:bg-card/50 light:bg-card/20"
                  }`}
                  style={{
                    borderColor: isSelected ? p.accentColor : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
                      style={{
                        backgroundColor: isSelected ? `${p.accentColor}25` : "rgba(255,255,255,0.06)",
                        color: isSelected ? p.accentColor : "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                      {p.badge[language]}
                    </span>
                    <span className="text-[11px] font-mono text-foreground/40">{p.telemetry.latencyMs}ms</span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                    {p.name[language]}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/60 leading-relaxed">{p.role[language]}</p>

                  <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-foreground/40 border-t border-white/8 pt-2.5">
                    <Volume2 className="h-3 w-3 text-foreground/50" />
                    <span className="truncate">{p.voiceName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 2. STAGE INTERACTIVO: SIMULADOR DE LLAMADA & TELEMETRÍA ─── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Panel Izquierdo: Consola de Audio & Controles */}
          <div className="rounded-3xl border border-white/14 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header de la llamada */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: `${persona.accentColor}50`,
                      backgroundColor: `${persona.accentColor}15`,
                    }}
                  >
                    <Mic className="h-6 w-6" style={{ color: persona.accentColor }} />
                    {isPlaying && (
                      <span
                        className="absolute -top-1 -right-1 flex h-3.5 w-3.5 rounded-full ring-2 ring-background animate-ping"
                        style={{ backgroundColor: persona.accentColor }}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-foreground">{persona.name[language]}</h4>
                    <p className="text-xs text-foreground/50 font-mono">
                      {isPlaying
                        ? isEs
                          ? "● EN LLAMADA ACTIVA · WEBRTC OPUS"
                          : "● ACTIVE CALL · WEBRTC OPUS"
                        : isEs
                        ? "○ LISTO PARA SIMULAR LLAMADA"
                        : "○ READY TO SIMULATE"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xl font-bold tracking-wider text-foreground">
                    {formatCallTime(callDuration)}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-foreground/40">SIP AUDIO TRUNK</span>
                </div>
              </div>

              {/* Visualizador de Onda Acústica (Frecuencia Dinámica) */}
              <div className="my-8 rounded-2xl border border-white/8 bg-background/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-foreground/40" />
                    {isEs ? "Espectro de Frecuencia de Audio" : "Audio Frequency Spectrum"}
                  </span>
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isPlaying ? `${persona.accentColor}20` : "rgba(255,255,255,0.05)",
                      color: isPlaying ? persona.accentColor : "inherit",
                    }}
                  >
                    {isPlaying
                      ? activeTurn.speaker === "agent"
                        ? isEs
                          ? "Sintetizando Voz (TTS)"
                          : "Synthesizing Speech (TTS)"
                        : isEs
                        ? "Voz del Prospecto (STT)"
                        : "Caller Voice (STT)"
                      : isEs
                      ? "Standby"
                      : "Idle"}
                  </span>
                </div>

                {/* Barras de ecualizador */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 h-20 px-2">
                  {Array.from({ length: 24 }).map((_, barIdx) => {
                    const energy = isPlaying ? activeTurn.audioEnergy : 0.08;
                    // Generar alturas orgánicas según el turno
                    const heightFactor = Math.sin((barIdx / 24) * Math.PI) * energy;
                    const randomVariance = isPlaying ? ((barIdx * 7) % 5) * 0.04 : 0;
                    const heightPct = Math.min(100, Math.max(10, (heightFactor + randomVariance) * 100));

                    return (
                      <motion.div
                        key={barIdx}
                        animate={{
                          height: `${heightPct}%`,
                          backgroundColor:
                            isPlaying && activeTurn.speaker === "agent"
                              ? persona.accentColor
                              : isPlaying
                              ? "#55D8FF"
                              : "rgba(255,255,255,0.15)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className="w-full rounded-full min-h-[4px]"
                      />
                    );
                  })}
                </div>
              </div>

              {/* Resumen del perfil */}
              <p className="text-xs text-foreground/60 leading-relaxed mb-6">{persona.summary[language]}</p>
            </div>

            {/* Botones de Control de Llamada */}
            <div className="border-t border-white/10 pt-5 flex flex-wrap items-center gap-3">
              {!isPlaying ? (
                <button
                  onClick={handleStartCall}
                  className="pressable flex-1 inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm font-semibold text-black transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    backgroundColor: persona.accentColor,
                    boxShadow: `0 0 25px ${persona.accentColor}40`,
                  }}
                >
                  <PhoneCall className="h-4 w-4" />
                  {isEs ? "Simular Llamada Entrante" : "Simulate Inbound Call"}
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="pressable flex-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-destructive/20 border border-destructive/40 px-6 py-4 text-sm font-semibold text-destructive hover:bg-destructive/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                >
                  <PhoneOff className="h-4 w-4" />
                  {isEs ? "Colgar Llamada" : "Hang Up Call"}
                </button>
              )}

              <a
                href={whatsappPrefillUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable inline-flex items-center gap-2 rounded-full border border-white/14 bg-background/50 px-5 py-4 text-sm font-medium text-foreground hover:border-white/30 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              >
                <span>{isEs ? "Cotizar para mi negocio" : "Quote for my business"}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Panel Derecho: Transcripción en Vivo & Disparador de CRM */}
          <div className="flex flex-col gap-4">
            {/* Transcripción viva */}
            <div className="rounded-3xl border border-white/14 bg-card/60 p-6 backdrop-blur-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50 flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-foreground/40" />
                    {isEs ? "Transcripción Fonética en Vivo" : "Live Phonetic Transcript"}
                  </span>
                  <span className="text-[10px] font-mono text-foreground/40">
                    {currentTurnIndex + 1} / {persona.dialogue.length} {isEs ? "turnos" : "turns"}
                  </span>
                </div>

                <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                  {persona.dialogue.slice(0, currentTurnIndex + 1).map((turn, idx) => {
                    const isAgent = turn.speaker === "agent";
                    const isLatest = idx === currentTurnIndex;

                    return (
                      <motion.div
                        key={turn.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${isAgent ? "justify-start" : "justify-end"}`}
                      >
                        {isAgent && (
                          <div
                            className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                            style={{
                              backgroundColor: `${persona.accentColor}25`,
                              color: persona.accentColor,
                              border: `1px solid ${persona.accentColor}40`,
                            }}
                          >
                            AI
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                            isAgent
                              ? "bg-white/[0.07] border border-white/10 text-foreground"
                              : "bg-accent/15 border border-accent/25 text-foreground/90 ml-auto"
                          } ${isLatest && isPlaying ? "ring-1 ring-white/30" : ""}`}
                        >
                          <div className="text-[10px] font-mono opacity-50 mb-1">
                            {isAgent ? persona.name[language] : isEs ? "Cliente / Prospecto" : "Customer / Caller"}
                          </div>
                          {turn.text[language]}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Evento CRM Interceptado en Tiempo Real */}
              <div className="mt-4 border-t border-white/10 pt-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-signal flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-3 w-3" />
                  {isEs ? "Acción de CRM Conectada" : "Connected CRM Event Triggered"}
                </span>

                <AnimatePresence mode="wait">
                  {activeTurn.crmEvent ? (
                    <motion.div
                      key={activeTurn.crmEvent.action}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="rounded-xl border border-signal/30 bg-signal/[0.06] p-3 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between text-[11px] text-signal font-semibold">
                        <span>POST /api/crm/execute</span>
                        <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[9px]">200 OK</span>
                      </div>
                      <div className="mt-1 text-[11px] text-foreground/80 font-semibold">
                        {activeTurn.crmEvent.action}
                      </div>
                      <pre className="mt-1.5 overflow-x-auto text-[10px] text-foreground/60 leading-tight">
                        {JSON.stringify(activeTurn.crmEvent.payload, null, 2)}
                      </pre>
                    </motion.div>
                  ) : (
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-[11px] text-foreground/40 font-mono">
                      {isEs
                        ? "Esperando extracción de datos de intención para disparar webhook..."
                        : "Waiting for intent data to trigger CRM webhook..."}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Telemetría del Engine de Voz */}
            <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[9px] font-mono uppercase text-foreground/40 block">Latencia Media</span>
                <span className="text-sm font-bold font-mono text-signal">{persona.telemetry.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-foreground/40 block">Audio Bitrate</span>
                <span className="text-xs font-medium font-mono text-foreground/80">Opus 48kHz</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-foreground/40 block">LLM Engine</span>
                <span className="text-xs font-medium font-mono text-foreground/80">Claude 3.5 / Fast</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-foreground/40 block">Empatía / Calma</span>
                <span className="text-xs font-medium font-mono text-foreground/80">{persona.telemetry.sentimentScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
