import { EstudioHero } from '@/components/sections/EstudioHero';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const AboutTimeline = dynamic(() => import('@/components/portfolio-isolated/AboutTimeline').then(mod => mod.AboutTimeline));

export const metadata: Metadata = {
    title: 'Estudio | Mario Morera — Diseño, Video & Motion',
    description: 'Diseño web, video de alto impacto, motion graphics e identidad visual. Piezas premium listas para competir a nivel global.',
};

/** /estudio — Track creativo: hero + trayectoria (timeline). */
export default function EstudioPage() {
    return (
        <main id="contenido-principal">
            <EstudioHero />
            <AboutTimeline />
        </main>
    );
}
