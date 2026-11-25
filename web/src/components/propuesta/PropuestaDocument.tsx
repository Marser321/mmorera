import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { MonogramaFundido } from "@/components/marca/MonogramaFundido";
import { PalabraEco } from "@/components/marca/PalabraEco";
import { SITE_IDENTITY } from "@/config/site";
import {
  enlaceEmailPropuesta,
  enlaceWhatsAppPropuesta,
  fechaPropuesta,
  type Propuesta,
} from "@/lib/propuesta";
import { VisitaPropuesta } from "./VisitaPropuesta";

/*
 * Propuesta a medida (/p/<slug>): se lee como un documento preparado para un
 * solo negocio. Cinco tiempos numerados, del diagnóstico al siguiente paso, y
 * el cierre en la banda marfil. Todo del servidor; solo el registro de la
 * visita corre en el navegador. Nunca lleva precio (D-011).
 *
 * Los textos fijos van en infinitivo o con posesivos («tu», «tuyo») para que
 * sirvan igual con «vos» y con «tú»: el trato lo pone el JSON.
 */

const COPY = {
  es: {
    marca: "Mario Morera · Propuesta a medida",
    ejemplo: "Ejemplo · no es una propuesta real",
    para: "Para",
    rubro: "Rubro",
    lugar: "Dónde",
    fecha: "Preparada",
    verDemo: "Ver la demo",
    hablar: "Escribir a Mario",
    indice: "En esta propuesta",
    secciones: ["Diagnóstico", "La demo", "Cómo quedaría", "Por qué propio", "Siguiente paso"],
    diagnostico: (n: string) => `Lo que vi de ${n}`,
    diagnosticoBajada: "Lo que encontré mirando el negocio desde afuera, antes de hablar.",
    hallazgo: "Hallazgo",
    demo: "La demo de tu rubro",
    demoBajada: "Un sistema real, funcionando, con datos de ejemplo. Se abre en una pestaña nueva.",
    abrirDemo: "Abrir la demo",
    enVivo: "En vivo",
    demoNota: "Demo real · datos de ejemplo",
    como: (n: string) => `Cómo quedaría para ${n}`,
    comoBajada: "Lo mismo de la demo, armado con tu forma de trabajar.",
    porQue: "Por qué un sistema propio",
    porQueBajada: "No es una suscripción a una plataforma: es software tuyo.",
    siguiente: "El siguiente paso",
    whatsapp: "Escribir por WhatsApp",
    email: "Escribir por email",
    firma: "Sistemas a medida, webs y automatizaciones con IA",
    privada: (n: string) => `Propuesta privada, preparada solo para ${n}.`,
  },
  en: {
    marca: "Mario Morera · Tailored proposal",
    ejemplo: "Example · not a real proposal",
    para: "For",
    rubro: "Industry",
    lugar: "Where",
    fecha: "Prepared",
    verDemo: "See the demo",
    hablar: "Message Mario",
    indice: "In this proposal",
    secciones: ["Diagnosis", "The demo", "How it would work", "Why your own", "Next step"],
    diagnostico: (n: string) => `What I noticed at ${n}`,
    diagnosticoBajada: "What I found looking at the business from the outside, before we talk.",
    hallazgo: "Finding",
    demo: "The demo for your industry",
    demoBajada: "A real, working system with sample data. It opens in a new tab.",
    abrirDemo: "Open the demo",
    enVivo: "Live",
    demoNota: "Real demo · sample data",
    como: (n: string) => `How it would work for ${n}`,
    comoBajada: "The same system as the demo, shaped around the way you work.",
    porQue: "Why a system of your own",
    porQueBajada: "Not a subscription to someone else's platform: software that is yours.",
    siguiente: "The next step",
    whatsapp: "Message on WhatsApp",
    email: "Send an email",
    firma: "Custom systems, websites and AI automations",
    privada: (n: string) => `Private proposal, prepared only for ${n}.`,
  },
} as const;

/* En una grilla de dos con separadores de 1 px, el último impar ocupa la fila entera (si no, queda un hueco). */
const impar = "[&:nth-child(odd):last-child]:col-span-2 lg:[&:nth-child(odd):last-child]:col-span-1";
const imparSm = "sm:[&:nth-child(odd):last-child]:col-span-2";
const contenedor = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12";
const rotulo = "font-mono text-[10px] uppercase tracking-[.2em]";
const botonLleno =
  "pressable inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const botonBorde =
  "pressable inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-foreground/25 px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:border-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** «Oficio para lavaderos: caja, clientes y web» → título y piezas sueltas. */
