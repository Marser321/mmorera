import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* Hacia dónde se funde el monograma contra la pared. */
const FUNDIDOS = {
  abajo: "linear-gradient(to bottom, #000 28%, transparent 92%)",
  arriba: "linear-gradient(to top, #000 28%, transparent 92%)",
  /* Para el pie: la mitad de arriba ya es pared, así el recorte del pie no se ve. */
  pie: "linear-gradient(to top, #000 8%, transparent 58%)",
  izquierda: "linear-gradient(to left, #000 32%, transparent 96%)",
  derecha: "linear-gradient(to right, #000 32%, transparent 96%)",
  diagonal: "linear-gradient(160deg, #000 24%, transparent 86%)",
} as const;

type Props = {
  /** `marco`: protagonista (85 %). `marca`: marca de agua (18 %). */
  intensidad?: "marco" | "marca";
  fundido?: keyof typeof FUNDIDOS;
  /** Tamaño y posición (el alto sale de la proporción del logo). */
  className?: string;
};

/**
 * MonogramaFundido — el MM en blanco roto, con textura de piedra, que se funde
 * hacia la pared. Decorativo: sin JavaScript de cliente y fuera del árbol de
 * accesibilidad. La sección que lo aloja recorta con `overflow-x-clip`.
 */
export function MonogramaFundido({ intensidad = "marco", fundido = "abajo", className }: Props) {
  return (
    <div
      aria-hidden="true"
      data-intensidad={intensidad}
      className={cn("monograma-fundido", className)}
      style={{ "--fundido": FUNDIDOS[fundido] } as CSSProperties}
    />
  );
}
