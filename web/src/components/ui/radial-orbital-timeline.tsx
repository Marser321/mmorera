"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Línea de tiempo orbital: nodos que giran alrededor de un núcleo y se abren
 * en una ficha al seleccionarlos, dibujando las conexiones con sus nodos
 * relacionados. Los textos llegan ya localizados desde el consumidor.
 */

export interface RadialOrbitalNode {
    id: string;
    title: string;
    /** Línea corta junto al estado (p. ej. "12 herramientas"). */
    meta: string;
    body: string;
    /** Hex del nodo, ya resuelto para el tema activo. */
    color: string;
    Icon: LucideIcon;
    relatedIds: string[];
    status: { label: string; variant: BadgeProps["variant"] };
    /** 0–100 — se dibuja como barra de nivel. */
    level: number;
}

export interface RadialOrbitalTimelineProps {
    nodes: RadialOrbitalNode[];
    labels: {
        /** Etiqueta de la barra de nivel. */
        level: string;
        /** Encabezado de la lista de nodos conectados. */
        related: string;
        /** Pie de la órbita: cómo se usa. */
        hint: string;
    };
    onActiveChange?: (id: string | null) => void;
    /** Contenido extra dentro de la ficha (p. ej. los chips de tecnologías). */
    renderExtra?: (node: RadialOrbitalNode) => React.ReactNode;
    className?: string;
}

const ROTATION_DEG_PER_SEC = 6;

const round = (value: number) => Math.round(value * 1000) / 1000;

