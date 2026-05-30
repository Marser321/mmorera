'use client';

import type { ReactNode } from 'react';

interface SplitTextProps {
    text: string;
    by?: 'word' | 'char';
    className?: string;
    /** Renderiza cada unidad (palabra o caracter) como un nodo animado. */
    render: (unit: string, index: number, total: number) => ReactNode;
}

/**
 * Divide texto manteniendo accesibilidad: una copia real `sr-only` para lectores
 * de pantalla + las unidades animadas marcadas `aria-hidden`. En modo 'word'
 * inserta un espacio no separable entre palabras (los <span> inline-block no lo
 * conservan solos).
 */
export function SplitText({ text, by = 'word', className, render }: SplitTextProps) {
    const units = by === 'word' ? text.trim().split(/\s+/) : Array.from(text);
    const total = units.length;

    return (
        <span className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {units.map((unit, i) => (
                    <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                        {render(unit, i, total)}
                        {by === 'word' && i < total - 1 ? ' ' : ''}
                    </span>
                ))}
            </span>
        </span>
    );
}
