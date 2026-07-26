import type { IconType } from 'react-icons';

/** Marca estilizada para Hermes (Nous Research / Agentes de IA). */
export const HermesMark: IconType = ({
    size = '1em',
    color = 'currentColor',
    ...props
}) => (
    <svg
        {...props}
        aria-hidden={props['aria-label'] ? undefined : true}
        fill="none"
        height={size}
        viewBox="0 0 88 64"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Símbolo de Hermes: H y alas de Mercurio tech / nodo de agente autónomo */}
        <path
            d="M12 12h10v16h20V12h10v40H42V36H22v16H12V12Z"
            fill={color}
        />
        {/* Ala derecha superior */}
        <path
            d="M56 12l20 10-12 10 20 6-28 10V12Z"
            fill={color}
            opacity="0.9"
        />
        {/* Núcleo de agente / orb */}
        <circle cx="32" cy="28" r="5" fill={color} />
    </svg>
);
