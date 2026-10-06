"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bento animada: spotlight que sigue al cursor sobre la grilla, anillo de glow
 * por tarjeta, partículas al pasar por encima, tilt 3D, magnetismo y ripple al
 * hacer click. Adaptación del MagicBento de React Bits al sistema Deep Space,
 * con framer-motion en lugar de GSAP (ya está en el bundle) y el acento
 * resuelto por tarjeta en vez de un violeta fijo.
 *
 * El puntero se escucha en la sección, no en `document`: la página ya corre un
 * campo de partículas 3D y Lenis, y un listener global de más se nota.
 */

export interface BentoItem {
    id: string;
    /** Eyebrow mono sobre el título. */
    label?: string;
    title: string;
    description: string;
    /** Si viene, la tarjeta es un enlace. */
    href?: string;
    /** Hex del acento; si falta se usa `glowColor`. */
    accent?: string;
    media?: { src: string; alt: string };
    /** Ocupa 2 columnas × 2 filas en desktop. */
    featured?: boolean;
    /** Ocupa 2 columnas × 1 fila: sirve para cerrar una fila huérfana. */
    wide?: boolean;
    /** Como `wide`, pero solo en la grilla de 3 columnas (desktop). */
    wideLg?: boolean;
    /** Línea de pie (cliente, año, etc.). */
    footer?: string;
    /** Chips de tecnologías/herramientas asociadas. */
    technologies?: string[];
    /** Badge destacado de métrica o SLA. */
    metricBadge?: string;
}

export interface MagicBentoProps {
    items: BentoItem[];
    /** Acento por defecto (hex) cuando el item no trae el suyo. */
    glowColor?: string;
    enableStars?: boolean;
    enableSpotlight?: boolean;
    enableBorderGlow?: boolean;
    enableTilt?: boolean;
    enableMagnetism?: boolean;
    clickEffect?: boolean;
    /** Recorta título y descripción a una/dos líneas. */
    textAutoHide?: boolean;
    spotlightRadius?: number;
    particleCount?: number;
    /** Columnas en desktop. Con 3 cierran bien 6 y 9 tarjetas. */
    columns?: 3 | 4;
    /** Texto del enlace en tarjetas con `href`. */
    ctaLabel?: string;
    className?: string;
}

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 320;

/** "#B68CFF" → "182 140 255" (formato que espera `rgb(... / alpha)`). */
const rgbTriplet = (hex: string): string => {
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const int = Number.parseInt(full, 16);
    if (!Number.isFinite(int)) return "182 140 255";
    return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
};

