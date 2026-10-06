import type { CSSProperties } from "react";
import { LOGO_PATHS, LOGO_RING, LOGO_VIEWBOX } from "@/data/brand/logoPaths";
import { FILM_COLORS, tint } from "./theme";

/**
 * Monograma MM animable por partes. Dos máscaras separan el anillo del
 * interior: el anillo se dibuja como un trazo (dashoffset) y el interior se
 * revela con un barrido, así la doble M puede aparecer primero sola —girada,
 * se lee como un prompt de código (>)— y recién después cerrarse en el sello.
 */
export function LogoMark({
  id,
  size,
  ring,
  interior,
  rotation = 0,
  interiorColor = FILM_COLORS.fg,
  ringColor = FILM_COLORS.fg,
  glow = 0,
  style,
}: {
  /** Único por composición: prefijo de las máscaras SVG. */
  id: string;
  /** Ancho en px de la composición. */
  size: number;
  /** 0→1: cuánto del anillo está dibujado. */
  ring: number;
  /** 0→1: barrido que revela el interior (de arriba a abajo en el eje del logo). */
  interior: number;
  rotation?: number;
  interiorColor?: string;
  ringColor?: string;
  glow?: number;
  style?: CSSProperties;
}) {
  const { width, height } = LOGO_VIEWBOX;
  const { cx, cy, outerRadius, width: ringWidth } = LOGO_RING;
  const ringRadius = outerRadius - ringWidth / 2;
  const coreRadius = outerRadius - ringWidth - 8;
  const paths = [LOGO_PATHS.ring, LOGO_PATHS.crown, LOGO_PATHS.pillar];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={(size * height) / width}
      style={{
        overflow: "visible",
        rotate: `${rotation}deg`,
        transformOrigin: `${(cx / width) * 100}% ${(cy / height) * 100}%`,
        filter: glow > 0 ? `drop-shadow(0 0 ${size * 0.04 * glow}px ${tint(FILM_COLORS.signal, 70 * glow)})` : undefined,
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        <mask id={`${id}-ring`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <circle
            cx={cx}
            cy={cy}
            r={ringRadius}
            fill="none"
            stroke="white"
            strokeWidth={ringWidth + 36}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - ring}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </mask>
        <clipPath id={`${id}-core-disc`}>
          <circle cx={cx} cy={cy} r={coreRadius} />
        </clipPath>
        <mask id={`${id}-core`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <rect x={0} y={cy - coreRadius} width={width} height={coreRadius * 2 * interior} fill="white" clipPath={`url(#${id}-core-disc)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-ring)`} fill={ringColor}>
        {paths.map((d) => <path key={`ring-${d.slice(0, 12)}`} d={d} />)}
      </g>
      <g mask={`url(#${id}-core)`} fill={interiorColor}>
        {paths.map((d) => <path key={`core-${d.slice(0, 12)}`} d={d} />)}
      </g>
    </svg>
  );
}
