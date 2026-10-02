import type { IconType } from "react-icons";

/**
 * Logotipo estilizado de Pipedrive:
 * Círculo verde con la letra 'P' icónica calada al centro.
 */
export const PipedriveMark: IconType = ({
  size = "1em",
  color = "currentColor",
  ...props
}) => (
  <svg
    {...props}
    aria-hidden={props["aria-label"] ? undefined : true}
    fill="none"
    height={size}
    viewBox="0 0 100 100"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M50 0C22.386 0 0 22.386 0 50s22.386 50 50 50 50-22.386 50-50S77.614 0 50 0zm-14 26h15c9.389 0 17 7.611 17 17s-7.611 17-17 17h-7v16h-8V26zm8 8v18h7c4.971 0 9-4.029 9-9s-4.029-9-9-9h-7z"
      fill={color}
      fillRule="evenodd"
    />
  </svg>
);
