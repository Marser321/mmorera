"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ═══════════════════════════════════════════════════
 * HERO NEURAL SVG
 * Red neuronal pulsante animada —
 * nodos conectados con data-pulses viajando.
 * SVG puro + Framer Motion para performance.
 * ═══════════════════════════════════════════════════ */

interface NeuralNode {
    id: string;
    cx: number;
    cy: number;
    r: number;
    color: string;
    delay: number;
}

interface NeuralEdge {
    from: string;
    to: string;
    delay: number;
}

// Nodos posicionados orgánicamente en un viewBox de 800x400
const NODES: NeuralNode[] = [
    { id: "n1", cx: 80, cy: 180, r: 6, color: "#10b981", delay: 0 },
    { id: "n2", cx: 200, cy: 80, r: 5, color: "#34d399", delay: 0.2 },
    { id: "n3", cx: 220, cy: 280, r: 5, color: "#6ee7b7", delay: 0.3 },
    { id: "n4", cx: 400, cy: 160, r: 8, color: "#10b981", delay: 0.5 },
    { id: "n5", cx: 380, cy: 310, r: 5, color: "#34d399", delay: 0.6 },
    { id: "n6", cx: 560, cy: 100, r: 5, color: "#6ee7b7", delay: 0.8 },
    { id: "n7", cx: 580, cy: 260, r: 6, color: "#10b981", delay: 0.9 },
    { id: "n8", cx: 720, cy: 200, r: 7, color: "#34d399", delay: 1.1 },
];

const EDGES: NeuralEdge[] = [
    { from: "n1", to: "n2", delay: 0.3 },
    { from: "n1", to: "n3", delay: 0.5 },
    { from: "n2", to: "n4", delay: 0.8 },
    { from: "n3", to: "n4", delay: 1.0 },
    { from: "n3", to: "n5", delay: 1.2 },
    { from: "n4", to: "n6", delay: 1.4 },
    { from: "n4", to: "n7", delay: 1.6 },
    { from: "n5", to: "n7", delay: 1.8 },
    { from: "n6", to: "n8", delay: 2.0 },
    { from: "n7", to: "n8", delay: 2.2 },
];

function getNode(id: string) {
    return NODES.find((n) => n.id === id)!;
}

/* ── Data Pulse: círculo pequeño viajando por una conexión ── */
function DataPulse({ edge }: { edge: NeuralEdge }) {
    const from = getNode(edge.from);
    const to = getNode(edge.to);

    return (
        <motion.circle
            r="2.5"
            fill="#10b981"
            filter="url(#pulseGlow)"
            initial={{ cx: from.cx, cy: from.cy, opacity: 0 }}
            animate={{
                cx: [from.cx, to.cx],
                cy: [from.cy, to.cy],
                opacity: [0, 1, 1, 0],
            }}
            transition={{
                duration: 2.5,
                delay: edge.delay,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
            }}
        />
    );
}

/* ── Componente Principal ── */
export function HeroNeuralSVG() {
    const prefersReduce = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    if (prefersReduce) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            aria-hidden="true"
        >
            <motion.svg
                viewBox="0 0 800 400"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 0.35 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
            >
                <defs>
                    {/* Glow para nodos */}
                    <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Glow para pulsos */}
                    <filter id="pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* ── Conexiones (líneas) ── */}
                {isVisible &&
                    EDGES.map((edge) => {
                        const from = getNode(edge.from);
                        const to = getNode(edge.to);
                        return (
                            <motion.line
                                key={`${edge.from}-${edge.to}`}
                                x1={from.cx}
                                y1={from.cy}
                                x2={to.cx}
                                y2={to.cy}
                                stroke="white"
                                strokeOpacity="0.06"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: edge.delay * 0.5,
                                    ease: "easeOut",
                                }}
                            />
                        );
                    })}

                {/* ── Nodos (círculos) ── */}
                {isVisible &&
                    NODES.map((node) => (
                        <g key={node.id}>
                            {/* Halo pulsante */}
                            <motion.circle
                                cx={node.cx}
                                cy={node.cy}
                                r={node.r * 2.5}
                                fill="none"
                                stroke={node.color}
                                strokeWidth="0.5"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: [0, 0.3, 0],
                                    scale: [0.8, 1.5, 0.8],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: node.delay + 1,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            {/* Nodo principal */}
                            <motion.circle
                                cx={node.cx}
                                cy={node.cy}
                                r={node.r}
                                fill={node.color}
                                filter="url(#nodeGlow)"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: node.delay,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            />
                        </g>
                    ))}

                {/* ── Data Pulses viajando ── */}
                {isVisible &&
                    EDGES.map((edge) => (
                        <DataPulse
                            key={`pulse-${edge.from}-${edge.to}`}
                            edge={edge}
                        />
                    ))}
            </motion.svg>
        </div>
    );
}
