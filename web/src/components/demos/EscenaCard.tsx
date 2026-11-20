"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EscenaDemo } from "@/data/demos";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Una escena de la demo. Con mouse, el adelanto corre mientras el puntero está
 * encima; en el teléfono corre solo cuando la tarjeta está casi entera en
 * pantalla. El clip no se descarga hasta la primera vez que hace falta.
 * Tocar la tarjeta abre esa escena en el marco de la demo.
 */
export function EscenaCard({
  escena,
  numero,
  activa,
  onElegir,
}: {
  escena: EscenaDemo;
  numero: number;
  activa: boolean;
  onElegir: (escena: EscenaDemo) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [encima, setEncima] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pedido, setPedido] = useState(false);
  const reducido = useReducedMotionSafe() === true;
  const corre = !reducido && Boolean(escena.clip) && (encima || visible);

  // Táctil: el adelanto corre cuando la tarjeta está casi entera a la vista.
  useEffect(() => {
    const el = ref.current;
    if (!el || !escena.clip || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setPedido(true);
      },
      { threshold: 0.8 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [escena.clip]);

  const asomar = () => {
    setEncima(true);
    if (!reducido) setPedido(true);
  };

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (corre) void v.play().catch(() => {});
    else {
      v.pause();
      if (!visible) v.currentTime = 0;
    }
  }, [corre, pedido, visible]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onElegir(escena)}
      onPointerEnter={(e) => e.pointerType === "mouse" && asomar()}
      onPointerLeave={() => setEncima(false)}
      onFocus={asomar}
      onBlur={() => setEncima(false)}
      aria-pressed={activa}
      data-escena={escena.id}
      className={cn(
        "group flex w-full min-w-0 flex-col text-left focus-visible:outline-none",
        "transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] motion-safe:hover:-translate-y-1",
      )}
    >
      <span
        className={cn(
          "relative block aspect-[16/10] overflow-hidden rounded-2xl border bg-[#E9E6E0] transition-colors duration-500",
          activa ? "border-foreground/60" : "border-foreground/15 group-hover:border-foreground/35",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- póster liviano; el clip lo reemplaza al pasar el mouse */}
        <img
          src={escena.poster}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.03]",
            escena.vertical ? "object-contain py-3" : "object-cover object-top",
          )}
        />
        {escena.clip && (
          <video
            ref={video}
            src={pedido ? escena.clip : undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-500",
              escena.vertical ? "object-contain py-3" : "object-cover object-top",
              corre ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        {escena.clip && !reducido && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0A]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.16em] text-[#ECE7DD] transition-opacity duration-300",
              corre ? "opacity-0" : "opacity-100",
            )}
          >
            <Play className="h-2.5 w-2.5" /> Adelanto
          </span>
        )}
      </span>
      <span className="mt-4 flex items-baseline gap-3">
        <span className="tono-texto font-mono text-[11px] tracking-[.16em]">{String(numero).padStart(2, "0")}</span>
        <span className="text-xl font-medium leading-tight tracking-[-.02em] text-foreground">{escena.titulo}</span>
      </span>
      <span className="mt-2 text-sm leading-relaxed text-foreground/70">{escena.linea}</span>
      <span className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground">
        {activa ? "Abierta en la demo" : "Probar esta escena"}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </button>
  );
}
