"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMM } from "@/components/shared/LogoMM";
import { EASE_IN_OUT } from "@/lib/motion";

/**
 * Cortina de transición entre páginas: cuando cambia la ruta, cubre la página
 * nueva antes del primer paint y se levanta revelándola. La primera carga no
 * lleva cortina (el LCP no espera a ningún overlay). Solo transform + opacity
 * (regla 2 de lib/motion.ts) y nada con prefers-reduced-motion.
 */
export function PageCurtain() {
  const reduced = useReducedMotion();
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
    const timer = window.setTimeout(() => setVisible(false), 260);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="curtain"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[150] grid place-items-center bg-background"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT }}
        >
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: EASE_IN_OUT }}
            className="text-foreground"
          >
            <LogoMM className="h-12 w-12" animated={false} />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-signal/60" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
