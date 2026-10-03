"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Activity,
  Layers,
  Terminal,
  Radio,
  Delete,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DTMF_KEYPAD,
  TELEPHONY_PRESETS,
  getDtmfTone,
  formatDialDisplay,
  type TelephonyPreset,
} from "@/data/telephonyDialpadData";
import { WHATSAPP_PHONE_NUMBER } from "@/data/whatsappScopeData";

export function InteractiveTelephonyDialpad() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Dial state
  const [dialedNumber, setDialedNumber] = useState<string>("+1 (800) 336-8251");
  const [activePreset, setActivePreset] = useState<TelephonyPreset>(TELEPHONY_PRESETS[0]);

  // Call Lifecycle: 'idle' | 'calling' | 'connected' | 'ended'
  const [callState, setCallState] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [dialogueStep, setDialogueStep] = useState<number>(0);

  // Audio mute/active states
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);

  // Web Audio Context for authentic DTMF sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play DTMF dual-tone
  const playDtmfSound = useCallback((key: string) => {
    const tone = getDtmfTone(key);
    if (!tone) return;

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.12; // 120ms

      const oscLow = ctx.createOscillator();
      const oscHigh = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscLow.type = "sine";
      oscLow.frequency.setValueAtTime(tone.lowFreq, now);

      oscHigh.type = "sine";
      oscHigh.frequency.setValueAtTime(tone.highFreq, now);

      // Smooth envelope to prevent audio click
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscLow.connect(gainNode);
      oscHigh.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscLow.start(now);
      oscHigh.start(now);
      oscLow.stop(now + duration);
      oscHigh.stop(now + duration);
    } catch {
      // AudioContext not allowed or not supported; silent visual fallback
    }
  }, []);

  const handleKeyPress = (key: string) => {
    playDtmfSound(key);
    if (callState === "idle" || callState === "ended") {
      setDialedNumber((prev) => (prev.length < 18 ? prev + key : prev));
    }
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleSelectPreset = (preset: TelephonyPreset) => {
    setActivePreset(preset);
    setDialedNumber(preset.phoneNumber);
  };

  // Call handling
  const startCall = () => {
    setCallState("calling");
    setCallSeconds(0);
    setDialogueStep(0);

    // Simulated SIP connection (1.2s ringing -> connected)
    setTimeout(() => {
      setCallState("connected");
      setDialogueStep(1); // First message
    }, 1200);
  };

  const endCall = () => {
    setCallState("ended");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      setCallState("idle");
      setCallSeconds(0);
      setDialogueStep(0);
    }, 1800);
  };

  // Call timer and dialogue progression
  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);

      // Dialogue triggers
      const t1 = setTimeout(() => setDialogueStep(2), 3500); // Caller intent
      const t2 = setTimeout(() => setDialogueStep(3), 6500); // AI Followup & booking

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [callState]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section
      id="dialpad-telefonia"
      className="relative isolate my-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#06080d] p-6 backdrop-blur-2xl sm:p-10 lg:p-12 light:border-[rgb(var(--ink-rgb)/0.12)] light:bg-card/40"
    >
      {/* Background ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-signal/10 blur-[140px]"
      />

      {/* Header */}
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-mono text-cyan-400">
          <PhoneCall className="h-3.5 w-3.5 animate-pulse" />
          <span>
            {isEs
              ? "01.65 · HARDWARE DIALPAD & TELEFONÍA DE VOZ IA"
              : "01.65 · HARDWARE DIALPAD & VOICE AI TELEPHONY"}
          </span>
        </div>

        <h2 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white sm:text-4xl light:text-ink">
          {isEs
            ? "Teclado Interactivo de Telefonía: Tonos DTMF Reales & Agentes Sub-200ms"
            : "Interactive Telephony Keypad: Authentic DTMF Tones & Sub-200ms Agents"}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base light:text-ink/80">
          {isEs
            ? "Probá el sintetizador de tonos DTMF sobre Web Audio API. Marcá cualquier número o elegí una línea de producción para escuchar cómo un agente de voz con WebSockets atiende, califica y agenda turnos en vivo sin pausas robóticas."
            : "Test the DTMF dual-tone synthesizer running on Web Audio API. Dial any number or pick a production line to experience how full-duplex voice agents qualify and book appointments with zero awkward pauses."}
        </p>
      </div>

      {/* Main Workbench Grid */}
      <div className="relative z-10 mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Physical Phone Hardware Dialpad (5 Cols) */}
        <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-2xl sm:p-7 lg:col-span-5">
          {/* OLED Digital Display */}
          <div className="relative rounded-2xl border border-cyan-500/30 bg-black/60 p-4 font-mono shadow-inner">
            <div className="flex items-center justify-between text-[10px] text-cyan-400/60 uppercase tracking-wider">
              <span>SIP TRUNK · WEBRTC OPUS</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
                {callState === "idle"
                  ? "READY"
                  : callState === "calling"
                  ? "CONNECTING..."
                  : callState === "connected"
                  ? "IN CALL"
                  : "DISCONNECTED"}
              </span>
            </div>

            {/* Dialed Number Display */}
            <div className="mt-2.5 flex items-center justify-between">
              <div className="text-xl font-bold text-white tracking-wide truncate sm:text-2xl">
                {dialedNumber || <span className="text-white/20">Ingresá número...</span>}
              </div>
              {dialedNumber && callState === "idle" && (
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="rounded-lg p-1 text-white/40 hover:text-white"
                >
                  <Delete className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* In-Call Duration indicator */}
            {callState === "connected" && (
              <div className="mt-2 flex items-center justify-between text-xs text-signal font-bold border-t border-white/10 pt-2">
                <span>{activePreset.personaName}</span>
                <span>{formatTimer(callSeconds)}</span>
              </div>
            )}
          </div>

          {/* 12-Key DTMF Keypad Grid */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {DTMF_KEYPAD.map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => handleKeyPress(btn.key)}
                className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 active:scale-95 active:bg-cyan-500/20"
              >
                <span className="font-mono text-xl font-bold text-white group-hover:text-cyan-300">
                  {btn.key}
                </span>
                <span className="h-3 text-[10px] font-mono text-white/40 group-hover:text-cyan-400/70">
                  {btn.sublabel}
                </span>
              </button>
            ))}
          </div>

          {/* Action Row: Call Button / End Call Button */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {callState === "idle" || callState === "ended" ? (
              <button
                type="button"
                onClick={startCall}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-signal/50 bg-signal/20 py-4 font-mono text-sm font-bold text-signal shadow-lg transition-all hover:bg-signal/30 active:scale-95"
              >
                <Phone className="h-5 w-5" />
                <span>{isEs ? "Iniciar Llamada IA" : "Start Voice Call"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={endCall}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/50 bg-red-500/20 py-4 font-mono text-sm font-bold text-red-300 shadow-lg transition-all hover:bg-red-500/30 active:scale-95 animate-pulse"
              >
                <PhoneOff className="h-5 w-5" />
                <span>{isEs ? "Finalizar Llamada" : "Hang Up"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Active Call Stream & Preset Lines (7 Cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Preset Lines Quick Selector */}
          <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-xl">
            <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
              {isEs ? "Líneas de Producción Pre-Configuradas:" : "Pre-Configured Production Lines:"}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {TELEPHONY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={callState === "connected" || callState === "calling"}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    activePreset.id === preset.id
                      ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg"
                      : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  } disabled:opacity-50`}
                >
                  <div className="text-xs font-bold text-white">
                    {isEs ? preset.name.es : preset.name.en}
                  </div>
                  <div className="mt-1 text-xs font-mono text-cyan-300">
                    {preset.phoneNumber}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>{preset.personaName}</span>
                    <span className="text-signal">{preset.latencyMs}ms</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Call Console / Transcript Card */}
          <div className="rounded-3xl border border-white/10 bg-[#090d14] p-6 shadow-2xl sm:p-7">
            {/* Header Telemetry */}
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center font-mono text-xs">
              <div className="flex items-center gap-2">
                <Radio className={`h-4 w-4 ${callState === "connected" ? "text-signal animate-pulse" : "text-white/30"}`} />
                <span className="text-white font-semibold">{activePreset.personaName}</span>
                <span className="text-white/40">· {activePreset.ttsEngine}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 text-signal font-bold">
                  {activePreset.latencyMs}ms Latencia TTFT
                </span>
              </div>
            </div>

            {/* Audio Waveform Oscilloscope */}
            <div className="my-5 flex items-center justify-center gap-1.5 h-12 rounded-xl bg-black/40 border border-white/5 p-3">
              {[12, 28, 16, 36, 48, 24, 38, 18, 44, 22, 34, 15, 42, 26, 14, 30].map((height, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: callState === "connected" ? [height * 0.4, height, height * 0.5] : 6,
                    backgroundColor: callState === "connected" ? (i % 2 === 0 ? "#71F3A2" : "#55D8FF") : "#ffffff20",
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8 + (i % 4) * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 rounded-full"
                />
              ))}
            </div>

            {/* Live Transcript Turns */}
            <div className="space-y-3 font-mono text-xs">
              {callState === "idle" && (
                <div className="text-center py-6 text-white/40">
                  {isEs
                    ? "Presioná 'Iniciar Llamada IA' o marcá un número en el dialpad para conectar la sesión WebRTC."
                    : "Press 'Start Voice Call' or dial a number on the keypad to connect the WebRTC session."}
                </div>
              )}

              {callState === "calling" && (
                <div className="flex items-center justify-center gap-2 py-6 text-cyan-400 font-bold animate-pulse">
                  <Activity className="h-4 w-4 animate-spin" />
                  <span>{isEs ? "Conectando SIP Trunk a Cartesia Audio Stream..." : "Bridging SIP Trunk to Cartesia Audio Stream..."}</span>
                </div>
              )}

              {/* Turn 1: AI Greeting */}
              {dialogueStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-signal/30 bg-signal/[0.04] p-4"
                >
                  <div className="flex items-center justify-between text-[11px] text-signal font-bold mb-1">
                    <span>{activePreset.personaName} (Operador IA)</span>
                    <span className="text-white/40">{activePreset.latencyMs}ms</span>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    "{isEs ? activePreset.firstMessage.es : activePreset.firstMessage.en}"
                  </p>
                </motion.div>
              )}

              {/* Turn 2: Caller Intent */}
              {dialogueStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.04] p-4 text-right"
                >
                  <div className="text-[11px] text-cyan-300 font-bold mb-1">
                    {isEs ? "Vos (Cliente Llamador)" : "You (Caller)"}
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    "{isEs ? activePreset.callerIntent.es : activePreset.callerIntent.en}"
                  </p>
                </motion.div>
              )}

              {/* Turn 3: AI Followup & Action */}
              {dialogueStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-signal/30 bg-signal/[0.04] p-4"
                >
                  <div className="flex items-center justify-between text-[11px] text-signal font-bold mb-1">
                    <span>{activePreset.personaName} (Operador IA)</span>
                    <span className="text-white/40">205ms</span>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    "{isEs ? activePreset.aiFollowup.es : activePreset.aiFollowup.en}"
                  </p>

                  {/* Intercepted CRM Event Badge */}
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-signal/40 bg-signal/15 p-2.5 text-[11px] text-signal font-bold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{isEs ? activePreset.crmAction.es : activePreset.crmAction.en}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="mt-6 border-t border-white/10 pt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <span className="text-xs font-mono text-white/50">
                {isEs
                  ? "¿Querés desplegar telefonía de voz con IA en tu negocio?"
                  : "Want to deploy voice AI telephony for your business?"}
              </span>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
                  isEs
                    ? `Hola Mario, probé tu dialpad de telefonía IA (${activePreset.name.es}). Quiero cotizar un agente de voz con este estándar sub-200ms para mi empresa.`
                    : `Hi Mario, I tested your voice AI dialpad (${activePreset.name.en}). I want to quote a voice agent with this sub-200ms standard for my company.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-signal/50 bg-signal/20 px-4 py-2.5 text-xs font-mono font-bold text-signal transition-all hover:bg-signal/30 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isEs ? "Cotizar Telefonía de Voz" : "Quote Voice Telephony"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
