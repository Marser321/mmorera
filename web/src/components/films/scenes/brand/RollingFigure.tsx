import { rollingSteps } from "./layout/rolling";

/**
 * Cifra que entra carácter por carácter, cada uno subiendo por su máscara.
 * Siempre muestra los caracteres del valor final (nunca un conteo con valores
 * intermedios): un cuadro pausado nunca enseña un dato que no existe.
 */
export function RollingFigure({ text, progress, stagger }: { text: string; progress: number; stagger?: number }) {
  const chars = Array.from(text);
  const steps = rollingSteps(chars.length, progress, stagger);
  return (
    <span style={{ display: "inline-flex", whiteSpace: "pre" }} aria-label={text}>
      {chars.map((char, index) => (
        <span key={index} aria-hidden style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.06em" }}>
          <span style={{ display: "inline-block", translate: `0 ${(1 - steps[index]) * 105}%`, opacity: Math.min(1, steps[index] * 1.6) }}>{char}</span>
        </span>
      ))}
    </span>
  );
}
