"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DECISION_TOPICS } from "@/data/solutionsData";
import { Check, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function DecisionHubSection() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  const currentTopic = DECISION_TOPICS[activeTopicIndex] ?? DECISION_TOPICS[0];

  return (
    <section id="criterio" className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)]">
      <div className="mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_#71F3A2]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              {isEs ? "Centro de Criterio & Estrategia" : "Strategic Decision Hub"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={isEs ? "Criterio antes de gastar un dólar en tecnología." : "Taste and strategy before spending a dollar on tech."}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Los blogs tradicionales están muertos. Lo que necesitás son respuestas honestas a las decisiones que definen si un sistema funciona o si tu equipo lo termina abandonando."
              : "Traditional blogs are dead. What you actually need is direct, honest guidance on the decisions that make or break your software adoption."}
          </Reveal>
        </div>

        {/* Selector de Dilemas */}
        <div className="mt-10 flex flex-wrap gap-3">
          {DECISION_TOPICS.map((topic, idx) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveTopicIndex(idx)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                activeTopicIndex === idx
                  ? "bg-foreground text-background shadow-lg"
                  : "border border-white/12 bg-card/60 text-foreground/70 hover:border-white/25 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.12)]"
              }`}
            >
              {topic.category[language]}
            </button>
          ))}
        </div>

        {/* Tarjeta del Dilema Activo */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-card/70 p-6 sm:p-10 backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90">
          <div className="flex items-start gap-4">
            <HelpCircle className="h-6 w-6 text-signal shrink-0 mt-1" />
            <div>
              <h3 className="text-xl sm:text-3xl font-medium tracking-tight text-foreground">
                {currentTopic.question[language]}
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-foreground/65 max-w-3xl">
                {currentTopic.summary[language]}
              </p>
            </div>
          </div>

          {/* Opciones comparadas */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {currentTopic.options.map((option, oIdx) => (
              <div
                key={oIdx}
                className="flex flex-col justify-between rounded-2xl border border-white/8 bg-background/70 p-6 sm:p-7 transition-colors hover:border-white/20 light:border-[rgb(var(--ink-rgb)/0.08)] light:bg-background/90"
              >
                <div>
                  <span className="inline-block rounded-full bg-signal/10 border border-signal/30 px-3 py-1 font-mono text-[10px] text-signal font-semibold uppercase tracking-wider mb-4">
                    {option.badge[language]}
                  </span>
                  <h4 className="text-lg sm:text-xl font-medium text-foreground">
                    {option.title[language]}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-foreground/60">
                    {option.subtitle[language]}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {option.pros.map((pro, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80">
                        <Check className="h-4 w-4 shrink-0 text-signal mt-0.5" />
                        <span>{pro[language]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-white/8 pt-5 space-y-3 text-xs light:border-[rgb(var(--ink-rgb)/0.08)]">
                  <div>
                    <span className="font-semibold text-foreground/80 uppercase tracking-wider font-mono text-[10px] block mb-1">
                      {isEs ? "Cuándo elegirlo:" : "When to choose:"}
                    </span>
                    <p className="text-foreground/60 leading-relaxed">{option.whenToChoose[language]}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/80 uppercase tracking-wider font-mono text-[10px] block mb-1">
                      {isEs ? "Recomendado para:" : "Recommended for:"}
                    </span>
                    <p className="text-signal/90 font-medium">{option.recommendedFor[language]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Expert Insight de Mario */}
          <div className="mt-10 rounded-2xl border border-signal/30 bg-signal/[0.06] p-5 sm:p-6 flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-signal shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-signal mb-1">
                {isEs ? "Criterio de Mario Morera" : "Mario Morera's Take"}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-foreground/85">
                {currentTopic.expertInsight[language]}
              </p>
            </div>
          </div>
        </div>

        {/* CTA a conversar caso particular */}
        <div className="mt-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <p className="text-xs sm:text-sm text-foreground/60">
            {isEs ? "¿Tenés dudas de cuál es el enfoque exacto para tu caso?" : "Unsure about the exact approach for your specific setup?"}
          </p>
          <a
            href="https://wa.me/59892323675?text=Hola%20Mario,%20estoy%20viendo%20tu%20sitio%20y%20quiero%20hacerte%20una%20consulta%20técnica"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-5 py-2 text-xs font-semibold text-signal transition-colors hover:bg-signal/20 shrink-0"
          >
            {isEs ? "Consultame por WhatsApp sin compromiso" : "Ask me on WhatsApp without commitment"}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
