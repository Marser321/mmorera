import { diapositivasDe, reelCasoBeats, reelTextoBeats, SLIDE_STILL_FRAMES } from "./timing";
import type { Diapositiva, Formato, Pieza, Salida, Tono } from "./types";

/**
 * Qué archivo sale de cada salida de una pieza y con qué composición de
 * `remotion/socialRoot.tsx`. Puro: lo usan el render (scripts/render-social.ts)
 * y el validador (que exige esos archivos cuando la pieza está "lista").
 */

export type ImagenProp = { src: string; w: number; h: number };
export type ImagenesProp = Record<string, ImagenProp>;

export type SlideProps = { formato: Formato; slide: Diapositiva; pagina?: { n: number; total: number }; tono: Tono; imagenes: ImagenesProp };
export type CarruselVideoProps = { formato: Formato; diapositivas: Diapositiva[]; tono: Tono; imagenes: ImagenesProp };
export type ReelTextoProps = { salida: Extract<Salida, { plantilla: "reel-texto" }> };
export type ReelCasoProps = { salida: Extract<Salida, { plantilla: "reel-caso" }>; nombre: string; placas: { og: string; hero: string } };

export type Trabajo = {
  archivo: string;
  composicion: string;
  props: SlideProps | CarruselVideoProps | ReelTextoProps | ReelCasoProps;
  tipo: "still" | "video";
  frame?: number;
};

export const slideComposition = (formato: Formato) => `social-slide-${formato}`;
export const carruselComposition = (formato: Formato) => `social-carrusel-${formato}`;
export const REEL_TEXTO = "social-reel-texto";
export const REEL_CASO = "social-reel-caso";

export type Fuentes = {
  imagenes: ImagenesProp;
  /** Nombre visible del caso (reel de caso). */
  nombreCaso: (slug: string) => string;
  /** Cuadro `og` o `hero` del film del caso. */
  placa: (slug: string, kind: "og" | "hero") => string;
};

const two = (n: number) => String(n).padStart(2, "0");

function trabajosDeSalida(salida: Salida, fuentes: Fuentes): Trabajo[] {
  switch (salida.plantilla) {
    case "carrusel":
    case "desafio": {
      const slides = diapositivasDe(salida);
      const tono = salida.tono ?? "oscuro";
      const stills: Trabajo[] = slides.map((slide, index) => ({
        archivo: `${salida.id}-${two(index + 1)}.png`,
        composicion: slideComposition(salida.formato),
        props: { formato: salida.formato, slide, pagina: { n: index + 1, total: slides.length }, tono, imagenes: fuentes.imagenes },
        tipo: "still",
        frame: SLIDE_STILL_FRAMES,
      }));
      const video: Trabajo[] =
        salida.plantilla === "carrusel" && salida.video
          ? [{ archivo: `${salida.id}.mp4`, composicion: carruselComposition(salida.formato), props: { formato: salida.formato, diapositivas: slides, tono, imagenes: fuentes.imagenes }, tipo: "video" }]
          : [];
      return [...stills, ...video];
    }
    case "imagen":
      return [
        {
          archivo: `${salida.id}.png`,
          composicion: slideComposition(salida.formato),
          props: { formato: salida.formato, slide: salida.diapositiva, tono: salida.tono ?? "oscuro", imagenes: fuentes.imagenes },
          tipo: "still",
          frame: SLIDE_STILL_FRAMES,
        },
      ];
    case "reel-texto": {
      const gancho = reelTextoBeats(salida)[0];
      return [
        { archivo: `${salida.id}.mp4`, composicion: REEL_TEXTO, props: { salida }, tipo: "video" },
        // Portada del reel (Instagram y TikTok la piden): el gancho ya armado.
        { archivo: `${salida.id}-portada.png`, composicion: REEL_TEXTO, props: { salida }, tipo: "still", frame: gancho.duration - 12 },
      ];
    }
    case "reel-caso": {
      const nombre = fuentes.nombreCaso(salida.caso);
      const props: ReelCasoProps = { salida, nombre, placas: { og: fuentes.placa(salida.caso, "og"), hero: fuentes.placa(salida.caso, "hero") } };
      const gancho = reelCasoBeats(salida, nombre)[0];
      return [
        { archivo: `${salida.id}.mp4`, composicion: REEL_CASO, props, tipo: "video" },
        { archivo: `${salida.id}-portada.png`, composicion: REEL_CASO, props, tipo: "still", frame: gancho.duration - 12 },
      ];
    }
  }
}

export function trabajosDe(pieza: Pieza, fuentes: Fuentes): Trabajo[] {
  return pieza.salidas.flatMap((salida) => trabajosDeSalida(salida, fuentes));
}

/** ¿Esta salida la diseña ChatGPT (con el código de respaldo)? */
export function usaChatGPT(salida: Salida) {
  return (salida.plantilla === "carrusel" || salida.plantilla === "desafio" || salida.plantilla === "imagen") && salida.generador !== "codigo";
}

/** Imágenes que entrega ChatGPT para una salida: imagenes/gpt-<salida>-01.png, -02.png… */
export function archivosChatGPT(salida: Salida): string[] {
  if (!usaChatGPT(salida)) return [];
  const total = diapositivasDe(salida).length;
  return Array.from({ length: total }, (_, index) => `gpt-${salida.id}-${two(index + 1)}.png`);
}

/** Archivos que deja el render de una pieza (para exigirlos cuando está "lista"). */
export function archivosEsperados(pieza: Pieza): string[] {
  const vacio: Fuentes = { imagenes: {}, nombreCaso: () => "", placa: () => "" };
  return trabajosDe(pieza, vacio).map((trabajo) => trabajo.archivo);
}
