"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_OUT } from "@/lib/motion";

/**
 * Etiqueta que acompaña al cursor sobre elementos con `data-cursor-label`
 * ("Ver caso", "Siguiente"…). No reemplaza el cursor nativo: solo aparece
 * sobre esos destinos. Desktop con puntero fino y sin reduced-motion.
 */
export function CursorLabel() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const x = useSpring(pointerX, { stiffness: 420, damping: 34, mass: 0.5 });
  const y = useSpring(pointerY, { stiffness: 420, damping: 34, mass: 0.5 });
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor-label]");
      setLabel(target?.dataset.cursorLabel ?? null);
    };
    const onLeave = () => setLabel(null);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, pointerX, pointerY]);

  if (!enabled) return null;

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[120]" style={{ x, y }}>
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            className="absolute left-4 top-4 whitespace-nowrap rounded-full bg-signal px-3.5 py-1.5 text-xs font-semibold text-background shadow-[0_0_30px_rgba(113,243,162,0.35)]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
