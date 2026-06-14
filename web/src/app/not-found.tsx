import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BackgroundVideo } from '@/components/shared/BackgroundVideo';

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-center">
            {/* Video de fondo: 404 holográfico */}
            <BackgroundVideo
                src="/videos/holographic-404.mp4"
                poster="/videos/posters/holographic-404.jpg"
                intensity="cinematic"
                scrim="center"
                tint="violet"
            />

            <div className="relative z-10 flex flex-col items-center">
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-violet-300/80">
                    Error 404
                </p>
                <h1 className="mt-4 font-heading text-6xl font-black tracking-tight text-white md:text-8xl">
                    Página no encontrada
                </h1>
                <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
                    La ruta que buscás no existe o se movió. Volvamos a un lugar conocido.
                </p>
                <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors hover:bg-white/[0.12]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                </Link>
            </div>
        </main>
    );
}
