import { pixelsToPoints, type IconPoint } from "./pointCloud";

export type ImageSampleMode = "alpha" | "dark";

const cache = new Map<string, Promise<IconPoint[]>>();

/**
 * Convierte un logo (PNG/SVG por URL) en una nube de puntos para partículas.
 * - "alpha": cuenta los píxeles opacos (logos sobre transparente).
 * - "dark": cuenta la tinta oscura (logos de trazo negro sobre blanco).
 * Cacheado por URL: el mismo logo se muestrea una sola vez por sesión.
 */
export function sampleImage(
  src: string,
  { mode = "alpha", resolution = 220, max = 2600 }: { mode?: ImageSampleMode; resolution?: number; max?: number } = {},
): Promise<IconPoint[]> {
  const key = `${src}|${mode}|${resolution}|${max}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const job = new Promise<IconPoint[]>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = resolution;
      canvas.height = resolution;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return resolve([]);
      // Encaja el logo en el cuadro preservando proporciones.
      const scale = Math.min(resolution / img.naturalWidth, resolution / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (resolution - w) / 2, (resolution - h) / 2, w, h);

      if (mode === "dark") {
        // Reescribe el alfa: solo queda "encendida" la tinta oscura.
        const data = ctx.getImageData(0, 0, resolution, resolution);
        const px = data.data;
        for (let i = 0; i < px.length; i += 4) {
          const luminance = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
          px[i + 3] = px[i + 3] > 128 && luminance < 120 ? 255 : 0;
        }
        ctx.putImageData(data, 0, 0);
      }
      resolve(pixelsToPoints(ctx, resolution, 128, max, true));
    };
    img.onerror = () => resolve([]);
    img.src = src;
  });
  cache.set(key, job);
  return job;
}