export function RadialOrbitalTimeline({
    nodes,
    labels,
    onActiveChange,
    renderExtra,
    className,
}: RadialOrbitalTimelineProps) {
    const reduced = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [angle, setAngle] = useState(0);
    const [width, setWidth] = useState(0);
    const [inView, setInView] = useState(false);

    const compact = width > 0 && width < 640;
    const radius = width === 0 ? 200 : Math.min(260, Math.max(112, width * 0.32));
    const stageSize = radius * 2 + (compact ? 110 : 150);
    const spinning = activeId === null && inView && !reduced && !compact;

    // Ancho real del contenedor -> radio responsivo (nada de 200px fijos).
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        observer.observe(el);
        setWidth(el.getBoundingClientRect().width);
        return () => observer.disconnect();
    }, []);

    // La órbita solo consume rAF mientras está en pantalla: el sitio ya corre
    // un campo de partículas 3D y no puede permitirse un loop de fondo.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            threshold: 0.05,
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!spinning) return;
        let frame = 0;
        let last = performance.now();
        const tick = (now: number) => {
            const delta = (now - last) / 1000;
            last = now;
            setAngle((prev) => (prev + ROTATION_DEG_PER_SEC * delta) % 360);
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [spinning]);

    // Abrir un nodo detiene la órbita y la deja con ese nodo arriba (270°).
    const select = useCallback(
        (id: string | null) => {
            const next = id === null || activeId === id ? null : id;
            if (next === activeId) return;
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                try {
                    navigator.vibrate(8);
                } catch {
                    // ignore
                }
            }
            setActiveId(next);
            if (next) {
                const index = nodes.findIndex((node) => node.id === next);
                if (index >= 0) setAngle((((270 - (index / nodes.length) * 360) % 360) + 360) % 360);
            }
            onActiveChange?.(next);
        },
        [activeId, nodes, onActiveChange]
    );

    useEffect(() => {
        if (!activeId) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                select(null);
            } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                const currentIndex = nodes.findIndex((n) => n.id === activeId);
                if (currentIndex >= 0) {
                    const nextIndex = (currentIndex + 1) % nodes.length;
                    select(nodes[nextIndex].id);
                }
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                const currentIndex = nodes.findIndex((n) => n.id === activeId);
                if (currentIndex >= 0) {
                    const prevIndex = (currentIndex - 1 + nodes.length) % nodes.length;
                    select(nodes[prevIndex].id);
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [activeId, nodes, select]);

    const positions = useMemo(
        () =>
            nodes.map((node, index) => {
                const deg = ((index / nodes.length) * 360 + angle) % 360;
                const rad = (deg * Math.PI) / 180;
                // Redondeado: `Math.cos` difiere en el último bit entre Node y
                // el navegador y eso rompía la hidratación.
                return {
                    id: node.id,
                    x: round(radius * Math.cos(rad)),
                    y: round(radius * Math.sin(rad)),
                    // El hemisferio inferior queda "delante": más opaco y por encima.
                    zIndex: Math.round(100 + 50 * Math.sin(rad)),
                    opacity: round(Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(rad)) / 2)))),
                };
            }),
        [nodes, angle, radius]
    );

    const activeNode = nodes.find((node) => node.id === activeId) ?? null;
    const relatedIds = activeNode?.relatedIds ?? [];
    const positionById = new Map(positions.map((position) => [position.id, position]));

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
            onClick={(event) => {
                if (event.target === stageRef.current || event.target === containerRef.current) select(null);
            }}
        >
            <div ref={stageRef} className="relative mx-auto w-full" style={{ height: stageSize }}>
                {/* Conexiones activas: del nodo abierto a sus familias relacionadas. */}
                {activeNode && (
                    <svg
                        aria-hidden
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        viewBox={`${-stageSize / 2} ${-stageSize / 2} ${stageSize} ${stageSize}`}
                    >
                        {relatedIds.map((id) => {
                            const from = positionById.get(activeNode.id);
                            const to = positionById.get(id);
                            if (!from || !to) return null;
                            return (
                                <line
                                    key={id}
                                    x1={from.x}
                                    y1={from.y}
                                    x2={to.x}
                                    y2={to.y}
                                    stroke={activeNode.color}
                                    strokeWidth={1}
                                    strokeOpacity={0.45}
                                    strokeDasharray="3 5"
                                />
                            );
                        })}
                    </svg>
                )}

                {/* Anillo */}
                <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 rounded-full border border-white/10 light:border-[rgb(var(--ink-rgb)/0.12)]"
                    style={{ width: radius * 2, height: radius * 2, transform: "translate(-50%, -50%)" }}
                />

                {/* Núcleo */}
                <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-track-create via-accent to-signal"
                    style={{ zIndex: 60 }}
                >
                    <span className="absolute h-[4.5rem] w-[4.5rem] rounded-full border border-white/20 light:border-[rgb(var(--ink-rgb)/0.16)]" />
                    <span className="absolute h-24 w-24 rounded-full border border-white/10 light:border-[rgb(var(--ink-rgb)/0.08)]" />
                    <span className="h-7 w-7 rounded-full bg-background backdrop-blur-md" />
                </div>

                {nodes.map((node, index) => {
                    const position = positions[index];
                    const isActive = node.id === activeId;
                    const isRelated = relatedIds.includes(node.id);
                    const Icon = node.Icon;

                    return (
                        <div
                            key={node.id}
                            className="absolute left-1/2 top-1/2"
                            style={{
                                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                                transitionProperty: "transform, opacity",
                                transitionDuration: spinning ? "0ms" : "700ms",
                                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                                zIndex: isActive ? 300 : position.zIndex,
                                opacity: isActive || isRelated ? 1 : position.opacity,
                            }}
                        >
                            <button
                                type="button"
                                aria-expanded={isActive}
                                aria-controls={isActive ? `orbit-detail-${node.id}` : undefined}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    select(node.id);
                                }}
                                className="group flex flex-col items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card"
                            >
                                <span
                                    className={cn(
                                        "flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-300",
                                        isActive ? "scale-125" : "group-hover:scale-110"
                                    )}
                                    style={{
                                        borderColor: isActive || isRelated ? node.color : "rgb(255 255 255 / 0.22)",
                                        background: isActive ? node.color : "var(--color-card)",
                                        color: isActive ? "var(--color-background)" : node.color,
                                        boxShadow: isActive ? `0 0 28px ${node.color}66` : undefined,
                                    }}
                                >
                                    <Icon size={17} strokeWidth={1.6} aria-hidden />
                                </span>
                                <span
                                    className={cn(
                                        "whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] transition-colors",
                                        // En móvil el radio es pequeño y nueve etiquetas se pisan:
                                        // quedan solo los iconos y el título lo da la ficha abierta.
                                        compact && !isActive && "sr-only",
                                        isActive
                                            ? "text-foreground"
                                            : "text-foreground/45 group-hover:text-foreground/85"
                                    )}
                                >
                                    {node.title}
                                </span>
                            </button>

                            {isActive && !compact && (
                                <div className="absolute left-1/2 top-[4.25rem] w-[18rem] -translate-x-1/2">
                                    <OrbitDetail
                                        node={node}
                                        nodes={nodes}
                                        labels={labels}
                                        onSelect={select}
                                        renderExtra={renderExtra}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* En móvil la ficha vive bajo la órbita: nunca se sale del viewport. */}
            {activeNode && compact && (
                <div className="mt-6">
                    <OrbitDetail
                        node={activeNode}
                        nodes={nodes}
                        labels={labels}
                        onSelect={select}
                        renderExtra={renderExtra}
                    />
                </div>
            )}

            <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30">
                {labels.hint}
            </p>
        </div>
    );
}

function OrbitDetail({
    node,
    nodes,
    labels,
    onSelect,
    renderExtra,
}: {
    node: RadialOrbitalNode;
    nodes: RadialOrbitalNode[];
    labels: RadialOrbitalTimelineProps["labels"];
    onSelect: (id: string) => void;
    renderExtra?: (node: RadialOrbitalNode) => React.ReactNode;
}) {
    return (
        <Card
            id={`orbit-detail-${node.id}`}
            className="border-white/15 bg-card backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.14)] light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_16px_40px_rgb(20_23_26/0.12)]"
            style={{ borderTopColor: node.color }}
            onClick={(event) => event.stopPropagation()}
        >
            <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between gap-4">
                    <Badge variant={node.status.variant}>{node.status.label}</Badge>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
                        {node.meta}
                    </span>
                </div>
                <CardTitle className="mt-3 text-xl">{node.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
                <p className="text-sm leading-6 text-foreground/60">{node.body}</p>

                <div className="mt-5 border-t border-white/10 pt-4 light:border-[rgb(var(--ink-rgb)/0.1)]">
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
                        <span>{labels.level}</span>
                        <span>{node.level}</span>
                    </div>
                    <div className="mt-2 h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.12)]">
                        <div className="h-px" style={{ width: `${node.level}%`, background: node.color }} />
                    </div>
                </div>

                {renderExtra?.(node)}

                {node.relatedIds.length > 0 && (
                    <div className="mt-5 border-t border-white/10 pt-4 light:border-[rgb(var(--ink-rgb)/0.1)]">
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
                            {labels.related}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {node.relatedIds.map((id) => {
                                const related = nodes.find((candidate) => candidate.id === id);
                                if (!related) return null;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onSelect(id);
                                        }}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-foreground/65 transition-colors hover:border-white/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.14)] light:hover:border-[rgb(var(--ink-rgb)/0.30)]"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: related.color }} />
                                        {related.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default RadialOrbitalTimeline;
