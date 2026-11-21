"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_IDENTITY } from "@/config/site";
import { RUBROS, RUBRO_IDS } from "@/data/demos";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useVisitaDemo } from "./useVisitaDemo";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";

type PuertaDemo = { href: string; etiqueta: string; puerta: string; previa?: boolean; poster: string; clip: string };

/**
 * Una puerta por rubro de la edición premium. La plataforma de crédito no tiene puerta aquí:
 * su página (/demos/credito) sólo se comparte por correo a ese rubro.
 */
const PUERTAS: PuertaDemo[] = [
  ...RUBRO_IDS.map((id): PuertaDemo => ({
    href: `/demos/${id}`, etiqueta: RUBROS[id].etiqueta, puerta: RUBROS[id].puerta, previa: RUBROS[id].estado === "previa",
    poster: id === "gimnasios" ? "/demos/gimnasios/panel.webp" : "/demos/gimnasios/entrenador.webp",
    clip: id === "gimnasios" ? "/demos/gimnasios/adelanto.mp4" : "/demos/gimnasios/entrenador.mp4",
  })),
];

function Puerta({ puerta: medio, numero }: { puerta: PuertaDemo; numero: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const [encima, setEncima] = useState(false);
  const reducido = useReducedMotionSafe() === true;

  const entrar = () => {
    if (reducido) return;
    setEncima(true);
    const v = video.current;
    if (v) {
      if (!v.src) v.src = medio.clip;
      void v.play().catch(() => {});
    }
  };
  const salir = () => {
    setEncima(false);
    video.current?.pause();
  };

  return (
    <Link
      href={medio.href}
      onPointerEnter={(e) => e.pointerType === "mouse" && entrar()}
      onPointerLeave={salir}
      className="group flex min-w-0 flex-col focus-visible:outline-none"
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[1.6rem] border border-foreground/15 bg-[#E9E6E0] transition-colors duration-500 group-hover:border-foreground/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        {/* eslint-disable-next-line @next/next/no-img-element -- póster de la puerta */}
        <img
          src={medio.poster}
          alt=""
          loading={numero === 1 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.03]"
        />
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={cn("absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500", encima ? "opacity-100" : "opacity-0")}
        />
        {medio.previa && (
          <span className="absolute left-4 top-4 rounded-full bg-[#0B0B0A]/75 px-3 py-1 font-mono text-[10px] uppercase tracking-[.16em] text-[#ECE7DD]">
            Versión previa
          </span>
        )}
      </span>
      <span className="mt-5 flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-[.16em] text-foreground/55">{String(numero).padStart(2, "0")}</span>
        <span className="text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium leading-tight tracking-[-.03em] text-foreground">{medio.etiqueta}</span>
        <ArrowUpRight aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-foreground/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </span>
      <span className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/70">{medio.puerta}</span>
    </Link>
  );
}

/**
 * La portada de las demos: una puerta por rubro. Registra la visita con su
 * origen (`?de=`) y lo deja en la pestaña para las páginas de cada rubro.
 */
export function DemosPortada() {
  const { de, registrar } = useVisitaDemo("/demos");
  const texto = `Hola Mario, vi tus demos en la web${de ? ` (vengo de parte de ${de})` : ""}. ¿Lo hablamos?`;
  const whatsapp = `${SITE_IDENTITY.contact.whatsapp}?text=${encodeURIComponent(texto)}`;

  return (
    <main id="contenido-principal" className="bg-background pb-28 pt-32 sm:pt-40">
      <header className={`${container} pb-12 sm:pb-16`}>
        <p className="text-xs font-medium uppercase tracking-[.16em] text-signal">Demos</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,5.5vw,5rem)] font-medium leading-[1.02] tracking-[-.04em] text-foreground">
          Las apps, para tocarlas.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-xl">
          Sistemas a medida para negocios que atienden personas todos los días. Elige una y mírala por dentro, con datos de ejemplo.
        </p>
      </header>

      <section aria-label="Demos" className={`${container} grid gap-12 border-t border-foreground/15 pt-12 md:grid-cols-2 md:gap-8 sm:pt-16`}>
        {PUERTAS.map((p, i) => (
          <Puerta key={p.href} puerta={p} numero={i + 1} />
        ))}
      </section>

      <section className={`${container} mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-foreground/15 pt-10`}>
        <p className="max-w-xl text-lg leading-snug text-foreground">¿Tu rubro no está? Lo armo con la misma base y el idioma de tu negocio.</p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => registrar("contacto", "whatsapp")}
          className="pressable inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          Hablar con Mario
        </a>
      </section>
    </main>
  );
}
