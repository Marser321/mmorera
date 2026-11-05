"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Play } from "lucide-react";

export interface EmbedFacadeProps {
  /** Dirección que se embebe al abrir. */
  src: string;
  /** Dirección para verlo aparte. */
  href?: string;
  /** Nombre del marco para lectores de pantalla. */
  title: string;
  /** Texto del botón que lo abre. */
  openLabel: string;
  /** Enlace para verlo aparte, por si el navegador bloquea el marco. Sin esto, el enlace va en otro lugar de la página. */
  newTabLabel?: string;
  /** Imagen propia: la política de contenido solo admite imágenes del sitio. */
  poster?: { src: string; alt: string };
  /** Línea chica sobre la imagen o el fondo: qué es lo que se va a abrir. */
  hint?: string;
  /** Permisos del marco, por ejemplo el giroscopio de un visor 360. */
  allow?: string;
  /** Proporción y alturas del marco. */
  frameClassName?: string;
  /** Fondo dibujado para lo que no tiene imagen propia. */
  children?: ReactNode;
}

/**
 * Fachada de un contenido de otro sitio. Nada externo se carga, ni pone cookies,
 * hasta que la persona lo abre: así lo promete la página de cookies y así la
 * página sigue liviana.
 */
export function EmbedFacade({ src, href, title, openLabel, newTabLabel, poster, hint, allow, frameClassName = "aspect-[4/5] sm:aspect-video", children }: EmbedFacadeProps) {
  const [open, setOpen] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  // El botón desaparece al abrir: el foco del teclado pasa al contenido, no al inicio de la página.
  useEffect(() => {
    if (open) frame.current?.focus();
  }, [open]);

  return (
    <div>
      <div className={`relative overflow-hidden rounded-2xl border border-foreground/15 bg-card ${frameClassName}`}>
        {open ? (
          <iframe
            ref={frame}
            src={src}
            title={title}
            allow={allow}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            className="absolute inset-0 h-full w-full border-0 bg-background"
          />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group absolute inset-0 flex h-full w-full cursor-pointer flex-col justify-end text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {poster && (
              // eslint-disable-next-line @next/next/no-img-element -- portada liviana; la imagen ya viene al tamaño justo
              <img src={poster.src} alt={poster.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" />
            )}
            {children}
            {/* Oscurece la base para que el botón se lea sobre cualquier foto. */}
            {poster && <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />}
            <span className="relative flex flex-wrap items-center gap-x-4 gap-y-3 p-5 sm:p-8">
              <span className={`inline-flex min-h-12 items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-colors group-hover:bg-signal group-hover:text-[#0B0B0A] ${poster ? "bg-[#ECE7DD] text-[#0B0B0A]" : "bg-foreground text-background"}`}>
                <Play aria-hidden="true" className="h-4 w-4" />
                {openLabel}
              </span>
              {hint && <span className={`font-mono text-[10px] uppercase tracking-[.16em] ${poster ? "text-[#ECE7DD]/85" : "text-foreground/70"}`}>{hint}</span>}
            </span>
          </button>
        )}
      </div>
      {href && newTabLabel && (
        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {newTabLabel}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
