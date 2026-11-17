import type { IconBaseProps } from "react-icons";
import { STAGE_FRAME_NAME } from "@/lib/particleStage";
import type { Tech } from "./techStack";

/**
 * Glifo del escenario del hero: el marco que las partículas arman alrededor de
 * la ventana de cine. Es un rectángulo de esquinas redondas, en 4:3 como la
 * ventana: una sola banda, porque todo lo que caiga por dentro queda tapado
 * por la ventana. Vive fuera de TECH_STACK para no aparecer en órbitas ni listas.
 */
export const STAGE_FRAME = { width: 400, height: 300, stroke: 9, radius: 30 } as const;

function FrameGlyph({ color = "currentColor", size = "1em", className }: IconBaseProps) {
  const { width, height, stroke, radius } = STAGE_FRAME;
  const half = stroke / 2;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} width={size} height={size} fill="none" stroke={color} className={className} aria-hidden="true">
      <rect x={half} y={half} width={width - stroke} height={height - stroke} rx={radius} strokeWidth={stroke} />
    </svg>
  );
}

export const STAGE_GLYPH_TECHS: Tech[] = [{ name: STAGE_FRAME_NAME, category: "Web", Icon: FrameGlyph }];
