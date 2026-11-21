"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { origenDeLaVisita, type EventoDemo } from "@/lib/origen";

const sinCambios = () => () => {};

/**
 * Registra la visita a una página de demos y lo que pasa en ella (entrar a la
 * demo, elegir una escena, ir a hablar). Va a /api/visita con sendBeacon: no
 * frena la página, no usa cookies y no guarda la IP.
 */
export function useVisitaDemo(pagina: string) {
  // El origen no cambia mientras la página está abierta: en el servidor es null.
  const de = useSyncExternalStore(sinCambios, origenDeLaVisita, () => null);
  const enviados = useRef(new Set<string>());

  const registrar = useCallback(
    (evento: EventoDemo, detalle?: string) => {
      const clave = `${evento}:${detalle ?? ""}`;
      if (enviados.current.has(clave)) return;
      enviados.current.add(clave);
      const cuerpo = JSON.stringify({ pagina, evento, de: origenDeLaVisita(), detalle: detalle ?? null });
      try {
        const blob = new Blob([cuerpo], { type: "application/json" });
        if (navigator.sendBeacon?.("/api/visita", blob)) return;
      } catch {
        // Sin sendBeacon: fetch con keepalive.
      }
      void fetch("/api/visita", { method: "POST", body: cuerpo, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    },
    [pagina],
  );

  useEffect(() => {
    registrar("vista");
  }, [registrar]);

  return { de, registrar };
}
