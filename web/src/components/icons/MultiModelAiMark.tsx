import type { IconType } from 'react-icons';

/** Marca neutral para representar selección y orquestación de modelos de IA. */
export const MultiModelAiMark: IconType = ({
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
        <path
            d="M2 54 17 10h11l15 44H32l-3-10H16l-3 10H2Zm17-20h7l-3.5-12L19 34Z"
            fill={color}
            fillRule="evenodd"
        />
        <path d="M46 10h10v44H46V10Z" fill={color} />
        <path d="M69 20h7v11h11v7H76v11h-7V38H58v-7h11V20Z" fill={color} />
    </svg>
);
