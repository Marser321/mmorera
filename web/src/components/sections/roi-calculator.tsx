"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
    Calculator,
    Clock,
    TrendingUp,
    DollarSign,
    Percent,
    CalendarClock,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════
// CONFIGURACIÓN DE SLIDERS
// ═══════════════════════════════════════════════════

interface SliderConfig {
    id: string;
    label: string;
    icon: typeof Clock;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    suffix: string;
    prefix?: string;
    color: string;
}

const sliderConfigs: SliderConfig[] = [
    {
        id: "horasManuales",
        label: "Horas manuales / semana",
        icon: Clock,
        min: 5,
        max: 80,
        step: 1,
        defaultValue: 20,
        suffix: " hs",
        color: "cyan",
    },
    {
        id: "salarioEmpleado",
        label: "Salario promedio empleado",
        icon: DollarSign,
        min: 500,
        max: 8000,
        step: 100,
        defaultValue: 2000,
        suffix: "/mes",
        prefix: "$",
        color: "green",
    },
    {
        id: "costoSoftware",
        label: "Costo actual de software",
        icon: Calculator,
        min: 0,
        max: 5000,
        step: 50,
        defaultValue: 500,
        suffix: "/mes",
        prefix: "$",
        color: "indigo",
    },
    {
        id: "tasaError",
        label: "Tasa de error manual",
        icon: Percent,
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 10,
        suffix: "%",
        color: "rose",
    },
];

// ═══════════════════════════════════════════════════
// CONTADOR ANIMADO (Framer Motion)
// ═══════════════════════════════════════════════════

function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
    className,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) =>
        Math.round(latest).toLocaleString("es-UY")
    );

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.2,
            ease: "easeOut",
        });
        return controls.stop;
    }, [value, count]);

    return (
        <span className={className}>
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}

// ═══════════════════════════════════════════════════
// SLIDER CUSTOM CON EFECTO NEÓN
// ═══════════════════════════════════════════════════

