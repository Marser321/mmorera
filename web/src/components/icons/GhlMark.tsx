import type { IconType } from "react-icons";

interface GhlMarkProps extends React.SVGAttributes<SVGElement> {
  size?: string | number;
  color?: string;
  useBrandColors?: boolean;
}

/**
 * Logotipo oficial de GoHighLevel (HighLevel):
 * Los tres pilares ascendentes icónicos en flecha / tejado.
 * Compatible con IconType de react-icons y TechParticleField sampleIcon.
 */
export const GhlMark: IconType = ({
  size = "1em",
  color = "currentColor",
  ...props
}) => {
  const isMultiColor = (props as GhlMarkProps).useBrandColors;

  return (
    <svg
      {...props}
      aria-hidden={props["aria-label"] ? undefined : true}
      fill="none"
      height={size}
      viewBox="32 38 136 123"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pilar izquierdo */}
      <path
        d="M72.13 112.80L71.82 157.63A0.37 0.36 90 0 1 71.46 158.00L53.71 158.00A0.64 0.64 0 0 1 53.07 157.36L52.85 137.38L52.82 70.04A0.57 0.57 0 0 0 52.25 69.47L34.85 69.47A0.55 0.55 0 0 1 34.46 68.53L62.08 40.91A0.58 0.57 44.6 0 1 62.89 40.91L90.50 68.52A0.56 0.55 67.4 0 1 90.11 69.47L72.42 69.47A0.29 0.29 0 0 0 72.13 69.76L72.13 112.80ZM69.77 83.73A0.69 0.68 3.7 0 0 70.58 83.02L69.96 71.34A1.56 1.55 -1.5 0 0 68.40 69.87L55.96 69.87A0.65 0.65 0 0 0 55.48 70.95Q60.22 76.15 67.08 82.22Q68.53 83.51 69.77 83.73Z"
        fill={isMultiColor ? "#FFBA08" : color}
      />
      {/* Pilar central (más alto) */}
      <path
        d="M127.64 112.48L111.38 112.66A1.05 1.04 -0.3 0 0 110.34 113.70L110.34 157.74A0.79 0.78 -90 0 1 109.56 158.53L91.45 158.53A0.80 0.80 0 0 1 90.65 157.73L90.65 113.75A1.07 1.07 0 0 0 89.59 112.68L73.34 112.52Q72.25 111.72 73.70 110.19Q86.92 96.28 99.35 84.46A1.62 1.62 0 0 1 101.57 84.46Q115.21 97.47 127.71 110.52Q128.88 111.74 127.64 112.48ZM93.79 112.70A0.84 0.84 0 0 0 93.22 114.16L107.17 126.93A0.84 0.84 0 0 0 108.58 126.31L108.58 113.54A0.84 0.84 0 0 0 107.74 112.70L93.79 112.70Z"
        fill={isMultiColor ? "#1E88E5" : color}
      />
      {/* Pilar derecho */}
      <path
        d="M148.28 127.95L147.93 157.94A0.51 0.50 0 0 1 147.42 158.44L129.95 158.44A1.10 1.09 89.7 0 1 128.86 157.35L128.83 112.71L128.75 70.34A0.73 0.73 0 0 0 128.02 69.61L110.96 69.61A0.69 0.69 0 0 1 110.47 68.43L137.97 40.93A0.83 0.82 -44.8 0 1 139.14 40.93Q161.35 63.19 165.24 67.00Q166.15 67.90 165.93 68.97A0.81 0.80 6.2 0 1 165.14 69.60L148.81 69.60A0.57 0.57 0 0 0 148.24 70.18L148.28 127.95Z"
        fill={isMultiColor ? "#2EC4B6" : color}
      />
    </svg>
  );
};
