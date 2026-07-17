import type { Metadata } from "next";
import { AplicarOS } from "@/components/portfolio-isolated/AplicarOS";
import { SITE_IDENTITY } from "@/config/site";
export const metadata: Metadata = {
  title: "Tell me about your project",
  description:
    "A short brief to understand the context, challenge and most useful next step.",
  alternates: {
    canonical: "/en/aplicar",
    languages: { "es-UY": "/aplicar", en: "/en/aplicar" },
  },
};
export default function EnglishApplicationPage() {
  return (
    <main
      id="contenido-principal"
      className="min-h-screen bg-transparent px-5 pb-24 pt-36 sm:px-8 sm:pt-44 lg:px-12"
    >
      <header className="mx-auto grid max-w-[1180px] gap-8 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_.8fr] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#71F3A2]">
            Brief · 04 steps
          </p>
          <h1 className="mt-5 text-[clamp(3.2rem,7vw,6.5rem)] font-medium leading-[.91] tracking-[-.065em] text-[#F3F0E8]">
            Tell me about your project.
          </h1>
        </div>
        <p className="max-w-xl text-lg leading-7 text-[#F3F0E8]/55 md:justify-self-end">
          Context, challenge and timing. I use this information only to evaluate
          fit and reply.
        </p>
      </header>
      <AplicarOS />
      <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-5 border-t border-white/10 pt-7 text-sm text-[#F3F0E8]/48">
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
