import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { AvisoPropuesta } from "@/components/propuesta/AvisoPropuesta";
import { SITE_IDENTITY } from "@/config/site";

/* Slug desconocido o propuesta sin publicar: un aviso amable, con la salida a WhatsApp. */
export default function PropuestaNoEncontrada() {
  const whatsapp = `${SITE_IDENTITY.contact.whatsapp}?text=${encodeURIComponent("Hola Mario, quise abrir una propuesta y el enlace no funciona.")}`;
  return (
    <AvisoPropuesta
      rotulo="Mario Morera · Propuesta"
      titulo="Esta propuesta no está disponible."
      texto="Puede que el enlace esté incompleto o que la propuesta ya no esté publicada. Mario la reenvía en un momento por WhatsApp."
      ingles="This proposal isn’t available. Message Mario on WhatsApp to get it again."
    >
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="pressable inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <MessageCircle aria-hidden="true" className="h-4 w-4" />
        Escribir a Mario
      </a>
      <Link href="/" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-foreground/25 px-6 py-3.5 text-[15px] font-medium text-foreground hover:border-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Ir a mmorera.agency
      </Link>
    </AvisoPropuesta>
  );
}
