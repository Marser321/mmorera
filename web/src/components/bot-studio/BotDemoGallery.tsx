"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Building2,
  CalendarDays,
  FileCheck2,
  LoaderCircle,
  Megaphone,
  Send,
  RotateCcw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import {
  BOT_DEMOS,
  getBotDemo,
  getBotReply,
  type BotDemoId,
  type DemoLanguage,
} from "@/data/botDemos";

const ICONS = {
  agency: Megaphone,
  "real-estate": Building2,
  appointments: CalendarDays,
  insurance: ShieldCheck,
  paperwork: FileCheck2,
} satisfies Record<BotDemoId, typeof Megaphone>;

interface ChatLine {
  id: string;
  speaker: "visitor" | "assistant";
  text: string;
}

function openingLine(demoId: BotDemoId, language: DemoLanguage): ChatLine {
  return { id: "opening", speaker: "assistant", text: getBotDemo(demoId).opening[language] };
}

export function BotDemoGallery() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<BotDemoId>("agency");
  const [lines, setLines] = useState<ChatLine[]>(() => [openingLine("agency", language)]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [guidedOnly, setGuidedOnly] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);
  const activeDemo = getBotDemo(activeId);

  useEffect(() => {
    if (lines.length <= 1) return;
    const conversation = conversationRef.current;
    conversation?.scrollTo({ top: conversation.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [lines, reduceMotion]);

  function selectDemo(nextId: BotDemoId) {
    setDraft("");
    setGuidedOnly(false);
    setActiveId(nextId);
    setLines([openingLine(nextId, language)]);
  }

  async function sendMessage(rawText: string) {
    const content = rawText.trim();
    if (!content || pending || content.length > 600 || guidedOnly) return;
    const prior = lines.filter((line) => line.id !== "opening");
    const nextLines = [...prior, { id: `visitor-${Date.now()}`, speaker: "visitor" as const, text: content }];
    setPending(true);
    setDraft("");
    setLines((current) => [...current, { id: `visitor-${Date.now()}`, speaker: "visitor", text: content }]);
    try {
      const response = await fetch("/api/bot-studio/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          demoId: activeId,
          language,
          messages: nextLines.map((line) => ({
            role: line.speaker === "visitor" ? "user" : "assistant",
            content: line.text,
          })),
        }),
      });
      const payload = await response.json() as { message?: string };
      if (!payload.message) throw new Error("empty response");
      setLines((current) => [...current, { id: `assistant-${Date.now()}`, speaker: "assistant", text: payload.message! }]);
      if (!response.ok) setGuidedOnly(true);
    } catch {
      setGuidedOnly(true);
      setLines((current) => [...current, {
        id: `assistant-${Date.now()}`,
        speaker: "assistant",
        text: isEs
          ? "El chat gratuito no está disponible ahora. Puedes continuar con el recorrido guiado de muestra."
          : "The free chat is unavailable right now. You can continue with the guided sample.",
      }]);
    } finally {
      setPending(false);
    }
  }

  function chooseGuidedPrompt(promptId: string) {
    const prompt = activeDemo.prompts.find((item) => item.id === promptId);
    if (!prompt) return;
    const position = lines.length;
    setGuidedOnly(true);
    setLines((current) => [
      ...current,
      { id: `visitor-${position}`, speaker: "visitor", text: prompt.label[language] },
      { id: `assistant-${position}`, speaker: "assistant", text: getBotReply(activeId, promptId, language) },
    ]);
  }

  function resetConversation() {
    setDraft("");
    setGuidedOnly(false);
    setLines([openingLine(activeId, language)]);
  }

  return (
    <main id="contenido-principal" className="bg-transparent pb-28 pt-32 sm:pt-40">
      <section className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1480px]">
          <div className="max-w-[1060px] border-b border-white/12 pb-10 light:border-[rgb(var(--ink-rgb)/0.12)] lg:pb-14">
            <div className="max-w-5xl">
              <h1 className="max-w-5xl text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[.91] tracking-[-.065em] text-foreground">
                {isEs ? "Un asistente distinto para cada negocio." : "A different assistant for every business."}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
                {isEs
                  ? "Explora cinco recorridos. Cada uno entiende su rubro, respeta sus límites y sabe cuándo pasar la conversación a una persona."
                  : "Explore five journeys. Each one understands its industry, respects its limits, and knows when to hand the conversation to a person."}
              </p>
            </div>
            <div className="mt-6 flex max-w-2xl items-center gap-3 border-t border-white/12 pt-4 text-sm leading-6 text-foreground/75 light:border-[rgb(var(--ink-rgb)/0.12)]">
              <Bot className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
              <p>
                {isEs
                  ? "Habla libremente con un perfil ficticio. No se crea una cuenta, no se guardan mensajes y no hay herramientas ni datos reales conectados."
                  : "Chat freely with a fictional profile. No account is created, messages are not saved, and no tools or real data are connected."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-labelledby="demo-heading">
        <div className="mx-auto max-w-[1480px]">
          <h2 id="demo-heading" className="sr-only">
            {isEs ? "Elige un tipo de negocio" : "Choose a business type"}
          </h2>
          <div className="grid gap-8 xl:grid-cols-[minmax(230px,.34fr)_minmax(0,1fr)] xl:gap-12">
            <nav aria-label={isEs ? "Tipos de negocio" : "Business types"} className="flex gap-2 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible xl:pb-0">
              {BOT_DEMOS.map((demo) => {
                const Icon = ICONS[demo.id];
                const selected = activeId === demo.id;
                return (
                  <button
                    key={demo.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectDemo(demo.id)}
                    className={`group flex min-w-[185px] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal xl:min-w-0 ${
                      selected
                        ? "border-foreground/35 bg-card text-foreground"
                        : "border-white/10 bg-transparent text-foreground/65 hover:border-white/25 hover:bg-card/60 light:border-[rgb(var(--ink-rgb)/0.12)] light:hover:border-[rgb(var(--ink-rgb)/0.28)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: selected ? demo.accent : undefined }} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{demo.name[language]}</span>
                      <span className="mt-0.5 block truncate text-xs text-foreground/50">{demo.description[language]}</span>
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/12 bg-card/65 light:border-[rgb(var(--ink-rgb)/0.14)] light:bg-card">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7 light:border-[rgb(var(--ink-rgb)/0.1)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-signal light:bg-[rgb(var(--ink-rgb)/0.06)]">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{activeDemo.name[language]}</h3>
                    <p className="mt-0.5 text-xs text-foreground/55">{guidedOnly ? (isEs ? "Recorrido guiado" : "Guided sample") : (isEs ? "Respuesta con modelo gratuito" : "Free-model response")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 text-xs text-foreground/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    {guidedOnly ? (isEs ? "Muestra" : "Sample") : "OpenRouter · free"}
                  </span>
                  <button
                    type="button"
                    onClick={resetConversation}
                    className="inline-flex items-center gap-1.5 rounded-md py-1 text-xs text-foreground/60 underline decoration-foreground/25 underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    {isEs ? "Reiniciar" : "Restart"}
                  </button>
                </div>
              </div>

              <div className="grid min-h-[500px] lg:grid-cols-[minmax(0,1fr)_minmax(245px,.72fr)]">
                <div className="flex min-h-[430px] flex-col border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r light:border-[rgb(var(--ink-rgb)/0.1)]">
                  <div ref={conversationRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1" aria-live="polite" aria-relevant="additions text" aria-busy={pending}>
                    {lines.map((line) => {
                      const isAssistant = line.speaker === "assistant";
                      return (
                        <motion.div
                          key={line.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                        >
                          <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${isAssistant ? "rounded-bl-md bg-background text-foreground/85 light:bg-[rgb(var(--ink-rgb)/0.055)]" : "rounded-br-md bg-foreground text-background"}`}>
                            {line.text}
                          </div>
                        </motion.div>
                      );
                    })}
                    {pending && (
                      <div className="flex items-center gap-2 text-xs text-foreground/55" role="status">
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        {isEs ? "Preparando una respuesta…" : "Preparing a reply…"}
                      </div>
                    )}
                  </div>
                  <form
                    className="mt-5 border-t border-white/10 pt-4 light:border-[rgb(var(--ink-rgb)/0.1)]"
                    onSubmit={(event) => { event.preventDefault(); void sendMessage(draft); }}
                  >
                    <label htmlFor="bot-demo-message" className="sr-only">{isEs ? "Escribe un mensaje" : "Write a message"}</label>
                    <div className="flex items-end gap-2 rounded-xl border border-white/15 bg-background p-2 focus-within:ring-2 focus-within:ring-signal light:border-[rgb(var(--ink-rgb)/0.14)] light:bg-[rgb(var(--ink-rgb)/0.035)]">
                      <textarea
                        id="bot-demo-message"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value.slice(0, 600))}
                        maxLength={600}
                        rows={2}
                        disabled={pending || guidedOnly}
                        placeholder={isEs ? "Escribe tu pregunta…" : "Write your question…"}
                        className="min-h-12 flex-1 resize-y bg-transparent px-2 py-1.5 text-sm leading-5 text-foreground outline-none placeholder:text-foreground/40 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={pending || guidedOnly || !draft.trim()}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                        aria-label={isEs ? "Enviar mensaje" : "Send message"}
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-2 flex justify-between gap-3 text-[11px] leading-4 text-foreground/45">
                      <span>{isEs ? "No incluyas datos personales. Un proveedor gratuito procesa el texto." : "Leave out personal data. A free provider processes the text."}</span>
                      <span className="shrink-0">{draft.length}/600</span>
                    </div>
                    {guidedOnly && (
                      <button
                        type="button"
                        onClick={resetConversation}
                        className="mt-3 text-xs text-foreground/65 underline decoration-foreground/25 underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                      >
                        {isEs ? "Reiniciar chat en vivo" : "Restart live chat"}
                      </button>
                    )}
                  </form>
                  <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-foreground/50 light:border-[rgb(var(--ink-rgb)/0.1)]">
                    {isEs ? "El recorrido vive solo en esta pestaña. Al reiniciar o salir, desaparece." : "This journey lives only in this tab. It disappears when you restart or leave."}
                  </p>
                </div>

                <div className="flex flex-col justify-between p-5 sm:p-7">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isEs ? "¿Qué quieres explorar?" : "What would you like to explore?"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-foreground/55">
                      {isEs ? "Inicia el chat con un ejemplo." : "Start the chat with an example."}
                    </p>
                    <div className="mt-5 space-y-2.5">
                      {activeDemo.prompts.map((prompt) => (
                        <button
                          key={prompt.id}
                          type="button"
                          onClick={() => guidedOnly ? chooseGuidedPrompt(prompt.id) : void sendMessage(prompt.label[language])}
                          disabled={pending}
                          className="group flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 px-3.5 py-3 text-left text-sm leading-5 text-foreground/75 transition-colors hover:border-white/25 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.12)] light:hover:border-[rgb(var(--ink-rgb)/0.25)] light:hover:bg-[rgb(var(--ink-rgb)/0.04)]"
                        >
                          <span>{prompt.label[language]}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 border-t border-white/10 pt-4 light:border-[rgb(var(--ink-rgb)/0.1)]">
                      <p className="text-xs leading-5 text-foreground/55">
                        {isEs ? "Si el modelo gratuito no responde, el chat muestra el estado y puedes seguir con estas respuestas guiadas." : "If the free model is unavailable, the chat shows its status and you can continue with these guided replies."}
                      </p>
                      {!guidedOnly && (
                        <button
                          type="button"
                          onClick={() => setGuidedOnly(true)}
                          className="mt-2 text-xs text-foreground/65 underline decoration-foreground/25 underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                        >
                          {isEs ? "Abrir recorrido guiado" : "Open guided sample"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-7 flex items-start gap-3 border-t border-white/10 pt-5 light:border-[rgb(var(--ink-rgb)/0.1)]">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                    <p className="text-xs leading-5 text-foreground/55">
                      {isEs
                        ? "Las consultas de seguros y trámites se mantienen en información general ficticia. No determinan qué debes hacer."
                        : "Insurance and paperwork examples stay general and fictional. They do not determine what you should do."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.12)]" aria-labelledby="architecture-heading">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <h2 id="architecture-heading" className="max-w-xl text-3xl font-medium leading-tight tracking-[-.04em] text-foreground sm:text-4xl">
                {isEs ? "Una metodología. Herramientas según el trabajo." : "One method. Tools chosen for the work."}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
              {isEs
                ? "El flujo y los permisos ponen los límites; el modelo interpreta y redacta dentro de ellos. Cada negocio conserva sus propias fuentes y reglas."
                : "The workflow and permissions set the limits; the model interprets and writes within them. Each business keeps its own sources and rules."}
            </p>
          </div>

          <div className="mt-10 grid gap-0 border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] light:md:divide-[rgb(var(--ink-rgb)/0.1)]">
            <article className="py-6 md:pr-7">
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-signal">{isEs ? "Para una experiencia web propia" : "For a custom web experience"}</p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">Next.js + Vercel AI SDK</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                {isEs
                  ? "Da control sobre el recorrido, la interfaz y la lógica del sitio. La persistencia y los permisos siguen siendo decisiones explícitas de la aplicación."
                  : "Keeps control of the journey, interface, and site logic. Persistence and permissions remain explicit application decisions."}
              </p>
              <a className="mt-4 inline-flex items-center gap-1.5 text-xs text-foreground/65 underline decoration-foreground/25 underline-offset-4 hover:text-foreground" href="https://ai-sdk.dev/docs/agents/workflows" target="_blank" rel="noreferrer">
                {isEs ? "Ver patrones de flujo" : "See workflow patterns"}<ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </article>
            <article className="border-t border-white/10 py-6 md:px-7 md:border-t-0 light:border-[rgb(var(--ink-rgb)/0.1)]">
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-signal">{isEs ? "Para conectar servicios" : "For connecting services"}</p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">n8n</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                {isEs
                  ? "Encaja cuando el valor principal está en coordinar APIs, eventos y tareas entre herramientas. Se evaluará cuando definamos integraciones reales."
                  : "Fits when the main value is coordinating APIs, events, and tasks across tools. We’ll evaluate it when real integrations are defined."}
              </p>
              <a className="mt-4 inline-flex items-center gap-1.5 text-xs text-foreground/65 underline decoration-foreground/25 underline-offset-4 hover:text-foreground" href="https://docs.n8n.io/build/integrate-ai/" target="_blank" rel="noreferrer">
                {isEs ? "Ver IA en n8n" : "See AI in n8n"}<ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </article>
            <article className="border-t border-white/10 py-6 md:pl-7 md:border-t-0 light:border-[rgb(var(--ink-rgb)/0.1)]">
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-signal">{isEs ? "Para configurar en un estudio" : "For studio-based configuration"}</p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">Botpress</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                {isEs
                  ? "Aporta un estudio conversacional y componentes para conocimiento. Conviene comparar control, operación y dependencia de plataforma antes de elegirlo."
                  : "Provides a conversational studio and knowledge components. Compare control, operations, and platform dependency before choosing it."}
              </p>
              <a className="mt-4 inline-flex items-center gap-1.5 text-xs text-foreground/65 underline decoration-foreground/25 underline-offset-4 hover:text-foreground" href="https://botpress.com/docs/studio/concepts/agents/knowledge-agent/" target="_blank" rel="noreferrer">
                {isEs ? "Ver agente de conocimiento" : "See the Knowledge Agent"}<ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </article>
          </div>

          <div className="mt-8 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between light:border-[rgb(var(--ink-rgb)/0.1)]">
            <div className="flex items-start gap-3">
              <Workflow className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
              <p className="max-w-3xl text-sm leading-6 text-foreground/60">
                {isEs
                  ? "Para el primer bot real de MMORERA, la hipótesis de trabajo es una web propia con flujo determinista y un modelo acotado. n8n queda como complemento si hacen falta integraciones. Hermes es el taller de desarrollo, no un CRM."
                  : "For MMORERA’s first real bot, the working hypothesis is a custom website with deterministic flow and a constrained model. n8n remains an integration option. Hermes is the development studio, not a CRM."}
              </p>
            </div>
            <Link href={localePath(language, "/aplicar")} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
              {isEs ? "Consultar un proyecto" : "Discuss a project"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-foreground/45">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {isEs
              ? "Las demos no envían mensajes, reservan, cotizan ni capturan datos. El texto del chat se procesa en OpenRouter con un modelo gratuito y no se guarda en esta web."
              : "The demos do not send messages, book appointments, quote, or collect data. Chat text is processed by OpenRouter with a free model and is not stored by this site."}
          </p>
        </div>
      </section>
    </main>
  );
}
