/**
 * Núcleo compartido para convertir un dibujo rasterizado en una nube de puntos
 * normalizada a [-0.5, 0.5] (origen al centro, Y hacia arriba). Lo usan las
 * partículas del sitio (sampleIcon) y las de los films (sampleImage).
 */

export interface IconPoint {
    x: number;
    y: number;
}

export interface SampleOptions {
    resolution?: number;
    threshold?: number;
    max?: number;
    /** Recentra al bounding box del dibujo y escala para que llene el cuadro. */
    fit?: boolean;
}

// Recentra los puntos a su bounding box y los escala (uniforme, preservando
// aspecto) para que la dimensión mayor llene ~96% de [-0.5, 0.5]. Así todo logo
// queda centrado y del mismo tamaño, sin importar el padding interno del SVG.
export function fitToBoundingBox(pts: IconPoint[]): IconPoint[] {
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
export function pixelsToPoints(
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
