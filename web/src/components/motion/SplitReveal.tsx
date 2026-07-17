'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { DURATION, EASE_OUT, STAGGER, VIEWPORT } from '@/lib/motion';

interface SplitRevealProps {
    text: string;
    as?: ElementType;
    /** "load" anima al montar (above the fold); "inView" espera al viewport. */
    mode?: 'load' | 'inView';
    delay?: number;
    className?: string;
}

/**
 * Titular enmascarado palabra por palabra: cada palabra sube desde detrás de
 * su propia máscara. El stagger total se acota a 0.6s para que los titulares
 * largos en español no se eternicen. Bajo reduced-motion renderiza texto plano.
 */
export function SplitReveal({ text, as = 'h2', mode = 'inView', delay = 0, className }: SplitRevealProps) {
    const reduced = useReducedMotion();
    const Tag = as as ElementType<{ className?: string; children?: ReactNode; 'aria-label'?: string }>;

    if (reduced) {
        return <Tag className={className}>{text}</Tag>;
    }

    const words = text.split(' ').filter(Boolean);
    const perWord = Math.min(STAGGER.words, words.length > 1 ? 0.6 / (words.length - 1) : STAGGER.words);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionTag = (motion as any)[as as string] ?? motion.h2;

    return (
        <MotionTag
            key={text}
            className={className}
            aria-label={text}
            initial="hidden"
            {...(mode === 'load'
                ? { animate: 'visible' }
                : { whileInView: 'visible', viewport: { once: true, margin: VIEWPORT.margin } })}
        >
            {words.map((word, index) => (
                <span
                    key={`${word}-${index}`}
                    aria-hidden
                    className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-baseline"
                >
                    <motion.span
                        className="inline-block"
                        variants={{
                            hidden: { y: '110%' },
                            visible: {
                                y: 0,
                                transition: { duration: DURATION.slow, ease: EASE_OUT, delay: delay + index * perWord },
                            },
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            )).flatMap((node, index) => (index < words.length - 1 ? [node, ' '] : [node]))}
        </MotionTag>
    );
}
