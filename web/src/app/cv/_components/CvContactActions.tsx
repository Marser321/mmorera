"use client";

import { useRef, useState } from "react";

const copy = {
  es: {
    email: "Escribirme", copy: "Copiar correo", copied: "Correo copiado",
    selected: "El correo quedó seleccionado: cópialo con Ctrl+C (Cmd+C en Mac).",
  },
  en: {
    email: "Email me", copy: "Copy email", copied: "Email copied",
    selected: "The email is selected: copy it with Ctrl+C (Cmd+C on Mac).",
  },
};

export function CvContactActions({ email, language }: { email: string; language: "es" | "en" }) {
  const [status, setStatus] = useState<"idle" | "copied" | "selected">("idle");
  const emailRef = useRef<HTMLParagraphElement>(null);
  const c = copy[language];

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      const element = emailRef.current;
      if (element) {
        element.focus();
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus("selected");
    }
  }

  return <div className="mt-6">
    <p ref={emailRef} tabIndex={-1} className="select-text break-all text-base text-foreground/80">{email}</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <a href={`mailto:${email}`} className="inline-flex min-h-12 items-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.email}</a>
      <button type="button" onClick={copyEmail} className="inline-flex min-h-12 items-center rounded-full border border-foreground/25 px-6 py-3 text-sm font-semibold text-foreground hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.copy}</button>
    </div>
    <p id="cv-copy-feedback" aria-live="polite" aria-atomic="true" className="mt-3 min-h-6 text-sm leading-relaxed text-foreground/75">{status === "copied" ? c.copied : status === "selected" ? c.selected : ""}</p>
  </div>;
}
