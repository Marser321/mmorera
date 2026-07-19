import type { Metadata } from "next";
import { AplicarOS } from "@/components/portfolio-isolated/AplicarOS";
import { SITE_IDENTITY } from "@/config/site";
export const metadata: Metadata = {
  title: "Tell me what you want to move",
  description: "Three steps to understand the context and reply with the most useful next step.",
  alternates: {
    canonical: "/en/aplicar",
    languages: { es: "/aplicar", en: "/en/aplicar" },
  },
};
export default function EnglishApplicationPage() {
  return (
    <main
      id="contenido-principal"
      className="min-h-screen bg-transparent px-5 pb-24 pt-36 sm:px-8 sm:pt-44 lg:px-12"
    >
      <header className="mx-auto grid max-w-[1180px] gap-8 border-b border-white/10 pb-10 light:border-[rgb(var(--ink-rgb)/0.1)] md:grid-cols-[1.2fr_.8fr] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-signal">
            Brief · 03 steps
          </p>
          <h1 className="mt-5 text-[clamp(3.2rem,7vw,6.5rem)] font-medium leading-[.91] tracking-[-.065em] text-foreground">
            Tell me what you want to move.
          </h1>
        </div>
        <p className="max-w-xl text-lg leading-7 text-foreground/55 md:justify-self-end">
          Three steps. Enough context to understand the project and reply with judgment.
        </p>
      </header>
      <AplicarOS />
      <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-5 border-t border-white/10 pt-7 light:border-[rgb(var(--ink-rgb)/0.1)] text-sm text-foreground/48">
        <span className="font-mono text-[9px] uppercase tracking-[.15em]">
          Direct channels
        </span>
        <div className="flex flex-wrap gap-5">
          <a href={`mailto:${SITE_IDENTITY.contact.email}`}>Email</a>
          <a
            href={SITE_IDENTITY.contact.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a href="/en/privacidad">Privacy</a>
        </div>
      </div>
    </main>
  );
}
