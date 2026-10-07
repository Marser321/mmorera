"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Preferencia de movimiento reducido, segura para la hidratación: el servidor
 * y el primer render del cliente dicen `false` (el mismo HTML) y recién
 * después React vuelve a renderizar con la preferencia real. El
 * `useReducedMotion` de framer-motion lee la preferencia ya en el primer
 * render del cliente, y eso rompía la hidratación de todo el sitio para
 * quien tiene activado "reducir movimiento".
 *
 * Las animaciones CSS ya se apagan solas con `prefers-reduced-motion` (ver
 * globals.css) y framer-motion respeta la preferencia por `MotionConfig`.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
