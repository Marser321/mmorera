import type { IconBaseProps } from "react-icons";
import { LOGO_PATHS, LOGO_RING, LOGO_VIEWBOX } from "@/data/brand/logoPaths";
import type { Tech } from "./techStack";

/**
 * Glifos de marca para el campo de partículas: la obertura del home. Primero
 * el interior del monograma girado -90° (la corona se lee «>» y el cuerpo
 * «Σ», con su cursor: un prompt de código) y después la doble M derecha, con
 * su anillo. Es la entrada del monograma de /sobre-mi contada con polvo.
 * Viven fuera de TECH_STACK para no aparecer en órbitas ni listas.
 */

const { width, height } = LOGO_VIEWBOX;
const { cx, cy, outerRadius, width: ringWidth } = LOGO_RING;
const CORE = outerRadius - ringWidth - 8;
const ALL_PATHS = [LOGO_PATHS.ring, LOGO_PATHS.crown, LOGO_PATHS.pillar];

function MonogramGlyph({ color = "currentColor", size = "1em", className }: IconBaseProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} width={size} height={size} fill={color} className={className} aria-hidden="true">
      {ALL_PATHS.map((d) => <path key={d.slice(0, 16)} d={d} />)}
    </svg>
  );
}

function PromptGlyph({ color = "currentColor", size = "1em", className }: IconBaseProps) {
  // Lienzo: el núcleo del anillo más un margen a la derecha para el cursor.
  const left = cx - CORE;
  const top = cy - CORE;
  const span = CORE * 2;
  const cursor = { x: cx + CORE * 1.02, width: CORE * 0.13, height: CORE * 0.42 };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${left} ${top} ${span * 1.18} ${span}`} width={size} height={size} fill={color} className={className} aria-hidden="true">
      <defs>
        <clipPath id="obertura-nucleo">
          <circle cx={cx} cy={cy} r={CORE} />
        </clipPath>
      </defs>
      <g clipPath="url(#obertura-nucleo)" transform={`rotate(-90 ${cx} ${cy})`}>
        {ALL_PATHS.map((d) => <path key={d.slice(0, 16)} d={d} />)}
      </g>
      <rect x={cursor.x} y={cy - cursor.height / 2} width={cursor.width} height={cursor.height} />
    </svg>
  );
}

export const BRAND_GLYPHS = {
  prompt: { name: "brand:prompt", category: "Web", Icon: PromptGlyph },
  monogram: { name: "brand:mm", category: "Web", Icon: MonogramGlyph },
} satisfies Record<string, Tech>;

export const BRAND_GLYPH_TECHS: Tech[] = Object.values(BRAND_GLYPHS);
