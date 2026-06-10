'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

/**
 * Transición de ruta de "La Consola": un cross-dissolve entre escenas/tracks.
 * App Router re-monta template.tsx en cada navegación, así que esto anima la
 * ENTRADA de cada página.
 *
 * Es opacity puro a propósito: usar transform o filter en este wrapper
 * convertiría a sus descendientes position:fixed (Dev Mode HUD, sticky scenes)
 * en absolute respecto del wrapper. opacity no crea bloque contenedor, así que
 * el posicionamiento de las páginas queda intacto.
 */
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
        >
            {children}
        </motion.div>
    );
}