export function MagicBento({
    items,
    glowColor = "#B68CFF",
    enableStars = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    enableTilt = false,
    enableMagnetism = true,
    clickEffect = true,
    textAutoHide = false,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    particleCount = DEFAULT_PARTICLE_COUNT,
    columns = 3,
    ctaLabel,
    className,
}: MagicBentoProps) {
    const reduced = useReducedMotion();
    const sectionRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef(0);
    const pointerRef = useRef({ x: 0, y: 0 });
    const [interactive, setInteractive] = useState(false);

    // Solo con puntero fino (mouse/trackpad): en táctil no hay hover que seguir
    // y los efectos solo gastarían batería.
    useEffect(() => {
        const query = window.matchMedia("(pointer: fine)");
        const sync = () => setInteractive(query.matches && !reduced);
        sync();
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
    }, [reduced]);

    const paint = useCallback(() => {
        frameRef.current = 0;
        const section = sectionRef.current;
        if (!section) return;

        const { x, y } = pointerRef.current;
        const proximity = spotlightRadius * 0.5;
        const fadeDistance = spotlightRadius * 0.75;
        let minDistance = Number.POSITIVE_INFINITY;

        section.querySelectorAll<HTMLElement>("[data-bento-card]").forEach((card) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.max(
                0,
                Math.hypot(x - centerX, y - centerY) - Math.max(rect.width, rect.height) / 2,
            );
            minDistance = Math.min(minDistance, distance);

            let intensity = 0;
            if (distance <= proximity) intensity = 1;
            else if (distance <= fadeDistance) intensity = (fadeDistance - distance) / (fadeDistance - proximity);

            card.style.setProperty("--bento-glow-x", `${((x - rect.left) / rect.width) * 100}%`);
            card.style.setProperty("--bento-glow-y", `${((y - rect.top) / rect.height) * 100}%`);
            card.style.setProperty("--bento-glow", intensity.toFixed(3));
            card.style.setProperty("--bento-glow-radius", `${spotlightRadius}px`);
        });

        const spotlight = spotlightRef.current;
        if (!spotlight) return;
        const sectionRect = section.getBoundingClientRect();
        spotlight.style.transform = `translate(${x - sectionRect.left}px, ${y - sectionRect.top}px) translate(-50%, -50%)`;
        spotlight.style.opacity =
            minDistance <= proximity
                ? "1"
                : minDistance <= fadeDistance
                    ? ((fadeDistance - minDistance) / (fadeDistance - proximity)).toFixed(3)
                    : "0";
    }, [spotlightRadius]);

    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!interactive || event.pointerType !== "mouse") return;
            pointerRef.current = { x: event.clientX, y: event.clientY };
            // Un solo repintado por frame: el move dispara decenas de eventos.
            if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
        },
        [interactive, paint],
    );

    const handlePointerLeave = useCallback(() => {
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
        }
        sectionRef.current?.querySelectorAll<HTMLElement>("[data-bento-card]").forEach((card) => {
            card.style.setProperty("--bento-glow", "0");
        });
        if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    }, []);

    useEffect(() => () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
    }, []);

    return (
        <div
            ref={sectionRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={cn("relative isolate", className)}
        >
            {enableSpotlight && interactive && (
                <div
                    ref={spotlightRef}
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 -z-10 h-[46rem] w-[46rem] rounded-full opacity-0 mix-blend-screen transition-opacity duration-300 light:mix-blend-multiply"
                    style={{
                        background: `radial-gradient(circle, rgb(${rgbTriplet(glowColor)} / 0.16) 0%, rgb(${rgbTriplet(glowColor)} / 0.06) 25%, transparent 65%)`,
                    }}
                />
            )}

            <div
                className={cn(
                    "grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-3 sm:grid-cols-2",
                    columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
                )}
            >
                {items.map((item) => (
                    <BentoCard
                        key={item.id}
                        item={item}
                        glowColor={glowColor}
                        interactive={interactive}
                        enableStars={enableStars}
                        enableBorderGlow={enableBorderGlow}
                        enableTilt={enableTilt}
                        enableMagnetism={enableMagnetism}
                        clickEffect={clickEffect}
                        textAutoHide={textAutoHide}
                        particleCount={particleCount}
                        ctaLabel={ctaLabel}
                    />
                ))}
            </div>
        </div>
    );
}

interface BentoCardProps {
    item: BentoItem;
    glowColor: string;
    interactive: boolean;
    enableStars: boolean;
    enableBorderGlow: boolean;
    enableTilt: boolean;
    enableMagnetism: boolean;
    clickEffect: boolean;
    textAutoHide: boolean;
    particleCount: number;
    ctaLabel?: string;
}

