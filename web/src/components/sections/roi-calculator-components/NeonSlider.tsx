"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SliderConfig } from "./types";

export function NeonSlider({
    config,
    value,
    onChange,
}: {
    config: SliderConfig;
    value: number;
    onChange: (val: number) => void;
}) {
    const Icon = config.icon;
    const percentage = ((value - config.min) / (config.max - config.min)) * 100;

    // Mapear colores a clases Tailwind
    const colorMap: Record<string, { track: string; thumb: string; text: string; glow: string }> = {
        cyan: {
            track: "from-cyan-500 to-cyan-400",
            thumb: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]",
            text: "text-cyan-400",
            glow: "rgba(34,211,238,0.6)",
        },
        green: {
            track: "from-emerald-500 to-emerald-400",
            thumb: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]",
            text: "text-emerald-400",
            glow: "rgba(52,211,153,0.6)",
        },
        indigo: {
            track: "from-indigo-500 to-indigo-400",
            thumb: "bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]",
            text: "text-indigo-400",
            glow: "rgba(129,140,248,0.6)",
        },
        rose: {
            track: "from-rose-500 to-rose-400",
            thumb: "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]",
            text: "text-rose-400",
            glow: "rgba(251,113,133,0.6)",
        },
    };

    const colors = colorMap[config.color] || colorMap.cyan;

    return (
        <div className="space-y-3">
            {/* Label y valor */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            config.color === "cyan" && "bg-cyan-500/10",
                            config.color === "green" && "bg-emerald-500/10",
                            config.color === "indigo" && "bg-indigo-500/10",
                            config.color === "rose" && "bg-rose-500/10"
                        )}
                    >
                        <Icon size={16} className={colors.text} />
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                        {config.label}
                    </span>
                </div>
                <span className={cn("font-mono text-lg font-bold", colors.text)}>
                    {config.prefix}
                    {value.toLocaleString("es-UY")}
                    {config.suffix}
                </span>
            </div>

            {/* Slider */}
            <div className="relative h-6 flex items-center">
                {/* Track fondo */}
                <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-800" />

                {/* Track relleno */}
                <motion.div
                    className={cn(
                        "absolute left-0 h-1.5 rounded-full bg-gradient-to-r",
                        colors.track
                    )}
                    style={{ width: `${percentage}%` }}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {/* Input range nativo (invisible, accesible) */}
                <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label={config.label}
                />

                {/* Thumb visual */}
                <motion.div
                    className={cn(
                        "absolute w-5 h-5 rounded-full border-2 border-white/20",
                        colors.thumb
                    )}
                    style={{ left: `calc(${percentage}% - 10px)` }}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    whileHover={{ scale: 1.3 }}
                />
            </div>

            {/* Rango mín-máx */}
            <div className="flex justify-between text-xs text-slate-600">
                <span>
                    {config.prefix}
                    {config.min}
                    {config.suffix}
                </span>
                <span>
                    {config.prefix}
                    {config.max.toLocaleString("es-UY")}
                    {config.suffix}
                </span>
            </div>
        </div>
    );
}
