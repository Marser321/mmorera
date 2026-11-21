"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Maximize2, Minimize2, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { srcDeEscena, type EscenaDemo, type RubroDemo } from "@/data/demos";

/**
 * El marco de la demo: la app corre aquí dentro, sin salir de la web y sin
 * mostrar su dirección. No carga nada hasta que el visitante entra (la demo
 * pesa y la página tiene que llegar rápido). «Pantalla completa» la abre
 * sobre toda la ventana, también en el teléfono, donde el marco es alto.
 */
export function DemoStage({
  rubro,
  escena,
  cargado,
  onCargar,
  onElegir,
}: {
  rubro: RubroDemo;
  escena: EscenaDemo | null;
  cargado: boolean;
  onCargar: () => void;
  onElegir: (escena: EscenaDemo | null) => void;
}) {
  const [vuelta, setVuelta] = useState(0);
  const [cargaHecha, setCargaHecha] = useState<string | null>(null);
  const [inmersivo, setInmersivo] = useState(false);
  const lenis = useLenis();
  const marco = useRef<HTMLDivElement>(null);
  const src = srcDeEscena(rubro, escena);
  const pronto = escena?.destino.tipo === "pronto" ? escena.destino.nota : null;

  // Cada escena (o reinicio) es una carga nueva: está lista cuando su iframe avisó.
  const clave = `${src}-${vuelta}`;
  const listo = cargaHecha === clave;

  useEffect(() => {
    if (!inmersivo) return;
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    lenis?.stop();
    // El marco vive dentro de capas con z-index (el contenido va en z-10): mientras
    // ocupa la ventana, esas capas suben por encima de la cabecera y del botón de WhatsApp.
    const capas: [HTMLElement, string][] = [];
    for (let el = marco.current?.parentElement; el && el !== document.body; el = el.parentElement) {
      if (getComputedStyle(el).zIndex !== "auto") {
        capas.push([el, el.style.zIndex]);
        el.style.zIndex = "160";
      }
    }
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && setInmersivo(false);
    window.addEventListener("keydown", alPulsar);
    return () => {
      raiz.style.overflow = antes;
      lenis?.start();
      for (const [el, z] of capas) el.style.zIndex = z;
      window.removeEventListener("keydown", alPulsar);
    };
  }, [inmersivo, lenis]);

  const pestanas: { id: string; titulo: string; escena: EscenaDemo | null }[] = [
    { id: "libre", titulo: "Recorrido libre", escena: null },
    ...rubro.escenas.map((e) => ({ id: e.id, titulo: e.titulo, escena: e })),
  ];

  return (
    <div
      ref={marco}
      data-demo-stage
      data-inmersivo={inmersivo || undefined}
      className={cn(
        "flex flex-col overflow-hidden border border-foreground/15 bg-[#0B0B0A] text-[#ECE7DD] shadow-[0_30px_80px_-40px_rgb(0_0_0/0.6)]",
        inmersivo ? "fixed inset-0 z-[150] rounded-none border-0" : "relative rounded-[1.6rem]",
      )}
    >
      {/* Barra del marco: las escenas a la izquierda; reinicio y pantalla completa a la derecha. */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3 py-2 sm:px-4">
        <span aria-hidden="true" className="hidden items-center gap-2 pr-1 font-mono text-[10px] uppercase tracking-[.16em] text-[#ECE7DD]/60 sm:inline-flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#71F3A2] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#71F3A2]" />
          </span>
          En vivo
        </span>
        <div role="tablist" aria-label="Escenas de la demo" className="-my-1 flex min-w-0 flex-1 gap-1 overflow-x-auto py-1 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] sm:[mask-image:none]">
          {pestanas.map((p) => {
            const activa = (escena?.id ?? "libre") === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => onElegir(p.escena)}
                className={cn(
                  "min-h-9 shrink-0 rounded-full px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECE7DD]",
                  activa ? "bg-[#ECE7DD] text-[#0B0B0A]" : "text-[#ECE7DD]/70 hover:bg-white/10 hover:text-[#ECE7DD]",
                )}
              >
                {p.titulo}
              </button>
            );
          })}
        </div>
        {cargado && src && (
          <button
            type="button"
            onClick={() => setVuelta((v) => v + 1)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#ECE7DD]/70 hover:bg-white/10 hover:text-[#ECE7DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECE7DD]"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Empezar de nuevo</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (!cargado) onCargar();
            setInmersivo((v) => !v);
          }}
          aria-pressed={inmersivo}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-xs text-[#ECE7DD]/80 hover:bg-white/10 hover:text-[#ECE7DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECE7DD]"
        >
          {inmersivo ? <Minimize2 aria-hidden="true" className="h-4 w-4" /> : <Maximize2 aria-hidden="true" className="h-4 w-4" />}
          <span className="hidden sm:inline">{inmersivo ? "Salir" : "Pantalla completa"}</span>
          <span className="sr-only sm:hidden">{inmersivo ? "Salir de pantalla completa" : "Pantalla completa"}</span>
        </button>
      </div>

      <div
        className={cn(
          "relative w-full",
          inmersivo ? "min-h-0 flex-1" : "h-[78svh] max-h-[860px] min-h-[520px] md:aspect-[16/10] md:h-auto md:min-h-0",
        )}
      >
        {cargado && src ? (
          <>
            {/* Tras la carga, el simulador todavía se arma: la cortina se va con un respiro. */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 z-10 flex items-center justify-center bg-[#0B0B0A] transition-opacity duration-700",
                listo ? "pointer-events-none opacity-0 delay-700" : "opacity-100",
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#ECE7DD]/60 motion-safe:animate-pulse">Abriendo la casa…</span>
            </div>
            <iframe
              key={clave}
              src={src}
              onLoad={() => setCargaHecha(clave)}
              title={`Demo de ${rubro.etiqueta.toLowerCase()}${escena ? `: ${escena.titulo.toLowerCase()}` : ""}`}
              className="absolute inset-0 h-full w-full border-0 bg-[#0B0B0A]"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
              referrerPolicy="origin"
              allow="clipboard-write"
            />
          </>
        ) : (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- póster del marco antes de cargar la demo */}
            <img
              src={escena?.poster ?? rubro.adelanto.poster}
              alt=""
              className={cn("absolute inset-0 h-full w-full opacity-45", escena?.vertical ? "object-contain py-6" : "object-cover object-top")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/55 to-[#0B0B0A]/20" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 sm:p-10">
              {pronto ? (
                <p className="max-w-md text-base leading-relaxed text-[#ECE7DD]/85">{pronto}</p>
              ) : (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#ECE7DD]/65">
                    {escena ? escena.titulo : "La demo completa"} · datos de ejemplo
                  </p>
                  <button
                    type="button"
                    onClick={onCargar}
                    className="pressable inline-flex min-h-12 items-center gap-3 rounded-full bg-[#ECE7DD] px-6 py-3 text-sm font-semibold text-[#0B0B0A] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#71F3A2]"
                  >
                    <Play aria-hidden="true" className="h-4 w-4" />
                    Entrar a la demo
                  </button>
                  <p className="text-sm text-[#ECE7DD]/60">Se abre aquí mismo. Puedes tocar todo: nada es real.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
