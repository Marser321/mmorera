"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type DeferredMountOptions = {
  /** Margen del observador "cerca del viewport" (default: 300px arriba y abajo). */
  rootMargin?: string;
  /** Fracción visible a partir de la cual se avisa `onVisibleChange(true)` (default 0.35). */
  visibleRatio?: number;
  /** Se llama cada vez que el elemento entra o sale de la zona visible. */
  onVisibleChange?: (visible: boolean) => void;
};

const INTERACTION_EVENTS = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const;

/**
 * Monta lo pesado (un Player de Remotion, un diagrama interactivo) recién
 * cuando hace falta: cuando el elemento ya se ve, o cuando está cerca y la
 * persona empezó a recorrer la página (scroll, toque, tecla). Sin
 * interacción, nada se evalúa fuera de pantalla y no compite con la carga
 * inicial. Una vez montado queda montado.
 *
 * Devuelve true a partir de ese momento. `onVisibleChange` sigue avisando
 * la visibilidad (umbral `visibleRatio`) mientras el elemento exista.
 */
export function useDeferredMount(ref: RefObject<Element | null>, options: DeferredMountOptions = {}) {
  const { rootMargin = "300px 0px", visibleRatio = 0.35, onVisibleChange } = options;
  const [mounted, setMounted] = useState(false);
  const visibleRef = useRef(onVisibleChange);

  useEffect(() => {
    visibleRef.current = onVisibleChange;
  }, [onVisibleChange]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let near = false;
    let interacted = false;
    const onInteract = () => {
      interacted = true;
      if (near) setMounted(true);
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, onInteract));
    };
    INTERACTION_EVENTS.forEach((type) => window.addEventListener(type, onInteract, { passive: true }));

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near && interacted) setMounted(true);
      },
      { rootMargin },
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
        visibleRef.current?.(entry.isIntersecting && entry.intersectionRatio >= visibleRatio);
      },
      { threshold: [0, visibleRatio] },
    );
    nearObserver.observe(element);
    visibilityObserver.observe(element);
    return () => {
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, onInteract));
      nearObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [ref, rootMargin, visibleRatio]);

  return mounted;
}
