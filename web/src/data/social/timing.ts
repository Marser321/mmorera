import { plain } from "./layout";
import { SOCIAL_FPS, type Diapositiva, type Salida, type Tono } from "./types";

/**
 * Ritmo de los reels: "lento con pulso". Cada pulso dura lo que tarda en
 * leerse (más un respiro) y corta al siguiente; el gancho y el remate se
 * sostienen un poco más. Puro: lo usan las composiciones, el render y el
 * validador (duraciones por plataforma).
 */

export const frames = (seconds: number) => Math.round(seconds * SOCIAL_FPS);

const wordCount = (text: string) => plain(text).split(/\s+/).filter(Boolean).length;

/** Segundos de lectura de una frase: 1,2 s + 0,3 s por palabra, entre 1,8 y 4,2 s. */
export function beatSeconds(text: string, extra = 0) {
  return Math.min(4.2, Math.max(1.8, 1.2 + 0.3 * wordCount(text))) + extra;
}

export const FIRMA_SECONDS = 3.4;
export const SLIDE_SECONDS = 3.6;
/** Duración de la animación de entrada de una diapositiva (el cuadro fijo es el último). */
export const SLIDE_STILL_FRAMES = frames(3.2);

export const invert = (tono: Tono): Tono => (tono === "oscuro" ? "claro" : "oscuro");

export type Beat = {
  id: string;
  rol: "gancho" | "pulso" | "remate" | "decision" | "firma";
  texto: string;
  kicker?: string;
  tono: Tono;
  /** Reel de caso: qué cuadro del film va en la placa. */
  placa?: "og" | "hero";
  from: number;
  duration: number;
};

function place(beats: Array<Omit<Beat, "from" | "duration"> & { seconds: number }>): Beat[] {
  let from = 0;
  return beats.map(({ seconds, ...beat }) => {
    const duration = frames(seconds);
    const placed = { ...beat, from, duration };
    from += duration;
    return placed;
  });
}

export function reelTextoBeats(salida: Extract<Salida, { plantilla: "reel-texto" }>): Beat[] {
  const tono = salida.tono ?? "oscuro";
  return place([
    { id: "gancho", rol: "gancho", texto: salida.gancho, tono, seconds: beatSeconds(salida.gancho, 0.6) },
    ...salida.pulsos.map((pulso, index) => ({ id: `pulso-${index + 1}`, rol: "pulso" as const, texto: pulso.texto, kicker: pulso.kicker, tono, seconds: beatSeconds(pulso.texto) })),
    // El remate invierte el color: es el signo de puntuación del reel.
    { id: "remate", rol: "remate", texto: salida.remate, tono: invert(tono), seconds: beatSeconds(salida.remate, 0.5) },
    { id: "firma", rol: "firma", texto: salida.cta, tono, seconds: FIRMA_SECONDS },
  ]);
}

export function reelCasoBeats(salida: Extract<Salida, { plantilla: "reel-caso" }>, nombre: string): Beat[] {
  return place([
    { id: "gancho", rol: "gancho", texto: salida.gancho, kicker: nombre, tono: "oscuro", seconds: beatSeconds(salida.gancho, 0.6) },
    ...salida.decisiones.map((decision, index) => ({
      id: `decision-${index + 1}`,
      rol: "decision" as const,
      texto: decision,
      kicker: `Decisión ${String(index + 1).padStart(2, "0")}`,
      tono: "oscuro" as const,
      placa: (index % 2 === 0 ? "hero" : "og") as "og" | "hero",
      // La placa también se mira: un segundo más que una frase sola.
      seconds: beatSeconds(decision, 1.2),
    })),
    { id: "remate", rol: "remate", texto: salida.cierre, tono: "claro", seconds: beatSeconds(salida.cierre, 0.5) },
    { id: "firma", rol: "firma", texto: "Mirá el film completo del caso", tono: "oscuro", seconds: FIRMA_SECONDS },
  ]);
}

export function carruselVideoFrames(diapositivas: Diapositiva[]) {
  return diapositivas.length * frames(SLIDE_SECONDS);
}

export const totalFrames = (beats: Beat[]) => beats.reduce((sum, beat) => sum + beat.duration, 0);

/** Desafío del mes → diapositivas de carrusel (documento de LinkedIn). */
export function desafioDiapositivas(salida: Extract<Salida, { plantilla: "desafio" }>): Diapositiva[] {
  return [
    { tipo: "portada", kicker: "Desafío del mes", titulo: salida.titulo, bajada: "Contexto, problema, decisión y lo que aprendí." },
    { tipo: "texto", kicker: "01 · Contexto", titulo: "El contexto", cuerpo: salida.contexto },
    { tipo: "texto", kicker: "02 · Problema", titulo: "El problema", cuerpo: salida.problema },
    { tipo: "texto", kicker: "03 · Decisión", titulo: "La decisión", cuerpo: salida.decision },
    { tipo: "texto", kicker: "04 · Resultado", titulo: "El resultado", cuerpo: salida.resultado },
    { tipo: "texto", kicker: "05 · Aprendizaje", titulo: "Lo que aprendí", cuerpo: salida.aprendizaje },
    { tipo: "cierre", titulo: "¿Te pasó algo parecido?", cta: "Contame en los comentarios cómo lo resolviste.", enlace: salida.enlace ?? "mmorera.agency" },
  ];
}

/** Diapositivas de una salida de carrusel (o de un desafío). */
export function diapositivasDe(salida: Salida): Diapositiva[] {
  if (salida.plantilla === "carrusel") return salida.diapositivas;
  if (salida.plantilla === "desafio") return desafioDiapositivas(salida);
  if (salida.plantilla === "imagen") return [salida.diapositiva];
  return [];
}

/** Duración en segundos de lo que se publica como video (0 si es solo imagen). */
export function videoSeconds(salida: Salida, nombreCaso = ""): number {
  if (salida.plantilla === "reel-texto") return totalFrames(reelTextoBeats(salida)) / SOCIAL_FPS;
  if (salida.plantilla === "reel-caso") return totalFrames(reelCasoBeats(salida, nombreCaso)) / SOCIAL_FPS;
  if (salida.plantilla === "carrusel" && salida.video) return carruselVideoFrames(salida.diapositivas) / SOCIAL_FPS;
  return 0;
}
