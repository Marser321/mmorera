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
    glowColor = "from-primary/50 to-blue-500/50",
    className,
    delay = 0,
}: ConversionNodeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
            className={cn("relative group z-10 w-full max-w-[280px] md:max-w-[320px] cursor-crosshair", className)}
        >
            {/* Animated Glow effect behind the card */}
            <div className={cn(
                "absolute -inset-1 rounded-2xl blur-xl opacity-30 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-br pointer-events-none group-hover:animate-pulse",
                glowColor
            )}></div>

            {/* Main Card Container - Glassmorphism Premium */}
            <div className="relative flex gap-4 p-4 md:p-5 rounded-2xl bg-black/40 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden min-h-[100px] transition-all duration-300 group-hover:bg-black/60 group-hover:border-white/20">
                {/* Subtle Top Reflection */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                {/* Subtle Bottom Glow line */}
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Inner ambient light overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none"></div>

                {/* Icon Container */}
                <div className="shrink-0 relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 border border-white/10 text-primary shadow-inner group-hover:text-white transition-colors duration-300">
                    {/* Inner glowing core for icon */}
                    <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 relative z-10" strokeWidth={1.5} />
                </div>

                {/* Text Container */}
                <div className="flex flex-col gap-1.5 justify-center relative z-10">
                    <h4 className="font-bold text-sm md:text-base leading-tight text-white/90 group-hover:text-white transition-colors">{title}</h4>
                    {subtitle && (
                        <p className="text-xs md:text-sm text-slate-400 font-medium leading-snug group-hover:text-slate-300 transition-colors">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function VerticalBeam({ className, delay = 0, height = 48 }: { className?: string, delay?: number, height?: number }) {
    // Instead of using 'animate-beam-y' from css, we use pure framer motion
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn("relative w-6 shrink-0 z-0 flex justify-center overflow-hidden", className)}
            style={{ height }}
        >
            {/* The physical wire */}
            <div className="w-[2px] h-full bg-white/5 relative overflow-hidden">
                {/* The running laser/particle */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent rounded-full opacity-80"
                    animate={{ y: [-height, height] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: delay + 0.2
                    }}
                />
            </div>
        </motion.div>
    );
}

export function HorizontalBeam({ className, delay = 0, width = 48 }: { className?: string, delay?: number, width?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn("relative h-6 shrink-0 z-0 flex items-center overflow-hidden", className)}
            style={{ width }}
        >
            <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-80"
                    animate={{ x: [-width, width] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: delay + 0.2
                    }}
                />
            </div>
        </motion.div>
    );
}

export function CornerBeam({ direction, className, delay = 0 }: { direction: 'down-right' | 'down-left' | 'right-up' | 'left-up', className?: string, delay?: number }) {
    const borders = {
        'down-right': 'border-l-[2px] border-b-[2px] rounded-bl-3xl',
        'down-left': 'border-r-[2px] border-b-[2px] rounded-br-3xl',
        'right-up': 'border-l-[2px] border-t-[2px] rounded-tl-3xl',
        'left-up': 'border-r-[2px] border-t-[2px] rounded-tr-3xl'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn("relative border-white/5 z-0", borders[direction], className)}
        >
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_15px_rgba(47,88,205,0.05)]"></div>
        </motion.div>
    );
}
