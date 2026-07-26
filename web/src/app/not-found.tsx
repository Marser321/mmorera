"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const COPY = {
  es: {
    eyebrow: "Error 404",
    title: "Esta ruta no llegó a compilar.",
    body: "La página no existe o cambió de lugar.",
    cta: "Volver al inicio",
    href: "/",
  },
  en: {
    eyebrow: "Error 404",
    title: "This route never made it to build.",
    body: "The page doesn't exist or it moved somewhere else.",
    cta: "Back to home",
    href: "/en",
  },
} as const;

export default function NotFound() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <main
      id="contenido-principal"
      className="flex min-h-screen items-center bg-background px-5 pt-24 text-foreground sm:px-8 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-track-create">
          {copy.eyebrow}
        </p>
        <h1 className="mt-5 max-w-5xl text-[clamp(4rem,12vw,12rem)] font-medium leading-[.82] tracking-[-.08em]">
          {copy.title}
        </h1>
        <p className="mt-8 max-w-md text-lg leading-7 text-foreground/52">{copy.body}</p>
        <Link
          href={copy.href}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm light:border-[rgb(var(--ink-rgb)/0.15)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.cta}
        </Link>
      </div>
    </main>
  );
}
