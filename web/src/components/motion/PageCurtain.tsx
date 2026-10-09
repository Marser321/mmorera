"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MonogramaFundido } from "@/components/marca/MonogramaFundido";
import { PalabraEco } from "@/components/marca/PalabraEco";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/* La palabra eco de cada destino. El home va solo con el monograma. */
const PALABRAS: Array<{ ruta: string; es: string; en: string; exacta?: boolean }> = [
  { ruta: "/casos-de-exito", es: "Trabajo", en: "Work", exacta: true },
  { ruta: "/casos-de-exito/", es: "Caso", en: "Case" },
  { ruta: "/sistemas", es: "Sistemas", en: "Systems" },
  { ruta: "/estudio", es: "Estudio", en: "Studio" },
  { ruta: "/aplicar", es: "Hablemos", en: "Let’s talk" },
  { ruta: "/privacidad", es: "Privacidad", en: "Privacy" },
];

function palabraDe(pathname: string): string | null {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const ruta = isEn ? pathname.slice(3) || "/" : pathname;
  const hit = PALABRAS.find((p) => (p.exacta ? ruta === p.ruta : ruta.startsWith(p.ruta)));
  return hit ? (isEn ? hit.en : hit.es) : null;
}

// Cuánto queda quieta la cortina antes de levantarse: lo justo para leer la palabra.
const HOLD_MS = 460;

/**
 * Cortina de transición entre páginas: cuando cambia la ruta, cubre la página
 * nueva antes del primer paint y se levanta revelándola. Es el momento de
 * marca: pared con grano, la palabra del destino en contorno y el monograma
 * fundido (así los heroes quedan libres para las partículas). La primera
 * carga no lleva cortina (el LCP no espera a ningún overlay). Solo transform
 * + opacity (regla 2 de lib/motion.ts) y nada con prefers-reduced-motion.
 */
export function PageCurtain() {
  const reduced = useReducedMotionSafe();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    // Pestaña oculta = sin requestAnimationFrame: la cortina no podría levantarse.
    if (reduced || document.hidden) return;
    // Antes del paint: la ruta nueva nunca aparece descubierta un frame.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tiene que ser síncrono, antes del primer paint
    setVisible(true);
  }, [pathname, reduced]);

  // El levantado vive aparte: si el efecto de arriba se re-ejecuta (p. ej. al
  // resolverse reduced-motion), no cancela el timer y la cortina no queda pegada.
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const palabra = palabraDe(pathname);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="curtain"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[150] overflow-hidden bg-background"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT }}
        >
          {/* Grano de pared: la cortina tapa la capa global, lleva el suyo. */}
          <div className="absolute inset-0 bg-[url('/social/grano.png')] bg-[length:384px_384px] opacity-[.055]" />

          {palabra && (
            <motion.div
              className="absolute inset-x-0 top-[16%]"
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <PalabraEco className="pl-[2vw]">{palabra}</PalabraEco>
            </motion.div>
          )}

          <div className="absolute inset-0 grid place-items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <MonogramaFundido className="w-[min(56vw,400px)]" />
            </motion.div>
          </div>

          {/* Hilo con punto: el hilo se dibuja desde el punto mientras la cortina espera. */}
          <div className="absolute bottom-[12%] left-[8%] right-[8%]">
            <span className="absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-full bg-foreground" />
            <motion.div
              className="h-px origin-left bg-[rgb(var(--ink-rgb)/0.18)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: HOLD_MS / 1000, ease: EASE_OUT }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
