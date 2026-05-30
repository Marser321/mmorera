'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';
import { SplitText } from './SplitText';
import { EASE_OUT } from '@/lib/motion';

interface StaggerTextProps {
    text: string;
    as?: ElementType;
    by?: 'word' | 'char';
    className?: string;
    stagger?: number;
    delay?: number;
    once?: boolean;
}

/** Entrada escalonada por palabra/caracter (fade + leve subida). */
export function StaggerText({
    text,
    as = 'span',
    by = 'word',
    className,
    stagger = 0.04,
    delay = 0,
    once = true,
}: StaggerTextProps) {
    const reduced = useReducedMotion();
    const Tag = as as ElementType;

    if (reduced) {
        return <Tag className={className}>{text}</Tag>;
    }

    return (
        <Tag className={className}>
            <SplitText
                text={text}
                by={by}
                render={(unit, i) => (
                    <motion.span
                        className="inline-block"
                        initial={{ opacity: 0, y: '0.4em' }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once }}
                        transition={{ duration: 0.5, ease: EASE_OUT, delay: delay + i * stagger }}
                    >
                        {unit}
                    </motion.span>
                )}
            />
        </Tag>
    );
}
