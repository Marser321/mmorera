import type { IconType } from 'react-icons';

/** Marca estilizada para GoHighLevel (GHL) en el stack de CRM. */
export const GhlMark: IconType = ({
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
        {/* GHL estilizado */}
        <path
            d="M8 14h20v8H16v20h12V30H20v-8h16v26H8V14Z"
            fill={color}
            fillRule="evenodd"
        />
        <path
            d="M40 14h8v13h8V14h8v34h-8V35h-8v13h-8V14Z"
            fill={color}
        />
        <path
            d="M68 14h8v26h12v8H68V14Z"
            fill={color}
        />
        <circle cx="82" cy="18" r="4" fill={color} />
    </svg>
);
