"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
    Target,
    Bot,
    BarChart3,
    Zap,
    RefreshCw,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMM } from "@/components/shared/LogoMM";

// ============================================================
// Datos de los nodos orbitales
// ============================================================
const TECH_NODES = [
    { icon: Target, label: "Targeting IA", color: "#00F0FF" },
    { icon: Bot, label: "Automatización", color: "#00F0FF" },
    { icon: BarChart3, label: "Analytics", color: "#00F0FF" },
    { icon: Zap, label: "Ads Engine", color: "#00F0FF" },
    { icon: RefreshCw, label: "Retención", color: "#00F0FF" },
    { icon: TrendingUp, label: "Escalado", color: "#00F0FF" },
];

// ============================================================
// Componente de Líneas de Conexión SVG
// ============================================================
function ConnectionLines({ radius, centerX, centerY }: { radius: number; centerX: number; centerY: number }) {
    const nodes = TECH_NODES.length;
    const lines: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];

    // Crear líneas entre nodos opuestos y adyacentes
    for (let i = 0; i < nodes; i++) {
        const angle1 = (i * 360) / nodes - 90;
        const rad1 = (angle1 * Math.PI) / 180;
        const x1 = centerX + radius * Math.cos(rad1);
        const y1 = centerY + radius * Math.sin(rad1);

        // Conectar con el nodo opuesto
        const opposite = (i + nodes / 2) % nodes;
        const angle2 = (opposite * 360) / nodes - 90;
        const rad2 = (angle2 * Math.PI) / 180;
        const x2 = centerX + radius * Math.cos(rad2);
        const y2 = centerY + radius * Math.sin(rad2);

        if (i < nodes / 2) {
            lines.push({ x1, y1, x2, y2, delay: i * 0.3 });
        }
    }

    return (
        <svg className="absolute inset-0 w-full h-full transform-gpu" viewBox={`0 0 ${centerX * 2} ${centerY * 2}`}>
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
                </linearGradient>
            </defs>

            {/* Anillo orbital */}
            <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="1.5"
                strokeDasharray="8 6"
                opacity="0.4"
                className="will-change-transform"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${centerX} ${centerY}`}
                    to={`360 ${centerX} ${centerY}`}
                    dur="40s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Líneas de conexión entre nodos */}
            {lines.map((line, i) => (
                <g key={i}>
                    <motion.line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="url(#lineGradient)"
                        strokeWidth="1.2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.4 }}
                        transition={{ duration: 2, delay: 0.5 + line.delay }}
                    />
                    {/* Pulse effect */}
                    <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeDasharray="4 60"
                        opacity="0.5"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="64"
                            to="0"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </line>
                </g>
            ))}
        </svg>
    );
}

// ============================================================
// Nodo Orbital Individual
// ============================================================
function OrbitalNode({
    node,
    index,
    total,
    radius,
    centerX,
    centerY,
    isInView,
}: {
    node: (typeof TECH_NODES)[0];
    index: number;
    total: number;
    radius: number;
    centerX: number;
    centerY: number;
    isInView: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = node.icon;
    const angle = (index * 360) / total - 90;
    const rad = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);
    const nodeSize = 52;
    const halfNode = nodeSize / 2;

    return (
        <motion.div
            className="absolute z-20 group transform-gpu will-change-transform"
            style={{
                left: x - halfNode,
                top: y - halfNode,
                width: nodeSize,
                height: nodeSize,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                ease: "easeOut",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow detrás del nodo */}
            <motion.div
                className="absolute inset-0 rounded-full opacity-10"
                style={{ backgroundColor: node.color, filter: "blur(10px)" }}
                animate={{
                    opacity: isHovered ? 0.3 : 0.1,
                    scale: isHovered ? 1.3 : 1,
                }}
            />

            {/* Nodo principal */}
            <motion.div
                className={cn(
                    "relative w-full h-full rounded-full flex items-center justify-center",
                    "bg-black/40 border-2 border-primary/50 backdrop-blur-xl",
                    "shadow-[0_4px_25px_rgba(0,240,255,0.25)] cursor-pointer transition-colors duration-300 transform-gpu"
                )}
                animate={{
                    scale: isHovered ? 1.2 : 1,
                }}
            >
                <Icon
                    className="size-5 sm:size-6 text-primary transition-colors duration-300"
                />
            </motion.div>
        </motion.div>
    );
}

// ============================================================
// Núcleo Central
// ============================================================
function CoreNode({
    centerX,
    centerY,
    isInView,
}: {
    centerX: number;
    centerY: number;
    isInView: boolean;
}) {
    const coreSize = 70;
    const halfCore = coreSize / 2;

    return (
        <motion.div
            className="absolute z-30 transform-gpu"
            style={{
                left: centerX - halfCore,
                top: centerY - halfCore,
                width: coreSize,
                height: coreSize,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Core sólido */}
            <div className="relative w-full h-full rounded-full bg-black/60 border-2 border-primary flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,240,255,0.4)] backdrop-blur-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/20 to-transparent" />
                <LogoMM className="w-8 h-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </div>
        </motion.div>
    );
}

// ============================================================
// Componente Principal — TechEcosystemOrbit
// ============================================================
export default function TechEcosystemOrbit() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-80px" });

    // Dimensiones del sistema orbital
    const viewSize = 340;
    const center = viewSize / 2;
    const orbitRadius = 120;

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[340px] mx-auto aspect-square my-12"
        >
            {/* Contenedor del sistema orbital */}
            <div className="relative w-full h-full mx-auto" style={{ width: viewSize, height: viewSize }}>
                {/* Líneas de conexión SVG */}
                <ConnectionLines
                    radius={orbitRadius}
                    centerX={center}
                    centerY={center}
                />

                {/* Núcleo central */}
                <CoreNode
                    centerX={center}
                    centerY={center}
                    isInView={isInView}
                />

                {/* Nodos orbitales */}
                {TECH_NODES.map((node, index) => (
                    <OrbitalNode
                        key={node.label}
                        node={node}
                        index={index}
                        total={TECH_NODES.length}
                        radius={orbitRadius}
                        centerX={center}
                        centerY={center}
                        isInView={isInView}
                    />
                ))}
            </div>
        </div>
    );
}
