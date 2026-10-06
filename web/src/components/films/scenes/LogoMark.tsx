import type { CSSProperties } from "react";
import { LOGO_PATHS, LOGO_RING, LOGO_VIEWBOX } from "@/data/brand/logoPaths";
import { FILM_COLORS, tint } from "./theme";

/**
 * Monograma MM animable por partes. El anillo se dibuja como un trazo
 * (dashoffset) y el interior se divide en dos piezas: la corona (la V) y el
 * cuerpo de la M. Girado -90°, la corona se lee como una flecha de código
 * (">") y el cuerpo como "Σ": entran desde lados opuestos, se unen y el
 * glifo gira hasta ser la M.
 */
export function LogoMark({
  id,
  size,
  ring,
  interior = 1,
  rotation = 0,
  crownShift = 0,
  bodyShift = 0,
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
  interior?: number;
  rotation?: number;
  /** Desplazamiento de la corona en el eje del logo (fracción del alto; negativo = hacia arriba). */
  crownShift?: number;
  /** Desplazamiento del cuerpo de la M (fracción del alto; positivo = hacia abajo). */
  bodyShift?: number;
  interiorColor?: string;
  ringColor?: string;
  glow?: number;
  style?: CSSProperties;
}) {
  const { width, height } = LOGO_VIEWBOX;
  const { cx, cy, outerRadius, width: ringWidth } = LOGO_RING;
  const ringRadius = outerRadius - ringWidth / 2;
  const coreRadius = outerRadius - ringWidth - 8;
  const allPaths = [LOGO_PATHS.ring, LOGO_PATHS.crown, LOGO_PATHS.pillar];
  const pieces = [
    { key: "crown", paths: [LOGO_PATHS.crown], shift: crownShift },
    { key: "body", paths: [LOGO_PATHS.ring, LOGO_PATHS.pillar], shift: bodyShift },
  ];

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
        {/* La máscara del interior viaja con cada pieza (se define en sus coordenadas). */}
        <mask id={`${id}-core`} maskUnits="userSpaceOnUse" x={-width} y={-height * 2} width={width * 3} height={height * 5}>
          <rect x={0} y={cy - coreRadius} width={width} height={coreRadius * 2 * interior} fill="white" clipPath={`url(#${id}-core-disc)`} />
        </mask>
      </defs>

      <g mask={`url(#${id}-ring)`} fill={ringColor}>
        {allPaths.map((d) => <path key={`ring-${d.slice(0, 12)}`} d={d} />)}
      </g>

      {pieces.map((piece) => {
        const offset = piece.shift * height;
        const moving = Math.abs(piece.shift) > 0.001;
        // Estela: copias que quedan atrás mientras la pieza viaja.
        const ghosts = moving ? [0.16, 0.32, 0.5] : [];
        return (
          <g key={piece.key} fill={interiorColor}>
            {ghosts.map((lag, index) => (
              <g key={lag} transform={`translate(0 ${offset * (1 + lag)})`} opacity={0.22 - index * 0.06}>
                <g mask={`url(#${id}-core)`}>{piece.paths.map((d) => <path key={d.slice(0, 12)} d={d} />)}</g>
              </g>
            ))}
            <g transform={`translate(0 ${offset})`}>
              <g mask={`url(#${id}-core)`}>{piece.paths.map((d) => <path key={d.slice(0, 12)} d={d} />)}</g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
