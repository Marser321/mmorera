"use client";

import { MonogramaFundido } from "@/components/marca/MonogramaFundido";
import { useLanguage } from "@/context/LanguageContext";

const copy = {
  es: {
    eyebrow: "Cómo trabajo",
    title: "Hablas conmigo y lo construyo yo.",
    body: "Las cuentas y los accesos quedan a tu nombre. Te entrego el sistema documentado y explicado. Si algo falla, me escribes a mí.",
    steps: [
      { title: "Diagnóstico", body: "Entiendo cómo trabajas hoy y dónde se pierde tiempo. Acordamos qué conviene construir primero, y qué no." },
      { title: "Construcción", body: "Diseño, programo y conecto las piezas. Ves avances reales durante el trabajo." },
      { title: "Traspaso y mantenimiento", body: "Te dejo el sistema funcionando, con las cuentas a tu nombre. Si quieres, sigo a cargo del mantenimiento." },
    ],
  },
  en: {
    eyebrow: "How I work",
    title: "You talk to me, and I build it.",
    body: "Accounts and access stay in your name. You get the system documented and explained. If something breaks, you write to me.",
    steps: [
      { title: "Diagnosis", body: "I learn how you work today and where time gets lost. We agree on what to build first, and what not to." },
      { title: "Build", body: "I design, build and connect the pieces. You see real progress along the way." },
      { title: "Handover and maintenance", body: "I hand over a working system, with accounts in your name. If you want, I stay on for maintenance." },
    ],
  },
};

export function HowIWorkSection() {
  const { language } = useLanguage();
  const c = copy[language];

  return (
    <section id="perfil" aria-labelledby="how-i-work-title" className="relative scroll-mt-20 overflow-x-clip border-t border-foreground/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_2fr] lg:gap-20">
          {/* Una firma estática acompaña la lectura, también con movimiento reducido. */}
          <MonogramaFundido fundido="diagonal" className="mx-auto w-36 sm:w-52 md:w-full md:max-w-80" />
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[.16em] text-signal">{c.eyebrow}</p>
            <h2 id="how-i-work-title" className="mt-3 text-[clamp(2.2rem,4.5vw,4.2rem)] font-medium leading-[1.04] tracking-[-.04em] text-foreground">{c.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">{c.body}</p>
            {/* proofLink se habilita cuando exista el caso de T10. */}
          </div>
        </div>
        <ol className="mt-12 grid gap-8 border-t border-foreground/15 pt-8 md:mt-16 md:grid-cols-3 md:gap-10">
          {c.steps.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true" className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-xl font-medium text-foreground">{step.title}</h3>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-foreground/75 sm:text-base">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
