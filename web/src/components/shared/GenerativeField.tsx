'use client';

import { useEffect, useRef } from 'react';
import { FAMILIES, type Family } from '@/data/techStack';

/**
 * GenerativeField — Campo de partículas de alta densidad.
 * 
 * Flow-field con ~900+ partículas que derivan por un campo vectorial orgánico.
 * Microinteracciones con el cursor:
 *   1. Vórtice gravitacional — las partículas orbitan alrededor del cursor
 *   2. Líneas de constelación — se dibujan conexiones entre partículas cercanas al cursor
 *   3. Glow de proximidad — las partículas cercanas al cursor brillan más
 *   4. Repulsión suave — leve empuje radial para que no se acumulen en el centro
 * 
 * Rendimiento: DPR clampeado, pausa con pestaña oculta, reduced-motion respetado.
 */
type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    baseSize: number;
};

function rgba(hex: string, a: number) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function GenerativeField({ activeFamilies = [] }: { activeFamilies?: Family[] }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        let w = 0;
        let h = 0;
        let particles: Particle[] = [];
        let raf = 0;
        let t = 0;
        const mouse = { x: -9999, y: -9999, active: false };
        const activeColors = (
            activeFamilies.length
                ? FAMILIES.filter((family) => activeFamilies.includes(family.id))
                : FAMILIES
        ).map((family) => family.color);

        const spawn = (): Particle => {
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                color: Math.random() < 0.54
                    ? '#ffffff'
                    : activeColors[Math.floor(Math.random() * activeColors.length)] ?? '#93e83a',
                baseSize: 0.8 + Math.random() * 1.2,
            };
        };

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // Fallback equilibrado: conserva profundidad sin competir con el contenido.
            const count = Math.round(Math.min((w * h) / 2100, isMobile ? 180 : 560));
            particles = Array.from({ length: count }, spawn);
        };

        // Campo vectorial orgánico con dos frecuencias superpuestas
        const flowAngle = (x: number, y: number) => {
            const f1 = Math.sin(x * 0.0014 + t) + Math.cos(y * 0.0014 - t * 0.7);
            const f2 = Math.sin(x * 0.0008 - t * 0.4) * 0.5;
            return (f1 + f2) * Math.PI;
        };

        // Radio de interacción del mouse
        const MOUSE_R = isMobile ? 180 : 320;
        // Radio para dibujar líneas de constelación
        const LINK_R = isMobile ? 100 : 160;
        const LINK_DIST = isMobile ? 50 : 70; // Distancia máxima entre partículas para conectar

        const draw = () => {
            t += 0.001;
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';

            // Recolectar partículas cercanas al cursor para las líneas
            const nearCursor: Particle[] = [];

            for (const p of particles) {
                const a = flowAngle(p.x, p.y);
                p.vx += Math.cos(a) * 0.025;
                p.vy += Math.sin(a) * 0.025;

                // ── Microinteracción con el cursor ──
                let cursorProximity = 0;
                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const d2 = dx * dx + dy * dy;

                    if (d2 < MOUSE_R * MOUSE_R) {
                        const d = Math.sqrt(d2) || 1;
                        const f = (1 - d / MOUSE_R);
                        cursorProximity = f;

                        // Fuerza tangencial (vórtice) + repulsión suave
                        const vortexStrength = f * 0.6;
                        const repelStrength = f * f * 0.25;
                        p.vx += (-dy / d) * vortexStrength + (dx / d) * repelStrength;
                        p.vy += (dx / d) * vortexStrength + (dy / d) * repelStrength;
                    }

                    // Recolectar para líneas de constelación
                    if (d2 < LINK_R * LINK_R) {
                        nearCursor.push(p);
                    }
                }

                // Fricción
                p.vx *= 0.94;
                p.vy *= 0.94;
                p.x += p.vx;
                p.y += p.vy;

                // Wrap-around
                if (p.x < -10) p.x = w + 10;
                else if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                else if (p.y > h + 10) p.y = -10;

                // ── Renderizado del punto ──
                const speed = Math.min(Math.hypot(p.vx, p.vy), 2.5);
                // Base alpha + boost por velocidad + boost por proximidad al cursor
                const baseAlpha = 0.12 + speed * 0.12;
                const cursorBoost = cursorProximity * 0.45;
                const alpha = Math.min(baseAlpha + cursorBoost, 0.75);

                // Tamaño reactivo: se agranda suavemente cerca del cursor
                const sizeBoost = cursorProximity * 1.5;
                const size = p.baseSize + sizeBoost;

                ctx.fillStyle = rgba(p.color, p.color === '#ffffff' ? alpha * 0.5 : alpha * 0.82);

                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Líneas de constelación entre partículas cercanas al cursor ──
            if (nearCursor.length > 1) {
                for (let i = 0; i < nearCursor.length; i++) {
                    for (let j = i + 1; j < nearCursor.length; j++) {
                        const a = nearCursor[i];
                        const b = nearCursor[j];
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const d = Math.sqrt(dx * dx + dy * dy);

                        if (d < LINK_DIST) {
                            const lineAlpha = (1 - d / LINK_DIST) * 0.12;
                            ctx.strokeStyle = rgba(a.color, lineAlpha);
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            ctx.globalCompositeOperation = 'source-over';
            raf = requestAnimationFrame(draw);
        };

        const onMove = (e: PointerEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };
        const onLeave = () => {
            mouse.active = false;
        };
        const onVisibility = () => {
            cancelAnimationFrame(raf);
            if (!document.hidden && !reduce) raf = requestAnimationFrame(draw);
        };

        resize();
        if (reduce) {
            draw();
            cancelAnimationFrame(raf);
        } else {
            raf = requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [activeFamilies]);

    return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
