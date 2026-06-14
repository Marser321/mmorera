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
}

// Lee los píxeles opacos de un canvas y los devuelve como puntos normalizados.
function pixelsToPoints(
    ctx: CanvasRenderingContext2D,
    resolution: number,
    threshold: number,
    max: number,
): IconPoint[] {
    let data: Uint8ClampedArray;
    try {
        data = ctx.getImageData(0, 0, resolution, resolution).data;
    } catch {
        return [];
    }

    const pts: IconPoint[] = [];
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            if (data[(y * resolution + x) * 4 + 3] > threshold) {
                pts.push({ x: x / resolution - 0.5, y: 0.5 - y / resolution });
            }
        }
    }

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
    { resolution = 110, threshold = 80, max = 1800 }: SampleOptions = {},
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
    return pixelsToPoints(ctx, resolution, threshold, max);
}

/** Igual que sampleIcon pero a partir de un texto (marca sin ícono, ej. "GHL"). */
export function sampleText(
    text: string,
    { resolution = 110, threshold = 80, max = 1800 }: SampleOptions = {},
): IconPoint[] {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];

    // Tamaño de fuente que encaje el texto a lo ancho del canvas.
    let fontSize = Math.floor(resolution * 0.55);
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
    return pixelsToPoints(ctx, resolution, threshold, max);
}
