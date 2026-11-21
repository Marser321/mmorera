/**
 * Clips de las webs que usan las muestras de contenido. En el render cada uno
 * es una secuencia de imágenes a 30 fps en public/render-cache/clips/<id>/
 * (la prepara scripts/render-trailer.ts, fuera de git), igual que el film de
 * autor: así el compositor nunca decodifica video y cada cuadro es exacto.
 *
 * `frames` es cuántos cuadros se extraen: solo el tramo que se usa.
 */
export interface ClipSource {
  /** Archivo dentro de public/. */
  src: string;
  width: number;
  height: number;
  frames: number;
}

export const CLIPS = {
  "truckers-storm": { src: "portfolio/brands/truckers-choice/story-night-risk.mp4", width: 1280, height: 720, frames: 150 },
  "truckers-network": { src: "portfolio/brands/truckers-choice/story-network.mp4", width: 1280, height: 720, frames: 150 },
  "truckers-sunrise": { src: "portfolio/brands/truckers-choice/story-sunrise.mp4", width: 1280, height: 720, frames: 150 },
  "truckers-hero": { src: "portfolio/brands/truckers-choice/hero-loop.mp4", width: 1280, height: 720, frames: 150 },
  "rangel-living": { src: "portfolio/brands/rangel-oviedo-group/livingroom.mp4", width: 1280, height: 720, frames: 180 },
  "rangel-facade": { src: "portfolio/brands/rangel-oviedo-group/facade-loop.mp4", width: 1280, height: 720, frames: 150 },
  "gym-dia": { src: "portfolio/brands/gimnasio-demo/dia-vertical.mp4", width: 720, height: 1280, frames: 90 },
  "gym-magnesio": { src: "portfolio/brands/gimnasio-demo/magnesio.mp4", width: 1280, height: 720, frames: 75 },
  "gym-repeticion": { src: "portfolio/brands/gimnasio-demo/repeticion.mp4", width: 1280, height: 720, frames: 75 },
  "gym-atencion": { src: "portfolio/brands/gimnasio-demo/atencion.mp4", width: 1280, height: 720, frames: 75 },
  "gym-llegada": { src: "portfolio/brands/gimnasio-demo/llegada.mp4", width: 1280, height: 720, frames: 75 },
  "gym-noche": { src: "portfolio/brands/gimnasio-demo/noche.mp4", width: 1280, height: 720, frames: 90 },
  "lnb-cafe": { src: "portfolio/brands/lnb-saas/hero-loop.mp4", width: 1280, height: 720, frames: 120 },
  "fenix-corridor": { src: "portfolio/brands/fenix-medical-center/scenes/amb-00-umbral-apertura-v2--16x9.mp4", width: 1280, height: 720, frames: 150 },
  "fenix-chamber": { src: "portfolio/brands/fenix-medical-center/scenes/hdr-v1-tratamientos-camara-hiperbarica--16x9.mp4", width: 1280, height: 720, frames: 150 },
} as const satisfies Record<string, ClipSource>;

export type ClipId = keyof typeof CLIPS;

export const clipFrame = (id: ClipId, index: number) => {
  const clip = CLIPS[id];
  return `render-cache/clips/${id}/${String(Math.max(0, Math.min(clip.frames - 1, Math.round(index)))).padStart(4, "0")}.jpg`;
};
