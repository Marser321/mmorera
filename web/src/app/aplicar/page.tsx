import { AplicarOS } from '@/components/portfolio-isolated/AplicarOS';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Aplicar | Mario Morera',
    description: 'Brief de calificación: contame tu operación, tu desafío y tu timeline. Te respondo con una propuesta concreta.',
};

/** /aplicar — Embudo AplicarOS (form multi-step estilo render queue), track-aware. */
export default function ApplicationPage() {
    return (
        <main id="contenido-principal" className="min-h-screen">
            <AplicarOS />
        </main>
    );
}
