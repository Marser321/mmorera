import { useEffect, useMemo, useRef, useState } from "react";
import { continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import type { IconPoint } from "@/lib/pointCloud";
import { sampleImage, type ImageSampleMode } from "@/lib/sampleImage";
import { seeded } from "./context";

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * El efecto de partículas del inicio del sitio, ahora con el logo del cliente:
 * una nube dispersa (con semilla) que converge, gira apenas y se asienta en la
 * forma del logo. Todo se calcula desde el frame, así que el scrub es exacto.
 */
export function ParticleLogo({
  src,
  mode,
  colors,
  size,
  center,
  formFrom,
  formTo,
  dissolveAt,
  seed = 11,
  count = 2400,
}: {
  src: string;
  mode: ImageSampleMode;
  /** Colores de la marca; cada partícula toma uno. */
  colors: string[];
  /** Lado del logo formado, en px de composición. */
  size: number;
  center: { x: number; y: number };
  formFrom: number;
  formTo: number;
  /** Frame en el que las partículas se disuelven hacia arriba (opcional). */
  dissolveAt?: number;
  seed?: number;
  count?: number;
}) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<IconPoint[] | null>(null);
  const [handle] = useState(() => delayRender(`Muestreando ${src}`));

  useEffect(() => {
    let alive = true;
    void sampleImage(src, { mode, max: count }).then((result) => {
      if (alive) setPoints(result);
      continueRender(handle);
    });
    return () => {
      alive = false;
    };
  }, [count, handle, mode, src]);

  // Semillas de cada partícula: origen, demora, tamaño, color y fase de brillo.
  const colorKey = colors.join("|");
  const particles = useMemo(() => {
    if (!points) return [];
    const palette = colorKey.split("|");
    const random = seeded(seed);
    const reach = Math.max(width, height);
    return points.map((point) => {
      const angle = random() * Math.PI * 2;
      const radius = reach * (0.35 + random() * 0.6);
      return {
        tx: center.x + point.x * size,
        ty: center.y - point.y * size,
        sx: center.x + Math.cos(angle) * radius,
        sy: center.y + Math.sin(angle) * radius * 0.7,
        delay: random() * 0.35,
        swirl: (random() - 0.5) * 160,
        dot: 1 + random() * 1.8,
        color: palette[Math.floor(random() * palette.length)],
        phase: random() * Math.PI * 2,
        rise: 40 + random() * 160,
      };
    });
  }, [center.x, center.y, colorKey, height, points, seed, size, width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, width, height);
    const span = Math.max(1, formTo - formFrom);
    for (const p of particles) {
      const raw = (frame - formFrom) / span;
      const t = easeInOutCubic(Math.min(1, Math.max(0, (raw - p.delay) / (1 - p.delay))));
      // Trayecto curvo: un desvío perpendicular que se cierra al llegar.
      const bend = Math.sin(Math.PI * t) * p.swirl;
      let x = p.sx + (p.tx - p.sx) * t + bend * 0.6;
      let y = p.sy + (p.ty - p.sy) * t - bend * 0.4;
      // Respiración cuando ya está formado.
      x += Math.sin(frame / 22 + p.phase) * 0.6 * t;
      y += Math.cos(frame / 26 + p.phase) * 0.6 * t;
      let fade = 0.18 + 0.82 * t;
      if (dissolveAt !== undefined && frame > dissolveAt) {
        const out = Math.min(1, (frame - dissolveAt) / 40);
        y -= p.rise * out * out;
        x += p.swirl * 0.2 * out;
        fade *= 1 - out;
      }
      const twinkle = 0.78 + 0.22 * Math.sin(frame / 9 + p.phase);
      ctx.globalAlpha = Math.max(0, fade * twinkle);
      ctx.fillStyle = p.color;
      ctx.fillRect(x, y, p.dot, p.dot);
    }
    ctx.globalAlpha = 1;
  }, [dissolveAt, formFrom, formTo, frame, height, particles, width]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

/** Polvo de luz que flota despacio (textura de marcas doradas). */
export function DustField({ color, count = 140, seed = 3, opacity = 0.5 }: { color: string; count?: number; seed?: number; opacity?: number }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motes = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, () => ({
      x: random() * width,
      y: random() * height,
      r: 0.6 + random() * 1.8,
      speed: 0.08 + random() * 0.25,
      phase: random() * Math.PI * 2,
    }));
  }, [count, height, seed, width]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    for (const mote of motes) {
      const y = (mote.y - frame * mote.speed + height) % height;
      const x = mote.x + Math.sin(frame / 60 + mote.phase) * 12;
      ctx.globalAlpha = opacity * (0.35 + 0.65 * Math.abs(Math.sin(frame / 40 + mote.phase)));
      ctx.beginPath();
      ctx.arc(x, y, mote.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [color, frame, height, motes, opacity, width]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}
