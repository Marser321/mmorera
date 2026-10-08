/**
 * Formatos por plataforma para exportar los films y sus cuadros. Son las
 * medidas habituales de cada plataforma; si una cambia sus requisitos, se
 * edita acá y scripts/export-media.ts lo toma solo.
 *
 * - `w`/`h`: tamaño final.
 * - `maxSeconds`: duración máxima (si el pedido es más largo, se recorta a la
 *   escena protagonista salvo que se indique otro tramo).
 * - `fit`: "pad" encaja el film entero sobre un fondo desenfocado del propio
 *   film (no se pierde texto); "cover" recorta al centro.
 */
export type MediaPreset = {
  kind: "video" | "image" | "gif";
  w: number;
  h: number;
  maxSeconds?: number;
  /** Tope de peso orientativo en MB (se ajusta la calidad si hace falta). */
  maxMB?: number;
  fit?: "pad" | "cover";
  fps?: number;
  note: string;
};

export const MEDIA_PRESETS: Record<string, MediaPreset> = {
  // Videos
  "video-16x9": { kind: "video", w: 1920, h: 1080, note: "Maestro apaisado (YouTube, sitio, LinkedIn horizontal)" },
  "video-4x5": { kind: "video", w: 1080, h: 1350, note: "Maestro vertical 4:5 (feed de Instagram y LinkedIn)" },
  "video-9x16": { kind: "video", w: 1080, h: 1920, fit: "pad", note: "Vertical 9:16 (Reels, TikTok, Shorts, historias)" },
  "video-1x1": { kind: "video", w: 1080, h: 1080, fit: "pad", note: "Cuadrado (feeds, Facebook, X)" },
  "video-4x3": { kind: "video", w: 1600, h: 1200, fit: "pad", note: "4:3 (Dribbble, Upwork, Contra)" },
  "linkedin-video": { kind: "video", w: 1080, h: 1350, maxSeconds: 600, maxMB: 200, note: "LinkedIn feed (4:5)" },
  "instagram-reel": { kind: "video", w: 1080, h: 1920, maxSeconds: 90, fit: "pad", note: "Instagram Reels" },
  "tiktok": { kind: "video", w: 1080, h: 1920, maxSeconds: 180, fit: "pad", note: "TikTok" },
  "youtube-short": { kind: "video", w: 1080, h: 1920, maxSeconds: 60, fit: "pad", note: "YouTube Shorts (máx. 60 s)" },
  "youtube": { kind: "video", w: 1920, h: 1080, note: "YouTube" },
  "x-video": { kind: "video", w: 1920, h: 1080, maxSeconds: 140, maxMB: 512, note: "X / Twitter" },
  "fiverr-video": { kind: "video", w: 1920, h: 1080, maxSeconds: 75, maxMB: 50, note: "Video de gig de Fiverr" },
  "dribbble-video": { kind: "video", w: 1600, h: 1200, maxSeconds: 24, fit: "pad", note: "Shot de Dribbble (4:3, máx. 24 s)" },
  "behance-video": { kind: "video", w: 1920, h: 1080, maxMB: 200, note: "Módulo de video de Behance" },
  "upwork-video": { kind: "video", w: 1920, h: 1080, maxMB: 100, note: "Portfolio de Upwork" },
  // GIF animado (Behance, Notion, correos)
  "gif-16x9": { kind: "gif", w: 960, h: 540, maxSeconds: 8, fps: 15, note: "GIF corto apaisado" },
  "gif-4x3": { kind: "gif", w: 800, h: 600, maxSeconds: 8, fps: 15, fit: "pad", note: "GIF corto 4:3 (Dribbble, Behance)" },
  // Imágenes
  "image-16x9": { kind: "image", w: 1920, h: 1080, note: "Imagen apaisada" },
  "image-4x5": { kind: "image", w: 1080, h: 1350, note: "Imagen vertical 4:5" },
  "image-1x1": { kind: "image", w: 1080, h: 1080, fit: "pad", note: "Imagen cuadrada" },
  "image-9x16": { kind: "image", w: 1080, h: 1920, fit: "pad", note: "Historia / portada vertical" },
  "image-4x3": { kind: "image", w: 1600, h: 1200, fit: "pad", note: "Imagen 4:3 (Upwork, Dribbble, Contra)" },
  "og": { kind: "image", w: 1200, h: 630, fit: "cover", note: "Vista previa al compartir (LinkedIn, X, WhatsApp)" },
  "linkedin-featured": { kind: "image", w: 1200, h: 627, fit: "cover", note: "LinkedIn Destacados / artículo" },
  "behance-cover": { kind: "image", w: 1616, h: 1264, fit: "pad", note: "Portada de proyecto de Behance (808×632 a 2×)" },
  "fiverr-gig-image": { kind: "image", w: 1280, h: 769, fit: "cover", note: "Imagen de gig de Fiverr" },
  "upwork-thumbnail": { kind: "image", w: 1600, h: 1200, fit: "pad", note: "Miniatura de portfolio de Upwork (4:3)" },
};
