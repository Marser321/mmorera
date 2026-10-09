"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MonogramaFundido } from "@/components/marca/MonogramaFundido";
import { PalabraEco } from "@/components/marca/PalabraEco";
import { LOGO_PATHS, LOGO_RING, LOGO_VIEWBOX } from "@/data/brand/logoPaths";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/* La palabra eco de cada destino. El home va solo con el sello. */
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

/* Tiempos del sello, en segundos desde que cae la cortina. */
const TRAZO = { inicio: 0.05, duracion: 0.42, escalon: 0.07 } as const;
const GOLPE = 0.46; // el sello se estampa: entra la piedra y sale la onda
const ASENTADO = 0.3; // lo que tarda en volver a su tamaño después del golpe
// La cortina se levanta cuando el sello quedó estampado, más un respiro. Si el
// hilo principal está ocupado (hidratando la página nueva), el sello se atrasa
// con él; el tope evita que la cortina quede puesta de más.
const RESPIRO_MS = 140;
const TOPE_MS = 1600;

/* El anillo no está centrado en su caja (la V sale hacia la derecha): el sello
   se corre para que el centro del anillo caiga en el centro de la pantalla. */
const ANILLO = { x: LOGO_RING.cx / LOGO_VIEWBOX.width, y: LOGO_RING.cy / LOGO_VIEWBOX.height };
const CENTRADO = `${((0.5 - ANILLO.x) * 100).toFixed(2)}% ${((0.5 - ANILLO.y) * 100).toFixed(2)}%`;

/**
 * Sello de la puerta: el monograma se dibuja trazo a trazo (anillo, corona,
 * pilar), se estampa con la piedra y deja una onda, como un lacre.
 */
function Sello({ onSellado }: { onSellado: () => void }) {
  const trazos = [LOGO_PATHS.ring, LOGO_PATHS.crown, LOGO_PATHS.pillar];
  const total = GOLPE + ASENTADO;
  return (
    // Caja quieta: solo centra. El golpe (escala) va adentro, con origen en el anillo.
    <div
      className="relative w-[min(52vw,320px)]"
      style={{ aspectRatio: `${LOGO_VIEWBOX.width} / ${LOGO_VIEWBOX.height}`, translate: CENTRADO }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ originX: ANILLO.x, originY: ANILLO.y }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1, 1.07, 1] }}
        transition={{ duration: total, times: [0, (GOLPE - 0.08) / total, GOLPE / total, 1], ease: EASE_OUT }}
      >
        {/* La piedra: entra con el golpe. */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: GOLPE, duration: 0.24, ease: EASE_OUT }}
          onAnimationComplete={onSellado}
        >
          <MonogramaFundido fundido="sello" className="h-full w-full" />
        </motion.div>

        <svg
          viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
          className="absolute inset-0 h-full w-full overflow-visible text-foreground"
          fill="none"
          aria-hidden="true"
        >
          {/* La onda del golpe: un aro fino que se abre y se apaga. */}
          <motion.circle
            cx={LOGO_RING.cx}
            cy={LOGO_RING.cy}
            r={LOGO_RING.outerRadius + 36}
            stroke="currentColor"
            strokeWidth={7}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.45, 0], scale: [1, 1.04, 1.22] }}
            transition={{ delay: GOLPE, duration: 0.62, ease: EASE_OUT }}
          />
          {/* El dibujo: el contorno de cada trazo, uno tras otro. */}
          {trazos.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="currentColor"
              strokeOpacity={0.7}
              strokeWidth={9}
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: TRAZO.inicio + i * TRAZO.escalon, duration: TRAZO.duracion, ease: EASE_IN_OUT }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Hilo con punto bajo el anillo: se abre desde el punto hacia los lados. */}
      <div
        className="absolute top-[calc(100%+2.75rem)] w-[min(40vw,260px)] -translate-x-1/2"
        style={{ left: `${(ANILLO.x * 100).toFixed(2)}%` }}
      >
        <motion.div
          className="h-px bg-[rgb(var(--ink-rgb)/0.22)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE_OUT }}
        />
        <span className="absolute left-1/2 top-[-3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-foreground" />
      </div>
    </div>
  );
}

/**
 * Cortina de transición entre páginas: cuando cambia la ruta, cubre la página
 * nueva antes del primer paint y se levanta revelándola. Es el momento de
 * marca: pared con grano, la palabra del destino en contorno y el sello del
 * monograma (así los heroes quedan libres para las partículas). La primera
 * carga no lleva cortina (el LCP no espera a ningún overlay) y nada corre con
 * prefers-reduced-motion. El dibujo del sello es un SVG chico (pathLength);
 * sobre la pantalla entera, solo transform + opacity (regla 2 de lib/motion.ts).
 */
export function PageCurtain() {
  const reduced = useReducedMotionSafe();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const respiro = useRef<number | undefined>(undefined);

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
  // Lo normal es que la levante el sello (onSellado); el tope es el seguro.
  useEffect(() => {
    if (!visible) return;
    const tope = window.setTimeout(() => setVisible(false), TOPE_MS);
    return () => {
      window.clearTimeout(tope);
      window.clearTimeout(respiro.current);
    };
  }, [visible]);

  const sellado = useCallback(() => {
    window.clearTimeout(respiro.current);
    respiro.current = window.setTimeout(() => setVisible(false), RESPIRO_MS);
  }, []);

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

          {/* La palabra del destino, centrada detrás del sello (si no entra, se recorta parejo). */}
          {palabra && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              >
                <PalabraEco className="text-[clamp(5rem,17vw,17rem)]">{palabra}</PalabraEco>
              </motion.div>
            </div>
          )}

          {/* El sello sube con la cortina, como el lacre de una puerta que se abre. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sello onSellado={sellado} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
