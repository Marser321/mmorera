"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { SITE_IDENTITY } from "@/config/site";
import type { EscenaDemo, RubroDemo } from "@/data/demos";
import { AdelantoFilm } from "./AdelantoFilm";
import { DemoStage } from "./DemoStage";
import { EscenaCard } from "./EscenaCard";
import { useVisitaDemo } from "./useVisitaDemo";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";
const TONOS: Record<RubroDemo["id"], string> = { gimnasios: "#D4A373", consulta: "#9CC5A1" };

/** El mensaje de WhatsApp ya dice qué demo vio y quién lo mandó. */
export function enlaceWhatsApp(rubro: RubroDemo, de: string | null) {
  const texto = `Hola Mario, vi la demo de ${rubro.etiqueta.toLowerCase()} en tu web${de ? ` (vengo de parte de ${de})` : ""}. ¿Lo hablamos?`;
  return `${SITE_IDENTITY.contact.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/**
 * Una página de demo por rubro, en cuatro tiempos: qué es (con el adelanto
 * del film), las escenas (adelanto al pasar el mouse), la demo embebida y el
 * cierre con Mario. Elegir una escena la abre en el marco y baja hasta él.
 */
export function DemoRubroExperience({ rubro }: { rubro: RubroDemo }) {
  const { de, registrar } = useVisitaDemo(`/demos/${rubro.id}`);
  const [escena, setEscena] = useState<EscenaDemo | null>(null);
  const [cargado, setCargado] = useState(false);
  const escenario = useRef<HTMLElement>(null);

  const cargar = useCallback(() => {
    setCargado(true);
    registrar("demo");
  }, [registrar]);

  const bajarAlMarco = () => escenario.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const elegir = useCallback(
    (nueva: EscenaDemo | null, bajar = false) => {
      setEscena(nueva);
      if (nueva) registrar("escena", nueva.id);
      if (nueva?.destino.tipo !== "pronto") cargar();
      if (bajar) escenario.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [cargar, registrar],
  );

  const whatsapp = enlaceWhatsApp(rubro, de);
  const brief = `/aplicar${de ? `?de=${de}` : ""}`;
  const tono = { "--tono": TONOS[rubro.id] } as CSSProperties;

  return (
    <main id="contenido-principal" style={tono} className="bg-background pb-0 pt-32 sm:pt-40">
      <header className={`${container} pb-14 sm:pb-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14`}>
        <div>
          <p className="tono-texto text-xs font-medium uppercase tracking-[.16em]">
            Demo · {rubro.etiqueta}
            {rubro.estado === "previa" && <span className="ml-3 rounded-full border border-current px-2 py-0.5 text-[10px]">Versión previa</span>}
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,4.6vw,4.4rem)] font-medium leading-[1.02] tracking-[-.04em] text-foreground">{rubro.titulo}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">{rubro.bajada}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                cargar();
                bajarAlMarco();
              }}
              className="pressable inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Entrar a la demo
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 rotate-90" />
            </button>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registrar("contacto", "whatsapp")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/25 px-5 py-3 text-sm font-medium text-foreground hover:border-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Hablar con Mario
            </a>
          </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <AdelantoFilm mp4={rubro.adelanto.mp4} poster={rubro.adelanto.poster} rotulo="Adelanto · las cuatro escenas en 12 segundos" />
        </div>
      </header>

      <section id="escenas" aria-labelledby="escenas-titulo" className={`${container} scroll-mt-24 border-t border-foreground/15 py-14 sm:py-20`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="escenas-titulo" className="text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-.03em] text-foreground">
            Cuatro escenas, una sola casa.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/65">
            Pasa el mouse para ver cada una en movimiento. Elige una y se abre en la demo.
          </p>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {rubro.escenas.map((e, i) => (
            <EscenaCard key={e.id} escena={e} numero={i + 1} activa={escena?.id === e.id} onElegir={(x) => elegir(x, true)} />
          ))}
        </div>
      </section>

      <section ref={escenario} id="demo" aria-label="La demo" className={`${container} scroll-mt-20 pb-20 sm:pb-28`}>
        {rubro.aviso && <p className="mb-4 font-mono text-[10px] uppercase tracking-[.16em] text-foreground/60">{rubro.aviso}</p>}
        <DemoStage rubro={rubro} escena={escena} cargado={cargado} onCargar={cargar} onElegir={(x) => elegir(x)} />
      </section>

      <section id="hablemos" aria-labelledby="hablemos-titulo" className="banda-marfil bg-background py-16 text-foreground sm:py-24">
        <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end`}>
          <div>
            <h2 id="hablemos-titulo" className="max-w-3xl text-[clamp(2rem,3.6vw,3.6rem)] font-medium leading-[1.05] tracking-[-.035em]">
              ¿Lo vemos con tus clientes en mente?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Te muestro cómo quedaría con la marca de un negocio que acompañas, y armamos juntos cómo ofrecerlo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrar("contacto", "whatsapp")}
                className="pressable inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Escribirme por WhatsApp
              </a>
              <Link
                href={brief}
                onClick={() => registrar("contacto", "brief")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/30 px-5 py-3 text-sm font-medium hover:border-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Contarme por escrito
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-foreground/15 bg-card p-6 sm:p-8">
            <h3 className="font-mono text-[10px] font-normal uppercase tracking-[.16em] text-muted-foreground">{rubro.paraSocios.titulo}</h3>
            <ul className="mt-5 space-y-4">
              {rubro.paraSocios.puntos.map((p) => (
                <li key={p} className="flex gap-4 text-base leading-snug">
                  <span aria-hidden="true" className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
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
