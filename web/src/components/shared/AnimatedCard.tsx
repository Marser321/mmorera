'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    gradientColor?: string;
}

export function AnimatedCard({ children, className, onClick, gradientColor = "from-violet-600/20 to-blue-600/20" }: AnimatedCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative group rounded-xl overflow-hidden cursor-pointer",
                "bg-white/5 backdrop-blur-md border border-white/10",
                "hover:border-white/20 hover:shadow-[0_0_30px_-5px_var(--color-primary)/0.3]",
                className
            )}
            onClick={onClick}
        >
            {/* Efecto de gradiente de fondo */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-br",
                gradientColor
            )} />

            {/* Contenido */}
            <div className="relative z-10 p-6 h-full flex flex-col">
                {children}
            </div>

            {/* Efecto Shimmer */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20" />
        </motion.div>
    );
}
