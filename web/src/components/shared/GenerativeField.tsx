'use client';

import { useEffect, useRef } from 'react';

/**
 * Campo generativo de "La Consola": un flow-field de motas de señal que derivan
 * por un campo vectorial y forman un vórtice suave alrededor del cursor. Es la
 * textura viva del fondo (reemplaza los iconos flotantes decorativos).
 *
 * Disciplinado a propósito (frontend-design: gastar la audacia en la tipografía,
 * mantener el resto quieto): pocas partículas, alpha bajo, mayormente blancas con
 * algunas en verde señal / cyan. Perf: DPR clampeado, pausa con la pestaña oculta,
 * y bajo prefers-reduced-motion dibuja un único frame estático sin loop.
 */
const SIGNAL = '#93e83a'; // ~ --color-primary (verde ácido)
const ACCENT = '#2ec8d8'; // ~ --color-accent (cyan)

type Particle = { x: number; y: number; vx: number; vy: number; kind: 0 | 1 | 2 };

function rgba(hex: string, a: number) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function GenerativeField() {
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

        const spawn = (): Particle => {
            const r = Math.random();
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                kind: r < 0.16 ? 1 : r < 0.26 ? 2 : 0,
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
            const count = Math.round(Math.min((w * h) / 9000, isMobile ? 70 : 180));
            particles = Array.from({ length: count }, spawn);
        };

        const flowAngle = (x: number, y: number) =>
            (Math.sin(x * 0.0016 + t) + Math.cos(y * 0.0016 - t * 0.8)) * Math.PI;

        const draw = () => {
            t += 0.0009;
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';

            for (const p of particles) {
                const a = flowAngle(p.x, p.y);
                p.vx += Math.cos(a) * 0.02;
                p.vy += Math.sin(a) * 0.02;

                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const d2 = dx * dx + dy * dy;
                    const R = 180;
                    if (d2 < R * R) {
                        const d = Math.sqrt(d2) || 1;
                        const f = (1 - d / R) * 0.55;
                        // tangencial (vórtice) + leve repulsión
                        p.vx += (-dy / d) * f + (dx / d) * f * 0.3;
                        p.vy += (dx / d) * f + (dy / d) * f * 0.3;
                    }
                }

                p.vx *= 0.94;
                p.vy *= 0.94;
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = w + 10;
                else if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                else if (p.y > h + 10) p.y = -10;

                const speed = Math.min(Math.hypot(p.vx, p.vy), 2);
                const alpha = Math.min(0.1 + speed * 0.12, 0.55);
                ctx.fillStyle =
                    p.kind === 0 ? rgba('#ffffff', alpha * 0.6)
                        : p.kind === 1 ? rgba(SIGNAL, alpha)
                            : rgba(ACCENT, alpha);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.kind === 0 ? 1.3 : 2.2, 0, Math.PI * 2);
                ctx.fill();
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
    }, []);

    return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