function NeonSlider({
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

// ═══════════════════════════════════════════════════
// BARRA DEL GRÁFICO CON NEÓN
// ═══════════════════════════════════════════════════

function NeonBar({
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

// ═══════════════════════════════════════════════════
// COMPONENTE PRINCIPAL: CALCULADORA DE ROI
// ═══════════════════════════════════════════════════

export function ROICalculator() {
    // Estado de los sliders
    const [values, setValues] = useState({
        horasManuales: 20,
        salarioEmpleado: 2000,
        costoSoftware: 500,
        tasaError: 10,
    });

    // Flag para detectar interacción (activa neón en barras)
    const [isInteracting, setIsInteracting] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSliderChange = useCallback(
        (id: string, val: number) => {
            setValues((prev) => ({ ...prev, [id]: val }));
            setIsInteracting(true);

            // Desactivar neón luego de 2s sin tocar
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setIsInteracting(false), 2000);
        },
        []
    );

    // ──── Cálculos de ROI ────
    const roiData = useMemo(() => {
        const { horasManuales, salarioEmpleado, costoSoftware, tasaError } = values;

        // Costo hora del empleado
        const costoHora = salarioEmpleado / 160; // 40hs * 4 semanas

        // Costo mensual por horas manuales
        const costoManualMensual = horasManuales * 4.33 * costoHora;

        // Costo de errores (% de costos operativos impactados)
        const costoErroresMensual = costoManualMensual * (tasaError / 100) * 1.5;

        // Con automatización: reducimos 70% de horas, 90% de errores
        const eficienciaIA = 0.70;
        const reduccionErrores = 0.90;

        const costoManualPost = costoManualMensual * (1 - eficienciaIA);
        const costoErrorPost = costoErroresMensual * (1 - reduccionErrores);

        // Costo MMORE estimado (basado en Growth Pack ~$7,500 setup + $500/mes)
        const costoMmoreMensual = 800;

        // Ahorro mensual total
        const ahorroMensual =
            costoManualMensual -
            costoManualPost +
            (costoErroresMensual - costoErrorPost) +
            (costoSoftware * 0.4) - // Reducción 40% software legacy
            costoMmoreMensual;

        const ahorroAnual = Math.max(ahorroMensual * 12, 0);

        // Eficiencia ganada
        const horasRecuperadas = horasManuales * eficienciaIA;
        const porcentajeEficiencia = Math.round(
            (horasRecuperadas / horasManuales) * 100
        );

        // Período de recuperación (meses)
        const inversionInicial = 7500; // Setup
        const periodoRecuperacion =
            ahorroMensual > 0
                ? Math.max(Math.ceil(inversionInicial / ahorroMensual), 1)
                : 99;

        // Datos para barras
        const barras = [
            {
                label: "Horas/mes",
                antes: horasManuales * 4.33,
                despues: horasManuales * 4.33 * (1 - eficienciaIA),
            },
            {
                label: "Costo RRHH",
                antes: costoManualMensual,
                despues: costoManualPost,
            },
            {
                label: "Errores",
                antes: costoErroresMensual,
                despues: costoErrorPost,
            },
            {
                label: "Software",
                antes: costoSoftware,
                despues: costoSoftware * 0.6,
            },
            {
                label: "Total/mes",
                antes: costoManualMensual + costoErroresMensual + costoSoftware,
                despues:
                    costoManualPost + costoErrorPost + costoSoftware * 0.6 + costoMmoreMensual,
            },
        ];

        const maxBarValue = Math.max(
            ...barras.map((b) => Math.max(b.antes, b.despues))
        );

        return {
            ahorroAnual: Math.round(ahorroAnual),
            porcentajeEficiencia,
            periodoRecuperacion: Math.min(periodoRecuperacion, 36),
            barras,
            maxBarValue,
        };
    }, [values]);

    return (
        <section
            id="roi-calculator"
            className="relative py-20 md:py-28 bg-slate-950 overflow-hidden border-t border-slate-800"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] rounded-full bg-cyan-900/8 blur-[180px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6"
                    >
                        <Calculator size={16} />
                        <span>Calculadora Inteligente</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    >
                        ¿Cuánto vas a{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                            recuperar
                        </span>
                        ?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                        Ajustá los parámetros a tu operación real y descubrí cuánto
                        dinero estás quemando cada mes por no automatizar.
                    </motion.p>
                </div>

                {/* Contenido principal */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-6xl mx-auto glass-pro rounded-2xl md:rounded-3xl p-6 md:p-10"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* ═══ COLUMNA IZQUIERDA: SLIDERS ═══ */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Sparkles size={18} className="text-cyan-400" />
                                Tu operación actual
                            </h3>

                            <div className="space-y-6">
                                {sliderConfigs.map((config) => (
                                    <NeonSlider
                                        key={config.id}
                                        config={config}
                                        value={
                                            values[
                                            config.id as keyof typeof values
                                            ]
                                        }
                                        onChange={(val) =>
                                            handleSliderChange(config.id, val)
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ═══ COLUMNA DERECHA: RESULTADOS ═══ */}
                        <div className="space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* KPI: Ahorro Anual */}
                                <motion.div
                                    className="relative rounded-xl bg-slate-900/60 border border-emerald-500/20 p-4 text-center overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                                    <DollarSign
                                        size={20}
                                        className="text-emerald-400 mx-auto mb-2"
                                    />
                                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">
                                        Ahorro Anual
                                    </div>
                                    <AnimatedCounter
                                        value={roiData.ahorroAnual}
                                        prefix="$"
                                        className="font-mono text-2xl sm:text-3xl font-black text-white drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                                    />
                                </motion.div>

                                {/* KPI: Eficiencia */}
                                <motion.div
                                    className="relative rounded-xl bg-slate-900/60 border border-cyan-500/20 p-4 text-center overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                                    <TrendingUp
                                        size={20}
                                        className="text-cyan-400 mx-auto mb-2"
                                    />
                                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">
                                        Eficiencia
                                    </div>
                                    <AnimatedCounter
                                        value={roiData.porcentajeEficiencia}
                                        suffix="%"
                                        className="font-mono text-2xl sm:text-3xl font-black text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                                    />
                                </motion.div>

                                {/* KPI: Recuperación */}
                                <motion.div
                                    className="relative rounded-xl bg-slate-900/60 border border-indigo-500/20 p-4 text-center overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                                    <CalendarClock
                                        size={20}
                                        className="text-indigo-400 mx-auto mb-2"
                                    />
                                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">
                                        Recuperación
                                    </div>
                                    <AnimatedCounter
                                        value={roiData.periodoRecuperacion}
                                        suffix=" meses"
                                        className="font-mono text-2xl sm:text-3xl font-black text-white drop-shadow-[0_0_20px_rgba(129,140,248,0.5)]"
                                    />
                                </motion.div>
                            </div>

                            {/* Gráfico de Barras */}
                            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-semibold text-slate-300">
                                        Antes vs. Después
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
                                            <span>Actual</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-cyan-500 to-indigo-500" />
                                            <span>Con MMORE</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Barras */}
                                <div className="flex items-end justify-around gap-2 sm:gap-4">
                                    {roiData.barras.map((barra, index) => (
                                        <NeonBar
                                            key={barra.label}
                                            label={barra.label}
                                            antesValue={barra.antes}
                                            despuesValue={barra.despues}
                                            maxValue={roiData.maxBarValue}
                                            index={index}
                                            isActive={isInteracting}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* CTA contextual */}
                            <motion.a
                                href="#pricing"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow:
                                        "0 0 30px rgba(34,211,238,0.3), 0 0 60px rgba(99,102,241,0.15)",
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <TrendingUp size={18} />
                                Ver planes y empezar a ahorrar
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default ROICalculator;
