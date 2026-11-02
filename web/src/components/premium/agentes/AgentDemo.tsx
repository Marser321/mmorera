"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, UserRound } from "lucide-react";
import { AGENT_DEMO_SCRIPT } from "@/data/agentDemoScript";
import type { LocalizedText } from "@/types/site";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

type Message = { id: number; from: "agent" | "visitor" | "system"; text: LocalizedText };

const LABELS = {
  es: { log: "Conversación de ejemplo", agent: "Asistente", you: "Tú", pick: "Elige una pregunta", restart: "Volver a empezar", done: "Ya probaste todas las preguntas." },
  en: { log: "Sample conversation", agent: "Assistant", you: "You", pick: "Pick a question", restart: "Start over", done: "You've tried every question." },
};

/** Pausa antes de cada mensaje del agente: el tiempo de «escribir». */
const REPLY_DELAY_MS = 900;

/**
 * Demo guiada del agente (T32, D6 versión 1): el visitante elige una pregunta
 * y el agente contesta con respuestas escritas de antemano. No hay modelo ni
 * red detrás. Muestra las tres conductas que se venden: responder con los
 * datos del negocio, reconocer lo que no sabe y pasar a una persona.
 */
export function AgentDemo({ language }: { language: "es" | "en" }) {
  const script = AGENT_DEMO_SCRIPT;
  const l = LABELS[language];
  const reducedMotion = useReducedMotionSafe() === true;
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "agent", text: script.greeting }]);
  const [asked, setAsked] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [handedOff, setHandedOff] = useState(false);
  const timersRef = useRef<number[]>([]);
  const nextIdRef = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // La conversación baja sola dentro de su ventana, sin mover la página.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, typing]);

  const push = (from: Message["from"], text: LocalizedText) => {
    const id = nextIdRef.current++;
    setMessages((current) => [...current, { id, from, text }]);
  };

  const ask = (optionId: string) => {
    const option = script.options.find((item) => item.id === optionId);
    if (!option || typing || handedOff) return;
    setAsked((current) => [...current, option.id]);
    push("visitor", option.question);
    const replies: Message[] = option.answer.map((text) => ({ id: 0, from: "agent", text }));
    if (option.handoff) replies.push({ id: 0, from: "system", text: script.handoffNotice });
    if (reducedMotion) {
      replies.forEach((reply) => push(reply.from, reply.text));
      if (option.handoff) setHandedOff(true);
      return;
    }
    setTyping(true);
    replies.forEach((reply, index) => {
      timersRef.current.push(window.setTimeout(() => {
        push(reply.from, reply.text);
        if (index === replies.length - 1) {
          setTyping(false);
          if (option.handoff) setHandedOff(true);
        }
      }, REPLY_DELAY_MS * (index + 1)));
    });
  };

  const restart = () => {
    clearTimers();
    nextIdRef.current = 1;
    setMessages([{ id: 0, from: "agent", text: script.greeting }]);
    setAsked([]);
    setTyping(false);
    setHandedOff(false);
  };

  const pending = script.options.filter((option) => !asked.includes(option.id));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
      <div className="overflow-hidden rounded-3xl border border-foreground/15 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal" />
            {script.business[language]}
          </p>
          <p className="rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-foreground/65">{script.disclaimer[language]}</p>
        </div>

        <div ref={logRef} role="log" aria-label={l.log} className="flex h-[22rem] flex-col gap-3 overflow-y-auto px-5 py-5 sm:h-[26rem]">
          {messages.map((message) => message.from === "system" ? (
            <p key={message.id} className="mx-auto flex max-w-[90%] items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-4 py-2 text-center text-xs text-signal">
              <UserRound aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              {message.text[language]}
            </p>
          ) : (
            <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.from === "agent" ? "self-start border border-foreground/10 bg-foreground/[.05] text-foreground" : "self-end bg-signal/15 text-foreground"}`}>
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[.12em] text-foreground/55">{message.from === "agent" ? l.agent : l.you}</span>
              {message.text[language]}
            </div>
          ))}
          {typing && (
            <div aria-hidden="true" className="flex gap-1 self-start rounded-2xl border border-foreground/10 bg-foreground/[.05] px-4 py-3">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/50" style={{ animationDelay: `${dot * 150}ms` }} />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-foreground/10 px-5 py-4">
          {!handedOff && pending.length > 0 && (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[.14em] text-foreground/55">{l.pick}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {pending.map((option) => (
                  <li key={option.id}>
                    <button type="button" onClick={() => ask(option.id)} disabled={typing} className="min-h-11 rounded-full border border-foreground/20 px-4 py-2 text-left text-sm text-foreground/85 transition-colors hover:border-signal/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-50">
                      {option.question[language]}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!handedOff && pending.length === 0 && <p className="text-sm text-foreground/70">{l.done}</p>}
          {(asked.length > 0 || handedOff) && (
            <button type="button" onClick={restart} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              {l.restart}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
