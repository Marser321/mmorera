"use client";

import { motion } from "framer-motion";
import {
    Calculator,
    TrendingUp,
    DollarSign,
    CalendarClock,
    Sparkles,
} from "lucide-react";
import { AnimatedCounter } from "./roi-calculator-components/AnimatedCounter";
import { NeonSlider } from "./roi-calculator-components/NeonSlider";
import { NeonBar } from "./roi-calculator-components/NeonBar";
import { useROICalculator } from "./roi-calculator-components/useROICalculator";
import { sliderConfigs } from "./roi-calculator-components/constants";

export function ROICalculator() {
    const { values, isInteracting, handleSliderChange, roiData } = useROICalculator();

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
