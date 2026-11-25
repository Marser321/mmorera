"use client";

import { MessageCircle, RotateCw } from "lucide-react";
import { AvisoPropuesta } from "@/components/propuesta/AvisoPropuesta";
import { SITE_IDENTITY } from "@/config/site";

/* n8n no respondió y no había copia guardada: se puede reintentar o escribir. */
export default function PropuestaConError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const whatsapp = `${SITE_IDENTITY.contact.whatsapp}?text=${encodeURIComponent("Hola Mario, quise abrir la propuesta y no cargó.")}`;
  return (
    <AvisoPropuesta
      rotulo="Mario Morera · Propuesta"
      titulo="La propuesta no cargó."
      texto="Fue un problema de este lado, no del enlace. Probar de nuevo en unos segundos suele alcanzar."
      ingles="The proposal didn’t load. Try again in a few seconds."
    >
      <button type="button" onClick={reset} className="pressable inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <RotateCw aria-hidden="true" className="h-4 w-4" />
        Probar de nuevo
      </button>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-full border border-foreground/25 px-6 py-3.5 text-[15px] font-medium text-foreground hover:border-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <MessageCircle aria-hidden="true" className="h-4 w-4" />
        Escribir a Mario
      </a>
    </AvisoPropuesta>
  );
}
