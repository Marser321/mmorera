"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { SITE_IDENTITY } from "@/config/site";
import { AdelantoFilm } from "./AdelantoFilm";
import { useVisitaDemo } from "./useVisitaDemo";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";
const MEDIOS = "/demos/credito";

/** Pantallas reales de la demo (datos de ejemplo), una idea cada una. */
const PANTALLAS = [
  { src: `${MEDIOS}/guia.webp`, titulo: "La app te lleva de la mano", linea: "Guías sobre la pantalla real: un paso a la vez, con el resto en penumbra." },
  { src: `${MEDIOS}/ley.webp`, titulo: "Con la ley de tu estado", linea: "Cada lección se arma con las reglas del estado de la persona, y cada regla con su fuente oficial." },
  { src: `${MEDIOS}/primer-mes.webp`, titulo: "Tu primer mes, de punta a punta", linea: "Ocho pasos con un reporte inventado: pedir, leer, escribir la disputa y entender la respuesta." },
  { src: `${MEDIOS}/revisor.webp`, titulo: "El revisor de cumplimiento", linea: "Antes de publicar, marca lo que la ley no deja prometer y sugiere cómo decirlo bien." },
];
const PUNTOS = [
  "La persona aprende y ordena su caso gratis, en español; el negocio capta, ordena y cumple.",
  "La app de sus clientes lleva la marca del negocio.",
  "Lo instalo y acompaño al equipo mientras lo adopta.",
];

/**
 * La plataforma de crédito en /demos: el film, las pantallas reales y una demo guiada en vivo.
 * La app no se embebe (por ahora no se deja abrir dentro de otro sitio): se muestra con Mario.
 */
export function DemoCreditoExperience() {
  const { de, registrar } = useVisitaDemo("/demos/credito");
  const texto = `Hola Mario, vi la demo de la plataforma de crédito en tu web${de ? ` (vengo de parte de ${de})` : ""}. ¿Me la muestras en vivo?`;
  const whatsapp = `${SITE_IDENTITY.contact.whatsapp}?text=${encodeURIComponent(texto)}`;
  const brief = `/aplicar${de ? `?de=${de}` : ""}`;
  const tono = { "--tono": "#9FD8BC" } as CSSProperties;

  return (
    <main id="contenido-principal" style={tono} className="bg-background pt-32 sm:pt-40">
      <header className={`${container} pb-14 sm:pb-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14`}>
        <div>
          <p className="tono-texto text-xs font-medium uppercase tracking-[.16em]">Demo · Crédito en español · EE. UU.</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,4.6vw,4.4rem)] font-medium leading-[1.02] tracking-[-.04em] text-foreground">Crédito, paso a paso.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            Una plataforma con dos caras. La persona entiende su reporte y aprende a actuar por su cuenta, con la ley de su estado. El negocio de crédito capta, ordena y publica sin prometer lo que no se puede.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => registrar("contacto", "whatsapp")}
              className="pressable inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Pedir una demo en vivo
            </a>
            <a href="#pantallas" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/25 px-5 py-3 text-sm font-medium text-foreground hover:border-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Ver las pantallas
            </a>
          </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <AdelantoFilm mp4={`${MEDIOS}/film.mp4`} poster={`${MEDIOS}/film.webp`} rotulo="Film · Paso a paso · 88 s" conSonido />
        </div>
      </header>

      <section id="pantallas" aria-labelledby="pantallas-titulo" className={`${container} scroll-mt-24 border-t border-foreground/15 py-14 sm:py-20`}>
        <h2 id="pantallas-titulo" className="text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-.03em] text-foreground">Lo que agrega valor: aprender paso a paso.</h2>
        <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2">
          {PANTALLAS.map((p, i) => (
            <figure key={p.src} className="group">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-foreground/15 bg-[#0D1512]">
                {/* eslint-disable-next-line @next/next/no-img-element -- captura real de la demo, liviana */}
                <img src={p.src} alt={p.titulo} loading="lazy" decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.04]" />
              </div>
              <figcaption className="mt-4">
                <span className="flex items-baseline gap-3">
                  <span className="tono-texto font-mono text-[11px] tracking-[.16em]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl font-medium leading-tight tracking-[-.02em] text-foreground">{p.titulo}</span>
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-foreground/70">{p.linea}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-12 max-w-3xl font-mono text-[10px] uppercase leading-relaxed tracking-[.16em] text-foreground/55">
          Demo de marca blanca con datos inventados. La plataforma está en prueba: informa y organiza, no es asesoría legal ni promete resultados.
        </p>
      </section>

      <section id="hablemos" aria-labelledby="hablemos-titulo" className="banda-marfil bg-background py-16 text-foreground sm:py-24">
        <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end`}>
          <div>
            <h2 id="hablemos-titulo" className="max-w-3xl text-[clamp(2rem,3.6vw,3.6rem)] font-medium leading-[1.05] tracking-[-.035em]">¿Te la muestro en vivo?</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Te la recorro en 15 minutos con la marca del negocio que acompañas, y vemos cómo ofrecerla.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => registrar("contacto", "whatsapp")}
                className="pressable inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Escribirme por WhatsApp
              </a>
              <Link href={brief} onClick={() => registrar("contacto", "brief")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/30 px-5 py-3 text-sm font-medium hover:border-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Contarme por escrito
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-foreground/15 bg-card p-6 sm:p-8">
            <h3 className="font-mono text-[10px] font-normal uppercase tracking-[.16em] text-muted-foreground">Para quien acompaña a negocios de crédito</h3>
            <ul className="mt-5 space-y-4">
              {PUNTOS.map(p => (
                <li key={p} className="flex gap-4 text-base leading-snug">
                  <span aria-hidden="true" className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
