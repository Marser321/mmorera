'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';
import { SplitText } from './SplitText';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface RevealHeadingProps {
    text: string;
    as?: ElementType;
    className?: string;
    /** Aplica .text-gradient por palabra (el clip de gradiente no atraviesa spans anidados). */
    gradient?: boolean;
    by?: 'word' | 'char';
    once?: boolean;
    stagger?: number;
    delay?: number;
    /** 'inView' (default) anima al entrar en viewport; 'mount' anima al montar (para héroes sobre el fold). */
    trigger?: 'inView' | 'mount';
}

/**
 * Titular con reveal por máscara: cada palabra entra desde abajo dentro de un
 * contenedor overflow-hidden. Bajo reduced-motion muestra el texto estático.
 */
export function RevealHeading({
    text,
    as = 'h2',
    className,
    gradient = false,
    by = 'word',
    once = true,
    stagger = 0.08,
    delay = 0,
    trigger = 'inView',
}: RevealHeadingProps) {
    const reduced = useReducedMotion();
    const Tag = as as ElementType;

    if (reduced) {
        return <Tag className={cn(gradient && 'text-gradient', className)}>{text}</Tag>;
    }

    return (
        <Tag className={className}>
            <SplitText
                text={text}
                by={by}
                render={(unit, i) => {
                    const motionProps =
                        trigger === 'mount'
                            ? { animate: { y: '0%' } }
                            : { whileInView: { y: '0%' }, viewport: { once } };
                    return (
                        <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                            <motion.span
                                className={cn('inline-block', gradient && 'text-gradient')}
                                initial={{ y: '115%' }}
                                {...motionProps}
                                transition={{ duration: 0.7, ease: EASE_OUT, delay: delay + i * stagger }}
                            >
                                {unit}
                            </motion.span>
                        </span>
                    );
                }}
            />
        </Tag>
    );
}
