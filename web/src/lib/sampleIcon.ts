import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { IconType } from 'react-icons';

/**
 * Convierte un ícono (react-icons) o un texto en una nube de puntos: rasteriza
 * a un canvas offscreen y devuelve las coordenadas de los píxeles "encendidos".
 * Lo usa TechParticleField para que las partículas dibujen los logos del stack.
 *
 * Puntos normalizados a [-0.5, 0.5] (origen al centro, Y hacia arriba).
 */

export interface IconPoint {
    x: number;
    y: number;
}

interface SampleOptions {
    resolution?: number;
    threshold?: number;
    max?: number;
    /** Recentra al bounding box del dibujo y escala para que llene el cuadro. */
    fit?: boolean;
}

// Recentra los puntos a su bounding box y los escala (uniforme, preservando
// aspecto) para que la dimensión mayor llene ~96% de [-0.5, 0.5]. Así todo logo
// queda centrado y del mismo tamaño, sin importar el padding interno del SVG.
function fitToBoundingBox(pts: IconPoint[]): IconPoint[] {
    if (pts.length < 2) return pts;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of pts) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const span = Math.max(maxX - minX, maxY - minY);
    if (span <= 0) return pts;
    const scale = 0.96 / span;
    return pts.map((p) => ({ x: (p.x - cx) * scale, y: (p.y - cy) * scale }));
}

// Lee los píxeles opacos de un canvas y los devuelve como puntos normalizados.
function pixelsToPoints(
    ctx: CanvasRenderingContext2D,
    resolution: number,
    threshold: number,
    max: number,
    fit: boolean,
): IconPoint[] {
    let data: Uint8ClampedArray;
    try {
        data = ctx.getImageData(0, 0, resolution, resolution).data;
    } catch {
        return [];
    }

    let pts: IconPoint[] = [];
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            if (data[(y * resolution + x) * 4 + 3] > threshold) {
                pts.push({ x: x / resolution - 0.5, y: 0.5 - y / resolution });
            }
        }
    }

    // Recentrado/escala al bounding box ANTES de submuestrear (usa todos los puntos).
    if (fit) pts = fitToBoundingBox(pts);

    // Submuestreo uniforme si hay más puntos que el máximo.
    if (pts.length > max) {
        const step = pts.length / max;
        const out: IconPoint[] = [];
        for (let i = 0; i < max; i++) out.push(pts[Math.floor(i * step)]);
        return out;
    }
    return pts;
}

export async function sampleIcon(
    Icon: IconType,
    { resolution = 110, threshold = 80, max = 1800, fit = false }: SampleOptions = {},
): Promise<IconPoint[]> {
    // react-icons renderiza un <svg> con xmlns y fill=currentColor → forzamos blanco.
    const svg = renderToStaticMarkup(
        createElement(Icon, { color: '#ffffff', size: resolution } as Record<string, unknown>),
    );
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    const img = new Image();
    img.width = resolution;
    img.height = resolution;
    try {
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('icon image failed to load'));
            img.src = url;
        });
    } catch {
        return [];
    }

    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    ctx.drawImage(img, 0, 0, resolution, resolution);
    return pixelsToPoints(ctx, resolution, threshold, max, fit);
}

/** Igual que sampleIcon pero a partir de un texto (marca sin ícono, ej. "GHL"). */
export function sampleText(
    text: string,
    { resolution = 110, threshold = 80, max = 1800, fit = false }: SampleOptions = {},
): IconPoint[] {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];

    // Tamaño de fuente que encaje el texto a lo ancho del canvas.
    let fontSize = Math.floor(resolution * 0.62);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${fontSize}px sans-serif`;
    const targetWidth = resolution * 0.88;
    const measured = ctx.measureText(text).width;
    if (measured > targetWidth) {
        fontSize = Math.floor(fontSize * (targetWidth / measured));
        ctx.font = `800 ${fontSize}px sans-serif`;
    }
    ctx.fillText(text, resolution / 2, resolution / 2);
    return pixelsToPoints(ctx, resolution, threshold, max, fit);
}
