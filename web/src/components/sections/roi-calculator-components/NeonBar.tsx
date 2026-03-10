"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function NeonBar({
    label,
    antesValue,
    despuesValue,
    maxValue,
    index,
    isActive,
}: {
    label: string;
    antesValue: number;
    despuesValue: number;
    maxValue: number;
    index: number;
    isActive: boolean;
}) {
    const antesHeight = Math.max((antesValue / maxValue) * 100, 4);
    const despuesHeight = Math.max((despuesValue / maxValue) * 100, 4);

    return (
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            {/* Barras */}
            <div className="flex items-end gap-1 h-40 w-full justify-center">
                {/* Barra ANTES */}
                <motion.div
                    className="w-5 sm:w-6 rounded-t-md bg-slate-700/80 relative overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: `${antesHeight}%` }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        delay: index * 0.08,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-600/40 to-transparent" />
                </motion.div>

                {/* Barra DESPUÉS (neón) */}
                <motion.div
                    className={cn(
                        "w-5 sm:w-6 rounded-t-md relative overflow-hidden",
                        isActive && "neon-bar"
                    )}
                    style={{
                        background:
                            "linear-gradient(to top, rgba(34,211,238,0.9), rgba(99,102,241,0.7))",
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${despuesHeight}%` }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        delay: index * 0.08 + 0.1,
                    }}
                >
                    {/* Brillo interno */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/10"
                        animate={{
                            opacity: isActive ? [0.3, 0.8, 0.3] : 0.3,
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: isActive ? Infinity : 0,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </div>

            {/* Label */}
            <span className="text-[10px] sm:text-xs text-slate-500 text-center leading-tight truncate w-full">
                {label}
            </span>
        </div>
    );
}
