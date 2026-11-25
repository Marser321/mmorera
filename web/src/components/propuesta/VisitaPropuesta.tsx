"use client";

import { useEffect } from "react";
import { useVisitaDemo } from "@/components/demos/useVisitaDemo";

/**
 * Registra la visita a una propuesta por el mismo camino que las demos
 * (/api/visita → registros, InsForge y n8n): la vista al llegar, el clic en la
 * demo o en un contacto (`data-visita="demo"`, `data-visita="contacto:whatsapp"`)
 * y si llegó a leer el siguiente paso. La página sigue siendo del servidor:
 * esto solo escucha.
 */
export function VisitaPropuesta({ slug }: { slug: string }) {
  const { registrar } = useVisitaDemo(`/p/${slug}`);

  useEffect(() => {
    const alClic = (evento: MouseEvent) => {
      const destino = evento.target instanceof Element ? evento.target.closest("[data-visita]") : null;
      const [tipo, detalle] = (destino?.getAttribute("data-visita") ?? "").split(":");
      if (tipo === "demo" || tipo === "contacto") registrar(tipo, detalle || undefined);
    };
    document.addEventListener("click", alClic);

    const final = document.getElementById("siguiente-paso");
    const observador =
      final && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entradas) => {
              if (entradas.some((e) => e.isIntersecting)) {
                registrar("escena", "final");
                observador?.disconnect();
              }
            },
            { threshold: 0.35 },
          )
        : null;
    if (final) observador?.observe(final);

    return () => {
      document.removeEventListener("click", alClic);
      observador?.disconnect();
    };
  }, [registrar]);

  return null;
}