export function partirTituloDemo(titulo: string | null): { nombre: string | null; piezas: string[] } {
  if (!titulo) return { nombre: null, piezas: [] };
  const [antes, ...resto] = titulo.split(":");
  const despues = resto.join(":").trim();
  if (!despues) return { nombre: titulo, piezas: [] };
  const piezas = despues
    .split(/,\s*|\s+y\s+|\s+and\s+/)
    .map((p) => p.trim().replace(/\.$/, ""))
    .filter(Boolean);
  if (piezas.length < 2 || piezas.length > 7 || piezas.some((p) => p.length > 40)) return { nombre: titulo, piezas: [] };
  return { nombre: antes.trim(), piezas: piezas.map((p) => p.charAt(0).toUpperCase() + p.slice(1)) };
}

function Seccion({
  id,
  numero,
  nombre,
  titulo,
  bajada,
  children,
}: {
  id: string;
  numero: number;
  nombre: string;
  titulo: string;
  bajada?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-24">
      <div className={`${contenedor} grid gap-y-8 border-t border-foreground/12 py-14 sm:py-20 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-x-16 lg:py-24`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className={`${rotulo} flex items-center gap-3 text-foreground/55`}>
            <span className="tabular-nums text-signal">{String(numero).padStart(2, "0")}</span>
            <span aria-hidden="true" className="h-px w-6 bg-foreground/25" />
            {nombre}
          </p>
        </div>
        <div className="min-w-0">
          <h2 id={`${id}-titulo`} className="max-w-[22ch] text-balance text-[clamp(1.9rem,3.6vw,3.25rem)] font-medium leading-[1.04] tracking-[-.035em] text-foreground">
            {titulo}
          </h2>
          {bajada && <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-foreground/60 sm:text-lg">{bajada}</p>}
          <div className="mt-10 sm:mt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Figura({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagen que trae la propuesta (n8n), puede ser de otro dominio
    <img src={src} alt={alt} loading="lazy" decoding="async" className={`block h-auto w-full ${className}`} />
  );
}

/**
 * Esbozo abstracto de un sistema (menú, tres cifras, lista del día) para
 * acompañar el botón de la demo cuando la propuesta no trae imagen. Sin datos
 * ni marcas: solo la forma. Decorativo y solo en pantallas anchas.
 */
function EsbozoSistema() {
  const filas = [0.62, 0.48, 0.7, 0.4];
  return (
    <div aria-hidden="true" className="hidden select-none rounded-xl border border-foreground/12 bg-background/80 p-4 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.8)] light:shadow-[0_24px_60px_-30px_rgb(20_23_26/0.2)] lg:block">
      <div className="flex gap-4">
        <div className="w-12 shrink-0 space-y-2.5 border-r border-foreground/10 pr-4 pt-1">
          <div className="mb-4 h-4 w-4 rounded-full border border-foreground/30" />
          <div className="h-1.5 w-full rounded-full bg-signal/60" />
          {[0.8, 0.6, 0.9, 0.7, 0.5].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-foreground/12" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-20 rounded-full bg-foreground/30" />
            <div className="h-4 w-12 rounded-full border border-foreground/15" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0.7, 0.5, 0.85].map((w, i) => (
              <div key={i} className="rounded-md border border-foreground/10 p-2">
                <div className="h-1 w-8 rounded-full bg-foreground/15" />
                <div className="mt-2 h-2.5 rounded-full bg-foreground/35" style={{ width: `${w * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {filas.map((w, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-foreground/[0.07] px-2 py-2">
                <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 1 ? "bg-signal/80" : "bg-foreground/20"}`} />
                <div className="h-1.5 rounded-full bg-foreground/15" style={{ width: `${w * 100}%` }} />
                <div className="ml-auto h-3 w-9 shrink-0 rounded-full bg-foreground/[0.08]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropuestaDocument({ propuesta: p }: { propuesta: Propuesta }) {
  const t = COPY[p.idioma];
  // Títulos propios que trae la propuesta (agencias, oportunidades); si no vienen, los de siempre.
  const et = p.etiquetas ?? {};
  const fecha = fechaPropuesta(p.creado, p.idioma);
  const lugar = [p.ciudad, p.pais].filter(Boolean).join(", ");
  const { nombre: demoNombre, piezas } = partirTituloDemo(p.demo.titulo);
  const host = new URL(p.demo.url, SITE_IDENTITY.canonical).host.replace(/^www\./, "");

  // Sin WhatsApp ni email en la propuesta, el de Mario: nunca queda sin forma de responder.
  const whatsapp =
    p.siguientePaso.whatsapp || !p.siguientePaso.email
      ? enlaceWhatsAppPropuesta(p.siguientePaso.whatsapp ?? SITE_IDENTITY.contact.whatsapp, p)
      : null;
  const email = p.siguientePaso.email ? enlaceEmailPropuesta(p.siguientePaso.email, p) : null;
  const contactoPrincipal = whatsapp
    ? { href: whatsapp, visita: "contacto:whatsapp", externo: true }
    : { href: email as string, visita: "contacto:email", externo: false };

  const ficha: { k: string; v: string }[] = [
    { k: t.para, v: p.negocio },
    { k: t.rubro, v: p.rubro ?? "" },
    { k: t.lugar, v: lugar },
    { k: t.fecha, v: fecha ?? "" },
  ].filter(({ v }) => v);

  // Las secciones presentes, numeradas en orden: el índice de la portada y los rótulos usan los mismos números.
  const indice = [
    { id: "diagnostico", nombre: et.diagnostico?.indice ?? t.secciones[0], hay: p.diagnostico.length > 0 },
    { id: "demo", nombre: et.demo?.indice ?? t.secciones[1], hay: true },
    { id: "como-quedaria", nombre: et.como_quedaria?.indice ?? t.secciones[2], hay: p.comoQuedaria.length > 0 },
    { id: "por-que-propio", nombre: et.por_que_propio?.indice ?? t.secciones[3], hay: p.porQuePropio.length > 0 },
    { id: "siguiente-paso", nombre: et.siguiente_paso?.indice ?? t.secciones[4], hay: true },
  ].filter((s) => s.hay);
  const numero = (id: string) => indice.findIndex((s) => s.id === id) + 1;

  return (
    <main id="contenido-principal" lang={p.idioma} className="relative bg-background">
      <VisitaPropuesta slug={p.slug} />

      {/* ── Portada ─────────────────────────────────────────── */}
      <header className="relative overflow-x-clip pt-28 sm:pt-36 lg:pt-40">
        <div className={contenedor}>
          {p.ejemplo && (
            <p className={`${rotulo} fade-up-in mb-8 inline-flex items-center gap-2 rounded-full border border-track-create/50 px-3 py-1.5 text-track-create`}>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
              {t.ejemplo}
            </p>
          )}
          <p className={`${rotulo} fade-up-in text-foreground/60`}>{t.marca}</p>
          <span aria-hidden="true" className="fade-up-in mt-5 block h-px w-12 bg-foreground/30" />

          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end lg:gap-16">
            <div>
              <h1
                className="fade-up-in mt-8 max-w-[19ch] text-balance text-[clamp(2.35rem,6.4vw,5.4rem)] font-medium leading-[1.0] tracking-[-.045em] text-foreground"
                style={{ animationDelay: "60ms" }}
              >
                {p.titular}
              </h1>
              <p
                className="fade-up-in mt-7 max-w-[58ch] text-pretty text-lg leading-relaxed text-foreground/72 sm:mt-9 sm:text-xl"
                style={{ animationDelay: "120ms" }}
              >
                {p.situacion}
              </p>

              <div className="fade-up-in mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={{ animationDelay: "180ms" }}>
                <a href="#demo" className={botonLleno}>
                  {t.verDemo}
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href={contactoPrincipal.href}
                  data-visita={contactoPrincipal.visita}
                  {...(contactoPrincipal.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={botonBorde}
                >
                  {whatsapp ? <MessageCircle aria-hidden="true" className="h-4 w-4" /> : <Mail aria-hidden="true" className="h-4 w-4" />}
                  {t.hablar}
                </a>
              </div>
            </div>

            <nav aria-label={t.indice} className="fade-up-in hidden border-l border-foreground/12 pl-8 lg:block" style={{ animationDelay: "200ms" }}>
              <p className={`${rotulo} text-foreground/50`}>{t.indice}</p>
              <ol className="mt-5 space-y-3.5">
                {indice.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="group flex items-baseline gap-3 text-[15px] text-foreground/70 transition-colors hover:text-foreground">
                      <span className="font-mono text-[10px] tabular-nums text-signal">{String(i + 1).padStart(2, "0")}</span>
                      <span className="link-draw">{s.nombre}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <dl className="fade-up-in mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-foreground/12 bg-foreground/12 sm:mt-20 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none" style={{ animationDelay: "240ms" }}>
            {ficha.map(({ k, v }) => (
              <div key={k} className={`bg-background px-4 py-4 sm:px-5 sm:py-5 ${impar}`}>
                <dt className={`${rotulo} text-foreground/50`}>{k}</dt>
                <dd className="mt-2 text-[15px] font-medium leading-snug text-foreground sm:text-base">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <PalabraEco className="mt-10 pb-[0.05em] pl-[2vw] text-[clamp(5rem,17vw,16rem)] sm:mt-14">{p.negocio}</PalabraEco>
      </header>

      {/* ── 01 Diagnóstico ───────────────────────────────────── */}
      {p.diagnostico.length > 0 && (
        <Seccion id="diagnostico" numero={numero("diagnostico")} nombre={et.diagnostico?.indice ?? t.secciones[0]} titulo={et.diagnostico?.titulo ?? t.diagnostico(p.negocio)} bajada={et.diagnostico?.bajada ?? t.diagnosticoBajada}>
          <ol className="divide-y divide-foreground/12 border-t border-foreground/12">
            {p.diagnostico.map((h, i) => (
              <li key={`${i}-${h.titulo}`} className="grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:py-10">
                <p className="flex items-baseline gap-3 sm:block">
                  <span className="text-[2.6rem] font-medium leading-none tracking-[-.05em] text-foreground/22 tabular-nums sm:text-[3.4rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`${rotulo} text-foreground/45 sm:mt-3 sm:block`}>{t.hallazgo}</span>
                </p>
                <div className="min-w-0">
                  <h3 className="text-balance text-[clamp(1.3rem,2.1vw,1.7rem)] font-medium leading-snug tracking-[-.02em] text-foreground">{h.titulo}</h3>
                  <p className="mt-3 max-w-[62ch] text-pretty text-base leading-relaxed text-foreground/70 sm:text-[1.0625rem]">{h.detalle}</p>
                  {h.captura && (
                    <figure className="mt-6 overflow-hidden rounded-xl border border-foreground/12 bg-card">
                      <Figura src={h.captura} alt={h.titulo} />
                    </figure>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Seccion>
      )}

      {/* ── 02 La demo ───────────────────────────────────────── */}
      <Seccion id="demo" numero={numero("demo")} nombre={et.demo?.indice ?? t.secciones[1]} titulo={et.demo?.titulo ?? t.demo} bajada={et.demo?.bajada ?? t.demoBajada}>
        <div className="overflow-hidden rounded-2xl border border-foreground/14 bg-card shadow-[0_30px_80px_-40px_rgb(0_0_0/0.7)] light:shadow-[0_30px_80px_-40px_rgb(20_23_26/0.25)]">
          <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-3 sm:px-5">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/18" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/18" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/18" />
            </span>
            <span className="ml-2 min-w-0 truncate font-mono text-[11px] text-foreground/55">{host}</span>
            <span className={`${rotulo} ml-auto flex shrink-0 items-center gap-2 text-signal`}>
              <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              {t.enVivo}
            </span>
          </div>

          {p.demo.imagen && (
            <a href={p.demo.url} target="_blank" rel="noopener noreferrer" data-visita="demo" tabIndex={-1} aria-hidden="true" className="block border-b border-foreground/10">
              <Figura src={p.demo.imagen} alt="" className="aspect-[16/10] object-cover object-top" />
            </a>
          )}

          <div className="relative isolate overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
            {!p.demo.imagen && (
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(rgb(var(--ink-rgb)/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--ink-rgb)/0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_left,#000_10%,transparent_75%)]"
              />
            )}
            <div className={p.demo.imagen ? "" : "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-center lg:gap-12"}>
              <div className="min-w-0">
                {demoNombre && (
                  <p className="max-w-[24ch] text-balance text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-[1.08] tracking-[-.03em] text-foreground">{demoNombre}</p>
                )}
                {piezas.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {piezas.map((pieza, i) => (
                      <li key={`${i}-${pieza}`} className="rounded-full border border-foreground/15 bg-background/50 px-3.5 py-1.5 text-sm text-foreground/80">
                        {pieza}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <a href={p.demo.url} target="_blank" rel="noopener noreferrer" data-visita="demo" className={`${botonLleno} sm:min-h-14 sm:px-8 sm:text-base`}>
                    {et.demo?.boton ?? t.abrirDemo}
                    <ArrowUpRight aria-hidden="true" className="h-[1.1em] w-[1.1em]" />
                  </a>
                  <p className={`${rotulo} text-foreground/50`}>{t.demoNota}</p>
                </div>
              </div>
              {!p.demo.imagen && <EsbozoSistema />}
            </div>
          </div>
        </div>
      </Seccion>

      {/* ── 03 Cómo quedaría ─────────────────────────────────── */}
      {p.comoQuedaria.length > 0 && (
        <Seccion id="como-quedaria" numero={numero("como-quedaria")} nombre={et.como_quedaria?.indice ?? t.secciones[2]} titulo={et.como_quedaria?.titulo ?? t.como(p.negocio)} bajada={et.como_quedaria?.bajada ?? t.comoBajada}>
          <ol className="relative">
            {p.comoQuedaria.map((paso, i) => (
              <li key={`${i}-${paso}`} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-7">
                {i < p.comoQuedaria.length - 1 && (
                  <span aria-hidden="true" className="absolute bottom-0 left-[1.25rem] top-11 w-px bg-foreground/15 sm:left-6 sm:top-[3.25rem]" />
                )}
                <span className="grid h-10 w-10 place-items-center rounded-full border border-signal/45 font-mono text-xs tabular-nums text-signal sm:h-12 sm:w-12 sm:text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="max-w-[60ch] pt-1.5 text-pretty text-[1.0625rem] leading-relaxed text-foreground/85 sm:pt-2.5 sm:text-xl sm:leading-[1.55]">{paso}</p>
              </li>
            ))}
          </ol>
        </Seccion>
      )}

      {/* ── 04 Por qué propio ────────────────────────────────── */}
      {p.porQuePropio.length > 0 && (
        <Seccion id="por-que-propio" numero={numero("por-que-propio")} nombre={et.por_que_propio?.indice ?? t.secciones[3]} titulo={et.por_que_propio?.titulo ?? t.porQue} bajada={et.por_que_propio?.bajada ?? t.porQueBajada}>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/12 sm:grid-cols-2">
            {p.porQuePropio.map((punto, i) => (
              <li key={`${i}-${punto}`} className={`flex flex-col gap-5 bg-background p-6 sm:p-8 ${imparSm}`}>
                <span aria-hidden="true" className="font-mono text-[11px] tabular-nums text-foreground/40">
                  {String.fromCharCode(97 + i)} /
                </span>
                <p className="text-pretty text-lg leading-snug tracking-[-.01em] text-foreground sm:text-[1.3rem] sm:leading-[1.4]">{punto}</p>
              </li>
            ))}
          </ul>
        </Seccion>
      )}

      {/* ── 05 Siguiente paso (banda marfil) ─────────────────── */}
      <section id="siguiente-paso" aria-labelledby="siguiente-paso-titulo" className="banda-marfil scroll-mt-20 overflow-hidden">
        <MonogramaFundido intensidad="marca" fundido="diagonal" className="absolute -right-[5vw] top-[8%] hidden w-[min(34vw,480px)] [--monograma-opacidad:0.1] lg:block" />
        <div className={`${contenedor} relative grid gap-y-8 py-16 sm:py-24 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-x-16 lg:py-28`}>
          <p className={`${rotulo} flex items-center gap-3 self-start text-muted-foreground`}>
            <span className="tabular-nums text-signal">{String(numero("siguiente-paso")).padStart(2, "0")}</span>
            <span aria-hidden="true" className="h-px w-6 bg-foreground/30" />
            {et.siguiente_paso?.indice ?? t.secciones[4]}
          </p>
          <div className="min-w-0">
            <h2 id="siguiente-paso-titulo" className="text-[clamp(2.4rem,5.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-.05em]">
              {et.siguiente_paso?.titulo ?? t.siguiente}
            </h2>
            <p className="mt-7 max-w-[56ch] whitespace-pre-line text-pretty text-lg leading-relaxed text-foreground/80 sm:text-xl sm:leading-[1.6]">
              {p.siguientePaso.texto}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" data-visita="contacto:whatsapp" className={botonLleno}>
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  {t.whatsapp}
                </a>
              )}
              {email && (
                <a href={email} data-visita="contacto:email" className={whatsapp ? botonBorde : botonLleno}>
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  {t.email}
                </a>
              )}
            </div>

            <div className="mt-14 flex items-center gap-4 border-t border-foreground/15 pt-8 sm:mt-20">
              <MonogramaFundido fundido="sello" className="w-12 shrink-0 [--monograma-opacidad:1]" />
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-[-.01em]">{SITE_IDENTITY.brand}</p>
                <p className="text-sm text-muted-foreground">
                  {t.firma} ·{" "}
                  <a href={SITE_IDENTITY.canonical} className="link-draw text-foreground">
                    mmorera.agency
                  </a>
                </p>
              </div>
            </div>
            <p className={`${rotulo} mt-8 text-muted-foreground`}>{t.privada(p.negocio)}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