function BentoCard({
    item,
    glowColor,
    interactive,
    enableStars,
    enableBorderGlow,
    enableTilt,
    enableMagnetism,
    clickEffect,
    textAutoHide,
    particleCount,
    ctaLabel,
}: BentoCardProps) {
    const ref = useRef<HTMLElement>(null);
    const hoveredRef = useRef(false);
    const particlesRef = useRef<HTMLSpanElement[]>([]);
    const timeoutsRef = useRef<number[]>([]);
    const controlsRef = useRef<AnimationPlaybackControls[]>([]);
    const accent = item.accent ?? glowColor;
    const triplet = rgbTriplet(accent);

    const clearParticles = useCallback(() => {
        timeoutsRef.current.forEach(window.clearTimeout);
        timeoutsRef.current = [];
        controlsRef.current.forEach((control) => control.stop());
        controlsRef.current = [];
        particlesRef.current.forEach((particle) => particle.remove());
        particlesRef.current = [];
    }, []);

    const spawnParticles = useCallback(() => {
        const element = ref.current;
        if (!element) return;
        const { width, height } = element.getBoundingClientRect();

        for (let index = 0; index < particleCount; index += 1) {
            const timeout = window.setTimeout(() => {
                if (!hoveredRef.current || !ref.current) return;
                const particle = document.createElement("span");
                particle.setAttribute("aria-hidden", "true");
                particle.dataset.bentoParticle = "";
                particle.style.cssText = `position:absolute;width:3px;height:3px;border-radius:9999px;pointer-events:none;z-index:3;left:${Math.random() * width}px;top:${Math.random() * height}px;background:rgb(${triplet});box-shadow:0 0 6px rgb(${triplet} / .7)`;
                ref.current.appendChild(particle);
                particlesRef.current.push(particle);

                controlsRef.current.push(
                    animate(particle, { scale: [0, 1], opacity: [0, 1] }, { duration: 0.3, ease: "backOut" }),
                    animate(
                        particle,
                        { x: (Math.random() - 0.5) * 90, y: (Math.random() - 0.5) * 90, rotate: Math.random() * 360 },
                        { duration: 2 + Math.random() * 2, ease: "linear", repeat: Infinity, repeatType: "reverse" },
                    ),
                );
            }, index * 90);
            timeoutsRef.current.push(timeout);
        }
    }, [particleCount, triplet]);

    useEffect(() => {
        const element = ref.current;
        if (!element || !interactive) return;

        const onEnter = () => {
            hoveredRef.current = true;
            if (enableStars) spawnParticles();
        };

        const onLeave = () => {
            hoveredRef.current = false;
            clearParticles();
            if (enableTilt || enableMagnetism) {
                animate(element, { rotateX: 0, rotateY: 0, x: 0, y: 0 }, { duration: 0.4, ease: "easeOut" });
            }
        };

        const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || (!enableTilt && !enableMagnetism)) return;
            const rect = element.getBoundingClientRect();
            const offsetX = event.clientX - rect.left - rect.width / 2;
            const offsetY = event.clientY - rect.top - rect.height / 2;

            if (enableTilt) {
                animate(
                    element,
                    {
                        rotateX: (offsetY / (rect.height / 2)) * -6,
                        rotateY: (offsetX / (rect.width / 2)) * 6,
                    },
                    { duration: 0.2, ease: "easeOut" },
                );
            }
            if (enableMagnetism) {
                animate(element, { x: offsetX * 0.04, y: offsetY * 0.04 }, { duration: 0.35, ease: "easeOut" });
            }
        };

        const onClick = (event: MouseEvent) => {
            if (!clickEffect) return;
            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const radius = Math.max(
                Math.hypot(x, y),
                Math.hypot(x - rect.width, y),
                Math.hypot(x, y - rect.height),
                Math.hypot(x - rect.width, y - rect.height),
            );

            const ripple = document.createElement("span");
            ripple.setAttribute("aria-hidden", "true");
            ripple.dataset.bentoRipple = "";
            ripple.style.cssText = `position:absolute;width:${radius * 2}px;height:${radius * 2}px;left:${x - radius}px;top:${y - radius}px;border-radius:9999px;pointer-events:none;z-index:3;background:radial-gradient(circle, rgb(${triplet} / .35) 0%, rgb(${triplet} / .15) 35%, transparent 70%)`;
            element.appendChild(ripple);
            animate(
                ripple,
                { scale: [0, 1], opacity: [1, 0] },
                { duration: 0.7, ease: "easeOut", onComplete: () => ripple.remove() },
            );
        };

        element.addEventListener("pointerenter", onEnter);
        element.addEventListener("pointerleave", onLeave);
        element.addEventListener("pointermove", onMove);
        element.addEventListener("click", onClick);

        return () => {
            hoveredRef.current = false;
            element.removeEventListener("pointerenter", onEnter);
            element.removeEventListener("pointerleave", onLeave);
            element.removeEventListener("pointermove", onMove);
            element.removeEventListener("click", onClick);
            clearParticles();
        };
    }, [interactive, enableStars, enableTilt, enableMagnetism, clickEffect, spawnParticles, clearParticles, triplet]);

    const className = cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[1.25rem] border border-white/10 bg-card/75 p-6 backdrop-blur-md transition-all duration-300 [perspective:1000px] [transform-style:preserve-3d]",
        "hover:border-white/25 hover:bg-card/85",
        "light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90",
        enableBorderGlow && "bento-ring",
        item.featured && "sm:col-span-2 lg:row-span-2",
        item.wide && !item.featured && "sm:col-span-2",
        item.wideLg && !item.featured && !item.wide && "lg:col-span-2",
        item.href &&
        "transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:hover:border-[rgb(var(--ink-rgb)/0.25)]",
    );
    const style = { "--bento-glow-rgb": triplet } as React.CSSProperties;

    const body = (
        <>
            {/* Halo ambiental en esquina con el color de acento de la tarjeta */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-25 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-60"
                style={{ backgroundColor: accent }}
            />
            {/* Gradiente tridimensional sutil */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/25"
            />

            {item.media && (
                <>
                    <Image
                        src={item.media.src}
                        alt={item.media.alt}
                        fill
                        sizes={item.featured ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
                        className="pointer-events-none object-cover opacity-40 transition-[opacity,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-55"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-card)_92%,transparent),color-mix(in_srgb,var(--color-card)_45%,transparent))]"
                    />
                </>
            )}

            <div className="relative z-[2] flex items-center justify-between gap-3">
                {item.label && (
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
                        {item.label}
                    </span>
                )}
                <div className="flex items-center gap-2">
                    {item.metricBadge && (
                        <span
                            className="rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider"
                            style={{
                                borderColor: `${accent}40`,
                                backgroundColor: `${accent}10`,
                                color: accent,
                            }}
                        >
                            {item.metricBadge}
                        </span>
                    )}
                    {item.href && (
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/40 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    )}
                </div>
            </div>

            <div className="relative z-[2] mt-6">
                <h3
                    className={cn(
                        "font-medium tracking-[-0.04em] text-foreground",
                        item.featured ? "text-3xl sm:text-4xl" : "text-xl",
                        textAutoHide && "line-clamp-1",
                    )}
                >
                    {item.title}
                </h3>
                <p
                    className={cn(
                        "mt-2 max-w-md text-sm leading-6 text-foreground/50",
                        textAutoHide && "line-clamp-2",
                    )}
                >
                    {item.description}
                </p>

                {item.technologies && item.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3.5 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
                        {item.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-foreground/75 tracking-tight transition-colors group-hover:border-white/20 group-hover:bg-white/[0.08]"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {(item.footer || (item.href && ctaLabel)) && (
                    <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30">
                        {item.footer ?? ctaLabel}
                    </p>
                )}
            </div>
        </>
    );

    // Con `href` la tarjeta es un enlace real: foco por teclado y semántica,
    // sin depender de los handlers de puntero.
    if (item.href) {
        return (
            <Link
                href={item.href}
                ref={ref as React.Ref<HTMLAnchorElement>}
                data-bento-card
                style={style}
                className={className}
            >
                {body}
            </Link>
        );
    }

    return (
        <article ref={ref as React.Ref<HTMLElement>} data-bento-card style={style} className={className}>
            {body}
        </article>
    );
}

export default MagicBento;
