import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface ConversionNodeProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    glowColor?: string;
    className?: string;
    delay?: number;
}

export function ConversionNode({
    icon: Icon,
    title,
    subtitle,
    glowColor = "from-primary/30 to-blue-500/30",
    className,
    delay = 0,
}: ConversionNodeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn("relative group z-10 w-full max-w-[280px] md:max-w-[320px]", className)}
        >
            {/* Glow effect behind the card */}
            <div className={cn("absolute -inset-0.5 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition-opacity duration-500 bg-gradient-to-br pointer-events-none", glowColor)}></div>

            {/* Main Card Container */}
            <div className="relative flex gap-4 p-4 md:p-5 rounded-xl bg-card/60 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden min-h-[100px]">
                {/* Subtle Top Reflection */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                {/* Subtle Bottom Glow line */}
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Container */}
                <div className="shrink-0 p-3 rounded-lg bg-white/5 border border-white/10 text-primary shadow-inner">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>

                {/* Text Container */}
                <div className="flex flex-col gap-1.5 justify-center">
                    <h4 className="font-bold text-sm md:text-base leading-tight text-foreground">{title}</h4>
                    {subtitle && (
                        <p className="text-xs md:text-sm text-muted-foreground font-medium leading-snug">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function VerticalBeam({ className, delay = 0 }: { className?: string, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn("relative w-[2px] h-12 bg-gradient-to-b from-white/10 via-white/5 to-white/10 overflow-hidden shrink-0 z-0", className)}
        >
            <div className="absolute inset-x-0 w-full h-[40%] bg-primary shadow-[0_0_10px_2px_rgba(0,180,216,0.5)] animate-beam-y rounded-full"></div>
        </motion.div>
    );
}

export function HorizontalBeam({ className, delay = 0 }: { className?: string, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn("relative h-[2px] w-12 bg-gradient-to-r from-white/10 via-white/5 to-white/10 overflow-hidden shrink-0 z-0", className)}
        >
            <div className="absolute inset-y-0 h-full w-[40%] bg-primary shadow-[0_0_10px_2px_rgba(0,180,216,0.5)] animate-beam-x rounded-full"></div>
        </motion.div>
    );
}

export function CornerBeam({ direction, className, delay = 0 }: { direction: 'down-right' | 'down-left' | 'right-up' | 'left-up', className?: string, delay?: number }) {
    // A simple corner bracket using borders
    const borders = {
        'down-right': 'border-l-2 border-b-2 rounded-bl-xl',
        'down-left': 'border-r-2 border-b-2 rounded-br-xl',
        'right-up': 'border-l-2 border-t-2 rounded-tl-xl',
        'left-up': 'border-r-2 border-t-2 rounded-tr-xl'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn("relative border-white/10 z-0", borders[direction], className)}
        >
            {/* The animated glow over the corner is tricky with simple elements, so we use a generic glow or just keep it static-lit for now */}
            <div className="absolute inset-0 bg-primary/20 blur-sm mix-blend-screen opacity-50"></div>
        </motion.div>
    )
}
