import { EstudioHero } from '@/components/sections/EstudioHero';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const AboutTimeline = dynamic(() => import('@/components/portfolio-isolated/AboutTimeline').then(mod => mod.AboutTimeline));
const CreativeServices = dynamic(() => import('@/components/sections/CreativeServices').then(mod => mod.CreativeServices));
const ProcessFilm = dynamic(() => import('@/components/sections/ProcessFilm').then(mod => mod.ProcessFilm));
const CrossTrackBridge = dynamic(() => import('@/components/sections/CrossTrackBridge').then(mod => mod.CrossTrackBridge));

export const metadata: Metadata = {
    title: 'Estudio | Mario Morera — Diseño, Video & Motion',
    description: 'Diseño web, video de alto impacto, motion graphics e identidad visual. Piezas premium listas para competir a nivel global.',
};

/** /estudio — Track creativo: hero + trayectoria (timeline) + servicios + proceso. */
export default function EstudioPage() {
    return (
        <main id="contenido-principal">
            <EstudioHero />
            <AboutTimeline />
            <CreativeServices />
            <ProcessFilm />
            <CrossTrackBridge to="software" />
        </main>
    );
}
