'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTrack } from '@/context/TrackContext';
import { useLanguage } from '@/context/LanguageContext';
import { TRACKS, type TrackId } from '@/data/tracks';

/**
 * Gemelo visual de LanguageSwitcher, arriba-izquierda (LanguageSwitcher va
 * arriba-derecha). Sólo aparece una vez elegido un track (el cruce vive en la
 * home). Permite saltar entre el track de diseño y el de software.
 */
export function TrackSwitcher() {
    const { track, setTrack, mounted } = useTrack();
    const { language } = useLanguage();
    const router = useRouter();

    // Siempre visible una vez montado: como ya no existe el fork inline, este es
    // el selector principal de track. Sin elección aún, ningún lado queda activo.
    if (!mounted) return null;

    const hasTrack = track !== null;
    const isDesign = track === 'design';
    const isSoftware = track === 'software';

    const choose = (id: TrackId) => {
        if (id === track) return;
        setTrack(id);
        router.push(TRACKS[id].route);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[101]"
        >
            <div className="relative flex items-center h-9 rounded-full bg-black/60 border border-white/10 backdrop-blur-md p-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform-gpu">
                {/* Deslizador activo (solo cuando hay track elegido) */}
                {hasTrack && (
                    <motion.div
                        className="absolute top-1 bottom-1 left-1 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                        initial={false}
                        animate={{ x: isDesign ? 0 : '100%' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                )}

                <button
                    onClick={() => choose('design')}
                    aria-label={TRACKS.design.label[language]}
                    aria-pressed={isDesign}
                    className={`relative z-10 w-20 text-center font-mono text-[10px] font-black uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                        isDesign ? 'text-emerald-300' : 'text-white/40 hover:text-white/70'
                    }`}
                >
                    {TRACKS.design.label[language]}
                </button>
                <button
                    onClick={() => choose('software')}
                    aria-label={TRACKS.software.label[language]}
                    aria-pressed={isSoftware}
                    className={`relative z-10 w-20 text-center font-mono text-[10px] font-black uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                        isSoftware ? 'text-emerald-300' : 'text-white/40 hover:text-white/70'
                    }`}
                >
                    {TRACKS.software.label[language]}
                </button>
            </div>
        </motion.div>
    );
}
