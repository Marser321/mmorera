"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// three.js + R3F (~600 KB) fuera del bundle inicial: el campo se descarga y
// monta recién con la página cargada y el navegador ocioso. El contenido (y el
// LCP) nunca esperan al WebGL.
const TechParticleField = dynamic(() => import("./TechParticleField").then((m) => m.TechParticleField), { ssr: false });

const INTERACTION_EVENTS = ["pointerdown", "touchstart", "scroll", "keydown"] as const;

/**
 * Desktop: arranca con la página cargada y el navegador ocioso.
 * Mobile: con la primera interacción o tras 3 s de calma, para no competir
 * con la respuesta inicial al usuario en CPUs modestas.
 */
function useAfterLoadIdle(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idleId: number | undefined;
    let timer: number | undefined;
    const go = () => setReady(true);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const start = () => {
      if (isMobile) {
        INTERACTION_EVENTS.forEach((type) => window.addEventListener(type, go, { once: true, passive: true }));
        timer = window.setTimeout(go, 3000);
        return;
      }
      if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(go, { timeout: 2000 });
      else timer = window.setTimeout(go, 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, go));
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      window.clearTimeout(timer);
    };
  }, []);
  return ready;
}

/* Scrims de profundidad: niebla del color del fondo (grafito en Deep Space,
   marfil en Master Print). `color-mix` sobre el token hace que la atmósfera
   funcione idéntica en ambos temas. */
const mist = (pct: number) => `color-mix(in srgb, var(--color-background) ${pct}%, transparent)`;

export function GlobalBackground() {
  const fieldReady = useAfterLoadIdle();
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background" aria-hidden="true">
      <div className="absolute inset-0">{fieldReady && <TechParticleField />}</div>
      <div
        className="absolute inset-0 max-lg:hidden"
        style={{ background: `linear-gradient(90deg, ${mist(82)} 0%, ${mist(38)} 46%, ${mist(2)} 72%, ${mist(12)} 100%)` }}
      />
      <div
        className="absolute inset-0 lg:hidden"
        style={{ background: `linear-gradient(to bottom, ${mist(42)}, ${mist(8)} 58%, ${mist(48)})` }}
      />
      <div
        className="absolute inset-0"
        // Viñeteado suave: la pared se ve pareja, sin el "fondo de galaxia" en los bordes.
        style={{ background: `radial-gradient(circle at 77% 28%, transparent 0%, ${mist(6)} 38%, ${mist(40)} 86%, ${mist(64)} 100%)` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${mist(2)}, ${mist(56)})` }}
      />
    </div>
  );
}
